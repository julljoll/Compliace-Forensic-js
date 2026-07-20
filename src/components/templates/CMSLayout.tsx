'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, FolderOpen, ShieldCheck, ClipboardList,
  BookOpen, Users, Activity, ChevronRight, LogOut,
  Trash2, Menu, X, Search
} from '../atoms/AppleIcon'
import { useCMSStore } from '../../store/cmsStore'
import { useAuthStore } from '../../store/authStore'
import { checkConnection, isNeonConfigured } from '../../db/neonClient'
import StatusDot from '../atoms/StatusDot'
import CommandPalette from '../organisms/CommandPalette'

const menuItems = [
  { path: '/dashboard',                            label: 'Panel Principal',          icon: LayoutDashboard, group: 'Control' },
  { path: '/casos',                                label: 'Gestión de Casos',         icon: FolderOpen,      group: 'Control' },
  { path: '/control/seguimiento-compliance',       label: 'Etapas de Casos',          icon: ShieldCheck,     group: 'Control' },
  { path: '/planillas/acta-obtencion',             label: 'Acta de Obtención',        icon: ClipboardList,   group: 'Planillas Oficiales' },
  { path: '/planillas/acta-entrevista',            label: 'Acta de Entrevista',       icon: ClipboardList,   group: 'Planillas Oficiales' },
  { path: '/planillas/prcc',                       label: 'Planilla PRCC',            icon: ClipboardList,   group: 'Planillas Oficiales' },
  { path: '/planillas/dictamen',                   label: 'Acta Dictamen',            icon: ClipboardList,   group: 'Planillas Oficiales' },
  { path: '/planillas/entrega-resultados',         label: 'Entrega de Resultados',    icon: ClipboardList,   group: 'Planillas Oficiales' },
  { path: '/normativas',                           label: 'Normativas',               icon: BookOpen,        group: 'Planillas Oficiales' },
  { path: '/auditoria',                            label: 'Auditoría',                icon: Activity,        group: 'Sistema' },
  { path: '/personal',                             label: 'Personal',                 icon: Users,           group: 'Sistema' },
]

const groups = ['Control', 'Planillas Oficiales', 'Sistema']

const groupMeta: Record<string, { emoji: string }> = {
  'Control':              { emoji: '📊' },
  'Planillas Oficiales':  { emoji: '📄' },
  'Sistema':              { emoji: '⚙️' },
}

function useIsActive(path: string) {
  const pathname = usePathname()
  if (pathname === path) return true
  return path !== '/dashboard' && pathname.startsWith(path + '/')
}

function SidebarLink({
  item,
  onClick,
}: {
  item: typeof menuItems[number]
  onClick?: () => void
}) {
  const Icon = item.icon
  const active = useIsActive(item.path)
  return (
    <Link
      href={item.path}
      onClick={onClick}
      className={`apple-sidebar-item min-h-[40px] ${active ? 'apple-sidebar-item-active' : ''}`}
    >
      <Icon size={17} strokeWidth={active ? 2.5 : 1.8} className={active ? 'text-[var(--apple-accent)]' : 'text-[#86868B]'} />
      <span className="text-[14px]">{item.label}</span>
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
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
    if (metaTheme) metaTheme.setAttribute('content', '#524000')
  }, [])

  const [mobileOpen, setMobileOpen] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

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
    const match = menuItems.find(m => pathname === m.path || (m.path !== '/dashboard' && pathname.startsWith(m.path + '/')))
    return match?.label ?? 'Panel Principal'
  }

  const SidebarContent = ({ onNav }: { onNav?: () => void }) => (
    <>
      <div className="p-4 border-b border-[var(--apple-border)] flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <img
            src="/logo.png"
            alt="SHA256.US Logo"
            className="w-8 h-8 rounded-[8px] object-contain bg-[#524000] p-1 border border-[#FECF06]/40 shadow-[0_2px_8px_rgba(254,207,6,0.15)] group-hover:scale-105 transition-transform"
          />
          <div>
            <p className="text-[13px] font-bold text-[var(--apple-text)] tracking-[-0.01em] group-hover:text-[var(--apple-accent)] transition-colors">SHA256.US</p>
            <p className="text-[10px] text-[#86868B] tracking-wide uppercase font-semibold">CMS Forense</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-4">
        {groups.map(grp => {
          const items = menuItems.filter(m => m.group === grp)
          const meta = groupMeta[grp]
          return (
            <div key={grp} className="space-y-1">
              <div className="px-2 py-1 flex items-center gap-1.5 text-[10px] font-semibold text-[#86868B] uppercase tracking-wider">
                <span>{meta.emoji}</span>
                <span>{grp}</span>
              </div>
              {items.map(m => (
                <SidebarLink key={m.path} item={m} onClick={onNav} />
              ))}
            </div>
          )
        })}
      </nav>

      <div className="p-3 border-t border-[var(--apple-border)] space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="px-3 py-2 rounded-[8px] bg-[rgba(0,0,0,0.03)]">
            <p className="text-[10px] font-semibold text-[#86868B]">Activos</p>
            <p className="text-[17px] font-bold text-[var(--apple-accent)] tracking-[-0.02em]">{stats.casosActivos}</p>
          </div>
          <div className="px-3 py-2 rounded-[8px] bg-[rgba(0,0,0,0.03)]">
            <p className="text-[10px] font-semibold text-[#86868B]">Cumpl.</p>
            <p className="text-[17px] font-bold text-[#248A3D] tracking-[-0.02em]">{stats.cumplimientoGeneral}%</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-2 py-2 rounded-[8px] hover:bg-[rgba(0,0,0,0.03)] transition-colors group cursor-default">
          <img
            src={user?.profileImage || '/favicon.png'}
            alt=""
            className="w-8 h-8 rounded-full object-cover bg-[rgba(0,0,0,0.03)]"
          />
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-[var(--apple-text)] truncate leading-tight">{user?.nombre || 'Perito Judicial'}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              {sqliteOnline === null ? (
                <>
                  <StatusDot status={null} size={6} />
                  <p className="text-[10px] text-[#86868B] truncate">Verificando SQLite...</p>
                </>
              ) : sqliteOnline ? (
                <>
                  <StatusDot status="online" size={6} />
                  <p className="text-[10px] text-[#34C759] truncate font-medium">SQLite Local (Conectado)</p>
                </>
              ) : (
                <>
                  <StatusDot status="offline" size={6} />
                  <p className="text-[10px] text-[#FF3B30] truncate font-bold">No Conectado</p>
                </>
              )}
            </div>
          </div>
          <button
            onClick={() => { logout(); router.replace('/login') }}
            title="Cerrar sesión"
            className="p-2 rounded-[6px] hover:bg-red-500/10 text-[#86868B] hover:text-[#FF3B30] transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </>
  )

  return (
    <div className="flex h-[100dvh] bg-[var(--apple-bg)] font-sans text-[var(--apple-text)] overflow-hidden">
      <aside className="print:hidden w-[272px] apple-sidebar flex-col shrink-0 hidden sm:flex">
        <SidebarContent />
      </aside>

      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 sm:hidden ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      <div
        ref={drawerRef}
        className={`fixed inset-y-0 left-0 z-50 w-[280px] max-w-[85vw] flex flex-col bg-[var(--apple-sidebar-bg)] backdrop-blur-[40px] border-r border-[var(--apple-border)] shadow-[4px_0_24px_rgba(0,0,0,0.12)] transform transition-transform duration-300 ease-out sm:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        aria-label="Menú de navegación"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[rgba(0,0,0,0.06)] text-[#86868B] hover:text-[var(--apple-text)] transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
          aria-label="Cerrar menú"
        >
          <X size={16} />
        </button>
        <SidebarContent onNav={() => setMobileOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[var(--apple-bg)] print:bg-white print:overflow-visible">
        <header className="print:hidden shrink-0 border-b border-[#524000]/40 bg-[#121412]/90 backdrop-blur-md z-10">
          <div className="flex items-center justify-between px-4 sm:px-6 h-[48px]">
            <div className="flex items-center gap-2 min-w-0">
              <button
                id="hamburger-btn"
                onClick={() => setMobileOpen(true)}
                aria-label="Abrir menú de navegación"
                aria-expanded={mobileOpen}
                className="sm:hidden flex items-center justify-center w-8 h-8 rounded-md text-gray-400 hover:bg-white/5 hover:text-[#FECF06] transition-all"
              >
                <Menu size={20} strokeWidth={2} />
              </button>
              <nav className="flex items-center gap-1.5 text-xs font-mono font-medium min-w-0" aria-label="Ubicación actual">
                <Link href="/dashboard" className="text-[#00FF41] font-extrabold hidden xs:block shrink-0 hover:underline">SHA256.US</Link>
                {pathname !== '/dashboard' && (
                  <>
                    <ChevronRight size={11} className="text-gray-500 shrink-0 hidden xs:block" />
                    <span className="text-white truncate font-sans font-bold">{getBreadcrumb()}</span>
                  </>
                )}
                <span className="text-white truncate font-sans font-bold xs:hidden">{getBreadcrumb()}</span>
              </nav>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setCommandPaletteOpen(true)}
                title="Buscador Spotlight (⌘K)"
                className="flex items-center justify-center w-8 h-8 rounded-md text-gray-400 hover:bg-white/5 hover:text-[#FECF06] transition-all"
              >
                <Search size={15} />
              </button>

              <button
                onClick={verificarSQLite}
                title={sqliteOnline ? 'Conectado a SQLite Local (sha256_forense.sqlite)' : 'No conectado a SQLite Local'}
                className="flex items-center gap-1.5 text-[11px] font-mono font-bold px-2 py-1 rounded bg-[#0a0c0a] border border-[#524000] hover:border-[#FECF06]/50 transition-all cursor-pointer"
              >
                <div className={`w-2 h-2 rounded-full shrink-0 ${sqliteOnline === null ? 'bg-gray-400' : sqliteOnline ? 'bg-[#34C759]' : 'bg-[#FF3B30] animate-pulse'}`} />
                <span className={`hidden md:inline ${sqliteOnline === null ? 'text-gray-400' : sqliteOnline ? 'text-[#34C759]' : 'text-[#FF3B30]'}`}>
                  {sqliteOnline === null ? 'SQLite...' : sqliteOnline ? 'SQLite Local' : 'No Conectado'}
                </span>
              </button>

              <button
                onClick={limpiarDatos}
                title="Limpiar datos temporales"
                className="flex items-center justify-center w-8 h-8 rounded-md text-gray-400 hover:bg-red-500/10 hover:text-[#FF3B30] transition-all"
              >
                <Trash2 size={14} />
              </button>

              <div className="hidden sm:flex items-center gap-1.5 ml-2 select-none">
                <span className="w-3 h-3 rounded-full bg-[#FFCC00] hover:opacity-80 transition-opacity cursor-pointer border border-black/20" title="Minimizar (Amarillo)" />
                <span className="w-3 h-3 rounded-full bg-[#007AFF] hover:opacity-80 transition-opacity cursor-pointer border border-black/20" title="Ampliar (Azul)" />
                <span className="w-3 h-3 rounded-full bg-[#FF3B30] hover:opacity-80 transition-opacity cursor-pointer border border-black/20" title="Cerrar (Rojo)" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto print:overflow-visible print:m-0 print:p-0 -webkit-overflow-scrolling-touch">
          <div className="w-full max-w-6xl mx-auto px-4 py-5 sm:px-6 sm:py-8 md:px-10 md:py-12 apple-fade-in print:max-w-none print:m-0 print:p-0">
            {children}
          </div>
        </main>
      </div>

      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
    </div>
  )
}
