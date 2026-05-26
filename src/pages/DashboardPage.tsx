import { useEffect, useState } from 'react';
import { useCMSStore } from '../store/cmsStore';
import {
  FolderOpen, ShieldCheck, AlertTriangle, Clock,
  TrendingUp, Activity, FileSearch, Gavel, Scale
} from 'lucide-react';
import { Link } from 'react-router-dom';
import KpiCard from '../components/molecules/KpiCard';

const ESTADO_LABEL: Record<string, { label: string; color: string }> = {
  iniciado:    { label: 'Iniciado',    color: 'bg-blue-500/15 text-blue-600 border-blue-500/25' },
  en_proceso:  { label: 'En Proceso',  color: 'bg-yellow-500/15 text-yellow-600 border-yellow-500/25' },
  analisis:    { label: 'Análisis',    color: 'bg-purple-500/15 text-purple-600 border-purple-500/25' },
  informe:     { label: 'Informe',     color: 'bg-indigo-500/15 text-indigo-600 border-indigo-500/25' },
  cerrado:     { label: 'Cerrado',     color: 'bg-green-500/15 text-green-600 border-green-500/25' },
  archivado:   { label: 'Archivado',   color: 'bg-gray-500/15 text-gray-500 border-gray-500/25' },
};

const PRIORIDAD_COLOR: Record<string, string> = {
  critica: 'bg-[#FF3B30]',
  alta: 'bg-[#FF9500]',
  media: 'bg-[#FFCC00]',
  baja: 'bg-[#34C759]',
};

const CUMPLIMIENTO_CONFIG: Record<string, { icon: any; color: string; label: string }> = {
  conforme:     { icon: ShieldCheck, color: 'text-[#248A3D]', label: 'Conforme' },
  parcial:      { icon: AlertTriangle, color: 'text-[#C93400]', label: 'Parcial' },
  no_conforme:  { icon: AlertTriangle, color: 'text-[#BF2D24]', label: 'No Conforme' },
  no_aplica:    { icon: Clock, color: 'text-[#86868B]', label: 'N/A' },
};

export default function DashboardPage() {
  const casos = useCMSStore(state => state.casos);
  const tareas = useCMSStore(state => state.tareas);
  const normativas = useCMSStore(state => state.normativas);
  
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const getEstadisticas = useCMSStore(state => state.getEstadisticas);
  const stats = getEstadisticas();

  useEffect(() => {
    if (window.electronAPI?.db?.getAuditLogs) {
      window.electronAPI.db.getAuditLogs().then((logs: any) => {
        setAuditLogs(logs);
      });
    }
  }, []);

  const recientes = [...casos].sort((a, b) =>
    new Date(b.fechaUltimaActualizacion).getTime() - new Date(a.fechaUltimaActualizacion).getTime()
  ).slice(0, 5);

  const logsRecientes = auditLogs.slice(0, 6);
  const tareasUrgentes = tareas.filter(t => t.estado !== 'completada' && t.prioridad === 'critica').slice(0, 4);

  return (
    <div className="space-y-8 apple-fade-in">

      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-[32px] md:text-[40px] font-bold text-[#1D1D1F] tracking-[-0.03em] leading-tight">Centro de Control</h1>
          <p className="text-[14px] text-[#86868B] font-normal max-w-lg mt-1 leading-relaxed">
            Monitoreo forense bajo los marcos normativos <span className="text-[#0071E3] font-semibold">ISO 27037</span> y <span className="text-[#0071E3] font-semibold">MUCC-2017</span>.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-semibold text-[#86868B] uppercase tracking-[0.04em]">Estado del Sistema</span>
            <span className="text-[14px] font-bold text-[#248A3D] flex items-center gap-1.5">
              <Activity size={14} /> EN LÍNEA
            </span>
          </div>
        </div>
      </div>

      {/* ── KPIs ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total de Casos" value={stats.totalCasos} sub={`${stats.casosActivos} activos`} icon={FolderOpen} />
        <KpiCard title="Procesando" value={stats.casosActivos} sub="En fase técnica" icon={TrendingUp} color="text-[#0071E3]" />
        <KpiCard title="Cumplimiento" value={`${stats.cumplimientoGeneral}%`} sub={`${stats.casosConformidad} validados`} icon={ShieldCheck} accent color={stats.cumplimientoGeneral >= 80 ? 'text-[#248A3D]' : stats.cumplimientoGeneral >= 50 ? 'text-[#C93400]' : 'text-[#BF2D24]'} />
        <KpiCard title="Alertas" value={stats.tareasPendientes} sub="Requieren acción inmediata" icon={AlertTriangle} color="text-[#FF9500]" />
      </div>

      {/* ── Body ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Cases */}
        <div className="lg:col-span-2 apple-card overflow-hidden">
          <div className="p-5 border-b border-[rgba(0,0,0,0.06)] flex items-center justify-between">
            <h2 className="font-semibold text-[15px] text-[#1D1D1F] flex items-center gap-2">
              <FileSearch size={18} className="text-[#0071E3]" />
              Actualizaciones Recientes
            </h2>
            <Link to="/casos" className="text-[11px] font-medium text-[#0071E3] hover:text-[#0077ED] transition-colors">Ver todos</Link>
          </div>
          <div className="divide-y divide-[rgba(0,0,0,0.05)]">
            {recientes.length === 0 ? (
              <div className="py-16 text-center">
                <FolderOpen size={40} className="text-[#86868B] mx-auto mb-4 opacity-20" />
                <p className="text-[14px] text-[#86868B]">No hay actividad reciente.</p>
              </div>
            ) : recientes.map(caso => {
              const estado = ESTADO_LABEL[caso.estado] || ESTADO_LABEL.iniciado;
              const cumpl = CUMPLIMIENTO_CONFIG[caso.nivelCumplimientoGeneral] || CUMPLIMIENTO_CONFIG.no_aplica;
              const CumplIcon = cumpl.icon;
              return (
                <Link to={`/casos/${caso.id}`} key={caso.id}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-[rgba(0,0,0,0.015)] transition-all group">
                  <div className={`w-1 h-10 rounded-full ${PRIORIDAD_COLOR[caso.prioridad]} shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[11px] font-semibold text-[#0071E3] tracking-tight">{caso.numeroCaso}</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-[4px] border font-semibold ${estado.color}`}>{estado.label}</span>
                    </div>
                    <p className="text-[14px] font-semibold text-[#1D1D1F] truncate">{caso.titulo}</p>
                    <p className="text-[11px] text-[#86868B]">{caso.peritoLider}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <div className={`p-1.5 rounded-[6px] ${cumpl.color.replace('text', 'bg')}/10`}>
                      <CumplIcon size={14} className={cumpl.color} />
                    </div>
                    <div className="text-[10px] font-mono text-[#86868B]">{caso.porcentajeCompletado}%</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-5">

          {/* Normativas */}
          <div className="apple-card p-5">
            <h3 className="font-semibold text-[14px] text-[#1D1D1F] flex items-center gap-2 mb-5">
              <Scale size={16} className="text-[#0071E3]" />
              Marcos Normativos
            </h3>
            <div className="space-y-3.5">
              {normativas.filter(n => n.activa).slice(0, 5).map(n => (
                <div key={n.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0071E3]/40 group-hover:bg-[#0071E3] transition-colors" />
                    <span className="text-[12px] font-medium text-[#86868B] group-hover:text-[#1D1D1F] transition-colors truncate">{n.codigo}</span>
                  </div>
                  <span className="text-[8px] font-semibold px-2 py-0.5 rounded-[4px] bg-[rgba(0,0,0,0.04)] text-[#86868B] uppercase tracking-[0.02em]">{n.tipo}</span>
                </div>
              ))}
              <div className="pt-4 border-t border-[rgba(0,0,0,0.06)]">
                <Link to="/normativas" className="block text-center text-[11px] font-medium text-[#0071E3] hover:text-[#0077ED] transition-colors">
                  Biblioteca de Normativas
                </Link>
              </div>
            </div>
          </div>

          {/* Tareas Críticas */}
          {tareasUrgentes.length > 0 && (
            <div className="apple-card p-5 border-[rgba(255,59,48,0.2)] bg-[rgba(255,59,48,0.015)]">
              <h3 className="font-semibold text-[14px] text-[#BF2D24] flex items-center gap-2 mb-4">
                <AlertTriangle size={16} />
                Acciones Críticas
              </h3>
              <div className="space-y-2.5">
                {tareasUrgentes.map(t => (
                  <div key={t.id} className="text-[12px] p-3.5 rounded-[10px] bg-white border border-[rgba(0,0,0,0.05)]">
                    <p className="text-[#1D1D1F] font-medium mb-1">{t.titulo}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-[#86868B]">{t.asignadoA}</span>
                      <span className="text-[9px] font-semibold text-[#BF2D24] bg-[rgba(255,59,48,0.08)] px-1.5 py-0.5 rounded-[4px]">Crítica</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Audit Log ──────────────────────────────────── */}
      {logsRecientes.length > 0 && (
        <div className="apple-card overflow-hidden">
          <div className="p-5 border-b border-[rgba(0,0,0,0.06)] flex items-center justify-between">
            <h2 className="font-semibold text-[15px] text-[#1D1D1F] flex items-center gap-2">
              <Activity size={18} className="text-[#0071E3]" />
              Auditoría y Trazabilidad
            </h2>
            <Link to="/auditoria" className="text-[11px] font-medium text-[#0071E3] hover:text-[#0077ED] transition-colors">Ver historial</Link>
          </div>
          <div className="divide-y divide-[rgba(0,0,0,0.05)]">
            {logsRecientes.map((log: any) => (
              <div key={log.id} className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4 px-4 sm:px-6 py-3.5 hover:bg-[rgba(0,0,0,0.01)] transition-colors">
                <div className={`w-2 h-2 rounded-full shrink-0 hidden sm:block ${
                  log.accion.includes('ERROR') ? 'bg-[#FF3B30]' :
                  log.accion.includes('ELIMINAD') ? 'bg-[#FF9500]' :
                  'bg-[#0071E3]'
                }`} />
                <div className="w-full sm:w-44 shrink-0 flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 sm:hidden ${
                    log.accion.includes('ERROR') ? 'bg-[#FF3B30]' :
                    log.accion.includes('ELIMINAD') ? 'bg-[#FF9500]' :
                    'bg-[#0071E3]'
                  }`} />
                  <span className="font-mono text-[10px] font-semibold text-[#0071E3] tracking-tight">{log.accion}</span>
                </div>
                <span className="text-[12px] text-[#86868B] flex-1 truncate">{log.detalle}</span>
                <span className="hidden sm:block text-[10px] font-mono text-[#86868B]/60 shrink-0 tabular-nums">{new Date(log.timestamp).toLocaleString('es')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Empty State ────────────────────────────────── */}
      {casos.length === 0 && (
        <div className="apple-card p-16 text-center border-dashed border-[rgba(0,0,0,0.1)]">
          <div className="w-20 h-20 bg-[rgba(0,113,227,0.08)] rounded-full flex items-center justify-center mx-auto mb-6 border border-[rgba(0,113,227,0.15)]">
            <Gavel size={40} className="text-[#0071E3]" />
          </div>
          <h3 className="text-[24px] font-bold text-[#1D1D1F] mb-3 tracking-[-0.02em]">Inicialización del Sistema Completa</h3>
          <p className="text-[#86868B] text-[14px] mb-8 max-w-xl mx-auto leading-relaxed">
            Plataforma centralizada para gestión pericial digital, control de cadena de custodia 
            y monitoreo de cumplimiento <span className="font-semibold text-[#1D1D1F]">ISO/IEC</span>.
          </p>
          <Link to="/casos" className="apple-btn apple-btn-primary px-10 py-2.5 text-[14px] font-semibold">
            <FolderOpen size={18} />
            Iniciar Gestión de Registros
          </Link>
        </div>
      )}
    </div>
  );
}
