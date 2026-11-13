'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCMSStore } from '../../store/cmsStore';
import PlanillaPdfViewer from '../../components/organisms/Planillas/PlanillaPdfViewer';
import { PlanillaAudioSonicPdf } from '../../lib/pdf/documents/PlanillaAudioSonicPdf';
import PlanillaAudioSonic from '../../components/organisms/Planillas/PlanillaAudioSonic';

const PlanillaAudioSonicPage = () => {
  const searchParams = useSearchParams();
  const casoId = searchParams.get('casoId') || '';
  const { casos } = useCMSStore();
  const caso = casos.find(c => c.id === casoId);

  const [viewMode, setViewMode] = useState<'pdf' | 'web'>('pdf');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const pageTitle = `Informe Forense de Audio (Sonic Visualiser) — Caso #${caso?.numeroCaso || 'EXP-2026-SHA-0091'}`;

  return (
    <div>
      {viewMode === 'pdf' ? (
        <PlanillaPdfViewer
          title={pageTitle}
          caso={caso}
          document={<PlanillaAudioSonicPdf caso={caso} />}
          actions={
            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn btn-sm btn-outline-light fw-bold"
                onClick={() => setViewMode('web')}
                style={{ fontSize: '11px' }}
                title="Cambiar a vista de edición web de Hoja Folio"
              >
                📝 Ver Vista Folio Web
              </button>
            </div>
          }
        />
      ) : (
        <div className="container-fluid p-3" style={{ backgroundColor: '#F0F4F8', minHeight: '100vh' }}>
          <div className="d-flex justify-content-between align-items-center mb-3 bg-white p-3 border rounded shadow-sm">
            <div>
              <h5 className="mb-0 fw-bold" style={{ color: '#112E51' }}>
                🎵 Vista Folio Web — Informe Forense de Audio (Sonic Visualiser)
              </h5>
              <small className="text-secondary">
                Caso #{caso?.numeroCaso || 'EXP-2026-SHA-0091'} · FRE 702 / Daubert / SWGDE
              </small>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-primary fw-bold"
              onClick={() => setViewMode('pdf')}
              style={{ backgroundColor: '#005EA2', fontSize: '12px' }}
            >
              📄 Volver a Visor PDF Oficial
            </button>
          </div>
          <div className="d-flex justify-content-center">
            <div style={{ maxWidth: '850px', width: '100%' }}>
              <PlanillaAudioSonic caso={caso} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanillaAudioSonicPage;
