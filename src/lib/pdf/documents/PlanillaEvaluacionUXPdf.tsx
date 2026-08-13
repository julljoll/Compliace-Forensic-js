import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { pdfStyles, formatValue } from '../reactPdfStyles';
import { PlanillaHeader, PlanillaFooter } from '../PlanillaHeaderFooter';
import PlanillaCoverPagePdf from '../PlanillaCoverPagePdf';

interface Props {
  caso?: any;
  isBlankMode?: boolean;
}

export const PlanillaEvaluacionUXPdf: React.FC<Props> = ({ caso, isBlankMode = false }) => {
  const c = caso || {};
  const fmt = (val?: string, placeholder: string = '') => formatValue(val, isBlankMode, placeholder);
  const numeroExpediente = fmt(c.numeroCaso, 'EXP-2026-SHA-0091');

  return (
    <Document title={`Planilla_Evaluacion_UX_${c.numeroCaso || 'EXP'}`}>
      {/* PÁGINA 1 (FOLIO 01) — PORTADA DINÁMICA FOLIADA */}
      <PlanillaCoverPagePdf planillaId="planilla-evaluacion-ux" caso={caso} isBlankMode={isBlankMode} />

      {/* PÁGINA 2 — ENCABEZADO Y CONTENIDO FOLIO DE LA EVALUACIÓN */}
      <Page size={[612, 936]} style={pdfStyles.page}>
        <PlanillaHeader />

        <View style={pdfStyles.titleBlock}>
          <Text style={pdfStyles.mainTitle}>PLANILLA DE EVALUACIÓN Y AUDITORÍA DE EXPERIENCIA DE USUARIO (UX/UI FORENSE)</Text>
          <Text style={pdfStyles.subTitle}>INSTRUMENTO PERICIAL DE COMPROBACIÓN DE USABILIDAD (1-5) DE PLANILLAS LOCALES PARA PERITOS, ABOGADOS Y JUECES</Text>
          
          <View style={pdfStyles.expedienteBox}>
            <View style={pdfStyles.expedienteSlot}>
              <Text style={pdfStyles.expedienteText}>EXPEDIENTE N°:</Text>
              <View style={pdfStyles.expedienteLine}>
                <Text style={{ fontSize: 8, paddingLeft: 4, fontFamily: 'Helvetica-Bold' }}>{numeroExpediente}</Text>
              </View>
            </View>
            <View style={pdfStyles.expedienteSlot}>
              <Text style={pdfStyles.expedienteText}>PRCC N°:</Text>
              <View style={pdfStyles.expedienteLine}>
                <Text style={{ fontSize: 8, paddingLeft: 4, fontFamily: 'Helvetica-Bold' }}>{fmt(c.numeroPRCC, 'PRCC-2026-0042')}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 0.0 METADATA DEL EVALUADOR */}
        <Text id="seccion-0.0" style={pdfStyles.sectionTitle}>0.0 METADATA DEL EVALUADOR (PERITO, ABOGADO LITIGANTE O JUEZ)</Text>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Nombre y Apellido:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.solicitante_nombre, 'Dr. / Lic. / Ing. Evaluador Pericial')}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>C.I. / Credencial / Inpre N°:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.solicitante_cedula, 'V-15.892.104 / Inpre N° 194.820')}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Rol / Perfil Evaluador:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.evaluadorRol, '[ X ] Perito Informático Forense   [   ] Abogado Litigante   [   ] Juez')}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Institución / Tribunal / Despacho:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.evaluadorInstitucion, 'Circunscripción Judicial / Tribunal Primero de Juicio / Laboratorio Privado')}</Text>
        </View>

        {/* 1.0 OBJETIVO Y COBERTURA DE PLANILLAS LOCALES */}
        <Text id="seccion-1.0" style={pdfStyles.sectionTitle}>1.0 OBJETIVO DE EVALUACIÓN UX/UI Y COBERTURA DE PLANILLAS LOCALES</Text>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Planillas Auditadas (11):</Text>
          <Text style={pdfStyles.fieldValue}>
            1.ActaObtencion, 2.ActaConsentimiento, 3.PlanillaPRCC, 4.ActaDesprecintado, 5.ActaEntrevista, 6.ActaAuditoriaTimeline, 7.DictamenImagenes, 8.DictamenAudios, 9.ActaDictamen General, 10.ActaSanitizacion, 11.ActaEntregaResultados.
          </Text>
        </View>

        {/* 2.0 MATRIZ DE VALORACIÓN UX/UI (ESCALA LIKERT 1 A 5) */}
        <Text id="seccion-2.0" style={pdfStyles.sectionTitle}>2.0 MATRIZ DE CUESTIONARIO Y VALORACIÓN UX/UI DE PLANILLAS LOCALES (1 A 5)</Text>
        <View style={pdfStyles.table}>
          <View style={[pdfStyles.tableRow, { backgroundColor: '#112E51' }]}>
            <Text style={[pdfStyles.tableCell, { width: '45%', fontFamily: 'Helvetica-Bold' }]}>Criterio de Usabilidad UX/UI</Text>
            <Text style={[pdfStyles.tableCell, { width: '25%', fontFamily: 'Helvetica-Bold' }]}>Normativa</Text>
            <Text style={[pdfStyles.tableCell, { width: '30%', fontFamily: 'Helvetica-Bold', textAlign: 'center' }]}>Valoración (1 a 5)</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '45%' }]}>1. Novedad Procesal de Planillas Estandarizadas</Text>
            <Text style={[pdfStyles.tableCell, { width: '25%' }]}>MUCC-2017 / ISO 27037</Text>
            <Text style={[pdfStyles.tableCell, { width: '30%', textAlign: 'center' }]}>[ 1 ] [ 2 ] [ 3 ] [ 4 ] [ 5 ]</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '45%' }]}>2. Amigabilidad y Legibilidad de Interfaz (UI)</Text>
            <Text style={[pdfStyles.tableCell, { width: '25%' }]}>USWDS 3.0 / DC3 Light</Text>
            <Text style={[pdfStyles.tableCell, { width: '30%', textAlign: 'center' }]}>[ 1 ] [ 2 ] [ 3 ] [ 4 ] [ 5 ]</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '45%' }]}>3. Comprensión Técnico-Legal (UX)</Text>
            <Text style={[pdfStyles.tableCell, { width: '25%' }]}>COPP 187 / LMDFE 4</Text>
            <Text style={[pdfStyles.tableCell, { width: '30%', textAlign: 'center' }]}>[ 1 ] [ 2 ] [ 3 ] [ 4 ] [ 5 ]</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '45%' }]}>4. Rapidez y Facilidad de Llenado de Datos</Text>
            <Text style={[pdfStyles.tableCell, { width: '25%' }]}>CMSStore / Wizard Auto</Text>
            <Text style={[pdfStyles.tableCell, { width: '30%', textAlign: 'center' }]}>[ 1 ] [ 2 ] [ 3 ] [ 4 ] [ 5 ]</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '45%' }]}>5. Paridad 1:1 Web vs Documento Impreso</Text>
            <Text style={[pdfStyles.tableCell, { width: '25%' }]}>Folio 216mm × 330mm</Text>
            <Text style={[pdfStyles.tableCell, { width: '30%', textAlign: 'center' }]}>[ 1 ] [ 2 ] [ 3 ] [ 4 ] [ 5 ]</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '45%' }]}>6. Solidez de Firmas y Dactiloscopía Bilateral</Text>
            <Text style={[pdfStyles.tableCell, { width: '25%' }]}>Sello Inmutable SHA-256</Text>
            <Text style={[pdfStyles.tableCell, { width: '30%', textAlign: 'center' }]}>[ 1 ] [ 2 ] [ 3 ] [ 4 ] [ 5 ]</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '45%' }]}>7. Impacto en Admisibilidad Probatoria</Text>
            <Text style={[pdfStyles.tableCell, { width: '25%' }]}>CRBV 28/60 · CPC 438</Text>
            <Text style={[pdfStyles.tableCell, { width: '30%', textAlign: 'center' }]}>[ 1 ] [ 2 ] [ 3 ] [ 4 ] [ 5 ]</Text>
          </View>
        </View>

        {/* 3.0 SONDEO DIAGNÓSTICO CUALITATIVO */}
        <Text id="seccion-3.0" style={pdfStyles.sectionTitle}>3.0 CUESTIONARIO DIAGNÓSTICO CUALITATIVO DE EXPERIENCIA EN TRIBUNALES</Text>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>3.1 Diferencia método tradicional:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.obsExperiencia, 'Integración ininterrumpida con verificación de Hash SHA-256 y pre-llenado automático.')}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>3.2 Amigabilidad y facilidad llenado:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.obsAmigabilidad, 'La estructuración visual USWDS/DC3 y las secciones numeradas facilitan la lectura en juzgados.')}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>3.3 Celeridad y admisibilidad:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.obsAdmisibilidad, 'Garantiza la inmutabilidad de WhatsApp/Correos y evita impugnaciones por faltas de custodia.')}</Text>
        </View>

        {/* 4.0 CERTIFICACIÓN DE EVALUACIÓN UX Y FIRMAS BILATERALES */}
        <Text id="seccion-4.0" style={pdfStyles.sectionTitle}>4.0 CERTIFICACIÓN DE EVALUACIÓN UX, DACTILOSCOPÍA BILATERAL Y FIRMAS</Text>
        <View style={pdfStyles.signatureSection}>
          <View style={pdfStyles.signatureCard}>
            <Text style={pdfStyles.peritoCardHeaderTitle}>EVALUADOR PRINCIPAL</Text>
            <Text style={{ fontSize: 7, color: '#64748B', textAlign: 'center', marginBottom: 15 }}>{"(PERITO / ABOGADO LITIGANTE / JUEZ)"}</Text>
            <View style={pdfStyles.peritoCardDividerLine} />
            <Text style={{ fontSize: 7.5 }}>Nombre: {fmt(c.solicitante_nombre, 'Evaluador Pericial')}</Text>
            <Text style={{ fontSize: 7.5 }}>C.I.: {fmt(c.solicitante_cedula, 'V-15.892.104')}</Text>
          </View>

          <View style={pdfStyles.peritoCard}>
            <Text style={pdfStyles.peritoCardHeaderTitle}>AUDITOR UX / PERITO EVALUADOR</Text>
            <Text style={{ fontSize: 7, color: '#64748B', textAlign: 'center', marginBottom: 15 }}>{"(LABORATORIO SHA256.US)"}</Text>
            <View style={pdfStyles.peritoCardDividerLine} />
            <Text style={{ fontSize: 7.5 }}>Nombre: Ing. Perito Evaluador SHA256.US</Text>
            <Text style={{ fontSize: 7.5 }}>CIV N°: 284.910 / SHA256.US</Text>
          </View>
        </View>

        <PlanillaFooter />
      </Page>
    </Document>
  );
};
