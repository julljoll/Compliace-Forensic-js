import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PrintIcon from '@mui/icons-material/Print';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

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

  const handlePrint = () => {
    const container = document.querySelector('.planilla-container');
    if (container) {
      container.classList.add('modo-vista-previa');
      setIsPreview(true);
    }
    onPrint();
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
        elevation={8}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: '10px 18px',
          backgroundColor: 'rgba(18, 20, 18, 0.92)',
          border: '1px solid rgba(254, 207, 6, 0.3)',
          backdropFilter: 'blur(12px)',
          borderRadius: '10px',
        }}
      >
        {/* Botón Volver */}
        <IconButton
          onClick={handleBack}
          title="Volver al Expediente"
          size="small"
          sx={{ color: '#AEAEB2', '&:hover': { color: '#FFFFFF', backgroundColor: 'rgba(255,255,255,0.08)' } }}
        >
          <ArrowBackIcon fontSize="small" />
        </IconButton>

        <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(254, 207, 6, 0.2)' }} />

        {/* Título & Selector Edición / Vista Previa */}
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#FFFFFF', lineHeight: 1.2 }}>
            {tituloDocumento}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mt: 0.5 }}>
            <Typography sx={{ fontSize: '9px', fontWeight: 700, color: '#AEAEB2', textTransform: 'uppercase' }}>
              Modo:
            </Typography>
            <Stack direction="row" sx={{ background: '#000000', p: '2px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Button
                size="small"
                onClick={() => handleSetPreview(false)}
                sx={{
                  px: 1,
                  py: 0.2,
                  minWidth: 0,
                  fontSize: '8px',
                  fontWeight: 700,
                  borderRadius: '3px',
                  color: !isPreview ? '#000000' : '#AEAEB2',
                  backgroundColor: !isPreview ? '#FECF06' : 'transparent',
                  '&:hover': { backgroundColor: !isPreview ? '#e0b700' : 'rgba(255,255,255,0.08)' },
                }}
              >
                EDICIÓN
              </Button>
              <Button
                size="small"
                onClick={() => handleSetPreview(true)}
                sx={{
                  px: 1,
                  py: 0.2,
                  minWidth: 0,
                  fontSize: '8px',
                  fontWeight: 700,
                  borderRadius: '3px',
                  color: isPreview ? '#000000' : '#AEAEB2',
                  backgroundColor: isPreview ? '#FECF06' : 'transparent',
                  '&:hover': { backgroundColor: isPreview ? '#e0b700' : 'rgba(255,255,255,0.08)' },
                }}
              >
                VISTA PREVIA
              </Button>
            </Stack>
          </Stack>
        </Box>

        {/* Badge de validación */}
        {camposRequeridos.length > 0 && (
          <>
            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(254, 207, 6, 0.2)' }} />
            <Chip
              icon={faltantes.length > 0 ? <WarningAmberIcon sx={{ fontSize: '14px !important' }} /> : <CheckCircleIcon sx={{ fontSize: '14px !important' }} />}
              label={faltantes.length > 0 ? `${faltantes.length} vacíos` : 'Listo'}
              size="small"
              sx={{
                fontSize: '10px',
                fontWeight: 700,
                backgroundColor: faltantes.length > 0 ? 'rgba(255, 149, 0, 0.15)' : 'rgba(0, 255, 65, 0.15)',
                color: faltantes.length > 0 ? '#FF9500' : '#00FF41',
                border: faltantes.length > 0 ? '1px solid rgba(255, 149, 0, 0.3)' : '1px solid rgba(0, 255, 65, 0.3)',
              }}
            />
          </>
        )}

        <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(254, 207, 6, 0.2)' }} />

        {/* Botón Imprimir */}
        <Button
          variant="contained"
          size="small"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          sx={{
            backgroundColor: '#FECF06',
            color: '#000000',
            fontWeight: 700,
            fontSize: '11px',
            px: 2,
            py: 0.8,
            boxShadow: '0 4px 12px rgba(254, 207, 6, 0.3)',
            '&:hover': {
              backgroundColor: '#e0b700',
              boxShadow: '0 6px 16px rgba(254, 207, 6, 0.5)',
            },
          }}
        >
          Imprimir
        </Button>
      </Paper>
    </Box>,
    document.body
  );
}
