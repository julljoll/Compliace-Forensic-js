import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForenseStore } from '../../store/forenseStore';
import { FileText, Printer, CheckCircle2, ShieldCheck, Smartphone, Info, ArrowRight, ExternalLink } from 'lucide-react';

export default function ConsignacionForm() {
  const { markCmsStepComplete } = useForenseStore();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);

  const handleCompletarPaso = () => {
    markCmsStepComplete(0);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      navigate('/forense/adquisicion');
    }, 1500);
  };

  const pasosProceso = [
    {
      num: '1',
      titulo: 'Recepción y Entrevista',
      desc: 'Verificación presencial de la identidad del consignante y constatación del motivo de la entrega voluntaria.'
    },
    {
      num: '2',
      titulo: 'Fijación Fotográfica Técnica',
      desc: 'Captura del dispositivo físico desde al menos 4 ángulos distintos para documentar su estado inicial y daños visibles.'
    },
    {
      num: '3',
      titulo: 'Identificación y Registro Técnico',
      desc: 'Anotación minuciosa de marca, modelo, IMEI/serial, número de línea y estado operativo de la pantalla.'
    },
    {
      num: '4',
      titulo: 'Rotulado, Sellado y Aislamiento',
      desc: 'Activación del Modo Avión o uso de bolsa Faraday. Embalado en bolsa antiestática con precinto inviolable de seguridad.'
    }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20 animate-fade-in">
      {/* Header Panel */}
      <div className="forensic-card p-8 bg-gradient-to-r from-fluent-accent/15 via-fluent-accent/5 to-transparent border border-fluent-accent/20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-fluent-accent/20 rounded-xl text-fluent-accent shadow-lg shadow-fluent-accent/15">
              <FileText size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Fase Inicial: Obtención de Evidencia</h2>
              <p className="text-xs text-fluent-accent-light font-bold uppercase tracking-[0.2em] mt-1">Guía del Proceso y Descarga de Formatos Oficiales</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="text-right">
               <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Código de Proceso</p>
               <p className="text-xs font-mono font-bold text-white">FOR-OBT-001 | MUCC-2017</p>
             </div>
             <div className="p-2 bg-fluent-surface rounded-lg border border-fluent-border">
               <ShieldCheck size={20} className="text-fluent-accent" />
             </div>
          </div>
        </div>
      </div>

      {/* Protocol Description Card */}
      <div className="forensic-card p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-fluent-border pb-4">
          <Info size={18} className="text-fluent-accent" />
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">Protocolo de Recepción por Consignación</h3>
        </div>
        <p className="text-sm text-fluent-textSecondary leading-relaxed">
          De acuerdo con el <strong>Manual Único de Cadena de Custodia de Evidencias (MUCC, 2017)</strong> y los estándares internacionales <strong>ISO/IEC 27037:2012</strong>, las planillas y actas de consignación de evidencia digital <strong>no deben ser rellenadas de forma digital</strong> durante la recepción inicial del dispositivo. 
        </p>
        <p className="text-sm text-fluent-textSecondary leading-relaxed">
          Este procedimiento de recepción física debe ejecutarse de forma manuscrita directamente en el sitio de consignación para garantizar la inmutabilidad física y la firma manuscrita (incluyendo la impresión de huella dactilar) del consignante.
        </p>

        {/* Visual Process Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {pasosProceso.map((paso) => (
            <div key={paso.num} className="p-5 bg-fluent-surface/40 border border-fluent-border/60 rounded-xl flex gap-4 hover:border-fluent-accent/30 transition-all duration-300">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-fluent-accent/10 border border-fluent-accent/20 text-fluent-accent font-mono font-bold text-sm shrink-0">
                {paso.num}
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">{paso.titulo}</h4>
                <p className="text-xs text-fluent-textSecondary leading-relaxed">{paso.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Formats Download Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Document 1 Card */}
        <div className="forensic-card p-8 bg-gradient-to-b from-fluent-surface to-fluent-surface/80 border border-fluent-border hover:border-fluent-accent/40 group transition-all duration-300 flex flex-col justify-between h-full">
          <div className="space-y-4">
            <div className="p-3 bg-fluent-accent/10 group-hover:bg-fluent-accent/20 rounded-xl text-fluent-accent w-fit transition-colors">
              <FileText size={24} />
            </div>
            <h3 className="text-lg font-bold text-white uppercase tracking-tight group-hover:text-fluent-accent transition-colors">
              Acta de Obtención por Consignación
            </h3>
            <p className="text-xs text-fluent-textSecondary leading-relaxed">
              Formato oficial y limpio para documentar la entrega voluntaria del dispositivo. Contiene la cláusula legal de consentimiento informado y renuncia temporal a la privacidad (Arts. 48 y 60 CRBV) que debe ser firmada a mano por el consignante.
            </p>
          </div>
          <div className="pt-6">
            <Link 
              to="/forense/planillas/acta-obtencion" 
              target="_blank" 
              className="forensic-btn forensic-btn-primary flex items-center justify-center gap-2 text-xs py-3 w-full font-bold uppercase tracking-wider shadow-md shadow-fluent-accent/5 hover:shadow-fluent-accent/15 transition-all"
            >
              <Printer size={14} /> Imprimir Acta Limpia <ExternalLink size={12} />
            </Link>
          </div>
        </div>

        {/* Document 2 Card */}
        <div className="forensic-card p-8 bg-gradient-to-b from-fluent-surface to-fluent-surface/80 border border-fluent-border hover:border-fluent-accent/40 group transition-all duration-300 flex flex-col justify-between h-full">
          <div className="space-y-4">
            <div className="p-3 bg-fluent-accent/10 group-hover:bg-fluent-accent/20 rounded-xl text-fluent-accent w-fit transition-colors">
              <Smartphone size={24} />
            </div>
            <h3 className="text-lg font-bold text-white uppercase tracking-tight group-hover:text-fluent-accent transition-colors">
              Planilla PRCC Inicial
            </h3>
            <p className="text-xs text-fluent-textSecondary leading-relaxed">
              Planilla de Registro de Cadena de Custodia (PRCC) oficial. Utilizada para registrar las firmas dactilares y las firmas físicas de los peritos de fijación y colección, detallando marca, IMEI y estado de aislamiento.
            </p>
          </div>
          <div className="pt-6">
            <Link 
              to="/forense/planillas/prcc-derivacion" 
              target="_blank" 
              className="forensic-btn forensic-btn-primary flex items-center justify-center gap-2 text-xs py-3 w-full font-bold uppercase tracking-wider shadow-md shadow-fluent-accent/5 hover:shadow-fluent-accent/15 transition-all"
            >
              <Printer size={14} /> Imprimir Planilla PRCC <ExternalLink size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* Action Gating Controls */}
      <div className="forensic-card p-8 bg-gradient-to-r from-fluent-surface to-fluent-surface/90 border border-fluent-border flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">¿Formatos descargados e impresos?</h4>
          <p className="text-xs text-fluent-textSecondary leading-relaxed">
            Una vez que disponga de los formatos físicos para su llenado manual, complete este hito para continuar al siguiente paso técnico.
          </p>
        </div>
        <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto font-bold">
          {isSaved && (
            <div className="flex items-center gap-2 text-green-400 text-sm font-bold animate-in fade-in zoom-in duration-300">
              <CheckCircle2 size={18} /> Hito completado...
            </div>
          )}
          <button 
            onClick={handleCompletarPaso} 
            className="forensic-btn forensic-btn-primary flex items-center justify-center gap-2 text-xs py-3 px-8 font-bold uppercase tracking-wider w-full sm:w-auto"
          >
            Hito Completado <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
