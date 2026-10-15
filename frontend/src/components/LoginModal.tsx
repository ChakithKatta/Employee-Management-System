import React, { useState } from 'react';
import { X, Lock, KeyRound, ShieldAlert } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (credentials: { username: string; password: string }) => Promise<void>;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await onLogin({ username, password });
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-slate-100 overflow-hidden animate-scale-up">
        {/* Top Accent */}
        <div className="h-1.5 bg-gradient-to-r from-sky-500 to-indigo-600" />

        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h3 className="text-lg font-bold text-slate-900">Administrator Sign In</h3>
          <p className="text-xs text-slate-500 mt-1">
            Authenticate to access administrator-restricted management features.
          </p>

          <div className="mt-3 p-2.5 bg-sky-50 border border-sky-100 rounded-xl text-xs text-sky-800">
            <p className="font-semibold flex items-center">
              <KeyRound className="w-3.5 h-3.5 mr-1" />
              Demo Credentials:
            </p>
            <p className="mt-0.5 text-slate-600">
              Username: <span className="font-mono font-medium text-slate-800">admin</span> | Password:{' '}
              <span className="font-mono font-medium text-slate-800">admin123</span>
            </p>
          </div>

          {error && (
            <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-medium flex items-center">
              <ShieldAlert className="w-4 h-4 mr-1.5 flex-shrink-0 text-rose-600" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-sm transition-all flex items-center justify-center disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
