export type EmploymentStatus = 'ACTIVE' | 'INACTIVE';

export interface Employee {
  id: number;
  employeeId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  department: string;
  designation: string;
  dateOfJoining: string;
  salary: number;
  employmentStatus: EmploymentStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface EmployeeFormData {
  employeeId?: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  department: string;
  designation: string;
  dateOfJoining: string;
  salary: number | string;
  employmentStatus: EmploymentStatus;
}

export interface Department {
  id: number;
  name: string;
  description?: string;
  employeeCount?: number;
}

export interface PageResponse<T> {
  content: T[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  totalDepartments: number;
}

export interface FilterParams {
  search: string;
  department: string;
  status: string;
  page: number;
  size: number;
  sortBy: string;
  sortDir: 'asc' | 'desc';
}
