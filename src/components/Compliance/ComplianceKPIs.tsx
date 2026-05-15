import { ShieldCheck, CheckCircle2, Clock, ListChecks } from 'lucide-react';

interface ComplianceKPIsProps {
  stats: {
    totalStages: number;
    checkedStages: number;
    pct: number;
  };
  totalNormativas: number;
}

export default function ComplianceKPIs({ stats, totalNormativas }: ComplianceKPIsProps) {
  const kpis = [
    { 
      label: 'Progreso Global', 
      value: `${stats.pct}%`, 
      color: stats.pct >= 80 ? 'text-green-400' : stats.pct >= 50 ? 'text-yellow-400' : 'text-red-400', 
      icon: ShieldCheck 
    },
    { 
      label: 'Etapas Completadas', 
      value: stats.checkedStages, 
      color: 'text-green-400', 
      icon: CheckCircle2 
    },
    { 
      label: 'Etapas Pendientes', 
      value: stats.totalStages - stats.checkedStages, 
      color: 'text-yellow-400', 
      icon: Clock 
    },
    { 
      label: 'Total Normativas', 
      value: totalNormativas, 
      color: 'text-cms-accent', 
      icon: ListChecks 
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {kpis.map(kpi => {
        const Icon = kpi.icon;
        return (
          <div key={kpi.label} className="cms-card p-5 hover:bg-cms-surface/10 transition-colors group">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-cms-textMuted group-hover:text-white transition-colors">{kpi.label}</p>
              <div className={`p-2 rounded-lg ${kpi.color.replace('text', 'bg')}/10`}>
                <Icon size={16} className={kpi.color} />
              </div>
            </div>
            <div className={`text-3xl font-black tracking-tight ${kpi.color}`}>{kpi.value}</div>
          </div>
        );
      })}
    </div>
  );
}
