import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { pdfStyles, formatValue } from '../reactPdfStyles';
import { PlanillaHeader, PlanillaFooter } from '../PlanillaHeaderFooter';

interface Props {
  caso?: any;
  isBlankMode?: boolean;
}

export const PlanillaPRCCPdf: React.FC<Props> = ({ caso, isBlankMode = false }) => {
  const c = caso || {};
  const fmt = (val?: string, placeholder: string = '') => formatValue(val, isBlankMode, placeholder);
  const numeroExpediente = fmt(c.numeroCaso, '[ EXP-2026-SHA-0091 ]');
  const numeroPRCC = fmt(c.numeroPRCC, '[ PRCC-2026-0042 ]');
  const fecha = fmt(c.fecha, '[ Fecha y Hora de Apertura ]');

  return (
    <Document title={`Planilla_PRCC_${c.numeroCaso || 'EXP'}`}>
      {/* PÁGINA 1 — CON ENCABEZADO */}
      <Page size={[612, 936]} style={pdfStyles.page}>
        <PlanillaHeader />

        {/* Title Block con Casilla Alargada al 100% */}
        <View style={pdfStyles.titleBlock}>
          <Text style={pdfStyles.mainTitle}>PLANILLA DE REGISTRO DE CADENA DE CUSTODIA (PRCC)</Text>
          <Text style={pdfStyles.subTitle}>CONTROL SECUENCIAL DE TRAZABILIDAD Y HASH SHA-256 (MUCC-2017 & ART. 187 COPP)</Text>
          
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
                <Text style={{ fontSize: 8, paddingLeft: 4, fontFamily: 'Helvetica-Bold' }}>{numeroPRCC}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* SECCIÓN I: DATOS DEL CASO Y DEL CONSIGNANTE */}
        <Text style={pdfStyles.sectionTitle}>I. DATOS DEL CASO, CONSIGNANTE Y ORGANISMO RECEPTOR</Text>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Apellidos y Nombres Consignante:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.solicitante_nombre)}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Cédula de Identidad / RIF:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.solicitante_cedula)}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>N° de Expediente / Caso:</Text>
          <Text style={pdfStyles.fieldValue}>{numeroExpediente}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Sede de Resguardo / Bóveda:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.sede)}</Text>
        </View>

        {/* SECCIÓN II: FORMA DE OBTENCIÓN */}
        <Text style={pdfStyles.sectionTitle}>II. FORMA DE OBTENCIÓN DE LA EVIDENCIA (MUCC-2017)</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 4 }}>
          <View style={pdfStyles.checkboxContainer}>
            <View style={pdfStyles.checkboxBox}><Text style={pdfStyles.checkboxCheck}>✓</Text></View>
            <Text style={{ fontSize: 7.5 }}>Consignación Directa Privada (Entrega Voluntaria)</Text>
          </View>
          <View style={pdfStyles.checkboxContainer}>
            <View style={pdfStyles.checkboxBox}><Text style={pdfStyles.checkboxCheck}></Text></View>
            <Text style={{ fontSize: 7.5 }}>Adquisición Técnico-Pericial Interna</Text>
          </View>
          <View style={pdfStyles.checkboxContainer}>
            <View style={pdfStyles.checkboxBox}><Text style={pdfStyles.checkboxCheck}></Text></View>
            <Text style={{ fontSize: 7.5 }}>Inspección Técnico-Pericial de Campo</Text>
          </View>
        </View>

        {/* SECCIÓN III: OPERARIOS PERICIALES */}
        <Text style={pdfStyles.sectionTitle}>III. OPERARIOS PERICIALES DE FIJACIÓN Y COLECCIÓN (MUCC-2017)</Text>
        <View style={{ paddingHorizontal: 2, marginVertical: 3 }}>
          <View style={pdfStyles.fieldRow}>
            <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 8, color: '#0F172A', width: 110 }}>a. Nombres y Apellidos:</Text>
            <Text style={pdfStyles.fieldValue}>{fmt(c.peritoLider)}</Text>
          </View>
          <View style={pdfStyles.fieldRow}>
            <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 8, color: '#0F172A', width: 110 }}>b. C.I:</Text>
            <Text style={pdfStyles.fieldValue}>{fmt(c.peritoCedula)}</Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6, marginBottom: 2 }}>
            <View style={{ width: '42%', alignItems: 'flex-start' }}>
              <View style={{ width: '100%', height: 68, borderWidth: 1, borderColor: '#334155', borderRadius: 4, backgroundColor: '#F8FAFC' }} />
              <Text style={{ fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: '#0F172A', marginTop: 2 }}>c. Firma Perito Colector</Text>
            </View>

            <View style={{ width: '27%', alignItems: 'center' }}>
              <View style={{ width: '100%', height: 68, borderWidth: 1, borderColor: '#334155', borderRadius: 4, backgroundColor: '#F8FAFC' }} />
              <Text style={{ fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: '#0F172A', marginTop: 2, textAlign: 'center' }}>Pulgar Izquierdo</Text>
            </View>

            <View style={{ width: '27%', alignItems: 'center' }}>
              <View style={{ width: '100%', height: 68, borderWidth: 1, borderColor: '#334155', borderRadius: 4, backgroundColor: '#F8FAFC' }} />
              <Text style={{ fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: '#0F172A', marginTop: 2, textAlign: 'center' }}>Pulgar Derecho</Text>
            </View>
          </View>
        </View>

        {/* SECCIÓN IV: DESCRIPCIÓN DE LA EVIDENCIA DIGITAL */}
        <Text style={pdfStyles.sectionTitle}>IV. DESCRIPCIÓN DETALLADA DE LA EVIDENCIA DIGITAL CONSIGNADA</Text>
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableHeaderCell, { width: '30%' }]}>Evidencia / Dispositivo</Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: '70%' }]}>Especificación Técnica / Serial / Hash SHA-256 Génesis</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '30%', fontFamily: 'Helvetica-Bold' }]}>Equipo Móvil / Computador</Text>
            <Text style={[pdfStyles.tableCell, { width: '70%' }]}>{fmt(c.dispositivo_marca ? `${c.dispositivo_marca} ${c.dispositivo_modelo || ''}` : undefined)}</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '30%', fontFamily: 'Helvetica-Bold' }]}>Precinto de Seguridad</Text>
            <Text style={[pdfStyles.tableCell, { width: '70%' }]}>{fmt(c.precinto_numero || 'Tamper-Evident Seal SEC-2026-8849')}</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { width: '30%', fontFamily: 'Helvetica-Bold' }]}>Hash SHA-256 Génesis</Text>
            <Text style={[pdfStyles.tableCell, { width: '70%', fontSize: 6.5 }]}>{fmt(c.hashGenesis)}</Text>
          </View>
        </View>

        {/* FOOTER OFICIAL */}
        <PlanillaFooter />
      </Page>

      {/* PÁGINA 2 — CONTINUIDAD Y TRASLADOS */}
      <Page size={[612, 936]} style={pdfStyles.pageSecond}>
        <Text style={pdfStyles.sectionTitle}>V. CONTINUIDAD Y REGISTRO SECUENCIAL DE TRASLADOS DE CADENA DE CUSTODIA (MUCC-2017)</Text>
        
        {/* BLOQUE DE TRASLADO N° 01 */}
        <View style={{ borderWidth: 1, borderColor: '#0F172A', padding: 5, marginBottom: 8, backgroundColor: '#FFFFFF' }}>
          <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#0F172A', marginBottom: 3 }}>
            REGISTRO DE TRASLADO N° 01 (CONSIGNACIÓN DE EVIDENCIA EN BÓVEDA):
          </Text>
          <View style={pdfStyles.fieldRow}>
            <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 7.5, color: '#0F172A', width: 85 }}>Fecha y Hora:</Text>
            <Text style={pdfStyles.fieldValue}>{fecha}</Text>
            <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 7.5, color: '#0F172A', width: 60, marginLeft: 10 }}>Propósito:</Text>
            <Text style={pdfStyles.fieldValue}>{fmt(c.proposito_traslado || 'Ingreso a Bóveda Forense & Análisis IPED/PhotoHolmes')}</Text>
          </View>

          {/* Entregado por */}
          <Text style={{ fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: '#0F172A', marginTop: 4, marginBottom: 2 }}>
            A. ENTREGADO POR (CUSTODIO SALIENTE):
          </Text>
          <View style={pdfStyles.fieldRow}>
            <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 7.5, color: '#0F172A', width: 100 }}>Nombres y Apellidos:</Text>
            <Text style={pdfStyles.fieldValue}>{fmt(c.solicitante_nombre)}</Text>
            <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 7.5, color: '#0F172A', width: 35, marginLeft: 10 }}>C.I.:</Text>
            <Text style={pdfStyles.fieldValue}>{fmt(c.solicitante_cedula)}</Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4, marginBottom: 4 }}>
            <View style={{ width: '42%', alignItems: 'flex-start' }}>
              <View style={{ width: '100%', height: 60, borderWidth: 1, borderColor: '#334155', borderRadius: 4, backgroundColor: '#F8FAFC' }} />
              <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', color: '#0F172A', marginTop: 2 }}>Firma Custodio Saliente</Text>
            </View>
            <View style={{ width: '27%', alignItems: 'center' }}>
              <View style={{ width: '100%', height: 60, borderWidth: 1, borderColor: '#334155', borderRadius: 4, backgroundColor: '#F8FAFC' }} />
              <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', color: '#0F172A', marginTop: 2, textAlign: 'center' }}>Pulgar Izquierdo</Text>
            </View>
            <View style={{ width: '27%', alignItems: 'center' }}>
              <View style={{ width: '100%', height: 60, borderWidth: 1, borderColor: '#334155', borderRadius: 4, backgroundColor: '#F8FAFC' }} />
              <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', color: '#0F172A', marginTop: 2, textAlign: 'center' }}>Pulgar Derecho</Text>
            </View>
          </View>

          {/* Recibido por */}
          <Text style={{ fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: '#0F172A', marginTop: 4, marginBottom: 2 }}>
            B. RECIBIDO POR (PERITO RECEPTOR EN BÓVEDA):
          </Text>
          <View style={pdfStyles.fieldRow}>
            <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 7.5, color: '#0F172A', width: 100 }}>Nombres y Apellidos:</Text>
            <Text style={pdfStyles.fieldValue}>{fmt(c.peritoLider)}</Text>
            <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 7.5, color: '#0F172A', width: 35, marginLeft: 10 }}>C.I.:</Text>
            <Text style={pdfStyles.fieldValue}>{fmt(c.peritoCedula)}</Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4, marginBottom: 2 }}>
            <View style={{ width: '42%', alignItems: 'flex-start' }}>
              <View style={{ width: '100%', height: 60, borderWidth: 1, borderColor: '#334155', borderRadius: 4, backgroundColor: '#F8FAFC' }} />
              <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', color: '#0F172A', marginTop: 2 }}>Firma Perito Receptor</Text>
            </View>
            <View style={{ width: '27%', alignItems: 'center' }}>
              <View style={{ width: '100%', height: 60, borderWidth: 1, borderColor: '#334155', borderRadius: 4, backgroundColor: '#F8FAFC' }} />
              <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', color: '#0F172A', marginTop: 2, textAlign: 'center' }}>Pulgar Izquierdo</Text>
            </View>
            <View style={{ width: '27%', alignItems: 'center' }}>
              <View style={{ width: '100%', height: 60, borderWidth: 1, borderColor: '#334155', borderRadius: 4, backgroundColor: '#F8FAFC' }} />
              <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', color: '#0F172A', marginTop: 2, textAlign: 'center' }}>Pulgar Derecho</Text>
            </View>
          </View>
        </View>

        {/* SECCIÓN VI: FIRMAS Y RESPONSABILIDAD */}
        <Text style={pdfStyles.sectionTitle}>VI. CERTIFICACIÓN PERICIAL, FIRMAS Y RESPONSABILIDAD DE CUSTODIA</Text>
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
            <Text style={pdfStyles.signatureLabel}>CUSTODIO SALIENTE / CONSIGNANTE</Text>
            <Text style={{ fontSize: 7, marginTop: 2 }}>C.I.: {fmt(c.solicitante_cedula)}</Text>
          </View>

          <View style={pdfStyles.peritoCard}>
            <Text style={pdfStyles.peritoCardHeaderTitle}>PERITO RECEPTOR EN BÓVEDA</Text>
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

export default PlanillaPRCCPdf;
