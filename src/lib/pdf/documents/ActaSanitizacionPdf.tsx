import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { pdfStyles, formatValue } from '../reactPdfStyles';
import { PlanillaHeader, PlanillaFooter } from '../PlanillaHeaderFooter';

interface Props {
  caso?: any;
  isBlankMode?: boolean;
}

export const ActaSanitizacionPdf: React.FC<Props> = ({ caso, isBlankMode = false }) => {
  const c = caso || {};
  const fmt = (val?: string, placeholder: string = '') => formatValue(val, isBlankMode, placeholder);
  const numeroExpediente = fmt(c.numeroCaso, '[ EXP-2026-SHA-0091 ]');

  return (
    <Document title={`Acta_Sanitizacion_${c.numeroCaso || 'EXP'}`}>
      <Page size={[612, 936]} style={pdfStyles.page}>
        <PlanillaHeader />

        <View style={pdfStyles.titleBlock}>
          <Text style={pdfStyles.mainTitle}>ACTA DE SANITIZACIÓN CRIPTOGRÁFICA Y BORRADO SEGURO DE SERVIDOR</Text>
          <Text style={pdfStyles.subTitle}>CERTIFICADO DE DESTRUCCIÓN IRREVERSIBLE DE IMÁGENES FORENSES Y DEPÓSITOS TEMPORALES (NIST SP 800-88 REV. 1 & ISO/IEC 27001)</Text>
          
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
                <Text style={{ fontSize: 8, paddingLeft: 4, fontFamily: 'Helvetica-Bold' }}>{fmt(c.numeroPRCC, '[ PRCC-2026-0042 ]')}</Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={pdfStyles.sectionTitle}>I. DATOS DEL CASO Y REPOSITORIO A SANITIZAR</Text>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Cliente / Empresa Contratante:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.empresa || c.solicitante_nombre, '[ Nombre de la Empresa / Cliente Contratante ]')}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Servidor / Storage de Proceso:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.servidorStorage, '[ Nodo Storage SHA256 / Vol. Encriptado ZFS-POOL-02 ]')}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Fecha y Hora de Sanitización:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.fechaSanitizacion || c.fecha, '[ Fecha y Hora del Borrado Criptográfico ]')}</Text>
        </View>

        <Text style={pdfStyles.sectionTitle}>II. ESPECIFICACIÓN DE COPIAS BIT A BIT E IMÁGENES ELIMINADAS</Text>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Imágenes Forenses Eliminadas:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.archivosSanitizados, '[ Imagen Raw .E01 / Clon Bit a Bit / Dump de Memoria RAM ]')}</Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Hash SHA-256 de Verificación Previa:</Text>
          <Text style={{ fontSize: 6.5, fontFamily: 'Courier', color: '#111' }}>
            {fmt(c.hashImagenPrevio, 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')}
          </Text>
        </View>
        <View style={pdfStyles.fieldRow}>
          <Text style={pdfStyles.fieldLabel}>Estándar de Sanitización Aplicado:</Text>
          <Text style={pdfStyles.fieldValue}>{fmt(c.estandarWipe, 'NIST SP 800-88 Rev. 1 Purge (Overwrite Pseudorandom 3-Pass)')}</Text>
        </View>

        <Text style={pdfStyles.sectionTitle}>III. CERTIFICACIÓN Y CONFORMIDAD DE DESTRUCCIÓN IRREVERSIBLE</Text>
        <View style={{ padding: 6, backgroundColor: '#F8F9FA', borderRadius: 4, marginBottom: 8, borderLeftWidth: 3, borderLeftColor: '#00FF41' }}>
          <Text style={{ fontSize: 7, color: '#111111', lineHeight: 1.4, textAlign: 'justify' }}>
            Se certifica que una vez vencido el periodo reglamentario de retención y habiendo entregado el dictamen final al cliente, se ejecutó la destrucción irreversible de todas las copias de trabajo temporales en los servidores del laboratorio SHA256.US. Los bloques de memoria fueron sobreescritos y desasignados de forma no recuperable.
          </Text>
        </View>

        {/* RECUADRO DE FIRMAS Y HUELLAS */}
        <View style={pdfStyles.signatureSection}>
          <View style={pdfStyles.peritoCard}>
            <Text style={pdfStyles.peritoCardHeaderTitle}>OFICIAL DE SEGURIDAD SHA256.US</Text>
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
            <Text style={pdfStyles.peritoCardSubTitle}>FIRMA DEL OFICIAL DE SEGURIDAD</Text>
            <View style={{ marginTop: 4, width: '100%' }}>
              <View style={pdfStyles.peritoFieldRow}>
                <Text style={pdfStyles.peritoFieldLabel}>Nombre:</Text>
                <Text style={pdfStyles.peritoFieldValue}>{fmt(c.peritoLider)}</Text>
              </View>
              <View style={pdfStyles.peritoFieldRow}>
                <Text style={pdfStyles.peritoFieldLabel}>C.I. N°:</Text>
                <Text style={pdfStyles.peritoFieldValue}>{fmt(c.peritoCedula)}</Text>
              </View>
            </View>
          </View>

          <View style={pdfStyles.peritoCard}>
            <Text style={pdfStyles.peritoCardHeaderTitle}>CLIENTE / AUDITOR DE CUMPLIMIENTO</Text>
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
            <Text style={pdfStyles.peritoCardSubTitle}>FIRMA DEL RECEPTOR DE CERTIFICADO</Text>
            <View style={{ marginTop: 4, width: '100%' }}>
              <View style={pdfStyles.peritoFieldRow}>
                <Text style={pdfStyles.peritoFieldLabel}>Nombre:</Text>
                <Text style={pdfStyles.peritoFieldValue}>{fmt(c.solicitante_nombre)}</Text>
              </View>
              <View style={pdfStyles.peritoFieldRow}>
                <Text style={pdfStyles.peritoFieldLabel}>C.I. N°:</Text>
                <Text style={pdfStyles.peritoFieldValue}>{fmt(c.solicitante_cedula)}</Text>
              </View>
            </View>
          </View>
        </View>

        <PlanillaFooter />
      </Page>
    </Document>
  );
};

export default ActaSanitizacionPdf;
