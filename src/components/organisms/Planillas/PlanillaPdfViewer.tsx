'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { exportPlanillaToWordDocx } from '@/lib/export/exportWordDocx';
import { printPdfBlob } from '@/lib/pdf/planillaPdfEngine';
import { FileText, Printer, Edit } from '../../atoms/AppleIcon';

const PDFViewerNative = dynamic(
  () => import('@react-pdf/renderer').then(mod => mod.PDFViewer),
  {
    ssr: false,
    loading: () => (
      <div className="d-flex flex-column align-items-center justify-content-center w-100 h-100 min-vh-50 text-warning gap-2" style={{ backgroundColor: '#112E51' }}>
        <div className="spinner-border text-warning" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="small fw-bold font-monospace mb-0" style={{ fontSize: '13px', color: '#D9A700' }}>
          Generando vista previa vectorial PDF (Papel Folio 216mm x 330mm)...
        </p>
      </div>
    ),
  }
);

export interface PlanillaPdfViewerProps {
  document?: React.ReactElement<any>;
  pdfBlob?: Blob | null;
  title?: string;
  isGenerating?: boolean;
  actions?: React.ReactNode;
  caso?: any;
}

const NORMATIVAS_PLANILLA = [
  { label: 'MUCC-2017 § 4', color: '#D9A700' },
  { label: 'ISO 27037:2012', color: '#008837' },
  { label: 'COPP Art. 187', color: '#D9A700' },
  { label: 'Ley Mensajes Datos', color: '#005EA2' },
];

export default function PlanillaPdfViewer({ document, pdfBlob, title = 'Vista Previa PDF', isGenerating = false, actions, caso }: PlanillaPdfViewerProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [isExportingWord, setIsExportingWord] = useState<boolean>(false);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  // Por defecto se visualiza e imprime en blanco (limpio para rellenar a lápiz)
  const [isBlankMode, setIsBlankMode] = useState<boolean>(true);

  useEffect(() => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      setBlobUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setBlobUrl(null);
  }, [pdfBlob]);

  const handleExportWordDocx = async () => {
    setIsExportingWord(true);
    try {
      const element = window.document.querySelector('.planilla-container') as HTMLElement;
      await exportPlanillaToWordDocx(caso, title, element);
    } catch (err) {
      console.error('Error al exportar Word:', err);
    } finally {
      setIsExportingWord(false);
    }
  };

  const handlePrintBlank = async () => {
    if (!document) return;
    setIsPrinting(true);
    try {
      const { pdf } = await import('@react-pdf/renderer');
      // Forzar renderizado en blanco sin datos para impresión limpia a lápiz
      const blankDoc = React.cloneElement(document, { isBlankMode: true });
      const blob = await pdf(blankDoc).toBlob();
      printPdfBlob(blob);
    } catch (err) {
      console.error('Error al imprimir planilla en blanco:', err);
    } finally {
      setIsPrinting(false);
    }
  };

  // Clona el documento React pasando la propiedad isBlankMode dinámica
  const activeDocument = document ? React.cloneElement(document, { isBlankMode }) : null;

  return (
    <div className="container-fluid max-w-1150 my-3 px-0 d-flex flex-column gap-3">
      {/* Control Bar (USWDS / Bootstrap Dual Blueprint Style) */}
      <div className="card p-3 bg-white border rounded-3 shadow-sm d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div>
          <h2 className="h6 fw-bold mb-1 d-flex align-items-center gap-2" style={{ color: '#112E51' }}>
            <FileText size={18} className="text-warning" />
            {title}
          </h2>
          <div className="d-flex flex-wrap gap-1 mt-1">
            {NORMATIVAS_PLANILLA.map(n => (
              <span key={n.label} className="usa-tag usa-tag--info" style={{ fontSize: '9px' }}>
                {n.label}
              </span>
            ))}
          </div>
        </div>

        <div className="d-flex align-items-center gap-2 flex-wrap">
          {/* Selector Modo en Blanco vs Con Datos del Caso */}
          <div className="btn-group btn-group-sm" role="group" aria-label="Modo de Planilla">
            <button
              type="button"
              className={`btn fw-bold ${isBlankMode ? 'btn-warning text-dark' : 'btn-outline-secondary'}`}
              onClick={() => setIsBlankMode(true)}
              style={{ fontSize: '11px' }}
            >
              ✏️ PLANILLA EN BLANCO
            </button>
            <button
              type="button"
              className={`btn fw-bold ${!isBlankMode ? 'btn-success text-white' : 'btn-outline-secondary'}`}
              onClick={() => setIsBlankMode(false)}
              style={{ fontSize: '11px' }}
            >
              📋 CON DATOS
            </button>
          </div>

          {/* Selección de dispositivo / acciones adicionales */}
          {actions}

          {/* Botón Principal: IMPRIMIR PLANILLA EN BLANCO */}
          <button
            type="button"
            className="btn btn-warning btn-sm fw-bold text-dark d-flex align-items-center gap-1"
            onClick={handlePrintBlank}
            disabled={isPrinting || !document}
            style={{ fontSize: '11px' }}
          >
            {isPrinting ? (
              <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" />
            ) : (
              <Printer size={14} />
            )}
            🖨️ IMPRIMIR EN BLANCO
          </button>

          {/* Exportar a Word (.DOCX) */}
          <button
            type="button"
            className="btn btn-outline-success btn-sm fw-bold d-flex align-items-center gap-1"
            onClick={handleExportWordDocx}
            disabled={isExportingWord}
            style={{ fontSize: '11px' }}
          >
            {isExportingWord ? (
              <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" />
            ) : (
              <FileText size={14} />
            )}
            WORD (.DOCX)
          </button>
        </div>
      </div>

      {/* PDF Container */}
      <div
        className="w-100 rounded-3 overflow-hidden border shadow-lg d-flex align-items-center justify-content-center"
        style={{
          height: '820px',
          borderColor: '#CBD5E1',
          backgroundColor: '#112E51',
        }}
      >
        {isGenerating ? (
          <div className="d-flex flex-column align-items-center gap-2 text-warning">
            <div className="spinner-border text-warning" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Procesando...</span>
            </div>
            <p className="fw-bold font-monospace small mb-0" style={{ color: '#D9A700' }}>
              Procesando documento PDF...
            </p>
          </div>
        ) : activeDocument ? (
          <PDFViewerNative style={{ width: '100%', height: '100%', border: 'none' }}>
            {activeDocument as any}
          </PDFViewerNative>
        ) : blobUrl ? (
          <iframe src={blobUrl} style={{ width: '100%', height: '100%', border: 'none' }} title={title} />
        ) : (
          <p className="text-light small mb-0">No hay documento PDF cargado.</p>
        )}
      </div>
    </div>
  );
}
