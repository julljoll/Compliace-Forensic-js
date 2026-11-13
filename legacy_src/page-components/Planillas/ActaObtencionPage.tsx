'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCMSStore } from '../../store/cmsStore';
import PlanillaPdfViewer from '../../components/organisms/Planillas/PlanillaPdfViewer';
import ActaObtencionPdf from '../../lib/pdf/documents/ActaObtencionPdf';

const ActaObtencionPage = () => {
  const searchParams = useSearchParams();
  const casoId = searchParams.get('casoId') || '';
  const { casos } = useCMSStore();
  const caso = casos.find(c => c.id === casoId);

  const [tipoEvidencia, setTipoEvidencia] = useState<'dispositivo_movil' | 'equipo_computo'>(
    caso?.tipoProyecto === 'forense_discoduro' ? 'equipo_computo' : 'dispositivo_movil'
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PlanillaPdfViewer
      title={`Acta de Obtención por Consignación — Caso #${caso?.numeroCaso || 'N/A'}`}
      caso={caso}
      document={<ActaObtencionPdf caso={caso} tipoEvidencia={tipoEvidencia} />}
      actions={
        <div className="d-flex align-items-center gap-2">
          <label htmlFor="select-tipo-evidencia" className="small fw-bold text-uppercase text-muted mb-0 d-none d-sm-inline" style={{ fontSize: '10px' }}>
            FORMATO:
          </label>
          <select
            id="select-tipo-evidencia"
            className="form-select form-select-sm fw-bold border-secondary"
            value={tipoEvidencia}
            onChange={(e) => setTipoEvidencia(e.target.value as any)}
            style={{ minWidth: '170px', fontSize: '12px', color: '#112E51', backgroundColor: '#FFFFFF' }}
          >
            <option value="dispositivo_movil">📱 Dispositivo Móvil</option>
            <option value="equipo_computo">💻 Equipo de Cómputo</option>
          </select>
        </div>
      }
    />
  );
};

export default ActaObtencionPage;
