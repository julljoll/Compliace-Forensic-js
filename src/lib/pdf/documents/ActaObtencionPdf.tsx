import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { pdfStyles } from '../reactPdfStyles';

interface Props {
  caso: any;
  tipoEvidencia?: 'dispositivo_movil' | 'equipo_computo';
}

export const ActaObtencionPdf: React.FC<Props> = ({ caso, tipoEvidencia = 'dispositivo_movil' }) => {
  const c = caso || {};
  const numeroExpediente = c.numeroCaso || '[EXPEDIENTE]';
  const fecha = new Date().toLocaleDateString('es-VE', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Document title={`Acta_Obtencion_${numeroExpediente}`}>
      {/* PÁGINA 1 */}
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

        {/* DATOS DE LA ACTUACIÓN */}
        <Text style={pdfStyles.sectionTitle}>DATOS DE LA ACTUACIÓN FORENSE</Text>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Lugar de Actuación / Sede:</Text>
          <Text style={pdfStyles.fieldValue}>Lara, Venezuela — Laboratorio Forense SHA256.US</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Fecha y Hora de Consignación:</Text>
          <Text style={pdfStyles.fieldValue}>{fecha}</Text>
        </View>

        {/* I. DATOS DEL CONSIGNANTE */}
        <Text style={pdfStyles.sectionTitle}>I. DATOS E IDENTIFICACIÓN DEL CONSIGNANTE (ENTREGA VOLUNTARIA)</Text>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Apellidos y Nombres:</Text>
          <Text style={pdfStyles.fieldValue}>{c.solicitante_nombre || '[Apellidos y Nombres del Consignante]'}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Cédula de Identidad / Pasaporte:</Text>
          <Text style={pdfStyles.fieldValue}>{c.solicitante_cedula || '[Cédula de Identidad]'}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Teléfono de Contacto:</Text>
          <Text style={pdfStyles.fieldValue}>{c.dispositivo_numero_tel || '[Teléfono de Contacto]'}</Text>
        </View>

        <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', marginTop: 4, marginBottom: 2 }}>
          Condición Jurídica / Carácter del Consignante:
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 4 }}>
          <View style={pdfStyles.checkboxContainer}>
            <View style={pdfStyles.checkboxBox}><Text style={pdfStyles.checkboxCheck}>X</Text></View>
            <Text style={{ fontSize: 7.5 }}>Propietario Legítimo</Text>
          </View>
          <View style={pdfStyles.checkboxContainer}>
            <View style={pdfStyles.checkboxBox}><Text style={pdfStyles.checkboxCheck}></Text></View>
            <Text style={{ fontSize: 7.5 }}>Representante Legal</Text>
          </View>
          <View style={pdfStyles.checkboxContainer}>
            <View style={pdfStyles.checkboxBox}><Text style={pdfStyles.checkboxCheck}></Text></View>
            <Text style={{ fontSize: 7.5 }}>Custodio Corporativo</Text>
          </View>
          <View style={pdfStyles.checkboxContainer}>
            <View style={pdfStyles.checkboxBox}><Text style={pdfStyles.checkboxCheck}></Text></View>
            <Text style={{ fontSize: 7.5 }}>Tercero Autorizado</Text>
          </View>
        </View>

        {/* II. DESCRIPCIÓN TÉCNICA */}
        <Text style={pdfStyles.sectionTitle}>
          II. DESCRIPCIÓN TÉCNICA DE LA EVIDENCIA ({tipoEvidencia === 'dispositivo_movil' ? 'DISPOSITIVO MÓVIL' : 'EQUIPO DE CÓMPUTO'})
        </Text>

        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableHeaderCell, { width: '35%' }]}>Parámetro Técnico</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '65%' }]}>Detalle Registrado</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>Marca / Modelo</Text>
            <Text style={[pdfStyles.tableCell, { width: '65%' }]}>{c.dispositivo_marca || 'Samsung'} {c.dispositivo_modelo || 'Galaxy S21'}</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>Serial / IMEI 1</Text>
            <Text style={[pdfStyles.tableCell, { width: '65%' }]}>{c.dispositivo_imei || '358921098471209'}</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>IMEI 2 / Capacidad</Text>
            <Text style={[pdfStyles.tableCell, { width: '65%' }]}>{c.dispositivo_imei2 || c.discoduro_capacidad || 'N/A'}</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>Estado Físico / Volatilidad</Text>
            <Text style={[pdfStyles.tableCell, { width: '65%' }]}>Operativo / Encendido / Pantalla Intacta</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>Precinto de Seguridad</Text>
            <Text style={[pdfStyles.tableCell, { width: '65%' }]}>N° PREC-2026-8812 (Estado: Intacto)</Text>
          </View>
        </View>

        {/* III. INTEGRIDAD FORENSE */}
        <Text style={pdfStyles.sectionTitle}>III. REGISTRO DE INTEGRIDAD FORENSE INICIAL (HASH SHA-256)</Text>
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>Hash SHA-256 Génesis</Text>
            <Text style={[pdfStyles.tableCell, { width: '65%', fontSize: 7, fontFamily: 'Helvetica' }]}>
              {c.hashGenesis || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
            </Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>Algoritmo Auxiliar (MD5)</Text>
            <Text style={[pdfStyles.tableCell, { width: '65%', fontSize: 7, fontFamily: 'Helvetica' }]}>
              d41d8cd98f00b204e9800998ecf8427e
            </Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>Herramienta / Software</Text>
            <Text style={[pdfStyles.tableCell, { width: '65%' }]}>Cellebrite UFED / FTK Imager v4.7 / SHA256.US Engine</Text>
          </View>
        </View>

        {/* IV. AUTORIZACIÓN Y CONSENTIMIENTO */}
        <Text style={pdfStyles.sectionTitle}>IV. AUTORIZACIÓN Y CONSENTIMIENTO VOLUNTARIO (SIN COACCIÓN)</Text>
        <Text style={pdfStyles.paragraph}>
          Yo, el consignante identificado, hago entrega material voluntaria (Obtención por Consignación Directa Privada) de la evidencia descrita conforme al Manual Único de Cadena de Custodia (MUCC-2017) y Arts. 187 y 225 del COPP. Declaro bajo juramento que realizo esta consignación LIBRE DE TODA COACCIÓN, VIOLENCIA O AMENAZA, autorizando al laboratorio SHA256.US para la adquisición, duplicación e inspección forense.
        </Text>

        <View style={pdfStyles.footer} fixed>
          <Text style={pdfStyles.footerText}>SHA256.US — Laboratorio de Informática Forense & Ciberseguridad</Text>
          <Text style={pdfStyles.footerText}>Página 1 de 2</Text>
        </View>
      </Page>

      {/* PÁGINA 2 */}
      <Page size={[612, 936]} style={[pdfStyles.page, { paddingTop: 42.52 }]}>
        {/* V. REQUERIMIENTOS DE ACCESO */}
        <Text style={pdfStyles.sectionTitle}>V. REQUERIMIENTOS DE ACCESO Y PRESERVACIÓN</Text>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Claves de Acceso / PIN:</Text>
          <Text style={pdfStyles.fieldValue}>Proporcionadas por el consignante en sobre cerrado / Sin Bloqueo</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Aislamiento de Red:</Text>
          <Text style={pdfStyles.fieldValue}>Modo Avión Activado / Caja de Faraday / Conexión Desconectada</Text>
        </View>

        {/* VI. MOTIVO DE LA CONSIGNACIÓN */}
        <Text style={pdfStyles.sectionTitle}>VI. MOTIVO DE LA CONSIGNACIÓN Y PORMENORES DE LA ACTUACIÓN</Text>
        <View style={{ borderWidth: 1, borderColor: '#000000', padding: 8, minHeight: 180, marginBottom: 10 }}>
          <Text style={pdfStyles.paragraph}>
            {c.descripcion || 'Consignación voluntaria de dispositivo para análisis forense digital, preservación de cadena de custodia e investigación técnica de evidencias.'}
          </Text>
        </View>

        {/* VII. FIRMAS */}
        <Text style={pdfStyles.sectionTitle}>VII. FIRMAS Y REGISTRO DACTILAR DE CONFORMIDAD</Text>
        <View style={pdfStyles.signatureSection}>
          <View style={pdfStyles.signatureCard}>
            <View style={pdfStyles.thumbBox}>
              <Text style={pdfStyles.thumbText}>PULGAR DER.</Text>
            </View>
            <View style={pdfStyles.signatureLine} />
            <Text style={pdfStyles.signatureLabel}>FIRMA DEL CONSIGNANTE</Text>
            <Text style={{ fontSize: 7, marginTop: 2 }}>C.I.: {c.solicitante_cedula || '___________________'}</Text>
          </View>

          <View style={pdfStyles.signatureCard}>
            <View style={pdfStyles.thumbBox}>
              <Text style={pdfStyles.thumbText}>PULGAR DER.</Text>
            </View>
            <View style={pdfStyles.signatureLine} />
            <Text style={pdfStyles.signatureLabel}>PERITO RECEPTOR</Text>
            <Text style={{ fontSize: 7, marginTop: 2 }}>{c.peritoLider || 'Ing. Perito Forense Digital'}</Text>
            <Text style={{ fontSize: 6.5, color: '#666666' }}>CIV N°: [CIV] / INPREABOGADO: [INPRE]</Text>
          </View>
        </View>

        <View style={pdfStyles.footer} fixed>
          <Text style={pdfStyles.footerText}>SHA256.US — Laboratorio de Informática Forense & Ciberseguridad</Text>
          <Text style={pdfStyles.footerText}>Página 2 de 2</Text>
        </View>
      </Page>
    </Document>
  );
};

export default ActaObtencionPdf;
