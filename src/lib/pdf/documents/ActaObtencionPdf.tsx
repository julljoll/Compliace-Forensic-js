import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { pdfStyles, formatValue } from '../reactPdfStyles';
import { PlanillaHeader, PlanillaFooter } from '../PlanillaHeaderFooter';
import PlanillaCoverPagePdf from '../PlanillaCoverPagePdf';

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
      {/* PÁGINA 1 (FOLIO 01) — PORTADA DINÁMICA FOLIADA */}
      <PlanillaCoverPagePdf planillaId="acta-obtencion" caso={caso} isBlankMode={isBlankMode} />

      {/* PÁGINA 2 — ENCABEZADO INSTITUCIONAL */}
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
            <View style={pdfStyles.expedienteSlot}>
              <Text style={pdfStyles.expedienteText}>FECHA:</Text>
              <View style={pdfStyles.expedienteLine}>
                <Text style={{ fontSize: 8, paddingLeft: 4, fontFamily: 'Helvetica-Bold' }}>{fmt(c.fecha, '23/07/2026')}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 1.0 DATOS DE LA ACTUACIÓN */}
        <Text id="seccion-1.0" style={pdfStyles.sectionTitle}>1.0 DATOS DE LA ACTUACIÓN FORENSE PRIVADA</Text>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Sede de Recepción Pericial:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.sede, 'Sede Principal Quíbor - Laboratorio Privado SHA256.US')}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Fecha y Hora de Consignación:</Text>
          <Text style={pdfStyles.fieldValue}>{fecha}</Text>
        </View>

        {/* 2.0 DATOS DEL CONSIGNANTE */}
        <Text id="seccion-2.0" style={pdfStyles.sectionTitle}>2.0 IDENTIFICACIÓN COMPLETA DEL CONSIGNANTE PRIVADO</Text>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Apellidos y Nombres:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.solicitante_nombre, 'Alexander R. Wright')}</Text>
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
          <Text style={pdfStyles.fieldValue}>{fmt(c.correo_investigar, 'alexander.wright@corporate.com')}</Text>
        </View>

        <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', marginTop: 3, marginBottom: 2 }}>
          Calidad Jurídica del Consignante Privado (MUCC-2017):
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 4 }}>
          <View style={pdfStyles.checkboxContainer}>
            <View style={pdfStyles.checkboxBox}><Text style={pdfStyles.checkboxCheck}>{isBlankMode ? '' : '✓'}</Text></View>
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

        {/* 3.0 ESPECIFICACIÓN TÉCNICA DEL TELÉFONO MÓVIL */}
        <Text id="seccion-3.0" style={pdfStyles.sectionTitle}>3.0 ESPECIFICACIÓN TÉCNICA RIGUROSA DEL DISPOSITIVO</Text>
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
        </View>

        {/* 4.0 ESTADO FÍSICO */}
        <Text id="seccion-4.0" style={pdfStyles.sectionTitle}>4.0 ESTADO FÍSICO, OBSERVACIONES VISUALES Y ACCESORIOS</Text>
<<<<<<< HEAD
        <View style={{ marginTop: 3, marginBottom: 5, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 3, padding: 6, backgroundColor: '#F8FAFC' }}>
          <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', color: '#0F172A', marginBottom: 4 }}>
            ESTADO FÍSICO Y OBSERVACIONES VISUALES DE RECEPCIÓN (6 líneas de pauta pericial):
          </Text>
          {c.dispositivo_estado_fisico && !isBlankMode && !c.dispositivo_estado_fisico.includes('[') ? (
            <Text style={{ fontSize: 7.5, color: '#1E293B', lineHeight: 1.4 }}>
              {c.dispositivo_estado_fisico}
            </Text>
          ) : (
            <View style={{ marginTop: 2, gap: 4 }}>
              <View style={{ borderBottomWidth: 0.8, borderBottomColor: '#94A3B8', borderStyle: 'dashed', height: 15, width: '100%' }} />
              <View style={{ borderBottomWidth: 0.8, borderBottomColor: '#94A3B8', borderStyle: 'dashed', height: 15, width: '100%' }} />
              <View style={{ borderBottomWidth: 0.8, borderBottomColor: '#94A3B8', borderStyle: 'dashed', height: 15, width: '100%' }} />
              <View style={{ borderBottomWidth: 0.8, borderBottomColor: '#94A3B8', borderStyle: 'dashed', height: 15, width: '100%' }} />
              <View style={{ borderBottomWidth: 0.8, borderBottomColor: '#94A3B8', borderStyle: 'dashed', height: 15, width: '100%' }} />
              <View style={{ borderBottomWidth: 0.8, borderBottomColor: '#94A3B8', borderStyle: 'dashed', height: 15, width: '100%' }} />
            </View>
          )}
=======
        <View style={{ marginTop: 3, marginBottom: 5, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 3, padding: 5, backgroundColor: '#F8FAFC' }}>
          <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', color: '#0F172A', marginBottom: 2 }}>
            ESTADO FÍSICO Y OBSERVACIONES VISUALES DE RECEPCIÓN (5 líneas de pauta pericial):
          </Text>
          <Text style={{ fontSize: 6.5, color: '#1E293B', lineHeight: 1.35 }}>
            {fmt(c.dispositivo_estado_fisico, '1. _____________________________________________________________________\n2. _____________________________________________________________________\n3. _____________________________________________________________________\n4. _____________________________________________________________________\n5. _____________________________________________________________________')}
          </Text>
>>>>>>> ed2e25ae2321632fd5a0e76f54f3878ba018c862
        </View>

        {/* 5.0 ALCANCE Y AUTORIZACIÓN */}
        <Text id="seccion-5.0" style={pdfStyles.sectionTitle}>5.0 ALCANCE Y AUTORIZACIÓN EXPRESA DEL EXAMEN PERICIAL</Text>
        <Text style={pdfStyles.paragraph}>
          Yo, el consignante arriba identificado, en pleno uso de mis facultades mentales y actuando libremente, hago entrega material voluntaria (Obtención por Consignación Directa Privada) de la evidencia descrita conforme al Manual Único de Cadena de Custodia (MUCC-2017) y Arts. 187 y 225 del COPP. Declaro bajo juramento que realizo esta consignación LIBRE DE TODA COACCIÓN, VIOLENCIA, DOLO O AMENAZA. AUTORIZO EXPRESA Y VOLUNTARIAMENTE al equipo pericial de SHA256.US para la extracción lógica/física de Mensajes de Datos (Art. 4, Ley sobre Mensajes de Datos y Firmas Electrónicas) y análisis forense.
        </Text>

        {/* FOOTER OFICIAL */}
        <PlanillaFooter />
      </Page>

      {/* PÁGINA 3 — HOJA DE FIRMAS Y DECLARACIONES */}
      <Page size={[612, 936]} style={pdfStyles.pageSecond}>

        {/* 6.0 CUSTODIA INICIAL, HASH SHA-256 Y EMPACADO (MUCC-2017 p. 37) */}
        <Text id="seccion-6.0" style={pdfStyles.sectionTitle}>6.0 CUSTODIA INICIAL, HASH SHA-256 Y EMPACADO EN BOLSA FARADAY / PRECINTO</Text>
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>Hash SHA-256 Inicial (Embalaje — MUCC-2017 p. 37)</Text>
            <View style={[pdfStyles.tableCell, { width: '65%', justifyContent: 'center' }]}>
              <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', color: '#0F172A' }}>
                {isBlankMode ? '____________________________________________________________________' : fmt(c.hashGenesis, '____________________________________________________________________')}
              </Text>
            </View>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>Algoritmo Auxiliar MD5 (Verificación cruzada)</Text>
            <View style={[pdfStyles.tableCell, { width: '65%', justifyContent: 'center' }]}>
              <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', color: '#0F172A' }}>
                {isBlankMode ? '________________________________________' : fmt(c.hashMd5, '________________________________________')}
              </Text>
            </View>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>Herramienta de Cálculo</Text>
            <View style={[pdfStyles.tableCell, { width: '65%', justifyContent: 'center' }]}>
              <Text style={{ fontSize: 7, fontFamily: 'Helvetica' }}>
                {isBlankMode ? '________________________________________' : fmt(c.herramientaHash, '________________________________________')}
              </Text>
            </View>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>Bolsa Faraday / Apantallamiento</Text>
            <View style={[pdfStyles.tableCell, { width: '65%', fontSize: 7 }]}>
              <Text>[   ] Bolsa de Aislamiento Electromagnético RF      [   ] Caja Rígida Anti-Impactos</Text>
              <Text style={{ marginTop: 3 }}>N° Bolsa Faraday: {isBlankMode ? '___________________________________' : fmt(c.bolsaFaraday, '___________________________________')}</Text>
            </View>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>Precinto de Seguridad Plástico</Text>
            <View style={[pdfStyles.tableCell, { width: '65%', fontSize: 7 }]}>
              <Text>N° Precinto: {isBlankMode ? '___________________________________' : fmt(c.precintoNumero, '___________________________________')}</Text>
              <Text style={{ marginTop: 3 }}>Estado: [   ] Intacto / Sin alteración      [   ] Violado / Alterado</Text>
            </View>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '35%', fontFamily: 'Helvetica-Bold' }]}>Estado de Aislamiento de Red</Text>
            <View style={[pdfStyles.tableCell, { width: '65%', fontSize: 7 }]}>
              <Text>[   ] Modo Avión Activado          [   ] Tarjeta SIM Retirada</Text>
              <Text style={{ marginTop: 3 }}>[   ] WiFi Desactivado                 [   ] Bluetooth Desactivado</Text>
            </View>
          </View>
        </View>

        {/* 7.0 FIRMAS Y REGISTRO DACTILAR */}
        <Text id="seccion-7.0" style={pdfStyles.sectionTitle}>7.0 FIRMAS DE CONFORMIDAD, CERTIFICACIÓN Y CUSTODIA</Text>
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
                <Text style={pdfStyles.peritoFieldValue}>{fmt(c.peritoLider, 'Ing. Christopher V. Vance')}</Text>
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
                <View style={pdfStyles.checkboxBox}><Text style={pdfStyles.checkboxCheck}>{isBlankMode ? '' : '✓'}</Text></View>
                <Text style={{ fontSize: 6.5, fontFamily: 'Helvetica-Bold' }}>DEFR</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                <View style={pdfStyles.checkboxBox}><Text style={pdfStyles.checkboxCheck}>{isBlankMode ? '' : '✓'}</Text></View>
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
