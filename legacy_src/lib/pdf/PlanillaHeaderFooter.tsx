import React from 'react';
import { View, Text, Image } from '@react-pdf/renderer';
import { pdfStyles, NORMATIVA_FOOTER_LINE_1, NORMATIVA_FOOTER_LINE_2 } from './reactPdfStyles';

/**
 * Membrete Superior Oficial SHA256.US
 * Presente de forma uniforme en todas las planillas y hojas del sistema.
 */
export const PlanillaHeader: React.FC = () => (
  <View style={pdfStyles.headerContainer}>
    <View style={pdfStyles.headerBrandRow}>
      <Image src="/logo.png" style={pdfStyles.headerLogo} />
      <View style={pdfStyles.headerBrandTextCol}>
        <Text style={pdfStyles.logoText}>SHA256.US</Text>
        <Text style={pdfStyles.subLogoText}>Lab. Informática Forense</Text>
      </View>
    </View>
  </View>
);

/**
 * Membrete Inferior / Pie de Página Oficial Inmutable
 * Presente de forma uniforme en todas las planillas y hojas del sistema.
 */
export const PlanillaFooter: React.FC = () => (
  <View style={pdfStyles.footer} fixed>
    <Text style={[pdfStyles.footerTextLine, { fontFamily: 'Helvetica-Bold', color: '#0F172A', fontSize: 8 }]}>{NORMATIVA_FOOTER_LINE_2}</Text>
    <Text style={[pdfStyles.footerTextLine, { fontSize: 7.5, color: '#334155', marginTop: 1 }]}>{NORMATIVA_FOOTER_LINE_1}</Text>
    <Text style={[pdfStyles.footerTextLine, { fontSize: 7, color: '#475569', marginTop: 1.5 }]}>Sede Principal: Avenida 6, con calle 7, Edificio Mercantil La Ceiba, primer piso, oficina N° 8, Quíbor, Estado Lara, Venezuela.</Text>
  </View>
);
