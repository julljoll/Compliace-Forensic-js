'use client';

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCMSStore } from '../../store/cmsStore';
import './Planillas.css';
import ActaDictamen from '../../components/organisms/Planillas/ActaDictamen';
import PlanillaDocumentViewer from '../../components/organisms/Planillas/PlanillaDocumentViewer';

const ActaDictamenPage = () => {
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
        title={`Dictamen Pericial Informático Forense — Caso #${caso?.numeroCaso || 'N/A'}`}
        filenamePrefix={`Dictamen_Pericial_${caso?.numeroCaso || 'EXP'}`}
      >
        <ActaDictamen caso={caso} />
      </PlanillaDocumentViewer>
    </div>
  );
};

export default ActaDictamenPage;
