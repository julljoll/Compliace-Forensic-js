import { useEffect, useState, useMemo } from 'react';
import { useCMSStore } from '../store/cmsStore';
import { NORMATIVAS_ETAPAS } from '../data/normativasEtapas';
import { getPasosPorTipo } from '../data/tiposProyecto';
import { 
  Activity, CheckCircle2, AlertTriangle, Info, AlertOctagon, 
  Printer, User, Clock, FileText
} from '../components/atoms/AppleIcon';

const NIVEL_CONFIG = {
  success: { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
  info:    { icon: Info,          color: 'text-blue-400',  bg: 'bg-blue-500/10 border-blue-500/20'  },
  warning: { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  error:   { icon: AlertOctagon,  color: 'text-red-400',   bg: 'bg-red-500/10 border-red-500/20'   },
};

export default function AuditoriaPage() {
  const { casos } = useCMSStore();
  const [casoSeleccionado, setCasoSeleccionado] = useState<string | null>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const SESSION_ACTIONS = new Set(['INICIO_SESION', 'SISTEMA_INICIADO', 'SESION_CERRADA']);

  const loadLogs = async () => {
    if (window.electronAPI?.db?.getAuditLogs) {
      try {
        const logs = await window.electronAPI.db.getAuditLogs();
        const filtered = logs.filter((l: any) => !SESSION_ACTIONS.has(l.accion));
        setAuditLogs(filtered);
      } catch (err) {
        console.error('Error cargando audit logs:', err);
      }
    }
    setLoading(false);
  };

  // Encontrar el caso seleccionado para la visualización del timeline
  const activeCaso = useMemo(() => {
    if (!casoSeleccionado) return null;
    return casos.find(c => c.id === casoSeleccionado) || null;
  }, [casos, casoSeleccionado]);

  const STEPS = useMemo(() => {
    if (!activeCaso?.tipoProyecto) return [];
    return getPasosPorTipo(activeCaso.tipoProyecto).map(p => ({
      id: p.id,
      num: p.num,
      title: p.titulo,
      complianceIds: p.complianceIds,
    }));
  }, [activeCaso]);

  // Formateador de requisito
  const getRequisitoDetails = (id: string) => {
    let details = { codigo: '', nombre: '' };
    NORMATIVAS_ETAPAS.forEach(ne => {
      ne.etapas.forEach(et => {
        if (et.id === id) {
          details = { codigo: ne.codigo, nombre: et.nombre };
        }
        if (et.subetapas) {
          et.subetapas.forEach(sub => {
            if (sub.id === id) {
              details = { codigo: ne.codigo, nombre: sub.nombre };
            }
          });
        }
      });
    });
    return details;
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* Estilos para impresión óptima de actas */}
      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
            font-size: 11px !important;
          }
          .no-print {
            display: none !important;
          }
          .print-container {
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            color: black !important;
          }
          .print-header {
            border-bottom: 2px solid black !important;
            padding-bottom: 10px !important;
            margin-bottom: 20px !important;
            color: black !important;
          }
          .print-card {
            border: 1px solid #ccc !important;
            background: white !important;
            color: black !important;
            box-shadow: none !important;
            border-radius: 4px !important;
            padding: 12px !important;
            margin-bottom: 15px !important;
            page-break-inside: avoid !important;
          }
          .print-title {
            color: black !important;
            font-weight: bold !important;
          }
          .print-text {
            color: #333 !important;
          }
          .print-label {
            color: #666 !important;
            font-weight: bold !important;
          }
          .print-border {
            border-left: 2px solid #333 !important;
          }
          .print-signature-area {
            margin-top: 50px !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>

      {/* Header */}
      <div className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6 print:hidden">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight flex items-center gap-4">
            <div className="p-2 rounded-[4px] bg-fluent-accent/10 border border-fluent-accent/20">
               <Activity className="text-fluent-accent" size={24} strokeWidth={2.5} />
            </div>
            Registro de Auditoría y Trazabilidad (Timeline)
          </h1>
          <p className="text-sm text-fluent-text-muted font-medium mt-2">
             Trazabilidad forense y compliance reglamentario de proyectos. Conectado a Neon Serverless.
          </p>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          {/* Selector de Caso */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-fluent-text-muted/50 tracking-wider">
              Filtrar por Proyecto:
            </span>
            <select
              value={casoSeleccionado || ''}
              onChange={(e) => setCasoSeleccionado(e.target.value || null)}
              className="bg-[#0b1f13] border border-fluent-accent/20 rounded-lg text-xs font-bold text-fluent-accent px-4 py-2.5 outline-none hover:border-fluent-accent/50 focus:border-fluent-accent transition-all min-w-[220px] cursor-pointer"
            >
              <option value="">-- Todos los Eventos (Log General) --</option>
              {casos.map(c => (
                <option key={c.id} value={c.id}>
                  {c.numeroCaso} - {c.titulo}
                </option>
              ))}
            </select>
          </div>

          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#FECF06] hover:bg-[#FECF06]/90 text-black font-bold text-xs uppercase tracking-widest rounded-md shadow-lg transition-colors cursor-pointer"
          >
            <Printer size={14} /> Imprimir Timeline
          </button>
        </div>
      </div>

      {/* Renderizado de TIMELINE DE PROYECTO (Si hay un caso seleccionado) */}
      {activeCaso ? (
        <div className="print-container space-y-6">
          
          {/* Ficha de Proyecto en PDF / Impresión */}
          <div className="print-card p-6 rounded-xl border border-white/5 bg-[#0b1f13]/25 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FECF06]/5 rounded-full blur-2xl print:hidden"></div>
            
            <div className="print-header flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-white/5 mb-4 gap-4">
              <div>
                <span className="font-mono text-xs font-black text-[#FECF06] uppercase tracking-widest">
                  DOCUMENTO OFICIAL DE TRAZABILIDAD Y COMPLIANCE FORENSE
                </span>
                <h2 className="text-2xl font-bold text-white print:text-black mt-1">
                  Expediente: {activeCaso.numeroCaso}
                </h2>
                <p className="text-sm text-fluent-text-muted print:text-black font-semibold mt-0.5">
                  Título del Caso: {activeCaso.titulo}
                </p>
              </div>
              <div className="text-right print:text-left">
                <span className="text-[10px] font-black text-white/40 block print:text-black">FECHA DE GENERACIÓN</span>
                <span className="text-xs font-mono font-bold text-white print:text-black">{new Date().toLocaleString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase text-fluent-text-muted/40 tracking-wider block print:text-black">Perito Líder</span>
                <p className="font-bold text-white print:text-black">{activeCaso.peritoLider || 'Sin asignar'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase text-fluent-text-muted/40 tracking-wider block print:text-black">Fiscal / Órgano Solicitante</span>
                <p className="font-bold text-white print:text-black">{activeCaso.fiscal || 'Sin asignar'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase text-fluent-text-muted/40 tracking-wider block print:text-black">Dispositivo Marca/Modelo</span>
                <p className="font-bold text-white print:text-black">
                  {activeCaso.dispositivo_marca || 'N/D'} {activeCaso.dispositivo_modelo || ''}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase text-fluent-text-muted/40 tracking-wider block print:text-black">IMEI / Nro. Serial</span>
                <p className="font-mono font-bold text-[#FECF06] print:text-black">
                  {activeCaso.dispositivo_imei || 'N/D'}
                </p>
              </div>
            </div>
          </div>

          {/* Hitos del Timeline */}
          <div className="space-y-6 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-[2px] before:bg-white/5 print:before:bg-black/10">
            {STEPS.map((step) => {
              // Leer estado desde steps (nuevo) o completed_steps (legacy)
              const stepState = activeCaso.steps?.[step.id];
              const completed = stepState?.estado === 'completado' || !!activeCaso.completed_steps?.[step.id];
              const meta = stepState 
                ? { fecha: stepState.fechaCompletado || stepState.fechaInicio || '', responsable: stepState.responsable || '', observaciones: stepState.observaciones || '' }
                : (activeCaso.step_metadata?.[step.id] || {});
              const complianceChecklist = activeCaso.compliance_checklist || [];

              // Requisitos del paso
              const reqs = step.complianceIds.map(id => {
                const reqInfo = getRequisitoDetails(id);
                const complianceItem = complianceChecklist.find(c => c.stageId === id);
                return {
                  id,
                  codigo: reqInfo.codigo,
                  nombre: reqInfo.nombre,
                  checked: !!complianceItem?.checked,
                  observacion: complianceItem?.observacion || ''
                };
              });

              return (
                <div key={step.id} className="relative pl-14 print-card print:break-inside-avoid">
                  
                  {/* Círculo indicador del timeline */}
                  <div className={`absolute left-3.5 top-1.5 -translate-x-1/2 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    completed 
                      ? 'bg-green-500/20 border-[#00FF41] text-[#00FF41] shadow-[0_0_8px_rgba(0,255,65,0.2)]'
                      : 'bg-black/50 border-white/10 text-white/20'
                  } print:bg-white print:text-black print:border-black`}>
                    {completed ? <CheckCircle2 size={12} strokeWidth={3} /> : <div className="w-1.5 h-1.5 rounded-full bg-white/20 print:bg-black/20" />}
                  </div>

                  <div className={`p-5 rounded-lg border transition-all ${
                    completed 
                      ? 'bg-green-500/[0.02] border-green-500/10'
                      : 'bg-white/[0.01] border-white/[0.03] opacity-60'
                  } print:bg-white print:border-black/10`}>
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-3">
                      <div>
                        <span className="text-[9px] font-black uppercase text-fluent-text-muted/40 tracking-widest block">
                          PASO {step.num} DE {STEPS.length} · TRAZABILIDAD
                        </span>
                        <h3 className={`text-sm font-bold ${completed ? 'text-white print:text-black' : 'text-white/40 print:text-black/40'}`}>
                          {step.title}
                        </h3>
                      </div>
                      
                      {completed && meta.fecha && (
                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-400 print:text-black font-semibold">
                          <Clock size={12} />
                          <span>{new Date(meta.fecha).toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    {completed ? (
                      <div className="space-y-4">
                        {/* Metadata del perito ejecutor */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-black/40 p-3 rounded border border-white/5 print:bg-white print:border-black/10">
                          <div>
                            <span className="text-[8px] font-black uppercase text-fluent-text-muted/40 tracking-wider block print:text-black">PERITO DE FIRMA</span>
                            <span className="font-bold text-white print:text-black flex items-center gap-1 mt-0.5">
                              <User size={10} className="text-[#FECF06] print:text-black" />
                              {meta.responsable || 'No especificado'}
                            </span>
                          </div>
                          <div>
                            <span className="text-[8px] font-black uppercase text-fluent-text-muted/40 tracking-wider block print:text-black">OBSERVACIONES / PRECINTO</span>
                            <span className="font-bold text-white print:text-black flex items-center gap-1 mt-0.5">
                              <FileText size={10} className="text-[#FECF06] print:text-black" />
                              {meta.observaciones || 'Sin incidencias registradas'}
                            </span>
                          </div>
                        </div>

                        {/* Cumplimiento Normativo Asociado */}
                        <div>
                          <span className="text-[9px] font-black text-[#00FF41] print:text-black uppercase tracking-widest block mb-2">
                            VERIFICACIÓN DE COMPLIANCE NORMATIVO:
                          </span>
                          <div className="space-y-2">
                            {reqs.map(r => (
                              <div key={r.id} className="flex items-start gap-2 text-[11px] leading-relaxed">
                                <span className={`text-xs shrink-0 ${r.checked ? 'text-green-400 print:text-black' : 'text-white/20 print:text-black/20'}`}>
                                  {r.checked ? '✓' : '✗'}
                                </span>
                                <div>
                                  <span className="font-mono text-[9px] font-black text-[#FECF06] print:text-black uppercase mr-1.5">
                                    [{r.codigo}]
                                  </span>
                                  <span className={r.checked ? 'text-white/80 print:text-black' : 'text-white/40 print:text-black/40'}>
                                    {r.nombre}
                                  </span>
                                  {r.observacion && (
                                    <p className="text-[10px] text-fluent-text-muted print:text-black italic pl-3 mt-0.5 border-l border-white/10 print:border-black/25">
                                      Evidencia: {r.observacion}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    ) : (
                      <p className="text-xs text-white/30 italic">Hito pendiente de validación por el Perito de la causa.</p>
                    )}

                  </div>
                </div>
              );
            })}
          </div>

          {/* Área de firmas para reporte de impresión */}
          <div className="print-signature-area hidden print:grid grid-cols-2 gap-10 mt-16 pt-8 border-t border-black/25">
            <div className="text-center space-y-12">
              <div className="h-0.5 bg-black/40 mx-auto w-48"></div>
              <div>
                <p className="font-bold text-xs">Firma del Perito de Guardia</p>
                <p className="text-[10px] text-gray-500">Responsable de Adquisición y Análisis</p>
              </div>
            </div>
            <div className="text-center space-y-12">
              <div className="h-0.5 bg-black/40 mx-auto w-48"></div>
              <div>
                <p className="font-bold text-xs">Firma del Compliance Officer</p>
                <p className="text-[10px] text-gray-500">Validador de Normativa de Calidad</p>
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* Log General de Auditoría del Sistema (Se muestra por defecto) */
        <div className="fluent-mica rounded-xl overflow-hidden shadow-2xl border border-white/5">
          <div className="p-5 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
            <h2 className="text-xs font-black text-fluent-text-muted uppercase tracking-[0.2em]">Línea de Tiempo Operacional General</h2>
            <span className="text-[9px] font-black text-fluent-accent bg-fluent-accent/10 px-2 py-0.5 rounded border border-fluent-accent/20 uppercase tracking-widest">
              Seguridad del Sistema
            </span>
          </div>
          
          {loading ? (
            <div className="p-20 text-center text-fluent-text-muted opacity-40 font-bold uppercase text-xs tracking-widest animate-pulse">Cargando registros...</div>
          ) : auditLogs.length === 0 ? (
            <div className="p-20 text-center text-fluent-text-muted opacity-40 font-bold uppercase text-xs tracking-widest">No se detectaron eventos forenses.</div>
          ) : (
            <div className="divide-y divide-white/[0.03]">
              {auditLogs.map(log => {
                const nivel = log.accion.includes('ERROR') ? 'error' : log.accion.includes('ELIMINAD') ? 'warning' : 'info';
                const conf = NIVEL_CONFIG[nivel as keyof typeof NIVEL_CONFIG] || NIVEL_CONFIG.info;
                const Icon = conf.icon;
                
                return (
                  <div key={log.id} className="flex items-start gap-5 px-6 py-5 hover:bg-white/[0.02] transition-all group">
                    <div className={`p-2 rounded-[4px] ${conf.bg} shrink-0 mt-0.5 shadow-lg`}>
                      <Icon size={14} className={`${conf.color}`} strokeWidth={3} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-mono font-black text-xs text-white tracking-tight uppercase">{log.accion}</span>
                      </div>
                      <p className="text-sm text-fluent-text-muted font-medium opacity-80 leading-relaxed mb-2">{log.detalle}</p>
                      <div className="flex items-center gap-4 text-[10px] font-bold text-fluent-text-muted/40 uppercase tracking-widest">
                         <span>Perito / Sistema</span>
                         <div className="w-1 h-1 rounded-full bg-white/10" />
                         <span className="font-mono">{new Date(log.timestamp).toLocaleString('es')}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
