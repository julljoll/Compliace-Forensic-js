import { ChevronRight, Check, BookOpen } from 'lucide-react';
import { Normativa } from '../../store/cmsStore';

interface NormativaAccordionProps {
  norm: Normativa;
  isExpanded: boolean;
  onToggle: (id: string | null) => void;
  progress: { total: number; checked: number; pct: number };
  ne: any;
  isChecked: (stageId: string) => boolean;
  getCheckDate: (stageId: string) => string | undefined;
  toggleCheck: (stageId: string, normId: string) => void;
}

export default function NormativaAccordion({
  norm,
  isExpanded,
  onToggle,
  progress,
  ne,
  isChecked,
  getCheckDate,
  toggleCheck,
}: NormativaAccordionProps) {
  return (
    <div className={`fluent-card overflow-hidden border transition-all duration-300 ${isExpanded ? 'border-fluent-accent/30 shadow-2xl scale-[1.005]' : 'border-white/5 shadow-lg'}`}>
      {/* Header de normativa */}
      <button
        onClick={() => onToggle(isExpanded ? null : norm.id)}
        className={`w-full p-4 flex items-center gap-4 text-left transition-all hover:bg-white/[0.05] relative ${isExpanded ? 'bg-white/[0.03]' : ''}`}
      >
        <div className={`shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}>
          <ChevronRight size={16} className={isExpanded ? 'text-fluent-accent' : 'text-fluent-text-muted'} strokeWidth={3} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono font-black text-fluent-accent text-xs tracking-tighter uppercase">{norm.codigo}</span>
            <span className="text-[8px] px-2 py-0.5 rounded-[2px] bg-white/[0.05] border border-white/5 text-fluent-text-muted font-bold uppercase tracking-[0.2em]">{norm.tipo}</span>
            {progress.pct === 100 && (
              <span className="text-[8px] px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 font-black uppercase tracking-widest flex items-center gap-1">
                <Check size={8} strokeWidth={4} /> Verified
              </span>
            )}
          </div>
          <p className="text-sm text-white font-bold truncate tracking-tight">{norm.nombre}</p>
        </div>
        <div className="shrink-0 text-right ml-4">
          <div className="flex items-center gap-3">
            <div className="hidden sm:block w-20 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
              <div className="h-full bg-fluent-accent rounded-full transition-all duration-1000 ease-out" style={{ width: `${progress.pct}%` }} />
            </div>
            <span className={`text-[10px] font-black min-w-[2.5rem] tracking-widest ${progress.pct === 100 ? 'text-green-400' : progress.pct > 0 ? 'text-fluent-accent' : 'text-fluent-text-muted opacity-40'}`}>
              {progress.checked}/{progress.total}
            </span>
          </div>
        </div>
      </button>

      {/* Etapas expandidas */}
      {isExpanded && ne && (
        <div className="border-t border-white/5 divide-y divide-white/[0.03] bg-black/[0.15] animate-in slide-in-from-top-2 duration-300 ease-out">
          {ne.etapas.map((etapa: any) => (
            <div key={etapa.id} className="">
              {/* Etapa principal */}
              {etapa.subetapas ? (
                <div className="px-6 py-4 bg-white/[0.02]">
                  <div className="flex items-center gap-2 mb-1.5">
                    <BookOpen size={14} className="text-fluent-accent shrink-0" strokeWidth={2.5} />
                    <span className="text-xs font-black text-white/90 uppercase tracking-wider">{etapa.nombre}</span>
                  </div>
                  <p className="text-[11px] text-fluent-text-muted/60 leading-relaxed max-w-2xl ml-6 font-medium">{etapa.descripcion}</p>
                </div>
              ) : (
                <label className="flex items-start gap-4 px-6 py-4 cursor-pointer hover:bg-white/[0.04] transition-all group">
                  <div className="pt-0.5 shrink-0">
                    <div
                      onClick={(e) => { e.preventDefault(); toggleCheck(etapa.id, norm.id); }}
                      className={`w-[18px] h-[18px] rounded-[4px] border-2 flex items-center justify-center transition-all ${
                        isChecked(etapa.id)
                          ? 'bg-fluent-accent border-fluent-accent shadow-lg shadow-fluent-accent/20'
                          : 'border-white/20 group-hover:border-fluent-accent/50'
                      }`}
                    >
                      {isChecked(etapa.id) && <Check size={12} className="text-white" strokeWidth={3} />}
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className={`text-xs font-bold tracking-tight transition-all ${isChecked(etapa.id) ? 'text-green-400 line-through opacity-40' : 'text-white'}`}>
                      {etapa.nombre}
                    </span>
                    <p className="text-[11px] text-fluent-text-muted mt-1 leading-relaxed opacity-70 font-medium">{etapa.descripcion}</p>
                    {isChecked(etapa.id) && getCheckDate(etapa.id) && (
                      <p className="text-[9px] text-green-400/50 mt-1.5 font-bold uppercase tracking-wider">✓ Verified: {new Date(getCheckDate(etapa.id)!).toLocaleDateString()}</p>
                    )}
                  </div>
                </label>
              )}

              {/* Sub-etapas */}
              {etapa.subetapas && (
                <div className="ml-10 border-l-2 border-white/5 mb-4 mt-1">
                  {etapa.subetapas.map((sub: any) => (
                    <label key={sub.id} className="flex items-start gap-4 px-6 py-3 cursor-pointer hover:bg-white/[0.03] transition-all group">
                      <div className="pt-0.5 shrink-0">
                        <div
                          onClick={(e) => { e.preventDefault(); toggleCheck(sub.id, norm.id); }}
                          className={`w-4 h-4 rounded-[4px] border-2 flex items-center justify-center transition-all ${
                            isChecked(sub.id)
                              ? 'bg-fluent-accent border-fluent-accent'
                              : 'border-white/10 group-hover:border-fluent-accent/40'
                          }`}
                        >
                          {isChecked(sub.id) && <Check size={10} className="text-white" strokeWidth={3} />}
                        </div>
                      </div>
                      <div className="flex-1">
                        <span className={`text-[11px] font-bold transition-all ${isChecked(sub.id) ? 'text-green-400 line-through opacity-40' : 'text-white'}`}>
                          {sub.nombre}
                        </span>
                        <p className="text-[10px] text-fluent-text-muted mt-1 leading-relaxed opacity-60">{sub.descripcion}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
