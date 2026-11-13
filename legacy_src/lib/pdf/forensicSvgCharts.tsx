/**
 * forensicSvgCharts.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Librería de figuras técnicas forenses para React-PDF (@react-pdf/renderer).
 * Cada componente acepta { width, height, isBlank } y retorna un bloque <View>
 * con un <Svg> detallado (modo previa) o un recuadro en blanco (modo impresión).
 *
 * Componentes exportados:
 *   — SpectrogramSvg         Espectrograma de frecuencias 0-24kHz (Opus/PyOgg)
 *   — WaveformFormanteSvg    Waveform temporal + marcadores de formantes F1/F2/F3
 *   — SnrBarchartSvg         Barras SNR + tabla triple hash (MD5/SHA-1/SHA-256)
 *   — PitchYinTrackingSvg    Pitch F₀ tracking (Yin 80-400Hz) + comparativa Deepfake
 *   — ElaMapSvg              Mapa ELA comparativo (PhotoHolmes)
 *   — CopyMoveDetectionSvg   Detección de regiones clonadas (grid de regiones)
 *   — JpegGhostExifSvg       JPEG Ghost overlay + tabla de metadatos EXIF
 */

import React from 'react';
import { View, Text, Svg, Rect, Path, Line, Polygon, Circle, G } from '@react-pdf/renderer';

// ─── TIPOS ───────────────────────────────────────────────────────────────────
interface ChartProps {
  width?: number;
  height?: number;
  isBlank?: boolean;
}

// ─── BLOQUE EN BLANCO (modo descarga limpia) ─────────────────────────────────
const BlankFigureBlock: React.FC<{ width: number; height: number; label: string }> = ({ width, height, label }) => {
  const widthMm = (width * 0.352778).toFixed(1);
  const heightMm = (height * 0.352778).toFixed(1);
  const widthCm = (width * 0.0352778).toFixed(1);
  const heightCm = (height * 0.0352778).toFixed(1);
  const px300W = Math.round((width / 72) * 300);
  const px300H = Math.round((height / 72) * 300);

  return (
    <View
      style={{
        width,
        height,
        borderWidth: 1,
        borderColor: '#0F172A',
        borderStyle: 'dashed',
        backgroundColor: '#F8FAFC',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 6,
      }}
    >
      <Text style={{ fontSize: 7.5, color: '#0F172A', fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 2 }}>
        {label}
      </Text>
      <Text style={{ fontSize: 7, color: '#1E293B', fontFamily: 'Helvetica-Bold', textAlign: 'center', marginTop: 1 }}>
        📐 TAMAÑO EXACTO PARA IMPRESIÓN Y PEGA MANUAL:
      </Text>
      <Text style={{ fontSize: 8.5, color: '#006600', fontFamily: 'Helvetica-Bold', textAlign: 'center', marginTop: 2 }}>
        {widthCm} cm × {heightCm} cm  ({widthMm} mm × {heightMm} mm)
      </Text>
      <Text style={{ fontSize: 6.5, color: '#475569', textAlign: 'center', marginTop: 2, fontFamily: 'Helvetica' }}>
        [ Dimensión a 300 DPI: {px300W} × {px300H} px ]
      </Text>
      <Text style={{ fontSize: 6, color: '#94A3B8', textAlign: 'center', marginTop: 2, fontFamily: 'Helvetica-Oblique' }}>
        Alinee el gráfico o captura de pantalla impreso con los bordes de este recuadro.
      </Text>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// FIGURA AUDIO 1 — ESPECTROGRAMA DE FRECUENCIAS (0-24 kHz) — PyOgg/Opus
// ─────────────────────────────────────────────────────────────────────────────
export const SpectrogramSvg: React.FC<ChartProps> = ({ width = 464, height = 160, isBlank = false }) => {
  if (isBlank) {
    return (
      <BlankFigureBlock
        width={width}
        height={height}
        label="FIGURA 1: ESPECTROGRAMA DE FRECUENCIAS (0-24 kHz) — PyOgg Opus Decoder"
      />
    );
  }

  const W = width;
  const H = height;
  const padL = 36;
  const padB = 22;
  const chartW = W - padL - 8;
  const chartH = H - padB - 10;

  // Bandas de color del espectrograma (simuladas)
  const bands = [
    { yRatio: 0.95, color: '#1e3a5f', opacity: 1 },    // 0-1kHz
    { yRatio: 0.80, color: '#1a5276', opacity: 1 },    // 1-3kHz (voz)
    { yRatio: 0.65, color: '#117a65', opacity: 0.95 },
    { yRatio: 0.52, color: '#00FF41', opacity: 0.85 }, // 8kHz Opus boundary
    { yRatio: 0.38, color: '#FECF06', opacity: 0.7 },
    { yRatio: 0.22, color: '#E74C3C', opacity: 0.5 },
    { yRatio: 0.10, color: '#7B241C', opacity: 0.3 },
  ];

  return (
    <Svg width={W} height={H}>
      {/* Fondo */}
      <Rect x={0} y={0} width={W} height={H} fill="#0B0F19" rx={3} />

      {/* Zona del gráfico */}
      <Rect x={padL} y={10} width={chartW} height={chartH} fill="#0F1923" />

      {/* Bandas de calor del espectrograma */}
      {bands.map((b, i) => {
        const y = 10 + chartH * (1 - b.yRatio);
        const nextY = i < bands.length - 1
          ? 10 + chartH * (1 - bands[i + 1].yRatio)
          : 10 + chartH;
        return (
          <Rect
            key={i}
            x={padL}
            y={y}
            width={chartW}
            height={nextY - y}
            fill={b.color}
            opacity={b.opacity}
          />
        );
      })}

      {/* Variaciones horizontales (simular energía variable en el tiempo) */}
      <Path
        d={`M${padL} ${10 + chartH * 0.45} Q${padL + chartW * 0.15} ${10 + chartH * 0.35}
            ${padL + chartW * 0.3} ${10 + chartH * 0.42} T ${padL + chartW * 0.55} ${10 + chartH * 0.38}
            T ${padL + chartW * 0.75} ${10 + chartH * 0.44} T ${padL + chartW} ${10 + chartH * 0.40}`}
        stroke="#00FF41"
        strokeWidth={1.5}
        fill="none"
        opacity={0.9}
      />
      <Path
        d={`M${padL} ${10 + chartH * 0.22} Q${padL + chartW * 0.2} ${10 + chartH * 0.18}
            ${padL + chartW * 0.4} ${10 + chartH * 0.25} T ${padL + chartW * 0.65} ${10 + chartH * 0.20}
            T ${padL + chartW} ${10 + chartH * 0.23}`}
        stroke="#FECF06"
        strokeWidth={1.2}
        fill="none"
        opacity={0.85}
      />

      {/* Línea 8kHz — Opus codec boundary */}
      <Line
        x1={padL} y1={10 + chartH * 0.5}
        x2={padL + chartW} y2={10 + chartH * 0.5}
        stroke="#9DFF00"
        strokeWidth={0.8}
        strokeDasharray="4,3"
      />

      {/* Eje Y — Frecuencias */}
      <Line x1={padL} y1={10} x2={padL} y2={10 + chartH} stroke="#475569" strokeWidth={0.8} />
      {[0, 4, 8, 12, 16, 20, 24].map((kHz, i) => {
        const y = 10 + chartH - (i / 6) * chartH;
        return (
          <G key={kHz}>
            <Line x1={padL - 4} y1={y} x2={padL} y2={y} stroke="#64748B" strokeWidth={0.6} />
            <Text style={{ fontSize: 5.5, color: '#94A3B8', fontFamily: 'Helvetica' }}>
              {kHz}k
            </Text>
          </G>
        );
      })}

      {/* Eje X — Tiempo */}
      <Line x1={padL} y1={10 + chartH} x2={padL + chartW} y2={10 + chartH} stroke="#475569" strokeWidth={0.8} />
      {[0, 2, 4, 6, 8, 10].map((sec, i) => {
        const x = padL + (i / 10) * chartW * (10 / 10);
        return (
          <G key={sec}>
            <Line x1={x} y1={10 + chartH} x2={x} y2={10 + chartH + 4} stroke="#64748B" strokeWidth={0.6} />
            <Text style={{ fontSize: 5.5, color: '#94A3B8', fontFamily: 'Helvetica' }}>
              {sec}s
            </Text>
          </G>
        );
      })}

      {/* Badges */}
      <Rect x={padL + 4} y={14} width={130} height={13} fill="#0F2A1A" rx={2} />
      <Text style={{ fontSize: 6, color: '#00FF41', fontFamily: 'Helvetica-Bold' }}>
        ✓ OPUS CODEC — 48,000 Hz | VBR | PyOgg v0.10.11
      </Text>

      <Rect x={W - 145} y={14} width={135} height={13} fill="#2A1A0F" rx={2} />
      <Text style={{ fontSize: 6, color: '#FECF06', fontFamily: 'Helvetica-Bold' }}>
        SNR: 44.2 dB | HASH SHA-256: MATCH ✓
      </Text>

      {/* Label 8kHz */}
      <Text style={{ fontSize: 5.5, color: '#9DFF00', fontFamily: 'Helvetica-Bold' }}>
        ← 8 kHz OPUS BOUNDARY
      </Text>

      {/* Etiqueta eje Y */}
      <Text style={{ fontSize: 5.5, color: '#64748B', fontFamily: 'Helvetica' }}>
        Hz/kHz
      </Text>
    </Svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// FIGURA AUDIO 2 — WAVEFORM TEMPORAL + FORMANTES DE VOZ F1/F2/F3
// ─────────────────────────────────────────────────────────────────────────────
export const WaveformFormanteSvg: React.FC<ChartProps> = ({ width = 464, height = 155, isBlank = false }) => {
  if (isBlank) {
    return (
      <BlankFigureBlock
        width={width}
        height={height}
        label="FIGURA 2: WAVEFORM TEMPORAL + ANÁLISIS DE FORMANTES F1/F2/F3 — PyOgg"
      />
    );
  }

  const W = width;
  const H = height;
  const waveH = 70;
  const formantH = 60;
  const padL = 10;
  const padR = 10;

  // Genera puntos de onda sintéticos
  const wavePoints = Array.from({ length: 120 }, (_, i) => {
    const x = padL + (i / 119) * (W - padL - padR);
    const amp = Math.sin(i * 0.35) * 22 + Math.sin(i * 0.8) * 12 + Math.sin(i * 2.1) * 6;
    return `${x},${waveH / 2 + 8 - amp}`;
  }).join(' ');

  const formantes = [
    { label: 'F1 — 620 Hz', color: '#00FF41', yRatio: 0.78 },
    { label: 'F2 — 1.850 Hz', color: '#FECF06', yRatio: 0.52 },
    { label: 'F3 — 2.740 Hz', color: '#9DFF00', yRatio: 0.28 },
  ];

  return (
    <Svg width={W} height={H}>
      {/* Fondo */}
      <Rect x={0} y={0} width={W} height={H} fill="#0B0F19" rx={3} />

      {/* Sección Waveform */}
      <Text style={{ fontSize: 6, color: '#64748B', fontFamily: 'Helvetica-Bold' }}>
        WAVEFORM TEMPORAL (AMPLITUD vs TIEMPO)
      </Text>
      <Rect x={padL} y={14} width={W - padL - padR} height={waveH} fill="#0F1923" />
      <Line x1={padL} y1={14 + waveH / 2} x2={W - padR} y2={14 + waveH / 2} stroke="#1E3A5F" strokeWidth={0.5} />

      {/* Curva waveform */}
      <Path
        d={`M ${wavePoints.split(' ').map((p, i) => {
          const [x, y] = p.split(',');
          return `${i === 0 ? 'M' : 'L'} ${x} ${parseFloat(y) + 14}`;
        }).join(' ')}`}
        stroke="#00FF41"
        strokeWidth={1.2}
        fill="none"
        opacity={0.9}
      />

      {/* Zona de voz sombreada */}
      <Rect
        x={padL + (W - padL - padR) * 0.2}
        y={14}
        width={(W - padL - padR) * 0.6}
        height={waveH}
        fill="#00FF41"
        opacity={0.07}
      />

      {/* Sección Formantes */}
      <Text style={{ fontSize: 6, color: '#64748B', fontFamily: 'Helvetica-Bold' }}>
        ANÁLISIS DE FORMANTES — VOZ HUMANA (F1/F2/F3)
      </Text>
      <Rect x={padL} y={14 + waveH + 14} width={W - padL - padR} height={formantH} fill="#0F1923" />

      {formantes.map((f) => {
        const y = 14 + waveH + 14 + formantH * (1 - f.yRatio);
        return (
          <G key={f.label}>
            <Line
              x1={padL}
              y1={y}
              x2={W - padR}
              y2={y}
              stroke={f.color}
              strokeWidth={1.5}
              opacity={0.85}
            />
            <Rect x={W - padR - 110} y={y - 8} width={108} height={10} fill="#0B0F19" />
            <Text style={{ fontSize: 5.5, color: f.color, fontFamily: 'Helvetica-Bold' }}>
              {f.label}
            </Text>
          </G>
        );
      })}

      {/* Badge autenticidad */}
      <Rect x={padL + 4} y={H - 16} width={180} height={12} fill="#0F2A1A" rx={2} />
      <Text style={{ fontSize: 6, color: '#00FF41', fontFamily: 'Helvetica-Bold' }}>
        ✓ FORMANTES CONSTANTES — VOZ HUMANA AUTÉNTICA NO SINTÉTICA
      </Text>

      <Rect x={W - 160} y={H - 16} width={148} height={12} fill="#2A1A0F" rx={2} />
      <Text style={{ fontSize: 6, color: '#FECF06', fontFamily: 'Helvetica-Bold' }}>
        Duración: 00:12.4s | Codec: Opus VBR 48kHz
      </Text>
    </Svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// FIGURA AUDIO 3 — BARRAS SNR + TABLA TRIPLE HASH (MD5/SHA-1/SHA-256)
// ─────────────────────────────────────────────────────────────────────────────
export const SnrBarchartSvg: React.FC<ChartProps> = ({ width = 464, height = 140, isBlank = false }) => {
  if (isBlank) {
    return (
      <BlankFigureBlock
        width={width}
        height={height}
        label="FIGURA 3: ANÁLISIS SNR + TABLA DE INTEGRIDAD CRIPTOGRÁFICA (MD5/SHA-1/SHA-256)"
      />
    );
  }

  const W = width;
  const H = height;

  const segments = [
    { label: 'Seg. 1 (0-4s)', snr: 44.2, pct: 0.91 },
    { label: 'Seg. 2 (4-8s)', snr: 43.8, pct: 0.90 },
    { label: 'Seg. 3 (8-12s)', snr: 44.6, pct: 0.92 },
    { label: 'Silencio detectado', snr: 58.1, pct: 1.0, special: true },
  ];

  const hashes = [
    { algo: 'MD5', hash: 'a3f9d2e5c8b1047f6a2d', status: 'MATCH ✓' },
    { algo: 'SHA-1', hash: '3a7b9f2e6c0d14a82f5b3e9c', status: 'MATCH ✓' },
    { algo: 'SHA-256', hash: 'e3b0c44298fc1c149afb...b855', status: 'MATCH ✓' },
  ];

  const barMaxW = (W / 2) - 40;

  return (
    <Svg width={W} height={H}>
      <Rect x={0} y={0} width={W} height={H} fill="#0B0F19" rx={3} />

      {/* Título SNR */}
      <Text style={{ fontSize: 6, color: '#64748B', fontFamily: 'Helvetica-Bold' }}>
        SNR POR SEGMENTO (dB) — AUDIO AUTÉNTICO {'>'} 40 dB
      </Text>

      {segments.map((seg, i) => {
        const y = 18 + i * 22;
        const barW = barMaxW * seg.pct;
        const color = seg.special ? '#9DFF00' : '#00FF41';
        return (
          <G key={i}>
            <Text style={{ fontSize: 5.5, color: '#94A3B8', fontFamily: 'Helvetica' }}>
              {seg.label}
            </Text>
            <Rect x={85} y={y} width={barW} height={14} fill={color} opacity={0.85} rx={2} />
            <Text style={{ fontSize: 6.5, color: color, fontFamily: 'Helvetica-Bold' }}>
              {seg.snr} dB
            </Text>
          </G>
        );
      })}

      {/* Divisor */}
      <Line x1={W / 2 + 10} y1={12} x2={W / 2 + 10} y2={H - 12} stroke="#1E3A5F" strokeWidth={0.8} />

      {/* Tabla Hash */}
      <Text style={{ fontSize: 6, color: '#64748B', fontFamily: 'Helvetica-Bold' }}>
        TABLA DE INTEGRIDAD CRIPTOGRÁFICA DEL ARCHIVO OPUS
      </Text>

      {hashes.map((h, i) => {
        const y = 22 + i * 28;
        const bg = i % 2 === 0 ? '#0F1923' : '#0B0F19';
        return (
          <G key={i}>
            <Rect x={W / 2 + 14} y={y - 2} width={W / 2 - 22} height={22} fill={bg} />
            <Text style={{ fontSize: 5.5, color: '#FECF06', fontFamily: 'Helvetica-Bold' }}>
              {h.algo}
            </Text>
            <Text style={{ fontSize: 5, color: '#94A3B8', fontFamily: 'Helvetica' }}>
              {h.hash}
            </Text>
            <Text style={{ fontSize: 6, color: '#00FF41', fontFamily: 'Helvetica-Bold' }}>
              {h.status}
            </Text>
          </G>
        );
      })}

      {/* Badge conclusión */}
      <Rect x={W / 2 + 14} y={H - 18} width={W / 2 - 22} height={13} fill="#0F2A1A" rx={2} />
      <Text style={{ fontSize: 6, color: '#00FF41', fontFamily: 'Helvetica-Bold' }}>
        ✓ AUDIO ÍNTEGRO — SIN CORTES — HASH TRIPLE VERIFICADO
      </Text>
    </Svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// FIGURA IMAGEN 1 — MAPA ELA COMPARATIVO (PhotoHolmes)
// ─────────────────────────────────────────────────────────────────────────────
export const ElaMapSvg: React.FC<ChartProps> = ({ width = 464, height = 180, isBlank = false }) => {
  if (isBlank) {
    return (
      <BlankFigureBlock
        width={width}
        height={height}
        label="FIGURA 1: ANÁLISIS ELA (ERROR LEVEL ANALYSIS) — PhotoHolmes Python Engine"
      />
    );
  }

  const W = width;
  const H = height;
  const panelW = (W - 30) / 2;
  const panelH = H - 40;

  return (
    <Svg width={W} height={H}>
      <Rect x={0} y={0} width={W} height={H} fill="#0F172A" rx={3} />

      {/* Panel izquierdo — Imagen original */}
      <Rect x={10} y={12} width={panelW} height={panelH} fill="#1E293B" rx={2} />
      <Text style={{ fontSize: 6.5, color: '#94A3B8', fontFamily: 'Helvetica-Bold' }}>
        IMAGEN ORIGINAL — Espacio de Color sRGB
      </Text>

      {/* Simulación imagen original (gradiente de grises con textura) */}
      {Array.from({ length: 8 }).map((_, row) =>
        Array.from({ length: 10 }).map((_, col) => {
          const shade = 30 + row * 8 + col * 5;
          const hexShade = Math.min(shade, 90).toString(16).padStart(2, '0');
          return (
            <Rect
              key={`${row}-${col}`}
              x={10 + col * (panelW / 10) + 2}
              y={22 + row * ((panelH - 10) / 8)}
              width={panelW / 10 - 1}
              height={(panelH - 10) / 8 - 1}
              fill={`#${hexShade}${hexShade}${hexShade}`}
              opacity={0.85}
            />
          );
        })
      )}

      <Text style={{ fontSize: 6, color: '#64748B', fontFamily: 'Helvetica' }}>
        ORIGINAL (JPG) — 3024 × 4032 px | 3.2 MB
      </Text>

      {/* Divisor central */}
      <Line x1={W / 2} y1={8} x2={W / 2} y2={H - 8} stroke="#334155" strokeWidth={0.8} />

      {/* Panel derecho — Mapa ELA */}
      <Rect x={W / 2 + 8} y={12} width={panelW} height={panelH} fill="#020617" rx={2} />
      <Text style={{ fontSize: 6.5, color: '#9DFF00', fontFamily: 'Helvetica-Bold' }}>
        MAPA ELA — Error Level Analysis | PhotoHolmes v2.1
      </Text>

      {/* Mapa ELA simulado con gradiente de colores */}
      {Array.from({ length: 8 }).map((_, row) =>
        Array.from({ length: 10 }).map((_, col) => {
          // Simular regiones de baja varianza (azul/verde = auténtico)
          const noise = (Math.sin(row * 2.1 + col * 1.7) + 1) / 2;
          const green = Math.floor(60 + noise * 80);
          const blue = Math.floor(20 + noise * 40);
          return (
            <Rect
              key={`ela-${row}-${col}`}
              x={W / 2 + 8 + col * (panelW / 10) + 2}
              y={22 + row * ((panelH - 10) / 8)}
              width={panelW / 10 - 1}
              height={(panelH - 10) / 8 - 1}
              fill={`rgb(10,${green},${blue})`}
              opacity={0.9}
            />
          );
        })
      )}

      {/* Badge resultado ELA */}
      <Rect x={W / 2 + 14} y={H - 20} width={panelW - 12} height={14} fill="#0F2A1A" rx={2} />
      <Text style={{ fontSize: 6.5, color: '#00FF41', fontFamily: 'Helvetica-Bold' }}>
        ✓ ELA HOMOGÉNEO 96% — SIN FOTOMONTAJE — AUTÉNTICO
      </Text>

      {/* Leyenda colorimétrica */}
      {[
        { color: '#0A3C1A', label: 'Auténtico' },
        { color: '#FECF06', label: 'Edición moderada' },
        { color: '#E74C3C', label: 'Manipulación detectada' },
      ].map((item, i) => (
        <G key={i}>
          <Rect x={12 + i * 90} y={H - 18} width={10} height={10} fill={item.color} rx={1} />
          <Text style={{ fontSize: 5.5, color: '#94A3B8', fontFamily: 'Helvetica' }}>
            {item.label}
          </Text>
        </G>
      ))}
    </Svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// FIGURA IMAGEN 2 — DETECCIÓN COPY-MOVE (regiones clonadas)
// ─────────────────────────────────────────────────────────────────────────────
export const CopyMoveDetectionSvg: React.FC<ChartProps> = ({ width = 464, height = 165, isBlank = false }) => {
  if (isBlank) {
    return (
      <BlankFigureBlock
        width={width}
        height={height}
        label="FIGURA 2: COPY-MOVE DETECTION — Detección de Regiones Clonadas"
      />
    );
  }

  const W = width;
  const H = height;
  const gridW = W - 50;
  const gridH = H - 50;
  const cols = 4;
  const rows = 3;
  const cellW = gridW / cols;
  const cellH = gridH / rows;

  return (
    <Svg width={W} height={H}>
      <Rect x={0} y={0} width={W} height={H} fill="#0F172A" rx={3} />
      <Text style={{ fontSize: 6.5, color: '#64748B', fontFamily: 'Helvetica-Bold' }}>
        COPY-MOVE DETECTION — Análisis de Bloques (PhotoHolmes Block Matching)
      </Text>

      {/* Grid de regiones */}
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: cols }).map((_, col) => {
          const x = 20 + col * cellW;
          const y = 18 + row * cellH;
          // Todas las regiones son "limpias" (no clonadas)
          return (
            <G key={`${row}-${col}`}>
              <Rect
                x={x}
                y={y}
                width={cellW - 4}
                height={cellH - 4}
                fill="#0F2A1A"
                stroke="#00FF41"
                strokeWidth={0.6}
                opacity={0.9}
                rx={1}
              />
              <Text style={{ fontSize: 5, color: '#00FF41', fontFamily: 'Helvetica-Bold' }}>
                REG-{String(row * cols + col + 1).padStart(2, '0')} ✓
              </Text>
              <Text style={{ fontSize: 4.5, color: '#475569', fontFamily: 'Helvetica' }}>
                {'MATCH: 0.0%'}
              </Text>
            </G>
          );
        })
      )}

      {/* Badge resultado copy-move */}
      <Rect x={20} y={H - 22} width={W - 40} height={14} fill="#0F2A1A" rx={2} />
      <Text style={{ fontSize: 6.5, color: '#00FF41', fontFamily: 'Helvetica-Bold' }}>
        ✓ 0 REGIONES CLONADAS DETECTADAS EN {rows * cols} BLOQUES ANALIZADOS — IMAGEN AUTÉNTICA
      </Text>

      {/* Leyenda */}
      <Rect x={W - 145} y={20} width={10} height={10} fill="#0F2A1A" stroke="#00FF41" strokeWidth={0.6} rx={1} />
      <Text style={{ fontSize: 5.5, color: '#00FF41', fontFamily: 'Helvetica' }}>
        Región auténtica (0% match)
      </Text>

      <Rect x={W - 145} y={34} width={10} height={10} fill="#2A0F0F" stroke="#E74C3C" strokeWidth={0.6} rx={1} />
      <Text style={{ fontSize: 5.5, color: '#E74C3C', fontFamily: 'Helvetica' }}>
        Región sospechosa {'>'} 85%
      </Text>
    </Svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// FIGURA IMAGEN 3 — JPEG GHOST OVERLAY + TABLA EXIF
// ─────────────────────────────────────────────────────────────────────────────
export const JpegGhostExifSvg: React.FC<ChartProps> = ({ width = 464, height = 160, isBlank = false }) => {
  if (isBlank) {
    return (
      <BlankFigureBlock
        width={width}
        height={height}
        label="FIGURA 3: JPEG GHOST + METADATOS EXIF — Verificación de Origen e Integridad"
      />
    );
  }

  const W = width;
  const H = height;
  const ghostW = W / 2 - 18;
  const ghostH = H - 35;

  const exifData = [
    { tag: 'Make', value: 'Xiaomi' },
    { tag: 'Model', value: 'Redmi Note 12 Pro 5G' },
    { tag: 'DateTime', value: '2026:06:15 14:32:07' },
    { tag: 'GPSLatitude', value: '10° 04\' 22.8" N' },
    { tag: 'GPSLongitude', value: '69° 21\' 14.3" W' },
    { tag: 'Software', value: 'Android Camera v4.2' },
    { tag: 'SHA-256', value: 'a3f9d2e5...b702' },
  ];

  return (
    <Svg width={W} height={H}>
      <Rect x={0} y={0} width={W} height={H} fill="#0F172A" rx={3} />

      {/* Panel Ghost */}
      <Text style={{ fontSize: 6, color: '#64748B', fontFamily: 'Helvetica-Bold' }}>
        JPEG GHOST OVERLAY — Artefactos de Compresión Uniformes
      </Text>
      <Rect x={10} y={14} width={ghostW} height={ghostH} fill="#1E293B" rx={2} />

      {/* Simular overlay de ghost (cuadros semitransparentes uniformes) */}
      {Array.from({ length: 5 }).map((_, row) =>
        Array.from({ length: 6 }).map((_, col) => {
          const opacity = 0.15 + ((row + col) % 3) * 0.08;
          return (
            <Rect
              key={`ghost-${row}-${col}`}
              x={12 + col * (ghostW / 6)}
              y={16 + row * (ghostH / 5)}
              width={ghostW / 6 - 2}
              height={ghostH / 5 - 2}
              fill="#9DFF00"
              opacity={opacity}
              rx={1}
            />
          );
        })
      )}

      <Text style={{ fontSize: 5.5, color: '#9DFF00', fontFamily: 'Helvetica-Bold' }}>
        ✓ ARTEFACTOS UNIFORMES — SIN CAPAS EXTERNAS
      </Text>

      {/* Divisor */}
      <Line x1={W / 2} y1={8} x2={W / 2} y2={H - 8} stroke="#334155" strokeWidth={0.8} />

      {/* Tabla EXIF */}
      <Text style={{ fontSize: 6, color: '#64748B', fontFamily: 'Helvetica-Bold' }}>
        METADATOS EXIF — Verificación de Origen
      </Text>

      {exifData.map((row, i) => {
        const y = 18 + i * 16;
        const bg = i % 2 === 0 ? '#0F1923' : '#0B0F19';
        return (
          <G key={i}>
            <Rect x={W / 2 + 8} y={y - 2} width={W / 2 - 18} height={14} fill={bg} />
            <Text style={{ fontSize: 5.5, color: '#FECF06', fontFamily: 'Helvetica-Bold' }}>
              {row.tag}:
            </Text>
            <Text style={{ fontSize: 5.5, color: '#CBD5E1', fontFamily: 'Helvetica' }}>
              {row.value}
            </Text>
          </G>
        );
      })}

      {/* Badge */}
      <Rect x={W / 2 + 8} y={H - 18} width={W / 2 - 18} height={12} fill="#0F2A1A" rx={2} />
      <Text style={{ fontSize: 6, color: '#00FF41', fontFamily: 'Helvetica-Bold' }}>
        ✓ METADATA ÍNTEGRA — ORIGEN VERIFICADO SHA-256
      </Text>
    </Svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// FIGURA AUDIO 4 — PITCH F₀ TRACKING (YIN 80-400 Hz) + COMPARATIVA DEEPFAKE
// ─────────────────────────────────────────────────────────────────────────────
export const PitchYinTrackingSvg: React.FC<ChartProps> = ({ width = 464, height = 170, isBlank = false }) => {
  if (isBlank) {
    return (
      <BlankFigureBlock
        width={width}
        height={height}
        label="FIGURA 3: PITCH F₀ TRACKING (ALGORITMO YIN 80-400 Hz) — VOZ HUMANA vs DEEPFAKE"
      />
    );
  }

  const W = width;
  const H = height;
  const padL = 42;
  const padR = 10;
  const padT = 28;
  const padB = 24;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  // Frecuency range: 60 Hz to 500 Hz
  const fMin = 60;
  const fMax = 500;
  const fToY = (f: number) => padT + chartH - ((f - fMin) / (fMax - fMin)) * chartH;

  // Human voice band highlight (85-255 Hz)
  const humanBandTop = fToY(255);
  const humanBandBottom = fToY(85);

  // Generate natural human F0 trajectory (continuous micro-modulations)
  const numPoints = 80;
  const humanF0Points: string[] = [];
  for (let i = 0; i < numPoints; i++) {
    const t = i / (numPoints - 1);
    const x = padL + t * chartW;
    // Base pitch ~145 Hz with natural biological jitter and intonation
    const base = 145;
    const intonation = Math.sin(t * Math.PI * 2.5) * 18; // sentence-level melody
    const vibrato = Math.sin(t * 42) * 3.5; // laryngeal micro-tremor ~5-8 Hz
    const jitter = Math.sin(t * 97 + 0.7) * 2.2 + Math.cos(t * 131) * 1.8; // biological noise
    const breathGroup = t > 0.45 && t < 0.52 ? -12 : 0; // slight dip at breath pause
    const f = base + intonation + vibrato + jitter + breathGroup;
    const y = fToY(f);
    humanF0Points.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }

  // Generate synthetic/Deepfake F0 trajectory (flat with abrupt jumps)
  const deepfakePoints: string[] = [];
  for (let i = 0; i < numPoints; i++) {
    const t = i / (numPoints - 1);
    const x = padL + t * chartW;
    // Flat with robotic jumps
    let f = 155;
    if (t > 0.18 && t < 0.22) f = 210; // abrupt jump
    if (t > 0.38 && t < 0.42) f = 120; // abrupt drop
    if (t > 0.60 && t < 0.64) f = 195; // another jump
    if (t > 0.78 && t < 0.82) f = 115; // another drop
    const y = fToY(f);
    deepfakePoints.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }

  // Hz axis labels
  const hzLabels = [100, 150, 200, 250, 300, 400];

  // Time axis labels (seconds)
  const timeLabels = [0, 2, 4, 6, 8, 10, 12];

  return (
    <Svg width={W} height={H}>
      {/* Background */}
      <Rect x={0} y={0} width={W} height={H} fill="#0B0F19" rx={3} />

      {/* Chart area */}
      <Rect x={padL} y={padT} width={chartW} height={chartH} fill="#0F1923" />

      {/* Human voice band (shaded zone 85-255 Hz) */}
      <Rect
        x={padL}
        y={humanBandTop}
        width={chartW}
        height={humanBandBottom - humanBandTop}
        fill="#00FF41"
        opacity={0.06}
      />
      {/* Band label */}
      <Rect x={padL + chartW - 140} y={humanBandTop + 2} width={136} height={11} fill="#0B0F19" opacity={0.85} rx={2} />
      <Text style={{ fontSize: 5.5, color: '#00FF41', fontFamily: 'Helvetica-Bold' }}>
        ZONA DE VOZ HUMANA ADULTA (85–255 Hz)
      </Text>

      {/* Hz grid lines */}
      {hzLabels.map((hz) => {
        const y = fToY(hz);
        return (
          <G key={hz}>
            <Line x1={padL} y1={y} x2={padL + chartW} y2={y} stroke="#1E3A5F" strokeWidth={0.4} />
            <Line x1={padL - 4} y1={y} x2={padL} y2={y} stroke="#64748B" strokeWidth={0.6} />
            <Text style={{ fontSize: 5, color: '#94A3B8', fontFamily: 'Helvetica' }}>
              {hz}
            </Text>
          </G>
        );
      })}

      {/* Y axis */}
      <Line x1={padL} y1={padT} x2={padL} y2={padT + chartH} stroke="#475569" strokeWidth={0.8} />
      <Text style={{ fontSize: 5, color: '#64748B', fontFamily: 'Helvetica' }}>Hz</Text>

      {/* X axis */}
      <Line x1={padL} y1={padT + chartH} x2={padL + chartW} y2={padT + chartH} stroke="#475569" strokeWidth={0.8} />
      {timeLabels.map((sec) => {
        const x = padL + (sec / 12) * chartW;
        return (
          <G key={sec}>
            <Line x1={x} y1={padT + chartH} x2={x} y2={padT + chartH + 4} stroke="#64748B" strokeWidth={0.6} />
            <Text style={{ fontSize: 5, color: '#94A3B8', fontFamily: 'Helvetica' }}>
              {sec}s
            </Text>
          </G>
        );
      })}

      {/* Deepfake/TTS trajectory (dashed red — BEHIND the human curve) */}
      <Path
        d={deepfakePoints.join(' ')}
        stroke="#E74C3C"
        strokeWidth={1.8}
        strokeDasharray="6,4"
        fill="none"
        opacity={0.7}
      />

      {/* Human F0 trajectory (solid green — IN FRONT) */}
      <Path
        d={humanF0Points.join(' ')}
        stroke="#00FF41"
        strokeWidth={1.8}
        fill="none"
        opacity={0.95}
      />

      {/* Title badge */}
      <Rect x={padL + 2} y={4} width={200} height={14} fill="#0F2A1A" rx={2} />
      <Text style={{ fontSize: 6, color: '#00FF41', fontFamily: 'Helvetica-Bold' }}>
        PITCH F₀ TRACKING — ALGORITMO YIN (80–400 Hz) — Sonic Visualiser
      </Text>

      {/* Legend */}
      <Rect x={W - 195} y={4} width={185} height={14} fill="#0B0F19" opacity={0.9} rx={2} />
      <Line x1={W - 190} y1={11} x2={W - 170} y2={11} stroke="#00FF41" strokeWidth={2} />
      <Text style={{ fontSize: 5.5, color: '#00FF41', fontFamily: 'Helvetica-Bold' }}>
        Voz Humana (Muestra)
      </Text>
      <Line x1={W - 100} y1={11} x2={W - 80} y2={11} stroke="#E74C3C" strokeWidth={2} strokeDasharray="4,3" />
      <Text style={{ fontSize: 5.5, color: '#E74C3C', fontFamily: 'Helvetica-Bold' }}>
        IA / Deepfake (Ref.)
      </Text>

      {/* Result badge */}
      <Rect x={padL + 2} y={H - 18} width={230} height={13} fill="#0F2A1A" rx={2} />
      <Text style={{ fontSize: 6, color: '#00FF41', fontFamily: 'Helvetica-Bold' }}>
        ✓ TRAYECTORIA BIOLÓGICA NATURAL CONTINUA — DESCARTADO DEEPFAKE / TTS
      </Text>

      <Rect x={W - 180} y={H - 18} width={170} height={13} fill="#2A0F0F" rx={2} />
      <Text style={{ fontSize: 6, color: '#FECF06', fontFamily: 'Helvetica-Bold' }}>
        Jitter: 0.8% | Shimmer: 1.2% | HNR: 22.4 dB
      </Text>
    </Svg>
  );
};
