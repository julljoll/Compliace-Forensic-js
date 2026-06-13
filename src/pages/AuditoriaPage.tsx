import { useEffect, useState, useMemo } from 'react';
import { useCMSStore } from '../store/cmsStore';
import { NORMATIVAS_ETAPAS } from '../data/normativasEtapas';
import { getPasosPorTipo } from '../data/tiposProyecto';
import { 
  Activity, CheckCircle2, AlertTriangle, Info, AlertOctagon, 
  Printer, User, Clock, FileText
} from '../components/atoms/AppleIcon';

const NIVEL_CONFIG = {
  success: { icon: CheckCircle2, color: 'text-[#34C759]', bg: 'bg-[rgba(52,199,89,0.08)] border-[rgba(52,199,89,0.2)]' },
  info:    { icon: Info,          color: 'text-[#007AFF]',  bg: 'bg-[rgba(0,122,255,0.08)] border-[rgba(0,122,255,0.2)]'  },
  warning: { icon: AlertTriangle, color: 'text-[#FF9500]', bg: 'bg-[rgba(255,149,0,0.08)] border-[rgba(255,149,0,0.2)]' },
  error:   { icon: AlertOctagon,  color: 'text-[#FF3B30]',   bg: 'bg-[rgba(255,59,48,0.08)] border-[rgba(255,59,48,0.2)]'   },
};

export default function AuditoriaPage() {
  const { casos } = useCMSStore();
  const [casoSeleccionado, setCasoSeleccionado] = useState<string | null>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadLogs(); }, []);

  const SESSION_ACTIONS = new Set(['INICIO_SESION', 'SISTEMA_INICIADO', 'SESION_CERRADA']);

  const loadLogs = async () => {
    if (window.electronAPI?.db?.getAuditLogs) {
      try {
        const logs = await window.electronAPI.db.getAuditLogs();
        const filtered = logs.filter((l: any) => !SESSION_ACTIONS.has(l.accion));
        setAuditLogs(filtered);
      } catch (err) { console.error('Error cargando audit logs:', err); }
    }
    setLoading(false);
  };

  const activeCaso = useMemo(() => {
    if (!casoSeleccionado) return null;
    return casos.find(c => c.id === casoSeleccionado) || null;
  }, [casos, casoSeleccionado]);

  const STEPS = useMemo(() => {
    if (!activeCaso?.tipoProyecto) return [];
    return getPasosPorTipo(activeCaso.tipoProyecto).map(p => ({
      id: p.id, num: p.num, title: p.titulo, complianceIds: p.complianceIds,
    }));
  }, [activeCaso]);

  const getRequisitoDetails = (id: string) => {
    let details = { codigo: '', nombre: '' };
    NORMATIVAS_ETAPAS.forEach(ne => {
      ne.etapas.forEach(et => {
        if (et.id === id) { details = { codigo: ne.codigo, nombre: et.nombre }; }
        if (et.subetapas) {
          et.subetapas.forEach(sub => {
            if (sub.id === id) { details = { codigo: ne.codigo, nombre: sub.nombre }; }
          });
        }
      });
    });
    return details;
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <style>{`
        @media print {
          body { background: white !important; color: black !important; font-size: 11px !important; }
          .no-print { display: none !important; }
          .print-container { width: 100% !important; margin: 0 !important; padding: 0 !important; background: white !important; color: black !important; }
          .print-header { border-bottom: 2px solid black !important; padding-bottom: 10px !important; margin-bottom: 20px !important; color: black !important; }
          .print-card { border: 1px solid #ccc !important; background: white !important; color: black !important; box-shadow: none !important; border-radius: 4px !important; padding: 12px !important; margin-bottom: 15px !important; page-break-inside: avoid !important; }
          .print-text { color: #333 !important; }
          .print-signature-area { margin-top: 50px !important; page-break-inside: avoid !important; }
        }
      `}</style>

      <div className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6 print:hidden">
        <div>
          <h1 className="text-4xl font-bold text-[#1D1D1F] tracking-tight flex items-center gap-4">
            <div className="p-2 rounded-lg bg-[rgba(0,113,227,0.1)] border border-[rgba(0,113,227,0.2)]">
              <Activity className="text-[#0071E3]" size={24} strokeWidth={2.5} />
            </div>
            Registro de Auditoría y Trazabilidad
          </h1>
          <p className="text-sm text-[#86868B] font-medium mt-2">
            Trazabilidad forense y compliance reglamentario de proyectos. Conectado a Neon Serverless.
          </p>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-[#86868B]/60 tracking-wider">Filtrar por Proyecto:</span>
            <select value={casoSeleccionado || ''} onChange={(e) => setCasoSeleccionado(e.target.value || null)}
              className="bg-white dark:bg-[#2C2C2E] border border-[rgba(0,113,227,0.2)] dark:border-white/10 rounded-lg text-xs font-bold text-[#0071E3] dark:text-[#0A84FF] px-4 py-2.5 outline-none hover:border-[rgba(0,113,227,0.5)] dark:hover:border-white/20 focus:border-[#0071E3] transition-all min-w-[220px] cursor-pointer">
              <option value="">-- Todos los Eventos (Log General) --</option>
              {casos.map(c => (<option key={c.id} value={c.id}>{c.numeroCaso} - {c.titulo}</option>))}
            </select>
          </div>
          <button onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0071E3] hover:bg-[#0077ED] text-white font-bold text-xs uppercase tracking-widest rounded-lg transition-colors cursor-pointer">
            <Printer size={14} /> Imprimir Timeline
          </button>
        </div>
      </div>

      {activeCaso ? (
        <div className="print-container space-y-6">
          <div className="apple-card p-6 relative overflow-hidden">
            <div className="print-header flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-[rgba(0,0,0,0.08)] mb-4 gap-4">
              <div>
                <span className="font-mono text-xs font-black text-[#0071E3] uppercase tracking-widest">
                  DOCUMENTO OFICIAL DE TRAZABILIDAD Y COMPLIANCE FORENSE
                </span>
                <h2 className="text-2xl font-bold text-[#1D1D1F] mt-1">Expediente: {activeCaso.numeroCaso}</h2>
                <p className="text-sm text-[#86868B] font-semibold mt-0.5">Título del Caso: {activeCaso.titulo}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black text-[#86868B]/60 block">FECHA DE GENERACIÓN</span>
                <span className="text-xs font-mono font-bold text-[#1D1D1F]">{new Date().toLocaleString()}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase text-[#86868B]/50 tracking-wider block">Perito Líder</span>
                <p className="font-bold text-[#1D1D1F]">{activeCaso.peritoLider || 'Sin asignar'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase text-[#86868B]/50 tracking-wider block">Fiscal / Órgano Solicitante</span>
                <p className="font-bold text-[#1D1D1F]">{activeCaso.fiscal || 'Sin asignar'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase text-[#86868B]/50 tracking-wider block">Dispositivo Marca/Modelo</span>
                <p className="font-bold text-[#1D1D1F]">{activeCaso.dispositivo_marca || 'N/D'} {activeCaso.dispositivo_modelo || ''}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase text-[#86868B]/50 tracking-wider block">IMEI / Nro. Serial</span>
                <p className="font-mono font-bold text-[#0071E3]">{activeCaso.dispositivo_imei || 'N/D'}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-[2px] before:bg-[rgba(0,0,0,0.06)]">
            {STEPS.map((step) => {
              const stepState = activeCaso.steps?.[step.id];
              const completed = stepState?.estado === 'completado' || !!activeCaso.completed_steps?.[step.id];
              const meta = stepState
                ? { fecha: stepState.fechaCompletado || stepState.fechaInicio || '', responsable: stepState.responsable || '', observaciones: stepState.observaciones || '' }
                : (activeCaso.step_metadata?.[step.id] || {});
              const complianceChecklist = activeCaso.compliance_checklist || [];
              const reqs = step.complianceIds.map(id => {
                const reqInfo = getRequisitoDetails(id);
                const complianceItem = complianceChecklist.find(c => c.stageId === id);
                return { id, codigo: reqInfo.codigo, nombre: reqInfo.nombre, checked: !!complianceItem?.checked, observacion: complianceItem?.observacion || '' };
              });

              return (
                <div key={step.id} className="relative pl-14">
                  <div className={`absolute left-3.5 top-1.5 -translate-x-1/2 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${completed ? 'bg-[rgba(52,199,89,0.15)] border-[#34C759] text-[#34C759]' : 'bg-white border-[rgba(0,0,0,0.15)] text-[rgba(0,0,0,0.2)]'}`}>
                    {completed ? <CheckCircle2 size={12} strokeWidth={3} /> : <div className="w-1.5 h-1.5 rounded-full bg-[rgba(0,0,0,0.2)]" />}
                  </div>

                  <div className={`apple-card p-5 transition-all ${completed ? '' : 'opacity-60'}`}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-3">
                      <div>
                        <span className="text-[9px] font-black uppercase text-[#86868B]/50 tracking-widest block">
                          PASO {step.num} DE {STEPS.length} · TRAZABILIDAD
                        </span>
                        <h3 className={`text-sm font-bold ${completed ? 'text-[#1D1D1F]' : 'text-[#1D1D1F]/40'}`}>
                          {step.title}
                        </h3>
                      </div>
                      {completed && meta.fecha && (
                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#0071E3] font-semibold">
                          <Clock size={12} /> <span>{new Date(meta.fecha).toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    {completed ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-[rgba(0,0,0,0.03)] p-3 rounded-lg border border-[rgba(0,0,0,0.06)]">
                          <div>
                            <span className="text-[8px] font-black uppercase text-[#86868B]/50 tracking-wider block">PERITO DE FIRMA</span>
                            <span className="font-bold text-[#1D1D1F] flex items-center gap-1 mt-0.5">
                              <User size={10} className="text-[#0071E3]" /> {meta.responsable || 'No especificado'}
                            </span>
                          </div>
                          <div>
                            <span className="text-[8px] font-black uppercase text-[#86868B]/50 tracking-wider block">OBSERVACIONES / PRECINTO</span>
                            <span className="font-bold text-[#1D1D1F] flex items-center gap-1 mt-0.5">
                              <FileText size={10} className="text-[#0071E3]" /> {meta.observaciones || 'Sin incidencias registradas'}
                            </span>
                          </div>
                        </div>

                        <div>
                          <span className="text-[9px] font-black text-[#34C759] uppercase tracking-widest block mb-2">VERIFICACIÓN DE COMPLIANCE NORMATIVO:</span>
                          <div className="space-y-2">
                            {reqs.map(r => (
                              <div key={r.id} className="flex items-start gap-2 text-[11px] leading-relaxed">
                                <span className={`text-xs shrink-0 ${r.checked ? 'text-[#34C759]' : 'text-[rgba(0,0,0,0.2)]'}`}>{r.checked ? '✓' : '✗'}</span>
                                <div>
                                  <span className="font-mono text-[9px] font-black text-[#0071E3] uppercase mr-1.5">[{r.codigo}]</span>
                                  <span className={r.checked ? 'text-[#1D1D1F]/80' : 'text-[#1D1D1F]/40'}>{r.nombre}</span>
                                  {r.observacion && (
                                    <p className="text-[10px] text-[#86868B] italic pl-3 mt-0.5 border-l border-[rgba(0,0,0,0.1)]">Evidencia: {r.observacion}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-[#86868B]/50 italic">Hito pendiente de validación por el Perito de la causa.</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="print-signature-area hidden print:grid grid-cols-2 gap-10 mt-16 pt-8 border-t border-black/25">
            <div className="text-center space-y-12">
              <div className="h-0.5 bg-black/40 mx-auto w-48"></div>
              <div><p className="font-bold text-xs">Firma del Perito de Guardia</p><p className="text-[10px] text-gray-500">Responsable de Adquisición y Análisis</p></div>
            </div>
            <div className="text-center space-y-12">
              <div className="h-0.5 bg-black/40 mx-auto w-48"></div>
              <div><p className="font-bold text-xs">Firma del Compliance Officer</p><p className="text-[10px] text-gray-500">Validador de Normativa de Calidad</p></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="apple-card overflow-hidden">
          <div className="p-5 border-b border-[rgba(0,0,0,0.06)] bg-[rgba(0,0,0,0.02)] flex justify-between items-center">
            <h2 className="text-xs font-black text-[#86868B] uppercase tracking-[0.2em]">Línea de Tiempo Operacional General</h2>
            <span className="text-[9px] font-black text-[#0071E3] bg-[rgba(0,113,227,0.08)] px-2 py-0.5 rounded border border-[rgba(0,113,227,0.15)] uppercase tracking-widest">Seguridad del Sistema</span>
          </div>

          {loading ? (
            <div className="p-20 text-center text-[#86868B]/40 font-bold uppercase text-xs tracking-widest animate-pulse">Cargando registros...</div>
          ) : auditLogs.length === 0 ? (
            <div className="p-20 text-center text-[#86868B]/40 font-bold uppercase text-xs tracking-widest">No se detectaron eventos forenses.</div>
          ) : (
            <div className="divide-y divide-[rgba(0,0,0,0.04)]">
              {auditLogs.map(log => {
                const nivel = log.accion.includes('ERROR') ? 'error' : log.accion.includes('ELIMINAD') ? 'warning' : 'info';
                const conf = NIVEL_CONFIG[nivel as keyof typeof NIVEL_CONFIG] || NIVEL_CONFIG.info;
                const Icon = conf.icon;
                return (
                  <div key={log.id} className="flex items-start gap-5 px-6 py-5 hover:bg-[rgba(0,0,0,0.02)] transition-all group">
                    <div className={`p-2 rounded-lg ${conf.bg} shrink-0 mt-0.5`}>
                      <Icon size={14} className={conf.color} strokeWidth={3} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-mono font-black text-xs text-[#1D1D1F] tracking-tight uppercase">{log.accion}</span>
                      </div>
                      <p className="text-sm text-[#86868B] font-medium leading-relaxed mb-2">{log.detalle}</p>
                      <div className="flex items-center gap-4 text-[10px] font-bold text-[#86868B]/60 uppercase tracking-widest">
                        <span>Perito / Sistema</span>
                        <div className="w-1 h-1 rounded-full bg-[rgba(0,0,0,0.1)]" />
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
