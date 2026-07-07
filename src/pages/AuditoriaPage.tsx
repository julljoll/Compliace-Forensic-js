import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCMSStore } from '../store/cmsStore';
import { useAuditStore } from '../store/auditStore';
import {
  Activity, Printer, Clock,
  Search, ShieldCheck, AlertTriangle, Check,
  FolderOpen, ChevronRight, X, Hash, User, Filter, ArrowLeft
} from '../components/atoms/AppleIcon';

import Card from '../components/atoms/Card';
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

const ACTION_META: Record<string, { label: string; color: string; bg: string; border: string }> = {
  crear:     { label: 'CREAR',     color: 'var(--co-green)',  bg: 'rgba(52,199,89,0.08)',  border: 'rgba(52,199,89,0.25)'  },
  eliminar:  { label: 'ELIMINAR',  color: 'var(--co-red)',    bg: 'rgba(255,59,48,0.08)',  border: 'rgba(255,59,48,0.25)'  },
  modificar: { label: 'MODIFICAR', color: 'var(--co-blue)',   bg: 'rgba(0,122,255,0.08)',  border: 'rgba(0,122,255,0.25)'  },
  verificar: { label: 'VERIFICAR', color: 'var(--co-purple)', bg: 'rgba(175,82,222,0.08)', border: 'rgba(175,82,222,0.25)' },
  imprimir:  { label: 'IMPRIMIR',  color: 'var(--co-indigo)', bg: 'rgba(88,86,214,0.08)',  border: 'rgba(88,86,214,0.25)'  },
  default:   { label: 'SISTEMA',   color: 'var(--co-gray-1)', bg: 'var(--co-surface-3)',   border: 'var(--co-gray-4)'      },
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

const ESTADO_META: Record<string, { label: string; color: string; bg: string; border: string; dot: string }> = {
  iniciado:   { label: 'Iniciado',   color: 'var(--co-blue)',   bg: 'rgba(0,122,255,0.08)',   border: 'rgba(0,122,255,0.2)',   dot: 'var(--co-blue)'   },
  en_proceso: { label: 'En Proceso', color: 'var(--co-orange)', bg: 'rgba(255,149,0,0.08)',   border: 'rgba(255,149,0,0.2)',   dot: 'var(--co-orange)' },
  analisis:   { label: 'Análisis',   color: 'var(--co-purple)', bg: 'rgba(175,82,222,0.08)',  border: 'rgba(175,82,222,0.2)',  dot: 'var(--co-purple)' },
  informe:    { label: 'Informe',    color: 'var(--co-indigo)', bg: 'rgba(88,86,214,0.08)',   border: 'rgba(88,86,214,0.2)',   dot: 'var(--co-indigo)' },
  cerrado:    { label: 'Cerrado',    color: 'var(--co-green)',  bg: 'rgba(52,199,89,0.08)',   border: 'rgba(52,199,89,0.2)',   dot: 'var(--co-green)'  },
  archivado:  { label: 'Archivado',  color: 'var(--co-gray-1)', bg: 'var(--co-surface-3)',    border: 'var(--co-gray-4)',      dot: 'var(--co-gray-2)' },
};

const TIPO_LABEL: Record<string, string> = {
  forense_whatsapp:  'Móvil Android',
  forense_email:     'Correo Electrónico',
  forense_discoduro: 'Computadora / Disco',
};

const SESSION_ACTIONS = new Set(['INICIO_SESION', 'SISTEMA_INICIADO', 'SESION_CERRADA']);

// ── Main Component ─────────────────────────────────────────────────────────────

export default function AuditoriaPage() {
  const navigate  = useNavigate();
  const { casos, auditLogs: cmsLogs } = useCMSStore();
  const storeLogs   = useAuditStore(s => s.logs);
  const loadLogs    = useAuditStore(s => s.loadLogs);
  const verifyChain = useAuditStore(s => s.verifyChain);
  const clearLogs   = useAuditStore(s => s.clearLogs);

  // vista: 'casos' = grid de cards | 'logs' = consola filtrada por caso
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

  // ── Combined logs ──
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

  // ── Event count per case ──
  const countByCaso = useMemo(() => {
    const acc: Record<string, number> = {};
    allLogs.forEach(l => { if (l.casoId) acc[l.casoId] = (acc[l.casoId] || 0) + 1; });
    return acc;
  }, [allLogs]);

  // ── Last event timestamp per case ──
  const lastEventByCaso = useMemo(() => {
    const acc: Record<string, string> = {};
    allLogs.forEach(l => { if (l.casoId && !acc[l.casoId]) acc[l.casoId] = l.timestamp; });
    return acc;
  }, [allLogs]);

  // ── Filtered logs for log view ──
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

  // ── KPIs ──
  const kpis = useMemo(() => ({
    totalEvents:    allLogs.length,
    casosActivos:   casos.filter(c => c.estado !== 'archivado' && c.estado !== 'cerrado').length,
    casosAuditados: new Set(allLogs.map(l => l.casoId).filter(Boolean)).size,
    ultimoEvento:   allLogs[0]?.timestamp || null,
  }), [allLogs, casos]);

  // ── Handlers ──
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

  return (
    <div className="flex flex-col min-h-0 apple-fade-in pb-8">

      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-[var(--co-separator)] pb-4 mb-5 shrink-0">
        <div className="flex items-center gap-3">
          {vista === 'logs' && (
            <button
              onClick={handleBack}
              className="w-8 h-8 rounded-full flex items-center justify-center border border-[var(--co-separator)] text-[var(--co-gray-1)] hover:bg-[var(--co-surface-2)] hover:text-[var(--apple-text)] transition-all"
            >
              <ArrowLeft size={14} />
            </button>
          )}
          <div>
            <h1 className="text-apple-title-1 font-bold text-[var(--apple-text)] flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-[8px] bg-[var(--co-accent)]/10 border border-[var(--co-accent)]/20 flex items-center justify-center">
                <Activity className="text-[var(--co-accent)]" size={18} strokeWidth={2.5} />
              </div>
              {vista === 'casos' ? 'Consola de Auditoría Forense' : (
                <span className="flex items-center gap-2">
                  Auditoría
                  <ChevronRight size={16} className="text-[var(--co-gray-2)]" />
                  <span className="text-[var(--co-accent)]">{casoCurrent?.numeroCaso}</span>
                </span>
              )}
            </h1>
            <p className="text-[13px] text-[var(--co-gray-1)] font-medium mt-0.5">
              {vista === 'casos'
                ? 'Seleccione un expediente para auditar su trazabilidad y línea de tiempo de cumplimiento'
                : `${casoCurrent?.titulo} — SHA-256 Chain · MUCC-2017 · ISO/IEC 27037`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            onClick={handleVerify}
            variant="primary"
            size="sm"
            disabled={verificando || allLogs.length === 0}
            className="gap-1.5"
          >
            <ShieldCheck size={14} strokeWidth={2.5} />
            {verificando ? 'Verificando...' : 'Verificar SHA-256'}
          </Button>
          {vista === 'logs' && casoId && (
            <Button
              onClick={() => navigate(`/planillas/timeline-compliance?casoId=${casoId}`)}
              variant="secondary"
              size="sm"
              className="gap-1.5 font-semibold"
            >
              <Printer size={14} />
              Imprimir Línea de Tiempo
            </Button>
          )}
        </div>
      </div>

      {/* ── KPI Strip ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5 shrink-0">
        {[
          { label: 'Total Eventos',    value: kpis.totalEvents,    icon: <Hash size={14}/>,     color: 'var(--co-accent)'  },
          { label: 'Casos Auditados',  value: kpis.casosAuditados, icon: <FolderOpen size={14}/>,color: 'var(--co-purple)' },
          { label: 'Casos Activos',    value: kpis.casosActivos,   icon: <Activity size={14}/>, color: 'var(--co-green)'   },
          { label: 'Último Evento',    value: kpis.ultimoEvento ? getRelativeTime(kpis.ultimoEvento) : '—', icon: <Clock size={14}/>, color: 'var(--co-orange)' },
        ].map((k, i) => (
          <Card key={i} className="p-3.5 flex items-center gap-3" hoverable={false}>
            <div className="w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0"
              style={{ background: `color-mix(in srgb, ${k.color} 12%, transparent)` }}>
              <span style={{ color: k.color }}>{k.icon}</span>
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-semibold text-[var(--co-gray-1)] uppercase tracking-wider leading-none">{k.label}</div>
              <div className="text-[18px] font-bold text-[var(--apple-text)] leading-tight mt-0.5 tabular-nums">{k.value}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* ── Integrity Alert ── */}
      {integridad && (
        <div className={`flex items-center gap-3 p-3.5 mb-4 rounded-[12px] border shrink-0 ${
          integridad.valid
            ? 'bg-[var(--co-green)]/5 border-[var(--co-green)]/20'
            : 'bg-[var(--co-red)]/5 border-[var(--co-red)]/20'
        }`}>
          {integridad.valid
            ? <ShieldCheck size={18} className="shrink-0 text-[var(--co-green)]" />
            : <AlertTriangle size={18} className="shrink-0 text-[var(--co-red)]" />}
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-[var(--apple-text)]">
              {integridad.valid ? 'Integridad Verificada ✓' : 'Alerta de Integridad'}
            </p>
            <p className="text-[12px] text-[var(--co-gray-1)] mt-0.5">{integridad.message}</p>
          </div>
          <button onClick={() => setIntegridad(null)}
            className="shrink-0 p-1.5 rounded-full hover:bg-[var(--co-surface-3)] text-[var(--co-gray-1)] transition-all">
            <X size={12} />
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════
          VISTA: GRID DE EXPEDIENTES (CARDS)
      ══════════════════════════════════════════ */}
      {vista === 'casos' && (
        <div>
          <p className="text-[11px] font-bold text-[var(--co-gray-1)] uppercase tracking-wider mb-4">
            {casos.length} Expediente{casos.length !== 1 ? 's' : ''} — Seleccione uno para auditar
          </p>

          {casos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <FolderOpen size={48} className="text-[var(--co-gray-3)] mb-4" />
              <p className="text-[16px] font-semibold text-[var(--co-gray-1)]">Sin expedientes registrados</p>
              <p className="text-[13px] text-[var(--co-gray-2)] mt-1">Cree un nuevo caso para comenzar la trazabilidad forense.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {casos.map(c => {
                const meta    = ESTADO_META[c.estado] || ESTADO_META.iniciado;
                const count   = countByCaso[c.id] || 0;
                const lastEvt = lastEventByCaso[c.id];
                const pct     = c.porcentajeCompletado || 0;

                return (
                  <button
                    key={c.id}
                    onClick={() => handleSelectCaso(c.id)}
                    className="text-left w-full group"
                  >
                    <Card className="p-4 h-full flex flex-col gap-3 border border-[var(--co-separator)] hover:border-[var(--co-accent)]/30 hover:shadow-[0_0_0_3px_rgba(0,113,227,0.08)] transition-all duration-200">

                      {/* Top row */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-7 h-7 rounded-[6px] flex items-center justify-center shrink-0"
                            style={{ background: meta.bg, border: `1px solid ${meta.border}` }}>
                            <div className="w-2 h-2 rounded-full" style={{ background: meta.dot }} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[11px] font-bold text-[var(--co-accent)] truncate leading-none">
                              {c.numeroCaso || 'Sin Nro'}
                            </p>
                            <p className="text-[9px] font-semibold text-[var(--co-gray-2)] mt-0.5 uppercase tracking-wide">
                              {TIPO_LABEL[c.tipoProyecto] || c.tipoProyecto}
                            </p>
                          </div>
                        </div>
                        <span
                          className="shrink-0 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-[4px] border"
                          style={{ color: meta.color, background: meta.bg, borderColor: meta.border }}
                        >
                          {meta.label}
                        </span>
                      </div>

                      {/* Title */}
                      <p className="text-[13px] font-semibold text-[var(--apple-text)] leading-snug line-clamp-2 flex-1">
                        {c.titulo}
                      </p>

                      {/* Progress bar */}
                      <div>
                        <div className="flex justify-between text-[10px] font-semibold text-[var(--co-gray-1)] mb-1">
                          <span>Compliance</span>
                          <span className="tabular-nums">{pct}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-[var(--co-surface-3)] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${pct}%`,
                              background: pct >= 80 ? 'var(--co-green)' : pct >= 40 ? 'var(--co-orange)' : 'var(--co-accent)'
                            }}
                          />
                        </div>
                      </div>

                      {/* Footer stats */}
                      <div className="flex items-center justify-between pt-1 border-t border-[var(--co-separator)]">
                        <span className="text-[11px] text-[var(--co-gray-1)] flex items-center gap-1.5">
                          <Activity size={10} />
                          <span className="font-bold tabular-nums text-[var(--apple-text)]">{count}</span>
                          <span>evento{count !== 1 ? 's' : ''}</span>
                        </span>
                        <span className="text-[10px] text-[var(--co-gray-2)] font-medium">
                          {lastEvt ? getRelativeTime(lastEvt) : 'Sin eventos'}
                        </span>
                      </div>

                      {/* CTA hover hint */}
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--co-accent)] opacity-0 group-hover:opacity-100 transition-opacity -mt-1">
                        <Printer size={11} />
                        Ver trazabilidad e imprimir línea de tiempo
                        <ChevronRight size={11} className="ml-auto" />
                      </div>
                    </Card>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════
          VISTA: LOG DETALLADO DEL CASO
      ══════════════════════════════════════════ */}
      {vista === 'logs' && casoCurrent && (
        <div className="flex flex-col gap-3 flex-1 min-h-0">

          {/* Case summary header */}
          <Card className="p-4 flex flex-col sm:flex-row sm:items-center gap-4" hoverable={false}>
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
                style={{ background: estadoMeta?.bg, border: `1px solid ${estadoMeta?.border}`, color: estadoMeta?.color }}>
                <FolderOpen size={18} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-[15px] font-bold text-[var(--apple-text)]">{casoCurrent.titulo}</p>
                  <span
                    className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-[4px] border"
                    style={{ color: estadoMeta?.color, background: estadoMeta?.bg, borderColor: estadoMeta?.border }}
                  >
                    {estadoMeta?.label}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-0.5 text-[11px] text-[var(--co-gray-1)] font-medium flex-wrap">
                  <span className="flex items-center gap-1"><Hash size={10} />{casoCurrent.numeroCaso}</span>
                  <span className="flex items-center gap-1"><User size={10} />{casoCurrent.peritoLider || 'Sin asignar'}</span>
                  <span className="flex items-center gap-1"><Activity size={10} />
                    <strong className="text-[var(--apple-text)]">{logsFiltrados.length}</strong>&nbsp;eventos
                  </span>
                  <span className="flex items-center gap-1">
                    Compliance: <strong className="text-[var(--apple-text)]">{casoCurrent.porcentajeCompletado || 0}%</strong>
                  </span>
                </div>
              </div>
            </div>
            <Button
              onClick={() => navigate(`/planillas/timeline-compliance?casoId=${casoId}`)}
              variant="primary"
              size="sm"
              className="gap-1.5 shrink-0 whitespace-nowrap"
            >
              <Printer size={14} />
              Imprimir Línea de Tiempo
            </Button>
          </Card>

          {/* Toolbar */}
          <Card className="p-2.5 flex flex-col sm:flex-row gap-2 shrink-0" hoverable={false}>
            <div className="relative flex-1">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--co-gray-1)]" />
              <input
                type="text"
                placeholder="Buscar eventos, peritos, acciones..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                className="w-full text-[13px] bg-[var(--co-surface-2)] text-[var(--apple-text)] border border-[var(--co-gray-5)] rounded-[8px] pl-9 pr-3 py-2 outline-none focus:border-[var(--co-accent)] focus:ring-[2px] focus:ring-[var(--co-accent)]/20 transition-all"
              />
              {busqueda && (
                <button onClick={() => setBusqueda('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--co-gray-2)] hover:text-[var(--apple-text)]">
                  <X size={12} />
                </button>
              )}
            </div>
            <select
              value={actionFilter}
              onChange={e => setActionFilter(e.target.value)}
              className="bg-[var(--co-surface-2)] border border-[var(--co-gray-5)] rounded-[8px] text-[12px] font-semibold px-3 py-2 outline-none text-[var(--apple-text)] cursor-pointer"
            >
              <option value="todos">Todas las acciones</option>
              <option value="crear">Creaciones</option>
              <option value="modificar">Modificaciones</option>
              <option value="eliminar">Eliminaciones</option>
              <option value="imprimir">Impresiones</option>
            </select>
            <button
              onClick={() => { setVista('casos'); setCasoId(null); }}
              className="flex items-center gap-1.5 text-[12px] font-semibold text-[var(--co-gray-1)] hover:text-[var(--apple-text)] px-3 py-2 rounded-[8px] border border-[var(--co-separator)] hover:bg-[var(--co-surface-2)] transition-all"
            >
              <Filter size={12} />
              Cambiar caso
            </button>
            {allLogs.length > 0 && (
              <button
                onClick={handleClearLogs}
                className="text-[12px] font-semibold text-[var(--co-red)] hover:bg-[var(--co-red)]/8 px-3 py-2 rounded-[8px] border border-transparent hover:border-[var(--co-red)]/20 transition-all shrink-0"
              >
                Vaciar log
              </button>
            )}
          </Card>

          {/* Log list */}
          <Card className="p-0 overflow-hidden flex flex-col" hoverable={false}>
            <div className="px-4 py-2.5 border-b border-[var(--co-separator)] bg-[var(--co-surface-2)] flex items-center justify-between shrink-0">
              <span className="text-[11px] font-bold text-[var(--co-gray-1)] uppercase tracking-wider flex items-center gap-1.5">
                <Activity size={11} /> Trazabilidad del Proceso
              </span>
              <span className="text-[10px] font-semibold text-[var(--co-gray-2)]">{logsFiltrados.length} entradas</span>
            </div>

            <div className="overflow-y-auto max-h-[50vh]">
              {loading ? (
                <div className="py-16 text-center text-[var(--co-gray-1)] text-sm animate-pulse">
                  Cargando registros criptográficos...
                </div>
              ) : logsFiltrados.length === 0 ? (
                <div className="py-16 text-center">
                  <Clock size={36} className="text-[var(--co-gray-3)] mx-auto mb-3 opacity-40" />
                  <p className="text-[14px] font-semibold text-[var(--co-gray-1)]">Sin eventos para este caso</p>
                  <p className="text-[12px] text-[var(--co-gray-2)] mt-1">Este expediente aún no tiene eventos registrados en la cadena de auditoría.</p>
                </div>
              ) : (
                logsFiltrados.map((log, idx) => {
                  const meta    = getActionMeta(log.accion);
                  const isLast  = idx === logsFiltrados.length - 1;
                  return (
                    <div
                      key={log.id || idx}
                      className={`flex items-start gap-3 px-4 py-3 hover:bg-[var(--co-surface-2)]/40 transition-colors group ${!isLast ? 'border-b border-[var(--co-separator)]' : ''}`}
                    >
                      {/* Timeline dot + line */}
                      <div className="flex flex-col items-center shrink-0 mt-1" style={{ width: '16px' }}>
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ background: meta.color }} />
                        {!isLast && <div className="w-px flex-1 mt-1" style={{ background: 'var(--co-separator)', minHeight: '20px' }} />}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span
                            className="text-[9.5px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-[4px] border leading-none"
                            style={{ color: meta.color, background: meta.bg, borderColor: meta.border }}
                          >
                            {meta.label}
                          </span>
                          {log.hashActual && (
                            <span className="text-[9px] font-bold text-[var(--co-green)] bg-[var(--co-green)]/8 border border-[var(--co-green)]/20 rounded-full px-2 py-0.5 flex items-center gap-1">
                              <Check size={9} strokeWidth={3} /> SHA-256
                            </span>
                          )}
                        </div>
                        <p className="text-[13px] font-medium text-[var(--apple-text)] leading-snug" title={log.detalle}>
                          {log.detalle}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-1.5">
                          <span className="text-[11px] text-[var(--co-gray-1)] flex items-center gap-1">
                            <User size={10} /> {log.usuario}
                          </span>
                          {(log.hashActual || log.hashAnterior) && (
                            <span className="text-[10px] font-mono text-[var(--co-gray-2)] flex items-center gap-1">
                              <Hash size={9} />
                              {log.hashAnterior ? `${log.hashAnterior.slice(0, 6)}…` : '000000…'}
                              <ChevronRight size={9} className="opacity-40" />
                              <span style={{ color: 'var(--co-accent)' }}>{log.hashActual ? `${log.hashActual.slice(0, 6)}…` : '—'}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Timestamp */}
                      <div className="shrink-0 text-right">
                        <p className="text-[10.5px] font-semibold text-[var(--co-gray-1)] tabular-nums whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleDateString('es-VE', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                          {' '}
                          {new Date(log.timestamp).toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </p>
                        <p className="text-[9.5px] text-[var(--co-gray-2)] mt-0.5">{getRelativeTime(log.timestamp)}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
