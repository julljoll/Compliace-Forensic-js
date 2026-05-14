import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FolderOpen, ShieldCheck, ClipboardList,
  BookOpen, Users, Activity, ChevronRight, Scale
} from 'lucide-react';
import { useCMSStore } from '../store/cmsStore';

const menuItems = [
  { path: '/',                 label: 'Dashboard',       icon: LayoutDashboard,  group: 'Principal' },
  { path: '/casos',            label: 'Gestión de Casos', icon: FolderOpen,      group: 'Principal' },
  { path: '/compliance',       label: 'Compliance',       icon: ShieldCheck,     group: 'Control' },
  { path: '/tareas',           label: 'Tareas & Fases',   icon: ClipboardList,   group: 'Control' },
  { path: '/normativas',       label: 'Normativas',       icon: BookOpen,        group: 'Referencia' },
  { path: '/personal',         label: 'Personal',         icon: Users,           group: 'Referencia' },
  { path: '/auditoria',        label: 'Auditoría',        icon: Activity,        group: 'Sistema' },
];

const groups = ['Principal', 'Control', 'Referencia', 'Sistema'];

export default function CMSLayout() {
  const location = useLocation();
  const { casos, getEstadisticas } = useCMSStore();
  const stats = getEstadisticas();

  const getBreadcrumb = () => {
    const item = menuItems.find(m => m.path === location.pathname || location.pathname.startsWith(m.path + '/'));
    return item ? item.label : 'Dashboard';
  };

  return (
    <div className="flex h-screen bg-cms-bg font-sans text-cms-text overflow-hidden">

      {/* ── Sidebar ────────────────────────────────────────────────────── */}
      <aside className="hidden md:flex w-64 flex-col shrink-0 bg-cms-sidebar border-r border-cms-border z-20 shadow-xl">

        {/* Logo */}
        <div className="p-6 pb-4 border-b border-cms-border">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 bg-gradient-to-br from-cms-accent to-cms-accent2 rounded-lg flex items-center justify-center shadow-lg">
              <Scale size={16} className="text-white" />
            </div>
            <div>
              <h1 className="font-black text-sm tracking-widest text-white uppercase">SHA256.US</h1>
              <p className="text-[9px] text-cms-textMuted uppercase tracking-widest">Compliance CMS</p>
            </div>
          </div>
        </div>

        {/* Stats rápidas */}
        <div className="px-4 py-3 border-b border-cms-border">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-cms-surface rounded-lg p-2 text-center">
              <div className="text-lg font-black text-cms-accent">{stats.casosActivos}</div>
              <div className="text-[9px] text-cms-textMuted uppercase">Activos</div>
            </div>
            <div className="bg-cms-surface rounded-lg p-2 text-center">
              <div className={`text-lg font-black ${stats.cumplimientoGeneral >= 80 ? 'text-green-400' : stats.cumplimientoGeneral >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                {stats.cumplimientoGeneral}%
              </div>
              <div className="text-[9px] text-cms-textMuted uppercase">Cumpl.</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
          {groups.map(group => {
            const items = menuItems.filter(m => m.group === group);
            return (
              <div key={group}>
                <p className="text-[9px] font-bold uppercase tracking-widest text-cms-textMuted px-3 mb-1.5">{group}</p>
                <div className="space-y-0.5">
                  {items.map(item => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                          isActive
                            ? 'bg-cms-accent/15 text-cms-accent font-semibold border-l-2 border-cms-accent'
                            : 'text-cms-textMuted hover:text-white hover:bg-cms-surface'
                        }`}
                      >
                        <Icon size={15} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-cms-border">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-cms-surface">
            <ShieldCheck size={14} className="text-cms-accent shrink-0" />
            <div>
              <p className="text-[10px] font-bold text-white">Compliance Officer</p>
              <p className="text-[9px] text-cms-textMuted">ISO 27037 · MUCC-2017</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ───────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Header */}
        <header className="h-14 border-b border-cms-border flex items-center justify-between px-6 bg-cms-bg/80 backdrop-blur-md z-10 shrink-0">
          <nav className="flex items-center gap-2 text-xs text-cms-textMuted">
            <Link to="/" className="hover:text-white transition-colors">Inicio</Link>
            {location.pathname !== '/' && (
              <>
                <ChevronRight size={12} />
                <span className="text-white font-semibold">{getBreadcrumb()}</span>
              </>
            )}
          </nav>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-cms-textMuted">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span>{stats.tareasPendientes} tareas pendientes</span>
            </div>
            <div className="h-5 w-px bg-cms-border" />
            <span className="text-xs font-mono text-cms-accent font-bold">{casos.length} casos</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-cms-bg">
          <div className="max-w-7xl mx-auto p-6 animate-fadeUp">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
