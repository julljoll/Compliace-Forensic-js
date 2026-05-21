import { useState, useEffect, useCallback } from 'react';
import { useForenseStore } from '../../store/forenseStore';
import { ETAPAS_FORENSES, ForensicStep } from '../../data/etapasForenses';
import {
  Printer, Calendar, User, Info,
  CheckCircle2, Circle, ChevronDown, ChevronUp, Terminal,
  Shield, Lock, Camera, Smartphone, Database, FileText,
  AlertTriangle, Copy, CheckCheck, Fingerprint, Package,
  Scale, Archive, TrendingUp
} from 'lucide-react';
import './Planillas.css';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTES Y TIPOS
// ─────────────────────────────────────────────────────────────────────────────

type NormativaColor = string;

interface NormativaTag {
  label: string;
  color: NormativaColor;
}

interface Advertencia {
  titulo: string;
  cuerpo: string;
  nivel: string;
}

type Step = ForensicStep;

interface Fase {
  id: string;
  numero: number;
  titulo: string;
  subtitulo: string;
  iconoName: string;
  color: string;        // clase de color de texto de Tailwind
  glowColor: string;    // sombra glow
  stepIds: string[];
}

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
  CheckCircle2
};

const FASES: Fase[] = [
  {
    id: 'f1',
    numero: 1,
    titulo: 'Obtención',
    subtitulo: 'Recepción, fijación, adquisición y embalaje de la evidencia',
    iconoName: 'FileText',
    color: 'text-cyan-400',
    glowColor: 'rgba(34,211,238,0.15)',
    stepIds: ETAPAS_FORENSES.filter(s => s.num >= 1 && s.num <= 4).map(s => s.id)
  },
  {
    id: 'f2',
    numero: 2,
    titulo: 'Peritaje',
    subtitulo: 'Recepción en laboratorio, procesamiento, análisis y derivaciones',
    iconoName: 'Database',
    color: 'text-emerald-400',
    glowColor: 'rgba(52,211,153,0.15)',
    stepIds: ETAPAS_FORENSES.filter(s => s.num >= 5 && s.num <= 7).map(s => s.id)
  },
  {
    id: 'f3',
    numero: 3,
    titulo: 'Dictamen & Cierre',
    subtitulo: 'Elaboración del dictamen pericial oficial y remisión a resguardo',
    iconoName: 'Lock',
    color: 'text-yellow-400',
    glowColor: 'rgba(250,204,21,0.15)',
    stepIds: ETAPAS_FORENSES.filter(s => s.num >= 8 && s.num <= 9).map(s => s.id)
  }
];

const stepsData: Step[] = ETAPAS_FORENSES;

// ─────────────────────────────────────────────────────────────────────────────
// SUBCOMPONENTES
// ─────────────────────────────────────────────────────────────────────────────

function BadgeNormativa({ tag }: { tag: NormativaTag }) {
  const colors: Record<NormativaTag['color'], string> = {
    cyan:   'bg-cyan-500/10 border-cyan-500/25 text-cyan-400',
    green:  'bg-green-500/10 border-green-500/25 text-green-400',
    yellow: 'bg-yellow-500/10 border-yellow-500/25 text-yellow-400',
    red:    'bg-red-500/10 border-red-500/25 text-red-400',
    purple: 'bg-purple-500/10 border-purple-500/25 text-purple-400',
  };
  return (
    <span className={`inline-flex items-center text-[8px] font-black GTM-badge uppercase tracking-[0.15em] px-2 py-0.5 rounded border ${colors[tag.color]}`}>
      {tag.label}
    </span>
  );
}

function AlertaForense({ adv }: { adv: Advertencia }) {
  const alertConfigs: Record<string, { wrapper: string; icon: string; titulo: string; cuerpo: string; Icon: any }> = {
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
  const cfg = alertConfigs[adv.nivel] || alertConfigs.info;

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

function TarjetaPaso({
  step,
  completado,
  meta,
  onToggle,
  onMetadataChange,
}: {
  step: Step;
  completado: boolean;
  meta: any;
  onToggle: (id: string) => void;
  onMetadataChange: (stepId: string, field: 'fecha' | 'responsable' | 'observaciones', value: string) => void;
}) {
  const [expandido, setExpandido] = useState(false);
  const Icon = iconMap[step.iconoName] || Shield;

  return (
    <div
      className={`rounded-xl border transition-all duration-300 overflow-hidden ${
        completado
          ? 'border-green-500/20 bg-green-500/[0.03]'
          : expandido
          ? 'border-white/10 bg-white/[0.02]'
          : 'border-white/[0.05] bg-white/[0.01] hover:bg-white/[0.02]'
      }`}
    >
      {/* Cabecera del paso */}
      <button
        className="w-full flex items-center gap-4 px-5 py-4 text-left group"
        onClick={() => setExpandido(v => !v)}
      >
        {/* Número */}
        <span className="text-[10px] font-black text-white/20 font-mono shrink-0 w-8 tabular-nums">
          {step.num.toString().padStart(2, '0')}
        </span>
        {/* Ícono */}
        <div className={`p-2 rounded-lg shrink-0 transition-all ${
          completado ? 'bg-green-500/15' : 'bg-white/[0.04] group-hover:bg-white/[0.07]'
        }`}>
          <Icon size={14} className={completado ? 'text-green-400' : 'text-white/30'} />
        </div>
        {/* Título */}
        <span className={`flex-1 text-[11px] font-black uppercase tracking-wide ${
          completado ? 'text-green-400/80' : 'text-white/60 group-hover:text-white/80'
        }`}>
          {step.title}
        </span>
        
        {/* Badges de normativa (cuando colapsado) */}
        {!expandido && step.normativas && (
          <div className="hidden sm:flex items-center gap-1.5 flex-wrap">
            {step.normativas.slice(0, 2).map(n => (
              <BadgeNormativa key={n.label} tag={n} />
            ))}
          </div>
        )}
        
        {/* Status Badge */}
        <span className={`timeline-status-badge ${completado ? 'completed' : 'pending'}`}>
          {completado ? 'Completado' : 'Pendiente'}
        </span>

        {/* Chevron */}
        {expandido
          ? <ChevronUp size={14} className="text-white/25 shrink-0" />
          : <ChevronDown size={14} className="text-white/20 shrink-0" />}
      </button>

      {/* Contenido expandido */}
      {expandido && (
        <div className="px-5 pb-5 space-y-4 animate-fade-in text-xs text-white/70">
          {/* Descripción / Acción */}
          <div className="border-l-2 border-white/10 pl-4 space-y-1">
            <span className="text-[10px] text-fluent-accent font-bold uppercase tracking-wider block">Acción Principal</span>
            <p className="text-white/80 font-medium">{step.action}</p>
          </div>

          {/* Documentos Relacionados */}
          {step.docs.length > 0 && (
            <div>
              <span className="text-[9px] font-black text-white/30 uppercase tracking-widest block mb-1.5">Documentos Asoc.</span>
              <div className="flex flex-wrap gap-2">
                {step.docs.map((doc, idx) => (
                  <span key={idx} className="bg-white/5 border border-white/10 rounded-full px-2.5 py-0.5 text-[9px] text-white/60 uppercase tracking-wider font-semibold">
                    📄 {doc}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Guía Técnica */}
          <div className="timeline-guide-panel">
            <h4 className="text-[9px] font-bold text-fluent-accent uppercase tracking-wider mb-2">Fundamento e Instrucciones de Llenado</h4>
            <p className="text-xs text-white/70 leading-relaxed mb-3">{step.guide}</p>
            
            <h4 className="text-[9px] font-bold text-white uppercase tracking-wider mb-2">Checklist Técnico Detallado:</h4>
            <ul className="space-y-1.5 text-xs text-white/80">
              {step.tasks.map((task, tIdx) => (
                <li key={tIdx} className="flex items-start gap-2">
                  <span className="text-fluent-accent">•</span>
                  <span>{task}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bloques de código */}
          {step.codigo?.map((c, i) => (
            <BloqueCode key={i} lang={c.lang} contenido={c.contenido} />
          ))}

          {/* Normativas completas */}
          {step.normativas && (
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="text-[9px] font-black text-white/15 uppercase tracking-widest mr-1">
                Base legal:
              </span>
              {step.normativas.map(n => (
                <BadgeNormativa key={n.label} tag={n} />
              ))}
            </div>
          )}

          {/* Advertencias */}
          {step.advertencias?.map((adv, i) => (
            <AlertaForense key={i} adv={adv} />
          ))}

          {/* Interactive Metadata Block */}
          {completado && (
            <div className="timeline-meta-box !mt-4 !p-4 !bg-black/40 !border !border-white/5 !rounded-lg grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="timeline-input-group">
                <label className="timeline-input-label flex items-center gap-1.5">
                  <Calendar size={11} className="text-fluent-accent" />
                  <span>Fecha y Hora de Cierre</span>
                </label>
                <input 
                  type="datetime-local" 
                  className="timeline-input" 
                  value={meta.fecha || ''}
                  onChange={(e) => onMetadataChange(step.id, 'fecha', e.target.value)}
                />
              </div>

              <div className="timeline-input-group">
                <label className="timeline-input-label flex items-center gap-1.5">
                  <User size={11} className="text-fluent-accent" />
                  <span>Funcionario / Perito</span>
                </label>
                <input 
                  type="text" 
                  className="timeline-input" 
                  placeholder="Nombre del Perito Responsable"
                  value={meta.responsable || ''}
                  onChange={(e) => onMetadataChange(step.id, 'responsable', e.target.value)}
                />
              </div>

              <div className="timeline-input-group md:col-span-2">
                <label className="timeline-input-label flex items-center gap-1.5">
                  <span>Observaciones de la Trazabilidad / Firma / Precintos</span>
                </label>
                <input 
                  type="text" 
                  className="timeline-input" 
                  placeholder="Ej: Sin incidencias, precinto #10293 verificado"
                  value={meta.observaciones || ''}
                  onChange={(e) => onMetadataChange(step.id, 'observaciones', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-3 border-t border-white/[0.05] flex items-center justify-between">
            <span className="text-[10px] text-white/30 italic">
              {completado ? '✓ Guardado localmente' : 'Marque el hito al finalizar su ejecución'}
            </span>
            <button
              onClick={e => { e.stopPropagation(); onToggle(step.id); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all duration-200 ${
                completado
                  ? 'bg-green-500/15 border border-green-500/25 text-green-400 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400'
                  : 'bg-white/[0.04] border border-white/[0.08] text-white/35 hover:bg-green-500/10 hover:border-green-500/20 hover:text-green-400'
              }`}
            >
              {completado ? (
                <>
                  <CheckCircle2 size={12} />
                  <span>Desmarcar Hito</span>
                </>
              ) : (
                <>
                  <Circle size={12} />
                  <span>Marcar Completado</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StepperFase({
  fase,
  activa,
  completada,
  progreso,
  onClick,
}: {
  fase: Fase;
  activa: boolean;
  completada: boolean;
  progreso: number;
  onClick: () => void;
}) {
  const Icon = iconMap[fase.iconoName] || Shield;
  return (
    <button
      id={`stepper-fase-${fase.id}`}
      onClick={onClick}
      className={`flex flex-col items-center gap-2 group transition-all duration-200 min-w-0 flex-1`}
    >
      {/* Círculo con ícono */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 shrink-0 ${
          completada
            ? 'border-green-500 bg-green-500/15 shadow-[0_0_12px_rgba(34,197,94,0.25)]'
            : activa
            ? `border-current ${fase.color} bg-white/[0.05] shadow-[0_0_12px_var(--glow)]`
            : 'border-white/10 bg-white/[0.03]'
        }`}
        style={activa ? { '--glow': fase.glowColor } as React.CSSProperties : undefined}
      >
        {completada
          ? <CheckCircle2 size={16} className="text-green-400" />
          : <Icon size={16} className={activa ? fase.color : 'text-white/20'} />}
      </div>
      {/* Título de Fase */}
      <div className="text-center px-1">
        <p className={`text-[8px] font-black uppercase tracking-[0.15em] ${
          completada ? 'text-green-400' : activa ? fase.color : 'text-white/20'
        }`}>
          Fase {fase.numero}
        </p>
        <p className={`text-[9px] font-bold leading-tight hidden sm:block ${
          completada ? 'text-white/60' : activa ? 'text-white/70' : 'text-white/20'
        }`}>
          {fase.titulo}
        </p>
      </div>
      {/* Mini barra de progreso */}
      <div className="w-full h-0.5 bg-white/[0.05] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            completada ? 'bg-green-500' : activa ? 'bg-current' : 'bg-transparent'
          }`}
          style={{
            width: `${progreso}%`,
            color: activa ? fase.color.replace('text-', '') : undefined,
            background: completada ? undefined : activa
              ? fase.color.includes('cyan') ? '#22d3ee'
              : fase.color.includes('emerald') ? '#34d399'
              : fase.color.includes('yellow') ? '#facc15'
              : undefined
              : undefined,
          }}
        />
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────

const SeguimientoPage = () => {
  const { 
    casoActual, 
    dispositivoActual, 
    completedSteps, 
    stepMetadata, 
    setStepCompleted, 
    setStepMetadata, 
    loadCompletedSteps 
  } = useForenseStore();

  const [activeFase, setActiveFase] = useState('f1');
  const [filterMode, setFilterMode] = useState<'all' | 'completed'>('all');

  useEffect(() => {
    window.scrollTo(0, 0);
    loadCompletedSteps();
  }, [loadCompletedSteps]);

  // Cálculos de progreso global
  const totalSteps = stepsData.length;
  const completedCount = Object.keys(completedSteps).filter(key => completedSteps[key]).length;
  const progressPercentage = Math.round((completedCount / totalSteps) * 100);

  // Progreso por fase
  const progresoPorFase = useCallback((fase: Fase) => {
    const totalFase = fase.stepIds.length;
    const completedFase = fase.stepIds.filter(id => !!completedSteps[id]).length;
    return Math.round((completedFase / totalFase) * 100);
  }, [completedSteps]);

  const faseCompletada = useCallback((fase: Fase) => progresoPorFase(fase) === 100, [progresoPorFase]);

  const handleToggleStep = useCallback((stepId: string) => {
    setStepCompleted(stepId, !completedSteps[stepId]);
  }, [completedSteps, setStepCompleted]);

  const handleMetadataChange = useCallback((stepId: string, field: 'fecha' | 'responsable' | 'observaciones', value: string) => {
    setStepMetadata(stepId, { [field]: value });
  }, [setStepMetadata]);

  // Filtrar pasos según la fase activa para renderizado de pantalla
  const faseActualObj = FASES.find(f => f.id === activeFase) || FASES[0];
  const stepsDeFaseActiva = stepsData.filter(step => faseActualObj.stepIds.includes(step.id));

  return (
    <div className="planilla-container">
      <div className="app-container">
        
        {/* Floating Print Button */}
        <button 
          className="floating-print-btn no-print" 
          onClick={() => window.print()}
          title="Imprimir Timeline y Acta de Seguimiento"
        >
          <Printer size={16} />
          <span>Imprimir Protocolo</span>
        </button>

        {/* Main Content Area */}
        <main className="w-full flex-1 max-w-[900px] mx-auto p-4 sm:p-8 space-y-6">
          
          {/* Timeline Dashboard (no-print) */}
          <div className="timeline-header-card no-print">
            <div className="phase-badge">LEXCODE FORENSICS</div>
            <h1>Seguimiento Cronológico de Cadena de Custodia</h1>
            
            {/* Active Case Context */}
            {casoActual ? (
              <div className="forensic-card p-4 bg-white/[0.02] border border-white/5 rounded-lg mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-white/40 block uppercase tracking-wider font-bold text-[9px]">Expediente / Caso</span>
                  <span className="text-white font-bold text-sm">{casoActual.numeroCaso}</span>
                </div>
                <div>
                  <span className="text-white/40 block uppercase tracking-wider font-bold text-[9px]">Responsable Principal</span>
                  <span className="text-white font-bold text-sm">{casoActual.fiscal}</span>
                </div>
                <div>
                  <span className="text-white/40 block uppercase tracking-wider font-bold text-[9px]">Evidencia Asociada</span>
                  <span className="text-white font-bold text-sm">
                    {dispositivoActual ? `${dispositivoActual.marca} ${dispositivoActual.modelo}` : 'Dispositivo Android'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-lg text-xs mt-4 flex items-center gap-2">
                <Info size={16} />
                <span>No hay un caso activo seleccionado. Completando plantilla del protocolo general.</span>
              </div>
            )}

            {/* Stepper Progress Bar */}
            <div className="timeline-progress-container mt-6">
              <div className="flex justify-between items-center text-xs">
                <span className="timeline-progress-text uppercase tracking-wider">Progreso de la Experticia</span>
                <span className="text-fluent-accent font-bold">{completedCount} de {totalSteps} Pasos ({progressPercentage}%)</span>
              </div>
              <div className="timeline-progress-bar">
                <div className="timeline-progress-fill" style={{ width: `${progressPercentage}%` }}></div>
              </div>
            </div>
          </div>

          {/* Stepper de Fases (no-print) */}
          <div className="fluent-mica rounded-xl border border-white/5 p-4 sm:p-5 no-print">
            <div className="flex items-center gap-2 sm:gap-3">
              {FASES.map((fase, idx) => (
                <div key={fase.id} className="flex items-center flex-1 min-w-0">
                  <StepperFase
                    fase={fase}
                    activa={activeFase === fase.id}
                    completada={faseCompletada(fase)}
                    progreso={progresoPorFase(fase)}
                    onClick={() => setActiveFase(fase.id)}
                  />
                  {idx < FASES.length - 1 && (
                    <div className={`hidden sm:block h-px flex-1 mx-1 ${
                      faseCompletada(fase) ? 'bg-green-500/30' : 'bg-white/[0.05]'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Detalle de Fase Activa (no-print) */}
          <div className="fluent-mica rounded-xl border border-white/5 p-5 sm:p-6 mb-4 relative overflow-hidden no-print">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(ellipse at top left, ${faseActualObj.glowColor}, transparent 60%)` }}
            />
            <div className="relative flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-[6px] bg-white/[0.04] border border-white/[0.08] shrink-0">
                  {(() => {
                    const IconComp = iconMap[faseActualObj.iconoName] || Shield;
                    return <IconComp size={22} className={faseActualObj.color} />;
                  })()}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${faseActualObj.color}`}>
                      Fase {faseActualObj.numero}
                    </span>
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded border ${
                      faseCompletada(faseActualObj)
                        ? 'border-green-500/25 bg-green-500/10 text-green-400'
                        : 'border-white/[0.07] bg-white/[0.03] text-white/25'
                    } uppercase tracking-wider`}>
                      {faseCompletada(faseActualObj)
                        ? '✓ Completada'
                        : `${progresoPorFase(faseActualObj)}% completado`}
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
                    {faseActualObj.titulo}
                  </h2>
                  <p className="text-[10px] text-white/35 font-medium mt-1">{faseActualObj.subtitulo}</p>
                </div>
              </div>

              {/* Fase Navigation */}
              <div className="shrink-0 flex gap-2">
                <button
                  onClick={() => {
                    const idx = FASES.findIndex(f => f.id === activeFase);
                    if (idx > 0) setActiveFase(FASES[idx - 1].id);
                  }}
                  disabled={activeFase === 'f1'}
                  className="text-[9px] font-black px-3 py-2 rounded-lg border border-white/[0.07] bg-white/[0.02] text-white/30 hover:text-white/60 hover:bg-white/[0.05] transition-all disabled:opacity-20 disabled:cursor-not-allowed uppercase tracking-wider"
                >
                  ← Anterior
                </button>
                <button
                  onClick={() => {
                    const idx = FASES.findIndex(f => f.id === activeFase);
                    if (idx < FASES.length - 1) setActiveFase(FASES[idx + 1].id);
                  }}
                  disabled={activeFase === 'f3'}
                  className={`text-[9px] font-black px-3 py-2 rounded-lg border transition-all disabled:opacity-20 disabled:cursor-not-allowed uppercase tracking-wider ${
                    activeFase !== 'f3'
                      ? `border-${faseActualObj.color.split('-')[1]}-500/20 bg-${faseActualObj.color.split('-')[1]}-500/[0.06] ${faseActualObj.color} hover:opacity-80`
                      : 'border-white/[0.07] bg-white/[0.02] text-white/30'
                  }`}
                >
                  Siguiente →
                </button>
              </div>
            </div>
          </div>

          {/* Interactive controls (no-print) */}
          <div className="timeline-controls no-print">
            <span className="text-[10px] text-white/50">Organice la visualización para la impresión del acta:</span>
            <div className="flex gap-2">
              <button 
                onClick={() => setFilterMode('all')} 
                className={`timeline-filter-btn ${filterMode === 'all' ? 'active' : ''}`}
              >
                Ver Todo
              </button>
              <button 
                onClick={() => setFilterMode('completed')} 
                className={`timeline-filter-btn ${filterMode === 'completed' ? 'active' : ''}`}
              >
                Solo Hitos Completados
              </button>
            </div>
          </div>

          {/* List of Steps for Active Phase (no-print) */}
          <div className="space-y-3 no-print">
            {stepsDeFaseActiva.map((step) => (
              <TarjetaPaso
                key={step.id}
                step={step}
                completado={!!completedSteps[step.id]}
                meta={stepMetadata[step.id] || {}}
                onToggle={handleToggleStep}
                onMetadataChange={handleMetadataChange}
              />
            ))}
          </div>

          {/* CTA Next Phase (no-print) */}
          {faseCompletada(faseActualObj) && activeFase !== 'f3' && (
            <div className="mt-5 p-5 rounded-xl border border-green-500/20 bg-green-500/[0.04] flex items-center justify-between gap-4 animate-fade-in no-print">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={20} className="text-green-400 shrink-0" />
                <div>
                  <p className="text-sm font-black text-green-400 uppercase tracking-wide">
                    Fase {faseActualObj.numero} completada
                  </p>
                  <p className="text-[10px] text-green-400/60">
                    Continúe con la siguiente fase del protocolo forense
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  const idx = FASES.findIndex(f => f.id === activeFase);
                  if (idx < FASES.length - 1) setActiveFase(FASES[idx + 1].id);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-500/15 border border-green-500/30 text-green-400 text-[10px] font-black uppercase tracking-wider hover:bg-green-500/25 transition-all shrink-0"
              >
                Siguiente fase <TrendingUp size={12} />
              </button>
            </div>
          )}

          {/* Mensaje final - Protocolo Completo (no-print) */}
          {activeFase === 'f3' && faseCompletada(faseActualObj) && (
            <div className="mt-5 p-6 rounded-xl border border-cyan-500/20 bg-cyan-500/[0.04] text-center animate-fade-in relative overflow-hidden no-print">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.05] to-transparent pointer-events-none" />
              <div className="relative">
                <CheckCircle2 size={40} className="text-green-400 mx-auto mb-3" />
                <h3 className="text-base font-black text-white uppercase tracking-tight mb-2">
                  Protocolo Forense Completado
                </h3>
                <p className="text-[11px] text-white/40 leading-relaxed max-w-2xl mx-auto mb-4">
                  Ha completado las fases del protocolo de seguimiento cronológico forense
                  conforme al Art. 187 y 225 del COPP, la Ley sobre Mensajes de Datos y Firmas Electrónicas,
                  y el Manual Único de Cadena de Custodia de Venezuela. La evidencia digital está blindada.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['COPP ✓', 'MUCCEF ✓', 'LMDyFE ✓', 'ISO 27037 ✓', 'SHA-256 ✓'].map(t => (
                    <span key={t} className="text-[9px] px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 font-black uppercase tracking-wider">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
             Print Timeline Layout (Visible ONLY on print)
             ========================================== */}
          <div className="timeline-print-layout">
            <div className="text-center mb-6">
              <h2 className="text-[12px] font-bold text-black uppercase tracking-widest">República Bolivariana de Venezuela</h2>
              <h3 className="text-[13px] font-extrabold text-black uppercase mt-1">Acta de Control Cronológico y Timeline Forense</h3>
              <p className="text-[8px] text-black/75 uppercase tracking-wider mt-0.5">
                Conforme al Art. 187 del Código Orgánico Procesal Penal y Art. 4 y 7 de la Ley sobre Mensajes de Datos y Firmas Electrónicas
              </p>
            </div>

            {/* Print metadata info */}
            <div className="grid grid-cols-2 gap-4 border border-black p-4 text-[10px] mb-6">
              <div>
                <p><strong>Nro. Expediente / Caso:</strong> {casoActual?.numeroCaso || '_________________________'}</p>
                <p><strong>Fiscalía Interviniente:</strong> {casoActual?.fiscal || '_________________________'}</p>
                <p><strong>Fecha Impresión Timeline:</strong> {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
              </div>
              <div>
                <p><strong>Evidencia:</strong> {dispositivoActual ? `${dispositivoActual.marca} ${dispositivoActual.modelo}` : 'Dispositivo Móvil Android'}</p>
                <p><strong>IMEI principal:</strong> {dispositivoActual?.imei || '_________________________'}</p>
                <p><strong>Estado General:</strong> {completedCount} de {totalSteps} pasos cumplidos ({progressPercentage}%)</p>
              </div>
            </div>

            <div className="timeline-print-title">Registro de Hitos Cronológicos y Custodia</div>

            <table className="timeline-print-table">
              <thead>
                <tr>
                  <th style={{ width: '8%' }}>Paso</th>
                  <th style={{ width: '32%' }}>Hito Forense / Descripción</th>
                  <th style={{ width: '18%' }}>Fecha y Hora</th>
                  <th style={{ width: '22%' }}>Funcionario / Perito</th>
                  <th style={{ width: '20%' }}>Observaciones / Precintos</th>
                </tr>
              </thead>
              <tbody>
                {stepsData.map((step) => {
                  const isCompleted = !!completedSteps[step.id];
                  const meta = stepMetadata[step.id] || {};
                  
                  // Si estamos en filtro "solo completados" en la vista y el paso está pendiente, no lo imprimimos
                  if (filterMode === 'completed' && !isCompleted) return null;

                  return (
                    <tr key={step.id} className={isCompleted ? '' : 'pending-row'}>
                      <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{step.num}</td>
                      <td>
                        <strong>{step.title}</strong>
                        <p style={{ margin: '2px 0 0 0', fontSize: '8.5px', color: '#333' }}>{step.action}</p>
                      </td>
                      <td>
                        {isCompleted ? (
                          meta.fecha ? new Date(meta.fecha).toLocaleString() : 'Fecha no especificada'
                        ) : (
                          'PENDIENTE DE EJECUCIÓN'
                        )}
                      </td>
                      <td>
                        {isCompleted ? (
                          meta.responsable || 'No especificado'
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td>
                        {isCompleted ? (
                          meta.observaciones || 'Registrado conforme'
                        ) : (
                          'N/A'
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Signature Block for Timeline Print */}
            <div className="grid grid-cols-2 gap-20 mt-16 text-center">
              <div style={{ borderTop: '1px solid black', paddingTop: '5px' }}>
                <p style={{ margin: 0, fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase' }}>Perito Forense Responsable</p>
                <p style={{ margin: '2px 0 0 0', fontSize: '8px', color: '#555' }}>Firma y Sello del Laboratorio</p>
              </div>
              <div style={{ borderTop: '1px solid black', paddingTop: '5px' }}>
                <p style={{ margin: 0, fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase' }}>Funcionario Receptor / Testigo</p>
                <p style={{ margin: '2px 0 0 0', fontSize: '8px', color: '#555' }}>Firma Autorizada</p>
              </div>
            </div>

            <div className="text-center text-[7px] text-gray-500 mt-16">
              SHA256.US Forensic Laboratory | Sello de Seguridad Digital | Inalterabilidad y Cero Riesgo de Nulidad
            </div>
          </div>

          {/* Footer info (no-print) */}
          <div className="footer-info no-print">
            SHA256 Forensic Laboratory | Protocolo MUCCEF 2017 | Ley sobre Mensajes de Datos y Firmas Electrónicas
          </div>
        </main>
      </div>
    </div>
  );
};

export default SeguimientoPage;
