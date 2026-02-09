import { Employee, Attendance } from './definitions';

// Simulated database
class HRMSStore {
  private static instance: HRMSStore;
  private employees: Employee[] = [];
  private attendance: Attendance[] = [];

  private constructor() {
    // Seed data
    this.employees = [
      { id: '1', employee_id: 'EMP001', full_name: 'John Doe', email: 'john@example.com', department: 'IT', created_at: new Date().toISOString() },
      { id: '2', employee_id: 'EMP002', full_name: 'Jane Smith', email: 'jane@example.com', department: 'HR', created_at: new Date().toISOString() },
    ];
  }

  public static getInstance(): HRMSStore {
    if (!HRMSStore.instance) {
      HRMSStore.instance = new HRMSStore();
    }
    return HRMSStore.instance;
  }

  // Employee methods
  getEmployees(): Employee[] {
    return [...this.employees];
  }

  addEmployee(employee: Employee): Employee {
    if (this.employees.some(e => e.employee_id === employee.employee_id)) {
      throw new Error("Duplicate employee_id");
    }
    const newEmployee = { ...employee, id: Math.random().toString(36).substr(2, 9), created_at: new Date().toISOString() };
    this.employees.push(newEmployee);
    return newEmployee;
  }

  deleteEmployee(employee_id: string): void {
    this.employees = this.employees.filter(e => e.employee_id !== employee_id);
    this.attendance = this.attendance.filter(a => a.employee_id !== employee_id);
  }

  // Attendance methods
  getAttendance(employee_id: string): Attendance[] {
    return this.attendance.filter(a => a.employee_id === employee_id);
  }

  markAttendance(record: Attendance): Attendance {
    const employee = this.employees.find(e => e.employee_id === record.employee_id);
    if (!employee) throw new Error("Employee not found");

    // Prevent duplicate attendance for same employee on same date
    this.attendance = this.attendance.filter(
      a => !(a.employee_id === record.employee_id && a.date === record.date)
    );

    const newRecord = { ...record, id: Math.random().toString(36).substr(2, 9), created_at: new Date().toISOString() };
    this.attendance.push(newRecord);
    return newRecord;
  }
}

export const store = HRMSStore.getInstance();