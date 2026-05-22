import { useState } from 'react';
import { CasoCMS, EstadoCaso, PrioridadCaso, Normativa } from '../../store/cmsStore';
import { getTiposProyecto, getPasosPorTipo, getFasesPorTipo } from '../../data/tiposProyecto';

interface NuevoCasoModalProps {
  onClose: () => void;
  onSubmit: (form: any) => Promise<void>;
  saving: boolean;
  normativas: Normativa[];
  estados: { value: EstadoCaso | 'todos'; label: string }[];
  prioridades: { value: PrioridadCaso | 'todos'; label: string }[];
}

const TIPOS = getTiposProyecto();
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
  normativasAplicadas: ['n1', 'n4', 'n8', 'n7'],
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
};

export default function NuevoCasoModal({
  onClose,
  onSubmit,
  saving,
  normativas,
  estados,
  prioridades,
}: NuevoCasoModalProps) {
  const [form, setForm] = useState({ ...FORM_INICIAL });

  const handleTipoChange = (tipo: typeof TIPOS[0]) => {
    const pasos = getPasosPorTipo(tipo.id);
    const fases = getFasesPorTipo(tipo.id);
    setForm(f => ({
      ...f,
      tipoProyecto: tipo.id,
      totalFases: fases.length,
      normativasAplicadas: pasos.flatMap(p => p.complianceIds.map(c => c.split('__')[0])).filter((v, i, a) => a.indexOf(v) === i),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-300 ease-out">
      <div className="fluent-mica border border-white/10 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.5)] flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <h2 className="font-bold text-white text-lg tracking-tight">Inicialización de Caso Técnico</h2>
          <button 
            onClick={onClose} 
            className="text-fluent-text-muted hover:text-white w-8 h-8 flex items-center justify-center rounded-[4px] hover:bg-white/5 transition-all font-bold"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Selector de Tipo de Proyecto */}
          <div className="space-y-3">
            <label className="fluent-label">Tipo de Proyecto Forense *</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {TIPOS.map(t => {
                const Icon = t.icon;
                const selected = form.tipoProyecto === t.id;
                return (
                  <button type="button" key={t.id} onClick={() => handleTipoChange(t)}
                    className={`relative flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition-all cursor-pointer text-center ${
                      selected
                        ? 'border-fluent-accent bg-fluent-accent/10 shadow-lg shadow-fluent-accent/20'
                        : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                    }`}>
                    <Icon size={28} className={selected ? 'text-fluent-accent' : 'text-white/40'} />
                    <div>
                      <p className={`text-xs font-bold ${selected ? 'text-white' : 'text-white/60'}`}>{t.label}</p>
                      <p className="text-[9px] text-fluent-text-muted mt-0.5 leading-relaxed">{t.descripcion.slice(0, 100)}...</p>
                    </div>
                    {selected && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-fluent-accent rounded-full flex items-center justify-center">
                        <span className="text-black text-[10px] font-black">✓</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="fluent-label">Identificador del Caso *</label>
              <input required className="fluent-input bg-white/[0.02]" placeholder="ej. SHA-2025-001" value={form.numeroCaso}
                onChange={e => setForm(f => ({ ...f, numeroCaso: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <label className="fluent-label">PRCC / Registro Judicial</label>
              <input className="fluent-input bg-white/[0.02]" placeholder="ID de Referencia..." value={form.numeroPRCC || ''}
                onChange={e => setForm(f => ({ ...f, numeroPRCC: e.target.value }))} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="fluent-label">Título Técnico *</label>
            <input required className="fluent-input bg-white/[0.02]" placeholder="Breve alcance de la investigación" value={form.titulo}
              onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} />
          </div>

          <div className="space-y-2">
            <label className="fluent-label">Contexto Operacional</label>
            <textarea className="fluent-input bg-white/[0.02] min-h-[80px] resize-none" placeholder="Antecedentes y alcance forense..." value={form.descripcion}
              onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} />
          </div>

          {/* Datos del Dispositivo */}
          <div className="p-5 bg-white/[0.03] rounded-lg border border-white/5">
            <label className="fluent-label block mb-4 text-[#FECF06]">Datos del Dispositivo</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="fluent-label text-[10px]">Marca</label>
                <input className="fluent-input bg-white/[0.02]" placeholder="ej. Samsung" value={form.dispositivo_marca || ''}
                  onChange={e => setForm(f => ({ ...f, dispositivo_marca: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <label className="fluent-label text-[10px]">Modelo</label>
                <input className="fluent-input bg-white/[0.02]" placeholder="ej. Galaxy A54" value={form.dispositivo_modelo || ''}
                  onChange={e => setForm(f => ({ ...f, dispositivo_modelo: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <label className="fluent-label text-[10px]">IMEI 1</label>
                <input className="fluent-input bg-white/[0.02] font-mono" placeholder="000000000000000" value={form.dispositivo_imei || ''}
                  onChange={e => setForm(f => ({ ...f, dispositivo_imei: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <label className="fluent-label text-[10px]">IMEI 2</label>
                <input className="fluent-input bg-white/[0.02] font-mono" placeholder="000000000000000" value={form.dispositivo_imei2 || ''}
                  onChange={e => setForm(f => ({ ...f, dispositivo_imei2: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <label className="fluent-label text-[10px]">Número de Línea</label>
                <input className="fluent-input bg-white/[0.02]" placeholder="0424-0000000" value={form.dispositivo_numero_tel || ''}
                  onChange={e => setForm(f => ({ ...f, dispositivo_numero_tel: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <label className="fluent-label text-[10px]">Operadora (SIM)</label>
                <input className="fluent-input bg-white/[0.02]" placeholder="ej. Movistar" value={form.dispositivo_sim_card || ''}
                  onChange={e => setForm(f => ({ ...f, dispositivo_sim_card: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <label className="fluent-label text-[10px]">Estado Físico</label>
                <select className="fluent-input bg-white/[0.02]" value={form.dispositivo_estado_fisico || ''}
                  onChange={e => setForm(f => ({ ...f, dispositivo_estado_fisico: e.target.value }))}>
                  <option value="" className="bg-fluent-bg">Seleccione...</option>
                  <option value="operativo" className="bg-fluent-bg">Operativo</option>
                  <option value="danos_pantalla" className="bg-fluent-bg">Daños en Pantalla</option>
                  <option value="sin_bateria" className="bg-fluent-bg">Sin Batería</option>
                  <option value="golpe_agua" className="bg-fluent-bg">Golpe de Agua</option>
                  <option value="multiple_danos" className="bg-fluent-bg">Múltiples Daños</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="fluent-label text-[10px]">Daños Visibles</label>
                <input className="fluent-input bg-white/[0.02]" placeholder="ej. Rayadura en pantalla" value={form.dispositivo_danos_visibles || ''}
                  onChange={e => setForm(f => ({ ...f, dispositivo_danos_visibles: e.target.value }))} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="fluent-label">Estado del Flujo de Trabajo</label>
              <select className="fluent-input bg-white/[0.02]" value={form.estado} onChange={e => setForm(f => ({ ...f, estado: e.target.value as EstadoCaso }))}>
                {estados.filter(e => e.value !== 'todos').map(e => <option key={e.value} value={e.value} className="bg-fluent-bg">{e.label}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="fluent-label">Prioridad de Investigación</label>
              <select className="fluent-input bg-white/[0.02]" value={form.prioridad} onChange={e => setForm(f => ({ ...f, prioridad: e.target.value as PrioridadCaso }))}>
                {prioridades.filter(p => p.value !== 'todos').map(p => <option key={p.value} value={p.value} className="bg-fluent-bg">{p.label}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="fluent-label">Oficial de Cumplimiento Líder *</label>
              <input required className="fluent-input bg-white/[0.02]" placeholder="Perito asignado" value={form.peritoLider}
                onChange={e => setForm(f => ({ ...f, peritoLider: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <label className="fluent-label">Fiscal Solicitante</label>
              <input className="fluent-input bg-white/[0.02]" placeholder="Nombre completo..." value={form.fiscal || ''}
                onChange={e => setForm(f => ({ ...f, fiscal: e.target.value }))} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="fluent-label">Base Legal Aplicable</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 p-5 bg-white/[0.03] rounded-lg border border-white/5">
              {normativas.filter(n => n.activa).map(n => (
                <label key={n.id} className="flex items-center gap-3 text-xs text-fluent-text-muted cursor-pointer hover:text-white transition-all group">
                  <input type="checkbox" className="w-4 h-4 accent-fluent-accent rounded-[3px] border-white/20 bg-white/5"
                    checked={form.normativasAplicadas.includes(n.id)}
                    onChange={e => setForm(f => ({
                      ...f, normativasAplicadas: e.target.checked
                        ? [...f.normativasAplicadas, n.id]
                        : f.normativasAplicadas.filter(id => id !== n.id)
                    }))} />
                  <span className="font-bold tracking-tight group-hover:text-fluent-accent">{n.codigo}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="fluent-label">Notas Preliminares de Evidencia</label>
            <textarea className="fluent-input bg-white/[0.02] min-h-[60px] resize-none" placeholder="Observaciones..." value={form.notas}
              onChange={e => setForm(f => ({ ...f, notas: e.target.value }))} />
          </div>
        </form>

        {/* Modal Footer */}
        <div className="p-5 border-t border-white/5 flex justify-end gap-3 bg-white/[0.02]">
          <button type="button" onClick={onClose} className="fluent-btn fluent-btn-secondary px-6 font-bold">Cancelar</button>
          <button type="submit" onClick={handleSubmit} disabled={saving} className="fluent-btn fluent-btn-primary px-8 flex items-center gap-2 shadow-xl">
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Procesando...
              </>
            ) : `Crear ${TIPOS.find(t => t.id === form.tipoProyecto)?.label || 'Caso'}`}
          </button>
        </div>
      </div>
    </div>
  );
}
