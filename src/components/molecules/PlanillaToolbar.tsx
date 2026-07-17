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
    <div className="no-print fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-auto max-w-[95vw]">
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl shadow-2xl px-3 py-2.5">

        {/* Botón Volver */}
        <button
          onClick={handleBack}
          title="Volver al Expediente"
          className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer flex-shrink-0"
        >
          <ArrowLeft size={18} />
        </button>

        {/* Separador */}
        <div className="w-px h-6 bg-gray-200 flex-shrink-0" />

        {/* Título */}
        <div className="min-w-0 px-1">
          <p className="text-[13px] font-semibold text-gray-800 truncate leading-tight">{tituloDocumento}</p>
          <p className="text-[10px] text-gray-400 font-medium leading-tight mt-0.5">Vista previa · Editable</p>
        </div>

        {/* Badge de validación */}
        {camposRequeridos.length > 0 && (
          <>
            <div className="w-px h-6 bg-gray-200 flex-shrink-0" />
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold flex-shrink-0 ${
              faltantes.length > 0
                ? 'bg-amber-50 border border-amber-200 text-amber-700'
                : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
            }`}>
              {faltantes.length > 0 ? (
                <>
                  <AlertTriangle size={12} />
                  <span>{faltantes.length} campos</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={12} />
                  <span>Completo</span>
                </>
              )}
            </div>
          </>
        )}

        {/* Separador */}
        <div className="w-px h-6 bg-gray-200 flex-shrink-0" />

        {/* Botón Imprimir PDF */}
        <button
          onClick={onPrint}
          className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-[12px] font-semibold transition-all cursor-pointer flex-shrink-0 shadow-sm"
        >
          <Printer size={14} />
          <span>Imprimir</span>
        </button>

        {/* Botón Descargar ZIP */}
        <button
          onClick={onDownloadZip}
          className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 hover:bg-gray-50 active:scale-95 text-gray-700 rounded-xl text-[12px] font-medium transition-all cursor-pointer flex-shrink-0"
        >
          <Archive size={14} />
          <span>Word/ZIP</span>
        </button>

      </div>
    </div>
  );
}
