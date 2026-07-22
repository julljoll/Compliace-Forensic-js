'use client';

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCMSStore } from '../../store/cmsStore';
import PlanillaPdfViewer from '../../components/organisms/Planillas/PlanillaPdfViewer';
import ActaDictamenPdf from '../../lib/pdf/documents/ActaDictamenPdf';

const ActaDictamenPage = () => {
  const searchParams = useSearchParams();
  const casoId = searchParams.get('casoId') || '';
  const { casos } = useCMSStore();
  const caso = casos.find(c => c.id === casoId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PlanillaPdfViewer
      title={`Dictamen Pericial Informático Forense — Caso #${caso?.numeroCaso || 'N/A'}`}
      document={<ActaDictamenPdf caso={caso} />}
    />
  );
};

export default ActaDictamenPage;
