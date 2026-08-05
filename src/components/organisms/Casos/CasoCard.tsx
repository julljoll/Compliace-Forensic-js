import Link from 'next/link';
import { User, Calendar, ChevronRight, Trash2, Smartphone, Mail, HardDrive } from '../../atoms/AppleIcon';
import { CasoCMS, EstadoCaso, NivelCumplimiento, TipoProyecto } from '../../../store/cmsStore';

const TIPO_ICONOS: Record<TipoProyecto, any> = {
  forense_whatsapp: Smartphone,
  forense_email: Mail,
  forense_discoduro: HardDrive,
  forense_imagen: HardDrive,
};

const TIPO_COLORS: Record<TipoProyecto, { color: string; bg: string }> = {
  forense_whatsapp: { color: '#005EA2', bg: '#E8F4F8' },
  forense_email: { color: '#D9A700', bg: '#FFF8E6' },
  forense_discoduro: { color: '#112E51', bg: '#F1F5F9' },
  forense_imagen: { color: '#008837', bg: '#DCFCE7' },
};

const TIPO_LABEL: Record<TipoProyecto, string> = {
  forense_whatsapp: 'WhatsApp',
  forense_email: 'Email',
  forense_discoduro: 'Disco Duro',
  forense_imagen: 'Imagen Forense',
};

interface CasoCardProps {
  caso: CasoCMS;
  deleteCaso: (id: string) => void;
  estados: { value: EstadoCaso | 'todos'; label: string }[];
  estadoColors: Record<string, string>;
  prioridadColors: Record<string, string>;
  cumplimientoIcon: Record<NivelCumplimiento, { icon: any; color: string; label: string }>;
}

const PRIORIDAD_BORDER: Record<string, string> = {
  critica: '#D9381E',
  alta: '#C05621',
  media: '#D9A700',
  baja: '#008837',
};

export default function CasoCard({
  caso,
  deleteCaso,
  cumplimientoIcon,
}: CasoCardProps) {
  const cumplConf = cumplimientoIcon[caso.nivelCumplimientoGeneral];
  const CumplIcon = cumplConf.icon;
  const TipoIcon = TIPO_ICONOS[caso.tipoProyecto] || Smartphone;
  const tipoColor = TIPO_COLORS[caso.tipoProyecto] || TIPO_COLORS.forense_whatsapp;
  const prioBorderColor = PRIORIDAD_BORDER[caso.prioridad] || '#D9A700';

  return (
    <div
      className="card p-3 border shadow-sm bg-white rounded-3 transition-all hover-border-primary"
      style={{ borderLeft: `4px solid ${prioBorderColor}` }}
    >
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
        <div className="flex-grow-1 min-w-0">
          <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
            <span className="font-monospace fw-bold small text-navy" style={{ color: '#005EA2' }}>
              {caso.numeroCaso}
            </span>
            <span className="usa-tag" style={{ backgroundColor: tipoColor.bg, color: tipoColor.color, fontSize: '10px' }}>
              {TIPO_LABEL[caso.tipoProyecto] || 'WhatsApp'}
            </span>
          </div>

          <Link href={`/control/seguimiento-compliance?casoId=${caso.id}`} className="text-decoration-none">
            <h3 className="h6 fw-bold text-navy mb-2 hover-text-primary" style={{ color: '#112E51' }}>
              {caso.titulo}
            </h3>
          </Link>

          <div className="d-flex gap-3 text-muted small">
            <div className="d-flex align-items-center gap-1">
              <User size={13} className="text-muted" />
              <span>{caso.peritoLider || 'Perito Asignado'}</span>
            </div>
            <div className="d-flex align-items-center gap-1">
              <Calendar size={13} className="text-muted" />
              <span>{new Date(caso.fechaCreacion).toLocaleDateString('es-VE')}</span>
            </div>
          </div>
        </div>

        {/* Progreso */}
        <div className="d-flex flex-sm-column align-items-center align-items-sm-end justify-content-between gap-2">
          <div className="d-flex align-items-center gap-1">
            <CumplIcon size={16} className="text-success" />
            <span className="small fw-bold text-uppercase text-muted">{cumplConf.label}</span>
          </div>

          <div className="min-w-120">
            <div className="small text-muted text-end mb-1" style={{ fontSize: '10px' }}>
              Progreso: {caso.porcentajeCompletado}%
            </div>
            <div className="progress" style={{ height: '6px' }}>
              <div
                className="progress-bar bg-success"
                role="progressbar"
                style={{ width: `${caso.porcentajeCompletado}%` }}
                aria-valuenow={caso.porcentajeCompletado}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="d-flex align-items-center gap-1">
          <Link href={`/control/seguimiento-compliance?casoId=${caso.id}`} className="btn btn-sm btn-outline-primary p-1">
            <ChevronRight size={18} />
          </Link>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger p-1"
            onClick={() => deleteCaso(caso.id)}
            title="Eliminar caso"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
