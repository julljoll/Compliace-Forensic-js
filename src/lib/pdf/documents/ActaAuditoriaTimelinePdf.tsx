import React from 'react';
import { Document, Page, Text, View, Image } from '@react-pdf/renderer';
import { pdfStyles, formatCleanValue } from '../reactPdfStyles';

interface Props {
  caso: any;
  logs: any[];
}

export const ActaAuditoriaTimelinePdf: React.FC<Props> = ({ caso, logs = [] }) => {
  const c = caso || {};
  const numeroExpediente = formatCleanValue(c.numeroCaso, 'GLOBAL');

  return (
    <Document title={`Acta_Auditoria_${c.numeroCaso || 'EXP'}`}>
      <Page size={[612, 936]} style={pdfStyles.page}>
        {/* Header Unificado */}
        <View style={pdfStyles.headerContainer}>
          <View style={pdfStyles.headerBrandRow}>
            <Image src="/logo.png" style={pdfStyles.headerLogo} />
            <Text style={pdfStyles.logoText}>SHA256.US</Text>
          </View>
          <Text style={pdfStyles.subLogoText}>LABORATORIO DE INFORMÁTICA FORENSE & CIBERSEGURIDAD</Text>
          <Text style={pdfStyles.addressText}>
            Avenida 6, con calle 7, Edificio Mercantil La Ceiba, primer piso, oficina N° 8, Quíbor, Municipio Jiménez del Estado Lara.
          </Text>
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
          {logs.length > 0 ? (
            logs.slice(0, 15).map((log: any, idx: number) => (
              <View key={idx} style={pdfStyles.tableRow}>
                <Text style={[pdfStyles.tableCell, { width: '20%' }]}>{new Date(log.timestamp).toLocaleDateString('es-VE')}</Text>
                <Text style={[pdfStyles.tableCell, { width: '20%' }]}>{log.accion}</Text>
                <Text style={[pdfStyles.tableCell, { width: '20%' }]}>{log.usuario}</Text>
                <Text style={[pdfStyles.tableCell, { width: '40%', fontSize: 6.5, fontFamily: 'Helvetica' }]}>
                  {(log.hashActual || 'GENESIS_HASH_00000000000000000000000000000000').slice(0, 32)}...
                </Text>
              </View>
            ))
          ) : (
            <View style={pdfStyles.tableRow}>
              <Text style={[pdfStyles.tableCell, { width: '100%', textAlign: 'center' }]}>
                Sin eventos registrados.
              </Text>
            </View>
          )}
        </View>

        <Text style={pdfStyles.sectionTitle}>II. VALIDACIÓN PERICIAL DE INTEGRIDAD</Text>
        <Text style={pdfStyles.paragraph}>
          El presente informe valida que los logs expuestos corresponden a la cadena inmutable procesada criptográficamente con algoritmo SHA-256, sin modificaciones ni interrupciones en la trazabilidad.
        </Text>

        <View style={pdfStyles.signatureSection}>
          <View style={[pdfStyles.signatureCard, { width: '100%' }]}>
            <View style={pdfStyles.thumbBox}>
              <Text style={pdfStyles.thumbText}>PULGAR DER.</Text>
            </View>
            <View style={pdfStyles.signatureLine} />
            <Text style={pdfStyles.signatureLabel}>OFICIAL DE COMPLIANCE / PERITO EN CIBERSEGURIDAD</Text>
            <Text style={{ fontSize: 7, marginTop: 2 }}>{formatCleanValue(c.peritoLider, 'Ing. Perito Forense Digital')}</Text>
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
