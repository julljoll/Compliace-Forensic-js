import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  useCMSStore, 
  CasoCMS, 
  Evidencia, 
  TareaForense, 
  EstadoCaso, 
  PrioridadCaso, 
  NivelCumplimiento, 
  TipoEvidencia 
} from '../store/cmsStore';
import { getPasosPorTipo } from '../data/tiposProyecto';

import { 
  ArrowLeft, Plus, 
  Smartphone, History, ListTodo, ShieldCheck, 
  Trash2, PlusCircle, CheckSquare, Square, AlertTriangle,
  FileText, ClipboardList
} from '../components/atoms/AppleIcon';

// ── Componentes Atómicos ──
import Card from '../components/atoms/Card';
import Button from '../components/atoms/Button';
import HashDisplay from '../components/atoms/HashDisplay';
import Modal from '../components/atoms/Modal';
import Input from '../components/atoms/Input';

const ESTADO_OPCIONES: { value: EstadoCaso; label: string; color: string }[] = [
  { value: 'iniciado',    label: 'Iniciado',    color: 'bg-[var(--co-blue)]/10 text-[var(--co-blue)] border-[var(--co-blue)]/20' },
  { value: 'en_proceso',  label: 'En Proceso',  color: 'bg-yellow-500/10 text-[#FF9500] border-yellow-500/20' },
  { value: 'analisis',    label: 'Análisis',    color: 'bg-purple-500/10 text-[#AF52DE] border-purple-500/20' },
  { value: 'informe',     label: 'Informe',     color: 'bg-[#9DFF00]/10 text-[#9DFF00] border-[#9DFF00]/20' },
  { value: 'cerrado',     label: 'Cerrado',     color: 'bg-green-500/10 text-[#00FF41] border-green-500/20' },
  { value: 'archivado',   label: 'Archivado',   color: 'bg-gray-500/10 text-[#86868B] border-gray-500/20' },
];

const PRIORIDAD_OPCIONES: { value: PrioridadCaso; label: string; color: string }[] = [
  { value: 'critica', label: 'Crítica', color: 'bg-red-500/10 text-[#FF3B30] border-red-500/20' },
  { value: 'alta',    label: 'Alta',    color: 'bg-orange-500/10 text-[#FF9500] border-orange-500/20' },
  { value: 'media',   label: 'Media',   color: 'bg-yellow-500/10 text-[#FF9500] border-yellow-500/20' },
  { value: 'baja',    label: 'Baja',    color: 'bg-green-500/10 text-[#00FF41] border-green-500/20' },
];


const TIPO_EVIDENCIA_LABELS: Record<TipoEvidencia, string> = {
  dispositivo_movil: 'Dispositivo Móvil',
  computador: 'Computador',
  memoria: 'Memoria Extraíble',
  imagen_forense: 'Imagen Forense',
  documento: 'Documento Técnico',
  otro: 'Otro',
};

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
    if (diffHours < 24) return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
    if (diffDays < 7) return `Hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
    return date.toLocaleDateString('es', { day: '2-digit', month: 'short' });
  } catch (e) {
    return 'Hace poco';
  }
}

export default function CasoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const casos = useCMSStore(state => state.casos);
  const updateCaso = useCMSStore(state => state.updateCaso);
  const addAuditLog = useCMSStore(state => state.addAuditLog);
  const seleccionarCaso = useCMSStore(state => state.seleccionarCaso);

  const evidencias = useCMSStore(state => state.evidencias);
  const addEvidencia = useCMSStore(state => state.addEvidencia);
  const deleteEvidencia = useCMSStore(state => state.deleteEvidencia);
  
  const tareas = useCMSStore(state => state.tareas);
  const addTarea = useCMSStore(state => state.addTarea);
  const updateTarea = useCMSStore(state => state.updateTarea);
  const deleteTarea = useCMSStore(state => state.deleteTarea);

  const auditLogs = useCMSStore(state => state.auditLogs);

  const [caso, setCaso] = useState<CasoCMS | null>(null);
  const [activeTab, setActiveTab] = useState<'resumen' | 'cumplimiento' | 'evidencias' | 'tareas' | 'auditoria' | 'planillas'>('resumen');
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
      seleccionarCaso(found.id);
    } else {
      router.push('/casos');
    }
  }, [id, casos, router, seleccionarCaso]);

  const stagesList = useMemo(() => {
    return caso?.tipoProyecto ? getPasosPorTipo(caso.tipoProyecto) : [];
  }, [caso?.tipoProyecto]);

  if (!caso) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-[var(--co-accent)]/30 border-t-[var(--co-accent)] rounded-full animate-spin" />
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
    router.push(`/control/seguimiento-compliance?casoId=${caso.id}`);
  };



  return (
    <div className="space-y-6 apple-fade-in pb-12">
      
      {/* ── Back Link ── */}
      <Link href="/casos" className="flex items-center gap-2 text-xs font-bold text-[var(--co-accent)] hover:underline uppercase tracking-[0.2em] w-fit">
        <ArrowLeft size={14} />
        Volver a Directorio de Casos
      </Link>

      {/* ── Case Info Header ── */}
      <Card className="p-6 sm:p-7" hoverable={false}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-base font-semibold text-[var(--co-accent)] tracking-widest">{caso.numeroCaso}</span>
              <div className="h-3.5 w-px bg-[var(--co-separator)] hidden sm:block" />
              <span className="text-[12px] text-[var(--co-gray-1)] font-medium">PRCC: {caso.numeroPRCC || 'N/A'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--apple-text)] tracking-tight leading-tight">{caso.titulo}</h1>
            <p className="text-[14px] text-[var(--co-gray-1)] leading-relaxed max-w-3xl">{caso.descripcion}</p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[200px] justify-end">
            <Button variant="primary" size="lg" onClick={handleIniciarFlujoForense}>
              <ShieldCheck size={18} strokeWidth={2.5} />
              Continuar Cumplimiento
            </Button>
            <div className="flex items-center gap-2 justify-end text-xs font-semibold">
              <span className="text-[var(--co-gray-1)]">Cumplimiento:</span>
              <select 
                value={caso.nivelCumplimientoGeneral}
                onChange={(e) => handleCumplimientoChange(e.target.value as NivelCumplimiento)}
                className="bg-[var(--co-surface-2)] border border-[var(--co-gray-5)] text-[var(--apple-text)] text-[12px] font-bold rounded-lg px-2.5 py-1.5 outline-none focus:border-[var(--co-accent)]"
              >
                <option value="conforme">Conforme</option>
                <option value="parcial">Parcial</option>
                <option value="no_conforme">No Conforme</option>
                <option value="no_aplica">N/A</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* ── Tab Bar (Apple HIG Horizontal Style) ── */}
      <div className="flex border-b border-[var(--co-separator)] overflow-x-auto gap-1 bg-[var(--co-surface-2)] rounded-[12px] p-1 select-none">
        {([
          { id: 'resumen', label: 'Resumen', icon: FileText },
          { id: 'cumplimiento', label: 'Cumplimiento', icon: ShieldCheck },
          { id: 'evidencias', label: 'Evidencias', icon: Smartphone },
          { id: 'tareas', label: 'Tareas', icon: ListTodo },
          { id: 'auditoria', label: 'Auditoría', icon: History },
          { id: 'planillas', label: 'Actas y Planillas', icon: ClipboardList }
        ] as const).map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-[13px] font-semibold rounded-[8px] transition-all whitespace-nowrap cursor-pointer ${
                active 
                  ? 'bg-[var(--co-surface-1)] text-[var(--co-accent)] shadow-sm' 
                  : 'text-[var(--co-gray-1)] hover:text-[var(--apple-text)]'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Tab Content Area ── */}
      <div className="space-y-6">

        {/* 1. RESUMEN TAB */}
        {activeTab === 'resumen' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 apple-fade-in">
            <div className="lg:col-span-2 space-y-6">
              {/* Contexto Administrativo */}
              <Card className="space-y-4" hoverable={false}>
                <h3 className="font-bold text-[15px] text-[var(--apple-text)] border-b border-[var(--co-separator)] pb-2.5">
                  Detalles del Expediente
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[var(--co-gray-1)] block">Perito Líder</span>
                    <span className="font-semibold text-[var(--apple-text)] mt-0.5 block">{caso.peritoLider}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[var(--co-gray-1)] block">Fiscal a Cargo</span>
                    <span className="font-semibold text-[var(--apple-text)] mt-0.5 block">{caso.fiscal || 'No asignado'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[var(--co-gray-1)] block">Despacho Fiscal</span>
                    <span className="font-semibold text-[var(--apple-text)] mt-0.5 block">{caso.despachoFiscal || 'No asignado'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[var(--co-gray-1)] block">Organismo Ordenante</span>
                    <span className="font-semibold text-[var(--apple-text)] mt-0.5 block">{caso.organismoOrdenante || 'No asignado'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[var(--co-gray-1)] block">Fecha de Registro</span>
                    <span className="font-semibold text-[var(--apple-text)] mt-0.5 block">{new Date(caso.fechaCreacion).toLocaleDateString('es')}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[var(--co-gray-1)] block">Última Actualización</span>
                    <span className="font-semibold text-[var(--apple-text)] mt-0.5 block">{new Date(caso.fechaUltimaActualizacion).toLocaleDateString('es')}</span>
                  </div>
                </div>
              </Card>

              {/* Detalles del Dispositivo */}
              <Card className="space-y-4" hoverable={false}>
                <h3 className="font-bold text-[15px] text-[var(--apple-text)] border-b border-[var(--co-separator)] pb-2.5">
                  Ficha Técnica de Dispositivo
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-[13px]">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[var(--co-gray-1)] block">Marca</span>
                    <span className="font-semibold text-[var(--apple-text)] mt-0.5 block">{caso.dispositivo_marca || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[var(--co-gray-1)] block">Modelo</span>
                    <span className="font-semibold text-[var(--apple-text)] mt-0.5 block">{caso.dispositivo_modelo || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[var(--co-gray-1)] block">IMEI/Serial</span>
                    <span className="font-mono text-[11px] font-semibold text-[var(--apple-text)] mt-0.5 block select-all">
                      {caso.dispositivo_imei || caso.discoduro_serial || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[var(--co-gray-1)] block">Batería</span>
                    <span className="font-semibold text-[var(--apple-text)] mt-0.5 block">{caso.dispositivo_bateria_estado || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[var(--co-gray-1)] block">Pantalla</span>
                    <span className="font-semibold text-[var(--apple-text)] mt-0.5 block">{caso.dispositivo_pantalla_estado || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[var(--co-gray-1)] block">Daños Visibles</span>
                    <span className="font-semibold text-[var(--apple-text)] mt-0.5 block">{caso.dispositivo_danos_visibles || 'Ninguno'}</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar de Resumen */}
            <div className="space-y-4">
              <Card className="space-y-4" hoverable={false}>
                <h3 className="font-bold text-[14px] text-[var(--apple-text)] block">Clasificación</h3>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[var(--co-gray-1)] block">Estado del Caso</span>
                    <select 
                      value={caso.estado}
                      onChange={(e) => handleEstadoChange(e.target.value as EstadoCaso)}
                      className="w-full bg-[var(--co-surface-2)] border border-[var(--co-gray-5)] rounded-lg p-2 text-xs font-bold text-[var(--apple-text)] mt-1.5 outline-none focus:border-[var(--co-accent)]"
                    >
                      {ESTADO_OPCIONES.map(e => (
                        <option key={e.value} value={e.value}>{e.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-[var(--co-gray-1)] block">Criticidad</span>
                    <select 
                      value={caso.prioridad}
                      onChange={(e) => handlePrioridadChange(e.target.value as PrioridadCaso)}
                      className="w-full bg-[var(--co-surface-2)] border border-[var(--co-gray-5)] rounded-lg p-2 text-xs font-bold text-[var(--apple-text)] mt-1.5 outline-none focus:border-[var(--co-accent)]"
                    >
                      {PRIORIDAD_OPCIONES.map(p => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </Card>

              <Card className="space-y-3" hoverable={false}>
                <h3 className="font-bold text-[14px] text-[var(--apple-text)]">Progreso de Auditoría</h3>
                <div className="flex items-end justify-between text-[11px] font-semibold text-[var(--co-gray-1)]">
                  <span>Requisitos Completados</span>
                  <span>{caso.porcentajeCompletado}%</span>
                </div>
                <div className="w-full h-1.5 bg-black/[0.08] rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--co-green)] rounded-full transition-all duration-500" style={{ width: `${caso.porcentajeCompletado}%` }} />
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* 2. CUMPLIMIENTO TAB */}
        {activeTab === 'cumplimiento' && (
          <Card className="space-y-6 apple-fade-in" hoverable={false}>
            <div className="flex items-center justify-between border-b border-[var(--co-separator)] pb-3">
              <div>
                <h3 className="font-bold text-[16px] text-[var(--apple-text)]">Seguimiento de Fases Forenses (Timeline)</h3>
                <p className="text-[12px] text-[var(--co-gray-1)] mt-0.5">Fases técnicas requeridas por ISO/IEC 27037 y buenas prácticas internacionales.</p>
              </div>
              <Button variant="primary" onClick={handleIniciarFlujoForense}>
                Ir al Panel de Flujo
              </Button>
            </div>

            {/* Timeline Vertical */}
            <div className="relative pl-6 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1.5px] before:bg-[var(--co-separator)]">
              {stagesList.map((stage, idx) => {
                const isStepCompleted = (caso.completed_steps && caso.completed_steps[stage.id]) || false;
                const metadata = (caso.step_metadata && caso.step_metadata[stage.id]) || null;
                
                return (
                  <div key={stage.id} className="relative text-xs flex flex-col items-start gap-1">
                    {/* Circle timeline connector */}
                    <div className={`
                      absolute left-[-21px] top-1 w-[11px] h-[11px] rounded-full border-2 z-10 transition-colors
                      ${isStepCompleted 
                        ? 'bg-[var(--co-green)] border-[var(--co-green)] shadow-[0_0_4px_rgba(48,209,88,0.4)]' 
                        : 'bg-[var(--co-surface-1)] border-[var(--co-gray-3)]'
                      }
                    `} />
                    
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[13.5px] text-[var(--apple-text)]">
                        Fase {idx + 1}: {stage.titulo}
                      </span>
                      {isStepCompleted ? (
                        <span className="text-[9px] font-bold text-[var(--co-green)] bg-[var(--co-green)]/10 px-1.5 py-0.2 rounded uppercase tracking-wider select-none">Fase hecha</span>
                      ) : (
                        <span className="text-[9px] font-medium text-[var(--co-gray-1)] bg-[var(--co-surface-2)] border border-[var(--co-separator)] px-1.5 py-0.2 rounded uppercase tracking-wider select-none">Pendiente</span>
                      )}
                    </div>

                    <p className="text-[12px] text-[var(--co-gray-1)] leading-relaxed max-w-2xl">{stage.action}</p>
                    
                    {metadata && metadata.fecha && (
                      <span className="text-[10px] text-[var(--co-gray-2)] font-medium mt-0.5">
                        Verificado por {metadata.responsable || 'Perito'} {getRelativeTime(metadata.fecha)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* 3. EVIDENCIAS TAB */}
        {activeTab === 'evidencias' && (
          <Card className="p-0 overflow-hidden flex flex-col apple-fade-in" hoverable={false}>
            <div className="p-5 border-b border-[var(--co-separator)] flex items-center justify-between">
              <h2 className="font-bold text-[16px] text-[var(--apple-text)] flex items-center gap-2">
                <Smartphone size={18} className="text-[var(--co-accent)]" />
                Evidencias Digitales Registradas ({evidenciasCaso.length})
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setShowEvidenciaModal(true)}>
                <PlusCircle size={14} /> Consignar Evidencia
              </Button>
            </div>

            <div className="overflow-x-auto">
              {evidenciasCaso.length === 0 ? (
                <div className="p-16 text-center">
                  <Smartphone size={40} className="text-[var(--co-gray-2)] mx-auto mb-4 opacity-25" />
                  <p className="text-sm text-[var(--co-gray-1)]">No se han registrado evidencias físicas ni digitales en este caso.</p>
                  <Button variant="secondary" size="sm" className="mt-4" onClick={() => setShowEvidenciaModal(true)}>
                    Registrar la primera evidencia
                  </Button>
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[var(--co-separator)] bg-[var(--co-surface-2)] text-[var(--co-gray-1)] uppercase tracking-wider font-bold">
                      <th className="px-5 py-4">Ítem / Código</th>
                      <th className="px-5 py-4">Tipo</th>
                      <th className="px-5 py-4">Descripción del Dispositivo</th>
                      <th className="px-5 py-4">Hash Integridad SHA-256</th>
                      <th className="px-5 py-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--co-separator)] font-medium text-[13px] text-[var(--apple-text)]">
                    {evidenciasCaso.map(e => (
                      <tr key={e.id} className="hover:bg-[var(--co-surface-2)]/30 transition-colors">
                        <td className="px-5 py-4">
                          <span className="font-mono font-bold text-[var(--co-accent)] bg-[var(--co-accent)]/10 px-2 py-0.5 rounded">
                            {e.numero}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-[var(--co-gray-1)]">
                          {TIPO_EVIDENCIA_LABELS[e.tipo] || e.tipo}
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-bold">{e.marca} {e.modelo}</div>
                          {e.serial && <span className="text-[10px] text-[var(--co-gray-1)] block mt-0.5">Serial: {e.serial}</span>}
                          {e.imei && <span className="text-[10px] text-[var(--co-gray-1)] block mt-0.5">IMEI: {e.imei}</span>}
                        </td>
                        <td className="px-5 py-4">
                          {e.hashSHA256 ? (
                            <HashDisplay hash={e.hashSHA256} />
                          ) : (
                            <span className="text-[var(--co-gray-1)] italic">No calculado</span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button 
                            onClick={() => handleEliminarEvidencia(e.id, e.numero)}
                            className="p-1.5 bg-[var(--co-red)]/10 text-[var(--co-red)] hover:bg-[var(--co-red)] hover:text-white rounded-lg transition-colors cursor-pointer"
                            title="Eliminar evidencia"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </Card>
        )}

        {/* 4. TAREAS TAB */}
        {activeTab === 'tareas' && (
          <Card className="space-y-5 apple-fade-in" hoverable={false}>
            <div className="flex items-center justify-between border-b border-[var(--co-separator)] pb-3">
              <h3 className="font-bold text-[15px] text-[var(--apple-text)] flex items-center gap-2">
                <ListTodo size={16} className="text-[var(--co-accent)]" />
                Checklist Forense Interno
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setShowTareaModal(true)}>
                <Plus size={14} /> Agregar Tarea
              </Button>
            </div>

            <div className="space-y-2.5">
              {tareasCaso.length === 0 ? (
                <div className="text-center py-12 text-[var(--co-gray-1)] text-xs italic">
                  No hay tareas registradas en el checklist de este caso.
                </div>
              ) : tareasCaso.map(t => {
                const completada = t.estado === 'completada';
                return (
                  <div 
                    key={t.id} 
                    className={`flex items-start justify-between gap-3 p-3.5 rounded-lg border transition-all ${
                      completada ? 'bg-[var(--co-green)]/[0.02] border-[var(--co-green)]/20' : 'bg-[var(--co-surface-2)] border-[var(--co-separator)]'
                    }`}
                  >
                    <button 
                      onClick={() => handleToggleTarea(t)}
                      className="shrink-0 mt-0.5 text-[var(--co-gray-1)] hover:text-[var(--co-accent)] transition-colors cursor-pointer"
                    >
                      {completada ? (
                        <CheckSquare size={17} className="text-[var(--co-green)]" />
                      ) : (
                        <Square size={17} className="text-[var(--co-gray-1)]" />
                      )}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <p className={`text-[13px] font-bold text-[var(--apple-text)] ${completada ? 'line-through text-[var(--co-gray-1)]' : ''}`}>
                        {t.titulo}
                      </p>
                      {t.asignadoA && (
                        <span className="text-[10px] text-[var(--co-gray-1)] block mt-0.5">Asignado: {t.asignadoA}</span>
                      )}
                    </div>

                    <button 
                      onClick={() => handleEliminarTarea(t.id, t.titulo)}
                      className="p-1.5 text-[var(--co-gray-1)] hover:text-[var(--co-red)] shrink-0 transition-colors cursor-pointer rounded"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* 5. AUDITORÍA TAB */}
        {activeTab === 'auditoria' && (
          <Card className="space-y-5 apple-fade-in" hoverable={false}>
            <div className="border-b border-[var(--co-separator)] pb-3">
              <h3 className="font-bold text-[15px] text-[var(--apple-text)] flex items-center gap-2">
                <History size={16} className="text-[var(--co-accent)]" />
                Historial de Trazabilidad Forense (Cadena de Custodia)
              </h3>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
              {logsCaso.length === 0 ? (
                <div className="text-center py-12 text-[var(--co-gray-1)] text-xs italic">
                  No hay logs de auditoría para este caso.
                </div>
              ) : logsCaso.map(log => (
                <div key={log.id} className="text-xs relative pl-4 border-l border-[var(--co-separator)] space-y-1">
                  <div className={`absolute left-[-4.5px] top-1.5 w-2 h-2 rounded-full ${
                    log.nivel === 'success' ? 'bg-[var(--co-green)]' :
                    log.nivel === 'warning' ? 'bg-[var(--co-orange)]' :
                    log.nivel === 'error' ? 'bg-[var(--co-red)]' : 'bg-[var(--co-blue)]'
                  }`} />
                  <div className="flex justify-between items-center gap-2">
                    <span className="font-mono text-[9px] font-black text-[var(--co-accent)] uppercase tracking-tighter">
                      {log.accion}
                    </span>
                    <span className="text-[10px] text-[var(--co-gray-1)] font-mono">
                      {new Date(log.timestamp).toLocaleDateString('es')} {new Date(log.timestamp).toLocaleTimeString('es')}
                    </span>
                  </div>
                  <p className="text-[12px] text-[var(--apple-text)] leading-relaxed font-semibold">
                    {log.detalle}
                  </p>
                  <span className="text-[10px] text-[var(--co-gray-1)] block font-bold">Responsable: {log.usuario}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* 6. PLANILLAS TAB */}
        {activeTab === 'planillas' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 apple-fade-in">
            {[
              { title: '1. Acta de Obtención por Consignación', desc: 'Registro de entrega formal de evidencias (MUCC-2017).', path: '/planillas/acta-obtencion', norma: 'MUCC-2017' },
              { title: '2. Acta de Entrevista Técnico-Pericial', desc: 'Fijación formal de declaraciones del consignante o imputado.', path: '/planillas/acta-entrevista', norma: 'ISO 27037' },
              { title: '3. Planilla de Registro Cadena de Custodia (PRCC)', desc: 'Planilla oficial de trazabilidad e inmutabilidad de evidencia.', path: '/planillas/prcc', norma: 'ISO 27037 / COPP' },
              { title: '4. Dictamen Pericial Informático', desc: 'Informe técnico pericial de conclusiones forenses.', path: '/planillas/dictamen', norma: 'ISO 27042 / COPP' },
              { title: '5. Acta de Entrega de Resultados', desc: 'Acta formal de devolución y cierre del procedimiento.', path: '/planillas/entrega-resultados', norma: 'MUCC-2017' },
              { title: '6. Acta de Auditoría y Hash Chain', desc: 'Certificación de inmutabilidad criptográfica SHA-256.', path: '/planillas/acta-auditoria-timeline', norma: 'RFC 3227 / ISO 27037' },
              { title: '7. Informe de Trazabilidad Compliance', desc: 'Resumen ejecutivo de avance y cumplimiento forense.', path: '/planillas/timeline-compliance', norma: 'NIST SP 800-86' },
            ].map((planilla, idx) => (
              <Card key={idx} className="flex flex-col justify-between p-5 border border-[#FECF06]/20 bg-[#1E1800]/40" hoverable={true}>
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-[13px] text-[#FECF06] mb-1">{planilla.title}</h4>
                    <span className="text-[9px] font-mono font-bold bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30 px-2 py-0.5 rounded">
                      {planilla.norma}
                    </span>
                  </div>
                  <p className="text-[12px] text-[var(--co-gray-1)] leading-relaxed mb-4">{planilla.desc}</p>
                </div>
                <div className="flex gap-2">
                  <Link 
                    href={`${planilla.path}?casoId=${caso.id}`} 
                    className="w-full flex justify-center items-center py-2 bg-[#FECF06] text-black font-bold text-[12px] rounded-lg hover:bg-[#e0b700] transition-all text-center"
                  >
                    📄 Abrir Planilla (DOM / react-pdf)
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}

      </div>

      {/* ── MODAL: Register Evidence ── */}
      {showEvidenciaModal && (
        <Modal 
          isOpen={showEvidenciaModal} 
          onClose={() => setShowEvidenciaModal(false)}
          title="Consignar Evidencia Forense"
          description="Escriba los datos del dispositivo para incorporarlo de forma oficial a la cadena de custodia inmutable."
        >
          <form onSubmit={handleRegistrarEvidencia} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Código / Número de Ítem *"
                required
                placeholder="Ej. EVID-001"
                value={evidenciaForm.numero}
                onChange={e => setEvidenciaForm({ ...evidenciaForm, numero: e.target.value })}
              />
              <div className="flex flex-col items-start w-full">
                <label className="text-[11px] font-bold text-[var(--co-gray-1)] uppercase tracking-[0.05em] mb-1.5">Tipo de Evidencia *</label>
                <select 
                  value={evidenciaForm.tipo}
                  onChange={e => setEvidenciaForm({ ...evidenciaForm, tipo: e.target.value as TipoEvidencia })}
                  className="w-full text-[15px] bg-[var(--co-surface-2)] border border-[var(--co-gray-5)] rounded-[10px] px-3.5 py-2.5 text-[var(--apple-text)] outline-none"
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

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Input
                label="Marca"
                placeholder="Ej. Samsung"
                value={evidenciaForm.marca}
                onChange={e => setEvidenciaForm({ ...evidenciaForm, marca: e.target.value })}
              />
              <Input
                label="Modelo"
                placeholder="Ej. Galaxy"
                value={evidenciaForm.modelo}
                onChange={e => setEvidenciaForm({ ...evidenciaForm, modelo: e.target.value })}
              />
              <Input
                label="Serial"
                placeholder="Nº Serial"
                value={evidenciaForm.serial}
                onChange={e => setEvidenciaForm({ ...evidenciaForm, serial: e.target.value })}
              />
              <Input
                label="IMEI"
                placeholder="IMEI"
                value={evidenciaForm.imei}
                onChange={e => setEvidenciaForm({ ...evidenciaForm, imei: e.target.value })}
              />
            </div>

            <Input
              label="Descripción de la Evidencia *"
              required
              placeholder="Física, colores, marcas de golpes..."
              value={evidenciaForm.descripcion}
              onChange={e => setEvidenciaForm({ ...evidenciaForm, descripcion: e.target.value })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Estado Físico *"
                required
                value={evidenciaForm.estadoFisico}
                onChange={e => setEvidenciaForm({ ...evidenciaForm, estadoFisico: e.target.value })}
              />
              <Input
                label="Hash SHA-256 de Origen"
                placeholder="Calcular o pegar hash SHA-256"
                value={evidenciaForm.hashSHA256}
                onChange={e => setEvidenciaForm({ ...evidenciaForm, hashSHA256: e.target.value })}
                className="font-mono text-[12px] text-[var(--co-green)]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Ubicación Física *"
                required
                value={evidenciaForm.ubicacionFisica}
                onChange={e => setEvidenciaForm({ ...evidenciaForm, ubicacionFisica: e.target.value })}
              />
              <div className="flex items-center gap-2 pt-6 shrink-0">
                <input 
                  type="checkbox" 
                  id="sellado" 
                  checked={evidenciaForm.sellado}
                  onChange={e => setEvidenciaForm({ ...evidenciaForm, sellado: e.target.checked })}
                  className="rounded border-black/20 text-[var(--co-accent)] h-4 w-4" 
                />
                <label htmlFor="sellado" className="text-xs font-semibold text-[var(--apple-text)] select-none">¿Bolsa Sellada?</label>
              </div>
              <div className="flex items-center gap-2 pt-6 shrink-0">
                <input 
                  type="checkbox" 
                  id="etiquetado" 
                  checked={evidenciaForm.etiquetado}
                  onChange={e => setEvidenciaForm({ ...evidenciaForm, etiquetado: e.target.checked })}
                  className="rounded border-black/20 text-[var(--co-accent)] h-4 w-4" 
                />
                <label htmlFor="etiquetado" className="text-xs font-semibold text-[var(--apple-text)] select-none">¿Etiqueta Custodia?</label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[var(--co-separator)]">
              <Button type="button" onClick={() => setShowEvidenciaModal(false)}>Cancelar</Button>
              <Button type="submit" variant="primary">Confirmar Registro</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── MODAL: Add Task ── */}
      {showTareaModal && (
        <Modal 
          isOpen={showTareaModal} 
          onClose={() => setShowTareaModal(false)}
          title="Agregar Tarea al Checklist"
        >
          <form onSubmit={handleCrearTarea} className="space-y-4">
            <Input
              label="Título de la Tarea *"
              required
              placeholder="Ej. Realizar respaldo forense..."
              value={tareaForm.titulo}
              onChange={e => setTareaForm({ ...tareaForm, titulo: e.target.value })}
            />
            <Input
              label="Descripción"
              placeholder="Detalle los pasos técnicos a seguir..."
              value={tareaForm.descripcion}
              onChange={e => setTareaForm({ ...tareaForm, descripcion: e.target.value })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Asignado A *"
                required
                placeholder="Nombre del perito"
                value={tareaForm.asignadoA}
                onChange={e => setTareaForm({ ...tareaForm, asignadoA: e.target.value })}
              />
              <div className="flex flex-col items-start w-full">
                <label className="text-[11px] font-bold text-[var(--co-gray-1)] uppercase tracking-[0.05em] mb-1.5">Prioridad</label>
                <select 
                  value={tareaForm.prioridad}
                  onChange={e => setTareaForm({ ...tareaForm, prioridad: e.target.value as PrioridadCaso })}
                  className="w-full text-[15px] bg-[var(--co-surface-2)] border border-[var(--co-gray-5)] rounded-[10px] px-3.5 py-2.5 text-[var(--apple-text)] outline-none"
                >
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                  <option value="critica">Crítica</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[var(--co-separator)]">
              <Button type="button" onClick={() => setShowTareaModal(false)}>Cancelar</Button>
              <Button type="submit" variant="primary">Guardar Tarea</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── MODAL: Confirm ── */}
      {confirmDialog && (
        <Modal 
          isOpen={!!confirmDialog} 
          onClose={() => setConfirmDialog(null)}
          title="Confirmar Operación Destructiva"
        >
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-[var(--co-red)]/10 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={28} className="text-[var(--co-red)]" />
            </div>
            <p className="text-[var(--apple-text)] font-semibold text-[15px] mb-6">{confirmDialog.message}</p>
            <div className="flex justify-center gap-3">
              <Button type="button" onClick={() => setConfirmDialog(null)}>Cancelar</Button>
              <Button type="button" variant="destructive" onClick={confirmDialog.onConfirm}>Confirmar Eliminación</Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
