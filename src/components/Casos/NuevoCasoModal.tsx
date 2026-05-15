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
  pertiLider: '',
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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-cms-card border border-cms-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl dark:bg-cms-bg">
        <div className="p-6 border-b border-cms-border flex items-center justify-between sticky top-0 bg-cms-card/80 backdrop-blur-md z-10">
          <h2 className="font-black text-white text-xl tracking-tight">Registrar Nuevo Caso</h2>
          <button 
            onClick={onClose} 
            className="text-cms-textMuted hover:text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="cms-label">Número de Caso *</label>
              <input required className="cms-input" placeholder="EJ-2025-001" value={form.numeroCaso}
                onChange={e => setForm(f => ({ ...f, numeroCaso: e.target.value }))} />
            </div>
            <div>
              <label className="cms-label">N° PRCC / Expediente</label>
              <input className="cms-input" placeholder="PRCC-..." value={form.numeroPRCC || ''}
                onChange={e => setForm(f => ({ ...f, numeroPRCC: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="cms-label">Título del Caso *</label>
            <input required className="cms-input" placeholder="Descripción breve del caso" value={form.titulo}
              onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} />
          </div>
          <div>
            <label className="cms-label">Descripción</label>
            <textarea className="cms-input min-h-[80px] resize-none" placeholder="Contexto y antecedentes del caso..." value={form.descripcion}
              onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="cms-label">Estado</label>
              <select className="cms-input" value={form.estado} onChange={e => setForm(f => ({ ...f, estado: e.target.value as EstadoCaso }))}>
                {estados.filter(e => e.value !== 'todos').map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
              </select>
            </div>
            <div>
              <label className="cms-label">Prioridad</label>
              <select className="cms-input" value={form.prioridad} onChange={e => setForm(f => ({ ...f, priority: e.target.value as PrioridadCaso }))}>
                {prioridades.filter(p => p.value !== 'todos').map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="cms-label">Perito Líder *</label>
              <input required className="cms-input" placeholder="Nombre del perito" value={form.pertiLider}
                onChange={e => setForm(f => ({ ...f, pertiLider: e.target.value }))} />
            </div>
            <div>
              <label className="cms-label">Abogado Solicitante</label>
              <input className="cms-input" placeholder="Nombre del abogado" value={form.fiscal || ''}
                onChange={e => setForm(f => ({ ...f, fiscal: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="cms-label">Organismo Ordenante</label>
              <input className="cms-input" placeholder="MP / CICPC / ..." value={form.organismoOrdenante || ''}
                onChange={e => setForm(f => ({ ...f, organismoOrdenante: e.target.value }))} />
            </div>
            <div>
              <label className="cms-label">Despacho Legal</label>
              <input className="cms-input" placeholder="Despacho o Firma..." value={form.despachoFiscal || ''}
                onChange={e => setForm(f => ({ ...f, despachoFiscal: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="cms-label">Normativas Aplicables</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 p-4 bg-cms-surface/30 rounded-xl border border-cms-border">
              {normativas.filter(n => n.activa).map(n => (
                <label key={n.id} className="flex items-center gap-3 text-xs text-cms-textMuted cursor-pointer hover:text-white transition-colors group">
                  <input type="checkbox" className="w-4 h-4 accent-cms-accent rounded border-cms-border bg-cms-surface"
                    checked={form.normativasAplicadas.includes(n.id)}
                    onChange={e => setForm(f => ({
                      ...f, normativasAplicadas: e.target.checked
                        ? [...f.normativasAplicadas, n.id]
                        : f.normativasAplicadas.filter(id => id !== n.id)
                    }))} />
                  <span className="group-hover:text-cms-accent transition-colors">{n.codigo}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="cms-label">Notas Iniciales</label>
            <textarea className="cms-input min-h-[60px] resize-none" placeholder="Observaciones..." value={form.notas}
              onChange={e => setForm(f => ({ ...f, notas: e.target.value }))} />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-cms-border">
            <button type="button" onClick={onClose} className="cms-btn cms-btn-secondary px-6">Cancelar</button>
            <button type="submit" disabled={saving} className="cms-btn cms-btn-primary px-8 flex items-center gap-2">
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Guardando...
                </>
              ) : 'Registrar Caso'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
