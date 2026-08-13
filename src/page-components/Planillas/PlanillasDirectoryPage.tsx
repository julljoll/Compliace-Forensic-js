'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCMSStore } from '../../store/cmsStore';
import { FileText, ChevronRight } from '../../components/atoms/AppleIcon';

interface PlanillaInfo {
  id: string;
  paso: string;
  nombre: string;
  descripcion: string;
  ruta: string;
  normativas: string[];
  isNew?: boolean;
}

interface EtapaLegal {
  etapaNumero: number;
  etapaNombre: string;
  etapaDesc: string;
  color: string;
  planillas: PlanillaInfo[];
}

const ETAPAS_LEGALES: EtapaLegal[] = [
  {
    etapaNumero: 1,
    etapaNombre: 'ETAPA 1: Consignación & Consentimiento Informado',
    etapaDesc: 'Fase de Adquisición Privada Voluntaria y Deslinde de Responsabilidad Legítima',
    color: '#D9A700',
    planillas: [
      {
        id: 'acta-obtencion',
        paso: '1.1',
        nombre: 'Acta de Obtención por Consignación Voluntaria',
        descripcion: 'Formaliza la entrega voluntaria del dispositivo móvil o equipo de cómputo con inventario físico, seriales, IMEI y pauta escrita de estado.',
        ruta: '/planillas/acta-obtencion',
        normativas: ['MUCC-2017 Fase 1', 'ISO/IEC 27037 Sec. 6', 'COPP Art. 186', 'NIST SP 800-101'],
      },
      {
        id: 'acta-consentimiento',
        paso: '1.2',
        nombre: 'Acta de Consentimiento Informado & Hábeas Data',
        descripcion: 'Declaración jurada de legitimación de posesión, autorización explícita de inspección técnica, Hábeas Data y exención de responsabilidad.',
        ruta: '/planillas/acta-consentimiento',
        normativas: ['CRBV Arts. 28 y 60', 'LMD FE Arts. 4 y 6', 'ISO 27701'],
        isNew: true,
      },
    ],
  },
  {
    etapaNumero: 2,
    etapaNombre: 'ETAPA 2: Custodia & Laboratorio Forense',
    etapaDesc: 'Fase de Trazabilidad Ininterrumpida, Resguardo RF e Inspección en Cámara',
    color: '#008837',
    planillas: [
      {
        id: 'prcc',
        paso: '2.1',
        nombre: 'Planilla de Registro de Cadena de Custodia (PRCC)',
        descripcion: 'Registro inmutable de traspasos, custodios, almacenamiento en bóveda privada, precintos holográficos y trazabilidad de hashes SHA-256.',
        ruta: '/planillas/prcc',
        normativas: ['MUCC-2017 Control', 'COPP Art. 187', 'ISO 27037 Sec. 7', 'RFC 3161'],
      },
      {
        id: 'acta-desprecintado',
        paso: '2.2',
        nombre: 'Acta de Apertura y Desprecintado en Laboratorio',
        descripcion: 'Verificación formal de integridad de la bolsa Faraday y remoción del precinto ante el perito analista y estación Write-Blocker.',
        ruta: '/planillas/acta-desprecintado',
        normativas: ['MUCC Fase 2', 'ISO/IEC 27037 Sec. 7.2', 'COPP Art. 187'],
        isNew: true,
      },
      {
        id: 'acta-entrevista',
        paso: '2.3',
        nombre: 'Acta de Entrevista Técnico-Pericial Privada',
        descripcion: 'Declaración de contexto forense, credenciales de acceso facilitadas bajo reserva (PIN/Claves) y origen de conversaciones WhatsApp.',
        ruta: '/planillas/acta-entrevista',
        normativas: ['COPP Art. 153', 'MUCC-2017 Entrevista', 'Redacción Forense'],
      },
    ],
  },
  {
    etapaNumero: 3,
    etapaNombre: 'ETAPA 3: Análisis Técnico & Certificación Pericial',
    etapaDesc: 'Fase de Peritaje Criptográfico, Verificación Causal y Emisión de Dictamen de 8 Folios',
    color: '#005EA2',
    planillas: [
      {
        id: 'acta-auditoria-timeline',
        paso: '3.1',
        nombre: 'Timeline & Record de Auditoría Criptográfica SHA-256',
        descripcion: 'Certificación de inmutabilidad criptográfica SHA-256 de los logs de auditoría, cronología MACB y trazabilidad de eventos.',
        ruta: '/planillas/acta-auditoria-timeline',
        normativas: ['ISO 27037 Anexo B', 'RFC 3161 Timestamping', 'Hash Chain SHA-256'],
      },
      {
        id: 'dictamen-imagenes',
        paso: '3.2 (a)',
        nombre: 'Dictamen Pericial — Análisis de Imágenes Digitales (8 Folios)',
        descripcion: 'Informe técnico especializado de 8 folios con análisis ELA (PhotoHolmes Engine), Copy-Move Grid NCC, JPEG Ghost y EXIF.',
        ruta: '/planillas/dictamen?tipo=imagenes',
        normativas: ['ISO/IEC 27042:2015', 'PhotoHolmes ELA Engine', 'Daubert Standard / FRE 702'],
        isNew: true,
      },
      {
        id: 'dictamen-audios',
        paso: '3.2 (b)',
        nombre: 'Dictamen Pericial — Análisis de Audios / WhatsApp (8 Folios)',
        descripcion: 'Informe técnico de 8 folios para validación espectrográfica de frecuencia (48 kHz), decodificación Opus (PyOgg Engine) y formantes F0-F3.',
        ruta: '/planillas/dictamen?tipo=audios',
        normativas: ['ISO/IEC 27042:2015', 'PyOgg Audio Engine', 'WhatsApp Opus 48kHz'],
        isNew: true,
      },
      {
        id: 'dictamen-general',
        paso: '3.3',
        nombre: 'Dictamen Pericial Informático Forense General',
        descripcion: 'Informe pericial marco de 4 a 8 folios para investigaciones generales de dispositivos con juramento, hallazgos y dictamen probatorio.',
        ruta: '/planillas/dictamen',
        normativas: ['COPP Arts. 223-225', 'LMD FE Art. 4', 'ISO 27042'],
      },
    ],
  },
  {
    etapaNumero: 4,
    etapaNombre: 'ETAPA 4: Sanitización, Cierre & Devolución Criptográfica',
    etapaDesc: 'Fase de Cierre Procesal, Restitución de Equipos y Destrucción Segura de Copias de Trabajo',
    color: '#C05621',
    planillas: [
      {
        id: 'acta-sanitizacion',
        paso: '4.1',
        nombre: 'Acta de Sanitización y Borrado Seguro de Servidor',
        descripcion: 'Certificado de eliminación irreversible (Zeroization / Crypto-Erase) de las imágenes forenses de trabajo temporales en laboratorio.',
        ruta: '/planillas/acta-sanitizacion',
        normativas: ['NIST SP 800-88 Rev. 1', 'ISO/IEC 27001 Sec. A.8.10', 'MUCC-2017 Cierre'],
        isNew: true,
      },
      {
        id: 'entrega-resultados',
        paso: '4.2',
        nombre: 'Acta de Entrega de Resultados y Devolución de Evidencia',
        descripcion: 'Restitución del dispositivo consignado al cliente, entrega del dictamen físico/digital y verificación de Hash SHA-256 al Cierre (MATCH ✓).',
        ruta: '/planillas/entrega-resultados',
        normativas: ['MUCC-2017 Cierre', 'ISO/IEC 27037 Sec. 8', 'COPP Art. 187'],
      },
      {
        id: 'planilla-evaluacion-ux',
        paso: '4.3',
        nombre: 'Planilla de Evaluación y Auditoría UX/UI Forense',
        descripcion: 'Instrumento pericial de autoevaluación Likert (1-5) para validar la usabilidad, amigabilidad y velocidad de llenado de planillas locales en Peritos, Abogados y Jueces.',
        ruta: '/planillas/evaluacion-ux',
        normativas: ['USWDS 3.0', 'DC3 Cyber Forensics', 'ISO/IEC 27037', 'NIST SP 800-86'],
        isNew: true,
      },
    ],
  },
];

export default function PlanillasDirectoryPage() {
  const { casos } = useCMSStore();
  const [selectedCasoId, setSelectedCasoId] = useState<string>('');

  return (
    <div className="container-fluid p-3 p-md-4 min-vh-100" style={{ backgroundColor: '#F0F4F8', color: '#1B2A4A' }}>
      {/* Header institucional */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4 p-3 bg-white border rounded-3 shadow-sm">
        <div>
          <h1 className="h4 fw-bold mb-1 d-flex align-items-center gap-2" style={{ color: '#112E51' }}>
            <FileText size={28} className="text-primary" />
            Directorio Oficial de Planillas Forenses
          </h1>
          <p className="text-secondary small mb-0">
            Sistema de documentación legal-forense estructurado en 4 etapas procesales secuenciales conforme al MUCC, COPP, ISO 27037 y LMD FE.
          </p>
        </div>

        {/* Filtro de Caso Activo */}
        <div style={{ minWidth: '280px' }}>
          <label htmlFor="select-caso" className="form-label small fw-bold text-uppercase mb-1" style={{ color: '#005EA2', fontSize: '11px' }}>
            Caso Forense Asociado
          </label>
          <select
            id="select-caso"
            className="form-select form-select-sm border-secondary shadow-sm fw-semibold"
            value={selectedCasoId}
            onChange={(e) => setSelectedCasoId(e.target.value)}
            style={{ fontSize: '13px', backgroundColor: '#FFFFFF' }}
          >
            <option value="">-- Ninguno (Ver plantillas generales) --</option>
            {casos.map(c => (
              <option key={c.id} value={c.id}>
                Caso #{c.numeroCaso} — {c.titulo || c.tipoProyecto}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid de 4 Etapas Legales */}
      <div className="d-flex flex-column gap-4">
        {ETAPAS_LEGALES.map((etapa) => (
          <div key={etapa.etapaNumero} className="usa-card bg-white p-3 p-md-4 border rounded-3 shadow-sm">
            {/* Encabezado de Etapa */}
            <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom" style={{ borderBottomColor: etapa.color }}>
              <div className="d-flex align-items-center gap-2">
                <div
                  className="d-flex align-items-center justify-content-center fw-bold rounded-2 text-white"
                  style={{ width: '36px', height: '36px', backgroundColor: etapa.color, fontSize: '14px' }}
                >
                  E{etapa.etapaNumero}
                </div>
                <div>
                  <h2 className="h6 fw-bold mb-0" style={{ color: '#112E51' }}>
                    {etapa.etapaNombre}
                  </h2>
                  <span className="text-secondary small" style={{ fontSize: '12px' }}>
                    {etapa.etapaDesc}
                  </span>
                </div>
              </div>

              <span className="usa-tag usa-tag--info fw-bold" style={{ fontSize: '11px' }}>
                {etapa.planillas.length} Planillas Oficiales
              </span>
            </div>

            {/* Tarjetas de Planillas dentro de la Etapa */}
            <div className="row g-3">
              {etapa.planillas.map((p) => (
                <div key={p.id} className={etapa.planillas.length === 3 ? 'col-12 col-md-4' : 'col-12 col-md-6'}>
                  <div className="card h-100 border rounded-3 shadow-sm d-flex flex-column justify-content-between p-3" style={{ backgroundColor: '#FFFFFF' }}>
                    <div>
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="fw-bold font-monospace small" style={{ color: etapa.color }}>
                          PASO {p.paso}
                        </span>
                        {p.isNew && (
                          <span className="usa-tag" style={{ backgroundColor: '#008837', color: '#FFFFFF', fontSize: '9px', fontWeight: 700 }}>
                            NUEVA PLANILLA
                          </span>
                        )}
                      </div>

                      <h3 className="h6 fw-bold mb-2" style={{ color: '#1B2A4A', fontSize: '14px', lineHeight: 1.3 }}>
                        {p.nombre}
                      </h3>

                      <p className="text-secondary small mb-3" style={{ fontSize: '12px', minHeight: '36px' }}>
                        {p.descripcion}
                      </p>

                      {/* Normativas Aplicables Chips + Portada Badge */}
                      <div className="d-flex flex-wrap gap-1 mb-3">
                        <span className="usa-tag usa-tag--info" style={{ fontSize: '10px' }}>
                          📄 PORTADA FOLIADA
                        </span>
                        {p.normativas.map(n => (
                          <span key={n} className="badge bg-light text-dark border" style={{ fontSize: '10px', fontWeight: 600 }}>
                            {n}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Botón de Acción */}
                    <div className="pt-2 border-top d-flex align-items-center justify-content-between mt-auto">
                      <span className="text-muted" style={{ fontSize: '10px' }}>
                        PDF Folio (216x330mm)
                      </span>

                      <Link
                        href={`${p.ruta}${selectedCasoId ? `?casoId=${selectedCasoId}` : ''}`}
                        className="btn btn-outline-primary btn-sm fw-bold d-flex align-items-center gap-1"
                        style={{ fontSize: '11px' }}
                      >
                        Generar / Ver <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
