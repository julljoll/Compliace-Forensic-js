'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCMSStore } from '../../store/cmsStore';
import PlanillaPdfViewer from '../../components/organisms/Planillas/PlanillaPdfViewer';
import DictamenImagenesPdf from '../../lib/pdf/documents/DictamenImagenesPdf';
import DictamenAudiosPdf from '../../lib/pdf/documents/DictamenAudiosPdf';

type DictamenMode = 'imagenes' | 'audios';

const ActaDictamenPage = () => {
  const searchParams = useSearchParams();
  const casoId = searchParams.get('casoId') || '';
  const { casos } = useCMSStore();
  const caso = casos.find(c => c.id === casoId);

  const [dictamenMode, setDictamenMode] = useState<DictamenMode>('imagenes');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const isImageMode = dictamenMode === 'imagenes';

  const currentDocument = isImageMode
    ? <DictamenImagenesPdf caso={caso} />
    : <DictamenAudiosPdf caso={caso} />;

  const currentTitle = isImageMode
    ? `Dictamen Pericial — Análisis de IMÁGENES — Caso #${caso?.numeroCaso || 'N/A'}`
    : `Dictamen Pericial — Análisis de AUDIOS WhatsApp — Caso #${caso?.numeroCaso || 'N/A'}`;

  return (
    <PlanillaPdfViewer
      title={currentTitle}
      caso={caso}
      document={currentDocument}
      actions={
        <div className="d-flex align-items-center gap-2 flex-wrap">
          {/* Selector de versión del dictamen con Bootstrap 5.3 btn-group */}
          <div className="btn-group btn-group-sm" role="group" aria-label="Modo de Dictamen Pericial">
            <button
              type="button"
              className={`btn fw-bold px-3 ${isImageMode ? 'btn-warning text-dark' : 'btn-outline-warning'}`}
              onClick={() => setDictamenMode('imagenes')}
              title="Dictamen de Análisis Fotográfico — ELA / Copy-Move / JPEG Ghost / EXIF"
              style={{ fontSize: '11px' }}
            >
              🖼️ IMÁGENES
            </button>
            <button
              type="button"
              className={`btn fw-bold px-3 ${!isImageMode ? 'btn-success text-dark' : 'btn-outline-success'}`}
              onClick={() => setDictamenMode('audios')}
              title="Dictamen de Análisis Acústico — Espectrograma / Formantes / SNR / Hash Opus"
              style={{ fontSize: '11px' }}
            >
              🎵 AUDIOS WA
            </button>
          </div>

          {/* Badge de norma USWDS */}
          <span
            className="usa-tag font-monospace fw-bold"
            style={{
              fontSize: '9px',
              backgroundColor: isImageMode ? 'rgba(217, 167, 0, 0.15)' : 'rgba(0, 136, 55, 0.15)',
              color: isImageMode ? '#D9A700' : '#008837',
              border: `1px solid ${isImageMode ? '#D9A700' : '#008837'}`,
              padding: '2px 8px',
            }}
          >
            {isImageMode
              ? '8 págs. · ELA · Copy-Move · EXIF · Daubert/FRE 702'
              : '8 págs. · Sonic Visualiser v5 · Opus 48kHz · Pitch F₀ Yin · SWGDE · Daubert/FRE 702'}
          </span>
        </div>
      }
    />
  );
};

export default ActaDictamenPage;
