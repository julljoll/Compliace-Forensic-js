import { Component, ErrorInfo, ReactNode } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
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
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', p: 4 }}>
          <Card sx={{ p: 4, maxWidth: '440px', width: '100%', textAlign: 'center', backgroundColor: '#1E1800', border: '1px solid rgba(254, 207, 6, 0.3)' }}>
            <Box sx={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: 'rgba(255, 59, 48, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
              <AlertTriangle size={28} style={{ color: '#FF3B30' }} />
            </Box>
            <Typography variant="h6" sx={{ color: '#FECF06', fontWeight: 800, mb: 1 }}>
              Error en la aplicación
            </Typography>
            <Typography sx={{ fontSize: '13px', color: '#AEAEB2', mb: 2 }}>
              Ocurrió un error inesperado. El sistema ha registrado el incidente.
            </Typography>

            {this.state.error && (
              <Box sx={{ textAlign: 'left', mb: 3 }}>
                <Typography component="pre" sx={{ p: 2, borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.4)', fontSize: '11px', color: '#FF3B30', overflowX: 'auto', fontFamily: 'monospace' }}>
                  {this.state.error.message}
                </Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button onClick={this.handleReset} variant="contained" startIcon={<RefreshCw size={14} />} sx={{ backgroundColor: '#FECF06', color: '#000000', fontWeight: 700 }}>
                Reintentar
              </Button>
              <Button onClick={() => window.location.href = '/'} variant="outlined" startIcon={<Home size={14} />} sx={{ color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.3)' }}>
                Ir al inicio
              </Button>
            </Box>
          </Card>
        </Box>
      );
    }

    return this.props.children;
  }
}
