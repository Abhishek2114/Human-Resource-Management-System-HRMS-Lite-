'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmployeeForm } from '@/components/employees/employee-form';
import { EmployeeDirectory } from '@/components/employees/employee-directory';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';

export default function EmployeesPage() {
  const db = useFirestore();
  
  const employeesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'employees'), orderBy('employee_id', 'asc'));
  }, [db]);

  const { data: employees, isLoading } = useCollection(employeesQuery);

  return (
    <div className="space-y-10">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-headline">Employee directory</h1>
        <p className="text-muted-foreground">Add and manage employees. Search and filter below.</p>
      </div>

      <Card className="border shadow-sm card-accent-left">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Add employee</CardTitle>
        </CardHeader>
        <CardContent>
          <EmployeeForm />
        </CardContent>
      </Card>

      <Card className="border shadow-sm card-accent-left">
        <CardHeader>
          <CardTitle className="text-lg font-bold">All employees</CardTitle>
        </CardHeader>
        <CardContent>
          <EmployeeDirectory employees={employees || []} />
        </CardContent>
      </Card>
    </div>
  );
}
