import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// ── Auth ─────────────────────────────────────────────────────────────────────
import LoginPage from './pages/LoginPage';

// ── CMS Compliance ──────────────────────────────────────────────────────────
import CMSLayout from './components/CMSLayout';
import DashboardPage from './pages/DashboardPage';
import CasosPage from './pages/CasosPage';
import CompliancePage from './pages/CompliancePage';
import NormativasPage from './pages/NormativasPage';
import AuditoriaPage from './pages/AuditoriaPage';
import ManualAvillaPage from './pages/ManualAvillaPage';

// ── Módulos forenses ────────────────────────────────────────────────────────
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ConsignacionPage from './pages/ConsignacionPage';
import PrccPage from './pages/PrccPage';
import AdquisicionPage from './pages/AdquisicionPage';
import AnalisisPage from './pages/AnalisisPage';
import InformePage from './pages/InformePage';
import DisposicionJudicialPage from './pages/DisposicionJudicialPage';
import DisposicionFinalPage from './pages/DisposicionFinalPage';

/** Guard: redirige a /login si no autenticado */
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Routes>
      {/* ── Login ── */}
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
      } />

      {/* ── CMS Compliance Officer (protegido) ── */}
      <Route path="/" element={<AuthGuard><CMSLayout /></AuthGuard>}>
        <Route index element={<DashboardPage />} />
        <Route path="casos" element={<CasosPage />} />
        <Route path="compliance" element={<CompliancePage />} />
        <Route path="normativas" element={<NormativasPage />} />
        <Route path="auditoria" element={<AuditoriaPage />} />
        <Route path="manual-avilla" element={<ManualAvillaPage />} />
        <Route path="tareas" element={<div className="cms-card p-8 text-cms-textMuted text-center">Módulo Tareas &amp; Fases — en construcción</div>} />
        <Route path="personal" element={<div className="cms-card p-8 text-cms-textMuted text-center">Módulo Personal — en construcción</div>} />
      </Route>

      {/* ── Módulos Forenses (protegido, prefijo /forense) ── */}
      <Route path="/forense" element={<AuthGuard><Layout /></AuthGuard>}>
        <Route index element={<HomePage />} />
        <Route path="consignacion" element={<ConsignacionPage />} />
        <Route path="prcc" element={<PrccPage />} />
        <Route path="adquisicion" element={<AdquisicionPage />} />
        <Route path="analisis" element={<AnalisisPage />} />
        <Route path="informe" element={<InformePage />} />
        <Route path="disposicion-judicial" element={<DisposicionJudicialPage />} />
        <Route path="disposicion-final" element={<DisposicionFinalPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
