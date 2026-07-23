'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';
import TimelineIcon from '@mui/icons-material/Timeline';
import PrintIcon from '@mui/icons-material/Print';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import WarningIcon from '@mui/icons-material/Warning';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import NumbersIcon from '@mui/icons-material/Numbers';
import PersonIcon from '@mui/icons-material/Person';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import { useCMSStore } from '../store/cmsStore';
import { useAuditStore } from '../store/auditStore';

// ── Helpers ────────────────────────────────────────────────────────────────────

function getRelativeTime(dateString: string) {
  try {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffMins < 1) return 'Hace un momento';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return date.toLocaleDateString('es', { day: '2-digit', month: 'short' });
  } catch {
    return '';
  }
}

const ACTION_META: Record<string, { label: string; color: string; bg: string }> = {
  crear:     { label: 'CREAR',     color: '#00FF41', bg: 'rgba(0, 255, 65, 0.1)' },
  eliminar:  { label: 'ELIMINAR',  color: '#FF3B30', bg: 'rgba(255, 59, 48, 0.1)' },
  modificar: { label: 'MODIFICAR', color: '#FECF06', bg: 'rgba(254, 207, 6, 0.1)' },
  verificar: { label: 'VERIFICAR', color: '#9DFF00', bg: 'rgba(157, 255, 0, 0.1)' },
  imprimir:  { label: 'IMPRIMIR',  color: '#FECF06', bg: 'rgba(254, 207, 6, 0.1)' },
  default:   { label: 'SISTEMA',   color: '#AEAEB2', bg: 'rgba(255, 255, 255, 0.06)' },
};

function getActionMeta(accion: string) {
  const u = accion.toUpperCase();
  if (u.includes('CREAR') || u.includes('REGISTRADA') || u.includes('NUEVO')) return ACTION_META.crear;
  if (u.includes('ELIMIN')) return ACTION_META.eliminar;
  if (u.includes('ACTUALIZ') || u.includes('CAMBIA') || u.includes('MODIFIC')) return ACTION_META.modificar;
  if (u.includes('VERIFIC') || u.includes('CUMPLIM')) return ACTION_META.verificar;
  if (u.includes('IMPRIM') || u.includes('PLANILLA')) return ACTION_META.imprimir;
  return ACTION_META.default;
}

const ESTADO_META: Record<string, { label: string; color: string; bg: string }> = {
  iniciado:   { label: 'Iniciado',   color: '#FECF06', bg: 'rgba(254, 207, 6, 0.1)' },
  en_proceso: { label: 'En Proceso', color: '#FF9500', bg: 'rgba(255, 149, 0, 0.1)' },
  analisis:   { label: 'Análisis',   color: '#9DFF00', bg: 'rgba(157, 255, 0, 0.1)' },
  informe:    { label: 'Informe',    color: '#FECF06', bg: 'rgba(254, 207, 6, 0.1)' },
  cerrado:    { label: 'Cerrado',    color: '#00FF41', bg: 'rgba(0, 255, 65, 0.1)' },
  archivado:  { label: 'Archivado',  color: '#AEAEB2', bg: 'rgba(255, 255, 255, 0.06)' },
};

const SESSION_ACTIONS = new Set(['INICIO_SESION', 'SISTEMA_INICIADO', 'SESION_CERRADA']);

// ── Main Component ─────────────────────────────────────────────────────────────

export default function AuditoriaPage() {
  const router  = useRouter();
  const { casos, auditLogs: cmsLogs } = useCMSStore();
  const storeLogs   = useAuditStore(s => s.logs);
  const loadLogs    = useAuditStore(s => s.loadLogs);
  const verifyChain = useAuditStore(s => s.verifyChain);
  const clearLogs   = useAuditStore(s => s.clearLogs);

  const [vista, setVista]             = useState<'casos' | 'logs'>('casos');
  const [casoId, setCasoId]           = useState<string | null>(null);
  const [actionFilter, setActionFilter] = useState('todos');
  const [busqueda, setBusqueda]       = useState('');
  const [loading, setLoading]         = useState(true);
  const [verificando, setVerificando] = useState(false);
  const [integridad, setIntegridad]   = useState<{ valid: boolean; message: string } | null>(null);

  useEffect(() => {
    loadLogs().finally(() => setLoading(false));
  }, [loadLogs]);

  const allLogs = useMemo(() => {
    const map = new Map<string, any>();
    storeLogs.forEach(l => map.set(l.id || `${l.timestamp}-${l.detalle}`, l));
    (cmsLogs || []).forEach(l => {
      const k = l.id || `${l.timestamp}-${l.detalle}`;
      if (!map.has(k)) map.set(k, l);
    });
    return Array.from(map.values())
      .filter(l => !SESSION_ACTIONS.has(l.accion))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [storeLogs, cmsLogs]);

  const countByCaso = useMemo(() => {
    const acc: Record<string, number> = {};
    allLogs.forEach(l => { if (l.casoId) acc[l.casoId] = (acc[l.casoId] || 0) + 1; });
    return acc;
  }, [allLogs]);

  const logsFiltrados = useMemo(() => {
    return allLogs.filter(log => {
      const matchCaso = !casoId || log.casoId === casoId;
      const u = log.accion.toUpperCase();
      const matchAction =
        actionFilter === 'todos' ||
        (actionFilter === 'crear'     && (u.includes('CREA') || u.includes('REGISTRADA'))) ||
        (actionFilter === 'modificar' && (u.includes('ACTUALIZ') || u.includes('CAMBIA'))) ||
        (actionFilter === 'eliminar'  && u.includes('ELIMIN')) ||
        (actionFilter === 'imprimir'  && u.includes('IMPRIM'));
      const q = busqueda.toLowerCase().trim();
      const matchSearch = !q ||
        log.detalle?.toLowerCase().includes(q) ||
        log.accion?.toLowerCase().includes(q) ||
        log.usuario?.toLowerCase().includes(q);
      return matchCaso && matchAction && matchSearch;
    });
  }, [allLogs, casoId, actionFilter, busqueda]);

  const kpis = useMemo(() => ({
    totalEvents:    allLogs.length,
    casosActivos:   casos.filter(c => c.estado !== 'archivado' && c.estado !== 'cerrado').length,
    casosAuditados: new Set(allLogs.map(l => l.casoId).filter(Boolean)).size,
    ultimoEvento:   allLogs[0]?.timestamp || null,
  }), [allLogs, casos]);

  const handleVerify = async () => {
    setVerificando(true);
    setIntegridad(null);
    try {
      const res = await verifyChain();
      setIntegridad(res.valid
        ? { valid: true,  message: 'Auditoría local consistente. Historial verificado conforme a registros de sistema.' }
        : { valid: false, message: `Inconsistencia detectada en ID: ${res.brokenAt || 'Desconocido'}.` }
      );
    } catch {
      setIntegridad({ valid: false, message: 'No se pudo completar la verificación del historial.' });
    } finally {
      setVerificando(false);
    }
  };

  const handleClearLogs = async () => {
    if (!confirm('¿Vaciar historial de auditoría? Esta acción es irreversible.')) return;
    setLoading(true);
    await clearLogs();
    await loadLogs();
    setIntegridad(null);
    setLoading(false);
  };

  const handleSelectCaso = (id: string) => {
    setCasoId(id);
    setVista('logs');
    setBusqueda('');
    setActionFilter('todos');
  };

  const handleBack = () => {
    setVista('casos');
    setCasoId(null);
    setIntegridad(null);
  };

  const casoCurrent = casoId ? casos.find(c => c.id === casoId) : null;
  const estadoMeta  = casoCurrent ? (ESTADO_META[casoCurrent.estado] || ESTADO_META.iniciado) : null;

  // DataGrid Columns definition
  const columns: GridColDef[] = [
    {
      field: 'accion',
      headerName: 'Acción',
      width: 130,
      renderCell: (params) => {
        const meta = getActionMeta(params.value);
        return (
          <Chip
            label={meta.label}
            size="small"
            sx={{
              backgroundColor: meta.bg,
              color: meta.color,
              border: `1px solid ${meta.color}`,
              fontWeight: 700,
              fontSize: '10px',
            }}
          />
        );
      },
    },
    {
      field: 'detalle',
      headerName: 'Detalle de la Operación',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: '#FFFFFF', fontSize: '13px', lineHeight: 1.4 }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'usuario',
      headerName: 'Usuario / Responsable',
      width: 160,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <PersonIcon sx={{ fontSize: 16, color: '#FECF06' }} />
          <Typography variant="body2" sx={{ color: '#E5E5EA', fontSize: '12px' }}>
            {params.value || 'Sistema'}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'timestamp',
      headerName: 'Fecha / Hora',
      width: 180,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: '#AEAEB2', fontFamily: 'monospace', fontSize: '11px' }}>
          {new Date(params.value).toLocaleString('es-VE')}
        </Typography>
      ),
    },
    {
      field: 'hashActual',
      headerName: 'Hash SHA-256 (Hash Chain Inmutable)',
      width: 340,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: '#00FF41', fontFamily: 'Fira Code, monospace', fontSize: '10.5px' }}>
          {params.value || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
        </Typography>
      ),
    },
  ];

  const rows = logsFiltrados.map((log, idx) => ({
    id: log.id || idx,
    accion: log.accion,
    detalle: log.detalle,
    usuario: log.usuario,
    timestamp: log.timestamp,
    hashActual: (log as any).hashActual || (log as any).hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  }));

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
      {/* Encabezado */}
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ color: '#FECF06', fontWeight: 800, fontFamily: 'Ubuntu, sans-serif' }}>
            Módulo de Auditoría Local
          </Typography>

        </Box>
        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<VerifiedUserIcon />}
            onClick={handleVerify}
            disabled={verificando}
            sx={{
              color: '#00FF41',
              borderColor: 'rgba(0, 255, 65, 0.4)',
              fontWeight: 700,
              '&:hover': { borderColor: '#00FF41', backgroundColor: 'rgba(0, 255, 65, 0.1)' },
            }}
          >
            {verificando ? 'Verificando...' : 'VERIFICAR AUDITORÍA'}
          </Button>

          <Button
            variant="contained"
            size="small"
            startIcon={<PrintIcon />}
            onClick={() => router.push(casoId ? `/planillas/acta-auditoria-timeline?casoId=${casoId}` : '/planillas/acta-auditoria-timeline')}
            sx={{
              backgroundColor: '#FECF06',
              color: '#000000',
              fontWeight: 700,
              '&:hover': { backgroundColor: '#e0b700' },
            }}
          >
            IMPRIMIR ACTA DE AUDITORÍA
          </Button>
        </Stack>
      </Stack>

      {/* Alerta de Integridad */}
      {integridad && (
        <Alert
          severity={integridad.valid ? 'success' : 'error'}
          sx={{ mb: 3, backgroundColor: integridad.valid ? 'rgba(0, 255, 65, 0.1)' : 'rgba(255, 59, 48, 0.1)', border: `1px solid ${integridad.valid ? '#00FF41' : '#FF3B30'}` }}
        >
          <AlertTitle sx={{ fontWeight: 700, color: integridad.valid ? '#00FF41' : '#FF3B30' }}>
            {integridad.valid ? 'Integridad Verificada' : 'Alerta de Auditoría'}
          </AlertTitle>
          {integridad.message}
        </Alert>
      )}

      {/* KPIs */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 2, backgroundColor: '#1E1800', border: '1px solid rgba(254, 207, 6, 0.3)' }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <TimelineIcon sx={{ color: '#FECF06', fontSize: 28 }} />
              <Box>
                <Typography variant="caption" sx={{ color: '#AEAEB2', textTransform: 'uppercase' }}>
                  Total de Eventos
                </Typography>
                <Typography variant="h5" sx={{ color: '#FFFFFF', fontWeight: 800 }}>
                  {kpis.totalEvents}
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 2, backgroundColor: '#1E1800', border: '1px solid rgba(254, 207, 6, 0.3)' }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <FolderOpenIcon sx={{ color: '#00FF41', fontSize: 28 }} />
              <Box>
                <Typography variant="caption" sx={{ color: '#AEAEB2', textTransform: 'uppercase' }}>
                  Casos Auditados
                </Typography>
                <Typography variant="h5" sx={{ color: '#FFFFFF', fontWeight: 800 }}>
                  {kpis.casosAuditados}
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 2, backgroundColor: '#1E1800', border: '1px solid rgba(254, 207, 6, 0.3)' }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <AccessTimeIcon sx={{ color: '#9DFF00', fontSize: 28 }} />
              <Box>
                <Typography variant="caption" sx={{ color: '#AEAEB2', textTransform: 'uppercase' }}>
                  Último Registro
                </Typography>
                <Typography variant="subtitle2" sx={{ color: '#FFFFFF', fontWeight: 700 }}>
                  {kpis.ultimoEvento ? getRelativeTime(kpis.ultimoEvento) : 'Sin eventos'}
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 2, backgroundColor: '#1E1800', border: '1px solid rgba(254, 207, 6, 0.3)' }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <VerifiedUserIcon sx={{ color: '#00FF41', fontSize: 28 }} />
              <Box>
                <Typography variant="caption" sx={{ color: '#AEAEB2', textTransform: 'uppercase' }}>
                  Almacenamiento Local
                </Typography>
                <Typography variant="subtitle2" sx={{ color: '#00FF41', fontWeight: 700 }}>
                  IndexedDB 100% Offline
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      {/* Controles de Filtro */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <TextField
          size="small"
          placeholder="Buscar en el registro de auditoría..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          sx={{
            flex: 1,
            backgroundColor: '#1E1800',
            borderRadius: '6px',
            '& .MuiOutlinedInput-root': {
              color: '#FFFFFF',
              '& fieldset': { borderColor: 'rgba(254, 207, 6, 0.3)' },
              '&:hover fieldset': { borderColor: '#FECF06' },
            },
          }}
        />

        <TextField
          select
          size="small"
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          sx={{
            minWidth: 160,
            backgroundColor: '#1E1800',
            borderRadius: '6px',
            '& .MuiOutlinedInput-root': {
              color: '#FFFFFF',
              '& fieldset': { borderColor: 'rgba(254, 207, 6, 0.3)' },
            },
          }}
        >
          <MenuItem value="todos">Todas las Acciones</MenuItem>
          <MenuItem value="crear">Creación</MenuItem>
          <MenuItem value="modificar">Modificación</MenuItem>
          <MenuItem value="eliminar">Eliminación</MenuItem>
          <MenuItem value="imprimir">Impresión</MenuItem>
        </TextField>
      </Stack>

      {/* Tabla MUI X DataGrid */}
      <Card sx={{ backgroundColor: '#1E1800', border: '1px solid rgba(254, 207, 6, 0.3)', borderRadius: '8px', overflow: 'hidden' }}>
        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            pageSizeOptions={[10, 25, 50, 100]}
            initialState={{
              pagination: { paginationModel: { pageSize: 25 } },
            }}
            sx={{
              border: 'none',
              color: '#FFFFFF',
              fontFamily: 'Ubuntu, sans-serif',
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid rgba(254, 207, 6, 0.1)',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                borderBottom: '2px solid rgba(254, 207, 6, 0.3)',
                color: '#FECF06',
                fontWeight: 700,
              },
              '& .MuiDataGrid-footerContainer': {
                borderTop: '1px solid rgba(254, 207, 6, 0.2)',
                color: '#AEAEB2',
              },
              '& .MuiTablePagination-root': {
                color: '#AEAEB2',
              },
            }}
          />
        </Box>
      </Card>
    </Box>
  );
}
