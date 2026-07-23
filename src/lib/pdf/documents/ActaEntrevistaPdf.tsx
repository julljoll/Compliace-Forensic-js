import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { pdfStyles, formatValue } from '../reactPdfStyles';
import { PlanillaHeader, PlanillaFooter } from '../PlanillaHeaderFooter';

interface Props {
  caso?: any;
  isBlankMode?: boolean;
}

export const ActaEntrevistaPdf: React.FC<Props> = ({ caso, isBlankMode = false }) => {
  const c = caso || {};
  const fmt = (val?: string, placeholder: string = '') => formatValue(val, isBlankMode, placeholder);
  const numeroExpediente = fmt(c.numeroCaso, 'EXP-2026-SHA-0091');
  const fecha = fmt(c.fecha, '23/07/2026 - 10:15 AM');

  return (
    <Document title={`Acta_Entrevista_${c.numeroCaso || 'EXP'}`}>
      {/* PÁGINA 1 — ENCABEZADO INSTITUCIONAL */}
      <Page size={[612, 936]} style={pdfStyles.page}>
        <PlanillaHeader />

        <View style={pdfStyles.titleBlock}>
          <Text style={pdfStyles.mainTitle}>ACTA DE ENTREVISTA TÉCNICO-PERICIAL PRIVADA</Text>
          <Text style={pdfStyles.subTitle}>ENTREVISTA DE CONTEXTO FORENSE DIGITAL CONFORME AL MUCC-2017 & ARTS. 187, 223, 225 COPP</Text>
          
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

        <Text style={pdfStyles.sectionTitle}>DATOS DE LA ACTUACIÓN PERICIAL PRIVADA</Text>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Lugar de Actuación / Sede:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.sede, 'Sede Principal Quíbor - Oficina Pericial SHA256.US')}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Fecha y Hora de la Entrevista:</Text>
          <Text style={pdfStyles.fieldValue}>{fecha}</Text>
        </View>

        <Text style={pdfStyles.sectionTitle}>I. IDENTIFICACIÓN LEGAL DEL ENTREVISTADO (ARTS. 132-136 COPP)</Text>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Apellidos y Nombres:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.solicitante_nombre, 'Carlos Eduardo Mendoza Rivas')}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Cédula de Identidad / Pasaporte:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.solicitante_cedula, 'V-18.492.019')}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Teléfono de Contacto Principal:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.dispositivo_numero_tel, '+58 (414) 592-8102')}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Correo Electrónico:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.correo_investigar, 'carlos.mendoza@empresa.com.ve')}</Text>
        </View>

        <Text style={{ fontSize: 7.5, fontFamily: 'Helvetica-Bold', marginTop: 3, marginBottom: 2, color: '#0F172A' }}>
          Condición / Rol Jurídico en la Investigación (MUCC-2017):
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 3 }}>
          <View style={pdfStyles.checkboxContainer}>
            <View style={pdfStyles.checkboxBox}><Text style={pdfStyles.checkboxCheck}>✓</Text></View>
            <Text style={{ fontSize: 7.5 }}>Víctima / Afectado Directo</Text>
          </View>
          <View style={pdfStyles.checkboxContainer}>
            <View style={pdfStyles.checkboxBox}><Text style={pdfStyles.checkboxCheck}></Text></View>
            <Text style={{ fontSize: 7.5 }}>Testigo Técnico / Denunciante</Text>
          </View>
          <View style={pdfStyles.checkboxContainer}>
            <View style={pdfStyles.checkboxBox}><Text style={pdfStyles.checkboxCheck}></Text></View>
            <Text style={{ fontSize: 7.5 }}>Propietario / Consignatario</Text>
          </View>
          <View style={pdfStyles.checkboxContainer}>
            <View style={pdfStyles.checkboxBox}><Text style={pdfStyles.checkboxCheck}></Text></View>
            <Text style={{ fontSize: 7.5 }}>Custodio Corporativo</Text>
          </View>
        </View>

        <Text style={pdfStyles.sectionTitle}>II. RELACIÓN DEL DISPOSITIVO Y CUENTAS VINCULADAS (ISO 27037 & NIST SP 800-101)</Text>
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableHeaderCell, { width: '35%' }]}>Parámetro de Contexto Evidencial</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '65%' }]}>Especificación Registrada en Entrevista</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>Equipo / Dispositivo Relacionado</Text>
            <Text style={[pdfStyles.tableCell, { width: '65%' }]}>{fmt(c.dispositivo_marca ? `${c.dispositivo_marca} ${c.dispositivo_modelo || ''}` : undefined, 'Xiaomi Redmi Note 12 Pro 5G (Model: 22101316G)')}</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>Serial / IMEI 1 / IMEI 2</Text>
            <Text style={[pdfStyles.tableCell, { width: '65%' }]}>{fmt(c.dispositivo_imei, 'IMEI: 864920193847102 / S/N: SN-XMI-2026-994812')}</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>N° de Línea / Operadora / SIM</Text>
            <Text style={[pdfStyles.tableCell, { width: '65%' }]}>{fmt(c.dispositivo_numero_tel, '+58 (414) 592-8102 (Movistar 4G LTE)')}</Text>
          </View>
        </View>

        <Text style={pdfStyles.sectionTitle}>III. PREGUNTAS CLAVE DE CONTEXTO FORENSE (CUESTIONARIO PERICIAL)</Text>
        <View style={pdfStyles.qaRow}>
          <Text style={pdfStyles.qText}>PREGUNTA 1: ¿Cuál es el origen de la evidencia digital y el período de tiempo que abarca?</Text>
          <Text style={pdfStyles.aText}>RESPUESTA: {fmt(c.descripcion, 'Conversaciones de WhatsApp, imágenes adjuntas y audios Opus contenidos en la memoria interna del teléfono consignado.')}</Text>
        </View>

        <View style={pdfStyles.qaRow}>
          <Text style={pdfStyles.qText}>PREGUNTA 2: ¿Ha sido el dispositivo sometido a reparaciones técnicas o modificaciones software previas?</Text>
          <Text style={pdfStyles.aText}>RESPUESTA: No ha sufrido manipulaciones técnicas ni cambios en la base de datos de mensajes.</Text>
        </View>

        {/* FOOTER OFICIAL */}
        <PlanillaFooter />
      </Page>

      {/* PÁGINA 2 — CONSENTIMIENTO Y FIRMAS */}
      <Page size={[612, 936]} style={pdfStyles.pageSecond}>
        <Text style={pdfStyles.sectionTitle}>IV. CONSENTIMIENTO Y GARANTÍAS CONSTITUCIONALES (COPP ART. 187/225)</Text>
        <Text style={pdfStyles.paragraph}>
          El entrevistado manifiesta de manera expresa que rinde la presente declaración de forma LIBRE, CONSCIENTE Y VOLUNTARIA, sin haber sido objeto de coacción, violencia, dolo, engaño o promesas indebidas. Autoriza al equipo pericial de SHA256.US para la incorporación de esta entrevista al expediente forense N° {numeroExpediente}.
        </Text>

        <Text style={pdfStyles.sectionTitle}>V. CERTIFICACIÓN PERICIAL, FIRMAS Y REGISTRO DACTILAR</Text>
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
            <Text style={pdfStyles.signatureLabel}>FIRMA DEL ENTREVISTADO</Text>
            <Text style={{ fontSize: 7, marginTop: 2 }}>C.I.: {fmt(c.solicitante_cedula, 'V-18.492.019')}</Text>
          </View>

          <View style={pdfStyles.peritoCard}>
            <Text style={pdfStyles.peritoCardHeaderTitle}>PERITO ENTREVISTADOR</Text>
            <View style={pdfStyles.peritoCardDividerLine} />

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
            <Text style={pdfStyles.peritoCardSubTitle}>FIRMA DEL PERITO ENTREVISTADOR</Text>

            <View style={{ marginTop: 4, width: '100%' }}>
              <View style={pdfStyles.peritoFieldRow}>
                <Text style={pdfStyles.peritoFieldLabel}>Nombre:</Text>
                <Text style={pdfStyles.peritoFieldValue}>{fmt(c.peritoLider, 'Ing. Jull J. Ollarves S.')}</Text>
              </View>
              <View style={pdfStyles.peritoFieldRow}>
                <Text style={pdfStyles.peritoFieldLabel}>C.I. N°:</Text>
                <Text style={pdfStyles.peritoFieldValue}>{fmt(c.peritoCedula, 'V-19.823.104')}</Text>
              </View>
              <View style={pdfStyles.peritoFieldRow}>
                <Text style={pdfStyles.peritoFieldLabel}>CIV N°:</Text>
                <Text style={pdfStyles.peritoFieldValue}>{fmt(c.peritoCiv, 'CIV N° 284.912')}</Text>
              </View>
              <View style={pdfStyles.peritoFieldRow}>
                <Text style={pdfStyles.peritoFieldLabel}>INPREABOGADO N°:</Text>
                <Text style={pdfStyles.peritoFieldValue}>{fmt(c.peritoInpre, 'INPRE N° 102.849')}</Text>
              </View>
              <View style={pdfStyles.peritoFieldRow}>
                <Text style={pdfStyles.peritoFieldLabel}>Cargo:</Text>
                <Text style={pdfStyles.peritoFieldValue}>{fmt(c.peritoCargo, 'Perito Informático Forense Entrevistador')}</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, justifyContent: 'center', gap: 6 }}>
              <Text style={{ fontSize: 6.5, fontFamily: 'Helvetica-Bold' }}>Rol ISO 27037:</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                <View style={pdfStyles.checkboxBox}><Text style={pdfStyles.checkboxCheck}>✓</Text></View>
                <Text style={{ fontSize: 6.5, fontFamily: 'Helvetica-Bold' }}>DEFR</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                <View style={pdfStyles.checkboxBox}><Text style={pdfStyles.checkboxCheck}>✓</Text></View>
                <Text style={{ fontSize: 6.5, fontFamily: 'Helvetica-Bold' }}>DES</Text>
              </View>
            </View>
          </View>
        </View>

        {/* FOOTER OFICIAL */}
        <PlanillaFooter />
      </Page>
    </Document>
  );
};

export default ActaEntrevistaPdf;
