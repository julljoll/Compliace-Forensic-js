'use client';

import React, { useEffect, useState } from 'react';
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

  const [tipoEvidencia, setTipoEvidencia] = useState<'movil' | 'computadora'>(
    caso?.tipoProyecto === 'forense_discoduro' ? 'computadora' : 'movil'
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="planilla-container">
      <PlanillaDocumentViewer
        title={`Acta de Entrevista Técnico-Pericial — Caso #${caso?.numeroCaso || 'N/A'}`}
        filenamePrefix={`Acta_Entrevista_${caso?.numeroCaso || 'EXP'}`}
        tipoEvidencia={tipoEvidencia}
        onTipoEvidenciaChange={setTipoEvidencia}
      >
        <ActaEntrevista caso={caso} tipoEvidencia={tipoEvidencia} />
      </PlanillaDocumentViewer>
    </div>
  );
};

export default ActaEntrevistaPage;
