'use client';

import React, { useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
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
      <Box sx={{ p: 5, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ color: '#FECF06', fontWeight: 800 }}>
          Expediente no encontrado
        </Typography>
        <Typography sx={{ color: '#AEAEB2', mt: 1 }}>
          Seleccione un expediente válido en la sección de casos.
        </Typography>
      </Box>
    );
  }

  return (
    <PlanillaPdfViewer
      title={`Informe de Trazabilidad y Compliance — Caso #${caso.numeroCaso}`}
      document={<ActaAuditoriaTimelinePdf caso={caso} logs={[]} />}
    />
  );
}
