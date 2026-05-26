import { ShieldCheck, CheckCircle2, Clock, ListChecks } from '../../atoms/AppleIcon';

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
      label: 'Global Progress', 
      value: `${stats.pct}%`, 
      color: stats.pct >= 80 ? 'text-green-400' : stats.pct >= 50 ? 'text-fluent-accent' : 'text-red-400', 
      icon: ShieldCheck 
    },
    { 
      label: 'Verified Stages', 
      value: stats.checkedStages, 
      color: 'text-green-400', 
      icon: CheckCircle2 
    },
    { 
      label: 'Pending Baseline', 
      value: stats.totalStages - stats.checkedStages, 
      color: 'text-yellow-400', 
      icon: Clock 
    },
    { 
      label: 'Active Frameworks', 
      value: totalNormativas, 
      color: 'text-fluent-accent', 
      icon: ListChecks 
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {kpis.map(kpi => {
        const Icon = kpi.icon;
        return (
          <div key={kpi.label} className="fluent-card p-5 group relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-fluent-text-muted group-hover:text-white transition-colors">{kpi.label}</p>
              <div className={`p-2 rounded-[4px] ${kpi.color.replace('text', 'bg')}/10 transition-transform group-hover:scale-110`}>
                <Icon size={16} className={kpi.color} strokeWidth={2.5} />
              </div>
            </div>
            <div className={`text-3xl font-black tracking-tight ${kpi.color}`}>{kpi.value}</div>
            
            {/* Accent Line */}
            <div className={`absolute bottom-0 left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full ${kpi.color.replace('text', 'bg')}`} />
          </div>
        );
      })}
    </div>
  );
}
