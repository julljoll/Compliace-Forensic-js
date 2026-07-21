'use client';

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCMSStore } from '../../store/cmsStore';
import './Planillas.css';
import PlanillaPRCC from '../../components/organisms/Planillas/PlanillaPRCC';
import PlanillaDocumentViewer from '../../components/organisms/Planillas/PlanillaDocumentViewer';

const PlanillaPRCCPage = () => {
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
        title={`Planilla del Registro de Cadena de Custodia (PRCC) — Caso #${caso?.numeroCaso || 'N/A'}`}
        filenamePrefix={`Planilla_PRCC_${caso?.numeroCaso || 'EXP'}`}
      >
        <PlanillaPRCC caso={caso} />
      </PlanillaDocumentViewer>
    </div>
  );
};

export default PlanillaPRCCPage;
