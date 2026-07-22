import React from 'react';
import { Document, Page, Text, View, Image } from '@react-pdf/renderer';
import { pdfStyles, formatCleanValue } from '../reactPdfStyles';

interface Props {
  caso: any;
}

export const ActaDictamenPdf: React.FC<Props> = ({ caso }) => {
  const c = caso || {};
  const numeroExpediente = formatCleanValue(c.numeroCaso, '___________________');
  const fecha = new Date().toLocaleDateString('es-VE', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Document title={`Dictamen_Pericial_${c.numeroCaso || 'EXP'}`}>
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
          <Text style={pdfStyles.mainTitle}>DICTAMEN PERICIAL INFORMÁTICO FORENSE</Text>
          <Text style={pdfStyles.subTitle}>INFORME TÉCNICO-CIENTÍFICO DE HALLAZGOS Y CONCLUSIONES PERICIALES</Text>
          <View style={pdfStyles.expedienteBox}>
            <Text>DICTAMEN N°: DICT-2026-{numeroExpediente}</Text>
          </View>
        </View>

        <Text style={pdfStyles.sectionTitle}>I. PREÁMBULO Y PERITO ACTUANTE</Text>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Perito Informático Forense:</Text>
          <Text style={pdfStyles.fieldValue}>{formatCleanValue(c.peritoLider, 'Ing. Perito Forense Digital')}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Solicitante / Despacho:</Text>
          <Text style={pdfStyles.fieldValue}>{formatCleanValue(c.fiscal || c.solicitante_nombre, 'Consignación Privada')}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Fecha de Emisión del Dictamen:</Text>
          <Text style={pdfStyles.fieldValue}>{fecha}</Text>
        </View>

        <Text style={pdfStyles.sectionTitle}>II. EVIDENCIA ANALIZADA E INTEGRIDAD SHA-256</Text>
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableHeaderCell, { width: '30%' }]}>Dispositivo / Evidencia</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '70%' }]}>Hash SHA-256 de Validación Criptográfica</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '30%', fontFamily: 'Helvetica-Bold' }]}>
              {formatCleanValue(c.dispositivo_marca ? `${c.dispositivo_marca} ${c.dispositivo_modelo || ''}` : '')}
            </Text>
            <Text style={[pdfStyles.tableCell, { width: '70%', fontSize: 6.5, fontFamily: 'Helvetica' }]}>
              {formatCleanValue(c.hashGenesis, '________________________________________________________________')}
            </Text>
          </View>
        </View>

        <Text style={pdfStyles.sectionTitle}>III. ANÁLISIS TÉCNICO Y PROCEDIMIENTO CIENTÍFICO</Text>
        <Text style={pdfStyles.paragraph}>
          Se realizó la extracción, procesamiento y análisis forense digital cumpliendo estrictamente con los protocolos ISO/IEC 27037:2012, NIST SP 800-86 y el Manual Único de Cadena de Custodia (MUCC-2017). Todos los análisis se ejecutaron sobre una copia de respaldo duplicada bit-a-bit manteniendo inalterada la evidencia original.
        </Text>

        <Text style={pdfStyles.sectionTitle}>IV. CONCLUSIONES PERICIALES Y DICTAMEN FINAL</Text>
        <View style={{ borderWidth: 1, borderColor: '#000000', padding: 8, minHeight: 180, marginBottom: 10 }}>
          <Text style={pdfStyles.paragraph}>
            Con base en los análisis científicos realizados y la verificación ininterrumpida de la cadena de custodia digital, el suscrito Perito dictamina formalmente la validez y autenticidad de los hallazgos informáticos forenses consignados en el expediente N° {numeroExpediente}.
          </Text>
        </View>

        <Text style={pdfStyles.sectionTitle}>V. JURAMENTO Y FIRMA DEL PERITO</Text>
        <View style={pdfStyles.signatureSection}>
          <View style={[pdfStyles.signatureCard, { width: '100%' }]}>
            <View style={pdfStyles.thumbBox}>
              <Text style={pdfStyles.thumbText}>PULGAR DER.</Text>
            </View>
            <View style={pdfStyles.signatureLine} />
            <Text style={pdfStyles.signatureLabel}>ING. PERITO INFORMÁTICO FORENSE DIGITAL</Text>
            <Text style={{ fontSize: 7, marginTop: 2 }}>{formatCleanValue(c.peritoLider, 'Ing. Perito Forense Digital')}</Text>
            <Text style={{ fontSize: 6.5, color: '#666666' }}>CIV N°: ___________ / INPREABOGADO: ___________</Text>
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
