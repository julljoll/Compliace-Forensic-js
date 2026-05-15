import { useState } from 'react';
import { useCMSStore, EstadoCaso, PrioridadCaso, NivelCumplimiento } from '../store/cmsStore';
import { Plus, FolderOpen, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

// ── Componentes Modulares ───────────────────────────────────────────────────
import CasosFilters from '../components/Casos/CasosFilters';
import CasoCard from '../components/Casos/CasoCard';
import NuevoCasoModal from '../components/Casos/NuevoCasoModal';

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

const CUMPLIMIENTO_ICON: Record<NivelCumplimiento, { icon: any; color: string; label: string }> = {
  conforme:    { icon: CheckCircle2, color: 'text-green-400', label: 'Conforme' },
  parcial:     { icon: AlertTriangle, color: 'text-yellow-400', label: 'Parcial' },
  no_conforme: { icon: AlertTriangle, color: 'text-red-400', label: 'No Conforme' },
  no_aplica:   { icon: Clock, color: 'text-gray-400', label: 'N/A' },
};

export default function CasosPage() {
  const getCasosFiltrados = useCMSStore(state => state.getCasosFiltrados);
  const filtroEstado = useCMSStore(state => state.filtroEstado);
  const filtroPrioridad = useCMSStore(state => state.filtroPrioridad);
  const busqueda = useCMSStore(state => state.busqueda);
  const setFiltroEstado = useCMSStore(state => state.setFiltroEstado);
  const setFiltroPrioridad = useCMSStore(state => state.setFiltroPrioridad);
  const setBusqueda = useCMSStore(state => state.setBusqueda);
  const addCaso = useCMSStore(state => state.addCaso);
  const deleteCaso = useCMSStore(state => state.deleteCaso);
  const normativas = useCMSStore(state => state.normativas);
  
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const casos = getCasosFiltrados();

  const handleCreateCaso = async (formData: any) => {
    setSaving(true);
    try {
      const id = await addCaso(formData);
      if (id) {
        setShowForm(false);
      } else {
        alert('Error al registrar el caso.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Gestión de Casos</h1>
          <p className="text-sm text-cms-textMuted font-medium">{casos.length} casos registrados en el sistema</p>
        </div>
        <button 
          onClick={() => setShowForm(true)} 
          className="cms-btn cms-btn-primary flex items-center gap-2 shadow-lg shadow-cms-accent/20"
        >
          <Plus size={18} strokeWidth={3} />
          Nuevo Caso
        </button>
      </div>

      <CasosFilters 
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        filtroEstado={filtroEstado}
        setFiltroEstado={setFiltroEstado}
        filtroPrioridad={filtroPrioridad}
        setFiltroPrioridad={setFiltroPrioridad}
        estados={ESTADOS}
        prioridades={PRIORIDADES}
      />

      <div className="space-y-3">
        {casos.length === 0 ? (
          <div className="cms-card p-16 text-center border-dashed border-2 border-cms-border">
            <FolderOpen size={48} className="text-cms-accent mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-bold text-white mb-1">Sin resultados</h3>
            <p className="text-cms-textMuted max-w-xs mx-auto">No hay casos que coincidan con los filtros aplicados actualmente.</p>
          </div>
        ) : (
          casos.map(caso => (
            <CasoCard 
              key={caso.id}
              caso={caso}
              deleteCaso={deleteCaso}
              estados={ESTADOS}
              prioridades={PRIORIDADES}
              estadoColors={ESTADO_COLORS}
              prioridadColors={PRIORIDAD_COLORS}
              cumplimientoIcon={CUMPLIMIENTO_ICON}
            />
          ))
        )}
      </div>

      {showForm && (
        <NuevoCasoModal 
          onClose={() => setShowForm(false)}
          onSubmit={handleCreateCaso}
          saving={saving}
          normativas={normativas}
          estados={ESTADOS}
          prioridades={PRIORIDADES}
        />
      )}
    </div>
  );
}
