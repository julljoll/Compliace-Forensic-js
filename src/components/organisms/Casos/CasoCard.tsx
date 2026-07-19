import Link from 'next/link';
import { User, Calendar, ChevronRight, Trash2, Smartphone, Mail, HardDrive } from '../../atoms/AppleIcon';
import { CasoCMS, EstadoCaso, NivelCumplimiento, TipoProyecto } from '../../../store/cmsStore';

const TIPO_ICONOS: Record<TipoProyecto, any> = {
  forense_whatsapp: Smartphone,
  forense_email: Mail,
  forense_discoduro: HardDrive,
};

const TIPO_BADGE: Record<TipoProyecto, string> = {
  forense_whatsapp: 'bg-green-500/10 text-[#00FF41] border-green-500/20',
  forense_email: 'bg-yellow-500/10 text-[#FECF06] border-yellow-500/20',
  forense_discoduro: 'bg-purple-500/10 text-[#9DFF00] border-purple-500/20',
};

const TIPO_LABEL: Record<TipoProyecto, string> = {
  forense_whatsapp: 'WhatsApp',
  forense_email: 'Email',
  forense_discoduro: 'Disco Duro',
};

interface CasoCardProps {
  caso: CasoCMS;
  deleteCaso: (id: string) => void;
  estados: { value: EstadoCaso | 'todos'; label: string }[];
  estadoColors: Record<string, string>;
  prioridadColors: Record<string, string>;
  cumplimientoIcon: Record<NivelCumplimiento, { icon: any; color: string; label: string }>;
}

const PRIORIDAD_SHADOWS: Record<string, string> = {
  critica: 'shadow-[0_0_8px_rgba(255,59,48,0.25)]',
  alta: 'shadow-[0_0_8px_rgba(255,149,0,0.25)]',
  media: 'shadow-[0_0_8px_rgba(255,204,0,0.25)]',
  baja: 'shadow-[0_0_8px_rgba(52,199,89,0.25)]',
};

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
  const TipoIcon = TIPO_ICONOS[caso.tipoProyecto] || Smartphone;

  return (
    <div className="apple-card p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:translate-y-[-2px] group">
      <div className={`w-1.5 h-10 rounded-full ${prioridadColors[caso.prioridad]} shrink-0 ${PRIORIDAD_SHADOWS[caso.prioridad] || ''}`} />

      <div className="flex-1 min-w-0 w-full">
        <div className="flex flex-wrap items-center gap-1.5 mb-1">
          <span className="font-mono font-black text-[var(--apple-accent)] text-xs tracking-tighter uppercase">{caso.numeroCaso}</span>
          <div className={`text-[9px] px-2 py-0.5 rounded-md border font-bold uppercase tracking-tight ${estadoConf}`}>
            {estados.find(e => e.value === caso.estado)?.label}
          </div>
          <div className={`flex items-center gap-1 text-[8px] px-1.5 py-0.5 rounded-md border font-bold uppercase tracking-tight ${TIPO_BADGE[caso.tipoProyecto] || TIPO_BADGE.forense_whatsapp}`}>
            <TipoIcon size={10} />
            {TIPO_LABEL[caso.tipoProyecto] || 'WhatsApp'}
          </div>
        </div>
        <h3 className="font-bold text-white truncate text-sm mb-1 group-hover:text-[var(--apple-accent)] transition-colors">{caso.titulo}</h3>
        <div className="flex items-center gap-4 text-[11px] text-[#86868B] font-medium">
          <span className="flex items-center gap-1.5"><User size={12} className="opacity-50" />{caso.peritoLider}</span>
          <span className="flex items-center gap-1.5"><Calendar size={12} className="opacity-50" />{new Date(caso.fechaCreacion).toLocaleDateString('es')}</span>
        </div>
      </div>

      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 shrink-0 border-t border-white/5 sm:border-0 pt-3 sm:pt-0">
        <div className="flex items-center gap-2">
           <div className={`p-1 rounded-md ${cumplConf.color.replace('text', 'bg')}/10`}>
              <CumplIcon size={14} className={cumplConf.color} />
           </div>
           <span className="text-[10px] font-bold text-[#86868B]/70 uppercase tracking-widest">{cumplConf.label}</span>
        </div>
        <div className="w-full sm:w-28">
          <div className="flex justify-between text-[9px] font-bold text-[#86868B] mb-1 uppercase tracking-tighter">
            <span>Progreso</span>
            <span>{caso.porcentajeCompletado}%</span>
          </div>
          <div className="h-1 bg-black/20 rounded-full overflow-hidden">
            <div className="h-full bg-[var(--apple-accent)] rounded-full transition-all duration-700 ease-out" style={{ width: `${caso.porcentajeCompletado}%` }} />
          </div>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-1.5 shrink-0 ml-2">
        <Link href={`/casos/${caso.id}`} className="p-2 rounded-md bg-black/20 text-[#86868B] hover:bg-[var(--apple-accent)] hover:text-black transition-all">
          <ChevronRight size={16} strokeWidth={2.5} />
        </Link>
        <button onClick={() => deleteCaso(caso.id)} className="p-2 rounded-md bg-black/20 text-[#86868B] hover:bg-[#FF3B30] hover:text-white transition-all">
          <Trash2 size={14} />
        </button>
      </div>

      <div className="flex sm:hidden items-center justify-end gap-2 w-full mt-2">
        <Link href={`/casos/${caso.id}`} className="flex-1 flex justify-center items-center py-2 rounded-md bg-[var(--apple-accent)] text-black font-bold text-xs uppercase tracking-widest shadow-lg">
          Abrir Registro
          <ChevronRight size={14} className="ml-1" strokeWidth={3} />
        </Link>
        <button onClick={() => deleteCaso(caso.id)} className="p-2 px-4 rounded-md bg-red-500/10 text-[#FF3B30] border border-red-500/20">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
