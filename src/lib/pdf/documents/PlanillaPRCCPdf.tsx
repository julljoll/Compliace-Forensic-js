import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { pdfStyles } from '../reactPdfStyles';

interface Props {
  caso: any;
}

export const PlanillaPRCCPdf: React.FC<Props> = ({ caso }) => {
  const c = caso || {};
  const numeroExpediente = c.numeroCaso || '[EXPEDIENTE]';
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
            <Text>PRCC N°: {c.numeroPRCC || `PRCC-2026-${numeroExpediente}`}</Text>
          </View>
        </View>

        <Text style={pdfStyles.sectionTitle}>I. DATOS DEL CONSIGNANTE, DEL CASO Y ORGANISMO</Text>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Consignante / Solicitante:</Text>
          <Text style={pdfStyles.fieldValue}>{c.solicitante_nombre || '[Apellidos y Nombres del Consignante]'}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Cédula de Identidad / RIF:</Text>
          <Text style={pdfStyles.fieldValue}>{c.solicitante_cedula || '[Cédula de Identidad]'}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>N° de Expediente / Caso:</Text>
          <Text style={pdfStyles.fieldValue}>{numeroExpediente}</Text>
        </View>

        <Text style={pdfStyles.sectionTitle}>II. FORMA DE OBTENCIÓN (MUCC-2017 — CONSIGNACIÓN PRIVADA)</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 4 }}>
          <View style={pdfStyles.checkboxContainer}>
            <View style={pdfStyles.checkboxBox}><Text style={pdfStyles.checkboxCheck}>X</Text></View>
            <Text style={{ fontSize: 7.5 }}>Consignación Directa (Entrega Voluntaria)</Text>
          </View>
          <View style={pdfStyles.checkboxContainer}>
            <View style={pdfStyles.checkboxBox}><Text style={pdfStyles.checkboxCheck}></Text></View>
            <Text style={{ fontSize: 7.5 }}>Técnica (Análisis Pericial Interno)</Text>
          </View>
        </View>

        <Text style={pdfStyles.sectionTitle}>III. OPERARIOS (PERITO INFORMÁTICO) — MUCC-2017</Text>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Perito Responsable:</Text>
          <Text style={pdfStyles.fieldValue}>{c.peritoLider || 'Ing. Perito Forense Digital'}</Text>
        </View>

        <Text style={pdfStyles.sectionTitle}>IV. DESCRIPCIÓN DE LA EVIDENCIA DIGITAL CONSIGNADA</Text>
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableHeaderCell, { width: '30%' }]}>Evidencia / Dispositivo</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '70%' }]}>Especificación Técnica / Serial / Hash SHA-256</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '30%', fontFamily: 'Helvetica-Bold' }]}>Equipo Móvil / Computador</Text>
            <Text style={[pdfStyles.tableCell, { width: '70%' }]}>
              {c.dispositivo_marca || 'Samsung'} {c.dispositivo_modelo || 'S21'} (S/N / IMEI: {c.dispositivo_imei || '358921098471209'})
            </Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '30%', fontFamily: 'Helvetica-Bold' }]}>Hash SHA-256 Génesis</Text>
            <Text style={[pdfStyles.tableCell, { width: '70%', fontSize: 6.5, fontFamily: 'Helvetica' }]}>
              {c.hashGenesis || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
            </Text>
          </View>
        </View>

        <Text style={pdfStyles.sectionTitle}>V. CONTINUIDAD Y REGISTRO DE TRASLADOS DE CADENA DE CUSTODIA</Text>
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableHeaderCell, { width: '15%' }]}>FECHA</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '25%' }]}>ENTREGA (CUSTODIO)</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '25%' }]}>RECIBE (PERITO)</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '20%' }]}>PROPÓSITO</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '15%' }]}>FIRMA</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '15%' }]}>{fecha}</Text>
            <Text style={[pdfStyles.tableCell, { width: '25%' }]}>{c.solicitante_nombre || 'Consignante'}</Text>
            <Text style={[pdfStyles.tableCell, { width: '25%' }]}>{c.peritoLider || 'Perito Receptor'}</Text>
            <Text style={[pdfStyles.tableCell, { width: '20%' }]}>Recepcion e Imagen</Text>
            <Text style={[pdfStyles.tableCell, { width: '15%' }]}>________________</Text>
          </View>
        </View>

        <Text style={pdfStyles.sectionTitle}>VI. FIRMAS DE RESPONSABILIDAD DE CUSTODIA</Text>
        <View style={pdfStyles.signatureSection}>
          <View style={pdfStyles.signatureCard}>
            <View style={pdfStyles.thumbBox}>
              <Text style={pdfStyles.thumbText}>PULGAR DER.</Text>
            </View>
            <View style={pdfStyles.signatureLine} />
            <Text style={pdfStyles.signatureLabel}>CUSTODIO SALIENTE</Text>
          </View>

          <View style={pdfStyles.signatureCard}>
            <View style={pdfStyles.thumbBox}>
              <Text style={pdfStyles.thumbText}>PULGAR DER.</Text>
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
