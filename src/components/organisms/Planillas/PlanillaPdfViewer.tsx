'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import DescriptionIcon from '@mui/icons-material/Description';
import PrintIcon from '@mui/icons-material/Print';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { exportPlanillaToWordDocx } from '@/lib/export/exportWordDocx';
import { printPdfBlob } from '@/lib/pdf/planillaPdfEngine';

const PDFViewerNative = dynamic(
  () => import('@react-pdf/renderer').then(mod => mod.PDFViewer),
  {
    ssr: false,
    loading: () => (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '600px', backgroundColor: '#0D1117', color: '#FECF06', gap: 2 }}>
        <CircularProgress sx={{ color: '#FECF06' }} size={40} />
        <Typography sx={{ fontSize: '13px', fontWeight: 700, fontFamily: 'monospace' }}>
          Generando vista previa vectorial PDF (Papel Folio 216mm x 330mm)...
        </Typography>
      </Box>
    ),
  }
);

export interface PlanillaPdfViewerProps {
  document?: React.ReactElement<any>;
  pdfBlob?: Blob | null;
  title?: string;
  isGenerating?: boolean;
  actions?: React.ReactNode;
  caso?: any;
}

const NORMATIVAS_PLANILLA = [
  { label: 'MUCC-2017 § 4', color: '#FECF06' },
  { label: 'ISO 27037:2012', color: '#00FF41' },
  { label: 'COPP Art. 187', color: '#FECF06' },
  { label: 'Ley Mensajes Datos', color: '#9DFF00' },
];

export default function PlanillaPdfViewer({ document, pdfBlob, title = 'Vista Previa PDF', isGenerating = false, actions, caso }: PlanillaPdfViewerProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [isExportingWord, setIsExportingWord] = useState<boolean>(false);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  // Por defecto se visualiza e imprime en blanco (limpio para rellenar a lápiz)
  const [isBlankMode, setIsBlankMode] = useState<boolean>(true);

  useEffect(() => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      setBlobUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setBlobUrl(null);
  }, [pdfBlob]);

  const handleExportWordDocx = async () => {
    setIsExportingWord(true);
    try {
      const element = window.document.querySelector('.planilla-container') as HTMLElement;
      await exportPlanillaToWordDocx(caso, title, element);
    } catch (err) {
      console.error('Error al exportar Word:', err);
    } finally {
      setIsExportingWord(false);
    }
  };

  const handlePrintBlank = async () => {
    if (!document) return;
    setIsPrinting(true);
    try {
      const { pdf } = await import('@react-pdf/renderer');
      // Forzar renderizado en blanco sin datos para impresión limpia a lápiz
      const blankDoc = React.cloneElement(document, { isBlankMode: true });
      const blob = await pdf(blankDoc).toBlob();
      printPdfBlob(blob);
    } catch (err) {
      console.error('Error al imprimir planilla en blanco:', err);
    } finally {
      setIsPrinting(false);
    }
  };

  // Clona el documento React pasando la propiedad isBlankMode dinámica
  const activeDocument = document ? React.cloneElement(document, { isBlankMode }) : null;

  return (
    <Box sx={{ width: '100%', maxWidth: '1100px', mx: 'auto', my: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Control Bar (Cyber-Legal Blueprint Style) */}
      <Box
        sx={{
          p: 2,
          backgroundColor: '#161B22',
          border: '1px solid rgba(48, 54, 61, 0.8)',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { md: 'center' },
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontSize: '15px', fontWeight: 800, color: '#FECF06', display: 'flex', alignItems: 'center', gap: 1 }}>
            📄 {title}
          </Typography>
          <Stack direction="row" spacing={0.5} sx={{ mt: 0.75, flexWrap: 'wrap', gap: 0.5 }}>
            {NORMATIVAS_PLANILLA.map(n => (
              <Chip
                key={n.label}
                label={n.label}
                size="small"
                sx={{
                  fontSize: '9px', height: '16px', fontFamily: 'monospace', fontWeight: 700,
                  backgroundColor: `${n.color}12`, color: n.color, border: `1px solid ${n.color}30`,
                }}
              />
            ))}
          </Stack>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          {/* Selector Modo en Blanco vs Con Datos del Caso */}
          <ToggleButtonGroup
            value={isBlankMode ? 'blank' : 'filled'}
            exclusive
            onChange={(_, val) => {
              if (val !== null) setIsBlankMode(val === 'blank');
            }}
            size="small"
            sx={{
              backgroundColor: '#0D1117',
              border: '1px solid rgba(254, 207, 6, 0.4)',
              borderRadius: '6px',
              '& .MuiToggleButton-root': {
                color: '#8B949E',
                fontSize: '11px',
                fontWeight: 700,
                px: 1.5,
                py: 0.5,
                textTransform: 'none',
                border: 'none',
                '&.Mui-selected': {
                  backgroundColor: isBlankMode ? '#FECF06' : '#00FF41',
                  color: '#000000',
                  fontWeight: 800,
                  '&:hover': { backgroundColor: isBlankMode ? '#E5B800' : '#00CC33' },
                },
              },
            }}
          >
            <ToggleButton value="blank">
              <EditNoteIcon sx={{ fontSize: 15, mr: 0.5 }} /> ✏️ PLANILLA EN BLANCO
            </ToggleButton>
            <ToggleButton value="filled">
              📋 CON DATOS
            </ToggleButton>
          </ToggleButtonGroup>

          {/* Selección de dispositivo / acciones adicionales */}
          {actions}

          {/* Botón Principal: IMPRIMIR PLANILLA EN BLANCO */}
          <Button
            variant="contained"
            size="small"
            startIcon={isPrinting ? <CircularProgress size={14} sx={{ color: '#000000' }} /> : <PrintIcon />}
            onClick={handlePrintBlank}
            disabled={isPrinting || !document}
            sx={{
              backgroundColor: '#FECF06',
              color: '#000000',
              fontWeight: 800,
              fontSize: '11px',
              px: 2,
              '&:hover': { backgroundColor: '#E5B800' },
            }}
          >
            🖨️ IMPRIMIR EN BLANCO
          </Button>

          {/* Exportar a Word (.DOCX) */}
          <Button
            variant="outlined"
            size="small"
            startIcon={isExportingWord ? <CircularProgress size={14} sx={{ color: '#00FF41' }} /> : <DescriptionIcon />}
            onClick={handleExportWordDocx}
            disabled={isExportingWord}
            sx={{
              borderColor: 'rgba(0, 255, 65, 0.4)',
              color: '#00FF41',
              fontWeight: 700,
              fontSize: '11px',
              '&:hover': { borderColor: '#00FF41', backgroundColor: 'rgba(0, 255, 65, 0.08)' },
            }}
          >
            WORD (.DOCX)
          </Button>
        </Box>
      </Box>

      {/* PDF Container */}
      <Box
        sx={{
          width: '100%',
          height: '820px',
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid rgba(48, 54, 61, 0.8)',
          boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
          backgroundColor: '#0D1117',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isGenerating ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, color: '#FECF06' }}>
            <CircularProgress sx={{ color: '#FECF06' }} size={40} />
            <Typography sx={{ fontSize: '14px', fontWeight: 700, fontFamily: 'monospace' }}>Procesando documento PDF...</Typography>
          </Box>
        ) : activeDocument ? (
          <PDFViewerNative style={{ width: '100%', height: '100%', border: 'none' }}>
            {activeDocument as any}
          </PDFViewerNative>
        ) : blobUrl ? (
          <iframe src={blobUrl} style={{ width: '100%', height: '100%', border: 'none' }} title={title} />
        ) : (
          <Typography sx={{ color: '#8B949E', fontSize: '14px' }}>No hay documento PDF cargado.</Typography>
        )}
      </Box>
    </Box>
  );
}
