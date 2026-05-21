import { useState, useEffect, useRef } from 'react';
import { useCMSStore } from '../store/cmsStore';
import { indexedDBStorage } from '../db/indexedDB';
import {
  Mail, Shield, CheckCircle2, Circle, Clock, User,
  FileText, Printer, AlertTriangle,
  Hash, Fingerprint, Lock, Eye, Archive
} from 'lucide-react';

interface StepLog {
  stepId: string;
  completado: boolean;
  fecha?: string;
  responsable?: string;
  observaciones?: string;
}

interface ProcesoCorreo {
  id: string;
  casoId: string;
  remitente: string;
  destinatarios: string;
  asunto: string;
  fechaCorreo: string;
  messageId: string;
  casoRef: string;
  fechaInicio: string;
  fechaCierre?: string;
  finalizado: boolean;
  pasos: StepLog[];
}

const PASOS_FIJOS = [
  {
    id: 'p1',
    fase: 'Fase 1: Identificación y Preservación',
    titulo: 'Identificar el correo electrónico como fuente de evidencia',
    descripcion: 'Identificar el mensaje de datos en su soporte original (bandeja, servidor, respaldo) sin alterar su contenido ni metadatos.',
    normativa: 'ISO/IEC 27037:2012 — Identificación de evidencia digital',
    icono: Eye,
  },
  {
    id: 'p2',
    fase: 'Fase 1: Identificación y Preservación',
    titulo: 'Preservar el mensaje original intacto',
    descripcion: 'Realizar copia forense bit a bit del contenedor del correo o exportar el .eml/.msg sin alterar cabeceras ni metadatos. Almacenar el original en custodia.',
    normativa: 'ISO/IEC 27037:2012 — Preservación · Art. 187 COPP — Cadena de Custodia',
    icono: Lock,
  },
  {
    id: 'p3',
    fase: 'Fase 1: Identificación y Preservación',
    titulo: 'Calcular hash SHA-256 del mensaje original',
    descripcion: 'Calcular el hash criptográfico del archivo de correo original (.eml/.msg) como sello de integridad. Registrar en la cadena de custodia.',
    normativa: 'ISO/IEC 27037:2012 — Integridad · MUCC-2017',
    icono: Hash,
  },
  {
    id: 'p4',
    fase: 'Fase 2: Documentación Técnica',
    titulo: 'Extraer y documentar encabezados SMTP completos',
    descripcion: 'Extraer todos los encabezados del mensaje (Received, From, To, Date, Message-ID, DKIM-Signature, SPF, etc.) y documentar la ruta del correo.',
    normativa: 'ISO/IEC 27037:2012 — Recopilación · LMDF Art. 4 — Eficacia probatoria',
    icono: FileText,
  },
  {
    id: 'p5',
    fase: 'Fase 2: Documentación Técnica',
    titulo: 'Documentar metadatos del mensaje',
    descripcion: 'Registrar: remitente, destinatarios, fecha/hora (con zona horaria), Message-ID, tamaño, adjuntos, cliente de correo. Verificar autenticidad DKIM/SPF si aplica.',
    normativa: 'NIST SP 800-101 — Metadatos de evidencia digital',
    icono: Fingerprint,
  },
  {
    id: 'p6',
    fase: 'Fase 2: Documentación Técnica',
    titulo: 'Establecer la cadena de custodia del correo',
    descripcion: 'Documentar quién, cuándo y cómo obtuvo el acceso al correo. Registrar cada transferencia de custodia con fechas, firmas y motivos.',
    normativa: 'Art. 187-188 COPP · MUCC-2017 — Cadena de Custodia',
    icono: Shield,
  },
  {
    id: 'p7',
    fase: 'Fase 3: Análisis Forense',
    titulo: 'Analizar el contenido del mensaje',
    descripcion: 'Extraer el cuerpo del mensaje, firmas digitales, archivos adjuntos y enlaces. Documentar hallazgos relevantes para la investigación.',
    normativa: 'ISO/IEC 27042:2015 — Análisis e interpretación',
    icono: Search,
  },
  {
    id: 'p8',
    fase: 'Fase 3: Análisis Forense',
    titulo: 'Verificar autenticidad de adjuntos y enlaces',
    descripcion: 'Analizar archivos adjuntos en busca de malware, metadatos ocultos o alteraciones. Verificar la legitimidad de los enlaces contenidos.',
    normativa: 'ISO/IEC 27037:2012 · LEDI — Delitos Informáticos',
    icono: AlertTriangle,
  },
  {
    id: 'p9',
    fase: 'Fase 3: Análisis Forense',
    titulo: 'Documentar hallazgos con línea de tiempo',
    descripcion: 'Crear una línea de tiempo forense con todos los eventos: recepción, reenvíos, apertura de adjuntos, respuestas. Correlacionar con otras evidencias.',
    normativa: 'ISO/IEC 27042:2015 — Interpretación · NIST SP 800-101',
    icono: Clock,
  },
  {
    id: 'p10',
    fase: 'Fase 4: Informe y Presentación',
    titulo: 'Redactar el informe pericial de correo electrónico',
    descripcion: 'Elaborar dictamen pericial con: metodología, cadena de custodia, hallazgos técnicos, hash de integridad, conclusiones y firma digital.',
    normativa: 'Art. 187 COPP · LMDF Art. 4-9 — Valor probatorio',
    icono: FileText,
  },
  {
    id: 'p11',
    fase: 'Fase 4: Informe y Presentación',
    titulo: 'Cerrar el caso y generar reporte de auditoría',
    descripcion: 'Completar todos los pasos. Generar el reporte final de auditoría con la línea de tiempo completa de todas las acciones realizadas.',
    normativa: 'MUCC-2017 · ISO/IEC 27037:2012',
    icono: Archive,
  },
];

function Search(props: any) { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>; }

export default function CorreoForensePage() {
  const [casoId, setCasoId] = useState('');
  const [proceso, setProceso] = useState<ProcesoCorreo | null>(null);
  const [showForm, setShowForm] = useState(true);
  const [formBasico, setFormBasico] = useState({ remitente: '', destinatarios: '', asunto: '', fechaCorreo: '', messageId: '' });
  const [pasos, setPasos] = useState<StepLog[]>([]);
  const casos = useCMSStore(s => s.casos);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (proceso) {
      setPasos(proceso.pasos.length === PASOS_FIJOS.length ? proceso.pasos : PASOS_FIJOS.map(p => {
        const existente = proceso.pasos.find(s => s.stepId === p.id);
        return existente || { stepId: p.id, completado: false, responsable: '', observaciones: '' };
      }));
    }
  }, [proceso]);

  const handleIniciar = () => {
    if (!casoId || !formBasico.remitente) return;
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const nuevo: ProcesoCorreo = {
      id,
      casoId,
      ...formBasico,
      casoRef: casos.find(c => c.id === casoId)?.numeroCaso || '',
      fechaInicio: new Date().toISOString(),
      finalizado: false,
      pasos: PASOS_FIJOS.map(p => ({ stepId: p.id, completado: false, responsable: '', observaciones: '' })),
    };
    indexedDBStorage.setItem('correos_forenses', nuevo).then(() => {
      setProceso(nuevo);
      setShowForm(false);
    });
  };

  const togglePaso = async (stepId: string) => {
    if (!proceso) return;
    const nuevosPasos = pasos.map(p =>
      p.stepId === stepId
        ? {
            ...p,
            completado: !p.completado,
            fecha: !p.completado ? new Date().toISOString() : p.fecha,
            responsable: 'Perito',
          }
        : p
    );
    setPasos(nuevosPasos);
    const updated = { ...proceso, pasos: nuevosPasos, finalizado: nuevosPasos.every(p => p.completado), fechaCierre: nuevosPasos.every(p => p.completado) ? new Date().toISOString() : proceso.fechaCierre };
    setProceso(updated);
    await indexedDBStorage.setItem('correos_forenses', updated);
  };

  const updateObservacion = async (stepId: string, obs: string) => {
    if (!proceso) return;
    const nuevosPasos = pasos.map(p => p.stepId === stepId ? { ...p, observaciones: obs } : p);
    setPasos(nuevosPasos);
    const updated = { ...proceso, pasos: nuevosPasos };
    setProceso(updated);
    await indexedDBStorage.setItem('correos_forenses', updated);
  };

  const cargarProceso = async (id: string) => {
    setCasoId(id);
    const all = await indexedDBStorage.getAll<ProcesoCorreo>('correos_forenses');
    const existente = all.find(p => p.casoId === id && !p.finalizado);
    if (existente) {
      setProceso(existente);
      setFormBasico({ remitente: existente.remitente, destinatarios: existente.destinatarios, asunto: existente.asunto, fechaCorreo: existente.fechaCorreo, messageId: existente.messageId });
      setShowForm(false);
    } else {
      setProceso(null);
      setShowForm(true);
      setFormBasico({ remitente: '', destinatarios: '', asunto: '', fechaCorreo: '', messageId: '' });
    }
  };

  const imprimir = () => {
    window.print();
  };

  const completados = pasos.filter(p => p.completado).length;
  const total = PASOS_FIJOS.length;
  const porcentaje = total > 0 ? Math.round((completados / total) * 100) : 0;
  const finalizado = pasos.length > 0 && pasos.every(p => p.completado);

  const fases = PASOS_FIJOS.reduce<{ fase: string; pasos: typeof PASOS_FIJOS }[]>((acc, p) => {
    const existente = acc.find(a => a.fase === p.fase);
    if (existente) existente.pasos.push(p);
    else acc.push({ fase: p.fase, pasos: [p] });
    return acc;
  }, []);

  return (
    <div className="space-y-6 animate-fade-in" ref={printRef}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 print:mb-2">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight print:text-black">Correo Electrónico Corporativo</h1>
          <p className="text-sm text-fluent-text-muted font-medium mt-1 print:text-gray-600">
            Guía de procedimiento técnico-jurídico paso a paso para el análisis forense de correos electrónicos.
            <span className="text-fluent-accent ml-1 print:hidden">ISO 27037 · LMDF · COPP · MUCC-2017</span>
          </p>
        </div>
        {proceso && (
          <div className="flex items-center gap-2 print:hidden">
            <button onClick={imprimir} className="cms-btn cms-btn-secondary text-xs">
              <Printer size={14} /> Imprimir
            </button>
            <button onClick={() => { setProceso(null); setShowForm(true); }} className="cms-btn cms-btn-secondary text-xs">
              Nuevo proceso
            </button>
          </div>
        )}
      </div>

      {/* Selector de caso o formulario inicial */}
      {!proceso ? (
        <div className="fluent-card p-6 max-w-2xl">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Mail className="text-fluent-accent" size={18} />
            Iniciar proceso de análisis forense de correo
          </h2>
          <div className="space-y-4">
            <div>
              <label className="cms-label">Caso asociado</label>
              <select value={casoId} onChange={e => cargarProceso(e.target.value)} className="cms-input">
                <option value="">Seleccionar caso...</option>
                {casos.filter(c => c.estado !== 'cerrado' && c.estado !== 'archivado').map(c => (
                  <option key={c.id} value={c.id}>{c.numeroCaso} — {c.titulo}</option>
                ))}
              </select>
            </div>
            {showForm && casoId && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="cms-label">Remitente</label>
                    <input type="text" value={formBasico.remitente} onChange={e => setFormBasico(p => ({ ...p, remitente: e.target.value }))} placeholder="correo@empresa.com" className="cms-input" />
                  </div>
                  <div>
                    <label className="cms-label">Destinatarios</label>
                    <input type="text" value={formBasico.destinatarios} onChange={e => setFormBasico(p => ({ ...p, destinatarios: e.target.value }))} placeholder="correo1@empresa.com" className="cms-input" />
                  </div>
                  <div>
                    <label className="cms-label">Asunto</label>
                    <input type="text" value={formBasico.asunto} onChange={e => setFormBasico(p => ({ ...p, asunto: e.target.value }))} placeholder="Re: Contrato" className="cms-input" />
                  </div>
                  <div>
                    <label className="cms-label">Fecha del correo</label>
                    <input type="text" value={formBasico.fechaCorreo} onChange={e => setFormBasico(p => ({ ...p, fechaCorreo: e.target.value }))} placeholder="2026-05-21 10:30" className="cms-input" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="cms-label">Message-ID</label>
                    <input type="text" value={formBasico.messageId} onChange={e => setFormBasico(p => ({ ...p, messageId: e.target.value }))} placeholder="<abc123@mail.empresa.com>" className="cms-input" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button onClick={handleIniciar} className="cms-btn cms-btn-primary">Iniciar proceso forense</button>
                </div>
              </>
            )}
          </div>
          {/* Procesos existentes */}
          <ProcesosExistentes casoId={casoId} onSelect={setProceso} onStartNew={() => setShowForm(true)} />
        </div>
      ) : (
        /* ─── Proceso activo ─── */
        <>
          {/* Barra de progreso */}
          <div className="fluent-card p-4 print:p-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Mail className="text-fluent-accent" size={18} />
                <div>
                  <span className="text-sm font-bold text-white print:text-black">{formBasico.asunto || '(sin asunto)'}</span>
                  <span className="text-[10px] text-fluent-text-muted ml-3 print:text-gray-600">{proceso.casoRef}</span>
                </div>
              </div>
              <div className={`text-xs font-bold px-2 py-1 rounded ${finalizado ? 'bg-green-500/20 text-green-400' : 'bg-fluent-accent/10 text-fluent-accent'}`}>
                {finalizado ? 'FINALIZADO' : `${completados}/${total} pasos`}
              </div>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-500 ${finalizado ? 'bg-green-400' : 'bg-fluent-accent'}`} style={{ width: `${porcentaje}%` }} />
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[9px] text-fluent-text-muted print:text-gray-500">{porcentaje}% completado</span>
              <span className="text-[9px] text-fluent-text-muted print:text-gray-500">Iniciado: {new Date(proceso.fechaInicio).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Datos del correo */}
          <div className="fluent-card p-4 print:border print:border-gray-300 print:bg-white">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div><span className="text-fluent-text-muted print:text-gray-500">Remitente:</span> <span className="text-white font-bold print:text-black">{formBasico.remitente}</span></div>
              <div><span className="text-fluent-text-muted print:text-gray-500">Destinatario:</span> <span className="text-white print:text-black">{formBasico.destinatarios}</span></div>
              <div><span className="text-fluent-text-muted print:text-gray-500">Fecha:</span> <span className="text-white print:text-black">{formBasico.fechaCorreo}</span></div>
              <div><span className="text-fluent-text-muted print:text-gray-500">Message-ID:</span> <span className="text-white font-mono print:text-black" style={{fontSize: '9px'}}>{formBasico.messageId}</span></div>
            </div>
          </div>

          {/* Pasos por fase */}
          <div className="space-y-4">
            {fases.map(fase => (
              <div key={fase.fase} className="fluent-card overflow-hidden print:border print:border-gray-300 print:bg-white">
                <div className="p-4 pb-3 border-b border-white/5 print:border-gray-200">
                  <h3 className="text-xs font-black text-fluent-accent uppercase tracking-wider print:text-gray-700">{fase.fase}</h3>
                </div>
                <div className="divide-y divide-white/5 print:divide-gray-200">
                  {fase.pasos.map(paso => {
                    const stepLog = pasos.find(s => s.stepId === paso.id);
                    const checked = stepLog?.completado || false;
                    const Icon = paso.icono;
                    return (
                      <div key={paso.id} className="p-4 hover:bg-white/[0.02] transition-colors print:p-2">
                        <div className="flex items-start gap-3">
                          <button onClick={() => togglePaso(paso.id)}
                            className="mt-0.5 shrink-0 print:hidden">
                            {checked
                              ? <CheckCircle2 size={20} className="text-green-400" />
                              : <Circle size={20} className="text-fluent-text-muted hover:text-white" />
                            }
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <Icon size={14} className={checked ? 'text-green-400 print:text-gray-500' : 'text-fluent-text-muted print:text-gray-400'} />
                              <span className={`text-sm font-bold ${checked ? 'text-green-400 line-through opacity-70' : 'text-white'} print:text-black print:no-underline`}>
                                {paso.titulo}
                              </span>
                            </div>
                            <p className="text-[11px] text-fluent-text-muted mt-1 print:text-gray-600">{paso.descripcion}</p>
                            <p className="text-[9px] text-fluent-accent/60 mt-1 print:text-gray-500 italic">{paso.normativa}</p>
                            {checked && stepLog?.fecha && (
                              <div className="flex items-center gap-3 mt-1.5 text-[9px] text-fluent-text-muted print:text-gray-400">
                                <span className="flex items-center gap-1"><Clock size={10} />{new Date(stepLog.fecha).toLocaleString()}</span>
                                {stepLog.responsable && <span className="flex items-center gap-1"><User size={10} />{stepLog.responsable}</span>}
                              </div>
                            )}
                            {checked && (
                              <div className="mt-2 print:hidden">
                                <textarea
                                  value={stepLog?.observaciones || ''}
                                  onChange={e => updateObservacion(paso.id, e.target.value)}
                                  placeholder="Agregar observaciones..."
                                  rows={1}
                                  className="w-full text-[10px] bg-transparent border border-white/5 rounded p-1.5 text-fluent-text-muted placeholder:text-white/20 focus:border-fluent-accent/30 outline-none resize-none"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Resumen final imprimible */}
          {finalizado && (
            <div className="fluent-card p-6 print:border print:border-gray-300 print:bg-white print:break-before-page">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle2 size={24} className="text-green-400" />
                <div>
                  <h2 className="text-lg font-bold text-white print:text-black">Proceso Forense Finalizado</h2>
                  <p className="text-xs text-fluent-text-muted print:text-gray-600">Caso: {proceso.casoRef} — Cerrado: {proceso.fechaCierre ? new Date(proceso.fechaCierre).toLocaleString() : ''}</p>
                </div>
              </div>

              <h3 className="text-sm font-bold text-white mb-4 print:text-black">Línea de Tiempo — Pasos Realizados</h3>
              <div className="relative">
                {PASOS_FIJOS.filter(p => pasos.find(s => s.stepId === p.id)?.completado).map((paso, i) => {
                  const stepLog = pasos.find(s => s.stepId === paso.id);
                  return (
                    <div key={paso.id} className="flex gap-4 pb-6 last:pb-0 relative">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-green-400 border-2 border-green-400 z-10" />
                        {i < PASOS_FIJOS.length - 1 && <div className="w-0.5 flex-1 bg-green-400/30 absolute top-3 bottom-0" />}
                      </div>
                      <div className="flex-1 -mt-0.5">
                        <p className="text-sm font-bold text-white print:text-black">{paso.titulo}</p>
                        {stepLog?.fecha && <p className="text-[10px] text-fluent-text-muted print:text-gray-500">{new Date(stepLog.fecha).toLocaleString()}</p>}
                        {stepLog?.observaciones && <p className="text-[10px] text-fluent-text-muted mt-1 italic print:text-gray-500">"{stepLog.observaciones}"</p>}
                        <p className="text-[9px] text-fluent-accent/60 mt-1 print:text-gray-400">{paso.normativa}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 print:border-gray-300 text-[9px] text-fluent-text-muted print:text-gray-500">
                <p>Documento generado por SHA256.US — Sistema de Peritaje Forense Digital</p>
                <p>Fecha de emisión: {new Date().toLocaleString()}</p>
                <p>Normativa aplicable: ISO/IEC 27037:2012 · ISO/IEC 27042:2015 · NIST SP 800-101 · MUCC-2017 · COPP Art. 187-188 · LMDF</p>
              </div>
            </div>
          )}

          {/* Botón imprimir flotante */}
          <div className="flex justify-center print:hidden">
            <button onClick={imprimir} className="cms-btn cms-btn-primary px-8">
              <Printer size={16} /> {finalizado ? 'Imprimir reporte final de auditoría' : 'Imprimir avance del proceso'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function ProcesosExistentes({ casoId, onSelect, onStartNew }: { casoId: string; onSelect: (p: any) => void; onStartNew: () => void }) {
  const [procesos, setProcesos] = useState<any[]>([]);

  useEffect(() => {
    if (!casoId) return;
    indexedDBStorage.getAll<any>('correos_forenses').then(all => {
      setProcesos(all.filter(p => p.casoId === casoId));
    });
  }, [casoId]);

  if (procesos.length === 0) return null;

  return (
    <div className="mt-4 pt-4 border-t border-white/5">
      <h3 className="text-xs font-bold text-fluent-text-muted mb-2">Procesos existentes para este caso:</h3>
      <div className="space-y-1">
        {procesos.map(p => (
          <button key={p.id} onClick={() => onSelect(p)}
            className="w-full text-left text-xs p-2 rounded bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 flex items-center justify-between">
            <span>{p.asunto || '(sin asunto)'} — {p.remitente}</span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded ${p.finalizado ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
              {p.finalizado ? 'Finalizado' : 'En proceso'}
            </span>
          </button>
        ))}
        <button onClick={onStartNew} className="text-xs text-fluent-accent hover:underline mt-1">+ Iniciar nuevo proceso</button>
      </div>
    </div>
  );
}
