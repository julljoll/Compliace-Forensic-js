import React from 'react';
import { Document, Page, Text, View, Image } from '@react-pdf/renderer';
import { pdfStyles, formatCleanValue } from '../reactPdfStyles';

interface Props {
  caso: any;
  tipoEvidencia?: 'dispositivo_movil' | 'equipo_computo';
}

export const ActaObtencionPdf: React.FC<Props> = ({ caso }) => {
  const c = caso || {};
  const numeroExpediente = formatCleanValue(c.numeroCaso, '___________________');
  const fecha = new Date().toLocaleDateString('es-VE', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Document title={`Acta_Obtencion_Movil_${c.numeroCaso || 'EXP'}`}>
      {/* PÁGINA 1 */}
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

        {/* Title */}
        <View style={pdfStyles.titleBlock}>
          <Text style={pdfStyles.mainTitle}>ACTA DE OBTENCIÓN POR CONSIGNACIÓN (DISPOSITIVO MÓVIL)</Text>
          <Text style={pdfStyles.subTitle}>INCORPORACIÓN A CADENA DE CUSTODIA CONFORME AL MUCC-2017 & ARTS. 187, 225 COPP</Text>
          <View style={pdfStyles.expedienteBox}>
            <Text>EXPEDIENTE N°: {numeroExpediente} | PRCC N°: {formatCleanValue(c.numeroPRCC, '___________________')}</Text>
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
          <Text style={pdfStyles.fieldValue}>{formatCleanValue(c.solicitante_nombre)}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Cédula de Identidad / RIF:</Text>
          <Text style={pdfStyles.fieldValue}>{formatCleanValue(c.solicitante_cedula, '______________________')}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Teléfono de Contacto:</Text>
          <Text style={pdfStyles.fieldValue}>{formatCleanValue(c.dispositivo_numero_tel, '______________________')}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Correo Electrónico:</Text>
          <Text style={pdfStyles.fieldValue}>{formatCleanValue(c.correo_investigar, '______________________')}</Text>
        </View>

        <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', marginTop: 3, marginBottom: 2 }}>
          Carácter / Condición Jurídica del Consignante (MUCC-2017):
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 4 }}>
          <View style={pdfStyles.checkboxContainer}>
            <View style={pdfStyles.checkboxBox}><Text style={pdfStyles.checkboxCheck}>{c.solicitante_nombre ? 'X' : ''}</Text></View>
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
            <Text style={[pdfStyles.tableCell, { width: '65%' }]}>{formatCleanValue(c.dispositivo_marca ? `${c.dispositivo_marca} ${c.dispositivo_modelo || ''}` : '')}</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>IMEI 1 (Slot Principal)</Text>
            <Text style={[pdfStyles.tableCell, { width: '65%' }]}>{formatCleanValue(c.dispositivo_imei, '___________________________')}</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>IMEI 2 (Slot Secundario / eSIM)</Text>
            <Text style={[pdfStyles.tableCell, { width: '65%' }]}>{formatCleanValue(c.dispositivo_imei2, '___________________________')}</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>N° de Serie Fabricante (S/N)</Text>
            <Text style={[pdfStyles.tableCell, { width: '65%' }]}>{formatCleanValue(c.dispositivo_serial, '___________________________')}</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>N° de Línea / Operadora / SIM ICCID</Text>
            <Text style={[pdfStyles.tableCell, { width: '65%' }]}>
              {formatCleanValue(c.dispositivo_numero_tel, '_____________________')} | Operadora: Movistar/Digitel (ICCID: ____________)
            </Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>Estado Físico / Pantalla / Batería</Text>
            <Text style={[pdfStyles.tableCell, { width: '65%' }]}>Operativo / Pantalla Intacta / Batería Integrada</Text>
          </View>
        </View>

        {/* III. PROTOCOLO DE AISLAMIENTO */}
        <Text style={pdfStyles.sectionTitle}>III. AISLAMIENTO ELECTROMAGNÉTICO Y PRECINTO (ISO 27037)</Text>
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>Bolsa / Embalaje Faraday</Text>
            <Text style={[pdfStyles.tableCell, { width: '65%' }]}>Bolsa Faraday RF-Shielding N° Serial: _______________</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>Aislamiento de Redes RF</Text>
            <Text style={[pdfStyles.tableCell, { width: '65%' }]}>Modo Avión Activado / WiFi Apagado / Bluetooth Apagado / SIM Extraída</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>Precinto de Seguridad Inalterable</Text>
            <Text style={[pdfStyles.tableCell, { width: '65%' }]}>N° Precinto: PREC-2026-______ (Estado: Intacto)</Text>
          </View>
        </View>

        {/* IV. INTEGRIDAD FORENSE SHA-256 */}
        <Text style={pdfStyles.sectionTitle}>IV. INTEGRIDAD FORENSE CRIPTOGRÁFICA GÉNESIS (SHA-256)</Text>
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>Hash SHA-256 Génesis</Text>
            <Text style={[pdfStyles.tableCell, { width: '65%', fontSize: 6.5, fontFamily: 'Helvetica' }]}>
              {formatCleanValue(c.hashGenesis, '________________________________________________________________')}
            </Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>Software / Estación Forense</Text>
            <Text style={[pdfStyles.tableCell, { width: '65%' }]}>Cellebrite UFED / Oxygen Forensic Detective / SHA256.US Engine</Text>
          </View>
        </View>

        <View style={pdfStyles.footer} fixed>
          <Text style={pdfStyles.footerText}>SHA256.US — Laboratorio de Informática Forense & Ciberseguridad</Text>
          <Text style={pdfStyles.footerText}>Página 1 de 2</Text>
        </View>
      </Page>

      {/* PÁGINA 2: CONSENTIMIENTO, PORMENORES Y FIRMAS */}
      <Page size={[612, 936]} style={[pdfStyles.page, { paddingTop: 42.52 }]}>
        {/* V. DECLARACIÓN DE CONSENTIMIENTO */}
        <Text style={pdfStyles.sectionTitle}>V. DECLARACIÓN DE CONSENTIMIENTO VOLUNTARIO Y ALCANCE LEGAL</Text>
        <Text style={pdfStyles.paragraph}>
          Yo, el consignante arriba identificado, en pleno uso de mis facultades mentales y actuando libremente, hago entrega material voluntaria (Obtención por Consignación Directa Privada) del teléfono móvil descrito conforme al Manual Único de Cadena de Custodia (MUCC-2017) y Arts. 187 y 225 del COPP. Declaro bajo juramento que realizo esta consignación LIBRE DE TODA COACCIÓN, VIOLENCIA, DOLO O AMENAZA. AUTORIZO EXPRESA Y VOLUNTARIAMENTE al equipo pericial de SHA256.US para la extracción lógica/física de Mensajes de Datos (Art. 4, Ley sobre Mensajes de Datos y Firmas Electrónicas), duplicación pericial y análisis forense delimitado.
        </Text>

        {/* VI. REQUERIMIENTOS DE ACCESO */}
        <Text style={pdfStyles.sectionTitle}>VI. REQUERIMIENTOS DE ACCESO (CREDENCIALES PROPORCIONADAS)</Text>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>PIN / Contraseña Desbloqueo:</Text>
          <Text style={pdfStyles.fieldValue}>Proporcionado voluntariamente por el consignante / Sin Bloqueo</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>PIN / PUK Tarjeta SIM:</Text>
          <Text style={pdfStyles.fieldValue}>PIN: _______ / PUK: ______________</Text>
        </View>

        {/* VII. MOTIVO DE CONSIGNACIÓN */}
        <Text style={pdfStyles.sectionTitle}>VII. MOTIVO DE LA CONSIGNACIÓN Y PORMENORES DEL CASO</Text>
        <View style={{ borderWidth: 1, borderColor: '#000000', padding: 8, minHeight: 160, marginBottom: 10 }}>
          <Text style={pdfStyles.paragraph}>
            {c.descripcion && !c.descripcion.startsWith('[') ? c.descripcion : '________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________'}
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
            <Text style={{ fontSize: 7, marginTop: 2 }}>C.I.: {formatCleanValue(c.solicitante_cedula, '___________________')}</Text>
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
            <Text style={{ fontSize: 7, marginTop: 2 }}>{formatCleanValue(c.peritoLider, 'Ing. Perito Forense Digital')}</Text>
            <Text style={{ fontSize: 6.5, color: '#666666' }}>CIV N°: ___________ | INPREABOGADO: ___________</Text>
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
