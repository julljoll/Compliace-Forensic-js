import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  useCMSStore,
  type EstadoCaso,
  type PrioridadCaso
} from '../store/cmsStore';
import {
  FolderOpen, ShieldCheck, AlertTriangle,
  Plus, BookOpen, ClipboardList
} from '../components/atoms/AppleIcon';
import Card from '../components/atoms/Card';
import Button from '../components/atoms/Button';
import Badge from '../components/atoms/Badge';
import StatusDot from '../components/atoms/StatusDot';

const ESTADO_LABEL: Record<EstadoCaso, { label: string; color: string }> = {
  iniciado:    { label: 'Iniciado',    color: 'bg-blue-500/15 text-blue-600 border-blue-500/25' },
  en_proceso:  { label: 'En Proceso',  color: 'bg-yellow-500/15 text-yellow-600 border-yellow-500/25' },
  analisis:    { label: 'Análisis',    color: 'bg-purple-500/15 text-purple-600 border-purple-500/25' },
  informe:     { label: 'Informe',     color: 'bg-indigo-500/15 text-indigo-600 border-indigo-500/25' },
  cerrado:     { label: 'Cerrado',     color: 'bg-green-500/15 text-green-600 border-green-500/25' },
  archivado:   { label: 'Archivado',   color: 'bg-gray-500/15 text-gray-500 border-gray-500/25' },
};

const PRIORIDAD_COLOR: Record<PrioridadCaso, string> = {
  critica: 'bg-[var(--co-red)]',
  alta: 'bg-[var(--co-orange)]',
  media: 'bg-[var(--co-yellow)]',
  baja: 'bg-[var(--co-green)]',
};
export default function DashboardPage() {
  const navigate = useNavigate();
  const casos = useCMSStore(state => state.casos);
  const normativas = useCMSStore(state => state.normativas) || [];

  const getEstadisticas = useCMSStore(state => state.getEstadisticas);
  const stats = getEstadisticas();

  const recientes = useMemo(() => {
    return [...casos].sort((a, b) =>
      new Date(b.fechaUltimaActualizacion).getTime() - new Date(a.fechaUltimaActualizacion).getTime()
    ).slice(0, 8);
  }, [casos]);

  const casosEnInforme = useMemo(() => {
    return casos.filter(c => c.estado === 'informe').length;
  }, [casos]);

  // Empty state if no cases
  if (casos.length === 0) {
    return (
      <div className="space-y-8 apple-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--co-separator)] pb-6">
          <div>
            <h1 className="text-apple-title-1 font-bold text-[var(--apple-text)]">
              Centro de Control
            </h1>
            <div className="text-[14px] text-[var(--co-gray-1)] font-normal max-w-lg mt-1 leading-relaxed">
              <span>Monitoreo forense bajo los marcos normativos <span className="text-[var(--co-accent)] font-semibold">ISO 27037</span> y <span className="text-[var(--co-accent)] font-semibold">MUCC-2017</span>.</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-semibold text-[var(--co-gray-1)] uppercase tracking-[0.04em]">Estado del Sistema</span>
            <span className="text-[14px] font-bold text-[var(--co-green)] flex items-center gap-1.5">
              <StatusDot status="online" size={8} /> EN LÍNEA
            </span>
          </div>
        </div>

        {/* Empty State Banner */}
        <Card className="text-center py-16 px-4 max-w-2xl mx-auto mt-12 bg-gradient-to-b from-[var(--co-surface-1)] to-[var(--co-surface-2)] shadow-[var(--co-shadow-2)] rounded-[24px]">
          <div className="w-20 h-20 rounded-3xl bg-[var(--co-accent)]/10 text-[var(--co-accent)] flex items-center justify-center mx-auto mb-6 shadow-sm">
            <FolderOpen size={36} />
          </div>
          <h3 className="text-[24px] font-bold text-[var(--apple-text)] mb-3 tracking-[-0.02em]">Inicialización del Sistema Completa</h3>
          <p className="text-[var(--co-gray-1)] text-[14px] mb-8 max-w-xl mx-auto leading-relaxed">
            Plataforma centralizada para gestión pericial digital, control de cadena de custodia 
            y monitoreo de cumplimiento <span className="font-semibold text-[var(--apple-text)]">ISO/IEC</span>.
          </p>
          <Button variant="primary" size="lg" onClick={() => navigate('/casos?nuevo=true')}>
            <Plus size={18} />
            Crear Primer Caso Forense
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 apple-fade-in">
      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--co-separator)] pb-6">
        <div>
          <h1 className="text-apple-title-1 font-bold text-[var(--apple-text)]">
            Centro de Control
          </h1>
          <div className="text-[14px] text-[var(--co-gray-1)] font-normal max-w-lg mt-1 leading-relaxed">
            <span>Monitoreo forense bajo los marcos normativos <span className="text-[var(--co-accent)] font-semibold">ISO 27037</span> y <span className="text-[var(--co-accent)] font-semibold">MUCC-2017</span>.</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-col items-end border-r border-[var(--co-separator)] pr-4">
            <span className="text-[10px] font-semibold text-[var(--co-gray-1)] uppercase tracking-[0.04em]">Estado del Sistema</span>
            <span className="text-[14px] font-bold text-[var(--co-green)] flex items-center gap-1.5">
              <StatusDot status="online" size={8} /> EN LÍNEA
            </span>
          </div>

          <Button variant="primary" size="sm" onClick={() => navigate('/casos?nuevo=true')}>
            <Plus size={14} strokeWidth={2.5} />
            Nuevo Caso
          </Button>
        </div>
      </div>

      {/* ── KPIs Generales ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center gap-4 p-5" hoverable={true}>
          <div className="p-3 bg-[var(--co-blue)]/10 text-[var(--co-blue)] rounded-xl shrink-0">
            <FolderOpen size={24} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[var(--co-gray-1)] uppercase tracking-wider">Casos Activos</p>
            <p className="text-[28px] font-bold text-[var(--apple-text)] tracking-tight leading-none mt-1">{stats.casosActivos}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-5" hoverable={true}>
          <div className="p-3 bg-[var(--co-green)]/10 text-[var(--co-green)] rounded-xl shrink-0">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[var(--co-gray-1)] uppercase tracking-wider">Cumplimiento %</p>
            <p className="text-[28px] font-bold text-[var(--apple-text)] tracking-tight leading-none mt-1">{stats.cumplimientoGeneral}%</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-5" hoverable={true}>
          <div className="p-3 bg-[var(--co-red)]/10 text-[var(--co-red)] rounded-xl shrink-0">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[var(--co-gray-1)] uppercase tracking-wider">Alertas Críticas</p>
            <p className="text-[28px] font-bold text-[var(--apple-text)] tracking-tight leading-none mt-1">{stats.tareasPendientes}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-5" hoverable={true}>
          <div className="p-3 bg-[var(--co-indigo)]/10 text-[var(--co-indigo)] rounded-xl shrink-0">
            <ClipboardList size={24} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[var(--co-gray-1)] uppercase tracking-wider">Casos en Informe</p>
            <p className="text-[28px] font-bold text-[var(--apple-text)] tracking-tight leading-none mt-1">{casosEnInforme}</p>
          </div>
        </Card>
      </div>

      {/* ── Casos Recientes ── */}
      <div className="w-full">
        {/* Casos Recientes */}
        <Card className="p-0 overflow-hidden flex flex-col" hoverable={false}>
          <div className="p-5 border-b border-[var(--co-separator)] flex items-center justify-between">
            <h2 className="font-bold text-[16px] text-[var(--apple-text)] flex items-center gap-2">
              <FolderOpen size={18} className="text-[var(--co-accent)]" />
              Casos Recientes
            </h2>
            <Link to="/casos" className="text-[11px] font-semibold text-[var(--co-accent)] hover:underline">Ver todos</Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--co-surface-2)] text-[10px] font-bold uppercase tracking-wider text-[var(--co-gray-1)] border-b border-[var(--co-separator)]">
                  <th className="py-2.5 px-3">Código</th>
                  <th className="py-2.5 px-3">Nombre</th>
                  <th className="py-2.5 px-3">Estado</th>
                  <th className="py-2.5 px-3 text-center">Prioridad</th>
                  <th className="py-2.5 px-3 text-right">Actualizado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--co-separator)]">
                {recientes.map(caso => {
                  const estado = ESTADO_LABEL[caso.estado] || ESTADO_LABEL.iniciado;
                  return (
                    <tr key={caso.id} className="hover:bg-[var(--co-surface-2)] transition-colors h-12">
                      <td className="px-3">
                        <Link to={`/casos/${caso.id}`} className="font-mono text-[11px] font-semibold text-[var(--co-accent)] hover:underline">
                          {caso.numeroCaso}
                        </Link>
                      </td>
                      <td className="px-3 text-[13px] font-semibold text-[var(--apple-text)] truncate max-w-[350px]">
                        <Link to={`/casos/${caso.id}`} className="hover:underline">{caso.titulo}</Link>
                      </td>
                      <td className="px-3">
                        <Badge variant={caso.estado === 'cerrado' ? 'conforme' : caso.estado === 'en_proceso' ? 'alta' : 'neutro'}>
                          {estado.label}
                        </Badge>
                      </td>
                      <td className="px-3 text-center">
                        <div className="flex items-center justify-center">
                          <span className={`w-2.5 h-2.5 rounded-full ${PRIORIDAD_COLOR[caso.prioridad]}`} title={`Prioridad ${caso.prioridad}`} />
                        </div>
                      </td>
                      <td className="px-3 text-[11px] text-[var(--co-gray-1)] text-right font-medium">
                        {new Date(caso.fechaUltimaActualizacion).toLocaleDateString('es', { day: '2-digit', month: 'short' })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* marcos normativos quick status */}
      <Card className="p-5">
        <h3 className="font-bold text-[14px] text-[var(--apple-text)] flex items-center gap-2 mb-4">
          <BookOpen size={16} className="text-[var(--co-accent)]" />
          Marcos Normativos Activos
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {normativas.filter(n => n.activa).slice(0, 6).map(n => (
            <div key={n.id} className="flex items-center justify-between p-3 bg-[var(--co-surface-2)] border border-[var(--co-separator)] rounded-[10px] group hover:border-[var(--co-accent)]/30 transition-colors">
              <span className="text-[12.5px] font-bold text-[var(--apple-text)] truncate">{n.codigo} - {n.nombre.split(' ')[0]}</span>
              <Badge variant="neutro">{n.tipo}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
