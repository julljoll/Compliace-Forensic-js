'use client';

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCMSStore } from '../../store/cmsStore';
import PlanillaPdfViewer from '../../components/organisms/Planillas/PlanillaPdfViewer';
import PlanillaPRCCPdf from '../../lib/pdf/documents/PlanillaPRCCPdf';

const PlanillaPRCCPage = () => {
  const searchParams = useSearchParams();
  const casoId = searchParams.get('casoId') || '';
  const { casos } = useCMSStore();
  const caso = casos.find(c => c.id === casoId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PlanillaPdfViewer
      title={`Planilla del Registro de Cadena de Custodia (PRCC) — Caso #${caso?.numeroCaso || 'N/A'}`}
      document={<PlanillaPRCCPdf caso={caso} />}
    />
  );
};

export default PlanillaPRCCPage;
