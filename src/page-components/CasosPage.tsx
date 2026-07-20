'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';

import { useCMSStore, EstadoCaso, PrioridadCaso, TipoProyecto, CasoCMS } from '../store/cmsStore';
import {
  FolderOpen, Smartphone, Mail, HardDrive, BookOpen,
  ChevronRight, Trash2, Search, ArrowLeft, User, Plus, X
} from '../components/atoms/AppleIcon';
import Button from '../components/atoms/Button';
import { getTiposProyecto, getTipoProyectoConfig } from '../data/tiposProyecto';

const ESTADOS: { value: EstadoCaso | 'todos'; label: string }[] = [
  { value: 'todos', label: 'Todos los Estados' },
  { value: 'iniciado', label: 'Iniciado' },
  { value: 'en_proceso', label: 'En Proceso' },
  { value: 'analisis', label: 'Análisis' },
  { value: 'informe', label: 'Informe' },
  { value: 'cerrado', label: 'Cerrado' },
  { value: 'archivado', label: 'Archivado' },
];

const ESTADO_LABEL: Record<EstadoCaso, { label: string; color: string; bg: string }> = {
  iniciado:    { label: 'Iniciado',    color: '#FECF06', bg: 'rgba(254, 207, 6, 0.1)' },
  en_proceso:  { label: 'En Proceso',  color: '#FF9500', bg: 'rgba(255, 149, 0, 0.1)' },
  analisis:    { label: 'Análisis',    color: '#9DFF00', bg: 'rgba(157, 255, 0, 0.1)' },
  informe:     { label: 'Informe',     color: '#FECF06', bg: 'rgba(254, 207, 6, 0.1)' },
  cerrado:     { label: 'Cerrado',     color: '#00FF41', bg: 'rgba(0, 255, 65, 0.1)' },
  archivado:   { label: 'Archivado',   color: '#AEAEB2', bg: 'rgba(255, 255, 255, 0.06)' },
};

export default function CasosPage() {
  const router = useRouter();
  const { casos, addCaso, deleteCaso } = useCMSStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<string>('todos');
  const [filterTipo, setFilterTipo] = useState<string>('todos');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitulo, setNewTitulo] = useState('');
  const [newTipo, setNewTipo] = useState<TipoProyecto>('forense_whatsapp');
  const [newPrioridad, setNewPrioridad] = useState<PrioridadCaso>('alta');
  const [newPerito, setNewPerito] = useState('Ing. Perito Forense Digital');
  const [newFiscal, setNewFiscal] = useState('Fiscalía Superior MP');
  const [newDispositivo, setNewDispositivo] = useState('');

  const casosFiltrados = casos.filter(c => {
    const matchSearch = c.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        c.numeroCaso.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (c.peritoLider && c.peritoLider.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchEstado = filterEstado === 'todos' || c.estado === filterEstado;
    const matchTipo = filterTipo === 'todos' || c.tipoProyecto === filterTipo;
    return matchSearch && matchEstado && matchTipo;
  });

  const handleCreateCaso = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitulo.trim()) return;

    const numCorrelativo = String(casos.length + 1).padStart(4, '0');
    const nuevoCodigo = `EXP-2026-${numCorrelativo}`;
    const config = getTipoProyectoConfig(newTipo);
    const initialSteps: Record<string, any> = {};
    config.pasos.forEach((p) => {
      initialSteps[p.id] = { pasoId: p.id, estado: p.num === 1 ? 'en_proceso' : 'pendiente' };
    });

    const casoId = await addCaso({
      numeroCaso: nuevoCodigo,
      titulo: newTitulo,
      descripcion: newDispositivo || 'Investigación Forense Digital y Control de Cadena de Custodia',
      tipoProyecto: newTipo,
      prioridad: newPrioridad,
      estado: 'iniciado',
      peritoLider: newPerito,
      fiscal: newFiscal,
      steps: initialSteps,
      normativasAplicadas: ['ISO/IEC 27037:2012', 'MUCC-2017'],
      fasesCompletadas: 1,
      totalFases: config.fases.length || 3,
      porcentajeCompletado: 10,
      totalEvidencias: 1,
      nivelCumplimientoGeneral: 'conforme',
      etiquetas: ['Forense', newTipo],
      notas: newDispositivo || 'Evidencia Primaria',
    });

    setIsModalOpen(false);
    setNewTitulo('');
    if (casoId) router.push(`/casos/${casoId}`);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pb: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2, borderBottom: '1px solid rgba(254, 207, 6, 0.2)' }}>
        <Box>
          <Typography component="h1" sx={{ fontSize: '24px', fontWeight: 700, color: '#00FF41' }}>
            Directorio de Casos Forenses
          </Typography>
          <Typography sx={{ fontSize: '14px', color: '#AEAEB2', mt: 0.5 }}>
            Gestión integral de expedientes periciales y trazabilidad inmutable de cadena de custodia.
          </Typography>
        </Box>
        <Button onClick={() => setIsModalOpen(true)} variant="primary" size="md">
          <Plus size={16} /> Crear Expediente
        </Button>
      </Box>

      {/* Toolbar & Filters */}
      <Card sx={{ p: 2.5 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            size="small"
            placeholder="Buscar por expediente, título o perito..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
          />
          <TextField
            select
            size="small"
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            sx={{ minWidth: 160 }}
          >
            {ESTADOS.map((e) => (
              <MenuItem key={e.value} value={e.value}>{e.label}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            size="small"
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="todos">Todas las Tipologías</MenuItem>
            <MenuItem value="forense_whatsapp">Forense WhatsApp</MenuItem>
            <MenuItem value="forense_email">Forense Email</MenuItem>
            <MenuItem value="forense_discoduro">Forense Disco Duro</MenuItem>
          </TextField>
        </Stack>
      </Card>

      {/* Grid of Cases */}
      <Grid container spacing={2.5}>
        {casosFiltrados.map((caso) => {
          const meta = ESTADO_LABEL[caso.estado] || ESTADO_LABEL.iniciado;
          return (
            <Grid key={caso.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                onClick={() => router.push(`/casos/${caso.id}`)}
                sx={{
                  p: 3,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  height: '100%',
                  transition: 'all 0.2s ease',
                  '&:hover': { borderColor: '#FECF06', transform: 'translateY(-2px)' },
                }}
              >
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Chip label={meta.label} size="small" sx={{ backgroundColor: meta.bg, color: meta.color, fontWeight: 700 }} />
                    <Typography sx={{ fontSize: '11px', fontFamily: 'monospace', color: '#FECF06', fontWeight: 700 }}>
                      {caso.numeroCaso}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', mb: 1 }}>
                    {caso.titulo}
                  </Typography>
                  <Typography sx={{ fontSize: '12px', color: '#AEAEB2', mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {caso.descripcion}
                  </Typography>
                </Box>

                <Box sx={{ pt: 2, borderTop: '1px solid rgba(254, 207, 6, 0.15)' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography sx={{ fontSize: '11px', color: '#AEAEB2' }}>Progreso Forense</Typography>
                    <Typography sx={{ fontSize: '11px', color: '#00FF41', fontWeight: 700 }}>{caso.porcentajeCompletado || 0}%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={caso.porcentajeCompletado || 0} sx={{ height: 6, borderRadius: 3, backgroundColor: 'rgba(0, 255, 65, 0.1)', '& .MuiLinearProgress-bar': { backgroundColor: '#00FF41' } }} />
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Modal Modal Nuevo Caso */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} fullWidth maxWidth="sm" slotProps={{ paper: { sx: { backgroundColor: '#121412', border: '1px solid rgba(254, 207, 6, 0.35)', p: 2 } } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#FECF06', fontWeight: 700 }}>
          Nuevo Expediente Pericial Forense
          <IconButton onClick={() => setIsModalOpen(false)} sx={{ color: '#AEAEB2' }}><X size={16} /></IconButton>
        </DialogTitle>
        <Box component="form" onSubmit={handleCreateCaso}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Título del Expediente *" fullWidth value={newTitulo} onChange={(e) => setNewTitulo(e.target.value)} required />
            <TextField select label="Tipo de Investigación" fullWidth value={newTipo} onChange={(e) => setNewTipo(e.target.value as TipoProyecto)}>
              <MenuItem value="forense_whatsapp">Forense WhatsApp (Móvil Android)</MenuItem>
              <MenuItem value="forense_email">Forense Email (Cabeceras SMTP)</MenuItem>
              <MenuItem value="forense_discoduro">Forense Disco Duro (Clonado Bit-a-Bit)</MenuItem>
            </TextField>
            <TextField label="Dispositivo / Evidencia Primaria" fullWidth value={newDispositivo} onChange={(e) => setNewDispositivo(e.target.value)} />
            <TextField label="Perito Asignado" fullWidth value={newPerito} onChange={(e) => setNewPerito(e.target.value)} />
          </DialogContent>
          <DialogActions sx={{ pt: 2 }}>
            <Button onClick={() => setIsModalOpen(false)} variant="ghost" size="sm">Cancelar</Button>
            <Button type="submit" variant="primary" size="sm">Crear Expediente</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}
