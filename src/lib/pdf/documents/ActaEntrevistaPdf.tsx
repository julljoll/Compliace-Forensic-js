import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { pdfStyles } from '../reactPdfStyles';

interface Props {
  caso: any;
}

export const ActaEntrevistaPdf: React.FC<Props> = ({ caso }) => {
  const numeroExpediente = caso?.numeroCaso || '[EXPEDIENTE]';
  const fecha = new Date().toLocaleDateString('es-VE', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Document title={`Acta_Entrevista_${numeroExpediente}`}>
      <Page size={[612, 936]} style={pdfStyles.page}>
        <View style={pdfStyles.headerContainer}>
          <Text style={pdfStyles.logoText}>SHA256.US</Text>
          <Text style={pdfStyles.subLogoText}>LABORATORIO DE INFORMÁTICA FORENSE & CIBERSEGURIDAD</Text>
        </View>

        <View style={pdfStyles.titleBlock}>
          <Text style={pdfStyles.mainTitle}>ACTA DE ENTREVISTA TÉCNICO-PERICIAL</Text>
          <Text style={pdfStyles.subTitle}>ENTREVISA DE CONTEXTO TÉCNICO Y ANTECEDENTES DEL CASO</Text>
          <View style={pdfStyles.expedienteBox}>
            <Text>EXPEDIENTE N°: {numeroExpediente}</Text>
          </View>
        </View>

        <Text style={pdfStyles.sectionTitle}>I. DATOS DEL ENTREVISTADO Y FECHA</Text>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>FECHA Y HORA:</Text>
          <Text style={pdfStyles.fieldValue}>{fecha}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>NOMBRE Y APELLIDO:</Text>
          <Text style={pdfStyles.fieldValue}>{caso?.peritoLider || 'Testigo / Denunciante'}</Text>
        </View>

        <Text style={pdfStyles.sectionTitle}>II. DECLARACIÓN Y ANTECEDENTES TÉCNICOS</Text>
        <Text style={pdfStyles.paragraph}>
          En la sede del laboratorio pericial, comparece la persona identificada para declarar sobre el origen, custodia y hechos relacionados con la evidencia digital. Manifestando que los datos contenidos en el dispositivo no han sido modificados ni alterados voluntariamente.
        </Text>

        <Text style={pdfStyles.sectionTitle}>III. FIRMAS DE CONFORMIDAD</Text>
        <View style={pdfStyles.signatureSection}>
          <View style={pdfStyles.signatureCard}>
            <View style={pdfStyles.thumbBox}>
              <Text style={pdfStyles.thumbText}>PULGAR DERECHO</Text>
            </View>
            <View style={pdfStyles.signatureLine} />
            <Text style={pdfStyles.signatureLabel}>FIRMA DEL ENTREVISTADO</Text>
          </View>

          <View style={pdfStyles.signatureCard}>
            <View style={pdfStyles.thumbBox}>
              <Text style={pdfStyles.thumbText}>PULGAR DERECHO</Text>
            </View>
            <View style={pdfStyles.signatureLine} />
            <Text style={pdfStyles.signatureLabel}>FIRMA DEL PERITO ENTREVISTADOR</Text>
          </View>
        </View>

        <View style={pdfStyles.footer} fixed>
          <Text style={pdfStyles.footerText}>SHA256.US — Laboratorio de Informática Forense & Ciberseguridad</Text>
          <Text style={pdfStyles.footerText}>Página 1 de 1</Text>
        </View>
      </Page>
    </Document>
  );
};

export default ActaEntrevistaPdf;
