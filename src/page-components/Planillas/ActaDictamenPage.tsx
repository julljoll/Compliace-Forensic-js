'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useCMSStore } from '../../store/cmsStore';
import PlanillaPdfViewer from '../../components/organisms/Planillas/PlanillaPdfViewer';
import ActaDictamenPdf from '../../lib/pdf/documents/ActaDictamenPdf';

const ActaDictamenPage = () => {
  const searchParams = useSearchParams();
  const casoId = searchParams.get('casoId') || '';
  const { casos } = useCMSStore();
  const caso = casos.find(c => c.id === casoId);

  const [isBlankMode, setIsBlankMode] = useState<boolean>(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PlanillaPdfViewer
      title={`Dictamen Pericial Informático Forense — Caso #${caso?.numeroCaso || 'N/A'}`}
      caso={caso}
      document={<ActaDictamenPdf caso={caso} isBlankMode={isBlankMode} />}
      actions={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
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
        </Box>
      }
    />
  );
};

export default ActaDictamenPage;
