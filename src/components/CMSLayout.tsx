import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FolderOpen, ShieldCheck, ClipboardList,
  BookOpen, Users, Activity, ChevronRight, Smartphone, LogOut, Menu, X
} from 'lucide-react';
import { useCMSStore } from '../store/cmsStore';
import { useAuthStore } from '../store/authStore';

const menuItems = [
  { path: '/',                 label: 'Panel Principal',       icon: LayoutDashboard,  group: 'Principal' },
  { path: '/casos',            label: 'Gestión de Casos', icon: FolderOpen,      group: 'Principal' },
  { path: '/compliance',       label: 'Compliance',       icon: ShieldCheck,     group: 'Control' },
  { path: '/tareas',           label: 'Tareas & Fases',   icon: ClipboardList,   group: 'Control' },
  { path: '/normativas',       label: 'Normativas',       icon: BookOpen,        group: 'Referencia' },
  { path: '/manual-avilla',    label: 'Manual Avilla',    icon: Smartphone,      group: 'Referencia' },
  { path: '/personal',         label: 'Personal',         icon: Users,           group: 'Referencia' },
  { path: '/auditoria',        label: 'Auditoría',        icon: Activity,        group: 'Sistema' },
  { path: '/planillas/acta-obtencion', label: 'Acta de Obtención', icon: ClipboardList, group: 'Plantillas Oficiales' },
  { path: '/planillas/prcc-derivacion', label: 'Planilla PRCC', icon: ClipboardList, group: 'Plantillas Oficiales' },
  { path: '/planillas/seguimiento', label: 'Seguimiento Forense', icon: ClipboardList, group: 'Plantillas Oficiales' },
];

const groups = ['Principal', 'Control', 'Referencia', 'Sistema', 'Plantillas Oficiales'];

export default function CMSLayout() {
  const location = useLocation();
  const getEstadisticas = useCMSStore(state => state.getEstadisticas);
  const fetchCasos = useCMSStore(state => state.fetchCasos);
  const { user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const stats = getEstadisticas();

  useEffect(() => {
    fetchCasos();
  }, [fetchCasos]);

  const getBreadcrumb = () => {
    const item = menuItems.find(m => m.path === location.pathname || location.pathname.startsWith(m.path + '/'));
    return item ? item.label : 'Panel Principal';
  };

  return (
    <div className="flex h-screen bg-fluent-bg font-sans text-fluent-text overflow-hidden selection:bg-fluent-accent/30 selection:text-white">

      {/* ── Overlay Móvil ── */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ── Sidebar ────────────────────────────────────────────────────── */}
      <aside className={`
        print:hidden fixed inset-y-0 left-0 z-50 w-[260px] fluent-mica border-r border-white/5 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col shrink-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}>

        {/* Branding */}
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="https://ik.imagekit.io/lvxdbpx6l/APP%20FORENSICS/favicon.svg" alt="SHA256 Logo" className="w-8 h-8 drop-shadow-lg" />
            <div>
              <h1 className="font-black text-sm tracking-tight text-white leading-none">SHA256.US</h1>
              <p className="text-[9px] text-fluent-text-muted uppercase tracking-[0.2em] mt-1">Forensics CMS</p>
            </div>
          </div>
          <button 
            className="md:hidden text-fluent-text-muted hover:text-white p-1 rounded-md hover:bg-white/5"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={18} />
          </button>
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
                    const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
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
            <button 
              className="md:hidden p-1.5 text-fluent-text-muted hover:text-white hover:bg-white/5 rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={18} />
            </button>
            <nav className="hidden md:flex items-center gap-2 text-[11px] text-fluent-text-muted font-medium">
              <Link to="/" className="hover:text-fluent-text transition-colors">SHA256.US</Link>
              {location.pathname !== '/' && (
                <>
                  <ChevronRight size={10} className="opacity-40" />
                  <span className="text-fluent-text font-semibold">{getBreadcrumb()}</span>
                </>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-fluent-text-muted">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.4)]" />
              <span>Sincronizado</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold bg-fluent-accent/10 text-fluent-accent px-2 py-0.5 rounded-[4px] border border-fluent-accent/20">
               <Activity size={12} />
               <span>LIVE</span>
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
