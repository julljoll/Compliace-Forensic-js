import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { pdfStyles } from '../reactPdfStyles';

interface Props {
  caso: any;
}

export const PlanillaPRCCPdf: React.FC<Props> = ({ caso }) => {
  const numeroExpediente = caso?.numeroCaso || '[EXPEDIENTE]';
  const fecha = new Date().toLocaleDateString('es-VE');

  return (
    <Document title={`Planilla_PRCC_${numeroExpediente}`}>
      <Page size={[612, 936]} style={pdfStyles.page}>
        <View style={pdfStyles.headerContainer}>
          <Text style={pdfStyles.logoText}>SHA256.US</Text>
          <Text style={pdfStyles.subLogoText}>LABORATORIO DE INFORMÁTICA FORENSE & CIBERSEGURIDAD</Text>
        </View>

        <View style={pdfStyles.titleBlock}>
          <Text style={pdfStyles.mainTitle}>PLANILLA DE REGISTRO DE CADENA DE CUSTODIA (PRCC)</Text>
          <Text style={pdfStyles.subTitle}>CONTROL SECUENCIAL DE TRAZABILIDAD Y HASH SHA-256</Text>
          <View style={pdfStyles.expedienteBox}>
            <Text>PRCC N°: {caso?.numeroPRCC || `PRCC-2026-${numeroExpediente}`}</Text>
          </View>
        </View>

        <Text style={pdfStyles.sectionTitle}>I. DATOS DEL CASO Y EVIDENCIA PRIMARIA</Text>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>EXPEDIENTE / CASO:</Text>
          <Text style={pdfStyles.fieldValue}>{numeroExpediente} — {caso?.titulo || 'Investigación Forense'}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>HASH GÉNESIS (SHA-256):</Text>
          <Text style={pdfStyles.fieldValue}>{caso?.hashGenesis || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}</Text>
        </View>

        <Text style={pdfStyles.sectionTitle}>II. TRAZABILIDAD DE CUSTODIOS Y TRASLADOS</Text>
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableHeaderCell, { width: '15%' }]}>FECHA</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '25%' }]}>ENTREGA (CUSTODIO)</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '25%' }]}>RECIBE (PERITO)</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '20%' }]}>PROPÓSITO</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '15%' }]}>ESTADO</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '15%' }]}>{fecha}</Text>
            <Text style={[pdfStyles.tableCell, { width: '25%' }]}>Consignante / Fiscalía</Text>
            <Text style={[pdfStyles.tableCell, { width: '25%' }]}>{caso?.peritoLider || 'Perito Asignado'}</Text>
            <Text style={[pdfStyles.tableCell, { width: '20%' }]}>Recepcion e Imagen</Text>
            <Text style={[pdfStyles.tableCell, { width: '15%' }]}>Sellado</Text>
          </View>
        </View>

        <Text style={pdfStyles.sectionTitle}>III. FIRMAS DE RESPONSABILIDAD DE CUSTODIA</Text>
        <View style={pdfStyles.signatureSection}>
          <View style={pdfStyles.signatureCard}>
            <View style={pdfStyles.thumbBox}>
              <Text style={pdfStyles.thumbText}>PULGAR DERECHO</Text>
            </View>
            <View style={pdfStyles.signatureLine} />
            <Text style={pdfStyles.signatureLabel}>CUSTODIO SALIENTE</Text>
          </View>

          <View style={pdfStyles.signatureCard}>
            <View style={pdfStyles.thumbBox}>
              <Text style={pdfStyles.thumbText}>PULGAR DERECHO</Text>
            </View>
            <View style={pdfStyles.signatureLine} />
            <Text style={pdfStyles.signatureLabel}>CUSTODIO RECEPTOR</Text>
          </View>
        </View>

        <View style={pdfStyles.footer} fixed>
          <Text style={pdfStyles.footerText}>SHA256.US — Registro de Cadena de Custodia Inmutable</Text>
          <Text style={pdfStyles.footerText}>Página 1 de 1</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PlanillaPRCCPdf;
