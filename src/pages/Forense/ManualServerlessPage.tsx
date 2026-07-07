import { useState, useEffect, useCallback } from 'react';
import {
  CheckCircle2, Circle, ChevronDown, ChevronUp, Terminal,
  Shield, Lock, Globe, Database, Key, Info, AlertTriangle,
  Copy, CheckCheck, RotateCcw, Zap, BookOpen, Scale
} from '../../components/atoms/AppleIcon';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTES Y TIPOS
// ─────────────────────────────────────────────────────────────────────────────

const LS_KEY = 'manual_serverless_progress_v2';

type TagFase = {
  label: string;
  color: 'cyan' | 'green' | 'yellow' | 'red' | 'purple';
};

type Advertencia = {
  titulo: string;
  cuerpo: string;
  nivel: 'warning' | 'critical' | 'info';
};

type Paso = {
  id: string;
  numero: string;
  titulo: string;
  descripcion: string;
  items?: string[];
  codigo?: { lang: string; contenido: string }[];
  tags?: TagFase[];
  advertencias?: Advertencia[];
  icono: typeof Database;
};

type Fase = {
  id: string;
  numero: number;
  titulo: string;
  subtitulo: string;
  icono: typeof Database;
  color: string;        // clase Tailwind para el color principal
  glowColor: string;    // rgba para box-shadow
  pasos: Paso[];
};

// ─────────────────────────────────────────────────────────────────────────────
// DATOS — 5 FASES COMPLETAS (0 – 4)
// ─────────────────────────────────────────────────────────────────────────────

const FASES: Fase[] = [
  {
    id: 'f0',
    numero: 0,
    titulo: 'Introducción y Arquitectura',
    subtitulo: 'Entendiendo el esquema Offline-First y Neon Serverless',
    icono: Shield,
    color: 'text-[#007AFF]',
    glowColor: 'rgba(10,132,255,0.15)',
    pasos: [
      {
        id: 'f0p1',
        numero: '0.1',
        titulo: 'Esquema Offline-First del CMS',
        descripcion:
          'El CMS de Cumplimiento Forense está diseñado con arquitectura Offline-First. La persistencia de base de datos remota es complementaria y el sistema no tiene bloqueos si no está configurada.',
        items: [
          'Si no se provee la variable VITE_DATABASE_URL, la app guarda todos los datos en IndexedDB local.',
          'El perito puede realizar auditorías, gestionar casos y generar planillas totalmente desconectado.',
          'Al configurar la base de datos de Neon en la nube, el cliente se conecta remotamente de forma bidireccional y transparente.',
          'Si la conexión a internet falla, el cliente conmuta de vuelta a IndexedDB manteniendo la operatividad inalterada.',
        ],
        tags: [
          { label: 'IndexedDB', color: 'green' },
          { label: 'Offline-First', color: 'cyan' },
        ],
        icono: Shield,
      },
      {
        id: 'f0p2',
        numero: '0.2',
        titulo: 'Neon Serverless y PostgreSQL',
        descripcion:
          'Neon es una base de datos PostgreSQL serverless de última generación. Optimiza costos y recursos escalando a cero cuando no hay actividad.',
        items: [
          'La base de datos se suspende tras 5 minutos de inactividad, logrando consumo y costo cero.',
          'Se activa en milisegundos cuando detecta una nueva petición HTTP desde la app.',
          'Soporte completo de transacciones ACID y tipos de datos nativos para la cadena de custodia y bitácoras.',
        ],
        tags: [
          { label: 'PostgreSQL v16', color: 'purple' },
          { label: 'Serverless Scale-to-Zero', color: 'yellow' },
        ],
        icono: Database,
      },
    ],
  },
  {
    id: 'f1',
    numero: 1,
    titulo: 'Credenciales en Neon',
    subtitulo: 'Configuración inicial de la instancia en la nube',
    icono: Key,
    color: 'text-[#34C759]',
    glowColor: 'rgba(52,199,89,0.15)',
    pasos: [
      {
        id: 'f1p1',
        numero: '1.1',
        titulo: 'Creación de Proyecto en Neon Console',
        descripcion:
          'Es necesario crear una instancia de base de datos dedicada. Neon Console ofrece una interfaz sencilla para desplegar bases de datos PostgreSQL en segundos.',
        items: [
          'Inicia sesión o regístrate en la consola oficial: console.neon.tech',
          'Haz clic en "Create Project" (Crear Proyecto).',
          'Especifica el nombre del proyecto (ej: sha256-compliance).',
          'Elige la versión de PostgreSQL (se recomienda PostgreSQL 16) y la región más cercana (ej: AWS US East N. Virginia).',
          'Presiona "Create Project" para iniciar la provisión.',
        ],
        tags: [
          { label: 'console.neon.tech', color: 'cyan' },
        ],
        icono: Key,
      },
      {
        id: 'f1p2',
        numero: '1.2',
        titulo: 'Obtención de la Cadena de Conexión (Pooled)',
        descripcion:
          'La aplicación web requiere una URL especial de conexión para comunicarse con Neon. En entornos serverless, es imperativo usar el Pooler de conexiones.',
        items: [
          'En el Dashboard del proyecto de Neon, ubica la sección "Connection Details".',
          'Asegúrate de marcar el checkbox "Connection pooling" para activar el pooler de conexiones (puerto 5432 / pgBouncer).',
          'Copia la cadena de conexión completa que se muestra.',
          'Verifica que el string comience con el prefijo "postgresql://" y que incluya el parámetro "sslmode=require".',
        ],
        tags: [
          { label: 'Pooled Mode', color: 'purple' },
          { label: 'SSL Required', color: 'yellow' },
        ],
        advertencias: [
          {
            titulo: 'El pooler es obligatorio para aplicaciones Serverless',
            cuerpo:
              'Las arquitecturas serverless abren y cierran conexiones constantemente. Sin "Connection Pooling", la base de datos agotará rápidamente su límite de conexiones y la aplicación responderá con errores 500.',
            nivel: 'critical',
          },
        ],
        icono: Database,
      },
    ],
  },
  {
    id: 'f2',
    numero: 2,
    titulo: 'Configuración Local',
    subtitulo: 'Habilitando persistencia Neon en tu entorno de desarrollo',
    icono: Terminal,
    color: 'text-[#30B0C7]',
    glowColor: 'rgba(48,176,199,0.15)',
    pasos: [
      {
        id: 'f2p1',
        numero: '2.1',
        titulo: 'Crear Archivo de Entorno .env',
        descripcion:
          'Las credenciales de base de datos no deben quemarse en el código fuente. Se leen desde el archivo local de variables de entorno.',
        items: [
          'Ubica la plantilla .env.example en la raíz del proyecto.',
          'Haz una copia del archivo en el mismo directorio y renombrala a .env.',
          'Asegúrate de que el archivo .env esté listado en el .gitignore para evitar subidas accidentales.',
        ],
        codigo: [
          {
            lang: 'bash',
            contenido:
              '# Copiar la plantilla localmente desde la terminal\ncp .env.example .env\n\n# Verificar que el archivo .env fue creado\nls -la .env',
          },
        ],
        tags: [
          { label: '.env', color: 'cyan' },
          { label: 'Gitignore', color: 'green' },
        ],
        icono: Terminal,
      },
      {
        id: 'f2p2',
        numero: '2.2',
        titulo: 'Definir Variable de Entorno VITE_DATABASE_URL',
        descripcion:
          'La cadena de conexión obtenida de Neon debe ser guardada en la variable correcta. El prefijo VITE_ es mandatorio para que Vite exponga la variable en el frontend.',
        items: [
          'Edita el archivo .env con tu editor de código favorito.',
          'Configura la variable VITE_DATABASE_URL pegando la URL de Neon.',
          'Asegúrate de no dejar espacios en blanco adicionales alrededor de la URL.',
        ],
        codigo: [
          {
            lang: 'bash',
            contenido:
              '# Estructura requerida en el archivo .env\nVITE_DATABASE_URL=postgresql://alex_admin:mi_password_segura@ep-sparkling-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require',
          },
        ],
        tags: [
          { label: 'Vite Variable', color: 'yellow' },
        ],
        advertencias: [
          {
            titulo: 'Mantén a salvo tus contraseñas',
            cuerpo:
              'El archivo .env contiene contraseñas en texto plano. Nunca compartas este archivo con nadie ni lo envíes por canales inseguros. El Laboratorio Forense debe proteger los secretos técnicos.',
            nivel: 'critical',
          },
        ],
        icono: Lock,
      },
      {
        id: 'f2p3',
        numero: '2.3',
        titulo: 'Validación y Creación Automática de Tablas DDL',
        descripcion:
          'El CMS cuenta con un cliente Postgres que valida la conexión al iniciar y provisiona los esquemas de bases de datos necesarios de forma autónoma.',
        items: [
          'Al arrancar la aplicación de manera local con "npm run dev", el cliente en neonClient.ts intentará conectarse.',
          'Si la conexión es exitosa, se ejecuta la función initDatabase() que lee y ejecuta los scripts DDL.',
          'Se crean de forma automática las tablas de "casos" y "audit_logs" con sus relaciones correspondientes.',
          'El perito verá la luz de estado en el header de la aplicación como "En línea" (color verde).',
        ],
        codigo: [
          {
            lang: 'sql',
            contenido:
              '-- DDL principal ejecutado automáticamente por el cliente\nCREATE TABLE IF NOT EXISTS casos (\n  id VARCHAR(255) PRIMARY KEY,\n  numero_caso VARCHAR(100) UNIQUE NOT NULL,\n  titulo VARCHAR(255) NOT NULL,\n  descripcion TEXT,\n  estado VARCHAR(50) DEFAULT \'activo\',\n  prioridad VARCHAR(50) DEFAULT \'media\',\n  consignante JSONB,\n  evidencia JSONB,\n  steps JSONB DEFAULT \'{}\',\n  compliance_checklist JSONB DEFAULT \'[]\',\n  creado_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP\n);',
          },
        ],
        tags: [
          { label: 'DDL Automático', color: 'purple' },
          { label: 'Tablas SQL', color: 'green' },
        ],
        icono: Database,
      },
    ],
  },
  {
    id: 'f3',
    numero: 3,
    titulo: 'Despliegue en Vercel',
    subtitulo: 'Llevando la aplicación y la persistencia a producción',
    icono: Globe,
    color: 'text-[#FF9500]',
    glowColor: 'rgba(255,149,0,0.15)',
    pasos: [
      {
        id: 'f3p1',
        numero: '3.1',
        titulo: 'Subir Cambios al Repositorio Git',
        descripcion:
          'El despliegue de Vercel se activa mediante commits en tu rama principal de Git. Debemos asegurarnos de subir los cambios del código sin las variables de entorno.',
        items: [
          'Haz un commit de tu código local asegurándote de que los archivos modificados estén agregados.',
          'Haz un git push a tu repositorio remoto (GitHub, GitLab, etc.).',
          'Confirma en tu repositorio en la nube que el archivo .env NO haya sido subido (debe coincidir con la regla de gitignore).',
        ],
        codigo: [
          {
            lang: 'bash',
            contenido:
              '# Comprobar qué archivos se van a subir\ngit status\n\n# Confirmar cambios y empujar a rama principal\ngit add .\ngit commit -m "feat: integrar cliente Neon PostgreSQL"\ngit push origin main',
          },
        ],
        tags: [
          { label: 'Git Commit', color: 'cyan' },
          { label: 'Git Push', color: 'green' },
        ],
        icono: Globe,
      },
      {
        id: 'f3p2',
        numero: '3.2',
        titulo: 'Configuración de Variables de Entorno en Vercel',
        descripcion:
          'Vercel no lee el archivo .env de tu computadora. Debes registrar la variable de base de datos directamente en el panel web del proyecto en Vercel.',
        items: [
          'Inicia sesión en Vercel e importa el repositorio del proyecto.',
          'Antes de presionar "Deploy", expande la pestaña "Environment Variables".',
          'En el campo "Name", escribe exactamente: VITE_DATABASE_URL',
          'En el campo "Value", pega la cadena de conexión completa que copiaste de Neon en el paso 1.2.',
          'Haz clic en el botón "Add" para guardar la configuración.',
        ],
        tags: [
          { label: 'Vercel Config', color: 'purple' },
          { label: 'Env Variables', color: 'yellow' },
        ],
        icono: Lock,
      },
      {
        id: 'f3p3',
        numero: '3.3',
        titulo: 'Despliegue y Validación del Build',
        descripcion:
          'Con la variable de entorno configurada, Vercel compilará tu aplicación y la desplegará en sus servidores perimetrales globales.',
        items: [
          'Haz clic en el botón "Deploy".',
          'Espera a que termine el proceso de Build y Run.',
          'Al finalizar, accede al link de producción provisto por Vercel.',
          'Inicia sesión en el CMS y verifica en la barra superior que el indicador de la base de datos muestre "En línea" (verde), certificando el acceso a Neon.',
        ],
        tags: [
          { label: 'Build Success', color: 'green' },
        ],
        icono: Globe,
      },
    ],
  },
  {
    id: 'f4',
    numero: 4,
    titulo: 'Verificación y Seguridad',
    subtitulo: 'Mejores prácticas para la protección de la evidencia en la nube',
    icono: Shield,
    color: 'text-[#FF3B30]',
    glowColor: 'rgba(255,59,48,0.15)',
    pasos: [
      {
        id: 'f4p1',
        numero: '4.1',
        titulo: 'Seguridad en la Conexión de Datos',
        descripcion:
          'La integridad de las investigaciones criminalísticas exige que los canales de comunicación sean seguros y cifrados.',
        items: [
          'La cadena de conexión DEBE contener el parámetro sslmode=require para obligar a PostgreSQL a cifrar todo el tráfico de datos.',
          'El uso de SSL evita ataques de intermediario (Man-in-the-Middle) que intercepten el historial de auditorías o evidencias del caso.',
          'Utiliza contraseñas de alta seguridad generadas criptográficamente para el usuario administrador de Neon.',
        ],
        tags: [
          { label: 'SSL Encrypted', color: 'green' },
          { label: 'Security First', color: 'red' },
        ],
        icono: Shield,
      },
      {
        id: 'f4p2',
        numero: '4.2',
        titulo: 'Checklist de Seguridad en Producción',
        descripcion:
          'Antes de entregar el CMS para uso pericial corporativo, valide la lista de control de seguridad.',
        items: [
          '¿El archivo .env está excluido en el control de versiones? (SÍ / NO)',
          '¿Se configuró la cadena con puerto de Pooling (puerto 5432 / pooler) en Vercel? (SÍ / NO)',
          '¿El SSL está activado y verificado en la conexión? (SÍ / NO)',
          '¿El indicador del header de la app muestra "En línea" en la URL de Vercel? (SÍ / NO)',
        ],
        tags: [
          { label: 'Audit Checklist', color: 'purple' },
        ],
        icono: Scale,
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SUBCOMPONENTES
// ─────────────────────────────────────────────────────────────────────────────

function BadgeNormativa({ tag }: { tag: TagFase }) {
  const colors: Record<TagFase['color'], string> = {
    cyan:   'bg-[var(--co-blue)]/10 border-[var(--co-blue)]/25 text-[var(--co-blue)]',
    green:  'bg-[var(--co-green)]/10 border-[var(--co-green)]/25 text-[var(--co-green)]',
    yellow: 'bg-[var(--co-orange)]/10 border-[var(--co-orange)]/25 text-[var(--co-orange)]',
    red:    'bg-[var(--co-red)]/10 border-[var(--co-red)]/25 text-[var(--co-red)]',
    purple: 'bg-[var(--co-purple)]/10 border-[var(--co-purple)]/25 text-[var(--co-purple)]',
  };
  return (
    <span className={`inline-flex items-center text-[8px] font-bold uppercase tracking-[0.15em] px-2 py-0.5 rounded border ${colors[tag.color]}`}>
      {tag.label}
    </span>
  );
}

function AlertaForense({ adv }: { adv: Advertencia }) {
  const cfg = {
    critical: {
      wrapper: 'bg-[#FF3B30]/[0.06] border-[#FF3B30]/25',
      icon:    'text-[#FF3B30]',
      titulo:  'text-[#FF3B30]',
      cuerpo:  'text-[#1D1D1F]',
      Icon:    AlertTriangle,
    },
    warning: {
      wrapper: 'bg-[#FF9500]/[0.06] border-[#FF9500]/25',
      icon:    'text-[#FF9500]',
      titulo:  'text-[#FF9500]',
      cuerpo:  'text-[#1D1D1F]',
      Icon:    AlertTriangle,
    },
    info: {
      wrapper: 'bg-[var(--co-blue)]/[0.06] border-[var(--co-blue)]/25',
      icon:    'text-[var(--co-blue)]',
      titulo:  'text-[var(--co-blue)]',
      cuerpo:  'text-[var(--apple-text)]',
      Icon:    Info,
    },
  }[adv.nivel];

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border ${cfg.wrapper}`}>
      <cfg.Icon size={14} className={`${cfg.icon} shrink-0 mt-0.5`} />
      <div>
        <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${cfg.titulo}`}>
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
    powershell: 'text-[var(--co-blue)]/60',
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
      <pre className="overflow-x-auto px-4 py-4 bg-[#1D1D1F] text-[11px] leading-relaxed">
        <code className="text-[#e4e4e7] font-mono whitespace-pre">{contenido}</code>
      </pre>
    </div>
  );
}

function TarjetaPaso({
  paso,
  completado,
  onToggle,
}: {
  paso: Paso;
  completado: boolean;
  onToggle: (id: string) => void;
}) {
  const [expandido, setExpandido] = useState(false);
  const Icon = paso.icono;

  return (
    <div
      className={`rounded-xl border transition-all duration-300 overflow-hidden ${
        completado
          ? 'border-[#34C759]/20 bg-[#34C759]/[0.03]'
          : expandido
          ? 'border-black/10 bg-white shadow-sm'
          : 'border-black/[0.06] bg-white hover:border-black/10'
      }`}
    >
      <button
        className="w-full flex items-center gap-4 px-5 py-4 text-left group"
        onClick={() => setExpandido(v => !v)}
      >
        <span className="text-[10px] font-bold text-[#86868B] font-mono shrink-0 w-8 tabular-nums">
          {paso.numero}
        </span>
        <div className={`p-2 rounded-lg shrink-0 transition-all ${
          completado ? 'bg-[#34C759]/10' : 'bg-black/[0.04] group-hover:bg-black/[0.06]'
        }`}>
          <Icon size={14} className={completado ? 'text-[#34C759]' : 'text-black/40'} />
        </div>
        <span className={`flex-1 text-[11px] font-bold uppercase tracking-wide ${
          completado ? 'text-[#34C759]' : 'text-[#1D1D1F]/70 group-hover:text-[#1D1D1F]/90'
        }`}>
          {paso.titulo}
        </span>
        {!expandido && paso.tags && (
          <div className="hidden sm:flex items-center gap-1.5 flex-wrap">
            {paso.tags.slice(0, 2).map(n => (
              <BadgeNormativa key={n.label} tag={n} />
            ))}
          </div>
        )}
        {expandido
          ? <ChevronUp size={14} className="text-black/35 shrink-0" />
          : <ChevronDown size={14} className="text-black/20 shrink-0" />}
      </button>

      {expandido && (
        <div className="px-5 pb-5 space-y-5 animate-fade-in">
          <p className="text-[11px] text-[#1D1D1F]/60 leading-relaxed border-l-2 border-black/15 pl-4">
            {paso.descripcion}
          </p>

          {paso.items && (
            <ul className="space-y-2">
              {paso.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[11px] text-[#1D1D1F]/70 leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-black/[0.04] border border-black/[0.06] flex items-center justify-center shrink-0 mt-0.5 text-[8px] font-bold text-[#86868B] tabular-nums">
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          )}

          {paso.codigo?.map((c, i) => (
            <BloqueCode key={i} lang={c.lang} contenido={c.contenido} />
          ))}

          {paso.tags && (
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="text-[9px] font-bold text-black/30 uppercase tracking-widest mr-1">
                Etiquetas:
              </span>
              {paso.tags.map(n => (
                <BadgeNormativa key={n.label} tag={n} />
              ))}
            </div>
          )}

          {paso.advertencias?.map((adv, i) => (
            <AlertaForense key={i} adv={adv} />
          ))}

          <div className="pt-2 border-t border-black/5 flex justify-end">
            <button
              onClick={e => { e.stopPropagation(); onToggle(paso.id); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
                completado
                  ? 'bg-[#34C759]/10 border border-[#34C759]/20 text-[#34C759] hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-500'
                  : 'bg-black/[0.04] border border-black/[0.08] text-black/60 hover:bg-[#34C759]/10 hover:border-[#34C759]/20 hover:text-[#34C759]'
              }`}
            >
              {completado
                ? <><CheckCircle2 size={12} /> Completado — Desmarcar</>
                : <><Circle size={12} /> Marcar como completado</>}
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
  const Icon = fase.icono;
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 group transition-all duration-200 min-w-0 flex-1"
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 shrink-0 ${
          completada
            ? 'border-[#34C759] bg-[#34C759]/10 shadow-sm'
            : activa
            ? `border-current ${fase.color} bg-white shadow-sm`
            : 'border-black/10 bg-black/[0.03]'
        }`}
      >
        {completada
          ? <CheckCircle2 size={16} className="text-[#34C759]" />
          : <Icon size={16} className={activa ? fase.color : 'text-[#86868B]'} />}
      </div>
      <div className="text-center px-1">
        <p className={`text-[8px] font-bold uppercase tracking-[0.15em] ${
          completada ? 'text-[#34C759]' : activa ? fase.color : 'text-[#86868B]'
        }`}>
          F{fase.numero}
        </p>
        <p className={`text-[9px] font-bold leading-tight hidden sm:block ${
          completada ? 'text-[#1D1D1F]/60' : activa ? 'text-[#1D1D1F]/80' : 'text-[#86868B]'
        }`}>
          {fase.titulo.split(' ').slice(0, 2).join(' ')}
        </p>
      </div>
      <div className="w-full h-0.5 bg-black/[0.05] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            completada ? 'bg-[#34C759]' : activa ? 'bg-current' : 'bg-transparent'
          }`}
          style={{
            width: `${progreso}%`,
            background: completada ? undefined : activa
              ? fase.color.includes('co-accent') || fase.color.includes('cyan') ? 'var(--co-accent)'
              : fase.color.includes('co-green') || fase.color.includes('green') ? 'var(--co-green)'
              : fase.color.includes('co-blue') || fase.color.includes('blue') ? 'var(--co-blue)'
              : fase.color.includes('co-orange') || fase.color.includes('orange') ? 'var(--co-orange)'
              : fase.color.includes('co-yellow') || fase.color.includes('yellow') ? 'var(--co-yellow)'
              : 'var(--co-red)'
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
export default function ManualServerlessPage() {
  const [fasActiva, setFaseActiva] = useState<string>('f0');
  const [completados, setCompletados] = useState<Set<string>>(new Set());

  // Recuperar progreso
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const realStepIds = new Set(FASES.flatMap(f => f.pasos.map(p => p.id)));
        const loadedArray = Array.isArray(parsed) ? parsed : [];
        const isValid = loadedArray.every(id => realStepIds.has(id));

        if (!Array.isArray(parsed) || !isValid) {
          console.info('[ManualServerless] Schema de progreso desactualizado o corrupto — reiniciando progreso');
          localStorage.removeItem(LS_KEY);
          setCompletados(new Set());
        } else {
          setCompletados(new Set(loadedArray));
        }
      }
    } catch {
      localStorage.removeItem(LS_KEY);
    }
  }, []);

  const toggleCompletado = useCallback((pasoId: string) => {
    setCompletados(prev => {
      const next = new Set(prev);
      if (next.has(pasoId)) next.delete(pasoId);
      else next.add(pasoId);
      try { localStorage.setItem(LS_KEY, JSON.stringify([...next])); } catch {}
      return next;
    });
  }, []);

  const resetearProgreso = useCallback(() => {
    if (!window.confirm('¿Reiniciar todo el progreso de este manual?')) return;
    setCompletados(new Set());
    try { localStorage.removeItem(LS_KEY); } catch {}
  }, []);

  // Progresos
  const totalPasos = FASES.reduce((s, f) => s + f.pasos.length, 0);
  const totalCompletados = FASES.reduce(
    (s, f) => s + f.pasos.filter(p => completados.has(p.id)).length,
    0
  );
  const pctGlobal = Math.round((totalCompletados / totalPasos) * 100);

  const progresoPorFase = (f: Fase) => {
    const c = f.pasos.filter(p => completados.has(p.id)).length;
    return Math.round((c / f.pasos.length) * 100);
  };
  const faseCompletada = (f: Fase) => progresoPorFase(f) === 100;

  const faseActual = FASES.find(f => f.id === fasActiva) ?? FASES[0];

  return (
    <div className="space-y-6 pb-20 animate-fade-in text-[#1D1D1F]">
      
      {/* Cabecera */}
      <div className="apple-card overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#007AFF]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#007AFF]/[0.02] to-transparent pointer-events-none" />

        <div className="p-6 sm:p-8 relative">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#007AFF]/10 rounded-[6px] border border-[#007AFF]/20">
                <Database size={26} className="text-[#007AFF]" strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#1D1D1F] uppercase tracking-tight">
                  Manual de Conexión Neon Serverless & Vercel
                </h1>
                <p className="text-xs text-[#86868B] font-bold uppercase tracking-[0.15em] mt-1">
                  Guía paso a paso para la configuración del almacenamiento en la nube y el despliegue del CMS
                </p>
                <p className="text-[11px] text-[#6E6E73] leading-relaxed mt-2 max-w-2xl">
                  Aprende a configurar tu base de datos relacional PostgreSQL serverless en Neon para habilitar la persistencia de datos en producción sobre Vercel, manteniendo el esquema de sincronización bidireccional y resguardo local Offline-First mediante IndexedDB.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {[
                    'Neon Serverless', 'PostgreSQL v16', 'Vercel Deploy', 'Offline-First', 'Security & SSL'
                  ].map(tag => (
                    <span
                      key={tag}
                      className="text-[8px] px-2 py-0.5 rounded bg-[#007AFF]/5 border border-[#007AFF]/15 text-[#007AFF] font-bold uppercase tracking-wider"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-2 text-[9px] font-bold text-[#34C759] bg-[#34C759]/10 border border-[#34C759]/20 px-3 py-1.5 rounded-full">
              <Zap size={10} className="animate-pulse" />
              CONEXIÓN ACTIVA
            </div>
          </div>

          {/* Progreso global */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-bold text-[#86868B] uppercase tracking-widest">
                Progreso de la Configuración
              </span>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-[#6E6E73] tabular-nums">
                  {totalCompletados}/{totalPasos} pasos
                </span>
                <span className={`text-sm font-bold tabular-nums ${
                  pctGlobal === 100 ? 'text-[#34C759]' : pctGlobal > 0 ? 'text-[#007AFF]' : 'text-[#86868B]'
                }`}>
                  {pctGlobal}%
                </span>
                {totalCompletados > 0 && (
                  <button
                    onClick={resetearProgreso}
                    className="flex items-center gap-1 text-[8px] font-bold text-[#86868B] hover:text-[#FF3B30] uppercase tracking-wider transition-colors"
                    title="Reiniciar progreso"
                  >
                    <RotateCcw size={10} />
                  </button>
                )}
              </div>
            </div>
            <div className="h-2 w-full bg-black/[0.05] rounded-full overflow-hidden border border-black/[0.02]">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${pctGlobal}%`,
                  background: pctGlobal === 100
                    ? 'linear-gradient(90deg, var(--co-green), #30D158)'
                    : 'linear-gradient(90deg, var(--co-accent), var(--co-blue))',
                  boxShadow: pctGlobal > 0
                    ? pctGlobal === 100
                      ? '0 0 8px rgba(48,209,88,0.2)'
                      : '0 0 8px rgba(10,132,255,0.15)'
                    : 'none',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="apple-card p-4 sm:p-5">
        <div className="flex items-center gap-2 sm:gap-3">
          {FASES.map((fase, idx) => (
            <div key={fase.id} className="flex items-center flex-1 min-w-0">
              <StepperFase
                fase={fase}
                activa={fasActiva === fase.id}
                completada={faseCompletada(fase)}
                progreso={progresoPorFase(fase)}
                onClick={() => setFaseActiva(fase.id)}
              />
              {idx < FASES.length - 1 && (
                <div className={`hidden sm:block h-px flex-1 mx-1 ${
                  faseCompletada(fase) ? 'bg-[#34C759]/30' : 'bg-black/[0.06]'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Fase activa */}
      <div className="animate-fade-in" key={fasActiva}>
        <div className="apple-card p-5 sm:p-6 mb-4 relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at top left, ${faseActual.glowColor}, transparent 60%)` }}
          />
          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-[6px] bg-black/[0.03] border border-black/[0.06] shrink-0">
                {(() => { const Icon = faseActual.icono; return <Icon size={22} className={faseActual.color} />; })()}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className={`text-[9px] font-bold uppercase tracking-[0.2em] ${faseActual.color}`}>
                    Fase {faseActual.numero}
                  </span>
                  <span className={`text-[8px] font-bold px-2 py-0.5 rounded border ${
                    faseCompletada(faseActual)
                      ? 'border-[#34C759]/25 bg-[#34C759]/10 text-[#34C759]'
                      : 'border-black/[0.07] bg-black/[0.02] text-[#86868B]'
                  } uppercase tracking-wider`}>
                    {faseCompletada(faseActual)
                      ? '✓ Completada'
                      : `${progresoPorFase(faseActual)}% completado`}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-[#1D1D1F] uppercase tracking-tight">
                  {faseActual.titulo}
                </h2>
                <p className="text-[10px] text-[#6E6E73] font-medium mt-1">{faseActual.subtitulo}</p>
              </div>
            </div>
            <div className="shrink-0 flex gap-2">
              <button
                onClick={() => {
                  const idx = FASES.findIndex(f => f.id === fasActiva);
                  if (idx > 0) setFaseActiva(FASES[idx - 1].id);
                }}
                disabled={fasActiva === 'f0'}
                className="text-[9px] font-bold px-3 py-2 rounded-lg border border-black/[0.08] bg-black/[0.02] text-[#86868B] hover:text-[#1D1D1F] hover:bg-black/[0.05] transition-all disabled:opacity-20 disabled:cursor-not-allowed uppercase tracking-wider"
              >
                ← Anterior
              </button>
              <button
                onClick={() => {
                  const idx = FASES.findIndex(f => f.id === fasActiva);
                  if (idx < FASES.length - 1) setFaseActiva(FASES[idx + 1].id);
                }}
                disabled={fasActiva === 'f4'}
                className="text-[9px] font-bold px-3 py-2 rounded-lg border border-black/[0.08] bg-black/[0.02] text-[#86868B] hover:text-[#1D1D1F] hover:bg-black/[0.05] transition-all disabled:opacity-20 disabled:cursor-not-allowed uppercase tracking-wider"
              >
                Siguiente →
              </button>
            </div>
          </div>
        </div>

        {/* Pasos */}
        <div className="space-y-3">
          {faseActual.pasos.map(paso => (
            <TarjetaPaso
              key={paso.id}
              paso={paso}
              completado={completados.has(paso.id)}
              onToggle={toggleCompletado}
            />
          ))}
        </div>

        {/* CTA Siguiente Fase */}
        {faseCompletada(faseActual) && fasActiva !== 'f4' && (
          <div className="mt-5 p-5 rounded-xl border border-[#34C759]/20 bg-[#34C759]/[0.03] flex items-center justify-between gap-4 animate-fade-in">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={20} className="text-[#34C759] shrink-0" />
              <div>
                <p className="text-sm font-bold text-[#34C759] uppercase tracking-wide">
                  Fase {faseActual.numero} completada
                </p>
                <p className="text-[10px] text-[#34C759]/80">
                  Continúe con el siguiente paso de configuración.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                const idx = FASES.findIndex(f => f.id === fasActiva);
                if (idx < FASES.length - 1) setFaseActiva(FASES[idx + 1].id);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#34C759]/10 border border-[#34C759]/30 text-[#34C759] text-[10px] font-bold uppercase tracking-wider hover:bg-[#34C759]/20 transition-all shrink-0"
            >
              Siguiente fase <Zap size={12} />
            </button>
          </div>
        )}

        {/* Mensaje final */}
        {fasActiva === 'f4' && faseCompletada(faseActual) && (
          <div className="mt-5 p-6 rounded-xl border border-[#0071E3]/20 bg-[#0071E3]/[0.02] text-center animate-fade-in relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0071E3]/[0.02] to-transparent pointer-events-none" />
            <div className="relative">
              <CheckCircle2 size={40} className="text-[#34C759] mx-auto mb-3" />
              <h3 className="text-base font-bold text-[#1D1D1F] uppercase tracking-tight mb-2">
                Configuración del Servidor Completada
              </h3>
              <p className="text-[11px] text-[#6E6E73] leading-relaxed max-w-2xl mx-auto mb-4">
                Ha completado exitosamente la vinculación de su base de datos PostgreSQL de Neon Serverless y el despliegue del CMS en la nube de Vercel bajo condiciones de SSL y protección de variables de entorno.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Neon Cloud ✓', 'SSL Active ✓', 'Vercel Env ✓', 'DDL Synced ✓'].map(t => (
                  <span key={t} className="text-[9px] px-3 py-1 rounded-full bg-[#34C759]/10 border border-[#34C759]/20 text-[#34C759] font-bold uppercase tracking-wider">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Referencias */}
      <div className="apple-card p-5 rounded-xl border border-black/5 mt-8 relative overflow-hidden bg-white">
        <div className="absolute top-0 right-0 opacity-[0.02] pointer-events-none">
          <Scale size={120} className="text-black" />
        </div>
        <div className="flex items-start gap-4 relative">
          <div className="p-3 bg-black/[0.02] rounded-[6px] border border-black/[0.06] shrink-0">
            <BookOpen size={18} className="text-black/30" />
          </div>
          <div>
            <h4 className="font-bold text-[#86868B] text-[10px] uppercase tracking-[0.2em] mb-2">
              Referencias y Documentación del Proyecto
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: 'Neon Serverless', color: 'purple' as const },
                { label: 'Vercel Build Environment', color: 'purple' as const },
                { label: 'PostgreSQL 16 Client', color: 'cyan' as const },
                { label: 'IndexedDB Storage', color: 'green' as const },
                { label: 'Offline-First Client', color: 'cyan' as const },
                { label: 'SHA-256 Crypto', color: 'yellow' as const },
              ].map(tag => (
                <BadgeNormativa key={tag.label} tag={tag} />
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
