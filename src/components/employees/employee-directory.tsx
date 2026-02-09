'use client';

import { useState, useMemo } from 'react';
import { Employee } from '@/app/lib/definitions';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DeleteEmployeeButton } from './delete-button';
import { Search, Users as UsersIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface EmployeeDirectoryProps {
  employees: Employee[];
}

export function EmployeeDirectory({ employees }: EmployeeDirectoryProps) {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");

  const departments = useMemo(() => {
    const deps = new Set(employees.map(e => e.department));
    return ["all", ...Array.from(deps)];
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch = 
        emp.full_name.toLowerCase().includes(search.toLowerCase()) ||
        emp.employee_id.toLowerCase().includes(search.toLowerCase()) ||
        emp.email.toLowerCase().includes(search.toLowerCase()) ||
        emp.department.toLowerCase().includes(search.toLowerCase());
      
      const matchesDept = department === "all" || emp.department === department;
      
      return matchesSearch && matchesDept;
    });
  }, [employees, search, department]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name, ID, email, department..." 
              className="pl-10 bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full md:w-[200px] space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Department</Label>
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="All departments" />
            </SelectTrigger>
            <SelectContent>
              {departments.map(dep => (
                <SelectItem key={dep} value={dep}>
                  {dep === "all" ? "All departments" : dep}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-primary/5">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[120px] text-xs font-bold uppercase tracking-wider text-primary">ID</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-primary">Name</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-primary">Email</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-primary">Department</TableHead>
              <TableHead className="text-right text-xs font-bold uppercase tracking-wider text-primary">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <UsersIcon className="h-12 w-12 opacity-20 mb-4" />
                    <p>No employees found.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredEmployees.map((employee) => (
                <TableRow key={employee.id} className="hover:bg-accent/5 transition-colors">
                  <TableCell className="font-mono text-primary font-medium">
                    {employee.employee_id}
                  </TableCell>
                  <TableCell className="font-medium">{employee.full_name}</TableCell>
                  <TableCell className="text-muted-foreground">{employee.email}</TableCell>
                  <TableCell>
                    <span className="text-muted-foreground">
                      {employee.department}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DeleteEmployeeButton employee_id={employee.employee_id} label="Delete" />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}