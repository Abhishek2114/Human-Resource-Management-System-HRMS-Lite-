'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Employee, AttendanceStatus } from '@/app/lib/definitions';
import { format, parseISO } from 'date-fns';
import { Calendar as CalendarIcon, UserCheck, CheckCircle2, XCircle, Users, Lock, Loader2, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useFirestore, useCollection, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

export function AttendanceDashboard({ employees }: { employees: Employee[] }) {
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [status, setStatus] = useState<AttendanceStatus>("Present");
  const [todayStr, setTodayStr] = useState<string>("");
  const [filterDate, setFilterDate] = useState<Date>(new Date());
  const { toast } = useToast();
  const db = useFirestore();

  useEffect(() => {
    setTodayStr(format(new Date(), 'yyyy-MM-dd'));
  }, []);

  const filterDateStr = useMemo(() => format(filterDate, 'yyyy-MM-dd'), [filterDate]);

  // Query records for the selected date
  const dailyQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(
      collection(db, 'attendance'),
      where('date', '==', filterDateStr)
    );
  }, [db, filterDateStr]);

  const { data: rawRecords, isLoading: recordsLoading } = useCollection(dailyQuery);

  const selectedEmployee = useMemo(() => 
    employees.find(e => e.employee_id === selectedId),
    [employees, selectedId]
  );

  const enrichedRecords = useMemo(() => {
    if (!rawRecords) return [];
    return rawRecords.map(record => {
      const emp = employees.find(e => e.employee_id === record.employee_id);
      return {
        ...record,
        full_name: emp?.full_name || "Unknown Employee",
        employee_id: record.employee_id
      };
    });
  }, [rawRecords, employees]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedId || !db || !todayStr) return;

    setLoading(true);
    try {
      // Record ID is composite: empId_date to prevent duplicates for same day
      const recordId = `${selectedId}_${todayStr}`;
      const docRef = doc(db, 'attendance', recordId);

      setDocumentNonBlocking(docRef, {
        employee_id: selectedId,
        status: status,
        date: todayStr,
        created_at: new Date().toISOString(),
      }, { merge: true });

      toast({ 
        title: "Attendance Logged", 
        description: `Marked ${status} for ${selectedEmployee?.full_name} on ${todayStr}` 
      });
      setSelectedId(""); // Reset selection
    } catch (err) {
      toast({ title: "Error", description: "Failed to record attendance.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-12">
        {/* Mark Attendance Form */}
        <div className="md:col-span-4">
          <Card className="border shadow-lg card-accent-left overflow-hidden bg-white/50 backdrop-blur-sm">
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle className="text-lg flex items-center gap-2 text-primary">
                <UserCheck className="h-5 w-5" />
                Mark Attendance
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">System Date</Label>
                    <Lock className="h-3 w-3 text-muted-foreground/40" />
                  </div>
                  <div className="p-3 bg-muted/30 rounded-xl text-sm font-mono border border-input/50 text-primary font-bold">
                    {todayStr || '...'}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employee" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Select Personnel</Label>
                  <Select value={selectedId} onValueChange={setSelectedId}>
                    <SelectTrigger id="employee" className="bg-white rounded-xl h-11 border-primary/10">
                      <SelectValue placeholder="Search or select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map(emp => (
                        <SelectItem key={emp.employee_id} value={emp.employee_id}>
                          {emp.full_name} ({emp.employee_id})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</Label>
                  <RadioGroup value={status} onValueChange={(v: any) => setStatus(v)} className="flex gap-6 p-1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Present" id="present" className="border-primary" />
                      <Label htmlFor="present" className="cursor-pointer font-medium text-sm">Present</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Absent" id="absent" className="border-primary" />
                      <Label htmlFor="absent" className="cursor-pointer font-medium text-sm">Absent</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button type="submit" className="w-full h-11 rounded-xl font-bold shadow-md hover:shadow-lg transition-all" disabled={loading || !selectedId}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {loading ? "Recording..." : "Log Attendance"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Daily Attendance List */}
        <div className="md:col-span-8">
          <Card className="border shadow-lg bg-white/50 backdrop-blur-sm h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4 bg-primary/5">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg text-primary">Daily Logs</CardTitle>
              </div>
              
              <div className="flex items-center gap-2">
                <Label className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Filter Date:</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "h-9 px-3 rounded-lg border-primary/10 font-bold text-xs bg-white",
                        !filterDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                      {filterDateStr === todayStr ? "Today" : filterDateStr}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={filterDate}
                      onSelect={(d) => d && setFilterDate(d)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </CardHeader>
            <CardContent className="pt-6 flex-1">
              {recordsLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                  <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary/20" />
                  <p className="font-medium animate-pulse">Syncing records...</p>
                </div>
              ) : enrichedRecords.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-primary/5 rounded-2xl bg-primary/5">
                  <CalendarIcon className="h-12 w-12 text-primary/10 mb-4" />
                  <h3 className="text-lg font-bold text-primary/40">No records found</h3>
                  <p className="text-sm text-muted-foreground max-w-[250px] mx-auto mt-1">
                    {filterDateStr === todayStr 
                      ? "Attendance hasn't been marked for anyone today yet."
                      : `No logs available for ${filterDateStr}.`}
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border border-primary/5 overflow-hidden shadow-inner bg-white">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow className="hover:bg-transparent border-none">
                        <TableHead className="text-[10px] font-black uppercase tracking-widest py-4">Name</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest py-4">ID</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest py-4">Status</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest py-4 text-right">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {enrichedRecords.map((record) => (
                        <TableRow key={record.id} className="hover:bg-primary/[0.02] transition-colors border-primary/5">
                          <TableCell className="font-bold py-4">
                            {record.full_name}
                          </TableCell>
                          <TableCell className="font-mono text-xs text-muted-foreground">
                            {record.employee_id}
                          </TableCell>
                          <TableCell>
                            {record.status === "Present" ? (
                              <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 shadow-none font-bold gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                Present
                              </Badge>
                            ) : (
                              <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100 shadow-none font-bold gap-1">
                                <XCircle className="h-3 w-3" />
                                Absent
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right text-xs font-mono font-bold text-muted-foreground">
                            {record.date}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
