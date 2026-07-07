import { useEffect, useState, useCallback, useRef } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FolderOpen, ShieldCheck, ClipboardList,
  BookOpen, Users, Activity, ChevronRight, Smartphone, LogOut,
  Database, Trash2, Sun, Moon, Menu, X, Search
} from '../atoms/AppleIcon';
import { useCMSStore } from '../../store/cmsStore';
import { useAuthStore } from '../../store/authStore';
import { checkConnection, isNeonConfigured } from '../../db/neonClient';
import StatusDot from '../atoms/StatusDot';
import CommandPalette from '../organisms/CommandPalette';

const menuItems = [
  { path: '/',                                   label: 'Panel Principal',          icon: LayoutDashboard, group: 'Control' },
  { path: '/casos',                              label: 'Gestión de Casos',         icon: FolderOpen,      group: 'Control' },
  { path: '/control/seguimiento-compliance',     label: 'Etapas de Casos',          icon: ShieldCheck,     group: 'Control' },
  { path: '/forense/tutoriales',                 label: 'Academia Forense',         icon: BookOpen,        group: 'Formación' },
  { path: '/forense/manual-avilla',              label: 'Manual Avilla',            icon: Smartphone,      group: 'Formación' },
  { path: '/forense/manual-serverless',          label: 'Manual Serverless',        icon: Database,        group: 'Formación' },
  { path: '/planillas/acta-obtencion',           label: 'Acta de Obtención',        icon: ClipboardList,   group: 'Planillas Oficiales' },
  { path: '/planillas/acta-entrevista',          label: 'Acta de Entrevista',       icon: ClipboardList,   group: 'Planillas Oficiales' },
  { path: '/planillas/prcc-derivacion',          label: 'Planilla PRCC',            icon: ClipboardList,   group: 'Planillas Oficiales' },
  { path: '/planillas/dictamen',                 label: 'Acta Dictamen',            icon: ClipboardList,   group: 'Planillas Oficiales' },
  { path: '/planillas/entrega-resultados',       label: 'Entrega de Resultados',    icon: ClipboardList,   group: 'Planillas Oficiales' },
  { path: '/normativas',                         label: 'Normativas',               icon: BookOpen,        group: 'Planillas Oficiales' },
  { path: '/auditoria',                          label: 'Auditoría',                icon: Activity,        group: 'Sistema' },
  { path: '/personal',                           label: 'Personal',                 icon: Users,           group: 'Sistema' },
];

const groups = ['Control', 'Formación', 'Planillas Oficiales', 'Sistema'];

const groupMeta: Record<string, { emoji: string }> = {
  'Control':              { emoji: '📊' },
  'Formación':           { emoji: '🎓' },
  'Planillas Oficiales':  { emoji: '📄' },
  'Sistema':              { emoji: '⚙️' },
};


/** Determina si un item está activo dado el pathname actual */
function useIsActive(path: string) {
  const location = useLocation();
  const [itemPathname] = path.split('?');
  if (location.pathname === itemPathname) return true;
  return itemPathname !== '/' && location.pathname.startsWith(itemPathname + '/');
}

/** Item individual del sidebar (reutilizable en desktop y drawer) */
function SidebarLink({
  item,
  onClick,
}: {
  item: typeof menuItems[number];
  onClick?: () => void;
}) {
  const Icon = item.icon;
  const active = useIsActive(item.path);
  return (
    <Link
      to={item.path}
      onClick={onClick}
      className={`apple-sidebar-item min-h-[40px] ${active ? 'apple-sidebar-item-active' : ''}`}
    >
      <Icon size={17} strokeWidth={active ? 2.5 : 1.8} className={active ? 'text-[var(--apple-accent)]' : 'text-[#86868B]'} />
      <span className="text-[14px]">{item.label}</span>
    </Link>
  );
}

export default function CMSLayout() {
  const location = useLocation();
  const getEstadisticas = useCMSStore(state => state.getEstadisticas);
  const fetchCasos = useCMSStore(state => state.fetchCasos);
  const { user, logout } = useAuthStore();
  const stats = getEstadisticas();
  const [dbOnline, setDbOnline] = useState<boolean | null>(null);

  /* ── Command Palette (⌘K) ── */
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  /* ── Tema ── */
  const [isDark, setIsDark] = useState(() => {
    const theme = localStorage.getItem('theme');
    if (theme === null) return true; // Por defecto modo oscuro
    return theme === 'dark';
  });
  useEffect(() => {
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      if (metaTheme) metaTheme.setAttribute('content', '#1C1C1E');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      if (metaTheme) metaTheme.setAttribute('content', '#F5F5F7');
    }
  }, [isDark]);

  /* ── Menú móvil ── */
  const [mobileOpen, setMobileOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Bloquear scroll del body cuando el drawer está abierto
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Cerrar drawer al navegar
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  // Cerrar con tecla Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  /* ── DB ── */
  const verificarDB = useCallback(async () => {
    const ok = await checkConnection();
    setDbOnline(ok);
  }, []);
  useEffect(() => {
    verificarDB();
    const id = setInterval(verificarDB, 30000);
    return () => clearInterval(id);
  }, [verificarDB]);

  useEffect(() => { fetchCasos(); }, [fetchCasos]);

  /* ── Utilidades ── */
  const limpiarDatos = () => {
    if (!window.confirm('¿Limpiar datos temporales (cookies, localStorage, sesión)? Se cerrará su sesión.')) return;
    localStorage.clear();
    document.cookie.split(';').forEach(c => {
      document.cookie = c.replace(/^ +/, '').replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
    });
    window.location.reload();
  };

  const getBreadcrumb = () => {
    const match = menuItems.find(m => {
      const [p] = m.path.split('?');
      return p === location.pathname || (p !== '/' && location.pathname.startsWith(p + '/'));
    });
    return match?.label ?? 'Panel Principal';
  };

  /* ── Contenido del sidebar (compartido entre desktop y drawer) ── */
  const SidebarContent = ({ onNav }: { onNav?: () => void }) => (
    <>
      {/* Branding */}
      <div className="px-5 pt-5 pb-3 shrink-0">
        <div className="flex items-center gap-3">
          <img src="https://ik.imagekit.io/lvxdbpx6l/APP%20FORENSICS/favicon.svg" alt="" className="w-9 h-9" />
          <div>
            <p className="text-[15px] font-bold tracking-[-0.01em] text-[var(--apple-text)] leading-tight">SHA256.US</p>
            <p className="text-[10px] font-medium text-[#86868B] tracking-[0.02em]">CMS Forense</p>
          </div>
        </div>
      </div>

      <div className="apple-separator mx-4 shrink-0" />

      {/* Navegación */}
      <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-1">
        {groups.map((group, groupIdx) => {
          const items = menuItems.filter(m => m.group === group);
          if (!items.length) return null;
          const meta = groupMeta[group];
          return (
            <div key={group}>
              {groupIdx > 0 && (
                <div className="mx-2 my-2.5 h-px bg-[var(--apple-separator)]" />
              )}
              <p className="apple-section-header flex items-center gap-1.5 mb-1">
                <span>{meta.emoji}</span>
                <span>{group}</span>
              </p>
              <div className="space-y-0.5">
                {items.map(item => (
                  <SidebarLink key={item.path} item={item} onClick={onNav} />
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer: Stats + Usuario */}
      <div className="px-4 py-3 border-t border-[var(--apple-separator)] space-y-3 shrink-0">
        <div className="grid grid-cols-2 gap-2">
          <div className="px-3 py-2 rounded-[8px] bg-[rgba(0,0,0,0.03)] dark:bg-[rgba(255,255,255,0.04)]">
            <p className="text-[10px] font-semibold text-[#86868B]">Activos</p>
            <p className="text-[17px] font-bold text-[var(--apple-accent)] tracking-[-0.02em]">{stats.casosActivos}</p>
          </div>
          <div className="px-3 py-2 rounded-[8px] bg-[rgba(0,0,0,0.03)] dark:bg-[rgba(255,255,255,0.04)]">
            <p className="text-[10px] font-semibold text-[#86868B]">Cumpl.</p>
            <p className="text-[17px] font-bold text-[#248A3D] tracking-[-0.02em]">{stats.cumplimientoGeneral}%</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-2 py-2 rounded-[8px] hover:bg-[rgba(0,0,0,0.03)] dark:hover:bg-[rgba(255,255,255,0.05)] transition-colors group cursor-default">
          <img
            src={user?.profileImage || 'https://ik.imagekit.io/lvxdbpx6l/APP%20FORENSICS/avatar.png'}
            alt=""
            className="w-8 h-8 rounded-full object-cover bg-[rgba(0,0,0,0.03)]"
          />
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-[var(--apple-text)] truncate leading-tight">{user?.nombre || 'Perito Judicial'}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              {!isNeonConfigured ? (
                <>
                  <StatusDot status="reconectando" size={6} />
                  <p className="text-[10px] text-[#FF9500] truncate">
                    Sin configurar (local)
                  </p>
                </>
              ) : dbOnline === null ? (
                <>
                  <StatusDot status={null} size={6} />
                  <p className="text-[10px] text-[#86868B] truncate">
                    Verificando Neon DB...
                  </p>
                </>
              ) : dbOnline ? (
                <>
                  <StatusDot status="online" size={6} />
                  <p className="text-[10px] text-[#34C759] truncate">
                    Conectado
                  </p>
                </>
              ) : (
                <>
                  <StatusDot status="offline" size={6} />
                  <p className="text-[10px] text-[#FF3B30] truncate">
                    Error de conexión Neon
                  </p>
                </>
              )}
            </div>
          </div>
          <button
            onClick={logout}
            title="Cerrar sesión"
            className="p-2 rounded-[6px] hover:bg-red-500/10 text-[#86868B] hover:text-[#FF3B30] transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-[100dvh] bg-[var(--apple-bg)] font-sans text-[var(--apple-text)] overflow-hidden">

      {/* ══════════════════════════════════════════════════════════
          DESKTOP SIDEBAR — visible en sm y superior
      ══════════════════════════════════════════════════════════ */}
      <aside className="print:hidden w-[272px] apple-sidebar flex-col shrink-0 hidden sm:flex">
        <SidebarContent />
      </aside>

      {/* ══════════════════════════════════════════════════════════
          MOBILE DRAWER OVERLAY
      ══════════════════════════════════════════════════════════ */}
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]
          transition-opacity duration-300 sm:hidden
          ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        className={`
          fixed inset-y-0 left-0 z-50 w-[280px] max-w-[85vw]
          flex flex-col
          bg-[var(--apple-sidebar-bg)] backdrop-blur-[40px]
          border-r border-[var(--apple-border)]
          shadow-[4px_0_24px_rgba(0,0,0,0.12)]
          transform transition-transform duration-300 ease-out
          sm:hidden
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        aria-label="Menú de navegación"
        role="dialog"
        aria-modal="true"
      >
        {/* Botón cerrar en el drawer */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[rgba(0,0,0,0.06)] dark:bg-[rgba(255,255,255,0.08)] text-[#86868B] hover:text-[var(--apple-text)] transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
          aria-label="Cerrar menú"
        >
          <X size={16} />
        </button>

        <SidebarContent onNav={() => setMobileOpen(false)} />
      </div>

      {/* ══════════════════════════════════════════════════════════
          ÁREA PRINCIPAL
      ══════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[var(--apple-bg)] print:bg-white print:overflow-visible">

        {/* ── Top Header ────────────────────────────────────────── */}
        <header className="print:hidden shrink-0 border-b border-[var(--apple-border)] bg-[rgba(245,245,247,0.75)] dark:bg-[rgba(28,28,30,0.75)] backdrop-blur-[30px] z-10">
          <div className="flex items-center justify-between px-4 sm:px-6 h-[54px]">

            {/* Izquierda: hamburguesa (móvil) + breadcrumb */}
            <div className="flex items-center gap-2 min-w-0">
              {/* Botón hamburguesa — solo en móvil */}
              <button
                id="hamburger-btn"
                onClick={() => setMobileOpen(true)}
                aria-label="Abrir menú de navegación"
                aria-expanded={mobileOpen}
                className="sm:hidden flex items-center justify-center w-10 h-10 rounded-[8px] text-[var(--apple-text-muted)] hover:bg-[var(--apple-surface-hover)] hover:text-[var(--apple-accent)] transition-all active:scale-95"
              >
                <Menu size={22} strokeWidth={2} />
              </button>

              {/* Breadcrumb */}
              <nav className="flex items-center gap-1.5 text-[13px] font-medium min-w-0" aria-label="Ubicación actual">
                <Link to="/" className="apple-breadcrumb hidden xs:block shrink-0">SHA256.US</Link>
                {location.pathname !== '/' && (
                  <>
                    <ChevronRight size={11} className="text-[#86868B] opacity-50 shrink-0 hidden xs:block" />
                    <span className="apple-breadcrumb-active truncate text-[13px]">{getBreadcrumb()}</span>
                  </>
                )}
                {/* En móvil muy pequeño: solo el nombre de la sección */}
                <span className="apple-breadcrumb-active truncate text-[13px] xs:hidden">{getBreadcrumb()}</span>
              </nav>
            </div>

            {/* Derecha: controles */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Spotlight Trigger */}
              <button
                onClick={() => setCommandPaletteOpen(true)}
                title="Buscador Spotlight (⌘K)"
                className="flex items-center justify-center w-9 h-9 rounded-[8px] text-[var(--apple-text-muted)] hover:bg-[var(--apple-surface-hover)] hover:text-[var(--apple-accent)] transition-all active:scale-95"
              >
                <Search size={15} />
              </button>

              {/* Estado DB — ocultar texto en móvil */}
              <button
                onClick={verificarDB}
                title={!isNeonConfigured ? 'Modo local: datos no sincronizados en la nube' : dbOnline === null ? 'Verificando...' : dbOnline ? 'Conectado a Neon' : 'Error de conexión'}
                className="flex items-center gap-1.5 text-[12px] font-medium px-2 py-2 rounded-[6px] hover:bg-[var(--apple-surface-hover)] transition-all"
              >
                <div className={`w-2 h-2 rounded-full shrink-0 ${!isNeonConfigured ? 'bg-[#FF9500] animate-pulse' : dbOnline === null ? 'bg-[#86868B]' : dbOnline ? 'bg-[#34C759]' : 'bg-[#FF3B30]'}`} />
                <span className={`hidden md:inline ${!isNeonConfigured ? 'text-[#FF9500]' : dbOnline === null ? 'text-[#86868B]' : dbOnline ? 'text-[#34C759]' : 'text-[#FF3B30]'}`}>
                  {!isNeonConfigured ? 'Local (Sin Neon)' : dbOnline ? 'En línea' : dbOnline === false ? 'Desconectado' : '...'}
                </span>
              </button>

              {/* Badge Producción — ocultar en xs */}
              <div className="apple-badge-green hidden sm:inline-flex">
                <Activity size={11} />
                <span>PROD</span>
              </div>

              {/* Tema */}
              <button
                onClick={() => setIsDark(p => !p)}
                title={isDark ? 'Modo claro' : 'Modo oscuro'}
                className="flex items-center justify-center w-9 h-9 rounded-[8px] text-[var(--apple-text-muted)] hover:bg-[var(--apple-surface-hover)] hover:text-[var(--apple-accent)] transition-all active:scale-95"
              >
                {isDark ? <Sun size={15} /> : <Moon size={15} />}
              </button>

              {/* Limpiar datos */}
              <button
                onClick={limpiarDatos}
                title="Limpiar datos temporales"
                className="flex items-center justify-center w-9 h-9 rounded-[8px] text-[var(--apple-text-muted)] hover:bg-red-500/10 hover:text-[#FF3B30] transition-all active:scale-95"
              >
                <Trash2 size={15} />
              </button>

              {/* Window controls — solo desktop */}
              <div className="hidden sm:flex items-center gap-1.5 ml-1 select-none">
                <span className="apple-window-close" />
                <span className="apple-window-minimize" />
                <span className="apple-window-zoom" />
              </div>
            </div>
          </div>
        </header>

        {/* ── Contenido principal ─────────────────────────────── */}
        <main className="flex-1 overflow-y-auto print:overflow-visible print:m-0 print:p-0 -webkit-overflow-scrolling-touch">
          <div className="
            w-full max-w-6xl mx-auto
            px-4 py-5
            sm:px-6 sm:py-8
            md:px-10 md:py-12
            apple-fade-in
            print:max-w-none print:m-0 print:p-0
          ">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Spotlight command palette */}
      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
    </div>
  );
}
