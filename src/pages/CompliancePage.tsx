import { useCMSStore } from '../store/cmsStore';
import { NORMATIVAS_ETAPAS } from '../data/normativasEtapas';
import {
  ShieldCheck, CheckCircle2, Clock,
  ChevronDown, ChevronRight, BookOpen, Filter, Check, ListChecks,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import type { TipoNormativa } from '../store/cmsStore';

/* ── Config visual ─────────────────────────────────────────────── */
const TIPOS: (TipoNormativa | 'todos')[] = ['todos', 'ISO', 'NIST', 'LEY', 'MANUAL', 'REGLAMENTO'];

const TIPO_COLORS: Record<string, string> = {
  ISO: 'from-blue-500/20 to-blue-600/5 border-blue-500/30',
  NIST: 'from-purple-500/20 to-purple-600/5 border-purple-500/30',
  LEY: 'from-red-500/20 to-red-600/5 border-red-500/30',
  MANUAL: 'from-yellow-500/20 to-yellow-600/5 border-yellow-500/30',
  REGLAMENTO: 'from-green-500/20 to-green-600/5 border-green-500/30',
};

/* ── Componente Principal ──────────────────────────────────────── */
export default function CompliancePage() {
  const { normativas, complianceChecklist, toggleComplianceCheck } = useCMSStore();
  const [tipoFiltro, setTipoFiltro] = useState<TipoNormativa | 'todos'>('todos');
  const [expandedNorm, setExpandedNorm] = useState<string | null>(null);

  const normativasFiltradas = normativas.filter(
    n => n.activa && (tipoFiltro === 'todos' || n.tipo === tipoFiltro)
  );

  /* Estadísticas globales */
  const globalStats = useMemo(() => {
    let totalStages = 0;
    let checkedStages = 0;
    NORMATIVAS_ETAPAS.forEach(ne => {
      ne.etapas.forEach(et => {
        if (et.subetapas) {
          et.subetapas.forEach(sub => {
            totalStages++;
            if (complianceChecklist.find(c => c.stageId === sub.id && c.checked)) checkedStages++;
          });
        } else {
          totalStages++;
          if (complianceChecklist.find(c => c.stageId === et.id && c.checked)) checkedStages++;
        }
      });
    });
    return { totalStages, checkedStages, pct: totalStages > 0 ? Math.round((checkedStages / totalStages) * 100) : 0 };
  }, [complianceChecklist]);

  /* Helper: progreso de una normativa */
  const getNormProgress = (normId: string) => {
    const ne = NORMATIVAS_ETAPAS.find(x => x.normativaId === normId);
    if (!ne) return { total: 0, checked: 0, pct: 0 };
    let total = 0, checked = 0;
    ne.etapas.forEach(et => {
      if (et.subetapas) {
        et.subetapas.forEach(sub => {
          total++;
          if (complianceChecklist.find(c => c.stageId === sub.id && c.checked)) checked++;
        });
      } else {
        total++;
        if (complianceChecklist.find(c => c.stageId === et.id && c.checked)) checked++;
      }
    });
    return { total, checked, pct: total > 0 ? Math.round((checked / total) * 100) : 0 };
  };

  const isChecked = (stageId: string) => !!complianceChecklist.find(c => c.stageId === stageId && c.checked);
  const getCheckDate = (stageId: string) => complianceChecklist.find(c => c.stageId === stageId)?.fechaCheck;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white mb-1 flex items-center gap-3">
          <ShieldCheck className="text-cms-accent" size={24} />
          Panel de Compliance
        </h1>
        <p className="text-sm text-cms-textMuted">
          Seguimiento etapa por etapa de cada normativa · Marca cada etapa completada
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Progreso Global', value: `${globalStats.pct}%`, color: globalStats.pct >= 80 ? 'text-green-400' : globalStats.pct >= 50 ? 'text-yellow-400' : 'text-red-400', icon: ShieldCheck },
          { label: 'Etapas Completadas', value: globalStats.checkedStages, color: 'text-green-400', icon: CheckCircle2 },
          { label: 'Etapas Pendientes', value: globalStats.totalStages - globalStats.checkedStages, color: 'text-yellow-400', icon: Clock },
          { label: 'Total Normativas', value: normativas.filter(n => n.activa).length, color: 'text-cms-accent', icon: ListChecks },
        ].map(kpi => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="cms-card p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-cms-textMuted">{kpi.label}</p>
                <Icon size={16} className={kpi.color} />
              </div>
              <div className={`text-3xl font-black ${kpi.color}`}>{kpi.value}</div>
            </div>
          );
        })}
      </div>

      {/* Barra de progreso global */}
      <div className="cms-card p-6">
        <h3 className="font-bold text-white mb-4 text-sm">Progreso Global de Compliance — {globalStats.checkedStages}/{globalStats.totalStages} etapas</h3>
        <div className="w-full h-3 bg-cms-surface rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${globalStats.pct}%`,
              background: globalStats.pct >= 80 ? 'linear-gradient(90deg, #22c55e, #4ade80)' : globalStats.pct >= 50 ? 'linear-gradient(90deg, #eab308, #facc15)' : 'linear-gradient(90deg, #ef4444, #f87171)',
            }}
          />
        </div>
      </div>

      {/* Filtro por tipo */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter size={14} className="text-cms-textMuted" />
        {TIPOS.map(t => (
          <button key={t} onClick={() => setTipoFiltro(t)}
            className={`text-[10px] px-3 py-1.5 rounded-lg font-bold uppercase transition-colors ${tipoFiltro === t ? 'bg-cms-accent text-white' : 'bg-cms-surface text-cms-textMuted hover:text-white border border-cms-border'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Normativas con Etapas */}
      <div className="space-y-4">
        {normativasFiltradas.map(norm => {
          const ne = NORMATIVAS_ETAPAS.find(x => x.normativaId === norm.id);
          const progress = getNormProgress(norm.id);
          const isExpanded = expandedNorm === norm.id;
          const tipoColor = TIPO_COLORS[norm.tipo] || 'from-gray-500/20 to-gray-600/5 border-gray-500/30';

          return (
            <div key={norm.id} className={`cms-card overflow-hidden border ${isExpanded ? 'border-cms-accent/40' : 'border-cms-border'} transition-all`}>
              {/* Header de normativa */}
              <button
                onClick={() => setExpandedNorm(isExpanded ? null : norm.id)}
                className={`w-full p-5 flex items-center gap-4 text-left transition-colors hover:bg-cms-surface/50 bg-gradient-to-r ${tipoColor}`}
              >
                <div className="shrink-0">
                  {isExpanded ? <ChevronDown size={18} className="text-cms-accent" /> : <ChevronRight size={18} className="text-cms-textMuted" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-mono font-black text-cms-accent text-sm">{norm.codigo}</span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-cms-bg/50 border border-cms-border text-cms-textMuted">{norm.tipo}</span>
                    {progress.pct === 100 && <span className="text-[9px] px-2 py-0.5 rounded-full bg-green-500/20 border border-green-500/30 text-green-300 font-bold flex items-center gap-1"><Check size={8} />COMPLETO</span>}
                  </div>
                  <p className="text-xs text-white font-semibold truncate">{norm.nombre}</p>
                </div>
                <div className="shrink-0 text-right">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-cms-bg/50 rounded-full overflow-hidden">
                      <div className="h-full bg-cms-accent rounded-full transition-all duration-500" style={{ width: `${progress.pct}%` }} />
                    </div>
                    <span className={`text-xs font-black ${progress.pct === 100 ? 'text-green-400' : progress.pct > 0 ? 'text-yellow-400' : 'text-cms-textMuted'}`}>
                      {progress.checked}/{progress.total}
                    </span>
                  </div>
                </div>
              </button>

              {/* Etapas expandidas */}
              {isExpanded && ne && (
                <div className="border-t border-cms-border divide-y divide-cms-border/50">
                  {ne.etapas.map((etapa) => (
                    <div key={etapa.id} className="bg-cms-bg/30">
                      {/* Etapa principal */}
                      {etapa.subetapas ? (
                        <div className="px-5 py-3 bg-cms-surface/30">
                          <div className="flex items-center gap-2">
                            <BookOpen size={14} className="text-cms-accent shrink-0" />
                            <span className="text-sm font-bold text-white">{etapa.nombre}</span>
                          </div>
                          <p className="text-[11px] text-cms-textMuted mt-1 ml-6">{etapa.descripcion}</p>
                        </div>
                      ) : (
                        <label className="flex items-start gap-3 px-5 py-3 cursor-pointer hover:bg-cms-surface/40 transition-colors group">
                          <div className="pt-0.5 shrink-0">
                            <div
                              onClick={(e) => { e.preventDefault(); toggleComplianceCheck(etapa.id, norm.id); }}
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
                            <span className={`text-sm font-semibold ${isChecked(etapa.id) ? 'text-green-300 line-through opacity-80' : 'text-white'}`}>
                              {etapa.nombre}
                            </span>
                            <p className="text-[11px] text-cms-textMuted mt-0.5">{etapa.descripcion}</p>
                            {isChecked(etapa.id) && getCheckDate(etapa.id) && (
                              <p className="text-[9px] text-green-400/70 mt-1">✓ Verificado: {new Date(getCheckDate(etapa.id)!).toLocaleString('es')}</p>
                            )}
                          </div>
                        </label>
                      )}

                      {/* Sub-etapas */}
                      {etapa.subetapas && (
                        <div className="ml-6 border-l-2 border-cms-border/30">
                          {etapa.subetapas.map(sub => (
                            <label key={sub.id} className="flex items-start gap-3 px-5 py-2.5 cursor-pointer hover:bg-cms-surface/30 transition-colors group">
                              <div className="pt-0.5 shrink-0">
                                <div
                                  onClick={(e) => { e.preventDefault(); toggleComplianceCheck(sub.id, norm.id); }}
                                  className={`w-4.5 h-4.5 w-[18px] h-[18px] rounded border-2 flex items-center justify-center transition-all cursor-pointer ${
                                    isChecked(sub.id)
                                      ? 'bg-green-500 border-green-500 shadow-lg shadow-green-500/20'
                                      : 'border-cms-border group-hover:border-cms-accent/50'
                                  }`}
                                >
                                  {isChecked(sub.id) && <Check size={10} className="text-white" strokeWidth={3} />}
                                </div>
                              </div>
                              <div className="flex-1">
                                <span className={`text-xs font-semibold ${isChecked(sub.id) ? 'text-green-300 line-through opacity-80' : 'text-white'}`}>
                                  {sub.nombre}
                                </span>
                                <p className="text-[10px] text-cms-textMuted mt-0.5">{sub.descripcion}</p>
                                {isChecked(sub.id) && getCheckDate(sub.id) && (
                                  <p className="text-[9px] text-green-400/70 mt-0.5">✓ {new Date(getCheckDate(sub.id)!).toLocaleString('es')}</p>
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
        })}
      </div>

      {/* Nota RAG */}
      <div className="cms-card p-5 border-cms-accent/20 bg-cms-accent/5">
        <div className="flex items-start gap-3">
          <BookOpen size={18} className="text-cms-accent shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-white text-sm mb-1">Contenido extraído de RAG/</h3>
            <p className="text-xs text-cms-textMuted leading-relaxed">
              Las etapas mostradas fueron extraídas de los documentos normativos en la carpeta <code className="font-mono text-cms-accent bg-cms-surface px-1 py-0.5 rounded">RAG/</code>: 
              ISO 27037, ISO 27042, NIST 800-101, MUCC-2017, ACPO v5, LEDI, LMDF, COPP y CENIF.
              El progreso se persiste localmente y puede consultarse en cualquier momento.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
