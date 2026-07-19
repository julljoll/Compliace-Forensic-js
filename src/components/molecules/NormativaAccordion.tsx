import { ChevronRight, Check, BookOpen } from '../atoms/AppleIcon';
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
    <div className={`apple-card overflow-hidden border transition-all duration-300 ${isExpanded ? 'border-[var(--apple-border-strong)]' : 'border-[var(--apple-border)]'}`}>
      <button
        onClick={() => onToggle(isExpanded ? null : norm.id)}
        className={`w-full p-4 flex items-center gap-4 text-left transition-all hover:bg-white/5 ${isExpanded ? 'bg-black/10' : ''}`}
      >
        <div className={`shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>
          <ChevronRight size={16} className={isExpanded ? 'text-[var(--apple-accent)]' : 'text-[#86868B]'} strokeWidth={2.5} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono font-bold text-[var(--apple-accent)] text-[12px] tracking-tight">{norm.codigo}</span>
            <span className="text-[8px] px-2 py-0.5 rounded-md bg-black/20 text-[#86868B] font-semibold uppercase tracking-[0.04em]">{norm.tipo}</span>
            {progress.pct === 100 && (
              <span className="text-[8px] px-2 py-0.5 rounded-md bg-[#00FF41]/10 text-[#00FF41] font-semibold flex items-center gap-1">
                <Check size={8} strokeWidth={3} /> Completo
              </span>
            )}
          </div>
          <p className="text-[14px] text-white font-semibold truncate tracking-tight">{norm.nombre}</p>
        </div>
        <div className="shrink-0 text-right ml-4">
          <div className="flex items-center gap-3">
            <div className="hidden sm:block w-20 h-1.5 bg-black/20 rounded-full overflow-hidden">
              <div className="h-full bg-[var(--apple-accent)] rounded-full transition-all duration-1000" style={{ width: `${progress.pct}%` }} />
            </div>
            <span className={`text-[11px] font-semibold min-w-[2.5rem] ${progress.pct === 100 ? 'text-[#00FF41]' : progress.pct > 0 ? 'text-[var(--apple-accent)]' : 'text-[#86868B]'}`}>
              {progress.checked}/{progress.total}
            </span>
          </div>
        </div>
      </button>

      {isExpanded && ne && (
        <div className="border-t border-[var(--apple-border)] divide-y divide-white/5 bg-black/15">
          {ne.etapas.map((etapa: any) => (
            <div key={etapa.id}>
              {etapa.subetapas ? (
                <div className="px-6 py-4 bg-black/20">
                  <div className="flex items-center gap-2 mb-1.5">
                    <BookOpen size={14} className="text-[var(--apple-accent)] shrink-0" strokeWidth={2} />
                    <span className="text-[12px] font-semibold text-white tracking-tight">{etapa.nombre}</span>
                  </div>
                  <p className="text-[12px] text-[#86868B] leading-relaxed max-w-2xl ml-6">{etapa.descripcion}</p>
                </div>
              ) : (
                <div className="flex items-start gap-4 px-6 py-3.5 hover:bg-white/5 transition-all group">
                  <div className="pt-0.5 shrink-0">
                    <button
                      onClick={() => toggleCheck(etapa.id, norm.id)}
                      className={`w-[18px] h-[18px] rounded-md border-2 flex items-center justify-center transition-all ${
                        isChecked(etapa.id)
                          ? 'bg-[var(--apple-accent)] border-[var(--apple-accent)]'
                          : 'border-white/20 group-hover:border-[var(--apple-accent)]'
                      }`}
                    >
                      {isChecked(etapa.id) && <Check size={12} className="text-black" strokeWidth={3} />}
                    </button>
                  </div>
                  <div className="flex-1">
                    <span className={`text-[13px] font-medium transition-all ${isChecked(etapa.id) ? 'text-[#86868B] line-through' : 'text-white'}`}>
                      {etapa.nombre}
                    </span>
                    <p className="text-[11px] text-[#86868B] mt-0.5 leading-relaxed">{etapa.descripcion}</p>
                    {isChecked(etapa.id) && getCheckDate(etapa.id) && (
                      <p className="text-[10px] text-[#00FF41] mt-1 font-medium">✓ {new Date(getCheckDate(etapa.id)!).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              )}

              {etapa.subetapas && (
                <div className="ml-10 border-l-2 border-white/10 mb-4 mt-1">
                  {etapa.subetapas.map((sub: any) => (
                    <div key={sub.id} className="flex items-start gap-4 px-6 py-2.5 hover:bg-white/5 transition-all group">
                      <div className="pt-0.5 shrink-0">
                        <button
                          onClick={() => toggleCheck(sub.id, norm.id)}
                          className={`w-4 h-4 rounded-md border-2 flex items-center justify-center transition-all ${
                            isChecked(sub.id)
                              ? 'bg-[var(--apple-accent)] border-[var(--apple-accent)]'
                              : 'border-white/12 group-hover:border-[var(--apple-accent)]'
                          }`}
                        >
                          {isChecked(sub.id) && <Check size={10} className="text-black" strokeWidth={3} />}
                        </button>
                      </div>
                      <div className="flex-1">
                        <span className={`text-[12px] font-medium transition-all ${isChecked(sub.id) ? 'text-[#86868B] line-through' : 'text-white'}`}>
                          {sub.nombre}
                        </span>
                        <p className="text-[11px] text-[#86868B] mt-0.5">{sub.descripcion}</p>
                      </div>
                    </div>
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
