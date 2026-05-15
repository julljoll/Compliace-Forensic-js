import { ChevronDown, ChevronRight, Check, BookOpen } from 'lucide-react';
import { Normativa } from '../../store/cmsStore';

interface NormativaAccordionProps {
  norm: Normativa;
  isExpanded: boolean;
  onToggle: (id: string | null) => void;
  progress: { total: number; checked: number; pct: number };
  tipoColor: string;
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
  tipoColor,
  ne,
  isChecked,
  getCheckDate,
  toggleCheck,
}: NormativaAccordionProps) {
  return (
    <div className={`cms-card overflow-hidden border ${isExpanded ? 'border-cms-accent/40 shadow-lg shadow-cms-accent/5' : 'border-cms-border'} transition-all`}>
      {/* Header de normativa */}
      <button
        onClick={() => onToggle(isExpanded ? null : norm.id)}
        className={`w-full p-5 flex items-center gap-4 text-left transition-colors hover:bg-cms-surface/50 bg-gradient-to-r ${tipoColor}`}
      >
        <div className="shrink-0">
          {isExpanded ? <ChevronDown size={18} className="text-cms-accent" /> : <ChevronRight size={18} className="text-cms-textMuted" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-mono font-black text-cms-accent text-sm">{norm.codigo}</span>
            <span className="text-[9px] px-2 py-0.5 rounded bg-cms-bg/50 border border-cms-border text-cms-textMuted font-bold uppercase tracking-wider">{norm.tipo}</span>
            {progress.pct === 100 && (
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-green-500/20 border border-green-500/30 text-green-300 font-bold flex items-center gap-1 animate-pulse">
                <Check size={8} strokeWidth={4} /> COMPLETO
              </span>
            )}
          </div>
          <p className="text-xs text-white font-bold truncate">{norm.nombre}</p>
        </div>
        <div className="shrink-0 text-right">
          <div className="flex items-center gap-3">
            <div className="w-24 h-2 bg-cms-bg/50 rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-cms-accent rounded-full transition-all duration-700 ease-out" style={{ width: `${progress.pct}%` }} />
            </div>
            <span className={`text-xs font-black min-w-[3rem] ${progress.pct === 100 ? 'text-green-400' : progress.pct > 0 ? 'text-yellow-400' : 'text-cms-textMuted'}`}>
              {progress.checked}/{progress.total}
            </span>
          </div>
        </div>
      </button>

      {/* Etapas expandidas */}
      {isExpanded && ne && (
        <div className="border-t border-cms-border divide-y divide-cms-border/30 bg-cms-sidebar/20 animate-in slide-in-from-top-2 duration-200">
          {ne.etapas.map((etapa: any) => (
            <div key={etapa.id} className="bg-cms-bg/30">
              {/* Etapa principal */}
              {etapa.subetapas ? (
                <div className="px-5 py-3 bg-cms-surface/20">
                  <div className="flex items-center gap-2">
                    <BookOpen size={14} className="text-cms-accent shrink-0" />
                    <span className="text-sm font-bold text-white/90">{etapa.nombre}</span>
                  </div>
                  <p className="text-[11px] text-cms-textMuted mt-1 ml-6">{etapa.descripcion}</p>
                </div>
              ) : (
                <label className="flex items-start gap-3 px-5 py-3 cursor-pointer hover:bg-cms-surface/40 transition-all group relative">
                  <div className="pt-0.5 shrink-0">
                    <div
                      onClick={(e) => { e.preventDefault(); toggleCheck(etapa.id, norm.id); }}
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer ${
                        isChecked(etapa.id)
                          ? 'bg-green-500 border-green-500 shadow-lg shadow-green-500/20'
                          : 'border-cms-border group-hover:border-cms-accent/50'
                      }`}
                    >
                      {isChecked(etapa.id) && <Check size={12} className="text-white" strokeWidth={3} />}
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className={`text-sm font-semibold transition-all ${isChecked(etapa.id) ? 'text-green-400 line-through opacity-60' : 'text-white'}`}>
                      {etapa.nombre}
                    </span>
                    <p className="text-[11px] text-cms-textMuted mt-0.5 group-hover:text-cms-text transition-colors">{etapa.descripcion}</p>
                    {isChecked(etapa.id) && getCheckDate(etapa.id) && (
                      <p className="text-[9px] text-green-400/70 mt-1 font-medium italic">✓ Verificado: {new Date(getCheckDate(etapa.id)!).toLocaleString('es')}</p>
                    )}
                  </div>
                </label>
              )}

              {/* Sub-etapas */}
              {etapa.subetapas && (
                <div className="ml-8 border-l-2 border-cms-border/20 mb-2">
                  {etapa.subetapas.map((sub: any) => (
                    <label key={sub.id} className="flex items-start gap-3 px-5 py-2.5 cursor-pointer hover:bg-cms-surface/30 transition-all group">
                      <div className="pt-0.5 shrink-0">
                        <div
                          onClick={(e) => { e.preventDefault(); toggleCheck(sub.id, norm.id); }}
                          className={`w-[18px] h-[18px] rounded border-2 flex items-center justify-center transition-all cursor-pointer ${
                            isChecked(sub.id)
                              ? 'bg-green-500 border-green-500 shadow-lg shadow-green-500/20'
                              : 'border-cms-border group-hover:border-cms-accent/50'
                          }`}
                        >
                          {isChecked(sub.id) && <Check size={10} className="text-white" strokeWidth={3} />}
                        </div>
                      </div>
                      <div className="flex-1">
                        <span className={`text-xs font-semibold transition-all ${isChecked(sub.id) ? 'text-green-400 line-through opacity-60' : 'text-white'}`}>
                          {sub.nombre}
                        </span>
                        <p className="text-[10px] text-cms-textMuted mt-0.5 group-hover:text-cms-text transition-colors">{sub.descripcion}</p>
                        {isChecked(sub.id) && getCheckDate(sub.id) && (
                          <p className="text-[9px] text-green-400/70 mt-0.5 italic">✓ {new Date(getCheckDate(sub.id)!).toLocaleString('es')}</p>
                        )}
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
