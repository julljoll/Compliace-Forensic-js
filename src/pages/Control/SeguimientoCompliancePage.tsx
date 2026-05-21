import { useState, useEffect, useCallback, useMemo } from 'react';
import { useCMSStore } from '../../store/cmsStore';
import { NORMATIVAS_ETAPAS } from '../../data/normativasEtapas';
import {
  ShieldCheck, Calendar, User, Info,
  CheckCircle2, Circle, ChevronDown, ChevronUp, Terminal,
  Shield, Lock, Camera, Smartphone, Database, FileText,
  AlertTriangle, Copy, CheckCheck, Fingerprint, Package,
  Scale, Archive, Briefcase, PlusCircle
} from 'lucide-react';
import '../Planillas/Planillas.css';

// ── CONSTANTES Y TIPOS ─────────────────────────────────────────────────────────────

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
  // IDs de cumplimiento vinculados
  complianceIds: string[];
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
        cuerpo: 'Las actas deben redactarse strictly en tercera persona, tiempo presente, indicando de forma detallada las circunstancias de modo, tiempo y lugar del acto.',
        nivel: 'info'
      },
      {
        titulo: 'Firma e Impresión Dactilar Obligatorias',
        cuerpo: 'La falta de firma o impresión dactilar del consignante y del funcionario receptor en las actas de entrevista y consignación puede acarrear la nulidad absoluta de la evidencia.',
        nivel: 'critical'
      }
    ],
    complianceIds: ['n8__187', 'n4__prcc', 'n7__eficacia']
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
      { label: 'MUCCEF 2017', color: 'green' },
      { label: 'NIST SP 800-101', color: 'purple' }
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
    ],
    complianceIds: ['n1__identificacion', 'n1__recopilacion', 'n4__fijacion', 'n4__proteccion', 'n3__preservacion']
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
      { label: 'LMDyFE Art. 7', color: 'cyan' },
      { label: 'NIST SP 800-101', color: 'purple' }
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
    ],
    complianceIds: ['n1__adquisicion', 'n3__adquisicion', 'n7__firma']
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
    ],
    complianceIds: ['n4__embalaje', 'n8__188']
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
    ],
    complianceIds: ['n4__recepcion_lab', 'n4__designacion', 'n2__preparacion']
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
    ],
    complianceIds: ['n2__examen', 'n2__analisis', 'n3__examen']
  },
  {
    id: 'step7',
    num: 7,
    phase: 'Fase 2: Peritaje',
    title: 'Obtención por Derivación (Nueva Evidencia)',
    action: 'Aislar chats, audios o archivos clave detectados.',
    docs: ['NUEVA PRCC (Para data derivada)', 'Acta de Obtención por Derivación'],
    guide: 'NUEVA PRCC: Propio número correlativo, tinta negra/azul, firma y huella. ACTA: Indicar la ruta específica de aislamiento desde la evidencia digital original (evitando contamination).',
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
    ],
    complianceIds: ['n4__peritaje']
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
    ],
    complianceIds: ['n3__reporte', 'n2__interpretacion', 'n7__igualdad']
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
    ],
    complianceIds: ['n1__preservacion', 'n4__remision']
  }
];

// Helper components

function BadgeNormativa({ tag }: { tag: NormativaTag }) {
  const colors: Record<NormativaTag['color'], string> = {
    cyan:   'bg-cyan-500/10 border-cyan-500/25 text-cyan-400',
    green:  'bg-green-500/10 border-green-500/25 text-green-400',
    yellow: 'bg-yellow-500/10 border-yellow-500/25 text-yellow-400',
    red:    'bg-red-500/10 border-red-500/25 text-red-400',
    purple: 'bg-purple-500/10 border-purple-500/25 text-purple-400',
  };
  return (
    <span className={`inline-flex items-center text-[8px] font-black uppercase tracking-[0.15em] px-2 py-0.5 rounded border ${colors[tag.color]}`}>
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

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────

export default function SeguimientoCompliancePage() {
  const {
    casos,
    casoSeleccionado,
    seleccionarCaso,
    setStepCompleted,
    setStepMetadata,
    toggleComplianceCheck,
    setComplianceObservacion
  } = useCMSStore();

  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  // Encontrar el caso seleccionado
  const activeCaso = useMemo(() => {
    return casos.find(c => c.id === casoSeleccionado) || null;
  }, [casos, casoSeleccionado]);

  // Si no hay caso seleccionado, auto-seleccionar el primero si existe
  useEffect(() => {
    if (!casoSeleccionado && casos.length > 0) {
      seleccionarCaso(casos[0].id);
    }
  }, [casos, casoSeleccionado, seleccionarCaso]);

  // Obtener estado de completado e información del paso
  const getStepStatus = (stepId: string) => {
    if (!activeCaso) return { completado: false, metadata: {} };
    const completado = !!activeCaso.completed_steps?.[stepId];
    const metadata = activeCaso.step_metadata?.[stepId] || { fecha: '', responsable: '', observaciones: '' };
    return { completado, metadata };
  };

  // Obtener todos los requisitos reglamentarios para un paso
  const getRequisitosForPaso = useCallback((complianceIds: string[]) => {
    const list: { id: string; normativaId: string; codigo: string; nombre: string; descripcion: string }[] = [];
    
    complianceIds.forEach(id => {
      // Buscar en NORMATIVAS_ETAPAS
      NORMATIVAS_ETAPAS.forEach(ne => {
        ne.etapas.forEach(et => {
          if (et.id === id) {
            list.push({
              id: et.id,
              normativaId: ne.normativaId,
              codigo: ne.codigo,
              nombre: et.nombre,
              descripcion: et.descripcion
            });
          }
          if (et.subetapas) {
            et.subetapas.forEach(sub => {
              if (sub.id === id) {
                list.push({
                  id: sub.id,
                  normativaId: ne.normativaId,
                  codigo: ne.codigo,
                  nombre: sub.nombre,
                  descripcion: sub.descripcion
                });
              }
            });
          }
        });
      });
    });

    return list;
  }, []);

  // Verificar si un requisito de cumplimiento está verificado
  const isComplianceChecked = useCallback((reqId: string) => {
    if (!activeCaso) return false;
    const checklist = activeCaso.compliance_checklist || [];
    return !!checklist.find(c => c.stageId === reqId && c.checked);
  }, [activeCaso]);

  const getComplianceCheckDate = useCallback((reqId: string) => {
    if (!activeCaso) return undefined;
    const checklist = activeCaso.compliance_checklist || [];
    return checklist.find(c => c.stageId === reqId)?.fechaCheck;
  }, [activeCaso]);

  const getComplianceObservacionValue = useCallback((reqId: string) => {
    if (!activeCaso) return '';
    const checklist = activeCaso.compliance_checklist || [];
    return checklist.find(c => c.stageId === reqId)?.observacion || '';
  }, [activeCaso]);

  // Cálculos de métricas para el caso activo
  const metrics = useMemo(() => {
    if (!activeCaso) return { stepPct: 0, compliancePct: 0, completedStepsCount: 0 };
    
    // Progreso de pasos forenses
    const completedStepsCount = Object.keys(activeCaso.completed_steps || {}).filter(k => activeCaso.completed_steps?.[k]).length;
    const stepPct = Math.round((completedStepsCount / 9) * 100);

    // Progreso de compliance: total de requisitos vinculados a los 9 pasos
    let totalReqs = 0;
    let checkedReqs = 0;
    
    stepsData.forEach(step => {
      const reqs = getRequisitosForPaso(step.complianceIds);
      totalReqs += reqs.length;
      reqs.forEach(r => {
        if (isComplianceChecked(r.id)) {
          checkedReqs++;
        }
      });
    });

    const compliancePct = totalReqs > 0 ? Math.round((checkedReqs / totalReqs) * 100) : 0;

    return { stepPct, compliancePct, completedStepsCount };
  }, [activeCaso, getRequisitosForPaso, isComplianceChecked]);

  if (casos.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[60vh] animate-fade-in">
        <div className="p-4 rounded-full bg-fluent-accent/10 border border-fluent-accent/20 text-fluent-accent mb-6 animate-pulse">
          <Briefcase size={48} strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">No se detectaron casos creados</h2>
        <p className="text-fluent-text-muted text-sm max-w-md mb-6 leading-relaxed">
          Para realizar el seguimiento forense y compliance, es necesario inicializar al menos un proyecto/caso en la sección de control de casos.
        </p>
        <a
          href="/casos"
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-fluent-accent hover:bg-fluent-accent/90 text-white font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-fluent-accent/20"
        >
          <PlusCircle size={16} />
          <span>Crear Primer Caso</span>
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Cabecera y Selector */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight flex items-center gap-4">
            <div className="p-2 rounded-[4px] bg-[#FECF06]/10 border border-[#FECF06]/20">
              <ShieldCheck className="text-[#FECF06]" size={28} strokeWidth={2.5} />
            </div>
            Seguimiento & Compliance
          </h1>
          <p className="text-sm text-fluent-text-muted font-medium max-w-lg mt-2 leading-relaxed">
            Consolidado forense estructurado y validaciones normativas de control (ISO 27037/27042, NIST, MUCCEF).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black uppercase text-fluent-text-muted/40 tracking-wider">
            Proyecto Activo:
          </span>
          <select
            value={casoSeleccionado || ''}
            onChange={(e) => seleccionarCaso(e.target.value)}
            className="bg-[#0b1f13] border border-fluent-accent/20 rounded-lg text-xs font-bold text-fluent-accent px-4 py-2.5 outline-none hover:border-fluent-accent/50 focus:border-fluent-accent transition-all min-w-[200px]"
          >
            {casos.map(c => (
              <option key={c.id} value={c.id}>
                {c.numeroCaso} - {c.titulo}
              </option>
            ))}
          </select>
        </div>
      </div>

      {activeCaso && (
        <>
          {/* Detalles del dispositivo del caso */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-xl border border-white/5 bg-[#0b1f13]/30">
            <div className="space-y-1">
              <span className="text-[8px] font-black uppercase text-fluent-text-muted/40 tracking-wider block">Dispositivo</span>
              <p className="text-xs font-bold text-white">{activeCaso.dispositivo_marca || 'N/D'} {activeCaso.dispositivo_modelo || ''}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[8px] font-black uppercase text-fluent-text-muted/40 tracking-wider block">IMEI</span>
              <p className="text-xs font-mono text-fluent-accent font-semibold">{activeCaso.dispositivo_imei || 'N/D'}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[8px] font-black uppercase text-fluent-text-muted/40 tracking-wider block">Fiscalía</span>
              <p className="text-xs font-bold text-white truncate">{activeCaso.fiscal || 'Sin designar'}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[8px] font-black uppercase text-fluent-text-muted/40 tracking-wider block">Perito Líder</span>
              <p className="text-xs font-bold text-white truncate">{activeCaso.peritoLider || 'Sin designar'}</p>
            </div>
          </div>

          {/* Gauges y Métricas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Seguimiento Forense Gauge */}
            <div className="fluent-mica p-6 rounded-xl border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-white text-sm tracking-tight flex items-center gap-2">
                  <Database size={16} className="text-cyan-400" />
                  Progreso de Pasos Forenses
                </h3>
                <span className="text-[10px] font-black font-mono text-cyan-400 bg-cyan-400/10 px-2.5 py-1 rounded-[4px] border border-cyan-400/20 uppercase tracking-widest">
                  {metrics.completedStepsCount} / 9 Pasos
                </span>
              </div>
              <div className="w-full h-2.5 bg-white/[0.03] rounded-full overflow-hidden border border-white/5 p-[1px]">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-in-out"
                  style={{
                    width: `${metrics.stepPct}%`,
                    background: 'linear-gradient(90deg, #06b6d4, #22d3ee)'
                  }}
                />
              </div>
              <div className="mt-3 flex justify-between text-[10px] font-black text-fluent-text-muted/40 uppercase tracking-[0.2em]">
                <span>Trazabilidad Forense</span>
                <span className="text-cyan-400 font-black">{metrics.stepPct}% Completado</span>
              </div>
            </div>

            {/* Compliance Gauge */}
            <div className="fluent-mica p-6 rounded-xl border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-white text-sm tracking-tight flex items-center gap-2">
                  <Shield size={16} className="text-[#00FF41]" />
                  Cumplimiento Normativo (Compliance)
                </h3>
                <span className="text-[10px] font-black font-mono text-[#00FF41] bg-[#00FF41]/10 px-2.5 py-1 rounded-[4px] border border-[#00FF41]/20 uppercase tracking-widest">
                  {metrics.compliancePct}% Conforme
                </span>
              </div>
              <div className="w-full h-2.5 bg-white/[0.03] rounded-full overflow-hidden border border-white/5 p-[1px]">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-in-out"
                  style={{
                    width: `${metrics.compliancePct}%`,
                    background: 'linear-gradient(90deg, #10b981, #00ff41)'
                  }}
                />
              </div>
              <div className="mt-3 flex justify-between text-[10px] font-black text-fluent-text-muted/40 uppercase tracking-[0.2em]">
                <span>Aseguramiento de Calidad</span>
                <span className="text-[#00FF41] font-black">ISO / NIST / COPP</span>
              </div>
            </div>
          </div>

          {/* Accordion de los 9 Pasos Forenses */}
          <div className="space-y-4">
            {stepsData.map((step) => {
              const { completado, metadata } = getStepStatus(step.id);
              const isExpanded = expandedStep === step.id;
              const Icon = iconMap[step.iconoName] || Shield;
              const requisitos = getRequisitosForPaso(step.complianceIds);

              return (
                <div
                  key={step.id}
                  className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                    completado
                      ? 'border-green-500/20 bg-green-500/[0.03]'
                      : isExpanded
                      ? 'border-white/10 bg-white/[0.02]'
                      : 'border-white/[0.05] bg-white/[0.01] hover:bg-white/[0.02]'
                  }`}
                >
                  {/* Cabecera del paso */}
                  <button
                    className="w-full flex items-center gap-4 px-5 py-4 text-left group"
                    onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                  >
                    <span className="text-[10px] font-black text-white/20 font-mono shrink-0 w-8 tabular-nums">
                      {step.num.toString().padStart(2, '0')}
                    </span>
                    <div className={`p-2 rounded-lg shrink-0 transition-all ${
                      completado ? 'bg-green-500/15' : 'bg-white/[0.04] group-hover:bg-white/[0.07]'
                    }`}>
                      <Icon size={14} className={completado ? 'text-green-400' : 'text-white/30'} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`text-[11px] font-black uppercase tracking-wide block ${
                        completado ? 'text-green-400/80' : 'text-white/60 group-hover:text-white/80'
                      }`}>
                        {step.title}
                      </span>
                      <span className="text-[9px] text-fluent-text-muted/40 uppercase font-bold tracking-wider block mt-0.5">
                        {step.phase}
                      </span>
                    </div>

                    {!isExpanded && step.normativas && (
                      <div className="hidden sm:flex items-center gap-1.5 flex-wrap">
                        {step.normativas.slice(0, 2).map(n => (
                          <BadgeNormativa key={n.label} tag={n} />
                        ))}
                      </div>
                    )}

                    <span className={`timeline-status-badge ${completado ? 'completed' : 'pending'} ml-4`}>
                      {completado ? 'Completado' : 'Pendiente'}
                    </span>

                    {isExpanded
                      ? <ChevronUp size={14} className="text-white/25 shrink-0 ml-2" />
                      : <ChevronDown size={14} className="text-white/20 shrink-0 ml-2" />}
                  </button>

                  {/* Contenido expandido */}
                  {isExpanded && (
                    <div className="border-t border-white/5 bg-black/10 p-6 space-y-6">
                      
                      {/* Grid de 2 Columnas (Técnico vs Compliance) */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        
                        {/* Columna Izquierda: Instrucciones y Checklist Técnico */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-black text-cyan-400 uppercase tracking-widest pb-1 border-b border-white/5">
                            Instrucciones y Ejecución Técnica
                          </h4>

                          <div className="border-l-2 border-white/10 pl-4 space-y-1">
                            <span className="text-[9px] text-fluent-accent font-bold uppercase tracking-wider block">Acción de Campo</span>
                            <p className="text-xs text-white/80 font-medium">{step.action}</p>
                          </div>

                          {step.docs.length > 0 && (
                            <div>
                              <span className="text-[9px] font-black text-white/30 uppercase tracking-widest block mb-1.5">Actas y Documentos</span>
                              <div className="flex flex-wrap gap-2">
                                {step.docs.map((doc, idx) => (
                                  <span key={idx} className="bg-white/5 border border-white/10 rounded-full px-2.5 py-0.5 text-[9px] text-white/60 uppercase tracking-wider font-semibold">
                                    📄 {doc}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="timeline-guide-panel !m-0">
                            <h5 className="text-[9px] font-bold text-fluent-accent uppercase tracking-wider mb-2">Fundamento</h5>
                            <p className="text-xs text-white/70 leading-relaxed mb-3">{step.guide}</p>
                            
                            <h5 className="text-[9px] font-bold text-white uppercase tracking-wider mb-2">Checklist Operativo:</h5>
                            <ul className="space-y-1.5 text-xs text-white/80">
                              {step.tasks.map((task, tIdx) => (
                                <li key={tIdx} className="flex items-start gap-2">
                                  <span className="text-fluent-accent">•</span>
                                  <span>{task}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {step.codigo?.map((c, i) => (
                            <BloqueCode key={i} lang={c.lang} contenido={c.contenido} />
                          ))}

                          {step.advertencias?.map((adv, i) => (
                            <AlertaForense key={i} adv={adv} />
                          ))}
                        </div>

                        {/* Columna Derecha: Requisitos de Compliance Normativo */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-black text-[#00FF41] uppercase tracking-widest pb-1 border-b border-white/5">
                            Requisitos Normativos y Compliance
                          </h4>

                          <div className="space-y-3">
                            {requisitos.map((req) => {
                              const checked = isComplianceChecked(req.id);
                              const checkDate = getComplianceCheckDate(req.id);
                              const obsValue = getComplianceObservacionValue(req.id);

                              return (
                                <div key={req.id} className="p-4 rounded-lg bg-white/[0.02] border border-white/5 space-y-3 hover:border-white/10 transition-all">
                                  <div className="flex items-start gap-3">
                                    <button
                                      onClick={() => toggleComplianceCheck(req.id, req.normativaId)}
                                      className={`w-[18px] h-[18px] rounded-[4px] border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                                        checked
                                          ? 'bg-[#00FF41] border-[#00FF41] text-black shadow-lg shadow-[#00FF41]/20'
                                          : 'border-white/20 hover:border-[#00FF41]/50'
                                      }`}
                                    >
                                      {checked && <CheckCheck size={12} strokeWidth={3} />}
                                    </button>

                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <span className="font-mono text-[9px] font-black text-[#FECF06] uppercase tracking-wider">
                                          {req.codigo}
                                        </span>
                                        {checked && checkDate && (
                                          <span className="text-[8px] font-black text-[#00FF41] uppercase tracking-widest">
                                            ✓ Verificado
                                          </span>
                                        )}
                                      </div>
                                      <p className={`text-xs font-bold ${checked ? 'text-[#00FF41]/80 line-through opacity-60' : 'text-white'}`}>
                                        {req.nombre}
                                      </p>
                                      <p className="text-[11px] text-fluent-text-muted mt-1 leading-relaxed">
                                        {req.descripcion}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Caja de observaciones de compliance */}
                                  <div className="pl-7">
                                    <input
                                      type="text"
                                      placeholder="Observación de cumplimiento / Evidencia RAG..."
                                      value={obsValue}
                                      onChange={(e) => setComplianceObservacion(req.id, e.target.value)}
                                      className="w-full bg-black/40 border border-white/10 rounded px-2.5 py-1 text-[11px] text-white/70 placeholder-white/25 focus:border-[#00FF41] outline-none transition-all"
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                      </div>

                      {/* Caja de Metadata de Hito (solo cuando completado) */}
                      {completado && (
                        <div className="timeline-meta-box !mt-6 !p-4 !bg-black/40 !border !border-white/5 !rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="timeline-input-group">
                            <label className="timeline-input-label flex items-center gap-1.5">
                              <Calendar size={11} className="text-[#FECF06]" />
                              <span>Fecha y Hora de Hito</span>
                            </label>
                            <input 
                              type="datetime-local" 
                              className="timeline-input" 
                              value={metadata.fecha || ''}
                              onChange={(e) => setStepMetadata(step.id, { fecha: e.target.value })}
                            />
                          </div>

                          <div className="timeline-input-group">
                            <label className="timeline-input-label flex items-center gap-1.5">
                              <User size={11} className="text-[#FECF06]" />
                              <span>Responsable de Firma / Perito</span>
                            </label>
                            <input 
                              type="text" 
                              className="timeline-input" 
                              placeholder="Nombre del Funcionario Asignado"
                              value={metadata.responsable || ''}
                              onChange={(e) => setStepMetadata(step.id, { responsable: e.target.value })}
                            />
                          </div>

                          <div className="timeline-input-group md:col-span-2">
                            <label className="timeline-input-label flex items-center gap-1.5">
                              <span>Observaciones Adicionales (Precinto, Actas anexadas, etc.)</span>
                            </label>
                            <input 
                              type="text" 
                              className="timeline-input" 
                              placeholder="Ej: Sin novedades, precinto verificado"
                              value={metadata.observaciones || ''}
                              onChange={(e) => setStepMetadata(step.id, { observaciones: e.target.value })}
                            />
                          </div>
                        </div>
                      )}

                      {/* Acciones del paso */}
                      <div className="pt-4 border-t border-white/[0.05] flex items-center justify-between">
                        <span className="text-[10px] text-white/30 italic">
                          {completado ? '✓ Hito guardado en Neon Serverless' : 'Asegure el checklist reglamentario antes de marcar'}
                        </span>
                        <button
                          onClick={() => setStepCompleted(step.id, !completado)}
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
            })}
          </div>
        </>
      )}
    </div>
  );
}
