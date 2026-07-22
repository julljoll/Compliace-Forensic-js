import React from 'react';
import { Document, Page, Text, View, Image } from '@react-pdf/renderer';
import { pdfStyles, formatCleanValue } from '../reactPdfStyles';

interface Props {
  caso: any;
}

export const ActaEntrevistaPdf: React.FC<Props> = ({ caso }) => {
  const c = caso || {};
  const numeroExpediente = formatCleanValue(c.numeroCaso, '___________________');
  const fecha = new Date().toLocaleDateString('es-VE', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Document title={`Acta_Entrevista_${c.numeroCaso || 'EXP'}`}>
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
          <Text style={pdfStyles.mainTitle}>ACTA DE ENTREVISTA TÉCNICO-PERICIAL</Text>
          <Text style={pdfStyles.subTitle}>ENTREVISTA DE CONTEXTO TÉCNICO Y ANTECEDENTES DEL CASO</Text>
          <View style={pdfStyles.expedienteBox}>
            <Text>EXPEDIENTE N°: {numeroExpediente}</Text>
          </View>
        </View>

        <Text style={pdfStyles.sectionTitle}>DATOS DE LA ACTUACIÓN PERICIAL</Text>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Lugar de Actuación / Sede:</Text>
          <Text style={pdfStyles.fieldValue}>Lara, Venezuela — Laboratorio Forense SHA256.US</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Fecha y Hora de la Entrevista:</Text>
          <Text style={pdfStyles.fieldValue}>{fecha}</Text>
        </View>

        <Text style={pdfStyles.sectionTitle}>I. DATOS E IDENTIFICACIÓN DEL ENTREVISTADO</Text>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Apellidos y Nombres:</Text>
          <Text style={pdfStyles.fieldValue}>{formatCleanValue(c.solicitante_nombre)}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Cédula de Identidad / Pasaporte:</Text>
          <Text style={pdfStyles.fieldValue}>{formatCleanValue(c.solicitante_cedula, '______________________')}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Teléfono de Contacto Principal:</Text>
          <Text style={pdfStyles.fieldValue}>{formatCleanValue(c.dispositivo_numero_tel, '______________________')}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Correo Electrónico:</Text>
          <Text style={pdfStyles.fieldValue}>{formatCleanValue(c.correo_investigar, '______________________')}</Text>
        </View>

        <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', marginTop: 4, marginBottom: 2 }}>
          Condición / Rol en la Investigación:
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 4 }}>
          <View style={pdfStyles.checkboxContainer}>
            <View style={pdfStyles.checkboxBox}><Text style={pdfStyles.checkboxCheck}>{c.solicitante_nombre ? 'X' : ''}</Text></View>
            <Text style={{ fontSize: 7.5 }}>Víctima</Text>
          </View>
          <View style={pdfStyles.checkboxContainer}>
            <View style={pdfStyles.checkboxBox}><Text style={pdfStyles.checkboxCheck}></Text></View>
            <Text style={{ fontSize: 7.5 }}>Testigo / Denunciante</Text>
          </View>
          <View style={pdfStyles.checkboxContainer}>
            <View style={pdfStyles.checkboxBox}><Text style={pdfStyles.checkboxCheck}></Text></View>
            <Text style={{ fontSize: 7.5 }}>Propietario de la Evidencia</Text>
          </View>
        </View>

        <Text style={pdfStyles.sectionTitle}>II. RELACIÓN DEL DISPOSITIVO Y CUENTAS ASOCIADAS</Text>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Equipo / Evidencia:</Text>
          <Text style={pdfStyles.fieldValue}>{formatCleanValue(c.dispositivo_marca ? `${c.dispositivo_marca} ${c.dispositivo_modelo || ''}` : '')}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Serial / IMEI:</Text>
          <Text style={pdfStyles.fieldValue}>{formatCleanValue(c.dispositivo_imei, '___________________________')}</Text>
        </View>

        <Text style={pdfStyles.sectionTitle}>III. DECLARACIÓN TÉCNICO-PERICIAL DEL ENTREVISTADO</Text>
        <View style={{ borderWidth: 1, borderColor: '#000000', padding: 8, minHeight: 220, marginBottom: 10 }}>
          <Text style={pdfStyles.paragraph}>
            ________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
          </Text>
        </View>

        <Text style={pdfStyles.sectionTitle}>IV. FIRMAS DE CONFORMIDAD</Text>
        <View style={pdfStyles.signatureSection}>
          <View style={pdfStyles.signatureCard}>
            <View style={pdfStyles.thumbBox}>
              <Text style={pdfStyles.thumbText}>PULGAR DER.</Text>
            </View>
            <View style={pdfStyles.signatureLine} />
            <Text style={pdfStyles.signatureLabel}>FIRMA DEL ENTREVISTADO</Text>
            <Text style={{ fontSize: 7, marginTop: 2 }}>C.I.: {formatCleanValue(c.solicitante_cedula, '___________________')}</Text>
          </View>

          <View style={pdfStyles.signatureCard}>
            <View style={pdfStyles.thumbBox}>
              <Text style={pdfStyles.thumbText}>PULGAR DER.</Text>
            </View>
            <View style={pdfStyles.signatureLine} />
            <Text style={pdfStyles.signatureLabel}>PERITO ENTREVISTADOR</Text>
            <Text style={{ fontSize: 7, marginTop: 2 }}>{formatCleanValue(c.peritoLider, 'Ing. Perito Forense Digital')}</Text>
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
