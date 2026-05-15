import { useCMSStore, TipoNormativa } from '../store/cmsStore';
import { NORMATIVAS_ETAPAS } from '../data/normativasEtapas';
import { ShieldCheck, BookOpen, Filter } from 'lucide-react';
import { useState, useMemo } from 'react';

// ── Componentes Modulares ───────────────────────────────────────────────────
import ComplianceKPIs from '../components/Compliance/ComplianceKPIs';
import NormativaAccordion from '../components/Compliance/NormativaAccordion';

/* ── Config visual ─────────────────────────────────────────────── */
const TIPOS: (TipoNormativa | 'todos')[] = ['todos', 'ISO', 'NIST', 'LEY', 'MANUAL', 'REGLAMENTO'];

const TIPO_COLORS: Record<string, string> = {
  ISO: 'from-blue-500/20 to-blue-600/5 border-blue-500/30',
  NIST: 'from-purple-500/20 to-purple-600/5 border-purple-500/30',
  LEY: 'from-red-500/20 to-red-600/5 border-red-500/30',
  MANUAL: 'from-yellow-500/20 to-yellow-600/5 border-yellow-500/30',
  REGLAMENTO: 'from-green-500/20 to-green-600/5 border-green-500/30',
};

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
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <ShieldCheck className="text-cms-accent" size={32} />
            Panel de Compliance
          </h1>
          <p className="text-sm text-cms-textMuted font-medium max-w-lg">
            Seguimiento de cumplimiento normativo basado en estándares internacionales y marcos legales vigentes.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={14} className="text-cms-textMuted" />
          {TIPOS.map(t => (
            <button key={t} onClick={() => setTipoFiltro(t)}
              className={`text-[10px] px-3 py-1.5 rounded-lg font-bold uppercase transition-all ${tipoFiltro === t ? 'bg-cms-accent text-white shadow-lg shadow-cms-accent/20' : 'bg-cms-surface/50 text-cms-textMuted hover:text-white border border-cms-border hover:bg-cms-surface'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <ComplianceKPIs stats={globalStats} totalNormativas={normativas.filter(n => n.activa).length} />

      {/* Barra de progreso global */}
      <div className="cms-card p-6 bg-cms-sidebar/40 border-cms-accent/10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-white text-sm">Estado General de Implementación</h3>
          <span className="text-xs font-mono font-bold text-cms-accent bg-cms-accent/10 px-2 py-0.5 rounded-full">
            {globalStats.checkedStages} / {globalStats.totalStages} ETAPAS
          </span>
        </div>
        <div className="w-full h-4 bg-cms-bg rounded-full overflow-hidden border border-white/5 shadow-inner">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-in-out relative"
            style={{
              width: `${globalStats.pct}%`,
              background: globalStats.pct >= 80 
                ? 'linear-gradient(90deg, #22c55e, #4ade80)' 
                : globalStats.pct >= 50 
                  ? 'linear-gradient(90deg, #3b82f6, #60cdff)' 
                  : 'linear-gradient(90deg, #ef4444, #f87171)',
            }}
          >
             <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50" />
          </div>
        </div>
      </div>

      {/* Normativas con Etapas */}
      <div className="space-y-4">
        {normativasFiltradas.length === 0 ? (
          <div className="cms-card p-12 text-center">
             <p className="text-cms-textMuted font-medium">No se encontraron normativas activas para el filtro seleccionado.</p>
          </div>
        ) : normativasFiltradas.map(norm => {
          const ne = NORMATIVAS_ETAPAS.find(x => x.normativaId === norm.id);
          const progress = getNormProgress(norm.id);
          const isExpanded = expandedNorm === norm.id;
          const tipoColor = TIPO_COLORS[norm.tipo] || 'from-gray-500/20 to-gray-600/5 border-gray-500/30';

          return (
            <NormativaAccordion 
              key={norm.id}
              norm={norm}
              isExpanded={isExpanded}
              onToggle={setExpandedNorm}
              progress={progress}
              tipoColor={tipoColor}
              ne={ne}
              isChecked={isChecked}
              getCheckDate={getCheckDate}
              toggleCheck={toggleComplianceCheck}
            />
          );
        })}
      </div>

      {/* Nota RAG */}
      <div className="cms-card p-6 border-cms-accent/30 bg-cms-accent/5 backdrop-blur-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <ShieldCheck size={80} className="text-cms-accent" />
        </div>
        <div className="flex items-start gap-4 relative z-10">
          <div className="p-3 bg-cms-accent/10 rounded-xl text-cms-accent">
            <BookOpen size={20} />
          </div>
          <div>
            <h3 className="font-black text-white text-base mb-1 tracking-tight">Base de Conocimiento Normativa (RAG)</h3>
            <p className="text-xs text-cms-textMuted leading-relaxed max-w-3xl">
              Las directrices y etapas técnicas presentadas han sido sintetizadas a partir de los marcos de referencia almacenados en el módulo <code className="font-mono text-cms-accent bg-cms-bg px-1.5 py-0.5 rounded border border-cms-accent/20">/RAG</code>, incluyendo 
              ISO 27037/27042, NIST SP 800-101, MUCC-2017 y la legislación venezolana vigente (LEDI, LMDF, COPP). 
              Este sistema garantiza que cada actuación pericial sea trazable a un estándar de calidad reconocido.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
