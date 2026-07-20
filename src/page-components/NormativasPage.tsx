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

import { useCMSStore } from '../store/cmsStore';
import {
  BookOpen, Scale, Gavel, FileText, Shield, Search,
  Calendar, Info, FolderOpen, ChevronRight
} from '../components/atoms/AppleIcon';

const TIPO_ICONS: Record<string, typeof BookOpen> = {
  ISO: Shield, NIST: Shield, LEY: Gavel, MANUAL: FileText, REGLAMENTO: Scale,
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
          <BookOpen size={24} className="text-[#FECF06]" />
          Marco Normativo RAG & Estándares Forenses
        </Typography>
        <Typography sx={{ fontSize: '13px', color: '#AEAEB2', mt: 0.5 }}>
          Base de conocimiento con 77 documentos normativos (ISO 27037, NIST, COPP, Ley de Delitos Informáticos, MUCCEF 2017).
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Master List */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 2 }}>
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
                const Icon = TIPO_ICONS[norm.tipo] || BookOpen;
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
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      transition: 'all 0.2s ease',
                      '&:hover': { backgroundColor: 'rgba(254, 207, 6, 0.1)' },
                    }}
                  >
                    <Box sx={{ p: 1, borderRadius: '6px', backgroundColor: style.bg, color: style.color }}>
                      <Icon size={18} />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography sx={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 700, color: '#FECF06' }}>
                          {norm.codigo}
                        </Typography>
                        <Chip label={norm.tipo} size="small" sx={{ height: 18, fontSize: '9px', backgroundColor: style.bg, color: style.color }} />
                      </Box>
                      <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {norm.nombre}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          </Card>
        </Grid>

        {/* Detail Panel */}
        <Grid size={{ xs: 12, md: 8 }}>
          {selectedNormativa ? (
            <Card sx={{ p: 3.5, borderLeft: '4px solid #FECF06' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', pb: 2, mb: 3, borderBottom: '1px solid rgba(254, 207, 6, 0.2)' }}>
                <Box>
                  <Chip label={selectedNormativa.codigo} size="small" sx={{ backgroundColor: 'rgba(254, 207, 6, 0.15)', color: '#FECF06', fontWeight: 800, fontFamily: 'monospace', mb: 1 }} />
                  <Typography component="h2" sx={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF' }}>
                    {selectedNormativa.nombre}
                  </Typography>
                </Box>
                <Chip label={selectedNormativa.activa ? 'VIGENTE' : 'INACTIVA'} color={selectedNormativa.activa ? 'success' : 'default'} />
              </Box>

              <Typography component="h3" sx={{ fontSize: '14px', fontWeight: 700, color: '#FECF06', textTransform: 'uppercase', mb: 1 }}>
                Descripción & Alcance Normativo
              </Typography>
              <Typography sx={{ fontSize: '14px', color: '#FFFFFF', backgroundColor: 'rgba(0, 0, 0, 0.3)', p: 2, borderRadius: '8px', mb: 3 }}>
                {selectedNormativa.descripcion}
              </Typography>

              {selectedNormativa.articulos && selectedNormativa.articulos.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography component="h3" sx={{ fontSize: '14px', fontWeight: 700, color: '#FECF06', textTransform: 'uppercase', mb: 1 }}>
                    Articulado Legal / Cláusulas Relacionadas
                  </Typography>
                  <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                    {selectedNormativa.articulos.map((art) => (
                      <Chip key={art} label={art} variant="outlined" sx={{ borderColor: 'rgba(254, 207, 6, 0.3)', color: '#AEAEB2' }} />
                    ))}
                  </Stack>
                </Box>
              )}

              {casosUsandoSelected.length > 0 && (
                <Box>
                  <Typography component="h3" sx={{ fontSize: '14px', fontWeight: 700, color: '#00FF41', textTransform: 'uppercase', mb: 1 }}>
                    Casos Vinculados ({casosUsandoSelected.length})
                  </Typography>
                  <Stack spacing={1}>
                    {casosUsandoSelected.map((c) => (
                      <Link key={c.id} href={`/casos/${c.id}`} style={{ textDecoration: 'none' }}>
                        <Box sx={{ p: 1.5, borderRadius: '6px', backgroundColor: 'rgba(0, 255, 65, 0.05)', border: '1px solid rgba(0, 255, 65, 0.2)', display: 'flex', alignItems: 'center', gap: 1 }}>
                          <FolderOpen size={14} className="text-[#00FF41]" />
                          <Typography sx={{ fontSize: '12px', color: '#FFFFFF', fontWeight: 700 }}>{c.numeroCaso} — {c.titulo}</Typography>
                        </Box>
                      </Link>
                    ))}
                  </Stack>
                </Box>
              )}
            </Card>
          ) : (
            <Card sx={{ p: 6, textAlign: 'center' }}>
              <Typography sx={{ color: '#AEAEB2' }}>Seleccione una normativa para ver los detalles.</Typography>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
