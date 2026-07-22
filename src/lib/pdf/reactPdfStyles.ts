import { StyleSheet } from '@react-pdf/renderer';

export const FOLIO_SIZE: [number, number] = [612, 936];

/**
 * Función de formateo limpia: Garantiza que en la vista previa e impresión
 * no existan textos placeholder o ficticios entre corchetes [...].
 */
export function formatValue(val?: string, isBlankMode: boolean = true, defaultBlank: string = ''): string {
  if (!val || val.trim() === '' || val.includes('[') || val.includes(']')) {
    return defaultBlank;
  }
  return val.trim();
}

export const NORMATIVA_FOOTER_LINE_1 = 'Documento Oficial generado bajo los estándares de la Ley sobre Mensajes de Datos y Firmas Electrónicas, el Manual Único de Cadena de Custodia de Evidencias (MUCC-2017) y la norma ISO/IEC 27037:2012.';
export const NORMATIVA_FOOTER_LINE_2 = 'SHA256.US — Laboratorio de Informática Forense y Ciberseguridad | Consignación Privada y Cumplimiento Normativo.';

export function formatCleanValue(val?: string, defaultBlank: string = ''): string {
  return formatValue(val, true, defaultBlank);
}

export const pdfStyles = StyleSheet.create({
  page: {
    size: [612, 936], // Hoja Folio (216mm x 330mm)
    backgroundColor: '#FFFFFF',
    paddingTop: 138,      // Margen Superior de 4.8 cm para la Hoja 1 (despejando el membrete)
    paddingLeft: 85.04,   // Margen Izquierdo: 3 cm (85.04 pt) - Encuadernación Pericial
    paddingRight: 42.52,  // Margen Derecho: 1.5 cm (42.52 pt)
    paddingBottom: 55,    // Margen Inferior: 1.5 cm (55 pt para footer de 2 líneas)
    fontFamily: 'Helvetica',
    fontSize: 8.5,
    color: '#1E293B',
    position: 'relative',
  },
  pageSecond: {
    size: [612, 936],
    backgroundColor: '#FFFFFF',
    paddingTop: 50,       // Hoja 2+: Sin encabezado, inicio despejado en la parte superior
    paddingLeft: 85.04,
    paddingRight: 42.52,
    paddingBottom: 55,
    fontFamily: 'Helvetica',
    fontSize: 8.5,
    color: '#1E293B',
    position: 'relative',
  },
  headerContainer: {
    position: 'absolute',
    top: 40,
    left: 85.04,
    right: 42.52,
    flexDirection: 'column',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: '#0F172A',
    paddingBottom: 5,
  },
  headerBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 2,
  },
  headerLogo: {
    width: 24,
    height: 24,
  },
  logoText: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1.5,
    color: '#0F172A',
  },
  subLogoText: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#1E293B',
    letterSpacing: 0.5,
    marginTop: 1,
    textAlign: 'center',
  },
  addressText: {
    fontSize: 6.5,
    color: '#475569',
    textAlign: 'center',
    marginTop: 2,
  },
  titleBlock: {
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 6,
    width: '100%',
  },
  mainTitle: {
    fontSize: 11.5,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#0F172A',
  },
  subTitle: {
    fontSize: 8,
    fontFamily: 'Helvetica',
    textAlign: 'center',
    color: '#334155',
    marginTop: 2,
  },
  /* CASILLA DE EXPEDIENTE Y PRCC ALARGADA AL 100% DE ANCHO */
  expedienteBox: {
    marginTop: 6,
    marginBottom: 2,
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#0F172A',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expedienteSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
  },
  expedienteText: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: '#0F172A',
  },
  expedienteLine: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#0F172A',
    minHeight: 12,
    marginLeft: 4,
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#0F172A',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderLeftWidth: 3,
    borderLeftColor: '#0F172A',
    borderBottomWidth: 0.5,
    borderBottomColor: '#CBD5E1',
    marginTop: 8,
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#94A3B8',
    marginVertical: 4,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#CBD5E1',
    minHeight: 18,
    alignItems: 'center',
  },
  tableHeaderCell: {
    backgroundColor: '#E2E8F0',
    fontFamily: 'Helvetica-Bold',
    fontSize: 7.5,
    color: '#0F172A',
    padding: 4,
    borderRightWidth: 0.5,
    borderRightColor: '#94A3B8',
  },
  tableCell: {
    fontSize: 7.5,
    color: '#1E293B',
    padding: 4,
    borderRightWidth: 0.5,
    borderRightColor: '#CBD5E1',
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 2.5,
  },
  fieldLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8,
    color: '#1E293B',
    width: 145,
  },
  fieldValue: {
    flex: 1,
    fontSize: 8,
    color: '#0F172A',
    borderBottomWidth: 1,
    borderBottomColor: '#64748B',
    minHeight: 15,
    paddingBottom: 1,
  },
  paragraph: {
    fontSize: 8,
    lineHeight: 1.45,
    color: '#1E293B',
    textAlign: 'justify',
    marginVertical: 4,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 14,
    marginVertical: 3,
  },
  checkboxBox: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
    backgroundColor: '#FFFFFF',
  },
  checkboxCheck: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: '#0F172A',
  },
  signatureSection: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  signatureCard: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#64748B',
    padding: 6,
    marginBottom: 8,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },

  /* TARJETA OFICIAL DEL PERITO RECEPTOR / EXPERTO */
  peritoCard: {
    width: '49%',
    borderWidth: 1,
    borderColor: '#0F172A',
    padding: 6,
    marginBottom: 8,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  peritoCardHeaderTitle: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  peritoCardDividerLine: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#0F172A',
    marginVertical: 3,
  },
  peritoThumbBox: {
    width: 48,
    height: 60,
    borderWidth: 1,
    borderColor: '#334155',
    borderStyle: 'dashed',
    marginBottom: 2,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 3,
    backgroundColor: '#FFFFFF',
  },
  peritoThumbText: {
    fontSize: 5.5,
    fontFamily: 'Helvetica-Bold',
    color: '#1E293B',
    textAlign: 'center',
  },
  peritoDottedLine: {
    width: '100%',
    borderBottomWidth: 0.5,
    borderBottomColor: '#94A3B8',
    borderStyle: 'dotted',
    marginVertical: 4,
  },
  peritoSignatureLine: {
    width: '90%',
    borderBottomWidth: 1,
    borderBottomColor: '#0F172A',
    marginTop: 14,
    marginBottom: 3,
  },
  peritoCardSubTitle: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: '#0F172A',
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  peritoFieldRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 1.5,
  },
  peritoFieldLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 7.5,
    color: '#0F172A',
    width: 82,
  },
  peritoFieldValue: {
    flex: 1,
    fontSize: 7.5,
    color: '#0F172A',
    borderBottomWidth: 0.5,
    borderBottomColor: '#475569',
    borderStyle: 'dotted',
    minHeight: 12,
  },

  thumbBox: {
    width: 44,
    height: 54,
    borderWidth: 1,
    borderColor: '#475569',
    borderStyle: 'dashed',
    marginBottom: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  thumbText: {
    fontSize: 5.5,
    fontFamily: 'Helvetica-Bold',
    color: '#64748B',
    textAlign: 'center',
  },
  signatureLine: {
    width: '85%',
    borderBottomWidth: 1,
    borderBottomColor: '#0F172A',
    marginTop: 18,
    marginBottom: 4,
  },
  signatureLabel: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: '#0F172A',
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 12,
    left: 85.04,
    right: 42.52,
    borderTopWidth: 1,
    borderTopColor: '#CBD5E1',
    paddingTop: 4,
    flexDirection: 'column',
    alignItems: 'center',
  },
  footerTextLine: {
    fontSize: 8,
    color: '#334155',
    textAlign: 'center',
    lineHeight: 1.25,
  },
  watermark: {
    position: 'absolute',
    top: '40%',
    left: '20%',
    opacity: 0.04,
    fontSize: 38,
    fontFamily: 'Helvetica-Bold',
    color: '#000000',
    transform: 'rotate(-30deg)',
  },
  classificationBanner: {
    backgroundColor: '#0F172A',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 2,
    marginBottom: 4,
    alignSelf: 'center',
  },
  classificationText: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
    letterSpacing: 1,
    textAlign: 'center',
  },
  impartialityBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#0F172A',
    borderLeftWidth: 4,
    borderLeftColor: '#0F172A',
    padding: 6,
    marginVertical: 5,
  },
  limitationsBox: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderLeftWidth: 4,
    borderLeftColor: '#D97706',
    padding: 6,
    marginVertical: 5,
  },
  qaRow: {
    marginVertical: 3,
    padding: 4,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 0.5,
    borderBottomColor: '#CBD5E1',
  },
  qText: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#0F172A',
    marginBottom: 2,
  },
  aText: {
    fontSize: 8,
    fontFamily: 'Helvetica',
    color: '#334155',
    lineHeight: 1.3,
  },
});

