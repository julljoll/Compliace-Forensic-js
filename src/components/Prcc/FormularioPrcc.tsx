import { useState, memo, useId } from 'react';
import { Link } from 'react-router-dom';
import { useForenseStore, type PRCC } from '../../store/forenseStore';
import { ClipboardList, FileText, User, MapPin, Printer, Info } from 'lucide-react';

const InputField = memo(({ label, value, onChange, placeholder, type = 'text' }: any) => {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="forensic-label">{label}</label>
      <input 
        id={id}
        type={type}
        className="forensic-input" 
        value={value} 
        placeholder={placeholder} 
        onChange={(e) => onChange(e.target.value)} 
      />
    </div>
  );
});

export default function FormularioPrcc() {
  const { prccActual: storePrcc, setPRCC, markCmsStepComplete, casoActual, dispositivoActual } = useForenseStore();
  const [prcc, setPrcCLocal] = useState<PRCC>(storePrcc || {
    expediente: '', prcc: '', despachoInstruye: '', organismoInstruye: '', despachoInicia: '', organismoInicia: '',
    direccion: '', fechaHora: '', formaObtencion: 'Consignación',
    fijacion: { nombre: '', ci: '' }, coleccion: { nombre: '', ci: '' }, 
    descripcion: dispositivoActual ? `${dispositivoActual.marca} ${dispositivoActual.modelo}, IMEI: ${dispositivoActual.imei}` : '', 
    motivoTransferencia: 'Peritaje Informático',
    entrega: { nombre: '', organismo: '', despacho: '', ci: '' }, recibe: { nombre: '', organismo: '', despacho: '', ci: '' }, observaciones: ''
  });

  const handlePrint = () => {
    setPRCC(prcc);
    markCmsStepComplete(1);
    setTimeout(() => window.print(), 100);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-20">
      {/* Banner de Formato Oficial Limpio para Llenado Manual */}
      <div className="forensic-card p-6 bg-fluent-accent/5 border border-fluent-accent/25 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg shadow-fluent-accent/5">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-fluent-accent/15 rounded-lg text-fluent-accent mt-0.5 shrink-0">
            <Info size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Planilla de Cadena de Custodia (PRCC)</h4>
            <p className="text-xs text-white/50 leading-relaxed mt-1">
              La trazabilidad in situ de la evidencia física y digital requiere el llenado manual y firma dactilar en la planilla física. Imprima el formato oficial en limpio.
            </p>
          </div>
        </div>
        <Link 
          to="/forense/planillas/prcc-derivacion" 
          target="_blank" 
          className="forensic-btn forensic-btn-primary flex items-center gap-2 text-xs py-2.5 px-6 font-bold shadow-md shadow-fluent-accent/10 hover:shadow-fluent-accent/20 transition-all shrink-0 uppercase tracking-wider"
        >
          <Printer size={15} /> Imprimir PRCC Limpia
        </Link>
      </div>

      <div className="forensic-card p-8">
        <div className="flex items-center justify-between mb-8 border-b border-fluent-border pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-fluent-accent/10 rounded-xl text-fluent-accent">
              <ClipboardList size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white uppercase tracking-tight">Registro de Cadena de Custodia (PRCC)</h2>
              <p className="text-xs text-white/40 font-semibold uppercase tracking-widest mt-1">Documento de Trazabilidad Legal</p>
            </div>
          </div>
          <button 
            onClick={handlePrint} 
            className="forensic-btn forensic-btn-primary flex items-center gap-2 px-8 print:hidden"
          >
            <Printer size={18} /> Imprimir PRCC
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Section I: General Data */}
          <section className="space-y-6">
            <h3 className="text-[10px] font-bold text-fluent-accent-light uppercase tracking-[0.2em] flex items-center gap-2">
              <MapPin size={14} /> I. Datos de la Obtención
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <InputField label="N° Expediente" value={casoActual?.numeroCaso || prcc.expediente} onChange={(v: string) => setPrcCLocal({...prcc, expediente: v})} />
              <InputField label="N° de Registro PRCC" value={prcc.prcc} onChange={(v: string) => setPrcCLocal({...prcc, prcc: v})} />
            </div>
            <InputField label="Despacho que Instruye" value={prcc.despachoInstruye} onChange={(v: string) => setPrcCLocal({...prcc, despachoInstruye: v})} />
            <InputField label="Organismo que Inicia" value={prcc.organismoInicia} onChange={(v: string) => setPrcCLocal({...prcc, organismoInicia: v})} />
            <InputField label="Dirección / Lugar de Obtención" value={prcc.direccion} onChange={(v: string) => setPrcCLocal({...prcc, direccion: v})} />
          </section>
          
          {/* Section II: Description */}
          <section className="space-y-6">
            <h3 className="text-[10px] font-bold text-fluent-accent-light uppercase tracking-[0.2em] flex items-center gap-2">
              <FileText size={14} /> II. Descripción de la Evidencia
            </h3>
            <textarea 
              className="forensic-input" 
              rows={4} 
              value={prcc.descripcion} 
              onChange={(e) => setPrcCLocal({...prcc, descripcion: e.target.value})}
              placeholder="Describa detalladamente la evidencia física o digital..."
            />
            <div className="grid grid-cols-1 gap-6">
              <InputField label="Motivo de la Transferencia" value={prcc.motivoTransferencia} onChange={(v: string) => setPrcCLocal({...prcc, motivoTransferencia: v})} />
            </div>
          </section>

          {/* Section III: Transfer */}
          <section className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-fluent-border">
            <div className="space-y-6">
              <h3 className="text-[10px] font-bold text-fluent-accent-light uppercase tracking-[0.2em] flex items-center gap-2">
                <User size={14} /> Datos de Entrega
              </h3>
              <InputField label="Nombre Completo" value={prcc.entrega.nombre} onChange={(v: string) => setPrcCLocal({...prcc, entrega: {...prcc.entrega, nombre: v}})} />
              <div className="grid grid-cols-2 gap-6">
                <InputField label="Cédula" value={prcc.entrega.ci} onChange={(v: string) => setPrcCLocal({...prcc, entrega: {...prcc.entrega, ci: v}})} />
                <InputField label="Organismo" value={prcc.entrega.organismo} onChange={(v: string) => setPrcCLocal({...prcc, entrega: {...prcc.entrega, organismo: v}})} />
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-[10px] font-bold text-fluent-accent-light uppercase tracking-[0.2em] flex items-center gap-2">
                <User size={14} /> Datos de Recepción
              </h3>
              <InputField label="Nombre Completo" value={prcc.recibe.nombre} onChange={(v: string) => setPrcCLocal({...prcc, recibe: {...prcc.recibe, nombre: v}})} />
              <div className="grid grid-cols-2 gap-6">
                <InputField label="Cédula" value={prcc.recibe.ci} onChange={(v: string) => setPrcCLocal({...prcc, recibe: {...prcc.recibe, ci: v}})} />
                <InputField label="Organismo" value={prcc.recibe.organismo} onChange={(v: string) => setPrcCLocal({...prcc, recibe: {...prcc.recibe, organismo: v}})} />
              </div>
            </div>
          </section>
        </div>

        <div className="mt-12 p-6 bg-fluent-surfaceActive/20 rounded-fluent-card border border-fluent-border flex items-start gap-4">
          <div className="p-2 bg-fluent-accent/10 rounded-lg text-fluent-accent shrink-0">
            <ClipboardList size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-1">Observaciones de Integridad</h4>
            <p className="text-xs text-white/40 leading-relaxed">
              Debe hacerse constar el estado de los precintos y sellos al momento del traspaso. Cualquier alteración observada debe ser documentada de inmediato en este registro.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
