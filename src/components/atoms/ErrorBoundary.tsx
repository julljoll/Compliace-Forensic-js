import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from './AppleIcon';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Error capturado:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex items-center justify-center min-h-[50vh] p-8">
          <div className="apple-card p-8 max-w-md text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-[rgba(255,59,48,0.1)] flex items-center justify-center mx-auto">
              <AlertTriangle size={28} className="text-[#FF3B30]" />
            </div>
            <div>
              <h2 className="text-[20px] font-bold text-[#1D1D1F] tracking-[-0.02em] mb-1">Error en la aplicación</h2>
              <p className="text-[14px] text-[#86868B] leading-relaxed">
                Ocurrió un error inesperado. El sistema ha registrado el incidente.
              </p>
            </div>
            {this.state.error && (
              <details className="text-left">
                <summary className="text-[12px] text-[#86868B] cursor-pointer hover:text-[#1D1D1F] font-medium">
                  Ver detalle técnico
                </summary>
                <pre className="mt-2 p-3 rounded-[8px] bg-[#F5F5F7] text-[11px] text-[#FF3B30] overflow-auto max-h-32 border border-[rgba(0,0,0,0.06)]">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <div className="flex justify-center gap-3 pt-1">
              <button onClick={this.handleReset} className="apple-btn apple-btn-primary text-[13px]">
                <RefreshCw size={14} /> Reintentar
              </button>
              <button onClick={() => window.location.href = '/'} className="apple-btn apple-btn-secondary text-[13px]">
                <Home size={14} /> Ir al inicio
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
