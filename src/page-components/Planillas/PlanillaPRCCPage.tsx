'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PrintIcon from '@mui/icons-material/Print';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import { useCMSStore } from '../../store/cmsStore';
import './Planillas.css';
import PlanillaPRCC from '../../components/organisms/Planillas/PlanillaPRCC';
import PlanillaPdfViewer from '../../components/organisms/Planillas/PlanillaPdfViewer';
import PlanillaGatingDialog, { CampoFaltante } from '../../components/molecules/Planillas/PlanillaGatingDialog';
import { downloadPlanillaZip } from './downloadPlanillaZip';
import { generatePdfBlobFromElement, printPdfBlob } from '@/lib/pdf/planillaPdfEngine';

const PlanillaPRCCPage = () => {
  const searchParams = useSearchParams();
  const casoId = searchParams.get('casoId') || '';
  const { casos } = useCMSStore();
  const caso = casos.find(c => c.id === casoId);

  const [tabIndex, setTabIndex] = useState<number>(0);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [gatingOpen, setGatingOpen] = useState<boolean>(false);
  const [actionPending, setActionPending] = useState<'print' | 'preview' | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const camposRequeridos: CampoFaltante[] = [
    { valor: caso?.numeroPRCC, nombre: 'Número de Planilla PRCC' },
    { valor: caso?.numeroCaso, nombre: 'Número de Caso / Expediente' },
    { valor: caso?.solicitante_nombre, nombre: 'Nombre del Consignante' },
    { valor: caso?.solicitante_cedula, nombre: 'Cédula del Consignante' },
    { valor: caso?.peritoLider, nombre: 'Nombre del Perito Forense' },
  ];

  const faltantes = camposRequeridos.filter(f => !f.valor || f.valor === 'N/A' || !f.valor.trim());

  const handleCompilePdf = async () => {
    const el = document.querySelector('.planilla-container .page') as HTMLElement;
    if (!el) return;
    setIsGenerating(true);
    try {
      const blob = await generatePdfBlobFromElement(el, `Planilla_PRCC_${caso?.numeroCaso || 'EXP'}`);
      setPdfBlob(blob);
      setTabIndex(1);
    } catch (err) {
      console.error('Error generando PDF:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const executeAction = (action: 'print' | 'preview') => {
    if (action === 'print') {
      if (pdfBlob) {
        printPdfBlob(pdfBlob);
      } else {
        const container = document.querySelector('.planilla-container');
        if (container) container.classList.add('modo-vista-previa');
        window.print();
      }
    } else if (action === 'preview') {
      handleCompilePdf();
    }
  };

  const handleTriggerAction = (action: 'print' | 'preview') => {
    if (faltantes.length > 0) {
      setActionPending(action);
      setGatingOpen(true);
    } else {
      executeAction(action);
    }
  };

  const handleDownloadZip = () => {
    downloadPlanillaZip(
      `Planilla_PRCC_${caso?.numeroCaso || 'EXP'}`,
      'Planilla del Registro de Cadena de Custodia (PRCC) — SHA256.US'
    );
  };

  return (
    <div className="planilla-container">
      {/* BARRA SUPERIOR CYBER-LEGAL BLUEPRINT */}
      <Box className="no-print" sx={{ width: '100%', maxWidth: '216mm', mb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            backgroundColor: '#1E1800',
            border: '1px solid rgba(254, 207, 6, 0.3)',
            borderRadius: '8px 8px 0 0',
            px: 2,
            py: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PictureAsPdfIcon sx={{ color: '#FECF06' }} />
            <span style={{ color: '#FECF06', fontWeight: 700, fontSize: '13px' }}>
              Planilla del Registro de Cadena de Custodia (PRCC - ISO 27037)
            </span>
          </Box>

          <Tabs
            value={tabIndex}
            onChange={(_, newValue) => setTabIndex(newValue)}
            sx={{
              minHeight: '36px',
              '& .MuiTab-root': {
                minHeight: '36px',
                color: '#AEAEB2',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'none',
                px: 2,
                '&.Mui-selected': { color: '#FECF06' },
              },
              '& .MuiTabs-indicator': { backgroundColor: '#FECF06' },
            }}
          >
            <Tab icon={<DescriptionIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Vista Web (DOM)" />
            <Tab icon={<PictureAsPdfIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Vista Previa react-pdf" />
          </Tabs>
        </Box>

        {/* ACCIONES Y DESCARGAS */}
        <Box
          sx={{
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(254, 207, 6, 0.2)',
            borderTop: 'none',
            borderRadius: '0 0 8px 8px',
            p: 1.5,
            gap: 1.5,
            flexWrap: 'wrap',
          }}
        >
          <Button
            variant="outlined"
            size="small"
            startIcon={<FolderZipIcon />}
            onClick={handleDownloadZip}
            sx={{
              color: '#00FF41',
              borderColor: 'rgba(0, 255, 65, 0.4)',
              fontWeight: 700,
              fontSize: '11px',
              '&:hover': { borderColor: '#00FF41', backgroundColor: 'rgba(0, 255, 65, 0.12)' },
            }}
          >
            DESCARGAR ZIP (HTML+DOC+PDF)
          </Button>

          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<PictureAsPdfIcon />}
              onClick={() => handleTriggerAction('preview')}
              sx={{
                color: '#FECF06',
                borderColor: 'rgba(254, 207, 6, 0.4)',
                fontWeight: 700,
                fontSize: '11px',
                '&:hover': { borderColor: '#FECF06', backgroundColor: 'rgba(254, 207, 6, 0.15)' },
              }}
            >
              COMPILAR VISTA PREVIA PDF
            </Button>

            <Button
              variant="contained"
              size="small"
              startIcon={<PrintIcon />}
              onClick={() => handleTriggerAction('print')}
              sx={{
                backgroundColor: '#FECF06',
                color: '#000000',
                fontWeight: 700,
                fontSize: '11px',
                '&:hover': { backgroundColor: '#e0b700' },
              }}
            >
              IMPRIMIR (OFICIO 216x330mm)
            </Button>
          </Box>
        </Box>
      </Box>

      {/* CONTENIDO PRINCIPAL: DOM O REACT-PDF */}
      {tabIndex === 0 ? (
        <PlanillaPRCC caso={caso} />
      ) : (
        <PlanillaPdfViewer
          pdfBlob={pdfBlob}
          title={`Planilla PRCC — Caso #${caso?.numeroCaso || 'N/A'}`}
          onRefresh={handleCompilePdf}
          isGenerating={isGenerating}
        />
      )}

      {/* GATING VALIDATOR DIALOG */}
      <PlanillaGatingDialog
        open={gatingOpen}
        onClose={() => setGatingOpen(false)}
        onConfirmProceed={() => {
          if (actionPending) executeAction(actionPending);
        }}
        camposFaltantes={faltantes}
        nombrePlanilla="Planilla del Registro de Cadena de Custodia (PRCC)"
      />
    </div>
  );
};

export default PlanillaPRCCPage;
