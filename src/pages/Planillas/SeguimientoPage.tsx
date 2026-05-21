import { useState, useEffect, useCallback } from 'react';
import { useForenseStore } from '../../store/forenseStore';
import {
  Printer, Calendar, User, Info,
  CheckCircle2, Circle, ChevronDown, ChevronUp, Terminal,
  Shield, Lock, Camera, Smartphone, Database, FileText,
  AlertTriangle, Copy, CheckCheck, Fingerprint, Package,
  Scale, Archive, TrendingUp
} from 'lucide-react';
import './Planillas.css';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTES Y TIPOS
// ─────────────────────────────────────────────────────────────────────────────

type NormativaColor = 'cyan' | 'green' | 'yellow' | 'red' | 'purple';

interface NormativaTag {
  label: string;
  color: NormativaColor;
}

interface Advertencia {
  titulo: string;
  cuerpo: string;
  nivel: 'warning' | 'critical' | 'info';
}

interface CodeSnippet {
  lang: string;
  contenido: string;
}

interface Step {
  id: string;
  num: number;
  phase: string;
  title: string;
  action: string;
  docs: string[];
  guide: string;
  tasks: string[];
  iconoName: string;
  normativas?: NormativaTag[];
  advertencias?: Advertencia[];
  codigo?: CodeSnippet[];
}

interface Fase {
  id: string;
  numero: number;
  titulo: string;
  subtitulo: string;
  iconoName: string;
  color: string;        // clase de color de texto de Tailwind
  glowColor: string;    // sombra glow
  stepIds: string[];
}

const iconMap: Record<string, any> = {
  FileText,
  Smartphone,
  Terminal,
  Package,
  Shield,
  Database,
  Archive,
  Scale,
  Lock,
  Camera,
  Fingerprint
};

const FASES: Fase[] = [
  {
    id: 'f1',
    numero: 1,
    titulo: 'Obtención',
    subtitulo: 'Recepción, fijación, adquisición y embalaje de la evidencia',
    iconoName: 'FileText',
    color: 'text-cyan-400',
    glowColor: 'rgba(34,211,238,0.15)',
    stepIds: ['step1', 'step2', 'step3', 'step4']
  },
  {
    id: 'f2',
    numero: 2,
    titulo: 'Peritaje',
    subtitulo: 'Recepción en laboratorio, procesamiento, análisis y derivaciones',
    iconoName: 'Database',
    color: 'text-emerald-400',
    glowColor: 'rgba(52,211,153,0.15)',
    stepIds: ['step5', 'step6', 'step7']
  },
  {
    id: 'f3',
    numero: 3,
    titulo: 'Dictamen & Cierre',
    subtitulo: 'Elaboración del dictamen pericial oficial y remisión a resguardo',
    iconoName: 'Lock',
    color: 'text-yellow-400',
    glowColor: 'rgba(250,204,21,0.15)',
    stepIds: ['step8', 'step9']
  }
];

const stepsData: Step[] = [
  {
    id: 'step1',
    num: 1,
    phase: 'Fase 1: Obtención',
    title: 'Recepción, Entrevista y Consignación',
    action: 'Recibir el dispositivo y levantar actas preliminares.',
    docs: ['Acta de Entrevista', 'Acta de Obtención por Consignación'],
    guide: 'Deben redactarse en tercera persona, tiempo presente, de manera clara, secuencial y precisa. Indicar circunstancias de modo, tiempo y lugar. Firmadas por el consignatario y funcionario receptor (MUCCEF 2017).',
    tasks: [
      'Realiza una entrevista estructurada (preguntas básicas, intermedias y finales) a quien entrega el equipo.',
      'Levanta el Acta de Entrevista para dejar constancia de cómo obtuvo los chats/audios.',
      'Levanta el Acta de Obtención por Consignación recibiendo formalmente la evidencia.'
    ],
    iconoName: 'FileText',
    normativas: [
      { label: 'Art. 187 COPP', color: 'cyan' },
      { label: 'MUCCEF 2017', color: 'green' },
      { label: 'LMDyFE Art. 4', color: 'cyan' }
    ],
    advertencias: [
      {
        titulo: 'Redacción en Tercera Persona',
        cuerpo: 'Las actas deben redactarse estrictamente en tercera persona, tiempo presente, indicando de forma detallada las circunstancias de modo, tiempo y lugar del acto.',
        nivel: 'info'
      },
      {
        titulo: 'Firma e Impresión Dactilar Obligatorias',
        cuerpo: 'La falta de firma o impresión dactilar del consignante y del funcionario receptor en las actas de entrevista y consignación puede acarrear la nulidad absoluta de la evidencia.',
        nivel: 'critical'
      }
    ]
  },
  {
    id: 'step2',
    num: 2,
    phase: 'Fase 1: Obtención',
    title: 'Fijación In Situ y Aislamiento',
    action: 'Fijar fotográficamente el dispositivo en vivo y aislarlo de la red.',
    docs: ['Fijación fotográfica (Reseñada en Acta de Obtención)'],
    guide: 'En el Acta de Obtención se debe describir minuciosamente el dispositivo: marca, modelo, IMEI, SIMCard, estado físico general y estado de la pantalla (apagada/encendida).',
    tasks: [
      'Fija fotográficamente la pantalla mostrando la actividad "sin intervenir en su funcionalidad" (no tocar botones).',
      'Aísla el equipo poniéndolo en Modo Avión o usando Bolsa de Faraday para evitar borrado remoto e interferencia de red.',
      'Documenta de manera exacta los datos individualizantes del móvil.'
    ],
    iconoName: 'Smartphone',
    normativas: [
      { label: 'ISO/IEC 27037', color: 'purple' },
      { label: 'MUCCEF 2017', color: 'green' }
    ],
    advertencias: [
      {
        titulo: 'Aislamiento Inmediato de Redes',
        cuerpo: 'Active el Modo Avión en el dispositivo de forma inmediata tras recibirlo. La conexión a cualquier red inalámbrica (datos móviles, Wi-Fi, Bluetooth) puede alterar metadatos críticos o permitir un borrado remoto (remote wipe).',
        nivel: 'critical'
      },
      {
        titulo: 'Registro de Datos Identificativos',
        cuerpo: 'Describa minuciosamente marca, modelo, IMEI, SIM, estado físico general y estado de la pantalla (apagada/encendida) en el acta.',
        nivel: 'warning'
      }
    ]
  },
  {
    id: 'step3',
    num: 3,
    phase: 'Fase 1: Obtención',
    title: 'Adquisición Digital Forense',
    action: 'Extracción física/lógica y sellado hash.',
    docs: ['Documentación de Extracción para el Dictamen'],
    guide: 'Anotar las versiones exactas del software (Andriller) y los algoritmos Hash utilizados (SHA-256) garantizando la inalterabilidad desde la recolección.',
    tasks: [
      'Conecta el dispositivo asegurando inalterabilidad (mediante bloqueadores de escritura/aislamiento).',
      'Ejecuta "Andriller" para realizar una adquisición de solo lectura, no destructiva.',
      'Calcula inmediatamente el Hash (SHA-256) de la imagen extraída para sellar la integridad de la data.'
    ],
    iconoName: 'Terminal',
    normativas: [
      { label: 'ISO/IEC 27037', color: 'purple' },
      { label: 'LMDyFE Art. 7', color: 'cyan' }
    ],
    advertencias: [
      {
        titulo: 'Integridad de la Extracción',
        cuerpo: 'La adquisición forense debe realizarse de forma no destructiva (de solo lectura) garantizando que no se modifique el almacenamiento del dispositivo bajo ninguna circunstancia.',
        nivel: 'critical'
      }
    ],
    codigo: [
      {
        lang: 'bash',
        contenido: `# Verificar dispositivos conectados por ADB\nadb devices -l\n\n# Calcular el hash SHA-256 de la imagen lógica generada\nsha256sum backup_logical_extraccion.ab`
      }
    ]
  },
  {
    id: 'step4',
    num: 4,
    phase: 'Fase 1: Obtención',
    title: 'Apertura de Cadena de Custodia, Embalaje y Rotulado',
    action: 'Ingresar la evidencia matriz al sistema de protección.',
    docs: ['Planilla de Registro de Cadena de Custodia (PRCC)', 'Rótulo de Evidencia'],
    guide: 'PRCC: Utilizar tinta negra/azul, letra de molde, firma manuscrita e impresión dactilar del pulgar derecho. RÓTULO: Tinta indeleble. Incluir Oficina, Expediente, PRCC, descripción detallada y observaciones.',
    tasks: [
      'Abre la PRCC y completa la Fase de Obtención con los datos técnicos del móvil.',
      'Embala el dispositivo usando bolsa antiestática o papel sellado y coloca precintos de seguridad físicos autoadhesivos.',
      'Fija el Rótulo con la información correspondiente de forma visible sobre el embalaje.'
    ],
    iconoName: 'Package',
    normativas: [
      { label: 'COPP Art. 187', color: 'cyan' },
      { label: 'MUCCEF 2017', color: 'green' }
    ],
    advertencias: [
      {
        titulo: 'Llenado Riguroso del Formulario PRCC',
        cuerpo: 'Utilice tinta indeleble (azul o negra), letra de molde legible y estampe la impresión dactilar del pulgar derecho del perito en el renglón correspondiente.',
        nivel: 'critical'
      },
      {
        titulo: 'Precintado de Seguridad Inviolable',
        cuerpo: 'El embalaje debe ser sellado con cinta o precinto de seguridad autoadhesivo numerado. Cualquier apertura del sobre debe dejar en evidencia la ruptura física del precinto.',
        nivel: 'warning'
      }
    ]
  },
  {
    id: 'step5',
    num: 5,
    phase: 'Fase 2: Peritaje',
    title: 'Recepción en Laboratorio, Verificación y Designación',
    action: 'Ingreso al laboratorio forense y asignación de perito.',
    docs: ['PRCC (Renglón Transferencia: Recibe)', 'Libro de Registro Interno de Laboratorio'],
    guide: 'PRCC: Firma y pulgar derecho tras verificar minuciosamente que los precintos no muestren signos de alteración. LIBRO: Libro foliado y sellado, asentar fecha, hora y datos del perito que acepta el caso.',
    tasks: [
      'Comprueba la integridad física del embalaje y correspondencia de rótulos.',
      'Recalcula el Hash de la copia de trabajo y compáralo con el de la extracción original (Art. 7 LMDyFE).',
      'El perito firma los controles internos y asienta la designación formal de la experticia.'
    ],
    iconoName: 'Shield',
    normativas: [
      { label: 'COPP Art. 223', color: 'cyan' },
      { label: 'MUCCEF 2017', color: 'green' },
      { label: 'LMDyFE Art. 7', color: 'cyan' }
    ],
    advertencias: [
      {
        titulo: 'Verificación de Integridad de Precintos',
        cuerpo: 'El perito receptor en laboratorio debe inspeccionar visualmente que los precintos no muestren signos de alteración antes de abrir el paquete. Si hay anomalías, detenga el proceso y notifique al superior.',
        nivel: 'critical'
      }
    ],
    codigo: [
      {
        lang: 'bash',
        contenido: `# Validar la integridad del archivo de imagen copiado contra el hash original\nsha256sum -c HASH_ORIGINAL.sha256`
      }
    ]
  },
  {
    id: 'step6',
    num: 6,
    phase: 'Fase 2: Peritaje',
    title: 'Procesamiento Estructurado con ALEAPP',
    action: 'Parsear logs y bases de datos SQLite.',
    docs: ['Logs y Reportes de salida de ALEAPP'],
    guide: 'Garantizar que el reporte de salida liste nombres nativos de bases de datos, marcas de tiempo Unix convertidas a UTC, rutas lógicas y Hashes de archivos exportados (ISO 27042).',
    tasks: [
      'Carga la imagen forense previamente adquirida en el software ALEAPP.',
      'Procesa msgstore.db (WhatsApp), archivos de audios (.opus), registros de llamadas y screenshots correspondientes.',
      'Reconstruye el Timeline cronológico consolidado de la mensajería.'
    ],
    iconoName: 'Database',
    normativas: [
      { label: 'ISO/IEC 27042', color: 'purple' },
      { label: 'ISO/IEC 27041', color: 'purple' }
    ],
    advertencias: [
      {
        titulo: 'Ajuste de Zona Horaria (VET)',
        cuerpo: 'Las marcas de tiempo de las bases de datos de WhatsApp (msgstore.db) están almacenadas en formato UNIX (UTC). Deben ser convertidas al huso horario oficial de Venezuela (UTC-4) para la presentación de los reportes.',
        nivel: 'warning'
      }
    ],
    codigo: [
      {
        lang: 'sql',
        contenido: `-- Consulta para extraer mensajes de chat con conversión a hora legal de Venezuela\nSELECT \n  _id, \n  key_remote_jid,\n  datetime(timestamp/1000, 'unixepoch', '-4 hours') AS fecha_hora_VET,\n  data\nFROM messages\nWHERE key_remote_jid LIKE '%@s.whatsapp.net'\nORDER BY timestamp ASC;`
      }
    ]
  },
  {
    id: 'step7',
    num: 7,
    phase: 'Fase 2: Peritaje',
    title: 'Obtención por Derivación (Nueva Evidencia)',
    action: 'Aislar chats, audios o archivos clave detectados.',
    docs: ['NUEVA PRCC (Para data derivada)', 'Acta de Obtención por Derivación'],
    guide: 'NUEVA PRCC: Propio número correlativo, tinta negra/azul, firma y huella. ACTA: Indicar la ruta específica de aislamiento desde la evidencia digital original (evitando contaminación).',
    tasks: [
      'Aísla las transcripciones, imágenes y audios relevantes detectados durante el análisis.',
      'Genera el Acta de Obtención por Derivación detallando la correspondencia del Hash de los nuevos archivos.',
      'Abre la nueva PRCC describiendo los archivos y sus hashes individuales.'
    ],
    iconoName: 'Archive',
    normativas: [
      { label: 'MUCCEF 2017', color: 'green' },
      { label: 'COPP Art. 187', color: 'cyan' }
    ],
    advertencias: [
      {
        titulo: 'Control de la Evidencia Derivada',
        cuerpo: 'Cualquier archivo de audio (.opus), imagen (.jpg) o transcripción aislada del dispositivo original constituye una nueva evidencia digital y requiere su propia planilla PRCC independiente con un nuevo correlativo.',
        nivel: 'critical'
      }
    ]
  },
  {
    id: 'step8',
    num: 8,
    phase: 'Fase 3: Dictamen & Cierre',
    title: 'Elaboración del Dictamen Pericial',
    action: 'Estructuración y blindaje legal de los resultados.',
    docs: ['Dictamen Pericial Oficial'],
    guide: 'Estructura formal: Motivo de la experticia, Descripción del material recibido, Exámenes aplicados, Resultados, Conclusiones y Anexos. Firmado por los peritos designados (Art. 223/224 COPP).',
    tasks: [
      'Redacta los resultados periciales incluyendo una tabla con: Nombre de archivo, fecha de mensaje, ruta, tamaño y Hash SHA-256.',
      'Fundamenta jurídicamente la inalterabilidad conforme a la Ley sobre Mensajes de Datos (Art. 4, 7 y 8).',
      'Declara formalmente que la evidencia original no fue consumida ni alterada durante la fase de laboratorio.'
    ],
    iconoName: 'Scale',
    normativas: [
      { label: 'COPP Art. 225', color: 'cyan' },
      { label: 'LMDyFE Art. 4, 7 y 8', color: 'cyan' }
    ],
    advertencias: [
      {
        titulo: 'Blindaje Técnico-Jurídico',
        cuerpo: 'El informe técnico debe describir de forma clara e inteligible las operaciones ejecutadas, emitir conclusiones categóricas y listar de manera exhaustiva las sumas hash SHA-256 de todos los archivos considerados como evidencia.',
        nivel: 'critical'
      }
    ]
  },
  {
    id: 'step9',
    num: 9,
    phase: 'Fase 3: Dictamen & Cierre',
    title: 'Re-embalaje y Remisión a Resguardo',
    action: 'Preparar el dispositivo y la data para su salida oficial.',
    docs: ['PRCC (Renglón Transferencia: Entrega)', 'Oficio de Remisión'],
    guide: 'Renglón "Entrega" en PRCC, indicando el motivo: "Traslado a Resguardo" o "Devolución a Despacho Fiscal". Firma y huella dactilar del perito remitente.',
    tasks: [
      'Coloca el dispositivo móvil en su embalaje de seguridad original o uno nuevo si el original fue degradado.',
      'Aplica nuevos precintos de seguridad oficiales del laboratorio y rotula adecuadamente.',
      'Remite formalmente el dispositivo y la copia digital firmada a la oficina de Resguardo Judicial o despacho fiscal.'
    ],
    iconoName: 'Lock',
    normativas: [
      { label: 'MUCCEF 2017', color: 'green' },
      { label: 'ISO/IEC 27037', color: 'purple' }
    ],
    advertencias: [
      {
        titulo: 'Precintado Final',
        cuerpo: 'Al finalizar la pericia, el dispositivo móvil debe ser re-embalado aplicando nuevos precintos físicos. El número de estos nuevos precintos debe quedar asentado en la PRCC de egreso.',
        nivel: 'warning'
      }
    ]
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// SUBCOMPONENTES
// ─────────────────────────────────────────────────────────────────────────────

function BadgeNormativa({ tag }: { tag: NormativaTag }) {
  const colors: Record<NormativaTag['color'], string> = {
    cyan:   'bg-cyan-500/10 border-cyan-500/25 text-cyan-400',
    green:  'bg-green-500/10 border-green-500/25 text-green-400',
    yellow: 'bg-yellow-500/10 border-yellow-500/25 text-yellow-400',
    red:    'bg-red-500/10 border-red-500/25 text-red-400',
    purple: 'bg-purple-500/10 border-purple-500/25 text-purple-400',
  };
  return (
    <span className={`inline-flex items-center text-[8px] font-black GTM-badge uppercase tracking-[0.15em] px-2 py-0.5 rounded border ${colors[tag.color]}`}>
      {tag.label}
    </span>
  );
}

function AlertaForense({ adv }: { adv: Advertencia }) {
  const cfg = {
    critical: {
      wrapper: 'bg-red-500/[0.06] border-red-500/25',
      icon:    'text-red-400',
      titulo:  'text-red-400',
      cuerpo:  'text-red-300/70',
      Icon:    AlertTriangle,
    },
    warning: {
      wrapper: 'bg-yellow-500/[0.06] border-yellow-500/25',
      icon:    'text-yellow-400',
      titulo:  'text-yellow-400',
      cuerpo:  'text-yellow-300/70',
      Icon:    AlertTriangle,
    },
    info: {
      wrapper: 'bg-blue-500/[0.06] border-blue-500/25',
      icon:    'text-blue-400',
      titulo:  'text-blue-400',
      cuerpo:  'text-blue-300/70',
      Icon:    Info,
    },
  }[adv.nivel];

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border ${cfg.wrapper}`}>
      <cfg.Icon size={14} className={`${cfg.icon} shrink-0 mt-0.5`} />
      <div>
        <p className={`text-[10px] font-black uppercase tracking-wider mb-1 ${cfg.titulo}`}>
          {adv.nivel === 'critical' ? '⚠️ CRÍTICO' : adv.nivel === 'warning' ? '⚠️ Advertencia' : 'ℹ️ Nota'}: {adv.titulo}
        </p>
        <p className={`text-[10px] leading-relaxed ${cfg.cuerpo}`}>{adv.cuerpo}</p>
      </div>
    </div>
  );
}

function BloqueCode({ lang, contenido }: { lang: string; contenido: string }) {
  const [copiado, setCopiado] = useState(false);
  const copiar = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(contenido);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2200);
    } catch {}
  }, [contenido]);

  const LANG_COLOR: Record<string, string> = {
    bash:       'text-green-400/60',
    powershell: 'text-blue-400/60',
    sql:        'text-yellow-400/60',
    python:     'text-cyan-400/60',
  };

  return (
    <div className="rounded-lg overflow-hidden border border-white/[0.07] mt-3">
      <div className="flex items-center justify-between px-4 py-2 bg-black/50 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Terminal size={11} className="text-white/25" />
          <span className={`text-[9px] font-black uppercase tracking-[0.15em] ${LANG_COLOR[lang] || 'text-white/25'}`}>
            {lang}
          </span>
        </div>
        <button
          onClick={copiar}
          className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded bg-white/[0.05] border border-white/[0.08] text-white/30 hover:text-cyan-400 hover:border-cyan-400/30 transition-all"
        >
          {copiado
            ? <><CheckCheck size={10} className="text-green-400" /> Copiado</>
            : <><Copy size={10} /> Copiar</>}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-4 bg-[#0d1f12] text-[11px] leading-relaxed">
        <code className="text-[#a8ff78] font-mono whitespace-pre">{contenido}</code>
      </pre>
    </div>
  );
}

function TarjetaPaso({
  step,
  completado,
  meta,
  onToggle,
  onMetadataChange,
}: {
  step: Step;
  completado: boolean;
  meta: any;
  onToggle: (id: string) => void;
  onMetadataChange: (stepId: string, field: 'fecha' | 'responsable' | 'observaciones', value: string) => void;
}) {
  const [expandido, setExpandido] = useState(false);
  const Icon = iconMap[step.iconoName] || Shield;

  return (
    <div
      className={`rounded-xl border transition-all duration-300 overflow-hidden ${
        completado
          ? 'border-green-500/20 bg-green-500/[0.03]'
          : expandido
          ? 'border-white/10 bg-white/[0.02]'
          : 'border-white/[0.05] bg-white/[0.01] hover:bg-white/[0.02]'
      }`}
    >
      {/* Cabecera del paso */}
      <button
        className="w-full flex items-center gap-4 px-5 py-4 text-left group"
        onClick={() => setExpandido(v => !v)}
      >
        {/* Número */}
        <span className="text-[10px] font-black text-white/20 font-mono shrink-0 w-8 tabular-nums">
          {step.num.toString().padStart(2, '0')}
        </span>
        {/* Ícono */}
        <div className={`p-2 rounded-lg shrink-0 transition-all ${
          completado ? 'bg-green-500/15' : 'bg-white/[0.04] group-hover:bg-white/[0.07]'
        }`}>
          <Icon size={14} className={completado ? 'text-green-400' : 'text-white/30'} />
        </div>
        {/* Título */}
        <span className={`flex-1 text-[11px] font-black uppercase tracking-wide ${
          completado ? 'text-green-400/80' : 'text-white/60 group-hover:text-white/80'
        }`}>
          {step.title}
        </span>
        
        {/* Badges de normativa (cuando colapsado) */}
        {!expandido && step.normativas && (
          <div className="hidden sm:flex items-center gap-1.5 flex-wrap">
            {step.normativas.slice(0, 2).map(n => (
              <BadgeNormativa key={n.label} tag={n} />
            ))}
          </div>
        )}
        
        {/* Status Badge */}
        <span className={`timeline-status-badge ${completado ? 'completed' : 'pending'}`}>
          {completado ? 'Completado' : 'Pendiente'}
        </span>

        {/* Chevron */}
        {expandido
          ? <ChevronUp size={14} className="text-white/25 shrink-0" />
          : <ChevronDown size={14} className="text-white/20 shrink-0" />}
      </button>

      {/* Contenido expandido */}
      {expandido && (
        <div className="px-5 pb-5 space-y-4 animate-fade-in text-xs text-white/70">
          {/* Descripción / Acción */}
          <div className="border-l-2 border-white/10 pl-4 space-y-1">
            <span className="text-[10px] text-fluent-accent font-bold uppercase tracking-wider block">Acción Principal</span>
            <p className="text-white/80 font-medium">{step.action}</p>
          </div>

          {/* Documentos Relacionados */}
          {step.docs.length > 0 && (
            <div>
              <span className="text-[9px] font-black text-white/30 uppercase tracking-widest block mb-1.5">Documentos Asoc.</span>
              <div className="flex flex-wrap gap-2">
                {step.docs.map((doc, idx) => (
                  <span key={idx} className="bg-white/5 border border-white/10 rounded-full px-2.5 py-0.5 text-[9px] text-white/60 uppercase tracking-wider font-semibold">
                    📄 {doc}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Guía Técnica */}
          <div className="timeline-guide-panel">
            <h4 className="text-[9px] font-bold text-fluent-accent uppercase tracking-wider mb-2">Fundamento e Instrucciones de Llenado</h4>
            <p className="text-xs text-white/70 leading-relaxed mb-3">{step.guide}</p>
            
            <h4 className="text-[9px] font-bold text-white uppercase tracking-wider mb-2">Checklist Técnico Detallado:</h4>
            <ul className="space-y-1.5 text-xs text-white/80">
              {step.tasks.map((task, tIdx) => (
                <li key={tIdx} className="flex items-start gap-2">
                  <span className="text-fluent-accent">•</span>
                  <span>{task}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bloques de código */}
          {step.codigo?.map((c, i) => (
            <BloqueCode key={i} lang={c.lang} contenido={c.contenido} />
          ))}

          {/* Normativas completas */}
          {step.normativas && (
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="text-[9px] font-black text-white/15 uppercase tracking-widest mr-1">
                Base legal:
              </span>
              {step.normativas.map(n => (
                <BadgeNormativa key={n.label} tag={n} />
              ))}
            </div>
          )}

          {/* Advertencias */}
          {step.advertencias?.map((adv, i) => (
            <AlertaForense key={i} adv={adv} />
          ))}

          {/* Interactive Metadata Block */}
          {completado && (
            <div className="timeline-meta-box !mt-4 !p-4 !bg-black/40 !border !border-white/5 !rounded-lg grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="timeline-input-group">
                <label className="timeline-input-label flex items-center gap-1.5">
                  <Calendar size={11} className="text-fluent-accent" />
                  <span>Fecha y Hora de Cierre</span>
                </label>
                <input 
                  type="datetime-local" 
                  className="timeline-input" 
                  value={meta.fecha || ''}
                  onChange={(e) => onMetadataChange(step.id, 'fecha', e.target.value)}
                />
              </div>

              <div className="timeline-input-group">
                <label className="timeline-input-label flex items-center gap-1.5">
                  <User size={11} className="text-fluent-accent" />
                  <span>Funcionario / Perito</span>
                </label>
                <input 
                  type="text" 
                  className="timeline-input" 
                  placeholder="Nombre del Perito Responsable"
                  value={meta.responsable || ''}
                  onChange={(e) => onMetadataChange(step.id, 'responsable', e.target.value)}
                />
              </div>

              <div className="timeline-input-group md:col-span-2">
                <label className="timeline-input-label flex items-center gap-1.5">
                  <span>Observaciones de la Trazabilidad / Firma / Precintos</span>
                </label>
                <input 
                  type="text" 
                  className="timeline-input" 
                  placeholder="Ej: Sin incidencias, precinto #10293 verificado"
                  value={meta.observaciones || ''}
                  onChange={(e) => onMetadataChange(step.id, 'observaciones', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-3 border-t border-white/[0.05] flex items-center justify-between">
            <span className="text-[10px] text-white/30 italic">
              {completado ? '✓ Guardado localmente' : 'Marque el hito al finalizar su ejecución'}
            </span>
            <button
              onClick={e => { e.stopPropagation(); onToggle(step.id); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all duration-200 ${
                completado
                  ? 'bg-green-500/15 border border-green-500/25 text-green-400 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400'
                  : 'bg-white/[0.04] border border-white/[0.08] text-white/35 hover:bg-green-500/10 hover:border-green-500/20 hover:text-green-400'
              }`}
            >
              {completado ? (
                <>
                  <CheckCircle2 size={12} />
                  <span>Desmarcar Hito</span>
                </>
              ) : (
                <>
                  <Circle size={12} />
                  <span>Marcar Completado</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StepperFase({
  fase,
  activa,
  completada,
  progreso,
  onClick,
}: {
  fase: Fase;
  activa: boolean;
  completada: boolean;
  progreso: number;
  onClick: () => void;
}) {
  const Icon = iconMap[fase.iconoName] || Shield;
  return (
    <button
      id={`stepper-fase-${fase.id}`}
      onClick={onClick}
      className={`flex flex-col items-center gap-2 group transition-all duration-200 min-w-0 flex-1`}
    >
      {/* Círculo con ícono */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 shrink-0 ${
          completada
            ? 'border-green-500 bg-green-500/15 shadow-[0_0_12px_rgba(34,197,94,0.25)]'
            : activa
            ? `border-current ${fase.color} bg-white/[0.05] shadow-[0_0_12px_var(--glow)]`
            : 'border-white/10 bg-white/[0.03]'
        }`}
        style={activa ? { '--glow': fase.glowColor } as React.CSSProperties : undefined}
      >
        {completada
          ? <CheckCircle2 size={16} className="text-green-400" />
          : <Icon size={16} className={activa ? fase.color : 'text-white/20'} />}
      </div>
      {/* Título de Fase */}
      <div className="text-center px-1">
        <p className={`text-[8px] font-black uppercase tracking-[0.15em] ${
          completada ? 'text-green-400' : activa ? fase.color : 'text-white/20'
        }`}>
          Fase {fase.numero}
        </p>
        <p className={`text-[9px] font-bold leading-tight hidden sm:block ${
          completada ? 'text-white/60' : activa ? 'text-white/70' : 'text-white/20'
        }`}>
          {fase.titulo}
        </p>
      </div>
      {/* Mini barra de progreso */}
      <div className="w-full h-0.5 bg-white/[0.05] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            completada ? 'bg-green-500' : activa ? 'bg-current' : 'bg-transparent'
          }`}
          style={{
            width: `${progreso}%`,
            color: activa ? fase.color.replace('text-', '') : undefined,
            background: completada ? undefined : activa
              ? fase.color.includes('cyan') ? '#22d3ee'
              : fase.color.includes('emerald') ? '#34d399'
              : fase.color.includes('yellow') ? '#facc15'
              : undefined
              : undefined,
          }}
        />
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────

const SeguimientoPage = () => {
  const { 
    casoActual, 
    dispositivoActual, 
    completedSteps, 
    stepMetadata, 
    setStepCompleted, 
    setStepMetadata, 
    loadCompletedSteps 
  } = useForenseStore();

  const [activeFase, setActiveFase] = useState('f1');
  const [filterMode, setFilterMode] = useState<'all' | 'completed'>('all');

  useEffect(() => {
    window.scrollTo(0, 0);
    loadCompletedSteps();
  }, [loadCompletedSteps]);

  // Cálculos de progreso global
  const totalSteps = stepsData.length;
  const completedCount = Object.keys(completedSteps).filter(key => completedSteps[key]).length;
  const progressPercentage = Math.round((completedCount / totalSteps) * 100);

  // Progreso por fase
  const progresoPorFase = useCallback((fase: Fase) => {
    const totalFase = fase.stepIds.length;
    const completedFase = fase.stepIds.filter(id => !!completedSteps[id]).length;
    return Math.round((completedFase / totalFase) * 100);
  }, [completedSteps]);

  const faseCompletada = useCallback((fase: Fase) => progresoPorFase(fase) === 100, [progresoPorFase]);

  const handleToggleStep = useCallback((stepId: string) => {
    setStepCompleted(stepId, !completedSteps[stepId]);
  }, [completedSteps, setStepCompleted]);

  const handleMetadataChange = useCallback((stepId: string, field: 'fecha' | 'responsable' | 'observaciones', value: string) => {
    setStepMetadata(stepId, { [field]: value });
  }, [setStepMetadata]);

  // Filtrar pasos según la fase activa para renderizado de pantalla
  const faseActualObj = FASES.find(f => f.id === activeFase) || FASES[0];
  const stepsDeFaseActiva = stepsData.filter(step => faseActualObj.stepIds.includes(step.id));

  return (
    <div className="planilla-container">
      <div className="app-container">
        
        {/* Floating Print Button */}
        <button 
          className="floating-print-btn no-print" 
          onClick={() => window.print()}
          title="Imprimir Timeline y Acta de Seguimiento"
        >
          <Printer size={16} />
          <span>Imprimir Protocolo</span>
        </button>

        {/* Main Content Area */}
        <main className="w-full flex-1 max-w-[900px] mx-auto p-4 sm:p-8 space-y-6">
          
          {/* Timeline Dashboard (no-print) */}
          <div className="timeline-header-card no-print">
            <div className="phase-badge">LEXCODE FORENSICS</div>
            <h1>Seguimiento Cronológico de Cadena de Custodia</h1>
            
            {/* Active Case Context */}
            {casoActual ? (
              <div className="forensic-card p-4 bg-white/[0.02] border border-white/5 rounded-lg mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-white/40 block uppercase tracking-wider font-bold text-[9px]">Expediente / Caso</span>
                  <span className="text-white font-bold text-sm">{casoActual.numeroCaso}</span>
                </div>
                <div>
                  <span className="text-white/40 block uppercase tracking-wider font-bold text-[9px]">Responsable Principal</span>
                  <span className="text-white font-bold text-sm">{casoActual.fiscal}</span>
                </div>
                <div>
                  <span className="text-white/40 block uppercase tracking-wider font-bold text-[9px]">Evidencia Asociada</span>
                  <span className="text-white font-bold text-sm">
                    {dispositivoActual ? `${dispositivoActual.marca} ${dispositivoActual.modelo}` : 'Dispositivo Android'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-lg text-xs mt-4 flex items-center gap-2">
                <Info size={16} />
                <span>No hay un caso activo seleccionado. Completando plantilla del protocolo general.</span>
              </div>
            )}

            {/* Stepper Progress Bar */}
            <div className="timeline-progress-container mt-6">
              <div className="flex justify-between items-center text-xs">
                <span className="timeline-progress-text uppercase tracking-wider">Progreso de la Experticia</span>
                <span className="text-fluent-accent font-bold">{completedCount} de {totalSteps} Pasos ({progressPercentage}%)</span>
              </div>
              <div className="timeline-progress-bar">
                <div className="timeline-progress-fill" style={{ width: `${progressPercentage}%` }}></div>
              </div>
            </div>
          </div>

          {/* Stepper de Fases (no-print) */}
          <div className="fluent-mica rounded-xl border border-white/5 p-4 sm:p-5 no-print">
            <div className="flex items-center gap-2 sm:gap-3">
              {FASES.map((fase, idx) => (
                <div key={fase.id} className="flex items-center flex-1 min-w-0">
                  <StepperFase
                    fase={fase}
                    activa={activeFase === fase.id}
                    completada={faseCompletada(fase)}
                    progreso={progresoPorFase(fase)}
                    onClick={() => setActiveFase(fase.id)}
                  />
                  {idx < FASES.length - 1 && (
                    <div className={`hidden sm:block h-px flex-1 mx-1 ${
                      faseCompletada(fase) ? 'bg-green-500/30' : 'bg-white/[0.05]'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Detalle de Fase Activa (no-print) */}
          <div className="fluent-mica rounded-xl border border-white/5 p-5 sm:p-6 mb-4 relative overflow-hidden no-print">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(ellipse at top left, ${faseActualObj.glowColor}, transparent 60%)` }}
            />
            <div className="relative flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-[6px] bg-white/[0.04] border border-white/[0.08] shrink-0">
                  {(() => {
                    const IconComp = iconMap[faseActualObj.iconoName] || Shield;
                    return <IconComp size={22} className={faseActualObj.color} />;
                  })()}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${faseActualObj.color}`}>
                      Fase {faseActualObj.numero}
                    </span>
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded border ${
                      faseCompletada(faseActualObj)
                        ? 'border-green-500/25 bg-green-500/10 text-green-400'
                        : 'border-white/[0.07] bg-white/[0.03] text-white/25'
                    } uppercase tracking-wider`}>
                      {faseCompletada(faseActualObj)
                        ? '✓ Completada'
                        : `${progresoPorFase(faseActualObj)}% completado`}
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
                    {faseActualObj.titulo}
                  </h2>
                  <p className="text-[10px] text-white/35 font-medium mt-1">{faseActualObj.subtitulo}</p>
                </div>
              </div>

              {/* Fase Navigation */}
              <div className="shrink-0 flex gap-2">
                <button
                  onClick={() => {
                    const idx = FASES.findIndex(f => f.id === activeFase);
                    if (idx > 0) setActiveFase(FASES[idx - 1].id);
                  }}
                  disabled={activeFase === 'f1'}
                  className="text-[9px] font-black px-3 py-2 rounded-lg border border-white/[0.07] bg-white/[0.02] text-white/30 hover:text-white/60 hover:bg-white/[0.05] transition-all disabled:opacity-20 disabled:cursor-not-allowed uppercase tracking-wider"
                >
                  ← Anterior
                </button>
                <button
                  onClick={() => {
                    const idx = FASES.findIndex(f => f.id === activeFase);
                    if (idx < FASES.length - 1) setActiveFase(FASES[idx + 1].id);
                  }}
                  disabled={activeFase === 'f3'}
                  className={`text-[9px] font-black px-3 py-2 rounded-lg border transition-all disabled:opacity-20 disabled:cursor-not-allowed uppercase tracking-wider ${
                    activeFase !== 'f3'
                      ? `border-${faseActualObj.color.split('-')[1]}-500/20 bg-${faseActualObj.color.split('-')[1]}-500/[0.06] ${faseActualObj.color} hover:opacity-80`
                      : 'border-white/[0.07] bg-white/[0.02] text-white/30'
                  }`}
                >
                  Siguiente →
                </button>
              </div>
            </div>
          </div>

          {/* Interactive controls (no-print) */}
          <div className="timeline-controls no-print">
            <span className="text-[10px] text-white/50">Organice la visualización para la impresión del acta:</span>
            <div className="flex gap-2">
              <button 
                onClick={() => setFilterMode('all')} 
                className={`timeline-filter-btn ${filterMode === 'all' ? 'active' : ''}`}
              >
                Ver Todo
              </button>
              <button 
                onClick={() => setFilterMode('completed')} 
                className={`timeline-filter-btn ${filterMode === 'completed' ? 'active' : ''}`}
              >
                Solo Hitos Completados
              </button>
            </div>
          </div>

          {/* List of Steps for Active Phase (no-print) */}
          <div className="space-y-3 no-print">
            {stepsDeFaseActiva.map((step) => (
              <TarjetaPaso
                key={step.id}
                step={step}
                completado={!!completedSteps[step.id]}
                meta={stepMetadata[step.id] || {}}
                onToggle={handleToggleStep}
                onMetadataChange={handleMetadataChange}
              />
            ))}
          </div>

          {/* CTA Next Phase (no-print) */}
          {faseCompletada(faseActualObj) && activeFase !== 'f3' && (
            <div className="mt-5 p-5 rounded-xl border border-green-500/20 bg-green-500/[0.04] flex items-center justify-between gap-4 animate-fade-in no-print">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={20} className="text-green-400 shrink-0" />
                <div>
                  <p className="text-sm font-black text-green-400 uppercase tracking-wide">
                    Fase {faseActualObj.numero} completada
                  </p>
                  <p className="text-[10px] text-green-400/60">
                    Continúe con la siguiente fase del protocolo forense
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  const idx = FASES.findIndex(f => f.id === activeFase);
                  if (idx < FASES.length - 1) setActiveFase(FASES[idx + 1].id);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-500/15 border border-green-500/30 text-green-400 text-[10px] font-black uppercase tracking-wider hover:bg-green-500/25 transition-all shrink-0"
              >
                Siguiente fase <TrendingUp size={12} />
              </button>
            </div>
          )}

          {/* Mensaje final - Protocolo Completo (no-print) */}
          {activeFase === 'f3' && faseCompletada(faseActualObj) && (
            <div className="mt-5 p-6 rounded-xl border border-cyan-500/20 bg-cyan-500/[0.04] text-center animate-fade-in relative overflow-hidden no-print">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.05] to-transparent pointer-events-none" />
              <div className="relative">
                <CheckCircle2 size={40} className="text-green-400 mx-auto mb-3" />
                <h3 className="text-base font-black text-white uppercase tracking-tight mb-2">
                  Protocolo Forense Completado
                </h3>
                <p className="text-[11px] text-white/40 leading-relaxed max-w-2xl mx-auto mb-4">
                  Ha completado las fases del protocolo de seguimiento cronológico forense
                  conforme al Art. 187 y 225 del COPP, la Ley sobre Mensajes de Datos y Firmas Electrónicas,
                  y el Manual Único de Cadena de Custodia de Venezuela. La evidencia digital está blindada.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['COPP ✓', 'MUCCEF ✓', 'LMDyFE ✓', 'ISO 27037 ✓', 'SHA-256 ✓'].map(t => (
                    <span key={t} className="text-[9px] px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 font-black uppercase tracking-wider">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
             Print Timeline Layout (Visible ONLY on print)
             ========================================== */}
          <div className="timeline-print-layout">
            <div className="text-center mb-6">
              <h2 className="text-[12px] font-bold text-black uppercase tracking-widest">República Bolivariana de Venezuela</h2>
              <h3 className="text-[13px] font-extrabold text-black uppercase mt-1">Acta de Control Cronológico y Timeline Forense</h3>
              <p className="text-[8px] text-black/75 uppercase tracking-wider mt-0.5">
                Conforme al Art. 187 del Código Orgánico Procesal Penal y Art. 4 y 7 de la Ley sobre Mensajes de Datos y Firmas Electrónicas
              </p>
            </div>

            {/* Print metadata info */}
            <div className="grid grid-cols-2 gap-4 border border-black p-4 text-[10px] mb-6">
              <div>
                <p><strong>Nro. Expediente / Caso:</strong> {casoActual?.numeroCaso || '_________________________'}</p>
                <p><strong>Fiscalía Interviniente:</strong> {casoActual?.fiscal || '_________________________'}</p>
                <p><strong>Fecha Impresión Timeline:</strong> {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
              </div>
              <div>
                <p><strong>Evidencia:</strong> {dispositivoActual ? `${dispositivoActual.marca} ${dispositivoActual.modelo}` : 'Dispositivo Móvil Android'}</p>
                <p><strong>IMEI principal:</strong> {dispositivoActual?.imei || '_________________________'}</p>
                <p><strong>Estado General:</strong> {completedCount} de {totalSteps} pasos cumplidos ({progressPercentage}%)</p>
              </div>
            </div>

            <div className="timeline-print-title">Registro de Hitos Cronológicos y Custodia</div>

            <table className="timeline-print-table">
              <thead>
                <tr>
                  <th style={{ width: '8%' }}>Paso</th>
                  <th style={{ width: '32%' }}>Hito Forense / Descripción</th>
                  <th style={{ width: '18%' }}>Fecha y Hora</th>
                  <th style={{ width: '22%' }}>Funcionario / Perito</th>
                  <th style={{ width: '20%' }}>Observaciones / Precintos</th>
                </tr>
              </thead>
              <tbody>
                {stepsData.map((step) => {
                  const isCompleted = !!completedSteps[step.id];
                  const meta = stepMetadata[step.id] || {};
                  
                  // Si estamos en filtro "solo completados" en la vista y el paso está pendiente, no lo imprimimos
                  if (filterMode === 'completed' && !isCompleted) return null;

                  return (
                    <tr key={step.id} className={isCompleted ? '' : 'pending-row'}>
                      <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{step.num}</td>
                      <td>
                        <strong>{step.title}</strong>
                        <p style={{ margin: '2px 0 0 0', fontSize: '8.5px', color: '#333' }}>{step.action}</p>
                      </td>
                      <td>
                        {isCompleted ? (
                          meta.fecha ? new Date(meta.fecha).toLocaleString() : 'Fecha no especificada'
                        ) : (
                          'PENDIENTE DE EJECUCIÓN'
                        )}
                      </td>
                      <td>
                        {isCompleted ? (
                          meta.responsable || 'No especificado'
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td>
                        {isCompleted ? (
                          meta.observaciones || 'Registrado conforme'
                        ) : (
                          'N/A'
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Signature Block for Timeline Print */}
            <div className="grid grid-cols-2 gap-20 mt-16 text-center">
              <div style={{ borderTop: '1px solid black', paddingTop: '5px' }}>
                <p style={{ margin: 0, fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase' }}>Perito Forense Responsable</p>
                <p style={{ margin: '2px 0 0 0', fontSize: '8px', color: '#555' }}>Firma y Sello del Laboratorio</p>
              </div>
              <div style={{ borderTop: '1px solid black', paddingTop: '5px' }}>
                <p style={{ margin: 0, fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase' }}>Funcionario Receptor / Testigo</p>
                <p style={{ margin: '2px 0 0 0', fontSize: '8px', color: '#555' }}>Firma Autorizada</p>
              </div>
            </div>

            <div className="text-center text-[7px] text-gray-500 mt-16">
              SHA256.US Forensic Laboratory | Sello de Seguridad Digital | Inalterabilidad y Cero Riesgo de Nulidad
            </div>
          </div>

          {/* Footer info (no-print) */}
          <div className="footer-info no-print">
            SHA256 Forensic Laboratory | Protocolo MUCCEF 2017 | Ley sobre Mensajes de Datos y Firmas Electrónicas
          </div>
        </main>
      </div>
    </div>
  );
};

export default SeguimientoPage;
