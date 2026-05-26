import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCMSStore, CasoCMS, Evidencia, TareaForense, EstadoCaso, PrioridadCaso, NivelCumplimiento, TipoEvidencia } from '../store/cmsStore';

import { 
  ArrowLeft, Calendar, User, Shield, Plus, Clock, 
  Smartphone, History, ListTodo, ShieldCheck, 
  Trash2, PlusCircle, CheckSquare, Square, Fingerprint, AlertTriangle
} from 'lucide-react';

const ESTADO_OPCIONES: { value: EstadoCaso; label: string; color: string }[] = [
  { value: 'iniciado',    label: 'Iniciado',    color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  { value: 'en_proceso',  label: 'En Proceso',  color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
  { value: 'analisis',    label: 'Análisis',    color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  { value: 'informe',     label: 'Informe',     color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
  { value: 'cerrado',     label: 'Cerrado',     color: 'bg-green-500/20 text-green-300 border-green-500/30' },
  { value: 'archivado',   label: 'Archivado',   color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
];

const PRIORIDAD_OPCIONES: { value: PrioridadCaso; label: string; color: string }[] = [
  { value: 'critica', label: 'Crítica', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
  { value: 'alta',    label: 'Alta',    color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
  { value: 'media',   label: 'Media',   color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
  { value: 'baja',    label: 'Baja',    color: 'bg-green-500/20 text-green-300 border-green-500/30' },
];

const CUMPLIMIENTO_CONFIG: Record<NivelCumplimiento, { label: string; color: string; bg: string }> = {
  conforme:    { label: 'Conforme',    color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
  parcial:     { label: 'Parcial',     color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  no_conforme: { label: 'No Conforme', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  no_aplica:   { label: 'N/A',         color: 'text-gray-400', bg: 'bg-gray-500/10 border-gray-500/20' },
};

const TIPO_EVIDENCIA_LABELS: Record<TipoEvidencia, string> = {
  dispositivo_movil: 'Dispositivo Móvil',
  computador: 'Computador',
  memoria: 'Memoria Extraíble',
  imagen_forense: 'Imagen Forense',
  documento: 'Documento Técnico',
  otro: 'Otro',
};

export default function CasoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Zustand Store CMS
  const casos = useCMSStore(state => state.casos);
  const updateCaso = useCMSStore(state => state.updateCaso);
  const addAuditLog = useCMSStore(state => state.addAuditLog);

  const evidencias = useCMSStore(state => state.evidencias);
  const addEvidencia = useCMSStore(state => state.addEvidencia);
  const deleteEvidencia = useCMSStore(state => state.deleteEvidencia);
  
  const tareas = useCMSStore(state => state.tareas);
  const addTarea = useCMSStore(state => state.addTarea);
  const updateTarea = useCMSStore(state => state.updateTarea);
  const deleteTarea = useCMSStore(state => state.deleteTarea);

  const auditLogs = useCMSStore(state => state.auditLogs);
  const normativas = useCMSStore(state => state.normativas);

  // Local States
  const [caso, setCaso] = useState<CasoCMS | null>(null);
  const [showEvidenciaModal, setShowEvidenciaModal] = useState(false);
  const [showTareaModal, setShowTareaModal] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{ message: string; onConfirm: () => void } | null>(null);

  // Modal Evidencia Form
  const [evidenciaForm, setEvidenciaForm] = useState({
    numero: '',
    tipo: 'dispositivo_movil' as TipoEvidencia,
    descripcion: '',
    marca: '',
    modelo: '',
    serial: '',
    imei: '',
    estadoFisico: 'Buen estado, sin daños externos.',
    hashSHA256: '',
    ubicacionFisica: 'Bóveda de Evidencias Digitales',
    sellado: true,
    etiquetado: true,
  });

  // Modal Tarea Form
  const [tareaForm, setTareaForm] = useState({
    titulo: '',
    descripcion: '',
    asignadoA: '',
    prioridad: 'media' as PrioridadCaso,
    normativasRelacionadas: [] as string[],
  });

  // Cargar caso actual al montar o cambiar el ID
  useEffect(() => {
    const found = casos.find(c => c.id === id);
    if (found) {
      setCaso(found);
    } else {
      // Intentar forzar una recarga o regresar si no se encuentra
      navigate('/casos');
    }
  }, [id, casos, navigate]);

  if (!caso) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-cms-accent/30 border-t-cms-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Filtrar entidades del caso
  const evidenciasCaso = evidencias.filter(e => e.casoId === caso.id);
  const tareasCaso = tareas.filter(t => t.casoId === caso.id);
  const logsCaso = auditLogs.filter(l => l.casoId === caso.id);

  // Handlers de Actualización del Caso
  const handleEstadoChange = (nuevoEstado: EstadoCaso) => {
    updateCaso(caso.id, { estado: nuevoEstado });
    addAuditLog({
      accion: 'ESTADO_CAMBIADO',
      detalle: `Estado del caso actualizado a: ${nuevoEstado.toUpperCase()}`,
      nivel: 'info',
      casoId: caso.id,
      usuario: caso.peritoLider || 'Compliance Officer'
    });
  };

  const handlePrioridadChange = (nuevaPrioridad: PrioridadCaso) => {
    updateCaso(caso.id, { prioridad: nuevaPrioridad });
    addAuditLog({
      accion: 'PRIORIDAD_CAMBIADA',
      detalle: `Prioridad del caso actualizada a: ${nuevaPrioridad.toUpperCase()}`,
      nivel: 'warning',
      casoId: caso.id,
      usuario: caso.peritoLider || 'Compliance Officer'
    });
  };

  const handleCumplimientoChange = (nuevoCumplimiento: NivelCumplimiento) => {
    updateCaso(caso.id, { nivelCumplimientoGeneral: nuevoCumplimiento });
    addAuditLog({
      accion: 'CUMPLIMIENTO_ACTUALIZADO',
      detalle: `Evaluación de cumplimiento legal ajustada a: ${nuevoCumplimiento.toUpperCase()}`,
      nivel: 'success',
      casoId: caso.id,
      usuario: 'Compliance Officer'
    });
  };

  // Handlers Evidencia
  const handleRegistrarEvidencia = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevaEvidencia: Omit<Evidencia, 'id'> = {
      ...evidenciaForm,
      casoId: caso.id,
      fechaRecepcion: new Date().toISOString(),
    };
    addEvidencia(nuevaEvidencia);

    const nuevoTotalEvidencias = evidenciasCaso.length + 1;
    const tareasCasoActual = tareas.filter(t => t.casoId === caso.id);
    const tareasCompletadas = tareasCasoActual.filter(t => t.estado === 'completada').length;
    const totalItems = nuevoTotalEvidencias + tareasCasoActual.length;
    const completados = Math.min(nuevoTotalEvidencias, 1) + tareasCompletadas;
    const nuevoPorcentaje = totalItems > 0 ? Math.round((completados / (totalItems > 0 ? totalItems * 2 : 1)) * 100) : 0;
    updateCaso(caso.id, { 
      totalEvidencias: nuevoTotalEvidencias, 
      porcentajeCompletado: Math.min(100, Math.max(caso.porcentajeCompletado, nuevoPorcentaje))
    });

    addAuditLog({
      accion: 'EVIDENCIA_REGISTRADA',
      detalle: `Evidencia ${evidenciaForm.numero} (${evidenciaForm.marca} ${evidenciaForm.modelo}) consignada e incorporada a cadena de custodia.`,
      nivel: 'success',
      casoId: caso.id,
      usuario: caso.peritoLider || 'Perito'
    });

    // Reset Form & Close
    setEvidenciaForm({
      numero: '',
      tipo: 'dispositivo_movil',
      descripcion: '',
      marca: '',
      modelo: '',
      serial: '',
      imei: '',
      estadoFisico: 'Buen estado, sin daños externos.',
      hashSHA256: '',
      ubicacionFisica: 'Bóveda de Evidencias Digitales',
      sellado: true,
      etiquetado: true,
    });
    setShowEvidenciaModal(false);
  };

  const handleEliminarEvidencia = (evidId: string, evidNumero: string) => {
    setConfirmDialog({
      message: `¿Está seguro de eliminar la evidencia ${evidNumero}?`,
      onConfirm: () => {
        deleteEvidencia(evidId);
        const nuevoTotal = Math.max(0, evidenciasCaso.length - 1);
        updateCaso(caso.id, { totalEvidencias: nuevoTotal });
        
        addAuditLog({
          accion: 'EVIDENCIA_ELIMINADA',
          detalle: `Evidencia ${evidNumero} removida físicamente del expediente.`,
          nivel: 'error',
          casoId: caso.id,
          usuario: caso.peritoLider || 'Perito'
        });
        setConfirmDialog(null);
      }
    });
  };

  // Handlers Tarea
  const handleCrearTarea = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevaTarea: Omit<TareaForense, 'id' | 'fechaCreacion'> = {
      ...tareaForm,
      casoId: caso.id,
      estado: 'pendiente',
      observaciones: '',
      porcentaje: 0,
    };
    addTarea(nuevaTarea);

    addAuditLog({
      accion: 'TAREA_ASIGNADA',
      detalle: `Nueva tarea forense asignada a ${tareaForm.asignadoA}: "${tareaForm.titulo}"`,
      nivel: 'info',
      casoId: caso.id,
      usuario: 'Coordinador Forense'
    });

    // Reset Form & Close
    setTareaForm({
      titulo: '',
      descripcion: '',
      asignadoA: '',
      prioridad: 'media',
      normativasRelacionadas: [],
    });
    setShowTareaModal(false);
  };

  const handleToggleTarea = (t: TareaForense) => {
    const nuevoEstado = t.estado === 'completada' ? 'pendiente' : 'completada';
    updateTarea(t.id, { 
      estado: nuevoEstado,
      fechaCompletada: nuevoEstado === 'completada' ? new Date().toISOString() : undefined 
    });

    // Recalcular el porcentaje del caso basado en tareas completadas
    const updatedTareas = tareas.filter(x => x.casoId === caso.id).map(x => x.id === t.id ? { ...x, estado: nuevoEstado } : x);
    const completadasCount = updatedTareas.filter(x => x.estado === 'completada').length;
    const totalCount = updatedTareas.length;
    const progressPercent = totalCount > 0 ? Math.round((completadasCount / totalCount) * 100) : caso.porcentajeCompletado;

    updateCaso(caso.id, { porcentajeCompletado: progressPercent });

    addAuditLog({
      accion: nuevoEstado === 'completada' ? 'TAREA_COMPLETADA' : 'TAREA_REABIERTA',
      detalle: `La tarea "${t.titulo}" fue marcada como ${nuevoEstado === 'completada' ? 'COMPLETADA' : 'PENDIENTE'}`,
      nivel: nuevoEstado === 'completada' ? 'success' : 'warning',
      casoId: caso.id,
      usuario: t.asignadoA || 'Perito'
    });
  };

  const handleEliminarTarea = (tareaId: string, titulo: string) => {
    setConfirmDialog({
      message: `¿Está seguro de eliminar la tarea: "${titulo}"?`,
      onConfirm: () => {
        deleteTarea(tareaId);
        addAuditLog({
          accion: 'TAREA_ELIMINADA',
          detalle: `Tarea "${titulo}" eliminada del checklist.`,
          nivel: 'error',
          casoId: caso.id,
          usuario: 'Coordinador Forense'
        });
        setConfirmDialog(null);
      }
    });
  };

  // Navegar a Fases, Tareas & Compliance
  const handleIniciarFlujoForense = () => {
    navigate('/control/seguimiento-compliance');
  };

  const statusConf = ESTADO_OPCIONES.find(e => e.value === caso.estado) || ESTADO_OPCIONES[0];
  const priorityConf = PRIORIDAD_OPCIONES.find(p => p.value === caso.prioridad) || PRIORIDAD_OPCIONES[2];
  const cumplConfig = CUMPLIMIENTO_CONFIG[caso.nivelCumplimientoGeneral] || CUMPLIMIENTO_CONFIG.no_aplica;

  return (
    <div className="space-y-8 animate-fade-in text-fluent-text pb-12">
      
      {/* ── Volver & Cabecera Superior ────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <Link to="/casos" className="flex items-center gap-2 text-xs font-bold text-fluent-accent hover:text-fluent-accent-light transition-colors uppercase tracking-[0.2em] w-fit">
          <ArrowLeft size={16} />
          Volver a Directorio de Casos
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-fluent-surface/40 p-6 sm:p-8 rounded-xl border border-fluent-border">
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-lg font-black text-fluent-accent tracking-widest">{caso.numeroCaso}</span>
              <div className="h-4 w-px bg-fluent-border hidden sm:block"></div>
              <span className="text-xs text-white/50 font-medium">PRCC: {caso.numeroPRCC || 'N/A'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">{caso.titulo}</h1>
            <p className="text-sm text-fluent-text-muted leading-relaxed max-w-3xl">{caso.descripcion}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 text-xs font-semibold text-white/60">
              <div className="flex items-center gap-2">
                <User size={14} className="text-fluent-accent" />
                <span>Perito: <strong className="text-white">{caso.peritoLider}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Shield size={14} className="text-fluent-accent" />
                <span>Fiscal: <strong className="text-white">{caso.fiscal || 'N/A'}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-fluent-accent" />
                <span>Registro: <strong className="text-white">{new Date(caso.fechaCreacion).toLocaleDateString('es')}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-fluent-accent" />
                <span>Modificación: <strong className="text-white">{new Date(caso.fechaUltimaActualizacion).toLocaleDateString('es')}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-4 min-w-[200px] justify-end">
            <button 
              onClick={handleIniciarFlujoForense}
              className="fluent-btn bg-fluent-accent text-black font-extrabold hover:bg-fluent-accent-light shadow-[0_0_15px_rgba(254,207,6,0.3)] px-6 py-3 rounded-md text-xs uppercase tracking-widest flex items-center justify-center gap-2.5"
            >
              <ShieldCheck size={18} strokeWidth={2.5} />
              Fases, Tareas &amp; Compliance
            </button>
            <div className="flex items-center gap-2 justify-end text-xs">
              <span className="text-white/40">Cumplimiento:</span>
              <select 
                value={caso.nivelCumplimientoGeneral}
                onChange={(e) => handleCumplimientoChange(e.target.value as NivelCumplimiento)}
                className="bg-fluent-surface border border-fluent-border text-white text-[11px] font-bold rounded p-1 shadow outline-none"
              >
                <option value="conforme">Conforme</option>
                <option value="parcial">Parcial</option>
                <option value="no_conforme">No Conforme</option>
                <option value="no_aplica">N/A</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ── KPIs e Inputs de Control Rápido ───────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* KPI 1: Avance */}
        <div className="fluent-mica p-5 rounded-xl border-l-4 border-fluent-accent flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-fluent-text-muted tracking-widest">Avance del Caso</span>
            <h3 className="text-3xl font-black text-white mt-1">{caso.porcentajeCompletado}%</h3>
          </div>
          <div className="w-full mt-4">
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-fluent-accent rounded-full transition-all duration-500" style={{ width: `${caso.porcentajeCompletado}%` }} />
            </div>
          </div>
        </div>

        {/* KPI 2: Estado de Control */}
        <div className="fluent-mica p-5 rounded-xl flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-fluent-text-muted tracking-widest">Estado Administrativo</span>
            <div className="mt-2">
              <select 
                value={caso.estado}
                onChange={(e) => handleEstadoChange(e.target.value as EstadoCaso)}
                className="w-full bg-fluent-surfaceActive border border-fluent-border rounded p-2 text-sm font-bold text-white outline-none"
              >
                {ESTADO_OPCIONES.map(e => (
                  <option key={e.value} value={e.value}>{e.label}</option>
                ))}
              </select>
            </div>
          </div>
          <span className={`text-[9px] font-black uppercase tracking-wider text-center mt-2 p-1 rounded border ${statusConf.color}`}>
            {statusConf.label}
          </span>
        </div>

        {/* KPI 3: Prioridad de Atención */}
        <div className="fluent-mica p-5 rounded-xl flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-fluent-text-muted tracking-widest">Criticidad Legal</span>
            <div className="mt-2">
              <select 
                value={caso.prioridad}
                onChange={(e) => handlePrioridadChange(e.target.value as PrioridadCaso)}
                className="w-full bg-fluent-surfaceActive border border-fluent-border rounded p-2 text-sm font-bold text-white outline-none"
              >
                {PRIORIDAD_OPCIONES.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>
          <span className={`text-[9px] font-black uppercase tracking-wider text-center mt-2 p-1 rounded border ${priorityConf.color}`}>
            Prioridad {priorityConf.label}
          </span>
        </div>

        {/* KPI 4: Compliance Normativo */}
        <div className="fluent-mica p-5 rounded-xl flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-fluent-text-muted tracking-widest">Dictamen Compliance</span>
            <h3 className={`text-2xl font-black mt-2 tracking-tight ${cumplConfig.color}`}>{cumplConfig.label}</h3>
          </div>
          <span className={`text-[9px] font-black uppercase tracking-wider text-center mt-2 p-1 rounded border ${cumplConfig.bg} ${cumplConfig.color}`}>
            Auditoría Legal
          </span>
        </div>

      </div>

      {/* ── Cuerpo: Evidencias y Tareas ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Panel Izquierdo: Tabla de Evidencias Físicas y Digitales */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="fluent-mica rounded-xl overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <h2 className="font-bold text-white flex items-center gap-2 text-base">
                <Smartphone size={18} className="text-fluent-accent" />
                Evidencias en Custodia ({evidenciasCaso.length})
              </h2>
              <button 
                onClick={() => setShowEvidenciaModal(true)}
                className="text-[10px] font-black text-fluent-accent hover:text-fluent-accent-light transition-colors uppercase tracking-[0.15em] flex items-center gap-1.5"
              >
                <PlusCircle size={14} /> Consignar Evidencia
              </button>
            </div>

            <div className="p-0 overflow-x-auto">
              {evidenciasCaso.length === 0 ? (
                <div className="p-16 text-center">
                  <Smartphone size={40} className="text-fluent-text-muted mx-auto mb-4 opacity-25" />
                  <p className="text-sm text-fluent-text-muted">No se han registrado evidencias físicas ni digitales.</p>
                  <button 
                    onClick={() => setShowEvidenciaModal(true)}
                    className="mt-4 text-xs font-bold text-fluent-accent underline"
                  >
                    Registrar la primera evidencia
                  </button>
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.01] text-fluent-text-muted uppercase tracking-wider font-bold">
                      <th className="px-5 py-4">Ítem / Código</th>
                      <th className="px-5 py-4">Tipo</th>
                      <th className="px-5 py-4">Dispositivo / Descripción</th>
                      <th className="px-5 py-4">Origen SHA-256</th>
                      <th className="px-5 py-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-medium">
                    {evidenciasCaso.map(e => (
                      <tr key={e.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-4">
                          <span className="font-mono font-bold text-fluent-accent bg-fluent-accent/10 px-2 py-0.5 rounded">
                            {e.numero}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-white/80">
                          {TIPO_EVIDENCIA_LABELS[e.tipo] || e.tipo}
                        </td>
                        <td className="px-5 py-4">
                          <div className="text-white font-bold">{e.marca} {e.modelo}</div>
                          {e.serial && <span className="text-[10px] text-white/40 block">Serial: {e.serial}</span>}
                          {e.imei && <span className="text-[10px] text-white/40 block">IMEI: {e.imei}</span>}
                        </td>
                        <td className="px-5 py-4">
                          {e.hashSHA256 ? (
                            <div className="flex items-center gap-1">
                              <Fingerprint size={12} className="text-green-400 shrink-0" />
                              <span className="font-mono text-[10px] text-green-300 truncate max-w-[140px] block" title={e.hashSHA256}>
                                {e.hashSHA256}
                              </span>
                            </div>
                          ) : (
                            <span className="text-white/30 italic">No calculado</span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button 
                            onClick={() => handleEliminarEvidencia(e.id, e.numero)}
                            className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded transition-colors"
                            title="Eliminar evidencia"
                          >
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Marco Normativo Aplicado al Caso */}
          <div className="fluent-mica p-6 rounded-xl space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Shield size={18} className="text-fluent-accent" />
              Leyes y Estándares de Aplicación (ISO & MUCC)
            </h3>
            <p className="text-xs text-fluent-text-muted leading-relaxed">
              Este caso de peritaje móvil está estructurado bajo las directrices y requisitos normativos de los siguientes cuerpos normativos cargados en nuestro RAG de cumplimiento:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {normativas.map(n => {
                const aplicado = caso.normativasAplicadas.includes(n.id) || n.id === 'n1' || n.id === 'n4';
                return (
                  <div key={n.id} className={`p-3 rounded-lg border text-xs flex items-start gap-3 transition-all ${
                    aplicado ? 'bg-fluent-accent/5 border-fluent-accent/30 text-white' : 'bg-white/[0.01] border-white/5 text-fluent-text-muted opacity-50'
                  }`}>
                    <ShieldCheck size={16} className={aplicado ? 'text-fluent-accent shrink-0 mt-0.5' : 'text-white/20 shrink-0 mt-0.5'} />
                    <div>
                      <h4 className="font-bold text-white">{n.codigo}</h4>
                      <p className="text-[10px] text-white/50 leading-snug mt-0.5">{n.nombre}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Panel Derecho: Checklist de Tareas & Auditoría */}
        <div className="space-y-6">
          
          {/* Checklist de Tareas Forenses */}
          <div className="fluent-mica p-6 rounded-xl shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <ListTodo size={16} className="text-fluent-accent" />
                Checklist Forense
              </h3>
              <button 
                onClick={() => setShowTareaModal(true)}
                className="text-[9px] font-black text-fluent-accent hover:text-fluent-accent-light uppercase tracking-wider flex items-center gap-1"
              >
                <Plus size={12} /> Agregar Tarea
              </button>
            </div>

            <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
              {tareasCaso.length === 0 ? (
                <div className="text-center py-8 text-fluent-text-muted text-xs italic">
                  No hay tareas registradas en el checklist de este caso.
                </div>
              ) : tareasCaso.map(t => {
                const completada = t.estado === 'completada';
                return (
                  <div 
                    key={t.id} 
                    className={`flex items-start justify-between gap-3 p-3 rounded-lg border transition-all ${
                      completada ? 'bg-green-500/[0.02] border-green-500/20 text-white/50' : 'bg-white/[0.02] border-white/5 text-white'
                    }`}
                  >
                    <button 
                      onClick={() => handleToggleTarea(t)}
                      className="shrink-0 mt-0.5 text-fluent-text hover:text-fluent-accent-light transition-colors"
                    >
                      {completada ? (
                        <CheckSquare size={16} className="text-green-400" />
                      ) : (
                        <Square size={16} className="text-white/40" />
                      )}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold ${completada ? 'line-through' : ''}`}>
                        {t.titulo}
                      </p>
                      {t.asignadoA && (
                        <span className="text-[10px] text-white/30 block mt-0.5">Asignado: {t.asignadoA}</span>
                      )}
                    </div>

                    <button 
                      onClick={() => handleEliminarTarea(t.id, t.titulo)}
                      className="p-1 text-white/20 hover:text-red-400 shrink-0 transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Línea de Tiempo de Auditoría del Caso */}
          <div className="fluent-mica p-6 rounded-xl shadow-xl space-y-6">
            <div className="border-b border-white/5 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <History size={16} className="text-fluent-accent" />
                Historial de Trazabilidad (Caso)
              </h3>
            </div>

            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
              {logsCaso.length === 0 ? (
                <div className="text-center py-8 text-fluent-text-muted text-xs italic">
                  No hay logs de auditoría para este caso.
                </div>
              ) : logsCaso.map(log => (
                <div key={log.id} className="text-xs relative pl-4 border-l border-white/10 space-y-1">
                  <div className={`absolute left-[-4.5px] top-1.5 w-2 h-2 rounded-full ${
                    log.nivel === 'success' ? 'bg-green-400' :
                    log.nivel === 'warning' ? 'bg-yellow-400' :
                    log.nivel === 'error' ? 'bg-red-400' : 'bg-fluent-accent'
                  }`} />
                  <div className="flex justify-between items-center gap-2">
                    <span className="font-mono text-[9px] font-black text-fluent-accent uppercase tracking-tighter">
                      {log.accion}
                    </span>
                    <span className="text-[8px] text-white/30 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString('es')}
                    </span>
                  </div>
                  <p className="text-[10px] text-white/70 leading-relaxed font-medium">
                    {log.detalle}
                  </p>
                  <span className="text-[8px] text-white/20 block font-bold">Por: {log.usuario}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* ── MODAL: REGISTRAR EVIDENCIA ────────────────────────────────────────── */}
      {showEvidenciaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowEvidenciaModal(false)} />
          <div className="relative w-full max-w-2xl bg-[#1c1c1c] border border-fluent-border rounded-xl shadow-2xl overflow-hidden animate-fade-in z-10">
            
            <div className="p-6 border-b border-white/5 bg-white/[0.01]">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Smartphone className="text-fluent-accent" />
                Consignar Dispositivo / Evidencia
              </h2>
              <p className="text-xs text-fluent-text-muted mt-1">Escriba los datos periciales para incorporarlos a la cadena de custodia.</p>
            </div>

            <form onSubmit={handleRegistrarEvidencia} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="fluent-label">Código/Número de Ítem *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Ej. EVID-001"
                    value={evidenciaForm.numero}
                    onChange={e => setEvidenciaForm({ ...evidenciaForm, numero: e.target.value })}
                    className="fluent-input"
                  />
                </div>
                <div>
                  <label className="fluent-label">Tipo de Evidencia *</label>
                  <select 
                    value={evidenciaForm.tipo}
                    onChange={e => setEvidenciaForm({ ...evidenciaForm, tipo: e.target.value as TipoEvidencia })}
                    className="fluent-input"
                  >
                    <option value="dispositivo_movil">Dispositivo Móvil</option>
                    <option value="computador">Computador</option>
                    <option value="memoria">Memoria Extraíble</option>
                    <option value="imagen_forense">Imagen Forense</option>
                    <option value="documento">Documento Técnico</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="fluent-label">Marca</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Samsung, Apple"
                    value={evidenciaForm.marca}
                    onChange={e => setEvidenciaForm({ ...evidenciaForm, marca: e.target.value })}
                    className="fluent-input"
                  />
                </div>
                <div>
                  <label className="fluent-label">Modelo</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Galaxy S22, iPhone 13"
                    value={evidenciaForm.modelo}
                    onChange={e => setEvidenciaForm({ ...evidenciaForm, modelo: e.target.value })}
                    className="fluent-input"
                  />
                </div>
                <div>
                  <label className="fluent-label">Serial</label>
                  <input 
                    type="text" 
                    placeholder="Serial único del dispositivo"
                    value={evidenciaForm.serial}
                    onChange={e => setEvidenciaForm({ ...evidenciaForm, serial: e.target.value })}
                    className="fluent-input"
                  />
                </div>
                <div>
                  <label className="fluent-label">IMEI</label>
                  <input 
                    type="text" 
                    placeholder="IMEI del dispositivo"
                    value={evidenciaForm.imei}
                    onChange={e => setEvidenciaForm({ ...evidenciaForm, imei: e.target.value })}
                    className="fluent-input"
                  />
                </div>
              </div>

              <div>
                <label className="fluent-label">Descripción de la Evidencia *</label>
                <textarea 
                  required 
                  rows={2}
                  placeholder="Ej. Teléfono inteligente con protector negro, pantalla agrietada..."
                  value={evidenciaForm.descripcion}
                  onChange={e => setEvidenciaForm({ ...evidenciaForm, descripcion: e.target.value })}
                  className="fluent-input"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="fluent-label">Estado Físico en la Recepción *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Buen estado, apagado, pantalla rota..."
                    value={evidenciaForm.estadoFisico}
                    onChange={e => setEvidenciaForm({ ...evidenciaForm, estadoFisico: e.target.value })}
                    className="fluent-input"
                  />
                </div>
                <div>
                  <label className="fluent-label">Hash SHA-256 de Origen (Integridad)</label>
                  <input 
                    type="text" 
                    placeholder="Clave hash SHA-256 si se dispone"
                    value={evidenciaForm.hashSHA256}
                    onChange={e => setEvidenciaForm({ ...evidenciaForm, hashSHA256: e.target.value })}
                    className="fluent-input font-mono text-xs text-green-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="fluent-label">Ubicación Física *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Bóveda, laboratorio..."
                    value={evidenciaForm.ubicacionFisica}
                    onChange={e => setEvidenciaForm({ ...evidenciaForm, ubicacionFisica: e.target.value })}
                    className="fluent-input"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input 
                    type="checkbox" 
                    id="sellado" 
                    checked={evidenciaForm.sellado}
                    onChange={e => setEvidenciaForm({ ...evidenciaForm, sellado: e.target.checked })}
                    className="rounded border-fluent-border text-fluent-accent bg-fluent-surfaceActive h-4 w-4"
                  />
                  <label htmlFor="sellado" className="text-xs font-semibold text-white/80 select-none">¿Sellado en Bolsa?</label>
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input 
                    type="checkbox" 
                    id="etiquetado" 
                    checked={evidenciaForm.etiquetado}
                    onChange={e => setEvidenciaForm({ ...evidenciaForm, etiquetado: e.target.checked })}
                    className="rounded border-fluent-border text-fluent-accent bg-fluent-surfaceActive h-4 w-4"
                  />
                  <label htmlFor="etiquetado" className="text-xs font-semibold text-white/80 select-none">¿Etiquetado Visible?</label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
                <button 
                  type="button" 
                  onClick={() => setShowEvidenciaModal(false)}
                  className="fluent-btn bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded px-4"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="fluent-btn bg-fluent-accent hover:bg-fluent-accent-light text-black font-extrabold px-6 rounded shadow-lg"
                >
                  Confirmar Consignación
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ── MODAL: AGREGAR TAREA FORENSE ──────────────────────────────────────── */}
      {showTareaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowTareaModal(false)} />
          <div className="relative w-full max-w-lg bg-[#1c1c1c] border border-fluent-border rounded-xl shadow-2xl overflow-hidden animate-fade-in z-10">
            
            <div className="p-6 border-b border-white/5 bg-white/[0.01]">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ListTodo className="text-fluent-accent" />
                Registrar Tarea de Cumplimiento
              </h2>
            </div>

            <form onSubmit={handleCrearTarea} className="p-6 space-y-4">
              
              <div>
                <label className="fluent-label">Título de la Tarea *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Ej. Extracción lógica, Fijación fotográfica..."
                  value={tareaForm.titulo}
                  onChange={e => setTareaForm({ ...tareaForm, titulo: e.target.value })}
                  className="fluent-input"
                />
              </div>

              <div>
                <label className="fluent-label">Descripción</label>
                <textarea 
                  rows={2}
                  placeholder="Detalle sobre el procedimiento pericial a seguir..."
                  value={tareaForm.descripcion}
                  onChange={e => setTareaForm({ ...tareaForm, descripcion: e.target.value })}
                  className="fluent-input"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="fluent-label">Asignado A (Perito/Asistente) *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Ej. Ing. Carlos Pérez"
                    value={tareaForm.asignadoA}
                    onChange={e => setTareaForm({ ...tareaForm, asignadoA: e.target.value })}
                    className="fluent-input"
                  />
                </div>
                <div>
                  <label className="fluent-label">Prioridad de Ejecución</label>
                  <select 
                    value={tareaForm.prioridad}
                    onChange={e => setTareaForm({ ...tareaForm, prioridad: e.target.value as PrioridadCaso })}
                    className="fluent-input"
                  >
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                    <option value="critica">Crítica</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
                <button 
                  type="button" 
                  onClick={() => setShowTareaModal(false)}
                  className="fluent-btn bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded px-4"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="fluent-btn bg-fluent-accent hover:bg-fluent-accent-light text-black font-extrabold px-6 rounded shadow-lg"
                >
                  Agregar a Checklist
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ── MODAL: CONFIRMACIÓN ─────────────────────────────────────────── */}
      {confirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setConfirmDialog(null)} />
          <div className="relative w-full max-w-md bg-[#1c1c1c] border border-fluent-border rounded-xl shadow-2xl overflow-hidden animate-fade-in z-10 p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={28} className="text-red-400" />
            </div>
            <p className="text-white font-bold text-sm mb-6">{confirmDialog.message}</p>
            <div className="flex justify-center gap-3">
              <button 
                onClick={() => setConfirmDialog(null)}
                className="fluent-btn bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded px-6"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDialog.onConfirm}
                className="fluent-btn bg-red-500 hover:bg-red-600 text-white font-bold px-6 rounded"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
