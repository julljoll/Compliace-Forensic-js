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
  color = 'text-fluent-accent' 
}: KpiCardProps) {
  return (
    <div className={`fluent-card p-5 group relative overflow-hidden ${accent ? 'border-fluent-accent/30 bg-fluent-accent/[0.03]' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-fluent-text-muted">{title}</p>
        <div className={`p-2 rounded-md ${color.replace('text', 'bg')}/10 transition-transform group-hover:scale-110`}>
          <Icon size={16} className={color} strokeWidth={2.5} />
        </div>
      </div>
      <div className={`text-2xl font-black mb-1 tracking-tight ${color}`}>{value}</div>
      {sub && <p className="text-[11px] text-fluent-text-muted font-medium opacity-60">{sub}</p>}
      
      {/* Fluent Hover Effect Accent Line */}
      <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-fluent-accent group-hover:w-full transition-all duration-300" />
    </div>
  );
}
