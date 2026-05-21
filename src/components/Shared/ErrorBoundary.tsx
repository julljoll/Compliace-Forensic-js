import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

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
          <div className="fluent-card p-8 max-w-md text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
              <AlertTriangle size={32} className="text-red-400" />
            </div>
            <h2 className="text-lg font-bold text-white">Error en la aplicación</h2>
            <p className="text-sm text-fluent-text-muted">
              Ocurrió un error inesperado en este módulo. El sistema ha registrado el incidente.
            </p>
            {this.state.error && (
              <details className="text-left">
                <summary className="text-[11px] text-fluent-text-muted cursor-pointer hover:text-white">
                  Ver detalle técnico
                </summary>
                <pre className="mt-2 p-3 rounded bg-black/30 text-[10px] text-red-300 overflow-auto max-h-32">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <div className="flex justify-center gap-3 pt-2">
              <button onClick={this.handleReset} className="cms-btn cms-btn-primary text-sm">
                <RefreshCw size={14} /> Reintentar
              </button>
              <button onClick={() => window.location.href = '/'} className="cms-btn cms-btn-secondary text-sm">
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
