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
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import InfoIcon from '@mui/icons-material/Info';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { useCMSStore } from '../store/cmsStore';

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
  const { normativas, casos } = useCMSStore();
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

  const casosUsandoSelected = useMemo(() => {
    if (!selectedNormativaId) return [];
    return casos.filter(c => c.normativasAplicadas.includes(selectedNormativaId));
  }, [casos, selectedNormativaId]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pb: 6 }}>
      {/* Header */}
      <Box sx={{ pb: 2, borderBottom: '1px solid rgba(254, 207, 6, 0.2)' }}>
        <Typography component="h1" sx={{ fontSize: '24px', fontWeight: 700, color: '#00FF41', display: 'flex', alignItems: 'center', gap: 1 }}>
          <MenuBookIcon sx={{ fontSize: 28, color: '#FECF06' }} />
          Marco Normativo RAG & Estándares Forenses
        </Typography>
        <Typography sx={{ fontSize: '13px', color: '#AEAEB2', mt: 0.5 }}>
          Base de conocimiento con 77 documentos normativos (ISO 27037, NIST, COPP, Ley de Delitos Informáticos, MUCCEF 2017).
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Master List */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 2, backgroundColor: '#1E1800', border: '1px solid rgba(254, 207, 6, 0.2)' }}>
            <TextField
              size="small"
              placeholder="Buscar por código o norma..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />

            <Stack spacing={1} sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
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
                      backgroundColor: isSelected ? 'rgba(254, 207, 6, 0.15)' : 'rgba(0, 0, 0, 0.2)',
                      border: `1px solid ${isSelected ? '#FECF06' : 'rgba(254, 207, 6, 0.1)'}`,
                      '&:hover': {
                        borderColor: '#FECF06',
                      },
                    }}
                  >
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                      <IconComponent sx={{ color: style.color, fontSize: 20 }} />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontSize: '13px', fontWeight: 700, color: isSelected ? '#FECF06' : '#FFFFFF' }}>
                          {norm.codigo}
                        </Typography>
                        <Typography noWrap sx={{ fontSize: '11px', color: '#AEAEB2' }}>
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

        {/* Details View */}
        <Grid size={{ xs: 12, md: 8 }}>
          {selectedNormativa ? (
            <Card sx={{ p: 3, backgroundColor: '#1E1800', border: '1px solid rgba(254, 207, 6, 0.3)' }}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="h5" sx={{ color: '#FECF06', fontWeight: 800 }}>
                    {selectedNormativa.codigo} — {selectedNormativa.nombre}
                  </Typography>
                  <Typography sx={{ fontSize: '13px', color: '#AEAEB2', mt: 0.5 }}>
                    Versión: {selectedNormativa.version} | Vigencia: {selectedNormativa.fechaVigencia}
                  </Typography>
                </Box>
                <Chip
                  label={selectedNormativa.tipo}
                  sx={{
                    backgroundColor: TIPO_COLORS[selectedNormativa.tipo]?.bg || 'rgba(254, 207, 6, 0.1)',
                    color: TIPO_COLORS[selectedNormativa.tipo]?.color || '#FECF06',
                    fontWeight: 800,
                  }}
                />
              </Stack>

              <Typography sx={{ fontSize: '14px', color: '#E5E5EA', lineHeight: 1.6, mb: 3 }}>
                {selectedNormativa.descripcion}
              </Typography>

              {/* Artículos de Fundamentación */}
              {selectedNormativa.articulos && selectedNormativa.articulos.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ color: '#00FF41', fontWeight: 700, mb: 1, textTransform: 'uppercase' }}>
                    Artículos y Cláusulas Normativas
                  </Typography>
                  <Stack spacing={1}>
                    {selectedNormativa.articulos.map((art, idx) => (
                      <Accordion key={idx} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', color: '#FFFFFF', border: '1px solid rgba(254, 207, 6, 0.15)' }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#FECF06' }} />}>
                          <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#FECF06' }}>
                            {art.split(':')[0] || `Artículo ${idx + 1}`}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography sx={{ fontSize: '12px', color: '#E5E5EA', lineHeight: 1.5 }}>
                            {art}
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Casos Vinculados */}
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#9DFF00', fontWeight: 700, mb: 1, textTransform: 'uppercase' }}>
                  Casos de Compliance Vinculados ({casosUsandoSelected.length})
                </Typography>
                {casosUsandoSelected.length > 0 ? (
                  <Stack spacing={1}>
                    {casosUsandoSelected.map(c => (
                      <Link key={c.id} href={`/casos/${c.id}`} style={{ textDecoration: 'none' }}>
                        <Box sx={{ p: 1.5, backgroundColor: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(157, 255, 0, 0.2)', borderRadius: '6px', '&:hover': { borderColor: '#9DFF00' } }}>
                          <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>
                            Caso #{c.numeroCaso} — {c.titulo}
                          </Typography>
                        </Box>
                      </Link>
                    ))}
                  </Stack>
                ) : (
                  <Typography sx={{ fontSize: '12px', color: '#AEAEB2', italic: 'true' }}>
                    No hay expedientes vinculados a esta norma actualmente.
                  </Typography>
                )}
              </Box>
            </Card>
          ) : (
            <Card sx={{ p: 4, textAlign: 'center', backgroundColor: '#1E1800' }}>
              <Typography sx={{ color: '#AEAEB2' }}>Seleccione una norma de la lista para ver su fundamentación legal.</Typography>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
