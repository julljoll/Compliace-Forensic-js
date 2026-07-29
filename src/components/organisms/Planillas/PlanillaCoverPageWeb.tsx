'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ShieldIcon from '@mui/icons-material/Shield';
import GavelIcon from '@mui/icons-material/Gavel';
import DescriptionIcon from '@mui/icons-material/Description';
import { getPlanillaRegistry } from '@/data/planillasRegistry';

interface PlanillaCoverPageWebProps {
  planillaId: string;
  caso?: any;
  peritoNombre?: string;
}

export function PlanillaCoverPageWeb({ planillaId, caso, peritoNombre }: PlanillaCoverPageWebProps) {
  const registry = getPlanillaRegistry(planillaId);
  const c = caso || {};

  const expNumero = c.numeroCaso || 'EXP-2026-SHA-0091';
  const prccNumero = c.numeroPRCC || 'PRCC-2026-0042';
  const fechaEmision = c.fecha || '23/07/2026 - 09:30 AM';
  const perito = peritoNombre || c.peritoAsignado || 'Ing. Carlos Perdomo (Perito Forense CIP-8492)';

  return (
    <Paper
      elevation={4}
      sx={{
        backgroundColor: '#161B22',
        color: '#E6EDF3',
        border: '1.5px solid rgba(254, 207, 6, 0.4)',
        borderRadius: '12px',
        p: { xs: 2.5, md: 4 },
        mb: 4,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      }}
    >
      {/* Listón de Clasificación Legal */}
      <Box
        sx={{
          backgroundColor: '#0D1117',
          border: '1px solid rgba(254, 207, 6, 0.5)',
          borderRadius: '6px',
          px: 2,
          py: 1,
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShieldIcon sx={{ color: '#FECF06', fontSize: 18 }} />
          <Typography sx={{ fontSize: '11px', fontWeight: 800, color: '#FECF06', letterSpacing: '0.8px', fontFamily: 'monospace' }}>
            DOSSIER FORENSE OFICIAL — FOLIO 01 (PORTADA RECEPTORA)
          </Typography>
        </Box>
        <Chip
          label={registry.codigo}
          size="small"
          sx={{
            backgroundColor: '#2A2100',
            color: '#00FF41',
            fontWeight: 800,
            fontSize: '11px',
            fontFamily: 'monospace',
            border: '1px solid #00FF41',
          }}
        />
      </Box>

      {/* Bloque Central con Título y Subtítulo */}
      <Box
        sx={{
          textAlign: 'center',
          py: 3,
          px: 2,
          backgroundColor: 'rgba(13, 17, 23, 0.6)',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          mb: 3,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 900,
            color: '#FECF06',
            fontSize: { xs: '18px', md: '22px' },
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            mb: 1.5,
          }}
        >
          {registry.nombreOficial}
        </Typography>

        <Typography
          variant="subtitle2"
          sx={{
            color: '#94A3B8',
            fontSize: '13px',
            maxWidth: '750px',
            mx: 'auto',
            mb: 2.5,
          }}
        >
          {registry.subtitulo}
        </Typography>

        {/* Tarjetas de Metadatos del Expediente */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
          <Box sx={{ backgroundColor: '#0D1117', p: 1.5, borderRadius: '6px', border: '1px solid rgba(254, 207, 6, 0.2)' }}>
            <Typography sx={{ fontSize: '10px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
              EXPEDIENTE N°
            </Typography>
            <Typography sx={{ fontSize: '13px', color: '#FFFFFF', fontWeight: 800, fontFamily: 'monospace' }}>
              {expNumero}
            </Typography>
          </Box>
          <Box sx={{ backgroundColor: '#0D1117', p: 1.5, borderRadius: '6px', border: '1px solid rgba(0, 255, 65, 0.2)' }}>
            <Typography sx={{ fontSize: '10px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
              PRCC CORRELATIVO
            </Typography>
            <Typography sx={{ fontSize: '13px', color: '#00FF41', fontWeight: 800, fontFamily: 'monospace' }}>
              {prccNumero}
            </Typography>
          </Box>
          <Box sx={{ backgroundColor: '#0D1117', p: 1.5, borderRadius: '6px', border: '1px solid rgba(157, 255, 0, 0.2)' }}>
            <Typography sx={{ fontSize: '10px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
              FECHA / HORA EMISIÓN
            </Typography>
            <Typography sx={{ fontSize: '13px', color: '#9DFF00', fontWeight: 800, fontFamily: 'monospace' }}>
              {fechaEmision}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Leyenda Dinámica de Secciones Enumeradas */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DescriptionIcon sx={{ color: '#FECF06', fontSize: 20 }} />
            <Typography sx={{ fontSize: '14px', fontWeight: 800, color: '#FECF06' }}>
              LEYENDA DE CONTENIDO ENUMERADO SECCIÓN POR SECCIÓN
            </Typography>
          </Box>
          <Chip
            label={`${registry.sections.length} Secciones`}
            size="small"
            sx={{ backgroundColor: '#21262D', color: '#94A3B8', fontSize: '11px', fontWeight: 700 }}
          />
        </Box>

        <TableContainer component={Paper} sx={{ backgroundColor: '#0D1117', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#21262D' }}>
                <TableCell sx={{ color: '#FECF06', fontWeight: 800, fontSize: '11px', width: '12%' }}>N° SECC.</TableCell>
                <TableCell sx={{ color: '#FECF06', fontWeight: 800, fontSize: '11px', width: '50%' }}>DENOMINACIÓN DE LA SECCIÓN</TableCell>
                <TableCell sx={{ color: '#FECF06', fontWeight: 800, fontSize: '11px', width: '38%' }}>RESUMEN DE CONTENIDO</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {registry.sections.map((sec) => (
                <TableRow key={sec.numero} sx={{ '&:hover': { backgroundColor: 'rgba(254, 207, 6, 0.05)' } }}>
                  <TableCell sx={{ color: '#00FF41', fontWeight: 800, fontFamily: 'monospace', fontSize: '12px' }}>
                    {sec.numero}
                  </TableCell>
                  <TableCell sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '12px' }}>
                    {sec.titulo}
                  </TableCell>
                  <TableCell sx={{ color: '#94A3B8', fontSize: '11px' }}>
                    {sec.descripcion} {sec.camposCount ? `(${sec.camposCount} ítems)` : ''}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Normativas RAG Ancladas */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 2 }}>
        <GavelIcon sx={{ color: '#9DFF00', fontSize: 16 }} />
        <Typography sx={{ fontSize: '11px', fontWeight: 800, color: '#9DFF00', mr: 1 }}>
          MARCO NORMATIVO RAG ANCLADO:
        </Typography>
        {registry.normativas.map((norm, idx) => (
          <Chip
            key={idx}
            label={norm}
            size="small"
            sx={{
              backgroundColor: '#21262D',
              color: '#C9D1D9',
              fontSize: '10px',
              fontWeight: 700,
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          />
        ))}
      </Box>

    </Paper>
  );
}
