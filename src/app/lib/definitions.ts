import { z } from 'zod';

export const EmployeeSchema = z.object({
  id: z.string().optional(),
  employee_id: z.string().min(1, "Employee ID is required"),
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email format"),
  department: z.string().min(1, "Department is required"),
  created_at: z.string().optional(),
});

export type Employee = z.infer<typeof EmployeeSchema>;

export const AttendanceStatusSchema = z.enum(["Present", "Absent"]);
export type AttendanceStatus = z.infer<typeof AttendanceStatusSchema>;

export const AttendanceSchema = z.object({
  id: z.string().optional(),
  employee_id: z.string(),
  date: z.string(), // Server will enforce this format: YYYY-MM-DD
  status: AttendanceStatusSchema,
  created_at: z.string().optional(),
});

export type Attendance = z.infer<typeof AttendanceSchema>;

export const MarkAttendanceInputSchema = z.object({
  employee_id: z.string(),
  status: AttendanceStatusSchema,
});

export type MarkAttendanceInput = z.infer<typeof MarkAttendanceInputSchema>;
