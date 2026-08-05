import { CMSIcon } from '../atoms/AppleIcon';

interface KpiCardProps {
  title: string;
  value: string | number;
  sub?: string;
  icon: CMSIcon;
  color?: string;
}

export default function KpiCard({
  title,
  value,
  sub,
  icon: Icon,
  color = '#D9A700',
}: KpiCardProps) {
  return (
    <div className="usa-card bg-white shadow-sm border rounded-3 p-3">
      <div className="d-flex align-items-center justify-content-between mb-1">
        <div className="usa-card__label">{title}</div>
        <Icon size={18} style={{ color }} />
      </div>
      <div className="usa-card__stat mt-1">{value}</div>
      {sub && <div className="text-muted small mt-1">{sub}</div>}
    </div>
  );
}
