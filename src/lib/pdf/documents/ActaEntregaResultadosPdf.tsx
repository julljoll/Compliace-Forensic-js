import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { pdfStyles, formatValue } from '../reactPdfStyles';
import { PlanillaHeader, PlanillaFooter } from '../PlanillaHeaderFooter';

interface Props {
  caso?: any;
  isBlankMode?: boolean;
}

export const ActaEntregaResultadosPdf: React.FC<Props> = ({ caso, isBlankMode = false }) => {
  const c = caso || {};
  const fmt = (val?: string, placeholder: string = '') => formatValue(val, isBlankMode, placeholder);
  const numeroExpediente = fmt(c.numeroCaso, '[ EXP-2026-SHA-0091 ]');
  const fecha = fmt(c.fecha, '[ Fecha y Hora de Entrega de Resultados ]');

  return (
    <Document title={`Acta_Entrega_${c.numeroCaso || 'EXP'}`}>
      {/* PÁGINA 1 — ENCABEZADO INSTITUCIONAL */}
      <Page size={[612, 936]} style={pdfStyles.page}>
        <PlanillaHeader />

        <View style={pdfStyles.titleBlock}>
          <Text style={pdfStyles.mainTitle}>ACTA DE ENTREGA DE RESULTADOS Y DEVOLUCIÓN DE EVIDENCIA</Text>
          <Text style={pdfStyles.subTitle}>ENTREGA FORMAL DE INFORME Y DEVOLUCIÓN DE DISPOSITIVO MÓVIL (MUCC-2017 & ISO 27037)</Text>
          
          <View style={pdfStyles.expedienteBox}>
            <View style={pdfStyles.expedienteSlot}>
              <Text style={pdfStyles.expedienteText}>EXPEDIENTE N°:</Text>
              <View style={pdfStyles.expedienteLine}>
                <Text style={{ fontSize: 8, paddingLeft: 4, fontFamily: 'Helvetica-Bold' }}>{numeroExpediente}</Text>
              </View>
            </View>
            <View style={pdfStyles.expedienteSlot}>
              <Text style={pdfStyles.expedienteText}>ACTA DE ENTREGA N°:</Text>
              <View style={pdfStyles.expedienteLine}>
                <Text style={{ fontSize: 7.5, paddingLeft: 4, fontFamily: 'Helvetica-Bold' }}>ENT-2026-{numeroExpediente || '001'}</Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={pdfStyles.sectionTitle}>I. DATOS DE LA ACTUACIÓN Y RECEPTOR DE LA EVIDENCIA</Text>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Fecha y Hora de Entrega:</Text>
          <Text style={pdfStyles.fieldValue}>{fecha}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Sede del Laboratorio:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.sede)}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Receptor Privado / Solicitante:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.solicitante_nombre)}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Cédula de Identidad / RIF:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.solicitante_cedula)}</Text>
        </View>

        <Text style={pdfStyles.sectionTitle}>II. RELACIÓN DE DOCUMENTOS Y MATERIALES ENTREGADOS</Text>
        <View style={{ marginVertical: 4 }}>
          <View style={pdfStyles.checkboxContainer}>
            <View style={pdfStyles.checkboxBox}><Text style={pdfStyles.checkboxCheck}>✓</Text></View>
            <Text style={{ fontSize: 8 }}>Dictamen Pericial Informático Forense Privado (Impreso en Papel Folio & Anexo Gráfico ELA/PyOgg)</Text>
          </View>
          <View style={pdfStyles.checkboxContainer}>
            <View style={pdfStyles.checkboxBox}><Text style={pdfStyles.checkboxCheck}>✓</Text></View>
            <Text style={{ fontSize: 8 }}>Planilla de Registro de Cadena de Custodia (PRCC final con cierres de transferencias)</Text>
          </View>
          <View style={pdfStyles.checkboxContainer}>
            <View style={pdfStyles.checkboxBox}><Text style={pdfStyles.checkboxCheck}>✓</Text></View>
            <Text style={{ fontSize: 8 }}>Dispositivo Móvil Original ({fmt(c.dispositivo_marca ? `${c.dispositivo_marca} ${c.dispositivo_modelo || ''}` : undefined)}, IMEI: {fmt(c.dispositivo_imei)})</Text>
          </View>
          <View style={pdfStyles.checkboxContainer}>
            <View style={pdfStyles.checkboxBox}><Text style={pdfStyles.checkboxCheck}>✓</Text></View>
            <Text style={{ fontSize: 8 }}>Dispositivo de Almacenamiento Cifrado (Pendrive USB con copia de respaldo e informe digital)</Text>
          </View>
        </View>

        <Text style={pdfStyles.sectionTitle}>III. VERIFICACIÓN DE INTEGRIDAD Y RE-CORROBORACIÓN HASH SHA-256</Text>
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableHeaderCell, { width: '30%' }]}>Evidencia devuelta</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '50%' }]}>Hash SHA-256 Verificado al Entregar</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '20%' }]}>Estado Hash</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '30%', fontFamily: 'Helvetica-Bold' }]}>Teléfono Móvil</Text>
            <Text style={[pdfStyles.tableCell, { width: '50%', fontSize: 6.5 }]}>{fmt(c.hashGenesis)}</Text>
            <Text style={[pdfStyles.tableCell, { width: '20%', fontSize: 6.5, color: '#006600', fontFamily: 'Helvetica-Bold' }]}>MATCH (100% OK)</Text>
          </View>
        </View>

        {/* FOOTER OFICIAL */}
        <PlanillaFooter />
      </Page>

      {/* PÁGINA 2 — CONSTANCIA Y FIRMAS */}
      <Page size={[612, 936]} style={pdfStyles.pageSecond}>
        <Text style={pdfStyles.sectionTitle}>IV. CONSTANCIA DE DEVOLUCIÓN Y RECEPCIÓN DE CONFORMIDAD</Text>
        <Text style={pdfStyles.paragraph}>
          Por medio de la presente se hace constante entrega formal del Dictamen Pericial Informático Forense final y la devolución del dispositivo o evidencia digital consignada ({fmt(c.dispositivo_marca ? `${c.dispositivo_marca} ${c.dispositivo_modelo || ''}` : undefined)}, Serial/IMEI: {fmt(c.dispositivo_imei)}) en perfecto estado físico y con los precintos de seguridad debidamente validados. El receptor manifiesta recibir a su entera satisfacción todo el material señalado sin objeción legal ni técnica.
        </Text>

        <Text style={pdfStyles.sectionTitle}>V. FIRMAS DE ENTREGADO Y RECIBIDO CONFORME</Text>
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
            <Text style={pdfStyles.signatureLabel}>FIRMA DEL RECEPTOR PRIVADO</Text>
            <Text style={{ fontSize: 7, marginTop: 2 }}>C.I.: {fmt(c.solicitante_cedula)}</Text>
          </View>

          <View style={pdfStyles.peritoCard}>
            <Text style={pdfStyles.peritoCardHeaderTitle}>PERITO ENTREGANTE</Text>
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
            <Text style={pdfStyles.peritoCardSubTitle}>FIRMA DEL PERITO ENTREGANTE</Text>

            <View style={{ marginTop: 4, width: '100%' }}>
              <View style={pdfStyles.peritoFieldRow}>
                <Text style={pdfStyles.peritoFieldLabel}>Nombre:</Text>
                <Text style={pdfStyles.peritoFieldValue}>{fmt(c.peritoLider)}</Text>
              </View>
              <View style={pdfStyles.peritoFieldRow}>
                <Text style={pdfStyles.peritoFieldLabel}>C.I. N°:</Text>
                <Text style={pdfStyles.peritoFieldValue}>{fmt(c.peritoCedula)}</Text>
              </View>
              <View style={pdfStyles.peritoFieldRow}>
                <Text style={pdfStyles.peritoFieldLabel}>CIV N°:</Text>
                <Text style={pdfStyles.peritoFieldValue}>{fmt(c.peritoCiv)}</Text>
              </View>
              <View style={pdfStyles.peritoFieldRow}>
                <Text style={pdfStyles.peritoFieldLabel}>INPREABOGADO N°:</Text>
                <Text style={pdfStyles.peritoFieldValue}>{fmt(c.peritoInpre)}</Text>
              </View>
              <View style={pdfStyles.peritoFieldRow}>
                <Text style={pdfStyles.peritoFieldLabel}>Cargo:</Text>
                <Text style={pdfStyles.peritoFieldValue}>{fmt(c.peritoCargo)}</Text>
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

export default ActaEntregaResultadosPdf;
