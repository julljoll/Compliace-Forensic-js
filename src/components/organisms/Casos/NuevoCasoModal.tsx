import { useState } from 'react';
import { Smartphone, HardDrive, BookOpen, Gavel, X, ArrowLeft, Check, User, Search } from '../../atoms/AppleIcon';
import { CasoCMS, EstadoCaso, PrioridadCaso, Normativa } from '../../../store/cmsStore';
import { getTiposProyecto, getFasesPorTipo, getTipoProyectoConfig, TipoProyecto } from '../../../data/tiposProyecto';

interface NuevoCasoModalProps {
  onClose: () => void;
  onSubmit: (form: any) => Promise<void>;
  saving: boolean;
  normativas: Normativa[];
  estados: { value: EstadoCaso | 'todos'; label: string }[];
  prioridades: { value: PrioridadCaso | 'todos'; label: string }[];
}

const TIPOS = getTiposProyecto();

const DISPOSITIVOS = [
  {
    id: 'forense_whatsapp' as TipoProyecto,
    titulo: 'Teléfono Android WhatsApp',
    icon: Smartphone,
    descripcion: 'Extracción y análisis forense de conversaciones de WhatsApp desde dispositivo móvil Android. Incluye adquisición lógica, parseo de msgstore.db, transcripción de audios .opus y dictamen pericial.',
    alcance: [
      'Extracción lógica con Avilla Forensics / Andriller',
      'Análisis de artefactos Android con ALEAPP',
      'Parseo de base de datos WhatsApp (msgstore.db)',
      'Transcripción de audios .opus a texto',
      'Generación de línea de tiempo de comunicaciones',
      'Dictamen pericial con metodología forense apegada a la ley',
    ],
    marcoLegal: [
      { codigo: 'Art. 187 COPP', descripcion: 'Licitud de la prueba y cadena de custodia' },
      { codigo: 'LEDI (2001)', descripcion: 'Ley Especial contra Delitos Informáticos' },
      { codigo: 'LMDF (1999)', descripcion: 'Ley sobre Mensajes de Datos y Firmas Electrónicas' },
      { codigo: 'ISO/IEC 27037:2012', descripcion: 'Estándar internacional para identificación, recolección y preservación de evidencia digital' },
      { codigo: 'NIST SP 800-101 r1', descripcion: 'Guía de forensia de dispositivos móviles' },
      { codigo: 'MUCCEF 2017', descripcion: 'Manual Único de Cadena de Custodia de Evidencias' },
    ],
    enfoque: 'La investigación se centrará en el análisis técnico-forense del dispositivo móvil Android, su contenido WhatsApp, y la documentación de la cadena de custodia conforme al marco legal venezolano y estándares internacionales.',
  },
  {
    id: 'forense_discoduro' as TipoProyecto,
    titulo: 'Computadora',
    icon: HardDrive,
    descripcion: 'Adquisición y análisis forense de discos duros, unidades de almacenamiento y correos electrónicos. Incluye imagen bit-a-bit, recuperación de archivos eliminados, análisis de cabeceras de correo y dictamen pericial.',
    alcance: [
      'Adquisición forense bit-a-bit con write-blocker hardware',
      'Imagen forense DD/E01 con verificación SHA-256',
      'Análisis de particiones y sistemas de archivos',
      'Recuperación de archivos eliminados y slack space',
      'Análisis de metadatos y línea de tiempo de actividad',
      'Dictamen pericial con metodología apegada a la ley',
    ],
    marcoLegal: [
      { codigo: 'Art. 187 COPP', descripcion: 'Licitud de la prueba y cadena de custodia' },
      { codigo: 'Art. 188 COPP', descripcion: 'Resguardo de evidencias' },
      { codigo: 'LEDI (2001)', descripcion: 'Ley Especial contra Delitos Informáticos' },
      { codigo: 'LMDF (1999)', descripcion: 'Ley sobre Mensajes de Datos y Firmas Electrónicas' },
      { codigo: 'ISO/IEC 27037:2012', descripcion: 'Estándar internacional para evidencia digital' },
      { codigo: 'ISO/IEC 27042:2015', descripcion: 'Estándar internacional para análisis forense digital' },
      { codigo: 'NIST SP 800-101 r1', descripcion: 'Guía de forensia de dispositivos' },
      { codigo: 'MUCCEF 2017', descripcion: 'Manual Único de Cadena de Custodia de Evidencias' },
    ],
    enfoque: 'La investigación se centrará en el análisis técnico-forense del dispositivo de almacenamiento o computadora, la recuperación de evidencia digital, y la documentación de la cadena de custodia conforme al marco legal venezolano y estándares internacionales.',
  },
];

const FORM_INICIAL: Omit<CasoCMS, 'id' | 'fechaCreacion' | 'fechaUltimaActualizacion'> = {
  tipoProyecto: 'forense_whatsapp',
  numeroCaso: '',
  titulo: '',
  descripcion: '',
  estado: 'iniciado',
  prioridad: 'media',
  peritoLider: '',
  fiscal: '',
  compliance: '',
  despachoFiscal: '',
  organismoOrdenante: '',
  normativasAplicadas: [],
  fasesCompletadas: 0,
  totalFases: 9,
  porcentajeCompletado: 0,
  totalEvidencias: 0,
  nivelCumplimientoGeneral: 'no_aplica',
  etiquetas: [],
  notas: '',
  dispositivo_marca: '',
  dispositivo_modelo: '',
  dispositivo_imei: '',
  dispositivo_imei2: '',
  dispositivo_sim_card: '',
  dispositivo_numero_tel: '',
  dispositivo_estado_fisico: '',
  dispositivo_modo_aislamiento: '',
  dispositivo_danos_visibles: '',
  dispositivo_bateria_estado: '',
  dispositivo_pantalla_estado: '',
  solicitante_nombre: '',
  solicitante_cedula: '',
  correo_investigar: '',
  correo_proveedor: '',
  discoduro_serial: '',
  discoduro_capacidad: '',
  discoduro_marca: '',
  discoduro_modelo: '',
};

export default function NuevoCasoModal({
  onClose,
  onSubmit,
  saving,
  normativas,
  estados,
  prioridades,
}: NuevoCasoModalProps) {
  const [step, setStep] = useState<'select' | 'form'>('select');
  const [selectedTipo, setSelectedTipo] = useState<TipoProyecto | null>(null);
  const [form, setForm] = useState({ ...FORM_INICIAL });

  const handleSelectDispositivo = (tipo: TipoProyecto) => {
    const fases = getFasesPorTipo(tipo);
    const config = getTipoProyectoConfig(tipo);
    setSelectedTipo(tipo);
    setForm(f => ({
      ...f,
      tipoProyecto: tipo,
      totalFases: fases.length,
      normativasAplicadas: config.normativasPorDefecto,
    }));
    setStep('form');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const dispositivo = DISPOSITIVOS.find(d => d.id === selectedTipo);

  // ── Step 1: Device Selection ──────────────────────────────────────────
  if (step === 'select') {
    return (
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-20 pb-8 px-6 overflow-y-auto bg-[#F5F5F7]">
        <div className="w-full max-w-5xl mx-auto space-y-8 apple-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-[#1D1D1F] tracking-tight">Nuevo Caso Forense</h2>
              <p className="text-sm text-[#86868B] font-medium mt-1">
                Seleccione el tipo de dispositivo a investigar para iniciar el caso.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-[#86868B] hover:text-[#1D1D1F] hover:bg-black/[0.04] transition-all"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DISPOSITIVOS.map(d => {
              const Icon = d.icon;
              return (
                <button
                  key={d.id}
                  onClick={() => handleSelectDispositivo(d.id)}
                  className="group relative flex flex-col text-left bg-white border border-black/[0.06] rounded-2xl p-8 hover:border-black/20 hover:shadow-lg transition-all duration-300 cursor-pointer shadow-sm"
                >
                  <div className="w-14 h-14 rounded-2xl bg-black/[0.03] flex items-center justify-center mb-6 group-hover:bg-[#0071E3]/10 group-hover:scale-105 transition-all">
                    <Icon size={28} className="text-[#86868B] group-hover:text-[#0071E3] transition-colors" />
                  </div>

                  <h3 className="text-xl font-bold text-[#1D1D1F] mb-2 group-hover:text-[#0071E3] transition-colors">
                    {d.titulo}
                  </h3>

                  <p className="text-sm text-[#86868B] leading-relaxed mb-6">
                    {d.descripcion}
                  </p>

                  <div className="mb-6">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#86868B] mb-3 flex items-center gap-2">
                      <Search size={12} />
                      Alcance de la Investigación
                    </h4>
                    <ul className="space-y-1.5">
                      {d.alcance.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-[#6E6E73]">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-[#0071E3] flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-black/[0.02] border border-black/[0.04] mb-6">
                    <p className="text-xs text-[#86868B] leading-relaxed italic">
                      {d.enfoque}
                    </p>
                  </div>

                  <div className="mt-auto">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#86868B] mb-3 flex items-center gap-2">
                      <Gavel size={12} />
                      Marco Legal Aplicable (RAG)
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {d.marcoLegal.map((m, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-black/[0.04] text-[10px] font-medium text-[#86868B] border border-black/[0.06]"
                          title={m.descripcion}
                        >
                          <BookOpen size={9} />
                          {m.codigo}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-black/[0.04] flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-[#0071E3] transition-all -translate-x-2 group-hover:translate-x-0">
                    <ArrowLeft size={14} className="text-white rotate-180" />
                  </div>
                </button>
              );
            })}
          </div>

          <p className="text-center text-[11px] text-[#86868B]/40 font-medium">
            Todos los casos se inician bajo el marco legal venezolano — COPP, LEDI, LMDF — y estándares internacionales ISO/IEC y NIST.
          </p>
        </div>
      </div>
    );
  }

  // ── Step 2: Case Form ────────────────────────────────────────────────
  const handleTipoChange = (tipo: typeof TIPOS[0]) => {
    const fases = getFasesPorTipo(tipo.id);
    const config = getTipoProyectoConfig(tipo.id);
    setForm(f => ({
      ...f,
      tipoProyecto: tipo.id,
      totalFases: fases.length,
      normativasAplicadas: config.normativasPorDefecto,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-20 pb-8 px-4 overflow-y-auto bg-[#F5F5F7]">
      <div className="bg-white border border-black/[0.08] rounded-xl w-full max-w-2xl shadow-[0_32px_64px_rgba(0,0,0,0.12)] flex flex-col apple-scale-in">
        <div className="p-5 border-b border-black/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setStep('select')}
              className="p-1.5 rounded-lg text-[#86868B] hover:text-[#1D1D1F] hover:bg-black/[0.04] transition-all"
              title="Volver a selección de dispositivo"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <h2 className="font-bold text-[#1D1D1F] text-lg tracking-tight">
                {dispositivo?.titulo || 'Inicialización de Caso'}
              </h2>
              <p className="text-[10px] text-[#86868B] font-medium">Complete los datos del caso</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#86868B] hover:text-[#1D1D1F] w-8 h-8 flex items-center justify-center rounded-[4px] hover:bg-black/[0.04] transition-all"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-black/[0.02] border border-black/[0.06]">
            {dispositivo && <dispositivo.icon size={20} className="text-[#0071E3]" />}
            <div>
              <p className="text-sm font-bold text-[#1D1D1F]">{dispositivo?.titulo}</p>
              <p className="text-[10px] text-[#86868B]">Tipo de investigación seleccionado</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider">Variante Técnica</label>
            <div className="flex gap-2">
              {TIPOS.filter(t => {
                if (selectedTipo === 'forense_whatsapp') return t.id === 'forense_whatsapp';
                return t.id !== 'forense_whatsapp';
              }).map(t => {
                const Icon = t.icon;
                const selected = form.tipoProyecto === t.id;
                return (
                  <button type="button" key={t.id} onClick={() => handleTipoChange(t)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                      selected
                        ? 'border-[#0071E3] bg-[#0071E3]/10 text-[#0071E3]'
                        : 'border-black/[0.1] text-[#86868B] hover:border-black/20'
                    }`}>
                    <Icon size={14} />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider">Identificador del Caso *</label>
              <input required className="fluent-input" placeholder="ej. SHA-2025-001" value={form.numeroCaso}
                onChange={e => setForm(f => ({ ...f, numeroCaso: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider">PRCC / Registro Judicial</label>
              <input className="fluent-input" placeholder="ID de Referencia..." value={form.numeroPRCC || ''}
                onChange={e => setForm(f => ({ ...f, numeroPRCC: e.target.value }))} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider">Título Técnico *</label>
            <input required className="fluent-input" placeholder="Breve alcance de la investigación" value={form.titulo}
              onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider">Contexto Operacional</label>
            <textarea className="fluent-input min-h-[60px] resize-none" placeholder="Antecedentes y alcance forense..." value={form.descripcion}
              onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} />
          </div>

          <div className="p-5 bg-black/[0.02] rounded-lg border border-black/[0.06] space-y-4">
            <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider flex items-center gap-2">
              <User size={12} />
              Datos del Solicitante de la Experticia
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#86868B]">Nombre Completo *</label>
                <input required className="fluent-input" placeholder="ej. Juan Pérez" value={form.solicitante_nombre || ''}
                  onChange={e => setForm(f => ({ ...f, solicitante_nombre: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#86868B]">Cédula de Identidad *</label>
                <input required className="fluent-input" placeholder="ej. V-12345678" value={form.solicitante_cedula || ''}
                  onChange={e => setForm(f => ({ ...f, solicitante_cedula: e.target.value }))} />
              </div>
            </div>
          </div>

          {form.tipoProyecto === 'forense_whatsapp' && (
            <div className="p-5 bg-black/[0.02] rounded-lg border border-black/[0.06] space-y-4">
              <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider flex items-center gap-2">
                <Smartphone size={12} />
                Datos del Dispositivo Móvil
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#86868B]">Marca</label>
                  <input className="fluent-input" placeholder="ej. Samsung" value={form.dispositivo_marca || ''}
                    onChange={e => setForm(f => ({ ...f, dispositivo_marca: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#86868B]">Modelo</label>
                  <input className="fluent-input" placeholder="ej. Galaxy S23" value={form.dispositivo_modelo || ''}
                    onChange={e => setForm(f => ({ ...f, dispositivo_modelo: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#86868B]">Estado Físico</label>
                  <select className="fluent-input" value={form.dispositivo_estado_fisico || ''}
                    onChange={e => setForm(f => ({ ...f, dispositivo_estado_fisico: e.target.value }))}>
                    <option value="">Seleccione...</option>
                    <option value="operativo">Operativo</option>
                    <option value="danos_pantalla">Daños en Pantalla</option>
                    <option value="sin_bateria">Sin Batería</option>
                    <option value="golpe_agua">Golpe de Agua</option>
                    <option value="multiple_danos">Múltiples Daños</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {form.tipoProyecto === 'forense_email' && (
            <div className="p-5 bg-black/[0.02] rounded-lg border border-black/[0.06] space-y-4">
              <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider">Datos del Correo Electrónico a Investigar</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#86868B]">Correo a Investigar *</label>
                  <input required type="email" className="fluent-input" placeholder="ej. usuario@dominio.com" value={form.correo_investigar || ''}
                    onChange={e => setForm(f => ({ ...f, correo_investigar: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#86868B]">Proveedor / Servidor</label>
                  <input required className="fluent-input" placeholder="ej. Gmail, Outlook, Corporativo" value={form.correo_proveedor || ''}
                    onChange={e => setForm(f => ({ ...f, correo_proveedor: e.target.value }))} />
                </div>
              </div>
            </div>
          )}

          {form.tipoProyecto === 'forense_discoduro' && (
            <div className="p-5 bg-black/[0.02] rounded-lg border border-black/[0.06] space-y-4">
              <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider">Datos del Disco Duro / Unidad</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#86868B]">Marca</label>
                  <input className="fluent-input" placeholder="ej. Western Digital" value={form.discoduro_marca || ''}
                    onChange={e => setForm(f => ({ ...f, discoduro_marca: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#86868B]">Modelo</label>
                  <input className="fluent-input" placeholder="ej. Blue WD10EZEX" value={form.discoduro_modelo || ''}
                    onChange={e => setForm(f => ({ ...f, discoduro_modelo: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#86868B]">Número de Serie *</label>
                  <input required className="fluent-input font-mono" placeholder="ej. WCC6Y1234567" value={form.discoduro_serial || ''}
                    onChange={e => setForm(f => ({ ...f, discoduro_serial: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#86868B]">Capacidad *</label>
                  <input required className="fluent-input" placeholder="ej. 1 TB, 500 GB" value={form.discoduro_capacidad || ''}
                    onChange={e => setForm(f => ({ ...f, discoduro_capacidad: e.target.value }))} />
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider">Estado del Flujo de Trabajo</label>
              <select className="fluent-input" value={form.estado} onChange={e => setForm(f => ({ ...f, estado: e.target.value as EstadoCaso }))}>
                {estados.filter(e => e.value !== 'todos').map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider">Prioridad de Investigación</label>
              <select className="fluent-input" value={form.prioridad} onChange={e => setForm(f => ({ ...f, prioridad: e.target.value as PrioridadCaso }))}>
                {prioridades.filter(p => p.value !== 'todos').map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider">Perito Líder *</label>
              <input required className="fluent-input" placeholder="Perito asignado" value={form.peritoLider}
                onChange={e => setForm(f => ({ ...f, peritoLider: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider">Fiscal Solicitante</label>
              <input className="fluent-input" placeholder="Nombre completo..." value={form.fiscal || ''}
                onChange={e => setForm(f => ({ ...f, fiscal: e.target.value }))} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider">Base Legal Aplicable</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 p-5 bg-black/[0.02] rounded-lg border border-black/[0.06]">
              {normativas.filter(n => n.activa).map(n => (
                <label key={n.id} className="flex items-center gap-3 text-xs text-[#86868B] cursor-pointer hover:text-[#1D1D1F] transition-all group">
                  <input type="checkbox" className="w-4 h-4 accent-[#0071E3] rounded-[3px] border-black/20"
                    checked={form.normativasAplicadas.includes(n.id)}
                    onChange={e => setForm(f => ({
                      ...f, normativasAplicadas: e.target.checked
                        ? [...f.normativasAplicadas, n.id]
                        : f.normativasAplicadas.filter(id => id !== n.id)
                    }))} />
                  <span className="font-bold tracking-tight group-hover:text-[#0071E3]">{n.codigo}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider">Notas Preliminares</label>
            <textarea className="fluent-input min-h-[50px] resize-none" placeholder="Observaciones..." value={form.notas}
              onChange={e => setForm(f => ({ ...f, notas: e.target.value }))} />
          </div>
        </form>

        <div className="p-5 border-t border-black/[0.06] flex justify-between items-center">
          <button
            type="button"
            onClick={() => setStep('select')}
            className="flex items-center gap-2 text-xs text-[#86868B] hover:text-[#1D1D1F] transition-all"
          >
            <ArrowLeft size={12} />
            Cambiar dispositivo
          </button>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg text-xs font-bold text-[#86868B] hover:text-[#1D1D1F] hover:bg-black/[0.04] transition-all">
              Cancelar
            </button>
            <button type="submit" onClick={handleSubmit} disabled={saving}
              className="px-6 py-2 rounded-lg bg-[#0071E3] text-white text-xs font-bold hover:bg-[#0077ED] disabled:opacity-50 transition-all flex items-center gap-2 shadow-xl"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <Check size={14} />
                  Iniciar Caso
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
