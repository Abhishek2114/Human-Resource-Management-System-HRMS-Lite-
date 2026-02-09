'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, deleteDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function DeleteEmployeeButton({ employee_id, label }: { employee_id: string, label?: string }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const db = useFirestore();

  async function handleDelete() {
    setLoading(true);
    try {
      const docRef = doc(db, 'employees', employee_id);
      deleteDocumentNonBlocking(docRef);
      toast({ title: "Deleted", description: "Employee record removed." });
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete employee.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {label ? (
          <Button variant="link" className="text-muted-foreground hover:text-destructive h-auto p-0 font-medium transition-colors">
            {label}
          </Button>
        ) : (
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive transition-colors">
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the employee record.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
