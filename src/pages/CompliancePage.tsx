import { useCMSStore, TipoNormativa } from '../store/cmsStore';
import { NORMATIVAS_ETAPAS } from '../data/normativasEtapas';
import { ShieldCheck, BookOpen, Filter } from '../components/atoms/AppleIcon';
import { useState, useMemo } from 'react';

// ── Componentes Modulares ───────────────────────────────────────────────────
import ComplianceKPIs from '../components/organisms/Compliance/ComplianceKPIs';
import NormativaAccordion from '../components/molecules/NormativaAccordion';

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
    <div className="space-y-8 apple-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-bold text-apple-text tracking-tight flex items-center gap-4">
            <div className="p-2 rounded-[4px] bg-apple-accent/10 border border-apple-accent/20">
               <ShieldCheck className="text-apple-accent" size={28} strokeWidth={2.5} />
            </div>
            Control de Cumplimiento
          </h1>
          <p className="text-sm text-apple-text-secondary font-medium max-w-lg mt-2 leading-relaxed">
            Monitoreo técnico del cumplimiento regulatorio basado en estándares internacionales y marcos legales forenses vigentes.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 mr-2 text-apple-text-secondary/40 uppercase font-bold text-[9px] tracking-widest">
             <Filter size={12} strokeWidth={3} />
              <span>Filtrar</span>
          </div>
          {TIPOS.map(t => (
            <button key={t} onClick={() => setTipoFiltro(t)}
              className={`text-[10px] px-4 py-1.5 rounded-[6px] font-bold uppercase transition-all tracking-wider ${tipoFiltro === t ? 'bg-apple-accent text-white shadow-lg' : 'bg-black/[0.04] text-apple-text-secondary hover:text-apple-text border border-transparent'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <ComplianceKPIs stats={globalStats} totalNormativas={normativas.filter(n => n.activa).length} />

      {/* Barra de progreso global */}
      <div className="apple-card p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-apple-accent/30 to-transparent" />
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-bold text-apple-text text-sm tracking-tight">Estado de Implementación Global</h3>
          <span className="text-[10px] font-bold font-mono text-apple-accent bg-apple-accent/10 px-3 py-1 rounded-[4px] border border-apple-accent/20 uppercase tracking-widest">
            {globalStats.checkedStages} / {globalStats.totalStages} Etapas Verificadas
          </span>
        </div>
        <div className="w-full h-2.5 bg-black/[0.05] rounded-full overflow-hidden p-[1px]">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-in-out relative group"
            style={{
              width: `${globalStats.pct}%`,
              background: globalStats.pct >= 80 
                ? 'linear-gradient(90deg, #34C759, #30b651)' 
                : globalStats.pct >= 50 
                  ? 'linear-gradient(90deg, #0071E3, #0077ED)' 
                  : 'linear-gradient(90deg, #FF3B30, #FF453A)',
            }}
          >
             <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-30 transition-opacity" />
          </div>
        </div>
        <div className="mt-3 flex justify-between text-[10px] font-bold text-apple-text-secondary/40 uppercase tracking-[0.2em]">
           <span>Línea Base Técnica</span>
            <span className="text-apple-text font-bold">{globalStats.pct}% Completado</span>
        </div>
      </div>

      {/* Normativas con Etapas */}
      <div className="space-y-4 mt-10">
        {normativasFiltradas.length === 0 ? (
          <div className="apple-card p-16 text-center">
              <p className="text-apple-text-secondary font-bold uppercase text-xs tracking-widest opacity-40">No se detectaron marcos activos para este filtro.</p>
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
      <div className="apple-card !p-8 !border-[#0071E3]/15 bg-[#0071E3]/[0.02] rounded-2xl relative overflow-hidden group mt-12">
        <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
          <ShieldCheck size={120} className="text-apple-accent" />
        </div>
        <div className="flex items-start gap-6 relative z-10">
          <div className="p-4 bg-apple-accent/10 rounded-[4px] text-apple-accent shadow-lg shadow-apple-accent/10">
            <BookOpen size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="font-bold text-apple-text text-lg mb-2 tracking-tight">Base de Conocimiento Regulatorio (RAG)</h3>
            <p className="text-sm text-apple-text-secondary leading-relaxed max-w-4xl font-medium opacity-80">
              Las guías técnicas y etapas presentadas han sido sintetizadas desde marcos de referencia almacenados en el módulo <code className="font-mono text-apple-accent bg-black/[0.04] px-2 py-0.5 rounded border border-apple-accent/15">/RAG</code>. 
              Esto incluye ISO 27037/27042, NIST SP 800-101, MUCC-2017 y legislación venezolana (LEDI, LMDF, COPP). 
              El sistema garantiza que toda acción forense permanezca trazable hasta estándares de calidad reconocidos.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
