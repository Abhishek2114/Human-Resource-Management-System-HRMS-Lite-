'use client';

import { AttendanceDashboard } from '@/components/attendance/attendance-dashboard';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';

export default function AttendancePage() {
  const db = useFirestore();
  
  const employeesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'employees'), orderBy('employee_id', 'asc'));
  }, [db]);

  const { data: employees } = useCollection(employeesQuery);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary font-headline">Attendance Control</h1>
        <p className="text-muted-foreground mt-1">Mark and monitor daily staff presence.</p>
      </div>

      <AttendanceDashboard employees={employees || []} />
    </div>
  );
}
