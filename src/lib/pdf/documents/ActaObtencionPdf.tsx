import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { pdfStyles } from '../reactPdfStyles';

interface Props {
  caso: any;
  tipoEvidencia?: string;
}

export const ActaObtencionPdf: React.FC<Props> = ({ caso, tipoEvidencia = 'dispositivo_movil' }) => {
  const numeroExpediente = caso?.numeroCaso || '[EXPEDIENTE]';
  const fecha = new Date().toLocaleDateString('es-VE', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Document title={`Acta_Obtencion_${numeroExpediente}`}>
      <Page size={[612, 936]} style={pdfStyles.page}>
        {/* Header */}
        <View style={pdfStyles.headerContainer}>
          <Text style={pdfStyles.logoText}>SHA256.US</Text>
          <Text style={pdfStyles.subLogoText}>LABORATORIO DE INFORMÁTICA FORENSE & CIBERSEGURIDAD</Text>
          <Text style={pdfStyles.addressText}>
            Avenida 6, Edificio Mercantil La Ceiba, Quíbor, Municipio Jiménez, Estado Lara, Venezuela.
          </Text>
        </View>

        {/* Title */}
        <View style={pdfStyles.titleBlock}>
          <Text style={pdfStyles.mainTitle}>ACTA DE OBTENCIÓN POR CONSIGNACIÓN</Text>
          <Text style={pdfStyles.subTitle}>RECEPCIÓN DE EVIDENCIA DIGITAL E INCORPORACIÓN A CADENA DE CUSTODIA</Text>
          <View style={pdfStyles.expedienteBox}>
            <Text>EXPEDIENTE N°: {numeroExpediente}</Text>
          </View>
        </View>

        {/* Section I */}
        <Text style={pdfStyles.sectionTitle}>I. DATOS DE LA ACTUACIÓN Y FECHA</Text>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>FECHA DE CONSIGNACIÓN:</Text>
          <Text style={pdfStyles.fieldValue}>{fecha}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>PERITO RECEPTOR:</Text>
          <Text style={pdfStyles.fieldValue}>{caso?.peritoLider || 'Ing. Perito Forense Digital'}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>DESPACHO / SOLICITANTE:</Text>
          <Text style={pdfStyles.fieldValue}>{caso?.fiscal || 'Consignación Privada'}</Text>
        </View>

        {/* Section II */}
        <Text style={pdfStyles.sectionTitle}>II. IDENTIFICACIÓN DEL CONSIGNANTE Y EVIDENCIA</Text>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>DISPOSITIVO CONSIGNADO:</Text>
          <Text style={pdfStyles.fieldValue}>{tipoEvidencia.toUpperCase()} — {caso?.descripcion || 'Dispositivo de Almacenamiento Digital'}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>MARCA / MODELO:</Text>
          <Text style={pdfStyles.fieldValue}>{caso?.dispositivo_marca || 'N/A'} / {caso?.dispositivo_modelo || 'N/A'}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>SERIAL / IMEI:</Text>
          <Text style={pdfStyles.fieldValue}>{caso?.dispositivo_serial || 'N/A'}</Text>
        </View>

        {/* Section III */}
        <Text style={pdfStyles.sectionTitle}>III. INTEGRIDAD FORENSE Y HASH SHA-256</Text>
        <Text style={pdfStyles.paragraph}>
          Se procede a la adquisición y verificación de integridad criptográfica SHA-256 de la evidencia digital consignada, garantizando la inmutabilidad conforme al estándar ISO/IEC 27037 y la guía MUCC-2017.
        </Text>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>HASH SHA-256:</Text>
          <Text style={pdfStyles.fieldValue}>{caso?.hashGenesis || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}</Text>
        </View>

        {/* Section IV */}
        <Text style={pdfStyles.sectionTitle}>IV. FIRMAS Y REGISTRO DACTILAR</Text>
        <View style={pdfStyles.signatureSection}>
          <View style={pdfStyles.signatureCard}>
            <View style={pdfStyles.thumbBox}>
              <Text style={pdfStyles.thumbText}>PULGAR DERECHO</Text>
            </View>
            <View style={pdfStyles.signatureLine} />
            <Text style={pdfStyles.signatureLabel}>FIRMA DEL CONSIGNANTE</Text>
            <Text style={{ fontSize: 7, marginTop: 2 }}>C.I. / RIF: ___________________</Text>
          </View>

          <View style={pdfStyles.signatureCard}>
            <View style={pdfStyles.thumbBox}>
              <Text style={pdfStyles.thumbText}>PULGAR DERECHO</Text>
            </View>
            <View style={pdfStyles.signatureLine} />
            <Text style={pdfStyles.signatureLabel}>FIRMA DEL PERITO RECEPTOR</Text>
            <Text style={{ fontSize: 7, marginTop: 2 }}>PERITO INFORMÁTICO FORENSE</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={pdfStyles.footer} fixed>
          <Text style={pdfStyles.footerText}>SHA256.US — Laboratorio de Informática Forense & Ciberseguridad</Text>
          <Text style={pdfStyles.footerText}>Página 1 de 1</Text>
        </View>
      </Page>
    </Document>
  );
};

export default ActaObtencionPdf;
