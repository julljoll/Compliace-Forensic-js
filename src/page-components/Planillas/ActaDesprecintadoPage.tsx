'use client';

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCMSStore } from '../../store/cmsStore';
import PlanillaPdfViewer from '../../components/organisms/Planillas/PlanillaPdfViewer';
import ActaDesprecintadoPdf from '../../lib/pdf/documents/ActaDesprecintadoPdf';

const ActaDesprecintadoPage = () => {
  const searchParams = useSearchParams();
  const casoId = searchParams.get('casoId') || '';
  const { casos } = useCMSStore();
  const caso = casos.find(c => c.id === casoId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PlanillaPdfViewer
      title={`Acta de Apertura y Desprecintado en Laboratorio — Caso #${caso?.numeroCaso || 'N/A'}`}
      caso={caso}
      document={<ActaDesprecintadoPdf caso={caso} />}
    />
  );
};

export default ActaDesprecintadoPage;

