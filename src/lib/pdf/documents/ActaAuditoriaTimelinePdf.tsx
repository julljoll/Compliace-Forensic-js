import React from 'react';
import { Document, Page, Text, View, Image } from '@react-pdf/renderer';
import { pdfStyles, formatValue, NORMATIVA_FOOTER_LINE_1, NORMATIVA_FOOTER_LINE_2 } from '../reactPdfStyles';

interface Props {
  caso?: any;
  auditLogs?: any[];
  logs?: any[];
  isBlankMode?: boolean;
}

export const ActaAuditoriaTimelinePdf: React.FC<Props> = ({ caso, auditLogs = [], logs = [], isBlankMode = true }) => {
  const c = caso || {};
  const fmt = (val?: string) => formatValue(val, isBlankMode);
  const numeroExpediente = fmt(c.numeroCaso);
  const listLogs = auditLogs && auditLogs.length > 0 ? auditLogs : logs;

  return (
    <Document title={`Acta_Auditoria_Timeline_${c.numeroCaso || 'EXP'}`}>
      <Page size={[612, 936]} style={pdfStyles.page}>
        <View style={pdfStyles.headerContainer}>
          <View style={pdfStyles.headerBrandRow}>
            <Image src="/logo.png" style={pdfStyles.headerLogo} />
            <Text style={pdfStyles.logoText}>SHA256.US</Text>
          </View>
          <Text style={pdfStyles.subLogoText}>LABORATORIO PRIVADO DE INFORMÁTICA FORENSE & CIBERSEGURIDAD</Text>
          <Text style={pdfStyles.addressText}>
            Avenida 6, con calle 7, Edificio Mercantil La Ceiba, primer piso, oficina N° 8, Quíbor, Municipio Jiménez del Estado Lara.
          </Text>
        </View>

        <View style={pdfStyles.titleBlock}>
          <Text style={pdfStyles.mainTitle}>ACTA DE TRAZABILIDAD Y REGISTRO DE AUDITORÍA CRIPTOGRÁFICA</Text>
          <Text style={pdfStyles.subTitle}>LOGS INMUTABLES EN CADENA SHA-256 (ISO/IEC 27037 & MUCC-2017)</Text>
          <View style={pdfStyles.expedienteBox}>
            <View style={pdfStyles.expedienteSlot}>
              <Text style={pdfStyles.expedienteText}>EXPEDIENTE N°:</Text>
              <View style={pdfStyles.expedienteLine}>
                <Text style={{ fontSize: 8, paddingLeft: 4, fontFamily: 'Helvetica-Bold' }}>{numeroExpediente}</Text>
              </View>
            </View>
            <View style={pdfStyles.expedienteSlot}>
              <Text style={pdfStyles.expedienteText}>REGISTROS HASH:</Text>
              <View style={pdfStyles.expedienteLine}>
                <Text style={{ fontSize: 8, paddingLeft: 4, fontFamily: 'Helvetica-Bold' }}>{listLogs ? listLogs.length : 0} Eventos Secuenciales</Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={pdfStyles.sectionTitle}>I. REGISTROS DE TRAZABILIDAD (HASH CHAIN SHA-256 INMUTABLE)</Text>
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableHeaderCell, { width: '20%' }]}>FECHA / HORA</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '20%' }]}>ACCIÓN</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '25%' }]}>USUARIO / PERITO</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '35%' }]}>HASH HASH-CHAIN (SHA-256)</Text>
          </View>

          {listLogs && listLogs.length > 0 ? (
            listLogs.slice(0, 10).map((log: any, idx: number) => (
              <View style={pdfStyles.tableRow} key={idx}>
                <Text style={[pdfStyles.tableCell, { width: '20%', fontSize: 6.5 }]}>{isBlankMode ? '' : log.timestamp}</Text>
                <Text style={[pdfStyles.tableCell, { width: '20%', fontSize: 6.5 }]}>{isBlankMode ? '' : log.action}</Text>
                <Text style={[pdfStyles.tableCell, { width: '25%', fontSize: 6.5 }]}>{isBlankMode ? '' : log.user}</Text>
                <Text style={[pdfStyles.tableCell, { width: '35%', fontSize: 5.5, fontFamily: 'Helvetica' }]}>
                  {isBlankMode ? '' : (log.hash || log.hashActual)}
                </Text>
              </View>
            ))
          ) : (
            <View style={pdfStyles.tableRow}>
              <Text style={[pdfStyles.tableCell, { width: '20%' }]}>{''}</Text>
              <Text style={[pdfStyles.tableCell, { width: '20%' }]}>{''}</Text>
              <Text style={[pdfStyles.tableCell, { width: '25%' }]}>{''}</Text>
              <Text style={[pdfStyles.tableCell, { width: '35%' }]}>{''}</Text>
            </View>
          )}
        </View>

        <Text style={pdfStyles.sectionTitle}>II. VALIDACIÓN PERICIAL DE INTEGRIDAD Y NO MANIPULACIÓN</Text>
        <Text style={pdfStyles.paragraph}>
          El presente informe valida que los logs expuestos corresponden a la cadena inmutable procesada criptográficamente con algoritmo SHA-256, sin modificaciones ni interrupciones en la trazabilidad. Cada registro generado por la plataforma SHA256.US queda enlazado de forma indeleble al bloque previo.
        </Text>

        <View style={pdfStyles.signatureSection}>
          <View style={[pdfStyles.peritoCard, { width: '65%', marginHorizontal: 'auto' }]}>
            <Text style={pdfStyles.peritoCardHeaderTitle}>OFICIAL DE COMPLIANCE / PERITO AUDITOR</Text>
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
            <Text style={pdfStyles.peritoCardSubTitle}>FIRMA DEL PERITO AUDITOR</Text>
            <Text style={{ fontSize: 7.5, marginTop: 2, fontFamily: 'Helvetica-Bold' }}>{fmt(c.peritoLider)}</Text>
          </View>
        </View>

        {/* FOOTER OFICIAL */}
        <View style={pdfStyles.footer} fixed>
          <Text style={pdfStyles.footerTextLine}>{NORMATIVA_FOOTER_LINE_1}</Text>
          <Text style={[pdfStyles.footerTextLine, { fontFamily: 'Helvetica-Bold' }]}>{NORMATIVA_FOOTER_LINE_2}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default ActaAuditoriaTimelinePdf;
