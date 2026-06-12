import { Database, ShieldAlert, Key, Globe, Terminal, CheckCircle2 } from '../../components/atoms/AppleIcon';

export default function ManualServerlessPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white mb-1 flex items-center gap-3">
          <Database className="text-cms-accent" size={24} />
          Manual de Conexión Neon Serverless & Vercel
        </h1>
        <p className="text-sm text-cms-textMuted">
          Guía paso a paso para la configuración del almacenamiento en la nube y el despliegue del CMS
        </p>
      </div>

      {/* Introducción */}
      <div className="cms-card p-6">
        <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <ShieldAlert className="text-cms-accent" size={18} />
          Arquitectura de Datos Offline-First
        </h2>
        <p className="text-xs text-cms-textMuted leading-relaxed">
          El sistema está diseñado con un esquema **Offline-First**. Esto significa que si no se proporciona
          una variable de conexión válida para la base de datos PostgreSQL, la aplicación seguirá funcionando sin problemas
          guardando la información de manera local en el navegador del perito (utilizando LocalStorage / IndexedDB). 
          Al configurar la base de datos Neon Serverless en la nube, los datos se sincronizan remotamente de forma bidireccional.
        </p>
      </div>

      {/* Paso 1: Configurar Neon Serverless */}
      <div className="cms-card p-6">
        <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <Key className="text-cms-accent" size={18} />
          Paso 1: Obtener Credenciales en Neon
        </h2>
        <ol className="list-decimal pl-5 text-xs text-cms-textMuted space-y-3">
          <li>
            Inicia sesión o regístrate en <a href="https://console.neon.tech" target="_blank" rel="noopener noreferrer" className="text-cms-accent hover:underline font-semibold">Neon Console</a>.
          </li>
          <li>
            Crea un nuevo proyecto, selecciona la región de tu preferencia (ej. US East N. Virginia) y la versión de PostgreSQL (recomendado v16).
          </li>
          <li>
            En la pantalla del Dashboard de Neon, copia la cadena de conexión en la sección **Connection Details**.
          </li>
          <li>
            Asegúrate de que el modo de conexión esté configurado como **Pooled** (para usar el pooler de conexiones en serverless) y que la URL empiece por <code className="font-mono text-cms-accent bg-white/5 px-1 py-0.5 rounded">postgresql://</code>.
          </li>
        </ol>
      </div>

      {/* Paso 2: Configuración Local */}
      <div className="cms-card p-6">
        <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <Terminal className="text-cms-accent" size={18} />
          Paso 2: Configurar los Archivos Locales
        </h2>
        <div className="space-y-4 text-xs text-cms-textMuted">
          <p className="font-sans">
            Para habilitar el acceso a la base de datos Neon Serverless de forma local en tu entorno de desarrollo, edita el archivo de entorno:
          </p>
          
          <div className="space-y-2">
            <p className="font-bold text-white">1. Crear el archivo de entorno local:</p>
            <p className="pl-4">
              Copia el archivo de plantilla <a href="file:///c:/Users/jull/Documents/sha256.deb/.env.example" className="text-cms-accent hover:underline">.env.example</a> y renombralo como <code className="font-mono text-cms-accent bg-white/5 px-1 py-0.5 rounded">.env</code> en la raíz del proyecto.
            </p>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-white">2. Definir la cadena de conexión:</p>
            <p className="pl-4">
              Edita el archivo <code className="font-mono text-cms-accent bg-white/5 px-1 py-0.5 rounded">.env</code> e introduce la URL obtenida de Neon en la variable correspondiente:
            </p>
            <pre className="bg-[#1e1e1e] p-3 rounded border border-white/5 font-mono text-cyan-400 overflow-x-auto text-[11px]">
{`# SHA256.US — Variables de Entorno
# Reemplazar con tus credenciales de Neon Serverless
VITE_DATABASE_URL=postgresql://usuario:contraseña@ep-xxx-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require`}
            </pre>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-white">3. Validación y lectura del archivo:</p>
            <p className="pl-4">
              El archivo <a href="file:///c:/Users/jull/Documents/sha256.deb/src/db/neonClient.ts" className="text-cms-accent hover:underline">neonClient.ts</a> cargará esta variable mediante Vite usando:
            </p>
            <pre className="bg-[#1e1e1e] p-3 rounded border border-white/5 font-mono text-cyan-400 overflow-x-auto text-[11px]">
{`const DATABASE_URL: string = import.meta.env.VITE_DATABASE_URL || '';`}
            </pre>
            <p className="pl-4 text-yellow-500/80 italic">
              Nota: Al iniciar el servidor local, la función <code className="font-mono">initDatabase()</code> verificará la conectividad y ejecutará los DDL para crear las tablas 'casos' y 'audit_logs' automáticamente si no existen en la base de datos remota.
            </p>
          </div>
        </div>
      </div>

      {/* Paso 3: Configurar en Vercel */}
      <div className="cms-card p-6">
        <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <Globe className="text-cms-accent" size={18} />
          Paso 3: Despliegue y Configuración en Vercel
        </h2>
        <div className="space-y-3 text-xs text-cms-textMuted">
          <p>
            Una vez validada la conexión local, sigue estos pasos para desplegar a Vercel con persistencia de base de datos activa:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Sube los cambios de tu código al repositorio en GitHub (el archivo <code className="font-mono">.env</code> está en el <code className="font-mono">.gitignore</code> y no se subirá, manteniendo a salvo tus credenciales).
            </li>
            <li>
              Crea un nuevo proyecto en tu cuenta de **Vercel** e impórtalo desde GitHub.
            </li>
            <li>
              Antes de hacer click en **Deploy**, despliega la sección **Environment Variables** en el panel de Vercel.
            </li>
            <li>
              Añade una variable con el nombre <code className="font-mono text-white">VITE_DATABASE_URL</code>.
            </li>
            <li>
              En el campo de valor, pega la cadena de conexión completa de Neon Serverless (la misma que colocaste localmente).
            </li>
            <li>
              Presiona **Add** y luego haz click en **Deploy**. ¡Listo! Vercel compilará y servirá la aplicación, conectándose automáticamente a tu instancia de base de datos serverless de Neon en la nube.
            </li>
          </ul>
        </div>
      </div>

      {/* Checklist de Validación */}
      <div className="cms-card p-6 border-green-500/20 bg-green-500/5">
        <h2 className="text-lg font-bold text-green-400 mb-3 flex items-center gap-2">
          <CheckCircle2 size={18} />
          Comprobaciones de Seguridad e Integridad
        </h2>
        <ul className="space-y-2 text-xs text-cms-textMuted">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            El archivo <code className="font-mono text-white">.env</code> local **NUNCA** debe ser commiteado al control de versiones.
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            La variable tiene el prefijo <code className="font-mono text-white">VITE_</code> para que el compilador de Vite la exponga en el cliente web.
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            La base de datos de Neon es Serverless, por lo que entrará en reposo tras periodos de inactividad, optimizando costos a cero.
          </li>
        </ul>
      </div>
    </div>
  );
}
