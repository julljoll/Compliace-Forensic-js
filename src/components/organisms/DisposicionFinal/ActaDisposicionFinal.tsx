import { useState, useId } from 'react';
import {
  Archive, RotateCcw, Trash2, User, MapPin, FileText,
  Printer, Gavel, AlertTriangle, CheckCircle2, Lock
} from 'lucide-react';
import { useForenseStore } from '../../../store/forenseStore';

type DestinoFinal = 'devolucion' | 'destruccion' | 'archivo_fiscal' | 'tribunal';

interface PersonaFirma {
  nombre: string;
  ci: string;
  cargo: string;
  organismo: string;
}

interface ActaData {
  numeroCaso: string;
  numeroPrcc: string;
  expediente: string;
  tribunal: string;
  juez: string;
  fiscal: string;
  fechaDecision: string;
  numeroAuto: string;
  destino: DestinoFinal;
  descripcionEvidencia: string;
  estadoSellos: 'intactos' | 'rotos' | 'reemplazados';
  ubicacionFinal: string;
  observaciones: string;
  entregante: PersonaFirma;
  receptor: PersonaFirma;
}

const DESTINO_CONFIG: Record<DestinoFinal, {
  icon: typeof Archive;
  label: string;
  color: string;
  bg: string;
  descripcion: string;
}> = {
  devolucion: {
    icon: RotateCcw,
    label: 'Devolución al Titular',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/30',
    descripcion: 'La evidencia es devuelta al legítimo propietario según decisión judicial.',
  },
  destruccion: {
    icon: Trash2,
    label: 'Destrucción Controlada',
    color: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/30',
    descripcion: 'Destrucción supervisada y documentada. Requiere acta adicional.',
  },
  archivo_fiscal: {
    icon: Archive,
    label: 'Archivo en Depósito Fiscal',
    color: 'text-fluent-accent',
    bg: 'bg-fluent-accent/10 border-fluent-accent/30',
    descripcion: 'Resguardo permanente en el Ministerio Público.',
  },
  tribunal: {
    icon: Gavel,
    label: 'Bajo Custodia del Tribunal',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/30',
    descripcion: 'La evidencia queda a disposición del tribunal hasta sentencia firme.',
  },
};

const InputField = ({
  label, value, onChange, placeholder, type = 'text', id
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; id: string;
}) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="block text-[9px] font-black text-fluent-text-muted uppercase tracking-[0.2em]">
      {label}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full text-xs bg-black/40 border border-white/10 rounded-[4px] px-3 py-2.5
        text-white/80 placeholder-white/15 focus:outline-none focus:border-fluent-accent/50
        focus:bg-black/60 transition-all hover:border-white/20"
    />
  </div>
);

const SectionHeader = ({ icon: Icon, label, numero }: { icon: typeof User; label: string; numero: string }) => (
  <div className="flex items-center gap-3 mb-5 pb-3 border-b border-white/[0.06]">
    <span className="text-[10px] font-black text-fluent-accent/40 font-mono">{numero}</span>
    <Icon size={13} className="text-fluent-accent shrink-0" />
    <h4 className="text-[10px] font-black text-fluent-text-muted uppercase tracking-[0.2em]">{label}</h4>
  </div>
);

export default function ActaDisposicionFinal() {
  const uid = useId();
  const [imprimiendo, setImprimiendo] = useState(false);

  const [acta, setActa] = useState<ActaData>({
    numeroCaso: '',
    numeroPrcc: '',
    expediente: '',
    tribunal: '',
    juez: '',
    fiscal: '',
    fechaDecision: new Date().toISOString().split('T')[0],
    numeroAuto: '',
    destino: 'archivo_fiscal',
    descripcionEvidencia: '',
    estadoSellos: 'intactos',
    ubicacionFinal: '',
    observaciones: '',
    entregante: { nombre: '', ci: '', cargo: 'Perito Forense', organismo: '' },
    receptor: { nombre: '', ci: '', cargo: '', organismo: '' },
  });

  const set = (patch: Partial<ActaData>) => setActa(prev => ({ ...prev, ...patch }));
  const setEnt = (patch: Partial<PersonaFirma>) => setActa(p => ({ ...p, entregante: { ...p.entregante, ...patch } }));
  const setRec = (patch: Partial<PersonaFirma>) => setActa(p => ({ ...p, receptor: { ...p.receptor, ...patch } }));

  const handlePrint = () => {
    setImprimiendo(true);
    const fn = useForenseStore.getState().markCmsStepComplete;
    if (fn) fn(8);
    setTimeout(() => { window.print(); setImprimiendo(false); }, 200);
  };

  const destinoCfg = DESTINO_CONFIG[acta.destino];

  return (
    <div className="fluent-mica rounded-xl border border-white/5 shadow-2xl overflow-hidden animate-fade-in">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-fluent-accent/10 rounded-[6px] border border-fluent-accent/20">
            <Lock size={22} className="text-fluent-accent" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-base font-black text-white uppercase tracking-tight">
              Acta de Disposición Final de Evidencia
            </h2>
            <p className="text-[9px] text-white/30 font-bold uppercase tracking-[0.2em] mt-0.5">
              MUCC-2017 Cap. V · Art. 225 COPP · Compendio PRCC 2022
            </p>
          </div>
        </div>
        <button
          id="btn-imprimir-acta"
          onClick={handlePrint}
          disabled={imprimiendo}
          className="forensic-btn forensic-btn-primary flex items-center gap-2 px-6 py-2.5 print:hidden shrink-0"
        >
          <Printer size={15} />
          <span className="text-xs font-black">{imprimiendo ? 'Generando…' : 'Imprimir Acta'}</span>
        </button>
      </div>

      <div className="p-6 space-y-8">

        {/* ── Sección I: Datos del Expediente ──────────────── */}
        <section>
          <SectionHeader icon={FileText} label="Datos del Expediente" numero="I." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <InputField
              id={`${uid}-caso`}
              label="N° de Caso / Expediente"
              value={acta.numeroCaso}
              onChange={v => set({ numeroCaso: v })}
              placeholder="P-2026-001"
            />
            <InputField
              id={`${uid}-prcc`}
              label="N° de Registro PRCC"
              value={acta.numeroPrcc}
              onChange={v => set({ numeroPrcc: v })}
              placeholder="PRCC-2026-NNN"
            />
            <InputField
              id={`${uid}-expediente`}
              label="N° de Expediente Fiscal"
              value={acta.expediente}
              onChange={v => set({ expediente: v })}
              placeholder="MP-12345-2026"
            />
          </div>
        </section>

        {/* ── Sección II: Datos del Tribunal ───────────────── */}
        <section>
          <SectionHeader icon={Gavel} label="Datos del Despacho Ordenante" numero="II." />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InputField
              id={`${uid}-tribunal`}
              label="Tribunal / Despacho Fiscal"
              value={acta.tribunal}
              onChange={v => set({ tribunal: v })}
              placeholder="Ej: Tribunal 1° de Control del Área Metropolitana"
            />
            <InputField
              id={`${uid}-juez`}
              label="Juez / Fiscal a Cargo"
              value={acta.juez}
              onChange={v => set({ juez: v })}
              placeholder="Nombre completo del magistrado"
            />
            <InputField
              id={`${uid}-fiscal`}
              label="Representante del Ministerio Público"
              value={acta.fiscal}
              onChange={v => set({ fiscal: v })}
              placeholder="Nombre del fiscal designado"
            />
            <InputField
              id={`${uid}-auto`}
              label="N° de Auto / Resolución Judicial"
              value={acta.numeroAuto}
              onChange={v => set({ numeroAuto: v })}
              placeholder="Número del auto motivado"
            />
          </div>
          <div className="mt-5">
            <InputField
              id={`${uid}-fecha`}
              label="Fecha de la Decisión Judicial"
              value={acta.fechaDecision}
              onChange={v => set({ fechaDecision: v })}
              type="date"
            />
          </div>
        </section>

        {/* ── Sección III: Destino Final ────────────────────── */}
        <section>
          <SectionHeader icon={MapPin} label="Destino Final de la Evidencia" numero="III." />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            {(Object.entries(DESTINO_CONFIG) as [DestinoFinal, typeof destinoCfg][]).map(([key, cfg]) => {
              const DIcon = cfg.icon;
              const seleccionado = acta.destino === key;
              return (
                <button
                  key={key}
                  id={`destino-${key}`}
                  onClick={() => set({ destino: key })}
                  className={`p-4 rounded-lg border text-left transition-all duration-200 group ${
                    seleccionado
                      ? `${cfg.bg} ${cfg.color}`
                      : 'border-white/5 bg-white/[0.02] text-white/30 hover:bg-white/[0.04] hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <DIcon size={14} className={seleccionado ? cfg.color : 'text-white/20'} />
                    <span className={`text-[10px] font-black uppercase tracking-wider ${
                      seleccionado ? cfg.color : 'text-white/40'
                    }`}>
                      {cfg.label}
                    </span>
                    {seleccionado && <CheckCircle2 size={12} className="ml-auto text-current" />}
                  </div>
                  <p className={`text-[9px] leading-relaxed pl-5 ${seleccionado ? 'text-current opacity-70' : 'text-white/20'}`}>
                    {cfg.descripcion}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Alerta si es destrucción */}
          {acta.destino === 'destruccion' && (
            <div className="p-4 rounded-lg bg-red-500/[0.06] border border-red-500/25 flex items-start gap-3">
              <AlertTriangle size={14} className="text-red-400 shrink-0 mt-0.5" />
              <p className="text-[10px] text-red-300/70 leading-relaxed">
                <span className="font-black text-red-400">ATENCIÓN:</span> La destrucción de evidencia
                requiere auto motivado del tribunal, acta adicional con testigos y registro fotográfico
                del proceso. Conforme al Art. 225 COPP.
              </p>
            </div>
          )}

          <div className="mt-5">
            <InputField
              id={`${uid}-ubicacion`}
              label="Ubicación / Dirección del Destino Final"
              value={acta.ubicacionFinal}
              onChange={v => set({ ubicacionFinal: v })}
              placeholder={
                acta.destino === 'devolucion' ? 'Dirección del propietario...' :
                acta.destino === 'destruccion' ? 'Lugar donde se efectuará la destrucción...' :
                'Sala, piso, sección del archivo...'
              }
            />
          </div>
        </section>

        {/* ── Sección IV: Descripción de la Evidencia ──────── */}
        <section>
          <SectionHeader icon={FileText} label="Descripción de la Evidencia a Transferir" numero="IV." />
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor={`${uid}-desc`} className="block text-[9px] font-black text-fluent-text-muted uppercase tracking-[0.2em]">
                Descripción Detallada de la Evidencia
              </label>
              <textarea
                id={`${uid}-desc`}
                rows={4}
                value={acta.descripcionEvidencia}
                onChange={e => set({ descripcionEvidencia: e.target.value })}
                placeholder="Ej: Un (01) teléfono inteligente marca Samsung Galaxy A32, IMEI: 123456789012345, color negro, con funda plástica, embalado en bolsa hermética precintada con sello N° 001..."
                className="w-full text-xs bg-black/40 border border-white/10 rounded-[4px] px-3 py-2.5
                  text-white/80 placeholder-white/15 focus:outline-none focus:border-fluent-accent/50
                  focus:bg-black/60 transition-all hover:border-white/20 resize-none"
              />
            </div>

            {/* Estado de sellos */}
            <div className="space-y-1.5">
              <label className="block text-[9px] font-black text-fluent-text-muted uppercase tracking-[0.2em]">
                Estado de Sellos y Precintos al Momento del Traspaso
              </label>
              <div className="flex gap-3">
                {[
                  { val: 'intactos', label: 'Intactos', color: 'text-green-400', border: 'border-green-500/30 bg-green-500/10' },
                  { val: 'rotos', label: 'Rotos / Violados', color: 'text-red-400', border: 'border-red-500/30 bg-red-500/10' },
                  { val: 'reemplazados', label: 'Reemplazados', color: 'text-yellow-400', border: 'border-yellow-500/30 bg-yellow-500/10' },
                ].map(opt => (
                  <button
                    key={opt.val}
                    id={`sello-${opt.val}`}
                    onClick={() => set({ estadoSellos: opt.val as any })}
                    className={`flex-1 py-2.5 px-3 rounded-[4px] border text-[10px] font-black uppercase tracking-wider transition-all ${
                      acta.estadoSellos === opt.val
                        ? `${opt.border} ${opt.color}`
                        : 'border-white/5 bg-white/[0.02] text-white/25 hover:border-white/10'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Sección V: Transferencia ──────────────────────── */}
        <section>
          <SectionHeader icon={User} label="Datos de la Transferencia" numero="V." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Entregante (Perito) */}
            <div className="space-y-4 p-5 rounded-lg bg-fluent-accent/[0.03] border border-fluent-accent/10">
              <h5 className="text-[9px] font-black text-fluent-accent uppercase tracking-[0.2em] flex items-center gap-2">
                <User size={11} /> Perito Entregante
              </h5>
              <InputField
                id={`${uid}-ent-nombre`}
                label="Nombre Completo"
                value={acta.entregante.nombre}
                onChange={v => setEnt({ nombre: v })}
                placeholder="Apellidos, Nombre"
              />
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  id={`${uid}-ent-ci`}
                  label="Cédula de Identidad"
                  value={acta.entregante.ci}
                  onChange={v => setEnt({ ci: v })}
                  placeholder="V-00.000.000"
                />
                <InputField
                  id={`${uid}-ent-cargo`}
                  label="Cargo / Título"
                  value={acta.entregante.cargo}
                  onChange={v => setEnt({ cargo: v })}
                  placeholder="Perito Forense Digital"
                />
              </div>
              <InputField
                id={`${uid}-ent-org`}
                label="Organismo / Institución"
                value={acta.entregante.organismo}
                onChange={v => setEnt({ organismo: v })}
                placeholder="CICPC / CUFAN / MP / SEBIN..."
              />
            </div>

            {/* Receptor */}
            <div className="space-y-4 p-5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
              <h5 className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                <User size={11} /> Funcionario Receptor
              </h5>
              <InputField
                id={`${uid}-rec-nombre`}
                label="Nombre Completo"
                value={acta.receptor.nombre}
                onChange={v => setRec({ nombre: v })}
                placeholder="Apellidos, Nombre"
              />
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  id={`${uid}-rec-ci`}
                  label="Cédula de Identidad"
                  value={acta.receptor.ci}
                  onChange={v => setRec({ ci: v })}
                  placeholder="V-00.000.000"
                />
                <InputField
                  id={`${uid}-rec-cargo`}
                  label="Cargo / Título"
                  value={acta.receptor.cargo}
                  onChange={v => setRec({ cargo: v })}
                  placeholder="Ej: Archivista Judicial"
                />
              </div>
              <InputField
                id={`${uid}-rec-org`}
                label="Organismo / Institución"
                value={acta.receptor.organismo}
                onChange={v => setRec({ organismo: v })}
                placeholder="Tribunal / Ministerio Público..."
              />
            </div>
          </div>
        </section>

        {/* ── Sección VI: Observaciones ─────────────────────── */}
        <section>
          <SectionHeader icon={FileText} label="Observaciones e Incidencias" numero="VI." />
          <textarea
            id={`${uid}-obs`}
            rows={3}
            value={acta.observaciones}
            onChange={e => set({ observaciones: e.target.value })}
            placeholder="Registre cualquier anomalía, incidencia o condición especial observada durante la transferencia..."
            className="w-full text-xs bg-black/40 border border-white/10 rounded-[4px] px-3 py-2.5
              text-white/80 placeholder-white/15 focus:outline-none focus:border-fluent-accent/50
              focus:bg-black/60 transition-all hover:border-white/20 resize-none"
          />
        </section>

        {/* ── Bloque de Firma ───────────────────────────────── */}
        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/[0.06]">
          {[
            { titulo: 'Firma del Perito Entregante', datos: acta.entregante },
            { titulo: 'Firma del Funcionario Receptor', datos: acta.receptor },
          ].map((bloque, i) => (
            <div key={i} className="space-y-3">
              <div className="h-px w-full bg-white/20 mt-8" />
              <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.15em] text-center">
                {bloque.titulo}
              </p>
              {bloque.datos.nombre && (
                <p className="text-[10px] text-white/50 text-center font-medium">
                  {bloque.datos.nombre}
                </p>
              )}
              {bloque.datos.ci && (
                <p className="text-[9px] text-white/25 text-center font-mono">
                  C.I.: {bloque.datos.ci}
                </p>
              )}
              {bloque.datos.cargo && (
                <p className="text-[9px] text-white/25 text-center uppercase tracking-wider">
                  {bloque.datos.cargo}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* ── Pie legal ─────────────────────────────────────── */}
        <div className="p-5 rounded-lg bg-fluent-accent/[0.03] border border-fluent-accent/10 flex items-start gap-3">
          <Gavel size={14} className="text-fluent-accent/50 shrink-0 mt-0.5" />
          <p className="text-[9px] text-white/25 leading-relaxed">
            <span className="text-fluent-accent/60 font-black">Base Legal:</span>{' '}
            Art. 225 COPP — "Disposición de objetos decomisados"; Manual Único de Cadena de Custodia de
            Evidencias Físicas, Capítulo V (Disposición Final); Compendio de Protocolos de Actuación para
            el Fortalecimiento de la Investigación Penal 2022; ISO/IEC 27037:2012 §7 — Preservación de
            evidencia digital. El presente documento tiene plena validez probatoria conforme a la
            Ley sobre Mensajes de Datos y Firmas Electrónicas (LMDF-1999).
          </p>
        </div>
      </div>
    </div>
  );
}
