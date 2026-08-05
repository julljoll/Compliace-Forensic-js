'use client';

import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Printer, AlertTriangle, CheckCircle2 } from '../atoms/AppleIcon';

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
  tituloDocumento,
  camposRequeridos = [],
  casoId,
}: PlanillaToolbarProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    setMounted(true);
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
    <div
      className="no-print position-fixed bottom-0 start-50 translate-middle-x mb-3 z-3 max-w-95vw"
    >
      <div
        className="card p-2 bg-dark bg-opacity-90 border border-primary text-white shadow-lg rounded-3 d-flex flex-row align-items-center gap-3 backdrop-blur"
      >
        {/* Botón Volver */}
        <button
          type="button"
          onClick={handleBack}
          className="btn btn-sm btn-link text-white-50 p-1"
          title="Volver al Expediente"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="vr bg-secondary" />

        {/* Título & Selector Edición / Vista Previa */}
        <div className="min-w-0">
          <div className="small fw-bold text-white text-truncate" style={{ fontSize: '12px' }}>
            {tituloDocumento}
          </div>
          <div className="d-flex align-items-center gap-1 mt-1">
            <span className="small text-muted text-uppercase fw-bold" style={{ fontSize: '9px' }}>Modo:</span>
            <div className="btn-group btn-group-sm">
              <button
                type="button"
                className={`btn py-0 px-2 fw-bold ${!isPreview ? 'btn-warning text-dark' : 'btn-outline-secondary text-white'}`}
                style={{ fontSize: '8px' }}
                onClick={() => handleSetPreview(false)}
              >
                EDICIÓN
              </button>
              <button
                type="button"
                className={`btn py-0 px-2 fw-bold ${isPreview ? 'btn-warning text-dark' : 'btn-outline-secondary text-white'}`}
                style={{ fontSize: '8px' }}
                onClick={() => handleSetPreview(true)}
              >
                VISTA PREVIA
              </button>
            </div>
          </div>
        </div>

        {/* Badge de validación */}
        {camposRequeridos.length > 0 && (
          <>
            <div className="vr bg-secondary" />
            <span className={`usa-tag ${faltantes.length > 0 ? 'usa-tag--error' : 'usa-tag--success'}`}>
              {faltantes.length > 0 ? `⚠ ${faltantes.length} vacíos` : '✓ Listo'}
            </span>
          </>
        )}

        <div className="vr bg-secondary" />

        {/* Botón Imprimir */}
        <button
          type="button"
          className="btn btn-warning btn-sm fw-bold text-dark d-flex align-items-center gap-1"
          onClick={handlePrint}
        >
          <Printer size={15} /> Imprimir
        </button>
      </div>
    </div>,
    document.body
  );
}
