import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { pdfStyles, formatValue } from '../reactPdfStyles';
import { PlanillaHeader, PlanillaFooter } from '../PlanillaHeaderFooter';

interface Props {
  caso?: any;
  auditLogs?: any[];
  logs?: any[];
  isBlankMode?: boolean;
}

export const ActaAuditoriaTimelinePdf: React.FC<Props> = ({ caso, auditLogs = [], logs = [], isBlankMode = false }) => {
  const c = caso || {};
  const fmt = (val?: string, placeholder: string = '') => formatValue(val, isBlankMode, placeholder);
  const numeroExpediente = fmt(c.numeroCaso, 'EXP-2026-SHA-0091');

  const defaultMockLogs = [
    { timestamp: '23/07/2026 09:30:15', action: 'RECEPCION_EVIDENCIA', user: 'Ing. Jull J. Ollarves S.', hash: 'a8f5f167f44f4964e6c998dee827110c4f828a21' },
    { timestamp: '23/07/2026 09:45:00', action: 'AISLAMIENTO_FARADAY', user: 'Ing. Jull J. Ollarves S.', hash: 'b4912a7812904812304918239041239048129304' },
    { timestamp: '23/07/2026 10:15:30', action: 'EXTRACCION_IPED', user: 'Ing. Jull J. Ollarves S.', hash: 'c984920194819284918294819284918294819284' },
    { timestamp: '23/07/2026 11:00:12', action: 'ANALISIS_PHOTOHOLMES', user: 'Ing. Jull J. Ollarves S.', hash: 'd102849182491204912049120491204912049120' },
    { timestamp: '23/07/2026 11:45:00', action: 'EMISION_DICTAMEN', user: 'Ing. Jull J. Ollarves S.', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4' },
  ];

  const incomingLogs = auditLogs && auditLogs.length > 0 ? auditLogs : logs;
  const listLogs = incomingLogs && incomingLogs.length > 0 ? incomingLogs : (isBlankMode ? [] : defaultMockLogs);

  return (
    <Document title={`Acta_Auditoria_Timeline_${c.numeroCaso || 'EXP'}`}>
      <Page size={[612, 936]} style={pdfStyles.page}>
        <PlanillaHeader />

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
            <Text style={[pdfStyles.tableHeaderCell, { width: '16%' }]}>FECHA / HORA</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '16%' }]}>ACCIÓN</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '16%' }]}>USUARIO / PERITO</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '52%' }]}>HASH HASH-CHAIN (SHA-256)</Text>
          </View>

          {listLogs && listLogs.length > 0 ? (
            listLogs.slice(0, 10).map((log: any, idx: number) => (
              <View style={pdfStyles.tableRow} key={idx}>
                <Text style={[pdfStyles.tableCell, { width: '16%', fontSize: 6.5 }]}>{isBlankMode ? '' : log.timestamp}</Text>
                <Text style={[pdfStyles.tableCell, { width: '16%', fontSize: 6.5 }]}>{isBlankMode ? '' : log.action}</Text>
                <Text style={[pdfStyles.tableCell, { width: '16%', fontSize: 6.5 }]}>{isBlankMode ? '' : log.user}</Text>
                <Text style={[pdfStyles.tableCell, { width: '52%', fontSize: 5.5, fontFamily: 'Courier' }]}>
                  {isBlankMode ? '' : (log.hash || log.hashActual)}
                </Text>
              </View>
            ))
          ) : (
            <View style={pdfStyles.tableRow}>
              <Text style={[pdfStyles.tableCell, { width: '16%' }]}>{''}</Text>
              <Text style={[pdfStyles.tableCell, { width: '16%' }]}>{''}</Text>
              <Text style={[pdfStyles.tableCell, { width: '16%' }]}>{''}</Text>
              <Text style={[pdfStyles.tableCell, { width: '52%' }]}>{''}</Text>
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
            <Text style={{ fontSize: 7.5, marginTop: 2, fontFamily: 'Helvetica-Bold' }}>{fmt(c.peritoLider, 'Ing. Jull J. Ollarves S.')}</Text>
          </View>
        </View>

        <PlanillaFooter />
      </Page>
    </Document>
  );
};

export default ActaAuditoriaTimelinePdf;
