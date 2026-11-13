'use client';

import React, { useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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
        <div className="d-flex align-items-center gap-2">
          <label htmlFor="select-caso-auditoria" className="small fw-bold text-uppercase text-muted mb-0 d-none d-sm-inline" style={{ fontSize: '10px' }}>
            REGISTRO:
          </label>
          <select
            id="select-caso-auditoria"
            className="form-select form-select-sm font-monospace fw-bold border-secondary"
            value={casoId}
            onChange={(e) => router.push(e.target.value ? `/planillas/acta-auditoria-timeline?casoId=${e.target.value}` : '/planillas/acta-auditoria-timeline')}
            style={{ minWidth: '220px', fontSize: '12px', color: '#112E51', backgroundColor: '#FFFFFF' }}
          >
            <option value="">-- Registros Globales --</option>
            {casos.map((el) => (
              <option key={el.id} value={el.id}>
                {el.numeroCaso} - {el.titulo}
              </option>
            ))}
          </select>
        </div>
      }
    />
  );
};

export default ActaAuditoriaTimelinePage;
