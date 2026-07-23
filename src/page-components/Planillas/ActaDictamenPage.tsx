'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import ImageSearchOutlinedIcon from '@mui/icons-material/ImageSearchOutlined';
import AudiotrackOutlinedIcon from '@mui/icons-material/AudiotrackOutlined';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { useCMSStore } from '../../store/cmsStore';
import PlanillaPdfViewer from '../../components/organisms/Planillas/PlanillaPdfViewer';
import DictamenImagenesPdf from '../../lib/pdf/documents/DictamenImagenesPdf';
import DictamenAudiosPdf from '../../lib/pdf/documents/DictamenAudiosPdf';

type DictamenMode = 'imagenes' | 'audios';

const ActaDictamenPage = () => {
  const searchParams = useSearchParams();
  const casoId = searchParams.get('casoId') || '';
  const { casos } = useCMSStore();
  const caso = casos.find(c => c.id === casoId);

  const [dictamenMode, setDictamenMode] = useState<DictamenMode>('imagenes');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const isImageMode = dictamenMode === 'imagenes';

  const currentDocument = isImageMode
    ? <DictamenImagenesPdf caso={caso} isBlankMode={false} />
    : <DictamenAudiosPdf caso={caso} isBlankMode={false} />;

  const currentTitle = isImageMode
    ? `Dictamen Pericial — Análisis de IMÁGENES — Caso #${caso?.numeroCaso || 'N/A'}`
    : `Dictamen Pericial — Análisis de AUDIOS WhatsApp — Caso #${caso?.numeroCaso || 'N/A'}`;

  return (
    <PlanillaPdfViewer
      title={currentTitle}
      caso={caso}
      document={currentDocument}
      actions={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* Selector de versión del dictamen */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid rgba(254, 207, 6, 0.3)',
              borderRadius: '6px',
              overflow: 'hidden',
              backgroundColor: '#0D1117',
            }}
          >
            <Tooltip title="Dictamen de Análisis Fotográfico — ELA / Copy-Move / JPEG Ghost / EXIF" arrow>
              <Button
                variant={isImageMode ? 'contained' : 'text'}
                size="small"
                startIcon={<ImageSearchOutlinedIcon />}
                onClick={() => setDictamenMode('imagenes')}
                sx={{
                  borderRadius: 0,
                  backgroundColor: isImageMode ? '#FECF06' : 'transparent',
                  color: isImageMode ? '#000000' : '#FECF06',
                  fontWeight: 800,
                  fontSize: '10px',
                  px: 1.5,
                  py: 0.75,
                  minWidth: 0,
                  borderRight: '1px solid rgba(254, 207, 6, 0.2)',
                  '&:hover': {
                    backgroundColor: isImageMode ? '#E5B800' : 'rgba(254, 207, 6, 0.12)',
                  },
                }}
              >
                🖼️ IMÁGENES
              </Button>
            </Tooltip>

            <Box sx={{ display: 'flex', alignItems: 'center', px: 0.5 }}>
              <SwapHorizIcon sx={{ fontSize: 14, color: 'rgba(254,207,6,0.4)' }} />
            </Box>

            <Tooltip title="Dictamen de Análisis Acústico — Espectrograma / Formantes / SNR / Hash Opus" arrow>
              <Button
                variant={!isImageMode ? 'contained' : 'text'}
                size="small"
                startIcon={<AudiotrackOutlinedIcon />}
                onClick={() => setDictamenMode('audios')}
                sx={{
                  borderRadius: 0,
                  backgroundColor: !isImageMode ? '#00FF41' : 'transparent',
                  color: !isImageMode ? '#000000' : '#00FF41',
                  fontWeight: 800,
                  fontSize: '10px',
                  px: 1.5,
                  py: 0.75,
                  minWidth: 0,
                  borderLeft: '1px solid rgba(0, 255, 65, 0.2)',
                  '&:hover': {
                    backgroundColor: !isImageMode ? '#00CC33' : 'rgba(0, 255, 65, 0.12)',
                  },
                }}
              >
                🎵 AUDIOS WA
              </Button>
            </Tooltip>
          </Box>

          {/* Badge indicador del modo activo */}
          <Chip
            label={isImageMode
              ? '8 págs. · ELA · Copy-Move · EXIF · Daubert/FRE 702'
              : '8 págs. · Espectrograma · Formantes · SNR · Daubert/FRE 702'}
            size="small"
            sx={{
              fontSize: '8px',
              height: '18px',
              fontFamily: 'monospace',
              fontWeight: 700,
              backgroundColor: isImageMode
                ? 'rgba(254, 207, 6, 0.1)'
                : 'rgba(0, 255, 65, 0.1)',
              color: isImageMode ? '#FECF06' : '#00FF41',
              border: `1px solid ${isImageMode ? 'rgba(254,207,6,0.3)' : 'rgba(0,255,65,0.3)'}`,
            }}
          />
        </Box>
      }
    />
  );
};

export default ActaDictamenPage;
