import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { pdfStyles, formatValue } from '../reactPdfStyles';
import { PlanillaHeader, PlanillaFooter } from '../PlanillaHeaderFooter';

interface Props {
  caso?: any;
  isBlankMode?: boolean;
}

export const ActaConsentimientoPdf: React.FC<Props> = ({ caso, isBlankMode = false }) => {
  const c = caso || {};
  const fmt = (val?: string, placeholder: string = '') => formatValue(val, isBlankMode, placeholder);
  const numeroExpediente = fmt(c.numeroCaso, 'EXP-2026-SHA-0091');

  return (
    <Document title={`Acta_Consentimiento_${c.numeroCaso || 'EXP'}`}>
      {/* PÁGINA 1 — ENCABEZADO INSTITUCIONAL */}
      <Page size={[612, 936]} style={pdfStyles.page}>
        <PlanillaHeader />

        <View style={pdfStyles.titleBlock}>
          <Text style={pdfStyles.mainTitle}>ACTA DE CONSENTIMIENTO INFORMADO, AUTORIZACIÓN DE ACCESO Y HÁBEAS DATA</Text>
          <Text style={pdfStyles.subTitle}>DECLARACIÓN JURADA DE LEGITIMACIÓN DE POSESIÓN Y AUTORIZACIÓN EXPRESA DE INSPECCIÓN (ART. 60 CRBV, ARTS. 4 Y 6 LMD FE, ISO 27037)</Text>
          
          <View style={pdfStyles.expedienteBox}>
            <View style={pdfStyles.expedienteSlot}>
              <Text style={pdfStyles.expedienteText}>EXPEDIENTE N°:</Text>
              <View style={pdfStyles.expedienteLine}>
                <Text style={{ fontSize: 8, paddingLeft: 4, fontFamily: 'Helvetica-Bold' }}>{numeroExpediente}</Text>
              </View>
            </View>
            <View style={pdfStyles.expedienteSlot}>
              <Text style={pdfStyles.expedienteText}>PRCC N°:</Text>
              <View style={pdfStyles.expedienteLine}>
                <Text style={{ fontSize: 8, paddingLeft: 4, fontFamily: 'Helvetica-Bold' }}>{fmt(c.numeroPRCC, 'PRCC-2026-0042')}</Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={pdfStyles.sectionTitle}>I. DATOS DEL CONSIGNANTE Y SOLICITANTE LEGÍTIMO</Text>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Apellidos y Nombres:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.solicitante_nombre, 'Carlos Eduardo Mendoza Rivas')}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Cédula de Identidad / RIF:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.solicitante_cedula, 'V-18.492.019 / J-40892810-2')}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Carácter con el que actúa:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.solicitante_caracter, 'Propietario Legítimo y Custodio del Dispositivo')}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Empresa / Entidad Solicitante:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.empresa, 'Inversiones & Servicios Corporativos C.A.')}</Text>
        </View>

        <Text style={pdfStyles.sectionTitle}>II. DISPOSITIVO Y DATOS OBJETOS DE PERITAJE</Text>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Marca, Modelo y Tipo:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.dispositivo_modelo, 'Xiaomi Redmi Note 12 Pro 5G (Model: 22101316G)')}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Número de Serie / IMEI:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.dispositivo_imei || c.dispositivo_serial, 'IMEI: 864920193847102 / S/N: SN-XMI-2026-994812')}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Alcance Autorizado de Inspección:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.alcancePeritaje, 'Extracción física/lógica, decodificación de mensajes WhatsApp, registros de llamadas y análisis de metadatos EXIF')}</Text>
        </View>

        <Text style={pdfStyles.sectionTitle}>III. DECLARACIÓN JURADA DE HÁBEAS DATA Y EXENCIÓN DE RESPONSABILIDAD</Text>
        <View style={{ padding: 6, backgroundColor: '#F8F9FA', borderRadius: 4, marginBottom: 8, borderLeftWidth: 3, borderLeftColor: '#FECF06' }}>
          <Text style={{ fontSize: 7, color: '#111111', lineHeight: 1.4, textAlign: 'justify' }}>
            El consignante declara bajo fe de juramento ser el titular legítimo o poseer la representación legal debidamente acreditada sobre la evidencia digital descrita. Autoriza voluntariamente al laboratorio privado SHA256.US a realizar la extracción, clonación bit a bit y peritaje forense de los contenidos digitales dentro del alcance delimitado, eximiendo al laboratorio de cualquier responsabilidad derivada del tratamiento legítimo de los datos en cumplimiento del encargo.
          </Text>
        </View>

        {/* RECUADRO DE FIRMAS Y HUELLAS */}
        <View style={pdfStyles.signatureSection}>
          <View style={pdfStyles.peritoCard}>
            <Text style={pdfStyles.peritoCardHeaderTitle}>DECLARANTE / CONSIGNANTE</Text>
            <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center', marginVertical: 3 }}>
              <View style={pdfStyles.peritoThumbBox}>
                <Text style={pdfStyles.peritoThumbText}>PULGAR DER.</Text>
              </View>
              <View style={pdfStyles.peritoThumbBox}>
                <Text style={pdfStyles.peritoThumbText}>PULGAR IZQ.</Text>
              </View>
            </View>
            <View style={pdfStyles.peritoDottedLine} />
            <View style={pdfStyles.peritoSignatureLine} />
            <Text style={pdfStyles.peritoCardSubTitle}>FIRMA DEL DECLARANTE CONSIGNANTE</Text>
            <View style={{ marginTop: 4, width: '100%' }}>
              <View style={pdfStyles.peritoFieldRow}>
                <Text style={pdfStyles.peritoFieldLabel}>Nombre:</Text>
                <Text style={pdfStyles.peritoFieldValue}>{fmt(c.solicitante_nombre, 'Carlos Eduardo Mendoza Rivas')}</Text>
              </View>
              <View style={pdfStyles.peritoFieldRow}>
                <Text style={pdfStyles.peritoFieldLabel}>C.I. N°:</Text>
                <Text style={pdfStyles.peritoFieldValue}>{fmt(c.solicitante_cedula, 'V-18.492.019')}</Text>
              </View>
            </View>
          </View>

          <View style={pdfStyles.peritoCard}>
            <Text style={pdfStyles.peritoCardHeaderTitle}>RECEPTOR / PERITO OFICIAL SHA256.US</Text>
            <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center', marginVertical: 3 }}>
              <View style={pdfStyles.peritoThumbBox}>
                <Text style={pdfStyles.peritoThumbText}>PULGAR DER.</Text>
              </View>
              <View style={pdfStyles.peritoThumbBox}>
                <Text style={pdfStyles.peritoThumbText}>PULGAR IZQ.</Text>
              </View>
            </View>
            <View style={pdfStyles.peritoDottedLine} />
            <View style={pdfStyles.peritoSignatureLine} />
            <Text style={pdfStyles.peritoCardSubTitle}>FIRMA DEL PERITO RECEPTOR</Text>
            <View style={{ marginTop: 4, width: '100%' }}>
              <View style={pdfStyles.peritoFieldRow}>
                <Text style={pdfStyles.peritoFieldLabel}>Nombre:</Text>
                <Text style={pdfStyles.peritoFieldValue}>{fmt(c.peritoLider, 'Ing. Jull J. Ollarves S.')}</Text>
              </View>
              <View style={pdfStyles.peritoFieldRow}>
                <Text style={pdfStyles.peritoFieldLabel}>C.I. N°:</Text>
                <Text style={pdfStyles.peritoFieldValue}>{fmt(c.peritoCedula, 'V-19.823.104')}</Text>
              </View>
            </View>
          </View>
        </View>

        <PlanillaFooter />
      </Page>
    </Document>
  );
};

export default ActaConsentimientoPdf;
