'use client';

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCMSStore } from '../../store/cmsStore';
import PlanillaPdfViewer from '../../components/organisms/Planillas/PlanillaPdfViewer';
import ActaEntregaResultadosPdf from '../../lib/pdf/documents/ActaEntregaResultadosPdf';

const ActaEntregaResultadosPage = () => {
  const searchParams = useSearchParams();
  const casoId = searchParams.get('casoId') || '';
  const { casos } = useCMSStore();
  const caso = casos.find(c => c.id === casoId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PlanillaPdfViewer
      title={`Acta de Entrega de Resultados y Devolución — Caso #${caso?.numeroCaso || 'N/A'}`}
      caso={caso}
      document={<ActaEntregaResultadosPdf caso={caso} />}
    />
  );
};

export default ActaEntregaResultadosPage;
