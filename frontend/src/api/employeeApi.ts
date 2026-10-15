import axios from 'axios';
import { ApiResponse, DashboardStats, Department, Employee, EmployeeFormData, FilterParams, PageResponse } from '../types/employee';

const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const employeeApi = {
  // Get all employees with search, department/status filter, and pagination
  getEmployees: async (params: Partial<FilterParams>): Promise<PageResponse<Employee>> => {
    const queryParams: Record<string, any> = {};
    if (params.search && params.search.trim()) queryParams.search = params.search.trim();
    if (params.department && params.department !== 'ALL') queryParams.department = params.department;
    if (params.status && params.status !== 'ALL') queryParams.status = params.status;
    queryParams.page = params.page ?? 0;
    queryParams.size = params.size ?? 10;
    queryParams.sortBy = params.sortBy ?? 'id';
    queryParams.sortDir = params.sortDir ?? 'desc';

    const response = await apiClient.get<ApiResponse<PageResponse<Employee>>>('/employees', {
      params: queryParams,
    });
    return response.data.data;
  },

  // Get single employee by ID
  getEmployeeById: async (id: number): Promise<Employee> => {
    const response = await apiClient.get<ApiResponse<Employee>>(`/employees/${id}`);
    return response.data.data;
  },

  // Add new employee
  createEmployee: async (data: EmployeeFormData): Promise<Employee> => {
    const payload = {
      ...data,
      salary: Number(data.salary),
    };
    const response = await apiClient.post<ApiResponse<Employee>>('/employees', payload);
    return response.data.data;
  },

  // Update existing employee
  updateEmployee: async (id: number, data: EmployeeFormData): Promise<Employee> => {
    const payload = {
      ...data,
      salary: Number(data.salary),
    };
    const response = await apiClient.put<ApiResponse<Employee>>(`/employees/${id}`, payload);
    return response.data.data;
  },

  // Delete employee
  deleteEmployee: async (id: number): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/employees/${id}`);
  },

  // Get summary dashboard metrics
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<ApiResponse<DashboardStats>>('/employees/stats');
    return response.data.data;
  },

  // Export CSV
  exportCsv: async (): Promise<void> => {
    const response = await apiClient.get('/employees/export/csv', {
      responseType: 'blob',
    });
    const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `employees_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  // Department APIs
  getDepartments: async (): Promise<Department[]> => {
    const response = await apiClient.get<ApiResponse<Department[]>>('/departments');
    return response.data.data;
  },

  createDepartment: async (dept: { name: string; description?: string }): Promise<Department> => {
    const response = await apiClient.post<ApiResponse<Department>>('/departments', dept);
    return response.data.data;
  },

  deleteDepartment: async (id: number): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/departments/${id}`);
  },

  // Bonus: Admin login
  login: async (credentials: { username: string; password: string }) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },
};
