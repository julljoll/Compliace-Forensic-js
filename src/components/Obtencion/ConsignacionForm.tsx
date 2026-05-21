import { useState, memo, useId } from 'react';
import { Link } from 'react-router-dom';
import { useForenseStore, type PRCC } from '../../store/forenseStore';
import { FileText, Printer, CheckCircle2, ShieldCheck, Smartphone, Info } from 'lucide-react';

const InputField = memo(({ label, value, onChange, placeholder, type = 'text', required }: any) => {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="forensic-label flex items-center gap-1.5">
        {label}
        {required && <span className="text-fluent-accent" aria-hidden="true">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="forensic-input"
        placeholder={placeholder}
        required={required}
        aria-required={required}
      />
    </div>
  );
});

export default function ConsignacionForm() {
  const { setCaso, setDispositivo, setPRCC } = useForenseStore();
  const [isSaved, setIsSaved] = useState(false);
  
  const [caso, setCasoLocal] = useState<any>({
    numeroCaso: '',
    fiscal: '',
    fechaInicio: new Date().toISOString().split('T')[0],
    estado: 'activo',
    solicitanteNombre: '',
    solicitanteCI: '',
    solicitanteTelefono: '',
    solicitanteDireccion: '',
    ciudad: 'QUIBOR-LARA'
  });

  const [dispositivo, setDispositivoLocal] = useState<any>({
    marca: '', modelo: '', imei: '', imei2: '', simCard: '', numeroTel: '',
    estadoFisico: '', modoAislamiento: 'modo_avion', danosVisibles: '', bateriaEstado: '', pantallaEstado: 'apagado',
    aplicacionObjeto: 'WhatsApp',
    numeroInteres: '',
    fechaDesde: '',
    fechaHasta: '',
    calculoHash: true
  });

  const [prcc] = useState<PRCC>({
    expediente: '', prcc: '', despachoInstruye: '', organismoInstruye: '', despachoInicia: '', organismoInicia: '',
    direccion: '', fechaHora: '', formaObtencion: 'Consignación',
    fijacion: { nombre: '', ci: '' }, coleccion: { nombre: '', ci: '' }, 
    descripcion: '', motivoTransferencia: '',
    entrega: { nombre: '', organismo: '', despacho: '', ci: '' }, recibe: { nombre: '', organismo: '', despacho: '', ci: '' }, observaciones: ''
  });

  const handleGuardar = () => {
    setCaso(caso);
    setDispositivo(dispositivo);
    setPRCC(prcc);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handlePrint = () => {
    handleGuardar();
    setTimeout(() => window.print(), 100);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20 animate-fade-in">
      {/* Header Panel */}
      <div className="forensic-card p-8 bg-fluent-accent/5 border-fluent-accent/20">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-fluent-accent/20 rounded-xl text-fluent-accent">
              <FileText size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white uppercase tracking-tight">Planilla de Consignación de Evidencia</h1>
              <p className="text-xs text-fluent-accent-light font-bold uppercase tracking-[0.2em] mt-1">Fase Inicial / Acta de Recepción y Autorización</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3">
             <div className="text-right">
               <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Código de Control</p>
               <p className="text-xs font-mono font-bold text-white">FOR-OBT-001</p>
             </div>
             <div className="p-2 bg-fluent-surface rounded-lg border border-fluent-border">
               <ShieldCheck size={20} className="text-fluent-accent" />
             </div>
          </div>
        </div>
      </div>

      {/* Banner de Formato Oficial Limpio para Llenado Manual */}
      <div className="forensic-card p-6 bg-fluent-accent/5 border border-fluent-accent/25 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg shadow-fluent-accent/5">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-fluent-accent/15 rounded-lg text-fluent-accent mt-0.5 shrink-0">
            <Info size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Llenado Manual Obligatorio (MUCC 2017)</h4>
            <p className="text-xs text-white/50 leading-relaxed mt-1">
              De acuerdo con las normativas legales de cadena de custodia, el acta oficial de recepción debe ser cumplimentada de forma manuscrita. Acceda e imprima el formato oficial vacío.
            </p>
          </div>
        </div>
        <Link 
          to="/forense/planillas/acta-obtencion" 
          target="_blank" 
          className="forensic-btn forensic-btn-primary flex items-center gap-2 text-xs py-2.5 px-6 font-bold shadow-md shadow-fluent-accent/10 hover:shadow-fluent-accent/20 transition-all shrink-0 uppercase tracking-wider"
        >
          <Printer size={15} /> Imprimir Acta Limpia
        </Link>
      </div>

      <div className="forensic-card p-10 space-y-12">
        {/* Section 1: Applicant Data */}
        <section className="space-y-8">
          <div className="flex items-center gap-3 border-b border-fluent-border pb-4">
            <Info size={18} className="text-fluent-accent" />
            <h2 className="text-sm font-bold text-white uppercase tracking-widest">I. Datos del Solicitante y Autorización</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <InputField label="Nro de Caso / Oficio" value={caso.numeroCaso} onChange={(v: string) => setCasoLocal({ ...caso, numeroCaso: v })} placeholder="Ej: MP-2024-001" required />
            <InputField label="Autoridad / Fiscal" value={caso.fiscal} onChange={(v: string) => setCasoLocal({ ...caso, fiscal: v })} placeholder="Nombre de la autoridad" required />
            <InputField label="Ciudad" value={caso.ciudad} onChange={(v: string) => setCasoLocal({ ...caso, ciudad: v })} required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InputField label="Nombre Completo del Solicitante" value={caso.solicitanteNombre} onChange={(v: string) => setCasoLocal({ ...caso, solicitanteNombre: v })} placeholder="Identidad de quien entrega" required />
            <InputField label="Cédula / Identificación" value={caso.solicitanteCI} onChange={(v: string) => setCasoLocal({ ...caso, solicitanteCI: v })} placeholder="V-00.000.000" required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <InputField label="Teléfono de Contacto" value={caso.solicitanteTelefono} onChange={(v: string) => setCasoLocal({ ...caso, solicitanteTelefono: v })} placeholder="04xx-xxxxxxx" />
            <div className="md:col-span-2">
              <InputField label="Dirección Completa" value={caso.solicitanteDireccion} onChange={(v: string) => setCasoLocal({ ...caso, solicitanteDireccion: v })} placeholder="Domicilio del solicitante" />
            </div>
          </div>
        </section>

        {/* Section 2: Device Technical Data */}
        <section className="space-y-8">
          <div className="flex items-center gap-3 border-b border-fluent-border pb-4">
            <Smartphone size={18} className="text-fluent-accent" />
            <h2 className="text-sm font-bold text-white uppercase tracking-widest">II. Descripción del Dispositivo (Matriz)</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <InputField label="Marca" value={dispositivo.marca} onChange={(v: string) => setDispositivoLocal({ ...dispositivo, marca: v })} placeholder="Samsung, Apple..." required />
            <InputField label="Modelo" value={dispositivo.modelo} onChange={(v: string) => setDispositivoLocal({ ...dispositivo, modelo: v })} placeholder="Galaxy S23..." required />
            <InputField label="IMEI / Serial" value={dispositivo.imei} onChange={(v: string) => setDispositivoLocal({ ...dispositivo, imei: v })} placeholder="15 dígitos o serial" required />
            <InputField label="Nro Tel. del Equipo" value={dispositivo.numeroTel} onChange={(v: string) => setDispositivoLocal({ ...dispositivo, numeroTel: v })} placeholder="+58..." />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-1.5">
                <label className="forensic-label">Estado Físico / Pantalla</label>
                <select 
                  value={dispositivo.pantallaEstado} 
                  onChange={(e) => setDispositivoLocal({ ...dispositivo, pantallaEstado: e.target.value as any })} 
                  className="forensic-input"
                >
                  <option value="apagado">Apagado (Sugerido)</option>
                  <option value="encendido">Encendido</option>
                  <option value="bloqueado">Bloqueado / Patrón</option>
                </select>
             </div>
             <div className="space-y-1.5">
                <label className="forensic-label">Modo de Aislamiento</label>
                <select 
                  value={dispositivo.modoAislamiento} 
                  onChange={(e) => setDispositivoLocal({ ...dispositivo, modoAislamiento: e.target.value as any })} 
                  className="forensic-input"
                >
                  <option value="modo_avion">Modo Avión Activado</option>
                  <option value="bolsa_faraday">Bolsa Faraday / Jaula</option>
                  <option value="sin_aislamiento">Sin Aislamiento (Riesgo)</option>
                </select>
             </div>
          </div>
        </section>

        {/* Section 3: Analysis Scope */}
        <section className="space-y-8">
          <div className="flex items-center gap-3 border-b border-fluent-border pb-4">
            <FileText size={18} className="text-fluent-accent" />
            <h2 className="text-sm font-bold text-white uppercase tracking-widest">III. Alcance de la Extracción y Análisis</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-1.5">
              <label className="forensic-label">Aplicación Objeto</label>
              <select 
                value={dispositivo.aplicacionObjeto} 
                onChange={(e) => setDispositivoLocal({ ...dispositivo, aplicacionObjeto: e.target.value })} 
                className="forensic-input font-bold text-green-500"
              >
                <option value="WhatsApp">WhatsApp</option>
                <option value="Telegram">Telegram</option>
                <option value="SMS">SMS / Mensajería</option>
                <option value="Galeria">Galería / Multimedia</option>
                <option value="Completo">Extracción Completa</option>
              </select>
            </div>
            <InputField label="Número de Interés" value={dispositivo.numeroInteres} onChange={(v: string) => setDispositivoLocal({ ...dispositivo, numeroInteres: v })} placeholder="Número a investigar" />
            <InputField label="Desde (Fecha)" type="date" value={dispositivo.fechaDesde} onChange={(v: string) => setDispositivoLocal({ ...dispositivo, fechaDesde: v })} />
            <InputField label="Hasta (Fecha)" type="date" value={dispositivo.fechaHasta} onChange={(v: string) => setDispositivoLocal({ ...dispositivo, fechaHasta: v })} />
          </div>
          <div className="flex gap-8">
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                checked={dispositivo.calculoHash} 
                onChange={(e) => setDispositivoLocal({ ...dispositivo, calculoHash: e.target.checked })} 
                className="w-5 h-5 rounded border-fluent-border bg-fluent-surface text-fluent-accent focus:ring-fluent-accent"
              />
              <span className="text-xs text-white/80 font-bold uppercase">Cálculo de Algoritmos HASH (SHA-256)</span>
            </div>
          </div>
        </section>

        {/* Section 4: Legal Consent */}
        <section className="space-y-6">
          <div className="p-8 bg-fluent-accent/5 rounded-fluent-card border border-fluent-accent/30 space-y-4">
             <div className="flex items-center gap-3 text-fluent-accent">
               <ShieldCheck size={24} />
               <h3 className="text-sm font-bold uppercase tracking-widest">Autorización Voluntaria y Renuncia de Privacidad</h3>
             </div>
             <p className="text-xs text-white/60 leading-relaxed text-justify italic">
               "Yo, el arriba identificado, en pleno uso de mis facultades mentales AUTORIZO EXPRESA Y VOLUNTARIAMENTE 
               su acceso, exploración y extracción forense de datos. Para ello, renuncio temporalmente a mi derecho al 
               secreto de las comunicaciones (Arts. 48 y 60 de la Constitución de la República Bolivariana de Venezuela), 
               única y exclusivamente a favor de los expertos designados y para los fines técnicos aquí descritos."
             </p>
          </div>
        </section>

        {/* Actions Panel */}
        <div className="pt-10 border-t border-fluent-border flex flex-wrap items-center justify-between gap-6 print:hidden">
          <div className="flex items-center gap-4">
            {isSaved && (
              <div className="flex items-center gap-2 text-green-400 text-sm font-bold animate-in fade-in zoom-in duration-300">
                <CheckCircle2 size={20} /> Planilla registrada exitosamente
              </div>
            )}
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleGuardar} 
              className="forensic-btn forensic-btn-secondary px-8 h-12"
            >
              Guardar Registro
            </button>
            <button 
              onClick={handlePrint} 
              disabled={!caso.numeroCaso || !caso.solicitanteNombre || !dispositivo.imei} 
              className="forensic-btn forensic-btn-primary flex items-center gap-3 px-12 h-12 shadow-xl shadow-fluent-accent/20"
            >
              <Printer size={20} /> Firmar e Imprimir Acta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

