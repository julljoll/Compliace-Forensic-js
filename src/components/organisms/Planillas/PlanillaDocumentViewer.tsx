'use client';

import React, { useState } from 'react';
import { exportPlanillaToWordDocx } from '@/lib/export/exportWordDocx';
import { FileText, Smartphone, Laptop, Edit, Search } from '../../atoms/AppleIcon';

interface PlanillaDocumentViewerProps {
  children: React.ReactNode;
  title?: string;
  filenamePrefix?: string;
  tipoEvidencia?: 'movil' | 'computadora';
  onTipoEvidenciaChange?: (val: 'movil' | 'computadora') => void;
  caso?: any;
}

export default function PlanillaDocumentViewer({
  children,
  title = 'Documento Pericial Forense',
  tipoEvidencia,
  onTipoEvidenciaChange,
  caso,
}: PlanillaDocumentViewerProps) {
  const [zoom, setZoom] = useState<number>(100);
  const [showMarginGuides, setShowMarginGuides] = useState<boolean>(false);
  const [isExportingWord, setIsExportingWord] = useState<boolean>(false);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 15, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 15, 50));
  const handleResetZoom = () => setZoom(100);

  const handleExportWordDocx = async () => {
    setIsExportingWord(true);
    try {
      const el = document.querySelector('.planilla-container') as HTMLElement;
      await exportPlanillaToWordDocx(caso, title, el);
    } catch (err) {
      console.error('Error exportando Word en PlanillaDocumentViewer:', err);
    } finally {
      setIsExportingWord(false);
    }
  };

  return (
    <div className="planilla-viewer-shell w-100 min-vh-100 d-flex flex-column align-items-center py-4 px-2" style={{ backgroundColor: '#112E51' }}>
      {/* BARRA DE CONTROL SUPERIOR NO IMPRIMIBLE */}
      <div
        className="no-print d-print-none w-100 max-w-216mm bg-white border rounded-3 p-3 mb-4 shadow-sm d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3"
      >
        {/* TITULO */}
        <div className="d-flex align-items-center gap-2">
          <Edit size={18} className="text-success" />
          <h2 className="h6 fw-bold text-navy mb-0" style={{ color: '#112E51' }}>
            {title}
          </h2>
        </div>

        {/* SELECTOR DE TIPO DE EVIDENCIA */}
        {tipoEvidencia && onTipoEvidenciaChange && (
          <div className="d-flex align-items-center gap-2">
            <span className="small text-uppercase fw-bold text-muted" style={{ fontSize: '10px' }}>
              FORMATO EVIDENCIA:
            </span>
            <div className="btn-group btn-group-sm" role="group">
              <button
                type="button"
                className={`btn fw-bold ${tipoEvidencia === 'movil' ? 'btn-warning text-dark' : 'btn-outline-secondary'}`}
                onClick={() => onTipoEvidenciaChange('movil')}
              >
                <Smartphone size={13} className="me-1" /> Dispositivo Móvil
              </button>
              <button
                type="button"
                className={`btn fw-bold ${tipoEvidencia === 'computadora' ? 'btn-warning text-dark' : 'btn-outline-secondary'}`}
                onClick={() => onTipoEvidenciaChange('computadora')}
              >
                <Laptop size={13} className="me-1" /> Computador / Disco
              </button>
            </div>
          </div>
        )}

        {/* CONTROLES DE ZOOM Y GUÍAS */}
        <div className="d-flex align-items-center gap-2">
          <div className="btn-group btn-group-sm">
            <button type="button" className="btn btn-outline-secondary" onClick={handleZoomOut} disabled={zoom <= 50}>-</button>

            <span className="btn btn-outline-secondary disabled fw-bold font-monospace text-navy" style={{ minWidth: '42px' }}>
              {zoom}%
            </span>
            <button type="button" className="btn btn-outline-secondary" onClick={handleZoomIn} disabled={zoom >= 200}>+</button>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={handleResetZoom}
            title="Restablecer a 100%"
          >
            100%
          </button>

          <button
            type="button"
            className={`btn btn-sm ${showMarginGuides ? 'btn-success' : 'btn-outline-secondary'} fw-bold`}
            onClick={() => setShowMarginGuides(!showMarginGuides)}
          >
            {showMarginGuides ? 'GUÍAS ACTIVAS' : 'MÁRGENES'}
          </button>
        </div>

        <div className="d-flex align-items-center gap-2">
          {/* ACCIÓN EXPORTAR WORD */}
          <button
            type="button"
            className="btn btn-outline-success btn-sm fw-bold d-flex align-items-center gap-1"
            onClick={handleExportWordDocx}
            disabled={isExportingWord}
          >
            <FileText size={15} /> {isExportingWord ? 'Exportando...' : 'WORD (.DOCX)'}
          </button>

          {/* ACCIÓN IMPRIMIR */}
          <button
            type="button"
            id="btn-imprimir-planilla"
            className="btn btn-primary btn-sm fw-bold d-flex align-items-center gap-1"
            onClick={() => window.print()}
            title="Imprime la planilla tal como la ve en pantalla"
          >
            🖨️ IMPRIMIR
          </button>
        </div>
      </div>

      {/* VIEWPORT ZOOMABLE */}
      <div
        className="planilla-viewport w-100 d-flex flex-column align-items-center"
        style={{
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'top center',
          transition: 'transform 0.2s ease-in-out',
          outline: showMarginGuides ? '1px dashed #008837' : 'none',
        }}
      >
        <div className="planilla-container w-100 d-flex flex-column align-items-center">
          {children}
        </div>
      </div>
    </div>

  );
}
