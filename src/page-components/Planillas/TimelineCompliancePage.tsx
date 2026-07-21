'use client';

import React, { useMemo, useEffect, useState } from 'react';
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
import { getTipoProyectoConfig } from '../../data/tiposProyecto';
import type { CasoCMS, StepState } from '../../store/cmsStore';
import './Planillas.css';
import PlanillaPdfViewer from '../../components/organisms/Planillas/PlanillaPdfViewer';
import PlanillaGatingDialog, { CampoFaltante } from '../../components/molecules/Planillas/PlanillaGatingDialog';
import { downloadPlanillaZip } from './downloadPlanillaZip';
import { generatePdfBlobFromElement, printPdfBlob } from '@/lib/pdf/planillaPdfEngine';

// ── Helpers ──────────────────────────────────────────────────────────────────

const ESTADO_PASO: Record<string, { label: string; symbol: string }> = {
  completado:  { label: 'Completado',  symbol: '✓' },
  en_progreso: { label: 'En Progreso', symbol: '◉' },
  disponible:  { label: 'Pendiente',   symbol: '○' },
  bloqueado:   { label: 'Bloqueado',   symbol: '✗' },
};

const TIPO_LABEL: Record<string, string> = {
  forense_whatsapp:  'Análisis Forense Móvil Android (WhatsApp)',
  forense_email:     'Análisis Forense de Correo Electrónico',
  forense_discoduro: 'Análisis Forense de Computadora / Disco Duro',
};

function formatFecha(f?: string) {
  if (!f) return '—';
  try {
    return new Date(f).toLocaleDateString('es-VE', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return f;
  }
}

export default function TimelineCompliancePage() {
  const params = useSearchParams();
  const casoId   = params.get('casoId');
  const { casos } = useCMSStore();

  const [tabIndex, setTabIndex] = useState<number>(0);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [gatingOpen, setGatingOpen] = useState<boolean>(false);
  const [actionPending, setActionPending] = useState<'print' | 'preview' | null>(null);

  const caso: CasoCMS | undefined = useMemo(
    () => (casoId ? casos.find(c => c.id === casoId) : undefined),
    [casoId, casos]
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!caso) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: "'Times New Roman', Times, serif" }}>
        <p style={{ fontSize: '18px', fontWeight: 700 }}>Expediente no encontrado</p>
        <p style={{ color: '#888', marginTop: '8px' }}>
          Use el módulo de Auditoría para seleccionar un caso e imprimir su línea de tiempo.
        </p>
      </div>
    );
  }

  const config = getTipoProyectoConfig(caso.tipoProyecto);
  const steps  = caso.steps || {};

  const faseStats = config.fases.map(fase => {
    const pasos = config.pasos.filter(p => fase.pasoIds.includes(p.id));
    const completados = pasos.filter(p => steps[p.id]?.estado === 'completado').length;
    return { ...fase, pasos, completados, total: pasos.length };
  });

  const totalPasos       = config.pasos.length;
  const totalCompletados = config.pasos.filter(p => steps[p.id]?.estado === 'completado').length;
  const pct              = totalPasos > 0 ? Math.round((totalCompletados / totalPasos) * 100) : 0;

  const camposRequeridos: CampoFaltante[] = [
    { valor: caso?.numeroCaso, nombre: 'Número de Caso / Expediente' },
    { valor: caso?.titulo, nombre: 'Título del Caso' },
    { valor: caso?.peritoLider, nombre: 'Nombre del Perito Forense' },
  ];

  const faltantes = camposRequeridos.filter(f => !f.valor || f.valor === 'N/A' || !f.valor.trim());

  const handleCompilePdf = async () => {
    const el = document.querySelector('.planilla-container .page') as HTMLElement;
    if (!el) return;
    setIsGenerating(true);
    try {
      const blob = await generatePdfBlobFromElement(el, `Timeline_Compliance_${caso?.numeroCaso || 'EXP'}`);
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
      `Timeline_Compliance_${caso?.numeroCaso || 'EXP'}`,
      'Informe de Trazabilidad y Cadena de Custodia Compliance — SHA256.US'
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
              Informe de Trazabilidad y Cadena de Custodia Compliance (ISO 27037)
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
        <div className="page">
          {/* ENCABEZADO OFICIAL */}
          <header>
            <div className="logo-container">
              <div className="logo-branding">
                <img src="/logo.png" alt="SHA256.US Logo" className="logo-img" />
                <span className="logo-text">SHA256.US</span>
              </div>
              <span className="logo-subtext">Laboratorio de Informática Forense &amp; Ciberseguridad</span>
              <span className="address-text">
                Avenida 6, con calle 7, Edificio Mercantil La Ceiba, primer piso, oficina N° 8, Quíbor, Municipio Jiménez del Estado Lara.
              </span>
            </div>

            <div className="acta-header">
              <h1 className="acta-title">INFORME DE TRAZABILIDAD Y COMPLIANCE FORENSE</h1>
              <div className="acta-subtitle">SEGUIMIENTO DE ETAPAS Y CADENA DE CUSTODIA</div>
              <div className="acta-nro">
                N° EXPEDIENTE: <span className="box-inline" style={{ minWidth: '130px', fontWeight: 'bold' }}>{caso.numeroCaso}</span>
              </div>
            </div>
          </header>

          {/* ── DATOS DEL EXPEDIENTE ── */}
          <div className="section">
            <div className="section-title">I. Identificación del Expediente Auditado</div>
            <table className="tabla-datos">
              <tbody>
                <tr>
                  <td style={{ width: '28%', fontWeight: 'bold' }}>N° Caso / Expediente:</td>
                  <td style={{ fontWeight: 'bold' }}>{caso.numeroCaso}</td>
                  <td style={{ width: '22%', fontWeight: 'bold' }}>Tipo de Análisis:</td>
                  <td>{TIPO_LABEL[caso.tipoProyecto] || caso.tipoProyecto}</td>
                </tr>
                <tr>
                  <td>Título del Caso:</td>
                  <td colSpan={3}>{caso.titulo}</td>
                </tr>
                <tr>
                  <td>Perito Responsable:</td>
                  <td>{caso.peritoLider || '—'}</td>
                  <td>Consignante / Solicitante:</td>
                  <td>{caso.solicitante_nombre || '—'} (C.I. {caso.solicitante_cedula || '—'})</td>
                </tr>
                <tr>
                  <td>Fecha de Registro:</td>
                  <td>{formatFecha(caso.fechaCreacion)}</td>
                  <td>Avance Global:</td>
                  <td style={{ fontWeight: 'bold' }}>{pct}% ({totalCompletados} de {totalPasos} pasos)</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ── MATRIZ DE FASES ── */}
          <div className="section">
            <div className="section-title">II. Matriz de Fases y Pasos del Protocolo Forense</div>
            <table className="tabla-datos" style={{ marginBottom: '14px' }}>
              <thead>
                <tr style={{ background: '#f2f2f7', textAlign: 'center' }}>
                  <th style={{ width: '50px' }}>Fase</th>
                  <th>Denominación de la Fase Protocolar</th>
                  <th style={{ width: '100px' }}>Pasos Total</th>
                  <th style={{ width: '100px' }}>Completados</th>
                  <th style={{ width: '90px' }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {faseStats.map(f => {
                  const estFase = f.completados === f.total ? 'Completada' : f.completados > 0 ? 'En Proceso' : 'Pendiente';
                  return (
                    <tr key={f.orden} style={{ textAlign: 'center' }}>
                      <td style={{ fontWeight: 'bold' }}>{f.orden}</td>
                      <td style={{ textAlign: 'left', fontWeight: '600' }}>{f.nombre}</td>
                      <td>{f.total}</td>
                      <td style={{ fontWeight: 'bold' }}>{f.completados} / {f.total}</td>
                      <td>
                        <span style={{
                          fontSize: '9px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '3px',
                          background: f.completados === f.total ? '#e6f4ea' : f.completados > 0 ? '#fef7e0' : '#f1f3f4',
                          color: f.completados === f.total ? '#137333' : f.completados > 0 ? '#b06000' : '#5f6368',
                        }}>
                          {estFase}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* PASOS DETALLADOS POR FASE */}
            {faseStats.map(fase => (
              <div key={fase.orden} style={{ marginBottom: '16px' }}>
                <div style={{
                  fontSize: '10px', fontWeight: 'bold', background: '#e5e5ea',
                  padding: '4px 8px', borderLeft: '3px solid #1d1d1f', marginBottom: '6px'
                }}>
                  Fase {fase.orden}: {fase.nombre}
                </div>

                {fase.pasos.map(paso => {
                  const stepState: StepState = steps[paso.id] || { estado: 'bloqueado' };
                  const cfg = ESTADO_PASO[stepState.estado] || { label: stepState.estado, symbol: '?' };
                  return (
                    <div key={paso.id} style={{
                      border: '0.5px solid #d2d2d7', borderRadius: '4px',
                      padding: '8px 10px', marginBottom: '6px', fontSize: '9.5px', background: '#fafafa'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                        <span style={{ fontWeight: 'bold' }}>Paso {paso.num}: {paso.titulo}</span>
                        <span style={{
                          fontSize: '9px', fontWeight: 'bold', padding: '1px 6px', borderRadius: '3px',
                          background: stepState.estado === 'completado' ? '#e6f4ea' : stepState.estado === 'en_progreso' ? '#fef7e0' : '#f1f3f4',
                          color: stepState.estado === 'completado' ? '#137333' : stepState.estado === 'en_progreso' ? '#b06000' : '#5f6368',
                        }}>
                          {cfg.symbol} {cfg.label}
                        </span>
                      </div>
                      <div style={{ color: '#515154', fontSize: '9px', marginBottom: '4px' }}>
                        {paso.action}
                      </div>

                      {stepState.responsable && (
                        <div style={{ fontSize: '8.5px', color: '#1d1d1f', marginTop: '2px' }}>
                          ✓ Completado por: <strong>{stepState.responsable}</strong> · {formatFecha(stepState.fechaCompletado)}
                        </div>
                      )}
                      {stepState.observaciones && (
                        <div style={{ fontSize: '8.5px', color: '#515154', fontStyle: 'italic', marginTop: '2px' }}>
                          Observaciones: "{stepState.observaciones}"
                        </div>
                      )}

                      {paso.normativas && paso.normativas.length > 0 && (
                        <div style={{ display: 'flex', gap: '4px', marginTop: '4px', flexWrap: 'wrap' }}>
                          {paso.normativas.map(n => (
                            <span key={n.label} style={{
                              fontSize: '8px', background: '#f2f2f7', color: '#1d1d1f',
                              padding: '1px 5px', borderRadius: '3px', border: '0.5px solid #d2d2d7',
                              fontWeight: '600'
                            }}>
                              {n.label}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* ── FIRMAS Y VALIDACIÓN PERICIAL ── */}
          <div className="section" style={{ pageBreakInside: 'avoid', marginTop: '30px' }}>
            <div className="section-title">III. Certificación Pericial y Firmas de Responsabilidad</div>
            <div style={{ fontSize: '10px', color: '#515154', marginBottom: '20px', textAlign: 'justify', lineHeight: '1.4' }}>
              Certifico que la presente Línea de Tiempo de Compliance Forense refleja fielmente el estado, secuencia y trazabilidad inmutable de las operaciones realizadas sobre la evidencia digital asignada al Expediente N° <strong>{caso.numeroCaso}</strong>, bajo estricto cumplimiento de los estándares ISO/IEC 27037:2012, NIST SP 800-86 y el Manual Único de Cadena de Custodia (MUCC-2017).
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: '40px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ borderBottom: '1px solid #1d1d1f', height: '40px', marginBottom: '6px' }} />
                <div style={{ fontSize: '11px', fontWeight: 'bold' }}>{caso.peritoLider || '__________________________'}</div>
                <div style={{ fontSize: '9px', color: '#515154' }}>PERITO FORENSE LÍDER</div>
                <div style={{ fontSize: '8px', color: '#8e8e93' }}>Firma y Sello</div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ borderBottom: '1px solid #1d1d1f', height: '40px', marginBottom: '6px' }} />
                <div style={{ fontSize: '11px', fontWeight: 'bold' }}>{caso.fiscal || '__________________________'}</div>
                <div style={{ fontSize: '9px', color: '#515154' }}>FISCALÍA / REQUISITORIO</div>
                <div style={{ fontSize: '8px', color: '#8e8e93' }}>Recibido Conformidad</div>
              </div>
            </div>
          </div>

          {/* Pie de página institucional */}
          <footer style={{ marginTop: '30px', borderTop: '1px solid #d2d2d7', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '8px', color: '#8e8e93' }}>
            <span>SHA256.US — Laboratorio de Informática Forense y Ciberseguridad</span>
            <span>Formato Oficial Compliance · Impreso el {new Date().toLocaleDateString('es-VE')}</span>
          </footer>
        </div>
      ) : (
        <PlanillaPdfViewer
          pdfBlob={pdfBlob}
          title={`Timeline Compliance — Caso #${caso.numeroCaso}`}
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
        nombrePlanilla="Informe de Trazabilidad y Compliance Forense"
      />
    </div>
  );
}
