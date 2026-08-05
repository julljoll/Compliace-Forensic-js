import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      className="min-vh-100 min-vw-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: 'var(--usa-navy)' }}
    >
      <div className="text-center p-4 bg-white rounded-3 shadow-lg border border-2" style={{ maxWidth: '400px', borderColor: 'var(--usa-border)' }}>
        <h1 className="display-1 fw-bold text-success font-monospace mb-2">
          404
        </h1>
        <h2 className="h5 fw-bold text-navy mb-3" style={{ color: 'var(--usa-navy)' }}>
          Página no encontrada
        </h2>
        <p className="small text-muted mb-4">
          La ruta especificada no existe o no tiene los permisos suficientes en el sistema.
        </p>
        <Link
          href="/"
          className="btn btn-warning fw-bold px-4 py-2 text-navy"
        >
          Volver al Panel
        </Link>
      </div>
    </div>
  );
}
