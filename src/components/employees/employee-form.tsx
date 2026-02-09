'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, setDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';

export function EmployeeForm() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const db = useFirestore();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const employee_id = formData.get('employee_id') as string;
    
    const data = {
      employee_id,
      full_name: formData.get('full_name') as string,
      email: formData.get('email') as string,
      department: formData.get('department') as string,
      created_at: new Date().toISOString(),
    };

    try {
      const docRef = doc(db, 'employees', employee_id);
      setDocumentNonBlocking(docRef, data, { merge: true });
      
      toast({ title: "Success", description: "Employee added successfully." });
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="employee_id" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Employee ID</Label>
          <Input id="employee_id" name="employee_id" placeholder="e.g. E001" className="bg-background h-10" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="full_name" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Full name</Label>
          <Input id="full_name" name="full_name" placeholder="Full name" className="bg-background h-10" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</Label>
          <Input id="email" name="email" type="email" placeholder="email@company.com" className="bg-background h-10" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="department" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Department</Label>
          <Input id="department" name="department" placeholder="e.g. Engineering" className="bg-background h-10" required />
        </div>
      </div>
      <Button type="submit" className="px-8 font-semibold shadow-sm" disabled={loading}>
        {loading ? "Adding..." : "Add employee"}
      </Button>
    </form>
  );
}
