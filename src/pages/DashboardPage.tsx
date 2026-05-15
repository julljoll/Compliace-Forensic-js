import { useCMSStore } from '../store/cmsStore';
import {
  FolderOpen, ShieldCheck, AlertTriangle, Clock,
  TrendingUp, Activity, FileSearch, Gavel, Scale
} from 'lucide-react';
import { Link } from 'react-router-dom';
import KpiCard from '../components/Shared/KpiCard';

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

const CUMPLIMIENTO_CONFIG: Record<string, { icon: any; color: string; label: string }> = {
  conforme:     { icon: ShieldCheck, color: 'text-green-400', label: 'Conforme' },
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

  return (
    <div className="space-y-8 animate-fade-in">

      {/* ── Encabezado ─────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Panel de Control Forense</h1>
          <p className="text-sm text-cms-textMuted font-medium max-w-lg">
            Supervisión técnica de dispositivos consignados bajo normativas <span className="text-cms-accent">ISO 27037</span> y <span className="text-cms-accent">MUCC-2017</span>.
          </p>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-cms-textMuted uppercase tracking-wider">Estado Global</span>
              <span className="text-sm font-black text-green-400 flex items-center gap-1.5">
                <Activity size={14} className="animate-pulse" /> SISTEMA OPERATIVO
              </span>
           </div>
        </div>
      </div>

      {/* ── KPIs ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total Casos" value={stats.totalCasos} sub={`${stats.casosActivos} activos actualmente`} icon={FolderOpen} />
        <KpiCard title="Casos Activos" value={stats.casosActivos} sub="En fase de procesamiento" icon={TrendingUp} color="text-blue-400" />
        <KpiCard title="Nivel Compliance" value={`${stats.cumplimientoGeneral}%`} sub={`${stats.casosConformidad} casos validados`} icon={ShieldCheck} accent color={stats.cumplimientoGeneral >= 80 ? 'text-green-400' : stats.cumplimientoGeneral >= 50 ? 'text-yellow-400' : 'text-red-400'} />
        <KpiCard title="Alertas" value={stats.tareasPendientes} sub="Requieren atención inmediata" icon={AlertTriangle} color="text-orange-400" />
      </div>

      {/* ── Cuerpo ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Casos Recientes */}
        <div className="lg:col-span-2 cms-card overflow-hidden bg-cms-sidebar/20">
          <div className="p-5 border-b border-cms-border flex items-center justify-between bg-cms-surface/10">
            <h2 className="font-bold text-white flex items-center gap-2">
              <FileSearch size={18} className="text-cms-accent" />
              Últimas Actualizaciones de Casos
            </h2>
            <Link to="/casos" className="text-xs font-bold text-cms-accent hover:text-cms-accent2 transition-colors uppercase tracking-wider">Ver todos</Link>
          </div>
          <div className="divide-y divide-cms-border/30">
            {recientes.length === 0 ? (
              <div className="p-12 text-center">
                <FolderOpen size={40} className="text-cms-textMuted mx-auto mb-3 opacity-20" />
                <p className="text-sm text-cms-textMuted">No hay registros recientes.</p>
              </div>
            ) : recientes.map(caso => {
              const estado = ESTADO_LABEL[caso.estado] || ESTADO_LABEL.iniciado;
              const cumpl = CUMPLIMIENTO_CONFIG[caso.nivelCumplimientoGeneral] || CUMPLIMIENTO_CONFIG.no_aplica;
              const CumplIcon = cumpl.icon;
              return (
                <Link to={`/casos/${caso.id}`} key={caso.id}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-cms-accent/5 transition-all group">
                  <div className={`w-1.5 h-10 rounded-full ${PRIORIDAD_COLOR[caso.prioridad]} shrink-0 shadow-[0_0_8px_rgba(0,0,0,0.3)]`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-black text-cms-accent group-hover:text-cms-accent2 transition-colors">{caso.numeroCaso}</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-tighter ${estado.color}`}>{estado.label}</span>
                    </div>
                    <p className="text-sm font-bold text-white truncate group-hover:translate-x-1 transition-transform">{caso.titulo}</p>
                    <p className="text-xs text-cms-textMuted font-medium italic">{caso.pertiLider}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className={`p-1.5 rounded-lg ${cumpl.color.replace('text', 'bg')}/10`}>
                      <CumplIcon size={14} className={cumpl.color} />
                    </div>
                    <div className="text-[10px] font-mono font-bold text-cms-textMuted">{caso.porcentajeCompletado}%</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Panel Derecho */}
        <div className="space-y-6">

          {/* Normativas Activas */}
          <div className="cms-card p-6 bg-cms-sidebar/30 border-cms-accent/5">
            <h3 className="font-bold text-white text-sm flex items-center gap-2 mb-5">
              <Scale size={16} className="text-cms-accent" />
              Marco Normativo Vigente
            </h3>
            <div className="space-y-3">
              {normativas.filter(n => n.activa).slice(0, 5).map(n => (
                <div key={n.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-cms-accent/40 group-hover:bg-cms-accent transition-colors" />
                    <span className="text-xs font-bold text-cms-textMuted group-hover:text-white transition-colors truncate">{n.codigo}</span>
                  </div>
                  <span className="text-[9px] font-black px-2 py-0.5 rounded bg-cms-bg text-cms-textMuted border border-cms-border group-hover:border-cms-accent/30 transition-colors uppercase tracking-widest">{n.tipo}</span>
                </div>
              ))}
              <div className="pt-4 border-t border-cms-border/30 mt-4">
                <Link to="/normativas" className="block text-center text-[10px] font-black text-cms-accent hover:text-cms-accent2 transition-colors uppercase tracking-widest">
                  Ver {normativas.length} Normativas
                </Link>
              </div>
            </div>
          </div>

          {/* Tareas Críticas */}
          {tareasUrgentes.length > 0 && (
            <div className="cms-card p-6 border-red-500/30 bg-red-500/5 animate-pulse-slow">
              <h3 className="font-bold text-red-400 text-sm flex items-center gap-2 mb-5">
                <AlertTriangle size={16} />
                Acciones Requeridas
              </h3>
              <div className="space-y-3">
                {tareasUrgentes.map(t => (
                  <div key={t.id} className="text-xs p-3 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/15 transition-colors">
                    <p className="text-white font-bold truncate mb-1">{t.titulo}</p>
                    <div className="flex justify-between items-center">
                       <span className="text-red-300/80 font-medium">{t.asignadoA}</span>
                       <span className="text-[9px] font-black uppercase text-red-400">CRÍTICO</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Log de Auditoría ───────────────────────────── */}
      {logsRecientes.length > 0 && (
        <div className="cms-card overflow-hidden bg-cms-sidebar/10">
          <div className="p-5 border-b border-cms-border flex items-center justify-between bg-cms-surface/5">
            <h2 className="font-bold text-white flex items-center gap-2">
              <Activity size={18} className="text-cms-accent" />
              Trazabilidad y Auditoría (Live)
            </h2>
            <Link to="/auditoria" className="text-xs font-bold text-cms-accent hover:text-cms-accent2 transition-colors uppercase tracking-wider">Historial completo</Link>
          </div>
          <div className="divide-y divide-cms-border/30">
            {logsRecientes.map(log => (
              <div key={log.id} className="flex items-center gap-4 px-5 py-3 hover:bg-cms-surface/20 transition-colors">
                <div className={`w-2 h-2 rounded-full shrink-0 shadow-sm ${
                  log.nivel === 'success' ? 'bg-green-400 shadow-green-400/20' :
                  log.nivel === 'warning' ? 'bg-yellow-400 shadow-yellow-400/20' :
                  log.nivel === 'error' ? 'bg-red-400 shadow-red-400/20' : 'bg-cms-accent shadow-cms-accent/20'
                }`} />
                <div className="w-40 shrink-0">
                   <span className="font-mono text-[10px] font-black text-cms-accent uppercase tracking-tighter">{log.accion}</span>
                </div>
                <span className="text-xs text-cms-textMuted flex-1 truncate font-medium">{log.detalle}</span>
                <span className="text-[10px] font-mono text-cms-textMuted/60 shrink-0 tabular-nums">{new Date(log.timestamp).toLocaleString('es')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Estado sin datos ───────────────────────────── */}
      {casos.length === 0 && (
        <div className="cms-card p-16 text-center border-dashed border-2 border-cms-border bg-cms-accent/5">
          <div className="w-20 h-20 bg-cms-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Gavel size={40} className="text-cms-accent" />
          </div>
          <h3 className="text-2xl font-black text-white mb-3 tracking-tight">Bienvenido al Sistema de Compliance Forense</h3>
          <p className="text-cms-textMuted text-sm mb-8 max-w-lg mx-auto leading-relaxed">
            Plataforma centralizada para la gestión de peritajes digitales, control de cadena de custodia 
            y cumplimiento normativo <span className="font-bold text-cms-text">ISO/IEC</span>. Comience registrando un nuevo caso para iniciar el flujo técnico.
          </p>
          <Link to="/casos" className="cms-btn cms-btn-primary px-10 py-3 inline-flex items-center gap-3 shadow-xl shadow-cms-accent/30 hover:scale-105 transition-transform">
            <FolderOpen size={18} strokeWidth={2.5} />
            Iniciar Nueva Gestión
          </Link>
        </div>
      )}
    </div>
  );
}
