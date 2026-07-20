import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { X } from './AppleIcon';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            backgroundColor: '#121412',
            border: '1px solid rgba(254, 207, 6, 0.35)',
            borderRadius: '20px',
            boxShadow: '0 12px 32px rgba(0,0,0,0.8)',
            p: '16px',
          },
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: '12px 16px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box sx={{ pr: 2 }}>
          <Typography component="h3" sx={{ fontSize: '20px', fontWeight: 700, color: '#FECF06' }}>
            {title}
          </Typography>
          {description && (
            <Typography sx={{ fontSize: '14px', color: '#AEAEB2', mt: '4px' }}>
              {description}
            </Typography>
          )}
        </Box>
        <IconButton
          aria-label="Cerrar modal"
          onClick={onClose}
          sx={{
            color: '#AEAEB2',
            '&:hover': {
              color: '#FFFFFF',
              backgroundColor: 'rgba(254, 207, 6, 0.08)',
            },
          }}
        >
          <X size={16} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: '16px', maxHeight: '70vh' }} dividers>
        {children}
      </DialogContent>

      {footer && (
        <DialogActions sx={{ p: '16px', gap: '12px', borderTop: '1px solid rgba(254, 207, 6, 0.2)' }}>
          {footer}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default Modal;
