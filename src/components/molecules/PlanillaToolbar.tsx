import { useRouter } from 'next/navigation';
import { Printer, Archive, ArrowLeft, AlertTriangle, CheckCircle2 } from '../atoms/AppleIcon';
import { createPortal } from 'react-dom';
import { useState, useEffect } from 'react';

interface CampoRequerido {
  valor: string | undefined;
  nombre: string;
}

interface PlanillaToolbarProps {
  onPrint: () => void;
  onDownloadZip: () => void;
  tituloDocumento: string;
  camposRequeridos?: CampoRequerido[];
  casoId?: string;
}

export default function PlanillaToolbar({
  onPrint,
  onDownloadZip,
  tituloDocumento,
  camposRequeridos = [],
  casoId,
}: PlanillaToolbarProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Initialize preview mode state by checking the DOM
    const container = document.querySelector('.planilla-container');
    if (container) {
      setIsPreview(container.classList.contains('modo-vista-previa'));
    }
    return () => setMounted(false);
  }, []);

  const handleSetPreview = (preview: boolean) => {
    const container = document.querySelector('.planilla-container');
    if (container) {
      if (preview) {
        container.classList.add('modo-vista-previa');
      } else {
        container.classList.remove('modo-vista-previa');
      }
      setIsPreview(preview);
    }
  };

  const faltantes = camposRequeridos.filter(
    (f) => !f.valor || f.valor === 'N/A' || !f.valor.trim()
  );

  const handleBack = () => {
    if (casoId) {
      router.push(`/casos?id=${casoId}`);
    } else {
      router.back();
    }
  };

  const handlePrint = () => {
    const container = document.querySelector('.planilla-container');
    if (container) {
      container.classList.add('modo-vista-previa');
      setIsPreview(true);
    }
    onPrint();
  };

  if (!mounted) return null;

  return createPortal(
    <div className="no-print fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-auto max-w-[95vw]">
      <div className="flex items-center gap-3 bg-zinc-950/85 border border-zinc-800 rounded-md shadow-2xl px-4 py-3 backdrop-blur-md">

        {/* Botón Volver */}
        <button
          onClick={handleBack}
          title="Volver al Expediente"
          className="p-2 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer flex-shrink-0"
        >
          <ArrowLeft size={18} />
        </button>

        {/* Separador */}
        <div className="w-px h-6 bg-zinc-800 flex-shrink-0" />

        {/* Título y Alternador de Modo */}
        <div className="min-w-0 pr-2">
          <p className="text-[12px] font-semibold text-zinc-100 truncate leading-tight">{tituloDocumento}</p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Modo:</span>
            <div className="flex bg-zinc-900 p-0.5 rounded-md border border-zinc-800">
              <button
                type="button"
                onClick={() => handleSetPreview(false)}
                className={`px-2 py-0.5 rounded-sm text-[8px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  !isPreview
                    ? 'bg-[var(--apple-accent)] text-black shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Edición
              </button>
              <button
                type="button"
                onClick={() => handleSetPreview(true)}
                className={`px-2 py-0.5 rounded-sm text-[8px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  isPreview
                    ? 'bg-[var(--apple-accent)] text-black shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Vista Previa
              </button>
            </div>
          </div>
        </div>

        {/* Badge de validación */}
        {camposRequeridos.length > 0 && (
          <>
            <div className="w-px h-6 bg-zinc-800 flex-shrink-0" />
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-semibold flex-shrink-0 ${
              faltantes.length > 0
                ? 'bg-amber-500/10 border border border-amber-500/20 text-amber-400'
                : 'bg-emerald-500/10 border border border-emerald-500/20 text-emerald-400'
            }`}>
              {faltantes.length > 0 ? (
                <>
                  <AlertTriangle size={12} />
                  <span>{faltantes.length} vacíos</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={12} />
                  <span>Listo</span>
                </>
              )}
            </div>
          </>
        )}

        {/* Separador */}
        <div className="w-px h-6 bg-zinc-800 flex-shrink-0" />

        {/* Botón Imprimir PDF */}
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3 py-2 bg-[var(--apple-accent)] hover:bg-[var(--apple-accent)]/85 active:scale-95 text-black rounded-md text-[11px] font-bold transition-all cursor-pointer flex-shrink-0 shadow-lg shadow-[var(--apple-accent)]/20"
        >
          <Printer size={13} />
          <span>Imprimir</span>
        </button>

      </div>
    </div>,
    document.body
  );
}
