'use client';

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCMSStore } from '../../store/cmsStore';
import PlanillaPdfViewer from '../../components/organisms/Planillas/PlanillaPdfViewer';
import ActaConsentimientoPdf from '../../lib/pdf/documents/ActaConsentimientoPdf';

const ActaConsentimientoPage = () => {
  const searchParams = useSearchParams();
  const casoId = searchParams.get('casoId') || '';
  const { casos } = useCMSStore();
  const caso = casos.find(c => c.id === casoId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PlanillaPdfViewer
      title={`Acta de Consentimiento Informado & Hábeas Data — Caso #${caso?.numeroCaso || 'N/A'}`}
      caso={caso}
      document={<ActaConsentimientoPdf caso={caso} />}
    />
  );
};

export default ActaConsentimientoPage;

