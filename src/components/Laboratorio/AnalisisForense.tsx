import { useState, useId } from 'react';
import { Link } from 'react-router-dom';
import { useForenseStore, type Adquisicion } from '../../store/forenseStore';
import { Microscope, Save, Activity, FileJson, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AnalisisForense() {
  const { adquisicionAndriller, adquisicionAleapp: storeAnalisis, setAdquisicionAleapp, markCmsStepComplete } = useForenseStore();
  const [isSaved, setIsSaved] = useState(false);
  const idBase = useId();
  
  const [analisis, setAnalisisLocal] = useState<Adquisicion>({
    herramienta: 'aleapp',
    versionHerramienta: storeAnalisis?.versionHerramienta || '2.1.0',
    tipoExtraccion: storeAnalisis?.tipoExtraccion || 'analisis',
    rutaImagenOrigen: storeAnalisis?.rutaImagenOrigen || adquisicionAndriller?.rutaSalida || '',
    rutaSalida: storeAnalisis?.rutaSalida || '',
    hashOrigenSHA256: storeAnalisis?.hashOrigenSHA256 || '',
    hashCopiaSHA256: storeAnalisis?.hashCopiaSHA256 || '',
    hashesCoinciden: storeAnalisis?.hashesCoinciden || false,
    logEjecucion: storeAnalisis?.logEjecucion || '',
    pidProceso: 0,
  });

  const handleGuardar = () => {
    setAdquisicionAleapp(analisis);
    markCmsStepComplete(4);
    markCmsStepComplete(5);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  if (!adquisicionAndriller) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-6 animate-fade-in">
        <div className="w-20 h-20 bg-fluent-surface border border-fluent-border rounded-3xl flex items-center justify-center mx-auto text-white/20">
          <Microscope size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">No hay adquisición disponible</h2>
          <p className="text-white/40 max-w-sm mx-auto">Para realizar un análisis de artefactos, primero debe completar la fase de Adquisición Forense.</p>
        </div>
        <Link to="/adquisicion" className="forensic-btn forensic-btn-primary inline-flex items-center gap-2 px-8">
          Ir a Adquisición <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Summary Context */}
      <div className="forensic-card p-6 bg-fluent-accent/5 border-fluent-accent/20 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-fluent-accent/20 rounded-xl text-fluent-accent">
            <Activity size={24} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-fluent-accent-light uppercase tracking-widest mb-1">Imagen forense detectada</h3>
            <p className="text-xs font-mono text-white max-w-xs truncate">{adquisicionAndriller.rutaSalida}</p>
          </div>
        </div>
        <div className="flex gap-8">
          <div className="flex items-center gap-2 text-green-400 text-[10px] font-bold uppercase">
            <CheckCircle2 size={14} /> Hash Validado
          </div>
        </div>
      </div>

      <div className="forensic-card p-8 space-y-10">
        <div className="flex items-center justify-between border-b border-fluent-border pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-fluent-accent/10 rounded-xl text-fluent-accent">
              <Microscope size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Procesamiento con ALEAPP</h2>
              <p className="text-xs text-white/40 uppercase tracking-widest font-semibold mt-1">Análisis Técnico de Artefactos</p>
            </div>
          </div>
          {isSaved && (
            <div className="flex items-center gap-2 text-green-400 text-xs font-bold animate-in fade-in zoom-in duration-300">
              <CheckCircle2 size={16} /> Resultados Guardados
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-1.5">
            <label htmlFor={`${idBase}-version`} className="forensic-label">Versión de ALEAPP</label>
            <input 
              id={`${idBase}-version`}
              type="text" 
              value={analisis.versionHerramienta} 
              onChange={(e) => setAnalisisLocal({ ...analisis, versionHerramienta: e.target.value })} 
              className="forensic-input" 
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor={`${idBase}-scope`} className="forensic-label">Alcance del Peritaje</label>
            <select 
              id={`${idBase}-scope`}
              value={analisis.tipoExtraccion} 
              onChange={(e) => setAnalisisLocal({ ...analisis, tipoExtraccion: e.target.value as any })} 
              className="forensic-input"
            >
              <option value="completo">Análisis Forense Completo</option>
              <option value="whatsapp">Mensajería Instantánea (WhatsApp)</option>
              <option value="timeline">Línea de Tiempo de Eventos (Timeline)</option>
            </select>
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label htmlFor={`${idBase}-output`} className="forensic-label">Directorio de Reportes</label>
            <div className="relative">
              <FileJson className="absolute left-3 top-3 text-white/20" size={16} />
              <input 
                id={`${idBase}-output`}
                type="text" 
                value={analisis.rutaSalida} 
                onChange={(e) => setAnalisisLocal({ ...analisis, rutaSalida: e.target.value })} 
                className="forensic-input pl-10 font-mono text-xs" 
              />
            </div>
          </div>
          
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-fluent-accent" />
              <label htmlFor={`${idBase}-logs`} className="forensic-label mb-0">Hallazgos Relevantes</label>
            </div>
            <textarea 
              id={`${idBase}-logs`}
              value={analisis.logEjecucion} 
              onChange={(e) => setAnalisisLocal({ ...analisis, logEjecucion: e.target.value })} 
              className="forensic-input" 
              rows={8} 
              placeholder="Describa los artefactos encontrados (chats, ubicaciones, llamadas, archivos eliminados, etc.)..." 
            />
          </div>
        </div>

        <div className="pt-8 border-t border-fluent-border flex justify-end">
          <button 
            onClick={handleGuardar} 
            disabled={!analisis.rutaSalida} 
            className="forensic-btn forensic-btn-primary flex items-center gap-2 px-10 shadow-lg shadow-fluent-accent/20"
          >
            <Save className="w-5 h-5" /> Registrar Análisis Técnico
          </button>
        </div>
      </div>
    </div>
  );
}
