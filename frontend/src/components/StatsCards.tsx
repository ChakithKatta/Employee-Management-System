import React from 'react';
import { Users, UserCheck, UserX, Building2 } from 'lucide-react';
import { DashboardStats } from '../types/employee';

interface StatsCardsProps {
  stats: DashboardStats | null;
  onFilterStatus: (status: string) => void;
  activeStatusFilter: string;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  stats,
  onFilterStatus,
  activeStatusFilter,
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Employees */}
      <div
        onClick={() => onFilterStatus('ALL')}
        className={`bg-white rounded-2xl p-5 border transition-all duration-200 cursor-pointer hover:shadow-md ${
          activeStatusFilter === 'ALL'
            ? 'border-sky-500 ring-2 ring-sky-500/20 shadow-sm'
            : 'border-slate-200/80 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Employees
            </p>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              {stats ? stats.totalEmployees : '—'}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-3 flex items-center">
          <span className="text-sky-600 font-medium mr-1">All</span> recorded members
        </p>
      </div>

      {/* Active Employees */}
      <div
        onClick={() => onFilterStatus('ACTIVE')}
        className={`bg-white rounded-2xl p-5 border transition-all duration-200 cursor-pointer hover:shadow-md ${
          activeStatusFilter === 'ACTIVE'
            ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
            : 'border-slate-200/80 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Active Status
            </p>
            <h3 className="text-2xl sm:text-3xl font-bold text-emerald-600 mt-1">
              {stats ? stats.activeEmployees : '—'}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-3 flex items-center">
          <span className="text-emerald-600 font-medium mr-1">Currently working</span> on duty
        </p>
      </div>

      {/* Inactive Employees */}
      <div
        onClick={() => onFilterStatus('INACTIVE')}
        className={`bg-white rounded-2xl p-5 border transition-all duration-200 cursor-pointer hover:shadow-md ${
          activeStatusFilter === 'INACTIVE'
            ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-sm'
            : 'border-slate-200/80 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Inactive Status
            </p>
            <h3 className="text-2xl sm:text-3xl font-bold text-amber-600 mt-1">
              {stats ? stats.inactiveEmployees : '—'}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <UserX className="w-6 h-6" />
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-3 flex items-center">
          <span className="text-amber-600 font-medium mr-1">On leave / Resigned</span>
        </p>
      </div>

      {/* Departments */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-slate-300 transition-all duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Departments
            </p>
            <h3 className="text-2xl sm:text-3xl font-bold text-indigo-600 mt-1">
              {stats ? stats.totalDepartments : '—'}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-3 flex items-center">
          <span className="text-indigo-600 font-medium mr-1">Organized divisions</span> across org
        </p>
      </div>
    </div>
  );
};
