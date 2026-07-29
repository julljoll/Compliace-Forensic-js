import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { pdfStyles, formatValue } from './reactPdfStyles';
import { PlanillaHeader, PlanillaFooter } from './PlanillaHeaderFooter';
import { getPlanillaRegistry } from '../../data/planillasRegistry';

interface PlanillaCoverPagePdfProps {
  planillaId: string;
  caso?: any;
  isBlankMode?: boolean;
  peritoNombre?: string;
  totalFoliosEstimated?: number;
}

const styles = StyleSheet.create({
  classificationBanner: {
    backgroundColor: '#0F172A',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 3,
    marginBottom: 8,
    alignItems: 'center',
  },
  classificationText: {
    color: '#FECF06',
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  coverTitleBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#0F172A',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    width: '100%',
  },
  codeBadge: {
    backgroundColor: '#0F172A',
    color: '#00FF41',
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
    marginBottom: 4,
  },
  coverMainTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 4,
    textTransform: 'uppercase',
    lineHeight: 1.2,
  },
  coverSubtitle: {
    fontSize: 7.5,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 6,
  },
  expedienteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#CBD5E1',
    paddingTop: 6,
    marginTop: 2,
  },
  expSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  expLabel: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: '#0F172A',
  },
  expValue: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: '#1E293B',
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
  },
  legendHeader: {
    backgroundColor: '#0F172A',
    color: '#FFFFFF',
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginTop: 4,
    marginBottom: 6,
    borderRadius: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legendHeaderText: {
    color: '#FECF06',
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 0.5,
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 3,
    marginBottom: 10,
  },
  tableRowHeader: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
    paddingVertical: 3,
    paddingHorizontal: 6,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 4,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  colNum: {
    width: '12%',
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: '#0F172A',
  },
  colTitle: {
    width: '53%',
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: '#0F172A',
  },
  colDesc: {
    width: '35%',
    fontSize: 6.8,
    color: '#475569',
  },
  colHeader: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: '#334155',
    textTransform: 'uppercase',
  },
  normativasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
    marginBottom: 8,
  },
  normChip: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
  },
  normChipText: {
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    color: '#334155',
  },
  signaturesBlock: {
    marginTop: 'auto',
    borderTopWidth: 1.5,
    borderTopColor: '#0F172A',
    paddingTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  signatureBox: {
    width: '45%',
    alignItems: 'center',
  },
  signatureLine: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#0F172A',
    marginBottom: 4,
    height: 24,
  },
  sigText: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: '#0F172A',
    textAlign: 'center',
  },
  sigSubtext: {
    fontSize: 6,
    color: '#64748B',
    textAlign: 'center',
  },
  fingerprintBox: {
    width: 44,
    height: 48,
    borderWidth: 1,
    borderColor: '#0F172A',
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  fingerprintText: {
    fontSize: 5.5,
    color: '#94A3B8',
    textAlign: 'center',
  },
});

export const PlanillaCoverPagePdf: React.FC<PlanillaCoverPagePdfProps> = ({
  planillaId,
  caso,
  isBlankMode = false,
  peritoNombre,
  totalFoliosEstimated,
}) => {
  const registry = getPlanillaRegistry(planillaId);
  const c = caso || {};
  const fmt = (val?: string, placeholder: string = '') => formatValue(val, isBlankMode, placeholder);

  const expNumero = fmt(c.numeroCaso, 'EXP-2026-SHA-0091');
  const prccNumero = fmt(c.numeroPRCC, 'PRCC-2026-0042');
  const fechaEmision = fmt(c.fecha, '23/07/2026 - 09:30 AM');
  const perito = fmt(peritoNombre || c.peritoAsignado, 'Ing. Carlos Perdomo (Perito Forense CIP-8492)');

  return (
    <Page size={[612, 936]} style={pdfStyles.page}>
      <PlanillaHeader />

      {/* Banner de Clasificación Legal */}
      <View style={styles.classificationBanner}>
        <Text style={styles.classificationText}>
          DOSSIER FORENSE OFICIAL — FOLIO 01 | EXPEDIENTE DE CUSTODIA Y COMPLIANCE INMUTABLE
        </Text>
      </View>

      {/* Bloque Central de Título */}
      <View style={styles.coverTitleBox}>
        <Text style={styles.codeBadge}>{registry.codigo}</Text>
        <Text style={styles.coverMainTitle}>{registry.nombreOficial}</Text>
        <Text style={styles.coverSubtitle}>{registry.subtitulo}</Text>

        <View style={styles.expedienteRow}>
          <View style={styles.expSlot}>
            <Text style={styles.expLabel}>EXPEDIENTE:</Text>
            <Text style={styles.expValue}>{expNumero}</Text>
          </View>
          <View style={styles.expSlot}>
            <Text style={styles.expLabel}>PRCC N°:</Text>
            <Text style={styles.expValue}>{prccNumero}</Text>
          </View>
          <View style={styles.expSlot}>
            <Text style={styles.expLabel}>FECHA:</Text>
            <Text style={styles.expValue}>{fechaEmision}</Text>
          </View>
        </View>
      </View>

      {/* Leyenda Dinámica de Secciones Enumeradas */}
      <View style={styles.legendHeader}>
        <Text style={styles.legendHeaderText}>
          LEYENDA DE CONTENIDO ENUMERADO SECCIÓN POR SECCIÓN
        </Text>
        <Text style={{ fontSize: 7, color: '#94A3B8' }}>
          {registry.sections.length} SECCIONES REGISTRADAS
        </Text>
      </View>

      <View style={styles.table}>
        <View style={styles.tableRowHeader}>
          <Text style={[styles.colNum, styles.colHeader]}>N° SECC.</Text>
          <Text style={[styles.colTitle, styles.colHeader]}>DENOMINACIÓN DE LA SECCIÓN</Text>
          <Text style={[styles.colDesc, styles.colHeader]}>DESCRIPCIÓN Y CAMPOS</Text>
        </View>

        {registry.sections.map((sec, index) => (
          <View
            key={sec.numero || index}
            style={[
              styles.tableRow,
              index % 2 === 1 ? { backgroundColor: '#F8FAFC' } : {},
            ]}
          >
            <Text style={styles.colNum}>{sec.numero}</Text>
            <Text style={styles.colTitle}>{sec.titulo}</Text>
            <Text style={styles.colDesc}>
              {sec.descripcion}{' '}
              {sec.camposCount ? `(${sec.camposCount} ítems)` : ''}
            </Text>
          </View>
        ))}
      </View>

      {/* Normativas RAG Ancladas */}
      <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', color: '#0F172A', marginTop: 2 }}>
        MARCO NORMATIVO RAG APLICABLE A ESTA PLANILLA:
      </Text>
      <View style={styles.normativasContainer}>
        {registry.normativas.map((norm, i) => (
          <View key={i} style={styles.normChip}>
            <Text style={styles.normChipText}>⚖️ {norm}</Text>
          </View>
        ))}
      </View>

      <PlanillaFooter />
    </Page>
  );
};

export default PlanillaCoverPagePdf;
