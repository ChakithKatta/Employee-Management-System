import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Employee } from '../types/employee';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  employee: Employee | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  employee,
  onClose,
  onConfirm,
  isLoading,
}) => {
  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-scale-up">
        {/* Top decorative accent */}
        <div className="h-1.5 bg-rose-500 w-full" />

        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 flex-shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-bold text-slate-900">Confirm Employee Deletion</h3>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <span className="font-semibold text-slate-900">{employee.fullName}</span> (
              <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                {employee.employeeId}
              </span>
              )?
            </p>
            <p className="text-xs text-rose-600 mt-2 bg-rose-50 p-2.5 rounded-lg border border-rose-100">
              This action cannot be reversed and all associated details will be removed from the
              database.
            </p>
          </div>

          <div className="mt-6 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-1.5" />
                  Confirm Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
