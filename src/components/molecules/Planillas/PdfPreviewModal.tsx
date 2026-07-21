'use client';

import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PlanillaPdfViewer from '@/components/organisms/Planillas/PlanillaPdfViewer';

interface PdfPreviewModalProps {
  open: boolean;
  onClose: () => void;
  pdfBlob: Blob | null;
  title?: string;
  isGenerating?: boolean;
}

export default function PdfPreviewModal({
  open,
  onClose,
  pdfBlob,
  title = 'Vista Previa PDF',
  isGenerating = false,
}: PdfPreviewModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            backgroundColor: '#1E1800',
            border: '1px solid rgba(254, 207, 6, 0.4)',
            borderRadius: '12px',
            color: '#FFFFFF',
            minHeight: '85vh',
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(254, 207, 6, 0.25)',
          py: 1.5,
          px: 2.5,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PictureAsPdfIcon sx={{ color: '#FECF06' }} />
          <Typography variant="h6" sx={{ color: '#FECF06', fontWeight: 700, fontSize: '1.1rem' }}>
            {title}
          </Typography>
        </div>
        <IconButton onClick={onClose} sx={{ color: '#AEAEB2', '&:hover': { color: '#FFFFFF' } }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2, display: 'flex', justifyContent: 'center', backgroundColor: '#141000' }}>
        <PlanillaPdfViewer pdfBlob={pdfBlob} title={title} isGenerating={isGenerating} />
      </DialogContent>
    </Dialog>
  );
}
