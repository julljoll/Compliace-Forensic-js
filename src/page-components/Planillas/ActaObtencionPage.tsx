'use client';

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

import { useCMSStore } from '../../store/cmsStore';
import './Planillas.css';
import { downloadPlanillaZip } from './downloadPlanillaZip';
import PlanillaToolbar from '../../components/molecules/PlanillaToolbar';
import ActaObtencion from '../../components/organisms/Planillas/ActaObtencion';

export default function ActaObtencionPage() {
  const searchParams = useSearchParams();
  const casoId = searchParams.get('casoId') || '';
  const { casos } = useCMSStore();
  const caso = casos.find(c => c.id === casoId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const camposRequeridos = [
    { valor: caso?.numeroCaso, nombre: 'Número de Caso / Expediente' },
    { valor: caso?.solicitante_nombre, nombre: 'Nombre del Consignante' },
    { valor: caso?.solicitante_cedula, nombre: 'Cédula del Consignante' },
    { valor: caso?.peritoLider, nombre: 'Nombre del Perito Receptor' },
  ];

  const handlePrint = () => {
    const faltantes = camposRequeridos.filter(f => !f.valor || f.valor === 'N/A' || !f.valor.trim());
    if (faltantes.length > 0) {
      const confirmar = window.confirm(
        `Campos incompletos en el expediente:\n${faltantes.map(f => `• ${f.nombre}`).join('\n')}\n\n¿Desea proceder con la impresión para llenarla a mano?`
      );
      if (!confirmar) return;
    }
    window.print();
  };

  const casoNum = caso?.numeroCaso || 'caso';

  return (
    <div className="planilla-container">
      {/* MUI Topbar */}
      <Box
        className="no-print"
        sx={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          p: 2,
          mb: 3,
          backgroundColor: '#121412',
          border: '1px solid rgba(254, 207, 6, 0.3)',
          borderRadius: '8px',
        }}
      >
        <Box>
          <Typography component="h1" sx={{ fontSize: '16px', fontWeight: 700, color: '#00FF41', fontFamily: 'monospace' }}>
            ACTA DE OBTENCIÓN POR CONSIGNACIÓN
          </Typography>
          <Typography sx={{ fontSize: '11px', color: '#AEAEB2' }}>
            Formato Oficial Pericial · Documento Certificado para Juicio
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Chip label="MUCC-2017" size="small" sx={{ backgroundColor: 'rgba(254, 207, 6, 0.15)', color: '#FECF06', fontWeight: 700 }} />
          <Chip label="SHA256.US" size="small" sx={{ backgroundColor: 'rgba(0, 255, 65, 0.15)', color: '#00FF41', fontWeight: 700 }} />
        </Stack>
      </Box>

      <ActaObtencion caso={caso} />

      <PlanillaToolbar
        onPrint={handlePrint}
        onDownloadZip={() => downloadPlanillaZip(`ActaObtencion_${casoNum}`, 'Acta de Obtención por Consignación')}
        tituloDocumento="Acta de Obtención por Consignación"
        camposRequeridos={camposRequeridos}
        casoId={casoId}
      />
    </div>
  );
}
