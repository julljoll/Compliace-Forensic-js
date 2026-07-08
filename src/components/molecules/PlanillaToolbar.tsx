import { useRouter } from 'next/navigation';
import { Printer, Archive, ArrowLeft, AlertTriangle, CheckCircle2 } from '../atoms/AppleIcon';

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

  // Filtrar campos faltantes
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

  return (
    <div className="no-print fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-black/75 backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {/* Info & Back Section */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleBack}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#86868B] hover:text-white transition-colors border border-white/5 flex items-center justify-center"
            title="Volver al Expediente"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="min-w-0">
            <h4 className="text-[12px] font-bold text-white truncate leading-snug">
              {tituloDocumento}
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-[#00FF41] animate-pulse" />
              <p className="text-[10px] text-[#86868B] font-medium uppercase tracking-wider">
                📝 Previsualización Interactiva (Editable)
              </p>
            </div>
          </div>
        </div>

        {/* Validation Check */}
        {camposRequeridos.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 w-full sm:w-auto justify-center sm:justify-start">
            {faltantes.length > 0 ? (
              <>
                <AlertTriangle size={14} className="text-[#FF9F0A]" />
                <span className="text-[11px] text-[#FF9F0A] font-semibold">
                  {faltantes.length} campos faltantes (puedes completarlos haciendo clic)
                </span>
              </>
            ) : (
              <>
                <CheckCircle2 size={14} className="text-[#30D158]" />
                <span className="text-[11px] text-[#30D158] font-semibold">
                  Campos obligatorios completos
                </span>
              </>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            onClick={onPrint}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-[12px] transition-all border border-white/10"
          >
            <Printer size={16} />
            <span>Imprimir PDF</span>
          </button>
          <button
            onClick={onDownloadZip}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0A84FF] hover:bg-[#0071E3] text-white font-bold text-[12px] transition-all border border-[#0A84FF] shadow-lg shadow-[#0A84FF]/20"
          >
            <Archive size={16} />
            <span>Descargar ZIP</span>
          </button>
        </div>
      </div>
    </div>
  );
}
