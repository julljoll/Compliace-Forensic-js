import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { pdfStyles } from '../reactPdfStyles';

interface Props {
  caso: any;
}

export const ActaEntrevistaPdf: React.FC<Props> = ({ caso }) => {
  const c = caso || {};
  const numeroExpediente = c.numeroCaso || '[EXPEDIENTE]';
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
          <Text style={pdfStyles.fieldValue}>{c.solicitante_nombre || '[Apellidos y Nombres del Entrevistado]'}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Cédula de Identidad / Pasaporte:</Text>
          <Text style={pdfStyles.fieldValue}>{c.solicitante_cedula || '[Cédula de Identidad]'}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Teléfono de Contacto Principal:</Text>
          <Text style={pdfStyles.fieldValue}>{c.dispositivo_numero_tel || '[Teléfono de Contacto]'}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Correo Electrónico:</Text>
          <Text style={pdfStyles.fieldValue}>{c.correo_investigar || '[Correo Electrónico]'}</Text>
        </View>

        <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', marginTop: 4, marginBottom: 2 }}>
          Condición / Rol en la Investigación:
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 4 }}>
          <View style={pdfStyles.checkboxContainer}>
            <View style={pdfStyles.checkboxBox}><Text style={pdfStyles.checkboxCheck}>X</Text></View>
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
          <Text style={pdfStyles.fieldValue}>{c.dispositivo_marca || 'Samsung'} {c.dispositivo_modelo || 'S21'}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Serial / IMEI:</Text>
          <Text style={pdfStyles.fieldValue}>{c.dispositivo_imei || '[Serial / IMEI]'}</Text>
        </View>

        <Text style={pdfStyles.sectionTitle}>III. DECLARACIÓN TÉCNICO-PERICIAL DEL ENTREVISTADO</Text>
        <View style={{ borderWidth: 1, borderColor: '#000000', padding: 8, minHeight: 220, marginBottom: 10 }}>
          <Text style={pdfStyles.paragraph}>
            Comparece el entrevistado manifestando los antecedentes técnicos del dispositivo, contraseñas de acceso proporcionadas voluntariamente y pormenores de los hechos objeto de la investigación forense digital. Declara bajo juramento la autenticidad de la información consignada.
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
            <Text style={{ fontSize: 7, marginTop: 2 }}>C.I.: {c.solicitante_cedula || '___________________'}</Text>
          </View>

          <View style={pdfStyles.signatureCard}>
            <View style={pdfStyles.thumbBox}>
              <Text style={pdfStyles.thumbText}>PULGAR DER.</Text>
            </View>
            <View style={pdfStyles.signatureLine} />
            <Text style={pdfStyles.signatureLabel}>PERITO ENTREVISTADOR</Text>
            <Text style={{ fontSize: 7, marginTop: 2 }}>{c.peritoLider || 'Ing. Perito Forense Digital'}</Text>
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
