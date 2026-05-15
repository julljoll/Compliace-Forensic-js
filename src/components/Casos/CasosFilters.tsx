import { Search, Filter } from 'lucide-react';
import { EstadoCaso, PrioridadCaso } from '../../store/cmsStore';

interface CasosFiltersProps {
  busqueda: string;
  setBusqueda: (v: string) => void;
  filtroEstado: EstadoCaso | 'todos';
  setFiltroEstado: (v: EstadoCaso | 'todos') => void;
  filtroPrioridad: PrioridadCaso | 'todos';
  setFiltroPrioridad: (v: PrioridadCaso | 'todos') => void;
  estados: { value: EstadoCaso | 'todos'; label: string }[];
  prioridades: { value: PrioridadCaso | 'todos'; label: string }[];
}

export default function CasosFilters({
  busqueda,
  setBusqueda,
  filtroEstado,
  setFiltroEstado,
  filtroPrioridad,
  setFiltroPrioridad,
  estados,
  prioridades,
}: CasosFiltersProps) {
  return (
    <div className="cms-card p-4 flex flex-wrap items-center gap-4 dark:bg-cms-sidebar/50">
      <div className="flex items-center gap-2 flex-1 min-w-48 bg-cms-surface rounded-lg px-3 py-2 border border-cms-border focus-within:border-cms-accent/50 transition-colors">
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
        <select 
          value={filtroEstado} 
          onChange={e => setFiltroEstado(e.target.value as any)}
          className="bg-cms-surface border border-cms-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-cms-accent/50 transition-colors"
        >
          {estados.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
        </select>
        <select 
          value={filtroPrioridad} 
          onChange={e => setFiltroPrioridad(e.target.value as any)}
          className="bg-cms-surface border border-cms-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-cms-accent/50 transition-colors"
        >
          {prioridades.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
      </div>
    </div>
  );
}
