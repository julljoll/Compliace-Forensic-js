import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { pdfStyles, formatValue } from '../reactPdfStyles';
import { PlanillaHeader, PlanillaFooter } from '../PlanillaHeaderFooter';

interface Props {
  caso?: any;
  isBlankMode?: boolean;
}

export const ActaDesprecintadoPdf: React.FC<Props> = ({ caso, isBlankMode = false }) => {
  const c = caso || {};
  const fmt = (val?: string, placeholder: string = '') => formatValue(val, isBlankMode, placeholder);
  const numeroExpediente = fmt(c.numeroCaso, 'EXP-2026-SHA-0091');

  return (
    <Document title={`Acta_Desprecintado_${c.numeroCaso || 'EXP'}`}>
      <Page size={[612, 936]} style={pdfStyles.page}>
        <PlanillaHeader />

        <View style={pdfStyles.titleBlock}>
          <Text style={pdfStyles.mainTitle}>ACTA DE APERTURA Y DESPRECINTADO DE EVIDENCIA EN LABORATORIO</Text>
          <Text style={pdfStyles.subTitle}>VERIFICACIÓN FORMAL DE PRECINTO E INTEGRIDAD DE SOBRE DE CUSTODIA (MUCC-2017 FASE 2 & ISO/IEC 27037 SEC. 7)</Text>
          
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

        <Text style={pdfStyles.sectionTitle}>I. DATOS DE LA BOLSA / SOBRE DE CUSTODIA Y PRECINTO</Text>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Código de Bolsa Faraday / Sobre:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.codigoSobre, 'Bolsa Faraday Inviolable #BF-SHA-0092')}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Número de Precinto de Seguridad:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.numeroPrecinto, 'Precinto Holográfico SHA256-88192')}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Estado del Precinto al Recibir:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.estadoPrecinto, 'Intacto / Inviolado / Sello Holográfico sin alteraciones')}</Text>
        </View>

        <Text style={pdfStyles.sectionTitle}>II. PROCEDIMIENTO DE APERTURA Y ASIGNACIÓN A ESTACIÓN FORENSE</Text>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Estación de Trabajo / Write-Blocker:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.estacionTrabajo, 'Estación Forense N° 01 (Tableau Write-Blocker T8u)')}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Perito Analista Responsable:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.peritoLider, 'Ing. Jull J. Ollarves S.')}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Testigo de Apertura de Laboratorio:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.testigoApertura, 'Lcda. María Elena Torres (Oficial de Custodia)')}</Text>
        </View>

        <Text style={pdfStyles.sectionTitle}>III. CONSTANCIA DE APERTURA SIN NULIDAD</Text>
        <View style={{ padding: 6, backgroundColor: '#F8F9FA', borderRadius: 4, marginBottom: 8, borderLeftWidth: 3, borderLeftColor: '#FECF06' }}>
          <Text style={{ fontSize: 7, color: '#111111', lineHeight: 1.4, textAlign: 'justify' }}>
            Se hace constar formalmente que en la sede del Laboratorio Privado SHA256.US se procedió a la remoción e inspección del precinto de la bolsa contenedora de la evidencia digital. Se verificó que el contenido corresponde exactamente con el inventario de la Planilla de Registro de Cadena de Custodia (PRCC) y no presenta signos de fuerza o alteración previa.
          </Text>
        </View>

        {/* RECUADRO DE FIRMAS Y HUELLAS */}
        <View style={pdfStyles.signatureSection}>
          <View style={pdfStyles.peritoCard}>
            <Text style={pdfStyles.peritoCardHeaderTitle}>PERITO ANALISTA EN LABORATORIO</Text>
            <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center', marginVertical: 3 }}>
              <View style={pdfStyles.peritoThumbBox}>
                <Text style={pdfStyles.peritoThumbText}>PULGAR DER.</Text>
              </View>
              <View style={pdfStyles.peritoThumbBox}>
                <Text style={pdfStyles.peritoThumbText}>PULGAR IZQ.</Text>
              </View>
            </View>
            <View style={pdfStyles.peritoDottedLine} />
            <View style={pdfStyles.peritoSignatureLine} />
            <Text style={pdfStyles.peritoCardSubTitle}>FIRMA DEL PERITO ANALISTA</Text>
            <View style={{ marginTop: 4, width: '100%' }}>
              <View style={pdfStyles.peritoFieldRow}>
                <Text style={pdfStyles.peritoFieldLabel}>Nombre:</Text>
                <Text style={pdfStyles.peritoFieldValue}>{fmt(c.peritoLider, 'Ing. Jull J. Ollarves S.')}</Text>
              </View>
              <View style={pdfStyles.peritoFieldRow}>
                <Text style={pdfStyles.peritoFieldLabel}>C.I. N°:</Text>
                <Text style={pdfStyles.peritoFieldValue}>{fmt(c.peritoCedula, 'V-19.823.104')}</Text>
              </View>
            </View>
          </View>

          <View style={pdfStyles.peritoCard}>
            <Text style={pdfStyles.peritoCardHeaderTitle}>TESTIGO / CONTROL DE CUSTODIA</Text>
            <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center', marginVertical: 3 }}>
              <View style={pdfStyles.peritoThumbBox}>
                <Text style={pdfStyles.peritoThumbText}>PULGAR DER.</Text>
              </View>
              <View style={pdfStyles.peritoThumbBox}>
                <Text style={pdfStyles.peritoThumbText}>PULGAR IZQ.</Text>
              </View>
            </View>
            <View style={pdfStyles.peritoDottedLine} />
            <View style={pdfStyles.peritoSignatureLine} />
            <Text style={pdfStyles.peritoCardSubTitle}>FIRMA TESTIGO DE CUSTODIA</Text>
            <View style={{ marginTop: 4, width: '100%' }}>
              <View style={pdfStyles.peritoFieldRow}>
                <Text style={pdfStyles.peritoFieldLabel}>Nombre:</Text>
                <Text style={pdfStyles.peritoFieldValue}>{fmt(c.testigoNombre, 'Lcda. María Elena Torres')}</Text>
              </View>
              <View style={pdfStyles.peritoFieldRow}>
                <Text style={pdfStyles.peritoFieldLabel}>C.I. N°:</Text>
                <Text style={pdfStyles.peritoFieldValue}>{fmt(c.testigoCedula, 'V-16.294.012')}</Text>
              </View>
            </View>
          </View>
        </View>

        <PlanillaFooter />
      </Page>
    </Document>
  );
};

export default ActaDesprecintadoPdf;
