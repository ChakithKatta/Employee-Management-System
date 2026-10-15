import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save, Building2, Briefcase, Mail, Phone, Calendar, IndianRupee, Hash } from 'lucide-react';
import { Department, Employee, EmployeeFormData, EmploymentStatus } from '../types/employee';

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EmployeeFormData) => Promise<void>;
  initialEmployee?: Employee | null;
  departments: Department[];
  isLoading: boolean;
}

export const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialEmployee,
  departments,
  isLoading,
}) => {
  const isEditMode = !!initialEmployee;

  const defaultFormData: EmployeeFormData = {
    employeeId: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    department: departments[0]?.name || 'Engineering',
    designation: '',
    dateOfJoining: new Date().toISOString().slice(0, 10),
    salary: '',
    employmentStatus: 'ACTIVE',
  };

  const [formData, setFormData] = useState<EmployeeFormData>(defaultFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialEmployee) {
      setFormData({
        employeeId: initialEmployee.employeeId,
        fullName: initialEmployee.fullName,
        email: initialEmployee.email,
        phoneNumber: initialEmployee.phoneNumber,
        department: initialEmployee.department,
        designation: initialEmployee.designation,
        dateOfJoining: initialEmployee.dateOfJoining,
        salary: initialEmployee.salary,
        employmentStatus: initialEmployee.employmentStatus,
      });
    } else {
      setFormData({
        ...defaultFormData,
        department: departments[0]?.name || 'Engineering',
      });
    }
    setErrors({});
  }, [initialEmployee, isOpen, departments]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      errs.fullName = 'Full Name is required';
    } else if (formData.fullName.trim().length < 2) {
      errs.fullName = 'Full Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email Address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Enter a valid email address';
    }

    if (!formData.phoneNumber.trim()) {
      errs.phoneNumber = 'Phone Number is required';
    } else if (!/^[+0-9\s\-()]{7,20}$/.test(formData.phoneNumber.trim())) {
      errs.phoneNumber = 'Valid phone format required (7-20 digits)';
    }

    if (!formData.department) {
      errs.department = 'Department is required';
    }

    if (!formData.designation.trim()) {
      errs.designation = 'Designation is required';
    }

    if (!formData.dateOfJoining) {
      errs.dateOfJoining = 'Date of Joining is required';
    }

    const salaryNum = Number(formData.salary);
    if (!formData.salary || isNaN(salaryNum) || salaryNum <= 0) {
      errs.salary = 'Salary must be a positive number';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await onSubmit(formData);
    } catch (err: any) {
      if (err.response?.data?.validationErrors) {
        setErrors(err.response.data.validationErrors);
      } else if (err.response?.data?.message) {
        setErrors({ general: err.response.data.message });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
              {isEditMode ? <Save className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {isEditMode ? 'Edit Employee Information' : 'Add New Employee'}
              </h3>
              <p className="text-xs text-slate-500">
                {isEditMode
                  ? 'Update details for ' + initialEmployee?.fullName
                  : 'Enter employee information to create a new record'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.general && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm font-medium">
              {errors.general}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Employee ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center">
                <Hash className="w-3.5 h-3.5 mr-1 text-slate-400" />
                Employee ID{' '}
                {!isEditMode && <span className="text-slate-400 font-normal lowercase ml-1">(auto-assigned if blank)</span>}
              </label>
              <input
                type="text"
                placeholder={isEditMode ? '' : 'e.g., EMP-1015 (optional)'}
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                className={`w-full px-3.5 py-2 text-sm rounded-xl border font-mono transition-colors focus:outline-none focus:ring-2 ${
                  errors.employeeId
                    ? 'border-rose-300 focus:ring-rose-500/20'
                    : 'border-slate-200 focus:border-sky-500 focus:ring-sky-500/20'
                }`}
              />
              {errors.employeeId && (
                <p className="text-xs text-rose-600 mt-1">{errors.employeeId}</p>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className={`w-full px-3.5 py-2 text-sm rounded-xl border transition-colors focus:outline-none focus:ring-2 ${
                  errors.fullName
                    ? 'border-rose-300 focus:ring-rose-500/20'
                    : 'border-slate-200 focus:border-sky-500 focus:ring-sky-500/20'
                }`}
              />
              {errors.fullName && <p className="text-xs text-rose-600 mt-1">{errors.fullName}</p>}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center">
                <Mail className="w-3.5 h-3.5 mr-1 text-slate-400" />
                Email Address <span className="text-rose-500 ml-0.5">*</span>
              </label>
              <input
                type="email"
                placeholder="e.g. rahul.sharma@kloudspot.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-3.5 py-2 text-sm rounded-xl border transition-colors focus:outline-none focus:ring-2 ${
                  errors.email
                    ? 'border-rose-300 focus:ring-rose-500/20'
                    : 'border-slate-200 focus:border-sky-500 focus:ring-sky-500/20'
                }`}
              />
              {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center">
                <Phone className="w-3.5 h-3.5 mr-1 text-slate-400" />
                Phone Number <span className="text-rose-500 ml-0.5">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. +91 9876543210"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className={`w-full px-3.5 py-2 text-sm rounded-xl border transition-colors focus:outline-none focus:ring-2 ${
                  errors.phoneNumber
                    ? 'border-rose-300 focus:ring-rose-500/20'
                    : 'border-slate-200 focus:border-sky-500 focus:ring-sky-500/20'
                }`}
              />
              {errors.phoneNumber && (
                <p className="text-xs text-rose-600 mt-1">{errors.phoneNumber}</p>
              )}
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center">
                <Building2 className="w-3.5 h-3.5 mr-1 text-slate-400" />
                Department <span className="text-rose-500 ml-0.5">*</span>
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-white transition-colors focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              >
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
              {errors.department && (
                <p className="text-xs text-rose-600 mt-1">{errors.department}</p>
              )}
            </div>

            {/* Designation */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center">
                <Briefcase className="w-3.5 h-3.5 mr-1 text-slate-400" />
                Designation <span className="text-rose-500 ml-0.5">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Senior Software Engineer"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className={`w-full px-3.5 py-2 text-sm rounded-xl border transition-colors focus:outline-none focus:ring-2 ${
                  errors.designation
                    ? 'border-rose-300 focus:ring-rose-500/20'
                    : 'border-slate-200 focus:border-sky-500 focus:ring-sky-500/20'
                }`}
              />
              {errors.designation && (
                <p className="text-xs text-rose-600 mt-1">{errors.designation}</p>
              )}
            </div>

            {/* Date of Joining */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                Date of Joining <span className="text-rose-500 ml-0.5">*</span>
              </label>
              <input
                type="date"
                value={formData.dateOfJoining}
                onChange={(e) => setFormData({ ...formData, dateOfJoining: e.target.value })}
                className={`w-full px-3.5 py-2 text-sm rounded-xl border transition-colors focus:outline-none focus:ring-2 ${
                  errors.dateOfJoining
                    ? 'border-rose-300 focus:ring-rose-500/20'
                    : 'border-slate-200 focus:border-sky-500 focus:ring-sky-500/20'
                }`}
              />
              {errors.dateOfJoining && (
                <p className="text-xs text-rose-600 mt-1">{errors.dateOfJoining}</p>
              )}
            </div>

            {/* Salary */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center">
                <IndianRupee className="w-3.5 h-3.5 mr-1 text-slate-400" />
                Annual Salary (₹) <span className="text-rose-500 ml-0.5">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                placeholder="e.g. 1200000"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                className={`w-full px-3.5 py-2 text-sm rounded-xl border transition-colors focus:outline-none focus:ring-2 ${
                  errors.salary
                    ? 'border-rose-300 focus:ring-rose-500/20'
                    : 'border-slate-200 focus:border-sky-500 focus:ring-sky-500/20'
                }`}
              />
              {errors.salary && <p className="text-xs text-rose-600 mt-1">{errors.salary}</p>}
            </div>
          </div>

          {/* Employment Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Employment Status <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center space-x-4">
              <label
                className={`flex-1 flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-all ${
                  formData.employmentStatus === 'ACTIVE'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold ring-2 ring-emerald-500/20'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="employmentStatus"
                  value="ACTIVE"
                  checked={formData.employmentStatus === 'ACTIVE'}
                  onChange={() => setFormData({ ...formData, employmentStatus: 'ACTIVE' })}
                  className="sr-only"
                />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2" />
                ACTIVE
              </label>

              <label
                className={`flex-1 flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-all ${
                  formData.employmentStatus === 'INACTIVE'
                    ? 'bg-amber-50 border-amber-500 text-amber-900 font-semibold ring-2 ring-amber-500/20'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="employmentStatus"
                  value="INACTIVE"
                  checked={formData.employmentStatus === 'INACTIVE'}
                  onChange={() => setFormData({ ...formData, employmentStatus: 'INACTIVE' })}
                  className="sr-only"
                />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-2" />
                INACTIVE
              </label>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center px-5 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-sm transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  {isEditMode ? <Save className="w-4 h-4 mr-1.5" /> : <UserPlus className="w-4 h-4 mr-1.5" />}
                  {isEditMode ? 'Update Employee' : 'Add Employee'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
