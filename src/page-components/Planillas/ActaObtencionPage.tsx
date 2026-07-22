'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { useCMSStore } from '../../store/cmsStore';
import PlanillaPdfViewer from '../../components/organisms/Planillas/PlanillaPdfViewer';
import ActaObtencionPdf from '../../lib/pdf/documents/ActaObtencionPdf';

const ActaObtencionPage = () => {
  const searchParams = useSearchParams();
  const casoId = searchParams.get('casoId') || '';
  const { casos } = useCMSStore();
  const caso = casos.find(c => c.id === casoId);

  const [tipoEvidencia, setTipoEvidencia] = useState<'dispositivo_movil' | 'equipo_computo'>(
    caso?.tipoProyecto === 'forense_discoduro' ? 'equipo_computo' : 'dispositivo_movil'
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PlanillaPdfViewer
      title={`Acta de Obtención por Consignación — Caso #${caso?.numeroCaso || 'N/A'}`}
      document={<ActaObtencionPdf caso={caso} tipoEvidencia={tipoEvidencia} />}
      actions={
        <TextField
          select
          size="small"
          value={tipoEvidencia}
          onChange={(e) => setTipoEvidencia(e.target.value as any)}
          sx={{
            minWidth: 180,
            backgroundColor: '#2A2100',
            borderRadius: '6px',
            '& .MuiOutlinedInput-root': {
              color: '#FECF06',
              fontSize: '12px',
              fontWeight: 700,
              '& fieldset': { borderColor: 'rgba(254, 207, 6, 0.4)' },
            },
          }}
        >
          <MenuItem value="dispositivo_movil">📱 Dispositivo Móvil</MenuItem>
          <MenuItem value="equipo_computo">💻 Equipo de Cómputo</MenuItem>
        </TextField>
      }
    />
  );
};

export default ActaObtencionPage;
