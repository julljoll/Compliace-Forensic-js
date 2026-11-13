'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import {
  LayoutDashboard, FolderOpen, ShieldCheck, ClipboardList,
  BookOpen, Users, Activity, ChevronRight, LogOut,
  Trash2, Menu, X, Search, Shield
} from '../atoms/AppleIcon'
import { useCMSStore } from '../../store/cmsStore'
import { useAuthStore } from '../../store/authStore'
import StatusDot from '../atoms/StatusDot'
import CommandPalette from '../organisms/CommandPalette'
import USWDSGovBanner from '../organisms/Planillas/USWDSGovBanner'

const menuGroups = [
  {
    groupTitle: 'Panel & Operaciones',
    emoji: '📊',
    items: [
      { path: '/dashboard', label: 'Panel Principal', icon: LayoutDashboard },
      { path: '/casos', label: 'Gestión de Casos', icon: FolderOpen },
      { path: '/control/seguimiento-compliance', label: 'Seguimiento Compliance', icon: ShieldCheck },
    ],
  },
  {
    groupTitle: 'Planillas Oficiales',
    emoji: '📄',
    isCollapsible: true,
    mainPath: '/planillas',
    mainLabel: 'Directorio General',
    mainIcon: BookOpen,
    etapas: [
      {
        etapaNombre: 'Etapa 1: Consignación & Consentimiento',
        items: [
          { path: '/planillas/acta-obtencion', label: '1.1 Acta Obtención', icon: ClipboardList },
          { path: '/planillas/acta-consentimiento', label: '1.2 Consentimiento & Data', icon: ClipboardList },
        ],
      },
      {
        etapaNombre: 'Etapa 2: Custodia & Laboratorio',
        items: [
          { path: '/planillas/prcc', label: '2.1 Planilla PRCC', icon: ClipboardList },
          { path: '/planillas/acta-desprecintado', label: '2.2 Desprecintado Lab', icon: ClipboardList },
          { path: '/planillas/acta-entrevista', label: '2.3 Acta Entrevista', icon: ClipboardList },
        ],
      },
      {
        etapaNombre: 'Etapa 3: Análisis & Dictamen',
        items: [
          { path: '/planillas/acta-auditoria-timeline', label: '3.1 Auditoría Hash SHA', icon: ClipboardList },
          { path: '/planillas/dictamen', label: '3.2 Dictámenes Periciales', icon: ClipboardList },
          { path: '/planillas/informe-audio-sonic', label: '3.3 Informe Audio (Sonic)', icon: ClipboardList },
        ],
      },
      {
        etapaNombre: 'Etapa 4: Cierre & Devolución',
        items: [
          { path: '/planillas/acta-sanitizacion', label: '4.1 Sanitización Wipe', icon: ClipboardList },
          { path: '/planillas/entrega-resultados', label: '4.2 Entrega Resultados', icon: ClipboardList },
          { path: '/planillas/evaluacion-ux', label: '4.3 Evaluación UX/UI', icon: ClipboardList },
        ],
      },
    ],
  },
  {
    groupTitle: 'Marco Legal & Auditoría',
    emoji: '⚖️',
    items: [
      { path: '/normativas', label: 'Marco Normativo RAG', icon: Shield },
      { path: '/auditoria', label: 'Auditoría SHA-256', icon: Activity },
    ],
  },
  {
    groupTitle: 'Administración',
    emoji: '⚙️',
    items: [
      { path: '/personal', label: 'Personal & Peritos', icon: Users },
    ],
  },
]

function useIsActive(path: string) {
  const pathname = usePathname()
  if (pathname === path) return true
  return path !== '/dashboard' && pathname.startsWith(path + '/')
}

function SidebarLink({
  item,
  onClick,
  isSubItem = false,
}: {
  item: { path: string; label: string; icon: any }
  onClick?: () => void
  isSubItem?: boolean
}) {
  const Icon = item.icon
  const active = useIsActive(item.path)
  return (
    <Link
      href={item.path}
      onClick={onClick}
      className={`d-flex align-items-center gap-2 text-decoration-none px-3 py-2 rounded-2 transition-all ${
        active
          ? 'bg-primary bg-opacity-25 text-warning border-start border-3 border-warning fw-bold'
          : 'text-white-50 hover-bg-light'
      }`}
      style={{
        paddingLeft: isSubItem ? '1.5rem' : '0.75rem',
        fontSize: isSubItem ? '12.5px' : '13.5px',
        backgroundColor: active ? 'rgba(217, 167, 0, 0.15)' : 'transparent',
        borderLeft: active ? '3px solid var(--usa-gold)' : '3px solid transparent',
        color: active ? 'var(--usa-gold)' : isSubItem ? 'var(--usa-border)' : '#FFFFFF',
      }}
    >
      <Icon size={isSubItem ? 14 : 16} style={{ color: active ? 'var(--usa-gold)' : '#94A3B8' }} />
      <span>{item.label}</span>
    </Link>
  )
}

export default function CMSLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const getEstadisticas = useCMSStore(state => state.getEstadisticas)
  const fetchCasos = useCMSStore(state => state.fetchCasos)
  const { user, logout } = useAuthStore()
  const stats = getEstadisticas()

  const [planillasExpanded, setPlanillasExpanded] = useState<boolean>(true)

  useEffect(() => {
    if (pathname.startsWith('/planillas')) {
      setPlanillasExpanded(true)
    }
  }, [pathname])

  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    const metaTheme = document.querySelector('meta[name="theme-color"]')
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
    if (metaTheme) metaTheme.setAttribute('content', '#112E51')
  }, [])

  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => { setMobileOpen(false) }, [pathname])

  const [sqliteOnline, setSqliteOnline] = useState<boolean | null>(null)

  const verificarSQLite = useCallback(async () => {
    try {
      const res = await fetch('/api/db/local')
      if (res.ok) {
        const data = await res.json()
        setSqliteOnline(data.sqlite_ready !== false)
      } else {
        setSqliteOnline(false)
      }
    } catch {
      setSqliteOnline(false)
    }
  }, [])

  useEffect(() => {
    verificarSQLite()
    const id = setInterval(verificarSQLite, 15000)
    return () => clearInterval(id)
  }, [verificarSQLite])

  useEffect(() => { fetchCasos() }, [fetchCasos])

  const limpiarDatos = () => {
    if (!window.confirm('¿Limpiar datos temporales (cookies, localStorage, sesión)? Se cerrará su sesión.')) return
    localStorage.clear()
    document.cookie.split(';').forEach(c => {
      document.cookie = c.replace(/^ +/, '').replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`)
    })
    window.location.reload()
  }

  const getBreadcrumb = () => {
    if (pathname.startsWith('/planillas')) return 'Directorio de Planillas'
    if (pathname.startsWith('/casos')) return 'Gestión de Casos'
    if (pathname.startsWith('/control')) return 'Seguimiento Compliance'
    if (pathname.startsWith('/normativas')) return 'Marco Normativo RAG'
    if (pathname.startsWith('/auditoria')) return 'Auditoría SHA-256'
    if (pathname.startsWith('/personal')) return 'Personal & Peritos'
    return 'Panel Principal'
  }

  const SidebarContent = ({ onNav }: { onNav?: () => void }) => (
    <div className="d-flex flex-column h-100" style={{ backgroundColor: '#112E51', borderRight: '1px solid #1A2536' }}>
      {/* Brand Header */}
      <div className="p-3 border-bottom border-white border-opacity-10 d-flex align-items-center justify-content-between">
        <Link
          href="/dashboard"
          title="SHA256.US — Lab. Informática Forense"
          aria-label="SHA256.US — Lab. Informática Forense"
          className="d-flex align-items-center gap-2 text-decoration-none text-white flex-grow-1"
        >
          <img
            src="/logo.png"
            alt="SHA256.US"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '6px',
              objectFit: 'contain',
              backgroundColor: '#FFFFFF',
              padding: '4px',
              border: '1px solid var(--usa-gold)',
            }}
          />
          <div className="d-flex flex-column">
            <span className="fw-black text-white font-monospace" style={{ fontSize: '14px', letterSpacing: '0.04em', lineHeight: 1.1 }}>
              SHA256.US
            </span>
            <span className="fw-bold" style={{ fontSize: '10px', color: 'var(--usa-gold)', letterSpacing: '0.02em', lineHeight: 1.2 }}>
              Lab. Informática Forense
            </span>
          </div>
        </Link>
        <span className="usa-tag usa-tag--info" style={{ fontSize: '9px', backgroundColor: 'rgba(217, 167, 0, 0.2)', color: 'var(--usa-gold)', borderColor: 'var(--usa-gold)' }}>
          USWDS
        </span>
      </div>

      {/* Navigation Groups */}
      <div className="flex-grow-1 overflow-auto p-2">
        <div className="d-flex flex-column gap-3">
          {menuGroups.map(grp => (
            <div key={grp.groupTitle}>
              {/* Group Header */}
              <div className="px-2 py-1 mb-1 d-flex align-items-center gap-2 text-uppercase fw-bold" style={{ fontSize: '9.5px', color: '#94A3B8', letterSpacing: '0.08em' }}>
                <span>{grp.emoji}</span>
                <span>{grp.groupTitle}</span>
              </div>

              {!grp.isCollapsible ? (
                <div className="d-flex flex-column gap-1">
                  {grp.items?.map(m => (
                    <SidebarLink key={m.path} item={m} onClick={onNav} />
                  ))}
                </div>
              ) : (
                <div className="rounded-3 p-1" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div
                    onClick={() => setPlanillasExpanded(!planillasExpanded)}
                    className="d-flex align-items-center justify-content-between px-2 py-2 rounded-2 cursor-pointer"
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <grp.mainIcon size={16} style={{ color: pathname.startsWith('/planillas') ? 'var(--usa-gold)' : '#94A3B8' }} />
                      <span className="fw-bold text-white" style={{ fontSize: '13px', color: pathname.startsWith('/planillas') ? 'var(--usa-gold)' : '#FFFFFF' }}>
                        {grp.mainLabel}
                      </span>
                    </div>
                    <ChevronRight
                      size={14}
                      style={{
                        color: '#94A3B8',
                        transform: planillasExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                      }}
                    />
                  </div>

                  {planillasExpanded && (
                    <div className="d-flex flex-column gap-2 mt-1 pb-1">
                      {grp.etapas.map(etapa => (
                        <div key={etapa.etapaNombre}>
                          <div className="px-3 py-1 text-uppercase fw-bold" style={{ fontSize: '9px', color: 'var(--usa-gold)', letterSpacing: '0.04em' }}>
                            {etapa.etapaNombre}
                          </div>
                          <div className="d-flex flex-column gap-1">
                            {etapa.items.map(m => (
                              <SidebarLink key={m.path} item={m} onClick={onNav} isSubItem />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-2 border-top border-white border-opacity-10">
        <div className="row g-2 mb-2">
          <div className="col-6">
            <div className="px-2 py-1 rounded-2" style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="text-uppercase fw-bold" style={{ fontSize: '9px', color: '#94A3B8' }}>Activos</div>
              <div className="fw-bold font-monospace" style={{ fontSize: '18px', color: 'var(--usa-gold)' }}>{stats.casosActivos}</div>
            </div>
          </div>
          <div className="col-6">
            <div className="px-2 py-1 rounded-2" style={{ backgroundColor: 'rgba(0,136,55,0.2)', border: '1px solid rgba(0,136,55,0.4)' }}>
              <div className="text-uppercase fw-bold" style={{ fontSize: '9px', color: '#94A3B8' }}>Cumpl.</div>
              <div className="fw-bold font-monospace" style={{ fontSize: '18px', color: '#86EFAC' }}>{stats.cumplimientoGeneral}%</div>
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2 p-2 rounded-2" style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="rounded-circle bg-warning text-dark fw-bold d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '28px', height: '28px', fontSize: '11px' }}>
            {(user?.nombre || 'P').charAt(0).toUpperCase()}
          </div>
          <div className="flex-grow-1 min-w-0">
            <div className="fw-bold text-white text-truncate" style={{ fontSize: '11px', lineHeight: 1.2 }}>
              {user?.nombre || 'Perito Judicial'}
            </div>
            <div className="d-flex align-items-center gap-1 mt-1">
              <StatusDot status={sqliteOnline ? 'online' : sqliteOnline === false ? 'offline' : null} size={5} />
              <span className="font-monospace" style={{ fontSize: '9px', color: sqliteOnline ? '#86EFAC' : '#FCA5A5' }}>
                {sqliteOnline ? 'SQLite OK' : 'Offline'}
              </span>
            </div>
          </div>
          <button
            onClick={() => { logout(); router.replace('/login') }}
            className="btn btn-sm btn-link text-white-50 p-1"
            title="Cerrar sesión"
            type="button"
          >
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="d-flex vh-100 overflow-hidden" style={{ backgroundColor: 'var(--usa-bg-main)', color: 'var(--usa-text)' }}>
      {/* Desktop Sidebar */}
      <aside className="d-none d-md-block flex-shrink-0" style={{ width: '256px' }}>
        <SidebarContent />
      </aside>

      {/* Mobile Drawer (Offcanvas Bootstrap) */}
      {mobileOpen && (
        <div className="offcanvas offcanvas-start show d-md-none" style={{ visibility: 'visible', width: '270px', backgroundColor: '#112E51' }}>
          <div className="offcanvas-header p-2 text-end">
            <button type="button" className="btn-close btn-close-white" onClick={() => setMobileOpen(false)} aria-label="Close"></button>
          </div>
          <div className="offcanvas-body p-0">
            <SidebarContent onNav={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-grow-1 d-flex flex-column min-w-0 overflow-hidden" style={{ backgroundColor: 'var(--usa-bg-main)' }}>
        <USWDSGovBanner />
        
        {/* Header Superior Navbar */}
        <header className="d-flex align-items-center justify-content-between px-3 border-bottom bg-white" style={{ height: '48px', borderColor: 'var(--usa-border)' }}>
          <div className="d-flex align-items-center gap-2">
            <button
              onClick={() => setMobileOpen(true)}
              className="btn btn-sm btn-light d-md-none text-navy p-1"
              type="button"
            >
              <Menu size={20} />
            </button>

            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0 align-items-center" style={{ fontSize: '12px' }}>
                <li className="breadcrumb-item">
                  <Link href="/dashboard" className="text-decoration-none fw-black font-monospace" style={{ color: 'var(--usa-navy)' }}>
                    SHA256.US
                  </Link>
                </li>
                {pathname !== '/dashboard' && (
                  <li className="breadcrumb-item active fw-semibold" style={{ color: 'var(--usa-text-muted)' }}>
                    {getBreadcrumb()}
                  </li>
                )}
              </ol>
            </nav>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 border-0"
              title="Buscador Spotlight (⌘K)"
              type="button"
            >
              <Search size={16} />
            </button>

            <div
              onClick={verificarSQLite}
              className={`d-flex align-items-center gap-1 px-2 py-1 rounded border cursor-pointer ${
                sqliteOnline ? 'bg-success-subtle border-success-subtle text-success' : 'bg-danger-subtle border-danger-subtle text-danger'
              }`}
              style={{ cursor: 'pointer', fontSize: '10px' }}
              title={sqliteOnline ? 'BD Local activa — click para verificar' : 'Sin conexión local'}
            >
              <div className={`rounded-circle ${sqliteOnline ? 'bg-success' : 'bg-danger'}`} style={{ width: 6, height: 6 }} />
              <span className="font-monospace fw-bold d-none d-md-inline">
                {sqliteOnline ? 'SQLite OK' : 'Offline'}
              </span>
            </div>

            <button
              onClick={limpiarDatos}
              className="btn btn-sm btn-outline-danger border-0 p-1"
              title="Limpiar datos temporales"
              type="button"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </header>

        {/* Dynamic Page Content Area */}
        <main className="flex-grow-1 overflow-auto p-3 p-md-4" style={{ backgroundColor: 'var(--usa-bg-main)' }}>
          <div className="container-fluid max-w-1280 px-0">
            {children}
          </div>
        </main>
      </div>

      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
    </div>
  )
}
