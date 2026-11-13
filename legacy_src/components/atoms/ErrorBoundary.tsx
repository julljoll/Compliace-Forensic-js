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

  isChunkError(error: Error | null): boolean {
    if (!error) return false;
    return error.name === 'ChunkLoadError'
      || error.message?.includes('Failed to fetch dynamically imported module')
      || error.message?.includes('Loading chunk')
      || error.message?.includes('dynamically imported');
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  componentDidMount() {
    if (this.isChunkError(this.state.error)) {
      window.location.reload();
    }
  }

  componentDidUpdate() {
    if (this.isChunkError(this.state.error)) {
      window.location.reload();
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="d-flex align-items-center justify-content-center min-vh-50 p-4">
          <div className="card p-4 max-w-440 w-100 text-center bg-white border shadow-sm rounded-3">
            <div className="p-3 rounded-circle bg-danger-subtle mx-auto mb-3" style={{ width: '64px', height: '64px' }}>
              <AlertTriangle size={28} className="text-danger" />
            </div>
            <h2 className="h5 fw-bold text-navy mb-1" style={{ color: '#112E51' }}>
              Error en la aplicación
            </h2>
            <p className="small text-muted mb-3">
              Ocurrió un error inesperado. El sistema ha registrado el incidente.
            </p>

            {this.state.error && (
              <pre className="p-3 rounded bg-light text-danger text-start small font-monospace overflow-auto mb-3">
                {this.state.error.message}
              </pre>
            )}

            <div className="d-flex justify-content-center gap-2">
              <button
                type="button"
                className="btn btn-warning btn-sm fw-bold text-navy d-flex align-items-center gap-1"
                onClick={this.handleReset}
              >
                <RefreshCw size={14} /> Reintentar
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm fw-bold d-flex align-items-center gap-1"
                onClick={() => window.location.href = '/'}
              >
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
