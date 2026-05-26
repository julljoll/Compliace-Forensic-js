import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCMSStore, EstadoPaso, TareaForense, PrioridadCaso, EstadoTarea } from '../../store/cmsStore';
import { NORMATIVAS_ETAPAS } from '../../data/normativasEtapas';
import { getPasosPorTipo } from '../../data/tiposProyecto';
import {
  ShieldCheck, Calendar, User, Info,
  CheckCircle2, Terminal,
  Shield, Lock, Camera, Smartphone, Database, FileText,
  AlertTriangle, Copy, CheckCheck, Fingerprint, Package,
  Scale, Archive, Briefcase, PlusCircle, Printer, Play,
  AlertOctagon, ClipboardList, Plus, Search, Clock, Trash2, X,
  TrendingUp, BarChart3, Pause, FileCheck
} from 'lucide-react';
import KpiCard from '../../components/molecules/KpiCard';
import '../Planillas/Planillas.css';

const iconMap: Record<string, any> = {
  FileText,
  Smartphone,
  Terminal,
  Package,
  Shield,
  Database,
  Archive,
  Scale,
  Lock,
  Camera,
  Fingerprint,
  FileCheck
};

const PLANILLA_ROUTES: Record<string, string> = {
  wp_step1: '/planillas/acta-obtencion',
  wp_step2: '/planillas/prcc-derivacion',
  wp_step3: '',
  wp_step4: '/planillas/prcc-derivacion',
  wp_step5: '',
  wp_step6: '',
  wp_step7: '/planillas/dictamen',
  wp_step8: '/planillas/entrega-resultados',
  wp_step9: '/planillas/entrega-resultados',
};

// Helper types & configs for task list
const ESTADO_TAREA: Record<EstadoTarea, { label: string; color: string; icon: any }> = {
  pendiente:   { label: 'Pendiente',    color: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30', icon: Clock },
  en_progreso: { label: 'En Progreso',  color: 'bg-blue-500/15 text-blue-300 border-blue-500/30',     icon: TrendingUp },
  completada:  { label: 'Completada',   color: 'bg-green-500/15 text-green-300 border-green-500/30',  icon: CheckCircle2 },
  bloqueada:   { label: 'Bloqueada',    color: 'bg-red-500/15 text-red-300 border-red-500/30',        icon: Pause },
};

const PRIORIDAD_CONFIG: Record<PrioridadCaso, { label: string; dot: string; bg: string }> = {
  critica: { label: 'Crítica', dot: 'bg-red-500',    bg: 'bg-red-500/10 text-red-300 border-red-500/20' },
  alta:    { label: 'Alta',    dot: 'bg-orange-500',  bg: 'bg-orange-500/10 text-orange-300 border-orange-500/20' },
  media:   { label: 'Media',   dot: 'bg-yellow-500',  bg: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20' },
  baja:    { label: 'Baja',    dot: 'bg-green-500',   bg: 'bg-green-500/10 text-green-300 border-green-500/20' },
};

// Helper types for UI rendering
interface NormativaTag { label: string; color: string; }
interface Advertencia { titulo: string; cuerpo: string; nivel: string; }

function BadgeNormativa({ tag }: { tag: NormativaTag }) {
  const colors: Record<string, string> = {
    cyan:   'bg-cyan-500/10 border-cyan-500/25 text-cyan-400',
    green:  'bg-green-500/10 border-green-500/25 text-green-400',
    yellow: 'bg-yellow-500/10 border-yellow-500/25 text-yellow-400',
    red:    'bg-red-500/10 border-red-500/25 text-red-400',
    purple: 'bg-purple-500/10 border-purple-500/25 text-purple-400',
  };
  return (
    <span className={`inline-flex items-center text-[8px] font-black uppercase tracking-[0.15em] px-2 py-0.5 rounded border ${colors[tag.color]}`}>
      {tag.label}
    </span>
  );
}

function AlertaForense({ adv }: { adv: Advertencia }) {
  const configs: Record<string, { wrapper: string; icon: string; titulo: string; cuerpo: string; Icon: any }> = {
    critical: {
      wrapper: 'bg-red-500/[0.06] border-red-500/25',
      icon:    'text-red-400',
      titulo:  'text-red-400',
      cuerpo:  'text-red-300/70',
      Icon:    AlertTriangle,
    },
    warning: {
      wrapper: 'bg-yellow-500/[0.06] border-yellow-500/25',
      icon:    'text-yellow-400',
      titulo:  'text-yellow-400',
      cuerpo:  'text-yellow-300/70',
      Icon:    AlertTriangle,
    },
    info: {
      wrapper: 'bg-blue-500/[0.06] border-blue-500/25',
      icon:    'text-blue-400',
      titulo:  'text-blue-400',
      cuerpo:  'text-blue-300/70',
      Icon:    Info,
    },
  };
  const cfg = configs[adv.nivel] || configs.info;

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border ${cfg.wrapper}`}>
      <cfg.Icon size={14} className={`${cfg.icon} shrink-0 mt-0.5`} />
      <div>
        <p className={`text-[10px] font-black uppercase tracking-wider mb-1 ${cfg.titulo}`}>
          {adv.nivel === 'critical' ? '⚠️ CRÍTICO' : adv.nivel === 'warning' ? '⚠️ Advertencia' : 'ℹ️ Nota'}: {adv.titulo}
        </p>
        <p className={`text-[10px] leading-relaxed ${cfg.cuerpo}`}>{adv.cuerpo}</p>
      </div>
    </div>
  );
}

function BloqueCode({ lang, contenido }: { lang: string; contenido: string }) {
  const [copiado, setCopiado] = useState(false);
  const copiar = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(contenido);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2200);
    } catch {}
  }, [contenido]);

  const LANG_COLOR: Record<string, string> = {
    bash:       'text-green-400/60',
    powershell: 'text-blue-400/60',
    sql:        'text-yellow-400/60',
    python:     'text-cyan-400/60',
  };

  return (
    <div className="rounded-lg overflow-hidden border border-white/[0.07] mt-3">
      <div className="flex items-center justify-between px-4 py-2 bg-black/50 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Terminal size={11} className="text-white/25" />
          <span className={`text-[9px] font-black uppercase tracking-[0.15em] ${LANG_COLOR[lang] || 'text-white/25'}`}>
            {lang}
          </span>
        </div>
        <button
          onClick={copiar}
          className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded bg-white/[0.05] border border-white/[0.08] text-white/30 hover:text-cyan-400 hover:border-cyan-400/30 transition-all"
        >
          {copiado
            ? <><CheckCheck size={10} className="text-green-400" /> Copiado</>
            : <><Copy size={10} /> Copiar</>}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-4 bg-[#0d1f12] text-[11px] leading-relaxed">
        <code className="text-[#a8ff78] font-mono whitespace-pre">{contenido}</code>
      </pre>
    </div>
  );
}

export default function SeguimientoCompliancePage() {
  const {
    casos,
    casoSeleccionado,
    seleccionarCaso,
    setStepCompleted,
    setStepMetadata,
    toggleComplianceCheck,
    setComplianceObservacion,
    initSteps,
    startStep,
    completeStep,
    tareas,
    updateTarea,
    addTarea,
    deleteTarea,
    normativas,
    addAuditLog,
    verifyStepCompletion
  } = useCMSStore();

  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'trazabilidad';

  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);

  // States for adding a new task inline
  const [inlineTaskTitle, setInlineTaskTitle] = useState('');
  const [inlineTaskPrioridad, setInlineTaskPrioridad] = useState<PrioridadCaso>('media');
  const [inlineTaskAsignadoA, setInlineTaskAsignadoA] = useState('');

  // States for general tasks search & filter
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<EstadoTarea | 'todos'>('todos');
  const [filtroPrioridad, setFiltroPrioridad] = useState<PrioridadCaso | 'todos'>('todos');
  const [showTaskModal, setShowTaskModal] = useState(false);

  // Find selected case
  const activeCaso = useMemo(() => {
    return casos.find(c => c.id === casoSeleccionado) || null;
  }, [casos, casoSeleccionado]);

  // Autoselect first case if none is selected
  useEffect(() => {
    if (!casoSeleccionado && casos.length > 0) {
      seleccionarCaso(casos[0].id);
    }
  }, [casos, casoSeleccionado, seleccionarCaso]);

  // Initialize steps if case has no steps
  useEffect(() => {
    if (activeCaso && !activeCaso.steps && !activeCaso.completed_steps) {
      initSteps(activeCaso.id);
    }
  }, [activeCaso, initSteps]);

  // Get step status helper
  const getStepStatus = useCallback((stepId: string) => {
    if (!activeCaso) return { completado: false, metadata: { fecha: '', responsable: '', observaciones: '' }, estado: 'bloqueado' as EstadoPaso };
    
    if (activeCaso.steps?.[stepId]) {
      const step = activeCaso.steps[stepId]!;
      return {
        completado: step.estado === 'completado',
        metadata: {
          fecha: step.fechaCompletado || step.fechaInicio || '',
          responsable: step.responsable || '',
          observaciones: step.observaciones || ''
        },
        estado: step.estado
      };
    }
    
    const completado = !!activeCaso.completed_steps?.[stepId];
    const metadata = activeCaso.step_metadata?.[stepId] || { fecha: '', responsable: '', observaciones: '' };
    return { completado, metadata, estado: completado ? 'completado' as EstadoPaso : 'disponible' as EstadoPaso };
  }, [activeCaso]);

  // Find requirements helper
  const getRequisitosForPaso = useCallback((complianceIds: string[]) => {
    const list: { id: string; normativaId: string; codigo: string; nombre: string; descripcion: string }[] = [];
    
    complianceIds.forEach(id => {
      NORMATIVAS_ETAPAS.forEach(ne => {
        ne.etapas.forEach(et => {
          if (et.id === id) {
            list.push({
              id: et.id,
              normativaId: ne.normativaId,
              codigo: ne.codigo,
              nombre: et.nombre,
              descripcion: et.descripcion
            });
          }
          if (et.subetapas) {
            et.subetapas.forEach(sub => {
              if (sub.id === id) {
                list.push({
                  id: sub.id,
                  normativaId: ne.normativaId,
                  codigo: ne.codigo,
                  nombre: sub.nombre,
                  descripcion: sub.descripcion
                });
              }
            });
          }
        });
      });
    });

    return list;
  }, []);

  const isComplianceChecked = useCallback((reqId: string) => {
    if (!activeCaso) return false;
    const checklist = activeCaso.compliance_checklist || [];
    return !!checklist.find(c => c.stageId === reqId && c.checked);
  }, [activeCaso]);

  const getComplianceCheckDate = useCallback((reqId: string) => {
    if (!activeCaso) return undefined;
    const checklist = activeCaso.compliance_checklist || [];
    return checklist.find(c => c.stageId === reqId)?.fechaCheck;
  }, [activeCaso]);

  const getComplianceObservacionValue = useCallback((reqId: string) => {
    if (!activeCaso) return '';
    const checklist = activeCaso.compliance_checklist || [];
    return checklist.find(c => c.stageId === reqId)?.observacion || '';
  }, [activeCaso]);

  // Calculations for dashboard KPIs
  const metrics = useMemo(() => {
    if (!activeCaso) return { stepPct: 0, compliancePct: 0, completedStepsCount: 0, pasos: [] as any[], totalSteps: 0, tasksPct: 0, completedTasks: 0, totalTasks: 0 };
    
    // Step completion progress
    let completedStepsCount = 0;
    if (activeCaso.steps) {
      completedStepsCount = Object.values(activeCaso.steps).filter(s => s.estado === 'completado').length;
    } else {
      completedStepsCount = Object.keys(activeCaso.completed_steps || {}).filter(k => activeCaso.completed_steps?.[k]).length;
    }
    const pasos = activeCaso.tipoProyecto ? getPasosPorTipo(activeCaso.tipoProyecto) : [];
    const totalSteps = pasos.length || 9;
    const stepPct = Math.round((completedStepsCount / Math.max(totalSteps, 1)) * 100);

    // Compliance level progress
    let totalReqs = 0;
    let checkedReqs = 0;
    pasos.forEach(step => {
      const reqs = getRequisitosForPaso(step.complianceIds);
      totalReqs += reqs.length;
      reqs.forEach(r => {
        if (isComplianceChecked(r.id)) {
          checkedReqs++;
        }
      });
    });
    const compliancePct = totalReqs > 0 ? Math.round((checkedReqs / totalReqs) * 100) : 0;

    // Tasks progress for this active case
    const caseTasks = tareas.filter(t => t.casoId === activeCaso.id);
    const totalTasks = caseTasks.length;
    const completedTasks = caseTasks.filter(t => t.estado === 'completada').length;
    const tasksPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return { stepPct, compliancePct, completedStepsCount, pasos, totalSteps, tasksPct, completedTasks, totalTasks };
  }, [activeCaso, getRequisitosForPaso, isComplianceChecked, tareas]);

  // Automatically select first unlocked step if none is selected
  useEffect(() => {
    if (metrics.pasos && metrics.pasos.length > 0) {
      const activeStep = metrics.pasos.find(step => {
        const { estado } = getStepStatus(step.id);
        return estado === 'en_progreso';
      }) || metrics.pasos.find(step => {
        const { estado } = getStepStatus(step.id);
        return estado === 'disponible';
      }) || metrics.pasos[0];
      
      if (activeStep) {
        setSelectedStepId(activeStep.id);
      }
    }
  }, [casoSeleccionado, metrics.pasos, getStepStatus]);

  // Find step data currently selected
  const selectedStep = useMemo(() => {
    if (!selectedStepId || !metrics.pasos) return null;
    return metrics.pasos.find((p: any) => p.id === selectedStepId) || null;
  }, [selectedStepId, metrics.pasos]);

  // Gating validation for selected step
  const stepValidation = useMemo(() => {
    if (!activeCaso || !selectedStepId) return { canComplete: true, missing: [] };
    return verifyStepCompletion(selectedStepId);
  }, [activeCaso, selectedStepId, tareas, activeCaso?.compliance_checklist, verifyStepCompletion]);

  // Group steps by Phase for left-hand nav
  const stepsByPhase = useMemo(() => {
    if (!activeCaso || !metrics.pasos) return {};
    const grouped: Record<string, typeof metrics.pasos> = {};
    metrics.pasos.forEach(step => {
      const phaseName = step.fase || 'Sin Fase';
      if (!grouped[phaseName]) {
        grouped[phaseName] = [];
      }
      grouped[phaseName].push(step);
    });
    return grouped;
  }, [activeCaso, metrics.pasos]);

  // Add a task inline
  const handleAddInlineTask = () => {
    if (!inlineTaskTitle.trim() || !activeCaso || !selectedStepId) return;
    addTarea({
      casoId: activeCaso.id,
      pasoId: selectedStepId,
      titulo: inlineTaskTitle.trim(),
      descripcion: `Tarea técnica para el paso ${selectedStep?.titulo || selectedStepId}`,
      asignadoA: inlineTaskAsignadoA.trim() || activeCaso.peritoLider || 'Perito de Guardia',
      estado: 'pendiente',
      prioridad: inlineTaskPrioridad,
      fechaVencimiento: undefined,
      normativasRelacionadas: [],
      observaciones: '',
      porcentaje: 0
    });

    addAuditLog({
      accion: 'TAREA_CREADA',
      detalle: `Tarea "${inlineTaskTitle.trim()}" agregada al paso: ${selectedStep?.titulo}`,
      nivel: 'success',
      casoId: activeCaso.id,
      usuario: inlineTaskAsignadoA.trim() || 'sistema'
    });

    setInlineTaskTitle('');
    setInlineTaskAsignadoA('');
    setInlineTaskPrioridad('media');
  };

  // General tasks filtering
  const generalFilteredTasks = useMemo(() => {
    if (!activeCaso) return [];
    return tareas.filter(t => {
      if (t.casoId !== activeCaso.id) return false;
      const matchEstado = filtroEstado === 'todos' || t.estado === filtroEstado;
      const matchPrioridad = filtroPrioridad === 'todos' || t.prioridad === filtroPrioridad;
      const matchBusqueda = !busqueda ||
        t.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        t.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
        t.asignadoA.toLowerCase().includes(busqueda.toLowerCase());
      return matchEstado && matchPrioridad && matchBusqueda;
    });
  }, [tareas, activeCaso, filtroEstado, filtroPrioridad, busqueda]);

  const generalKpis = useMemo(() => {
    if (!activeCaso) return { total: 0, pendientes: 0, enProgreso: 0, completadas: 0, bloqueadas: 0, progreso: 0 };
    const caseTasks = tareas.filter(t => t.casoId === activeCaso.id);
    const total = caseTasks.length;
    const pendientes = caseTasks.filter(t => t.estado === 'pendiente').length;
    const enProgreso = caseTasks.filter(t => t.estado === 'en_progreso').length;
    const completadas = caseTasks.filter(t => t.estado === 'completada').length;
    const bloqueadas = caseTasks.filter(t => t.estado === 'bloqueada').length;
    const progreso = total > 0 ? Math.round((completadas / total) * 100) : 0;
    return { total, pendientes, enProgreso, completadas, bloqueadas, progreso };
  }, [tareas, activeCaso]);

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

  const setTab = (tabName: string) => {
    setSearchParams({ tab: tabName });
  };

  if (casos.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[60vh] animate-fade-in">
        <div className="p-4 rounded-full bg-fluent-accent/10 border border-fluent-accent/20 text-fluent-accent mb-6 animate-pulse">
          <Briefcase size={48} strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">No se detectaron casos creados</h2>
        <p className="text-fluent-text-muted text-sm max-w-md mb-6 leading-relaxed">
          Para realizar el seguimiento forense y compliance, es necesario inicializar al menos un proyecto/caso en la sección de control de casos.
        </p>
        <Link
          to="/casos"
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-fluent-accent hover:bg-fluent-accent/90 text-white font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-fluent-accent/20"
        >
          <PlusCircle size={16} />
          <span>Crear Primer Caso</span>
        </Link>
      </div>
    );
  }

  // Get tasks for selected step
  const stepTasks = activeCaso && selectedStepId
    ? tareas.filter(t => t.casoId === activeCaso.id && t.pasoId === selectedStepId)
    : [];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header and selector */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight flex items-center gap-3">
            <div className="p-2 rounded-[4px] bg-[#FECF06]/10 border border-[#FECF06]/20">
              <ShieldCheck className="text-[#FECF06]" size={26} strokeWidth={2.5} />
            </div>
            Fases, Tareas & Compliance
          </h1>
          <p className="text-xs md:text-sm text-fluent-text-muted font-medium max-w-lg mt-2 leading-relaxed">
            Consolidado forense estructurado, control de tareas asociadas y validaciones normativas de control (ISO/IEC 27037/27042, NIST, MUCCEF).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black uppercase text-fluent-text-muted/40 tracking-wider">
            Investigación Activa:
          </span>
          <select
            value={casoSeleccionado || ''}
            onChange={(e) => seleccionarCaso(e.target.value)}
            className="bg-[#0b1f13] border border-fluent-accent/20 rounded-lg text-xs font-bold text-fluent-accent px-4 py-2.5 outline-none hover:border-fluent-accent/50 focus:border-fluent-accent transition-all min-w-[220px]"
          >
            {casos.map(c => (
              <option key={c.id} value={c.id}>
                {c.numeroCaso} - {c.titulo}
              </option>
            ))}
          </select>
        </div>
      </div>

      {activeCaso && (
        <>
          {/* Active case device metadata */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl border border-white/5 bg-[#0b1f13]/30">
            <div className="space-y-0.5">
              <span className="text-[8px] font-black uppercase text-fluent-text-muted/40 tracking-wider block">Dispositivo</span>
              <p className="text-xs font-bold text-white truncate">{activeCaso.dispositivo_marca || 'N/D'} {activeCaso.dispositivo_modelo || ''}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[8px] font-black uppercase text-fluent-text-muted/40 tracking-wider block">IMEI</span>
              <p className="text-xs font-mono text-fluent-accent font-semibold truncate">{activeCaso.dispositivo_imei || 'N/D'}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[8px] font-black uppercase text-fluent-text-muted/40 tracking-wider block">Fiscalía</span>
              <p className="text-xs font-bold text-white truncate">{activeCaso.fiscal || 'Sin designar'}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[8px] font-black uppercase text-fluent-text-muted/40 tracking-wider block">Perito Asignado</span>
              <p className="text-xs font-bold text-white truncate">{activeCaso.peritoLider || 'Sin designar'}</p>
            </div>
          </div>

          {/* Unified dashboard metrics (3 Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step execution gauge */}
            <div className="fluent-mica p-5 rounded-xl border-white/5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-white text-xs tracking-tight flex items-center gap-1.5">
                  <Database size={14} className="text-cyan-400" />
                  Progreso de Pasos Forenses
                </h3>
                <span className="text-[9px] font-black font-mono text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/20 uppercase tracking-widest">
                  {metrics.completedStepsCount} / {metrics.totalSteps} Pasos
                </span>
              </div>
              <div className="w-full h-2 bg-white/[0.03] rounded-full overflow-hidden border border-white/5 p-[1px]">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${metrics.stepPct}%`,
                    background: 'linear-gradient(90deg, #06b6d4, #22d3ee)'
                  }}
                />
              </div>
              <div className="mt-2 flex justify-between text-[9px] font-black text-fluent-text-muted/40 uppercase tracking-widest">
                <span>Fases de Metodología</span>
                <span className="text-cyan-400">{metrics.stepPct}% Completado</span>
              </div>
            </div>

            {/* Compliance verification gauge */}
            <div className="fluent-mica p-5 rounded-xl border-white/5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-white text-xs tracking-tight flex items-center gap-1.5">
                  <Shield size={14} className="text-green-400" />
                  Garantía de Compliance
                </h3>
                <span className="text-[9px] font-black font-mono text-green-400 bg-green-400/10 px-2 py-0.5 rounded border border-green-400/20 uppercase tracking-widest">
                  {metrics.compliancePct}% Conforme
                </span>
              </div>
              <div className="w-full h-2 bg-white/[0.03] rounded-full overflow-hidden border border-white/5 p-[1px]">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${metrics.compliancePct}%`,
                    background: 'linear-gradient(90deg, #10b981, #22c55e)'
                  }}
                />
              </div>
              <div className="mt-2 flex justify-between text-[9px] font-black text-fluent-text-muted/40 uppercase tracking-widest">
                <span>Requisitos de Calidad</span>
                <span className="text-green-400">{metrics.compliancePct}% Conforme</span>
              </div>
            </div>

            {/* Task completion rate gauge */}
            <div className="fluent-mica p-5 rounded-xl border-white/5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-white text-xs tracking-tight flex items-center gap-1.5">
                  <ClipboardList size={14} className="text-[#FECF06]" />
                  Resolución de Tareas
                </h3>
                <span className="text-[9px] font-black font-mono text-[#FECF06] bg-[#FECF06]/10 px-2 py-0.5 rounded border border-[#FECF06]/20 uppercase tracking-widest">
                  {metrics.completedTasks} / {metrics.totalTasks} Tareas
                </span>
              </div>
              <div className="w-full h-2 bg-white/[0.03] rounded-full overflow-hidden border border-white/5 p-[1px]">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${metrics.tasksPct}%`,
                    background: 'linear-gradient(90deg, #eab308, #FECF06)'
                  }}
                />
              </div>
              <div className="mt-2 flex justify-between text-[9px] font-black text-fluent-text-muted/40 uppercase tracking-widest">
                <span>Tareas Técnicas</span>
                <span className="text-[#FECF06]">{metrics.tasksPct}% Completadas</span>
              </div>
            </div>
          </div>

          {/* Upper Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-6">
            <button
              onClick={() => setTab('trazabilidad')}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-black uppercase tracking-wider rounded-lg border transition-all ${
                currentTab !== 'tareas'
                  ? 'bg-fluent-accent/10 border-fluent-accent/30 text-fluent-accent shadow-lg shadow-fluent-accent/10'
                  : 'border-transparent text-fluent-text-muted hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldCheck size={14} />
              <span>Trazabilidad & Fases</span>
            </button>
            <button
              onClick={() => setTab('tareas')}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-black uppercase tracking-wider rounded-lg border transition-all ${
                currentTab === 'tareas'
                  ? 'bg-fluent-accent/10 border-fluent-accent/30 text-fluent-accent shadow-lg shadow-fluent-accent/10'
                  : 'border-transparent text-fluent-text-muted hover:text-white hover:bg-white/5'
              }`}
            >
              <ClipboardList size={14} />
              <span>Tablero de Tareas</span>
            </button>
          </div>

          {/* TAB CONTENT: 1. TRAZABILIDAD (Split column Workspace) */}
          {currentTab !== 'tareas' && (
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              
              {/* Left Column: Navigation list grouped by Phases */}
              <div className="w-full lg:w-[320px] shrink-0 space-y-6">
                {Object.entries(stepsByPhase).map(([phaseName, phaseSteps]) => {
                  const completedCount = phaseSteps.filter(step => {
                    const { completado } = getStepStatus(step.id);
                    return completado;
                  }).length;
                  const totalCount = phaseSteps.length;
                  const phasePct = Math.round((completedCount / totalCount) * 100);

                  return (
                    <div key={phaseName} className="space-y-2 bg-[#0b1f13]/10 p-3 rounded-lg border border-white/[0.03]">
                      <div className="flex justify-between items-center px-1">
                        <h4 className="text-[9px] font-black uppercase text-white/50 tracking-wider">
                          {phaseName}
                        </h4>
                        <span className="text-[9px] font-black font-mono text-fluent-accent">
                          {completedCount}/{totalCount}
                        </span>
                      </div>
                      <div className="w-full h-1 bg-white/[0.03] rounded-full overflow-hidden mb-3">
                        <div 
                          className="h-full bg-fluent-accent rounded-full transition-all duration-500" 
                          style={{ width: `${phasePct}%` }}
                        />
                      </div>
                      
                      <div className="space-y-1.5">
                        {phaseSteps.map((step: any) => {
                          const { completado, estado } = getStepStatus(step.id);
                          const isSelected = selectedStepId === step.id;
                          const Icon = iconMap[step.iconoName] || Shield;
                          const isLocked = estado === 'bloqueado';

                          return (
                            <button
                              key={step.id}
                              onClick={() => !isLocked && setSelectedStepId(step.id)}
                              disabled={isLocked}
                              className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                                isLocked
                                  ? 'opacity-40 bg-white/[0.01] border-white/[0.02] cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-[#FECF06]/10 border-[#FECF06]/40 text-white shadow-lg'
                                  : completado
                                  ? 'bg-green-500/[0.03] border-green-500/20 hover:border-green-500/40 text-white/90'
                                  : estado === 'en_progreso'
                                  ? 'bg-blue-500/[0.03] border-blue-500/25 hover:border-blue-500/40 text-white/90'
                                  : 'bg-white/[0.02] border-white/5 hover:border-white/15 text-white/70'
                              }`}
                            >
                              <div className={`p-1.5 rounded shrink-0 ${
                                completado ? 'bg-green-500/10 text-green-400'
                                  : estado === 'en_progreso' ? 'bg-blue-500/10 text-blue-400'
                                  : 'bg-white/[0.04]'
                              }`}>
                                {isLocked ? (
                                  <Lock size={12} className="text-white/20" />
                                ) : (
                                  <Icon size={12} />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-[11px] font-bold block truncate">
                                  {step.num}. {step.titulo}
                                </span>
                              </div>
                              {completado && (
                                <CheckCheck size={12} className="text-green-400 shrink-0" />
                              )}
                              {estado === 'en_progreso' && (
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Step detailed Workspace */}
              <div className="flex-1 w-full space-y-6">
                {selectedStep ? (() => {
                  const { completado, metadata, estado } = getStepStatus(selectedStep.id);
                  const Icon = iconMap[selectedStep.iconoName] || Shield;
                  const requisitos = getRequisitosForPaso(selectedStep.complianceIds);
                  const isLocked = estado === 'bloqueado';
                  const isDisponible = estado === 'disponible';
                  const isEnProgreso = estado === 'en_progreso';

                  return (
                    <div className="fluent-card p-6 border-white/5 relative overflow-hidden space-y-6">
                      
                      {/* Step Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-lg shrink-0 ${
                            completado ? 'bg-green-500/15 text-green-400' 
                              : isEnProgreso ? 'bg-blue-500/15 text-blue-400'
                              : 'bg-white/[0.04]'
                          }`}>
                            <Icon size={18} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] text-white/40 uppercase font-black tracking-wider">
                                Paso {selectedStep.num} — {selectedStep.fase}
                              </span>
                              {selectedStep.normativas && selectedStep.normativas.map((n: any) => (
                                <BadgeNormativa key={n.label} tag={n} />
                              ))}
                            </div>
                            <h2 className="text-lg font-black text-white mt-1">
                              {selectedStep.titulo}
                            </h2>
                          </div>
                        </div>

                        {/* Status label */}
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-black uppercase tracking-[0.15em] px-2.5 py-1 rounded border ${
                            completado
                              ? 'bg-green-500/10 border-green-500/25 text-green-400'
                              : isEnProgreso
                              ? 'bg-blue-500/10 border-blue-500/25 text-blue-400'
                              : isDisponible
                              ? 'bg-yellow-500/10 border-yellow-500/25 text-yellow-400'
                              : 'bg-white/[0.03] border-white/[0.08] text-white/30'
                          }`}>
                            {completado ? 'Completado ✓' 
                              : isEnProgreso ? 'En Progreso 🔄'
                              : isDisponible ? 'Disponible'
                              : 'Bloqueado 🔒'}
                          </span>
                        </div>
                      </div>

                      {/* Gating protection validation warnings */}
                      {!stepValidation.canComplete && isEnProgreso && (
                        <div className="p-4 rounded-lg border border-yellow-500/25 bg-yellow-500/[0.04] space-y-2">
                          <div className="flex items-center gap-2 text-yellow-400">
                            <AlertTriangle size={14} />
                            <span className="text-[10px] font-black uppercase tracking-wider">
                              Requisitos pendientes para completar esta etapa
                            </span>
                          </div>
                          <ul className="list-disc pl-4 space-y-1">
                            {stepValidation.missing.map((item, idx) => (
                              <li key={idx} className="text-[10px] text-yellow-300/70 font-medium">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Split column view for step tools */}
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        
                        {/* Col 1: Technical & Tasks */}
                        <div className="space-y-6">
                          
                          {/* Guide description */}
                          <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest pb-1 border-b border-white/5">
                              Ejecución Técnica e Instrucciones
                            </h4>
                            
                            <div className="border-l-2 border-white/10 pl-4 space-y-1">
                              <span className="text-[9px] text-fluent-accent font-bold uppercase tracking-wider block">Acción Operativa</span>
                              <p className="text-xs text-white/80 font-medium">{selectedStep.action}</p>
                            </div>

                            {selectedStep.docs && selectedStep.docs.length > 0 && (
                              <div>
                                <span className="text-[9px] font-black text-white/30 uppercase tracking-widest block mb-1.5">Documentación Emitida</span>
                                <div className="flex flex-wrap gap-2">
                                  {selectedStep.docs.map((doc: string, idx: number) => (
                                    <span key={idx} className="bg-white/5 border border-white/10 rounded-full px-2.5 py-0.5 text-[9px] text-white/60 uppercase tracking-wider font-semibold">
                                      📄 {doc}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="timeline-guide-panel !m-0 !p-4 !bg-[#0b1f13]/25 !border !border-white/5 !rounded-lg">
                              <h5 className="text-[9px] font-bold text-fluent-accent uppercase tracking-wider mb-1">Fundamento Metodológico</h5>
                              <p className="text-xs text-white/70 leading-relaxed">{selectedStep.guide}</p>
                            </div>
                          </div>

                          {/* Dynamic Task List for the step */}
                          <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] space-y-4">
                            <div className="flex justify-between items-center pb-2 border-b border-white/5">
                              <h5 className="text-[11px] font-black uppercase text-fluent-accent tracking-widest flex items-center gap-1.5">
                                <ClipboardList size={13} />
                                Checklist de Tareas del Paso
                              </h5>
                              <span className="text-[10px] font-black font-mono text-fluent-text-muted/60">
                                {stepTasks.filter(t => t.estado === 'completada').length}/{stepTasks.length} Listas
                              </span>
                            </div>

                            {/* Dynamic tasks list rendering */}
                            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                              {stepTasks.length === 0 ? (
                                <p className="text-[11px] text-fluent-text-muted/40 italic py-2 text-center">
                                  No hay tareas asignadas para esta etapa.
                                </p>
                              ) : (
                                stepTasks.map(task => {
                                  const isCompleted = task.estado === 'completada';
                                  const pr = PRIORIDAD_CONFIG[task.prioridad || 'media'];
                                  return (
                                    <div key={task.id} className="flex items-center justify-between p-2.5 rounded bg-black/20 border border-white/5 hover:border-white/10 transition-all group">
                                      <div className="flex items-center gap-3 min-w-0">
                                        <button
                                          onClick={() => updateTarea(task.id, {
                                            estado: isCompleted ? 'pendiente' : 'en_progreso' as EstadoTarea,
                                            fechaCompletada: undefined,
                                            porcentaje: isCompleted ? 0 : 50
                                          })}
                                          className={`w-[16px] h-[16px] rounded border flex items-center justify-center shrink-0 transition-all ${
                                            isCompleted
                                              ? 'bg-fluent-accent border-fluent-accent text-black'
                                              : 'border-white/20 hover:border-fluent-accent/50'
                                          }`}
                                        >
                                          {isCompleted && <CheckCheck size={10} strokeWidth={3} />}
                                        </button>
                                        <div className="min-w-0">
                                          <span 
                                            onClick={() => updateTarea(task.id, {
                                              estado: isCompleted ? 'pendiente' : 'completada',
                                              fechaCompletada: isCompleted ? undefined : new Date().toISOString(),
                                              porcentaje: isCompleted ? 0 : 100
                                            })}
                                            className={`text-xs block cursor-pointer select-none ${isCompleted ? 'text-green-400/60 line-through' : 'text-white hover:text-fluent-accent'}`}
                                          >
                                            {task.titulo}
                                          </span>
                                          <span className="text-[9px] text-fluent-text-muted/40 font-mono flex items-center gap-2 mt-0.5">
                                            <span>Por: {task.asignadoA || 'Perito'}</span>
                                            <span>•</span>
                                            <span className={`px-1 py-0.5 rounded-[2px] uppercase text-[7px] font-black border ${pr.bg}`}>
                                              {pr.label}
                                            </span>
                                          </span>
                                        </div>
                                      </div>
                                      
                                      <button
                                        onClick={() => {
                                          if (confirm(`¿Eliminar la tarea "${task.titulo}"?`)) {
                                            deleteTarea(task.id);
                                            addAuditLog({
                                              accion: 'TAREA_ELIMINADA',
                                              detalle: `Tarea "${task.titulo}" eliminada`,
                                              nivel: 'warning',
                                              casoId: activeCaso.id,
                                              usuario: 'sistema'
                                            });
                                          }
                                        }}
                                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-all"
                                      >
                                        <Trash2 size={12} />
                                      </button>
                                    </div>
                                  );
                                })
                              )}
                            </div>

                            {/* Inline task creator */}
                            {!isLocked && (
                              <div className="pt-3 border-t border-white/5 space-y-2">
                                <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">
                                  Crear Tarea Rápida en esta Fase
                                </p>
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    placeholder="Nueva tarea..."
                                    value={inlineTaskTitle}
                                    onChange={(e) => setInlineTaskTitle(e.target.value)}
                                    className="flex-1 bg-black/40 border border-white/10 rounded px-2.5 py-1 text-xs text-white placeholder-white/20 outline-none focus:border-fluent-accent transition-all"
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') handleAddInlineTask();
                                    }}
                                  />
                                  <select
                                    value={inlineTaskPrioridad}
                                    onChange={(e) => setInlineTaskPrioridad(e.target.value as PrioridadCaso)}
                                    className="bg-black/40 border border-white/10 rounded px-2 text-[10px] text-white/80 outline-none focus:border-fluent-accent"
                                  >
                                    <option value="baja">Baja</option>
                                    <option value="media">Media</option>
                                    <option value="alta">Alta</option>
                                    <option value="critica">Crítica</option>
                                  </select>
                                  <input
                                    type="text"
                                    placeholder="Perito..."
                                    value={inlineTaskAsignadoA}
                                    onChange={(e) => setInlineTaskAsignadoA(e.target.value)}
                                    className="w-[85px] bg-black/40 border border-white/10 rounded px-2 py-1 text-[10px] text-white placeholder-white/20 outline-none focus:border-fluent-accent"
                                  />
                                  <button
                                    onClick={handleAddInlineTask}
                                    disabled={!inlineTaskTitle.trim()}
                                    className="px-3 py-1 bg-fluent-accent hover:bg-fluent-accent/90 disabled:bg-white/5 disabled:text-white/20 text-black font-black text-xs rounded transition-all flex items-center justify-center"
                                  >
                                    <Plus size={14} strokeWidth={2.5} />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Code blocks */}
                          {selectedStep.codigo?.map((c: any, i: number) => (
                            <BloqueCode key={i} lang={c.lang} contenido={c.contenido} />
                          ))}

                          {/* Forensic Alerts */}
                          {selectedStep.advertencias?.map((adv: any, i: number) => (
                            <AlertaForense key={i} adv={adv} />
                          ))}

                        </div>

                        {/* Col 2: Compliance */}
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-black text-green-400 uppercase tracking-widest pb-1 border-b border-white/5">
                            Requisitos de Compliance Normativo
                          </h4>

                          <div className="space-y-3">
                            {requisitos.map((req) => {
                              const checked = isComplianceChecked(req.id);
                              const checkDate = getComplianceCheckDate(req.id);
                              const obsValue = getComplianceObservacionValue(req.id);

                              return (
                                <div key={req.id} className="p-4 rounded-lg bg-white/[0.02] border border-white/5 space-y-3 hover:border-white/10 transition-all">
                                  <div className="flex items-start gap-3">
                                    <button
                                      onClick={() => toggleComplianceCheck(req.id, req.normativaId)}
                                      disabled={isLocked}
                                      className={`w-[18px] h-[18px] rounded-[4px] border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                                        checked
                                          ? 'bg-[#00FF41] border-[#00FF41] text-black shadow-lg shadow-[#00FF41]/20'
                                          : !isLocked
                                            ? 'border-white/20 hover:border-[#00FF41]/50'
                                            : 'border-white/10 opacity-40 cursor-not-allowed'
                                      }`}
                                    >
                                      {checked && <CheckCheck size={12} strokeWidth={3} />}
                                    </button>

                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <span className="font-mono text-[9px] font-black text-[#FECF06] uppercase tracking-wider">
                                          {req.codigo}
                                        </span>
                                        {checked && checkDate && (
                                          <span className="text-[8px] font-black text-green-400 uppercase tracking-widest">
                                            ✓ Conforme
                                          </span>
                                        )}
                                      </div>
                                      <p className={`text-xs font-bold ${checked ? 'text-green-400/60 line-through opacity-60' : 'text-white'}`}>
                                        {req.nombre}
                                      </p>
                                      <p className="text-[11px] text-fluent-text-muted mt-1 leading-relaxed">
                                        {req.descripcion}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="pl-7">
                                    <input
                                      type="text"
                                      placeholder="Evidencia de cumplimiento / Registro del RAG..."
                                      value={obsValue}
                                      onChange={(e) => setComplianceObservacion(req.id, e.target.value)}
                                      disabled={isLocked}
                                      className="w-full bg-black/40 border border-white/10 rounded px-2.5 py-1 text-[11px] text-white/70 placeholder-white/25 focus:border-[#00FF41] outline-none transition-all disabled:opacity-30"
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                      </div>

                      {/* Hito Metadata details (only when completed) */}
                      {completado && (
                        <div className="timeline-meta-box !mt-6 !p-4 !bg-black/40 !border !border-white/5 !rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="timeline-input-group">
                            <label className="timeline-input-label flex items-center gap-1.5">
                              <Calendar size={11} className="text-[#FECF06]" />
                              <span>Fecha y Hora de Firma</span>
                            </label>
                            <input 
                              type="datetime-local" 
                              className="timeline-input" 
                              value={metadata.fecha || ''}
                              onChange={(e) => setStepMetadata(selectedStep.id, { fecha: e.target.value })}
                            />
                          </div>

                          <div className="timeline-input-group">
                            <label className="timeline-input-label flex items-center gap-1.5">
                              <User size={11} className="text-[#FECF06]" />
                              <span>Responsable / Perito Firmante</span>
                            </label>
                            <input 
                              type="text" 
                              className="timeline-input" 
                              placeholder="Nombre del Funcionario Asignado"
                              value={metadata.responsable || ''}
                              onChange={(e) => setStepMetadata(selectedStep.id, { responsable: e.target.value })}
                            />
                          </div>

                          <div className="timeline-input-group md:col-span-2">
                            <label className="timeline-input-label flex items-center gap-1.5">
                              <span>Observaciones del Acta / Precinto</span>
                            </label>
                            <input 
                              type="text" 
                              className="timeline-input" 
                              placeholder="Ej: Precinto verificado, sin irregularidades"
                              value={metadata.observaciones || ''}
                              onChange={(e) => setStepMetadata(selectedStep.id, { observaciones: e.target.value })}
                            />
                          </div>
                        </div>
                      )}

                      {/* Official templates printable link */}
                      {PLANILLA_ROUTES[selectedStep.id] && (
                        <div className="pt-4 border-t border-white/[0.05] flex items-center justify-between">
                          <span className="text-[10px] text-white/30 italic">
                            Planilla oficial correspondiente a esta etapa:
                          </span>
                          <Link
                            to={PLANILLA_ROUTES[selectedStep.id]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all duration-200 bg-[#FECF06]/10 border border-[#FECF06]/25 text-[#FECF06] hover:bg-[#FECF06]/20"
                          >
                            <Printer size={12} />
                            <span>Imprimir Planilla Oficial</span>
                          </Link>
                        </div>
                      )}

                      {/* Execution Control Actions */}
                      <div className="pt-4 border-t border-white/[0.05] flex items-center justify-between">
                        <span className="text-[10px] text-white/30 italic max-w-[50%]">
                          {completado && '✓ Hito cerrado y auditado'}
                          {isEnProgreso && 'Resuelva todas las tareas y checks para poder completar'}
                          {isDisponible && 'Inicie esta etapa para habilitar su checklist operativo'}
                        </span>

                        <div className="flex items-center gap-3">
                          {isDisponible && (
                            <button
                              onClick={() => startStep(selectedStep.id)}
                              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all bg-blue-500/15 border border-blue-500/25 text-blue-400 hover:bg-blue-500/25"
                            >
                              <Play size={12} />
                              <span>Iniciar Paso</span>
                            </button>
                          )}

                          {isEnProgreso && (
                            <button
                              onClick={() => completeStep(selectedStep.id)}
                              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all bg-green-500/15 border border-green-500/25 text-green-400 hover:bg-green-500/25"
                              title="Completa tareas y compliance primero"
                            >
                              <CheckCircle2 size={12} />
                              <span>Completar Paso</span>
                            </button>
                          )}

                          {completado && !activeCaso?.steps && (
                            <button
                              onClick={() => setStepCompleted(selectedStep.id, false)}
                              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20"
                            >
                              <AlertOctagon size={12} />
                              <span>Desmarcar Hito</span>
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  );
                })() : (
                  <div className="fluent-mica p-16 text-center rounded-xl border border-white/5">
                    <ShieldCheck size={40} className="text-fluent-text-muted opacity-20 mx-auto mb-4" />
                    <p className="text-xs text-fluent-text-muted">
                      Seleccione una fase técnica a la izquierda para ver su espacio de trabajo unificado.
                    </p>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB CONTENT: 2. TABLERO DE TAREAS GENERAL */}
          {currentTab === 'tareas' && (
            <div className="space-y-8 animate-fade-in">
              {/* KPIs de Tareas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard title="Tareas Totales" value={generalKpis.total} sub={`${generalKpis.enProgreso} en progreso`} icon={ClipboardList} />
                <KpiCard title="Pendientes" value={generalKpis.pendientes} sub="Por asignar o iniciar" icon={Clock} color="text-yellow-400" />
                <KpiCard title="Completadas" value={generalKpis.completadas} sub={`${generalKpis.progreso}% resueltas`} icon={CheckCircle2} color="text-green-400" accent />
                <KpiCard title="Bloqueadas" value={generalKpis.bloqueadas} sub="Requieren atención" icon={AlertTriangle} color="text-red-400" />
              </div>

              {/* Filtros de Tareas */}
              <div className="fluent-mica rounded-xl p-4 flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-fluent-text-muted" />
                  <input
                    type="text"
                    placeholder="Buscador por título, perito o descripción..."
                    value={busqueda}
                    onChange={e => setBusqueda(e.target.value)}
                    className="fluent-input pl-9"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <select
                    value={filtroEstado}
                    onChange={e => setFiltroEstado(e.target.value as EstadoTarea | 'todos')}
                    className="fluent-input w-auto min-w-[130px]"
                  >
                    <option value="todos">Todos los Estados</option>
                    {Object.entries(ESTADO_TAREA).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                  <select
                    value={filtroPrioridad}
                    onChange={e => setFiltroPrioridad(e.target.value as PrioridadCaso | 'todos')}
                    className="fluent-input w-auto min-w-[120px]"
                  >
                    <option value="todos">Todas las Prioridades</option>
                    {Object.entries(PRIORIDAD_CONFIG).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => setShowTaskModal(true)}
                    className="fluent-btn fluent-btn-primary flex items-center gap-2 shadow-2xl hover:translate-y-[-2px] transition-all ml-auto md:ml-0"
                  >
                    <Plus size={16} strokeWidth={2.5} />
                    Nueva Tarea
                  </button>
                </div>
              </div>

              {/* Lista global de tareas */}
              <div className="space-y-3">
                {generalFilteredTasks.length === 0 ? (
                  <div className="fluent-mica p-16 text-center rounded-2xl border border-dashed border-white/10">
                    <ClipboardList size={36} className="text-fluent-text-muted opacity-25 mx-auto mb-4" />
                    <h3 className="text-sm font-bold text-white mb-1">Sin Tareas Coincidentes</h3>
                    <p className="text-xs text-fluent-text-muted max-w-sm mx-auto">
                      No hay tareas registradas para esta investigación con los filtros actuales.
                    </p>
                  </div>
                ) : (
                  generalFilteredTasks.map(tarea => {
                    const estado = ESTADO_TAREA[tarea.estado];
                    const prioridad = PRIORIDAD_CONFIG[tarea.prioridad];
                    const EstadoIcon = estado.icon;
                    return (
                      <div key={tarea.id} className="fluent-card p-0 overflow-hidden group">
                        <div className="flex items-stretch">
                          <div className={`w-1.5 ${prioridad.dot} shrink-0`} />
                          <div className="flex-1 p-5 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className={`p-1.5 rounded-md ${estado.color.split(' ')[0]}`}>
                                  <EstadoIcon size={14} className={estado.color.split(' ')[1]} />
                                </div>
                                <div className="min-w-0">
                                  <h3 className="text-sm font-bold text-white truncate">{tarea.titulo}</h3>
                                  <p className="text-[10px] text-fluent-text-muted font-mono uppercase tracking-tight">
                                    Caso: {activeCaso.numeroCaso} — {activeCaso.titulo}
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

                            <p className="text-xs text-fluent-text-muted mb-4 line-clamp-2 leading-relaxed">{tarea.descripcion}</p>

                            <div className="flex flex-wrap items-center gap-4 text-[10px] text-fluent-text-muted/60 font-medium">
                              <span className="flex items-center gap-1.5">
                                <User size={11} /> {tarea.asignadoA || 'Sin asignar'}
                              </span>
                              {tarea.fechaVencimiento && (
                                <span className="flex items-center gap-1.5">
                                  <Calendar size={11} /> {new Date(tarea.fechaVencimiento).toLocaleDateString('es')}
                                </span>
                              )}
                              {tarea.pasoId && (
                                <span className="flex items-center gap-1.5 text-fluent-accent">
                                  <span className="text-[8px] font-black uppercase tracking-wider">Vinculada a Paso:</span>
                                  {tarea.pasoId}
                                </span>
                              )}
                              <span className="flex items-center gap-1.5">
                                <BarChart3 size={11} /> {tarea.porcentaje}%
                              </span>
                            </div>

                            {/* Progress bar */}
                            <div className="mt-3 w-full bg-white/5 rounded-full h-1 overflow-hidden">
                              <div
                                className="h-full bg-fluent-accent rounded-full transition-all duration-500"
                                style={{ width: `${tarea.porcentaje}%` }}
                              />
                            </div>
                          </div>

                          <div className="flex flex-col gap-1 p-3 border-l border-white/5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <select
                              value={tarea.estado}
                              onChange={e => handleStatusChange(tarea, e.target.value as EstadoTarea)}
                              className="text-[10px] bg-white/5 border border-white/10 rounded px-1.5 py-1 text-white outline-none cursor-pointer"
                            >
                              {Object.entries(ESTADO_TAREA).map(([k, v]) => (
                                <option key={k} value={k}>{v.label}</option>
                              ))}
                            </select>
                            <button
                              onClick={() => {
                                if (confirm(`¿Eliminar la tarea "${tarea.titulo}"?`)) {
                                  deleteTarea(tarea.id);
                                  addAuditLog({
                                    accion: 'TAREA_ELIMINADA',
                                    detalle: `Tarea "${tarea.titulo}" eliminada`,
                                    nivel: 'warning',
                                    casoId: activeCaso.id,
                                    usuario: 'sistema',
                                  });
                                }
                              }}
                              className="p-1.5 rounded hover:bg-red-500/10 text-fluent-text-muted hover:text-red-400 transition-colors"
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

              {/* Task creator Modal inside general dashboard */}
              {showTaskModal && (
                <NuevaTareaModal
                  onClose={() => setShowTaskModal(false)}
                  onSubmit={(data) => {
                    addTarea(data);
                    addAuditLog({
                      accion: 'TAREA_CREADA',
                      detalle: `Tarea "${data.titulo}" creada para caso ${activeCaso.numeroCaso}`,
                      nivel: 'success',
                      casoId: activeCaso.id,
                      usuario: data.asignadoA,
                    });
                    setShowTaskModal(false);
                  }}
                  casos={casos}
                  normativas={normativas}
                  activeCasoId={activeCaso.id}
                />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Modal de Creación de Tarea (General) ───────────────────────────────────────────────

function NuevaTareaModal({
  onClose,
  onSubmit,
  casos,
  normativas,
  activeCasoId
}: {
  onClose: () => void;
  onSubmit: (data: Omit<TareaForense, 'id' | 'fechaCreacion'>) => void;
  casos: { id: string; numeroCaso: string; titulo: string; tipoProyecto?: string }[];
  normativas: { id: string; codigo: string }[];
  activeCasoId: string;
}) {
  const [form, setForm] = useState({
    casoId: activeCasoId || casos[0]?.id || '',
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
        className="bg-[#1a1a1a] border border-white/10 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-fluent-accent/10">
              <ClipboardList size={18} className="text-fluent-accent" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Nueva Tarea Forense</h2>
              <p className="text-[10px] text-fluent-text-muted font-medium">Registro de Actividad Técnica</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-white/5 text-fluent-text-muted hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="fluent-label">Caso Vinculado *</label>
            <select
              value={form.casoId}
              onChange={e => setForm(p => ({ ...p, casoId: e.target.value, pasoId: '' }))}
              className="fluent-input"
              required
            >
              <option value="">Seleccione un caso...</option>
              {casos.map(c => (
                <option key={c.id} value={c.id}>{c.numeroCaso} — {c.titulo}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="fluent-label">Paso / Etapa Técnica</label>
            <select
              value={form.pasoId}
              onChange={e => setForm(p => ({ ...p, pasoId: e.target.value }))}
              className="fluent-input"
            >
              <option value="">-- No vinculada a un paso --</option>
              {pasosDisponibles.map(p => (
                <option key={p.id} value={p.id}>Paso {p.num}: {p.titulo}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="fluent-label">Título de Tarea *</label>
            <input
              type="text"
              value={form.titulo}
              onChange={e => setForm(p => ({ ...p, titulo: e.target.value }))}
              className="fluent-input"
              placeholder="Ej: Extraer msgstore.db con APK Downgrade"
              required
            />
          </div>

          <div>
            <label className="fluent-label">Descripción</label>
            <textarea
              value={form.descripcion}
              onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))}
              className="fluent-input min-h-[80px] resize-y"
              placeholder="Detalle los objetivos técnicos o alcances de la tarea..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="fluent-label">Asignar Perito</label>
              <input
                type="text"
                value={form.asignadoA}
                onChange={e => setForm(p => ({ ...p, asignadoA: e.target.value }))}
                className="fluent-input"
                placeholder="Nombre del perito"
              />
            </div>
            <div>
              <label className="fluent-label">Prioridad</label>
              <select
                value={form.prioridad}
                onChange={e => setForm(p => ({ ...p, prioridad: e.target.value as PrioridadCaso }))}
                className="fluent-input"
              >
                {Object.entries(PRIORIDAD_CONFIG).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="fluent-label">Fecha de Vencimiento</label>
            <input
              type="date"
              value={form.fechaVencimiento}
              onChange={e => setForm(p => ({ ...p, fechaVencimiento: e.target.value }))}
              className="fluent-input"
            />
          </div>

          <div>
            <label className="fluent-label">Normativas Relacionadas</label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {normativas.map(n => (
                <label
                  key={n.id}
                  className={`flex items-center gap-2 text-[10px] font-bold p-2 rounded-md border cursor-pointer transition-all ${
                    form.normativasRelacionadas.includes(n.id)
                      ? 'bg-fluent-accent/10 border-fluent-accent/30 text-fluent-accent'
                      : 'bg-white/[0.03] border-white/5 text-fluent-text-muted hover:bg-white/5'
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
                      ? 'bg-fluent-accent border-fluent-accent'
                      : 'border-white/20'
                  }`}>
                    {form.normativasRelacionadas.includes(n.id) && (
                      <CheckCircle2 size={8} className="text-black" />
                    )}
                  </div>
                  <span className="truncate">{n.codigo}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="fluent-label">Observaciones</label>
            <textarea
              value={form.observaciones}
              onChange={e => setForm(p => ({ ...p, observaciones: e.target.value }))}
              className="fluent-input min-h-[60px] resize-y"
              placeholder="Notas u observaciones técnicas adicionales..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <button type="button" onClick={onClose} className="fluent-btn fluent-btn-secondary text-sm">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!form.casoId || !form.titulo}
              className="fluent-btn fluent-btn-primary text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Registrar Tarea
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
