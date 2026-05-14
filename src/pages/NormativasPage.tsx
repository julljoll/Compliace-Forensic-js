import { useCMSStore } from '../store/cmsStore';
import { BookOpen, Scale, Gavel, FileText, Shield } from 'lucide-react';

const TIPO_ICONS: Record<string, typeof BookOpen> = {
  ISO: Shield, NIST: Shield, LEY: Gavel, MANUAL: FileText, REGLAMENTO: Scale,
};

const TIPO_COLORS: Record<string, string> = {
  ISO:        'bg-blue-500/10 border-blue-500/20 text-blue-300',
  NIST:       'bg-purple-500/10 border-purple-500/20 text-purple-300',
  LEY:        'bg-red-500/10 border-red-500/20 text-red-300',
  MANUAL:     'bg-yellow-500/10 border-yellow-500/20 text-yellow-300',
  REGLAMENTO: 'bg-green-500/10 border-green-500/20 text-green-300',
};

export default function NormativasPage() {
  const { normativas, casos } = useCMSStore();

  const tiposUnicos = [...new Set(normativas.map(n => n.tipo))];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white mb-1 flex items-center gap-3">
          <BookOpen className="text-cms-accent" size={24} />
          Marco Normativo de Referencia
        </h1>
        <p className="text-sm text-cms-textMuted">
          Normativas cargadas desde la carpeta RAG del sistema · {normativas.length} instrumentos normativos
        </p>
      </div>

      {tiposUnicos.map(tipo => {
        const normsDelTipo = normativas.filter(n => n.tipo === tipo);
        const TipoIcon = TIPO_ICONS[tipo] || BookOpen;
        const tipoColor = TIPO_COLORS[tipo] || 'bg-gray-500/10 border-gray-500/20 text-gray-300';
        return (
          <div key={tipo}>
            <div className="flex items-center gap-2 mb-4">
              <TipoIcon size={16} className="text-cms-accent" />
              <h2 className="font-bold text-white text-base">{tipo}</h2>
              <span className="text-xs text-cms-textMuted">({normsDelTipo.length})</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {normsDelTipo.map(norm => {
                const casosUsando = casos.filter(c => c.normativasAplicadas.includes(norm.id)).length;
                return (
                  <div key={norm.id} className="cms-card p-5 group hover:border-cms-accent/30">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg border ${tipoColor} shrink-0`}>
                        <TipoIcon size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono font-black text-cms-accent text-sm">{norm.codigo}</span>
                          {norm.activa
                            ? <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-green-500/15 border border-green-500/30 text-green-300 font-bold">VIGENTE</span>
                            : <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-gray-500/15 border border-gray-500/30 text-gray-400 font-bold">INACTIVA</span>
                          }
                        </div>
                        <h3 className="text-sm font-bold text-white leading-snug mb-2">{norm.nombre}</h3>
                        <p className="text-xs text-cms-textMuted leading-relaxed mb-3">{norm.descripcion}</p>
                        <div className="flex items-center gap-4 text-[10px] text-cms-textMuted">
                          <span>Versión: <span className="text-white">{norm.version}</span></span>
                          <span>Vigencia: <span className="text-white">{new Date(norm.fechaVigencia).toLocaleDateString('es')}</span></span>
                          <span className="text-cms-accent font-bold">{casosUsando} casos</span>
                        </div>
                        {norm.articulos && norm.articulos.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {norm.articulos.map(art => (
                              <span key={art} className="text-[9px] px-2 py-0.5 rounded bg-cms-surface border border-cms-border text-cms-textMuted">{art}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Nota sobre RAG */}
      <div className="cms-card p-5 border-cms-accent/20 bg-cms-accent/5">
        <div className="flex items-start gap-3">
          <BookOpen size={18} className="text-cms-accent shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-white text-sm mb-1">Documentos en Repositorio RAG</h3>
            <p className="text-xs text-cms-textMuted leading-relaxed">
              Los documentos normativos originales (PDFs, YAMLs) se encuentran intactos en la carpeta <code className="font-mono text-cms-accent bg-cms-surface px-1 py-0.5 rounded">RAG/</code> del proyecto.
              Este panel los referencia para el proceso de compliance sin modificar su contenido.
              Los documentos incluyen: ISO/IEC 27037, ISO/IEC 27042, NIST SP 800-101, Manual Único de Cadena de Custodia,
              ACPO Guide, Ley de Delitos Informáticos, Código Orgánico Procesal Penal, Constitución Nacional y más.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
