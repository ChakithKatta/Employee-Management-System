import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-3 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const isSuccess = toast.type === 'success';

  return (
    <div
      className={`pointer-events-auto flex items-start p-4 rounded-xl shadow-lg border transition-all duration-300 animate-slide-in ${
        isSuccess
          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
          : 'bg-rose-50 border-rose-200 text-rose-900'
      }`}
    >
      <div className="flex-shrink-0 mr-3 mt-0.5">
        {isSuccess ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
        ) : (
          <AlertCircle className="w-5 h-5 text-rose-600" />
        )}
      </div>
      <div className="flex-1 text-sm font-medium pr-2">{toast.message}</div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 text-slate-400 hover:text-slate-600 p-0.5 rounded-lg transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
