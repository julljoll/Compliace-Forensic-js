'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'

import {
  LayoutDashboard, FolderOpen, ShieldCheck, ClipboardList,
  BookOpen, Users, Activity, ChevronRight, LogOut,
  Trash2, Menu, X, Search, Shield
} from '../atoms/AppleIcon'
import { useCMSStore } from '../../store/cmsStore'
import { useAuthStore } from '../../store/authStore'
import StatusDot from '../atoms/StatusDot'
import CommandPalette from '../organisms/CommandPalette'

const menuItems = [
  { path: '/dashboard',                            label: 'Panel Principal',          icon: LayoutDashboard, group: 'Control' },
  { path: '/casos',                                label: 'Gestión de Casos',         icon: FolderOpen,      group: 'Control' },
  { path: '/control/seguimiento-compliance',       label: 'Seguimiento Normativo',    icon: ShieldCheck,     group: 'Control' },
  { path: '/planillas',                            label: 'Directorio de Planillas',  icon: BookOpen,        group: 'Planillas Oficiales' },
  { path: '/planillas/acta-obtencion',             label: '1.1 Acta Obtención',       icon: ClipboardList,   group: 'Planillas Oficiales' },
  { path: '/planillas/acta-consentimiento',        label: '1.2 Consentimiento & Data',icon: ClipboardList,   group: 'Planillas Oficiales' },
  { path: '/planillas/prcc',                       label: '2.1 Planilla PRCC',        icon: ClipboardList,   group: 'Planillas Oficiales' },
  { path: '/planillas/acta-desprecintado',         label: '2.2 Desprecintado Lab',    icon: ClipboardList,   group: 'Planillas Oficiales' },
  { path: '/planillas/acta-entrevista',            label: '2.3 Acta Entrevista',      icon: ClipboardList,   group: 'Planillas Oficiales' },
  { path: '/planillas/timeline-compliance',        label: '3.1 Timeline Compliance',  icon: ClipboardList,   group: 'Planillas Oficiales' },
  { path: '/planillas/acta-auditoria-timeline',    label: '3.2 Auditoría Hash SHA',   icon: ClipboardList,   group: 'Planillas Oficiales' },
  { path: '/planillas/dictamen',                   label: '3.3 Dictamen Pericial',    icon: ClipboardList,   group: 'Planillas Oficiales' },
  { path: '/planillas/entrega-resultados',         label: '4.1 Entrega Resultados',   icon: ClipboardList,   group: 'Planillas Oficiales' },
  { path: '/planillas/acta-sanitizacion',          label: '4.2 Sanitización Wipe',    icon: ClipboardList,   group: 'Planillas Oficiales' },
  { path: '/normativas',                           label: 'Normativas RAG',           icon: Shield,          group: 'Planillas Oficiales' },
  { path: '/auditoria',                            label: 'Auditoría SHA-256',        icon: Activity,        group: 'Sistema' },
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
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#0D1117', borderRight: '1px solid rgba(48,54,61,0.8)' }}>
      <Box sx={{ p: '14px 16px', borderBottom: '1px solid rgba(48,54,61,0.8)', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
          <img
            src="/logo.png"
            alt="SHA256.US Logo"
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '6px',
              objectFit: 'contain',
              backgroundColor: 'rgba(254, 207, 6, 0.08)',
              padding: '4px',
              border: '1px solid rgba(254, 207, 6, 0.3)',
            }}
          />
          <Box>
            <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#E6EDF3', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
              SHA256.US
            </Typography>
            <Typography sx={{ fontSize: '9px', color: '#8B949E', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.06em' }}>
              Compliance Officer CMS
            </Typography>
          </Box>
        </Link>
        <Chip
          label="v3"
          size="small"
          sx={{ fontSize: '9px', height: '18px', backgroundColor: 'rgba(254,207,6,0.1)', color: '#FECF06', border: '1px solid rgba(254,207,6,0.2)', fontWeight: 700 }}
        />
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', p: '8px 10px' }}>
        <Stack spacing={1.5}>
          {groups.map(grp => {
            const items = menuItems.filter(m => m.group === grp)
            const meta = groupMeta[grp]
            return (
              <Box key={grp}>
                <Typography sx={{ px: '8px', py: '6px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '9.5px', fontWeight: 700, color: '#484F58', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  <span>{meta.emoji}</span>
                  <span>{grp}</span>
                </Typography>
                <Stack spacing={0.25}>
                  {items.map(m => (
                    <SidebarLink key={m.path} item={m} onClick={onNav} />
                  ))}
                </Stack>
              </Box>
            )
          })}
        </Stack>
      </Box>

      <Box sx={{ p: '10px', borderTop: '1px solid rgba(48,54,61,0.8)' }}>
        {/* KPI mini bar */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', mb: '10px' }}>
          <Box sx={{ px: '10px', py: '7px', borderRadius: '6px', backgroundColor: 'rgba(254, 207, 6, 0.06)', border: '1px solid rgba(254,207,6,0.12)' }}>
            <Typography sx={{ fontSize: '9px', fontWeight: 700, color: '#8B949E', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Activos</Typography>
            <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#FECF06', lineHeight: 1.2 }}>{stats.casosActivos}</Typography>
          </Box>
          <Box sx={{ px: '10px', py: '7px', borderRadius: '6px', backgroundColor: 'rgba(0, 255, 65, 0.05)', border: '1px solid rgba(0,255,65,0.12)' }}>
            <Typography sx={{ fontSize: '9px', fontWeight: 700, color: '#8B949E', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Cumpl.</Typography>
            <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#00FF41', lineHeight: 1.2 }}>{stats.cumplimientoGeneral}%</Typography>
          </Box>
        </Box>

        {/* User card */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', p: '8px', borderRadius: '6px', backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(48,54,61,0.6)' }}>
          <Box sx={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(254,207,6,0.15)', border: '1px solid rgba(254,207,6,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#FECF06' }}>
              {(user?.nombre || 'P').charAt(0).toUpperCase()}
            </Typography>
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: '11px', fontWeight: 600, color: '#E6EDF3', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.2 }}>
              {user?.nombre || 'Perito Judicial'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', mt: '2px' }}>
              <StatusDot status={sqliteOnline ? 'online' : sqliteOnline === false ? 'offline' : null} size={5} />
              <Typography sx={{ fontSize: '9px', color: sqliteOnline ? '#00FF41' : '#FF3B30', fontFamily: 'monospace' }}>
                {sqliteOnline ? 'SQLite OK' : 'Offline'}
              </Typography>
            </Box>
          </Box>
          <Tooltip title="Cerrar sesión" placement="top">
            <IconButton
              onClick={() => { logout(); router.replace('/login') }}
              size="small"
              sx={{ color: '#484F58', '&:hover': { color: '#FF3B30', backgroundColor: 'rgba(255, 59, 48, 0.08)' } }}
            >
              <LogOut size={13} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#0D1117', color: '#E6EDF3', overflow: 'hidden' }}>
      {/* Desktop Sidebar */}
      <Box
        component="aside"
        sx={{
          width: '256px',
          flexShrink: 0,
          display: { xs: 'none', sm: 'block' },
          borderRight: '1px solid rgba(48,54,61,0.8)',
          backgroundColor: '#0D1117',
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
              width: '270px',
              backgroundColor: '#0D1117',
              borderRight: '1px solid rgba(48,54,61,0.8)',
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
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden', backgroundColor: '#0D1117' }}>
        <Box
          component="header"
          sx={{
            height: '46px',
            borderBottom: '1px solid rgba(48,54,61,0.8)',
            backgroundColor: 'rgba(13, 17, 23, 0.95)',
            backdropFilter: 'blur(12px)',
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
                <Typography sx={{ fontSize: '11px', fontWeight: 800, color: '#00FF41', fontFamily: 'monospace', letterSpacing: '0.04em' }}>
                  SHA256.US
                </Typography>
              </Link>
              {pathname !== '/dashboard' && (
                <Typography sx={{ fontSize: '11px', fontWeight: 500, color: '#8B949E' }}>
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

            <Tooltip title={sqliteOnline ? 'BD Local activa — click para verificar' : 'Sin conexión local'} placement="bottom">
              <Box
                onClick={verificarSQLite}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  px: '8px',
                  py: '3px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(13,17,23,0.8)',
                  border: `1px solid ${sqliteOnline ? 'rgba(0,255,65,0.2)' : 'rgba(255,59,48,0.2)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  '&:hover': { borderColor: sqliteOnline ? 'rgba(0,255,65,0.5)' : 'rgba(255,59,48,0.5)' },
                }}
              >
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: sqliteOnline ? '#00FF41' : '#FF3B30', boxShadow: sqliteOnline ? '0 0 4px #00FF41' : 'none' }} />
                <Typography sx={{ fontSize: '10px', fontFamily: 'monospace', fontWeight: 700, color: sqliteOnline ? '#00FF41' : '#FF3B30', display: { xs: 'none', md: 'block' } }}>
                  {sqliteOnline ? 'SQLite OK' : 'Offline'}
                </Typography>
              </Box>
            </Tooltip>

            <IconButton
              onClick={limpiarDatos}
              title="Limpiar datos temporales"
              sx={{ color: '#86868B', '&:hover': { color: '#FF3B30', backgroundColor: 'rgba(255, 59, 48, 0.1)' } }}
            >
              <Trash2 size={14} />
            </IconButton>
          </Stack>
        </Box>

        <Box component="main" sx={{ flex: 1, overflowY: 'auto', p: { xs: 2, sm: 2.5, md: 3 }, backgroundColor: '#0D1117' }}>
          <Box sx={{ maxWidth: '1280px', mx: 'auto' }}>
            {children}
          </Box>
        </Box>
      </Box>

      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
    </Box>
  )
}
