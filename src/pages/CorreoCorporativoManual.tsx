import { useEffect } from 'react';

const PASOS = [
  {
    fase: 'Fase 1: Identificación y Preservación',
    pasos: [
      {
        id: 'p1',
        titulo: 'Identificar el correo electrónico como fuente de evidencia',
        desc: 'Identificar el mensaje de datos en su soporte original (bandeja, servidor, respaldo) sin alterar su contenido ni metadatos.',
        normativa: 'ISO/IEC 27037:2012 — Identificación de evidencia digital',
        acciones: [
          'Localizar el mensaje original en la bandeja de correo del remitente o destinatario',
          'Verificar que sea el mensaje original (no reenviado ni exportado previamente)',
          'No abrir adjuntos ni hacer clic en enlaces durante la identificación',
          'Documentar la ubicación exacta: nombre de bandeja, ruta, tipo de cliente',
          'Tomar captura de pantalla del mensaje en su contexto original',
          'Registrar en la bitácora con fecha, hora y responsable',
        ],
      },
      {
        id: 'p2',
        titulo: 'Preservar el mensaje original intacto',
        desc: 'Realizar copia forense bit a bit del contenedor del correo o exportar el .eml/.msg sin alterar cabeceras ni metadatos. Almacenar el original en custodia.',
        normativa: 'ISO/IEC 27037:2012 — Preservación · Art. 187 COPP — Cadena de Custodia',
        acciones: [
          'Exportar el mensaje en formato original (.eml en Thunderbird, .msg en Outlook, original en Gmail)',
          'Verificar que la exportación no modifique cabeceras comparando hashes',
          'Crear copia de trabajo para análisis y copia de resguardo sellada',
          'Etiquetar físicamente el medio con: N° caso, fecha, hora, nombre del perito, hash',
          'Almacenar el original en custodia segura (sobre cerrado, firma en sello)',
          'Registrar en la Planilla PRCC',
        ],
      },
      {
        id: 'p3',
        titulo: 'Calcular hash SHA-256 del mensaje original',
        desc: 'Calcular el hash criptográfico del archivo de correo original (.eml/.msg) como sello de integridad. Registrar en la cadena de custodia.',
        normativa: 'ISO/IEC 27037:2012 — Integridad · MUCC-2017',
        acciones: [
          'Calcular SHA-256: sha256sum mensaje_original.eml (Linux) o Get-FileHash (PowerShell)',
          'Calcular MD5 como respaldo: Get-FileHash -Algorithm MD5',
          'Calcular hash de la copia de trabajo y verificar coincidencia',
          'Registrar ambos hashes en la cadena de custodia con fecha, hora y responsable',
          'Firmar digitalmente el registro si aplica',
        ],
      },
    ],
  },
  {
    fase: 'Fase 2: Documentación Técnica',
    pasos: [
      {
        id: 'p4',
        titulo: 'Extraer y documentar encabezados SMTP completos',
        desc: 'Extraer todos los encabezados del mensaje (Received, From, To, Date, Message-ID, DKIM-Signature, SPF) y documentar la ruta del correo.',
        normativa: 'ISO/IEC 27037:2012 — Recopilación · LMDF Art. 4 — Eficacia probatoria',
        acciones: [
          'Acceder a encabezados completos: Outlook (Propiedades), Thunderbird (Código fuente), Gmail (Mostrar original)',
          'Extraer cada campo Received con IP, timestamp y hostname de cada salto',
          'Documentar From, To, CC, Date, Message-ID, DKIM-Signature, SPF, Authentication-Results',
          'Reconstruir la ruta: analizar secuencia de servidores Received en orden inverso',
          'Verificar consistencia entre IPs, timestamps y dominios',
          'Exportar encabezados completos a archivo de texto para el expediente',
        ],
      },
      {
        id: 'p5',
        titulo: 'Documentar metadatos del mensaje',
        desc: 'Registrar: remitente, destinatarios, fecha/hora (con zona horaria), Message-ID, tamaño, adjuntos, cliente de correo. Verificar autenticidad DKIM/SPF.',
        normativa: 'NIST SP 800-101 — Metadatos de evidencia digital',
        acciones: [
          'Crear ficha técnica: remitente, destinatarios, fecha UTC, Message-ID, tamaño, tipo MIME, X-Mailer',
          'Listar adjuntos con nombres, tamaños y tipos MIME',
          'Verificar DKIM: pass/fail (firma criptográfica del dominio)',
          'Verificar SPF: pass/fail (IP autorizada del remitente)',
          'Verificar DMARC: política de alineación del dominio',
          'Documentar cualquier anomalía: encabezados inconsistentes, fechas discrepantes',
        ],
      },
      {
        id: 'p6',
        titulo: 'Establecer la cadena de custodia del correo',
        desc: 'Documentar quién, cuándo y cómo obtuvo el acceso al correo. Registrar cada transferencia con fechas, firmas y motivos.',
        normativa: 'Art. 187-188 COPP · MUCC-2017 — Cadena de Custodia',
        acciones: [
          'Registrar el primer acceso: quién, fecha/hora exacta, método de acceso',
          'Documentar cada transferencia de custodia: de quién a quién, fecha y motivo',
          'Mantener registro continuo de cada acceso, copia o procesamiento',
          'Completar la Planilla PRCC con datos del caso, evidencia y firmas',
          'Garantizar cadena de custodia ininterrumpida',
        ],
      },
    ],
  },
  {
    fase: 'Fase 3: Análisis Forense',
    pasos: [
      {
        id: 'p7',
        titulo: 'Analizar el contenido del mensaje',
        desc: 'Extraer el cuerpo del mensaje, firmas digitales, archivos adjuntos y enlaces. Documentar hallazgos relevantes.',
        normativa: 'ISO/IEC 27042:2015 — Análisis e interpretación',
        acciones: [
          'Extraer el cuerpo separando partes HTML y texto plano',
          'Identificar y catalogar adjuntos: nombre, tamaño, tipo MIME, hash SHA-256',
          'Extraer enlaces (URLs): lista completa, expandir acortadas, verificar dominios',
          'Identificar firmas digitales en el cuerpo y certificados S/MIME',
          'Documentar citas textuales relevantes con su contexto',
          'Relacionar hallazgos con otras evidencias de la investigación',
        ],
      },
      {
        id: 'p8',
        titulo: 'Verificar autenticidad de adjuntos y enlaces',
        desc: 'Analizar archivos adjuntos en busca de malware, metadatos ocultos o alteraciones. Verificar legitimidad de enlaces.',
        normativa: 'ISO/IEC 27037:2012 · LEDI — Delitos Informáticos',
        acciones: [
          'Escanear adjuntos con antivirus actualizado',
          'Analizar en sandbox (Cuckoo, Joe Sandbox)',
          'Verificar hashes contra bases de datos de malware',
          'Extraer metadatos de adjuntos (autor, fecha creación, versiones)',
          'Expandir URLs acortadas y verificar dominios contra listas de phishing',
          'NO hacer clic directo en enlaces — usar resolución DNS segura',
          'Documentar resultados: archivos limpios/infectados, URLs legítimas/sospechosas',
        ],
      },
      {
        id: 'p9',
        titulo: 'Documentar hallazgos con línea de tiempo',
        desc: 'Crear una línea de tiempo forense con todos los eventos: recepción, reenvíos, apertura de adjuntos, respuestas.',
        normativa: 'ISO/IEC 27042:2015 — Interpretación · NIST SP 800-101',
        acciones: [
          'Construir línea de tiempo base: fecha envío, recepción en servidores, reenvíos',
          'Correlacionar con otras evidencias: logs de servidor, firewall, otros correos',
          'Identificar anomalías temporales: discrepancias entre fechas de encabezados',
          'Crear tabla cronológica de eventos con timestamps UTC',
          'Generar diagrama de línea de tiempo y mapa de relaciones',
        ],
      },
    ],
  },
  {
    fase: 'Fase 4: Informe y Presentación',
    pasos: [
      {
        id: 'p10',
        titulo: 'Redactar el informe pericial de correo electrónico',
        desc: 'Elaborar dictamen pericial con metodología, cadena de custodia, hallazgos técnicos, hash de integridad, conclusiones y firma digital.',
        normativa: 'Art. 187 COPP · LMDF Art. 4-9 — Valor probatorio',
        acciones: [
          'Encabezado: N° dictamen, fecha, datos del perito, N° caso',
          'Identificación de la evidencia: Message-ID, hash, fecha, remitente/destinatarios',
          'Metodología: normativa aplicada, herramientas, procedimiento',
          'Cadena de custodia: N° PRCC, transferencias, sellos y firmas',
          'Hallazgos técnicos: encabezados, autenticación DKIM/SPF/DMARC, adjuntos',
          'Conclusiones: hechos demostrados, nivel de confianza, limitaciones',
          'Firma digital del perito',
        ],
      },
      {
        id: 'p11',
        titulo: 'Cerrar el caso y generar reporte de auditoría',
        desc: 'Completar todos los pasos. Generar el reporte final de auditoría con línea de tiempo completa.',
        normativa: 'MUCC-2017 · ISO/IEC 27037:2012',
        acciones: [
          'Verificar completitud: todos los pasos 1-10 completados y checklists firmados',
          'Generar reporte de auditoría: resumen, línea de tiempo, hashes, accesos',
          'Preparar expediente final: dictamen, PRCC, actas, copia de evidencia sellada',
          'Programar entrega con el consignante y completar Acta de Entrega de Resultados',
          'Obtener firma de recibido conforme',
        ],
      },
    ],
  },
];

const NORMATIVAS = [
  { codigo: 'ISO/IEC 27037:2012', nombre: 'Identificación, recopilación, adquisición y preservación de evidencia digital' },
  { codigo: 'ISO/IEC 27042:2015', nombre: 'Análisis e interpretación de evidencia digital' },
  { codigo: 'NIST SP 800-101 r1', nombre: 'Guidelines on Mobile Device Forensics' },
  { codigo: 'MUCC-2017', nombre: 'Manual Único de Cadena de Custodia de Evidencias (Venezuela)' },
  { codigo: 'COPP Art. 187-188', nombre: 'Cadena de Custodia de Evidencias Digitales' },
  { codigo: 'LMDF', nombre: 'Ley sobre Mensajes de Datos y Firmas Electrónicas' },
  { codigo: 'LEDI-2001', nombre: 'Ley Especial de Delitos Informáticos' },
];

export default function CorreoCorporativoManual() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <div className="print-header" style={{ borderBottom: '2px solid #000', paddingBottom: '8px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>SHA256.US</div>
            <div style={{ fontSize: '8px', color: '#444', textTransform: 'uppercase', fontWeight: 600 }}>Laboratorio de Informática Forense y Ciberseguridad</div>
            <div style={{ fontSize: '7px', color: '#444', maxWidth: '300px', lineHeight: '1.2' }}>Avenida 6, con calle 7, Edificio Mercantil La Ceiba, primer piso, oficina Nº 8, Quibor, Municipio Jiménez del Estado Lara.</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h1 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', margin: 0, letterSpacing: '0.01em' }}>Manual de Análisis Forense</h1>
            <p style={{ fontSize: '7px', color: '#444', margin: '2px 0 0 0', letterSpacing: '0.02em' }}>Correo Electrónico Corporativo</p>
          </div>
        </div>
      </div>

      {/* Introducción */}
      <section style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '11px', fontWeight: 700, borderLeft: '4px solid #000', padding: '2px 6px', borderBottom: '1px solid #ccc', textTransform: 'uppercase', marginBottom: '8px' }}>1. Introducción</h2>
        <p style={{ fontSize: '9px', textAlign: 'justify', lineHeight: '1.4', margin: 0 }}>
          El correo electrónico corporativo constituye una de las fuentes de evidencia digital más relevantes en investigaciones penales, laborales y civiles. Este manual describe el procedimiento técnico-jurídico estandarizado para su análisis forense, desde la identificación inicial hasta la emisión del dictamen pericial, cumpliendo con la normativa nacional e internacional aplicable.
        </p>
      </section>

      {/* Normativa */}
      <section style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '11px', fontWeight: 700, borderLeft: '4px solid #000', padding: '2px 6px', borderBottom: '1px solid #ccc', textTransform: 'uppercase', marginBottom: '8px' }}>2. Marco Normativo Aplicable</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '8px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #000', padding: '3px 6px', fontWeight: 700, textAlign: 'left', fontSize: '7px', textTransform: 'uppercase' }}>Normativa</th>
              <th style={{ border: '1px solid #000', padding: '3px 6px', fontWeight: 700, textAlign: 'left', fontSize: '7px', textTransform: 'uppercase' }}>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {NORMATIVAS.map(n => (
              <tr key={n.codigo}>
                <td style={{ border: '1px solid #000', padding: '2px 4px', fontWeight: 600, whiteSpace: 'nowrap' }}>{n.codigo}</td>
                <td style={{ border: '1px solid #000', padding: '2px 4px' }}>{n.nombre}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Pasos por fase */}
      {PASOS.map((fase, fi) => (
        <section key={fi} style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '12px', fontWeight: 700, borderLeft: '4px solid #000', padding: '3px 6px', backgroundColor: '#f2f2f2', borderBottom: '1px solid #000', textTransform: 'uppercase', marginBottom: '10px' }}>
            {fase.fase}
          </h2>

          {fase.pasos.map((paso, pi) => (
            <div key={paso.id} style={{ marginBottom: '14px', paddingLeft: '10px', borderLeft: '2px solid #ddd' }}>
              <h3 style={{ fontSize: '10px', fontWeight: 700, margin: '0 0 3px 0' }}>
                Paso {pi + 1 + (fi > 0 ? PASOS.slice(0, fi).reduce((acc, f) => acc + f.pasos.length, 0) : 0)}: {paso.titulo}
              </h3>
              <p style={{ fontSize: '8.5px', textAlign: 'justify', margin: '0 0 3px 0', lineHeight: '1.3' }}>{paso.desc}</p>
              <p style={{ fontSize: '7.5px', fontStyle: 'italic', color: '#444', margin: '0 0 5px 0' }}>{paso.normativa}</p>
              <div style={{ fontSize: '8px', lineHeight: '1.4' }}>
                {paso.acciones.map((acc, ai) => (
                  <div key={ai} style={{ display: 'flex', gap: '4px', marginBottom: '1px' }}>
                    <span style={{ flexShrink: 0 }}>{ai + 1}.</span>
                    <span style={{ textAlign: 'justify' }}>{acc}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      ))}

      {/* Herramientas */}
      <section style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '11px', fontWeight: 700, borderLeft: '4px solid #000', padding: '2px 6px', borderBottom: '1px solid #ccc', textTransform: 'uppercase', marginBottom: '8px' }}>Herramientas Recomendadas</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '8px' }}>
          <div style={{ border: '1px solid #000', padding: '4px 6px' }}>
            <div style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '7px', borderBottom: '1px solid #ccc', marginBottom: '3px', paddingBottom: '2px' }}>Extracción de encabezados</div>
            <div>MessageHeader (Web), MXToolBox (Web), Thunderbird (Código fuente), Outlook (Propiedades)</div>
          </div>
          <div style={{ border: '1px solid #000', padding: '4px 6px' }}>
            <div style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '7px', borderBottom: '1px solid #ccc', marginBottom: '3px', paddingBottom: '2px' }}>Cálculo de hash</div>
            <div>CertUtil (Windows), Get-FileHash (PowerShell), sha256sum (Linux/macOS)</div>
          </div>
          <div style={{ border: '1px solid #000', padding: '4px 6px' }}>
            <div style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '7px', borderBottom: '1px solid #ccc', marginBottom: '3px', paddingBottom: '2px' }}>Análisis de adjuntos</div>
            <div>VirusTotal, Cuckoo Sandbox, Joe Sandbox, Hybrid Analysis</div>
          </div>
          <div style={{ border: '1px solid #000', padding: '4px 6px' }}>
            <div style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '7px', borderBottom: '1px solid #ccc', marginBottom: '3px', paddingBottom: '2px' }}>Documentación</div>
            <div>SHA256.US Planilla PRCC, Acta Dictamen, Acta Entrega, Suite ofimática</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div style={{ borderTop: '1px solid #000', paddingTop: '4px', marginTop: '30px', fontSize: '7px', color: '#444', textAlign: 'center' }}>
        Documento generado bajo los estándares del Manual Único de Cadena de Custodia de Evidencias (V. 2017) — SHA256 Forensic Lab<br />
        Normativa aplicable: ISO/IEC 27037:2012 · ISO/IEC 27042:2015 · NIST SP 800-101 · MUCC-2017 · COPP Arts. 187-188 · LMDF
      </div>

      {/* Print button */}
      <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }} className="no-print">
        <button onClick={() => window.print()} className="print-button">
          🖨️ Imprimir Manual (Tamaño Oficio)
        </button>
      </div>

      <style>{`
        .print-button {
          color: #000000;
          border: 1px solid #000000;
          padding: 10px 24px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          font-family: "Times New Roman", serif;
        }
        @media print {
          .print-header { page-break-after: avoid; }
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          section { page-break-inside: avoid; }
        }
      `}</style>
    </div>
  );
}
