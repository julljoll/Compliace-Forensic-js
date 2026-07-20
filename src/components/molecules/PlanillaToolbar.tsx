'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MuiButton from '@mui/material/Button';

import { Printer, Archive, ArrowLeft, AlertTriangle, CheckCircle2 } from '../atoms/AppleIcon';

interface CampoRequerido {
  valor: string | undefined;
  nombre: string;
}

interface PlanillaToolbarProps {
  onPrint: () => void;
  onDownloadZip: () => void;
  tituloDocumento: string;
  camposRequeridos?: CampoRequerido[];
  casoId?: string;
}

export default function PlanillaToolbar({
  onPrint,
  onDownloadZip,
  tituloDocumento,
  camposRequeridos = [],
  casoId,
}: PlanillaToolbarProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    setMounted(true);
    const container = document.querySelector('.planilla-container');
    if (container) {
      setIsPreview(container.classList.contains('modo-vista-previa'));
    }
    return () => setMounted(false);
  }, []);

  const handleSetPreview = (preview: boolean) => {
    const container = document.querySelector('.planilla-container');
    if (container) {
      if (preview) {
        container.classList.add('modo-vista-previa');
      } else {
        container.classList.remove('modo-vista-previa');
      }
      setIsPreview(preview);
    }
  };

  const faltantes = camposRequeridos.filter(
    (f) => !f.valor || f.valor === 'N/A' || !f.valor.trim()
  );

  const handleBack = () => {
    if (casoId) {
      router.push(`/casos?id=${casoId}`);
    } else {
      router.back();
    }
  };

  if (!mounted) return null;

  return createPortal(
    <Box
      className="no-print"
      sx={{
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1300,
        maxWidth: '95vw',
      }}
    >
      <Paper
        elevation={12}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          px: 2.5,
          py: 1.5,
          backgroundColor: '#121412',
          border: '1px solid rgba(254, 207, 6, 0.4)',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
        }}
      >
        {/* Back Button */}
        <IconButton
          onClick={handleBack}
          size="small"
          sx={{ color: '#FECF06', '&:hover': { backgroundColor: 'rgba(254, 207, 6, 0.1)' } }}
        >
          <ArrowLeft size={18} />
        </IconButton>

        <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(254, 207, 6, 0.2)' }} />

        {/* Title and Mode Switcher */}
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {tituloDocumento}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mt: 0.5 }}>
            <Typography sx={{ fontSize: '10px', color: '#AEAEB2', fontWeight: 700, textTransform: 'uppercase' }}>
              Modo:
            </Typography>
            <Box sx={{ display: 'flex', backgroundColor: '#000000', p: '2px', borderRadius: '6px', border: '1px solid rgba(254, 207, 6, 0.2)' }}>
              <MuiButton
                size="small"
                onClick={() => handleSetPreview(false)}
                sx={{
                  px: 1.5,
                  py: 0.25,
                  fontSize: '9px',
                  fontWeight: 700,
                  minWidth: 'auto',
                  borderRadius: '4px',
                  backgroundColor: !isPreview ? '#FECF06' : 'transparent',
                  color: !isPreview ? '#000000' : '#AEAEB2',
                  '&:hover': { backgroundColor: !isPreview ? '#FFE052' : 'rgba(255,255,255,0.05)' },
                }}
              >
                Edición
              </MuiButton>
              <MuiButton
                size="small"
                onClick={() => handleSetPreview(true)}
                sx={{
                  px: 1.5,
                  py: 0.25,
                  fontSize: '9px',
                  fontWeight: 700,
                  minWidth: 'auto',
                  borderRadius: '4px',
                  backgroundColor: isPreview ? '#FECF06' : 'transparent',
                  color: isPreview ? '#000000' : '#AEAEB2',
                  '&:hover': { backgroundColor: isPreview ? '#FFE052' : 'rgba(255,255,255,0.05)' },
                }}
              >
                Vista Previa
              </MuiButton>
            </Box>
          </Stack>
        </Box>

        {/* Validation Badge */}
        {camposRequeridos.length > 0 && (
          <>
            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(254, 207, 6, 0.2)' }} />
            <Chip
              size="small"
              icon={faltantes.length > 0 ? <AlertTriangle size={12} /> : <CheckCircle2 size={12} />}
              label={faltantes.length > 0 ? `${faltantes.length} vacíos` : 'Listo'}
              sx={{
                fontWeight: 700,
                backgroundColor: faltantes.length > 0 ? 'rgba(255, 149, 0, 0.15)' : 'rgba(0, 255, 65, 0.15)',
                color: faltantes.length > 0 ? '#FF9500' : '#00FF41',
                border: `1px solid ${faltantes.length > 0 ? 'rgba(255, 149, 0, 0.3)' : 'rgba(0, 255, 65, 0.3)'}`,
              }}
            />
          </>
        )}

        <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(254, 207, 6, 0.2)' }} />

        {/* Action Buttons */}
        <Stack direction="row" spacing={1}>
          <MuiButton
            variant="outlined"
            size="small"
            onClick={onDownloadZip}
            startIcon={<Archive size={14} />}
            sx={{
              borderColor: '#00FF41',
              color: '#00FF41',
              fontWeight: 700,
              fontSize: '11px',
              '&:hover': { borderColor: '#52FF80', backgroundColor: 'rgba(0, 255, 65, 0.08)' },
            }}
          >
            ZIP / Word
          </MuiButton>

          <MuiButton
            variant="contained"
            size="small"
            onClick={onPrint}
            startIcon={<Printer size={14} />}
            sx={{
              backgroundColor: '#FECF06',
              color: '#000000',
              fontWeight: 800,
              fontSize: '11px',
              '&:hover': { backgroundColor: '#FFE052' },
            }}
          >
            Imprimir
          </MuiButton>
        </Stack>
      </Paper>
    </Box>,
    document.body
  );
}
