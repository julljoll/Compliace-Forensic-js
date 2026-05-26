import { useState, useId } from 'react';
import { Shield, Gavel, MapPin, Printer, CheckCircle2 } from 'lucide-react';
import { useForenseStore } from '../../../store/forenseStore';

export default function ResguardoJudicial() {
  const { markCmsStepComplete } = useForenseStore();
  const [isSaved, setIsSaved] = useState(false);
  const idBase = useId();

  const handlePrint = () => {
    markCmsStepComplete(7);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
    setTimeout(() => window.print(), 100);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      <div className="forensic-card p-8">
        <div className="flex items-center justify-between mb-8 border-b border-fluent-border pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-fluent-accent/10 rounded-xl text-fluent-accent">
              <Gavel size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white uppercase tracking-tight">Fase de Disposición Judicial</h2>
              <p className="text-xs text-white/40 font-semibold uppercase tracking-widest mt-1">Custodia y Exhibición en Juicio</p>
            </div>
          </div>
          <div className="flex items-center gap-2 print:hidden">
            <button 
              onClick={handlePrint} 
              className="forensic-btn forensic-btn-primary flex items-center gap-2 px-8"
            >
              {isSaved ? <CheckCircle2 size={18} /> : <Printer size={18} />}
              {isSaved ? 'Sincronizado' : 'Acta de Exhibición'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <section className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-[10px] font-bold text-fluent-accent-light uppercase tracking-[0.2em] flex items-center gap-2">
                <Shield size={14} /> Resguardo de Evidencias
              </h3>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor={`${idBase}-area`} className="forensic-label">Área de Depósito Judicial</label>
                  <select id={`${idBase}-area`} className="forensic-input">
                    <option>Sala de Evidencias - Palacio de Justicia</option>
                    <option>Depósito de Armas y Municiones</option>
                    <option>Bóveda de Valores</option>
                    <option>Resguardo de Evidencia Digital</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor={`${idBase}-cond`} className="forensic-label">Condiciones de Almacenamiento</label>
                  <textarea id={`${idBase}-cond`} className="forensic-input" rows={3} placeholder="Describa el estado de resguardo..." />
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-[10px] font-bold text-fluent-accent-light uppercase tracking-[0.2em] flex items-center gap-2">
                <MapPin size={14} /> Exhibición en Audiencia
              </h3>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor={`${idBase}-court`} className="forensic-label">Tribunal de la Causa</label>
                  <input id={`${idBase}-court`} type="text" className="forensic-input" placeholder="Ej: Tribunal 1° de Control" />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor={`${idBase}-judge`} className="forensic-label">Juez a Cargo</label>
                  <input id={`${idBase}-judge`} type="text" className="forensic-input" placeholder="Nombre del magistrado" />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor={`${idBase}-obs`} className="forensic-label">Observaciones en Sala</label>
                  <textarea id={`${idBase}-obs`} className="forensic-input" rows={3} placeholder="Incidencias durante la exhibición..." />
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-12 p-6 bg-fluent-surfaceActive/20 rounded-fluent-card border border-fluent-border">
          <div className="flex items-center gap-3 mb-4">
            <Shield size={18} className="text-fluent-accent" />
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">Base Legal: COPP Art. 188</h4>
          </div>
          <p className="text-xs text-white/40 leading-relaxed italic">
            "Las evidencias físicas deberán ser resguardadas en las áreas destinadas para tal fin en las instituciones correspondientes, 
            garantizando que no se alteren, modifiquen o destruyan hasta que se dicte sentencia definitiva o se ordene su disposición final."
          </p>
        </div>
      </div>
    </div>
  );
}
