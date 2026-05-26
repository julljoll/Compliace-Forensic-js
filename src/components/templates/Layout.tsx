import { useEffect } from 'react';
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
  ArrowLeft,
  Lock,
  CheckCircle2,
  Activity,
  Mail
} from 'lucide-react';
import { useForenseStore } from '../../store/forenseStore';

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
          <span className={completed ? 'text-[#248A3D] font-bold' : ''}>{number}. </span>
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
    <div className="flex h-screen bg-[#F5F5F7] font-sans text-[#1D1D1F] overflow-hidden">

      {/* macOS Sidebar */}
      <aside className="w-[272px] apple-sidebar flex-col shrink-0 print:hidden flex" aria-label="Navegación principal">

        {/* macOS Window Controls */}
        <div className="apple-window-controls print:hidden">
          <span className="apple-window-close" />
          <span className="apple-window-minimize" />
          <span className="apple-window-zoom" />
        </div>

        {/* Branding */}
        <div className="px-5 pt-1 pb-4">
          <div className="flex items-center gap-3 mb-1">
            <img src="/favicon.svg" alt="" className="w-8 h-8" />
            <div>
              <h1 className="text-[16px] font-bold tracking-[-0.02em] text-[#1D1D1F] leading-tight">SHA256.US</h1>
            </div>
          </div>
          <p className="text-[10px] font-medium text-[#86868B] leading-snug">
            Laboratorio de Informática Forense y Ciberseguridad
          </p>
        </div>

        <div className="apple-separator mx-4" />

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
          <p className="apple-section-header">Menú Principal</p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const completed = isPhaseCompleted(item.label);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`apple-sidebar-item ${isActive ? 'apple-sidebar-item-active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={16} strokeWidth={isActive ? 2.5 : 1.5} className={isActive ? 'text-[#0071E3]' : 'text-[#86868B]'} />
                {renderLabel(item.label)}
                {completed && !isActive && (
                  <CheckCircle2 size={12} className="ml-auto text-[#34C759]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Templates Section */}
        <div className="px-3 py-3 space-y-1 border-t border-[rgba(0,0,0,0.06)]">
          <p className="apple-section-header">Plantillas</p>
          <Link to="/forense/planillas/acta-obtencion" className="apple-sidebar-item">
            <FileText size={16} className="text-[#86868B]" />
            <span>Acta de Obtención</span>
          </Link>
          <Link to="/forense/planillas/prcc-derivacion" className="apple-sidebar-item">
            <Shield size={16} className="text-[#86868B]" />
            <span>Planilla PRCC</span>
          </Link>
          <Link to="/forense/planillas/seguimiento" className="apple-sidebar-item">
            <Smartphone size={16} className="text-[#86868B]" />
            <span>Seguimiento</span>
          </Link>
          <Link to="/forense/correo-forense" className="apple-sidebar-item">
            <Mail size={16} className="text-[#86868B]" />
            <span>Correo Electrónico</span>
          </Link>
        </div>

        {/* Back to CMS */}
        <div className="px-3 pb-3">
          <div className="apple-separator mb-3" />
          <Link to="/" className="apple-sidebar-item text-[#0071E3]">
            <ArrowLeft size={16} />
            <span className="font-semibold">Regresar al CMS</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* macOS Unified Toolbar */}
        <header className="h-[50px] border-b border-[rgba(0,0,0,0.06)] flex items-center justify-between px-6 bg-[rgba(245,245,247,0.7)] backdrop-blur-[30px] z-10 print:hidden shrink-0">
          <div className="flex items-center gap-3">
            <nav className="flex items-center gap-2 text-[13px]" aria-label="Breadcrumb">
              <Link to="/forense" className="apple-breadcrumb">Inicio</Link>
              {location.pathname !== '/forense' && (
                <>
                  <ChevronRight size={11} className="text-[#86868B] opacity-50" />
                  <span className="apple-breadcrumb-active">{getBreadcrumb()}</span>
                </>
              )}
            </nav>
          </div>

          {/* Context & Status */}
          <div className="flex items-center gap-3">
            {casoActual && (
              <div className="flex items-center gap-3">
                <div className="h-6 w-px bg-[rgba(0,0,0,0.06)]" />
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold text-[#86868B]">Caso:</span>
                    <span className="text-[12px] font-semibold text-[#1D1D1F]">{casoActual.numeroCaso}</span>
                  </div>
                  {dispositivoActual && (
                    <span className="text-[10px] text-[#86868B]">{dispositivoActual.marca} {dispositivoActual.modelo}</span>
                  )}
                </div>
                <div className="p-1 rounded-[6px] bg-[rgba(0,113,227,0.08)] text-[#0071E3]">
                  <Info size={13} />
                </div>
              </div>
            )}
            <div className="apple-badge-green">
              <Activity size={11} />
              <span>PRODUCCIÓN</span>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto print:overflow-visible print:p-0 print:m-0">
          <div className="max-w-6xl mx-auto p-5 sm:p-8 md:p-12 apple-fade-in print:max-w-none print:p-0 print:m-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
