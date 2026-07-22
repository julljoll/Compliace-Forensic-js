'use client';

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCMSStore } from '../../store/cmsStore';
import PlanillaPdfViewer from '../../components/organisms/Planillas/PlanillaPdfViewer';
import ActaEntrevistaPdf from '../../lib/pdf/documents/ActaEntrevistaPdf';

const ActaEntrevistaPage = () => {
  const searchParams = useSearchParams();
  const casoId = searchParams.get('casoId') || '';
  const { casos } = useCMSStore();
  const caso = casos.find(c => c.id === casoId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PlanillaPdfViewer
      title={`Acta de Entrevista Técnico-Pericial — Caso #${caso?.numeroCaso || 'N/A'}`}
      document={<ActaEntrevistaPdf caso={caso} />}
    />
  );
};

export default ActaEntrevistaPage;
