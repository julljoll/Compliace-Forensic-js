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
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import { useCMSStore } from '../store/cmsStore';
import { useAuditStore } from '../store/auditStore';
import {
  Activity, Printer, Clock,
  ShieldCheck, AlertTriangle,
  FolderOpen, ChevronRight, X, Hash, User, Filter, ArrowLeft
} from '../components/atoms/AppleIcon';

import Button from '../components/atoms/Button';

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
        ? { valid: true,  message: 'Cadena SHA-256 íntegra. No se detectaron alteraciones.' }
        : { valid: false, message: `¡ALERTA CRÍTICA! Cadena comprometida en ID: ${res.brokenAt || 'Desconocido'}.` }
      );
    } catch {
      setIntegridad({ valid: false, message: 'No se pudo completar la verificación criptográfica.' });
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
      headerName: 'Detalle del Evento',
      flex: 1,
      minWidth: 260,
      renderCell: (params) => (
        <Typography sx={{ fontSize: '13px', color: '#FFFFFF', fontWeight: 500, my: 'auto' }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'usuario',
      headerName: 'Perito / Usuario',
      width: 160,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', my: 'auto' }}>
          <User size={12} className="text-[#AEAEB2]" />
          <Typography sx={{ fontSize: '12px', color: '#AEAEB2' }}>{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: 'hashActual',
      headerName: 'Hash SHA-256',
      width: 180,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', my: 'auto' }}>
          <Hash size={12} className="text-[#00FF41]" />
          <Typography sx={{ fontSize: '11px', fontFamily: 'monospace', color: '#FECF06' }}>
            {params.value ? `${params.value.slice(0, 10)}...` : '—'}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'timestamp',
      headerName: 'Fecha / Hora',
      width: 170,
      renderCell: (params) => (
        <Typography sx={{ fontSize: '11px', color: '#AEAEB2', fontFamily: 'monospace', my: 'auto' }}>
          {new Date(params.value).toLocaleString('es-VE')}
        </Typography>
      ),
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', pb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { md: 'flex-end' }, gap: 2, pb: 2, mb: 3, borderBottom: '1px solid rgba(254, 207, 6, 0.2)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {vista === 'logs' && (
            <IconButton onClick={handleBack} sx={{ color: '#AEAEB2', border: '1px solid rgba(254, 207, 6, 0.2)' }}>
              <ArrowLeft size={16} />
            </IconButton>
          )}
          <Box>
            <Typography component="h1" sx={{ fontSize: '24px', fontWeight: 700, color: '#00FF41', display: 'flex', alignItems: 'center', gap: 1 }}>
              <Activity size={22} className="text-[#FECF06]" />
              {vista === 'casos' ? 'Consola de Auditoría Forense' : `Auditoría / ${casoCurrent?.numeroCaso}`}
            </Typography>
            <Typography sx={{ fontSize: '13px', color: '#AEAEB2', mt: 0.5 }}>
              {vista === 'casos'
                ? 'Seleccione un expediente para auditar su trazabilidad y línea de tiempo de cumplimiento'
                : `${casoCurrent?.titulo} — Cadena Criptográfica Inmutable SHA-256`}
            </Typography>
          </Box>
        </Box>

        <Stack direction="row" spacing={1.5}>
          <Button onClick={handleVerify} variant="primary" size="sm" disabled={verificando || allLogs.length === 0}>
            <ShieldCheck size={14} />
            {verificando ? 'Verificando...' : 'Verificar SHA-256'}
          </Button>
          {vista === 'logs' && casoId && (
            <Button onClick={() => router.push(`/planillas/acta-auditoria-timeline?casoId=${casoId}`)} variant="secondary" size="sm">
              <Printer size={14} />
              Imprimir Línea de Tiempo
            </Button>
          )}
        </Stack>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Eventos',    value: kpis.totalEvents,    icon: <Hash size={14}/>,     color: '#FECF06' },
          { label: 'Casos Auditados',  value: kpis.casosAuditados, icon: <FolderOpen size={14}/>,color: '#9DFF00' },
          { label: 'Casos Activos',    value: kpis.casosActivos,   icon: <Activity size={14}/>, color: '#00FF41' },
          { label: 'Último Evento',    value: kpis.ultimoEvento ? getRelativeTime(kpis.ultimoEvento) : '—', icon: <Clock size={14}/>, color: '#FF9500' },
        ].map((k, i) => (
          <Grid key={i} size={{ xs: 6, md: 3 }}>
            <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 36, height: 36, borderRadius: '8px', backgroundColor: 'rgba(254, 207, 6, 0.08)', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: k.color }}>
                {k.icon}
              </Box>
              <Box>
                <Typography sx={{ fontSize: '11px', color: '#AEAEB2', fontWeight: 600, textTransform: 'uppercase' }}>{k.label}</Typography>
                <Typography sx={{ fontSize: '18px', color: '#FFFFFF', fontWeight: 700 }}>{k.value}</Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Alert */}
      {integridad && (
        <Alert
          severity={integridad.valid ? 'success' : 'error'}
          onClose={() => setIntegridad(null)}
          sx={{ mb: 3, borderRadius: '12px', backgroundColor: integridad.valid ? 'rgba(0, 255, 65, 0.08)' : 'rgba(255, 59, 48, 0.08)', color: '#FFFFFF', border: `1px solid ${integridad.valid ? '#00FF41' : '#FF3B30'}` }}
        >
          <AlertTitle sx={{ fontWeight: 700, color: integridad.valid ? '#00FF41' : '#FF3B30' }}>
            {integridad.valid ? 'Integridad Verificada ✓' : 'Alerta de Cripto-Integridad'}
          </AlertTitle>
          {integridad.message}
        </Alert>
      )}

      {/* Cases Grid */}
      {vista === 'casos' && (
        <Grid container spacing={2}>
          {casos.map((caso) => {
            const count = countByCaso[caso.id] || 0;
            const meta = ESTADO_META[caso.estado] || ESTADO_META.iniciado;
            return (
              <Grid key={caso.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card
                  onClick={() => handleSelectCaso(caso.id)}
                  sx={{ cursor: 'pointer', p: 2.5, transition: 'all 0.2s ease', '&:hover': { transform: 'translateY(-2px)', borderColor: '#FECF06' } }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                    <Chip label={meta.label} size="small" sx={{ backgroundColor: meta.bg, color: meta.color, fontWeight: 700, fontSize: '10px' }} />
                    <Typography sx={{ fontSize: '11px', fontFamily: 'monospace', color: '#AEAEB2' }}>{caso.numeroCaso}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', mb: 1 }}>{caso.titulo}</Typography>
                  <Typography sx={{ fontSize: '12px', color: '#AEAEB2', mb: 2 }}>{caso.descripcion}</Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 1.5, borderTop: '1px solid rgba(254, 207, 6, 0.15)' }}>
                    <Typography sx={{ fontSize: '12px', color: '#00FF41', fontWeight: 600 }}>
                      {count} eventos auditados
                    </Typography>
                    <ChevronRight size={16} className="text-[#FECF06]" />
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* MUI X DataGrid Logs View */}
      {vista === 'logs' && (
        <Card sx={{ p: 2 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
            <TextField
              size="small"
              placeholder="Buscar por evento, perito o detalle..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              fullWidth
            />
            <TextField
              select
              size="small"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              sx={{ minWidth: 180 }}
            >
              <MenuItem value="todos">Todas las acciones</MenuItem>
              <MenuItem value="crear">Creaciones</MenuItem>
              <MenuItem value="modificar">Modificaciones</MenuItem>
              <MenuItem value="eliminar">Eliminaciones</MenuItem>
              <MenuItem value="imprimir">Impresiones</MenuItem>
            </TextField>
          </Stack>

          <Box sx={{ height: 450, width: '100%' }}>
            <DataGrid
              rows={logsFiltrados.map((l, index) => ({ ...l, id: l.id || index }))}
              columns={columns}
              pageSizeOptions={[10, 25, 50]}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              sx={{
                border: 'none',
                color: '#FFFFFF',
                '& .MuiDataGrid-cell': {
                  borderColor: 'rgba(254, 207, 6, 0.15)',
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  borderColor: 'rgba(254, 207, 6, 0.2)',
                },
                '& .MuiDataGrid-footerContainer': {
                  borderColor: 'rgba(254, 207, 6, 0.15)',
                },
                '& .MuiTablePagination-root': {
                  color: '#AEAEB2',
                },
              }}
            />
          </Box>
        </Card>
      )}
    </Box>
  );
}
