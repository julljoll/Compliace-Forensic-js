'use client';

import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

export interface CampoFaltante {
  nombre: string;
  valor?: string;
}

interface PlanillaGatingDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirmProceed: () => void;
  camposFaltantes: CampoFaltante[];
  nombrePlanilla: string;
}

export default function PlanillaGatingDialog({
  open,
  onClose,
  onConfirmProceed,
  camposFaltantes,
  nombrePlanilla,
}: PlanillaGatingDialogProps) {
  const hayFaltantes = camposFaltantes.length > 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            backgroundColor: '#1E1800',
            border: '1px solid rgba(254, 207, 6, 0.4)',
            borderRadius: '12px',
            color: '#FFFFFF',
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          color: hayFaltantes ? '#FECF06' : '#00FF41',
          borderBottom: '1px solid rgba(254, 207, 6, 0.2)',
          pb: 1.5,
        }}
      >
        {hayFaltantes ? <WarningAmberIcon /> : <CheckCircleOutlinedIcon />}
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
          {hayFaltantes ? 'Validación de Expediente' : 'Expediente Completo'}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        {hayFaltantes ? (
          <>
            <Typography variant="body2" sx={{ color: '#E5E5EA', mb: 2 }}>
              Se detectaron campos requeridos incompletos en el expediente para la planilla{' '}
              <strong style={{ color: '#FECF06' }}>{nombrePlanilla}</strong>:
            </Typography>

            <Box
              sx={{
                backgroundColor: 'rgba(255, 149, 0, 0.1)',
                border: '1px solid rgba(255, 149, 0, 0.3)',
                borderRadius: '8px',
                p: 1.5,
                mb: 2,
              }}
            >
              <List dense disablePadding>
                {camposFaltantes.map((campo, index) => (
                  <ListItem key={index} disableGutters sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: '28px', color: '#FF9500' }}>•</ListItemIcon>
                    <ListItemText
                      primary={campo.nombre}
                      slotProps={{
                        primary: {
                          sx: {
                            fontSize: '13px',
                            fontFamily: 'monospace',
                            color: '#FFE6A5',
                          },
                        },
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>

            <Typography variant="caption" sx={{ color: '#AEAEB2', display: 'block' }}>
              ¿Desea proceder a generar e imprimir la planilla en blanco/rayada para su llenado manuscrito?
            </Typography>
          </>
        ) : (
          <Typography variant="body2" sx={{ color: '#00FF41' }}>
            Todos los datos obligatorios del expediente se encuentran completos para la planilla{' '}
            <strong>{nombrePlanilla}</strong>.
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(254, 207, 6, 0.15)' }}>
        <Button onClick={onClose} sx={{ color: '#AEAEB2' }}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            onConfirmProceed();
            onClose();
          }}
          sx={{
            backgroundColor: '#FECF06',
            color: '#000000',
            fontWeight: 700,
            '&:hover': { backgroundColor: '#e0b700' },
          }}
        >
          {hayFaltantes ? 'Proceder con Incompletos' : 'Generar y Ver PDF'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
