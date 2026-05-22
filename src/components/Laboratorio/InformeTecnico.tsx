import { useState, useId } from 'react';
import { Link } from 'react-router-dom';
import { useForenseStore } from '../../store/forenseStore';
import { FileCheck, Save, Printer, Award, Gavel, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

export default function InformeTecnico() {
  const { adquisicionAndriller, adquisicionAleapp, dispositivoActual, casoActual, markCmsStepComplete } = useForenseStore();
  const [isSaved, setIsSaved] = useState(false);
  const idBase = useId();
  
  const [informe, setInforme] = useState({
    motivo: '',
    descripcionEvidencia: '',
    examenesPracticados: `Sistema: Ubuntu 26.04 LTS\n- Andriller v3.6.2 (extracción ${adquisicionAndriller?.tipoExtraccion || 'lógica'})\n- ALEAPP v2.1.0 (análisis de artefactos)\n- Hash SHA-256 Original: ${adquisicionAndriller?.hashOrigenSHA256 || 'N/A'}\n- Hash SHA-256 Copia: ${adquisicionAndriller?.hashCopiaSHA256 || 'N/A'}`,
    resultados: adquisicionAleapp?.logEjecucion || '',
    conclusiones: '',
    fundamentacionLegal: 'Constitución Nacional (Art. 49), COPP Art. 188, Ley Especial contra Delitos Informáticos, ISO/IEC 27037:2012.',
    consumoEvidencia: 'La evidencia NO fue alterada ni consumida durante el proceso de peritación.',
    peritoActuante: '',
    credencialNumero: '',
  });

  const handleGuardar = () => {
    markCmsStepComplete(6);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handlePrint = () => {
    handleGuardar();
    setTimeout(() => window.print(), 100);
  };

  if (!casoActual || !dispositivoActual) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-6 animate-fade-in">
        <div className="w-20 h-20 bg-fluent-surface border border-fluent-border rounded-3xl flex items-center justify-center mx-auto text-white/20">
          <FileCheck size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">No hay datos para el informe</h2>
          <p className="text-white/40 max-w-sm mx-auto">Debe registrar un caso y un dispositivo antes de generar el dictamen pericial final.</p>
        </div>
        <Link to="/consignacion" className="forensic-btn forensic-btn-primary inline-flex items-center gap-2 px-8">
          Comenzar Nuevo Caso <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      <div className="forensic-card p-8 space-y-10">
        <div className="flex items-center justify-between border-b border-fluent-border pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-fluent-accent/10 rounded-xl text-fluent-accent">
              <FileCheck size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Dictamen Pericial Informático</h2>
              <p className="text-xs text-white/40 uppercase tracking-widest font-semibold mt-1">Generación de Informe Final</p>
            </div>
          </div>
          <div className="print:hidden flex gap-4 items-center">
            {isSaved && (
              <div className="flex items-center gap-2 text-green-400 text-xs font-bold animate-in fade-in zoom-in duration-300">
                <CheckCircle2 size={16} /> Informe Guardado
              </div>
            )}
            <button onClick={handlePrint} className="forensic-btn forensic-btn-secondary flex items-center gap-2 px-6">
              <Printer size={18} /> Imprimir Dictamen
            </button>
            <button onClick={handleGuardar} className="forensic-btn forensic-btn-primary flex items-center gap-2 px-8 shadow-lg shadow-fluent-accent/20">
              <Save size={18} /> Guardar Registro
            </button>
          </div>
        </div>
        
        <div className="space-y-10">
          <div className="grid grid-cols-1 gap-8">
            <div className="space-y-1.5">
              <label htmlFor={`${idBase}-motivo`} className="forensic-label">1. Motivo de la Peritación</label>
              <textarea 
                id={`${idBase}-motivo`}
                value={informe.motivo} 
                onChange={(e) => setInforme({ ...informe, motivo: e.target.value })} 
                className="forensic-input" 
                rows={2} 
                placeholder="Indique el motivo legal o técnico del peritaje."
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor={`${idBase}-desc`} className="forensic-label">2. Descripción de la Evidencia</label>
              <textarea 
                id={`${idBase}-desc`}
                value={informe.descripcionEvidencia} 
                onChange={(e) => setInforme({ ...informe, descripcionEvidencia: e.target.value })} 
                className="forensic-input" 
                rows={3} 
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Gavel size={16} className="text-fluent-accent" />
                <label htmlFor={`${idBase}-exams`} className="forensic-label mb-0">3. Exámenes Practicados</label>
              </div>
              <textarea 
                id={`${idBase}-exams`}
                value={informe.examenesPracticados} 
                onChange={(e) => setInforme({ ...informe, examenesPracticados: e.target.value })} 
                className="forensic-input font-mono text-xs bg-black/20" 
                rows={6} 
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor={`${idBase}-results`} className="forensic-label">4. Resultados Obtenidos</label>
              <textarea 
                id={`${idBase}-results`}
                value={informe.resultados} 
                onChange={(e) => setInforme({ ...informe, resultados: e.target.value })} 
                className="forensic-input" 
                rows={6} 
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor={`${idBase}-concl`} className="forensic-label">5. Conclusiones Técnicas</label>
              <textarea 
                id={`${idBase}-concl`}
                value={informe.conclusiones} 
                onChange={(e) => setInforme({ ...informe, conclusiones: e.target.value })} 
                className="forensic-input border-l-4 border-l-fluent-accent" 
                rows={4} 
                placeholder="Resumen técnico-científico de los hallazgos."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-1.5">
                <label htmlFor={`${idBase}-legal`} className="forensic-label">6. Fundamentación Legal</label>
                <textarea 
                  id={`${idBase}-legal`}
                  value={informe.fundamentacionLegal} 
                  onChange={(e) => setInforme({ ...informe, fundamentacionLegal: e.target.value })} 
                  className="forensic-input text-xs" 
                  rows={3} 
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={14} className="text-fluent-accent" />
                  <label htmlFor={`${idBase}-consumo`} className="forensic-label mb-0">7. Consumo de Evidencia</label>
                </div>
                <textarea 
                  id={`${idBase}-consumo`}
                  value={informe.consumoEvidencia} 
                  onChange={(e) => setInforme({ ...informe, consumoEvidencia: e.target.value })} 
                  className="forensic-input text-xs" 
                  rows={3} 
                />
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-fluent-border">
            <div className="flex items-center gap-3 mb-8">
              <Award size={20} className="text-fluent-accent" />
              <h3 className="text-xs font-bold text-white uppercase tracking-widest">Firma del Perito Informático</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1.5">
                <label htmlFor={`${idBase}-perito`} className="forensic-label">Nombre del Perito</label>
                <input 
                  id={`${idBase}-perito`}
                  type="text" 
                  value={informe.peritoActuante} 
                  onChange={(e) => setInforme({ ...informe, peritoActuante: e.target.value })} 
                  className="forensic-input" 
                  placeholder="Nombre completo" 
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor={`${idBase}-cred`} className="forensic-label">Número de Credencial</label>
                <input 
                  id={`${idBase}-cred`}
                  type="text" 
                  value={informe.credencialNumero} 
                  onChange={(e) => setInforme({ ...informe, credencialNumero: e.target.value })} 
                  className="forensic-input" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
