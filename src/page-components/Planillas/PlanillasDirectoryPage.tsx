'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import { useCMSStore } from '../../store/cmsStore';
import { FileText, ChevronRight } from '../../components/atoms/AppleIcon';

interface PlanillaInfo {
  id: string;
  paso: string;
  nombre: string;
  descripcion: string;
  ruta: string;
  normativas: string[];
  isNew?: boolean;
}

interface EtapaLegal {
  etapaNumero: number;
  etapaNombre: string;
  etapaDesc: string;
  color: string;
  planillas: PlanillaInfo[];
}

const ETAPAS_LEGALES: EtapaLegal[] = [
  {
    etapaNumero: 1,
    etapaNombre: 'ETAPA 1: Consignación & Consentimiento Informado',
    etapaDesc: 'Fase de Adquisición Privada Voluntaria y Deslinde de Responsabilidad Legítima',
    color: '#FECF06',
    planillas: [
      {
        id: 'acta-obtencion',
        paso: '1.1',
        nombre: 'Acta de Obtención por Consignación Voluntaria',
        descripcion: 'Formaliza la entrega voluntaria del dispositivo o archivo por parte del solicitante, con inventario físico y estado inicial.',
        ruta: '/planillas/acta-obtencion',
        normativas: ['MUCC-2017 Fase 1', 'ISO/IEC 27037 Sec. 6', 'COPP Art. 186'],
      },
      {
        id: 'acta-consentimiento',
        paso: '1.2',
        nombre: 'Acta de Consentimiento Informado & Hábeas Data',
        descripcion: 'Declaración jurada de legitimación de posesión, autorización de inspección técnica y exención de responsabilidad.',
        ruta: '/planillas/acta-consentimiento',
        normativas: ['CRBV Art. 60', 'LMD FE Arts. 4 y 6', 'ISO 27701'],
        isNew: true,
      },
    ],
  },
  {
    etapaNumero: 2,
    etapaNombre: 'ETAPA 2: Custodia & Laboratorio Forense',
    etapaDesc: 'Fase de Trazabilidad Ininterrumpida, Resguardo e Inspección en Cámara',
    color: '#00FF41',
    planillas: [
      {
        id: 'prcc',
        paso: '2.1',
        nombre: 'Planilla de Registro de Cadena de Custodia (PRCC)',
        descripcion: 'Registro inmutable de traspasos, custodios, almacenamiento en bóveda privada y trazabilidad de hashes.',
        ruta: '/planillas/prcc',
        normativas: ['MUCC-2017 Control', 'COPP Art. 187', 'ISO 27037 Sec. 7'],
      },
      {
        id: 'acta-desprecintado',
        paso: '2.2',
        nombre: 'Acta de Apertura y Desprecintado en Laboratorio',
        descripcion: 'Verificación formal de integridad de la bolsa Faraday y remoción del precinto ante el perito analista.',
        ruta: '/planillas/acta-desprecintado',
        normativas: ['MUCC Fase 2', 'ISO/IEC 27037 Sec. 7.2'],
        isNew: true,
      },
      {
        id: 'acta-entrevista',
        paso: '2.3',
        nombre: 'Acta de Entrevista Técnico-Pericial Privada',
        descripcion: 'Declaración de contexto forense, credenciales de acceso facilitadas y origen del dispositivo.',
        ruta: '/planillas/acta-entrevista',
        normativas: ['COPP Art. 153', 'Redacción Forense Privada'],
      },
    ],
  },
  {
    etapaNumero: 3,
    etapaNombre: 'ETAPA 3: Análisis Técnico & Certificación',
    etapaDesc: 'Fase de Peritaje Criptográfico, Verificación Causal y Emisión de Dictamen',
    color: '#9DFF00',
    planillas: [
      {
        id: 'timeline-compliance',
        paso: '3.1',
        nombre: 'Timeline y Cronología Forense de Compliance',
        descripcion: 'Reconstrucción secuencial de hitos temporales, metadatos MACB y registro de eventos de custodia.',
        ruta: '/planillas/timeline-compliance',
        normativas: ['ISO 27037 Anexo B', 'Timestamping Forense'],
      },
      {
        id: 'acta-auditoria-timeline',
        paso: '3.2',
        nombre: 'Acta de Auditoría y Hash Chain SHA-256',
        descripcion: 'Certificación de inmutabilidad criptográfica SHA-256 de los logs de auditoría y registros IndexedDB/Neon.',
        ruta: '/planillas/acta-auditoria-timeline',
        normativas: ['LMD FE Art. 8', 'Integridad SHA-256'],
      },
      {
        id: 'dictamen',
        paso: '3.3',
        nombre: 'Dictamen Pericial e Informe Técnico Forense',
        descripcion: 'Informe definitivo con metodología pericial (IPED, FTK, PhotoHolmes), hallazgos y conclusiones.',
        ruta: '/planillas/dictamen',
        normativas: ['COPP Arts. 223-225', 'LMD FE Art. 4'],
      },
    ],
  },
  {
    etapaNumero: 4,
    etapaNombre: 'ETAPA 4: Devolución & Sanitización Criptográfica',
    etapaDesc: 'Fase de Cierre Procesal, Restitución de Equipos y Destrucción Segura de Copias',
    color: '#FFB800',
    planillas: [
      {
        id: 'entrega-resultados',
        paso: '4.1',
        nombre: 'Acta de Entrega de Resultados y Devolución',
        descripcion: 'Restitución del dispositivo consignado al cliente y entrega formal del informe técnico procesado.',
        ruta: '/planillas/entrega-resultados',
        normativas: ['COPP Art. 187', 'Cierre de Custodia'],
      },
      {
        id: 'acta-sanitizacion',
        paso: '4.2',
        nombre: 'Acta de Sanitización y Borrado Seguro de Servidor',
        descripcion: 'Certificado de eliminación irreversible de las imágenes forenses de trabajo en servidores del laboratorio.',
        ruta: '/planillas/acta-sanitizacion',
        normativas: ['NIST SP 800-88 Rev. 1', 'ISO/IEC 27001 Sec. A.8.10'],
        isNew: true,
      },
    ],
  },
];

export default function PlanillasDirectoryPage() {
  const { casos } = useCMSStore();
  const [selectedCasoId, setSelectedCasoId] = useState<string>('');

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, backgroundColor: '#0D1117', minHeight: '100vh', color: '#E6EDF3' }}>
      {/* Header institucional */}
      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ color: '#FECF06', fontWeight: 800, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <FileText size={32} className="text-[#FECF06]" />
            Directorio Oficial de Planillas Forenses
          </Typography>
          <Typography variant="body2" sx={{ color: '#8B949E', mt: 0.5 }}>
            Sistema de documentación legal-forense estructurado en 4 etapas procesales secuenciales conforme al MUCC, COPP, ISO 27037 y LMD FE.
          </Typography>
        </Box>

        {/* Filtro de Caso Activo */}
        <Box sx={{ minWidth: 260 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="select-caso-label" sx={{ color: '#FECF06', fontSize: '12px' }}>
              Caso Forense Asociado
            </InputLabel>
            <Select
              labelId="select-caso-label"
              value={selectedCasoId}
              label="Caso Forense Asociado"
              onChange={(e) => setSelectedCasoId(e.target.value)}
              sx={{
                backgroundColor: '#161B22',
                color: '#E6EDF3',
                fontSize: '13px',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(254, 207, 6, 0.4)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#FECF06' },
              }}
            >
              <MenuItem value="">
                <em>-- Ninguno (Ver plantillas generales) --</em>
              </MenuItem>
              {casos.map(c => (
                <MenuItem key={c.id} value={c.id}>
                  Caso #{c.numeroCaso} — {c.titulo || c.tipoProyecto}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Grid de 4 Etapas Legales */}
      <Stack spacing={4}>
        {ETAPAS_LEGALES.map((etapa) => (
          <Box key={etapa.etapaNumero} sx={{ backgroundColor: '#161B22', borderRadius: '12px', p: 2.5, border: '1px solid rgba(255,255,255,0.06)' }}>
            {/* Encabezado de Etapa */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, pb: 1, borderBottom: `2px solid ${etapa.color}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 32, height: 32, borderRadius: '8px', backgroundColor: `${etapa.color}1A`, color: etapa.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px' }}>
                  E{etapa.etapaNumero}
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '16px' }}>
                    {etapa.etapaNombre}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#8B949E' }}>
                    {etapa.etapaDesc}
                  </Typography>
                </Box>
              </Box>

              <Chip
                label={`${etapa.planillas.length} Planillas Oficiales`}
                size="small"
                sx={{ backgroundColor: 'rgba(255,255,255,0.05)', color: etapa.color, fontSize: '11px', fontWeight: 700 }}
              />
            </Box>

            {/* Tarjetas de Planillas dentro de la Etapa */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: etapa.planillas.length === 3 ? '1fr 1fr 1fr' : '1fr 1fr' }, gap: 2 }}>
              {etapa.planillas.map((p) => (
                <Box key={p.id}>
                  <Card
                    sx={{
                      backgroundColor: '#0D1117',
                      border: '1px solid rgba(48,54,61,0.8)',
                      borderRadius: '8px',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: etapa.color,
                        transform: 'translateY(-2px)',
                        boxShadow: `0 4px 12px ${etapa.color}15`,
                      },
                    }}
                  >
                    <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 2 }}>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="caption" sx={{ color: etapa.color, fontWeight: 800, fontFamily: 'monospace' }}>
                            PASO {p.paso}
                          </Typography>
                          {p.isNew && (
                            <Chip
                              label="NUEVA RAG"
                              size="small"
                              sx={{ backgroundColor: '#00FF4122', color: '#00FF41', border: '1px solid #00FF4155', fontWeight: 800, height: '18px', fontSize: '9px' }}
                            />
                          )}
                        </Box>

                        <Typography variant="subtitle1" sx={{ color: '#E6EDF3', fontWeight: 700, fontSize: '14px', lineHeight: 1.3, mb: 1 }}>
                          {p.nombre}
                        </Typography>

                        <Typography variant="body2" sx={{ color: '#8B949E', fontSize: '12px', mb: 2, minHeight: '36px' }}>
                          {p.descripcion}
                        </Typography>

                        {/* Normativas RAG Chips */}
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                          {p.normativas.map(n => (
                            <Chip
                              key={n}
                              label={n}
                              size="small"
                              sx={{ backgroundColor: 'rgba(254, 207, 6, 0.08)', color: '#FECF06', fontSize: '10px', height: '20px' }}
                            />
                          ))}
                        </Box>
                      </Box>

                      {/* Botón de Acción */}
                      <Box sx={{ pt: 1, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="caption" sx={{ color: '#484F58', fontSize: '10px' }}>
                          PDF Folio (216x330mm)
                        </Typography>

                        <Link
                          href={`${p.ruta}${selectedCasoId ? `?casoId=${selectedCasoId}` : ''}`}
                          style={{ textDecoration: 'none' }}
                        >
                          <Button
                            variant="outlined"
                            size="small"
                            endIcon={<ChevronRight size={14} />}
                            sx={{
                              borderColor: etapa.color,
                              color: etapa.color,
                              fontWeight: 700,
                              fontSize: '11px',
                              px: 1.5,
                              py: 0.4,
                              '&:hover': {
                                backgroundColor: `${etapa.color}15`,
                                borderColor: etapa.color,
                              },
                            }}
                          >
                            Generar / Ver
                          </Button>
                        </Link>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
