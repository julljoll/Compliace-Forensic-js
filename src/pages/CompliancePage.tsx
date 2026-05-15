import { useCMSStore, TipoNormativa } from '../store/cmsStore';
import { NORMATIVAS_ETAPAS } from '../data/normativasEtapas';
import { ShieldCheck, BookOpen, Filter } from 'lucide-react';
import { useState, useMemo } from 'react';

// ── Componentes Modulares ───────────────────────────────────────────────────
import ComplianceKPIs from '../components/Compliance/ComplianceKPIs';
import NormativaAccordion from '../components/Compliance/NormativaAccordion';

/* ── Config visual ─────────────────────────────────────────────── */
const TIPOS: (TipoNormativa | 'todos')[] = ['todos', 'ISO', 'NIST', 'LEY', 'MANUAL', 'REGLAMENTO'];

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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight flex items-center gap-4">
            <div className="p-2 rounded-[4px] bg-fluent-accent/10 border border-fluent-accent/20">
               <ShieldCheck className="text-fluent-accent" size={28} strokeWidth={2.5} />
            </div>
            Compliance Control
          </h1>
          <p className="text-sm text-fluent-text-muted font-medium max-w-lg mt-2 leading-relaxed">
            Technical monitoring of regulatory compliance based on international standards and current forensic legal frameworks.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 mr-2 text-fluent-text-muted/40 uppercase font-black text-[9px] tracking-widest">
             <Filter size={12} strokeWidth={3} />
             <span>Filter</span>
          </div>
          {TIPOS.map(t => (
            <button key={t} onClick={() => setTipoFiltro(t)}
              className={`text-[10px] px-4 py-1.5 rounded-[4px] font-black uppercase transition-all tracking-wider ${tipoFiltro === t ? 'bg-fluent-accent text-white shadow-lg' : 'bg-white/[0.03] text-fluent-text-muted hover:text-white border border-white/5 hover:bg-white/10'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <ComplianceKPIs stats={globalStats} totalNormativas={normativas.filter(n => n.activa).length} />

      {/* Barra de progreso global */}
      <div className="fluent-mica p-6 rounded-xl border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-fluent-accent/30 to-transparent" />
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-bold text-white text-sm tracking-tight">Global Implementation Status</h3>
          <span className="text-[10px] font-black font-mono text-fluent-accent bg-fluent-accent/10 px-3 py-1 rounded-[4px] border border-fluent-accent/20 uppercase tracking-widest">
            {globalStats.checkedStages} / {globalStats.totalStages} Stages Verified
          </span>
        </div>
        <div className="w-full h-2.5 bg-white/[0.03] rounded-full overflow-hidden border border-white/5 p-[1px]">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-in-out relative group"
            style={{
              width: `${globalStats.pct}%`,
              background: globalStats.pct >= 80 
                ? 'linear-gradient(90deg, #22c55e, #4ade80)' 
                : globalStats.pct >= 50 
                  ? 'linear-gradient(90deg, #0078d4, #479ef5)' 
                  : 'linear-gradient(90deg, #ef4444, #f87171)',
            }}
          >
             <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-30 transition-opacity" />
          </div>
        </div>
        <div className="mt-3 flex justify-between text-[10px] font-black text-fluent-text-muted/40 uppercase tracking-[0.2em]">
           <span>Technical Baseline</span>
           <span className="text-fluent-text font-black">{globalStats.pct}% Complete</span>
        </div>
      </div>

      {/* Normativas con Etapas */}
      <div className="space-y-4 mt-10">
        {normativasFiltradas.length === 0 ? (
          <div className="fluent-mica p-16 text-center rounded-xl">
             <p className="text-fluent-text-muted font-bold uppercase text-xs tracking-widest opacity-40">No active frameworks detected for this filter.</p>
          </div>
        ) : normativasFiltradas.map(norm => {
          const ne = NORMATIVAS_ETAPAS.find(x => x.normativaId === norm.id);
          const progress = getNormProgress(norm.id);
          const isExpanded = expandedNorm === norm.id;

          return (
            <NormativaAccordion 
              key={norm.id}
              norm={norm}
              isExpanded={isExpanded}
              onToggle={setExpandedNorm}
              progress={progress}
              ne={ne}
              isChecked={isChecked}
              getCheckDate={getCheckDate}
              toggleCheck={toggleComplianceCheck}
            />
          );
        })}
      </div>

      {/* Nota RAG */}
      <div className="fluent-mica p-8 border-fluent-accent/10 bg-fluent-accent/[0.02] rounded-2xl relative overflow-hidden group mt-12">
        <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
          <ShieldCheck size={120} className="text-fluent-accent" />
        </div>
        <div className="flex items-start gap-6 relative z-10">
          <div className="p-4 bg-fluent-accent/10 rounded-[4px] text-fluent-accent shadow-lg shadow-fluent-accent/10">
            <BookOpen size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg mb-2 tracking-tight">Regulatory Knowledge Base (RAG)</h3>
            <p className="text-sm text-fluent-text-muted leading-relaxed max-w-4xl font-medium opacity-80">
              The technical guidelines and stages presented have been synthesized from reference frameworks stored in the <code className="font-mono text-fluent-accent bg-black/40 px-2 py-0.5 rounded border border-fluent-accent/20">/RAG</code> module. 
              This includes ISO 27037/27042, NIST SP 800-101, MUCC-2017, and Venezuelan legislation (LEDI, LMDF, COPP). 
              The system ensures every forensic action remains traceable to recognized quality standards.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
