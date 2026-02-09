'use client';

import { useState } from 'react';
import { markAttendanceAction, getAttendanceAction } from '@/app/lib/actions';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Employee, Attendance } from '@/app/lib/definitions';
import { format } from 'date-fns';

export function AttendanceForm({ employees }: { employees: Employee[] }) {
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [status, setStatus] = useState<"Present" | "Absent">("Present");
  const { toast } = useToast();

  const today = format(new Date(), 'yyyy-MM-dd');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedId) return;

    setLoading(true);
    try {
      const result = await markAttendanceAction({
        employee_id: selectedId,
        date: today,
        status: status,
      });

      if (result.success) {
        toast({ title: "Marked", description: `Marked ${status} for ${today}` });
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label>Date</Label>
        <div className="p-3 bg-muted rounded-md text-sm font-mono border border-input">
          {today} (Today)
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="employee">Select Employee</Label>
        <Select onValueChange={setSelectedId}>
          <SelectTrigger id="employee">
            <SelectValue placeholder="Choose an employee..." />
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
        <Label>Status</Label>
        <RadioGroup value={status} onValueChange={(v: any) => setStatus(v)} className="flex gap-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Present" id="present" />
            <Label htmlFor="present" className="cursor-pointer">Present</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Absent" id="absent" />
            <Label htmlFor="absent" className="cursor-pointer">Absent</Label>
          </div>
        </RadioGroup>
      </div>

      <Button type="submit" className="w-full" disabled={loading || !selectedId}>
        {loading ? "Saving..." : "Mark Attendance"}
      </Button>
    </form>
  );
}