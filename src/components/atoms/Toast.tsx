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
  success: 'text-[var(--co-green)]',
  error: 'text-[var(--co-red)]',
  warning: 'text-[var(--co-orange)]',
  info: 'text-[var(--co-accent)]',
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
    <div className={`
      flex items-start gap-3 p-3.5 rounded-[12px] 
      bg-[var(--co-surface-1)] border border-[var(--co-separator)]
      shadow-[var(--co-shadow-3)] backdrop-blur-[20px]
      transition-all duration-300 transform translate-y-0 opacity-100 apple-fade-in
      max-w-sm w-full select-none
    `}>
      <Icon size={18} className={`shrink-0 mt-0.5 ${ICON_COLORS[toast.type]}`} />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-[var(--apple-text)]">{toast.title}</p>
        {toast.message && <p className="text-[11px] text-[var(--co-gray-1)] mt-0.5 leading-normal">{toast.message}</p>}
      </div>
      <button 
        onClick={onClose} 
        className="shrink-0 p-1 rounded-[6px] hover:bg-[var(--apple-surface-hover)] transition-colors text-[var(--co-gray-1)] hover:text-[var(--apple-text)] active:scale-95"
      >
        <X size={12} />
      </button>
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
      <div className="fixed bottom-6 inset-x-0 z-[9999] flex flex-col items-center gap-2 pointer-events-none px-4 sm:bottom-8 sm:right-8 sm:left-auto sm:items-end">
        {toasts.map(toast => (
          <div key={toast.id} className="pointer-events-auto w-full max-w-sm shadow-[var(--co-shadow-3)] rounded-[12px]">
            <ToastItem toast={toast} onClose={() => removeToast(toast.id)} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
