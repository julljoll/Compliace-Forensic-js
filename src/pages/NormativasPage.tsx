import { useCMSStore } from '../store/cmsStore';
import { BookOpen, Scale, Gavel, FileText, Shield } from '../components/atoms/AppleIcon';

const TIPO_ICONS: Record<string, typeof BookOpen> = {
  ISO: Shield, NIST: Shield, LEY: Gavel, MANUAL: FileText, REGLAMENTO: Scale,
};

const TIPO_STYLES: Record<string, { badge: string; iconBg: string; iconColor: string }> = {
  ISO: {
    badge: 'bg-[rgba(0,122,255,0.08)] text-[#007AFF] border-[rgba(0,122,255,0.2)]',
    iconBg: 'bg-[rgba(0,122,255,0.1)]',
    iconColor: 'text-[#007AFF]',
  },
  NIST: {
    badge: 'bg-[rgba(88,86,214,0.08)] text-[#5856D6] border-[rgba(88,86,214,0.2)]',
    iconBg: 'bg-[rgba(88,86,214,0.1)]',
    iconColor: 'text-[#5856D6]',
  },
  LEY: {
    badge: 'bg-[rgba(255,59,48,0.08)] text-[#FF3B30] border-[rgba(255,59,48,0.2)]',
    iconBg: 'bg-[rgba(255,59,48,0.1)]',
    iconColor: 'text-[#FF3B30]',
  },
  MANUAL: {
    badge: 'bg-[rgba(255,149,0,0.08)] text-[#FF9500] border-[rgba(255,149,0,0.2)]',
    iconBg: 'bg-[rgba(255,149,0,0.1)]',
    iconColor: 'text-[#FF9500]',
  },
  REGLAMENTO: {
    badge: 'bg-[rgba(52,199,89,0.08)] text-[#34C759] border-[rgba(52,199,89,0.2)]',
    iconBg: 'bg-[rgba(52,199,89,0.1)]',
    iconColor: 'text-[#34C759]',
  },
};

export default function NormativasPage() {
  const { normativas, casos } = useCMSStore();

  const tiposUnicos = [...new Set(normativas.map(n => n.tipo))];

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="animate-slide-up">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-[10px] bg-[rgba(0,113,227,0.1)]">
            <BookOpen size={20} className="text-[#0071E3]" />
          </div>
          <div>
            <h1 className="text-apple-title font-black text-[#1D1D1F]">Marco Normativo de Referencia</h1>
            <p className="text-apple-body text-[#86868B] mt-0.5">
              {normativas.length} instrumentos normativos · Repositorio RAG
            </p>
          </div>
        </div>
      </div>

      {tiposUnicos.map((tipo, tipoIdx) => {
        const normsDelTipo = normativas.filter(n => n.tipo === tipo);
        const TipoIcon = TIPO_ICONS[tipo] || BookOpen;
        const style = TIPO_STYLES[tipo] || TIPO_STYLES.ISO;
        return (
          <div key={tipo} className="animate-slide-up" style={{ animationDelay: `${tipoIdx * 0.1}s` }}>
            <div className="flex items-center gap-2.5 mb-5">
              <div className={`p-1.5 rounded-lg ${style.iconBg}`}>
                <TipoIcon size={14} className={style.iconColor} />
              </div>
              <h2 className="text-apple-headline font-bold text-[#1D1D1F]">{tipo}</h2>
              <span className="text-apple-footnote text-[#86868B] font-medium">({normsDelTipo.length})</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {normsDelTipo.map((norm, normIdx) => {
                const casosUsando = casos.filter(c => c.normativasAplicadas.includes(norm.id)).length;
                return (
                  <div
                    key={norm.id}
                    className="apple-card p-5 transition-all duration-300"
                    style={{ animationDelay: `${(tipoIdx * 0.1) + (normIdx * 0.05)}s` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-2.5 rounded-xl ${style.iconBg} shrink-0`}>
                        <TipoIcon size={18} className={style.iconColor} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="font-mono font-black text-[#0071E3] text-apple-subhead tracking-tight">{norm.codigo}</span>
                          {norm.activa ? (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${style.badge}`}>VIGENTE</span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold border bg-[rgba(142,142,147,0.08)] text-[#8E8E93] border-[rgba(142,142,147,0.2)]">INACTIVA</span>
                          )}
                        </div>
                        <h3 className="text-apple-headline font-semibold text-[#1D1D1F] leading-snug mb-2">{norm.nombre}</h3>
                        <p className="text-apple-callout text-[#86868B] leading-relaxed mb-3.5">{norm.descripcion}</p>
                        <div className="flex items-center gap-4 text-apple-footnote text-[#86868B]">
                          <span>Versión <span className="text-[#1D1D1F] font-medium">{norm.version}</span></span>
                          <span className="w-px h-3 bg-[rgba(0,0,0,0.08)]" />
                          <span>Vigencia <span className="text-[#1D1D1F] font-medium">{new Date(norm.fechaVigencia).toLocaleDateString('es')}</span></span>
                          <span className="w-px h-3 bg-[rgba(0,0,0,0.08)]" />
                          <span className="text-[#0071E3] font-semibold">{casosUsando} casos</span>
                        </div>
                        {norm.articulos && norm.articulos.length > 0 && (
                          <div className="mt-3.5 pt-3.5 border-t border-[rgba(0,0,0,0.06)] flex flex-wrap gap-1.5">
                            {norm.articulos.map(art => (
                              <span key={art} className="text-[10px] px-2.5 py-1 rounded-full bg-[rgba(0,0,0,0.04)] text-[#6E6E73] font-medium border border-[rgba(0,0,0,0.06)]">
                                {art}
                              </span>
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

      <div className="apple-card p-6 border border-[rgba(0,113,227,0.15)] bg-[rgba(0,113,227,0.04)] animate-fade-in">
        <div className="flex items-start gap-3.5">
          <div className="p-2 rounded-xl bg-[rgba(0,113,227,0.1)] shrink-0">
            <BookOpen size={18} className="text-[#0071E3]" />
          </div>
          <div>
            <h3 className="text-apple-headline font-semibold text-[#1D1D1F] mb-1">Repositorio RAG</h3>
            <p className="text-apple-callout text-[#86868B] leading-relaxed">
              Los documentos normativos originales (PDFs, YAMLs) se encuentran intactos en la carpeta <code className="font-mono text-[#0071E3] bg-[rgba(0,113,227,0.08)] px-1.5 py-0.5 rounded-md text-apple-footnote">RAG/</code> del proyecto.
              Este panel los referencia para el proceso de compliance sin modificar su contenido.
              Incluye: ISO/IEC 27037, ISO/IEC 27042, NIST SP 800-101, MUCC-2017,
              ACPO Guide, LEDI, COPP, Constitución Nacional y más.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
