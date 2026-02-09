
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building2, Activity, Database, CheckCircle2 } from 'lucide-react';
import { useFirestore, useCollection, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const db = useFirestore();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const employeesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'employees'), orderBy('employee_id', 'asc'));
  }, [db]);

  const { data: employees, isLoading } = useCollection(employeesQuery);

  const stats = {
    totalEmployees: employees?.length || 0,
    departments: new Set(employees?.map(e => e.department)).size,
  };

  const seedMockData = () => {
    if (!db) return;
    
    const mockEmployees = [
      { id: 'E001', name: 'Alice Johnson', dept: 'Engineering', email: 'alice.j@company.com' },
      { id: 'E002', name: 'Robert Smith', dept: 'Design', email: 'rob.s@company.com' },
      { id: 'E003', name: 'Clara Oswald', dept: 'Product', email: 'clara.o@company.com' },
      { id: 'E004', name: 'David Tennant', dept: 'HR', email: 'david.t@company.com' },
      { id: 'E005', name: 'Rose Tyler', dept: 'Operations', email: 'rose.t@company.com' },
    ];

    const today = format(new Date(), 'yyyy-MM-dd');

    mockEmployees.forEach((emp) => {
      const empRef = doc(db, 'employees', emp.id);
      setDocumentNonBlocking(empRef, {
        employee_id: emp.id,
        full_name: emp.name,
        email: emp.email,
        department: emp.dept,
        created_at: new Date().toISOString(),
      }, { merge: true });

      const attendanceId = `${emp.id}_${today}`;
      const attRef = doc(db, 'attendance', attendanceId);
      setDocumentNonBlocking(attRef, {
        employee_id: emp.id,
        status: Math.random() > 0.1 ? 'Present' : 'Absent',
        date: today,
        created_at: new Date().toISOString(),
      }, { merge: true });
    });

    toast({
      title: "Database Seeded",
      description: "Successfully added 5 employees and today's attendance logs.",
    });
  };

  if (!isClient) {
    return (
      <div className="space-y-8 p-6">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-12 w-1/3" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-primary font-headline">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-lg">System-wide overview and real-time operations monitor.</p>
        </div>
        <Button 
          variant="outline" 
          onClick={seedMockData}
          className="w-fit flex items-center gap-2 border-primary/20 hover:bg-primary/5 text-primary rounded-xl font-bold"
        >
          <Database className="h-4 w-4" />
          Seed Sample Data
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-none shadow-lg bg-primary text-primary-foreground relative overflow-hidden group rounded-[2rem]">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider opacity-80">Total Strength</CardTitle>
            <Users className="h-5 w-5 opacity-70" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-10 w-20 bg-white/20" />
            ) : (
              <div className="text-4xl font-black">{stats.totalEmployees}</div>
            )}
            <p className="text-xs opacity-70 mt-2 font-medium">Active registered personnel</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-accent text-accent-foreground relative overflow-hidden group rounded-[2rem]">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider opacity-80">Departments</CardTitle>
            <Building2 className="h-5 w-5 opacity-70" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-10 w-20 bg-black/5" />
            ) : (
              <div className="text-4xl font-black">{stats.departments}</div>
            )}
            <p className="text-xs opacity-70 mt-2 font-medium">Core functional business units</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-white dark:bg-card relative overflow-hidden group rounded-[2rem]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">System Status</CardTitle>
            <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-primary">Live</div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">Cloud sync active & synchronized</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-12 mt-8">
        <div className="md:col-span-8">
          <Card className="border-none shadow-xl bg-white/50 backdrop-blur-sm card-accent-left h-full rounded-[2rem]">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-3">
                <Activity className="h-6 w-6 text-primary" />
                Live Personnel Feed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-xl" />
                  ))
                ) : stats.totalEmployees > 0 ? (
                  <div className="flex flex-col gap-4">
                    {employees?.slice(0, 5).map((emp) => (
                      <div key={emp.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-primary/5 hover:border-primary/20 transition-all cursor-default">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {emp.full_name[0]}
                          </div>
                          <div>
                            <p className="font-bold text-sm">{emp.full_name}</p>
                            <p className="text-xs text-muted-foreground font-mono">{emp.employee_id}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Registered
                          </span>
                        </div>
                      </div>
                    ))}
                    {stats.totalEmployees > 5 && (
                      <p className="text-center text-xs text-muted-foreground font-medium pt-2 italic">
                        + {stats.totalEmployees - 5} more employees in directory
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground py-16 text-center border-2 border-dashed border-primary/10 rounded-3xl bg-white/30">
                    <p className="font-semibold text-primary/40 mb-2">No active records found</p>
                    <p className="max-w-xs mx-auto text-xs opacity-60">
                      Use the "Seed Sample Data" button above to populate the system.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-4">
          <Card className="border-none shadow-xl bg-primary text-primary-foreground h-full relative overflow-hidden rounded-[2rem]">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
             <CardHeader>
               <CardTitle className="text-xl font-bold">System Insights</CardTitle>
             </CardHeader>
             <CardContent className="space-y-6 relative z-10">
               <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
                 <p className="text-xs font-bold uppercase opacity-60 mb-1">Status</p>
                 <p className="text-lg font-bold">Authenticated</p>
                 <p className="text-xs opacity-80 mt-1 leading-relaxed">Your session is secure via anonymous authentication.</p>
               </div>
               
               <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
                 <p className="text-xs font-bold uppercase opacity-60 mb-1">Compliance</p>
                 <p className="text-lg font-bold">System Date Enforcement</p>
                 <p className="text-xs opacity-80 mt-1 leading-relaxed">Attendance dates are immutable to ensure record integrity.</p>
               </div>

               <div className="pt-4">
                  <div className="flex items-center justify-between text-xs font-bold uppercase mb-2">
                    <span>Sync Health</span>
                    <span>100%</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-full bg-white/40" />
                  </div>
               </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
