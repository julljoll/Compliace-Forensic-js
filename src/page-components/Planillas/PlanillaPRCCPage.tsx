import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCMSStore } from '../../store/cmsStore';
import './Planillas.css';
import { downloadPlanillaZip } from './downloadPlanillaZip';
import PlanillaToolbar from '../../components/molecules/PlanillaToolbar';
import PlanillaPRCC from '../../components/organisms/Planillas/PlanillaPRCC';

const PlanillaPRCCPage = () => {
  const searchParams = useSearchParams();
  const casoId = searchParams.get('casoId') || '';
  const { casos } = useCMSStore();
  const caso = casos.find(c => c.id === casoId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const camposRequeridos = [
    { valor: caso?.numeroPRCC, nombre: 'Número de Planilla PRCC' },
    { valor: caso?.numeroCaso, nombre: 'Número de Caso / Expediente' },
    { valor: caso?.solicitante_nombre, nombre: 'Nombre del Consignante' },
    { valor: caso?.solicitante_cedula, nombre: 'Cédula del Consignante' },
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
        <span className="topbar-title">Planilla de Registro de Cadena de Custodia (PRCC)</span>
        <span className="topbar-meta">Formato Oficio · SHA256.US · MUCC-2017</span>
      </div>
      <PlanillaPRCC caso={caso} />

      <div className="no-print" style={{ display: 'flex', justifyContent: 'center', marginTop: '24px', marginBottom: '24px' }}>
        <button
          type="button"
          onClick={handlePrint}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 24px',
            backgroundColor: '#FECF06',
            color: '#000000',
            border: 'none',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
          }}
        >
          🖨️ Imprimir Planilla
        </button>
      </div>

      <PlanillaToolbar
        onPrint={handlePrint}
        onDownloadZip={() => downloadPlanillaZip(`PRCC_${casoNum}`, 'Planilla de Registro de Cadena de Custodia')}
        tituloDocumento="Planilla de Registro de Cadena de Custodia (PRCC)"
        camposRequeridos={camposRequeridos}
        casoId={casoId}
      />
    </div>
  );
};

export default PlanillaPRCCPage;
