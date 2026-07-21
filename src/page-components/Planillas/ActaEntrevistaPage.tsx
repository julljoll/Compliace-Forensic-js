'use client';

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCMSStore } from '../../store/cmsStore';
import './Planillas.css';
import ActaEntrevista from '../../components/organisms/Planillas/ActaEntrevista';
import PlanillaDocumentViewer from '../../components/organisms/Planillas/PlanillaDocumentViewer';

const ActaEntrevistaPage = () => {
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
        title={`Acta de Entrevista Técnico-Pericial — Caso #${caso?.numeroCaso || 'N/A'}`}
        filenamePrefix={`Acta_Entrevista_${caso?.numeroCaso || 'EXP'}`}
      >
        <ActaEntrevista caso={caso} />
      </PlanillaDocumentViewer>
    </div>
  );
};

export default ActaEntrevistaPage;
