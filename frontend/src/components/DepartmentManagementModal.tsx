import React, { useState } from 'react';
import { X, Building2, Plus, Trash2, Users } from 'lucide-react';
import { Department } from '../types/employee';

interface DepartmentManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  departments: Department[];
  onCreateDepartment: (data: { name: string; description?: string }) => Promise<void>;
  onDeleteDepartment: (id: number) => Promise<void>;
}

export const DepartmentManagementModal: React.FC<DepartmentManagementModalProps> = ({
  isOpen,
  onClose,
  departments,
  onCreateDepartment,
  onDeleteDepartment,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Department name is required');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await onCreateDepartment({ name: name.trim(), description: description.trim() });
      setName('');
      setDescription('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create department');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Department Management</h3>
              <p className="text-xs text-slate-500">View, add, and organize organizational divisions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Add department form */}
          <form onSubmit={handleCreate} className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700 mb-3 flex items-center">
              <Plus className="w-3.5 h-3.5 mr-1 text-indigo-600" />
              Add New Department
            </h4>

            {error && (
              <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200 mb-3">
                {error}
              </p>
            )}

            <div className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="Department Name (e.g., Data Science & AI)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-white"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-white"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all disabled:opacity-50"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  {isSubmitting ? 'Creating...' : 'Create Department'}
                </button>
              </div>
            </div>
          </form>

          {/* Department List */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Existing Departments ({departments.length})
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {departments.length === 0 ? (
                <p className="text-sm text-slate-400 py-3 text-center">No departments registered</p>
              ) : (
                departments.map((dept) => (
                  <div
                    key={dept.id}
                    className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-colors"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold text-slate-800">{dept.name}</span>
                        <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                          <Users className="w-3 h-3 mr-1 text-slate-400" />
                          {dept.employeeCount ?? 0} members
                        </span>
                      </div>
                      {dept.description && (
                        <p className="text-xs text-slate-500 mt-0.5">{dept.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => onDeleteDepartment(dept.id)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Delete department"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
