import { useCMSStore, NivelCumplimiento, TipoNormativa } from '../store/cmsStore';
import { ShieldCheck, AlertTriangle, CheckCircle2, Clock, BookOpen, Filter } from 'lucide-react';
import { useState } from 'react';

const CUMPL_CONFIG: Record<NivelCumplimiento, { label: string; color: string; bg: string; icon: typeof CheckCircle2 }> = {
  conforme:    { label: 'Conforme',     color: 'text-green-300',  bg: 'bg-green-500/15 border-green-500/30',  icon: CheckCircle2 },
  parcial:     { label: 'Parcial',      color: 'text-yellow-300', bg: 'bg-yellow-500/15 border-yellow-500/30', icon: AlertTriangle },
  no_conforme: { label: 'No Conforme',  color: 'text-red-300',    bg: 'bg-red-500/15 border-red-500/30',      icon: AlertTriangle },
  no_aplica:   { label: 'No Aplica',    color: 'text-gray-400',   bg: 'bg-gray-500/15 border-gray-500/30',    icon: Clock },
};

const TIPOS: (TipoNormativa | 'todos')[] = ['todos', 'ISO', 'NIST', 'LEY', 'MANUAL', 'REGLAMENTO'];

export default function CompliancePage() {
  const { casos, normativas } = useCMSStore();
  const [tipoFiltro, setTipoFiltro] = useState<TipoNormativa | 'todos'>('todos');

  const normativasFiltradas = normativas.filter(n => n.activa && (tipoFiltro === 'todos' || n.tipo === tipoFiltro));

  // Calcular estadísticas de cumplimiento por normativa
  const statsNormativa = normativas.map(norm => {
    const casosConNorm = casos.filter(c => c.normativasAplicadas.includes(norm.id));
    const conformes = casosConNorm.filter(c => c.nivelCumplimientoGeneral === 'conforme').length;
    const parciales = casosConNorm.filter(c => c.nivelCumplimientoGeneral === 'parcial').length;
    const noConformes = casosConNorm.filter(c => c.nivelCumplimientoGeneral === 'no_conforme').length;
    const total = casosConNorm.length;
    return { normId: norm.id, total, conformes, parciales, noConformes, pct: total > 0 ? Math.round((conformes / total) * 100) : 0 };
  });

  // KPIs globales
  const totalCasos = casos.length;
  const conformes = casos.filter(c => c.nivelCumplimientoGeneral === 'conforme').length;
  const parciales = casos.filter(c => c.nivelCumplimientoGeneral === 'parcial').length;
  const noConformes = casos.filter(c => c.nivelCumplimientoGeneral === 'no_conforme').length;
  const pctGeneral = totalCasos > 0 ? Math.round((conformes / totalCasos) * 100) : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white mb-1 flex items-center gap-3">
          <ShieldCheck className="text-cms-accent" size={24} />
          Panel de Compliance
        </h1>
        <p className="text-sm text-cms-textMuted">Control de cumplimiento normativo por caso · ISO 27037 · MUCC-2017 · NIST 800-101</p>
      </div>

      {/* ── KPIs Globales ──────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Cumplimiento Global', value: `${pctGeneral}%`, color: pctGeneral >= 80 ? 'text-green-400' : pctGeneral >= 50 ? 'text-yellow-400' : 'text-red-400', icon: ShieldCheck },
          { label: 'Conformes', value: conformes, color: 'text-green-400', icon: CheckCircle2 },
          { label: 'Parciales', value: parciales, color: 'text-yellow-400', icon: AlertTriangle },
          { label: 'No Conformes', value: noConformes, color: 'text-red-400', icon: AlertTriangle },
        ].map(kpi => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="cms-card p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-cms-textMuted">{kpi.label}</p>
                <Icon size={16} className={kpi.color} />
              </div>
              <div className={`text-3xl font-black ${kpi.color}`}>{kpi.value}</div>
            </div>
          );
        })}
      </div>

      {/* ── Barra de cumplimiento visual ───────────────── */}
      {totalCasos > 0 && (
        <div className="cms-card p-6">
          <h3 className="font-bold text-white mb-4 text-sm">Distribución de Cumplimiento — {totalCasos} casos</h3>
          <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
            {conformes > 0 && <div className="bg-green-500 transition-all" style={{ width: `${(conformes / totalCasos) * 100}%` }} title={`Conformes: ${conformes}`} />}
            {parciales > 0 && <div className="bg-yellow-500 transition-all" style={{ width: `${(parciales / totalCasos) * 100}%` }} title={`Parciales: ${parciales}`} />}
            {noConformes > 0 && <div className="bg-red-500 transition-all" style={{ width: `${(noConformes / totalCasos) * 100}%` }} title={`No Conformes: ${noConformes}`} />}
            {(totalCasos - conformes - parciales - noConformes) > 0 && <div className="bg-gray-700 flex-1" />}
          </div>
          <div className="flex gap-6 mt-3 text-xs text-cms-textMuted">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" />Conforme ({conformes})</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-500 inline-block" />Parcial ({parciales})</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" />No Conforme ({noConformes})</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-gray-600 inline-block" />Sin evaluar ({totalCasos - conformes - parciales - noConformes})</span>
          </div>
        </div>
      )}

      {/* ── Tabla de Casos por Cumplimiento ───────────── */}
      <div className="cms-card overflow-hidden">
        <div className="p-5 border-b border-cms-border">
          <h2 className="font-bold text-white flex items-center gap-2">
            <BookOpen size={16} className="text-cms-accent" />
            Estado de Cumplimiento por Caso
          </h2>
        </div>
        {casos.length === 0 ? (
          <div className="p-8 text-center text-cms-textMuted text-sm">No hay casos registrados.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider text-cms-textMuted border-b border-cms-border">
                  <th className="text-left p-4">Caso</th>
                  <th className="text-left p-4">Título</th>
                  <th className="text-left p-4">Normativas</th>
                  <th className="text-left p-4">Progreso</th>
                  <th className="text-left p-4">Cumplimiento</th>
                  <th className="text-left p-4">Actualizado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cms-border">
                {casos.map(caso => {
                  const cumpl = CUMPL_CONFIG[caso.nivelCumplimientoGeneral];
                  const CIcon = cumpl.icon;
                  return (
                    <tr key={caso.id} className="hover:bg-cms-surface/50 transition-colors">
                      <td className="p-4 font-mono font-bold text-cms-accent text-xs">{caso.numeroCaso}</td>
                      <td className="p-4 text-white max-w-xs truncate">{caso.titulo}</td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {caso.normativasAplicadas.slice(0, 3).map(nId => {
                            const n = normativas.find(x => x.id === nId);
                            return n ? <span key={nId} className="text-[9px] px-1.5 py-0.5 rounded bg-cms-surface border border-cms-border text-cms-textMuted">{n.codigo}</span> : null;
                          })}
                          {caso.normativasAplicadas.length > 3 && <span className="text-[9px] text-cms-textMuted">+{caso.normativasAplicadas.length - 3}</span>}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-cms-surface rounded-full">
                            <div className="h-full bg-cms-accent rounded-full" style={{ width: `${caso.porcentajeCompletado}%` }} />
                          </div>
                          <span className="text-xs text-cms-textMuted">{caso.porcentajeCompletado}%</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-full border font-bold ${cumpl.bg} ${cumpl.color}`}>
                          <CIcon size={10} />
                          {cumpl.label}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-cms-textMuted">{new Date(caso.fechaUltimaActualizacion).toLocaleDateString('es')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Normativas con cobertura ───────────────────── */}
      <div className="cms-card overflow-hidden">
        <div className="p-5 border-b border-cms-border flex items-center justify-between">
          <h2 className="font-bold text-white flex items-center gap-2">
            <Filter size={16} className="text-cms-accent" />
            Cobertura por Normativa
          </h2>
          <div className="flex gap-1">
            {TIPOS.map(t => (
              <button key={t} onClick={() => setTipoFiltro(t)}
                className={`text-[10px] px-2 py-1 rounded font-bold uppercase transition-colors ${tipoFiltro === t ? 'bg-cms-accent text-white' : 'bg-cms-surface text-cms-textMuted hover:text-white'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {normativasFiltradas.map(norm => {
            const stat = statsNormativa.find(s => s.normId === norm.id);
            return (
              <div key={norm.id} className="p-4 rounded-xl bg-cms-surface border border-cms-border">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="font-mono font-black text-cms-accent text-xs">{norm.codigo}</span>
                    <p className="text-[10px] text-cms-textMuted mt-0.5 leading-tight max-w-xs">{norm.nombre}</p>
                  </div>
                  <span className="text-[9px] px-2 py-1 rounded bg-cms-bg border border-cms-border text-cms-textMuted shrink-0">{norm.tipo}</span>
                </div>
                {stat && stat.total > 0 ? (
                  <div>
                    <div className="flex h-2 rounded-full overflow-hidden gap-0.5 mb-2">
                      {stat.conformes > 0 && <div className="bg-green-500" style={{ width: `${(stat.conformes / stat.total) * 100}%` }} />}
                      {stat.parciales > 0 && <div className="bg-yellow-500" style={{ width: `${(stat.parciales / stat.total) * 100}%` }} />}
                      {stat.noConformes > 0 && <div className="bg-red-500" style={{ width: `${(stat.noConformes / stat.total) * 100}%` }} />}
                    </div>
                    <p className="text-[10px] text-cms-textMuted">{stat.total} casos · {stat.pct}% conforme</p>
                  </div>
                ) : (
                  <p className="text-[10px] text-cms-textMuted italic">Sin casos asignados</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
