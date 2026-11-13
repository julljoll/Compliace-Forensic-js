'use client';

import React from 'react';
import PlanillaPdfViewer from '@/components/organisms/Planillas/PlanillaPdfViewer';
import { X, FileText } from '@/components/atoms/AppleIcon';

interface PdfPreviewModalProps {
  open: boolean;
  onClose: () => void;
  pdfBlob: Blob | null;
  title?: string;
  isGenerating?: boolean;
}

export default function PdfPreviewModal({
  open,
  onClose,
  pdfBlob,
  title = 'Vista Previa PDF',
  isGenerating = false,
}: PdfPreviewModalProps) {
  if (!open) return null;

  return (
    <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(17, 46, 81, 0.75)', zIndex: 1055 }}>
      <div className="modal-dialog modal-dialog-centered modal-xl" style={{ maxWidth: '1200px' }}>
        <div className="modal-content border shadow-lg rounded-3" style={{ backgroundColor: '#112E51', borderColor: '#CBD5E1' }}>
          <div className="modal-header border-bottom py-2 px-3" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
            <div className="d-flex align-items-center gap-2">
              <FileText size={20} className="text-warning" />
              <h5 className="modal-title fw-bold mb-0 text-white" style={{ fontSize: '1.1rem' }}>
                {title}
              </h5>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-outline-light d-flex align-items-center justify-content-center p-1 rounded-circle"
              onClick={onClose}
              aria-label="Cerrar"
              style={{ width: '30px', height: '30px' }}
            >
              <X size={16} />
            </button>
          </div>

          <div className="modal-body p-2 p-md-3" style={{ backgroundColor: '#F0F4F8' }}>
            <PlanillaPdfViewer pdfBlob={pdfBlob} title={title} isGenerating={isGenerating} />
          </div>
        </div>
      </div>
    </div>
  );
}
