import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { pdfStyles } from '../reactPdfStyles';

interface Props {
  caso: any;
}

export const ActaEntregaResultadosPdf: React.FC<Props> = ({ caso }) => {
  const c = caso || {};
  const numeroExpediente = c.numeroCaso || '[EXPEDIENTE]';
  const fecha = new Date().toLocaleDateString('es-VE', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Document title={`Acta_Entrega_${numeroExpediente}`}>
      <Page size={[612, 936]} style={pdfStyles.page}>
        <View style={pdfStyles.headerContainer}>
          <Text style={pdfStyles.logoText}>SHA256.US</Text>
          <Text style={pdfStyles.subLogoText}>LABORATORIO DE INFORMÁTICA FORENSE & CIBERSEGURIDAD</Text>
        </View>

        <View style={pdfStyles.titleBlock}>
          <Text style={pdfStyles.mainTitle}>ACTA DE ENTREGA DE RESULTADOS Y DEVOLUCIÓN DE EVIDENCIA</Text>
          <Text style={pdfStyles.subTitle}>ENTREGA FORMAL DE INFORME Y DEVOLUCIÓN DE DISPOSITIVO</Text>
          <View style={pdfStyles.expedienteBox}>
            <Text>ACTA N°: ENT-2026-{numeroExpediente}</Text>
          </View>
        </View>

        <Text style={pdfStyles.sectionTitle}>I. DATOS DE LA ENTREGA Y FECHA</Text>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Fecha de Entrega:</Text>
          <Text style={pdfStyles.fieldValue}>{fecha}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Expediente N°:</Text>
          <Text style={pdfStyles.fieldValue}>{numeroExpediente}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Receptor / Solicitante:</Text>
          <Text style={pdfStyles.fieldValue}>{c.solicitante_nombre || '[Nombre del Receptor]'}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Cédula de Identidad:</Text>
          <Text style={pdfStyles.fieldValue}>{c.solicitante_cedula || '[Cédula de Identidad]'}</Text>
        </View>

        <Text style={pdfStyles.sectionTitle}>II. CONSTANCIA DE DEVOLUCIÓN Y RECEPCIÓN DE CONFORMIDAD</Text>
        <Text style={pdfStyles.paragraph}>
          Por medio de la presente se hace constante entrega formal del Dictamen Pericial Informático Forense final y la devolución del dispositivo o evidencia digital consignada ({c.dispositivo_marca || 'Dispositivo'} {c.dispositivo_modelo || ''}, Serial/IMEI: {c.dispositivo_imei || 'N/A'}) en perfecto estado físico y con los precintos de seguridad debidamente validados.
        </Text>

        <Text style={pdfStyles.sectionTitle}>III. FIRMAS DE ENTREGADO Y RECIBIDO CONFORME</Text>
        <View style={pdfStyles.signatureSection}>
          <View style={pdfStyles.signatureCard}>
            <View style={pdfStyles.thumbBox}>
              <Text style={pdfStyles.thumbText}>PULGAR DER.</Text>
            </View>
            <View style={pdfStyles.signatureLine} />
            <Text style={pdfStyles.signatureLabel}>FIRMA DEL RECEPTOR</Text>
            <Text style={{ fontSize: 7, marginTop: 2 }}>C.I.: {c.solicitante_cedula || '___________________'}</Text>
          </View>

          <View style={pdfStyles.signatureCard}>
            <View style={pdfStyles.thumbBox}>
              <Text style={pdfStyles.thumbText}>PULGAR DER.</Text>
            </View>
            <View style={pdfStyles.signatureLine} />
            <Text style={pdfStyles.signatureLabel}>PERITO ENTREGANTE</Text>
            <Text style={{ fontSize: 7, marginTop: 2 }}>{c.peritoLider || 'Ing. Perito Forense Digital'}</Text>
          </View>
        </View>

        <View style={pdfStyles.footer} fixed>
          <Text style={pdfStyles.footerText}>SHA256.US — Acta Oficial de Entrega de Resultados</Text>
          <Text style={pdfStyles.footerText}>Página 1 de 1</Text>
        </View>
      </Page>
    </Document>
  );
};

export default ActaEntregaResultadosPdf;
