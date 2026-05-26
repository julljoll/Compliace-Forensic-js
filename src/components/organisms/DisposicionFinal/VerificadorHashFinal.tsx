import { useState, useCallback } from 'react';
import { ShieldCheck, ShieldAlert, ShieldX, Hash, Copy, CheckCheck, AlertTriangle, RefreshCw } from 'lucide-react';

interface VerificadorHashFinalProps {
  hashOriginal?: string;
  labelEvidencia?: string;
}

type EstadoIntegridad = 'idle' | 'integro' | 'discrepancia' | 'alterado';

export default function VerificadorHashFinal({
  hashOriginal = '',
  labelEvidencia = 'Imagen Forense / Extracción Avilla',
}: VerificadorHashFinalProps) {
  const [hashRef, setHashRef] = useState(hashOriginal);
  const [hashActual, setHashActual] = useState('');
  const [estado, setEstado] = useState<EstadoIntegridad>('idle');
  const [copiado, setCopiado] = useState(false);
  const [reporteCopiado, setReporteCopiado] = useState(false);

  const normalizar = (h: string) => h.trim().toLowerCase().replace(/\s+/g, '');

  const verificar = useCallback(() => {
    const r = normalizar(hashRef);
    const a = normalizar(hashActual);
    if (!r || !a) return;
    if (r === a) setEstado('integro');
    else if (r.length !== a.length || r.length !== 64) setEstado('alterado');
    else setEstado('discrepancia');
  }, [hashRef, hashActual]);

  const limpiar = () => {
    setHashActual('');
    setEstado('idle');
  };

  const copiarHash = async (hash: string, setCopied: (v: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const generarReporte = () => {
    const ts = new Date().toLocaleString('es-VE', { timeZone: 'America/Caracas' });
    const estadoStr =
      estado === 'integro' ? '✅ ÍNTEGRO — Sin alteraciones detectadas'
      : estado === 'discrepancia' ? '⚠️ DISCREPANCIA — Los hashes no coinciden'
      : estado === 'alterado' ? '❌ ALTERADO — Hash inválido o manipulado'
      : '⏳ PENDIENTE';
    return [
      '═══════════════════════════════════════════════════════',
      '  REPORTE DE VERIFICACIÓN DE INTEGRIDAD SHA-256',
      '  SHA256.US — Sistema de Peritaje Digital Forense',
      '═══════════════════════════════════════════════════════',
      `  Fecha/Hora (VET):    ${ts}`,
      `  Evidencia:           ${labelEvidencia}`,
      `  Algoritmo:           SHA-256 (256 bits / 64 hex chars)`,
      '───────────────────────────────────────────────────────',
      `  Hash Referencia:     ${normalizar(hashRef) || '[NO REGISTRADO]'}`,
      `  Hash Verificación:   ${normalizar(hashActual) || '[NO INGRESADO]'}`,
      '───────────────────────────────────────────────────────',
      `  Resultado:           ${estadoStr}`,
      '═══════════════════════════════════════════════════════',
      '  Base Legal: ISO/IEC 27037:2012 — MUCC-2017 Cap. IV',
      '  Norma: Art. 187 COPP — Cadena de Custodia',
    ].join('\n');
  };

  const CONFIG: Record<EstadoIntegridad, {
    icon: typeof ShieldCheck;
    color: string;
    bg: string;
    border: string;
    glow: string;
    titulo: string;
    subtitulo: string;
  }> = {
    idle: {
      icon: Hash,
      color: 'text-white/30',
      bg: 'bg-white/[0.03]',
      border: 'border-white/5',
      glow: '',
      titulo: 'Verificador SHA-256',
      subtitulo: 'Ingrese ambos hashes y pulse "Verificar Integridad"',
    },
    integro: {
      icon: ShieldCheck,
      color: 'text-green-400',
      bg: 'bg-green-500/[0.05]',
      border: 'border-green-500/30',
      glow: 'shadow-[0_0_40px_rgba(34,197,94,0.15)]',
      titulo: 'EVIDENCIA ÍNTEGRA',
      subtitulo: 'Los valores SHA-256 coinciden. La evidencia no ha sido alterada.',
    },
    discrepancia: {
      icon: ShieldAlert,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/[0.05]',
      border: 'border-yellow-500/30',
      glow: 'shadow-[0_0_40px_rgba(234,179,8,0.15)]',
      titulo: 'DISCREPANCIA DETECTADA',
      subtitulo: 'Los hashes no coinciden. Documente esta inconsistencia inmediatamente.',
    },
    alterado: {
      icon: ShieldX,
      color: 'text-red-400',
      bg: 'bg-red-500/[0.05]',
      border: 'border-red-500/30',
      glow: 'shadow-[0_0_40px_rgba(239,68,68,0.15)]',
      titulo: 'INTEGRIDAD COMPROMETIDA',
      subtitulo: 'Hash inválido o evidencia posiblemente manipulada. Alerte al fiscal.',
    },
  };

  const cfg = CONFIG[estado];
  const Icon = cfg.icon;

  const isValidHash = (h: string) => normalizar(h).length === 64 && /^[0-9a-f]+$/.test(normalizar(h));
  const puedeVerificar = normalizar(hashRef).length > 0 && normalizar(hashActual).length > 0;

  return (
    <div className={`fluent-mica rounded-xl border ${cfg.border} ${cfg.glow} transition-all duration-700 overflow-hidden`}>
      {/* Header dinámico */}
      <div className={`p-5 border-b border-white/5 ${cfg.bg} transition-colors duration-700`}>
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-[6px] ${cfg.bg} border ${cfg.border} transition-all duration-500`}>
            <Icon size={22} className={`${cfg.color} transition-colors duration-500`} strokeWidth={2} />
          </div>
          <div>
            <h3 className={`font-black text-sm uppercase tracking-wider transition-colors duration-500 ${
              estado === 'idle' ? 'text-white/50' : cfg.color
            }`}>
              {cfg.titulo}
            </h3>
            <p className="text-[10px] text-white/30 mt-0.5 font-medium">{cfg.subtitulo}</p>
          </div>
        </div>

        {/* Indicadores de longitud */}
        {(normalizar(hashRef).length > 0 || normalizar(hashActual).length > 0) && (
          <div className="flex gap-4 mt-4 pt-4 border-t border-white/5">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isValidHash(hashRef) ? 'bg-green-400' : 'bg-yellow-500'}`} />
              <span className="text-[9px] font-mono text-white/30">
                REF: {normalizar(hashRef).length}/64 chars
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isValidHash(hashActual) ? 'bg-green-400' : 'bg-yellow-500'}`} />
              <span className="text-[9px] font-mono text-white/30">
                ACT: {normalizar(hashActual).length}/64 chars
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="p-5 space-y-5">
        {/* Campo Hash de Referencia */}
        <div className="space-y-2">
          <label className="block text-[9px] font-black text-fluent-text-muted uppercase tracking-[0.2em]">
            Hash SHA-256 de Referencia
            <span className="ml-2 text-white/20 font-medium normal-case tracking-normal">
              (registrado en la adquisición inicial)
            </span>
          </label>
          <div className="relative">
            <input
              id="hash-referencia"
              type="text"
              value={hashRef}
              onChange={e => { setHashRef(e.target.value); setEstado('idle'); }}
              placeholder="e3b0c44298fc1c149afb…"
              className="w-full font-mono text-[11px] bg-black/40 border border-white/10 rounded-[4px] px-4 py-3 pr-12
                text-white/70 placeholder-white/15 focus:outline-none focus:border-fluent-accent/50 
                focus:bg-black/60 transition-all hover:border-white/20"
            />
            {hashRef && (
              <button
                onClick={() => copiarHash(hashRef, setCopiado)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-fluent-accent transition-colors"
                title="Copiar hash"
              >
                {copiado ? <CheckCheck size={14} className="text-green-400" /> : <Copy size={14} />}
              </button>
            )}
          </div>
          {hashRef && !isValidHash(hashRef) && (
            <p className="text-[9px] text-yellow-500/70 flex items-center gap-1">
              <AlertTriangle size={10} /> Formato SHA-256 inválido (se esperan 64 caracteres hexadecimales)
            </p>
          )}
        </div>

        {/* Campo Hash Actual */}
        <div className="space-y-2">
          <label className="block text-[9px] font-black text-fluent-text-muted uppercase tracking-[0.2em]">
            Hash SHA-256 Actual
            <span className="ml-2 text-white/20 font-medium normal-case tracking-normal">
              (calculado en el cierre del caso)
            </span>
          </label>
          <div className="relative">
            <input
              id="hash-actual"
              type="text"
              value={hashActual}
              onChange={e => { setHashActual(e.target.value); setEstado('idle'); }}
              placeholder="Pegue aquí el hash SHA-256 calculado al cierre…"
              className="w-full font-mono text-[11px] bg-black/40 border border-white/10 rounded-[4px] px-4 py-3 pr-12
                text-white/70 placeholder-white/15 focus:outline-none focus:border-fluent-accent/50
                focus:bg-black/60 transition-all hover:border-white/20"
            />
            {hashActual && (
              <button
                onClick={() => copiarHash(hashActual, setReporteCopiado)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-fluent-accent transition-colors"
                title="Copiar hash"
              >
                {reporteCopiado ? <CheckCheck size={14} className="text-green-400" /> : <Copy size={14} />}
              </button>
            )}
          </div>
          {hashActual && !isValidHash(hashActual) && (
            <p className="text-[9px] text-yellow-500/70 flex items-center gap-1">
              <AlertTriangle size={10} /> Formato SHA-256 inválido (se esperan 64 caracteres hexadecimales)
            </p>
          )}
        </div>

        {/* Comparación visual char a char (cuando hay discrepancia) */}
        {estado === 'discrepancia' && normalizar(hashRef) && normalizar(hashActual) && (
          <div className="p-4 rounded-lg bg-yellow-500/[0.04] border border-yellow-500/20 space-y-2">
            <p className="text-[9px] font-black text-yellow-500/70 uppercase tracking-widest mb-2">
              Comparación de Bits — Diferencias marcadas en rojo
            </p>
            <div className="font-mono text-[10px] leading-relaxed break-all">
              {normalizar(hashRef).split('').map((char, i) => (
                <span
                  key={i}
                  className={char === (normalizar(hashActual)[i] || '') ? 'text-white/40' : 'text-red-400 font-black'}
                >
                  {char}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex gap-3 pt-1">
          <button
            id="btn-verificar-hash"
            onClick={verificar}
            disabled={!puedeVerificar}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-[4px] text-xs font-black uppercase tracking-wider transition-all duration-200
              ${puedeVerificar
                ? 'bg-fluent-accent text-black hover:bg-fluent-accent-light shadow-[0_4px_16px_rgba(254,207,6,0.2)] hover:shadow-[0_4px_24px_rgba(254,207,6,0.35)] active:scale-[0.98]'
                : 'bg-white/[0.04] text-white/20 border border-white/5 cursor-not-allowed'
              }`}
          >
            <ShieldCheck size={14} />
            Verificar Integridad
          </button>
          {estado !== 'idle' && (
            <button
              id="btn-copiar-reporte"
              onClick={async () => {
                await navigator.clipboard.writeText(generarReporte());
                setReporteCopiado(true);
                setTimeout(() => setReporteCopiado(false), 2500);
              }}
              className="px-5 py-3 rounded-[4px] text-xs font-black uppercase tracking-wider border border-white/10 text-white/50 hover:text-white hover:border-white/30 bg-white/[0.02] hover:bg-white/[0.05] transition-all flex items-center gap-2"
            >
              {reporteCopiado ? <CheckCheck size={14} className="text-green-400" /> : <Copy size={14} />}
              {reporteCopiado ? 'Copiado' : 'Exportar'}
            </button>
          )}
          {(hashActual || estado !== 'idle') && (
            <button
              onClick={limpiar}
              className="px-4 py-3 rounded-[4px] text-xs font-black border border-white/5 text-white/25 hover:text-white/50 hover:bg-white/[0.03] transition-all flex items-center gap-2"
            >
              <RefreshCw size={12} />
            </button>
          )}
        </div>

        {/* Pie legal */}
        <div className="pt-4 border-t border-white/5 flex items-start gap-3">
          <Hash size={12} className="text-white/15 shrink-0 mt-0.5" />
          <p className="text-[9px] text-white/20 leading-relaxed font-medium">
            SHA-256 (Secure Hash Algorithm 256 bits) conforme a{' '}
            <span className="text-white/35">ISO/IEC 27037:2012</span>,{' '}
            <span className="text-white/35">MUCC-2017</span> y{' '}
            <span className="text-white/35">Art. 187 COPP</span>.
            El hash garantiza que la evidencia digital no ha sido alterada desde su adquisición.
          </p>
        </div>
      </div>
    </div>
  );
}
