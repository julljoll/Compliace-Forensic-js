import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { CheckCircle2, AlertTriangle, X, Info, XCircle } from './AppleIcon';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast debe usarse dentro de ToastProvider');
  return ctx;
}

const ICONS: Record<ToastType, any> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const ICON_COLORS: Record<ToastType, string> = {
  success: '#008837',
  error: '#D9381E',
  warning: '#C05621',
  info: '#005EA2',
};

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const Icon = ICONS[toast.type];

  useEffect(() => {
    if (toast.duration !== 0) {
      const timer = setTimeout(onClose, toast.duration || 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.duration, onClose]);

  return (
    <div className="toast show p-2 bg-white border rounded-3 shadow-lg d-flex align-items-start gap-2 mb-2" role="alert">
      <Icon size={18} style={{ color: ICON_COLORS[toast.type], marginTop: '2px' }} />
      <div className="flex-grow-1 min-w-0">
        <div className="fw-bold text-navy small">{toast.title}</div>
        {toast.message && <div className="text-muted small" style={{ fontSize: '11px' }}>{toast.message}</div>}
      </div>
      <button type="button" className="btn-close btn-sm p-1" onClick={onClose} aria-label="Close"></button>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts(prev => {
      const list = [...prev, { ...toast, id }];
      if (list.length > 3) {
        return list.slice(list.length - 3);
      }
      return list;
    });
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 9999 }}>
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
