import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Smartphone, 
  FileText, 
  Microscope, 
  FileCheck,
  Home,
  Shield,
  ChevronRight,
  Info,
  Menu,
  X,
  ArrowLeft,
  Lock,
  CheckCircle2,
  Activity,
  Mail
} from 'lucide-react';
import { useForenseStore } from '../store/forenseStore';

const menuItems = [
  { path: '/forense', label: 'Inicio', icon: Home },
  { path: '/forense/consignacion', label: '1. Fase Inicial', icon: FileText },
  { path: '/forense/prcc', label: '2. Cadena de Custodia', icon: Shield },
  { path: '/forense/adquisicion', label: '3. Adquisición Forense', icon: Smartphone },
  { path: '/forense/analisis', label: '4. Fase Laboratorio', icon: Microscope },
  { path: '/forense/informe', label: '5. Dictamen e Informe', icon: FileCheck },
  { path: '/forense/disposicion-judicial', label: '6. Resguardo Judicial', icon: Lock },
  { path: '/forense/disposicion-final', label: '7. Cierre de Evidencia', icon: CheckCircle2 },
];

export default function Layout() {
  const location = useLocation();
  const { casoActual, dispositivoActual, completedSteps, loadCompletedSteps } = useForenseStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadCompletedSteps();
  }, [loadCompletedSteps]);

  const isPhaseCompleted = (label: string) => {
    if (label.startsWith('1.')) {
      return !!(completedSteps['step1'] && completedSteps['step2']);
    }
    if (label.startsWith('2.')) {
      return !!completedSteps['step4'];
    }
    if (label.startsWith('3.')) {
      return !!completedSteps['step3'];
    }
    if (label.startsWith('4.')) {
      return !!(completedSteps['step5'] && completedSteps['step6']);
    }
    if (label.startsWith('5.')) {
      return !!(completedSteps['step7'] && completedSteps['step8']);
    }
    if (label.startsWith('6.')) {
      return !!completedSteps['step9'];
    }
    if (label.startsWith('7.')) {
      return ['step1', 'step2', 'step3', 'step4', 'step5', 'step6', 'step7', 'step8', 'step9'].every(
        (step) => !!completedSteps[step]
      );
    }
    return false;
  };

  const renderLabel = (label: string) => {
    const parts = label.split('. ');
    if (parts.length > 1) {
      const number = parts[0];
      const text = parts.slice(1).join('. ');
      const completed = isPhaseCompleted(label);
      return (
        <span>
          <span className={completed ? 'text-green-400 font-black' : ''}>{number}. </span>
          {text}
        </span>
      );
    }
    return <span>{label}</span>;
  };

  const getBreadcrumb = () => {
    const item = menuItems.find(m => m.path === location.pathname || location.pathname.startsWith(m.path + '/'));
    if (item) return item.label;
    if (location.pathname.includes('/planillas/acta-obtencion')) return 'Acta de Obtención';
    if (location.pathname.includes('/planillas/prcc-derivacion')) return 'Planilla PRCC';
    if (location.pathname.includes('/planillas/seguimiento')) return 'Seguimiento Forense';
    return 'Inicio';
  };

  return (
    <div className="flex h-screen bg-fluent-bg font-sans text-fluent-text overflow-hidden relative">

      {/* ── Overlay Móvil ── */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 w-72 acrylic-panel flex-col shrink-0 shadow-2xl print:hidden
          transform transition-transform duration-300 ease-in-out flex
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0
        `}
        aria-label="Navegación principal"
      >
        <div className="p-8 pb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <img src="/favicon.svg" alt="SHA256.US Logo" className="w-9 h-9 drop-shadow-lg" />
              <div>
                <h1 className="font-bold text-2xl tracking-widest text-fluent-text print:hidden uppercase">SHA256.US</h1>
              </div>
            </div>
            <button 
              className="md:hidden text-white/40 hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={24} />
            </button>
          </div>
          <p className="text-[10px] uppercase font-semibold tracking-widest text-fluent-accent-light/80 mb-10 leading-relaxed max-w-[200px]">
            Laboratorio de Informática Forense y Ciberseguridad
          </p>

          <nav className="flex flex-col gap-1.5">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2 pl-3">Menú Principal</h3>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="w-5 h-5" />
                  {renderLabel(item.label)}
                </Link>
              );
            })}
          </nav>

          <nav className="flex flex-col gap-1.5 mt-6 pt-4 border-t border-fluent-border">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2 pl-3">Plantillas en Limpio</h3>
            <Link
              to="/forense/planillas/acta-obtencion"
              onClick={() => setIsMobileMenuOpen(false)}
              className="nav-item border border-transparent hover:border-fluent-accent/30 text-fluent-textSecondary hover:text-white transition-all bg-white/[0.01]"
            >
              <FileText className="w-5 h-5 text-fluent-accent" />
              <span>1. Acta de Obtención</span>
            </Link>
            <Link
              to="/forense/planillas/prcc-derivacion"
              onClick={() => setIsMobileMenuOpen(false)}
              className="nav-item border border-transparent hover:border-fluent-accent/30 text-fluent-textSecondary hover:text-white transition-all bg-white/[0.01]"
            >
              <Shield className="w-5 h-5 text-fluent-accent" />
              <span>2. Planilla PRCC</span>
            </Link>
            <Link
              to="/forense/planillas/seguimiento"
              onClick={() => setIsMobileMenuOpen(false)}
              className="nav-item border border-transparent hover:border-fluent-accent/30 text-fluent-textSecondary hover:text-white transition-all bg-white/[0.01]"
            >
              <Smartphone className="w-5 h-5 text-fluent-accent" />
              <span>3. Seguimiento Forense</span>
            </Link>
            <Link
              to="/forense/correo-forense"
              onClick={() => setIsMobileMenuOpen(false)}
              className="nav-item border border-transparent hover:border-fluent-accent/30 text-fluent-textSecondary hover:text-white transition-all bg-white/[0.01]"
            >
              <Mail className="w-5 h-5 text-fluent-accent" />
              <span>4. Correo Electrónico</span>
            </Link>
          </nav>
          
          <div className="mt-6 pt-4 border-t border-fluent-border">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="nav-item border border-dashed border-white/10 hover:border-fluent-accent/50 text-fluent-accent-light hover:text-white transition-all bg-white/[0.02]"
            >
              <ArrowLeft className="w-5 h-5 text-fluent-accent-light" />
              <span className="font-bold">Regresar al CMS</span>
            </Link>
          </div>
        </div>

        <div className="mt-auto p-8 border-t border-fluent-border flex flex-col gap-6">
          <div className="pt-6 border-t border-fluent-border print:hidden">
            <div className="block p-3 rounded-fluent-btn border border-fluent-border bg-fluent-surface hover:bg-fluent-surfaceHover transition-all group cursor-default">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-fluent-surfaceActive rounded-md text-white/40 group-hover:text-fluent-accent-light transition-colors shadow-sm">
                  <Shield size={18} strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <h4 className="text-[11px] font-bold text-fluent-text uppercase tracking-widest mb-1">Sistema Forense v1.0</h4>
                  <p className="text-[9px] text-white/40 leading-tight">Cumplimiento MP / ISO 27037</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

        {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header / Breadcrumbs */}
        <header className="h-16 border-b border-fluent-border flex items-center justify-between px-4 md:px-8 bg-fluent-bg/50 backdrop-blur-md z-10 print:hidden shrink-0">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
            <nav className="hidden md:flex items-center gap-2 text-sm" aria-label="Breadcrumb">
              <Link to="/forense" className="breadcrumb-item">Inicio</Link>
              {location.pathname !== '/forense' && (
                <>
                  <ChevronRight size={14} className="text-white/20" />
                  <span className="breadcrumb-item-active">{getBreadcrumb()}</span>
                </>
              )}
            </nav>
          </div>

          {/* Current Context Indicator */}
          <div className="flex items-center gap-3">
            {casoActual && (
              <div className="flex items-center gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="h-8 w-px bg-fluent-border"></div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-fluent-accent-light uppercase tracking-wider">Caso Activo:</span>
                    <span className="text-xs font-mono font-bold text-white">{casoActual.numeroCaso}</span>
                  </div>
                  {dispositivoActual && (
                    <span className="text-[10px] text-white/40">{dispositivoActual.marca} {dispositivoActual.modelo}</span>
                  )}
                </div>
                <div className="p-1.5 bg-fluent-accent/10 rounded-full text-fluent-accent">
                  <Info size={14} />
                </div>
              </div>
            )}
            <div id="operation-mode-badge" className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-[4px] border ${
              (window as any).electronAPI?.operationMode === 'production'
                ? 'bg-green-500/10 text-green-400 border-green-500/30'
                : 'bg-red-500/10 text-red-400 border-red-500/30'
            }`}>
               <Activity size={12} />
               <span>{(window as any).electronAPI?.operationMode === 'production' ? 'PRODUCCIÓN' : 'SIMULACIÓN'}</span>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto relative outline-none print:overflow-visible print:p-0 print:m-0" tabIndex={-1}>
          <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-12 lg:p-16 text-fluent-text animate-fade-in print:max-w-none print:p-0 print:m-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
