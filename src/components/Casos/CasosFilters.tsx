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
    <div className="fluent-mica p-4 rounded-lg flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-3 flex-1 min-w-[240px] bg-white/[0.03] border border-white/5 border-b-white/20 rounded-[4px] px-3 py-1.5 focus-within:bg-white/[0.05] focus-within:border-b-fluent-accent transition-all">
        <Search size={14} className="text-fluent-text-muted shrink-0" />
        <input
          type="text"
          placeholder="Filter by case ID, title or perito..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="bg-transparent text-sm text-white placeholder:text-fluent-text-muted/40 outline-none flex-1 font-medium"
        />
      </div>
      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
        <div className="flex items-center gap-2 flex-1 sm:flex-none">
           <Filter size={12} className="text-fluent-text-muted/50 uppercase" strokeWidth={3} />
           <select 
             value={filtroEstado} 
             onChange={e => setFiltroEstado(e.target.value as any)}
             className="bg-white/[0.03] border border-white/5 border-b-white/20 rounded-[4px] px-3 py-1.5 text-xs font-bold text-fluent-text-muted outline-none focus:border-b-fluent-accent hover:bg-white/[0.05] transition-all cursor-pointer"
           >
             {estados.map(e => <option key={e.value} value={e.value} className="bg-fluent-bg">{e.label}</option>)}
           </select>
        </div>
        <select 
          value={filtroPrioridad} 
          onChange={e => setFiltroPrioridad(e.target.value as any)}
          className="flex-1 sm:flex-none bg-white/[0.03] border border-white/5 border-b-white/20 rounded-[4px] px-3 py-1.5 text-xs font-bold text-fluent-text-muted outline-none focus:border-b-fluent-accent hover:bg-white/[0.05] transition-all cursor-pointer"
        >
          {prioridades.map(p => <option key={p.value} value={p.value} className="bg-fluent-bg">{p.label}</option>)}
        </select>
      </div>
    </div>
  );
}
