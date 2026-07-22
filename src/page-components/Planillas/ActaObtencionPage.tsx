'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
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
  const [isBlankMode, setIsBlankMode] = useState<boolean>(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PlanillaPdfViewer
      title={`Acta de Obtención por Consignación — Caso #${caso?.numeroCaso || 'N/A'}`}
      caso={caso}
      document={<ActaObtencionPdf caso={caso} tipoEvidencia={tipoEvidencia} isBlankMode={isBlankMode} />}
      actions={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Button
            variant={isBlankMode ? 'contained' : 'outlined'}
            onClick={() => setIsBlankMode(!isBlankMode)}
            sx={{
              backgroundColor: isBlankMode ? '#FECF06' : 'transparent',
              color: isBlankMode ? '#000000' : '#FECF06',
              borderColor: '#FECF06',
              fontWeight: 800,
              fontSize: '11px',
              px: 2,
              '&:hover': {
                backgroundColor: isBlankMode ? '#E5B800' : 'rgba(254, 207, 6, 0.15)',
              },
            }}
          >
            {isBlankMode ? '📝 MODO PLANILLA EN BLANCO (ACTIVO)' : '📄 CAMBIAR A PLANILLA LIMPIA EN BLANCO'}
          </Button>

          <TextField
            select
            size="small"
            value={tipoEvidencia}
            onChange={(e) => setTipoEvidencia(e.target.value as any)}
            sx={{
              minWidth: 170,
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
        </Box>
      }
    />
  );
};

export default ActaObtencionPage;
