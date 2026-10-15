import React from 'react';
import { Users, Building2, Download, LogIn, LogOut, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onOpenDepartments: () => void;
  onExportCsv: () => void;
  onOpenLogin: () => void;
  onLogout: () => void;
  isAuthenticated: boolean;
  adminUsername: string | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenDepartments,
  onExportCsv,
  onOpenLogin,
  onLogout,
  isAuthenticated,
  adminUsername,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold bg-gradient-to-r from-slate-900 via-sky-950 to-sky-700 bg-clip-text text-transparent">
                  Kloudspot
                </span>
                <span className="text-xs px-2 py-0.5 font-semibold bg-sky-100 text-sky-800 rounded-full uppercase tracking-wider">
                  EMS
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Employee Management System</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onOpenDepartments}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              title="Manage Departments"
            >
              <Building2 className="w-4 h-4 mr-1.5 text-slate-600" />
              <span className="hidden md:inline">Departments</span>
            </button>

            <button
              onClick={onExportCsv}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200 transition-colors"
              title="Export all employees to CSV"
            >
              <Download className="w-4 h-4 mr-1.5 text-sky-600" />
              <span className="hidden md:inline">Export CSV</span>
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
                <div className="hidden lg:flex items-center text-xs text-slate-600 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  {adminUsername}
                </div>
                <button
                  onClick={onLogout}
                  className="inline-flex items-center px-2.5 py-1.5 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-dashed border-slate-300"
              >
                <LogIn className="w-4 h-4 mr-1.5 text-slate-500" />
                <span className="hidden sm:inline">Admin Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
