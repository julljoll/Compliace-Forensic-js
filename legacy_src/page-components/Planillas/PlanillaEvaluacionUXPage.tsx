'use client';

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCMSStore } from '../../store/cmsStore';
import PlanillaPdfViewer from '../../components/organisms/Planillas/PlanillaPdfViewer';
import { PlanillaEvaluacionUXPdf } from '../../lib/pdf/documents/PlanillaEvaluacionUXPdf';

const PlanillaEvaluacionUXPage = () => {
  const searchParams = useSearchParams();
  const casoId = searchParams.get('casoId') || '';
  const { casos } = useCMSStore();
  const caso = casos.find(c => c.id === casoId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PlanillaPdfViewer
      title={`Planilla de Evaluación y Auditoría UX/UI Forense — Caso #${caso?.numeroCaso || 'N/A'}`}
      caso={caso}
      document={<PlanillaEvaluacionUXPdf caso={caso} />}
    />
  );
};

export default PlanillaEvaluacionUXPage;
