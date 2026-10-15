import React from 'react';
import {
  X,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Calendar,
  IndianRupee,
  Clock,
  Edit,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Employee } from '../types/employee';

interface EmployeeDetailsModalProps {
  isOpen: boolean;
  employee: Employee | null;
  onClose: () => void;
  onEdit: (employee: Employee) => void;
}

export const EmployeeDetailsModal: React.FC<EmployeeDetailsModalProps> = ({
  isOpen,
  employee,
  onClose,
  onEdit,
}) => {
  if (!isOpen || !employee) return null;

  const isActive = employee.employmentStatus === 'ACTIVE';

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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-scale-up">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-sky-600 via-sky-700 to-indigo-800 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-lg transition-colors bg-white/10 hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-xl font-bold shadow-inner">
              {getInitials(employee.fullName)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-white/20 border border-white/30 font-semibold tracking-wider">
                  {employee.employeeId}
                </span>
                <span
                  className={`inline-flex items-center text-xs px-2.5 py-0.5 rounded-full font-semibold shadow-sm ${
                    isActive
                      ? 'bg-emerald-400 text-emerald-950'
                      : 'bg-amber-400 text-amber-950'
                  }`}
                >
                  {isActive ? (
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                  ) : (
                    <XCircle className="w-3 h-3 mr-1" />
                  )}
                  {employee.employmentStatus}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">{employee.fullName}</h2>
              <p className="text-xs text-sky-100 flex items-center mt-0.5">
                <Briefcase className="w-3.5 h-3.5 mr-1" />
                {employee.designation} &bull; {employee.department}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Contact Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 font-medium">Email Address</p>
                  <p className="text-sm font-semibold text-slate-800 truncate" title={employee.email}>
                    {employee.email}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 font-medium">Phone Number</p>
                  <p className="text-sm font-semibold text-slate-800">{employee.phoneNumber}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Job & Org Details */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Employment Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Department</p>
                  <p className="text-sm font-semibold text-slate-800">{employee.department}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Date of Joining</p>
                  <p className="text-sm font-semibold text-slate-800">
                    {formatDate(employee.dateOfJoining)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Compensation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Compensation
            </h4>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                  <IndianRupee className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Annual Salary</p>
                  <p className="text-lg font-bold text-slate-900">{formatCurrency(employee.salary)}</p>
                </div>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-medium px-2 py-0.5 rounded-md">
                Gross / Year
              </span>
            </div>
          </div>

          {/* Timestamps */}
          {(employee.createdAt || employee.updatedAt) && (
            <div className="text-xs text-slate-400 flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1" />
                Created: {employee.createdAt ? formatDate(employee.createdAt) : '—'}
              </span>
              <span>Updated: {employee.updatedAt ? formatDate(employee.updatedAt) : '—'}</span>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-3 flex items-center justify-end space-x-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(employee);
              }}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-sm transition-all"
            >
              <Edit className="w-4 h-4 mr-1.5" />
              Edit Employee
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
