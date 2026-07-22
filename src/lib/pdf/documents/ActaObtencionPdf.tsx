import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { pdfStyles } from '../reactPdfStyles';

interface Props {
  caso: any;
  tipoEvidencia?: 'dispositivo_movil' | 'equipo_computo';
}

export const ActaObtencionPdf: React.FC<Props> = ({ caso }) => {
  const c = caso || {};
  const numeroExpediente = c.numeroCaso || '[EXPEDIENTE]';
  const fecha = new Date().toLocaleDateString('es-VE', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Document title={`Acta_Obtencion_Movil_${numeroExpediente}`}>
      {/* PÁGINA 1: IDENTIFICACIÓN DEL CONSIGNANTE Y EVIDENCIA MÓVIL */}
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
          <Text style={pdfStyles.mainTitle}>ACTA DE OBTENCIÓN POR CONSIGNACIÓN (DISPOSITIVO MÓVIL)</Text>
          <Text style={pdfStyles.subTitle}>INCORPORACIÓN A CADENA DE CUSTODIA CONFORME AL MUCC-2017 & ARTS. 187, 225 COPP</Text>
          <View style={pdfStyles.expedienteBox}>
            <Text>EXPEDIENTE N°: {numeroExpediente} | PRCC N°: {c.numeroPRCC || `PRCC-2026-${numeroExpediente}`}</Text>
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
        <Text style={pdfStyles.sectionTitle}>I. IDENTIFICACIÓN COMPLETA DEL CONSIGNANTE (ENTREGA VOLUNTARIA)</Text>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Apellidos y Nombres:</Text>
          <Text style={pdfStyles.fieldValue}>{c.solicitante_nombre || '[Apellidos y Nombres del Consignante]'}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Cédula de Identidad / RIF:</Text>
          <Text style={pdfStyles.fieldValue}>{c.solicitante_cedula || '[Cédula de Identidad / RIF]'}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Teléfono de Contacto:</Text>
          <Text style={pdfStyles.fieldValue}>{c.dispositivo_numero_tel || '[Teléfono de Contacto]'}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Correo Electrónico:</Text>
          <Text style={pdfStyles.fieldValue}>{c.correo_investigar || '[Correo Electrónico de Contacto]'}</Text>
        </View>

        <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', marginTop: 3, marginBottom: 2 }}>
          Carácter / Condición Jurídica del Consignante (MUCC-2017):
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 4 }}>
          <View style={pdfStyles.checkboxContainer}>
            <View style={pdfStyles.checkboxBox}><Text style={pdfStyles.checkboxCheck}>X</Text></View>
            <Text style={{ fontSize: 7.5 }}>Propietario Legítimo</Text>
          </View>
          <View style={pdfStyles.checkboxContainer}>
            <View style={pdfStyles.checkboxBox}><Text style={pdfStyles.checkboxCheck}></Text></View>
            <Text style={{ fontSize: 7.5 }}>Representante Legal (Poder)</Text>
          </View>
          <View style={pdfStyles.checkboxContainer}>
            <View style={pdfStyles.checkboxBox}><Text style={pdfStyles.checkboxCheck}></Text></View>
            <Text style={{ fontSize: 7.5 }}>Custodio Corporativo (Empleado)</Text>
          </View>
          <View style={pdfStyles.checkboxContainer}>
            <View style={pdfStyles.checkboxBox}><Text style={pdfStyles.checkboxCheck}></Text></View>
            <Text style={{ fontSize: 7.5 }}>Poseedor Autorizado</Text>
          </View>
        </View>

        {/* II. ESPECIFICACIÓN TÉCNICA DEL TELÉFONO MÓVIL */}
        <Text style={pdfStyles.sectionTitle}>II. DESCRIPCIÓN TÉCNICA RIGUROSA DEL TELÉFONO MÓVIL (NIST SP 800-101)</Text>
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableHeaderCell, { width: '35%' }]}>Parámetro de Evidencia Móvil</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '65%' }]}>Especificación Registrada en Laboratorio</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>Marca / Modelo Comercial / Técnico</Text>
            <Text style={[pdfStyles.tableCell, { width: '65%' }]}>{c.dispositivo_marca || 'Samsung'} {c.dispositivo_modelo || 'Galaxy S21 (SM-G991B)'}</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>IMEI 1 (Slot Principal)</Text>
            <Text style={[pdfStyles.tableCell, { width: '65%' }]}>{c.dispositivo_imei || '358921098471209'}</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>IMEI 2 (Slot Secundario / eSIM)</Text>
            <Text style={[pdfStyles.tableCell, { width: '65%' }]}>{c.dispositivo_imei2 || '358921098471217 (N/A)'}</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>N° de Serie Fabricante (S/N)</Text>
            <Text style={[pdfStyles.tableCell, { width: '65%' }]}>{c.dispositivo_serial || 'R58M10ABCXYZ'}</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>N° de Línea / Operadora / SIM ICCID</Text>
            <Text style={[pdfStyles.tableCell, { width: '65%' }]}>
              {c.dispositivo_numero_tel || '0414-1234567'} | Movistar (ICCID: 895804109283719283F)
            </Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>Tarjeta MicroSD Externa</Text>
            <Text style={[pdfStyles.tableCell, { width: '65%' }]}>Presente (SanDisk Ultra 64GB MicroSDXC - S/N: SD64G9812)</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>Estado Físico / Pantalla / Batería</Text>
            <Text style={[pdfStyles.tableCell, { width: '65%' }]}>Operativo / Pantalla Intacta / Batería Integrada (85% Carga)</Text>
          </View>
        </View>

        {/* III. PROTOCOLO DE AISLAMIENTO Y PRESERVA */}
        <Text style={pdfStyles.sectionTitle}>III. AISLAMIENTO ELECTROMAGNÉTICO Y PRECINTO (ISO 27037)</Text>
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>Bolsa / Embalaje Faraday</Text>
            <Text style={[pdfStyles.tableCell, { width: '65%' }]}>Bolsa Faraday RF-Shielding N° Serial: FAR-2026-9912</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>Aislamiento de Redes RF</Text>
            <Text style={[pdfStyles.tableCell, { width: '65%' }]}>Modo Avión Activado / WiFi Apagado / Bluetooth Apagado / SIM Extraída</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>Precinto de Seguridad Inalterable</Text>
            <Text style={[pdfStyles.tableCell, { width: '65%' }]}>N° Precinto: PREC-2026-8812 (Estado: Intacto / Sin Violación)</Text>
          </View>
        </View>

        {/* IV. INTEGRIDAD FORENSE SHA-256 */}
        <Text style={pdfStyles.sectionTitle}>IV. INTEGRIDAD FORENSE CRIPTOGRÁFICA GÉNESIS (SHA-256)</Text>
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>Hash SHA-256 Génesis</Text>
            <Text style={[pdfStyles.tableCell, { width: '65%', fontSize: 6.5, fontFamily: 'Helvetica' }]}>
              {c.hashGenesis || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
            </Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>Hash MD5 Auxiliar</Text>
            <Text style={[pdfStyles.tableCell, { width: '65%', fontSize: 6.5, fontFamily: 'Helvetica' }]}>
              d41d8cd98f00b204e9800998ecf8427e
            </Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>Software / Estación Forense</Text>
            <Text style={[pdfStyles.tableCell, { width: '65%' }]}>Cellebrite UFED Touch 3 / Oxygen Forensic Detective / SHA256.US</Text>
          </View>
        </View>

        <View style={pdfStyles.footer} fixed>
          <Text style={pdfStyles.footerText}>SHA256.US — Laboratorio de Informática Forense & Ciberseguridad</Text>
          <Text style={pdfStyles.footerText}>Página 1 de 2</Text>
        </View>
      </Page>

      {/* PÁGINA 2: CONSENTIMIENTO, ACCESO, PORMENORES Y FIRMAS */}
      <Page size={[612, 936]} style={[pdfStyles.page, { paddingTop: 42.52 }]}>
        {/* V. DECLARACIÓN DE CONSENTIMIENTO Y ALCANCE */}
        <Text style={pdfStyles.sectionTitle}>V. DECLARACIÓN DE CONSENTIMIENTO VOLUNTARIO Y ALCANCE LEGAL</Text>
        <Text style={pdfStyles.paragraph}>
          Yo, el consignante arriba identificado, en pleno uso de mis facultades mentales y actuando libremente, hago entrega material voluntaria (Obtención por Consignación Directa Privada) del teléfono móvil descrito conforme al Manual Único de Cadena de Custodia (MUCC-2017) y Arts. 187 y 225 del COPP. Declaro bajo juramento que realizo esta consignación LIBRE DE TODA COACCIÓN, VIOLENCIA, DOLO O AMENAZA. AUTORIZO EXPRESA Y VOLUNTARIAMENTE al equipo pericial de SHA256.US para la extracción lógica/física de Mensajes de Datos (Art. 4, Ley sobre Mensajes de Datos y Firmas Electrónicas), duplicación pericial y análisis forense delimitado.
        </Text>

        <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', marginTop: 4, marginBottom: 2 }}>
          Alcance Delimitado del Análisis Forense Móvil:
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 4 }}>
          <View style={pdfStyles.checkboxContainer}>
            <View style={pdfStyles.checkboxBox}><Text style={pdfStyles.checkboxCheck}>X</Text></View>
            <Text style={{ fontSize: 7.5 }}>Extracción Completa (WhatsApp, Llamadas, SMS, Galería, Correos)</Text>
          </View>
          <View style={pdfStyles.checkboxContainer}>
            <View style={pdfStyles.checkboxBox}><Text style={pdfStyles.checkboxCheck}></Text></View>
            <Text style={{ fontSize: 7.5 }}>Extracción Delimitada a Aplicación Específica (WhatsApp / Telegram)</Text>
          </View>
        </View>

        {/* VI. REQUERIMIENTOS DE ACCESO */}
        <Text style={pdfStyles.sectionTitle}>VI. REQUERIMIENTOS DE ACCESO (CREDENCIALES PROPORCIONADAS)</Text>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>PIN / Contraseña Desbloqueo:</Text>
          <Text style={pdfStyles.fieldValue}>Proporcionado voluntariamente por el consignante en sobre cerrado</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>PIN / PUK Tarjeta SIM:</Text>
          <Text style={pdfStyles.fieldValue}>PIN: 1234 / PUK: 87654321</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Cuenta Google / Apple ID:</Text>
          <Text style={pdfStyles.fieldValue}>Desvinculada antes de la entrega / Credenciales autorizadas para respaldo</Text>
        </View>

        {/* VII. MOTIVO DE CONSIGNACIÓN */}
        <Text style={pdfStyles.sectionTitle}>VII. MOTIVO DE LA CONSIGNACIÓN Y PORMENORES DEL CASO</Text>
        <View style={{ borderWidth: 1, borderColor: '#000000', padding: 8, minHeight: 140, marginBottom: 10 }}>
          <Text style={pdfStyles.paragraph}>
            {c.descripcion || 'Consignación voluntaria de teléfono celular para la extracción pericial de mensajes de datos, chats de WhatsApp, registro de llamadas e imágenes multimedia, preservación de integridad mediante hash SHA-256 e incorporación al registro de cadena de custodia para fines probatorios.'}
          </Text>
        </View>

        {/* VIII. FIRMAS Y DACTILAR */}
        <Text style={pdfStyles.sectionTitle}>VIII. CERTIFICACIÓN PERICIAL, FIRMAS Y REGISTRO DACTILAR</Text>
        <View style={pdfStyles.signatureSection}>
          <View style={pdfStyles.signatureCard}>
            <View style={{ flexDirection: 'row', gap: 6, marginBottom: 4 }}>
              <View style={pdfStyles.thumbBox}>
                <Text style={pdfStyles.thumbText}>PULGAR DER.</Text>
              </View>
              <View style={pdfStyles.thumbBox}>
                <Text style={pdfStyles.thumbText}>PULGAR IZQ.</Text>
              </View>
            </View>
            <View style={pdfStyles.signatureLine} />
            <Text style={pdfStyles.signatureLabel}>FIRMA DEL CONSIGNANTE</Text>
            <Text style={{ fontSize: 7, marginTop: 2 }}>C.I.: {c.solicitante_cedula || '___________________'}</Text>
          </View>

          <View style={pdfStyles.signatureCard}>
            <View style={{ flexDirection: 'row', gap: 6, marginBottom: 4 }}>
              <View style={pdfStyles.thumbBox}>
                <Text style={pdfStyles.thumbText}>PULGAR DER.</Text>
              </View>
              <View style={pdfStyles.thumbBox}>
                <Text style={pdfStyles.thumbText}>PULGAR IZQ.</Text>
              </View>
            </View>
            <View style={pdfStyles.signatureLine} />
            <Text style={pdfStyles.signatureLabel}>PERITO INFORMÁTICO FORENSE</Text>
            <Text style={{ fontSize: 7, marginTop: 2 }}>{c.peritoLider || 'Ing. Perito Forense Digital'}</Text>
            <Text style={{ fontSize: 6.5, color: '#666666' }}>CIV N°: [CIV] | INPREABOGADO: [INPRE]</Text>
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
