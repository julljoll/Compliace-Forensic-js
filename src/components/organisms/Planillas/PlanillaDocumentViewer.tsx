'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import EditNoteIcon from '@mui/icons-material/EditNote';
import GridViewIcon from '@mui/icons-material/GridView';
import { printPdfBlob, generatePdfBlobFromElement } from '@/lib/pdf/planillaPdfEngine';

interface PlanillaDocumentViewerProps {
  children: React.ReactNode;
  title?: string;
  filenamePrefix?: string;
}

export default function PlanillaDocumentViewer({
  children,
  title = 'Documento Pericial Forense',
  filenamePrefix = 'Planilla_Forense',
}: PlanillaDocumentViewerProps) {
  const [zoom, setZoom] = useState<number>(100);
  const [showMarginGuides, setShowMarginGuides] = useState<boolean>(false);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 15, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 15, 50));
  const handleResetZoom = () => setZoom(100);

  const handlePrintDocument = async () => {
    const el = document.querySelector('.planilla-container') as HTMLElement;
    if (el) {
      try {
        const blob = await generatePdfBlobFromElement(el, title);
        printPdfBlob(blob);
      } catch {
        window.print();
      }
    } else {
      window.print();
    }
  };

  const handleDownloadPdf = async () => {
    const el = document.querySelector('.planilla-container') as HTMLElement;
    if (!el) return;
    try {
      const blob = await generatePdfBlobFromElement(el, title);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filenamePrefix}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error al descargar PDF:', err);
    }
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* BARRA DE HERRAMIENTAS DE PREVISUALIZACIÓN DE DOCUMENTO FOLIO (NO IMPRIMIBLE) */}
      <Box
        className="no-print"
        sx={{
          width: '100%',
          maxWidth: '216mm',
          backgroundColor: '#1E1800',
          border: '1px solid rgba(254, 207, 6, 0.3)',
          borderRadius: '8px',
          px: 2,
          py: 1,
          mb: 2.5,
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          flexWrap: 'wrap',
          gap: 1.5,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* TITULO Y MODO TEXTO VIVO */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EditNoteIcon sx={{ color: '#00FF41', fontSize: 20 }} />
          <Box>
            <Typography variant="subtitle2" sx={{ color: '#FECF06', fontWeight: 700, fontSize: '12px', lineHeight: 1.2 }}>
              {title}
            </Typography>

          </Box>
        </Box>

        {/* CONTROLES DE ZOOM Y GUÍAS DE MARGEN */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Alejar (Zoom -15%)">
            <span>
              <IconButton size="small" onClick={handleZoomOut} disabled={zoom <= 50} sx={{ color: '#FECF06' }}>
                <ZoomOutIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>

          <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '11px', minWidth: '42px', textAlign: 'center', fontFamily: 'monospace' }}>
            {zoom}%
          </Typography>

          <Tooltip title="Acercar (Zoom +15%)">
            <span>
              <IconButton size="small" onClick={handleZoomIn} disabled={zoom >= 200} sx={{ color: '#FECF06' }}>
                <ZoomInIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title="Restablecer Zoom a 100%">
            <IconButton size="small" onClick={handleResetZoom} sx={{ color: '#AEAEB2', ml: 0.5 }}>
              <RestartAltIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title={showMarginGuides ? 'Ocultar Guías de Margen' : 'Mostrar Guías de Margen (4cm/1.5cm)'}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<GridViewIcon fontSize="small" />}
              onClick={() => setShowMarginGuides(!showMarginGuides)}
              sx={{
                ml: 1,
                fontSize: '10px',
                fontWeight: 700,
                color: showMarginGuides ? '#00FF41' : '#AEAEB2',
                borderColor: showMarginGuides ? 'rgba(0, 255, 65, 0.4)' : 'rgba(255, 255, 255, 0.15)',
                '&:hover': { borderColor: showMarginGuides ? '#00FF41' : '#FFFFFF' },
              }}
            >
              {showMarginGuides ? 'GUÍAS ACTIVAS' : 'MOSTRAR MÁRGENES'}
            </Button>
          </Tooltip>
        </Box>

        {/* ACCIONES DE IMPRESIÓN Y DESCARGA VECTORIAL */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<DownloadIcon fontSize="small" />}
            onClick={handleDownloadPdf}
            sx={{
              color: '#00FF41',
              borderColor: 'rgba(0, 255, 65, 0.4)',
              fontWeight: 700,
              fontSize: '11px',
              '&:hover': { borderColor: '#00FF41', backgroundColor: 'rgba(0, 255, 65, 0.12)' },
            }}
          >
            DESCARGAR PDF
          </Button>

          <Button
            variant="contained"
            size="small"
            startIcon={<PrintIcon fontSize="small" />}
            onClick={handlePrintDocument}
            sx={{
              backgroundColor: '#FECF06',
              color: '#000000',
              fontWeight: 700,
              fontSize: '11px',
              '&:hover': { backgroundColor: '#e0b700' },
            }}
          >
            IMPRIMIR DOCUMENTO
          </Button>
        </Box>
      </Box>

      {/* ÁREA DE DOCUMENTO EN TEXTO VIVO CON ZOOM Y MARGENES */}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'top center',
          transition: 'transform 0.2s ease-in-out',
          '& .page': showMarginGuides
            ? {
                outline: '1px dashed rgba(0, 255, 65, 0.5)',
                outlineOffset: '-2px',
              }
            : {},
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
