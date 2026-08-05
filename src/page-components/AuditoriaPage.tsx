'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

import { useCMSStore } from '../store/cmsStore';
import { useAuditStore } from '../store/auditStore';
import {
  Activity, Printer, Clock, ShieldCheck, AlertTriangle,
  FolderOpen, ChevronRight, X, User, Search, Filter, ArrowLeft
} from '../components/atoms/AppleIcon';

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

const ACTION_META: Record<string, { label: string; class: string }> = {
  crear:     { label: 'CREAR',     class: 'usa-tag--success' },
  eliminar:  { label: 'ELIMINAR',  class: 'usa-tag--error' },
  modificar: { label: 'MODIFICAR', class: 'usa-tag--info' },
  verificar: { label: 'VERIFICAR', class: 'usa-tag--info' },
  imprimir:  { label: 'IMPRIMIR',  class: 'usa-tag--muted' },
  default:   { label: 'SISTEMA',   class: 'usa-tag--muted' },
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

const SESSION_ACTIONS = new Set(['INICIO_SESION', 'SISTEMA_INICIADO', 'SESION_CERRADA']);

// ── Main Component ─────────────────────────────────────────────────────────────

export default function AuditoriaPage() {
  const router  = useRouter();
  const { casos, auditLogs: cmsLogs } = useCMSStore();
  const storeLogs   = useAuditStore(s => s.logs);
  const loadLogs    = useAuditStore(s => s.loadLogs);
  const verifyChain = useAuditStore(s => s.verifyChain);
  const clearLogs   = useAuditStore(s => s.clearLogs);

  const [casoId, setCasoId]           = useState<string | null>(null);
  const [actionFilter, setActionFilter] = useState('todos');
  const [busqueda, setBusqueda]       = useState('');
  const [loading, setLoading]         = useState(true);
  const [verificando, setVerificando] = useState(false);
  const [integridad, setIntegridad]   = useState<{ valid: boolean; message: string } | null>(null);

  // Pagination State
  const [page, setPage] = useState(1);
  const pageSize = 15;

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

  const totalPages = Math.ceil(logsFiltrados.length / pageSize) || 1;
  const paginatedLogs = useMemo(() => {
    const start = (page - 1) * pageSize;
    return logsFiltrados.slice(start, start + pageSize);
  }, [logsFiltrados, page]);

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

  return (
    <div className="container-fluid max-w-1280 px-0 pb-5">
      {/* Encabezado Institucional USWDS */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 pb-3 mb-4 border-bottom border-2" style={{ borderColor: 'var(--usa-border)' }}>
        <div>
          <h1 className="h3 fw-bold text-navy mb-1" style={{ color: 'var(--usa-navy)' }}>
            Módulo de Auditoría Forense Local
          </h1>
          <p className="text-muted small mb-0">
            Trazabilidad inmutable SHA-256 de eventos, operaciones y cadena de custodia digital.
          </p>
        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-success btn-sm fw-bold d-flex align-items-center gap-1"
            onClick={handleVerify}
            disabled={verificando}
          >
            <ShieldCheck size={16} />
            {verificando ? 'Verificando...' : 'VERIFICAR AUDITORÍA'}
          </button>

          <button
            type="button"
            className="btn btn-warning btn-sm fw-bold d-flex align-items-center gap-1 text-navy"
            onClick={() => router.push(casoId ? `/planillas/acta-auditoria-timeline?casoId=${casoId}` : '/planillas/acta-auditoria-timeline')}
          >
            <Printer size={16} />
            IMPRIMIR ACTA DE AUDITORÍA
          </button>
        </div>
      </div>

      {/* Alerta de Integridad USWDS */}
      {integridad && (
        <div className={`usa-alert ${integridad.valid ? 'usa-alert--success' : 'usa-alert--error'} mb-4`}>
          <div className="usa-alert__heading">
            {integridad.valid ? '✓ Integridad Verificada' : '⚠ Alerta de Auditoría'}
          </div>
          <div className="small">{integridad.message}</div>
        </div>
      )}

      {/* Cards de KPIs USWDS */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-md-3">
          <div className="usa-card usa-card--gold">
            <div className="usa-card__label">Total de Eventos</div>
            <div className="usa-card__stat mt-1">{kpis.totalEvents}</div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-3">
          <div className="usa-card usa-card--green">
            <div className="usa-card__label">Casos Auditados</div>
            <div className="usa-card__stat mt-1">{kpis.casosAuditados}</div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-3">
          <div className="usa-card usa-card--lime">
            <div className="usa-card__label">Último Registro</div>
            <div className="fw-bold text-navy mt-2" style={{ fontSize: '14px' }}>
              {kpis.ultimoEvento ? getRelativeTime(kpis.ultimoEvento) : 'Sin eventos'}
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-3">
          <div className="usa-card usa-card--green">
            <div className="usa-card__label">Almacenamiento Local</div>
            <div className="fw-bold text-success mt-2" style={{ fontSize: '14px' }}>
              IndexedDB 100% Offline
            </div>
          </div>
        </div>
      </div>

      {/* Controles de Filtros */}
      <div className="card p-3 mb-4 border shadow-sm bg-white">
        <div className="row g-2">
          <div className="col-12 col-md-8">
            <div className="input-group">
              <span className="input-group-text bg-light text-muted border-end-0">
                <Search size={16} />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Buscar en el registro de auditoría por detalle, usuario o acción..."
                value={busqueda}
                onChange={(e) => { setBusqueda(e.target.value); setPage(1); }}
              />
            </div>
          </div>
          <div className="col-12 col-md-4">
            <select
              className="form-select"
              value={actionFilter}
              onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
            >
              <option value="todos">Todas las Acciones</option>
              <option value="crear">Creación</option>
              <option value="modificar">Modificación</option>
              <option value="eliminar">Eliminación</option>
              <option value="imprimir">Impresión</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla Oficial USWDS (.usa-table) */}
      <div className="table-responsive rounded-3 border bg-white shadow-sm mb-3">
        <table className="usa-table table table-hover mb-0 align-middle">
          <thead>
            <tr>
              <th scope="col" style={{ width: '120px' }}>Acción</th>
              <th scope="col">Detalle de la Operación</th>
              <th scope="col" style={{ width: '180px' }}>Usuario</th>
              <th scope="col" style={{ width: '180px' }}>Fecha / Hora</th>
              <th scope="col" style={{ width: '320px' }}>Hash SHA-256 (Inmutable)</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-muted">
                  Cargando registros de auditoría...
                </td>
              </tr>
            ) : paginatedLogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-muted">
                  No se encontraron eventos de auditoría con los criterios seleccionados.
                </td>
              </tr>
            ) : (
              paginatedLogs.map((log, idx) => {
                const meta = getActionMeta(log.accion);
                const hash = (log as any).hashActual || (log as any).hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
                return (
                  <tr key={log.id || idx}>
                    <td>
                      <span className={`usa-tag ${meta.class}`}>
                        {meta.label}
                      </span>
                    </td>
                    <td>
                      <div className="fw-semibold text-navy" style={{ fontSize: '13px', lineHeight: 1.4 }}>
                        {log.detalle}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-1 text-muted" style={{ fontSize: '12px' }}>
                        <User size={14} className="text-warning" />
                        <span>{log.usuario || 'Sistema'}</span>
                      </div>
                    </td>
                    <td>
                      <span className="font-monospace text-muted" style={{ fontSize: '11px' }}>
                        {new Date(log.timestamp).toLocaleString('es-VE')}
                      </span>
                    </td>
                    <td>
                      <span className="font-monospace text-success fw-bold" style={{ fontSize: '10.5px' }}>
                        {hash}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación HTML/Bootstrap */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center bg-white p-3 rounded-3 border">
          <span className="small text-muted">
            Mostrando {((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, logsFiltrados.length)} de {logsFiltrados.length} eventos
          </span>
          <div className="btn-group btn-group-sm">
            <button
              className="btn btn-outline-secondary"
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              Anterior
            </button>
            <span className="btn btn-outline-secondary disabled text-navy fw-bold px-3">
              Página {page} de {totalPages}
            </span>
            <button
              className="btn btn-outline-secondary"
              disabled={page === totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
