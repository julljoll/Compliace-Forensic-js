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
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Control Center</h1>
          <p className="text-xs md:text-sm text-fluent-text-muted font-medium max-w-lg mt-1">
            Forensic monitoring of consigned devices under <span className="text-fluent-accent">ISO 27037</span> and <span className="text-fluent-accent">MUCC-2017</span> normative frameworks.
          </p>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-fluent-text-muted uppercase tracking-[0.2em]">System Status</span>
              <span className="text-sm font-black text-green-400 flex items-center gap-1.5">
                <Activity size={14} className="animate-pulse" /> ONLINE
              </span>
           </div>
        </div>
      </div>

      {/* ── KPIs ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total Cases" value={stats.totalCasos} sub={`${stats.casosActivos} active records`} icon={FolderOpen} />
        <KpiCard title="Processing" value={stats.casosActivos} sub="In technical phase" icon={TrendingUp} color="text-blue-400" />
        <KpiCard title="Compliance" value={`${stats.cumplimientoGeneral}%`} sub={`${stats.casosConformidad} validated`} icon={ShieldCheck} accent color={stats.cumplimientoGeneral >= 80 ? 'text-green-400' : stats.cumplimientoGeneral >= 50 ? 'text-yellow-400' : 'text-red-400'} />
        <KpiCard title="Security Alerts" value={stats.tareasPendientes} sub="Immediate action required" icon={AlertTriangle} color="text-orange-400" />
      </div>

      {/* ── Cuerpo ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Casos Recientes */}
        <div className="lg:col-span-2 fluent-mica rounded-xl overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <h2 className="font-bold text-white flex items-center gap-2">
              <FileSearch size={18} className="text-fluent-accent" />
              Recent Case Updates
            </h2>
            <Link to="/casos" className="text-[10px] font-bold text-fluent-accent hover:text-fluent-accent-light transition-colors uppercase tracking-[0.15em]">View Directory</Link>
          </div>
          <div className="divide-y divide-white/5">
            {recientes.length === 0 ? (
              <div className="p-16 text-center">
                <FolderOpen size={40} className="text-fluent-text-muted mx-auto mb-4 opacity-20" />
                <p className="text-sm text-fluent-text-muted">No recent activity detected.</p>
              </div>
            ) : recientes.map(caso => {
              const estado = ESTADO_LABEL[caso.estado] || ESTADO_LABEL.iniciado;
              const cumpl = CUMPLIMIENTO_CONFIG[caso.nivelCumplimientoGeneral] || CUMPLIMIENTO_CONFIG.no_aplica;
              const CumplIcon = cumpl.icon;
              return (
                <Link to={`/casos/${caso.id}`} key={caso.id}
                  className="flex items-center gap-4 px-6 py-5 hover:bg-white/[0.03] transition-all group">
                  <div className={`w-1.5 h-10 rounded-full ${PRIORIDAD_COLOR[caso.prioridad]} shrink-0 shadow-lg`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-mono text-xs font-black text-fluent-accent tracking-tighter uppercase">{caso.numeroCaso}</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-[4px] border font-bold uppercase tracking-tight ${estado.color}`}>{estado.label}</span>
                    </div>
                    <p className="text-sm font-bold text-white truncate group-hover:translate-x-1 transition-transform duration-300">{caso.titulo}</p>
                    <p className="text-[11px] text-fluent-text-muted font-medium">{caso.pertiLider}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className={`p-1.5 rounded-md ${cumpl.color.replace('text', 'bg')}/10`}>
                      <CumplIcon size={14} className={cumpl.color} />
                    </div>
                    <div className="text-[10px] font-mono font-bold text-fluent-text-muted opacity-50">{caso.porcentajeCompletado}%</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Panel Derecho */}
        <div className="space-y-6">

          {/* Normativas Activas */}
          <div className="fluent-mica p-6 rounded-xl shadow-xl">
            <h3 className="font-bold text-white text-sm flex items-center gap-2 mb-6">
              <Scale size={16} className="text-fluent-accent" />
              Active Frameworks
            </h3>
            <div className="space-y-4">
              {normativas.filter(n => n.activa).slice(0, 5).map(n => (
                <div key={n.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-fluent-accent/40 group-hover:bg-fluent-accent transition-colors shadow-[0_0_8px_rgba(0,120,212,0.4)]" />
                    <span className="text-xs font-bold text-fluent-text-muted group-hover:text-white transition-colors truncate">{n.codigo}</span>
                  </div>
                  <span className="text-[8px] font-black px-2 py-0.5 rounded bg-white/[0.05] text-fluent-text-muted border border-white/5 group-hover:border-fluent-accent/30 transition-colors uppercase tracking-[0.2em]">{n.tipo}</span>
                </div>
              ))}
              <div className="pt-6 border-t border-white/5 mt-4">
                <Link to="/normativas" className="block text-center text-[10px] font-black text-fluent-accent hover:text-fluent-accent-light transition-colors uppercase tracking-[0.2em]">
                  Compliance Library
                </Link>
              </div>
            </div>
          </div>

          {/* Tareas Críticas */}
          {tareasUrgentes.length > 0 && (
            <div className="fluent-mica p-6 rounded-xl border-red-500/20 bg-red-500/[0.02] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-red-500/30 animate-pulse" />
              <h3 className="font-bold text-red-400 text-sm flex items-center gap-2 mb-6">
                <AlertTriangle size={16} />
                Critical Actions
              </h3>
              <div className="space-y-3">
                {tareasUrgentes.map(t => (
                  <div key={t.id} className="text-xs p-4 rounded-lg bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors">
                    <p className="text-white font-bold truncate mb-1.5">{t.titulo}</p>
                    <div className="flex justify-between items-center">
                       <span className="text-red-300 font-medium opacity-80">{t.asignadoA}</span>
                       <span className="text-[8px] font-black uppercase text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded-[2px] tracking-[0.1em]">Priority</span>
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
        <div className="fluent-mica rounded-xl overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <h2 className="font-bold text-white flex items-center gap-2">
              <Activity size={18} className="text-fluent-accent" />
              Traceability Audit (LIVE)
            </h2>
            <Link to="/auditoria" className="text-[10px] font-bold text-fluent-accent hover:text-fluent-accent-light transition-colors uppercase tracking-[0.15em]">Log History</Link>
          </div>
          <div className="divide-y divide-white/5">
            {logsRecientes.map(log => (
              <div key={log.id} className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4 px-4 sm:px-6 py-4 hover:bg-white/[0.02] transition-colors">
                <div className={`w-2 h-2 rounded-full shrink-0 shadow-[0_0_8px_rgba(0,0,0,0.5)] hidden sm:block ${
                  log.nivel === 'success' ? 'bg-green-400 shadow-green-400/20' :
                  log.nivel === 'warning' ? 'bg-yellow-400 shadow-yellow-400/20' :
                  log.nivel === 'error' ? 'bg-red-400 shadow-red-400/20' : 'bg-fluent-accent shadow-fluent-accent/20'
                }`} />
                <div className="w-full sm:w-44 shrink-0 flex items-center gap-2">
                   <div className={`w-1.5 h-1.5 rounded-full shrink-0 sm:hidden ${
                     log.nivel === 'success' ? 'bg-green-400' :
                     log.nivel === 'warning' ? 'bg-yellow-400' :
                     log.nivel === 'error' ? 'bg-red-400' : 'bg-fluent-accent'
                   }`} />
                   <span className="font-mono text-[10px] font-black text-fluent-accent uppercase tracking-tight truncate">{log.accion}</span>
                </div>
                <span className="text-[11px] text-fluent-text-muted flex-1 truncate font-medium opacity-80">{log.detalle}</span>
                <span className="hidden sm:block text-[10px] font-mono text-fluent-text-muted/40 shrink-0 tabular-nums">{new Date(log.timestamp).toLocaleString('es')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Estado sin datos ───────────────────────────── */}
      {casos.length === 0 && (
        <div className="fluent-mica p-20 rounded-2xl text-center border-dashed border-white/10 relative overflow-hidden">
          <div className="absolute top-[-50%] left-[-20%] w-[50%] h-[100%] bg-fluent-accent/5 rounded-full blur-[120px]" />
          
          <div className="w-24 h-24 bg-fluent-accent/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-fluent-accent/20">
            <Gavel size={48} className="text-fluent-accent" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">System Initialization Complete</h3>
          <p className="text-fluent-text-muted text-sm mb-10 max-w-xl mx-auto leading-relaxed font-medium">
            Centralized platform for digital peritaje management, custody chain control 
            and <span className="font-bold text-white underline decoration-fluent-accent/50 underline-offset-4">ISO/IEC</span> compliance monitoring. Please initiate a new record to begin the technical workflow.
          </p>
          <Link to="/casos" className="fluent-btn fluent-btn-primary px-12 py-3 rounded-md text-sm font-bold shadow-2xl hover:translate-y-[-2px] transition-all">
            <FolderOpen size={18} strokeWidth={2.5} />
            Initialize Record Management
          </Link>
        </div>
      )}
    </div>
  );
}
