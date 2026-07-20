import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import PrintIcon from '@mui/icons-material/Print';
import { useCMSStore } from '../../store/cmsStore';
import './Planillas.css';
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
    const container = document.querySelector('.planilla-container');
    if (container) {
      container.classList.add('modo-vista-previa');
    }
    window.print();
  };

  return (
    <div className="planilla-container">
      <div className="no-print planilla-pdf-topbar">
        <span className="material-icons-outlined topbar-icon">picture_as_pdf</span>
        <span className="topbar-title">Acta de Entrevista de Testigo / Víctima</span>
        <span className="topbar-meta">Formato Oficio · SHA256.US · ISO 27037</span>
      </div>
      <ActaEntrevista caso={caso} />

      <Box className="no-print" sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          sx={{
            backgroundColor: '#FECF06',
            color: '#000000',
            fontWeight: 700,
            fontSize: '13px',
            px: 4,
            py: 1.2,
            borderRadius: '8px',
            boxShadow: '0 4px 14px rgba(254, 207, 6, 0.35)',
            '&:hover': {
              backgroundColor: '#e0b700',
              boxShadow: '0 6px 20px rgba(254, 207, 6, 0.5)',
            },
          }}
        >
          IMPRIMIR PLANILLA COMPLETA (TAMAÑO OFICIO)
        </Button>
      </Box>
    </div>
  );
};

export default ActaEntrevistaPage;
