import { useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FolderOpen, ShieldCheck, ClipboardList,
  BookOpen, Users, Activity, ChevronRight, Smartphone, LogOut, Mail, Database
} from 'lucide-react';
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

  const getBreadcrumb = () => {
    // Intenta encontrar el elemento activo exacto (que coincida con los parámetros de búsqueda si existen)
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

    // Búsqueda de respaldo por ruta base
    const fallbackItem = menuItems.find(m => {
      const [mPath] = m.path.split('?');
      return mPath === location.pathname || (mPath !== '/' && location.pathname.startsWith(mPath + '/'));
    });
    return fallbackItem ? fallbackItem.label : 'Panel Principal';
  };

  return (
    <div className="flex h-screen bg-fluent-bg font-sans text-fluent-text overflow-hidden selection:bg-fluent-accent/30 selection:text-white">

      {/* ── Sidebar ────────────────────────────────────────────────────── */}
      <aside className="print:hidden w-[260px] fluent-mica border-r border-white/5 shadow-2xl flex flex-col shrink-0">

        {/* macOS Window Controls */}
        <div className="px-5 pt-4 pb-1.5 flex items-center gap-1.5 print:hidden select-none">
          <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] block" />
          <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] block" />
          <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] block" />
        </div>

        {/* Branding */}
        <div className="p-5 pt-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="https://ik.imagekit.io/lvxdbpx6l/APP%20FORENSICS/favicon.svg" alt="SHA256 Logo" className="w-8 h-8 drop-shadow-lg" />
            <div>
              <h1 className="font-black text-sm tracking-tight text-white leading-none">SHA256.US</h1>
              <p className="text-[9px] text-fluent-text-muted uppercase tracking-[0.2em] mt-1">CMS Forense</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-6 custom-scrollbar">
          {groups.map(group => {
            const items = menuItems.filter(m => m.group === group);
            return (
              <div key={group} className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-fluent-text-muted/50 px-3 py-2">{group}</p>
                <div className="space-y-0.5">
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
                        className={`fluent-sidebar-item ${isActive ? 'fluent-sidebar-item-active' : ''}`}
                      >
                        <Icon size={16} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-fluent-accent' : 'text-fluent-text-muted'} />
                        <span className="text-sm">{item.label}</span>
                        {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-fluent-accent" />}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Stats and User */}
        <div className="p-4 border-t border-white/5 bg-white/[0.02] space-y-4">
           <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-md bg-white/[0.03] border border-white/5">
                 <p className="text-[9px] font-bold text-fluent-text-muted/50 uppercase">Activos</p>
                 <p className="text-sm font-black text-fluent-accent">{stats.casosActivos}</p>
              </div>
              <div className="p-2 rounded-md bg-white/[0.03] border border-white/5">
                 <p className="text-[9px] font-bold text-fluent-text-muted/50 uppercase">Cumpl.</p>
                 <p className="text-sm font-black text-green-400">{stats.cumplimientoGeneral}%</p>
              </div>
           </div>

          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group">
            <img 
              src={user?.profileImage || "https://ik.imagekit.io/lvxdbpx6l/APP%20FORENSICS/avatar.png"} 
              alt="Profile" 
              className="w-8 h-8 rounded-full object-cover border border-fluent-accent/20 bg-white/[0.03]"
            />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-white truncate">{user?.nombre || 'Perito Judicial'}</p>
              <p className="text-[9px] text-fluent-text-muted">ID: PER-{user?.id?.toString().slice(0, 4) || '2025'}</p>
            </div>
            <button onClick={logout} title="Cerrar sesión"
              className="p-1.5 rounded-md hover:bg-red-500/10 text-fluent-text-muted hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main ───────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-fluent-bg print:bg-white print:overflow-visible">

        {/* Header */}
        <header className="print:hidden h-[48px] border-b border-white/5 flex items-center justify-between px-6 bg-fluent-bg/60 backdrop-blur-xl z-10 shrink-0">
          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-2 text-[11px] text-fluent-text-muted font-medium">
              <Link to="/" className="hover:text-fluent-text transition-colors">SHA256.US</Link>
              {location.pathname !== '/' && (
                <>
                  <ChevronRight size={10} className="opacity-40" />
                  <span className="text-fluent-text font-semibold">{getBreadcrumb()}</span>
                </>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-fluent-text-muted">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.4)]" />
              <span>Sincronizado</span>
            </div>
            <div id="operation-mode-badge" className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-[4px] border bg-green-500/10 text-green-400 border-green-500/30">
               <Activity size={12} />
               <span>PRODUCCIÓN</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar print:overflow-visible print:m-0 print:p-0">
          <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-10 animate-fade-in print:max-w-none print:m-0 print:p-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
