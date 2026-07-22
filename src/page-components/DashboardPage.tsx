'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';

import {
  useCMSStore,
  type EstadoCaso,
  type PrioridadCaso,
  type TipoProyecto,
  type CasoCMS
} from '../store/cmsStore';
import {
  FolderOpen, ShieldCheck, AlertTriangle, Plus, BookOpen,
  ClipboardList, Smartphone, Mail, HardDrive, Search, Filter,
  ChevronRight, CheckCircle2, Lock, Activity, Database,
  FileText, ExternalLink, Printer, Key, ShieldAlert, User, X
} from '../components/atoms/AppleIcon';
import Button from '../components/atoms/Button';
import StatusDot from '../components/atoms/StatusDot';
import { NORMATIVAS_RAG_MAPPING, EvidenciaNormativaGroup } from '../data/normativasMapping';
import { getTiposProyecto, getTipoProyectoConfig, getPasosPorTipo } from '../data/tiposProyecto';

const ESTADO_LABEL: Record<EstadoCaso, { label: string; color: string; bg: string }> = {
  iniciado:    { label: 'Iniciado',    color: '#FECF06', bg: 'rgba(254, 207, 6, 0.1)' },
  en_proceso:  { label: 'En Proceso',  color: '#FF9500', bg: 'rgba(255, 149, 0, 0.1)' },
  analisis:    { label: 'Análisis',    color: '#9DFF00', bg: 'rgba(157, 255, 0, 0.1)' },
  informe:     { label: 'Informe',     color: '#FECF06', bg: 'rgba(254, 207, 6, 0.1)' },
  cerrado:     { label: 'Cerrado',     color: '#00FF41', bg: 'rgba(0, 255, 65, 0.1)' },
  archivado:   { label: 'Archivado',   color: '#AEAEB2', bg: 'rgba(255, 255, 255, 0.06)' },
};

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'casos' | 'compliance'>('dashboard');

  const casos = useCMSStore(state => state.casos);
  const auditLogs = useCMSStore(state => state.auditLogs) || [];
  const getEstadisticas = useCMSStore(state => state.getEstadisticas);
  const addCaso = useCMSStore(state => state.addCaso);
  const stats = getEstadisticas();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<string>('todos');
  const [filterTipo, setFilterTipo] = useState<string>('todos');

  const [selectedCasoId, setSelectedCasoId] = useState<string>(casos[0]?.id || '');
  useEffect(() => {
    if (!selectedCasoId && casos.length > 0) {
      setSelectedCasoId(casos[0].id);
    }
  }, [casos, selectedCasoId]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitulo, setNewTitulo] = useState('');
  const [newTipo, setNewTipo] = useState<TipoProyecto>('forense_whatsapp');
  const [newPrioridad, setNewPrioridad] = useState<PrioridadCaso>('alta');
  const [newPerito, setNewPerito] = useState('Ing. Perito Forense Digital');
  const [newFiscal, setNewFiscal] = useState('Fiscalía Superior del Ministerio Público');
  const [newDispositivo, setNewDispositivo] = useState('');

  useEffect(() => {
    if (searchParams.get('nuevo') === 'true') {
      setIsModalOpen(true);
    }
  }, [searchParams]);

  const handleCreateCaso = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitulo.trim()) return;

    const numCorrelativo = String(casos.length + 1).padStart(4, '0');
    const nuevoCodigo = `EXP-2026-${numCorrelativo}`;

    const config = getTipoProyectoConfig(newTipo);
    const initialSteps: Record<string, any> = {};
    config.pasos.forEach((p) => {
      initialSteps[p.id] = {
        pasoId: p.id,
        estado: p.num === 1 ? 'en_proceso' : 'pendiente',
        completadoEn: p.num === 1 ? new Date().toISOString() : undefined,
      };
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
      normativasAplicadas: ['ISO/IEC 27037:2012', 'MUCC-2017', 'NIST SP 800-101'],
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
    if (casoId) setSelectedCasoId(casoId);
    setActiveTab('compliance');
  };

  const casosFiltrados = useMemo(() => {
    return casos.filter(c => {
      const matchSearch = c.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.numeroCaso.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (c.peritoLider && c.peritoLider.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchEstado = filterEstado === 'todos' || c.estado === filterEstado;
      const matchTipo = filterTipo === 'todos' || c.tipoProyecto === filterTipo;
      return matchSearch && matchEstado && matchTipo;
    });
  }, [casos, searchTerm, filterEstado, filterTipo]);

  const casoActivo = useMemo(() => {
    return casos.find(c => c.id === selectedCasoId) || casos[0];
  }, [casos, selectedCasoId]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pb: 6 }}>
      {/* Institutional Header */}
      <Box sx={{ pb: 2, borderBottom: '1px solid rgba(254, 207, 6, 0.3)' }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { md: 'center' }, gap: 2 }}>
          <Box>
            <Typography component="h1" sx={{ fontSize: { xs: '20px', sm: '26px' }, fontWeight: 800, color: '#00FF41', fontFamily: 'monospace', textTransform: 'uppercase' }}>
              CENTRO DE MANDO COMPLIANCE FORENSE DIGITAL
            </Typography>
            <Typography component="h2" sx={{ fontSize: '14px', fontWeight: 600, color: '#FECF06', mt: 0.5 }}>
              SHA256.US — Laboratorio de Informática Forense y Ciberseguridad
            </Typography>
            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', mt: 1.5 }}>
              <Chip label="ISO/IEC 27037" size="small" sx={{ backgroundColor: 'rgba(254, 207, 6, 0.15)', color: '#FECF06', fontFamily: 'monospace', fontWeight: 700 }} />
              <Chip label="NIST SP 800-86/101" size="small" sx={{ backgroundColor: 'rgba(0, 255, 65, 0.15)', color: '#00FF41', fontFamily: 'monospace', fontWeight: 700 }} />
              <Chip label="MUCC-2017 (MP-CICPC)" size="small" sx={{ backgroundColor: 'rgba(157, 255, 0, 0.15)', color: '#9DFF00', fontFamily: 'monospace', fontWeight: 700 }} />
              <Chip label="COPP Art. 225" size="small" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#FFFFFF', fontFamily: 'monospace', fontWeight: 700 }} />
            </Stack>
          </Box>

          <Button onClick={() => setIsModalOpen(true)} variant="primary" size="md">
            <Plus size={16} /> Nuevo Caso Forense
          </Button>
        </Box>
      </Box>

      {/* Section Navigation Bar */}
      <Tabs
        value={activeTab}
        onChange={(_, val) => setActiveTab(val)}
        sx={{
          backgroundColor: '#121412',
          borderRadius: '12px',
          p: '4px',
          border: '1px solid #524000',
          '& .MuiTabs-indicator': { backgroundColor: '#FECF06', height: 3 },
        }}
      >
        <Tab value="dashboard" label="1. Centro de Mando & KPIs" sx={{ color: '#AEAEB2', '&.Mui-selected': { color: '#FECF06', fontWeight: 700 } }} />
        <Tab value="casos" label={`2. Directorio de Casos (${casos.length})`} sx={{ color: '#AEAEB2', '&.Mui-selected': { color: '#FECF06', fontWeight: 700 } }} />
        <Tab value="compliance" label="3. Etapas & Normativas RAG" sx={{ color: '#AEAEB2', '&.Mui-selected': { color: '#FECF06', fontWeight: 700 } }} />
      </Tabs>

      {/* Tab 1: Dashboard & KPIs */}
      {activeTab === 'dashboard' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ p: 2.5, borderLeft: '4px solid #00FF41' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '11px', color: '#AEAEB2', fontWeight: 700, textTransform: 'uppercase' }}>Casos en Custodia</Typography>
                  <FolderOpen size={18} style={{ color: '#00FF41' }} />
                </Box>
                <Typography sx={{ fontSize: '32px', fontWeight: 800, color: '#FFFFFF', fontFamily: 'monospace', my: 1 }}>{stats.casosActivos}</Typography>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <StatusDot status="online" size={6} />
                  <Typography sx={{ fontSize: '10px', color: '#00FF41', fontWeight: 700 }}>Hash Chain Inmutable Activo</Typography>
                </Stack>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ p: 2.5, borderLeft: '4px solid #FECF06' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '11px', color: '#AEAEB2', fontWeight: 700, textTransform: 'uppercase' }}>Índice Compliance %</Typography>
                  <ShieldCheck size={18} style={{ color: '#FECF06' }} />
                </Box>
                <Typography sx={{ fontSize: '32px', fontWeight: 800, color: '#FFFFFF', fontFamily: 'monospace', my: 1 }}>{stats.cumplimientoGeneral}%</Typography>
                <LinearProgress variant="determinate" value={stats.cumplimientoGeneral} sx={{ height: 6, borderRadius: 3, backgroundColor: 'rgba(254, 207, 6, 0.15)', '& .MuiLinearProgress-bar': { backgroundColor: '#FECF06' } }} />
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ p: 2.5, borderLeft: '4px solid #9DFF00' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '11px', color: '#AEAEB2', fontWeight: 700, textTransform: 'uppercase' }}>Alertas Trazabilidad</Typography>
                  <AlertTriangle size={18} style={{ color: '#9DFF00' }} />
                </Box>
                <Typography sx={{ fontSize: '32px', fontWeight: 800, color: '#FFFFFF', fontFamily: 'monospace', my: 1 }}>{stats.tareasPendientes}</Typography>
                <Typography sx={{ fontSize: '10px', color: '#9DFF00', fontWeight: 700 }}>Revisión de Gating Requerida</Typography>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ p: 2.5, borderLeft: '4px solid #FFFFFF' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '11px', color: '#AEAEB2', fontWeight: 700, textTransform: 'uppercase' }}>Dictámenes Periciales</Typography>
                  <ClipboardList size={18} style={{ color: '#FFFFFF' }} />
                </Box>
                <Typography sx={{ fontSize: '32px', fontWeight: 800, color: '#FFFFFF', fontFamily: 'monospace', my: 1 }}>{stats.casosCerrados}</Typography>
                <Typography sx={{ fontSize: '10px', color: '#AEAEB2' }}>Listos para Impresión / PDF</Typography>
              </Card>
            </Grid>
          </Grid>

          {/* Quick Case Openers */}
          <Card sx={{ p: 3, backgroundColor: 'rgba(254, 207, 6, 0.05)', borderLeft: '4px solid #FECF06' }}>
            <Typography component="h3" sx={{ fontSize: '14px', fontWeight: 700, color: '#FECF06', textTransform: 'uppercase', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Key size={16} /> Apertura Rápida de Expedientes por Tipología Pericial
            </Typography>
            <Grid container spacing={2}>
              {[
                { type: 'forense_whatsapp', title: 'Forense WhatsApp', desc: '9 Pasos MUCC-2017 / Extracción Móvil', icon: <Smartphone size={20} />, color: '#00FF41' },
                { type: 'forense_email', title: 'Forense Email', desc: '7 Pasos ISO 27037 / Cabeceras SMTP', icon: <Mail size={20} />, color: '#FECF06' },
                { type: 'forense_discoduro', title: 'Forense Disco Duro', desc: '8 Pasos NIST SP 800-86 / Clonado Bit', icon: <HardDrive size={20} />, color: '#9DFF00' },
              ].map((item) => (
                <Grid key={item.type} size={{ xs: 12, md: 4 }}>
                  <Box
                    onClick={() => { setNewTipo(item.type as TipoProyecto); setIsModalOpen(true); }}
                    sx={{
                      p: 2,
                      backgroundColor: '#121412',
                      border: '1px solid rgba(254, 207, 6, 0.2)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': { borderColor: item.color, transform: 'translateY(-2px)' },
                    }}
                  >
                    <Box sx={{ p: 1.5, borderRadius: '8px', backgroundColor: `${item.color}15`, color: item.color }}>
                      {item.icon}
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>{item.title}</Typography>
                      <Typography sx={{ fontSize: '11px', color: '#AEAEB2' }}>{item.desc}</Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Card>
        </Box>
      )}

      {/* Tab 2: Directory of Cases */}
      {activeTab === 'casos' && (
        <Card sx={{ p: 3 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
            <TextField
              size="small"
              placeholder="Buscar expediente, código o perito..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
            />
            <TextField
              select
              size="small"
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="todos">Todos los Estados</MenuItem>
              <MenuItem value="iniciado">Iniciado</MenuItem>
              <MenuItem value="en_proceso">En Proceso</MenuItem>
              <MenuItem value="analisis">Análisis</MenuItem>
              <MenuItem value="cerrado">Cerrado</MenuItem>
            </TextField>
          </Stack>

          <Grid container spacing= {2}>
            {casosFiltrados.map((caso) => {
              const meta = ESTADO_LABEL[caso.estado] || ESTADO_LABEL.iniciado;
              return (
                <Grid key={caso.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card
                    onClick={() => router.push(`/casos/${caso.id}`)}
                    sx={{ p: 2.5, cursor: 'pointer', transition: 'all 0.2s ease', '&:hover': { borderColor: '#FECF06', transform: 'translateY(-2px)' } }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Chip label={meta.label} size="small" sx={{ backgroundColor: meta.bg, color: meta.color, fontWeight: 700 }} />
                      <Typography sx={{ fontSize: '11px', fontFamily: 'monospace', color: '#AEAEB2' }}>{caso.numeroCaso}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', mb: 1 }}>{caso.titulo}</Typography>
                    <Typography sx={{ fontSize: '12px', color: '#AEAEB2', mb: 2 }}>{caso.descripcion}</Typography>
                    <LinearProgress variant="determinate" value={caso.porcentajeCompletado || 0} sx={{ height: 6, borderRadius: 3, backgroundColor: 'rgba(0, 255, 65, 0.1)', '& .MuiLinearProgress-bar': { backgroundColor: '#00FF41' } }} />
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Card>
      )}

      {/* Modal: Nuevo Caso */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} fullWidth maxWidth="sm" slotProps={{ paper: { sx: { backgroundColor: '#121412', border: '1px solid rgba(254, 207, 6, 0.35)', p: 2 } } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#FECF06', fontWeight: 700 }}>
          Apertura de Expediente Forense Digital
          <IconButton onClick={() => setIsModalOpen(false)} sx={{ color: '#AEAEB2' }}><X size={16} /></IconButton>
        </DialogTitle>
        <Box component="form" onSubmit={handleCreateCaso}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Título del Expediente *" fullWidth value={newTitulo} onChange={(e) => setNewTitulo(e.target.value)} required />
            <TextField select label="Tipología Pericial" fullWidth value={newTipo} onChange={(e) => setNewTipo(e.target.value as TipoProyecto)}>
              <MenuItem value="forense_whatsapp">Forense WhatsApp (Móvil Android)</MenuItem>
              <MenuItem value="forense_email">Forense Email (Cabeceras SMTP)</MenuItem>
              <MenuItem value="forense_discoduro">Forense Disco Duro (Clonado Bit-a-Bit)</MenuItem>
            </TextField>
            <TextField label="Dispositivo / Evidencia Primaria" fullWidth value={newDispositivo} onChange={(e) => setNewDispositivo(e.target.value)} />
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
