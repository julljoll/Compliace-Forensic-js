import { useState, useMemo } from 'react';
import { useCMSStore } from '../store/cmsStore';
import { 
  BookOpen, Scale, Gavel, FileText, Shield, Search, 
  Calendar, Info, FolderOpen 
} from '../components/atoms/AppleIcon';
import Card from '../components/atoms/Card';
import Badge from '../components/atoms/Badge';
import Link from 'next/link';

const TIPO_ICONS: Record<string, typeof BookOpen> = {
  ISO: Shield, NIST: Shield, LEY: Gavel, MANUAL: FileText, REGLAMENTO: Scale,
};

const TIPO_STYLES: Record<string, { badge: string; iconBg: string; iconColor: string }> = {
  ISO: {
    badge: 'bg-[#00FF41]/10 text-[#00FF41] border-[#00FF41]/20',
    iconBg: 'bg-[#00FF41]/10',
    iconColor: 'text-[#00FF41]',
  },
  NIST: {
    badge: 'bg-[#9DFF00]/10 text-[#9DFF00] border-[#9DFF00]/20',
    iconBg: 'bg-[#9DFF00]/10',
    iconColor: 'text-[#9DFF00]',
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
  const [selectedNormativaId, setSelectedNormativaId] = useState<string | null>(normativas[0]?.id || null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNormativas = useMemo(() => {
    if (!searchTerm) return normativas;
    const term = searchTerm.toLowerCase();
    return normativas.filter(n => 
      n.codigo.toLowerCase().includes(term) ||
      n.nombre.toLowerCase().includes(term) ||
      n.descripcion.toLowerCase().includes(term) ||
      n.tipo.toLowerCase().includes(term)
    );
  }, [normativas, searchTerm]);

  const selectedNormativa = useMemo(() => {
    return normativas.find(n => n.id === selectedNormativaId) || null;
  }, [normativas, selectedNormativaId]);

  const casosUsandoSelected = useMemo(() => {
    if (!selectedNormativaId) return [];
    return casos.filter(c => c.normativasAplicadas.includes(selectedNormativaId));
  }, [casos, selectedNormativaId]);

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6 apple-fade-in overflow-hidden">
      {/* Sidebar - Master List */}
      <div className="w-full md:w-80 flex flex-col bg-black/30 border border-[var(--co-separator)] rounded-md overflow-hidden shrink-0">
        <div className="p-4 border-b border-[var(--co-separator)] space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-[var(--apple-accent)]/10 text-[var(--apple-accent)]">
              <BookOpen size={16} />
            </div>
            <div>
              <h2 className="font-bold text-white text-[15px] tracking-tight">Normativas</h2>
              <p className="text-[10px] text-[#86868B] font-semibold uppercase tracking-wider">{normativas.length} Referencias normativas_rag</p>
            </div>
          </div>
          
          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-[#86868B]" />
            <input
              type="text"
              placeholder="Buscar normativa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-black/20 border border-[var(--co-separator)] rounded-md focus:border-[var(--apple-accent)] focus:bg-black/30 text-white outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredNormativas.length === 0 ? (
            <div className="text-center py-8 text-[#86868B] text-xs">
              No se encontraron normativas
            </div>
          ) : (
            filteredNormativas.map(norm => {
              const Icon = TIPO_ICONS[norm.tipo] || BookOpen;
              const style = TIPO_STYLES[norm.tipo] || TIPO_STYLES.ISO;
              const isSelected = norm.id === selectedNormativaId;

              return (
                <button
                  key={norm.id}
                  onClick={() => setSelectedNormativaId(norm.id)}
                  className={`w-full text-left p-3 rounded-md flex gap-3 transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-[var(--apple-accent)] text-black' 
                      : 'hover:bg-white/5 text-white'
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 flex items-center justify-center ${
                    isSelected ? 'bg-white/10 text-white' : style.iconBg
                  }`}>
                    <Icon size={16} className={isSelected ? 'text-white' : style.iconColor} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center justify-between mb-0.5 gap-2">
                      <span className={`font-mono text-[10px] font-bold truncate ${isSelected ? 'text-black font-extrabold' : 'text-[var(--apple-accent)]'}`}>
                        {norm.codigo}
                      </span>
                      <span className={`text-[8px] font-bold px-1 py-0.2 rounded border ${
                        isSelected 
                          ? 'border-white/30 text-white/90 bg-white/10' 
                          : 'border-black/[0.08] text-[#86868B] bg-black/[0.02]'
                      }`}>
                        {norm.tipo}
                      </span>
                    </div>
                    <p className={`text-xs font-semibold truncate ${isSelected ? 'text-black' : 'text-white'}`}>
                      {norm.nombre}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Detail View */}
      <div className="flex-1 bg-black/30 border border-[var(--co-separator)] rounded-md overflow-y-auto p-6 md:p-8 flex flex-col justify-between">
        {selectedNormativa ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[var(--co-separator)] pb-5 flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className={`p-3.5 rounded-md shrink-0 ${TIPO_STYLES[selectedNormativa.tipo]?.iconBg || 'bg-black/20'}`}>
                  {(() => {
                    const Icon = TIPO_ICONS[selectedNormativa.tipo] || BookOpen;
                    return <Icon size={28} className={TIPO_STYLES[selectedNormativa.tipo]?.iconColor || 'text-white'} />;
                  })()}
                </div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono text-xs font-black text-[var(--apple-accent)] tracking-tight">{selectedNormativa.codigo}</span>
                    <Badge variant={selectedNormativa.activa ? 'conforme' : 'neutro'}>
                      {selectedNormativa.activa ? 'VIGENTE' : 'INACTIVA'}
                    </Badge>
                  </div>
                  <h1 className="text-xl font-bold text-white mt-1 tracking-tight">{selectedNormativa.nombre}</h1>
                </div>
              </div>
            </div>

            {/* Content Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-[#86868B] uppercase tracking-wider mb-2">Descripción General</h3>
                  <p className="text-sm text-white/95 leading-relaxed bg-black/20 border border-[var(--co-separator)] p-4 rounded-md">
                    {selectedNormativa.descripcion}
                  </p>
                </div>

                {selectedNormativa.articulos && selectedNormativa.articulos.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-[#86868B] uppercase tracking-wider mb-2">Artículos Relacionados</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedNormativa.articulos.map(art => (
                        <span key={art} className="text-xs px-3.5 py-1.5 rounded-md bg-black/20 text-[#86868B] font-medium border border-[var(--co-separator)]">
                          {art}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar Metadata */}
              <div className="space-y-4">
                <Card className="p-4 border border-[var(--co-separator)] bg-black/20" hoverable={false}>
                  <h4 className="text-xs font-bold text-[#86868B] uppercase tracking-wider mb-3">Detalles de Versión</h4>
                  <div className="space-y-2.5 text-xs text-white">
                    <div className="flex justify-between">
                      <span className="text-[#86868B]">Versión actual:</span>
                      <span className="font-bold">{selectedNormativa.version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#86868B]">Fecha Vigencia:</span>
                      <span className="font-bold flex items-center gap-1">
                        <Calendar size={12} className="text-[#86868B]" />
                        {new Date(selectedNormativa.fechaVigencia).toLocaleDateString('es')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#86868B]">Clase:</span>
                      <span className="font-semibold">{selectedNormativa.tipo}</span>
                    </div>
                  </div>
                </Card>

                {/* Casos utilizando */}
                <Card className="p-4 border border-[var(--co-separator)] bg-black/20" hoverable={false}>
                  <h4 className="text-xs font-bold text-[#86868B] uppercase tracking-wider mb-3 flex items-center justify-between">
                    <span>Casos Vinculados</span>
                    <Badge variant="neutro">{casosUsandoSelected.length}</Badge>
                  </h4>
                  {casosUsandoSelected.length === 0 ? (
                    <p className="text-xs text-[#86868B] italic">No hay casos vinculados actualmente.</p>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {casosUsandoSelected.map(c => (
                        <Link
                          key={c.id}
                          href={`/casos/${c.id}`}
                          className="flex items-center gap-2 p-2 rounded-md hover:bg-white/5 text-xs text-white transition-all"
                        >
                          <FolderOpen size={12} className="text-[var(--apple-accent)]" />
                          <div className="min-w-0 flex-1">
                            <p className="font-bold truncate">{c.numeroCaso}</p>
                            <p className="text-[10px] text-[#86868B] truncate">{c.titulo}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-[#86868B]">
            <Info size={40} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm font-medium">Seleccione una normativa para ver los detalles.</p>
          </div>
        )}

        {/* Footer info banner */}
        <div className="mt-8 pt-5 border-t border-[var(--apple-separator)] flex gap-3 text-xs text-[#86868B] leading-relaxed">
          <Info size={16} className="text-[var(--apple-accent)] shrink-0 mt-0.5" />
          <p>
            Los documentos normativos originales se encuentran intactos en el repositorio <code className="font-mono text-[var(--apple-accent)] bg-[var(--apple-accent)]/10 px-1.5 py-0.5 rounded-md">normativas_rag/</code>.
            Este panel los referencia para mantener la inalterabilidad y validar el compliance de auditoría en los flujos forenses.
          </p>
        </div>
      </div>
    </div>
  );
}
