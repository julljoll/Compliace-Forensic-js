import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useCMSStore } from './store/cmsStore';
import { ErrorBoundary } from './components/atoms/ErrorBoundary';

// ── Layouts ─────────────────────────────────────────────────────────────────
import CMSLayout from './components/templates/CMSLayout';

// ── Auth ─────────────────────────────────────────────────────────────────────
const LoginPage = lazy(() => import('./pages/LoginPage'));
const VercelCallback = lazy(() => import('./pages/Auth/VercelCallback'));

// ── CMS Compliance ──────────────────────────────────────────────────────────
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const CasosPage = lazy(() => import('./pages/CasosPage'));
const CasoDetailPage = lazy(() => import('./pages/CasoDetailPage'));
const SeguimientoCompliancePage = lazy(() => import('./pages/Control/SeguimientoCompliancePage'));
const NormativasPage = lazy(() => import('./pages/NormativasPage'));
const AuditoriaPage = lazy(() => import('./pages/AuditoriaPage'));
const PersonalPage = lazy(() => import('./pages/PersonalPage'));
const ManualServerlessPage = lazy(() => import('./pages/ManualServerlessPage'));

// ── Módulos Forenses ──
const AdbBackupPage = lazy(() => import('./pages/Forense/AdbBackupPage'));
const ApkDowngradePage = lazy(() => import('./pages/Forense/ApkDowngradePage'));
const WhatsAppParserPage = lazy(() => import('./pages/Forense/WhatsAppParserPage'));
const IntegrityPage = lazy(() => import('./pages/Forense/IntegrityPage'));

// ── Planillas React ────────────────────────────────────────────────────────
const ActaObtencionPage = lazy(() => import('./pages/Planillas/ActaObtencionPage'));
const PlanillaPRCCPage = lazy(() => import('./pages/Planillas/PlanillaPRCCPage'));
const ActaDictamenPage = lazy(() => import('./pages/Planillas/ActaDictamenPage'));
const ActaEntregaResultadosPage = lazy(() => import('./pages/Planillas/ActaEntregaResultadosPage'));

// ── Sistemas ────────────────────────────────────────────────────────────────
const CorreoCorporativoManual = lazy(() => import('./pages/CorreoCorporativoManual'));
const CorreoForensePage = lazy(() => import('./pages/CorreoForensePage'));
const ManualAvillaPage = lazy(() => import('./pages/ManualAvillaPage'));

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
        <Route path="/auth/vercel-callback" element={
          <Suspense fallback={
            <div className="h-screen bg-[#F5F5F7] flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[#0071E3]/30 border-t-[#0071E3] rounded-full animate-spin" />
            </div>
          }>
            <VercelCallback />
          </Suspense>
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
          <Route path="sistemas/manual-avilla" element={<Navigate to="/manual-avilla" replace />} />
          <Route path="tareas" element={<Suspense fallback={<PageLoader />}><DashboardPage /></Suspense>} />
          <Route path="personal" element={<Suspense fallback={<PageLoader />}><PersonalPage /></Suspense>} />

          {/* ── Módulos Forenses ── */}
          <Route path="forense/adb-backup" element={<Suspense fallback={<PageLoader />}><AdbBackupPage /></Suspense>} />
          <Route path="forense/apk-downgrade" element={<Suspense fallback={<PageLoader />}><ApkDowngradePage /></Suspense>} />
          <Route path="forense/whatsapp-parser" element={<Suspense fallback={<PageLoader />}><WhatsAppParserPage /></Suspense>} />
          <Route path="forense/integridad" element={<Suspense fallback={<PageLoader />}><IntegrityPage /></Suspense>} />
          <Route path="manual-serverless" element={<Suspense fallback={<PageLoader />}><ManualServerlessPage /></Suspense>} />
          <Route path="planillas/acta-obtencion" element={<Suspense fallback={<PageLoader />}><ActaObtencionPage /></Suspense>} />
          <Route path="planillas/prcc-derivacion" element={<Suspense fallback={<PageLoader />}><PlanillaPRCCPage /></Suspense>} />
          <Route path="planillas/dictamen" element={<Suspense fallback={<PageLoader />}><ActaDictamenPage /></Suspense>} />
          <Route path="planillas/entrega-resultados" element={<Suspense fallback={<PageLoader />}><ActaEntregaResultadosPage /></Suspense>} />
          <Route path="planillas/seguimiento" element={<Navigate to="/control/seguimiento-compliance" replace />} />
          <Route path="correo-forense" element={<Suspense fallback={<PageLoader />}><CorreoForensePage /></Suspense>} />
          <Route path="sistemas/correo-electronico" element={<Navigate to="/correo-forense" replace />} />
          <Route path="sistemas/correo-corporativo" element={<Suspense fallback={<PageLoader />}><CorreoCorporativoManual /></Suspense>} />
        </Route>



        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
