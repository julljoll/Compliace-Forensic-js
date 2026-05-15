import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  sub?: string;
  icon: LucideIcon;
  accent?: boolean;
  color?: string;
}

export default function KpiCard({ 
  title, 
  value, 
  sub, 
  icon: Icon, 
  accent = false, 
  color = 'text-cms-accent' 
}: KpiCardProps) {
  return (
    <div className={`cms-card p-6 transition-all hover:scale-[1.02] duration-300 ${accent ? 'border-cms-accent/40 bg-cms-accent/5' : ''} dark:bg-cms-sidebar/40`}>
      <div className="flex items-start justify-between mb-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cms-textMuted">{title}</p>
        <div className={`p-2 rounded-lg ${color.replace('text', 'bg')}/10`}>
          <Icon size={18} className={color} />
        </div>
      </div>
      <div className={`text-4xl font-black mb-1 tracking-tighter ${color}`}>{value}</div>
      {sub && <p className="text-xs text-cms-textMuted font-medium italic opacity-80">{sub}</p>}
    </div>
  );
}
