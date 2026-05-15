import { Link } from 'react-router-dom';
import { User, Calendar, ChevronRight, Trash2, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { CasoCMS, EstadoCaso, PrioridadCaso, NivelCumplimiento } from '../../store/cmsStore';

interface CasoCardProps {
  caso: CasoCMS;
  deleteCaso: (id: string) => void;
  estados: { value: EstadoCaso | 'todos'; label: string }[];
  prioridades: { value: PrioridadCaso | 'todos'; label: string }[];
  estadoColors: Record<string, string>;
  prioridadColors: Record<string, string>;
  cumplimientoIcon: Record<NivelCumplimiento, { icon: any; color: string; label: string }>;
}

export default function CasoCard({
  caso,
  deleteCaso,
  estados,
  prioridades,
  estadoColors,
  prioridadColors,
  cumplimientoIcon,
}: CasoCardProps) {
  const estadoConf = estadoColors[caso.estado] || estadoColors.iniciado;
  const cumplConf = cumplimientoIcon[caso.nivelCumplimientoGeneral];
  const CumplIcon = cumplConf.icon;

  return (
    <div className="cms-card p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5 hover:border-cms-accent/30 transition-colors group dark:bg-cms-sidebar/40">
      <div className={`hidden sm:block w-1 h-16 rounded-full ${prioridadColors[caso.prioridad]} shrink-0`} />
      <div className="flex-1 min-w-0 w-full">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="font-mono font-black text-cms-accent text-sm">{caso.numeroCaso}</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${estadoConf}`}>
            {estados.find(e => e.value === caso.estado)?.label}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cms-surface border border-cms-border text-cms-textMuted">
            {prioridades.find(p => p.value === caso.prioridad)?.label}
          </span>
        </div>
        <h3 className="font-bold text-white truncate mb-1 group-hover:text-cms-accent transition-colors">{caso.titulo}</h3>
        <div className="flex items-center gap-4 text-xs text-cms-textMuted">
          <span className="flex items-center gap-1"><User size={11} />{caso.pertiLider}</span>
          <span className="flex items-center gap-1"><Calendar size={11} />{new Date(caso.fechaCreacion).toLocaleDateString('es')}</span>
          <span>{caso.totalEvidencias} evidencias</span>
        </div>
      </div>
      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 shrink-0 border-t border-cms-border sm:border-0 pt-3 sm:pt-0">
        <div className="flex items-center gap-2">
          <CumplIcon size={16} className={cumplConf.color} aria-label={cumplConf.label} />
          <span className="text-xs text-cms-textMuted sm:hidden">{cumplConf.label}</span>
        </div>
        <div className="w-32 sm:w-24">
          <div className="flex justify-between text-[10px] text-cms-textMuted mb-0.5">
            <span>Progreso</span>
            <span>{caso.porcentajeCompletado}%</span>
          </div>
          <div className="h-1.5 bg-cms-surface rounded-full overflow-hidden">
            <div className="h-full bg-cms-accent rounded-full transition-all duration-500" style={{ width: `${caso.porcentajeCompletado}%` }} />
          </div>
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
        <Link to={`/casos/${caso.id}`} className="p-2 rounded-lg bg-cms-accent/10 text-cms-accent hover:bg-cms-accent hover:text-white transition-all">
          <ChevronRight size={16} />
        </Link>
        <button onClick={() => deleteCaso(caso.id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all">
          <Trash2 size={14} />
        </button>
      </div>
      {/* Mobile Actions */}
      <div className="flex sm:hidden items-center justify-end gap-2 w-full mt-2">
        <Link to={`/casos/${caso.id}`} className="flex-1 flex justify-center py-2 rounded-lg bg-cms-accent/10 text-cms-accent hover:bg-cms-accent/20 transition-colors">
          <span className="text-xs font-bold mr-1">Ver Caso</span>
          <ChevronRight size={16} />
        </Link>
        <button onClick={() => deleteCaso(caso.id)} className="p-2 px-4 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
