import { StyleSheet } from '@react-pdf/renderer';

export const FOLIO_SIZE: [number, number] = [612, 936];

export function formatCleanValue(val?: string, defaultBlank: string = ''): string {
  if (!val || val.trim() === '' || (val.startsWith('[') && val.endsWith(']'))) {
    return defaultBlank;
  }
  return val;
}

export const pdfStyles = StyleSheet.create({
  page: {
    size: [612, 936],
    backgroundColor: '#FFFFFF',
    paddingTop: 113.4, // 40mm para primera página
    paddingLeft: 85.04, // 30mm encuadernación (3.0 cm)
    paddingRight: 42.52, // 15mm (1.5 cm)
    paddingBottom: 50, // 15mm + margen footer
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: '#000000',
    position: 'relative',
  },
  headerContainer: {
    position: 'absolute',
    top: 25,
    left: 85.04,
    right: 42.52,
    flexDirection: 'column',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 6,
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
    letterSpacing: 1,
  },
  subLogoText: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    marginTop: 2,
    textAlign: 'center',
  },
  addressText: {
    fontSize: 6.5,
    color: '#444444',
    textAlign: 'center',
    marginTop: 2,
  },
  titleBlock: {
    alignItems: 'center',
    marginVertical: 10,
  },
  mainTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  subTitle: {
    fontSize: 8.5,
    fontFamily: 'Helvetica',
    textAlign: 'center',
    marginTop: 2,
  },
  expedienteBox: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#000000',
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
  },
  sectionTitle: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    backgroundColor: '#EAEAEA',
    padding: 4,
    marginTop: 8,
    marginBottom: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#000000',
    textTransform: 'uppercase',
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#000000',
    marginVertical: 6,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    minHeight: 18,
    alignItems: 'center',
  },
  tableHeaderCell: {
    backgroundColor: '#F2F2F2',
    fontFamily: 'Helvetica-Bold',
    fontSize: 8,
    padding: 3,
    borderRightWidth: 1,
    borderRightColor: '#000000',
  },
  tableCell: {
    fontSize: 8,
    padding: 3,
    borderRightWidth: 1,
    borderRightColor: '#CCCCCC',
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 3,
  },
  fieldLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8.5,
    width: 140,
  },
  fieldValue: {
    flex: 1,
    fontSize: 8.5,
    borderBottomWidth: 0.5,
    borderBottomColor: '#000000',
    minHeight: 14,
    paddingBottom: 1,
  },
  paragraph: {
    fontSize: 8.5,
    lineHeight: 1.4,
    textAlign: 'justify',
    marginVertical: 4,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginVertical: 2,
  },
  checkboxBox: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  checkboxCheck: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
  },
  signatureSection: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  signatureCard: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#000000',
    padding: 6,
    marginBottom: 10,
    alignItems: 'center',
  },
  thumbBox: {
    width: 45,
    height: 60,
    borderWidth: 1,
    borderColor: '#000000',
    marginBottom: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbText: {
    fontSize: 6,
    color: '#888888',
    textAlign: 'center',
  },
  signatureLine: {
    width: '90%',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    marginTop: 20,
    marginBottom: 4,
  },
  signatureLabel: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 85.04,
    right: 42.52,
    borderTopWidth: 1,
    borderTopColor: '#CCCCCC',
    paddingTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 6.5,
    color: '#666666',
  },
  watermark: {
    position: 'absolute',
    top: '40%',
    left: '20%',
    opacity: 0.05,
    fontSize: 40,
    fontFamily: 'Helvetica-Bold',
    color: '#000000',
    transform: 'rotate(-30deg)',
  },
});
