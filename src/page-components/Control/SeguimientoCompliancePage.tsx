'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import Switch from '@mui/material/Switch';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Collapse from '@mui/material/Collapse';
import Tooltip from '@mui/material/Tooltip';

import { useCMSStore } from '../../store/cmsStore';
import { getPasosPorTipo } from '../../data/tiposProyecto';
import {
  ShieldCheck, CheckCircle2, Clock, Lock, FileText,
  ChevronRight, AlertTriangle, FileCheck, Info
} from '../../components/atoms/AppleIcon';
import Button from '../../components/atoms/Button';

// ── Colores de estado ─────────────────────────────────────────────────────────
const ESTADO_COLOR = {
  pendiente:   { fg: '#484F58', bg: 'rgba(72,79,88,0.1)',    border: 'rgba(72,79,88,0.3)',    label: 'Pendiente'    },
  en_proceso:  { fg: '#FECF06', bg: 'rgba(254,207,6,0.08)',  border: 'rgba(254,207,6,0.3)',   label: 'En Proceso'   },
  completado:  { fg: '#00FF41', bg: 'rgba(0,255,65,0.07)',   border: 'rgba(0,255,65,0.3)',    label: 'Completado'   },
} as const;

// ── Normativas por tipo de paso ──────────────────────────────────────────────
const NORMATIVA_COLOR: Record<string, string> = {
  'COPP':    '#FECF06',
  'MUCC':    '#FECF06',
  'ISO':     '#00FF41',
  'NIST':    '#00FF41',
  'RFC':     '#9DFF00',
  'Ley':     '#FECF06',
  'ACPO':    '#9DFF00',
};
function normativaColor(label: string) {
  const key = Object.keys(NORMATIVA_COLOR).find(k => label.includes(k));
  return key ? NORMATIVA_COLOR[key] : '#8B949E';
}

// ── Iconos por estado ─────────────────────────────────────────────────────────
function EstadoIcon({ estado }: { estado: string }) {
  if (estado === 'completado') return <CheckCircle2 size={16} style={{ color: '#00FF41' }} />;
  if (estado === 'en_proceso') return <Clock size={16} style={{ color: '#FECF06' }} />;
  return <Lock size={16} style={{ color: '#484F58' }} />;
}

export default function SeguimientoCompliancePage() {
  const searchParams = useSearchParams();

  const casos = useCMSStore(state => state.casos);
  const completeStep = useCMSStore(state => state.completeStep);
  const toggleComplianceCheck = useCMSStore(state => state.toggleComplianceCheck);

  const [selectedCasoId, setSelectedCasoId] = useState<string>(
    searchParams.get('casoId') || casos[0]?.id || ''
  );
  const [expandedPaso, setExpandedPaso] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedCasoId && casos.length > 0) setSelectedCasoId(casos[0].id);
  }, [casos, selectedCasoId]);

  const casoActivo = useMemo(
    () => casos.find(c => c.id === selectedCasoId) || casos[0],
    [casos, selectedCasoId]
  );

  const pasosConfig = useMemo(() => {
    if (!casoActivo?.tipoProyecto) return getPasosPorTipo('forense_whatsapp');
    return getPasosPorTipo(casoActivo.tipoProyecto);
  }, [casoActivo]);

  const checklist   = casoActivo?.compliance_checklist || [];
  const checkedCount = checklist.filter(c => c.checked).length;
  const complianceRate = Math.min(100, Math.round((checkedCount / Math.max(checklist.length, 1)) * 100));

  // Estado visual de cada paso
  const pasoEstados: Record<string, keyof typeof ESTADO_COLOR> = useMemo(() => {
    if (!casoActivo || !pasosConfig) return {};
    const out: Record<string, keyof typeof ESTADO_COLOR> = {};
    pasosConfig.forEach(p => {
      const isDone = casoActivo.completed_steps?.[p.id] || casoActivo.steps?.[p.id]?.estado === 'completado';
      const isProgress = casoActivo.steps?.[p.id]?.estado === 'en_progreso';
      out[p.id] = isDone ? 'completado' : isProgress ? 'en_proceso' : 'pendiente';
    });
    return out;
  }, [casoActivo, pasosConfig]);

  // Bloqueo secuencial: el paso N solo se puede completar si N-1 está completado
  function isPasoDesbloqueado(idx: number): boolean {
    if (idx === 0) return true;
    const prevId = pasosConfig[idx - 1]?.id;
    return pasoEstados[prevId] === 'completado';
  }

  function handleTogglePaso(pasoId: string) {
    setExpandedPaso(prev => prev === pasoId ? null : pasoId);
  }

  function handleCompletarPaso(pasoId: string) {
    useCMSStore.getState().seleccionarCaso(selectedCasoId);
    completeStep(pasoId);
  }

  // Progress steps for MUI Stepper (fases)
  const fases = casoActivo?.tipoProyecto
    ? getPasosPorTipo(casoActivo.tipoProyecto).reduce((acc: string[], p) => {
        if (!acc.includes(p.fase)) acc.push(p.fase);
        return acc;
      }, [])
    : [];

  const faseActiva = pasosConfig.findIndex(p => pasoEstados[p.id] !== 'completado');
  const faseActivaIdx = faseActiva === -1 ? fases.length : Math.floor(faseActiva / 3);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pb: 6 }}>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <Box sx={{ pb: 2, borderBottom: '1px solid rgba(48,54,61,0.8)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography component="h1" sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#00FF41', display: 'flex', alignItems: 'center', gap: 1 }}>
            <ShieldCheck size={22} style={{ color: '#FECF06' }} />
            Seguimiento Normativo — Cadena de Custodia
          </Typography>
          <Typography sx={{ fontSize: '12px', color: '#8B949E', mt: 0.5 }}>
            Gating secuencial forense · MUCC-2017 · ISO 27037 · COPP Art. 187
          </Typography>
        </Box>

        {casos.length > 0 && (
          <TextField
            select
            size="small"
            label="Expediente"
            value={selectedCasoId}
            onChange={(e) => setSelectedCasoId(e.target.value)}
            sx={{ minWidth: 280 }}
          >
            {casos.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                <Typography sx={{ fontSize: '13px', fontFamily: 'monospace' }}>
                  {c.numeroCaso}
                </Typography>
                &nbsp;&nbsp;{c.titulo}
              </MenuItem>
            ))}
          </TextField>
        )}
      </Box>

      {/* ── Sin casos ──────────────────────────────────────────────── */}
      {!casoActivo && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          No hay expedientes abiertos. Cree un caso desde el Panel Principal para iniciar el seguimiento normativo.
        </Alert>
      )}

      {casoActivo && (
        <>
          {/* ── Resumen del caso ────────────────────────────────────── */}
          <Card sx={{ p: 2.5, borderLeft: '3px solid #FECF06' }}>
            <Grid container spacing={3} sx={{ alignItems: 'center' }}>
              <Grid size={{ xs: 12, md: 7 }}>
                <Typography sx={{ fontSize: '10px', fontFamily: 'monospace', color: '#FECF06', fontWeight: 700, letterSpacing: '0.06em', mb: 0.5 }}>
                  EXPEDIENTE: {casoActivo.numeroCaso}
                </Typography>
                <Typography component="h2" sx={{ fontSize: '1.125rem', fontWeight: 700, color: '#E6EDF3', mb: 0.25 }}>
                  {casoActivo.titulo}
                </Typography>
                <Typography sx={{ fontSize: '12px', color: '#8B949E' }}>
                  Perito: {casoActivo.peritoLider || 'Sin asignar'} · Fiscalía: {casoActivo.fiscal || 'Ministerio Público'}
                </Typography>

                <Stack direction="row" spacing={0.75} sx={{ mt: 1.5, flexWrap: 'wrap', gap: 0.5 }}>
                  {['MUCC-2017', 'ISO 27037', 'COPP Art. 187', 'Ley Mensajes Datos'].map(n => (
                    <Chip
                      key={n}
                      label={n}
                      size="small"
                      sx={{
                        fontSize: '9.5px',
                        height: '18px',
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        backgroundColor: 'rgba(254,207,6,0.08)',
                        color: '#FECF06',
                        border: '1px solid rgba(254,207,6,0.2)',
                      }}
                    />
                  ))}
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, md: 5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                  <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#8B949E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Tasa de Cumplimiento
                  </Typography>
                  <Typography sx={{ fontSize: '16px', fontWeight: 800, color: '#00FF41', fontFamily: 'monospace' }}>
                    {complianceRate}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={complianceRate}
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Typography sx={{ fontSize: '10px', color: '#8B949E', mt: 0.5, fontFamily: 'monospace' }}>
                  {checkedCount} / {checklist.length} controles verificados
                </Typography>
              </Grid>
            </Grid>
          </Card>

          {/* ── Stepper de fases ────────────────────────────────────── */}
          {fases.length > 0 && (
            <Card sx={{ p: 2.5 }}>
              <Stepper activeStep={faseActivaIdx} alternativeLabel>
                {fases.map((fase, idx) => (
                  <Step key={fase} completed={idx < faseActivaIdx}>
                    <StepLabel>
                      <Typography sx={{ fontSize: '11px', fontWeight: 600 }}>{fase}</Typography>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Card>
          )}

          {/* ── Pasos del flujo forense ─────────────────────────────── */}
          <Stack spacing={1.25}>
            {pasosConfig.map((paso, idx) => {
              const estado = pasoEstados[paso.id] || 'pendiente';
              const ec     = ESTADO_COLOR[estado];
              const bloqueado = !isPasoDesbloqueado(idx);
              const expandido  = expandedPaso === paso.id;

              return (
                <Card
                  key={paso.id}
                  sx={{
                    border: `1px solid ${ec.border}`,
                    backgroundColor: ec.bg,
                    opacity: bloqueado ? 0.55 : 1,
                    transition: 'all 0.2s ease',
                    '&:hover': !bloqueado ? { borderColor: ec.fg, boxShadow: `0 4px 12px ${ec.bg}` } : {},
                  }}
                >
                  {/* Cabecera del paso */}
                  <Box
                    onClick={() => !bloqueado && handleTogglePaso(paso.id)}
                    sx={{
                      p: '14px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      cursor: bloqueado ? 'not-allowed' : 'pointer',
                      userSelect: 'none',
                    }}
                  >
                    {/* Número de paso */}
                    <Box sx={{
                      width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                      backgroundColor: `${ec.fg}18`,
                      border: `1.5px solid ${ec.fg}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {estado === 'completado'
                        ? <CheckCircle2 size={14} style={{ color: '#00FF41' }} />
                        : <Typography sx={{ fontSize: '12px', fontWeight: 800, color: ec.fg, fontFamily: 'monospace' }}>{paso.num}</Typography>
                      }
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                        <Typography sx={{ fontSize: '13px', fontWeight: 700, color: ec.fg }}>
                          Paso {paso.num}
                        </Typography>
                        <Typography sx={{ fontSize: '9.5px', color: '#8B949E', fontFamily: 'monospace' }}>
                          {paso.fase}
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#E6EDF3', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {paso.titulo}
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0, mr: 1 }}>
                      {paso.normativas?.slice(0, 2).map(n => (
                        <Chip
                          key={n.label}
                          label={n.label}
                          size="small"
                          sx={{
                            fontSize: '8.5px',
                            height: '16px',
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            backgroundColor: `${normativaColor(n.label)}12`,
                            color: normativaColor(n.label),
                            border: `1px solid ${normativaColor(n.label)}25`,
                          }}
                        />
                      ))}
                    </Stack>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={ec.label}
                        size="small"
                        sx={{
                          fontSize: '9.5px', height: '20px',
                          backgroundColor: `${ec.fg}12`, color: ec.fg,
                          border: `1px solid ${ec.fg}30`, fontWeight: 700,
                        }}
                      />
                      {bloqueado && (
                        <Tooltip title="Complete el paso anterior primero" placement="left">
                          <Box sx={{ color: '#484F58' }}><Lock size={14} /></Box>
                        </Tooltip>
                      )}
                      <ChevronRight
                        size={16}
                        style={{
                          color: '#484F58',
                          transform: expandido ? 'rotate(90deg)' : 'rotate(0)',
                          transition: 'transform 0.2s ease',
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Contenido expandido */}
                  <Collapse in={expandido && !bloqueado}>
                    <Box sx={{ px: 2.5, pb: 2.5, borderTop: '1px solid rgba(48,54,61,0.6)' }}>

                      {/* Panel normativa aplicable */}
                      <Box sx={{
                        mt: 2, p: '10px 14px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(254,207,6,0.05)',
                        border: '1px solid rgba(254,207,6,0.15)',
                        display: 'flex', alignItems: 'flex-start', gap: 1,
                      }}>
                        <Info size={14} style={{ color: '#FECF06', flexShrink: 0, marginTop: 2 }} />
                        <Box>
                          <Typography sx={{ fontSize: '10.5px', fontWeight: 700, color: '#FECF06', mb: 0.25 }}>
                            Base Legal Aplicable
                          </Typography>
                          <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                            {paso.normativas?.map(n => (
                              <Chip
                                key={n.label}
                                label={n.label}
                                size="small"
                                sx={{
                                  fontSize: '9px', height: '18px',
                                  fontFamily: 'monospace', fontWeight: 700,
                                  backgroundColor: `${normativaColor(n.label)}12`,
                                  color: normativaColor(n.label),
                                  border: `1px solid ${normativaColor(n.label)}25`,
                                }}
                              />
                            ))}
                          </Stack>
                          <Typography sx={{ fontSize: '11px', color: '#8B949E', mt: 0.75 }}>
                            {paso.action}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Tareas del paso */}
                      {paso.tareas && paso.tareas.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                          <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#FECF06', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1 }}>
                            Tareas Requeridas
                          </Typography>
                          <Stack spacing={0.5}>
                            {paso.tareas.map((t, ti) => {
                              const tareaCheck = checklist.find(c => c.stageId === paso.id && c.normativaId === `tarea_${ti}`);
                              const isChecked = tareaCheck?.checked ?? false;
                              return (
                                <Box
                                  key={ti}
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: 1,
                                    p: '8px 12px',
                                    borderRadius: '6px',
                                    backgroundColor: isChecked ? 'rgba(0,255,65,0.05)' : 'rgba(13,17,23,0.6)',
                                    border: `1px solid ${isChecked ? 'rgba(0,255,65,0.2)' : 'rgba(48,54,61,0.8)'}`,
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                    '&:hover': { borderColor: isChecked ? 'rgba(0,255,65,0.4)' : 'rgba(254,207,6,0.3)' },
                                  }}
                                  onClick={() => toggleComplianceCheck(paso.id, `tarea_${ti}`)}
                                >
                                  <Box sx={{
                                    width: 16, height: 16, borderRadius: '3px', flexShrink: 0,
                                    border: `1.5px solid ${isChecked ? '#00FF41' : 'rgba(48,54,61,0.9)'}`,
                                    backgroundColor: isChecked ? 'rgba(0,255,65,0.2)' : 'transparent',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    mt: '1px',
                                  }}>
                                    {isChecked && <CheckCircle2 size={10} style={{ color: '#00FF41' }} />}
                                  </Box>
                                  <Typography sx={{ fontSize: '12.5px', color: isChecked ? '#8B949E' : '#E6EDF3', textDecoration: isChecked ? 'line-through' : 'none', lineHeight: 1.4 }}>
                                    {t}
                                  </Typography>
                                </Box>
                              );
                            })}
                          </Stack>
                        </Box>
                      )}

                      {/* Documentos requeridos */}
                      {paso.docs && paso.docs.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                          <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#8B949E', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.75 }}>
                            Documentos a Generar
                          </Typography>
                          <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                            {paso.docs.map(doc => (
                              <Chip
                                key={doc}
                                icon={<FileText size={10} />}
                                label={doc}
                                size="small"
                                sx={{
                                  fontSize: '10px', height: '22px',
                                  backgroundColor: 'rgba(254,207,6,0.06)',
                                  color: '#FECF06',
                                  border: '1px solid rgba(254,207,6,0.2)',
                                }}
                              />
                            ))}
                          </Stack>
                        </Box>
                      )}

                      {/* Botón completar */}
                      <Box sx={{ mt: 2.5, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        {estado !== 'completado' && (
                          <Button
                            variant="contained"
                            color="secondary"
                            size="small"
                            onClick={() => handleCompletarPaso(paso.id)}
                            startIcon={<CheckCircle2 size={14} />}
                          >
                            Marcar Paso Completado
                          </Button>
                        )}
                        {estado === 'completado' && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                            <CheckCircle2 size={14} style={{ color: '#00FF41' }} />
                            <Typography sx={{ fontSize: '12px', color: '#00FF41', fontWeight: 600 }}>
                              Paso completado — log SHA-256 registrado
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Collapse>
                </Card>
              );
            })}
          </Stack>

          {/* ── Matriz de 25 controles (compacta) ──────────────────── */}
          {checklist.length > 0 && (
            <Card sx={{ p: 2.5 }}>
              <Typography component="h3" sx={{ fontSize: '14px', fontWeight: 700, color: '#FECF06', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <FileCheck size={16} />
                Matriz de {checklist.length} Controles Normativos (MUCC-2017 / ISO 27037)
              </Typography>
              <Grid container spacing={1}>
                {checklist.map((item) => (
                  <Grid key={`${item.stageId}-${item.normativaId}`} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Box
                      onClick={() => toggleComplianceCheck(item.stageId, item.normativaId)}
                      sx={{
                        p: '8px 12px',
                        borderRadius: '6px',
                        backgroundColor: item.checked ? 'rgba(0,255,65,0.06)' : 'rgba(13,17,23,0.6)',
                        border: `1px solid ${item.checked ? 'rgba(0,255,65,0.25)' : 'rgba(48,54,61,0.8)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        '&:hover': { borderColor: item.checked ? 'rgba(0,255,65,0.4)' : 'rgba(254,207,6,0.3)' },
                      }}
                    >
                      <Box sx={{
                        width: 14, height: 14, borderRadius: '3px', flexShrink: 0,
                        border: `1.5px solid ${item.checked ? '#00FF41' : 'rgba(48,54,61,0.9)'}`,
                        backgroundColor: item.checked ? 'rgba(0,255,65,0.2)' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {item.checked && <CheckCircle2 size={8} style={{ color: '#00FF41' }} />}
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontSize: '11px', fontWeight: 600, color: item.checked ? '#00FF41' : '#E6EDF3', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.normativaId}
                        </Typography>
                        <Typography sx={{ fontSize: '9px', color: '#8B949E', fontFamily: 'monospace' }}>
                          {item.stageId}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Card>
          )}
        </>
      )}
    </Box>
  );
}
