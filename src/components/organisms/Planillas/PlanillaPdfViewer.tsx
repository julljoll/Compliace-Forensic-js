'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import DescriptionIcon from '@mui/icons-material/Description';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { exportPlanillaToGoogleDocs } from '@/lib/export/exportGoogleDocs';

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
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isPreviewBlank, setIsPreviewBlank] = useState<boolean>(false);

  useEffect(() => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      setBlobUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setBlobUrl(null);
  }, [pdfBlob]);

  const handleExportGoogleDoc = () => {
    exportPlanillaToGoogleDocs(caso, title);
  };

  // Descarga el PDF completamente LIMPIO / EN BLANCO para ser llenado a mano
  const handleDownloadCleanPdf = async () => {
    if (!document) return;
    setIsDownloading(true);
    try {
      const { pdf } = await import('@react-pdf/renderer');
      const cleanDocument = React.cloneElement(document, { isBlankMode: true });
      const blob = await pdf(cleanDocument).toBlob();
      const url = URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      const cleanTitle = title.replace(/[^a-zA-Z0-9_-]/g, '_');
      link.download = `${cleanTitle}_LIMPIA_EN_BLANCO.pdf`;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generando PDF limpio:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Imprime la versión en blanco
  const handlePrintClean = async () => {
    if (!document) {
      window.print();
      return;
    }
    try {
      const { pdf } = await import('@react-pdf/renderer');
      const cleanDocument = React.cloneElement(document, { isBlankMode: true });
      const blob = await pdf(cleanDocument).toBlob();
      const url = URL.createObjectURL(blob);
      const win = window.open(url, '_blank');
      win?.print();
    } catch (err) {
      window.print();
    }
  };

  const currentDocument = document
    ? React.cloneElement(document, { isBlankMode: isPreviewBlank })
    : undefined;

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

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          {/* Botón principal: DESCARGAR PDF LIMPIO (EN BLANCO) */}
          <Button
            variant="contained"
            size="small"
            startIcon={isDownloading ? <CircularProgress size={14} sx={{ color: '#000' }} /> : <DownloadIcon />}
            onClick={handleDownloadCleanPdf}
            disabled={isDownloading}
            sx={{
              backgroundColor: '#FECF06',
              color: '#000000',
              fontWeight: 800,
              fontSize: '11px',
              px: 2,
              '&:hover': { backgroundColor: '#E5B800' },
            }}
          >
            DESCARGAR PDF LIMPIO
          </Button>

          {/* Imprimir en blanco */}
          <Button
            variant="outlined"
            size="small"
            startIcon={<PrintIcon />}
            onClick={handlePrintClean}
            sx={{
              borderColor: 'rgba(254, 207, 6, 0.4)',
              color: '#FECF06',
              fontWeight: 700,
              fontSize: '11px',
              '&:hover': { borderColor: '#FECF06', backgroundColor: 'rgba(254, 207, 6, 0.08)' },
            }}
          >
            IMPRIMIR LIMPIO
          </Button>

          {/* Toggle para cambiar la vista previa en pantalla */}
          <Button
            variant={isPreviewBlank ? 'contained' : 'outlined'}
            size="small"
            startIcon={isPreviewBlank ? <VisibilityIcon /> : <EditNoteIcon />}
            onClick={() => setIsPreviewBlank(!isPreviewBlank)}
            sx={{
              borderColor: 'rgba(157, 255, 0, 0.4)',
              color: isPreviewBlank ? '#000000' : '#9DFF00',
              backgroundColor: isPreviewBlank ? '#9DFF00' : 'transparent',
              fontWeight: 700,
              fontSize: '11px',
              '&:hover': {
                borderColor: '#9DFF00',
                backgroundColor: isPreviewBlank ? '#85E600' : 'rgba(157, 255, 0, 0.1)',
              },
            }}
          >
            {isPreviewBlank ? 'VER CON EJEMPLOS' : 'PREVISUALIZAR BLANCO'}
          </Button>

          {/* Exportar a Word */}
          <Button
            variant="outlined"
            size="small"
            startIcon={<DescriptionIcon />}
            onClick={handleExportGoogleDoc}
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

          {actions}
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
        ) : currentDocument ? (
          <PDFViewerNative style={{ width: '100%', height: '100%', border: 'none' }}>
            {currentDocument as any}
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
