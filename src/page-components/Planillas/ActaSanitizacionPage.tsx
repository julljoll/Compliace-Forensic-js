'use client';

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCMSStore } from '../../store/cmsStore';
import PlanillaPdfViewer from '../../components/organisms/Planillas/PlanillaPdfViewer';
import ActaSanitizacionPdf from '../../lib/pdf/documents/ActaSanitizacionPdf';

const ActaSanitizacionPage = () => {
  const searchParams = useSearchParams();
  const casoId = searchParams.get('casoId') || '';
  const { casos } = useCMSStore();
  const caso = casos.find(c => c.id === casoId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PlanillaPdfViewer
      title={`Acta de Sanitización Criptográfica y Borrado Seguro — Caso #${caso?.numeroCaso || 'N/A'}`}
      caso={caso}
      document={<ActaSanitizacionPdf caso={caso} />}
    />
  );
};

export default ActaSanitizacionPage;

