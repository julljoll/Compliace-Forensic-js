'use client';

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCMSStore } from '../../store/cmsStore';
import './Planillas.css';
import ActaObtencion from '../../components/organisms/Planillas/ActaObtencion';
import PlanillaDocumentViewer from '../../components/organisms/Planillas/PlanillaDocumentViewer';

const ActaObtencionPage = () => {
  const searchParams = useSearchParams();
  const casoId = searchParams.get('casoId') || '';
  const { casos } = useCMSStore();
  const caso = casos.find(c => c.id === casoId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="planilla-container">
      <PlanillaDocumentViewer
        title={`Acta de Obtención por Consignación — Caso #${caso?.numeroCaso || 'N/A'}`}
        filenamePrefix={`Acta_Obtencion_${caso?.numeroCaso || 'EXP'}`}
      >
        <ActaObtencion caso={caso} />
      </PlanillaDocumentViewer>
    </div>
  );
};

export default ActaObtencionPage;
