import { useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FolderOpen, ShieldCheck, ClipboardList,
  BookOpen, Users, Activity, ChevronRight, Smartphone, LogOut, Mail, Database, Trash2
} from '../atoms/AppleIcon';
import { useCMSStore } from '../../store/cmsStore';
import { useAuthStore } from '../../store/authStore';

const menuItems = [
  { path: '/',                 label: 'Panel Principal',       icon: LayoutDashboard,  group: 'Principal' },
  { path: '/casos',            label: 'Gestión de Casos',      icon: FolderOpen,       group: 'Principal' },
  { path: '/control/seguimiento-compliance', label: 'Fases, Tareas & Compliance', icon: ShieldCheck, group: 'Control' },
  { path: '/control/seguimiento-compliance?tab=tareas', label: 'Tablero de Tareas', icon: ClipboardList, group: 'Control' },
  { path: '/normativas',       label: 'Normativas',            icon: BookOpen,         group: 'Referencia' },
  { path: '/manual-avilla',    label: 'Manual Avilla',         icon: Smartphone,       group: 'Referencia' },
  { path: '/auditoria',        label: 'Auditoría',             icon: Activity,         group: 'Sistema' },
  { path: '/personal',         label: 'Personal',              icon: Users,            group: 'Sistema' },
  { path: '/manual-serverless', label: 'Manual Serverless',    icon: Database,         group: 'Sistema' },
  { path: '/planillas/acta-obtencion', label: 'Acta de Obtención', icon: ClipboardList, group: 'Plantillas Oficiales' },
  { path: '/planillas/prcc-derivacion', label: 'Planilla PRCC', icon: ClipboardList, group: 'Plantillas Oficiales' },
  { path: '/correo-forense', label: 'Correo Corporativo', icon: Mail, group: 'Control' },
];

const groups = ['Principal', 'Control', 'Referencia', 'Sistema', 'Plantillas Oficiales'];

export default function CMSLayout() {
  const location = useLocation();
  const getEstadisticas = useCMSStore(state => state.getEstadisticas);
  const fetchCasos = useCMSStore(state => state.fetchCasos);
  const { user, logout } = useAuthStore();
  const stats = getEstadisticas();

  useEffect(() => {
    fetchCasos();
  }, [fetchCasos]);

  const limpiarDatos = () => {
    if (!window.confirm('¿Limpiar datos temporales (cookies, localStorage, sesión)? Se cerrará su sesión.')) return;
    localStorage.clear();
    document.cookie.split(';').forEach(c => {
      document.cookie = c.replace(/^ +/, '').replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
    });
    window.location.reload();
  };

  const getBreadcrumb = () => {
    const activeItem = menuItems.find(item => {
      const [itemPathname, itemSearch] = item.path.split('?');
      if (itemSearch) {
        return location.pathname === itemPathname && location.search.includes(itemSearch);
      } else {
        if (location.pathname === itemPathname) {
          const hasSpecificMatch = menuItems.some(m => {
            const [mPath, mSearch] = m.path.split('?');
            return m.path !== item.path && mPath === itemPathname && mSearch && location.search.includes(mSearch);
          });
          return !hasSpecificMatch;
        }
        return false;
      }
    });
    if (activeItem) return activeItem.label;

    const fallbackItem = menuItems.find(m => {
      const [mPath] = m.path.split('?');
      return mPath === location.pathname || (mPath !== '/' && location.pathname.startsWith(mPath + '/'));
    });
    return fallbackItem ? fallbackItem.label : 'Panel Principal';
  };

  return (
    <div className="flex h-screen bg-[#F5F5F7] font-sans text-[#1D1D1F] overflow-hidden selection:bg-[#0071E3]/20">

      {/* ── macOS Sidebar ─────────────────────────────────────────────── */}
      <aside className="print:hidden w-[272px] apple-sidebar flex flex-col shrink-0">

        {/* macOS Window Controls */}
        <div className="apple-window-controls print:hidden">
          <span className="apple-window-close" />
          <span className="apple-window-minimize" />
          <span className="apple-window-zoom" />
        </div>

        {/* Branding */}
        <div className="px-5 pt-1 pb-3">
          <div className="flex items-center gap-3">
            <img src="https://ik.imagekit.io/lvxdbpx6l/APP%20FORENSICS/favicon.svg" alt="" className="w-8 h-8" />
            <div>
              <h1 className="text-[14px] font-bold tracking-[-0.01em] text-[#1D1D1F] leading-tight">SHA256.US</h1>
              <p className="text-[10px] font-medium text-[#86868B] tracking-[0.02em]">CMS Forense</p>
            </div>
          </div>
        </div>

        <div className="apple-separator mx-4" />

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-5">
          {groups.map(group => {
            const items = menuItems.filter(m => m.group === group);
            if (items.length === 0) return null;
            return (
              <div key={group}>
                <p className="apple-section-header">{group}</p>
                <div className="space-y-0.5 mt-1">
                  {items.map(item => {
                    const Icon = item.icon;
                    const isActive = (() => {
                      const [itemPathname, itemSearch] = item.path.split('?');
                      if (itemSearch) {
                        return location.pathname === itemPathname && location.search.includes(itemSearch);
                      } else {
                        if (location.pathname === itemPathname) {
                          const hasSpecificMatch = menuItems.some(m => {
                            const [mPath, mSearch] = m.path.split('?');
                            return m.path !== item.path && mPath === itemPathname && mSearch && location.search.includes(mSearch);
                          });
                          return !hasSpecificMatch;
                        }
                        return itemPathname !== '/' && location.pathname.startsWith(itemPathname);
                      }
                    })();
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`apple-sidebar-item ${isActive ? 'apple-sidebar-item-active' : ''}`}
                      >
                        <Icon size={16} strokeWidth={isActive ? 2.5 : 1.5} className={isActive ? 'text-[#0071E3]' : 'text-[#86868B]'} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Stats & User Footer */}
        <div className="px-4 py-3 border-t border-[rgba(0,0,0,0.06)] space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="px-3 py-2 rounded-[8px] bg-[rgba(0,0,0,0.03)]">
              <p className="text-[10px] font-semibold text-[#86868B]">Activos</p>
              <p className="text-[17px] font-bold text-[#0071E3] tracking-[-0.02em]">{stats.casosActivos}</p>
            </div>
            <div className="px-3 py-2 rounded-[8px] bg-[rgba(0,0,0,0.03)]">
              <p className="text-[10px] font-semibold text-[#86868B]">Cumpl.</p>
              <p className="text-[17px] font-bold text-[#248A3D] tracking-[-0.02em]">{stats.cumplimientoGeneral}%</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-[8px] hover:bg-[rgba(0,0,0,0.03)] transition-colors group cursor-default">
            <img 
              src={user?.profileImage || "https://ik.imagekit.io/lvxdbpx6l/APP%20FORENSICS/avatar.png"} 
              alt="" 
              className="w-7 h-7 rounded-full object-cover bg-[rgba(0,0,0,0.03)]"
            />
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold text-[#1D1D1F] truncate leading-tight">{user?.nombre || 'Perito Judicial'}</p>
              <p className="text-[10px] text-[#86868B]">ID: PER-{user?.id?.toString().slice(0, 4) || '2025'}</p>
            </div>
            <button onClick={logout} title="Cerrar sesión"
              className="p-1 rounded-[6px] hover:bg-red-500/10 text-[#86868B] hover:text-[#FF3B30] transition-colors opacity-0 group-hover:opacity-100">
              <LogOut size={13} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Content ──────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F5F5F7] print:bg-white print:overflow-visible">

        {/* macOS Unified Toolbar */}
        <header className="print:hidden h-[50px] border-b border-[rgba(0,0,0,0.06)] flex items-center justify-between px-6 bg-[rgba(245,245,247,0.7)] backdrop-blur-[30px] z-10 shrink-0">
          <div className="flex items-center gap-3">
            <nav className="flex items-center gap-2 text-[13px] text-[#86868B] font-medium">
              <Link to="/" className="apple-breadcrumb">SHA256.US</Link>
              {location.pathname !== '/' && (
                <>
                  <ChevronRight size={11} className="text-[#86868B] opacity-50" />
                  <span className="apple-breadcrumb-active">{getBreadcrumb()}</span>
                </>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={limpiarDatos}
              title="Limpiar datos temporales y cookies"
              className="p-1.5 rounded-[6px] hover:bg-[rgba(0,0,0,0.04)] text-[#86868B] hover:text-[#FF3B30] transition-all"
            >
              <Trash2 size={13} />
            </button>
            <div className="flex items-center gap-2 text-[12px] font-medium text-[#86868B]">
              <div className="w-2 h-2 rounded-full bg-[#34C759]" />
              <span>Sincronizado</span>
            </div>
            <div className="apple-badge-green">
              <Activity size={11} />
              <span>PRODUCCIÓN</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto print:overflow-visible print:m-0 print:p-0">
          <div className="max-w-6xl mx-auto p-5 sm:p-8 md:p-12 apple-fade-in print:max-w-none print:m-0 print:p-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
