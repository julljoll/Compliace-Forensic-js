import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { pdfStyles, formatValue } from '../reactPdfStyles';
import { PlanillaHeader, PlanillaFooter } from '../PlanillaHeaderFooter';

interface Props {
  caso?: any;
  tipoEvidencia?: 'dispositivo_movil' | 'equipo_computo';
  isBlankMode?: boolean;
}

export const ActaObtencionPdf: React.FC<Props> = ({ caso, isBlankMode = false }) => {
  const c = caso || {};
  const fmt = (val?: string, placeholder: string = '') => formatValue(val, isBlankMode, placeholder);
  const numeroExpediente = fmt(c.numeroCaso, 'EXP-2026-SHA-0091');
  const fecha = fmt(c.fecha, '23/07/2026 - 09:30 AM');

  return (
    <Document title={`Acta_Obtencion_Movil_${c.numeroCaso || 'EXP'}`}>
      {/* PÁGINA 1 — ENCABEZADO INSTITUCIONAL */}
      <Page size={[612, 936]} style={pdfStyles.page}>
        <PlanillaHeader />

        {/* Title Block con Casilla Alargada al 100% */}
        <View style={pdfStyles.titleBlock}>
          <Text style={pdfStyles.mainTitle}>ACTA DE OBTENCIÓN POR CONSIGNACIÓN VOLUNTARIA PRIVADA (TELÉFONO MÓVIL)</Text>
          <Text style={pdfStyles.subTitle}>RECEPCIÓN DE DISPOSITIVO PARA ANÁLISIS FORENSE EN LABORATORIO PRIVADO SHA256.US (MUCC-2017 & ARTS. 187, 225 COPP)</Text>
          
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

        {/* DATOS DE LA ACTUACIÓN */}
        <Text style={pdfStyles.sectionTitle}>DATOS DE LA ACTUACIÓN FORENSE PRIVADA</Text>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Sede de Recepción Pericial:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.sede, 'Sede Principal Quíbor - Laboratorio Privado SHA256.US')}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Fecha y Hora de Consignación:</Text>
          <Text style={pdfStyles.fieldValue}>{fecha}</Text>
        </View>

        {/* I. DATOS DEL CONSIGNANTE */}
        <Text style={pdfStyles.sectionTitle}>I. IDENTIFICACIÓN COMPLETA DEL CONSIGNANTE PRIVADO (ENTREGA VOLUNTARIA)</Text>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Apellidos y Nombres:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.solicitante_nombre, 'Carlos Eduardo Mendoza Rivas')}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Cédula de Identidad / RIF:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.solicitante_cedula, 'V-18.492.019')}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Teléfono de Contacto:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.dispositivo_numero_tel, '+58 (414) 592-8102')}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Correo Electrónico:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.correo_investigar, 'carlos.mendoza@empresa.com.ve')}</Text>
        </View>

        <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', marginTop: 3, marginBottom: 2 }}>
          Calidad Jurídica del Consignante Privado (MUCC-2017):
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 4 }}>
          <View style={pdfStyles.checkboxContainer}>
            <View style={pdfStyles.checkboxBox}><Text style={pdfStyles.checkboxCheck}>✓</Text></View>
            <Text style={{ fontSize: 7.5 }}>Propietario Legítimo</Text>
          </View>
          <View style={pdfStyles.checkboxContainer}>
            <View style={pdfStyles.checkboxBox}><Text style={pdfStyles.checkboxCheck}></Text></View>
            <Text style={{ fontSize: 7.5 }}>Representante Legal / Apoderado</Text>
          </View>
          <View style={pdfStyles.checkboxContainer}>
            <View style={pdfStyles.checkboxBox}><Text style={pdfStyles.checkboxCheck}></Text></View>
            <Text style={{ fontSize: 7.5 }}>Custodio Corporativo Autorizado</Text>
          </View>
          <View style={pdfStyles.checkboxContainer}>
            <View style={pdfStyles.checkboxBox}><Text style={pdfStyles.checkboxCheck}></Text></View>
            <Text style={{ fontSize: 7.5 }}>Poseedor / Tercero Legitimado</Text>
          </View>
        </View>

        {/* II. ESPECIFICACIÓN TÉCNICA DEL TELÉFONO MÓVIL */}
        <Text style={pdfStyles.sectionTitle}>II. DESCRIPCIÓN TÉCNICA RIGUROSA DEL TELÉFONO MÓVIL CONSIGNADO (NIST SP 800-101)</Text>
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableHeaderCell, { width: '35%' }]}>Parámetro de Evidencia Móvil</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '65%' }]}>Especificación Registrada en Laboratorio Privado</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>Marca / Modelo Comercial / Técnico</Text>
            <Text style={[pdfStyles.tableCell, { width: '65%' }]}>{fmt(c.dispositivo_marca ? `${c.dispositivo_marca} ${c.dispositivo_modelo || ''}` : undefined, 'Xiaomi Redmi Note 12 Pro 5G (Model: 22101316G)')}</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>IMEI 1 (Slot Principal)</Text>
            <Text style={[pdfStyles.tableCell, { width: '65%' }]}>{fmt(c.dispositivo_imei, '864920193847102')}</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>IMEI 2 (Slot Secundario / eSIM)</Text>
            <Text style={[pdfStyles.tableCell, { width: '65%' }]}>{fmt(c.dispositivo_imei2, '864920193847103')}</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>N° de Serie Fabricante (S/N)</Text>
            <Text style={[pdfStyles.tableCell, { width: '65%' }]}>{fmt(c.dispositivo_serial, 'SN-XMI-2026-994812')}</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>N° de Línea / Operadora / SIM ICCID</Text>
            <Text style={[pdfStyles.tableCell, { width: '65%' }]}>{fmt(c.dispositivo_numero_tel, '+58 (414) 592-8102 (Movistar 4G LTE / ICCID: 89580210049281029412)')}</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>Estado Físico / Pantalla / Batería</Text>
            <Text style={[pdfStyles.tableCell, { width: '65%' }]}>{fmt(c.estado_fisico, 'Pantalla intacta sin fisuras, carcasa con desgaste menor 9.5/10, puerto USB-C funcional.')}</Text>
          </View>
        </View>

        {/* III. PROTOCOLO DE AISLAMIENTO */}
        <Text style={pdfStyles.sectionTitle}>III. AISLAMIENTO ELECTROMAGNÉTICO Y PRECINTO (ISO 27037)</Text>
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>Bolsa / Embalaje Faraday</Text>
            <Text style={[pdfStyles.tableCell, { width: '65%' }]}>{fmt(c.bolsa_faraday, 'Bolsa Faraday Anti-RF Tipo Militar III (ISO 27037 § 7.3)')}</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>Aislamiento de Redes RF</Text>
            <Text style={[pdfStyles.tableCell, { width: '65%' }]}>{fmt(c.aislamiento_rf, 'Modo Avión ON / Wi-Fi & Bluetooth OFF / SIM Card Retirada')}</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>Precinto de Seguridad Inalterable</Text>
            <Text style={[pdfStyles.tableCell, { width: '65%' }]}>{fmt(c.precinto_numero, 'Tamper-Evident Seal N° SEC-2026-8849')}</Text>
          </View>
        </View>

        {/* IV. INTEGRIDAD SHA-256 & SUITE FORENSE */}
        <Text style={pdfStyles.sectionTitle}>IV. INTEGRIDAD SHA-256 & SUITE FORENSE (INTERPOL / PYTHON ENGINES)</Text>
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>Hash SHA-256 Génesis</Text>
            <Text style={[pdfStyles.tableCell, { width: '65%', fontSize: 6.5, fontFamily: 'Helvetica' }]}>{fmt(c.hashGenesis, 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')}</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>Software Forense / Librerías</Text>
            <Text style={[pdfStyles.tableCell, { width: '65%', fontSize: 6.5 }]}>
              IPED Forensics v4.1 (Pol. Fed. Brasil / INTERPOL), PhotoHolmes Engine (photoholmes: ELA) & PyOgg Audio Engine (PyOgg: Opus WhatsApp)
            </Text>
          </View>
        </View>

        {/* FOOTER OFICIAL */}
        <PlanillaFooter />
      </Page>

      {/* PÁGINA 2 — HOJA DE FIRMAS Y DECLARACIONES */}
      <Page size={[612, 936]} style={pdfStyles.pageSecond}>
        <Text style={pdfStyles.sectionTitle}>V. DECLARACIÓN DE CONSENTIMIENTO VOLUNTARIO PRIVADO Y ALCANCE LEGAL</Text>
        <Text style={pdfStyles.paragraph}>
          Yo, el consignante arriba identificado, en pleno uso de mis facultades mentales y actuando libremente, hago entrega material voluntaria (Obtención por Consignación Directa Privada) del teléfono móvil descrito al laboratorio privado SHA256.US conforme al Manual Único de Cadena de Custodia (MUCC-2017) y Arts. 187 y 225 del COPP. Declaro bajo juramento que realizo esta consignación LIBRE DE TODA COACCIÓN, VIOLENCIA, DOLO O AMENAZA. AUTORIZO EXPRESA Y VOLUNTARIAMENTE al equipo pericial del laboratorio privado SHA256.US para la extracción lógica/física de Mensajes de Datos (Art. 4, Ley sobre Mensajes de Datos y Firmas Electrónicas), procesados con IPED Forensics, PhotoHolmes y PyOgg.
        </Text>

        <Text style={pdfStyles.sectionTitle}>VI. REQUERIMIENTOS DE ACCESO (CREDENCIALES PROPORCIONADAS)</Text>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>PIN / Contraseña Desbloqueo:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.credenciales_acceso, 'PIN: 849201 / Patrón: Z (Esquina Sup. Izq. a Inf. Der.)')}</Text>
        </View>

        <Text style={pdfStyles.sectionTitle}>VII. MOTIVO DE LA CONSIGNACIÓN PRIVADA Y PORMENORES DEL CASO</Text>
        <View style={{ borderWidth: 1, borderColor: '#0F172A', backgroundColor: '#FFFFFF', padding: 6, minHeight: 110, marginBottom: 8 }}>
          <Text style={pdfStyles.paragraph}>{fmt(c.descripcion, 'Consignación voluntaria efectuada por el titular del dispositivo a fines de realizar la extracción pericial de conversaciones de WhatsApp, imágenes adjuntas y notas de voz Opus contenidas en la memoria interna, garantizando la preservación de la cadena de custodia según norma ISO/IEC 27037:2012.')}</Text>
        </View>

        <Text style={pdfStyles.sectionTitle}>VIII. CERTIFICACIÓN PERICIAL PRIVADA, FIRMAS Y REGISTRO DACTILAR</Text>
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
            <Text style={pdfStyles.signatureLabel}>FIRMA DEL CONSIGNANTE PRIVADO</Text>
            <Text style={{ fontSize: 7, marginTop: 2 }}>C.I.: {fmt(c.solicitante_cedula, 'V-18.492.019')}</Text>
          </View>

          <View style={pdfStyles.peritoCard}>
            <Text style={pdfStyles.peritoCardHeaderTitle}>PERITO RECEPTOR</Text>
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
                <Text style={pdfStyles.peritoFieldValue}>{fmt(c.peritoCargo, 'Perito Informático Forense Senior & Director de Laboratorio')}</Text>
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

export default ActaObtencionPdf;
