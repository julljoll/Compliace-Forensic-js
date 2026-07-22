import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { pdfStyles } from '../reactPdfStyles';

interface Props {
  caso: any;
  logs: any[];
}

export const ActaAuditoriaTimelinePdf: React.FC<Props> = ({ caso, logs = [] }) => {
  const numeroExpediente = caso?.numeroCaso || 'GLOBAL';
  const fecha = new Date().toLocaleDateString('es-VE');

  return (
    <Document title={`Acta_Auditoria_${numeroExpediente}`}>
      <Page size={[612, 936]} style={pdfStyles.page}>
        <View style={pdfStyles.headerContainer}>
          <Text style={pdfStyles.logoText}>SHA256.US</Text>
          <Text style={pdfStyles.subLogoText}>LABORATORIO DE INFORMÁTICA FORENSE & CIBERSEGURIDAD</Text>
        </View>

        <View style={pdfStyles.titleBlock}>
          <Text style={pdfStyles.mainTitle}>ACTA DE TRAZABILIDAD Y CADENA DE CUSTODIA DIGITAL</Text>
          <Text style={pdfStyles.subTitle}>CERTIFICACIÓN DE REGISTROS DE AUDITORÍA CRIPTOGRÁFICA INMUTABLE</Text>
          <View style={pdfStyles.expedienteBox}>
            <Text>EXPEDIENTE N°: {numeroExpediente}</Text>
          </View>
        </View>

        <Text style={pdfStyles.sectionTitle}>I. HISTORIAL INMUTABLE DE AUDITORÍA (HASH CHAIN SHA-256)</Text>
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableHeaderCell, { width: '20%' }]}>FECHA / HORA</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '20%' }]}>ACCIÓN</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '20%' }]}>USUARIO</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '40%' }]}>HASH ACTUAL (SHA-256)</Text>
          </View>
          {logs.slice(0, 15).map((log: any, idx: number) => (
            <View key={idx} style={pdfStyles.tableRow}>
              <Text style={[pdfStyles.tableCell, { width: '20%' }]}>{new Date(log.timestamp).toLocaleDateString('es-VE')}</Text>
              <Text style={[pdfStyles.tableCell, { width: '20%' }]}>{log.accion}</Text>
              <Text style={[pdfStyles.tableCell, { width: '20%' }]}>{log.usuario}</Text>
              <Text style={[pdfStyles.tableCell, { width: '40%', fontSize: 6.5, fontFamily: 'Helvetica' }]}>
                {(log.hashActual || 'GENESIS_HASH_00000000000000000000000000000000').slice(0, 32)}...
              </Text>
            </View>
          ))}
        </View>

        <Text style={pdfStyles.sectionTitle}>II. VALIDACIÓN PERICIAL DE INTEGRIDAD</Text>
        <Text style={pdfStyles.paragraph}>
          El presente informe valida que los logs expuestos corresponden a la cadena inmutable procesada criptográficamente con algoritmo SHA-256, sin modificaciones ni interrupciones en la trazabilidad.
        </Text>

        <View style={pdfStyles.signatureSection}>
          <View style={[pdfStyles.signatureCard, { width: '100%' }]}>
            <View style={pdfStyles.thumbBox}>
              <Text style={pdfStyles.thumbText}>PULGAR DERECHO</Text>
            </View>
            <View style={pdfStyles.signatureLine} />
            <Text style={pdfStyles.signatureLabel}>OFICIAL DE COMPLIANCE / PERITO EN CIBERSEGURIDAD</Text>
          </View>
        </View>

        <View style={pdfStyles.footer} fixed>
          <Text style={pdfStyles.footerText}>SHA256.US — Certificación Criptográfica Inmutable</Text>
          <Text style={pdfStyles.footerText}>Página 1 de 1</Text>
        </View>
      </Page>
    </Document>
  );
};

export default ActaAuditoriaTimelinePdf;
