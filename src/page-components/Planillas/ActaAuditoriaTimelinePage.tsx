'use client';

import React, { useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useCMSStore } from '../../store/cmsStore';
import { useAuditStore } from '../../store/auditStore';
import PlanillaPdfViewer from '../../components/organisms/Planillas/PlanillaPdfViewer';
import ActaAuditoriaTimelinePdf from '../../lib/pdf/documents/ActaAuditoriaTimelinePdf';

const ActaAuditoriaTimelinePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const casoId = searchParams.get('casoId') || '';
  const { casos } = useCMSStore();
  const storeLogs = useAuditStore(state => state.logs);
  const loadStoreLogs = useAuditStore(state => state.loadLogs);

  const caso = casos.find(c => c.id === casoId);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadStoreLogs();
  }, [loadStoreLogs]);

  const SESSION_ACTIONS = new Set(['INICIO_SESION', 'SISTEMA_INICIADO', 'SESION_CERRADA']);

  const logsDelCaso = useMemo(() => {
    return storeLogs
      .filter(log => {
        if (SESSION_ACTIONS.has(log.accion)) return false;
        return !casoId || log.casoId === casoId;
      })
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [storeLogs, casoId]);

  return (
    <PlanillaPdfViewer
      title={`Acta de Auditoría y Hash Chain — Caso #${caso?.numeroCaso || 'GLOBAL'}`}
      document={<ActaAuditoriaTimelinePdf caso={caso} logs={logsDelCaso} />}
      actions={
        <TextField
          select
          size="small"
          value={casoId}
          onChange={(e) => router.push(e.target.value ? `/planillas/acta-auditoria-timeline?casoId=${e.target.value}` : '/planillas/acta-auditoria-timeline')}
          sx={{
            minWidth: 220,
            backgroundColor: '#2A2100',
            borderRadius: '6px',
            '& .MuiOutlinedInput-root': {
              color: '#FECF06',
              fontSize: '12px',
              fontWeight: 700,
              '& fieldset': { borderColor: 'rgba(254, 207, 6, 0.4)' },
            },
          }}
        >
          <MenuItem value="">-- Registros Globales --</MenuItem>
          {casos.map((el) => (
            <MenuItem key={el.id} value={el.id}>
              {el.numeroCaso} - {el.titulo}
            </MenuItem>
          ))}
        </TextField>
      }
    />
  );
};

export default ActaAuditoriaTimelinePage;
