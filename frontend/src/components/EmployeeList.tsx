import React from 'react';
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Building2,
  Calendar,
  IndianRupee,
  Phone,
  Mail,
  UserCheck,
  UserX,
  RotateCcw,
} from 'lucide-react';
import { Department, Employee, EmploymentStatus, FilterParams, PageResponse } from '../types/employee';

interface EmployeeListProps {
  pageResponse: PageResponse<Employee> | null;
  filters: FilterParams;
  departments: Department[];
  isLoading: boolean;
  onFilterChange: (filters: Partial<FilterParams>) => void;
  onViewEmployee: (employee: Employee) => void;
  onEditEmployee: (employee: Employee) => void;
  onDeleteEmployee: (employee: Employee) => void;
  onAddEmployee: () => void;
}

export const EmployeeList: React.FC<EmployeeListProps> = ({
  pageResponse,
  filters,
  departments,
  isLoading,
  onFilterChange,
  onViewEmployee,
  onEditEmployee,
  onDeleteEmployee,
  onAddEmployee,
}) => {
  const employees = pageResponse?.content || [];
  const totalElements = pageResponse?.totalElements || 0;
  const totalPages = pageResponse?.totalPages || 0;
  const currentPage = pageResponse?.pageNo || 0;
  const pageSize = pageResponse?.pageSize || 10;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const startRecord = totalElements === 0 ? 0 : currentPage * pageSize + 1;
  const endRecord = Math.min((currentPage + 1) * pageSize, totalElements);

  const handleSortToggle = (field: string) => {
    if (filters.sortBy === field) {
      onFilterChange({
        sortDir: filters.sortDir === 'asc' ? 'desc' : 'asc',
        page: 0,
      });
    } else {
      onFilterChange({
        sortBy: field,
        sortDir: 'asc',
        page: 0,
      });
    }
  };

  const resetFilters = () => {
    onFilterChange({
      search: '',
      department: 'ALL',
      status: 'ALL',
      sortBy: 'id',
      sortDir: 'desc',
      page: 0,
    });
  };

  const hasActiveFilters =
    filters.search !== '' || filters.department !== 'ALL' || filters.status !== 'ALL';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Search and Filters Toolbar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/40">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          {/* Search input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, email, or employee ID..."
              value={filters.search}
              onChange={(e) => onFilterChange({ search: e.target.value, page: 0 })}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-white placeholder-slate-400 transition-colors focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            />
          </div>

          {/* Filters & Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Department Filter */}
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Dept:</span>
              <select
                value={filters.department}
                onChange={(e) => onFilterChange({ department: e.target.value, page: 0 })}
                className="px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white text-slate-700 transition-colors focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              >
                <option value="ALL">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Employment Status Filter */}
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Status:</span>
              <select
                value={filters.status}
                onChange={(e) => onFilterChange({ status: e.target.value, page: 0 })}
                className="px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white text-slate-700 transition-colors focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>

            {/* Reset Filter Button */}
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
                title="Reset filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            {/* Add Employee CTA */}
            <button
              onClick={onAddEmployee}
              className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-sm shadow-sky-600/20 transition-all hover:shadow"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Employee
            </button>
          </div>
        </div>
      </div>

      {/* Loading state indicator */}
      {isLoading && (
        <div className="h-1 bg-sky-100 w-full overflow-hidden">
          <div className="w-full h-full bg-sky-500 animate-pulse" />
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th
                onClick={() => handleSortToggle('employeeId')}
                className="py-3 px-4 cursor-pointer hover:text-slate-800 transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>Employee ID</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSortToggle('fullName')}
                className="py-3 px-4 cursor-pointer hover:text-slate-800 transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>Name & Email</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-4">Phone</th>
              <th
                onClick={() => handleSortToggle('department')}
                className="py-3 px-4 cursor-pointer hover:text-slate-800 transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>Department & Role</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSortToggle('dateOfJoining')}
                className="py-3 px-4 cursor-pointer hover:text-slate-800 transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>Joined Date</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSortToggle('salary')}
                className="py-3 px-4 cursor-pointer hover:text-slate-800 transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>Salary</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {employees.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  <div className="max-w-xs mx-auto">
                    <Filter className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-700">No employees found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {hasActiveFilters
                        ? 'Try adjusting your search criteria or filter options.'
                        : 'Click "Add Employee" to create the first record.'}
                    </p>
                    {hasActiveFilters && (
                      <button
                        onClick={resetFilters}
                        className="mt-3 px-3 py-1.5 text-xs font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200 transition-colors"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              employees.map((emp) => {
                const isActive = emp.employmentStatus === 'ACTIVE';
                return (
                  <tr
                    key={emp.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Employee ID */}
                    <td className="py-3.5 px-4 font-mono text-xs font-semibold text-slate-700">
                      <span className="bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                        {emp.employeeId}
                      </span>
                    </td>

                    {/* Name & Email */}
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="font-semibold text-slate-900 group-hover:text-sky-700 transition-colors">
                          {emp.fullName}
                        </div>
                        <div className="text-xs text-slate-400 flex items-center mt-0.5">
                          <Mail className="w-3 h-3 mr-1 text-slate-300" />
                          {emp.email}
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="py-3.5 px-4 text-slate-600 text-xs">
                      <span className="flex items-center">
                        <Phone className="w-3 h-3 mr-1 text-slate-400" />
                        {emp.phoneNumber}
                      </span>
                    </td>

                    {/* Department & Designation */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800 text-xs">{emp.department}</div>
                      <div className="text-xs text-slate-400">{emp.designation}</div>
                    </td>

                    {/* Joining Date */}
                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      {formatDate(emp.dateOfJoining)}
                    </td>

                    {/* Salary */}
                    <td className="py-3.5 px-4 font-semibold text-slate-800 text-xs">
                      {formatCurrency(emp.salary)}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            isActive ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                        />
                        {emp.employmentStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => onViewEmployee(emp)}
                          className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEditEmployee(emp)}
                          className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Edit Information"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteEmployee(emp)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Employee"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden divide-y divide-slate-100">
        {employees.length === 0 ? (
          <div className="py-12 text-center text-slate-400 px-4">
            <Filter className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-slate-700">No employees found</p>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your search criteria or add an employee.
            </p>
          </div>
        ) : (
          employees.map((emp) => {
            const isActive = emp.employmentStatus === 'ACTIVE';
            return (
              <div key={emp.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                      {emp.employeeId}
                    </span>
                    <h4 className="font-bold text-slate-900 mt-1">{emp.fullName}</h4>
                    <p className="text-xs text-slate-500">{emp.designation}</p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {emp.employmentStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                  <div>
                    <span className="text-slate-400 block">Department</span>
                    <span className="font-medium text-slate-800">{emp.department}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Salary</span>
                    <span className="font-medium text-slate-800">{formatCurrency(emp.salary)}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block">Email</span>
                    <span className="font-medium text-slate-800 truncate block">{emp.email}</span>
                  </div>
                </div>

                {/* Mobile action bar */}
                <div className="pt-2 flex items-center justify-end space-x-2 border-t border-slate-100">
                  <button
                    onClick={() => onViewEmployee(emp)}
                    className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-sky-700 bg-sky-50 rounded-lg hover:bg-sky-100"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    View
                  </button>
                  <button
                    onClick={() => onEditEmployee(emp)}
                    className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-amber-700 bg-amber-50 rounded-lg hover:bg-amber-100"
                  >
                    <Edit className="w-3.5 h-3.5 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteEmployee(emp)}
                    className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-rose-700 bg-rose-50 rounded-lg hover:bg-rose-100"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      <div className="px-4 py-3.5 sm:px-6 bg-slate-50/70 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-slate-600">
        <div>
          Showing <span className="font-semibold text-slate-900">{startRecord}</span> to{' '}
          <span className="font-semibold text-slate-900">{endRecord}</span> of{' '}
          <span className="font-semibold text-slate-900">{totalElements}</span> employees
        </div>

        <div className="flex items-center space-x-2">
          {/* Page size dropdown */}
          <div className="flex items-center space-x-1.5 mr-2">
            <span className="text-xs text-slate-400">Rows:</span>
            <select
              value={filters.size}
              onChange={(e) => onFilterChange({ size: Number(e.target.value), page: 0 })}
              className="px-2 py-1 text-xs rounded-lg border border-slate-200 bg-white"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>

          {/* Previous Page */}
          <button
            onClick={() => onFilterChange({ page: Math.max(0, currentPage - 1) })}
            disabled={currentPage === 0 || isLoading}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center transition-colors"
          >
            <ChevronLeft className="w-4 h-4 sm:mr-1" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          {/* Page indicator */}
          <span className="px-2 font-medium text-slate-700">
            Page {totalPages === 0 ? 0 : currentPage + 1} of {totalPages}
          </span>

          {/* Next Page */}
          <button
            onClick={() => onFilterChange({ page: currentPage + 1 })}
            disabled={currentPage >= totalPages - 1 || isLoading}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center transition-colors"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4 sm:ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
