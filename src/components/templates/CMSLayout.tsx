'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Stack from '@mui/material/Stack'

import {
  LayoutDashboard, FolderOpen, ShieldCheck, ClipboardList,
  BookOpen, Users, Activity, ChevronRight, LogOut,
  Trash2, Menu, X, Search
} from '../atoms/AppleIcon'
import { useCMSStore } from '../../store/cmsStore'
import { useAuthStore } from '../../store/authStore'
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
      style={{ textDecoration: 'none' }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          minHeight: '40px',
          px: '12px',
          py: '6px',
          borderRadius: '8px',
          transition: 'all 0.2s ease',
          backgroundColor: active ? 'rgba(254, 207, 6, 0.12)' : 'transparent',
          borderLeft: active ? '3px solid #FECF06' : '3px solid transparent',
          '&:hover': {
            backgroundColor: active ? 'rgba(254, 207, 6, 0.18)' : 'rgba(254, 207, 6, 0.05)',
          },
        }}
      >
        <Icon size={17} className={active ? 'text-[#FECF06]' : 'text-[#86868B]'} />
        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: active ? 600 : 400,
            color: active ? '#FECF06' : '#FFFFFF',
          }}
        >
          {item.label}
        </Typography>
      </Box>
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
    const match = menuItems.find(m => pathname === m.path || (m.path !== '/dashboard' && pathname.startsWith(m.path + '/')))
    return match?.label ?? 'Panel Principal'
  }

  const SidebarContent = ({ onNav }: { onNav?: () => void }) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#121412' }}>
      <Box sx={{ p: '16px', borderBottom: '1px solid rgba(254, 207, 6, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src="/logo.png"
            alt="SHA256.US Logo"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              objectFit: 'contain',
              backgroundColor: '#524000',
              padding: '4px',
              border: '1px solid rgba(254, 207, 6, 0.4)',
              boxShadow: '0 2px 8px rgba(254, 207, 6, 0.15)',
            }}
          />
          <Box>
            <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
              SHA256.US
            </Typography>
            <Typography sx={{ fontSize: '10px', color: '#86868B', textTransform: 'uppercase', fontWeight: 600 }}>
              CMS Forense
            </Typography>
          </Box>
        </Link>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', p: '12px' }}>
        <Stack spacing={2}>
          {groups.map(grp => {
            const items = menuItems.filter(m => m.group === grp)
            const meta = groupMeta[grp]
            return (
              <Box key={grp}>
                <Typography sx={{ px: '8px', py: '4px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', fontWeight: 600, color: '#86868B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <span>{meta.emoji}</span>
                  <span>{grp}</span>
                </Typography>
                <Stack spacing={0.5} sx={{ mt: '4px' }}>
                  {items.map(m => (
                    <SidebarLink key={m.path} item={m} onClick={onNav} />
                  ))}
                </Stack>
              </Box>
            )
          })}
        </Stack>
      </Box>

      <Box sx={{ p: '12px', borderTop: '1px solid rgba(254, 207, 6, 0.2)' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', mb: '12px' }}>
          <Box sx={{ px: '12px', py: '8px', borderRadius: '8px', backgroundColor: 'rgba(254, 207, 6, 0.05)' }}>
            <Typography sx={{ fontSize: '10px', fontWeight: 600, color: '#86868B' }}>Activos</Typography>
            <Typography sx={{ fontSize: '17px', fontWeight: 700, color: '#FECF06' }}>{stats.casosActivos}</Typography>
          </Box>
          <Box sx={{ px: '12px', py: '8px', borderRadius: '8px', backgroundColor: 'rgba(0, 255, 65, 0.05)' }}>
            <Typography sx={{ fontSize: '10px', fontWeight: 600, color: '#86868B' }}>Cumpl.</Typography>
            <Typography sx={{ fontSize: '17px', fontWeight: 700, color: '#00FF41' }}>{stats.cumplimientoGeneral}%</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', p: '8px', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}>
          <img
            src={user?.profileImage || '/favicon.png'}
            alt=""
            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.nombre || 'Perito Judicial'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', mt: '2px' }}>
              <StatusDot status={sqliteOnline ? 'online' : sqliteOnline === false ? 'offline' : null} size={6} />
              <Typography sx={{ fontSize: '10px', color: sqliteOnline ? '#00FF41' : '#FF3B30' }}>
                {sqliteOnline ? 'SQLite Local' : 'No Conectado'}
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={() => { logout(); router.replace('/login') }}
            size="small"
            title="Cerrar sesión"
            sx={{ color: '#86868B', '&:hover': { color: '#FF3B30', backgroundColor: 'rgba(255, 59, 48, 0.1)' } }}
          >
            <LogOut size={14} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#524000', color: '#FFFFFF', overflow: 'hidden' }}>
      {/* Desktop Sidebar */}
      <Box
        component="aside"
        sx={{
          width: '272px',
          flexShrink: 0,
          display: { xs: 'none', sm: 'block' },
          borderRight: '1px solid rgba(254, 207, 6, 0.2)',
          backgroundColor: '#121412',
          '@media print': { display: 'none' },
        }}
      >
        <SidebarContent />
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        slotProps={{
          paper: {
            sx: {
              width: '280px',
              backgroundColor: '#121412',
              borderRight: '1px solid rgba(254, 207, 6, 0.2)',
            },
          },
        }}
        sx={{ display: { xs: 'block', sm: 'none' } }}
      >
        <Box sx={{ position: 'relative', height: '100%' }}>
          <IconButton
            onClick={() => setMobileOpen(false)}
            sx={{ position: 'absolute', top: 12, right: 12, zIndex: 10, color: '#86868B' }}
          >
            <X size={16} />
          </IconButton>
          <SidebarContent onNav={() => setMobileOpen(false)} />
        </Box>
      </Drawer>

      {/* Main Container */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden', backgroundColor: '#524000' }}>
        <Box
          component="header"
          sx={{
            height: '48px',
            borderBottom: '1px solid rgba(82, 64, 0, 0.4)',
            backgroundColor: 'rgba(18, 20, 18, 0.9)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: { xs: 2, sm: 3 },
            zIndex: 10,
            '@media print': { display: 'none' },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              onClick={() => setMobileOpen(true)}
              sx={{ display: { xs: 'flex', sm: 'none' }, color: '#86868B' }}
            >
              <Menu size={20} />
            </IconButton>

            <Breadcrumbs
              separator={<ChevronRight size={11} style={{ color: '#86868B' }} />}
              aria-label="breadcrumb"
              sx={{ '& .MuiBreadcrumbs-separator': { color: '#86868B' } }}
            >
              <Link href="/dashboard" style={{ textDecoration: 'none' }}>
                <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#00FF41', fontFamily: 'monospace' }}>
                  SHA256.US
                </Typography>
              </Link>
              {pathname !== '/dashboard' && (
                <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#FFFFFF' }}>
                  {getBreadcrumb()}
                </Typography>
              )}
            </Breadcrumbs>
          </Box>

          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <IconButton
              onClick={() => setCommandPaletteOpen(true)}
              title="Buscador Spotlight (⌘K)"
              sx={{ color: '#86868B', '&:hover': { color: '#FECF06', backgroundColor: 'rgba(254, 207, 6, 0.08)' } }}
            >
              <Search size={15} />
            </IconButton>

            <Box
              onClick={verificarSQLite}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                px: '8px',
                py: '4px',
                borderRadius: '4px',
                backgroundColor: '#0a0c0a',
                border: '1px solid #524000',
                cursor: 'pointer',
                '&:hover': { borderColor: 'rgba(254, 207, 6, 0.5)' },
              }}
            >
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: sqliteOnline ? '#00FF41' : '#FF3B30' }} />
              <Typography sx={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 700, color: sqliteOnline ? '#00FF41' : '#FF3B30', display: { xs: 'none', md: 'block' } }}>
                {sqliteOnline ? 'SQLite Local' : 'No Conectado'}
              </Typography>
            </Box>

            <IconButton
              onClick={limpiarDatos}
              title="Limpiar datos temporales"
              sx={{ color: '#86868B', '&:hover': { color: '#FF3B30', backgroundColor: 'rgba(255, 59, 48, 0.1)' } }}
            >
              <Trash2 size={14} />
            </IconButton>
          </Stack>
        </Box>

        <Box component="main" sx={{ flex: 1, overflowY: 'auto', p: { xs: 2, sm: 3, md: 4 } }}>
          <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
            {children}
          </Box>
        </Box>
      </Box>

      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
    </Box>
  )
}
