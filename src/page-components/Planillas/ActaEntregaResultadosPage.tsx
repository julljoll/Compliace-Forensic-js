'use client';

import React, { useEffect, useState } from 'react';
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

  const [tipoEvidencia, setTipoEvidencia] = useState<'movil' | 'computadora'>(
    caso?.tipoProyecto === 'forense_discoduro' ? 'computadora' : 'movil'
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="planilla-container">
      <PlanillaDocumentViewer
        title={`Acta de Entrega de Resultados y Devolución — Caso #${caso?.numeroCaso || 'N/A'}`}
        filenamePrefix={`Acta_Entrega_Resultados_${caso?.numeroCaso || 'EXP'}`}
        tipoEvidencia={tipoEvidencia}
        onTipoEvidenciaChange={setTipoEvidencia}
      >
        <ActaEntregaResultados caso={caso} tipoEvidencia={tipoEvidencia} />
      </PlanillaDocumentViewer>
    </div>
  );
};

export default ActaEntregaResultadosPage;
