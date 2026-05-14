import { Routes, Route } from 'react-router-dom';
// ── CMS Compliance (nuevo) ──────────────────────────────────────────────────
import CMSLayout from './components/CMSLayout';
import DashboardPage from './pages/DashboardPage';
import CasosPage from './pages/CasosPage';
import CompliancePage from './pages/CompliancePage';
import NormativasPage from './pages/NormativasPage';
import AuditoriaPage from './pages/AuditoriaPage';

// ── Módulos forenses existentes (mantenidos sin alterar) ────────────────────
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ConsignacionPage from './pages/ConsignacionPage';
import PrccPage from './pages/PrccPage';
import AdquisicionPage from './pages/AdquisicionPage';
import AnalisisPage from './pages/AnalisisPage';
import InformePage from './pages/InformePage';
import DisposicionJudicialPage from './pages/DisposicionJudicialPage';
import DisposicionFinalPage from './pages/DisposicionFinalPage';

function App() {
  return (
    <Routes>
      {/* ── CMS Compliance Officer (raíz principal) ── */}
      <Route path="/" element={<CMSLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="casos" element={<CasosPage />} />
        <Route path="compliance" element={<CompliancePage />} />
        <Route path="normativas" element={<NormativasPage />} />
        <Route path="auditoria" element={<AuditoriaPage />} />
        {/* Páginas simples stub para el CMS (a expandir) */}
        <Route path="tareas" element={<div className="cms-card p-8 text-cms-textMuted text-center">Módulo Tareas &amp; Fases — en construcción</div>} />
        <Route path="personal" element={<div className="cms-card p-8 text-cms-textMuted text-center">Módulo Personal — en construcción</div>} />
      </Route>

      {/* ── Módulos Forenses Originales (prefijo /forense) ── */}
      <Route path="/forense" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="consignacion" element={<ConsignacionPage />} />
        <Route path="prcc" element={<PrccPage />} />
        <Route path="adquisicion" element={<AdquisicionPage />} />
        <Route path="analisis" element={<AnalisisPage />} />
        <Route path="informe" element={<InformePage />} />
        <Route path="disposicion-judicial" element={<DisposicionJudicialPage />} />
        <Route path="disposicion-final" element={<DisposicionFinalPage />} />
      </Route>
    </Routes>
  );
}

export default App;
