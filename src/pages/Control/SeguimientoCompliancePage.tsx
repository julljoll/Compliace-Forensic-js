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
} from '../../components/atoms/AppleIcon';
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

const PLANILLA_DOCS: Record<string, { path: string; label: string }[]> = {
  wp_step1: [
    { path: '/planillas/acta-obtencion', label: 'Imprimir Acta de Obtención por Consignación' },
    { path: '/planillas/acta-entrevista', label: 'Imprimir Acta de Entrevista' }
  ],
  wp_step2: [
    { path: '/planillas/prcc-derivacion', label: 'Imprimir Planilla PRCC' }
  ],
  wp_step3: [],
  wp_step4: [
    { path: '/planillas/prcc-derivacion', label: 'Imprimir Planilla PRCC' }
  ],
  wp_step5: [],
  wp_step6: [],
  wp_step7: [
    { path: '/planillas/dictamen', label: 'Imprimir Dictamen Forense' }
  ],
  wp_step8: [
    { path: '/planillas/entrega-resultados', label: 'Imprimir Acta de Entrega de Resultados' }
  ],
  wp_step9: [
    { path: '/planillas/entrega-resultados', label: 'Imprimir Acta de Entrega de Resultados' }
  ],
};

// Helper types & configs for task list
const ESTADO_TAREA: Record<EstadoTarea, { label: string; color: string; icon: any }> = {
  pendiente:   { label: 'Pendiente',    color: 'bg-[#FF9500]/10 text-[#FF9500] border-[#FF9500]/20', icon: Clock },
  en_progreso: { label: 'En Progreso',  color: 'bg-[#007AFF]/10 text-[#007AFF] border-[#007AFF]/20',   icon: TrendingUp },
  completada:  { label: 'Completada',   color: 'bg-[#34C759]/10 text-[#34C759] border-[#34C759]/20',  icon: CheckCircle2 },
  bloqueada:   { label: 'Bloqueada',    color: 'bg-[#FF3B30]/10 text-[#FF3B30] border-[#FF3B30]/20',  icon: Pause },
};

const PRIORIDAD_CONFIG: Record<PrioridadCaso, { label: string; dot: string; bg: string }> = {
  critica: { label: 'Crítica', dot: 'bg-[#FF3B30]',    bg: 'bg-[#FF3B30]/10 text-[#FF3B30] border-[#FF3B30]/20' },
  alta:    { label: 'Alta',    dot: 'bg-[#FF9500]',     bg: 'bg-[#FF9500]/10 text-[#FF9500] border-[#FF9500]/20' },
  media:   { label: 'Media',   dot: 'bg-[#FFCC00]',     bg: 'bg-[#FFCC00]/10 text-[#FFCC00] border-[#FFCC00]/20' },
  baja:    { label: 'Baja',    dot: 'bg-[#34C759]',     bg: 'bg-[#34C759]/10 text-[#34C759] border-[#34C759]/20' },
};

// Helper types for UI rendering
interface NormativaTag { label: string; color: string; }
interface Advertencia { titulo: string; cuerpo: string; nivel: string; }

function BadgeNormativa({ tag }: { tag: NormativaTag }) {
  const colors: Record<string, string> = {
    cyan:   'bg-[#007AFF]/10 border-[#007AFF]/25 text-[#007AFF]',
    green:  'bg-[#34C759]/10 border-[#34C759]/25 text-[#34C759]',
    yellow: 'bg-[#FF9500]/10 border-[#FF9500]/25 text-[#FF9500]',
    red:    'bg-[#FF3B30]/10 border-[#FF3B30]/25 text-[#FF3B30]',
    purple: 'bg-[#AF52DE]/10 border-[#AF52DE]/25 text-[#AF52DE]',
  };
  return (
    <span className={`inline-flex items-center text-[8px] font-semibold uppercase tracking-[0.15em] px-2 py-0.5 rounded border ${colors[tag.color]}`}>
      {tag.label}
    </span>
  );
}

function AlertaForense({ adv }: { adv: Advertencia }) {
  const configs: Record<string, { wrapper: string; icon: string; titulo: string; cuerpo: string; Icon: any }> = {
    critical: {
      wrapper: 'bg-[#FF3B30]/[0.06] border-[#FF3B30]/25',
      icon:    'text-[#FF3B30]',
      titulo:  'text-[#FF3B30]',
      cuerpo:  'text-[#1D1D1F]',
      Icon:    AlertTriangle,
    },
    warning: {
      wrapper: 'bg-[#FF9500]/[0.06] border-[#FF9500]/25',
      icon:    'text-[#FF9500]',
      titulo:  'text-[#FF9500]',
      cuerpo:  'text-[#1D1D1F]',
      Icon:    AlertTriangle,
    },
    info: {
      wrapper: 'bg-[#007AFF]/[0.06] border-[#007AFF]/25',
      icon:    'text-[#007AFF]',
      titulo:  'text-[#007AFF]',
      cuerpo:  'text-[#1D1D1F]',
      Icon:    Info,
    },
  };
  const cfg = configs[adv.nivel] || configs.info;

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border ${cfg.wrapper}`}>
      <cfg.Icon size={14} className={`${cfg.icon} shrink-0 mt-0.5`} />
      <div>
        <p className={`text-[10px] font-semibold uppercase tracking-wider mb-1 ${cfg.titulo}`}>
          {adv.nivel === 'critical' ? 'CRÍTICO' : adv.nivel === 'warning' ? 'Advertencia' : 'Nota'}: {adv.titulo}
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
    bash:       'text-[#34C759]',
    powershell: 'text-[#007AFF]',
    sql:        'text-[#FF9500]',
    python:     'text-[#007AFF]',
  };

  return (
    <div className="rounded-lg overflow-hidden border border-white/[0.1] mt-3">
      <div className="flex items-center justify-between px-4 py-2 bg-[#1D1D1F] border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <Terminal size={11} className="text-white/35" />
          <span className={`text-[9px] font-semibold uppercase tracking-[0.15em] ${LANG_COLOR[lang] || 'text-white/35'}`}>
            {lang}
          </span>
        </div>
        <button
          onClick={copiar}
          className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider px-2 py-1 rounded bg-white/[0.08] border border-white/[0.1] text-white/40 hover:text-[#007AFF] hover:border-[#007AFF]/30 transition-all"
        >
          {copiado
            ? <><CheckCheck size={10} className="text-[#34C759]" /> Copiado</>
            : <><Copy size={10} /> Copiar</>}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-4 bg-[#1D1D1F] text-[11px] leading-relaxed">
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
    verifyStepCompletion,
    complianceChecklist,
  } = useCMSStore();

  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'trazabilidad';

  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);

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

  // Initialize steps if case has no steps or if they are empty
  useEffect(() => {
    if (activeCaso && (!activeCaso.steps || Object.keys(activeCaso.steps).length === 0)) {
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

  // Manual step progression checks are evaluated dynamically via stepValidation

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
  // IMPORTANTE: Incluir complianceChecklist como dependencia para que se recalcule
  // inmediatamente cuando el usuario marca/desmarca un compliance check
  const stepValidation = useMemo(() => {
    if (!activeCaso || !selectedStepId) return { canComplete: true, missing: [] };
    return verifyStepCompletion(selectedStepId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCaso, selectedStepId, tareas, complianceChecklist, verifyStepCompletion]);

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
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[60vh] apple-fade-in" id="seguimiento-compliance-page">
        <div className="p-4 rounded-full bg-apple-accent/10 border border-apple-accent/20 text-apple-accent mb-6 animate-pulse">
          <Briefcase size={48} strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl font-bold text-[#1D1D1F] mb-2">No se detectaron casos creados</h2>
        <p className="text-[#86868B] text-sm max-w-md mb-6 leading-relaxed">
          Para realizar el seguimiento forense y compliance, es necesario inicializar al menos un proyecto/caso en la sección de control de casos.
        </p>
        <Link
          to="/casos"
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-apple-accent hover:bg-apple-accent/90 text-white font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-apple-accent/20"
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
    <div className="space-y-8 apple-fade-in" id="seguimiento-compliance-page">
      {/* Header and selector */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1D1D1F] tracking-tight flex items-center gap-3">
            <div className="p-2 rounded-[4px] bg-[#0071E3]/10 border border-[#0071E3]/20">
              <ShieldCheck className="text-[#0071E3]" size={26} strokeWidth={2.5} />
            </div>
            Etapas de los casos
          </h1>
          <p className="text-xs md:text-sm text-[#86868B] font-medium max-w-lg mt-2 leading-relaxed">
            Consolidado forense estructurado, control de tareas asociadas y validaciones normativas de control (ISO/IEC 27037/27042, NIST, MUCCEF).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-semibold uppercase text-[#86868B] tracking-wider">
            Investigación Activa:
          </span>
          <select
            value={casoSeleccionado || ''}
            onChange={(e) => seleccionarCaso(e.target.value)}
            className="apple-input text-xs font-semibold min-w-[220px]"
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
          <div className="apple-card grid grid-cols-2 md:grid-cols-4 gap-4 p-5">
            <div className="space-y-0.5">
              <span className="text-[9px] font-semibold uppercase text-[#86868B] tracking-wider block">Dispositivo</span>
              <p className="text-xs font-bold text-[#1D1D1F] truncate">{activeCaso.dispositivo_marca || 'N/D'} {activeCaso.dispositivo_modelo || ''}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] font-semibold uppercase text-[#86868B] tracking-wider block">IMEI</span>
              <p className="text-xs font-mono text-[#0071E3] font-semibold truncate">{activeCaso.dispositivo_imei || 'N/D'}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] font-semibold uppercase text-[#86868B] tracking-wider block">Fiscalía</span>
              <p className="text-xs font-bold text-[#1D1D1F] truncate">{activeCaso.fiscal || 'Sin designar'}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] font-semibold uppercase text-[#86868B] tracking-wider block">Perito Asignado</span>
              <p className="text-xs font-bold text-[#1D1D1F] truncate">{activeCaso.peritoLider || 'Sin designar'}</p>
            </div>
          </div>

          {/* Unified dashboard metrics (3 Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step execution gauge */}
            <div className="apple-card p-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-[#1D1D1F] text-xs tracking-tight flex items-center gap-1.5">
                  <Database size={14} className="text-[#007AFF]" />
                  Progreso de Pasos Forenses
                </h3>
                <span className="text-[9px] font-semibold font-mono text-[#007AFF] bg-[#007AFF]/10 px-2 py-0.5 rounded border border-[#007AFF]/20 uppercase tracking-widest">
                  {metrics.completedStepsCount} / {metrics.totalSteps} Pasos
                </span>
              </div>
              <div className="w-full h-2 bg-black/[0.05] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${metrics.stepPct}%`,
                    background: 'linear-gradient(90deg, #007AFF, #5856D6)'
                  }}
                />
              </div>
              <div className="mt-2 flex justify-between text-[9px] font-medium text-[#86868B] uppercase tracking-widest">
                <span>Fases de Metodología</span>
                <span className="text-[#007AFF]">{metrics.stepPct}% Completado</span>
              </div>
            </div>

            {/* Compliance verification gauge */}
            <div className="apple-card p-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-green-500/40 to-transparent" />
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-[#1D1D1F] text-xs tracking-tight flex items-center gap-1.5">
                  <Shield size={14} className="text-[#34C759]" />
                  Garantía de Compliance
                </h3>
                <span className="text-[9px] font-semibold font-mono text-[#34C759] bg-[#34C759]/10 px-2 py-0.5 rounded border border-[#34C759]/20 uppercase tracking-widest">
                  {metrics.compliancePct}% Conforme
                </span>
              </div>
              <div className="w-full h-2 bg-black/[0.05] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${metrics.compliancePct}%`,
                    background: 'linear-gradient(90deg, #34C759, #30D158)'
                  }}
                />
              </div>
              <div className="mt-2 flex justify-between text-[9px] font-medium text-[#86868B] uppercase tracking-widest">
                <span>Requisitos de Calidad</span>
                <span className="text-[#34C759]">{metrics.compliancePct}% Conforme</span>
              </div>
            </div>

            {/* Task completion rate gauge */}
            <div className="apple-card p-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#FF9500]/40 to-transparent" />
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-[#1D1D1F] text-xs tracking-tight flex items-center gap-1.5">
                  <ClipboardList size={14} className="text-[#0071E3]" />
                  Resolución de Tareas
                </h3>
                <span className="text-[9px] font-semibold font-mono text-[#0071E3] bg-[#0071E3]/10 px-2 py-0.5 rounded border border-[#0071E3]/20 uppercase tracking-widest">
                  {metrics.completedTasks} / {metrics.totalTasks} Tareas
                </span>
              </div>
              <div className="w-full h-2 bg-black/[0.05] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${metrics.tasksPct}%`,
                    background: 'linear-gradient(90deg, #FFCC00, #0071E3)'
                  }}
                />
              </div>
              <div className="mt-2 flex justify-between text-[9px] font-medium text-[#86868B] uppercase tracking-widest">
                <span>Tareas Técnicas</span>
                <span className="text-[#0071E3]">{metrics.tasksPct}% Completadas</span>
              </div>
            </div>
          </div>

          {/* Upper Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-black/[0.06] pb-4 mb-6">
            <button
              onClick={() => setTab('trazabilidad')}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold uppercase tracking-wider rounded-lg border transition-all ${
                currentTab !== 'tareas'
                  ? 'bg-[#0071E3]/10 border-[#0071E3]/30 text-[#0071E3]'
                  : 'border-transparent text-[#86868B] hover:text-[#1D1D1F] hover:bg-black/[0.03]'
              }`}
            >
              <ShieldCheck size={14} />
              <span>Trazabilidad & Fases</span>
            </button>
            <button
              onClick={() => setTab('tareas')}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold uppercase tracking-wider rounded-lg border transition-all ${
                currentTab === 'tareas'
                  ? 'bg-[#0071E3]/10 border-[#0071E3]/30 text-[#0071E3]'
                  : 'border-transparent text-[#86868B] hover:text-[#1D1D1F] hover:bg-black/[0.03]'
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
                    <div key={phaseName} className="space-y-2 apple-card p-4">
                      <div className="flex justify-between items-center px-1">
                        <h4 className="text-[9px] font-semibold uppercase text-[#86868B] tracking-wider">
                          {phaseName}
                        </h4>
                        <span className="text-[9px] font-semibold font-mono text-[#0071E3]">
                          {completedCount}/{totalCount}
                        </span>
                      </div>
                      <div className="w-full h-1 bg-black/[0.05] rounded-full overflow-hidden mb-3">
                        <div 
                          className="h-full bg-[#0071E3] rounded-full transition-all duration-500" 
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
                                  ? 'opacity-40 bg-black/[0.02] border-black/[0.04] cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-[#0071E3]/10 border-[#0071E3]/40 shadow-sm'
                                  : completado
                                  ? 'bg-[#34C759]/[0.04] border-[#34C759]/20 hover:border-[#34C759]/40'
                                  : estado === 'en_progreso'
                                  ? 'bg-[#007AFF]/[0.04] border-[#007AFF]/25 hover:border-[#007AFF]/40'
                                  : 'bg-black/[0.02] border-black/[0.06] hover:border-black/[0.12]'
                              }`}
                            >
                              <div className={`p-1.5 rounded shrink-0 ${
                                completado ? 'bg-[#34C759]/10 text-[#34C759]'
                                  : estado === 'en_progreso' ? 'bg-[#007AFF]/10 text-[#007AFF]'
                                  : 'bg-black/[0.04]'
                              }`}>
                                {isLocked ? (
                                  <Lock size={12} className="text-[#86868B]" />
                                ) : (
                                  <Icon size={12} />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-[11px] font-semibold text-[#1D1D1F] block truncate">
                                  {step.num}. {step.titulo}
                                </span>
                              </div>
                              {completado && (
                                <CheckCheck size={12} className="text-[#34C759] shrink-0" />
                              )}
                              {estado === 'en_progreso' && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#007AFF] animate-pulse shrink-0" />
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
                  // Solo bloquear edición si el paso está genuinamente bloqueado (sin desbloquear aún)
                  // Un paso completado puede ser revisado (para posible corrección va Desmarcar Hito)
                  const isLocked = estado === 'bloqueado';
                  const isDisponible = estado === 'disponible';
                  const isEnProgreso = estado === 'en_progreso';

                  // Calcular progreso interno del paso
                  const tareasCompletadas = stepTasks.filter(t => t.estado === 'completada').length;
                  const totalTareasPaso = stepTasks.length;
                  const complianceCompletados = requisitos.filter(r => isComplianceChecked(r.id)).length;
                  const totalCompliancePaso = requisitos.length;

                  return (
                    <div className="apple-card p-6 relative overflow-hidden space-y-6">
                      
                      {/* Step Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/[0.06]">
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-lg shrink-0 ${
                            completado ? 'bg-[#34C759]/15 text-[#34C759]' 
                              : isEnProgreso ? 'bg-[#007AFF]/15 text-[#007AFF]'
                              : 'bg-black/[0.04]'
                          }`}>
                            <Icon size={18} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] text-[#86868B] uppercase font-semibold tracking-wider">
                                Paso {selectedStep.num} — {selectedStep.fase}
                              </span>
                              {selectedStep.normativas && selectedStep.normativas.map((n: any) => (
                                <BadgeNormativa key={n.label} tag={n} />
                              ))}
                            </div>
                            <h2 className="text-lg font-bold text-[#1D1D1F] mt-1">
                              {selectedStep.titulo}
                            </h2>
                          </div>
                        </div>

                        {/* Status label + progreso interno del paso */}
                        <div className="flex items-center gap-3 flex-wrap">
                          {/* Mini indicadores de progreso del paso */}
                          {!completado && (
                            <>
                              {totalTareasPaso > 0 && (
                                <span className={`text-[9px] font-semibold px-2 py-0.5 rounded border uppercase tracking-wider ${
                                  tareasCompletadas === totalTareasPaso
                                    ? 'bg-[#34C759]/10 border-[#34C759]/25 text-[#34C759]'
                                    : 'bg-[#FF9500]/10 border-[#FF9500]/25 text-[#FF9500]'
                                }`}>
                                  ✓ {tareasCompletadas}/{totalTareasPaso} Tareas
                                </span>
                              )}
                              {totalCompliancePaso > 0 && (
                                <span className={`text-[9px] font-semibold px-2 py-0.5 rounded border uppercase tracking-wider ${
                                  complianceCompletados === totalCompliancePaso
                                    ? 'bg-[#34C759]/10 border-[#34C759]/25 text-[#34C759]'
                                    : 'bg-[#007AFF]/10 border-[#007AFF]/25 text-[#007AFF]'
                                }`}>
                                  □ {complianceCompletados}/{totalCompliancePaso} Compliance
                                </span>
                              )}
                            </>
                          )}
                          <span className={`text-[9px] font-semibold uppercase tracking-[0.15em] px-2.5 py-1 rounded border ${
                            completado
                              ? 'bg-[#34C759]/10 border-[#34C759]/25 text-[#34C759]'
                              : isEnProgreso
                              ? 'bg-[#007AFF]/10 border-[#007AFF]/25 text-[#007AFF]'
                              : isDisponible
                              ? 'bg-[#FF9500]/10 border-[#FF9500]/25 text-[#FF9500]'
                              : 'bg-black/[0.03] border-black/[0.08] text-[#86868B]'
                          }`}>
                            {completado ? 'Completado' 
                              : isEnProgreso ? 'En Progreso'
                              : isDisponible ? 'Disponible'
                              : 'Bloqueado'}
                          </span>
                        </div>
                      </div>

                      {/* Gating protection validation warnings */}
                      {!stepValidation.canComplete && !completado && (
                        <div className="p-4 rounded-lg border border-[#FF9500]/25 bg-[#FF9500]/[0.04] space-y-3">
                          <div className="flex items-center gap-2 text-[#FF9500]">
                            <AlertTriangle size={14} />
                            <span className="text-[10px] font-semibold uppercase tracking-wider">
                              Requisitos pendientes para completar esta etapa (Haga clic para resolver)
                            </span>
                          </div>
                          
                          {(stepValidation as any).missingObjects && (stepValidation as any).missingObjects.length > 0 ? (
                            <div className="space-y-2">
                              {(stepValidation as any).missingObjects.map((item: any, idx: number) => (
                                <button
                                  key={idx}
                                  onClick={() => {
                                    if (item.type === 'tarea') {
                                      updateTarea(item.id, {
                                        estado: 'completada',
                                        fechaCompletada: new Date().toISOString(),
                                        porcentaje: 100
                                      });
                                      addAuditLog({
                                        accion: 'TAREA_ACTUALIZADA',
                                        detalle: `Tarea "${item.text.replace('Tarea pendiente: ', '')}" → Completada (desde advertencias)`,
                                        nivel: 'success',
                                        casoId: activeCaso.id,
                                        usuario: activeCaso.peritoLider || 'sistema'
                                      });
                                    } else {
                                      toggleComplianceCheck(item.id, item.subId || '');
                                    }
                                  }}
                                  className="w-full flex items-center gap-2.5 p-2 rounded border border-black/[0.04] bg-white/40 hover:bg-white hover:border-[#FF9500]/30 hover:shadow-sm text-left transition-all group"
                                >
                                  <div className="w-[14px] h-[14px] rounded border border-black/25 flex items-center justify-center bg-white group-hover:border-[#FF9500] group-hover:text-[#FF9500] shrink-0 transition-all">
                                    <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#FF9500]/40 transition-all" />
                                  </div>
                                  <span className="text-[10px] text-[#1D1D1F] font-medium leading-tight">
                                    {item.text}
                                  </span>
                                </button>
                              ))}
                            </div>
                          ) : (
                            <ul className="list-disc pl-4 space-y-1">
                              {stepValidation.missing.map((item, idx) => (
                                <li key={idx} className="text-[10px] text-[#1D1D1F] font-medium">
                                  {item}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}

                      {/* Split column view for step tools */}
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        
                        {/* Col 1: Technical & Tasks */}
                        <div className="space-y-6">
                          
                          {/* Guide description */}
                          <div className="space-y-4">
                            <h4 className="text-[10px] font-semibold text-[#007AFF] uppercase tracking-widest pb-1 border-b border-black/[0.06]">
                              Ejecución Técnica e Instrucciones
                            </h4>
                            
                            <div className="border-l-2 border-[#0071E3]/30 pl-4 space-y-1">
                              <span className="text-[9px] text-[#0071E3] font-semibold uppercase tracking-wider block">Acción Operativa</span>
                              <p className="text-xs text-[#1D1D1F] font-medium">{selectedStep.action}</p>
                            </div>

                            {selectedStep.docs && selectedStep.docs.length > 0 && (
                              <div>
                                <span className="text-[9px] font-semibold text-[#86868B] uppercase tracking-widest block mb-1.5">Documentación Emitida</span>
                                <div className="flex flex-wrap gap-2">
                                  {selectedStep.docs.map((doc: string, idx: number) => (
                                    <span key={idx} className="bg-black/[0.04] border border-black/[0.08] rounded-full px-2.5 py-0.5 text-[9px] text-[#86868B] uppercase tracking-wider font-medium">
                                      {doc}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="apple-card !p-4 !border !border-black/[0.06] !rounded-lg">
                              <h5 className="text-[9px] font-bold text-[#0071E3] uppercase tracking-wider mb-1">Fundamento Metodológico</h5>
                              <p className="text-xs text-[#86868B] leading-relaxed">{selectedStep.guide}</p>
                            </div>
                          </div>

                          {/* Dynamic Task List for the step */}
                          <div className="apple-card p-4 space-y-4">
                            <div className="flex justify-between items-center pb-2 border-b border-black/[0.06]">
                              <h5 className="text-[11px] font-semibold uppercase text-[#0071E3] tracking-widest flex items-center gap-1.5">
                                <ClipboardList size={13} />
                                Checklist de Tareas del Paso
                              </h5>
                              <span className="text-[10px] font-medium font-mono text-[#86868B]">
                                {stepTasks.filter(t => t.estado === 'completada').length}/{stepTasks.length} Listas
                              </span>
                            </div>

                            {/* Dynamic tasks list rendering */}
                            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                              {stepTasks.length === 0 ? (
                                <p className="text-[11px] text-[#86868B] italic py-2 text-center">
                                  No hay tareas asignadas para esta etapa.
                                </p>
                              ) : (
                                stepTasks.map(task => {
                                  const isCompleted = task.estado === 'completada';
                                  const pr = PRIORIDAD_CONFIG[task.prioridad || 'media'];
                                  return (
                                    <div key={task.id} className={`flex items-center justify-between p-2.5 rounded border hover:border-black/10 transition-all group ${
                                      isCompleted
                                        ? 'check-item-conforme'
                                        : 'check-item-pendiente'
                                    }`}>
                                      <div className="flex items-center gap-3 min-w-0">
                                        <button
                                          disabled={isLocked}
                                          onClick={() => {
                                            updateTarea(task.id, {
                                              estado: isCompleted ? 'pendiente' : 'completada',
                                              fechaCompletada: isCompleted ? undefined : new Date().toISOString(),
                                              porcentaje: isCompleted ? 0 : 100
                                            });
                                          }}
                                          className={`w-[16px] h-[16px] rounded border flex items-center justify-center shrink-0 transition-all ${
                                            isCompleted
                                              ? 'bg-[#0071E3] border-[#0071E3] text-white'
                                              : !isLocked
                                                ? 'border-black/20 hover:border-[#0071E3]/50'
                                                : 'border-black/10 opacity-40 cursor-not-allowed'
                                          }`}
                                        >
                                          {isCompleted && <CheckCheck size={10} strokeWidth={3} />}
                                        </button>
                                        <div className="min-w-0">
                                          <span 
                                            className={`text-xs block select-none ${isCompleted ? 'text-[#34C759]/60 line-through' : 'text-[#1D1D1F]'}`}
                                          >
                                            {task.titulo}
                                          </span>
                                          <span className="text-[9px] text-[#86868B] font-mono flex items-center gap-2 mt-0.5">
                                            <span>Por: {task.asignadoA || 'Perito'}</span>
                                            <span>•</span>
                                            <span className={`px-1 py-0.5 rounded-[2px] uppercase text-[7px] font-semibold border ${pr.bg}`}>
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
                                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/10 text-[#86868B] hover:text-[#FF3B30] transition-all"
                                      >
                                        <Trash2 size={12} />
                                      </button>
                                    </div>
                                  );
                                })
                              )}
                            </div>

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
                          <h4 className="text-[10px] font-semibold text-[#34C759] uppercase tracking-widest pb-1 border-b border-black/[0.06]">
                            Requisitos de Compliance Normativo
                          </h4>

                          <div className="space-y-3">
                            {requisitos.map((req) => {
                              const checked = isComplianceChecked(req.id);
                              const checkDate = getComplianceCheckDate(req.id);
                              const obsValue = getComplianceObservacionValue(req.id);

                              return (
                                <div key={req.id} className={`apple-card p-4 space-y-3 border transition-all ${
                                  checked ? 'check-item-conforme' : 'check-item-pendiente'
                                }`}>
                                  <div className="flex items-start gap-3">
                                    <button
                                      onClick={() => {
                                        toggleComplianceCheck(req.id, req.normativaId);
                                      }}
                                      disabled={isLocked}
                                      className={`w-[18px] h-[18px] rounded-[4px] border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                                        checked
                                          ? 'bg-[#34C759] border-[#34C759] text-white shadow-sm'
                                          : !isLocked
                                            ? 'border-black/20 hover:border-[#34C759]/50'
                                            : 'border-black/10 opacity-40 cursor-not-allowed'
                                      }`}
                                    >
                                      {checked && <CheckCheck size={12} strokeWidth={3} />}
                                    </button>

                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <span className="font-mono text-[9px] font-semibold text-[#0071E3] uppercase tracking-wider">
                                          {req.codigo}
                                        </span>
                                        {checked && checkDate && (
                                          <span className="text-[8px] font-semibold text-[#34C759] uppercase tracking-widest">
                                            ✓ Conforme
                                          </span>
                                        )}
                                      </div>
                                      <p className={`text-xs font-semibold ${checked ? 'text-[#34C759]/60 line-through opacity-60' : 'text-[#1D1D1F]'}`}>
                                        {req.nombre}
                                      </p>
                                      <p className="text-[11px] text-[#86868B] mt-1 leading-relaxed">
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
                                      className="apple-input w-full text-[11px]"
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
                        <div className="apple-card !mt-6 !p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="apple-label flex items-center gap-1.5">
                              <Calendar size={11} className="text-[#0071E3]" />
                              <span>Fecha y Hora de Firma</span>
                            </label>
                            <input 
                              type="datetime-local" 
                              className="apple-input" 
                              value={metadata.fecha || ''}
                              onChange={(e) => setStepMetadata(selectedStep.id, { fecha: e.target.value })}
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="apple-label flex items-center gap-1.5">
                              <User size={11} className="text-[#0071E3]" />
                              <span>Responsable / Perito Firmante</span>
                            </label>
                            <input 
                              type="text" 
                              className="apple-input" 
                              placeholder="Nombre del Funcionario Asignado"
                              value={metadata.responsable || ''}
                              onChange={(e) => setStepMetadata(selectedStep.id, { responsable: e.target.value })}
                            />
                          </div>

                          <div className="space-y-1 md:col-span-2">
                            <label className="apple-label flex items-center gap-1.5">
                              <span>Observaciones del Acta / Precinto</span>
                            </label>
                            <input 
                              type="text" 
                              className="apple-input" 
                              placeholder="Ej: Precinto verificado, sin irregularidades"
                              value={metadata.observaciones || ''}
                              onChange={(e) => setStepMetadata(selectedStep.id, { observaciones: e.target.value })}
                            />
                          </div>
                        </div>
                      )}

                      {/* Official templates printable link */}
                      {PLANILLA_DOCS[selectedStep.id] && PLANILLA_DOCS[selectedStep.id].length > 0 && (
                        <div className="pt-4 border-t border-black/[0.06] flex flex-col gap-2">
                          <span className="text-[10px] text-[#86868B] italic">
                            Planillas oficiales correspondientes a esta etapa:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {PLANILLA_DOCS[selectedStep.id].map((doc, idx) => (
                              <Link
                                key={idx}
                                to={doc.path}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="apple-btn text-[9px] font-semibold uppercase tracking-wider bg-[#0071E3]/10 border border-[#0071E3]/25 text-[#0071E3] hover:bg-[#0071E3]/20"
                              >
                                <Printer size={12} />
                                <span>{doc.label}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Execution Control Actions */}
                      <div className="pt-4 border-t border-black/[0.06] flex items-center justify-between">
                        <span className="text-[10px] text-[#86868B] italic max-w-[50%]">
                          {completado && '✓ Hito cerrado y auditado'}
                          {!completado && !stepValidation.canComplete && 'Complete todas las tareas y requisitos normativos para habilitar el paso siguiente'}
                          {!completado && stepValidation.canComplete && 'Todo listo. Presione Paso Siguiente para avanzar'}
                        </span>

                        <div className="flex items-center gap-3">
                          {!completado && (
                            <button
                              disabled={!stepValidation.canComplete}
                              onClick={() => {
                                if (estado === 'disponible') {
                                  startStep(selectedStep.id);
                                }
                                completeStep(selectedStep.id);

                                // Auto-navegar al siguiente paso disponible
                                setTimeout(() => {
                                  const pasos = metrics.pasos;
                                  const currentIdx = pasos.findIndex((p: any) => p.id === selectedStep.id);
                                  if (currentIdx !== -1 && currentIdx < pasos.length - 1) {
                                    const nextPaso = pasos[currentIdx + 1];
                                    if (nextPaso) setSelectedStepId(nextPaso.id);
                                  }
                                }, 150);
                              }}
                              className={`apple-btn text-[9px] font-semibold uppercase tracking-wider transition-all ${
                                stepValidation.canComplete
                                  ? 'bg-[#007AFF]/15 border border-[#007AFF]/25 text-[#007AFF] hover:bg-[#007AFF]/25 cursor-pointer shadow-sm'
                                  : 'bg-black/[0.04] border border-black/[0.08] text-[#86868B] cursor-not-allowed opacity-50'
                              }`}
                            >
                              <Play size={12} />
                              <span>Paso Siguiente</span>
                            </button>
                          )}

                          {completado && (
                            <button
                              onClick={() => setStepCompleted(selectedStep.id, false)}
                              className="apple-btn text-[9px] font-semibold uppercase tracking-wider bg-[#FF3B30]/10 border border-[#FF3B30]/20 text-[#FF3B30] hover:bg-[#FF3B30]/20"
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
                  <div className="apple-card p-16 text-center">
                    <ShieldCheck size={40} className="text-[#86868B] opacity-20 mx-auto mb-4" />
                    <p className="text-xs text-[#86868B]">
                      Seleccione una fase técnica a la izquierda para ver su espacio de trabajo unificado.
                    </p>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB CONTENT: 2. TABLERO DE TAREAS GENERAL */}
          {currentTab === 'tareas' && (
            <div className="space-y-8 apple-fade-in">
              {/* KPIs de Tareas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard title="Tareas Totales" value={generalKpis.total} sub={`${generalKpis.enProgreso} en progreso`} icon={ClipboardList} />
                <KpiCard title="Pendientes" value={generalKpis.pendientes} sub="Por asignar o iniciar" icon={Clock} color="text-[#FF9500]" />
                <KpiCard title="Completadas" value={generalKpis.completadas} sub={`${generalKpis.progreso}% resueltas`} icon={CheckCircle2} color="text-[#34C759]" accent />
                <KpiCard title="Bloqueadas" value={generalKpis.bloqueadas} sub="Requieren atención" icon={AlertTriangle} color="text-[#FF3B30]" />
              </div>

              {/* Filtros de Tareas */}
              <div className="apple-card rounded-xl p-5 flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#86868B]" />
                  <input
                    type="text"
                    placeholder="Buscador por título, perito o descripción..."
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
                  <button
                    onClick={() => setShowTaskModal(true)}
                    className="apple-btn apple-btn-primary flex items-center gap-2 transition-all"
                  >
                    <Plus size={16} strokeWidth={2.5} />
                    Nueva Tarea
                  </button>
                </div>
              </div>

              {/* Lista global de tareas */}
              <div className="space-y-3">
                {generalFilteredTasks.length === 0 ? (
                  <div className="apple-card p-16 text-center">
                    <ClipboardList size={36} className="text-[#86868B] opacity-25 mx-auto mb-4" />
                    <h3 className="text-sm font-bold text-[#1D1D1F] mb-1">Sin Tareas Coincidentes</h3>
                    <p className="text-xs text-[#86868B] max-w-sm mx-auto">
                      No hay tareas registradas para esta investigación con los filtros actuales.
                    </p>
                  </div>
                ) : (
                  generalFilteredTasks.map(tarea => {
                    const estado = ESTADO_TAREA[tarea.estado];
                    const prioridad = PRIORIDAD_CONFIG[tarea.prioridad];
                    const EstadoIcon = estado.icon;
                    return (
                      <div key={tarea.id} className="apple-card p-0 overflow-hidden group">
                        <div className="flex items-stretch">
                          <div className={`w-1.5 ${prioridad.dot} shrink-0`} />
                          <div className="flex-1 p-5 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className={`p-1.5 rounded-md ${estado.color.split(' ')[0]}`}>
                                  <EstadoIcon size={14} className={estado.color.split(' ')[1]} />
                                </div>
                                <div className="min-w-0">
                                  <h3 className="text-sm font-semibold text-[#1D1D1F] truncate">{tarea.titulo}</h3>
                                  <p className="text-[10px] text-[#86868B] font-mono uppercase tracking-tight">
                                    Caso: {activeCaso.numeroCaso} — {activeCaso.titulo}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className={`text-[9px] px-2 py-0.5 rounded-[4px] border font-semibold uppercase tracking-tight ${estado.color}`}>
                                  {estado.label}
                                </span>
                                <span className={`text-[9px] px-2 py-0.5 rounded-[4px] border font-semibold uppercase tracking-tight ${prioridad.bg}`}>
                                  {prioridad.label}
                                </span>
                              </div>
                            </div>

                            <p className="text-xs text-[#86868B] mb-4 line-clamp-2 leading-relaxed">{tarea.descripcion}</p>

                            <div className="flex flex-wrap items-center gap-4 text-[10px] text-[#86868B] font-medium">
                              <span className="flex items-center gap-1.5">
                                <User size={11} /> {tarea.asignadoA || 'Sin asignar'}
                              </span>
                              {tarea.fechaVencimiento && (
                                <span className="flex items-center gap-1.5">
                                  <Calendar size={11} /> {new Date(tarea.fechaVencimiento).toLocaleDateString('es')}
                                </span>
                              )}
                              {tarea.pasoId && (
                                <span className="flex items-center gap-1.5 text-[#0071E3]">
                                  <span className="text-[8px] font-semibold uppercase tracking-wider">Vinculada a Paso:</span>
                                  {tarea.pasoId}
                                </span>
                              )}
                              <span className="flex items-center gap-1.5">
                                <BarChart3 size={11} /> {tarea.porcentaje}%
                              </span>
                            </div>

                            {/* Progress bar */}
                            <div className="mt-3 w-full bg-black/[0.05] rounded-full h-1 overflow-hidden">
                              <div
                                className="h-full bg-[#0071E3] rounded-full transition-all duration-500"
                                style={{ width: `${tarea.porcentaje}%` }}
                              />
                            </div>
                          </div>

                          <div className="flex flex-col gap-1 p-3 border-l border-black/[0.06] opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <select
                              value={tarea.estado}
                              onChange={e => handleStatusChange(tarea, e.target.value as EstadoTarea)}
                              className="apple-input text-[10px]"
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
                              className="p-1.5 rounded hover:bg-[#FF3B30]/10 text-[#86868B] hover:text-[#FF3B30] transition-colors"
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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="apple-card w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl apple-fade-in p-0"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-black/[0.06]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-[#0071E3]/10">
              <ClipboardList size={18} className="text-[#0071E3]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1D1D1F]">Nueva Tarea Forense</h2>
              <p className="text-[10px] text-[#86868B] font-medium">Registro de Actividad Técnica</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-black/[0.04] text-[#86868B] hover:text-[#1D1D1F] transition-colors">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="apple-label">Caso Vinculado *</label>
            <select
              value={form.casoId}
              onChange={e => setForm(p => ({ ...p, casoId: e.target.value, pasoId: '' }))}
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
              <option value="">-- No vinculada a un paso --</option>
              {pasosDisponibles.map(p => (
                <option key={p.id} value={p.id}>Paso {p.num}: {p.titulo}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="apple-label">Título de Tarea *</label>
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
                  className={`flex items-center gap-2 text-[10px] font-semibold p-2 rounded-md border cursor-pointer transition-all ${
                    form.normativasRelacionadas.includes(n.id)
                      ? 'bg-[#0071E3]/10 border-[#0071E3]/30 text-[#0071E3]'
                      : 'bg-black/[0.02] border-black/[0.08] text-[#86868B] hover:bg-black/[0.04]'
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

          <div>
            <label className="apple-label">Observaciones</label>
            <textarea
              value={form.observaciones}
              onChange={e => setForm(p => ({ ...p, observaciones: e.target.value }))}
              className="apple-input min-h-[60px] resize-y"
              placeholder="Notas u observaciones técnicas adicionales..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-black/[0.06]">
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
