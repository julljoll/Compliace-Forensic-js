import { Search, Filter } from '../../atoms/AppleIcon';
import { EstadoCaso, PrioridadCaso } from '../../../store/cmsStore';

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
    <div className="apple-acrylic p-4 rounded-md flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-3 flex-1 min-w-[240px] bg-black/20 border border-[var(--co-separator)] rounded-md px-3 py-2 focus-within:border-[var(--apple-accent)] focus-within:shadow-[0_0_0_3px_rgba(254,207,6,0.15)] transition-all">
        <Search size={14} className="text-[#86868B] shrink-0" />
        <input
          type="text"
          placeholder="Filtrar por ID de caso, título o perito..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="bg-transparent text-sm text-white placeholder:text-[#86868B]/40 outline-none flex-1 font-medium"
        />
      </div>
      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
        <div className="flex items-center gap-2 flex-1 sm:flex-none">
           <Filter size={12} className="text-[#86868B]/50 uppercase" strokeWidth={3} />
           <select 
             value={filtroEstado} 
             onChange={e => setFiltroEstado(e.target.value as any)}
             className="flex-1 sm:flex-none bg-black/20 border border-[var(--co-separator)] rounded-md px-3 py-2 text-xs font-bold text-[#86868B] outline-none focus:border-[var(--apple-accent)] focus:shadow-[0_0_0_3px_rgba(254,207,6,0.15)] hover:border-white/10 transition-all cursor-pointer appearance-none"
           >
             {estados.map(e => <option key={e.value} value={e.value} className="bg-[#524000]">{e.label}</option>)}
           </select>
        </div>
        <select 
          value={filtroPrioridad} 
          onChange={e => setFiltroPrioridad(e.target.value as any)}
          className="flex-1 sm:flex-none bg-black/20 border border-[var(--co-separator)] rounded-md px-3 py-2 text-xs font-bold text-[#86868B] outline-none focus:border-[var(--apple-accent)] focus:shadow-[0_0_0_3px_rgba(254,207,6,0.15)] hover:border-white/10 transition-all cursor-pointer appearance-none"
        >
          {prioridades.map(p => <option key={p.value} value={p.value} className="bg-[#524000]">{p.label}</option>)}
        </select>
      </div>
    </div>
  );
}
