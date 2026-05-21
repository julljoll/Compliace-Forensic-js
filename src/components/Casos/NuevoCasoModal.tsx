import { useState } from 'react';
import { CasoCMS, EstadoCaso, PrioridadCaso, Normativa } from '../../store/cmsStore';

interface NuevoCasoModalProps {
  onClose: () => void;
  onSubmit: (form: any) => Promise<void>;
  saving: boolean;
  normativas: Normativa[];
  estados: { value: EstadoCaso | 'todos'; label: string }[];
  prioridades: { value: PrioridadCaso | 'todos'; label: string }[];
}

const FORM_INICIAL: Omit<CasoCMS, 'id' | 'fechaCreacion' | 'fechaUltimaActualizacion'> = {
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
  normativasAplicadas: ['n1', 'n2', 'n3', 'n4'],
  fasesCompletadas: 0,
  totalFases: 6,
  porcentajeCompletado: 0,
  totalEvidencias: 0,
  nivelCumplimientoGeneral: 'no_aplica',
  etiquetas: [],
  notas: '',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-300 ease-out">
      <div className="fluent-mica border border-white/10 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.5)] flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <h2 className="font-bold text-white text-lg tracking-tight">Technical Case Initialization</h2>
          <button 
            onClick={onClose} 
            className="text-fluent-text-muted hover:text-white w-8 h-8 flex items-center justify-center rounded-[4px] hover:bg-white/5 transition-all font-bold"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="fluent-label">Case Identifier *</label>
              <input required className="fluent-input bg-white/[0.02]" placeholder="e.g. SHA-2025-001" value={form.numeroCaso}
                onChange={e => setForm(f => ({ ...f, numeroCaso: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <label className="fluent-label">PRCC / Court Record</label>
              <input className="fluent-input bg-white/[0.02]" placeholder="Reference ID..." value={form.numeroPRCC || ''}
                onChange={e => setForm(f => ({ ...f, numeroPRCC: e.target.value }))} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="fluent-label">Technical Title *</label>
            <input required className="fluent-input bg-white/[0.02]" placeholder="Brief investigation scope" value={form.titulo}
              onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} />
          </div>

          <div className="space-y-2">
            <label className="fluent-label">Operational Context</label>
            <textarea className="fluent-input bg-white/[0.02] min-h-[80px] resize-none" placeholder="Background and forensic scope..." value={form.descripcion}
              onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="fluent-label">Workflow Status</label>
              <select className="fluent-input bg-white/[0.02]" value={form.estado} onChange={e => setForm(f => ({ ...f, estado: e.target.value as EstadoCaso }))}>
                {estados.filter(e => e.value !== 'todos').map(e => <option key={e.value} value={e.value} className="bg-fluent-bg">{e.label}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="fluent-label">Investigation Priority</label>
              <select className="fluent-input bg-white/[0.02]" value={form.prioridad} onChange={e => setForm(f => ({ ...f, prioridad: e.target.value as PrioridadCaso }))}>
                {prioridades.filter(p => p.value !== 'todos').map(p => <option key={p.value} value={p.value} className="bg-fluent-bg">{p.label}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="fluent-label">Lead Compliance Officer *</label>
              <input required className="fluent-input bg-white/[0.02]" placeholder="Assigned perito" value={form.peritoLider}
                onChange={e => setForm(f => ({ ...f, peritoLider: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <label className="fluent-label">Requesting Attorney</label>
              <input className="fluent-input bg-white/[0.02]" placeholder="Full name..." value={form.fiscal || ''}
                onChange={e => setForm(f => ({ ...f, fiscal: e.target.value }))} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="fluent-label">Applicable Legal Baseline</label>
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
            ) : 'Initialize Case'}
          </button>
        </div>
      </div>
    </div>
  );
}
