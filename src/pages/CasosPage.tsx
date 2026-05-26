import { useState } from 'react';
import { useCMSStore, EstadoCaso, PrioridadCaso, NivelCumplimiento } from '../store/cmsStore';
import { FolderOpen, CheckCircle2, AlertTriangle, Clock, BookOpen, ArrowLeft } from '../components/atoms/AppleIcon';
import { getTareasPorDefecto, TipoProyecto } from '../data/tiposProyecto';

// ── Componentes Modulares ───────────────────────────────────────────────────
import CasosFilters from '../components/organisms/Casos/CasosFilters';
import CasoCard from '../components/organisms/Casos/CasoCard';
import NuevoCasoModal, { DISPOSITIVOS } from '../components/organisms/Casos/NuevoCasoModal';

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
  iniciado: 'bg-blue-500/10 text-[#007AFF] border-blue-500/20',
  en_proceso: 'bg-yellow-500/10 text-[#FF9500] border-yellow-500/20',
  analisis: 'bg-purple-500/10 text-[#AF52DE] border-purple-500/20',
  informe: 'bg-indigo-500/10 text-[#5856D6] border-indigo-500/20',
  cerrado: 'bg-green-500/10 text-[#34C759] border-green-500/20',
  archivado: 'bg-gray-500/10 text-[#86868B] border-gray-500/20',
};

const PRIORIDAD_COLORS: Record<string, string> = {
  critica: 'bg-[#FF3B30]',
  alta: 'bg-[#FF9500]',
  media: 'bg-[#FFCC00]',
  baja: 'bg-[#34C759]',
};

const CUMPLIMIENTO_ICON: Record<NivelCumplimiento, { icon: any; color: string; label: string }> = {
  conforme:    { icon: CheckCircle2, color: 'text-[#34C759]', label: 'Conforme' },
  parcial:     { icon: AlertTriangle, color: 'text-[#FF9500]', label: 'Parcial' },
  no_conforme: { icon: AlertTriangle, color: 'text-[#FF3B30]', label: 'No Conforme' },
  no_aplica:   { icon: Clock, color: 'text-[#86868B]', label: 'N/A' },
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
  const initSteps = useCMSStore(state => state.initSteps);
  const addTarea = useCMSStore(state => state.addTarea);
  const normativas = useCMSStore(state => state.normativas);
  
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedTipo, setSelectedTipo] = useState<TipoProyecto | null>(null);

  const casos = getCasosFiltrados();

  const handleSelectDispositivo = (tipo: TipoProyecto) => {
    setSelectedTipo(tipo);
    setShowForm(true);
  };

  const handleCreateCaso = async (formData: any) => {
    setSaving(true);
    try {
      const id = await addCaso(formData);
      if (id) {
        const tipo = formData.tipoProyecto || 'forense_whatsapp';
        const tareasDefecto = getTareasPorDefecto(tipo);

        initSteps(id);

        tareasDefecto.forEach(t => {
          addTarea({
            casoId: id,
            pasoId: t.pasoId,
            titulo: t.titulo,
            descripcion: '',
            asignadoA: formData.peritoLider || '',
            estado: 'pendiente',
            prioridad: 'media',
            fechaVencimiento: undefined,
            normativasRelacionadas: [],
            observaciones: '',
            porcentaje: 0,
          });
        });

        setShowForm(false);
        setSelectedTipo(null);
      } else {
        alert('Error al registrar el caso.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 apple-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1D1D1F] tracking-tight">Gestión de Casos</h1>
        <p className="text-sm text-[#86868B] font-medium mt-1">
          Seleccione el tipo de dispositivo a investigar o revise los casos existentes.
        </p>
      </div>

      {/* ── Device Selection Cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {DISPOSITIVOS.map(d => {
          const Icon = d.icon;
          return (
            <button
              key={d.id}
              onClick={() => handleSelectDispositivo(d.id)}
              className="apple-card group relative flex flex-col text-left p-7 hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-black/[0.03] flex items-center justify-center mb-5 group-hover:bg-[#0071E3]/10 group-hover:scale-105 transition-all">
                <Icon size={24} className="text-[#86868B] group-hover:text-[#0071E3] transition-colors" />
              </div>

              <h3 className="text-lg font-bold text-[#1D1D1F] mb-1.5 group-hover:text-[#0071E3] transition-colors">
                {d.titulo}
              </h3>

              <p className="text-xs text-[#86868B] leading-relaxed mb-4">
                {d.descripcion}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {d.marcoLegal.slice(0, 4).map((m, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/[0.04] text-[9px] font-medium text-[#86868B] border border-black/[0.06]"
                    title={m.descripcion}
                  >
                    <BookOpen size={8} />
                    {m.codigo}
                  </span>
                ))}
                {d.marcoLegal.length > 4 && (
                  <span className="text-[9px] text-[#86868B]/50 font-medium">+{d.marcoLegal.length - 4}</span>
                )}
              </div>

              <div className="absolute top-5 right-5 w-7 h-7 rounded-full bg-black/[0.04] flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-[#0071E3] transition-all -translate-x-2 group-hover:translate-x-0">
                <ArrowLeft size={12} className="text-white rotate-180" />
              </div>
            </button>
          );
        })}
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

      <div className="space-y-4 mt-8">
        {casos.length === 0 ? (
          <div className="apple-card p-16 text-center">
            <div className="w-20 h-20 bg-black/[0.03] rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-black/[0.04]">
               <FolderOpen size={40} className="text-[#86868B] opacity-30" />
            </div>
            <h3 className="text-xl font-bold text-[#1D1D1F] mb-2">Sin Registros</h3>
            <p className="text-[#86868B] text-sm max-w-sm mx-auto font-medium leading-relaxed">
               No se encontraron casos con los criterios de búsqueda actuales.
            </p>
          </div>
        ) : (
          casos.map(caso => (
            <CasoCard 
              key={caso.id}
              caso={caso}
              deleteCaso={deleteCaso}
              estados={ESTADOS}
              estadoColors={ESTADO_COLORS}
              prioridadColors={PRIORIDAD_COLORS}
              cumplimientoIcon={CUMPLIMIENTO_ICON}
            />
          ))
        )}
      </div>


      {showForm && selectedTipo && (
        <NuevoCasoModal 
          onClose={() => { setShowForm(false); setSelectedTipo(null); }}
          onSubmit={handleCreateCaso}
          saving={saving}
          normativas={normativas}
          estados={ESTADOS}
          prioridades={PRIORIDADES}
          initialTipo={selectedTipo}
        />
      )}
    </div>
  );
}
