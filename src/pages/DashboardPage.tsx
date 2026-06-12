import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  useCMSStore,
  type TareaForense,
  type PrioridadCaso,
  type EstadoTarea,
} from '../store/cmsStore';
import { getPasosPorTipo } from '../data/tiposProyecto';
import {
  FolderOpen, ShieldCheck, AlertTriangle, Clock,
  TrendingUp, Activity, FileSearch, Gavel, Scale,
  ClipboardList, Plus, Search, CheckCircle2, Pause, Trash2, X,
  Calendar, User, BookOpen, BarChart3, CheckCheck
} from '../components/atoms/AppleIcon';
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

const ESTADO_TAREA: Record<EstadoTarea, { label: string; color: string; icon: any }> = {
  pendiente:   { label: 'Pendiente',    color: 'bg-[#FF9500]/10 text-[#FF9500] border-[#FF9500]/20', icon: Clock },
  en_progreso: { label: 'En Progreso',  color: 'bg-[#007AFF]/10 text-[#007AFF] border-[#007AFF]/20',   icon: TrendingUp },
  completada:  { label: 'Completada',   color: 'bg-[#34C759]/10 text-[#34C759] border-[#34C759]/20',  icon: CheckCircle2 },
  bloqueada:   { label: 'Bloqueada',    color: 'bg-[#FF3B30]/10 text-[#FF3B30] border-[#FF3B30]/20',  icon: Pause },
};

const PRIORIDAD_CONFIG: Record<PrioridadCaso, { label: string; dot: string; bg: string }> = {
  critica: { label: 'Crítica', dot: 'bg-[#FF3B30]',    bg: 'bg-[#FF3B30]/10 text-[#FF3B30] border-[#FF3B30]/20' },
  alta:    { label: 'Alta',    dot: 'bg-[#FF9500]',  bg: 'bg-[#FF9500]/10 text-[#FF9500] border-[#FF9500]/20' },
  media:   { label: 'Media',   dot: 'bg-[#FFCC00]',  bg: 'bg-[#FFCC00]/10 text-[#FFCC00] border-[#FFCC00]/20' },
  baja:    { label: 'Baja',    dot: 'bg-[#34C759]',   bg: 'bg-[#34C759]/10 text-[#34C759] border-[#34C759]/20' },
};

export default function DashboardPage() {
  const casos = useCMSStore(state => state.casos);
  const tareas = useCMSStore(state => state.tareas);
  const normativas = useCMSStore(state => state.normativas);
  const addTarea = useCMSStore(state => state.addTarea);
  const updateTarea = useCMSStore(state => state.updateTarea);
  const deleteTarea = useCMSStore(state => state.deleteTarea);
  const addAuditLog = useCMSStore(state => state.addAuditLog);

  // ── Resumen General (Dashboard) ──
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

  const recientes = useMemo(() => {
    return [...casos].sort((a, b) =>
      new Date(b.fechaUltimaActualizacion).getTime() - new Date(a.fechaUltimaActualizacion).getTime()
    ).slice(0, 5);
  }, [casos]);

  const logsRecientes = useMemo(() => {
    const storeLogs = useCMSStore.getState().auditLogs || [];
    if (auditLogs && auditLogs.length > 0) {
      return auditLogs.slice(0, 6);
    }
    return storeLogs.slice(0, 6);
  }, [auditLogs, tareas]);

  const tareasUrgentes = useMemo(() => {
    return tareas.filter(t => t.estado !== 'completada' && t.prioridad === 'critica').slice(0, 4);
  }, [tareas]);

  // ── Tareas y Fases ──
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<EstadoTarea | 'todos'>('todos');
  const [filtroPrioridad, setFiltroPrioridad] = useState<PrioridadCaso | 'todos'>('todos');
  const [filtroCaso, setFiltroCaso] = useState<string>('todos');
  const [showModal, setShowModal] = useState(false);

  const tareasFiltradas = useMemo(() => {
    return tareas.filter(t => {
      const matchEstado = filtroEstado === 'todos' || t.estado === filtroEstado;
      const matchPrioridad = filtroPrioridad === 'todos' || t.prioridad === filtroPrioridad;
      const matchCaso = filtroCaso === 'todos' || t.casoId === filtroCaso;
      const matchBusqueda = !busqueda ||
        t.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        t.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
        t.asignadoA.toLowerCase().includes(busqueda.toLowerCase());
      return matchEstado && matchPrioridad && matchCaso && matchBusqueda;
    });
  }, [tareas, filtroEstado, filtroPrioridad, filtroCaso, busqueda]);

  const kpis = useMemo(() => {
    const total = tareas.length;
    const pendientes = tareas.filter(t => t.estado === 'pendiente').length;
    const enProgreso = tareas.filter(t => t.estado === 'en_progreso').length;
    const completadas = tareas.filter(t => t.estado === 'completada').length;
    const bloqueadas = tareas.filter(t => t.estado === 'bloqueada').length;
    const progreso = total > 0 ? Math.round((completadas / total) * 100) : 0;
    return { total, pendientes, enProgreso, completadas, bloqueadas, progreso };
  }, [tareas]);

  const handleStatusChange = (tarea: TareaForense, nuevoEstado: EstadoTarea) => {
    updateTarea(tarea.id, {
      estado: nuevoEstado,
      ...(nuevoEstado === 'completada' ? { fechaCompletada: new Date().toISOString(), porcentaje: 100 } : {}),
    });
    addAuditLog({
      accion: 'TAREA_ACTUALIZADA',
      detalle: `Tarea "${tarea.titulo}" → ${ESTADO_TAREA[nuevoEstado].label}`,
      nivel: nuevoEstado === 'completada' ? 'success' : 'info',
      casoId: tarea.casoId,
      usuario: tarea.asignadoA,
    });
  };

  const handleDeleteTarea = (tarea: TareaForense) => {
    if (!confirm(`¿Eliminar la tarea "${tarea.titulo}"?`)) return;
    deleteTarea(tarea.id);
    addAuditLog({
      accion: 'TAREA_ELIMINADA',
      detalle: `Tarea "${tarea.titulo}" eliminada del caso`,
      nivel: 'warning',
      casoId: tarea.casoId,
      usuario: 'sistema',
    });
  };

  const getCasoLabel = (casoId: string) => {
    const caso = casos.find(c => c.id === casoId);
    return caso ? `${caso.numeroCaso} — ${caso.titulo}` : casoId;
  };

  // Si no hay casos registrados, mostrar el estado vacío global
  if (casos.length === 0) {
    return (
      <div className="space-y-8 apple-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[rgba(0,0,0,0.06)] pb-6">
          <div>
            <h1 className="text-[32px] md:text-[40px] font-bold text-[#1D1D1F] tracking-[-0.03em] leading-tight">
              Centro de Control
            </h1>
            <div className="text-[14px] text-[#86868B] font-normal max-w-lg mt-1 leading-relaxed">
              <span>Monitoreo forense bajo los marcos normativos <span className="text-[#0071E3] font-semibold">ISO 27037</span> y <span className="text-[#0071E3] font-semibold">MUCC-2017</span>.</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-semibold text-[#86868B] uppercase tracking-[0.04em]">Estado del Sistema</span>
            <span className="text-[14px] font-bold text-[#248A3D] flex items-center gap-1.5">
              <Activity size={14} /> EN LÍNEA
            </span>
          </div>
        </div>

        {/* Empty State */}
        <div className="apple-card p-16 text-center border-dashed border-[rgba(0,0,0,0.1)]">
          <div className="w-20 h-20 bg-[rgba(0,113,227,0.08)] rounded-full flex items-center justify-center mx-auto mb-6 border border-[rgba(0,113,227,0.15)]">
            <Gavel size={40} className="text-[#0071E3]" />
          </div>
          <h3 className="text-[24px] font-bold text-[#1D1D1F] mb-3 tracking-[-0.02em]">Inicialización del Sistema Complete</h3>
          <p className="text-[#86868B] text-[14px] mb-8 max-w-xl mx-auto leading-relaxed">
            Plataforma centralizada para gestión pericial digital, control de cadena de custodia 
            y monitoreo de cumplimiento <span className="font-semibold text-[#1D1D1F]">ISO/IEC</span>.
          </p>
          <Link to="/casos" className="apple-btn apple-btn-primary px-10 py-2.5 text-[14px] font-semibold inline-flex items-center gap-2">
            <FolderOpen size={18} />
            Iniciar Gestión de Registros
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 apple-fade-in">

      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[rgba(0,0,0,0.06)] pb-6">
        <div>
          <h1 className="text-[32px] md:text-[40px] font-bold text-[#1D1D1F] tracking-[-0.03em] leading-tight">
            Centro de Control
          </h1>
          <div className="text-[14px] text-[#86868B] font-normal max-w-lg mt-1 leading-relaxed">
            <span>Monitoreo forense bajo los marcos normativos <span className="text-[#0071E3] font-semibold">ISO 27037</span> y <span className="text-[#0071E3] font-semibold">MUCC-2017</span>.</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-col items-end border-r border-[rgba(0,0,0,0.08)] dark:border-white/[0.08] pr-4">
            <span className="text-[10px] font-semibold text-[#86868B] uppercase tracking-[0.04em]">Estado del Sistema</span>
            <span className="text-[14px] font-bold text-[#248A3D] flex items-center gap-1.5">
              <Activity size={14} /> EN LÍNEA
            </span>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="apple-btn apple-btn-primary flex items-center gap-2.5 shadow-md hover:translate-y-[-1px] transition-all"
          >
            <Plus size={16} strokeWidth={2.5} />
            Nueva Tarea
          </button>
        </div>
      </div>

      {/* ── KPIs Generales ──────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total de Casos" value={stats.totalCasos} sub={`${stats.casosActivos} activos`} icon={FolderOpen} />
        <KpiCard title="Procesando" value={stats.casosActivos} sub="En fase técnica" icon={TrendingUp} color="text-[#0071E3]" />
        <KpiCard title="Cumplimiento" value={`${stats.cumplimientoGeneral}%`} sub={`${stats.casosConformidad} validados`} icon={ShieldCheck} accent color={stats.cumplimientoGeneral >= 80 ? 'text-[#248A3D]' : stats.cumplimientoGeneral >= 50 ? 'text-[#C93400]' : 'text-[#BF2D24]'} />
        <KpiCard title="Alertas" value={stats.tareasPendientes} sub="Requieren acción inmediata" icon={AlertTriangle} color="text-[#FF9500]" />
      </div>

      {/* ── Grid: Casos y Normativas ────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Actualizaciones Recientes */}
        <div className="lg:col-span-2 apple-card overflow-hidden">
          <div className="p-5 border-b border-[rgba(0,0,0,0.06)] flex items-center justify-between">
            <h2 className="font-semibold text-[15px] text-[#1D1D1F] dark:text-white flex items-center gap-2">
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
                  className="flex items-center gap-4 px-6 py-4 hover:bg-[rgba(0,0,0,0.015)] dark:hover:bg-[rgba(255,255,255,0.015)] transition-all group">
                  <div className={`w-1 h-10 rounded-full ${PRIORIDAD_COLOR[caso.prioridad]} shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[11px] font-semibold text-[#0071E3] tracking-tight">{caso.numeroCaso}</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-[4px] border font-semibold ${estado.color}`}>{estado.label}</span>
                    </div>
                    <p className="text-[14px] font-semibold text-[#1D1D1F] dark:text-white truncate">{caso.titulo}</p>
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

        {/* Panel Lateral Derecha */}
        <div className="space-y-5">
          {/* Normativas */}
          <div className="apple-card p-5">
            <h3 className="font-semibold text-[14px] text-[#1D1D1F] dark:text-white flex items-center gap-2 mb-5">
              <Scale size={16} className="text-[#0071E3]" />
              Marcos Normativos
            </h3>
            <div className="space-y-3.5">
              {normativas.filter(n => n.activa).slice(0, 5).map(n => (
                <div key={n.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0071E3]/40 group-hover:bg-[#0071E3] transition-colors" />
                    <span className="text-[12px] font-medium text-[#86868B] group-hover:text-[#1D1D1F] dark:group-hover:text-white transition-colors truncate">{n.codigo}</span>
                  </div>
                  <span className="text-[8px] font-semibold px-2 py-0.5 rounded-[4px] bg-[rgba(0,0,0,0.04)] dark:bg-[rgba(255,255,255,0.04)] text-[#86868B] uppercase tracking-[0.02em]">{n.tipo}</span>
                </div>
              ))}
              <div className="pt-4 border-t border-[rgba(0,0,0,0.06)] dark:border-white/[0.06]">
                <Link to="/normativas" className="block text-center text-[11px] font-medium text-[#0071E3] hover:text-[#0077ED] transition-colors">
                  Biblioteca de Normativas
                </Link>
              </div>
            </div>
          </div>

          {/* Acciones Críticas */}
          {tareasUrgentes.length > 0 && (
            <div className="apple-card p-5 border-[rgba(255,59,48,0.2)] bg-[rgba(255,59,48,0.015)]">
              <h3 className="font-semibold text-[14px] text-[#BF2D24] flex items-center gap-2 mb-4">
                <AlertTriangle size={16} />
                Acciones Críticas
              </h3>
              <div className="space-y-2.5">
                {tareasUrgentes.map(t => (
                  <div key={t.id} className="text-[12px] p-3.5 rounded-[10px] bg-white dark:bg-[#1C1C1E] border border-[rgba(0,0,0,0.05)] dark:border-white/[0.05]">
                    <p className="text-[#1D1D1F] dark:text-white font-medium mb-1">{t.titulo}</p>
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

      {/* ── Separador y Tablero de Tareas ────────────────── */}
      <div className="apple-separator" />

      <div className="space-y-6">
        <div className="border-b border-[rgba(0,0,0,0.06)] dark:border-white/[0.06] pb-4">
          <h2 className="text-[22px] font-bold text-[#1D1D1F] dark:text-white tracking-[-0.02em] flex items-center gap-2.5">
            <ClipboardList size={22} className="text-[#0071E3]" />
            Tablero de Tareas y Fases Técnicas
          </h2>
          <p className="text-xs text-[#86868B] mt-1">
            Gestión del flujo de trabajo forense bajo la metodología de seguimiento de fases de <span className="text-[#0071E3] font-semibold">MUCC-2017</span> e <span className="text-[#0071E3] font-semibold">ISO 27037</span>.
          </p>
        </div>

        {/* Tareas KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="apple-card p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold text-[#86868B] uppercase tracking-wider">Tareas Totales</p>
              <p className="text-[20px] font-bold text-[#1D1D1F] dark:text-white">{kpis.total}</p>
            </div>
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600">
              <ClipboardList size={16} />
            </div>
          </div>
          <div className="apple-card p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold text-[#86868B] uppercase tracking-wider">Pendientes</p>
              <p className="text-[20px] font-bold text-[#FF9500]">{kpis.pendientes}</p>
            </div>
            <div className="p-2 bg-[#FF9500]/10 rounded-lg text-[#FF9500]">
              <Clock size={16} />
            </div>
          </div>
          <div className="apple-card p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold text-[#86868B] uppercase tracking-wider">Completadas</p>
              <p className="text-[20px] font-bold text-[#34C759]">{kpis.completadas}</p>
            </div>
            <div className="p-2 bg-[#34C759]/10 rounded-lg text-[#34C759]">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="apple-card p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold text-[#86868B] uppercase tracking-wider">Bloqueadas</p>
              <p className="text-[20px] font-bold text-[#FF3B30]">{kpis.bloqueadas}</p>
            </div>
            <div className="p-2 bg-[#FF3B30]/10 rounded-lg text-[#FF3B30]">
              <AlertTriangle size={16} />
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="apple-card p-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#86868B]" />
            <input
              type="text"
              placeholder="Buscar tareas por título, descripción o responsable..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              className="apple-input pl-9"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              value={filtroEstado}
              onChange={e => setFiltroEstado(e.target.value as EstadoTarea | 'todos')}
              className="apple-input w-auto min-w-[130px]"
            >
              <option value="todos">Todos los Estados</option>
              {Object.entries(ESTADO_TAREA).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
            <select
              value={filtroPrioridad}
              onChange={e => setFiltroPrioridad(e.target.value as PrioridadCaso | 'todos')}
              className="apple-input w-auto min-w-[120px]"
            >
              <option value="todos">Todas las Prioridades</option>
              {Object.entries(PRIORIDAD_CONFIG).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
            <select
              value={filtroCaso}
              onChange={e => setFiltroCaso(e.target.value)}
              className="apple-input w-auto min-w-[160px]"
            >
              <option value="todos">Todos los Casos</option>
              {casos.map(c => (
                <option key={c.id} value={c.id}>{c.numeroCaso}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Lista de Tareas */}
        <div className="space-y-3">
          {tareasFiltradas.length === 0 ? (
            <div className="apple-card p-12 text-center border-dashed border-black/10 dark:border-white/10">
              <div className="w-16 h-16 bg-black/[0.02] dark:bg-white/[0.02] rounded-full flex items-center justify-center mx-auto mb-4">
                <ClipboardList size={32} className="text-[#86868B] opacity-20" />
              </div>
              <h3 className="text-lg font-bold text-[#1D1D1F] dark:text-white mb-1">No se encontraron tareas</h3>
              <p className="text-[#86868B] text-xs max-w-sm mx-auto font-medium opacity-60 leading-relaxed">
                Ninguna tarea forense coincide con los criterios de búsqueda. Cree una nueva tarea para iniciar el seguimiento del flujo de trabajo.
              </p>
            </div>
          ) : (
            tareasFiltradas.map(tarea => {
              const estado = ESTADO_TAREA[tarea.estado];
              const pr = PRIORIDAD_CONFIG[tarea.prioridad];
              const EstadoIcon = estado.icon;
              return (
                <div
                  key={tarea.id}
                  className="apple-card p-0 overflow-hidden group"
                >
                  <div className="flex items-stretch">
                    {/* Barra de Prioridad */}
                    <div className={`w-1.5 ${pr.dot} shrink-0`} />

                    {/* Contenido */}
                    <div className="flex-1 p-5 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`p-1.5 rounded-md ${estado.color.split(' ')[0]}`}>
                            <EstadoIcon size={14} className={estado.color.split(' ')[1]} />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-sm font-bold text-[#1D1D1F] dark:text-white truncate">{tarea.titulo}</h3>
                            <p className="text-[10px] text-[#86868B] font-mono uppercase tracking-tight">
                              {getCasoLabel(tarea.casoId)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-[9px] px-2 py-0.5 rounded-[4px] border font-bold uppercase tracking-tight ${estado.color}`}>
                            {estado.label}
                          </span>
                          <span className={`text-[9px] px-2 py-0.5 rounded-[4px] border font-bold uppercase tracking-tight ${pr.bg}`}>
                            {pr.label}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-[#86868B] mb-4 line-clamp-2 leading-relaxed">{tarea.descripcion}</p>

                      {/* Metadatos */}
                      <div className="flex flex-wrap items-center gap-4 text-[10px] text-[#86868B] font-medium">
                        <span className="flex items-center gap-1.5">
                          <User size={11} /> {tarea.asignadoA || 'Sin asignar'}
                        </span>
                        {tarea.fechaVencimiento && (
                          <span className="flex items-center gap-1.5">
                            <Calendar size={11} /> {new Date(tarea.fechaVencimiento).toLocaleDateString('es')}
                          </span>
                        )}
                        {tarea.normativasRelacionadas.length > 0 && (
                          <span className="flex items-center gap-1.5">
                            <BookOpen size={11} />
                            {tarea.normativasRelacionadas.map(nId => {
                              const n = normativas.find(x => x.id === nId);
                              return n?.codigo || nId;
                            }).join(', ')}
                          </span>
                        )}
                        <span className="flex items-center gap-1.5">
                          <BarChart3 size={11} /> {tarea.porcentaje}%
                        </span>
                        {tarea.pasoId && (
                          <span className="flex items-center gap-1.5 text-[#0071E3]">
                            <span className="text-[8px] font-black uppercase tracking-wider">Paso:</span>
                            {tarea.pasoId}
                          </span>
                        )}
                      </div>

                      {/* Barra de Progreso */}
                      <div className="mt-3 w-full bg-black/[0.08] dark:bg-white/[0.08] rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full bg-[#0071E3] rounded-full transition-all duration-500"
                          style={{ width: `${tarea.porcentaje}%` }}
                        />
                      </div>
                    </div>

                    {/* Acciones Rápidas */}
                    <div className="flex flex-col gap-1 p-3 border-l border-black/[0.06] dark:border-white/[0.06] opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <select
                        value={tarea.estado}
                        onChange={e => handleStatusChange(tarea, e.target.value as EstadoTarea)}
                        className="text-[10px] bg-black/[0.02] dark:bg-white/[0.02] border border-black/10 dark:border-white/10 rounded px-1.5 py-1 text-[#1D1D1F] dark:text-white outline-none cursor-pointer"
                        title="Cambiar estado"
                      >
                        {Object.entries(ESTADO_TAREA).map(([k, v]) => (
                          <option key={k} value={k}>{v.label}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleDeleteTarea(tarea)}
                        className="p-1.5 rounded hover:bg-red-500/10 text-[#86868B] hover:text-red-600 transition-colors"
                        title="Eliminar tarea"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Auditoría y Trazabilidad ────────────────────── */}
      {logsRecientes.length > 0 && (
        <>
          <div className="apple-separator" />
          <div className="apple-card overflow-hidden">
            <div className="p-5 border-b border-[rgba(0,0,0,0.06)] flex items-center justify-between">
              <h2 className="font-semibold text-[15px] text-[#1D1D1F] dark:text-white flex items-center gap-2">
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
        </>
      )}

      {/* ── MODAL NUEVA TAREA ────────────────────────────────────────────── */}
      {showModal && (
        <NuevaTareaModal
          onClose={() => setShowModal(false)}
          onSubmit={(data) => {
            addTarea(data);
            addAuditLog({
              accion: 'TAREA_CREADA',
              detalle: `Tarea "${data.titulo}" creada para caso ${getCasoLabel(data.casoId)}`,
              nivel: 'success',
              casoId: data.casoId,
              usuario: data.asignadoA,
            });
            setShowModal(false);
          }}
          casos={casos}
          normativas={normativas}
        />
      )}
    </div>
  );
}

// ── Modal de Creación de Tarea ──
interface ModalProps {
  onClose: () => void;
  onSubmit: (data: Omit<TareaForense, 'id' | 'fechaCreacion'>) => void;
  casos: any[];
  normativas: any[];
}

function NuevaTareaModal({ onClose, onSubmit, casos, normativas }: ModalProps) {
  const [form, setForm] = useState({
    casoId: casos[0]?.id || '',
    pasoId: '',
    titulo: '',
    descripcion: '',
    asignadoA: '',
    estado: 'pendiente' as EstadoTarea,
    prioridad: 'media' as PrioridadCaso,
    fechaVencimiento: '',
    normativasRelacionadas: [] as string[],
    observaciones: '',
    porcentaje: 0,
  });

  const casoSeleccionado = casos.find(c => c.id === form.casoId);
  const pasosDisponibles = casoSeleccionado
    ? getPasosPorTipo((casoSeleccionado as any).tipoProyecto || 'forense_whatsapp')
    : [];

  const toggleNormativa = (id: string) => {
    setForm(prev => ({
      ...prev,
      normativasRelacionadas: prev.normativasRelacionadas.includes(id)
        ? prev.normativasRelacionadas.filter(n => n !== id)
        : [...prev.normativasRelacionadas, id],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.casoId || !form.titulo) return;
    onSubmit({
      ...form,
      pasoId: form.pasoId || undefined,
      fechaVencimiento: form.fechaVencimiento || undefined,
      fechaCompletada: undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-[#1C1C1E] border border-black/[0.08] dark:border-white/[0.08] rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-[0_32px_64px_rgba(0,0,0,0.12)] flex flex-col apple-scale-in animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-black/[0.06] dark:border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-[#0071E3]/10">
              <ClipboardList size={18} className="text-[#0071E3]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1D1D1F] dark:text-white">Nueva Tarea Forense</h2>
              <p className="text-[10px] text-[#86868B] font-medium">Art. 187 COPP — Registro de Actividad Técnica</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-black/[0.04] dark:hover:bg-white/[0.04] text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="apple-label">Caso Asociado *</label>
            <select
              value={form.casoId}
              onChange={e => setForm(p => ({ ...p, casoId: e.target.value }))}
              className="apple-input"
              required
            >
              <option value="">Seleccione un caso...</option>
              {casos.map(c => (
                <option key={c.id} value={c.id}>{c.numeroCaso} — {c.titulo}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="apple-label">Paso / Etapa Técnica</label>
            <select
              value={form.pasoId}
              onChange={e => setForm(p => ({ ...p, pasoId: e.target.value }))}
              className="apple-input"
            >
              <option value="">-- No vinculado a un paso --</option>
              {pasosDisponibles.map(p => (
                <option key={p.id} value={p.id}>Paso {p.num}: {p.titulo}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="apple-label">Título de la Tarea *</label>
            <input
              type="text"
              value={form.titulo}
              onChange={e => setForm(p => ({ ...p, titulo: e.target.value }))}
              className="apple-input"
              placeholder="Ej: Extraer msgstore.db con APK Downgrade"
              required
            />
          </div>

          <div>
            <label className="apple-label">Descripción</label>
            <textarea
              value={form.descripcion}
              onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))}
              className="apple-input min-h-[80px] resize-y"
              placeholder="Detalle los objetivos técnicos o alcances de la tarea..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="apple-label">Asignar Perito</label>
              <input
                type="text"
                value={form.asignadoA}
                onChange={e => setForm(p => ({ ...p, asignadoA: e.target.value }))}
                className="apple-input"
                placeholder="Nombre del perito"
              />
            </div>
            <div>
              <label className="apple-label">Prioridad</label>
              <select
                value={form.prioridad}
                onChange={e => setForm(p => ({ ...p, prioridad: e.target.value as PrioridadCaso }))}
                className="apple-input"
              >
                {Object.entries(PRIORIDAD_CONFIG).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="apple-label">Fecha de Vencimiento</label>
            <input
              type="date"
              value={form.fechaVencimiento}
              onChange={e => setForm(p => ({ ...p, fechaVencimiento: e.target.value }))}
              className="apple-input"
            />
          </div>

          <div>
            <label className="apple-label">Normativas Relacionadas</label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {normativas.map(n => (
                <label
                  key={n.id}
                  className={`flex items-center gap-2 text-[10px] font-bold p-2 rounded-md border cursor-pointer transition-all ${
                    form.normativasRelacionadas.includes(n.id)
                      ? 'bg-[#0071E3]/10 border-[#0071E3]/30 text-[#0071E3]'
                      : 'bg-black/[0.02] dark:bg-white/[0.02] border-black/[0.06] dark:border-white/[0.06] text-[#86868B] hover:bg-black/[0.04] dark:hover:bg-white/[0.04]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form.normativasRelacionadas.includes(n.id)}
                    onChange={() => toggleNormativa(n.id)}
                    className="hidden"
                  />
                  <div className={`w-3 h-3 rounded-sm border flex items-center justify-center shrink-0 ${
                    form.normativasRelacionadas.includes(n.id)
                      ? 'bg-[#0071E3] border-[#0071E3]'
                      : 'border-black/20 dark:border-white/20'
                  }`}>
                    {form.normativasRelacionadas.includes(n.id) && (
                      <CheckCheck size={8} className="text-white" />
                    )}
                  </div>
                  <span className="truncate">{n.codigo}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="apple-label">Observaciones</label>
            <textarea
              value={form.observaciones}
              onChange={e => setForm(p => ({ ...p, observaciones: e.target.value }))}
              className="apple-input min-h-[60px] resize-y"
              placeholder="Notas u observaciones técnicas adicionales..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-black/[0.06] dark:border-white/[0.06]">
            <button type="button" onClick={onClose} className="apple-btn apple-btn-secondary text-sm">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!form.casoId || !form.titulo}
              className="apple-btn apple-btn-primary text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Registrar Tarea
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
