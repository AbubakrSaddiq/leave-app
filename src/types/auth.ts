export type UserRole = 'admin' | 'hr' | 'director' | 'staff';

export interface Department {
  id: string;
  code: string;
  name: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  role: UserRole;
  department_id?: string;
  department?: Department;
  email?: string;
}