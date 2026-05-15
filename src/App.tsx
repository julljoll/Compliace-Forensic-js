import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// ── Layouts ─────────────────────────────────────────────────────────────────
import CMSLayout from './components/CMSLayout';
import Layout from './components/Layout';

// ── Auth ─────────────────────────────────────────────────────────────────────
const LoginPage = lazy(() => import('./pages/LoginPage'));

// ── CMS Compliance ──────────────────────────────────────────────────────────
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const CasosPage = lazy(() => import('./pages/CasosPage'));
const CompliancePage = lazy(() => import('./pages/CompliancePage'));
const NormativasPage = lazy(() => import('./pages/NormativasPage'));
const AuditoriaPage = lazy(() => import('./pages/AuditoriaPage'));
const ManualAvillaPage = lazy(() => import('./pages/ManualAvillaPage'));

// ── Módulos forenses ────────────────────────────────────────────────────────
const HomePage = lazy(() => import('./pages/HomePage'));
const ConsignacionPage = lazy(() => import('./pages/ConsignacionPage'));
const PrccPage = lazy(() => import('./pages/PrccPage'));
const AdquisicionPage = lazy(() => import('./pages/AdquisicionPage'));
const AnalisisPage = lazy(() => import('./pages/AnalisisPage'));
const InformePage = lazy(() => import('./pages/InformePage'));
const DisposicionJudicialPage = lazy(() => import('./pages/DisposicionJudicialPage'));
const DisposicionFinalPage = lazy(() => import('./pages/DisposicionFinalPage'));

// ── Fallback Loader ─────────────────────────────────────────────────────────
const PageLoader = () => (
  <div className="flex-1 flex items-center justify-center min-h-[50vh]">
    <div className="w-8 h-8 border-4 border-cms-accent/30 border-t-cms-accent rounded-full animate-spin"></div>
  </div>
);

/** Guard: redirige a /login si no autenticado */
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Suspense fallback={<div className="h-screen w-screen bg-cms-bg flex items-center justify-center"><PageLoader /></div>}>
      <Routes>
        {/* ── Login ── */}
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
        } />

        {/* ── CMS Compliance Officer (protegido) ── */}
        <Route path="/" element={<AuthGuard><CMSLayout /></AuthGuard>}>
          <Route index element={<Suspense fallback={<PageLoader />}><DashboardPage /></Suspense>} />
          <Route path="casos" element={<Suspense fallback={<PageLoader />}><CasosPage /></Suspense>} />
          <Route path="compliance" element={<Suspense fallback={<PageLoader />}><CompliancePage /></Suspense>} />
          <Route path="normativas" element={<Suspense fallback={<PageLoader />}><NormativasPage /></Suspense>} />
          <Route path="auditoria" element={<Suspense fallback={<PageLoader />}><AuditoriaPage /></Suspense>} />
          <Route path="manual-avilla" element={<Suspense fallback={<PageLoader />}><ManualAvillaPage /></Suspense>} />
          <Route path="tareas" element={<div className="cms-card p-8 text-cms-textMuted text-center">Módulo Tareas &amp; Fases — en construcción</div>} />
          <Route path="personal" element={<div className="cms-card p-8 text-cms-textMuted text-center">Módulo Personal — en construcción</div>} />
        </Route>

        {/* ── Módulos Forenses (protegido, prefijo /forense) ── */}
        <Route path="/forense" element={<AuthGuard><Layout /></AuthGuard>}>
          <Route index element={<Suspense fallback={<PageLoader />}><HomePage /></Suspense>} />
          <Route path="consignacion" element={<Suspense fallback={<PageLoader />}><ConsignacionPage /></Suspense>} />
          <Route path="prcc" element={<Suspense fallback={<PageLoader />}><PrccPage /></Suspense>} />
          <Route path="adquisicion" element={<Suspense fallback={<PageLoader />}><AdquisicionPage /></Suspense>} />
          <Route path="analisis" element={<Suspense fallback={<PageLoader />}><AnalisisPage /></Suspense>} />
          <Route path="informe" element={<Suspense fallback={<PageLoader />}><InformePage /></Suspense>} />
          <Route path="disposicion-judicial" element={<Suspense fallback={<PageLoader />}><DisposicionJudicialPage /></Suspense>} />
          <Route path="disposicion-final" element={<Suspense fallback={<PageLoader />}><DisposicionFinalPage /></Suspense>} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
