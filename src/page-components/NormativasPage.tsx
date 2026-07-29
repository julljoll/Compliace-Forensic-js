'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import GavelIcon from '@mui/icons-material/Gavel';
import DescriptionIcon from '@mui/icons-material/Description';
import SecurityIcon from '@mui/icons-material/Security';
import ScaleIcon from '@mui/icons-material/Scale';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PolicyIcon from '@mui/icons-material/Policy';
import CategoryIcon from '@mui/icons-material/Category';

import { useCMSStore } from '../store/cmsStore';
import { NORMATIVAS_ETAPAS } from '../data/normativasEtapas';
import { PLANILLAS_REGISTRY } from '../data/planillasRegistry';

const CATEGORIAS_FILTRO = [
  { id: 'todas', label: 'Todas', emoji: '📚' },
  { id: 'ISO', label: 'ISO & NIST', emoji: '🛡️' },
  { id: 'LEY', label: 'Leyes TICs & Penal', emoji: '⚖️' },
  { id: 'MANUAL', label: 'Cadena de Custodia', emoji: '📋' },
  { id: 'REGLAMENTO', label: 'Doctrina & Normas', emoji: '📕' },
];

const TIPO_ICONS: Record<string, any> = {
  ISO: SecurityIcon,
  NIST: SecurityIcon,
  LEY: GavelIcon,
  MANUAL: DescriptionIcon,
  REGLAMENTO: ScaleIcon,
};

const TIPO_COLORS: Record<string, { color: string; bg: string }> = {
  ISO: { color: '#00FF41', bg: 'rgba(0, 255, 65, 0.1)' },
  NIST: { color: '#9DFF00', bg: 'rgba(157, 255, 0, 0.1)' },
  LEY: { color: '#FF3B30', bg: 'rgba(255, 59, 48, 0.1)' },
  MANUAL: { color: '#FF9500', bg: 'rgba(255, 149, 0, 0.1)' },
  REGLAMENTO: { color: '#FECF06', bg: 'rgba(254, 207, 6, 0.1)' },
};

export default function NormativasPage() {
  const { normativas } = useCMSStore();
  const [selectedNormativaId, setSelectedNormativaId] = useState<string | null>(normativas[0]?.id || null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('todas');
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrado por categoría y término de búsqueda
  const filteredNormativas = useMemo(() => {
    return normativas.filter(n => {
      // Filtro por categoría
      if (categoriaSeleccionada !== 'todas') {
        if (categoriaSeleccionada === 'ISO' && n.tipo !== 'ISO' && n.tipo !== 'NIST') return false;
        if (categoriaSeleccionada === 'LEY' && n.tipo !== 'LEY') return false;
        if (categoriaSeleccionada === 'MANUAL' && n.tipo !== 'MANUAL') return false;
        if (categoriaSeleccionada === 'REGLAMENTO' && n.tipo !== 'REGLAMENTO') return false;
      }
      // Filtro por término
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return n.codigo.toLowerCase().includes(term) ||
               n.nombre.toLowerCase().includes(term) ||
               n.descripcion.toLowerCase().includes(term) ||
               n.tipo.toLowerCase().includes(term);
      }
      return true;
    });
  }, [normativas, categoriaSeleccionada, searchTerm]);

  const selectedNormativa = useMemo(() => {
    return normativas.find(n => n.id === selectedNormativaId) || filteredNormativas[0] || null;
  }, [normativas, selectedNormativaId, filteredNormativas]);

  // Etapas procesales extraídas de NORMATIVAS_ETAPAS
  const etapasNormativa = useMemo(() => {
    if (!selectedNormativa) return [];
    const match = NORMATIVAS_ETAPAS.find(ne =>
      ne.normativaId === selectedNormativa.id ||
      ne.codigo.toLowerCase().includes(selectedNormativa.codigo.toLowerCase()) ||
      selectedNormativa.codigo.toLowerCase().includes(ne.codigo.toLowerCase())
    );
    return match ? match.etapas : [];
  }, [selectedNormativa]);

  // Planillas oficiales del sistema que implementan la norma seleccionada
  const planillasVinculadas = useMemo(() => {
    if (!selectedNormativa) return [];
    const targetCode = selectedNormativa.codigo.toLowerCase();
    return Object.values(PLANILLAS_REGISTRY).filter(p =>
      p.normativas.some(n => {
        const nLower = n.toLowerCase();
        return nLower.includes(targetCode) || targetCode.includes(nLower) ||
               (targetCode.includes('iso') && nLower.includes('iso')) ||
               (targetCode.includes('copp') && nLower.includes('copp')) ||
               (targetCode.includes('mucc') && nLower.includes('mucc')) ||
               (targetCode.includes('nist') && nLower.includes('nist'));
      })
    );
  }, [selectedNormativa]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pb: 6 }}>
      {/* Header Institucional */}
      <Box sx={{ pb: 2, borderBottom: '1px solid rgba(254, 207, 6, 0.2)' }}>
        <Typography component="h1" sx={{ fontSize: '24px', fontWeight: 700, color: '#00FF41', display: 'flex', alignItems: 'center', gap: 1 }}>
          <MenuBookIcon sx={{ fontSize: 28, color: '#FECF06' }} />
          Marco Normativo Legal &amp; Sustento de Compliance Forense
        </Typography>
        <Typography sx={{ fontSize: '13px', color: '#AEAEB2', mt: 0.5 }}>
          Base de conocimiento interactiva con {normativas.length} normas, leyes y estándares (ISO 27037/27042, NIST SP 800-101, MUCC-2017, COPP y Ley de Mensajes de Datos) que garantizan la admisibilidad procesal de cada peritaje.
        </Typography>
      </Box>

      {/* Barra de Filtros Rápidos por Categoría Temática */}
      <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 0.5 }}>
        {CATEGORIAS_FILTRO.map(cat => {
          const isSelected = categoriaSeleccionada === cat.id;
          return (
            <Chip
              key={cat.id}
              label={`${cat.emoji} ${cat.label}`}
              onClick={() => setCategoriaSeleccionada(cat.id)}
              sx={{
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer',
                backgroundColor: isSelected ? '#FECF06' : '#161B22',
                color: isSelected ? '#0D1117' : '#C9D1D9',
                border: `1px solid ${isSelected ? '#FECF06' : 'rgba(255, 255, 255, 0.1)'}`,
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: isSelected ? '#FECF06' : 'rgba(254, 207, 6, 0.15)',
                  color: isSelected ? '#0D1117' : '#FECF06',
                },
              }}
            />
          );
        })}
      </Stack>

      <Grid container spacing={3}>
        {/* Lista Maestra de Normativas */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 2, backgroundColor: '#161B22', border: '1px solid rgba(254, 207, 6, 0.2)', borderRadius: '12px' }}>
            <TextField
              size="small"
              placeholder="Buscar norma, código o ley..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              sx={{
                mb: 2,
                backgroundColor: '#0D1117',
                '& .MuiOutlinedInput-root': { color: '#FFFFFF' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(254, 207, 6, 0.3)' },
              }}
            />

            <Stack spacing={1} sx={{ maxHeight: '68vh', overflowY: 'auto', pr: 0.5 }}>
              {filteredNormativas.map((norm) => {
                const IconComponent = TIPO_ICONS[norm.tipo] || MenuBookIcon;
                const style = TIPO_COLORS[norm.tipo] || TIPO_COLORS.ISO;
                const isSelected = selectedNormativa && norm.id === selectedNormativa.id;

                return (
                  <Box
                    key={norm.id}
                    onClick={() => setSelectedNormativaId(norm.id)}
                    sx={{
                      p: 1.5,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? 'rgba(254, 207, 6, 0.15)' : '#0D1117',
                      border: `1px solid ${isSelected ? '#FECF06' : 'rgba(255, 255, 255, 0.08)'}`,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: '#FECF06',
                        backgroundColor: 'rgba(254, 207, 6, 0.08)',
                      },
                    }}
                  >
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                      <IconComponent sx={{ color: style.color, fontSize: 20 }} />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontSize: '13px', fontWeight: 700, color: isSelected ? '#FECF06' : '#FFFFFF' }}>
                          {norm.codigo}
                        </Typography>
                        <Typography noWrap sx={{ fontSize: '11px', color: '#8B949E' }}>
                          {norm.nombre}
                        </Typography>
                      </Box>
                      <Chip label={norm.tipo} size="small" sx={{ height: 18, fontSize: '9px', backgroundColor: style.bg, color: style.color, fontWeight: 700 }} />
                    </Stack>
                  </Box>
                );
              })}
            </Stack>
          </Card>
        </Grid>

        {/* Vista Detallada Didáctica de Sustento Legal */}
        <Grid size={{ xs: 12, md: 8 }}>
          {selectedNormativa ? (
            <Card sx={{ p: 3, backgroundColor: '#161B22', border: '1px solid rgba(254, 207, 6, 0.3)', borderRadius: '12px' }}>
              {/* Encabezado de la Norma */}
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, pb: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <Box>
                  <Typography variant="h5" sx={{ color: '#FECF06', fontWeight: 800, letterSpacing: '-0.01em' }}>
                    {selectedNormativa.codigo} — {selectedNormativa.nombre}
                  </Typography>
                  <Typography sx={{ fontSize: '12px', color: '#8B949E', mt: 0.5 }}>
                    Versión Oficial: <Box component="span" sx={{ color: '#FFFFFF', fontWeight: 700 }}>{selectedNormativa.version}</Box> | Vigencia / Emisión: <Box component="span" sx={{ color: '#FFFFFF', fontWeight: 700 }}>{selectedNormativa.fechaVigencia}</Box>
                  </Typography>
                </Box>
                <Chip
                  label={selectedNormativa.tipo}
                  sx={{
                    backgroundColor: TIPO_COLORS[selectedNormativa.tipo]?.bg || 'rgba(254, 207, 6, 0.1)',
                    color: TIPO_COLORS[selectedNormativa.tipo]?.color || '#FECF06',
                    fontWeight: 800,
                    px: 1,
                  }}
                />
              </Stack>

              {/* Bloque A: Ficha Didáctica de Sustento Jurídico & Compliance */}
              <Box sx={{ mb: 3.5, backgroundColor: '#0D1117', p: 2.5, borderRadius: '8px', borderLeft: '4px solid #FECF06' }}>
                <Typography variant="subtitle2" sx={{ color: '#FECF06', fontWeight: 800, mb: 1, textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PolicyIcon sx={{ fontSize: 18, color: '#FECF06' }} />
                  📌 Sustento Jurídico &amp; Valor Probatorio en el Compliance
                </Typography>
                <Typography sx={{ fontSize: '13.5px', color: '#E6EDF3', lineHeight: 1.65, textAlign: 'justify' }}>
                  {selectedNormativa.descripcion}
                </Typography>
              </Box>

              {/* Panel Especializado Exclusivo para MUCC-2017 */}
              {selectedNormativa.codigo.toLowerCase().includes('mucc') && (
                <Box sx={{ mb: 3.5, p: 2.5, backgroundColor: 'rgba(254, 207, 6, 0.05)', borderRadius: '10px', border: '1px solid rgba(254, 207, 6, 0.3)' }}>
                  <Typography variant="subtitle2" sx={{ color: '#FECF06', fontWeight: 800, mb: 2, textTransform: 'uppercase', fontSize: '13px', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccountTreeIcon sx={{ fontSize: 20, color: '#FECF06' }} />
                    🏛️ Estructura Sistémica del MUCC-2017 (Gaceta Oficial N° 41.247)
                  </Typography>

                  {/* 4 Fases Sistémicas */}
                  <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#00FF41', textTransform: 'uppercase', mb: 1, letterSpacing: '0.04em' }}>
                    1. Las 4 Fases Obligatorias del Sistema de Cadena de Custodia
                  </Typography>
                  <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ p: 1.5, backgroundColor: '#0D1117', borderRadius: '6px', border: '1px solid rgba(0, 255, 65, 0.2)' }}>
                        <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#00FF41' }}>Fase I: Inicial</Typography>
                        <Typography sx={{ fontSize: '11px', color: '#8B949E', mt: 0.3 }}>Protección, observación, fijación, colección, embalaje, rotulación y llenado de Planilla PRCC.</Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ p: 1.5, backgroundColor: '#0D1117', borderRadius: '6px', border: '1px solid rgba(0, 255, 65, 0.2)' }}>
                        <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#00FF41' }}>Fase II: Laboratorio / Peritación</Typography>
                        <Typography sx={{ fontSize: '11px', color: '#8B949E', mt: 0.3 }}>Recepción, verificación de precinto, desprecintado, peritaje especializado y remisión del dictamen.</Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ p: 1.5, backgroundColor: '#0D1117', borderRadius: '6px', border: '1px solid rgba(0, 255, 65, 0.2)' }}>
                        <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#00FF41' }}>Fase III: Disposición Judicial</Typography>
                        <Typography sx={{ fontSize: '11px', color: '#8B949E', mt: 0.3 }}>Resguardo judicial y exhibición formal de la evidencia en audiencia de juicio oral.</Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ p: 1.5, backgroundColor: '#0D1117', borderRadius: '6px', border: '1px solid rgba(0, 255, 65, 0.2)' }}>
                        <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#00FF41' }}>Fase IV: Disposición Final</Typography>
                        <Typography sx={{ fontSize: '11px', color: '#8B949E', mt: 0.3 }}>Cierre definitivo: devolución a propietario, entrega, destrucción ordenada o consumida en ensayo.</Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* 4 Modalidades de Obtención */}
                  <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#9DFF00', textTransform: 'uppercase', mb: 1, letterSpacing: '0.04em' }}>
                    2. Las 4 Modalidades de Obtención Inicial
                  </Typography>
                  <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <Box sx={{ p: 1.2, backgroundColor: '#0D1117', borderRadius: '6px', border: '1px solid rgba(157, 255, 0, 0.2)', textAlign: 'center' }}>
                        <Typography sx={{ fontSize: '11.5px', fontWeight: 800, color: '#9DFF00' }}>Técnica</Typography>
                        <Typography sx={{ fontSize: '10.5px', color: '#8B949E', mt: 0.2 }}>Sitio del Suceso</Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <Box sx={{ p: 1.2, backgroundColor: '#0D1117', borderRadius: '6px', border: '1px solid rgba(157, 255, 0, 0.2)', textAlign: 'center' }}>
                        <Typography sx={{ fontSize: '11.5px', fontWeight: 800, color: '#9DFF00' }}>Aseguramiento</Typography>
                        <Typography sx={{ fontSize: '10.5px', color: '#8B949E', mt: 0.2 }}>Búsqueda Judicial</Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <Box sx={{ p: 1.2, backgroundColor: '#0D1117', borderRadius: '6px', border: '1px solid rgba(157, 255, 0, 0.2)', textAlign: 'center' }}>
                        <Typography sx={{ fontSize: '11.5px', fontWeight: 800, color: '#9DFF00' }}>Consignación</Typography>
                        <Typography sx={{ fontSize: '10.5px', color: '#8B949E', mt: 0.2 }}>Entrega Voluntaria</Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <Box sx={{ p: 1.2, backgroundColor: '#0D1117', borderRadius: '6px', border: '1px solid rgba(157, 255, 0, 0.2)', textAlign: 'center' }}>
                        <Typography sx={{ fontSize: '11.5px', fontWeight: 800, color: '#9DFF00' }}>Derivación</Typography>
                        <Typography sx={{ fontSize: '10.5px', color: '#8B949E', mt: 0.2 }}>Sub-muestras Lab</Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* 3 Figuras Continuas */}
                  <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#FECF06', textTransform: 'uppercase', mb: 1, letterSpacing: '0.04em' }}>
                    3. Las 3 Figuras de Carácter Continuo
                  </Typography>
                  <Grid container spacing={1.5}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Box sx={{ p: 1.2, backgroundColor: '#0D1117', borderRadius: '6px', border: '1px solid rgba(254, 207, 6, 0.2)' }}>
                        <Typography sx={{ fontSize: '11.5px', fontWeight: 800, color: '#FECF06' }}>Resguardo Temporal</Typography>
                        <Typography sx={{ fontSize: '10.5px', color: '#8B949E', mt: 0.2 }}>Depósito, ingreso, custodia y egreso controlado.</Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Box sx={{ p: 1.2, backgroundColor: '#0D1117', borderRadius: '6px', border: '1px solid rgba(254, 207, 6, 0.2)' }}>
                        <Typography sx={{ fontSize: '11.5px', fontWeight: 800, color: '#FECF06' }}>Procedimiento de Traslado</Typography>
                        <Typography sx={{ fontSize: '10.5px', color: '#8B949E', mt: 0.2 }}>Transporte seguro con embalaje e inalterabilidad.</Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Box sx={{ p: 1.2, backgroundColor: '#0D1117', borderRadius: '6px', border: '1px solid rgba(254, 207, 6, 0.2)' }}>
                        <Typography sx={{ fontSize: '11.5px', fontWeight: 800, color: '#FECF06' }}>Transferencia de Custodios</Typography>
                        <Typography sx={{ fontSize: '10.5px', color: '#8B949E', mt: 0.2 }}>Firma y traspaso formal de responsabilidad en PRCC.</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Bloque B: Principios Técnico-Forenses Exigidos por la Norma */}
              <Box sx={{ mb: 3.5 }}>
                <Typography variant="subtitle2" sx={{ color: '#00FF41', fontWeight: 800, mb: 1.5, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 1, fontSize: '13px' }}>
                  <VerifiedUserIcon sx={{ fontSize: 18, color: '#00FF41' }} />
                  ⚙️ Principios Técnicos &amp; Garantías de Admisibilidad Procesal
                </Typography>
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Box sx={{ p: 1.5, backgroundColor: '#0D1117', borderRadius: '8px', border: '1px solid rgba(0, 255, 65, 0.2)', height: '100%' }}>
                      <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#00FF41', mb: 0.5 }}>
                        Inmutabilidad Criptográfica
                      </Typography>
                      <Typography sx={{ fontSize: '11px', color: '#8B949E', lineHeight: 1.4 }}>
                        Cálculo y verificación continua del hash SHA-256 para prevenir cualquier impugnación por alteración de la muestra.
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Box sx={{ p: 1.5, backgroundColor: '#0D1117', borderRadius: '8px', border: '1px solid rgba(157, 255, 0, 0.2)', height: '100%' }}>
                      <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#9DFF00', mb: 0.5 }}>
                        Trazabilidad Ininterrumpida
                      </Typography>
                      <Typography sx={{ fontSize: '11px', color: '#8B949E', lineHeight: 1.4 }}>
                        Registro riguroso de cada custodio, ubicación física, precinto y traspaso formal de la evidencia.
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Box sx={{ p: 1.5, backgroundColor: '#0D1117', borderRadius: '8px', border: '1px solid rgba(254, 207, 6, 0.2)', height: '100%' }}>
                      <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#FECF06', mb: 0.5 }}>
                        Objetividad &amp; Repetibilidad
                      </Typography>
                      <Typography sx={{ fontSize: '11px', color: '#8B949E', lineHeight: 1.4 }}>
                        Uso estricto de herramientas forenses validadas que permiten reproducir los resultados en juicio oral.
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Bloque C: Etapas Procesales Operativas de la Norma */}
              {etapasNormativa && etapasNormativa.length > 0 && (
                <Box sx={{ mb: 3.5 }}>
                  <Typography variant="subtitle2" sx={{ color: '#9DFF00', fontWeight: 800, mb: 1.5, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 1, fontSize: '13px' }}>
                    <AccountTreeIcon sx={{ fontSize: 18, color: '#9DFF00' }} />
                    Etapas Procesales &amp; Fases de Cumplimiento Estandarizadas
                  </Typography>
                  <Grid container spacing={1.5}>
                    {etapasNormativa.map((et, idx) => (
                      <Grid key={et.id || idx} size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ p: 1.5, backgroundColor: '#0D1117', borderRadius: '8px', border: '1px solid rgba(157, 255, 0, 0.2)', height: '100%' }}>
                          <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#9DFF00', mb: 0.5 }}>
                            {et.nombre}
                          </Typography>
                          <Typography sx={{ fontSize: '11.5px', color: '#8B949E', lineHeight: 1.4 }}>
                            {et.descripcion}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* Bloque D: Artículos y Numerales Clave Desglosados en Grid Mosaico de Tarjetas */}
              {selectedNormativa.articulos && selectedNormativa.articulos.length > 0 && (
                <Box sx={{ mb: 3.5 }}>
                  <Typography variant="subtitle2" sx={{ color: '#FECF06', fontWeight: 800, mb: 1.5, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 1, fontSize: '13px' }}>
                    <GavelIcon sx={{ fontSize: 18, color: '#FECF06' }} />
                    📜 Articulado y Numerales Clave Desglosados ({selectedNormativa.articulos.length} Numerales)
                  </Typography>
                  <Grid container spacing={1.5}>
                    {selectedNormativa.articulos.map((art, idx) => {
                      const tituloArt = art.split(':')[0] || `Numeral ${idx + 1}`;
                      const contenidoArt = art.includes(':') ? art.substring(art.indexOf(':') + 1).trim() : art;
                      const numBadge = String(idx + 1).padStart(2, '0');

                      return (
                        <Grid key={idx} size={{ xs: 12, sm: 6 }}>
                          <Box
                            sx={{
                              p: 2,
                              backgroundColor: '#0D1117',
                              borderRadius: '8px',
                              border: '1px solid rgba(254, 207, 6, 0.25)',
                              height: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                borderColor: '#FECF06',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 16px rgba(254, 207, 6, 0.1)',
                              },
                            }}
                          >
                            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1 }}>
                              <Chip
                                label={`N° ${numBadge}`}
                                size="small"
                                sx={{
                                  height: 20,
                                  fontSize: '10px',
                                  fontWeight: 800,
                                  backgroundColor: 'rgba(254, 207, 6, 0.15)',
                                  color: '#FECF06',
                                  border: '1px solid rgba(254, 207, 6, 0.4)',
                                }}
                              />
                              <Typography sx={{ fontSize: '12.5px', fontWeight: 800, color: '#FFFFFF', flex: 1 }}>
                                {tituloArt}
                              </Typography>
                            </Stack>
                            <Typography sx={{ fontSize: '11.5px', color: '#C9D1D9', lineHeight: 1.5, textAlign: 'justify', flex: 1 }}>
                              {contenidoArt}
                            </Typography>
                          </Box>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>
              )}

              {/* Bloque E: Materialización en las Planillas Oficiales del CMS */}
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#00FF41', fontWeight: 800, mb: 1.5, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 1, fontSize: '13px' }}>
                  <AssignmentIcon sx={{ fontSize: 18, color: '#00FF41' }} />
                  🔗 Planillas Oficiales del CMS que Materializan esta Norma ({planillasVinculadas.length})
                </Typography>
                {planillasVinculadas.length > 0 ? (
                  <Grid container spacing={1.5}>
                    {planillasVinculadas.map(p => (
                      <Grid key={p.id} size={{ xs: 12, sm: 6 }}>
                        <Link href={`/planillas/${p.id}`} style={{ textDecoration: 'none' }}>
                          <Box sx={{ p: 1.5, backgroundColor: '#0D1117', border: '1px solid rgba(254, 207, 6, 0.3)', borderRadius: '8px', transition: 'all 0.2s ease', '&:hover': { borderColor: '#FECF06', transform: 'translateY(-2px)' } }}>
                            <Typography sx={{ fontSize: '11px', fontWeight: 800, color: '#00FF41', fontFamily: 'monospace' }}>
                              {p.codigo}
                            </Typography>
                            <Typography sx={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF', mt: 0.2 }}>
                              {p.nombreOficial}
                            </Typography>
                            <Typography noWrap sx={{ fontSize: '11px', color: '#8B949E', mt: 0.5 }}>
                              {p.subtitulo}
                            </Typography>
                          </Box>
                        </Link>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography sx={{ fontSize: '12px', color: '#8B949E', italic: 'true' }}>
                    Esta norma sirve como marco técnico de referencia general en los dictámenes e informes de laboratorio.
                  </Typography>
                )}
              </Box>
            </Card>
          ) : (
            <Card sx={{ p: 4, textAlign: 'center', backgroundColor: '#161B22', borderRadius: '12px' }}>
              <Typography sx={{ color: '#8B949E' }}>Seleccione una norma de la lista para ver su fundamentación legal.</Typography>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
