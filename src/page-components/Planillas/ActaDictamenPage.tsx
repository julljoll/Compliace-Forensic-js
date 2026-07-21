'use client';

import React, { useEffect, useState } from 'react';
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

  const [tipoEvidencia, setTipoEvidencia] = useState<'movil' | 'computadora'>(
    caso?.tipoProyecto === 'forense_discoduro' ? 'computadora' : 'movil'
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PlanillaDocumentViewer
      title={`Dictamen Pericial Informático Forense — Caso #${caso?.numeroCaso || 'N/A'}`}
      filenamePrefix={`Dictamen_Pericial_${caso?.numeroCaso || 'EXP'}`}
      tipoEvidencia={tipoEvidencia}
      onTipoEvidenciaChange={setTipoEvidencia}
    >
      <ActaDictamen caso={caso} tipoEvidencia={tipoEvidencia} />
    </PlanillaDocumentViewer>
  );
};

export default ActaDictamenPage;
