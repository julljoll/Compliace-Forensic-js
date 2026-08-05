import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, FolderOpen, BookOpen, Activity, ChevronRight } from '../atoms/AppleIcon';
import { useCMSStore } from '../../store/cmsStore';

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  category: 'Navegación' | 'Casos Forenses' | 'Normativas';
  title: string;
  subtitle?: string;
  action: () => void;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const casos = useCMSStore(state => state.casos);
  const normativas = useCMSStore(state => state.normativas) || [];

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const items = useMemo<CommandItem[]>(() => {
    const list: CommandItem[] = [];

    const navItems = [
      { path: '/', label: 'Panel Principal', icon: Activity },
      { path: '/casos', label: 'Gestión de Casos', icon: FolderOpen },
      { path: '/control/seguimiento-compliance', label: 'Etapas de los casos', icon: FolderOpen },
      { path: '/normativas', label: 'Normativas', icon: BookOpen },
      { path: '/auditoria', label: 'Auditoría Forense', icon: Activity },
      { path: '/personal', label: 'Personal / Peritos', icon: Activity }
    ];

    navItems.forEach(nav => {
      list.push({
        id: `nav-${nav.path}`,
        category: 'Navegación',
        title: nav.label,
        subtitle: `Ir a ${nav.label}`,
        icon: nav.icon,
        action: () => {
          router.push(nav.path);
          onClose();
        }
      });
    });

    casos.forEach(caso => {
      list.push({
        id: `caso-${caso.id}`,
        category: 'Casos Forenses',
        title: caso.titulo,
        subtitle: `Caso #${caso.numeroCaso} | Perito: ${caso.peritoLider}`,
        icon: FolderOpen,
        action: () => {
          router.push(`/control/seguimiento-compliance?casoId=${caso.id}`);
          onClose();
        }
      });
    });

    normativas.forEach(norm => {
      list.push({
        id: `norm-${norm.id}`,
        category: 'Normativas',
        title: `${norm.codigo} - ${norm.nombre}`,
        subtitle: norm.descripcion,
        icon: BookOpen,
        action: () => {
          router.push('/normativas');
          onClose();
        }
      });
    });

    return list;
  }, [casos, normativas, router, onClose]);

  const filteredItems = useMemo(() => {
    if (!query.trim()) return items.slice(0, 10);
    const cleanQuery = query.toLowerCase().trim();
    return items.filter(item =>
      item.title.toLowerCase().includes(cleanQuery) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(cleanQuery)) ||
      item.category.toLowerCase().includes(cleanQuery)
    );
  }, [items, query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    }
  };

  useEffect(() => {
    const container = listRef.current;
    if (!container) return;
    const selectedElement = container.querySelector(`[data-index="${selectedIndex}"]`) as HTMLElement;
    if (!selectedElement) return;
    const containerTop = container.scrollTop;
    const containerBottom = containerTop + container.clientHeight;
    const elemTop = selectedElement.offsetTop;
    const elemBottom = elemTop + selectedElement.clientHeight;
    if (elemTop < containerTop) {
      container.scrollTop = elemTop;
    } else if (elemBottom > containerBottom) {
      container.scrollTop = elemBottom - container.clientHeight;
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  const grouped = filteredItems.reduce((acc, item, index) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push({ item, originalIndex: index });
    return acc;
  }, {} as Record<string, { item: CommandItem; originalIndex: number }[]>);

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-start justify-content-center pt-5 px-3"
      style={{ zIndex: 2000 }}
    >
      {/* Backdrop */}
      <div
        className="position-fixed top-0 start-0 w-100 h-100"
        style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', zIndex: 2000 }}
        onClick={onClose}
      />

      {/* Palette box */}
      <div
        className="card shadow-lg border rounded-3 d-flex flex-column overflow-hidden bg-white"
        style={{ width: '100%', maxWidth: '640px', zIndex: 2010 }}
        onKeyDown={handleKeyDown}
      >
        {/* Search header */}
        <div className="d-flex align-items-center gap-2 px-3 py-2 border-bottom">
          <Search size={18} className="text-muted flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Buscar casos por ID, perito o ir a secciones..."
            className="form-control border-0 shadow-none fw-normal"
            style={{ fontSize: '15px' }}
          />
        </div>

        {/* Results list */}
        <div
          ref={listRef}
          className="overflow-y-auto p-2"
          style={{ maxHeight: '360px' }}
        >
          {filteredItems.length === 0 ? (
            <div className="py-5 text-center text-muted small">
              No se encontraron resultados para &ldquo;{query}&rdquo;
            </div>
          ) : (
            Object.entries(grouped).map(([category, groupItems]) => (
              <div key={category} className="mb-2">
                <div className="px-2 py-1 text-muted fw-bold text-uppercase" style={{ fontSize: '10px', letterSpacing: '0.08em' }}>
                  {category}
                </div>
                <div className="d-flex flex-column gap-1">
                  {groupItems.map(({ item, originalIndex }) => {
                    const Icon = item.icon;
                    const isActive = originalIndex === selectedIndex;
                    return (
                      <button
                        key={item.id}
                        data-index={originalIndex}
                        type="button"
                        onClick={item.action}
                        onMouseEnter={() => setSelectedIndex(originalIndex)}
                        className={`btn text-start w-100 d-flex align-items-center justify-content-between px-3 py-2 rounded-3 border-0 ${
                          isActive ? 'btn-primary' : 'btn-light'
                        }`}
                      >
                        <div className="d-flex align-items-center gap-2 min-w-0">
                          <div className={`p-1 rounded-2 flex-shrink-0 ${isActive ? 'bg-white bg-opacity-25' : 'bg-light'}`}>
                            <Icon size={16} />
                          </div>
                          <div className="min-w-0">
                            <div className={`fw-semibold text-truncate ${isActive ? 'text-white' : 'text-navy'}`} style={{ fontSize: '13.5px' }}>
                              {item.title}
                            </div>
                            {item.subtitle && (
                              <div className={`text-truncate ${isActive ? 'text-white-50' : 'text-muted'}`} style={{ fontSize: '11px' }}>
                                {item.subtitle}
                              </div>
                            )}
                          </div>
                        </div>
                        <ChevronRight size={14} className={isActive ? 'text-white' : 'text-muted'} />
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer help */}
        <div className="px-3 py-2 bg-light border-top d-flex align-items-center gap-3 text-muted select-none" style={{ fontSize: '10px' }}>
          <div className="d-flex align-items-center gap-1">
            <kbd className="bg-white border rounded px-1 fw-bold">↑↓</kbd>
            <span>Navegar</span>
          </div>
          <div className="d-flex align-items-center gap-1">
            <kbd className="bg-white border rounded px-1 fw-bold">↵</kbd>
            <span>Seleccionar</span>
          </div>
          <div className="d-flex align-items-center gap-1">
            <kbd className="bg-white border rounded px-1 fw-bold">Esc</kbd>
            <span>Cerrar</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
