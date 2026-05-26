import { useState } from 'react';
import { Lock, CheckCircle2, Hash, FileSignature, ChevronDown } from 'lucide-react';
import TimelineCierre from './TimelineCierre';
import VerificadorHashFinal from './VerificadorHashFinal';
import ActaDisposicionFinal from './ActaDisposicionFinal';

type TabId = 'timeline' | 'hash' | 'acta';

const TABS: { id: TabId; icon: typeof Lock; label: string; sub: string }[] = [
  {
    id: 'timeline',
    icon: CheckCircle2,
    label: 'Ciclo de Vida',
    sub: 'MUCC-2017 Fases 1–6',
  },
  {
    id: 'hash',
    icon: Hash,
    label: 'Integridad SHA-256',
    sub: 'ISO/IEC 27037',
  },
  {
    id: 'acta',
    icon: FileSignature,
    label: 'Acta Disposición Final',
    sub: 'Art. 225 COPP',
  },
];

export default function CierreEvidencia() {
  const [tab, setTab] = useState<TabId>('timeline');

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-20">

      {/* ── Encabezado de la Fase ───────────────────────────── */}
      <div className="fluent-mica rounded-xl border border-white/5 overflow-hidden shadow-2xl relative">
        {/* Línea decorativa superior */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-fluent-accent/50 to-transparent" />

        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-fluent-accent/10 rounded-[6px] border border-fluent-accent/20 shadow-[0_0_20px_rgba(254,207,6,0.1)] shrink-0">
                <Lock size={24} className="text-fluent-accent" strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight leading-tight">
                  Fase 6 — Disposición Final
                </h2>
                <p className="text-xs text-white/40 font-bold uppercase tracking-[0.15em] mt-1">
                  Cierre definitivo de la cadena de custodia de evidencias
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  {['MUCC-2017', 'Art. 225 COPP', 'ISO/IEC 27037', 'PRCC 2022'].map(tag => (
                    <span
                      key={tag}
                      className="text-[8px] px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-white/30 font-black uppercase tracking-wider"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Indicador de fase */}
            <div className="shrink-0 text-right">
              <div className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Fase</div>
              <div className="text-4xl font-black text-fluent-accent/30 leading-none tabular-nums">06</div>
              <div className="text-[9px] font-black text-white/15 uppercase tracking-widest mt-1">de 06</div>
            </div>
          </div>

          {/* Banner informativo */}
          <div className="mt-6 p-4 rounded-lg bg-fluent-accent/[0.04] border border-fluent-accent/15 flex items-start gap-3">
            <ChevronDown size={13} className="text-fluent-accent/60 shrink-0 mt-0.5" />
            <p className="text-[10px] text-white/40 leading-relaxed">
              Esta es la <span className="text-fluent-accent/70 font-black">última fase del proceso forense</span>.
              Aquí se documenta el destino final de la evidencia digital, se verifica la integridad mediante
              comparación de hashes SHA-256, y se emite el Acta de Disposición Final conforme al{' '}
              <span className="text-white/60 font-bold">Manual Único de Cadena de Custodia de Evidencias Físicas
              de Venezuela (2017, actualizado 2022)</span> y el{' '}
              <span className="text-white/60 font-bold">Art. 225 del Código Orgánico Procesal Penal</span>.
            </p>
          </div>
        </div>
      </div>

      {/* ── Navegación por Tabs ─────────────────────────────── */}
      <div className="flex gap-1 p-1 rounded-lg bg-white/[0.03] border border-white/[0.06]">
        {TABS.map(t => {
          const Icon = t.icon;
          const activo = tab === t.id;
          return (
            <button
              key={t.id}
              id={`tab-${t.id}`}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-2.5 px-4 py-3 rounded-md text-left transition-all duration-200 group ${
                activo
                  ? 'bg-fluent-accent/10 border border-fluent-accent/25 shadow-[0_0_16px_rgba(254,207,6,0.08)]'
                  : 'hover:bg-white/[0.03] border border-transparent'
              }`}
            >
              <Icon
                size={14}
                className={`shrink-0 ${activo ? 'text-fluent-accent' : 'text-white/20 group-hover:text-white/40'} transition-colors`}
              />
              <div className="min-w-0">
                <p className={`text-[10px] font-black uppercase tracking-wider truncate ${
                  activo ? 'text-fluent-accent' : 'text-white/30 group-hover:text-white/50'
                }`}>
                  {t.label}
                </p>
                <p className={`text-[8px] font-mono truncate hidden sm:block ${
                  activo ? 'text-fluent-accent/50' : 'text-white/15'
                }`}>
                  {t.sub}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Contenido del Tab Activo ────────────────────────── */}
      <div className="animate-fade-in" key={tab}>
        {tab === 'timeline' && (
          <TimelineCierre />
        )}
        {tab === 'hash' && (
          <VerificadorHashFinal
            labelEvidencia="Extracción forense — Avilla Forensics"
          />
        )}
        {tab === 'acta' && (
          <ActaDisposicionFinal />
        )}
      </div>
    </div>
  );
}
