import { useState } from 'react';
import { useCMSStore, EstadoCaso, PrioridadCaso, TipoProyecto, CasoCMS } from '../store/cmsStore';
import { 
  FolderOpen, Smartphone, Mail, HardDrive, BookOpen,
  ChevronRight, Trash2, Search, ArrowLeft, User, Plus, X
} from '../components/atoms/AppleIcon';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { getTiposProyecto, getFasesPorTipo, getTipoProyectoConfig, getTareasPorDefecto } from '../data/tiposProyecto';

// ── Componentes Atómicos ──
import Card from '../components/atoms/Card';
import Button from '../components/atoms/Button';
import Badge from '../components/atoms/Badge';
import EmptyState from '../components/atoms/EmptyState';

const TIPOS = getTiposProyecto();

export const DISPOSITIVOS = [
  {
    id: 'forense_whatsapp' as TipoProyecto,
    titulo: 'Análisis Forense de Dispositivos Móviles Android',
    icon: Smartphone,
    descripcion: 'Adquisición, extracción y análisis forense de datos en teléfonos móviles Android. Flujo completo bajo RAG para extracción y análisis de mensajería (WhatsApp/Telegram).',
    alcance: [
      'Extracción lógica y física (Bypass) mediante Avilla Forensics y Andriller',
      'Preservación inicial mediante hash criptográfico SHA-256',
      'Parseo avanzado de bases de datos (msgstore.db) con IPED (Digital Forensic Tool)',
      'Análisis de artefactos del sistema operativo Android y registros con ALEAPP',
      'Extracción combinada de evidencias multimedia y transcripción de audios .opus',
      'Reconstrucción cronológica de línea de tiempo de comunicaciones'
    ],
    marcoLegal: [
      { codigo: 'Art. 187 COPP', descripcion: 'Licitud de la prueba y cadena de custodia' },
      { codigo: 'LEDI (2001)', descripcion: 'Ley Especial contra Delitos Informáticos' },
      { codigo: 'LMDF (1999)', descripcion: 'Ley sobre Mensajes de Datos y Firmas Electrónicas' },
      { codigo: 'ISO/IEC 27037:2012', descripcion: 'Identificación, recolección y preservación de evidencia digital' },
      { codigo: 'NIST SP 800-101 r1', descripcion: 'Guía de forensia de dispositivos móviles' },
      { codigo: 'MUCCEF 2017', descripcion: 'Manual Único de Cadena de Custodia de Evidencias' },
    ],
    enfoque: 'La extracción lógica se ejecuta mediante Avilla Forensics y Andriller. El análisis subsiguiente se realiza cargando el contenedor en ALEAPP e IPED de manera combinada para indexación profunda y búsquedas de interés forense.',
  },
  {
    id: 'forense_discoduro' as TipoProyecto,
    titulo: 'Análisis Forense de Computadoras / Discos Duros',
    icon: HardDrive,
    descripcion: 'Adquisición forense e investigación de discos duros y unidades de almacenamiento utilizando software y herramientas en entornos Linux.',
    alcance: [
      'Adquisición forense a través de bloqueadores de escritura físicos (Write-Blockers)',
      'Preservación bit-a-bit empleando herramientas forenses nativas Linux (guymager, dc3dd)',
      'Generación de imágenes forenses (DD/E01) y cálculo automático de hash SHA-256',
      'Procesamiento en entornos forenses especializados Linux (CAINE y/o Sumuri)',
      'Protocolo Linux: Montaje estrictamente seguro en modo solo lectura (ro, loop)',
      'File carving y recuperación de archivos borrados / slack space',
      'Análisis forense de registros, logfiles y artefactos de sistema'
    ],
    marcoLegal: [
      { codigo: 'Art. 187 COPP', descripcion: 'Licitud de la prueba y cadena de custodia' },
      { codigo: 'Art. 188 COPP', descripcion: 'Resguardo de evidencias' },
      { codigo: 'LEDI (2001)', descripcion: 'Ley Especial contra Delitos Informáticos' },
      { codigo: 'ISO/IEC 27037:2012', descripcion: 'Guía para identificación y recolección de evidencia' },
      { codigo: 'ISO/IEC 27042:2015', descripcion: 'Metodología para análisis y análisis forense digital' },
      { codigo: 'MUCCEF 2017', descripcion: 'Manual Único de Cadena de Custodia de Evidencias' },
    ],
    enfoque: 'Toda adquisición forense en caliente o laboratorio se realiza bajo protocolo Linux. Se montan las imágenes de solo lectura y se investiga empleando distribuciones forenses Linux como CAINE y/o Sumuri para garantizar la inmutabilidad de los datos.',
  },
];

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
  normativasAplicadas: [],
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
  solicitante_nombre: '',
  solicitante_cedula: '',
  correo_investigar: '',
  correo_proveedor: '',
  discoduro_serial: '',
  discoduro_capacidad: '',
  discoduro_marca: '',
  discoduro_modelo: '',
};

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

const TIPO_ICONOS: Record<TipoProyecto, any> = {
  forense_whatsapp: Smartphone,
  forense_email: Mail,
  forense_discoduro: HardDrive,
};

const TIPO_LABEL: Record<TipoProyecto, string> = {
  forense_whatsapp: 'WhatsApp',
  forense_email: 'Email',
  forense_discoduro: 'Disco Duro',
};

const PRIORIDAD_COLORS: Record<string, string> = {
  critica: 'bg-[var(--co-red)]',
  alta: 'bg-[var(--co-orange)]',
  media: 'bg-[var(--co-yellow)]',
  baja: 'bg-[var(--co-green)]',
};

export default function CasosPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const showCrearCaso = searchParams.get('nuevo') === 'true';

  const getCasosFiltrados = useCMSStore(state => state.getCasosFiltrados);
  const filtroEstado = useCMSStore(state => state.filtroEstado);
  const filtroPrioridad = useCMSStore(state => state.filtroPrioridad);
  const busqueda = useCMSStore(state => state.busqueda);
  const setFiltroEstado = useCMSStore(state => state.setFiltroEstado);
  const setFiltroPrioridad = useCMSStore(state => state.setFiltroPrioridad);
  const setBusqueda = useCMSStore(state => state.setBusqueda);
  const deleteCaso = useCMSStore(state => state.deleteCaso);
  
  // Store actions para creación
  const addCaso = useCMSStore(state => state.addCaso);
  const initSteps = useCMSStore(state => state.initSteps);
  const seleccionarCaso = useCMSStore(state => state.seleccionarCaso);
  const addTarea = useCMSStore(state => state.addTarea);
  const addAuditLog = useCMSStore(state => state.addAuditLog);
  const normativas = useCMSStore(state => state.normativas) || [];

  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // States locales para el formulario de creación inline
  const [crearStep, setCrearStep] = useState<'select' | 'form'>('select');
  const [selectedTipo, setSelectedTipo] = useState<TipoProyecto | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(() => ({ ...FORM_INICIAL }));

  const casos = getCasosFiltrados();

  const handleSelectDispositivo = (tipo: TipoProyecto) => {
    const fases = getFasesPorTipo(tipo);
    const config = getTipoProyectoConfig(tipo);
    setSelectedTipo(tipo);
    setForm(f => ({
      ...f,
      tipoProyecto: tipo,
      totalFases: fases.length,
      normativasAplicadas: config.normativasPorDefecto,
    }));
    setCrearStep('form');
  };

  const handleTipoChange = (tipoId: TipoProyecto) => {
    const fases = getFasesPorTipo(tipoId);
    const config = getTipoProyectoConfig(tipoId);
    setForm(f => ({
      ...f,
      tipoProyecto: tipoId,
      totalFases: fases.length,
      normativasAplicadas: config.normativasPorDefecto,
    }));
  };

  const handleCreateCaso = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const id = await addCaso(form);
      if (id) {
        const tipo = form.tipoProyecto || 'forense_whatsapp';
        const tareasDefecto = getTareasPorDefecto(tipo);

        initSteps(id);
        seleccionarCaso(id);

        tareasDefecto.forEach(t => {
          addTarea({
            casoId: id,
            pasoId: t.pasoId,
            titulo: t.titulo,
            descripcion: '',
            asignadoA: form.peritoLider || '',
            estado: 'pendiente',
            prioridad: 'media',
            fechaVencimiento: undefined,
            normativasRelacionadas: [],
            observaciones: '',
            porcentaje: 0,
          });
        });

        addAuditLog({
          accion: 'CASO_CREADO',
          detalle: `Caso "${form.titulo}" creado exitosamente desde la sección superior de Gestión de Casos`,
          nivel: 'success',
          casoId: id,
          usuario: form.peritoLider || 'sistema',
        });

        // Limpiar parámetros y estados
        setSearchParams({});
        setCrearStep('select');
        setSelectedTipo(null);
        setForm({ ...FORM_INICIAL });
        
        // Opcional: Navegar directamente al detalle del caso recién creado
        navigate(`/casos/${id}`);
      } else {
        alert('Error al registrar el caso.');
      }
    } catch (err) {
      console.error(err);
      alert('Error inesperado.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCaso = (id: string) => {
    if (confirm('¿Está seguro de que desea eliminar este caso? Esta acción es destructiva e inmutable.')) {
      deleteCaso(id);
      setSelectedIds(prev => prev.filter(x => x !== id));
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`¿Está seguro de que desea eliminar los ${selectedIds.length} casos seleccionados? Esta acción es destructiva e inmutable.`)) {
      selectedIds.forEach(id => deleteCaso(id));
      setSelectedIds([]);
    }
  };

  const dispositivo = DISPOSITIVOS.find(d => d.id === selectedTipo);

  return (
    <div className="space-y-8 apple-fade-in pb-20">
      {/* ── Header ── */}
      <div className="flex justify-between items-end gap-4 border-b border-[var(--co-separator)] pb-4">
        <div>
          <h1 className="text-apple-title-1 font-bold text-[var(--apple-text)] tracking-[-0.3px]">Gestión de Casos</h1>
          <p className="text-[14px] text-[var(--co-gray-1)] font-medium mt-1">
            Monitoree y verifique el estado y cumplimiento de todos los expedientes forenses registrados.
          </p>
        </div>
        {!showCrearCaso && (
          <Button variant="primary" size="sm" onClick={() => setSearchParams({ nuevo: 'true' })} className="mb-1">
            <Plus size={13} strokeWidth={2.5} />
            Nuevo Caso
          </Button>
        )}
      </div>

      {/* ── Cards de Tipo de Análisis — siempre visibles en la parte superior ── */}
      {!showCrearCaso && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-bold text-[var(--apple-text)]">Inicializar Nuevo Caso</h2>
              <p className="text-[12px] text-[var(--co-gray-1)] mt-0.5">Seleccione el área de análisis forense para crear un expediente.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {DISPOSITIVOS.map(d => {
              const Icon = d.icon;
              return (
                <div
                  key={d.id}
                  onClick={() => {
                    setSearchParams({ nuevo: 'true' });
                    handleSelectDispositivo(d.id);
                  }}
                  className="group relative flex flex-col text-left p-5 bg-[var(--co-surface-1)] border border-[var(--co-separator)] rounded-[16px] hover:border-[var(--co-accent)]/40 hover:shadow-[0_0_0_3px_rgba(0,113,227,0.06),var(--co-shadow-2)] hover:-translate-y-[2px] transition-all cursor-pointer"
                >
                  {/* Icon + title row */}
                  <div className="flex items-start gap-4 mb-3">
                    <div className="w-11 h-11 rounded-[10px] bg-[var(--co-surface-2)] flex items-center justify-center shrink-0 group-hover:bg-[var(--co-accent)]/10 transition-colors border border-[var(--co-separator)]">
                      <Icon size={20} className="text-[var(--co-gray-1)] group-hover:text-[var(--co-accent)] transition-colors" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[14px] font-bold text-[var(--apple-text)] group-hover:text-[var(--co-accent)] transition-colors leading-snug">
                        {d.titulo}
                      </h3>
                      <p className="text-[11.5px] text-[var(--co-gray-1)] leading-relaxed mt-1">
                        {d.descripcion}
                      </p>
                    </div>
                  </div>

                  {/* Enfoque / software RAG */}
                  <div className="mb-3 p-2.5 rounded-[8px] bg-[var(--co-surface-2)] border border-[var(--co-separator)]">
                    <h4 className="text-[9.5px] font-bold uppercase tracking-wider text-[var(--co-accent)] mb-1.5 flex items-center gap-1">
                      <Search size={9} /> Protocolo RAG & Software
                    </h4>
                    <p className="text-[11px] text-[var(--apple-text)] leading-relaxed">
                      {d.enfoque}
                    </p>
                  </div>

                  {/* Flujo forense — todos los pasos */}
                  <div className="mb-3">
                    <h4 className="text-[9.5px] font-bold uppercase tracking-wider text-[var(--co-gray-1)] mb-2 flex items-center gap-1">
                      <ChevronRight size={10} /> Flujo Forense (RAG)
                    </h4>
                    <ul className="space-y-1">
                      {d.alcance.map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[11.5px] text-[var(--apple-text)]">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--co-accent)] flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Marco legal — todos */}
                  <div className="mt-auto pt-3 border-t border-[var(--co-separator)]">
                    <h4 className="text-[9.5px] font-bold uppercase tracking-wider text-[var(--co-gray-1)] mb-2 flex items-center gap-1">
                      <BookOpen size={9} /> Marco Legal Aplicable
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {d.marcoLegal.map((m, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] bg-[var(--co-surface-2)] border border-[var(--co-separator)] text-[10px] font-semibold text-[var(--co-gray-1)]"
                          title={m.descripcion}
                        >
                          <BookOpen size={8} />
                          {m.codigo}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA hover */}
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--co-accent)] opacity-0 group-hover:opacity-100 transition-opacity mt-2.5">
                    <Plus size={11} strokeWidth={2.5} />
                    Inicializar expediente de este tipo
                    <ChevronRight size={11} className="ml-auto" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Formulario de creación (cuando se activa con ?nuevo=true) ── */}
      {showCrearCaso && (
        <Card className="p-6 border-[var(--co-accent)] bg-[var(--co-accent)]/[0.01] relative animate-apple-fadeIn">
          <button
            onClick={() => {
              setSearchParams({});
              setCrearStep('select');
              setSelectedTipo(null);
            }}
            className="absolute top-4 right-4 p-2 rounded-lg text-[var(--co-gray-1)] hover:text-[var(--apple-text)] hover:bg-[var(--co-surface-2)] transition-all cursor-pointer"
            title="Cerrar creación"
          >
            <X size={16} />
          </button>

          {crearStep === 'select' ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-[18px] font-bold text-[var(--apple-text)]">Inicializar Nuevo Caso Forense</h2>
                <p className="text-[12px] text-[var(--co-gray-1)]">Seleccione el tipo de proceso pericial que desea iniciar.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {DISPOSITIVOS.map(d => {
                  const Icon = d.icon;
                  return (
                    <div
                      key={d.id}
                      onClick={() => handleSelectDispositivo(d.id)}
                      className="group relative flex flex-col text-left p-6 bg-[var(--co-surface-1)] border border-[var(--co-separator)] rounded-[16px] hover:shadow-[var(--co-shadow-2)] hover:-translate-y-[2px] transition-all cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-xl bg-[var(--co-surface-2)] flex items-center justify-center mb-4 group-hover:bg-[var(--co-accent)]/10 transition-colors">
                        <Icon size={22} className="text-[var(--co-gray-1)] group-hover:text-[var(--co-accent)] transition-colors" />
                      </div>

                      <h3 className="text-[16px] font-bold text-[var(--apple-text)] mb-2 group-hover:text-[var(--co-accent)] transition-colors">
                        {d.titulo}
                      </h3>

                      <p className="text-[12.5px] text-[var(--co-gray-1)] leading-relaxed mb-4">
                        {d.descripcion}
                      </p>

                      <div className="mb-3 p-2.5 rounded-[8px] bg-[var(--co-surface-2)] border border-[var(--co-separator)]">
                        <h4 className="text-[9.5px] font-bold uppercase tracking-wider text-[var(--co-accent)] mb-1.5">
                          Protocolo RAG & Software
                        </h4>
                        <p className="text-[11px] text-[var(--apple-text)] leading-relaxed">{d.enfoque}</p>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--co-gray-1)] mb-2 flex items-center gap-1.5">
                          <Search size={11} />
                          Flujo Forense (RAG)
                        </h4>
                        <ul className="space-y-1">
                          {d.alcance.map((item, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-[11.5px] text-[var(--apple-text-muted)]">
                              <span className="mt-1.5 w-1 h-1 rounded-full bg-[var(--co-accent)] flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-auto pt-3 border-t border-[var(--co-separator)] flex flex-wrap gap-1.5">
                        {d.marcoLegal.map((m, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] bg-[var(--co-surface-2)] border border-[var(--co-separator)] text-[10px] font-medium text-[var(--co-gray-1)]"
                            title={m.descripcion}
                          >
                            <BookOpen size={8} />
                            {m.codigo}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCrearStep('select')}
                  className="p-1.5 rounded-lg text-[var(--co-gray-1)] hover:text-[var(--apple-text)] hover:bg-[var(--co-surface-2)] transition-all cursor-pointer"
                  title="Volver a la selección"
                >
                  <ArrowLeft size={16} />
                </button>
                <div>
                  <h2 className="text-[17px] font-bold text-[var(--apple-text)]">{dispositivo?.titulo}</h2>
                  <p className="text-[12px] text-[var(--co-gray-1)]">Complete los datos técnicos e inicialice el expediente.</p>
                </div>
              </div>

              <form onSubmit={handleCreateCaso} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedTipo === 'forense_discoduro' && (
                    <div className="space-y-1.5 col-span-2">
                      <label className="text-[11px] font-bold text-[var(--co-gray-1)] uppercase tracking-wider">Variante del Proceso</label>
                      <div className="flex gap-2">
                        {TIPOS.filter(t => t.id !== 'forense_whatsapp').map(t => {
                          const Icon = t.icon;
                          const selected = form.tipoProyecto === t.id;
                          return (
                            <button
                              type="button"
                              key={t.id}
                              onClick={() => handleTipoChange(t.id)}
                              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                                selected
                                  ? 'border-[var(--co-accent)] bg-[var(--co-accent)]/10 text-[var(--co-accent)]'
                                  : 'border-[var(--co-separator)] text-[var(--co-gray-1)] hover:border-[var(--co-gray-3)]'
                              }`}
                            >
                              <Icon size={14} />
                              {t.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-[var(--co-gray-1)] uppercase tracking-wider">Identificador del Caso *</label>
                    <input
                      required
                      className="apple-input w-full"
                      placeholder="ej. SHA-2025-001"
                      value={form.numeroCaso}
                      onChange={e => setForm(f => ({ ...f, numeroCaso: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-[var(--co-gray-1)] uppercase tracking-wider">PRCC / Registro Judicial</label>
                    <input
                      className="apple-input w-full"
                      placeholder="ID de Referencia..."
                      value={form.numeroPRCC || ''}
                      onChange={e => setForm(f => ({ ...f, numeroPRCC: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-1.5 col-span-2">
                    <label className="text-[11px] font-bold text-[var(--co-gray-1)] uppercase tracking-wider">Título Técnico *</label>
                    <input
                      required
                      className="apple-input w-full"
                      placeholder="Breve alcance de la investigación"
                      value={form.titulo}
                      onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-1.5 col-span-2">
                    <label className="text-[11px] font-bold text-[var(--co-gray-1)] uppercase tracking-wider">Contexto Operacional</label>
                    <textarea
                      className="apple-input w-full min-h-[60px] resize-none"
                      placeholder="Antecedentes y alcance forense..."
                      value={form.descripcion}
                      onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Datos del Solicitante */}
                <div className="p-4 bg-[var(--co-surface-2)] border border-[var(--co-separator)] rounded-xl space-y-3">
                  <label className="text-[11.5px] font-bold text-[var(--apple-text)] uppercase tracking-wider flex items-center gap-2 border-b border-[var(--co-separator)] pb-1.5">
                    <User size={13} className="text-[var(--co-gray-1)]" />
                    Solicitante de la Experticia
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[var(--co-gray-1)]">Nombre Completo *</label>
                      <input
                        required
                        className="apple-input w-full"
                        placeholder="Juan Pérez"
                        value={form.solicitante_nombre || ''}
                        onChange={e => setForm(f => ({ ...f, solicitante_nombre: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[var(--co-gray-1)]">Cédula *</label>
                      <input
                        required
                        className="apple-input w-full"
                        placeholder="V-12345678"
                        value={form.solicitante_cedula || ''}
                        onChange={e => setForm(f => ({ ...f, solicitante_cedula: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Dispositivo específico */}
                {form.tipoProyecto === 'forense_whatsapp' && (
                  <div className="p-4 bg-[var(--co-surface-2)] border border-[var(--co-separator)] rounded-xl space-y-3">
                    <label className="text-[11.5px] font-bold text-[var(--apple-text)] uppercase tracking-wider flex items-center gap-2 border-b border-[var(--co-separator)] pb-1.5">
                      <Smartphone size={13} className="text-[var(--co-gray-1)]" />
                      Especificaciones del Dispositivo Móvil
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[var(--co-gray-1)]">Marca</label>
                        <input
                          className="apple-input w-full"
                          placeholder="Samsung"
                          value={form.dispositivo_marca || ''}
                          onChange={e => setForm(f => ({ ...f, dispositivo_marca: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[var(--co-gray-1)]">Modelo</label>
                        <input
                          className="apple-input w-full"
                          placeholder="Galaxy S23"
                          value={form.dispositivo_modelo || ''}
                          onChange={e => setForm(f => ({ ...f, dispositivo_modelo: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[var(--co-gray-1)]">Estado Físico</label>
                        <select
                          className="apple-input w-full"
                          value={form.dispositivo_estado_fisico || ''}
                          onChange={e => setForm(f => ({ ...f, dispositivo_estado_fisico: e.target.value }))}
                        >
                          <option value="">Seleccione...</option>
                          <option value="operativo">Operativo</option>
                          <option value="danos_pantalla">Daños Pantalla</option>
                          <option value="sin_bateria">Sin Batería</option>
                          <option value="multiple_danos">Múltiples Daños</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {form.tipoProyecto === 'forense_email' && (
                  <div className="p-4 bg-[var(--co-surface-2)] border border-[var(--co-separator)] rounded-xl space-y-3">
                    <label className="text-[11.5px] font-bold text-[var(--apple-text)] uppercase tracking-wider flex items-center gap-2 border-b border-[var(--co-separator)] pb-1.5">
                      <Mail size={13} className="text-[var(--co-gray-1)]" />
                      Detalles del Correo
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[var(--co-gray-1)]">Correo *</label>
                        <input
                          required
                          type="email"
                          className="apple-input w-full"
                          placeholder="correo@investigar.com"
                          value={form.correo_investigar || ''}
                          onChange={e => setForm(f => ({ ...f, correo_investigar: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[var(--co-gray-1)]">Proveedor *</label>
                        <input
                          required
                          className="apple-input w-full"
                          placeholder="Gmail, Exchange..."
                          value={form.correo_proveedor || ''}
                          onChange={e => setForm(f => ({ ...f, correo_proveedor: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {form.tipoProyecto === 'forense_discoduro' && (
                  <div className="p-4 bg-[var(--co-surface-2)] border border-[var(--co-separator)] rounded-xl space-y-3">
                    <label className="text-[11.5px] font-bold text-[var(--apple-text)] uppercase tracking-wider flex items-center gap-2 border-b border-[var(--co-separator)] pb-1.5">
                      <HardDrive size={13} className="text-[var(--co-gray-1)]" />
                      Detalles del Disco Duro / Unidad
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[var(--co-gray-1)]">Marca/Modelo</label>
                        <input
                          className="apple-input w-full"
                          placeholder="WD Blue / Seagate..."
                          value={form.discoduro_marca || ''}
                          onChange={e => setForm(f => ({ ...f, discoduro_marca: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[var(--co-gray-1)]">Capacidad *</label>
                        <input
                          required
                          className="apple-input w-full"
                          placeholder="1 TB, 512 GB..."
                          value={form.discoduro_capacidad || ''}
                          onChange={e => setForm(f => ({ ...f, discoduro_capacidad: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-1 col-span-2">
                        <label className="text-[10px] font-bold text-[var(--co-gray-1)]">Número de Serie *</label>
                        <input
                          required
                          className="apple-input w-full font-mono"
                          placeholder="WCC6Y1234567"
                          value={form.discoduro_serial || ''}
                          onChange={e => setForm(f => ({ ...f, discoduro_serial: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Config peritos / base legal */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[var(--co-gray-1)] uppercase tracking-wider">Perito Líder *</label>
                    <input
                      required
                      className="apple-input w-full"
                      placeholder="Nombre del perito..."
                      value={form.peritoLider}
                      onChange={e => setForm(f => ({ ...f, peritoLider: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[var(--co-gray-1)] uppercase tracking-wider">Prioridad</label>
                    <select
                      className="apple-input w-full"
                      value={form.prioridad}
                      onChange={e => setForm(f => ({ ...f, prioridad: e.target.value as PrioridadCaso }))}
                    >
                      {PRIORIDADES.filter(p => p.value !== 'todos').map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[var(--co-gray-1)] uppercase tracking-wider">Base Legal de Referencia</label>
                  <div className="grid grid-cols-2 gap-2.5 p-3.5 bg-[var(--co-surface-2)] border border-[var(--co-separator)] rounded-xl">
                    {normativas.filter(n => n.activa).map(n => (
                      <label key={n.id} className="flex items-center gap-2 text-xs text-[var(--co-gray-1)] cursor-pointer hover:text-[var(--apple-text)] transition-all group">
                        <input
                          type="checkbox"
                          className="w-3.5 h-3.5 accent-[var(--co-accent)] rounded-[4px] border-[var(--co-separator)] cursor-pointer"
                          checked={form.normativasAplicadas.includes(n.id)}
                          onChange={e => setForm(f => ({
                            ...f,
                            normativasAplicadas: e.target.checked
                              ? [...f.normativasAplicadas, n.id]
                              : f.normativasAplicadas.filter(id => id !== n.id)
                          }))}
                        />
                        <span className="font-semibold group-hover:text-[var(--co-accent)]">{n.codigo}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-[var(--co-separator)]">
                  <button
                    type="button"
                    onClick={() => setCrearStep('select')}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[var(--co-gray-1)] hover:text-[var(--apple-text)] transition-all cursor-pointer"
                  >
                    <ArrowLeft size={12} />
                    Atrás
                  </button>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setSearchParams({});
                        setCrearStep('select');
                        setSelectedTipo(null);
                      }}
                      disabled={saving}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      disabled={saving}
                      className="shadow-sm"
                    >
                      {saving ? 'Creando...' : 'Iniciar Caso'}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </Card>
      )}

      {/* ── Toolbar: Search & Toggle View Mode ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--co-separator)] pb-4">
        {/* Horizontal Pills Filter Bar */}
        <div className="flex flex-col gap-2.5 flex-1">
          {/* Estado Filter pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-bold text-[var(--co-gray-1)] uppercase tracking-[0.05em] w-14 select-none">Estado:</span>
            {ESTADOS.map(e => {
              const active = filtroEstado === e.value;
              return (
                <button
                  key={e.value}
                  onClick={() => setFiltroEstado(e.value)}
                  className={`text-[11px] px-3 py-1 rounded-full font-medium border transition-all cursor-pointer ${
                    active 
                      ? 'bg-[var(--co-accent)]/15 text-[var(--co-accent)] border-[var(--co-accent)]/30 font-semibold' 
                      : 'bg-[var(--co-surface-2)] text-[var(--co-gray-1)] border-[var(--co-separator)] hover:border-[var(--co-gray-3)]'
                  }`}
                >
                  {e.label}
                </button>
              );
            })}
          </div>

          {/* Prioridad Filter pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-bold text-[var(--co-gray-1)] uppercase tracking-[0.05em] w-14 select-none">Prioridad:</span>
            {PRIORIDADES.map(p => {
              const active = filtroPrioridad === p.value;
              return (
                <button
                  key={p.value}
                  onClick={() => setFiltroPrioridad(p.value)}
                  className={`text-[11px] px-3 py-1 rounded-full font-medium border transition-all cursor-pointer ${
                    active 
                      ? 'bg-[var(--co-accent)]/15 text-[var(--co-accent)] border-[var(--co-accent)]/30 font-semibold' 
                      : 'bg-[var(--co-surface-2)] text-[var(--co-gray-1)] border-[var(--co-separator)] hover:border-[var(--co-gray-3)]'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
          <div className="relative w-[240px]">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--co-gray-1)]" />
            <input
              type="text"
              placeholder="Buscar casos..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              className="w-full text-[13px] bg-[var(--co-surface-2)] text-[var(--apple-text)] border border-[var(--co-gray-5)] rounded-[10px] pl-8 pr-4 py-1.5 outline-none focus:border-[var(--co-accent)] focus:ring-[3px] focus:ring-[var(--co-accent)]/20 transition-all"
            />
          </div>

          {/* List/Grid toggle buttons */}
          <div className="flex items-center bg-[var(--co-surface-2)] border border-[var(--co-separator)] rounded-[10px] p-0.5">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-[8px] transition-all cursor-pointer ${viewMode === 'list' ? 'bg-[var(--co-surface-1)] text-[var(--co-accent)] shadow-sm' : 'text-[var(--co-gray-1)] hover:text-[var(--apple-text)]'}`}
              title="Vista de Lista"
            >
              <svg viewBox="0 0 24 24" width={15} height={15} fill="none" stroke="currentColor" strokeWidth={2.5}>
                <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-[8px] transition-all cursor-pointer ${viewMode === 'grid' ? 'bg-[var(--co-surface-1)] text-[var(--co-accent)] shadow-sm' : 'text-[var(--co-gray-1)] hover:text-[var(--apple-text)]'}`}
              title="Vista de Cuadrícula"
            >
              <svg viewBox="0 0 24 24" width={15} height={15} fill="none" stroke="currentColor" strokeWidth={2.5}>
                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Casos List Area ── */}
      <div className="space-y-4">
        {casos.length === 0 ? (
          <EmptyState
            icon={FolderOpen}
            title="Sin casos forenses"
            description="No se encontraron registros activos que coincidan con la búsqueda o filtros seleccionados. Diríjase a la cabecera para crear un nuevo caso."
          />
        ) : viewMode === 'list' ? (
          /* List View */
          <div className="overflow-x-auto bg-[var(--co-surface-1)] border border-[var(--co-separator)] rounded-[16px] shadow-[var(--co-shadow-1)]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--co-surface-2)] border-b border-[var(--co-separator)] h-11 text-[11px] font-bold uppercase tracking-wider text-[var(--co-gray-1)]">
                  <th className="px-4 py-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={casos.length > 0 && selectedIds.length === casos.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds(casos.map(c => c.id));
                        } else {
                          setSelectedIds([]);
                        }
                      }}
                      className="rounded border-[var(--co-separator)] text-[var(--co-accent)] focus:ring-[var(--co-accent)] cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-3">Código</th>
                  <th className="px-4 py-3">Expediente</th>
                  <th className="px-4 py-3">Título del Caso</th>
                  <th className="px-4 py-3">Dispositivo</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3 text-center">Prioridad</th>
                  <th className="px-4 py-3">Cumplimiento</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--co-separator)] text-[14px]">
                {casos.map(caso => {
                  const estado = ESTADOS.find(e => e.value === caso.estado) || { label: caso.estado };
                  const TipoIcon = TIPO_ICONOS[caso.tipoProyecto] || Smartphone;
                  const isSelected = selectedIds.includes(caso.id);
                  return (
                    <tr key={caso.id} className={`hover:bg-[var(--co-surface-2)]/50 transition-colors h-14 ${isSelected ? 'bg-[var(--co-accent)]/[0.04]' : ''}`}>
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedIds(prev => [...prev, caso.id]);
                            } else {
                              setSelectedIds(prev => prev.filter(id => id !== caso.id));
                            }
                          }}
                          className="rounded border-[var(--co-separator)] text-[var(--co-accent)] focus:ring-[var(--co-accent)] cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Link to={`/casos/${caso.id}`} className="font-mono text-[11px] font-semibold text-[var(--co-accent)] hover:underline">
                          {caso.numeroCaso}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-[13px] font-semibold text-[var(--apple-text)]">
                        {caso.expediente || 'Sin exp.'}
                      </td>
                      <td className="px-4 py-3 text-[13.5px] font-semibold text-[var(--apple-text)] truncate max-w-[200px]" title={caso.titulo}>
                        <Link to={`/casos/${caso.id}`} className="hover:underline">{caso.titulo}</Link>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-[11px] text-[var(--co-gray-1)] font-medium">
                          <TipoIcon size={12} />
                          <span>{TIPO_LABEL[caso.tipoProyecto]}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={caso.estado === 'cerrado' ? 'conforme' : caso.estado === 'en_proceso' ? 'alta' : 'neutro'}>
                          {estado.label}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center">
                          <span className={`w-2.5 h-2.5 rounded-full ${PRIORIDAD_COLORS[caso.prioridad]}`} title={`Prioridad ${caso.prioridad}`} />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-black/[0.08] dark:bg-white/[0.08] rounded-full overflow-hidden">
                            <div className="h-full bg-[var(--co-green)] rounded-full" style={{ width: `${caso.porcentajeCompletado}%` }} />
                          </div>
                          <span className="text-[11px] font-mono text-[var(--co-gray-1)]">{caso.porcentajeCompletado}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link to={`/casos/${caso.id}`} className="p-1.5 rounded-lg bg-[var(--co-surface-2)] text-[var(--co-gray-1)] hover:bg-[var(--co-accent)] hover:text-white transition-all">
                            <ChevronRight size={13} />
                          </Link>
                          <button onClick={() => handleDeleteCaso(caso.id)} className="p-1.5 rounded-lg bg-[var(--co-surface-2)] text-[var(--co-gray-1)] hover:bg-[var(--co-red)] hover:text-white transition-all cursor-pointer">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {casos.map(caso => {
              const estado = ESTADOS.find(e => e.value === caso.estado) || { label: caso.estado };
              const TipoIcon = TIPO_ICONOS[caso.tipoProyecto] || Smartphone;
              const isSelected = selectedIds.includes(caso.id);
              return (
                <Card key={caso.id} className={`flex flex-col p-5 h-full relative transition-all ${isSelected ? 'border-[var(--co-accent)] ring-1 ring-[var(--co-accent)] bg-[var(--co-accent)]/[0.02]' : ''}`} hoverable={true}>
                  <div className="absolute top-4 right-4 z-10">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds(prev => [...prev, caso.id]);
                        } else {
                          setSelectedIds(prev => prev.filter(id => id !== caso.id));
                        }
                      }}
                      className="rounded border-[var(--co-separator)] text-[var(--co-accent)] focus:ring-[var(--co-accent)] cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center justify-between mb-3 pr-6">
                    <span className="font-mono text-[11px] font-semibold text-[var(--co-accent)]">{caso.numeroCaso}</span>
                    <Badge variant={caso.estado === 'cerrado' ? 'conforme' : caso.estado === 'en_proceso' ? 'alta' : 'neutro'}>
                      {estado.label}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-[15px] text-[var(--apple-text)] truncate mb-1.5 pr-6">
                    <Link to={`/casos/${caso.id}`} className="hover:underline">{caso.titulo}</Link>
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-[var(--co-gray-1)] mb-4 font-medium">
                    <TipoIcon size={12} />
                    <span>{TIPO_LABEL[caso.tipoProyecto]}</span>
                    <span>•</span>
                    <span>Líder: {caso.peritoLider}</span>
                  </div>
                  <div className="mt-auto pt-3 border-t border-[var(--co-separator)]">
                    <div className="flex items-center justify-between mb-1 text-[11px] font-semibold text-[var(--co-gray-1)]">
                      <span>Cumplimiento</span>
                      <span>{caso.porcentajeCompletado}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-black/[0.08] dark:bg-white/[0.08] rounded-full overflow-hidden mb-4">
                      <div className="h-full bg-[var(--co-green)] rounded-full transition-all duration-500" style={{ width: `${caso.porcentajeCompletado}%` }} />
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/casos/${caso.id}`} className="flex-1 flex justify-center items-center py-2 rounded-lg bg-[var(--co-accent)] text-white font-semibold text-[13px] transition-all hover:brightness-105 active:scale-95 shadow-sm">
                        Ver Detalles
                      </Link>
                      <button onClick={() => handleDeleteCaso(caso.id)} className="p-2 rounded-lg bg-[var(--co-surface-2)] text-[var(--co-gray-1)] hover:bg-[var(--co-red)] hover:text-white transition-colors active:scale-95 cursor-pointer" title="Eliminar caso">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Bulk Actions Floating Toolbar ── */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/95 dark:bg-black/95 backdrop-blur-md border border-[var(--co-separator)] rounded-full px-6 py-3.5 shadow-2xl flex items-center gap-6 z-50 animate-apple-fadeIn animate-duration-300">
          <span className="text-[13px] font-semibold text-[var(--apple-text)]">
            {selectedIds.length} {selectedIds.length === 1 ? 'caso seleccionado' : 'casos seleccionados'}
          </span>
          <div className="w-px h-5 bg-[var(--co-separator)]" />
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedIds([])}
              className="text-[13px] font-semibold text-[var(--co-gray-1)] hover:text-[var(--apple-text)] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              Desmarcar
            </button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              className="flex items-center gap-1.5"
            >
              <Trash2 size={13} />
              <span>Eliminar en Lote</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
