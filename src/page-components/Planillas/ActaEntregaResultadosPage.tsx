'use client';

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCMSStore } from '../../store/cmsStore';
import './Planillas.css';
import ActaEntregaResultados from '../../components/organisms/Planillas/ActaEntregaResultados';
import PlanillaDocumentViewer from '../../components/organisms/Planillas/PlanillaDocumentViewer';

const ActaEntregaResultadosPage = () => {
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
        title={`Acta de Entrega de Resultados Forenses — Caso #${caso?.numeroCaso || 'N/A'}`}
        filenamePrefix={`Acta_Entrega_Resultados_${caso?.numeroCaso || 'EXP'}`}
      >
        <ActaEntregaResultados caso={caso} />
      </PlanillaDocumentViewer>
    </div>
  );
};

export default ActaEntregaResultadosPage;
