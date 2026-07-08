export default function NotFound() {
  return (
    <div className="h-screen w-screen bg-[var(--apple-bg)] flex items-center justify-center font-sans">
      <div className="text-center apple-fade-in">
        <h1 className="text-[#00FF41] text-6xl font-bold mb-4">404</h1>
        <p className="text-[var(--apple-text-muted)] text-lg mb-6">Página no encontrada</p>
        <a href="/" className="apple-btn apple-btn-primary">
          Volver al Panel
        </a>
      </div>
    </div>
  )
}
