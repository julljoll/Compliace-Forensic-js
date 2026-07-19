import { CMSIcon } from '../atoms/AppleIcon';

interface KpiCardProps {
  title: string;
  value: string | number;
  sub?: string;
  icon: CMSIcon;
  accent?: boolean;
  color?: string;
}

export default function KpiCard({ 
  title, 
  value, 
  sub, 
  icon: Icon, 
  accent = false, 
  color = 'text-[var(--apple-accent)]' 
}: KpiCardProps) {
  return (
    <div className={`apple-card p-5 group ${accent ? 'border-[var(--apple-border-strong)] bg-black/10' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.04em] text-[#86868B]">{title}</p>
        <div className={`p-2 rounded-md ${color.replace('text', 'bg')}/10 transition-transform group-hover:scale-110`}>
          <Icon size={16} className={color} strokeWidth={2} />
        </div>
      </div>
      <div className={`text-[28px] font-bold mb-0.5 tracking-[-0.03em] ${color}`}>{value}</div>
      {sub && <p className="text-[12px] text-[#86868B] font-normal">{sub}</p>}
    </div>
  );
}
