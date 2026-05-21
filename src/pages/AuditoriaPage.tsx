import { useEffect, useState } from 'react';
import { Activity, CheckCircle2, AlertTriangle, Info, AlertOctagon } from 'lucide-react';

const NIVEL_CONFIG = {
  success: { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
  info:    { icon: Info,          color: 'text-blue-400',  bg: 'bg-blue-500/10 border-blue-500/20'  },
  warning: { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  error:   { icon: AlertOctagon,  color: 'text-red-400',   bg: 'bg-red-500/10 border-red-500/20'   },
};

export default function AuditoriaPage() {
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    if (window.electronAPI?.db?.getAuditLogs) {
      try {
        const logs = await window.electronAPI.db.getAuditLogs();
        setAuditLogs(logs);
      } catch (err) {
        console.error('Error cargando audit logs:', err);
      }
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight flex items-center gap-4 print:text-black print:text-2xl">
            <div className="p-2 rounded-[4px] bg-fluent-accent/10 border border-fluent-accent/20 print:border-none print:bg-transparent print:p-0">
               <Activity className="text-fluent-accent print:text-black" size={24} strokeWidth={2.5} />
            </div>
            Registro de Auditoría y Trazabilidad (Timeline)
          </h1>
          <p className="text-sm text-fluent-text-muted font-medium mt-2 print:text-black print:opacity-100">
             <span className="text-fluent-accent font-bold print:text-black">{auditLogs.length}</span> eventos de seguridad registrados · Seguimiento completo de la cadena de custodia del proceso forense.
          </p>
        </div>
        <button 
          onClick={() => window.print()}
          className="no-print flex items-center gap-2 px-5 py-2.5 bg-fluent-accent text-fluent-bg font-bold rounded-md shadow-lg hover:bg-yellow-400 transition-colors"
        >
          <Activity size={18} /> Imprimir Timeline
        </button>
      </div>

      <div className="fluent-mica rounded-xl overflow-hidden shadow-2xl border border-white/5 print:border-none print:shadow-none print:bg-transparent">
        <div className="p-5 border-b border-white/5 bg-white/[0.02] print:border-b-2 print:border-black print:bg-transparent">
           <h2 className="text-xs font-black text-fluent-text-muted uppercase tracking-[0.2em] print:text-black">Línea de Tiempo Operacional</h2>
        </div>
        
        {loading ? (
          <div className="p-20 text-center text-fluent-text-muted opacity-40 font-bold uppercase text-xs tracking-widest">Cargando registros...</div>
        ) : auditLogs.length === 0 ? (
          <div className="p-20 text-center text-fluent-text-muted opacity-40 font-bold uppercase text-xs tracking-widest">No se detectaron eventos forenses.</div>
        ) : (
          <div className="divide-y divide-white/[0.03] print:divide-black/20">
            {auditLogs.map(log => {
              // Si no viene nivel desde la DB asumo info o success dependiendo de la accion
              const nivel = log.accion.includes('ERROR') ? 'error' : log.accion.includes('ELIMINAD') ? 'warning' : 'info';
              const conf = NIVEL_CONFIG[nivel as keyof typeof NIVEL_CONFIG] || NIVEL_CONFIG.info;
              const Icon = conf.icon;
              // Si hay caso asociado (asumiendo formato CASO_{ID} o similar en detalle)
              // Pero por ahora solo mostramos el texto
              return (
                <div key={log.id} className="flex items-start gap-5 px-6 py-5 hover:bg-white/[0.02] transition-all group print:break-inside-avoid">
                  <div className={`p-2 rounded-[4px] ${conf.bg} shrink-0 mt-0.5 shadow-lg print:bg-transparent print:border-none print:shadow-none print:p-0`}>
                    <Icon size={14} className={`${conf.color} print:text-black`} strokeWidth={3} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono font-black text-xs text-white tracking-tight uppercase print:text-black">{log.accion}</span>
                    </div>
                    <p className="text-sm text-fluent-text-muted font-medium opacity-80 leading-relaxed mb-2 print:text-black print:opacity-100">{log.detalle}</p>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-fluent-text-muted/40 uppercase tracking-widest print:text-black print:opacity-100">
                       <span>{log.nombre} {log.apellido} (@{log.username})</span>
                       <div className="w-1 h-1 rounded-full bg-white/10 print:bg-black" />
                       <span className="font-mono">{new Date(log.timestamp).toLocaleString('es')}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
