import React from 'react';
import { CasoCMS } from '@/store/cmsStore';
import { PlanillaFolioTemplate } from '../../templates/Planillas/PlanillaFolioTemplate';
import { PlanillaSectionTitle } from '../../molecules/Planillas/PlanillaSectionTitle';
import { PlanillaFieldLabel } from '../../atoms/Planillas/PlanillaFieldLabel';
import { PlanillaEditableValue } from '../../atoms/Planillas/PlanillaEditableValue';
import { PlanillaThumbBox } from '../../atoms/Planillas/PlanillaThumbBox';

interface PlanillaEvaluacionUXProps {
  caso?: CasoCMS;
}

export default function PlanillaEvaluacionUX({ caso }: PlanillaEvaluacionUXProps) {
  const c = caso || ({} as Partial<CasoCMS>);

  return (
    <PlanillaFolioTemplate
      title="Planilla de Evaluación y Auditoría de Experiencia de Usuario (UX/UI Forense)"
      nroLabel="N° EXPEDIENTE:"
      nroValue={c.numeroCaso ? c.numeroCaso : <span className="placeholder-field">[EXPEDIENTE]</span>}
      watermarkText="EVALUACIÓN UX/UI"
    >
      {/* HEADER PRINCIPAL DE PARIDAD PARITARIA */}
      <div className="uswds-top-header">
        SHA256.US · PLANILLA DE EVALUACIÓN Y AUDITORÍA DE EXPERIENCIA DE USUARIO (UX/UI FORENSE) — LIKERT 1-5
      </div>

      {/* BLOQUE EXPEDIENTE / AUDITORÍA */}
      <div className="section mb-3">
        <div className="uswds-card p-3 border rounded-3 bg-light">
          <div className="grid-container row g-2">
            <div className="col-12 col-md-6 form-group uswds-slot-input">
              <PlanillaFieldLabel>N° Expediente de Referencia</PlanillaFieldLabel>
              <PlanillaEditableValue value={c.numeroCaso} placeholder="[EXP-2026-SHA-XXXX]" style={{ fontFamily: 'monospace' }} />
            </div>
            <div className="col-12 col-md-6 form-group uswds-slot-input">
              <PlanillaFieldLabel>Fecha de Auditoría UX</PlanillaFieldLabel>
              <PlanillaEditableValue value={c.fechaCreacion ? new Date(c.fechaCreacion).toLocaleDateString('es-VE') : ''} placeholder="[DD/MM/AAAA]" style={{ fontFamily: 'monospace' }} />
            </div>
          </div>
        </div>
      </div>

      {/* 0.0 METODOLOGÍA Y PERFIL DEL EVALUADOR */}
      <div className="section mb-3">
        <PlanillaSectionTitle id="seccion-0.0">
          0.0 METADATA DEL EVALUADOR (PERITOS, ABOGADOS LITIGANTES Y JUECES)
        </PlanillaSectionTitle>
        <div className="uswds-card p-3 border rounded-3">
          <div className="row g-2 mb-2">
            <div className="col-12 col-md-7 form-group uswds-slot-input">
              <PlanillaFieldLabel>Nombre y Apellido del Evaluador</PlanillaFieldLabel>
              <PlanillaEditableValue value={c.solicitante_nombre} placeholder="[Nombres y Apellidos del Profesional]" />
            </div>
            <div className="col-12 col-md-5 form-group uswds-slot-input">
              <PlanillaFieldLabel>C.I. / Credencial / Inpre N°</PlanillaFieldLabel>
              <PlanillaEditableValue value={c.solicitante_cedula} placeholder="[V-XXXXXXX / N° Credencial]" style={{ fontFamily: 'monospace' }} />
            </div>
          </div>

          <div className="row g-2 mb-2">
            <div className="col-12 col-md-6 form-group">
              <PlanillaFieldLabel>Perfil / Rol del Evaluador</PlanillaFieldLabel>
              <div className="d-flex flex-wrap gap-2 mt-1">
                <span className="badge bg-primary-subtle text-primary border px-2 py-1">Perito Informático Forense</span>
                <span className="badge bg-secondary-subtle text-secondary border px-2 py-1">Abogado Litigante (Penal/Civil)</span>
                <span className="badge bg-success-subtle text-success border px-2 py-1">Juez / Magistrado / Operador</span>
              </div>
            </div>
            <div className="col-12 col-md-6 form-group uswds-slot-input">
              <PlanillaFieldLabel>Institución / Tribunal / Despacho</PlanillaFieldLabel>
              <PlanillaEditableValue placeholder="[Circunscripción Judicial / Tribunal / Firma de Abogados]" />
            </div>
          </div>
        </div>
      </div>

      {/* 1.0 OBJETIVO Y COBERTURA DE PLANILLAS LOCALES */}
      <div className="section mb-3">
        <PlanillaSectionTitle id="seccion-1.0">
          1.0 OBJETIVO DE EVALUACIÓN UX/UI Y COBERTURA DE PLANILLAS LOCALES DE ESTE PROYECTO
        </PlanillaSectionTitle>
        <div className="uswds-card p-3 border rounded-3 bg-white">
          <div className="p-3 border rounded-3 mb-3" style={{ backgroundColor: '#EFF6FF', borderColor: '#3B82F6' }}>
            <h6 className="fw-bold text-primary mb-1">📌 Objeto de Evaluación de Planillas Locales (SHA256.US CMS):</h6>
            <p className="small mb-0 text-dark">
              Se audita empíricamente la experiencia de usuario (UX), amigabilidad gráfica (UI), claridad terminológica y velocidad de llenado de las planillas y actas forenses locales del sistema SHA256.US (PlanillaPRCC, ActaObtencion, ActaDesprecintado, ActaEntrevista, ActaSanitizacion, ActaEntregaResultados, Dictámenes Periciales, Consentimiento y Timeline Inmutable) en Peritos, Abogados Litigantes y Jueces.
            </p>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-sm align-middle small mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Etapa Procesal</th>
                  <th>Las 11 Planillas Forenses Oficiales Auditadas</th>
                  <th>Estándar / Normativa</th>
                  <th>Propósito Procesal</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="fw-bold text-nowrap">Etapa 1: Consignación</td>
                  <td>1. ActaObtencion (FO-ACT-001)<br />2. ActaConsentimiento (FO-ACT-002)</td>
                  <td>MUCC-2017 § 5 / ISO 27037 / CRBV 28/60</td>
                  <td>Recepción voluntaria de equipos, inventario técnico y consentimiento Hábeas Data.</td>
                </tr>
                <tr>
                  <td className="fw-bold text-nowrap">Etapa 2: Custodia &amp; Lab</td>
                  <td>3. PlanillaPRCC (FO-PRCC-001)<br />4. ActaDesprecintado (FO-ACT-003)<br />5. ActaEntrevista (FO-ACT-004)</td>
                  <td>MUCC-2017 § 4 / COPP Art. 187 / COPP Art. 225</td>
                  <td>Trazabilidad de custodia, apertura de bolsas Faraday con Hash Génesis y entrevista.</td>
                </tr>
                <tr>
                  <td className="fw-bold text-nowrap">Etapa 3: Peritaje &amp; Dictamen</td>
                  <td>6. ActaAuditoriaTimeline (FO-AUD-001)<br />7. DictamenImagenes (FO-DIC-001)<br />8. DictamenAudios (FO-DIC-002)<br />9. ActaDictamen General (FO-DIC-000)</td>
                  <td>ISO 27042 / FRE 702 / PyOgg / PhotoHolmes</td>
                  <td>Timeline inmutable SHA-256 e informes periciales de 8 folios (WhatsApp, fotos y audio).</td>
                </tr>
                <tr>
                  <td className="fw-bold text-nowrap">Etapa 4: Sanitización &amp; Cierre</td>
                  <td>10. ActaSanitizacion (FO-SAN-001)<br />11. ActaEntregaResultados (FO-ENT-001)</td>
                  <td>NIST SP 800-88 / ISO 27001 / COPP Art. 187</td>
                  <td>Borrado criptográfico Crypto-Erase de copias temporales y restitución final de equipos.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 2.0 MATRIZ DE CUESTIONARIO Y VALORACIÓN UX/UI (LIKERT 1-5) */}
      <div className="section mb-3">
        <PlanillaSectionTitle id="seccion-2.0">
          2.0 MATRIZ DE CUESTIONARIO Y VALORACIÓN UX/UI DE PLANILLAS LOCALES (ESCALA 1 A 5)
        </PlanillaSectionTitle>
        <div className="uswds-card p-3 border rounded-3">
          <div className="table-responsive">
            <table className="table table-bordered table-striped table-hover align-middle small mb-0">
              <thead className="table-navy text-white" style={{ backgroundColor: '#112E51' }}>
                <tr>
                  <th style={{ width: '35%' }}>Criterio de Usabilidad UX/UI</th>
                  <th style={{ width: '20%' }}>Normativa</th>
                  <th style={{ width: '30%', textAlign: 'center' }}>Valoración Likert (1 a 5)</th>
                  <th style={{ width: '15%', textAlign: 'center' }}>Puntaje</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>1. Novedad Procesal del Flujo Estandarizado</strong>
                    <br />
                    <span className="text-muted extra-small">¿Había visto antes todo este proceso forense pre-llenado y estandarizado en planillas?</span>
                  </td>
                  <td><span className="badge bg-secondary">MUCC-2017 / ISO 27037</span></td>
                  <td className="text-center">
                    <span className="me-2">[1]</span>
                    <span className="me-2">[2]</span>
                    <span className="me-2">[3]</span>
                    <span className="me-2">[4]</span>
                    <span><strong>[5]</strong></span>
                  </td>
                  <td className="text-center fw-bold text-primary">[  ] PTS</td>
                </tr>
                <tr>
                  <td>
                    <strong>2. Amigabilidad y Legibilidad de Interfaz (UI)</strong>
                    <br />
                    <span className="text-muted extra-small">¿La interfaz gráfica USWDS/DC3 Cyber Forensics es limpia, profesional y fácil de leer?</span>
                  </td>
                  <td><span className="badge bg-primary">USWDS 3.0 / DC3 Light</span></td>
                  <td className="text-center">
                    <span className="me-2">[1]</span>
                    <span className="me-2">[2]</span>
                    <span className="me-2">[3]</span>
                    <span className="me-2">[4]</span>
                    <span><strong>[5]</strong></span>
                  </td>
                  <td className="text-center fw-bold text-primary">[  ] PTS</td>
                </tr>
                <tr>
                  <td>
                    <strong>3. Comprensión Técnico-Legal (UX)</strong>
                    <br />
                    <span className="text-muted extra-small">¿La terminología y leyes (COPP 187, LMDFE) son fáciles de entender para peritos, abogados y jueces?</span>
                  </td>
                  <td><span className="badge bg-success">COPP 187 / LMDFE 4</span></td>
                  <td className="text-center">
                    <span className="me-2">[1]</span>
                    <span className="me-2">[2]</span>
                    <span className="me-2">[3]</span>
                    <span className="me-2">[4]</span>
                    <span><strong>[5]</strong></span>
                  </td>
                  <td className="text-center fw-bold text-primary">[  ] PTS</td>
                </tr>
                <tr>
                  <td>
                    <strong>4. Rapidez y Facilidad en el Llenado de Datos</strong>
                    <br />
                    <span className="text-muted extra-small">¿El pre-llenado automático desde el expediente (`CasoCMS`) y asistente Wizard agilizan la captura?</span>
                  </td>
                  <td><span className="badge bg-info text-dark">CMSStore / Wizard Auto</span></td>
                  <td className="text-center">
                    <span className="me-2">[1]</span>
                    <span className="me-2">[2]</span>
                    <span className="me-2">[3]</span>
                    <span className="me-2">[4]</span>
                    <span><strong>[5]</strong></span>
                  </td>
                  <td className="text-center fw-bold text-primary">[  ] PTS</td>
                </tr>
                <tr>
                  <td>
                    <strong>5. Paridad 1:1 Web vs Documento Impreso</strong>
                    <br />
                    <span className="text-muted extra-small">¿La réplica exacta entre el formulario web y la hoja Folio impresa (PDF/SVG) transmite confianza jurídica?</span>
                  </td>
                  <td><span className="badge bg-warning text-dark">Folio 216mm × 330mm</span></td>
                  <td className="text-center">
                    <span className="me-2">[1]</span>
                    <span className="me-2">[2]</span>
                    <span className="me-2">[3]</span>
                    <span className="me-2">[4]</span>
                    <span><strong>[5]</strong></span>
                  </td>
                  <td className="text-center fw-bold text-primary">[  ] PTS</td>
                </tr>
                <tr>
                  <td>
                    <strong>6. Solidez de Firmas y Dactiloscopía Bilateral</strong>
                    <br />
                    <span className="text-muted extra-small">¿Las firmas bilaterales, huellas dactilares (pulgares) y el Sello SHA-256 aportan plena validez procesal?</span>
                  </td>
                  <td><span className="badge bg-dark">Sello SHA-256 Inmutable</span></td>
                  <td className="text-center">
                    <span className="me-2">[1]</span>
                    <span className="me-2">[2]</span>
                    <span className="me-2">[3]</span>
                    <span className="me-2">[4]</span>
                    <span><strong>[5]</strong></span>
                  </td>
                  <td className="text-center fw-bold text-primary">[  ] PTS</td>
                </tr>
                <tr>
                  <td>
                    <strong>7. Impacto en Admisibilidad y Reducción de Nulidades</strong>
                    <br />
                    <span className="text-muted extra-small">¿Considera que la adopción de estas planillas en `SHA256.US` evitaría nulidades probatorias por rupturas de custodia?</span>
                  </td>
                  <td><span className="badge bg-danger">CRBV 28/60 · CPC 438</span></td>
                  <td className="text-center">
                    <span className="me-2">[1]</span>
                    <span className="me-2">[2]</span>
                    <span className="me-2">[3]</span>
                    <span className="me-2">[4]</span>
                    <span><strong>[5]</strong></span>
                  </td>
                  <td className="text-center fw-bold text-primary">[  ] PTS</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 3.0 SONDEO CUALITATIVO Y RECOMENDACIONES DE EXPERIENCIA */}
      <div className="section mb-3">
        <PlanillaSectionTitle id="seccion-3.0">
          3.0 SONDEO DIAGNÓSTICO CUALITATIVO DE EXPERIENCIA EN TRIBUNALES Y USABILIDAD
        </PlanillaSectionTitle>
        <div className="uswds-card p-3 border rounded-3">
          <div className="mb-3">
            <PlanillaFieldLabel>
              3.1 ¿Ha presenciado antes en juzgados o peritajes un sistema integral de planillas que conecte todo el ciclo con Hash SHA-256? Describa la diferencia:
            </PlanillaFieldLabel>
            <PlanillaEditableValue placeholder="[Observaciones y diagnóstico del Perito, Abogado o Juez]" style={{ minHeight: '60px' }} />
          </div>

          <div className="mb-3">
            <PlanillaFieldLabel>
              3.2 Evaluando la funcionalidad UX/UI de las planillas de este repositorio: ¿Qué aspectos considera más amigables y fáciles de entender/llenar?:
            </PlanillaFieldLabel>
            <PlanillaEditableValue placeholder="[Comentarios de usabilidad visual y sugerencias para facilitarle el trabajo a Jueces y Abogados]" style={{ minHeight: '60px' }} />
          </div>

          <div className="mb-2">
            <PlanillaFieldLabel>
              3.3 ¿Considera que el pre-llenado normativo en SHA256.US beneficiaría la celeridad procesal y garantizaría la admisibilidad de las evidencias?:
            </PlanillaFieldLabel>
            <PlanillaEditableValue placeholder="[Fundamentación sobre la validez probatoria de las evidencias de WhatsApp, correos y discos]" style={{ minHeight: '60px' }} />
          </div>
        </div>
      </div>

      {/* 4.0 DACTILOSCOPÍA BILATERAL Y FIRMAS */}
      <div className="section mb-3">
        <PlanillaSectionTitle id="seccion-4.0">
          4.0 CERTIFICACIÓN DE EVALUACIÓN UX, DACTILOSCOPÍA BILATERAL Y FIRMAS
        </PlanillaSectionTitle>
        <div className="uswds-card p-3 border rounded-3">
          <div className="row g-3">
            <div className="col-12 col-md-6 border-end pe-md-3">
              <h6 className="fw-bold mb-2">EVALUADOR PRINCIPAL (PERITO / ABOGADO / JUEZ):</h6>
              <div className="my-4 border-bottom border-dashed text-center pb-2 text-muted small">
                Firma y Rúbrica del Evaluador
              </div>
              <div className="mb-1"><strong>Nombre:</strong> {c.solicitante_nombre || '_____________________________'}</div>
              <div className="mb-1"><strong>C.I. / Inpre / Cod:</strong> {c.solicitante_cedula || '_____________________________'}</div>
              <div className="d-flex gap-2 mt-3">
                <PlanillaThumbBox label="PULGAR IZQ." />
                <PlanillaThumbBox label="PULGAR DER." />
              </div>
            </div>

            <div className="col-12 col-md-6 ps-md-3">
              <h6 className="fw-bold mb-2">AUDITOR DE UX/UI Y CALIDAD FORENSE (SHA256.US):</h6>
              <div className="my-4 border-bottom border-dashed text-center pb-2 text-muted small">
                Firma Auditor UX / Perito Evaluador Digital
              </div>
              <div className="mb-1"><strong>Nombre:</strong> Ing. Perito Evaluador SHA256.US</div>
              <div className="mb-1"><strong>C.I. / CIV:</strong> V-18.492.012 / CIV N° 284.910</div>
              <div className="d-flex gap-2 mt-3">
                <PlanillaThumbBox label="PULGAR IZQ." />
                <PlanillaThumbBox label="PULGAR DER." />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PlanillaFolioTemplate>
  );
}
