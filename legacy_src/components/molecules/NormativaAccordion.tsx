import { Normativa } from '../../store/cmsStore';
import { BookOpen, CheckCircle2, ChevronRight } from '../atoms/AppleIcon';

interface NormativaAccordionProps {
  norm: Normativa;
  isExpanded: boolean;
  onToggle: (id: string | null) => void;
  progress: { total: number; checked: number; pct: number };
  ne: any;
  isChecked: (stageId: string) => boolean;
  getCheckDate: (stageId: string) => string | undefined;
  toggleCheck: (stageId: string, normId: string) => void;
}

export default function NormativaAccordion({
  norm,
  isExpanded,
  onToggle,
  progress,
  ne,
  isChecked,
  getCheckDate,
  toggleCheck,
}: NormativaAccordionProps) {
  return (
    <div className="card p-0 border shadow-sm bg-white rounded-3 mb-3 overflow-hidden">
      <div
        className="p-3 cursor-pointer d-flex align-items-center justify-content-between hover-bg-light"
        onClick={() => onToggle(isExpanded ? null : norm.id)}
        style={{ cursor: 'pointer' }}
      >
        <div className="flex-grow-1 min-w-0">
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="font-monospace fw-bold small text-warning">{norm.codigo}</span>
            <span className="usa-tag usa-tag--info" style={{ fontSize: '9px' }}>{norm.tipo}</span>
            {progress.pct === 100 && (
              <span className="usa-tag usa-tag--success" style={{ fontSize: '9px' }}>✓ Completo</span>
            )}
          </div>
          <h3 className="h6 fw-bold text-navy mb-0" style={{ color: '#112E51' }}>
            {norm.nombre}
          </h3>
        </div>

        <div className="d-flex align-items-center gap-3 ms-2">
          <div className="d-none d-sm-block min-w-80">
            <div className="progress" style={{ height: '6px' }}>
              <div className="progress-bar bg-warning" style={{ width: `${progress.pct}%` }}></div>
            </div>
          </div>
          <span className={`fw-bold small ${progress.pct === 100 ? 'text-success' : 'text-warning'}`}>
            {progress.checked}/{progress.total}
          </span>
          <ChevronRight
            size={18}
            className="text-muted"
            style={{
              transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
            }}
          />
        </div>
      </div>

      {isExpanded && ne && (
        <div className="border-top p-3 bg-light">
          {ne.etapas.map((etapa: any) => (
            <div key={etapa.id} className="p-2 mb-2 bg-white rounded border">
              {etapa.subetapas ? (
                <div className="mb-2">
                  <div className="fw-bold text-navy d-flex align-items-center gap-1" style={{ fontSize: '13px', color: '#112E51' }}>
                    <BookOpen size={14} className="text-warning" />
                    {etapa.nombre}
                  </div>
                  <div className="text-muted small ms-4">{etapa.descripcion}</div>
                </div>
              ) : (
                <div className="form-check d-flex align-items-start gap-2">
                  <input
                    type="checkbox"
                    className="form-check-input mt-1"
                    checked={isChecked(etapa.id)}
                    onChange={() => toggleCheck(etapa.id, norm.id)}
                  />
                  <div>
                    <div className={`fw-semibold style-none ${isChecked(etapa.id) ? 'text-decoration-line-through text-muted' : 'text-navy'}`} style={{ fontSize: '13px' }}>
                      {etapa.nombre}
                    </div>
                    <div className="text-muted small">{etapa.descripcion}</div>
                  </div>
                </div>
              )}

              {etapa.subetapas && (
                <div className="ms-4 border-start border-2 ps-3 mt-2" style={{ borderColor: '#CBD5E1' }}>
                  {etapa.subetapas.map((sub: any) => (
                    <div key={sub.id} className="form-check d-flex align-items-start gap-2 py-1">
                      <input
                        type="checkbox"
                        className="form-check-input mt-1"
                        checked={isChecked(sub.id)}
                        onChange={() => toggleCheck(sub.id, norm.id)}
                      />
                      <div>
                        <div className={`fw-semibold style-none ${isChecked(sub.id) ? 'text-decoration-line-through text-muted' : 'text-navy'}`} style={{ fontSize: '12px' }}>
                          {sub.nombre}
                        </div>
                        <div className="text-muted small" style={{ fontSize: '11px' }}>{sub.descripcion}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
