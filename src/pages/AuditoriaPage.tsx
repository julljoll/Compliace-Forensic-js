import { useCMSStore } from '../store/cmsStore';
import { Activity, CheckCircle2, AlertTriangle, Info, AlertOctagon } from 'lucide-react';

const NIVEL_CONFIG = {
  success: { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
  info:    { icon: Info,          color: 'text-blue-400',  bg: 'bg-blue-500/10 border-blue-500/20'  },
  warning: { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  error:   { icon: AlertOctagon,  color: 'text-red-400',   bg: 'bg-red-500/10 border-red-500/20'   },
};

export default function AuditoriaPage() {
  const { auditLogs, casos } = useCMSStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white mb-1 flex items-center gap-3">
          <Activity className="text-cms-accent" size={24} />
          Registro de Auditoría
        </h1>
        <p className="text-sm text-cms-textMuted">{auditLogs.length} eventos registrados · Trazabilidad completa del proceso forense</p>
      </div>

      <div className="cms-card overflow-hidden">
        {auditLogs.length === 0 ? (
          <div className="p-8 text-center text-cms-textMuted">No hay eventos registrados aún.</div>
        ) : (
          <div className="divide-y divide-cms-border">
            {auditLogs.map(log => {
              const conf = NIVEL_CONFIG[log.nivel];
              const Icon = conf.icon;
              const caso = log.casoId ? casos.find(c => c.id === log.casoId) : null;
              return (
                <div key={log.id} className={`flex items-start gap-4 px-5 py-4 border-l-2 hover:bg-cms-surface/30 transition-colors ${conf.bg.split(' ')[0].replace('bg-', 'border-l-').replace('/10', '/40')}`}>
                  <div className={`p-1.5 rounded-lg ${conf.bg} border ${conf.bg.split(' ')[1]} shrink-0 mt-0.5`}>
                    <Icon size={12} className={conf.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-0.5">
                      <span className="font-mono font-bold text-xs text-white">{log.accion}</span>
                      {caso && <span className="text-[10px] text-cms-accent font-bold">{caso.numeroCaso}</span>}
                    </div>
                    <p className="text-xs text-cms-textMuted">{log.detalle}</p>
                    <p className="text-[10px] text-cms-textMuted/60 mt-1">{log.usuario} · {new Date(log.timestamp).toLocaleString('es')}</p>
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
