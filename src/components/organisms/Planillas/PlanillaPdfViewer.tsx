'use client';

import React, { ReactElement, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

const PDFViewerNative = dynamic(
  () => import('@react-pdf/renderer').then(mod => mod.PDFViewer),
  {
    ssr: false,
    loading: () => (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '600px', backgroundColor: '#121412', color: '#FECF06', gap: 2 }}>
        <CircularProgress sx={{ color: '#FECF06' }} size={40} />
        <Typography sx={{ fontSize: '14px', fontWeight: 700 }}>
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
}

export default function PlanillaPdfViewer({ document, pdfBlob, title = 'Vista Previa PDF', isGenerating = false, actions }: PlanillaPdfViewerProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      setBlobUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setBlobUrl(null);
  }, [pdfBlob]);

  return (
    <Box sx={{ width: '100%', maxWidth: '1100px', mx: 'auto', my: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Control Bar (Cyber-Legal Blueprint Style) */}
      <Box
        sx={{
          p: 2,
          backgroundColor: '#1E1800',
          border: '1px solid rgba(254, 207, 6, 0.35)',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontSize: '15px', fontWeight: 800, color: '#FECF06', display: 'flex', alignItems: 'center', gap: 1 }}>
          📄 {title}
        </Typography>

        {actions && <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>{actions}</Box>}
      </Box>

      {/* PDF Container */}
      <Box
        sx={{
          width: '100%',
          height: '820px',
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid rgba(254, 207, 6, 0.3)',
          boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
          backgroundColor: '#121412',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isGenerating ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, color: '#FECF06' }}>
            <CircularProgress sx={{ color: '#FECF06' }} size={40} />
            <Typography sx={{ fontSize: '14px', fontWeight: 700 }}>Procesando documento PDF...</Typography>
          </Box>
        ) : document ? (
          <PDFViewerNative style={{ width: '100%', height: '100%', border: 'none' }}>
            {document as any}
          </PDFViewerNative>
        ) : blobUrl ? (
          <iframe src={blobUrl} style={{ width: '100%', height: '100%', border: 'none' }} title={title} />
        ) : (
          <Typography sx={{ color: '#AEAEB2', fontSize: '14px' }}>No hay documento PDF cargado.</Typography>
        )}
      </Box>
    </Box>
  );
}
