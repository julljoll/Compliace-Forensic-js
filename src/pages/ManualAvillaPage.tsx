import { BookOpen, Smartphone, Mic, Image as ImageIcon, ShieldCheck, CheckCircle2, AlertTriangle, ChevronRight } from 'lucide-react';
import { useCMSStore } from '../../store/cmsStore';

export default function ManualAvillaPage() {
  return (
    <div className="space-y-8 pb-12">
      {/* ── Encabezado ─────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-black text-white mb-2 flex items-center gap-3">
          <BookOpen className="text-cms-accent" size={28} />
          Manual de Uso: Avilla Forensics
        </h1>
        <p className="text-sm text-cms-textMuted max-w-3xl leading-relaxed">
          Guía operativa para la extracción de datos en dispositivos Android, enfocada en audios de WhatsApp, 
          imágenes y la validación de integridad mediante el sistema de hashes nativo de la herramienta.
        </p>
      </div>

      {/* ── Resumen de la Herramienta ──────────────────── */}
      <div className="cms-card p-6 border-l-4 border-l-cms-accent bg-cms-surface/50">
        <h2 className="text-lg font-bold text-white mb-3">Sobre Avilla Forensics</h2>
        <p className="text-sm text-cms-textMuted leading-relaxed mb-4">
          Avilla Forensics es una herramienta gratuita de extracción lógica de datos móviles desarrollada para entornos Windows. 
          Destaca por su capacidad para extraer datos de aplicaciones mediante el método de <strong>APK Downgrade</strong>, 
          evitando la necesidad de tener acceso <em>Root</em> en el dispositivo.
        </p>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-2 py-1 bg-cms-bg rounded border border-cms-border text-cms-textMuted">VERSIÓN FREE</span>
          <span className="text-[10px] font-bold px-2 py-1 bg-cms-bg rounded border border-cms-border text-cms-textMuted">ANDROID 14 SOPORTADO</span>
          <a href="https://github.com/AvillaDaniel/AvillaForensics" target="_blank" rel="noreferrer" className="text-[10px] text-cms-accent hover:underline ml-2">
            Repositorio Oficial →
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Extracción General Android ─────────────────── */}
        <div className="cms-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <Smartphone size={20} />
            </div>
            <h2 className="font-bold text-white text-base">Extracción de Dispositivo Android</h2>
          </div>
          
          <div className="space-y-4">
            <div className="relative pl-6">
              <div className="absolute left-2 top-1.5 w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              <div className="absolute left-[11px] top-4 w-px h-full bg-cms-border"></div>
              <h3 className="text-xs font-bold text-white mb-1">1. Preparación del Dispositivo</h3>
              <p className="text-[11px] text-cms-textMuted leading-relaxed">
                Active las "Opciones de Desarrollador" y habilite la <strong>Depuración USB (USB Debugging)</strong>.
                Conecte el dispositivo mediante cable y autorice la conexión RSA en la pantalla.
              </p>
            </div>
            
            <div className="relative pl-6">
              <div className="absolute left-2 top-1.5 w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              <div className="absolute left-[11px] top-4 w-px h-full bg-cms-border"></div>
              <h3 className="text-xs font-bold text-white mb-1">2. Módulo de Extracción Avilla</h3>
              <p className="text-[11px] text-cms-textMuted leading-relaxed">
                Abra Avilla Forensics y seleccione el módulo de <strong>Avilla App Full Extraction</strong> (NUEVO) o 
                <strong>Backup ADB</strong>. Elija la ruta de destino para guardar la evidencia (evite el Escritorio).
              </p>
            </div>
            
            <div className="relative pl-6">
              <div className="absolute left-2 top-1.5 w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              <h3 className="text-xs font-bold text-white mb-1">3. Ejecución de la Colecta</h3>
              <p className="text-[11px] text-cms-textMuted leading-relaxed">
                Inicie la adquisición. La herramienta extraerá los datos en la ruta asignada y generará automáticamente 
                los registros de integridad (.avilla).
              </p>
            </div>
          </div>
        </div>

        {/* ── Extracción WhatsApp (Audios) ───────────────── */}
        <div className="cms-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
              <Mic size={20} />
            </div>
            <h2 className="font-bold text-white text-base">Audios y Notas de Voz (WhatsApp)</h2>
          </div>
          
          <div className="space-y-4">
            <div className="relative pl-6">
              <div className="absolute left-2 top-1.5 w-1.5 h-1.5 rounded-full bg-green-500"></div>
              <div className="absolute left-[11px] top-4 w-px h-full bg-cms-border"></div>
              <h3 className="text-xs font-bold text-white mb-1">1. APK Downgrade (Si es necesario)</h3>
              <p className="text-[11px] text-cms-textMuted leading-relaxed">
                Para extraer bases de datos sin Root, acceda al módulo <strong>APK Downgrade</strong> y seleccione "WhatsApp".
                El sistema instalará una versión heredada para habilitar el backup por ADB.
              </p>
            </div>
            
            <div className="relative pl-6">
              <div className="absolute left-2 top-1.5 w-1.5 h-1.5 rounded-full bg-green-500"></div>
              <div className="absolute left-[11px] top-4 w-px h-full bg-cms-border"></div>
              <h3 className="text-xs font-bold text-white mb-1">2. Localización de Archivos .opus</h3>
              <p className="text-[11px] text-cms-textMuted leading-relaxed">
                Los audios se extraerán de <code>\com.whatsapp\Media\WhatsApp Voice Notes</code>. 
                Avilla Forensics extraerá estos archivos cifrados o en texto claro según el estado de la base de datos.
              </p>
            </div>

            <div className="relative pl-6">
              <div className="absolute left-2 top-1.5 w-1.5 h-1.5 rounded-full bg-green-500"></div>
              <h3 className="text-xs font-bold text-white mb-1">3. Transcripción Integrada</h3>
              <p className="text-[11px] text-cms-textMuted leading-relaxed">
                Utilice el módulo <strong>FormOpus.cs</strong> para realizar transcripciones masivas automáticas de audios.
                Genera un informe HTML que vincula el texto transcrito con el hash y el chat original.
              </p>
            </div>
          </div>
        </div>

        {/* ── Extracción de Fotos ────────────────────────── */}
        <div className="cms-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
              <ImageIcon size={20} />
            </div>
            <h2 className="font-bold text-white text-base">Extracción de Imágenes (Fotos)</h2>
          </div>
          
          <div className="space-y-4">
            <div className="relative pl-6">
              <div className="absolute left-2 top-1.5 w-1.5 h-1.5 rounded-full bg-purple-500"></div>
              <div className="absolute left-[11px] top-4 w-px h-full bg-cms-border"></div>
              <h3 className="text-xs font-bold text-white mb-1">1. Fast Scan y Copia General</h3>
              <p className="text-[11px] text-cms-textMuted leading-relaxed">
                Utilice el módulo <strong>Fast Scan</strong> o <strong>FormCopyAll.cs</strong> para escanear y transferir
                rápidamente archivos de extensión gráfica (.jpg, .png, .webp, .heic).
              </p>
            </div>
            
            <div className="relative pl-6">
              <div className="absolute left-2 top-1.5 w-1.5 h-1.5 rounded-full bg-purple-500"></div>
              <h3 className="text-xs font-bold text-white mb-1">2. Image Finder y Geolocalización</h3>
              <p className="text-[11px] text-cms-textMuted leading-relaxed">
                El módulo <strong>Image Finder</strong> no solo recupera las imágenes, sino que extrae la metadata EXIF y 
                su geolocalización, permitiendo trazar automáticamente puntos de interés en Google Earth (.kml).
              </p>
            </div>
          </div>
        </div>

        {/* ── Validación y Autenticidad (MUY IMPORTANTE) ── */}
        <div className="cms-card p-6 border border-cms-accent/30 bg-cms-accent/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-cms-accent/20 rounded-lg text-cms-accent">
              <ShieldCheck size={20} />
            </div>
            <h2 className="font-bold text-white text-base">Validación de Autenticidad</h2>
          </div>
          
          <p className="text-xs text-cms-textMuted leading-relaxed mb-4">
            Avilla Forensics incorpora un sólido sistema de cadena de custodia digital que garantiza la inalterabilidad de la prueba conforme a normativas internacionales.
          </p>

          <div className="bg-cms-bg border border-cms-border rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 size={16} className="text-green-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">Cálculo Automático de Hashes</h4>
                <p className="text-[11px] text-cms-textMuted mt-0.5">Calcula firmas SHA-256, SHA-1 y MD5 para todas las imágenes, audios y bases de datos extraídas.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 size={16} className="text-green-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">Registros Cifrados (.avilla)</h4>
                <p className="text-[11px] text-cms-textMuted mt-0.5">La herramienta genera un log de extracción con extensión <code>.avilla</code>. Este archivo se encuentra cifrado en <strong>AES-256</strong>.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 size={16} className="text-green-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">Firma HMAC (Doble Capa)</h4>
                <p className="text-[11px] text-cms-textMuted mt-0.5">El archivo .avilla cuenta además con una firma HMAC, lo que permite detectar cualquier modificación post-adquisición, garantizando integridad y cadena de custodia técnica.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Precauciones ───────────────────────────────── */}
      <div className="cms-card p-5 bg-yellow-500/5 border-yellow-500/20">
        <h3 className="font-bold text-white text-sm flex items-center gap-2 mb-2">
          <AlertTriangle size={16} className="text-yellow-500" />
          Precauciones Metodológicas
        </h3>
        <ul className="list-disc pl-5 space-y-1 text-xs text-cms-textMuted">
          <li><strong>Evite guardar adquisiciones en el Escritorio:</strong> Para prevenir fallos de permisos en Windows, siempre exporte a un disco secundario o carpeta raíz como <code>C:\CasosForenses\</code>.</li>
          <li><strong>Modo Avión Opcional:</strong> Avilla funciona tanto en modo avión como conectado, pero el aislamiento de la red previene alteraciones o borrados remotos (Wipe).</li>
          <li><strong>Descifrado de bases Crypt14/15:</strong> Si las copias de seguridad locales de WhatsApp están cifradas, Avilla utiliza sus scripts Python integrados para forzar el descifrado utilizando la clave extraída en el downgrade.</li>
        </ul>
      </div>

    </div>
  );
}
