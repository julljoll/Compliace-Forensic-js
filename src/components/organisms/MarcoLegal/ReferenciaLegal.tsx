import { Scale, Book, Shield } from '../../atoms/AppleIcon';

export default function ReferenciaLegal() {
  return (
    <div className="d-flex flex-column gap-4">
      <div className="card p-4 bg-white border shadow-sm rounded-3">
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
          <h2 className="h5 fw-bold text-navy mb-0 d-flex align-items-center gap-2" style={{ color: 'var(--usa-navy)' }}>
            <Scale size={22} className="text-warning flex-shrink-0" />
            Marco Legal y Estándares Internacionales
          </h2>
          <span className="usa-tag usa-tag--info" style={{ fontSize: '9px', letterSpacing: '0.08em' }}>
            VIGENTE 2024
          </span>
        </div>

        <div className="row g-4">
          {/* Legislación Nacional */}
          <div className="col-12 col-md-4">
            <h4 className="fw-bold text-primary text-uppercase mb-3 d-flex align-items-center gap-2" style={{ fontSize: '11px', letterSpacing: '0.08em' }}>
              <Book size={13} /> Legislación Nacional
            </h4>
            <ul className="list-unstyled d-flex flex-column gap-2 small text-muted">
              {['Constitución Nacional (Art. 49)', 'COPP Art. 188 (Resguardo)', 'Ley Delitos Informáticos', 'Ley Mensajes de Datos'].map(item => (
                <li key={item} className="d-flex align-items-start gap-2">
                  <span className="rounded-circle bg-primary flex-shrink-0 mt-1" style={{ width: '5px', height: '5px', minWidth: '5px' }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Estándares Globales */}
          <div className="col-12 col-md-4">
            <h4 className="fw-bold text-primary text-uppercase mb-3 d-flex align-items-center gap-2" style={{ fontSize: '11px', letterSpacing: '0.08em' }}>
              <Shield size={13} /> Estándares Globales
            </h4>
            <ul className="list-unstyled d-flex flex-column gap-2 small text-muted">
              {['ISO/IEC 27037:2012', 'ISO/IEC 27042:2015', 'NIST SP 800-101 r1', 'ACPO Good Practice Guide'].map(item => (
                <li key={item} className="d-flex align-items-start gap-2">
                  <span className="rounded-circle bg-primary flex-shrink-0 mt-1" style={{ width: '5px', height: '5px', minWidth: '5px' }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Procedimientos */}
          <div className="col-12 col-md-4">
            <h4 className="fw-bold text-primary text-uppercase mb-3" style={{ fontSize: '11px', letterSpacing: '0.08em' }}>
              Procedimientos
            </h4>
            <ul className="list-unstyled d-flex flex-column gap-2 small text-muted">
              {['Manual Único de Cadena de Custodia', 'Protocolos de Traslado Técnico'].map(item => (
                <li key={item} className="d-flex align-items-start gap-2">
                  <span className="rounded-circle bg-primary flex-shrink-0 mt-1" style={{ width: '5px', height: '5px', minWidth: '5px' }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Procesos Continuos */}
        <div className="mt-4 pt-4 border-top">
          <h3 className="fw-bold text-navy text-uppercase mb-3" style={{ fontSize: '11px', letterSpacing: '0.08em', color: 'var(--usa-navy)' }}>
            Procesos de Carácter Continuo
          </h3>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <div className="p-3 bg-light border rounded-3">
                <span className="fw-bold text-primary text-uppercase d-block mb-2" style={{ fontSize: '10px', letterSpacing: '0.08em' }}>
                  Resguardo y Custodia
                </span>
                <p className="small text-muted mb-0">
                  Protección, conservación y aseguramiento de la integridad física y lógica en depósitos especializados bajo control ambiental.
                </p>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="p-3 bg-light border rounded-3">
                <span className="fw-bold text-primary text-uppercase d-block mb-2" style={{ fontSize: '10px', letterSpacing: '0.08em' }}>
                  Trazabilidad de Transferencia
                </span>
                <p className="small text-muted mb-0">
                  Registro inmutable de cada traspaso de responsabilidad, detallando funcionario actuante, organismo y motivo del movimiento.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
