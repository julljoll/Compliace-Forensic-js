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
      label: 'Progreso Global',
      value: `${stats.pct}%`,
      cardClass: 'usa-card--green',
      icon: ShieldCheck,
      iconColor: '#008837',
    },
    {
      label: 'Etapas Verificadas',
      value: stats.checkedStages,
      cardClass: 'usa-card--green',
      icon: CheckCircle2,
      iconColor: '#008837',
    },
    {
      label: 'Línea Base Pendiente',
      value: stats.totalStages - stats.checkedStages,
      cardClass: 'usa-card--red',
      icon: Clock,
      iconColor: '#C05621',
    },
    {
      label: 'Marcos Activos',
      value: totalNormativas,
      cardClass: 'usa-card--gold',
      icon: ListChecks,
      iconColor: '#D9A700',
    },
  ];

  return (
    <div className="row g-3">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div key={kpi.label} className="col-12 col-sm-6 col-md-3">
            <div className={`usa-card ${kpi.cardClass} bg-white shadow-sm`}>
              <div className="d-flex align-items-center justify-content-between mb-1">
                <div className="usa-card__label">{kpi.label}</div>
                <Icon size={18} style={{ color: kpi.iconColor }} />
              </div>
              <div className="usa-card__stat mt-1">{kpi.value}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
