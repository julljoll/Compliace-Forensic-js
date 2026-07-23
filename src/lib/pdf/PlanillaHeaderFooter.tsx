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
      <Text style={pdfStyles.logoText}>SHA256.US</Text>
    </View>
    <Text style={pdfStyles.subLogoText}>LABORATORIO PRIVADO DE INFORMÁTICA FORENSE & CIBERSEGURIDAD</Text>
    <Text style={pdfStyles.addressText}>
      Avenida 6, con calle 7, Edificio Mercantil La Ceiba, primer piso, oficina N° 8, Quíbor, Municipio Jiménez del Estado Lara.
    </Text>
  </View>
);

/**
 * Membrete Inferior / Pie de Página Oficial Inmutable
 * Presente de forma uniforme en todas las planillas y hojas del sistema.
 */
export const PlanillaFooter: React.FC = () => (
  <View style={pdfStyles.footer} fixed>
    <Text style={pdfStyles.footerTextLine}>{NORMATIVA_FOOTER_LINE_1}</Text>
    <Text style={[pdfStyles.footerTextLine, { fontFamily: 'Helvetica-Bold' }]}>{NORMATIVA_FOOTER_LINE_2}</Text>
  </View>
);
