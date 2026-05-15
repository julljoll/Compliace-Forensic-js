import { useCMSStore } from '../store/cmsStore';
import {
  FolderOpen, ShieldCheck, AlertTriangle, CheckCircle2, Clock,
  TrendingUp, Activity, FileSearch, Scale, Gavel
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ESTADO_LABEL: Record<string, { label: string; color: string }> = {
  iniciado:    { label: 'Iniciado',    color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  en_proceso:  { label: 'En Proceso',  color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
  analisis:    { label: 'Análisis',    color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  informe:     { label: 'Informe',     color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
  cerrado:     { label: 'Cerrado',     color: 'bg-green-500/20 text-green-300 border-green-500/30' },
  archivado:   { label: 'Archivado',   color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
};

const PRIORIDAD_COLOR: Record<string, string> = {
  critica: 'bg-red-500',
  alta: 'bg-orange-500',
  media: 'bg-yellow-500',
  baja: 'bg-green-500',
};

const CUMPLIMIENTO_CONFIG: Record<string, { icon: typeof CheckCircle2; color: string; label: string }> = {
  conforme:     { icon: CheckCircle2, color: 'text-green-400', label: 'Conforme' },
  parcial:      { icon: AlertTriangle, color: 'text-yellow-400', label: 'Parcial' },
  no_conforme:  { icon: AlertTriangle, color: 'text-red-400', label: 'No Conforme' },
  no_aplica:    { icon: Clock, color: 'text-gray-400', label: 'N/A' },
};

export default function DashboardPage() {
  const casos = useCMSStore(state => state.casos);
  const tareas = useCMSStore(state => state.tareas);
  const normativas = useCMSStore(state => state.normativas);
  const auditLogs = useCMSStore(state => state.auditLogs);
  const getEstadisticas = useCMSStore(state => state.getEstadisticas);
  const stats = getEstadisticas();

  const recientes = [...casos].sort((a, b) =>
    new Date(b.fechaUltimaActualizacion).getTime() - new Date(a.fechaUltimaActualizacion).getTime()
  ).slice(0, 5);

  const logsRecientes = auditLogs.slice(0, 6);

  const tareasUrgentes = tareas.filter(t => t.estado !== 'completada' && t.prioridad === 'critica').slice(0, 4);

  const KpiCard = ({ title, value, sub, icon: Icon, accent = false, color = 'text-cms-accent' }: {
    title: string; value: string | number; sub?: string;
    icon: typeof FolderOpen; accent?: boolean; color?: string;
  }) => (
    <div className={`cms-card p-6 ${accent ? 'border-cms-accent/40 bg-cms-accent/5' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <p className="text-xs font-bold uppercase tracking-widest text-cms-textMuted">{title}</p>
        <Icon size={18} className={color} />
      </div>
      <div className={`text-3xl font-black mb-1 ${color}`}>{value}</div>
      {sub && <p className="text-xs text-cms-textMuted">{sub}</p>}
    </div>
  );

  return (
    <div className="space-y-8">

      {/* ── Encabezado ─────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-black text-white mb-1">Panel de Peritaje WhatsApp</h1>
        <p className="text-sm text-cms-textMuted">
          Supervisión y control del proceso técnico · Contratos Digitales · Normativas ISO / MUCC-2017
        </p>
      </div>

      {/* ── KPIs ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total Casos" value={stats.totalCasos} sub={`${stats.casosActivos} activos`} icon={FolderOpen} />
        <KpiCard title="Casos Activos" value={stats.casosActivos} sub="En seguimiento" icon={TrendingUp} color="text-blue-400" />
        <KpiCard title="Cumplimiento" value={`${stats.cumplimientoGeneral}%`} sub={`${stats.casosConformidad} conformes`} icon={ShieldCheck} accent color={stats.cumplimientoGeneral >= 80 ? 'text-green-400' : stats.cumplimientoGeneral >= 50 ? 'text-yellow-400' : 'text-red-400'} />
        <KpiCard title="Tareas Pendientes" value={stats.tareasPendientes} sub="Requieren acción" icon={Clock} color="text-orange-400" />
      </div>

      {/* ── Cuerpo ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Casos Recientes */}
        <div className="lg:col-span-2 cms-card overflow-hidden">
          <div className="p-5 border-b border-cms-border flex items-center justify-between">
            <h2 className="font-bold text-white flex items-center gap-2">
              <FileSearch size={16} className="text-cms-accent" />
              Casos Recientes
            </h2>
            <Link to="/casos" className="text-xs text-cms-accent hover:underline">Ver todos →</Link>
          </div>
          <div className="divide-y divide-cms-border">
            {recientes.length === 0 ? (
              <div className="p-8 text-center text-cms-textMuted text-sm">
                No hay casos registrados aún.{' '}
                <Link to="/casos" className="text-cms-accent hover:underline">Crear el primero →</Link>
              </div>
            ) : recientes.map(caso => {
              const estado = ESTADO_LABEL[caso.estado] || ESTADO_LABEL.iniciado;
              const cumpl = CUMPLIMIENTO_CONFIG[caso.nivelCumplimientoGeneral] || CUMPLIMIENTO_CONFIG.no_aplica;
              const CumplIcon = cumpl.icon;
              return (
                <Link to={`/casos/${caso.id}`} key={caso.id}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-cms-surface/50 transition-colors">
                  <div className={`w-1.5 h-10 rounded-full ${PRIORIDAD_COLOR[caso.prioridad]} shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono text-xs font-bold text-cms-accent">{caso.numeroCaso}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${estado.color}`}>{estado.label}</span>
                    </div>
                    <p className="text-sm text-white truncate">{caso.titulo}</p>
                    <p className="text-xs text-cms-textMuted">{caso.pertiLider}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <CumplIcon size={14} className={cumpl.color} />
                    <div className="text-[10px] text-cms-textMuted">{caso.porcentajeCompletado}%</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Panel Derecho */}
        <div className="space-y-4">

          {/* Normativas Activas */}
          <div className="cms-card p-5">
            <h3 className="font-bold text-white text-sm flex items-center gap-2 mb-4">
              <Scale size={15} className="text-cms-accent" />
              Marco Normativo Activo
            </h3>
            <div className="space-y-2">
              {normativas.filter(n => n.activa).slice(0, 5).map(n => (
                <div key={n.id} className="flex items-center gap-2.5 group">
                  <div className="w-1.5 h-1.5 rounded-full bg-cms-accent shrink-0" />
                  <span className="text-xs text-cms-textMuted group-hover:text-white transition-colors truncate">{n.codigo}</span>
                  <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded bg-cms-surface text-cms-textMuted border border-cms-border shrink-0">{n.tipo}</span>
                </div>
              ))}
              <Link to="/normativas" className="block text-center text-[10px] text-cms-accent hover:underline pt-1">
                Ver {normativas.length} normativas →
              </Link>
            </div>
          </div>

          {/* Tareas Críticas */}
          {tareasUrgentes.length > 0 && (
            <div className="cms-card p-5 border-red-500/20">
              <h3 className="font-bold text-white text-sm flex items-center gap-2 mb-4">
                <AlertTriangle size={15} className="text-red-400" />
                Tareas Críticas
              </h3>
              <div className="space-y-2">
                {tareasUrgentes.map(t => (
                  <div key={t.id} className="text-xs p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                    <p className="text-white font-semibold truncate">{t.titulo}</p>
                    <p className="text-red-300 mt-0.5">{t.asignadoA}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Log de Auditoría ───────────────────────────── */}
      {logsRecientes.length > 0 && (
        <div className="cms-card overflow-hidden">
          <div className="p-5 border-b border-cms-border flex items-center justify-between">
            <h2 className="font-bold text-white flex items-center gap-2">
              <Activity size={16} className="text-cms-accent" />
              Registro de Auditoría Reciente
            </h2>
            <Link to="/auditoria" className="text-xs text-cms-accent hover:underline">Ver completo →</Link>
          </div>
          <div className="divide-y divide-cms-border">
            {logsRecientes.map(log => (
              <div key={log.id} className="flex items-center gap-4 px-5 py-2.5 text-xs">
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  log.nivel === 'success' ? 'bg-green-400' :
                  log.nivel === 'warning' ? 'bg-yellow-400' :
                  log.nivel === 'error' ? 'bg-red-400' : 'bg-blue-400'
                }`} />
                <span className="font-mono font-bold text-cms-accent w-36 shrink-0 truncate">{log.accion}</span>
                <span className="text-cms-textMuted flex-1 truncate">{log.detalle}</span>
                <span className="text-cms-textMuted shrink-0">{new Date(log.timestamp).toLocaleString('es')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Estado sin datos ───────────────────────────── */}
      {casos.length === 0 && (
        <div className="cms-card p-12 text-center">
          <Gavel size={40} className="text-cms-accent mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-white mb-2">Bienvenido al CMS de Peritaje</h3>
          <p className="text-cms-textMuted text-sm mb-6 max-w-md mx-auto">
            Este sistema permite gestionar peritajes privados sobre dispositivos consignados bajo normativas legales,
            MUCC-2017 y NIST SP 800-101. Comienza creando tu primer caso.
          </p>
          <Link to="/casos" className="cms-btn cms-btn-primary inline-flex items-center gap-2">
            <FolderOpen size={16} />
            Gestionar Casos
          </Link>
        </div>
      )}
    </div>
  );
}
