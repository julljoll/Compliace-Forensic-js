import { useState, useEffect } from 'react';
import { useForenseStore } from '../../store/forenseStore';
import { Printer, CheckCircle, Info, Calendar, User, Eye, EyeOff } from 'lucide-react';
import './Planillas.css';

interface Step {
  id: string;
  num: number;
  phase: string;
  title: string;
  action: string;
  docs: string[];
  guide: string;
  tasks: string[];
}

const stepsData: Step[] = [
  {
    id: 'step1',
    num: 1,
    phase: 'Fase 1: Obtención',
    title: 'Recepción, Entrevista y Consignación',
    action: 'Recibir el dispositivo y levantar actas preliminares.',
    docs: ['Acta de Entrevista', 'Acta de Obtención por Consignación'],
    guide: 'Deben redactarse en tercera persona, tiempo presente, de manera clara, secuencial y precisa. Indicar circunstancias de modo, tiempo y lugar. Firmadas por el consignatario y funcionario receptor (MUCCEF 2017).',
    tasks: [
      'Realiza una entrevista estructurada (preguntas básicas, intermedias y finales) a quien entrega el equipo.',
      'Levanta el Acta de Entrevista para dejar constancia de cómo obtuvo los chats/audios.',
      'Levanta el Acta de Obtención por Consignación recibiendo formalmente la evidencia.'
    ]
  },
  {
    id: 'step2',
    num: 2,
    phase: 'Fase 1: Obtención',
    title: 'Fijación In Situ y Aislamiento',
    action: 'Fijar fotográficamente el dispositivo en vivo y aislarlo de la red.',
    docs: ['Fijación fotográfica (Reseñada en Acta de Obtención)'],
    guide: 'En el Acta de Obtención se debe describir minuciosamente el dispositivo: marca, modelo, IMEI, SIMCard, estado físico general y estado de la pantalla (apagada/encendida).',
    tasks: [
      'Fija fotográficamente la pantalla mostrando la actividad "sin intervenir en su funcionalidad" (no tocar botones).',
      'Aísla el equipo poniéndolo en Modo Avión o usando Bolsa de Faraday para evitar borrado remoto e interferencia de red.',
      'Documenta de manera exacta los datos individualizantes del móvil.'
    ]
  },
  {
    id: 'step3',
    num: 3,
    phase: 'Fase 1: Obtención',
    title: 'Adquisición Digital Forense',
    action: 'Extracción física/lógica y sellado hash.',
    docs: ['Documentación de Extracción para el Dictamen'],
    guide: 'Anotar las versiones exactas del software (Andriller) y los algoritmos Hash utilizados (SHA-256) garantizando la inalterabilidad desde la recolección.',
    tasks: [
      'Conecta el dispositivo asegurando inalterabilidad (mediante bloqueadores de escritura/aislamiento).',
      'Ejecuta "Andriller" para realizar una adquisición de solo lectura, no destructiva.',
      'Calcula inmediatamente el Hash (SHA-256) de la imagen extraída para sellar la integridad de la data.'
    ]
  },
  {
    id: 'step4',
    num: 4,
    phase: 'Fase 1: Obtención',
    title: 'Apertura de Cadena de Custodia, Embalaje y Rotulado',
    action: 'Ingresar la evidencia matriz al sistema de protección.',
    docs: ['Planilla de Registro de Cadena de Custodia (PRCC)', 'Rótulo de Evidencia'],
    guide: 'PRCC: Utilizar tinta negra/azul, letra de molde, firma manuscrita e impresión dactilar del pulgar derecho. RÓTULO: Tinta indeleble. Incluir Oficina, Expediente, PRCC, descripción detallada y observaciones.',
    tasks: [
      'Abre la PRCC y completa la Fase de Obtención con los datos técnicos del móvil.',
      'Embala el dispositivo usando bolsa antiestática o papel sellado y coloca precintos de seguridad físicos autoadhesivos.',
      'Fija el Rótulo con la información correspondiente de forma visible sobre el embalaje.'
    ]
  },
  {
    id: 'step5',
    num: 5,
    phase: 'Fase 2: Peritaje',
    title: 'Recepción en Laboratorio, Verificación y Designación',
    action: 'Ingreso al laboratorio forense y asignación de perito.',
    docs: ['PRCC (Renglón Transferencia: Recibe)', 'Libro de Registro Interno de Laboratorio'],
    guide: 'PRCC: Firma y pulgar derecho tras verificar minuciosamente que los precintos no muestren signos de alteración. LIBRO: Libro foliado y sellado, asentar fecha, hora y datos del perito que acepta el caso.',
    tasks: [
      'Comprueba la integridad física del embalaje y correspondencia de rótulos.',
      'Recalcula el Hash de la copia de trabajo y compáralo con el de la extracción original (Art. 7 LMDyFE).',
      'El perito firma los controles internos y asienta la designación formal de la experticia.'
    ]
  },
  {
    id: 'step6',
    num: 6,
    phase: 'Fase 2: Peritaje',
    title: 'Procesamiento Estructurado con ALEAPP',
    action: 'Parsear logs y bases de datos SQLite.',
    docs: ['Logs y Reportes de salida de ALEAPP'],
    guide: 'Garantizar que el reporte de salida liste nombres nativos de bases de datos, marcas de tiempo Unix convertidas a UTC, rutas lógicas y Hashes de archivos exportados (ISO 27042).',
    tasks: [
      'Carga la imagen forense previamente adquirida en el software ALEAPP.',
      'Procesa msgstore.db (WhatsApp), archivos de audios (.opus), registros de llamadas y screenshots correspondientes.',
      'Reconstruye el Timeline cronológico consolidado de la mensajería.'
    ]
  },
  {
    id: 'step7',
    num: 7,
    phase: 'Fase 2: Peritaje',
    title: 'Obtención por Derivación (Nueva Evidencia)',
    action: 'Aislar chats, audios o archivos clave detectados.',
    docs: ['NUEVA PRCC (Para data derivada)', 'Acta de Obtención por Derivación'],
    guide: 'NUEVA PRCC: Propio número correlativo, tinta negra/azul, firma y huella. ACTA: Indicar la ruta específica de aislamiento desde la evidencia digital original (evitando contaminación).',
    tasks: [
      'Aísla las transcripciones, imágenes y audios relevantes detectados durante el análisis.',
      'Genera el Acta de Obtención por Derivación detallando la correspondencia del Hash de los nuevos archivos.',
      'Abre la nueva PRCC describiendo los archivos y sus hashes individuales.'
    ]
  },
  {
    id: 'step8',
    num: 8,
    phase: 'Fase 3: Dictamen & Cierre',
    title: 'Elaboración del Dictamen Pericial',
    action: 'Estructuración y blindaje legal de los resultados.',
    docs: ['Dictamen Pericial Oficial'],
    guide: 'Estructura formal: Motivo de la experticia, Descripción del material recibido, Exámenes aplicados, Resultados, Conclusiones y Anexos. Firmado por los peritos designados (Art. 223/224 COPP).',
    tasks: [
      'Redacta los resultados periciales incluyendo una tabla con: Nombre de archivo, fecha de mensaje, ruta, tamaño y Hash SHA-256.',
      'Fundamenta jurídicamente la inalterabilidad conforme a la Ley sobre Mensajes de Datos (Art. 4, 7 y 8).',
      'Declara formalmente que la evidencia original no fue consumida ni alterada durante la fase de laboratorio.'
    ]
  },
  {
    id: 'step9',
    num: 9,
    phase: 'Fase 3: Dictamen & Cierre',
    title: 'Re-embalaje y Remisión a Resguardo',
    action: 'Preparar el dispositivo y la data para su salida oficial.',
    docs: ['PRCC (Renglón Transferencia: Entrega)', 'Oficio de Remisión'],
    guide: 'Renglón "Entrega" en PRCC, indicando el motivo: "Traslado a Resguardo" o "Devolución a Despacho Fiscal". Firma y huella dactilar del perito remitente.',
    tasks: [
      'Coloca el dispositivo móvil en su embalaje de seguridad original o uno nuevo si el original fue degradado.',
      'Aplica nuevos precintos de seguridad oficiales del laboratorio y rotula adecuadamente.',
      'Remite formalmente el dispositivo y la copia digital firmada a la oficina de Resguardo Judicial o despacho fiscal.'
    ]
  }
];

const SeguimientoPage = () => {
  const { casoActual, dispositivoActual, completedSteps, stepMetadata, setStepCompleted, setStepMetadata, loadCompletedSteps } = useForenseStore();
  const [activeStep, setActiveStep] = useState('step1');
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({});
  const [filterMode, setFilterMode] = useState<'all' | 'completed'>('all');

  useEffect(() => {
    window.scrollTo(0, 0);
    loadCompletedSteps();
  }, [loadCompletedSteps]);

  // Observer para detectar paso activo en pantalla
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveStep(entry.target.id);
          }
        });
      },
      { threshold: 0.2, rootMargin: '-10% 0px -70% 0px' }
    );

    const sections = document.querySelectorAll('.timeline-item');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const totalSteps = stepsData.length;
  const completedCount = Object.keys(completedSteps).filter(key => completedSteps[key]).length;
  const progressPercentage = Math.round((completedCount / totalSteps) * 100);

  const getNavItemClass = (stepId: string) => {
    let classes = 'nav-item';
    if (activeStep === stepId) classes += ' active';
    if (completedSteps[stepId]) classes += ' completed';
    return classes;
  };

  const handleToggleStep = (stepId: string) => {
    setStepCompleted(stepId, !completedSteps[stepId]);
  };

  const toggleExpand = (stepId: string) => {
    setExpandedSteps(prev => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  const handleMetadataChange = (stepId: string, field: 'fecha' | 'responsable' | 'observaciones', value: string) => {
    setStepMetadata(stepId, { [field]: value });
  };

  const visibleSteps = stepsData.filter(step => {
    if (filterMode === 'completed') {
      return !!completedSteps[step.id];
    }
    return true;
  });

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

        {/* Sidebar no-print */}
        <aside className="no-print">
          <div className="logo">
            <span className="logo-text">SHA256.US</span>
            <span className="logo-subtext">Seguimiento Forense</span>
          </div>

          <div className="nav-section">
            <span className="nav-title">Fase 1: Obtención</span>
            <a href="#step1" className={getNavItemClass('step1')} id="nav-step1">
              <span className="step-num">1</span> <span>Recepción</span>
            </a>
            <a href="#step2" className={getNavItemClass('step2')} id="nav-step2">
              <span className="step-num">2</span> <span>Fijación In Situ</span>
            </a>
            <a href="#step3" className={getNavItemClass('step3')} id="nav-step3">
              <span className="step-num">3</span> <span>Adquisición</span>
            </a>
            <a href="#step4" className={getNavItemClass('step4')} id="nav-step4">
              <span className="step-num">4</span> <span>PRCC & Embalaje</span>
            </a>
          </div>

          <div className="nav-section">
            <span className="nav-title">Fase 2: Peritaje</span>
            <a href="#step5" className={getNavItemClass('step5')} id="nav-step5">
              <span className="step-num">5</span> <span>Recepción Lab</span>
            </a>
            <a href="#step6" className={getNavItemClass('step6')} id="nav-step6">
              <span className="step-num">6</span> <span>Procesamiento</span>
            </a>
            <a href="#step7" className={getNavItemClass('step7')} id="nav-step7">
              <span className="step-num">7</span> <span>Derivación</span>
            </a>
          </div>

          <div className="nav-section">
            <span className="nav-title">Fase 3: Dictamen & Cierre</span>
            <a href="#step8" className={getNavItemClass('step8')} id="nav-step8">
              <span className="step-num">8</span> <span>Elaboración Dictamen</span>
            </a>
            <a href="#step9" className={getNavItemClass('step9')} id="nav-step9">
              <span className="step-num">9</span> <span>Remisión</span>
            </a>
          </div>
        </aside>

        {/* Main Content Area */}
        <main>
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

          {/* Interactive controls (no-print) */}
          <div className="timeline-controls no-print">
            <span className="text-xs text-white/50">Organice la visualización para la impresión del acta:</span>
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

          {/* Interactive Steps List (no-print) */}
          <div className="timeline-wrapper no-print">
            {visibleSteps.map((step) => {
              const isCompleted = !!completedSteps[step.id];
              const isActive = activeStep === step.id;
              const isExpanded = !!expandedSteps[step.id];
              const meta = stepMetadata[step.id] || {};

              return (
                <div key={step.id} id={step.id} className="timeline-item">
                  {/* Timeline Visual Node */}
                  <div className={`timeline-step-node ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                    {isCompleted ? '✓' : step.num}
                  </div>

                  {/* Card Container */}
                  <div className={`timeline-item-card ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                    {/* Header */}
                    <div className="timeline-item-header">
                      <div>
                        <span className="text-[10px] text-fluent-accent font-bold uppercase tracking-wider block mb-1">
                          {step.phase}
                        </span>
                        <h3 className="timeline-step-title">{step.num}. {step.title}</h3>
                      </div>
                      <span className={`timeline-status-badge ${isCompleted ? 'completed' : 'pending'}`}>
                        {isCompleted ? 'Completado' : 'Pendiente'}
                      </span>
                    </div>

                    {/* Quick description */}
                    <div className="timeline-item-body">
                      <p className="text-white/80 font-medium">{step.action}</p>
                      
                      {/* Document Tags */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {step.docs.map((doc, idx) => (
                          <span key={idx} className="bg-white/5 border border-white/10 rounded-full px-2.5 py-0.5 text-[10px] text-white/60 uppercase tracking-wider font-semibold">
                            📄 {doc}
                          </span>
                        ))}
                      </div>

                      {/* Expandable Technical Guide */}
                      <div className="mt-4">
                        <button 
                          className="timeline-details-btn" 
                          onClick={() => toggleExpand(step.id)}
                        >
                          {isExpanded ? (
                            <>
                              <EyeOff size={13} />
                              <span>Ocultar Guía Técnica</span>
                            </>
                          ) : (
                            <>
                              <Eye size={13} />
                              <span>Ver Fundamentos y Pasos de Llenado</span>
                            </>
                          )}
                        </button>

                        {isExpanded && (
                          <div className="timeline-guide-panel">
                            <h4 className="text-[10px] font-bold text-fluent-accent uppercase tracking-wider mb-2">Fundamento e Instrucciones de Llenado</h4>
                            <p className="text-xs text-white/70 leading-relaxed mb-3">{step.guide}</p>
                            
                            <h4 className="text-[10px] font-bold text-white uppercase tracking-wider mb-2">Checklist Técnico Detallado:</h4>
                            <ul className="space-y-1.5 text-xs text-white/80">
                              {step.tasks.map((task, tIdx) => (
                                <li key={tIdx} className="flex items-start gap-2">
                                  <span className="text-fluent-accent">•</span>
                                  <span>{task}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Interactive Metadata Block */}
                      {isCompleted && (
                        <div className="timeline-meta-box">
                          <div className="timeline-input-group">
                            <label className="timeline-input-label flex items-center gap-1">
                              <Calendar size={10} className="text-fluent-accent" />
                              <span>Fecha y Hora de Cierre</span>
                            </label>
                            <input 
                              type="datetime-local" 
                              className="timeline-input" 
                              value={meta.fecha || ''}
                              onChange={(e) => handleMetadataChange(step.id, 'fecha', e.target.value)}
                            />
                          </div>

                          <div className="timeline-input-group">
                            <label className="timeline-input-label flex items-center gap-1">
                              <User size={10} className="text-fluent-accent" />
                              <span>Funcionario / Perito</span>
                            </label>
                            <input 
                              type="text" 
                              className="timeline-input" 
                              placeholder="Nombre del Perito Responsable"
                              value={meta.responsable || ''}
                              onChange={(e) => handleMetadataChange(step.id, 'responsable', e.target.value)}
                            />
                          </div>

                          <div className="timeline-input-group md:col-span-2">
                            <label className="timeline-input-label">Observaciones de la Trazabilidad / Firma</label>
                            <input 
                              type="text" 
                              className="timeline-input" 
                              placeholder="Ej: Sin incidencias, precinto #10293 verificado"
                              value={meta.observaciones || ''}
                              onChange={(e) => handleMetadataChange(step.id, 'observaciones', e.target.value)}
                            />
                          </div>
                        </div>
                      )}

                      {/* Footer Actions */}
                      <div className="timeline-actions-footer">
                        <span className="text-[11px] text-white/30">
                          {isCompleted ? '✓ Guardado localmente' : 'Marque la tarea al finalizar su ejecución'}
                        </span>
                        <button
                          onClick={() => handleToggleStep(step.id)}
                          className={`timeline-toggle-btn ${isCompleted ? 'completed' : 'pending'}`}
                        >
                          {isCompleted ? (
                            <>
                              <CheckCircle size={13} />
                              <span>Desmarcar Hito</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle size={13} />
                              <span>Marcar Completado</span>
                            </>
                          )}
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>

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
