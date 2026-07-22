import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { pdfStyles } from '../reactPdfStyles';

interface Props {
  caso: any;
}

export const ActaDictamenPdf: React.FC<Props> = ({ caso }) => {
  const numeroExpediente = caso?.numeroCaso || '[EXPEDIENTE]';
  const fecha = new Date().toLocaleDateString('es-VE', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Document title={`Dictamen_Pericial_${numeroExpediente}`}>
      <Page size={[612, 936]} style={pdfStyles.page}>
        <View style={pdfStyles.headerContainer}>
          <Text style={pdfStyles.logoText}>SHA256.US</Text>
          <Text style={pdfStyles.subLogoText}>LABORATORIO DE INFORMÁTICA FORENSE & CIBERSEGURIDAD</Text>
        </View>

        <View style={pdfStyles.titleBlock}>
          <Text style={pdfStyles.mainTitle}>DICTAMEN PERICIAL INFORMÁTICO FORENSE</Text>
          <Text style={pdfStyles.subTitle}>INFORME TÉCNICO-CIENTÍFICO DE HALLAZGOS Y CONCLUSIONES PERICIALES</Text>
          <View style={pdfStyles.expedienteBox}>
            <Text>DICTAMEN N°: DICT-2026-{numeroExpediente}</Text>
          </View>
        </View>

        <Text style={pdfStyles.sectionTitle}>I. PREÁMBULO Y PERITO ACTUANTE</Text>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>PERITO INFORMÁTICO:</Text>
          <Text style={pdfStyles.fieldValue}>{caso?.peritoLider || 'Ing. Perito Forense Digital'}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>FECHA DEL DICTAMEN:</Text>
          <Text style={pdfStyles.fieldValue}>{fecha}</Text>
        </View>

        <Text style={pdfStyles.sectionTitle}>II. ANÁLISIS TÉCNICO Y PROCEDIMIENTO CIENTÍFICO</Text>
        <Text style={pdfStyles.paragraph}>
          Se realizó la extracción, procesamiento y análisis forense digital cumpliendo estrictamente con los protocolos ISO/IEC 27037 y NIST SP 800-86. Todos los análisis se ejecutaron sobre una copia de respaldo bit-a-bit manteniendo inalterada la evidencia original.
        </Text>

        <Text style={pdfStyles.sectionTitle}>III. CONCLUSIONES PERICIALES Y DICTAMEN</Text>
        <Text style={pdfStyles.paragraph}>
          Con base en los datos extraídos y validados criptográficamente mediante hash SHA-256, el suscrito Perito dictamina la veracidad y continuidad del registro analizado en los términos legales reglamentarios.
        </Text>

        <Text style={pdfStyles.sectionTitle}>IV. JURAMENTO Y FIRMA DEL PERITO</Text>
        <View style={pdfStyles.signatureSection}>
          <View style={[pdfStyles.signatureCard, { width: '100%' }]}>
            <View style={pdfStyles.thumbBox}>
              <Text style={pdfStyles.thumbText}>PULGAR DERECHO</Text>
            </View>
            <View style={pdfStyles.signatureLine} />
            <Text style={pdfStyles.signatureLabel}>ING. PERITO INFORMÁTICO FORENSE DIGITAL</Text>
            <Text style={{ fontSize: 7, marginTop: 2 }}>ACREDITACIÓN Y SELLO PROFESIONAL</Text>
          </View>
        </View>

        <View style={pdfStyles.footer} fixed>
          <Text style={pdfStyles.footerText}>SHA256.US — Dictamen Pericial Oficial Certificado</Text>
          <Text style={pdfStyles.footerText}>Página 1 de 1</Text>
        </View>
      </Page>
    </Document>
  );
};

export default ActaDictamenPdf;
