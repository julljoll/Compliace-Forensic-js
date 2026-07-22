import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
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
  success: '#00FF41',
  error: '#FF3B30',
  warning: '#FF9500',
  info: '#FECF06',
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
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        p: '14px',
        borderRadius: '12px',
        backgroundColor: '#1E1800',
        border: '1px solid rgba(254, 207, 6, 0.3)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        maxWidth: '380px',
        width: '100%',
        userSelect: 'none',
      }}
    >
      <Icon size={18} style={{ color: ICON_COLORS[toast.type], flexShrink: 0, marginTop: '2px' }} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>{toast.title}</Typography>
        {toast.message && <Typography sx={{ fontSize: '11px', color: '#AEAEB2', mt: '2px', lineHeight: 1.4 }}>{toast.message}</Typography>}
      </Box>
      <IconButton onClick={onClose} size="small" sx={{ color: '#AEAEB2', p: '2px', '&:hover': { color: '#FFFFFF' } }}>
        <X size={12} />
      </IconButton>
    </Box>
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
      <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 1, pointerEvents: 'none' }}>
        {toasts.map(toast => (
          <Box key={toast.id} sx={{ pointerEvents: 'auto', width: '100%', maxWidth: '380px' }}>
            <ToastItem toast={toast} onClose={() => removeToast(toast.id)} />
          </Box>
        ))}
      </Box>
    </ToastContext.Provider>
  );
}
