// ToastContext.jsx - Accessible and non-blocking toast notifications
import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const getToastStyle = (type) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-emerald-600',
          icon: <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
        };
      case 'error':
        return {
          bg: 'bg-red-600',
          icon: <AlertCircle className="w-5 h-5 text-white shrink-0" />
        };
      case 'warning':
        return {
          bg: 'bg-amber-500',
          icon: <AlertTriangle className="w-5 h-5 text-white shrink-0" />
        };
      default:
        return {
          bg: 'bg-slate-800',
          icon: <Info className="w-5 h-5 text-white shrink-0" />
        };
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      {/* Toast Notification Container */}
      <div 
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full px-4 pointer-events-none"
        role="region"
        aria-label="Notifications"
      >
        {toasts.map(toast => {
          const { bg, icon } = getToastStyle(toast.type);
          return (
            <div
              key={toast.id}
              className={`${bg} text-white px-4 py-3 rounded-xl shadow-xl flex items-center justify-between gap-3 pointer-events-auto transform transition-all duration-300 ease-in-out animate-slide-up border border-white/10`}
            >
              <div className="flex items-center gap-2.5 text-sm font-medium">
                {icon}
                <span>{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-white/80 hover:text-white transition p-1 -mr-1"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
