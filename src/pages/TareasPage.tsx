import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  useCMSStore,
  type TareaForense,
  type PrioridadCaso,
  type EstadoTarea,
} from '../store/cmsStore';
import { getPasosPorTipo } from '../data/tiposProyecto';
import {
  ClipboardList, Plus, Search, CheckCircle2, Clock,
  AlertTriangle, Pause, Trash2, X,
  TrendingUp, Calendar, User,
  BookOpen, BarChart3, ExternalLink
} from '../components/atoms/AppleIcon';
import KpiCard from '../components/molecules/KpiCard';

// ── Constantes de diseño ────────────────────────────────────────────────────

const ESTADO_TAREA: Record<EstadoTarea, { label: string; color: string; icon: any }> = {
  pendiente:   { label: 'Pendiente',    color: 'bg-yellow-500/10 text-yellow-800 border-yellow-500/20', icon: Clock },
  en_progreso: { label: 'En Progreso',  color: 'bg-blue-500/10 text-blue-700 border-blue-500/20',     icon: TrendingUp },
  completada:  { label: 'Completada',   color: 'bg-green-500/10 text-green-700 border-green-500/20',  icon: CheckCircle2 },
  bloqueada:   { label: 'Bloqueada',    color: 'bg-red-500/10 text-red-700 border-red-500/20',        icon: Pause },
};

const PRIORIDAD_CONFIG: Record<PrioridadCaso, { label: string; dot: string; bg: string }> = {
  critica: { label: 'Crítica', dot: 'bg-red-500',    bg: 'bg-red-500/10 text-red-700 border-red-500/20' },
  alta:    { label: 'Alta',    dot: 'bg-orange-500',  bg: 'bg-orange-500/10 text-orange-700 border-orange-500/20' },
  media:   { label: 'Media',   dot: 'bg-yellow-500',  bg: 'bg-yellow-500/10 text-yellow-800 border-yellow-500/20' },
  baja:    { label: 'Baja',    dot: 'bg-green-500',   bg: 'bg-green-500/10 text-green-700 border-green-500/20' },
};

// ── Componente Principal ────────────────────────────────────────────────────

export default function TareasPage() {
  const casos = useCMSStore(s => s.casos);
  const tareas = useCMSStore(s => s.tareas);
  const normativas = useCMSStore(s => s.normativas);
  const addTarea = useCMSStore(s => s.addTarea);
  const updateTarea = useCMSStore(s => s.updateTarea);
  const deleteTarea = useCMSStore(s => s.deleteTarea);
  const addAuditLog = useCMSStore(s => s.addAuditLog);

  // ── Estado UI ──
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<EstadoTarea | 'todos'>('todos');
  const [filtroPrioridad, setFiltroPrioridad] = useState<PrioridadCaso | 'todos'>('todos');
  const [filtroCaso, setFiltroCaso] = useState<string>('todos');
  const [showModal, setShowModal] = useState(false);

  // ── Filtrado ──
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

  // ── KPIs ──
  const kpis = useMemo(() => {
    const total = tareas.length;
    const pendientes = tareas.filter(t => t.estado === 'pendiente').length;
    const enProgreso = tareas.filter(t => t.estado === 'en_progreso').length;
    const completadas = tareas.filter(t => t.estado === 'completada').length;
    const bloqueadas = tareas.filter(t => t.estado === 'bloqueada').length;
    const progreso = total > 0 ? Math.round((completadas / total) * 100) : 0;
    return { total, pendientes, enProgreso, completadas, bloqueadas, progreso };
  }, [tareas]);

  // ── Handlers ──
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

  // ── Caso label helper ──
  const getCasoLabel = (casoId: string) => {
    const caso = casos.find(c => c.id === casoId);
    return caso ? `${caso.numeroCaso} — ${caso.titulo}` : casoId;
  };

  return (
    <div className="space-y-8 animate-fade-in">

      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-apple-text tracking-tight">Task & Phase Control</h1>
          <p className="text-xs md:text-sm text-apple-text-secondary font-medium max-w-lg mt-1">
            Forensic workflow management under <span className="text-apple-accent">MUCC-2017</span> and <span className="text-apple-accent">ISO 27037</span> phase-tracking methodology.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/control/seguimiento-compliance"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all duration-200 bg-cyan-500/10 border border-cyan-500/25 text-cyan-700 hover:bg-cyan-500/20"
          >
            <ExternalLink size={12} />
            <span>Ver Flujo Unificado</span>
          </Link>
          <button
            onClick={() => setShowModal(true)}
            className="apple-btn apple-btn-primary flex items-center gap-2.5 shadow-2xl hover:translate-y-[-2px] transition-all self-start md:self-auto"
          >
            <Plus size={18} strokeWidth={3} />
            New Task
          </button>
        </div>
      </div>

      {/* ── KPIs ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total Tasks" value={kpis.total} sub={`${kpis.enProgreso} in progress`} icon={ClipboardList} />
        <KpiCard title="Pending" value={kpis.pendientes} sub="Awaiting assignment" icon={Clock} color="text-yellow-400" />
        <KpiCard title="Completed" value={kpis.completadas} sub={`${kpis.progreso}% overall progress`} icon={CheckCircle2} color="text-green-400" accent />
        <KpiCard title="Blocked" value={kpis.bloqueadas} sub="Requires attention" icon={AlertTriangle} color="text-red-400" />
      </div>

      {/* ── Filtros ── */}
      <div className="apple-card p-4 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-apple-text-secondary" />
          <input
            type="text"
            placeholder="Search tasks by title, description or assignee..."
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
            <option value="todos">All Status</option>
            {Object.entries(ESTADO_TAREA).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
          <select
            value={filtroPrioridad}
            onChange={e => setFiltroPrioridad(e.target.value as PrioridadCaso | 'todos')}
            className="apple-input w-auto min-w-[120px]"
          >
            <option value="todos">All Priority</option>
            {Object.entries(PRIORIDAD_CONFIG).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
          <select
            value={filtroCaso}
            onChange={e => setFiltroCaso(e.target.value)}
            className="apple-input w-auto min-w-[160px]"
          >
            <option value="todos">All Cases</option>
            {casos.map(c => (
              <option key={c.id} value={c.id}>{c.numeroCaso}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Lista de Tareas ── */}
      <div className="space-y-3">
        {tareasFiltradas.length === 0 ? (
          <div className="apple-card p-20 text-center border-dashed border-black/10">
            <div className="w-20 h-20 bg-black/[0.02] rounded-full flex items-center justify-center mx-auto mb-6">
              <ClipboardList size={40} className="text-apple-text-secondary opacity-20" />
            </div>
            <h3 className="text-xl font-bold text-apple-text mb-2">No Tasks Found</h3>
            <p className="text-apple-text-secondary text-sm max-w-sm mx-auto font-medium opacity-60 leading-relaxed">
              No forensic tasks match the current filter criteria. Create a new task to begin workflow tracking.
            </p>
          </div>
        ) : (
          tareasFiltradas.map(tarea => {
            const estado = ESTADO_TAREA[tarea.estado];
            const prioridad = PRIORIDAD_CONFIG[tarea.prioridad];
            const EstadoIcon = estado.icon;
            return (
              <div
                key={tarea.id}
                className="apple-card p-0 overflow-hidden group"
              >
                <div className="flex items-stretch">
                  {/* Prioridad bar */}
                  <div className={`w-1.5 ${prioridad.dot} shrink-0`} />

                  {/* Content */}
                  <div className="flex-1 p-5 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-1.5 rounded-md ${estado.color.split(' ')[0]}`}>
                          <EstadoIcon size={14} className={estado.color.split(' ')[1]} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-apple-text truncate">{tarea.titulo}</h3>
                          <p className="text-[10px] text-apple-text-secondary font-mono uppercase tracking-tight">
                            {getCasoLabel(tarea.casoId)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[9px] px-2 py-0.5 rounded-[4px] border font-bold uppercase tracking-tight ${estado.color}`}>
                          {estado.label}
                        </span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-[4px] border font-bold uppercase tracking-tight ${prioridad.bg}`}>
                          {prioridad.label}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-apple-text-secondary mb-4 line-clamp-2 leading-relaxed">{tarea.descripcion}</p>

                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-4 text-[10px] text-apple-text-secondary font-medium">
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
                        <span className="flex items-center gap-1.5 text-apple-accent">
                          <span className="text-[8px] font-black uppercase tracking-wider">Paso:</span>
                          {tarea.pasoId}
                        </span>
                      )}
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3 w-full bg-black/[0.08] rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-apple-accent rounded-full transition-all duration-500"
                        style={{ width: `${tarea.porcentaje}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-1 p-3 border-l border-black/[0.06] opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <select
                      value={tarea.estado}
                      onChange={e => handleStatusChange(tarea, e.target.value as EstadoTarea)}
                      className="text-[10px] bg-black/[0.02] border border-black/10 rounded px-1.5 py-1 text-apple-text outline-none cursor-pointer"
                      title="Cambiar estado"
                    >
                      {Object.entries(ESTADO_TAREA).map(([k, v]) => (
                        <option key={k} value={k}>{v.label}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleDeleteTarea(tarea)}
                      className="p-1.5 rounded hover:bg-red-500/10 text-apple-text-secondary hover:text-red-600 transition-colors"
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

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* ── MODAL NUEVA TAREA ────────────────────────────────────────────── */}
      {/* ════════════════════════════════════════════════════════════════════ */}
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

// ── Modal de Creación de Tarea ───────────────────────────────────────────────

function NuevaTareaModal({
  onClose,
  onSubmit,
  casos,
  normativas,
}: {
  onClose: () => void;
  onSubmit: (data: Omit<TareaForense, 'id' | 'fechaCreacion'>) => void;
  casos: { id: string; numeroCaso: string; titulo: string }[];
  normativas: { id: string; codigo: string }[];
}) {
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
        className="bg-white border border-black/[0.08] rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-[0_32px_64px_rgba(0,0,0,0.12)] flex flex-col apple-scale-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-black/[0.06]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-apple-accent/10">
              <ClipboardList size={18} className="text-apple-accent" />
            </div>
            <div>
              <h2 className="text-base font-bold text-apple-text">New Forensic Task</h2>
              <p className="text-[10px] text-apple-text-secondary font-medium">Art. 187 COPP — Task Registration</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-black/[0.04] text-apple-text-secondary hover:text-apple-text transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Caso */}
          <div>
            <label className="apple-label">Associated Case *</label>
            <select
              value={form.casoId}
              onChange={e => setForm(p => ({ ...p, casoId: e.target.value }))}
              className="apple-input"
              required
            >
              <option value="">Select a case...</option>
              {casos.map(c => (
                <option key={c.id} value={c.id}>{c.numeroCaso} — {c.titulo}</option>
              ))}
            </select>
          </div>

          {/* Paso / Step */}
          <div>
            <label className="apple-label">Forensic Step</label>
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

          {/* Título */}
          <div>
            <label className="apple-label">Task Title *</label>
            <input
              type="text"
              value={form.titulo}
              onChange={e => setForm(p => ({ ...p, titulo: e.target.value }))}
              className="apple-input"
              placeholder="e.g., Extract WhatsApp backup via APK Downgrade"
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="apple-label">Description</label>
            <textarea
              value={form.descripcion}
              onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))}
              className="apple-input min-h-[80px] resize-y"
              placeholder="Detailed description of the forensic task..."
            />
          </div>

          {/* Row: Asignado + Prioridad */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="apple-label">Assigned To</label>
              <input
                type="text"
                value={form.asignadoA}
                onChange={e => setForm(p => ({ ...p, asignadoA: e.target.value }))}
                className="apple-input"
                placeholder="Expert name"
              />
            </div>
            <div>
              <label className="apple-label">Priority</label>
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

          {/* Fecha vencimiento */}
          <div>
            <label className="apple-label">Due Date</label>
            <input
              type="date"
              value={form.fechaVencimiento}
              onChange={e => setForm(p => ({ ...p, fechaVencimiento: e.target.value }))}
              className="apple-input"
            />
          </div>

          {/* Normativas */}
          <div>
            <label className="apple-label">Related Standards</label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {normativas.map(n => (
                <label
                  key={n.id}
                  className={`flex items-center gap-2 text-[10px] font-bold p-2 rounded-md border cursor-pointer transition-all ${
                    form.normativasRelacionadas.includes(n.id)
                      ? 'bg-apple-accent/10 border-apple-accent/30 text-apple-accent'
                      : 'bg-black/[0.02] border-black/[0.06] text-apple-text-secondary hover:bg-black/[0.04]'
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
                      ? 'bg-apple-accent border-apple-accent'
                      : 'border-black/20'
                  }`}>
                    {form.normativasRelacionadas.includes(n.id) && (
                      <CheckCircle2 size={8} className="text-white" />
                    )}
                  </div>
                  <span className="truncate">{n.codigo}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Observaciones */}
          <div>
            <label className="apple-label">Observations</label>
            <textarea
              value={form.observaciones}
              onChange={e => setForm(p => ({ ...p, observaciones: e.target.value }))}
              className="apple-input min-h-[60px] resize-y"
              placeholder="Additional notes..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-black/[0.06]">
            <button type="button" onClick={onClose} className="apple-btn apple-btn-secondary text-sm">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!form.casoId || !form.titulo}
              className="apple-btn apple-btn-primary text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus size={16} /> Register Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
