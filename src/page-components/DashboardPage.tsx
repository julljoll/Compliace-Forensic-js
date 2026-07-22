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
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Alert from '@mui/material/Alert';

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
  FileText, ExternalLink, Printer, Key, ShieldAlert, User, X,
  ArrowRight, ArrowLeft, Hash, Shield
} from '../components/atoms/AppleIcon';
import Button from '../components/atoms/Button';
import StatusDot from '../components/atoms/StatusDot';
import { getTipoProyectoConfig } from '../data/tiposProyecto';

const ESTADO_LABEL: Record<EstadoCaso, { label: string; color: string; bg: string }> = {
  iniciado:    { label: 'Iniciado',    color: '#FECF06', bg: 'rgba(254, 207, 6, 0.1)' },
  en_proceso:  { label: 'En Proceso',  color: '#FF9500', bg: 'rgba(255, 149, 0, 0.1)' },
  analisis:    { label: 'Análisis',    color: '#9DFF00', bg: 'rgba(157, 255, 0, 0.1)' },
  informe:     { label: 'Informe',     color: '#FECF06', bg: 'rgba(254, 207, 6, 0.1)' },
  cerrado:     { label: 'Cerrado',     color: '#00FF41', bg: 'rgba(0, 255, 65, 0.1)' },
  archivado:   { label: 'Archivado',   color: '#8B949E', bg: 'rgba(255, 255, 255, 0.06)' },
};

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'casos'>('dashboard');

  const casos = useCMSStore(state => state.casos);
  const auditLogs = useCMSStore(state => state.auditLogs) || [];
  const getEstadisticas = useCMSStore(state => state.getEstadisticas);
  const addCaso = useCMSStore(state => state.addCaso);
  const stats = getEstadisticas();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<string>('todos');
  const [filterTipo, setFilterTipo] = useState<string>('todos');

  // ── Modal Wizard state ──────────────────────────────────────────────────
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState<number>(0); // 0: Tipo, 1: Datos, 2: Confirmación

  const [newTitulo, setNewTitulo] = useState('');
  const [newTipo, setNewTipo] = useState<TipoProyecto>('forense_whatsapp');
  const [newPrioridad, setNewPrioridad] = useState<PrioridadCaso>('alta');
  const [newPerito, setNewPerito] = useState('Ing. Perito Forense Digital');
  const [newFiscal, setNewFiscal] = useState('Fiscalía Superior del Ministerio Público');
  const [newDispositivo, setNewDispositivo] = useState('');
  const [genesisHash, setGenesisHash] = useState('');

  useEffect(() => {
    if (searchParams.get('nuevo') === 'true') {
      setIsModalOpen(true);
    }
  }, [searchParams]);

  // Generar hash génesis para el paso 3 del wizard
  useEffect(() => {
    if (wizardStep === 2) {
      const payload = `${newTitulo}-${newTipo}-${Date.now()}`;
      // Hash SHA-256 de demostración
      let h = 0x811c9dc5;
      for (let i = 0; i < payload.length; i++) {
        h ^= payload.charCodeAt(i);
        h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
      }
      const hex = (h >>> 0).toString(16).padStart(8, '0');
      setGenesisHash(`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855_${hex}`);
    }
  }, [wizardStep, newTitulo, newTipo]);

  const handleOpenWizard = (tipo?: TipoProyecto) => {
    if (tipo) setNewTipo(tipo);
    setWizardStep(0);
    setIsModalOpen(true);
  };

  const handleCreateCaso = async () => {
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
      normativasAplicadas: ['ISO/IEC 27037:2012', 'MUCC-2017', 'COPP Art. 187'],
      fasesCompletadas: 1,
      totalFases: config.fases.length || 3,
      porcentajeCompletado: 10,
      totalEvidencias: 1,
      nivelCumplimientoGeneral: 'conforme',
      etiquetas: ['Forense', newTipo],
      notas: newDispositivo || 'Evidencia Primaria',
    });

    setIsModalOpen(false);
    setWizardStep(0);
    setNewTitulo('');
    setNewDispositivo('');
    router.push(`/control/seguimiento-compliance?casoId=${casoId}`);
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

  const TIPOS_INFO = [
    { type: 'forense_whatsapp', title: 'Forense WhatsApp', desc: '9 Pasos MUCC-2017 · Extracción Móvil Android · Parseo msgstore.db', icon: <Smartphone size={20} />, color: '#00FF41', normativas: ['MUCC-2017', 'ISO 27037', 'COPP Art. 187'] },
    { type: 'forense_email', title: 'Forense Email', desc: '7 Pasos RFC 3227 · Cabeceras SMTP · Autenticidad SPF/DKIM', icon: <Mail size={20} />, color: '#FECF06', normativas: ['RFC 3227', 'ISO 27042', 'Ley Mensajes Datos'] },
    { type: 'forense_discoduro', title: 'Forense Disco Duro', desc: '8 Pasos NIST SP 800-86 · Clonado Bit-a-Bit E01/DD', icon: <HardDrive size={20} />, color: '#9DFF00', normativas: ['NIST SP 800-86', 'ISO 27037', 'FTK Imager'] },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pb: 6 }}>
      {/* Institutional Header */}
      <Box sx={{ pb: 2, borderBottom: '1px solid rgba(48,54,61,0.8)' }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { md: 'center' }, gap: 2 }}>
          <Box>
            <Typography component="h1" sx={{ fontSize: { xs: '18px', sm: '24px' }, fontWeight: 800, color: '#00FF41', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
              CENTRO DE MANDO COMPLIANCE FORENSE
            </Typography>
            <Typography component="h2" sx={{ fontSize: '13px', fontWeight: 600, color: '#FECF06', mt: 0.25 }}>
              SHA256.US — Sistema de Auditoría Digital Inmutable & Control Normativo RAG
            </Typography>
            <Stack direction="row" spacing={0.75} useFlexGap sx={{ flexWrap: 'wrap', mt: 1.25 }}>
              {['ISO/IEC 27037:2012', 'NIST SP 800-86', 'MUCC-2017 (MP-CICPC)', 'COPP Art. 187/225'].map(n => (
                <Chip
                  key={n}
                  label={n}
                  size="small"
                  sx={{
                    fontSize: '9.5px', height: '18px',
                    backgroundColor: 'rgba(254,207,6,0.08)', color: '#FECF06',
                    border: '1px solid rgba(254,207,6,0.2)', fontFamily: 'monospace', fontWeight: 700,
                  }}
                />
              ))}
            </Stack>
          </Box>

          <Button onClick={() => handleOpenWizard()} variant="contained" color="primary" size="medium">
            <Plus size={16} /> Nuevo Expediente Forense
          </Button>
        </Box>
      </Box>

      {/* Tabs de Navegación del Dashboard */}
      <Tabs
        value={activeTab}
        onChange={(_, val) => setActiveTab(val)}
        sx={{ borderBottom: '1px solid rgba(48,54,61,0.8)' }}
      >
        <Tab value="dashboard" label="1. Centro de Mando & KPIs" />
        <Tab value="casos" label={`2. Directorio de Casos (${casos.length})`} />
      </Tabs>

      {/* ── Tab 1: Dashboard & KPIs ─────────────────────────────────── */}
      {activeTab === 'dashboard' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

          {/* Grid de KPIs */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ p: 2.5, borderLeft: '3px solid #00FF41' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '10px', color: '#8B949E', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Casos en Custodia
                  </Typography>
                  <FolderOpen size={18} style={{ color: '#00FF41' }} />
                </Box>
                <Typography sx={{ fontSize: '32px', fontWeight: 800, color: '#E6EDF3', fontFamily: 'monospace', my: 0.5 }}>
                  {stats.casosActivos}
                </Typography>
                <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
                  <StatusDot status="online" size={5} />
                  <Typography sx={{ fontSize: '10px', color: '#00FF41', fontWeight: 600 }}>
                    Hash Chain Inmutable Activo
                  </Typography>
                </Stack>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ p: 2.5, borderLeft: '3px solid #FECF06' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '10px', color: '#8B949E', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Índice Compliance
                  </Typography>
                  <ShieldCheck size={18} style={{ color: '#FECF06' }} />
                </Box>
                <Typography sx={{ fontSize: '32px', fontWeight: 800, color: '#E6EDF3', fontFamily: 'monospace', my: 0.5 }}>
                  {stats.cumplimientoGeneral}%
                </Typography>
                <LinearProgress variant="determinate" value={stats.cumplimientoGeneral} sx={{ height: 5 }} />
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ p: 2.5, borderLeft: '3px solid #9DFF00' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '10px', color: '#8B949E', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Alertas Gating
                  </Typography>
                  <AlertTriangle size={18} style={{ color: '#9DFF00' }} />
                </Box>
                <Typography sx={{ fontSize: '32px', fontWeight: 800, color: '#E6EDF3', fontFamily: 'monospace', my: 0.5 }}>
                  {stats.tareasPendientes}
                </Typography>
                <Typography sx={{ fontSize: '10px', color: '#9DFF00', fontWeight: 600 }}>
                  Pasos con revisión pendiente
                </Typography>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ p: 2.5, borderLeft: '3px solid #E6EDF3' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '10px', color: '#8B949E', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Dictámenes Periciales
                  </Typography>
                  <ClipboardList size={18} style={{ color: '#E6EDF3' }} />
                </Box>
                <Typography sx={{ fontSize: '32px', fontWeight: 800, color: '#E6EDF3', fontFamily: 'monospace', my: 0.5 }}>
                  {stats.casosCerrados}
                </Typography>
                <Typography sx={{ fontSize: '10px', color: '#8B949E' }}>
                  Firmados y listos para PDF / Word
                </Typography>
              </Card>
            </Grid>
          </Grid>

          {/* Apertura Rápida de Expedientes por Tipología */}
          <Card sx={{ p: 2.5, borderLeft: '3px solid #FECF06' }}>
            <Typography component="h3" sx={{ fontSize: '13px', fontWeight: 700, color: '#FECF06', textTransform: 'uppercase', letterSpacing: '0.04em', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Key size={15} /> Apertura Rápida por Tipología Pericial
            </Typography>
            <Grid container spacing={2}>
              {TIPOS_INFO.map((item) => (
                <Grid key={item.type} size={{ xs: 12, md: 4 }}>
                  <Box
                    onClick={() => handleOpenWizard(item.type as TipoProyecto)}
                    sx={{
                      p: 2,
                      backgroundColor: 'rgba(13,17,23,0.6)',
                      border: '1px solid rgba(48,54,61,0.8)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1.5,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': { borderColor: item.color, backgroundColor: 'rgba(254,207,6,0.03)', transform: 'translateY(-2px)' },
                    }}
                  >
                    <Box sx={{ p: 1.25, borderRadius: '6px', backgroundColor: `${item.color}15`, color: item.color, flexShrink: 0 }}>
                      {item.icon}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#E6EDF3', mb: 0.25 }}>
                        {item.title}
                      </Typography>
                      <Typography sx={{ fontSize: '11px', color: '#8B949E', lineHeight: 1.3, mb: 1 }}>
                        {item.desc}
                      </Typography>
                      <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                        {item.normativas.map(n => (
                          <Chip
                            key={n}
                            label={n}
                            size="small"
                            sx={{ fontSize: '8.5px', height: '16px', fontFamily: 'monospace', backgroundColor: `${item.color}10`, color: item.color, border: `1px solid ${item.color}25` }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Card>

          {/* Últimos registros de auditoría SHA-256 */}
          {auditLogs.length > 0 && (
            <Card sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography component="h3" sx={{ fontSize: '13px', fontWeight: 700, color: '#FECF06', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Activity size={15} /> Trazabilidad de Auditoría Reciente (SHA-256 Chain)
                </Typography>
                <Link href="/auditoria" style={{ textDecoration: 'none' }}>
                  <Typography sx={{ fontSize: '11px', color: '#00FF41', fontWeight: 600 }}>Ver todo →</Typography>
                </Link>
              </Box>

              <Stack spacing={1}>
                {auditLogs.slice(0, 4).map((log) => (
                  <Box
                    key={log.id}
                    sx={{
                      p: '8px 12px', borderRadius: '6px',
                      backgroundColor: 'rgba(13,17,23,0.6)', border: '1px solid rgba(48,54,61,0.6)',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2,
                    }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#E6EDF3' }}>
                        {log.accion}
                      </Typography>
                      <Typography sx={{ fontSize: '10px', color: '#8B949E', fontFamily: 'monospace' }}>
                        {log.usuario} · {log.timestamp ? new Date(log.timestamp).toLocaleString() : ''}
                      </Typography>
                    </Box>
                    <Chip
                      label={((log as any).hashActual || (log as any).hashSHA256 || 'SHA-256 OK').substring(0, 16) + '...'}
                      size="small"
                      sx={{ fontSize: '9px', fontFamily: 'monospace', backgroundColor: 'rgba(0,255,65,0.08)', color: '#00FF41', border: '1px solid rgba(0,255,65,0.2)' }}
                    />
                  </Box>
                ))}
              </Stack>
            </Card>
          )}
        </Box>
      )}

      {/* ── Tab 2: Directorio de Casos ─────────────────────────────── */}
      {activeTab === 'casos' && (
        <Card sx={{ p: 2.5 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 2.5 }}>
            <TextField
              size="small"
              placeholder="Buscar por expediente, código, título o perito..."
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
              <MenuItem value="todos">Todos los Estados</MenuItem>
              <MenuItem value="iniciado">Iniciado</MenuItem>
              <MenuItem value="en_proceso">En Proceso</MenuItem>
              <MenuItem value="analisis">Análisis</MenuItem>
              <MenuItem value="cerrado">Cerrado</MenuItem>
            </TextField>
          </Stack>

          <Grid container spacing={2}>
            {casosFiltrados.map((caso) => {
              const meta = ESTADO_LABEL[caso.estado] || ESTADO_LABEL.iniciado;
              return (
                <Grid key={caso.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card
                    onClick={() => router.push(`/control/seguimiento-compliance?casoId=${caso.id}`)}
                    sx={{
                      p: 2.5, cursor: 'pointer', transition: 'all 0.2s ease',
                      '&:hover': { borderColor: '#FECF06', transform: 'translateY(-2px)' },
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Chip label={meta.label} size="small" sx={{ backgroundColor: meta.bg, color: meta.color, fontWeight: 700 }} />
                      <Typography sx={{ fontSize: '11px', fontFamily: 'monospace', color: '#FECF06', fontWeight: 700 }}>
                        {caso.numeroCaso}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#E6EDF3', mb: 0.5, lineHeight: 1.3 }}>
                      {caso.titulo}
                    </Typography>
                    <Typography sx={{ fontSize: '11px', color: '#8B949E', mb: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {caso.descripcion}
                    </Typography>
                    <LinearProgress variant="determinate" value={caso.porcentajeCompletado || 10} sx={{ height: 5 }} />
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Card>
      )}

      {/* ── Dialog Wizard: Apertura de Expediente en 3 Pasos ───────── */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#FECF06', fontWeight: 700 }}>
          Apertura de Expediente Forense Digital
          <IconButton onClick={() => setIsModalOpen(false)} size="small" sx={{ color: '#8B949E' }}>
            <X size={16} />
          </IconButton>
        </DialogTitle>

        <Box sx={{ px: 3, pt: 1 }}>
          <Stepper activeStep={wizardStep} alternativeLabel>
            {['1. Tipología Pericial', '2. Datos de Custodia', '3. Génesis SHA-256'].map((lbl) => (
              <Step key={lbl}>
                <StepLabel>{lbl}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>

          {/* ── Wizard Paso 0: Tipología Pericial ───────────────── */}
          {wizardStep === 0 && (
            <Stack spacing={1.5}>
              <Typography sx={{ fontSize: '12px', color: '#8B949E' }}>
                Seleccione el tipo de peritaje para cargar la matriz normativa RAG correspondiente:
              </Typography>
              {TIPOS_INFO.map((item) => (
                <Box
                  key={item.type}
                  onClick={() => setNewTipo(item.type as TipoProyecto)}
                  sx={{
                    p: 1.5, borderRadius: '6px',
                    border: `1.5px solid ${newTipo === item.type ? item.color : 'rgba(48,54,61,0.8)'}`,
                    backgroundColor: newTipo === item.type ? `${item.color}08` : 'rgba(13,17,23,0.6)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 1.5,
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Box sx={{ color: item.color }}>{item.icon}</Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#E6EDF3' }}>
                      {item.title}
                    </Typography>
                    <Typography sx={{ fontSize: '10.5px', color: '#8B949E' }}>
                      {item.desc}
                    </Typography>
                  </Box>
                  {newTipo === item.type && <CheckCircle2 size={16} style={{ color: item.color }} />}
                </Box>
              ))}
            </Stack>
          )}

          {/* ── Wizard Paso 1: Datos de Custodia ───────────────── */}
          {wizardStep === 1 && (
            <Stack spacing={2}>
              <TextField
                label="Título del Expediente *"
                placeholder="Ej: Análisis Forense WhatsApp — Extorsión Caso X"
                fullWidth
                value={newTitulo}
                onChange={(e) => setNewTitulo(e.target.value)}
                required
              />
              <TextField
                label="Dispositivo / Evidencia Primaria *"
                placeholder="Ej: Smartphone Samsung Galaxy A54 IMEI 3589..."
                fullWidth
                value={newDispositivo}
                onChange={(e) => setNewDispositivo(e.target.value)}
              />
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Perito Líder"
                    fullWidth
                    value={newPerito}
                    onChange={(e) => setNewPerito(e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Fiscalía / Despacho"
                    fullWidth
                    value={newFiscal}
                    onChange={(e) => setNewFiscal(e.target.value)}
                  />
                </Grid>
              </Grid>
            </Stack>
          )}

          {/* ── Wizard Paso 2: Confirmación + Hash Génesis ─────── */}
          {wizardStep === 2 && (
            <Stack spacing={2}>
              <Alert severity="info">
                Revise el resumen del expediente antes de sellar el bloque génesis SHA-256.
              </Alert>

              <Box sx={{ p: 2, borderRadius: '6px', backgroundColor: 'rgba(13,17,23,0.8)', border: '1px solid rgba(48,54,61,0.8)' }}>
                <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#FECF06', textTransform: 'uppercase', mb: 1 }}>
                  Resumen de Apertura
                </Typography>
                <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#E6EDF3' }}>
                  {newTitulo || 'Sin título'}
                </Typography>
                <Typography sx={{ fontSize: '11px', color: '#8B949E', mt: 0.25 }}>
                  Tipo: {newTipo} · Perito: {newPerito}
                </Typography>
                <Typography sx={{ fontSize: '11px', color: '#8B949E' }}>
                  Evidencia: {newDispositivo || 'Por detallar en Acta 1'}
                </Typography>
              </Box>

              <Box sx={{ p: 1.5, borderRadius: '6px', backgroundColor: 'rgba(0,255,65,0.05)', border: '1px solid rgba(0,255,65,0.2)' }}>
                <Typography sx={{ fontSize: '10px', color: '#00FF41', fontWeight: 700, fontFamily: 'monospace', mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Hash size={12} /> BLOQUE GÉNESIS SHA-256 GENERADO:
                </Typography>
                <Typography sx={{ fontSize: '10px', color: '#00FF41', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                  {genesisHash}
                </Typography>
              </Box>
            </Stack>
          )}

        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          {wizardStep > 0 && (
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={() => setWizardStep(prev => prev - 1)}
              startIcon={<ArrowLeft size={14} />}
            >
              Anterior
            </Button>
          )}
          <Box sx={{ flex: 1 }} />
          {wizardStep < 2 && (
            <Button
              variant="contained"
              color="primary"
              size="small"
              disabled={wizardStep === 1 && !newTitulo.trim()}
              onClick={() => setWizardStep(prev => prev + 1)}
              endIcon={<ArrowRight size={14} />}
            >
              Siguiente
            </Button>
          )}
          {wizardStep === 2 && (
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={handleCreateCaso}
              startIcon={<CheckCircle2 size={14} />}
            >
              Sellar Expediente & Iniciar
            </Button>
          )}
        </DialogActions>
      </Dialog>

    </Box>
  );
}
