import { useState } from 'react';
import { useCMSStore, CasoCMS, EstadoCaso, PrioridadCaso, NivelCumplimiento } from '../store/cmsStore';
import { Link } from 'react-router-dom';
import {
  Plus, Search, Filter, FolderOpen, Calendar, User,
  ShieldCheck, AlertTriangle, CheckCircle2, Clock, ChevronRight, Trash2
} from 'lucide-react';

const ESTADOS: { value: EstadoCaso | 'todos'; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'iniciado', label: 'Iniciado' },
  { value: 'en_proceso', label: 'En Proceso' },
  { value: 'analisis', label: 'Análisis' },
  { value: 'informe', label: 'Informe' },
  { value: 'cerrado', label: 'Cerrado' },
  { value: 'archivado', label: 'Archivado' },
];

const PRIORIDADES: { value: PrioridadCaso | 'todos'; label: string }[] = [
  { value: 'todos', label: 'Todas' },
  { value: 'critica', label: 'Crítica' },
  { value: 'alta', label: 'Alta' },
  { value: 'media', label: 'Media' },
  { value: 'baja', label: 'Baja' },
];

const ESTADO_COLORS: Record<string, string> = {
  iniciado: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  en_proceso: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
  analisis: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  informe: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
  cerrado: 'bg-green-500/15 text-green-300 border-green-500/30',
  archivado: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
};

const PRIORIDAD_COLORS: Record<string, string> = {
  critica: 'bg-red-500',
  alta: 'bg-orange-500',
  media: 'bg-yellow-500',
  baja: 'bg-green-500',
};

const CUMPLIMIENTO_ICON: Record<NivelCumplimiento, { icon: typeof CheckCircle2; color: string; label: string }> = {
  conforme:    { icon: CheckCircle2, color: 'text-green-400', label: 'Conforme' },
  parcial:     { icon: AlertTriangle, color: 'text-yellow-400', label: 'Parcial' },
  no_conforme: { icon: AlertTriangle, color: 'text-red-400', label: 'No Conforme' },
  no_aplica:   { icon: Clock, color: 'text-gray-400', label: 'N/A' },
};

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

export default function CasosPage() {
  const { getCasosFiltrados, filtroEstado, filtroPrioridad, busqueda, setFiltroEstado, setFiltroPrioridad, setBusqueda, addCaso, deleteCaso, normativas } = useCMSStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...FORM_INICIAL });
  const [saving, setSaving] = useState(false);

  const casos = getCasosFiltrados();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      addCaso(form);
      setForm({ ...FORM_INICIAL });
      setShowForm(false);
      setSaving(false);
    }, 300);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Gestión de Casos</h1>
          <p className="text-sm text-cms-textMuted">{casos.length} casos encontrados</p>
        </div>
        <button onClick={() => setShowForm(true)} className="cms-btn cms-btn-primary flex items-center gap-2">
          <Plus size={16} />
          Nuevo Caso
        </button>
      </div>

      {/* ── Filtros ─────────────────────────────────────── */}
      <div className="cms-card p-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 flex-1 min-w-48 bg-cms-surface rounded-lg px-3 py-2 border border-cms-border">
          <Search size={14} className="text-cms-textMuted shrink-0" />
          <input
            type="text"
            placeholder="Buscar por número, título..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="bg-transparent text-sm text-white placeholder:text-cms-textMuted outline-none flex-1"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-cms-textMuted" />
          <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value as any)}
            className="bg-cms-surface border border-cms-border rounded-lg px-3 py-2 text-sm text-white outline-none">
            {ESTADOS.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
          </select>
          <select value={filtroPrioridad} onChange={e => setFiltroPrioridad(e.target.value as any)}
            className="bg-cms-surface border border-cms-border rounded-lg px-3 py-2 text-sm text-white outline-none">
            {PRIORIDADES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>
      </div>

      {/* ── Lista de Casos ────────────────────────────── */}
      <div className="space-y-3">
        {casos.length === 0 ? (
          <div className="cms-card p-12 text-center">
            <FolderOpen size={40} className="text-cms-accent mx-auto mb-3 opacity-40" />
            <p className="text-cms-textMuted">No hay casos que coincidan con los filtros.</p>
          </div>
        ) : casos.map(caso => {
          const estadoConf = ESTADO_COLORS[caso.estado] || ESTADO_COLORS.iniciado;
          const cumplConf = CUMPLIMIENTO_ICON[caso.nivelCumplimientoGeneral];
          const CumplIcon = cumplConf.icon;
          return (
            <div key={caso.id} className="cms-card p-5 flex items-center gap-5 hover:border-cms-accent/30 transition-colors group">
              <div className={`w-1 h-16 rounded-full ${PRIORIDAD_COLORS[caso.prioridad]} shrink-0`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-mono font-black text-cms-accent text-sm">{caso.numeroCaso}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${estadoConf}`}>
                    {ESTADOS.find(e => e.value === caso.estado)?.label}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cms-surface border border-cms-border text-cms-textMuted">
                    {PRIORIDADES.find(p => p.value === caso.prioridad)?.label}
                  </span>
                </div>
                <h3 className="font-bold text-white truncate mb-1">{caso.titulo}</h3>
                <div className="flex items-center gap-4 text-xs text-cms-textMuted">
                  <span className="flex items-center gap-1"><User size={11} />{caso.pertiLider}</span>
                  <span className="flex items-center gap-1"><Calendar size={11} />{new Date(caso.fechaCreacion).toLocaleDateString('es')}</span>
                  <span>{caso.totalEvidencias} evidencias</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <CumplIcon size={16} className={cumplConf.color} title={cumplConf.label} />
                <div className="w-24">
                  <div className="flex justify-between text-[10px] text-cms-textMuted mb-0.5">
                    <span>Progreso</span>
                    <span>{caso.porcentajeCompletado}%</span>
                  </div>
                  <div className="h-1.5 bg-cms-surface rounded-full">
                    <div className="h-full bg-cms-accent rounded-full transition-all" style={{ width: `${caso.porcentajeCompletado}%` }} />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link to={`/casos/${caso.id}`} className="p-2 rounded-lg bg-cms-accent/10 text-cms-accent hover:bg-cms-accent/20 transition-colors">
                  <ChevronRight size={16} />
                </Link>
                <button onClick={() => deleteCaso(caso.id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Modal Nuevo Caso ───────────────────────────── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-cms-card border border-cms-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-cms-border flex items-center justify-between">
              <h2 className="font-black text-white text-lg">Registrar Nuevo Caso</h2>
              <button onClick={() => setShowForm(false)} className="text-cms-textMuted hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="cms-label">Estado</label>
                  <select className="cms-input" value={form.estado} onChange={e => setForm(f => ({ ...f, estado: e.target.value as EstadoCaso }))}>
                    {ESTADOS.filter(e => e.value !== 'todos').map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="cms-label">Prioridad</label>
                  <select className="cms-input" value={form.prioridad} onChange={e => setForm(f => ({ ...f, prioridad: e.target.value as PrioridadCaso }))}>
                    {PRIORIDADES.filter(p => p.value !== 'todos').map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="cms-label">Perito Líder *</label>
                  <input required className="cms-input" placeholder="Nombre del perito" value={form.pertiLider}
                    onChange={e => setForm(f => ({ ...f, pertiLider: e.target.value }))} />
                </div>
                <div>
                  <label className="cms-label">Fiscal</label>
                  <input className="cms-input" placeholder="Nombre del fiscal" value={form.fiscal || ''}
                    onChange={e => setForm(f => ({ ...f, fiscal: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="cms-label">Organismo Ordenante</label>
                  <input className="cms-input" placeholder="MP / CICPC / ..." value={form.organismoOrdenante || ''}
                    onChange={e => setForm(f => ({ ...f, organismoOrdenante: e.target.value }))} />
                </div>
                <div>
                  <label className="cms-label">Despacho Fiscal</label>
                  <input className="cms-input" placeholder="Despacho..." value={form.despachoFiscal || ''}
                    onChange={e => setForm(f => ({ ...f, despachoFiscal: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="cms-label">Normativas Aplicables</label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {normativas.filter(n => n.activa).map(n => (
                    <label key={n.id} className="flex items-center gap-2 text-xs text-cms-textMuted cursor-pointer hover:text-white">
                      <input type="checkbox" className="accent-cms-accent"
                        checked={form.normativasAplicadas.includes(n.id)}
                        onChange={e => setForm(f => ({
                          ...f, normativasAplicadas: e.target.checked
                            ? [...f.normativasAplicadas, n.id]
                            : f.normativasAplicadas.filter(id => id !== n.id)
                        }))} />
                      {n.codigo}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="cms-label">Notas Iniciales</label>
                <textarea className="cms-input min-h-[60px] resize-none" placeholder="Observaciones..." value={form.notas}
                  onChange={e => setForm(f => ({ ...f, notas: e.target.value }))} />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="cms-btn cms-btn-secondary">Cancelar</button>
                <button type="submit" disabled={saving} className="cms-btn cms-btn-primary">
                  {saving ? 'Guardando...' : 'Registrar Caso'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
