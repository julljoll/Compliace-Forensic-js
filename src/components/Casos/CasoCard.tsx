import { Link } from 'react-router-dom';
import { User, Calendar, ChevronRight, Trash2 } from 'lucide-react';
import { CasoCMS, EstadoCaso, NivelCumplimiento } from '../../store/cmsStore';

interface CasoCardProps {
  caso: CasoCMS;
  deleteCaso: (id: string) => void;
  estados: { value: EstadoCaso | 'todos'; label: string }[];
  estadoColors: Record<string, string>;
  prioridadColors: Record<string, string>;
  cumplimientoIcon: Record<NivelCumplimiento, { icon: any; color: string; label: string }>;
}

export default function CasoCard({
  caso,
  deleteCaso,
  estados,
  estadoColors,
  prioridadColors,
  cumplimientoIcon,
}: CasoCardProps) {
  const estadoConf = estadoColors[caso.estado] || estadoColors.iniciado;
  const cumplConf = cumplimientoIcon[caso.nivelCumplimientoGeneral];
  const CumplIcon = cumplConf.icon;

  return (
    <div className="fluent-card p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:translate-y-[-2px] group">
      {/* Priority Indicator Dot */}
      <div className={`w-1.5 h-10 rounded-full ${prioridadColors[caso.prioridad]} shrink-0 shadow-[0_0_10px_rgba(0,0,0,0.5)]`} />
      
      <div className="flex-1 min-w-0 w-full">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono font-black text-fluent-accent text-xs tracking-tighter uppercase">{caso.numeroCaso}</span>
          <div className={`text-[9px] px-2 py-0.5 rounded-[4px] border font-bold uppercase tracking-tight ${estadoConf}`}>
            {estados.find(e => e.value === caso.estado)?.label}
          </div>
        </div>
        <h3 className="font-bold text-white truncate text-sm mb-1 group-hover:text-fluent-accent transition-colors">{caso.titulo}</h3>
        <div className="flex items-center gap-4 text-[11px] text-fluent-text-muted font-medium">
          <span className="flex items-center gap-1.5"><User size={12} className="opacity-50" />{caso.peritoLider}</span>
          <span className="flex items-center gap-1.5"><Calendar size={12} className="opacity-50" />{new Date(caso.fechaCreacion).toLocaleDateString('es')}</span>
        </div>
      </div>

      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 shrink-0 border-t border-white/5 sm:border-0 pt-3 sm:pt-0">
        <div className="flex items-center gap-2">
           <div className={`p-1 rounded-md ${cumplConf.color.replace('text', 'bg')}/10`}>
              <CumplIcon size={14} className={cumplConf.color} />
           </div>
           <span className="text-[10px] font-bold text-fluent-text-muted/70 uppercase tracking-widest">{cumplConf.label}</span>
        </div>
        <div className="w-full sm:w-28">
          <div className="flex justify-between text-[9px] font-bold text-fluent-text-muted mb-1 uppercase tracking-tighter">
            <span>Progress</span>
            <span>{caso.porcentajeCompletado}%</span>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-fluent-accent rounded-full transition-all duration-700 ease-out" style={{ width: `${caso.porcentajeCompletado}%` }} />
          </div>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-1.5 shrink-0 ml-2">
        <Link to={`/casos/${caso.id}`} className="p-2 rounded-[4px] bg-white/5 text-fluent-text-muted hover:bg-fluent-accent hover:text-white transition-all">
          <ChevronRight size={16} strokeWidth={2.5} />
        </Link>
        <button onClick={() => deleteCaso(caso.id)} className="p-2 rounded-[4px] bg-white/5 text-fluent-text-muted hover:bg-red-500 hover:text-white transition-all">
          <Trash2 size={14} />
        </button>
      </div>

      {/* Mobile Actions */}
      <div className="flex sm:hidden items-center justify-end gap-2 w-full mt-2">
        <Link to={`/casos/${caso.id}`} className="flex-1 flex justify-center items-center py-2 rounded-[4px] bg-fluent-accent text-white font-bold text-xs uppercase tracking-widest shadow-lg">
          Open Record
          <ChevronRight size={14} className="ml-1" strokeWidth={3} />
        </Link>
        <button onClick={() => deleteCaso(caso.id)} className="p-2 px-4 rounded-[4px] bg-red-500/10 text-red-400 border border-red-500/20">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
