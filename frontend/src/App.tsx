import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { StatsCards } from './components/StatsCards';
import { EmployeeList } from './components/EmployeeList';
import { EmployeeFormModal } from './components/EmployeeFormModal';
import { EmployeeDetailsModal } from './components/EmployeeDetailsModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { DepartmentManagementModal } from './components/DepartmentManagementModal';
import { LoginModal } from './components/LoginModal';
import { Toast, ToastMessage } from './components/Toast';
import { employeeApi } from './api/employeeApi';
import {
  Department,
  Employee,
  EmployeeFormData,
  FilterParams,
  PageResponse,
  DashboardStats,
} from './types/employee';

export const App: React.FC = () => {
  // State
  const [pageResponse, setPageResponse] = useState<PageResponse<Employee> | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('ems_auth_token');
  });
  const [adminUsername, setAdminUsername] = useState<string | null>(() => {
    return localStorage.getItem('ems_auth_user') || 'Admin';
  });

  // Filter & Pagination State
  const [filters, setFilters] = useState<FilterParams>({
    search: '',
    department: 'ALL',
    status: 'ALL',
    page: 0,
    size: 10,
    sortBy: 'id',
    sortDir: 'desc',
  });

  // Modals State
  const [activeModal, setActiveModal] = useState<
    'none' | 'add' | 'edit' | 'view' | 'delete' | 'departments' | 'login'
  >('none');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Toast System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load Employees
  const fetchEmployees = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await employeeApi.getEmployees(filters);
      setPageResponse(data);
    } catch (err: any) {
      console.error('Failed to fetch employees', err);
      showToast('Could not load employees. Make sure backend is running.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // Load Departments
  const fetchDepartments = async () => {
    try {
      const data = await employeeApi.getDepartments();
      setDepartments(data);
    } catch (err) {
      console.error('Failed to fetch departments', err);
    }
  };

  // Load Stats
  const fetchStats = async () => {
    try {
      const data = await employeeApi.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  };

  // Initial Data Fetch
  useEffect(() => {
    fetchDepartments();
    fetchStats();
  }, []);

  // Fetch employees when filters change (with debounce on search)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEmployees();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchEmployees]);

  // Handlers
  const handleFilterChange = (newFilters: Partial<FilterParams>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  const handleStatusCardClick = (status: string) => {
    setFilters((prev) => ({
      ...prev,
      status,
      page: 0,
    }));
  };

  // Add Employee
  const handleCreateEmployee = async (formData: EmployeeFormData) => {
    setIsActionLoading(true);
    try {
      await employeeApi.createEmployee(formData);
      showToast(`Employee "${formData.fullName}" added successfully!`);
      setActiveModal('none');
      fetchEmployees();
      fetchStats();
      fetchDepartments();
    } catch (err: any) {
      console.error(err);
      throw err;
    } finally {
      setIsActionLoading(false);
    }
  };

  // Update Employee
  const handleUpdateEmployee = async (formData: EmployeeFormData) => {
    if (!selectedEmployee) return;
    setIsActionLoading(true);
    try {
      await employeeApi.updateEmployee(selectedEmployee.id, formData);
      showToast(`Employee "${formData.fullName}" updated successfully!`);
      setActiveModal('none');
      setSelectedEmployee(null);
      fetchEmployees();
      fetchStats();
      fetchDepartments();
    } catch (err: any) {
      console.error(err);
      throw err;
    } finally {
      setIsActionLoading(false);
    }
  };

  // Delete Employee
  const handleDeleteEmployee = async () => {
    if (!selectedEmployee) return;
    setIsActionLoading(true);
    try {
      await employeeApi.deleteEmployee(selectedEmployee.id);
      showToast(`Employee "${selectedEmployee.fullName}" deleted successfully.`);
      setActiveModal('none');
      setSelectedEmployee(null);
      fetchEmployees();
      fetchStats();
      fetchDepartments();
    } catch (err: any) {
      console.error(err);
      showToast('Failed to delete employee.', 'error');
    } finally {
      setIsActionLoading(false);
    }
  };

  // Export CSV
  const handleExportCsv = async () => {
    try {
      await employeeApi.exportCsv();
      showToast('Employee CSV exported successfully!');
    } catch (err) {
      showToast('Failed to export employee CSV.', 'error');
    }
  };

  // Create Department
  const handleCreateDepartment = async (dept: { name: string; description?: string }) => {
    await employeeApi.createDepartment(dept);
    showToast(`Department "${dept.name}" created!`);
    fetchDepartments();
    fetchStats();
  };

  // Delete Department
  const handleDeleteDepartment = async (id: number) => {
    try {
      await employeeApi.deleteDepartment(id);
      showToast('Department removed.');
      fetchDepartments();
      fetchStats();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Cannot delete department.', 'error');
    }
  };

  // Login / Logout
  const handleLogin = async (credentials: { username: string; password: string }) => {
    const res = await employeeApi.login(credentials);
    if (res.data?.token) {
      localStorage.setItem('ems_auth_token', res.data.token);
      localStorage.setItem('ems_auth_user', res.data.username);
      setIsAuthenticated(true);
      setAdminUsername(res.data.username);
      showToast(`Welcome back, ${res.data.username}!`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ems_auth_token');
    localStorage.removeItem('ems_auth_user');
    setIsAuthenticated(false);
    setAdminUsername(null);
    showToast('Logged out successfully.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Navigation */}
      <Navbar
        onOpenDepartments={() => setActiveModal('departments')}
        onExportCsv={handleExportCsv}
        onOpenLogin={() => setActiveModal('login')}
        onLogout={handleLogout}
        isAuthenticated={isAuthenticated}
        adminUsername={adminUsername}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title & Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Employee Directory
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage organization members, departments, designations, and employee lifecycle records.
          </p>
        </div>

        {/* Dashboard Metric Summary Cards */}
        <StatsCards
          stats={stats}
          onFilterStatus={handleStatusCardClick}
          activeStatusFilter={filters.status}
        />

        {/* Employee Management Table & Search/Filter Section */}
        <EmployeeList
          pageResponse={pageResponse}
          filters={filters}
          departments={departments}
          isLoading={isLoading}
          onFilterChange={handleFilterChange}
          onViewEmployee={(emp) => {
            setSelectedEmployee(emp);
            setActiveModal('view');
          }}
          onEditEmployee={(emp) => {
            setSelectedEmployee(emp);
            setActiveModal('edit');
          }}
          onDeleteEmployee={(emp) => {
            setSelectedEmployee(emp);
            setActiveModal('delete');
          }}
          onAddEmployee={() => {
            setSelectedEmployee(null);
            setActiveModal('add');
          }}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <p>Kloudspot Technical Assessment &bull; Employee Management System</p>
        <p className="mt-1 text-slate-400">Spring Boot REST API &bull; React + Tailwind Frontend &bull; Java 17</p>
      </footer>

      {/* Modals */}
      <EmployeeFormModal
        isOpen={activeModal === 'add' || activeModal === 'edit'}
        onClose={() => {
          setActiveModal('none');
          setSelectedEmployee(null);
        }}
        onSubmit={activeModal === 'edit' ? handleUpdateEmployee : handleCreateEmployee}
        initialEmployee={activeModal === 'edit' ? selectedEmployee : null}
        departments={departments}
        isLoading={isActionLoading}
      />

      <EmployeeDetailsModal
        isOpen={activeModal === 'view'}
        employee={selectedEmployee}
        onClose={() => {
          setActiveModal('none');
          setSelectedEmployee(null);
        }}
        onEdit={(emp) => {
          setSelectedEmployee(emp);
          setActiveModal('edit');
        }}
      />

      <DeleteConfirmModal
        isOpen={activeModal === 'delete'}
        employee={selectedEmployee}
        onClose={() => {
          setActiveModal('none');
          setSelectedEmployee(null);
        }}
        onConfirm={handleDeleteEmployee}
        isLoading={isActionLoading}
      />

      <DepartmentManagementModal
        isOpen={activeModal === 'departments'}
        onClose={() => setActiveModal('none')}
        departments={departments}
        onCreateDepartment={handleCreateDepartment}
        onDeleteDepartment={handleDeleteDepartment}
      />

      <LoginModal
        isOpen={activeModal === 'login'}
        onClose={() => setActiveModal('none')}
        onLogin={handleLogin}
      />

      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export default App;
