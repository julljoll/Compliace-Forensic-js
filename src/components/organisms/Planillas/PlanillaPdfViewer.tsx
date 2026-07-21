'use client';

import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import ViewSidebarIcon from '@mui/icons-material/ViewSidebar';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import RefreshIcon from '@mui/icons-material/Refresh';

import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { downloadPdfBlob, printPdfBlob } from '@/lib/pdf/planillaPdfEngine';

// Configuración del worker de PDF.js para React-PDF
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PlanillaPdfViewerProps {
  pdfBlob: Blob | null;
  title?: string;
  onRefresh?: () => void;
  isGenerating?: boolean;
}

export default function PlanillaPdfViewer({
  pdfBlob,
  title = 'Planilla Forense Oficial',
  onRefresh,
  isGenerating = false,
}: PlanillaPdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.1);
  const [showThumbnails, setShowThumbnails] = useState<boolean>(true);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setPdfUrl(null);
    }
  }, [pdfBlob]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.2, 2.5));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));
  const handlePrevPage = () => setPageNumber(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setPageNumber(prev => Math.min(prev + 1, numPages || 1));

  const handleDownload = () => {
    if (pdfBlob) {
      const cleanTitle = title.replace(/\s+/g, '_');
      downloadPdfBlob(pdfBlob, `${cleanTitle}_SHA256.pdf`);
    }
  };

  const handlePrint = () => {
    if (pdfBlob) {
      printPdfBlob(pdfBlob);
    }
  };

  return (
    <Paper
      elevation={6}
      sx={{
        width: '100%',
        maxWidth: '220mm',
        margin: '0 auto',
        backgroundColor: '#2A2100',
        border: '1px solid rgba(254, 207, 6, 0.3)',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
      }}
    >
      {/* Barra de herramientas Cyber-Legal Blueprint (MUI v6) */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justify: 'space-between',
          gap: 1.5,
          p: 1.5,
          backgroundColor: '#1E1800',
          borderBottom: '1px solid rgba(254, 207, 6, 0.25)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            size="small"
            onClick={() => setShowThumbnails(!showThumbnails)}
            sx={{
              color: showThumbnails ? '#FECF06' : '#8E8E93',
              backgroundColor: showThumbnails ? 'rgba(254, 207, 6, 0.15)' : 'transparent',
              '&:hover': { backgroundColor: 'rgba(254, 207, 6, 0.25)' },
            }}
            title="Mostrar / Ocultar Miniaturas"
          >
            <ViewSidebarIcon fontSize="small" />
          </IconButton>
          <Typography variant="subtitle2" sx={{ color: '#FECF06', fontWeight: 700, fontSize: '13px' }}>
            {title}
          </Typography>
          <Chip
            icon={<VerifiedUserIcon style={{ color: '#00FF41', fontSize: '14px' }} />}
            label="PDF Vectorial OFICIO"
            size="small"
            sx={{
              backgroundColor: 'rgba(0, 255, 65, 0.12)',
              color: '#00FF41',
              borderColor: 'rgba(0, 255, 65, 0.3)',
              fontSize: '11px',
              height: '22px',
              fontFamily: 'monospace',
            }}
            variant="outlined"
          />
        </Box>

        {/* Acciones de Zoom y Navegación */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
          <Tooltip title="Alejar (-)">
            <IconButton size="small" onClick={handleZoomOut} sx={{ color: '#FFFFFF' }}>
              <ZoomOutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Typography
            variant="caption"
            sx={{ color: '#FECF06', fontFamily: 'monospace', px: 1, minWidth: '42px', textAlign: 'center' }}
          >
            {Math.round(scale * 100)}%
          </Typography>
          <Tooltip title="Acercar (+)">
            <IconButton size="small" onClick={handleZoomIn} sx={{ color: '#FFFFFF' }}>
              <ZoomInIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Box sx={{ mx: 1, height: '16px', borderLeft: '1px solid rgba(254, 207, 6, 0.3)' }} />

          <IconButton size="small" onClick={handlePrevPage} disabled={pageNumber <= 1} sx={{ color: '#FFFFFF' }}>
            <NavigateBeforeIcon fontSize="small" />
          </IconButton>
          <Typography variant="caption" sx={{ color: '#FFFFFF', fontFamily: 'monospace', fontSize: '12px' }}>
            {numPages ? `${pageNumber} / ${numPages}` : '1 / 1'}
          </Typography>
          <IconButton
            size="small"
            onClick={handleNextPage}
            disabled={!numPages || pageNumber >= numPages}
            sx={{ color: '#FFFFFF' }}
          >
            <NavigateNextIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Descarga e Impresión */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {onRefresh && (
            <Tooltip title="Regenerar PDF en tiempo real">
              <IconButton
                size="small"
                onClick={onRefresh}
                disabled={isGenerating}
                sx={{ color: '#FECF06', '&:hover': { backgroundColor: 'rgba(254, 207, 6, 0.15)' } }}
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          <Button
            variant="outlined"
            size="small"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            disabled={!pdfBlob}
            sx={{
              color: '#00FF41',
              borderColor: 'rgba(0, 255, 65, 0.4)',
              fontWeight: 700,
              fontSize: '11px',
              textTransform: 'none',
              '&:hover': {
                borderColor: '#00FF41',
                backgroundColor: 'rgba(0, 255, 65, 0.15)',
              },
            }}
          >
            Descargar PDF
          </Button>

          <Button
            variant="contained"
            size="small"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            disabled={!pdfBlob}
            sx={{
              backgroundColor: '#FECF06',
              color: '#000000',
              fontWeight: 700,
              fontSize: '11px',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#e0b700',
              },
            }}
          >
            Imprimir
          </Button>
        </Box>
      </Box>

      {/* ÁREA PRINCIPAL DE VISUALIZACIÓN */}
      <Box
        sx={{
          display: 'flex',
          minHeight: '600px',
          maxHeight: '800px',
          backgroundColor: '#3B3000',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* PANEL LATERAL DE MINIATURAS */}
        {showThumbnails && numPages && pdfUrl && (
          <Box
            sx={{
              width: '140px',
              backgroundColor: '#1E1800',
              borderRight: '1px solid rgba(254, 207, 6, 0.2)',
              p: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              alignItems: 'center',
            }}
          >
            <Typography variant="caption" sx={{ color: '#FECF06', fontWeight: 700, fontSize: '10px' }}>
              HOJAS ({numPages})
            </Typography>
            <Document file={pdfUrl} loading={null}>
              {Array.from(new Array(numPages), (_, index) => (
                <Box
                  key={`thumb_${index + 1}`}
                  onClick={() => setPageNumber(index + 1)}
                  sx={{
                    border: pageNumber === index + 1 ? '2px solid #FECF06' : '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    boxShadow: pageNumber === index + 1 ? '0 0 10px rgba(254, 207, 6, 0.5)' : 'none',
                    transition: 'all 0.2s ease',
                    '&:hover': { borderColor: '#00FF41' },
                  }}
                >
                  <Page pageNumber={index + 1} width={100} renderTextLayer={false} renderAnnotationLayer={false} />
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      textAlign: 'center',
                      backgroundColor: '#2A2100',
                      color: pageNumber === index + 1 ? '#FECF06' : '#8E8E93',
                      fontSize: '9px',
                      py: 0.3,
                    }}
                  >
                    Pág. {index + 1}
                  </Typography>
                </Box>
              ))}
            </Document>
          </Box>
        )}

        {/* LIENZO PRINCIPAL DEL PDF */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            overflow: 'auto',
            p: 3,
            backgroundColor: '#231B00',
          }}
        >
          {isGenerating ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 'auto', gap: 2 }}>
              <CircularProgress sx={{ color: '#FECF06' }} />
              <Typography variant="body2" sx={{ color: '#FECF06', fontFamily: 'monospace' }}>
                Compilando PDF vectorial en tiempo real...
              </Typography>
            </Box>
          ) : pdfUrl ? (
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 8, gap: 2 }}>
                  <CircularProgress sx={{ color: '#00FF41' }} />
                  <Typography variant="caption" sx={{ color: '#00FF41' }}>
                    Cargando documento react-pdf...
                  </Typography>
                </Box>
              }
              error={
                <Box sx={{ p: 4, textAlign: 'center', color: '#FF3B30' }}>
                  <Typography variant="subtitle2">No se pudo cargar la vista previa PDF.</Typography>
                </Box>
              }
            >
              <Paper
                elevation={8}
                sx={{
                  border: '1px solid #FFFFFF',
                  boxShadow: '0 12px 36px rgba(0,0,0,0.8)',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <Page
                  pageNumber={pageNumber}
                  scale={scale}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                />
              </Paper>
            </Document>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 'auto', gap: 1 }}>
              <Typography variant="body2" sx={{ color: '#AEAEB2' }}>
                Genera la vista previa haciendo clic en "Compilar Vista Previa PDF".
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Paper>
  );
}
