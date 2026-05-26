import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useCMSStore } from './store/cmsStore';
import { ErrorBoundary } from './components/atoms/ErrorBoundary';

// ── Layouts ─────────────────────────────────────────────────────────────────
import CMSLayout from './components/templates/CMSLayout';
import Layout from './components/templates/Layout';

// ── Auth ─────────────────────────────────────────────────────────────────────
const LoginPage = lazy(() => import('./pages/LoginPage'));

// ── CMS Compliance ──────────────────────────────────────────────────────────
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const CasosPage = lazy(() => import('./pages/CasosPage'));
const CasoDetailPage = lazy(() => import('./pages/CasoDetailPage'));
const SeguimientoCompliancePage = lazy(() => import('./pages/Control/SeguimientoCompliancePage'));
const NormativasPage = lazy(() => import('./pages/NormativasPage'));
const AuditoriaPage = lazy(() => import('./pages/AuditoriaPage'));
const ManualAvillaPage = lazy(() => import('./pages/ManualAvillaPage'));
const PersonalPage = lazy(() => import('./pages/PersonalPage'));
const ManualServerlessPage = lazy(() => import('./pages/ManualServerlessPage'));

// ── Planillas React ────────────────────────────────────────────────────────
const ActaObtencionPage = lazy(() => import('./pages/Planillas/ActaObtencionPage'));
const PlanillaPRCCPage = lazy(() => import('./pages/Planillas/PlanillaPRCCPage'));
const ActaDictamenPage = lazy(() => import('./pages/Planillas/ActaDictamenPage'));
const ActaEntregaResultadosPage = lazy(() => import('./pages/Planillas/ActaEntregaResultadosPage'));

// ── Módulos forenses ────────────────────────────────────────────────────────
const HomePage = lazy(() => import('./pages/HomePage'));
const ConsignacionPage = lazy(() => import('./pages/ConsignacionPage'));
const PrccPage = lazy(() => import('./pages/PrccPage'));
const AdquisicionPage = lazy(() => import('./pages/AdquisicionPage'));
const AnalisisPage = lazy(() => import('./pages/AnalisisPage'));
const InformePage = lazy(() => import('./pages/InformePage'));
const DisposicionJudicialPage = lazy(() => import('./pages/DisposicionJudicialPage'));
const DisposicionFinalPage = lazy(() => import('./pages/DisposicionFinalPage'));
const CorreoForensePage = lazy(() => import('./pages/CorreoForensePage'));

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

  // Migrar datos al cargar la app (v2 → v3: completed_steps → steps)
  useEffect(() => {
    useCMSStore.getState().migrateStepsData();
  }, []);

  return (
    <Suspense fallback={<div className="h-screen w-screen bg-cms-bg flex items-center justify-center"><PageLoader /></div>}>
      <Routes>
        {/* ── Login ── */}
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
        } />

        {/* ── CMS Compliance Officer (protegido) ── */}
        <Route path="/" element={<AuthGuard><ErrorBoundary><CMSLayout /></ErrorBoundary></AuthGuard>}>
          <Route index element={<Suspense fallback={<PageLoader />}><DashboardPage /></Suspense>} />
          <Route path="casos" element={<Suspense fallback={<PageLoader />}><CasosPage /></Suspense>} />
          <Route path="casos/:id" element={<Suspense fallback={<PageLoader />}><CasoDetailPage /></Suspense>} />
          <Route path="control/seguimiento-compliance" element={<Suspense fallback={<PageLoader />}><SeguimientoCompliancePage /></Suspense>} />
          <Route path="compliance" element={<Navigate to="/control/seguimiento-compliance" replace />} />
          <Route path="normativas" element={<Suspense fallback={<PageLoader />}><NormativasPage /></Suspense>} />
          <Route path="auditoria" element={<Suspense fallback={<PageLoader />}><AuditoriaPage /></Suspense>} />
          <Route path="manual-avilla" element={<Suspense fallback={<PageLoader />}><ManualAvillaPage /></Suspense>} />
          <Route path="tareas" element={<Navigate to="/control/seguimiento-compliance?tab=tareas" replace />} />
          <Route path="personal" element={<Suspense fallback={<PageLoader />}><PersonalPage /></Suspense>} />
          <Route path="manual-serverless" element={<Suspense fallback={<PageLoader />}><ManualServerlessPage /></Suspense>} />
          <Route path="planillas/acta-obtencion" element={<Suspense fallback={<PageLoader />}><ActaObtencionPage /></Suspense>} />
          <Route path="planillas/prcc-derivacion" element={<Suspense fallback={<PageLoader />}><PlanillaPRCCPage /></Suspense>} />
          <Route path="planillas/dictamen" element={<Suspense fallback={<PageLoader />}><ActaDictamenPage /></Suspense>} />
          <Route path="planillas/entrega-resultados" element={<Suspense fallback={<PageLoader />}><ActaEntregaResultadosPage /></Suspense>} />
          <Route path="planillas/seguimiento" element={<Navigate to="/control/seguimiento-compliance" replace />} />
          <Route path="correo-forense" element={<Suspense fallback={<PageLoader />}><CorreoForensePage /></Suspense>} />
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
          <Route path="correo-forense" element={<Suspense fallback={<PageLoader />}><CorreoForensePage /></Suspense>} />
          <Route path="planillas/acta-obtencion" element={<Suspense fallback={<PageLoader />}><ActaObtencionPage /></Suspense>} />
          <Route path="planillas/prcc-derivacion" element={<Suspense fallback={<PageLoader />}><PlanillaPRCCPage /></Suspense>} />
          <Route path="planillas/dictamen" element={<Suspense fallback={<PageLoader />}><ActaDictamenPage /></Suspense>} />
          <Route path="planillas/entrega-resultados" element={<Suspense fallback={<PageLoader />}><ActaEntregaResultadosPage /></Suspense>} />
          <Route path="planillas/seguimiento" element={<Navigate to="/control/seguimiento-compliance" replace />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
