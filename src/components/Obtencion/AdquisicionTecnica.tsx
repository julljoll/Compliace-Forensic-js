import { useState, useId } from 'react';
import { Link } from 'react-router-dom';
import { useForenseStore, type Adquisicion } from '../../store/forenseStore';
import { Smartphone, Save, ShieldCheck, Database, FileCode, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export default function AdquisicionTecnica() {
  const { dispositivoActual: dispositivo, adquisicionAndriller: storeAdquisicion, setAdquisicionAndriller, markCmsStepComplete } = useForenseStore();
  const [isSaved, setIsSaved] = useState(false);
  const idBase = useId();
  
  const [adquisicion, setAdquisicionLocal] = useState<Adquisicion>({
    herramienta: 'andriller',
    versionHerramienta: storeAdquisicion?.versionHerramienta || '3.6.2',
    tipoExtraccion: storeAdquisicion?.tipoExtraccion || 'logica',
    rutaSalida: storeAdquisicion?.rutaSalida || '',
    rutaImagenOrigen: storeAdquisicion?.rutaImagenOrigen || '',
    hashOrigenSHA256: storeAdquisicion?.hashOrigenSHA256 || '',
    hashCopiaSHA256: storeAdquisicion?.hashCopiaSHA256 || '',
    hashesCoinciden: storeAdquisicion?.hashesCoinciden || false,
    logEjecucion: storeAdquisicion?.logEjecucion || '',
    pidProceso: 0,
  });

  const handleGuardar = () => {
    setAdquisicionAndriller(adquisicion);
    markCmsStepComplete(2);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  if (!dispositivo) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-6 animate-fade-in">
        <div className="w-20 h-20 bg-fluent-surface border border-fluent-border rounded-3xl flex items-center justify-center mx-auto text-white/20">
          <Smartphone size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">No hay evidencia en custodia</h2>
          <p className="text-white/40 max-w-sm mx-auto">Para realizar una adquisición forense, primero debe registrar el dispositivo en la fase de Consignación.</p>
        </div>
        <Link to="/consignacion" className="forensic-btn forensic-btn-primary inline-flex items-center gap-2 px-8">
          Ir a Consignación <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Device Context Summary */}
      <div className="forensic-card p-6 bg-fluent-accent/5 border-fluent-accent/20 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-fluent-accent/20 rounded-xl text-fluent-accent">
            <Smartphone size={24} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-fluent-accent-light uppercase tracking-widest mb-1">Evidencia bajo análisis</h3>
            <p className="text-lg font-bold text-white leading-none">{dispositivo.marca} {dispositivo.modelo}</p>
          </div>
        </div>
        <div className="flex gap-12">
          <div>
            <p className="text-[10px] uppercase font-bold text-white/40 mb-1 tracking-wider">IMEI Master</p>
            <p className="text-xs font-mono font-bold text-white">{dispositivo.imei}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-white/40 mb-1 tracking-wider">Estado Físico</p>
            <p className="text-xs font-bold text-white capitalize">{dispositivo.pantallaEstado}</p>
          </div>
        </div>
      </div>

      <div className="forensic-card p-8 space-y-10">
        <div className="flex items-center justify-between border-b border-fluent-border pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-fluent-accent/10 rounded-xl text-fluent-accent">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Configuración de Andriller</h2>
              <p className="text-xs text-white/40 uppercase tracking-widest font-semibold mt-1">Parámetros de Extracción Forense</p>
            </div>
          </div>
          {isSaved && (
            <div className="flex items-center gap-2 text-green-400 text-xs font-bold animate-in fade-in zoom-in duration-300">
              <CheckCircle2 size={16} /> Registro Guardado
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-1.5">
            <label htmlFor={`${idBase}-version`} className="forensic-label">Versión de Andriller</label>
            <div className="relative">
              <FileCode className="absolute left-3 top-3 text-white/20" size={16} />
              <input 
                id={`${idBase}-version`}
                type="text" 
                value={adquisicion.versionHerramienta} 
                onChange={(e) => setAdquisicionLocal({ ...adquisicion, versionHerramienta: e.target.value })} 
                className="forensic-input pl-10" 
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label htmlFor={`${idBase}-mode`} className="forensic-label">Método de Adquisición</label>
            <select 
              id={`${idBase}-mode`}
              value={adquisicion.tipoExtraccion} 
              onChange={(e) => setAdquisicionLocal({ ...adquisicion, tipoExtraccion: e.target.value as any })} 
              className="forensic-input"
            >
              <option value="logica">Extracción Lógica (Segura/No Root)</option>
              <option value="fisica">Extracción Física (Bit-a-Bit/Root)</option>
            </select>
          </div>
          <div className="md:col-span-2 space-y-1.5">
            <label htmlFor={`${idBase}-path`} className="forensic-label">Directorio de Salida</label>
            <input 
              id={`${idBase}-path`}
              type="text" 
              value={adquisicion.rutaSalida} 
              onChange={(e) => setAdquisicionLocal({ ...adquisicion, rutaSalida: e.target.value })} 
              className="forensic-input font-mono text-xs" 
              placeholder="/home/user/forense/evidencia_001/" 
            />
          </div>

          <div className="md:col-span-2 bg-fluent-surfaceActive/20 p-8 rounded-fluent-card border border-fluent-border space-y-8">
            <div className="flex items-center gap-3">
              <Database size={20} className="text-fluent-accent" />
              <h3 className="text-xs font-bold text-white uppercase tracking-widest">Validación de Integridad SHA-256</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-1.5">
                <label htmlFor={`${idBase}-hash-orig`} className="forensic-label">Hash Original (Cálculo Inmediato)</label>
                <input 
                  id={`${idBase}-hash-orig`}
                  type="text" 
                  value={adquisicion.hashOrigenSHA256} 
                  onChange={(e) => setAdquisicionLocal({ ...adquisicion, hashOrigenSHA256: e.target.value })} 
                  className="forensic-input font-mono text-[10px] tracking-widest bg-black/20 border-white/5" 
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor={`${idBase}-hash-copy`} className="forensic-label">Hash de la Copia (Validación)</label>
                <input 
                  id={`${idBase}-hash-copy`}
                  type="text" 
                  value={adquisicion.hashCopiaSHA256} 
                  onChange={(e) => setAdquisicionLocal({ ...adquisicion, hashCopiaSHA256: e.target.value })} 
                  className="forensic-input font-mono text-[10px] tracking-widest bg-black/20 border-white/5" 
                />
              </div>
              
              <label className={`flex items-center gap-4 p-5 rounded-fluent-btn border transition-all cursor-pointer ${adquisicion.hashesCoinciden ? 'bg-green-500/10 border-green-500/30 text-green-400 shadow-lg shadow-green-500/5' : 'bg-fluent-surface border-fluent-border text-white/40'}`}>
                <input 
                  type="checkbox" 
                  checked={adquisicion.hashesCoinciden} 
                  onChange={(e) => setAdquisicionLocal({ ...adquisicion, hashesCoinciden: e.target.checked })} 
                  className="w-6 h-6 rounded border-fluent-border text-fluent-accent focus:ring-offset-fluent-bg" 
                />
                <div className="flex flex-col">
                  <span className="text-sm font-bold flex items-center gap-2">
                    {adquisicion.hashesCoinciden && <CheckCircle2 size={18} />}
                    Certificar Coincidencia de Hashes
                  </span>
                  <p className="text-[10px] uppercase tracking-wider opacity-60 font-semibold">Garantiza la inmutabilidad de la evidencia digital</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-fluent-border flex justify-end gap-4 items-center">
          {!adquisicion.hashesCoinciden && (
            <div className="flex items-center gap-2 text-fluent-accent text-[10px] font-bold uppercase tracking-widest">
              <AlertTriangle size={14} /> Se requiere validación de hash
            </div>
          )}
          <button 
            onClick={handleGuardar} 
            disabled={!adquisicion.hashesCoinciden || !adquisicion.rutaSalida} 
            className="forensic-btn forensic-btn-primary flex items-center gap-2 px-10 shadow-lg shadow-fluent-accent/20"
          >
            <Save className="w-5 h-5" /> Guardar Registro Técnico
          </button>
        </div>
      </div>
    </div>
  );
}
