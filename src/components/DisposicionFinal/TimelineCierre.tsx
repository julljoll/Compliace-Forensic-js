import { CheckCircle2, Clock, Circle, ChevronRight } from 'lucide-react';

interface Fase {
  id: string;
  numero: number;
  nombre: string;
  descripcion: string;
  normativa: string;
  completada: boolean;
  fechaReal?: string;
}

interface TimelineCierreProps {
  fechaConsignacion?: string;
  fechaAdquisicion?: string;
  fechaAnalisis?: string;
  fechaInforme?: string;
  fechaJudicial?: string;
  fechaCierre?: string;
}

export default function TimelineCierre({
  fechaConsignacion,
  fechaAdquisicion,
  fechaAnalisis,
  fechaInforme,
  fechaJudicial,
  fechaCierre,
}: TimelineCierreProps) {
  const fases: Fase[] = [
    {
      id: 'obtencion',
      numero: 1,
      nombre: 'Obtención',
      descripcion: 'Consignación y registro físico de la evidencia',
      normativa: 'MUCC-2017 Cap. I',
      completada: !!fechaConsignacion,
      fechaReal: fechaConsignacion,
    },
    {
      id: 'adquisicion',
      numero: 2,
      nombre: 'Adquisición',
      descripcion: 'Extracción forense en modo solo-lectura',
      normativa: 'ISO/IEC 27037',
      completada: !!fechaAdquisicion,
      fechaReal: fechaAdquisicion,
    },
    {
      id: 'analisis',
      numero: 3,
      nombre: 'Análisis',
      descripcion: 'Procesamiento y parseo de artefactos digitales',
      normativa: 'ISO/IEC 27042',
      completada: !!fechaAnalisis,
      fechaReal: fechaAnalisis,
    },
    {
      id: 'informe',
      numero: 4,
      nombre: 'Dictamen Pericial',
      descripcion: 'Elaboración del informe técnico-legal',
      normativa: 'COPP Art. 187',
      completada: !!fechaInforme,
      fechaReal: fechaInforme,
    },
    {
      id: 'judicial',
      numero: 5,
      nombre: 'Fase Judicial',
      descripcion: 'Presentación ante el tribunal competente',
      normativa: 'COPP Art. 225',
      completada: !!fechaJudicial,
      fechaReal: fechaJudicial,
    },
    {
      id: 'cierre',
      numero: 6,
      nombre: 'Disposición Final',
      descripcion: 'Cierre definitivo de la cadena de custodia',
      normativa: 'MUCC-2017 Cap. V',
      completada: !!fechaCierre,
      fechaReal: fechaCierre,
    },
  ];

  const completadas = fases.filter(f => f.completada).length;
  const pct = Math.round((completadas / fases.length) * 100);

  return (
    <div className="fluent-mica rounded-xl border border-white/5 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
        <div>
          <h3 className="font-bold text-white text-sm tracking-tight">
            Ciclo de Vida de la Evidencia
          </h3>
          <p className="text-[10px] text-fluent-text-muted mt-0.5 uppercase tracking-[0.15em] font-bold">
            Manual Único de Cadena de Custodia — Venezuela 2017
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] font-black text-fluent-text-muted uppercase tracking-widest">
            Completado
          </span>
          <span className={`text-2xl font-black tabular-nums ${
            pct === 100 ? 'text-green-400' : pct >= 50 ? 'text-fluent-accent' : 'text-fluent-text-muted'
          }`}>
            {pct}%
          </span>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="px-5 pt-4 pb-1">
        <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden border border-white/5">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${pct}%`,
              background: pct === 100
                ? 'linear-gradient(90deg, #22c55e, #4ade80)'
                : 'linear-gradient(90deg, #FECF06, #FFE46B)',
              boxShadow: pct === 100
                ? '0 0 12px rgba(34,197,94,0.4)'
                : '0 0 12px rgba(254,207,6,0.4)',
            }}
          />
        </div>
      </div>

      {/* Timeline fases */}
      <div className="p-5">
        {/* Desktop: horizontal */}
        <div className="hidden md:flex items-start gap-0">
          {fases.map((fase, idx) => (
            <div key={fase.id} className="flex-1 flex items-start">
              {/* Nodo */}
              <div className="flex flex-col items-center flex-1">
                {/* Ícono + línea */}
                <div className="flex items-center w-full">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 border-2 transition-all duration-500 ${
                      fase.completada
                        ? 'bg-green-500/20 border-green-500 shadow-[0_0_12px_rgba(34,197,94,0.3)]'
                        : fase.id === 'cierre'
                        ? 'bg-fluent-accent/20 border-fluent-accent shadow-[0_0_12px_rgba(254,207,6,0.3)] animate-pulse'
                        : 'bg-white/[0.04] border-white/10'
                    }`}
                  >
                    {fase.completada ? (
                      <CheckCircle2 size={14} className="text-green-400" />
                    ) : fase.id === 'cierre' ? (
                      <Clock size={14} className="text-fluent-accent" />
                    ) : (
                      <Circle size={14} className="text-white/20" />
                    )}
                  </div>
                  {idx < fases.length - 1 && (
                    <div className={`flex-1 h-px mx-1 ${
                      fase.completada ? 'bg-green-500/40' : 'bg-white/[0.06]'
                    }`} />
                  )}
                </div>
                {/* Texto */}
                <div className="mt-3 text-center px-1 w-full">
                  <div className={`text-[9px] font-black uppercase tracking-[0.15em] mb-1 ${
                    fase.completada ? 'text-green-400' : fase.id === 'cierre' ? 'text-fluent-accent' : 'text-white/20'
                  }`}>
                    {String(fase.numero).padStart(2, '0')}
                  </div>
                  <div className={`text-[10px] font-bold leading-tight mb-1 ${
                    fase.completada ? 'text-white' : fase.id === 'cierre' ? 'text-fluent-accent' : 'text-white/30'
                  }`}>
                    {fase.nombre}
                  </div>
                  <div className="text-[9px] text-white/25 font-mono">
                    {fase.normativa}
                  </div>
                  {fase.fechaReal && (
                    <div className="text-[9px] text-green-400/60 mt-1 font-mono">
                      {new Date(fase.fechaReal).toLocaleDateString('es-VE')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: vertical */}
        <div className="flex md:hidden flex-col gap-0">
          {fases.map((fase, idx) => (
            <div key={fase.id} className="flex gap-4">
              {/* Línea + nodo */}
              <div className="flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 ${
                  fase.completada
                    ? 'bg-green-500/20 border-green-500'
                    : fase.id === 'cierre'
                    ? 'bg-fluent-accent/20 border-fluent-accent animate-pulse'
                    : 'bg-white/[0.04] border-white/10'
                }`}>
                  {fase.completada ? (
                    <CheckCircle2 size={12} className="text-green-400" />
                  ) : fase.id === 'cierre' ? (
                    <Clock size={12} className="text-fluent-accent" />
                  ) : (
                    <Circle size={12} className="text-white/20" />
                  )}
                </div>
                {idx < fases.length - 1 && (
                  <div className={`w-px flex-1 my-1 min-h-[24px] ${
                    fase.completada ? 'bg-green-500/30' : 'bg-white/[0.06]'
                  }`} />
                )}
              </div>
              {/* Contenido */}
              <div className="pb-5 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-[9px] font-black uppercase tracking-widest ${
                    fase.completada ? 'text-green-400' : fase.id === 'cierre' ? 'text-fluent-accent' : 'text-white/20'
                  }`}>
                    Fase {fase.numero}
                  </span>
                  <ChevronRight size={10} className="text-white/20" />
                  <span className="text-[9px] font-mono text-white/25">{fase.normativa}</span>
                </div>
                <p className={`text-xs font-bold ${
                  fase.completada ? 'text-white' : fase.id === 'cierre' ? 'text-fluent-accent' : 'text-white/30'
                }`}>
                  {fase.nombre}
                </p>
                <p className="text-[10px] text-white/30 leading-relaxed">{fase.descripcion}</p>
                {fase.fechaReal && (
                  <span className="text-[9px] text-green-400/60 font-mono">
                    {new Date(fase.fechaReal).toLocaleDateString('es-VE')}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
