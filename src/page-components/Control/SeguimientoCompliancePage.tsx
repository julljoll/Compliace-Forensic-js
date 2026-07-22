'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
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
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useCMSStore, EstadoPaso, TareaForense, PrioridadCaso, EstadoTarea } from '../../store/cmsStore';
import { NORMATIVAS_ETAPAS } from '../../data/normativasEtapas';
import { getPasosPorTipo } from '../../data/tiposProyecto';
import {
  ShieldCheck, Calendar, User, Info,
  CheckCircle2, Terminal,
  Shield, Lock, Camera, Smartphone, Database, FileText,
  AlertTriangle, Copy, CheckCheck, Fingerprint, Package,
  Scale, Archive, Briefcase, PlusCircle, Printer, Play,
  AlertOctagon, ClipboardList, Plus, Search, Clock, Trash2, X,
  TrendingUp, BarChart3, Pause, FileCheck
} from '../../components/atoms/AppleIcon';
import Button from '../../components/atoms/Button';

export default function SeguimientoCompliancePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const casos = useCMSStore(state => state.casos);
  const completeStep = useCMSStore(state => state.completeStep);
  const toggleComplianceCheck = useCMSStore(state => state.toggleComplianceCheck);

  const [selectedCasoId, setSelectedCasoId] = useState<string>(
    searchParams.get('casoId') || casos[0]?.id || ''
  );

  useEffect(() => {
    if (!selectedCasoId && casos.length > 0) {
      setSelectedCasoId(casos[0].id);
    }
  }, [casos, selectedCasoId]);

  const casoActivo = useMemo(() => {
    return casos.find(c => c.id === selectedCasoId) || casos[0];
  }, [casos, selectedCasoId]);

  const pasosConfig = useMemo(() => {
    if (!casoActivo || !casoActivo.tipoProyecto) return getPasosPorTipo('forense_whatsapp');
    return getPasosPorTipo(casoActivo.tipoProyecto);
  }, [casoActivo]);

  const checklist = casoActivo?.compliance_checklist || [];
  const checkedCount = checklist.filter(c => c.checked).length;
  const complianceRate = Math.min(100, Math.round((checkedCount / Math.max(checklist.length, 1)) * 100));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pb: 6 }}>
      {/* Page Header */}
      <Box sx={{ pb: 2, borderBottom: '1px solid rgba(254, 207, 6, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography component="h1" sx={{ fontSize: '24px', fontWeight: 700, color: '#00FF41', display: 'flex', alignItems: 'center', gap: 1 }}>
            <ShieldCheck size={24} style={{ color: '#FECF06' }} />
            Control & Seguimiento de Compliance Forense
          </Typography>
          <Typography sx={{ fontSize: '13px', color: '#AEAEB2', mt: 0.5 }}>
            Gating secuencial de etapas forenses, lista de chequeo normativo y verificación inmutable SHA-256.
          </Typography>
        </Box>

        {casos.length > 0 && (
          <TextField
            select
            size="small"
            value={selectedCasoId}
            onChange={(e) => setSelectedCasoId(e.target.value)}
            sx={{ minWidth: 260 }}
          >
            {casos.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.numeroCaso} — {c.titulo}
              </MenuItem>
            ))}
          </TextField>
        )}
      </Box>

      {/* Case Overview & Compliance Progress */}
      {casoActivo && (
        <Card sx={{ p: 3, borderLeft: '4px solid #FECF06' }}>
          <Grid container spacing={3} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography sx={{ fontSize: '11px', fontFamily: 'monospace', color: '#FECF06', fontWeight: 700 }}>
                EXPEDIENTE: {casoActivo.numeroCaso}
              </Typography>
              <Typography component="h2" sx={{ fontSize: '20px', fontWeight: 700, color: '#FFFFFF', my: 0.5 }}>
                {casoActivo.titulo}
              </Typography>
              <Typography sx={{ fontSize: '13px', color: '#AEAEB2' }}>
                Perito Líder: {casoActivo.peritoLider || 'Sin asignar'} · Fiscalía: {casoActivo.fiscal || 'Ministerio Público'}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF' }}>Tasa de Cumplimiento Normativo</Typography>
                <Typography sx={{ fontSize: '14px', fontWeight: 800, color: '#00FF41', fontFamily: 'monospace' }}>{complianceRate}%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={complianceRate} sx={{ height: 8, borderRadius: 4, backgroundColor: 'rgba(0, 255, 65, 0.1)', '& .MuiLinearProgress-bar': { backgroundColor: '#00FF41' } }} />
            </Grid>
          </Grid>
        </Card>
      )}

      {/* Checklist Matrix (25 Controls) */}
      {casoActivo && (
        <Card sx={{ p: 3 }}>
          <Typography component="h3" sx={{ fontSize: '18px', fontWeight: 700, color: '#FECF06', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <FileCheck size={20} /> Matriz de 25 Controles Normativos de Compliance (MUCCEF / ISO 27037)
          </Typography>

          <Grid container spacing={1.5}>
            {checklist.map((item) => (
              <Grid key={`${item.stageId}-${item.normativaId}`} size={{ xs: 12, sm: 6, md: 4 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: '8px',
                    backgroundColor: item.checked ? 'rgba(0, 255, 65, 0.05)' : 'rgba(0, 0, 0, 0.3)',
                    border: `1px solid ${item.checked ? 'rgba(0, 255, 65, 0.3)' : 'rgba(254, 207, 6, 0.15)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box sx={{ minWidth: 0, pr: 1 }}>
                    <Typography sx={{ fontSize: '12px', fontWeight: 600, color: item.checked ? '#00FF41' : '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.normativaId}
                    </Typography>
                    <Typography sx={{ fontSize: '10px', color: '#AEAEB2' }}>{item.stageId}</Typography>
                  </Box>
                  <Switch
                    size="small"
                    checked={item.checked}
                    onChange={() => toggleComplianceCheck(item.stageId, item.normativaId)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: '#00FF41' },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#00FF41' },
                    }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Card>
      )}
    </Box>
  );
}
