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
    <div className="card p-3 border shadow-sm bg-white rounded-3 mb-3">
      <div className="row g-2">
        <div className="col-12 col-sm-6 col-md">
          <input
            type="text"
            className="form-control"
            placeholder="Filtrar por ID de caso, título o perito..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="col-6 col-sm-3 col-md-auto" style={{ minWidth: '160px' }}>
          <select
            className="form-select"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value as any)}
          >
            {estados.map((e) => (
              <option key={e.value} value={e.value}>
                {e.label}
              </option>
            ))}
          </select>
        </div>
        <div className="col-6 col-sm-3 col-md-auto" style={{ minWidth: '160px' }}>
          <select
            className="form-select"
            value={filtroPrioridad}
            onChange={(e) => setFiltroPrioridad(e.target.value as any)}
          >
            {prioridades.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
