import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCMSStore } from '../../store/cmsStore';
import './Planillas.css';
import { downloadPlanillaZip } from './downloadPlanillaZip';
import PlanillaToolbar from '../../components/molecules/PlanillaToolbar';
import ActaEntrevista from '../../components/organisms/Planillas/ActaEntrevista';

const ActaEntrevistaPage = () => {
  const searchParams = useSearchParams();
  const casoId = searchParams.get('casoId') || '';
  const { casos } = useCMSStore();
  const caso = casos.find(c => c.id === casoId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const camposRequeridos = [
    { valor: caso?.numeroCaso, nombre: 'Número de Caso / Expediente' },
    { valor: caso?.solicitante_nombre, nombre: 'Nombre del Entrevistado' },
    { valor: caso?.solicitante_cedula, nombre: 'Cédula del Entrevistado' },
    { valor: caso?.peritoLider, nombre: 'Nombre del Perito Forense' },
  ];

  const handlePrint = () => {
    const faltantes = camposRequeridos.filter(f => !f.valor || f.valor === 'N/A' || !f.valor.trim());
    if (faltantes.length > 0) {
      const confirmar = window.confirm(
        `Campos incompletos en el expediente:\n${faltantes.map(f => `• ${f.nombre}`).join('\n')}\n\n¿Desea proceder con la impresión para llenarla a mano?`
      );
      if (!confirmar) return;
    }
    window.print();
  };

  const casoNum = caso?.numeroCaso || 'caso';

  return (
    <div className="planilla-container">
      <div className="no-print planilla-pdf-topbar">
        <span className="material-icons-outlined topbar-icon">picture_as_pdf</span>
        <span className="topbar-title">Acta de Entrevista de Testigo / Víctima</span>
        <span className="topbar-meta">Formato Oficio · SHA256.US · ISO 27037</span>
      </div>
      <ActaEntrevista caso={caso} />

      <PlanillaToolbar
        onPrint={handlePrint}
        onDownloadZip={() => downloadPlanillaZip(`ActaEntrevista_${casoNum}`, 'Acta de Entrevista Forense')}
        tituloDocumento="Acta de Entrevista de Testigo / Víctima"
        camposRequeridos={camposRequeridos}
        casoId={casoId}
      />
    </div>
  );
};

export default ActaEntrevistaPage;
