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

import { useCMSStore } from '../store/cmsStore';
import { NORMATIVAS_ETAPAS } from '../data/normativasEtapas';
import { PLANILLAS_REGISTRY } from '../data/planillasRegistry';

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
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNormativas = useMemo(() => {
    if (!searchTerm) return normativas;
    const term = searchTerm.toLowerCase();
    return normativas.filter(n =>
      n.codigo.toLowerCase().includes(term) ||
      n.nombre.toLowerCase().includes(term) ||
      n.descripcion.toLowerCase().includes(term) ||
      n.tipo.toLowerCase().includes(term)
    );
  }, [normativas, searchTerm]);

  const selectedNormativa = useMemo(() => {
    return normativas.find(n => n.id === selectedNormativaId) || null;
  }, [normativas, selectedNormativaId]);

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
      {/* Header */}
      <Box sx={{ pb: 2, borderBottom: '1px solid rgba(254, 207, 6, 0.2)' }}>
        <Typography component="h1" sx={{ fontSize: '24px', fontWeight: 700, color: '#00FF41', display: 'flex', alignItems: 'center', gap: 1 }}>
          <MenuBookIcon sx={{ fontSize: 28, color: '#FECF06' }} />
          Marco Normativo Legal & Estándares Forenses
        </Typography>
        <Typography sx={{ fontSize: '13px', color: '#AEAEB2', mt: 0.5 }}>
          Base de conocimiento técnico-jurídica con los estándares ISO, NIST, COPP, Ley de Mensajes de Datos, Ley de Delitos Informáticos y MUCC-2017 aplicados en peritajes digitales.
        </Typography>
      </Box>

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
                const isSelected = norm.id === selectedNormativaId;

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

        {/* Vista Detallada Ampliada */}
        <Grid size={{ xs: 12, md: 8 }}>
          {selectedNormativa ? (
            <Card sx={{ p: 3, backgroundColor: '#161B22', border: '1px solid rgba(254, 207, 6, 0.3)', borderRadius: '12px' }}>
              {/* Encabezado Principal */}
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

              {/* Descripción Extensa de la Norma */}
              <Box sx={{ mb: 3.5, backgroundColor: '#0D1117', p: 2.5, borderRadius: '8px', borderLeft: '4px solid #FECF06' }}>
                <Typography variant="subtitle2" sx={{ color: '#FECF06', fontWeight: 700, mb: 1, textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.5px' }}>
                  Objeto, Alcance &amp; Relevancia Pericial
                </Typography>
                <Typography sx={{ fontSize: '13.5px', color: '#E6EDF3', lineHeight: 1.65, textAlign: 'justify' }}>
                  {selectedNormativa.descripcion}
                </Typography>
              </Box>

              {/* Etapas Operativas de la Norma (si están registradas) */}
              {etapasNormativa && etapasNormativa.length > 0 && (
                <Box sx={{ mb: 3.5 }}>
                  <Typography variant="subtitle2" sx={{ color: '#00FF41', fontWeight: 800, mb: 1.5, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 1, fontSize: '13px' }}>
                    <AccountTreeIcon sx={{ fontSize: 18, color: '#00FF41' }} />
                    Etapas Procesales &amp; Fases de Cumplimiento Estandarizadas
                  </Typography>
                  <Grid container spacing={1.5}>
                    {etapasNormativa.map((et, idx) => (
                      <Grid key={et.id || idx} size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ p: 1.5, backgroundColor: '#0D1117', borderRadius: '8px', border: '1px solid rgba(0, 255, 65, 0.2)', height: '100%' }}>
                          <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#00FF41', mb: 0.5 }}>
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

              {/* Artículos y Cláusulas Normativas en Acordeón */}
              {selectedNormativa.articulos && selectedNormativa.articulos.length > 0 && (
                <Box sx={{ mb: 3.5 }}>
                  <Typography variant="subtitle2" sx={{ color: '#9DFF00', fontWeight: 800, mb: 1.5, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 1, fontSize: '13px' }}>
                    <VerifiedUserIcon sx={{ fontSize: 18, color: '#9DFF00' }} />
                    Articulado y Fundamentación Jurídico-Técnica ({selectedNormativa.articulos.length} Numerales)
                  </Typography>
                  <Stack spacing={1}>
                    {selectedNormativa.articulos.map((art, idx) => {
                      const tituloArt = art.split(':')[0] || `Artículo ${idx + 1}`;
                      const contenidoArt = art.includes(':') ? art.substring(art.indexOf(':') + 1).trim() : art;

                      return (
                        <Accordion key={idx} sx={{ backgroundColor: '#0D1117', color: '#E6EDF3', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px !important', '&:before': { display: 'none' } }}>
                          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#FECF06' }} />}>
                            <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#FECF06' }}>
                              {tituloArt}
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', pt: 1.5 }}>
                            <Typography sx={{ fontSize: '12px', color: '#C9D1D9', lineHeight: 1.6, textAlign: 'justify' }}>
                              {contenidoArt}
                            </Typography>
                          </AccordionDetails>
                        </Accordion>
                      );
                    })}
                  </Stack>
                </Box>
              )}

              {/* Planillas Oficiales que Implementan esta Norma */}
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#FECF06', fontWeight: 800, mb: 1.5, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 1, fontSize: '13px' }}>
                  <AssignmentIcon sx={{ fontSize: 18, color: '#FECF06' }} />
                  Planillas Oficiales que Implementan esta Norma ({planillasVinculadas.length})
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
