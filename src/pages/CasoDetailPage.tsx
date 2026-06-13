import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCMSStore, CasoCMS, Evidencia, TareaForense, EstadoCaso, PrioridadCaso, NivelCumplimiento, TipoEvidencia } from '../store/cmsStore';

import { 
  ArrowLeft, Calendar, User, Shield, Plus, Clock, 
  Smartphone, History, ListTodo, ShieldCheck, 
  Trash2, PlusCircle, CheckSquare, Square, Fingerprint, AlertTriangle
} from '../components/atoms/AppleIcon';

const ESTADO_OPCIONES: { value: EstadoCaso; label: string; color: string }[] = [
  { value: 'iniciado',    label: 'Iniciado',    color: 'bg-blue-500/10 text-[#007AFF] border-blue-500/20' },
  { value: 'en_proceso',  label: 'En Proceso',  color: 'bg-yellow-500/10 text-[#FF9500] border-yellow-500/20' },
  { value: 'analisis',    label: 'Análisis',    color: 'bg-purple-500/10 text-[#AF52DE] border-purple-500/20' },
  { value: 'informe',     label: 'Informe',     color: 'bg-indigo-500/10 text-[#5856D6] border-indigo-500/20' },
  { value: 'cerrado',     label: 'Cerrado',     color: 'bg-green-500/10 text-[#34C759] border-green-500/20' },
  { value: 'archivado',   label: 'Archivado',   color: 'bg-gray-500/10 text-[#86868B] border-gray-500/20' },
];

const PRIORIDAD_OPCIONES: { value: PrioridadCaso; label: string; color: string }[] = [
  { value: 'critica', label: 'Crítica', color: 'bg-red-500/10 text-[#FF3B30] border-red-500/20' },
  { value: 'alta',    label: 'Alta',    color: 'bg-orange-500/10 text-[#FF9500] border-orange-500/20' },
  { value: 'media',   label: 'Media',   color: 'bg-yellow-500/10 text-[#FF9500] border-yellow-500/20' },
  { value: 'baja',    label: 'Baja',    color: 'bg-green-500/10 text-[#34C759] border-green-500/20' },
];

const CUMPLIMIENTO_CONFIG: Record<NivelCumplimiento, { label: string; color: string; bg: string }> = {
  conforme:    { label: 'Conforme',    color: 'text-[#34C759]', bg: 'bg-green-500/10 border-green-500/20' },
  parcial:     { label: 'Parcial',     color: 'text-[#FF9500]', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  no_conforme: { label: 'No Conforme', color: 'text-[#FF3B30]', bg: 'bg-red-500/10 border-red-500/20' },
  no_aplica:   { label: 'N/A',         color: 'text-[#86868B]', bg: 'bg-gray-500/10 border-gray-500/20' },
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

  const [caso, setCaso] = useState<CasoCMS | null>(null);
  const [showEvidenciaModal, setShowEvidenciaModal] = useState(false);
  const [showTareaModal, setShowTareaModal] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{ message: string; onConfirm: () => void } | null>(null);

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

  const [tareaForm, setTareaForm] = useState({
    titulo: '',
    descripcion: '',
    asignadoA: '',
    prioridad: 'media' as PrioridadCaso,
    normativasRelacionadas: [] as string[],
  });

  useEffect(() => {
    const found = casos.find(c => c.id === id);
    if (found) {
      setCaso(found);
    } else {
      navigate('/casos');
    }
  }, [id, casos, navigate]);

  if (!caso) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-[#0071E3]/30 border-t-[#0071E3] rounded-full animate-spin" />
      </div>
    );
  }

  const evidenciasCaso = evidencias.filter(e => e.casoId === caso.id);
  const tareasCaso = tareas.filter(t => t.casoId === caso.id);
  const logsCaso = auditLogs.filter(l => l.casoId === caso.id);

  const handleEstadoChange = (nuevoEstado: EstadoCaso) => {
    updateCaso(caso.id, { estado: nuevoEstado });
    addAuditLog({
      accion: 'ESTADO_CAMBIADO',
      detalle: `Estado del caso actualizado a: ${nuevoEstado.toUpperCase()}`,
      nivel: 'info',
      casoId: caso.id,
      usuario: caso.peritoLider || 'Compliance Officer',
    });
  };

  const handlePrioridadChange = (nuevaPrioridad: PrioridadCaso) => {
    updateCaso(caso.id, { prioridad: nuevaPrioridad });
    addAuditLog({
      accion: 'PRIORIDAD_CAMBIADA',
      detalle: `Prioridad del caso actualizada a: ${nuevaPrioridad.toUpperCase()}`,
      nivel: 'warning',
      casoId: caso.id,
      usuario: caso.peritoLider || 'Compliance Officer',
    });
  };

  const handleCumplimientoChange = (nuevoCumplimiento: NivelCumplimiento) => {
    updateCaso(caso.id, { nivelCumplimientoGeneral: nuevoCumplimiento });
    addAuditLog({
      accion: 'CUMPLIMIENTO_ACTUALIZADO',
      detalle: `Evaluación de cumplimiento legal ajustada a: ${nuevoCumplimiento.toUpperCase()}`,
      nivel: 'success',
      casoId: caso.id,
      usuario: 'Compliance Officer',
    });
  };

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
      porcentajeCompletado: Math.min(100, Math.max(caso.porcentajeCompletado, nuevoPorcentaje)),
    });

    addAuditLog({
      accion: 'EVIDENCIA_REGISTRADA',
      detalle: `Evidencia ${evidenciaForm.numero} (${evidenciaForm.marca} ${evidenciaForm.modelo}) consignada e incorporada a cadena de custodia.`,
      nivel: 'success',
      casoId: caso.id,
      usuario: caso.peritoLider || 'Perito',
    });

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
          usuario: caso.peritoLider || 'Perito',
        });
        setConfirmDialog(null);
      },
    });
  };

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
      usuario: 'Coordinador Forense',
    });

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
      fechaCompletada: nuevoEstado === 'completada' ? new Date().toISOString() : undefined,
    });

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
      usuario: t.asignadoA || 'Perito',
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
          usuario: 'Coordinador Forense',
        });
        setConfirmDialog(null);
      },
    });
  };

  const handleIniciarFlujoForense = () => {
    navigate('/control/seguimiento-compliance');
  };

  const statusConf = ESTADO_OPCIONES.find(e => e.value === caso.estado) || ESTADO_OPCIONES[0];
  const priorityConf = PRIORIDAD_OPCIONES.find(p => p.value === caso.prioridad) || PRIORIDAD_OPCIONES[2];
  const cumplConfig = CUMPLIMIENTO_CONFIG[caso.nivelCumplimientoGeneral] || CUMPLIMIENTO_CONFIG.no_aplica;

  return (
    <div className="space-y-8 apple-fade-in pb-12">

      {/* ── Back Link ── */}
      <div className="flex flex-col gap-4">
        <Link to="/casos" className="flex items-center gap-2 text-xs font-bold text-[#0071E3] hover:text-[#0077ED] transition-colors uppercase tracking-[0.2em] w-fit">
          <ArrowLeft size={16} />
          Volver a Directorio de Casos
        </Link>

        {/* ── Case Info Header ── */}
        <div className="apple-card p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-lg font-black text-[#0071E3] tracking-widest">{caso.numeroCaso}</span>
                <div className="h-4 w-px bg-black/[0.08] hidden sm:block" />
                <span className="text-xs text-[#86868B] font-medium">PRCC: {caso.numeroPRCC || 'N/A'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#1D1D1F] uppercase tracking-tight">{caso.titulo}</h1>
              <p className="text-sm text-[#86868B] leading-relaxed max-w-3xl">{caso.descripcion}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 text-xs font-semibold text-[#86868B]">
                <div className="flex items-center gap-2">
                  <User size={14} className="text-[#0071E3]" />
                  <span>Perito: <strong className="text-[#1D1D1F]">{caso.peritoLider}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-[#0071E3]" />
                  <span>Fiscal: <strong className="text-[#1D1D1F]">{caso.fiscal || 'N/A'}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-[#0071E3]" />
                  <span>Registro: <strong className="text-[#1D1D1F]">{new Date(caso.fechaCreacion).toLocaleDateString('es')}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-[#0071E3]" />
                  <span>Modificación: <strong className="text-[#1D1D1F]">{new Date(caso.fechaUltimaActualizacion).toLocaleDateString('es')}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-4 min-w-[200px] justify-end">
              <button 
                onClick={handleIniciarFlujoForense}
                className="apple-btn bg-[#0071E3] text-white font-extrabold hover:bg-[#0077ED] shadow-[0_0_15px_rgba(0,113,227,0.3)] px-6 py-3 text-xs uppercase tracking-widest flex items-center justify-center gap-2.5"
              >
                <ShieldCheck size={18} strokeWidth={2.5} />
                Continuar el proceso
              </button>
              <div className="flex items-center gap-2 justify-end text-xs">
                <span className="text-[#86868B]">Cumplimiento:</span>
                <select 
                  value={caso.nivelCumplimientoGeneral}
                  onChange={(e) => handleCumplimientoChange(e.target.value as NivelCumplimiento)}
                  className="bg-white dark:bg-[#2C2C2E] border border-black/[0.08] dark:border-white/[0.08] text-[#1D1D1F] dark:text-white text-[11px] font-bold rounded-lg px-2 py-1.5 outline-none focus:border-[#0071E3]"
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
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="apple-card p-5 border-l-4 border-l-[#0071E3] flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-[#86868B] tracking-widest">Avance del Caso</span>
          <h3 className="text-3xl font-black text-[#1D1D1F] mt-1">{caso.porcentajeCompletado}%</h3>
          <div className="w-full mt-4">
            <div className="h-1.5 bg-black/[0.06] rounded-full overflow-hidden">
              <div className="h-full bg-[#0071E3] rounded-full transition-all duration-500" style={{ width: `${caso.porcentajeCompletado}%` }} />
            </div>
          </div>
        </div>

        <div className="apple-card p-5 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-[#86868B] tracking-widest">Estado Administrativo</span>
          <div className="mt-2">
            <select 
              value={caso.estado}
              onChange={(e) => handleEstadoChange(e.target.value as EstadoCaso)}
              className="w-full bg-white dark:bg-[#2C2C2E] border border-black/[0.08] dark:border-white/[0.08] rounded-lg p-2 text-sm font-bold text-[#1D1D1F] dark:text-white outline-none focus:border-[#0071E3]"
            >
              {ESTADO_OPCIONES.map(e => (
                <option key={e.value} value={e.value}>{e.label}</option>
              ))}
            </select>
          </div>
          <span className={`text-[9px] font-black uppercase tracking-wider text-center mt-2 p-1 rounded border ${statusConf.color}`}>
            {statusConf.label}
          </span>
        </div>

        <div className="apple-card p-5 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-[#86868B] tracking-widest">Criticidad Legal</span>
          <div className="mt-2">
            <select 
              value={caso.prioridad}
              onChange={(e) => handlePrioridadChange(e.target.value as PrioridadCaso)}
              className="w-full bg-white dark:bg-[#2C2C2E] border border-black/[0.08] dark:border-white/[0.08] rounded-lg p-2 text-sm font-bold text-[#1D1D1F] dark:text-white outline-none focus:border-[#0071E3]"
            >
              {PRIORIDAD_OPCIONES.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
          <span className={`text-[9px] font-black uppercase tracking-wider text-center mt-2 p-1 rounded border ${priorityConf.color}`}>
            Prioridad {priorityConf.label}
          </span>
        </div>

        <div className="apple-card p-5 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-[#86868B] tracking-widest">Dictamen Compliance</span>
          <h3 className={`text-2xl font-black mt-2 tracking-tight ${cumplConfig.color}`}>{cumplConfig.label}</h3>
          <span className={`text-[9px] font-black uppercase tracking-wider text-center mt-2 p-1 rounded border ${cumplConfig.bg} ${cumplConfig.color}`}>
            Auditoría Legal
          </span>
        </div>
      </div>

      {/* ── Evidence & Tasks ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Evidence */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="apple-card overflow-hidden">
            <div className="p-5 border-b border-black/[0.06] flex items-center justify-between">
              <h2 className="font-bold text-[#1D1D1F] flex items-center gap-2 text-base">
                <Smartphone size={18} className="text-[#0071E3]" />
                Evidencias en Custodia ({evidenciasCaso.length})
              </h2>
              <button 
                onClick={() => setShowEvidenciaModal(true)}
                className="text-[10px] font-black text-[#0071E3] hover:text-[#0077ED] transition-colors uppercase tracking-[0.15em] flex items-center gap-1.5"
              >
                <PlusCircle size={14} /> Consignar Evidencia
              </button>
            </div>

            <div className="overflow-x-auto">
              {evidenciasCaso.length === 0 ? (
                <div className="p-16 text-center">
                  <Smartphone size={40} className="text-[#86868B] mx-auto mb-4 opacity-25" />
                  <p className="text-sm text-[#86868B]">No se han registrado evidencias físicas ni digitales.</p>
                  <button 
                    onClick={() => setShowEvidenciaModal(true)}
                    className="mt-4 text-xs font-bold text-[#0071E3] underline"
                  >
                    Registrar la primera evidencia
                  </button>
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-black/[0.06] bg-black/[0.01] text-[#86868B] uppercase tracking-wider font-bold">
                      <th className="px-5 py-4">Ítem / Código</th>
                      <th className="px-5 py-4">Tipo</th>
                      <th className="px-5 py-4">Dispositivo / Descripción</th>
                      <th className="px-5 py-4">Origen SHA-256</th>
                      <th className="px-5 py-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/[0.06] font-medium">
                    {evidenciasCaso.map(e => (
                      <tr key={e.id} className="hover:bg-black/[0.01] transition-colors">
                        <td className="px-5 py-4">
                          <span className="font-mono font-bold text-[#0071E3] bg-[#0071E3]/10 px-2 py-0.5 rounded">
                            {e.numero}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-[#86868B]">
                          {TIPO_EVIDENCIA_LABELS[e.tipo] || e.tipo}
                        </td>
                        <td className="px-5 py-4">
                          <div className="text-[#1D1D1F] font-bold">{e.marca} {e.modelo}</div>
                          {e.serial && <span className="text-[10px] text-[#86868B] block">Serial: {e.serial}</span>}
                          {e.imei && <span className="text-[10px] text-[#86868B] block">IMEI: {e.imei}</span>}
                        </td>
                        <td className="px-5 py-4">
                          {e.hashSHA256 ? (
                            <div className="flex items-center gap-1">
                              <Fingerprint size={12} className="text-[#34C759] shrink-0" />
                              <span className="font-mono text-[10px] text-[#34C759] truncate max-w-[140px] block" title={e.hashSHA256}>
                                {e.hashSHA256}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[#86868B] italic">No calculado</span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button 
                            onClick={() => handleEliminarEvidencia(e.id, e.numero)}
                            className="p-1.5 bg-red-500/10 text-[#FF3B30] hover:bg-[#FF3B30] hover:text-white rounded transition-colors"
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

          {/* Legal Framework */}
          <div className="apple-card p-6 space-y-4">
            <h3 className="font-bold text-[#1D1D1F] text-base flex items-center gap-2">
              <Shield size={18} className="text-[#0071E3]" />
              Leyes y Estándares de Aplicación (ISO & MUCC)
            </h3>
            <p className="text-xs text-[#86868B] leading-relaxed">
              Este caso de peritaje móvil está estructurado bajo las directrices y requisitos normativos de los siguientes cuerpos normativos cargados en nuestro RAG de cumplimiento:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {normativas.map(n => {
                const aplicado = caso.normativasAplicadas.includes(n.id) || n.id === 'n1' || n.id === 'n4';
                return (
                  <div key={n.id} className={`p-3 rounded-lg border text-xs flex items-start gap-3 transition-all ${
                    aplicado ? 'bg-[#0071E3]/5 border-[#0071E3]/30' : 'bg-black/[0.01] border-black/[0.06] opacity-50'
                  }`}>
                    <ShieldCheck size={16} className={aplicado ? 'text-[#0071E3] shrink-0 mt-0.5' : 'text-[#86868B] shrink-0 mt-0.5'} />
                    <div>
                      <h4 className="font-bold text-[#1D1D1F]">{n.codigo}</h4>
                      <p className="text-[10px] text-[#86868B] leading-snug mt-0.5">{n.nombre}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right: Tasks & Audit */}
        <div className="space-y-6">
          
          {/* Checklist */}
          <div className="apple-card p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
              <h3 className="font-bold text-[#1D1D1F] text-sm flex items-center gap-2">
                <ListTodo size={16} className="text-[#0071E3]" />
                Checklist Forense
              </h3>
              <button 
                onClick={() => setShowTareaModal(true)}
                className="text-[9px] font-black text-[#0071E3] hover:text-[#0077ED] uppercase tracking-wider flex items-center gap-1"
              >
                <Plus size={12} /> Agregar Tarea
              </button>
            </div>

            <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
              {tareasCaso.length === 0 ? (
                <div className="text-center py-8 text-[#86868B] text-xs italic">
                  No hay tareas registradas en el checklist de este caso.
                </div>
              ) : tareasCaso.map(t => {
                const completada = t.estado === 'completada';
                return (
                  <div 
                    key={t.id} 
                    className={`flex items-start justify-between gap-3 p-3 rounded-lg border transition-all ${
                      completada ? 'bg-green-500/[0.02] border-green-500/20' : 'bg-black/[0.01] border-black/[0.06]'
                    }`}
                  >
                    <button 
                      onClick={() => handleToggleTarea(t)}
                      className="shrink-0 mt-0.5 text-[#86868B] hover:text-[#0071E3] transition-colors"
                    >
                      {completada ? (
                        <CheckSquare size={16} className="text-[#34C759]" />
                      ) : (
                        <Square size={16} className="text-[#86868B]" />
                      )}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold text-[#1D1D1F] ${completada ? 'line-through text-[#86868B]' : ''}`}>
                        {t.titulo}
                      </p>
                      {t.asignadoA && (
                        <span className="text-[10px] text-[#86868B] block mt-0.5">Asignado: {t.asignadoA}</span>
                      )}
                    </div>

                    <button 
                      onClick={() => handleEliminarTarea(t.id, t.titulo)}
                      className="p-1 text-[#86868B] hover:text-[#FF3B30] shrink-0 transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Audit Timeline */}
          <div className="apple-card p-6 space-y-6">
            <div className="border-b border-black/[0.06] pb-3">
              <h3 className="font-bold text-[#1D1D1F] text-sm flex items-center gap-2">
                <History size={16} className="text-[#0071E3]" />
                Historial de Trazabilidad (Caso)
              </h3>
            </div>

            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
              {logsCaso.length === 0 ? (
                <div className="text-center py-8 text-[#86868B] text-xs italic">
                  No hay logs de auditoría para este caso.
                </div>
              ) : logsCaso.map(log => (
                <div key={log.id} className="text-xs relative pl-4 border-l border-black/[0.08] space-y-1">
                  <div className={`absolute left-[-4.5px] top-1.5 w-2 h-2 rounded-full ${
                    log.nivel === 'success' ? 'bg-[#34C759]' :
                    log.nivel === 'warning' ? 'bg-[#FF9500]' :
                    log.nivel === 'error' ? 'bg-[#FF3B30]' : 'bg-[#0071E3]'
                  }`} />
                  <div className="flex justify-between items-center gap-2">
                    <span className="font-mono text-[9px] font-black text-[#0071E3] uppercase tracking-tighter">
                      {log.accion}
                    </span>
                    <span className="text-[8px] text-[#86868B] font-mono">
                      {new Date(log.timestamp).toLocaleTimeString('es')}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#86868B] leading-relaxed font-medium">
                    {log.detalle}
                  </p>
                  <span className="text-[8px] text-[#86868B] block font-bold">Por: {log.usuario}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* ── MODAL: Register Evidence ── */}
      {showEvidenciaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowEvidenciaModal(false)} />
          <div className="relative w-full max-w-2xl bg-white border border-black/[0.08] rounded-xl shadow-[0_32px_64px_rgba(0,0,0,0.12)] overflow-hidden apple-scale-in z-10">
            
            <div className="p-6 border-b border-black/[0.06]">
              <h2 className="text-xl font-bold text-[#1D1D1F] flex items-center gap-2">
                <Smartphone className="text-[#0071E3]" />
                Consignar Dispositivo / Evidencia
              </h2>
              <p className="text-xs text-[#86868B] mt-1">Escriba los datos periciales para incorporarlos a la cadena de custodia.</p>
            </div>

            <form onSubmit={handleRegistrarEvidencia} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider">Código/Número de Ítem *</label>
                  <input type="text" required placeholder="Ej. EVID-001"
                    value={evidenciaForm.numero}
                    onChange={e => setEvidenciaForm({ ...evidenciaForm, numero: e.target.value })}
                    className="apple-input" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider">Tipo de Evidencia *</label>
                  <select value={evidenciaForm.tipo}
                    onChange={e => setEvidenciaForm({ ...evidenciaForm, tipo: e.target.value as TipoEvidencia })}
                    className="apple-input">
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
                  <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider">Marca</label>
                  <input type="text" placeholder="Ej. Samsung, Apple"
                    value={evidenciaForm.marca}
                    onChange={e => setEvidenciaForm({ ...evidenciaForm, marca: e.target.value })}
                    className="apple-input" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider">Modelo</label>
                  <input type="text" placeholder="Ej. Galaxy S22, iPhone 13"
                    value={evidenciaForm.modelo}
                    onChange={e => setEvidenciaForm({ ...evidenciaForm, modelo: e.target.value })}
                    className="apple-input" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider">Serial</label>
                  <input type="text" placeholder="Serial único del dispositivo"
                    value={evidenciaForm.serial}
                    onChange={e => setEvidenciaForm({ ...evidenciaForm, serial: e.target.value })}
                    className="apple-input" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider">IMEI</label>
                  <input type="text" placeholder="IMEI del dispositivo"
                    value={evidenciaForm.imei}
                    onChange={e => setEvidenciaForm({ ...evidenciaForm, imei: e.target.value })}
                    className="apple-input" />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider">Descripción de la Evidencia *</label>
                <textarea required rows={2} placeholder="Ej. Teléfono inteligente con protector negro, pantalla agrietada..."
                  value={evidenciaForm.descripcion}
                  onChange={e => setEvidenciaForm({ ...evidenciaForm, descripcion: e.target.value })}
                  className="apple-input" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider">Estado Físico *</label>
                  <input type="text" required placeholder="Buen estado, apagado, pantalla rota..."
                    value={evidenciaForm.estadoFisico}
                    onChange={e => setEvidenciaForm({ ...evidenciaForm, estadoFisico: e.target.value })}
                    className="apple-input" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider">Hash SHA-256</label>
                  <input type="text" placeholder="Clave hash SHA-256 si se dispone"
                    value={evidenciaForm.hashSHA256}
                    onChange={e => setEvidenciaForm({ ...evidenciaForm, hashSHA256: e.target.value })}
                    className="apple-input font-mono text-xs text-[#34C759]" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider">Ubicación Física *</label>
                  <input type="text" required placeholder="Bóveda, laboratorio..."
                    value={evidenciaForm.ubicacionFisica}
                    onChange={e => setEvidenciaForm({ ...evidenciaForm, ubicacionFisica: e.target.value })}
                    className="apple-input" />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input type="checkbox" id="sellado" checked={evidenciaForm.sellado}
                    onChange={e => setEvidenciaForm({ ...evidenciaForm, sellado: e.target.checked })}
                    className="rounded border-black/20 text-[#0071E3] h-4 w-4" />
                  <label htmlFor="sellado" className="text-xs font-semibold text-[#1D1D1F] select-none">¿Sellado en Bolsa?</label>
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input type="checkbox" id="etiquetado" checked={evidenciaForm.etiquetado}
                    onChange={e => setEvidenciaForm({ ...evidenciaForm, etiquetado: e.target.checked })}
                    className="rounded border-black/20 text-[#0071E3] h-4 w-4" />
                  <label htmlFor="etiquetado" className="text-xs font-semibold text-[#1D1D1F] select-none">¿Etiquetado Visible?</label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-black/[0.06]">
                <button type="button" onClick={() => setShowEvidenciaModal(false)}
                  className="apple-btn bg-black/[0.04] hover:bg-black/[0.08] text-[#1D1D1F] rounded-lg px-4">
                  Cancelar
                </button>
                <button type="submit"
                  className="apple-btn bg-[#0071E3] hover:bg-[#0077ED] text-white font-extrabold px-6 rounded-lg shadow-lg">
                  Confirmar Consignación
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ── MODAL: Add Task ── */}
      {showTareaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowTareaModal(false)} />
          <div className="relative w-full max-w-lg bg-white border border-black/[0.08] rounded-xl shadow-[0_32px_64px_rgba(0,0,0,0.12)] overflow-hidden apple-scale-in z-10">
            
            <div className="p-6 border-b border-black/[0.06]">
              <h2 className="text-xl font-bold text-[#1D1D1F] flex items-center gap-2">
                <ListTodo className="text-[#0071E3]" />
                Registrar Tarea de Cumplimiento
              </h2>
            </div>

            <form onSubmit={handleCrearTarea} className="p-6 space-y-4">
              
              <div>
                <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider">Título de la Tarea *</label>
                <input type="text" required placeholder="Ej. Extracción lógica, Fijación fotográfica..."
                  value={tareaForm.titulo}
                  onChange={e => setTareaForm({ ...tareaForm, titulo: e.target.value })}
                  className="apple-input" />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider">Descripción</label>
                <textarea rows={2} placeholder="Detalle sobre el procedimiento pericial a seguir..."
                  value={tareaForm.descripcion}
                  onChange={e => setTareaForm({ ...tareaForm, descripcion: e.target.value })}
                  className="apple-input" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider">Asignado A *</label>
                  <input type="text" required placeholder="Ej. Ing. Carlos Pérez"
                    value={tareaForm.asignadoA}
                    onChange={e => setTareaForm({ ...tareaForm, asignadoA: e.target.value })}
                    className="apple-input" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider">Prioridad</label>
                  <select value={tareaForm.prioridad}
                    onChange={e => setTareaForm({ ...tareaForm, prioridad: e.target.value as PrioridadCaso })}
                    className="apple-input">
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                    <option value="critica">Crítica</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-black/[0.06]">
                <button type="button" onClick={() => setShowTareaModal(false)}
                  className="apple-btn bg-black/[0.04] hover:bg-black/[0.08] text-[#1D1D1F] rounded-lg px-4">
                  Cancelar
                </button>
                <button type="submit"
                  className="apple-btn bg-[#0071E3] hover:bg-[#0077ED] text-white font-extrabold px-6 rounded-lg shadow-lg">
                  Agregar a Checklist
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ── MODAL: Confirm ── */}
      {confirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmDialog(null)} />
          <div className="relative w-full max-w-md bg-white border border-black/[0.08] rounded-xl shadow-[0_32px_64px_rgba(0,0,0,0.12)] overflow-hidden apple-scale-in z-10 p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={28} className="text-[#FF3B30]" />
            </div>
            <p className="text-[#1D1D1F] font-bold text-sm mb-6">{confirmDialog.message}</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setConfirmDialog(null)}
                className="apple-btn bg-black/[0.04] hover:bg-black/[0.08] text-[#1D1D1F] rounded-lg px-6">
                Cancelar
              </button>
              <button onClick={confirmDialog.onConfirm}
                className="apple-btn bg-[#FF3B30] hover:bg-[#FF453A] text-white font-bold px-6 rounded-lg">
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
