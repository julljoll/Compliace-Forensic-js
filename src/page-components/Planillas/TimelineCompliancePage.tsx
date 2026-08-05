'use client';

import React, { useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCMSStore } from '../../store/cmsStore';
import type { CasoCMS } from '../../store/cmsStore';
import PlanillaPdfViewer from '../../components/organisms/Planillas/PlanillaPdfViewer';
import ActaAuditoriaTimelinePdf from '../../lib/pdf/documents/ActaAuditoriaTimelinePdf';

export default function TimelineCompliancePage() {
  const params = useSearchParams();
  const casoId = params.get('casoId');
  const { casos } = useCMSStore();

  const caso: CasoCMS | undefined = useMemo(
    () => (casoId ? casos.find(c => c.id === casoId) : undefined),
    [casoId, casos]
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!caso) {
    return (
      <div className="container p-5 text-center">
        <div className="usa-alert usa-alert--warning max-w-600 mx-auto text-start">
          <div className="usa-alert__body">
            <h3 className="usa-alert__heading fw-bold" style={{ color: '#D9A700' }}>
              Expediente no encontrado
            </h3>
            <p className="usa-alert__text text-muted mb-0">
              Seleccione un expediente válido en la sección de casos.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PlanillaPdfViewer
      title={`Informe de Trazabilidad y Compliance — Caso #${caso.numeroCaso}`}
      document={<ActaAuditoriaTimelinePdf caso={caso} logs={[]} />}
    />
  );
}
