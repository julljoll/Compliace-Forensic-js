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

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Close on Escape or click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // All searchable items
  const items = useMemo<CommandItem[]>(() => {
    const list: CommandItem[] = [];

    // 1. Navigation items
    const navItems = [
      { path: '/', label: 'Panel Principal', icon: Activity },
      { path: '/casos', label: 'Gestión de Casos', icon: FolderOpen },
      { path: '/control/seguimiento-compliance', label: 'Etapas de los casos', icon: FolderOpen },
      { path: '/forense/tutoriales', label: 'Tutoriales Forenses', icon: BookOpen },
      { path: '/forense/manual-avilla', label: 'Manual Avilla', icon: BookOpen },
      { path: '/forense/manual-serverless', label: 'Manual Serverless', icon: BookOpen },
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

    // 2. Cases
    casos.forEach(caso => {
      list.push({
        id: `caso-${caso.id}`,
        category: 'Casos Forenses',
        title: caso.titulo,
        subtitle: `Caso #${caso.numeroCaso} | Expediente: ${caso.expediente || 'N/D'} | Perito: ${caso.peritoLider}`,
        icon: FolderOpen,
        action: () => {
          router.push(`/casos/${caso.id}`);
          onClose();
        }
      });
    });

    // 3. Normativas
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

  // Filtered items based on query
  const filteredItems = useMemo(() => {
    if (!query.trim()) return items.slice(0, 10); // Show top 10 items initially

    const cleanQuery = query.toLowerCase().trim();
    return items.filter(item => 
      item.title.toLowerCase().includes(cleanQuery) || 
      (item.subtitle && item.subtitle.toLowerCase().includes(cleanQuery)) ||
      item.category.toLowerCase().includes(cleanQuery)
    );
  }, [items, query]);

  // Handle keyboard navigation
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

  // Scroll active item into view
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

  // Group filtered items by category
  const grouped = filteredItems.reduce((acc, item, index) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push({ item, originalIndex: index });
    return acc;
  }, {} as Record<string, { item: CommandItem; originalIndex: number }[]>);

  return (
    <div className="fixed inset-0 z-[2000] flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-[8px] transition-opacity"
        onClick={onClose}
      />

      {/* Palette box */}
      <div 
        className="relative w-full max-w-[640px] bg-[var(--co-surface-1)] border border-[var(--co-separator)] rounded-[16px] shadow-[var(--co-shadow-modal)] flex flex-col z-[2010] overflow-hidden apple-scale-in"
        onKeyDown={handleKeyDown}
      >
        {/* Search header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--co-separator)]">
          <Search size={18} className="text-[var(--co-gray-1)] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Buscar casos por ID, perito o ir a secciones..."
            className="flex-1 bg-transparent text-[16px] text-[var(--apple-text)] outline-none border-none placeholder-[var(--co-gray-2)]"
          />
        </div>

        {/* Results list */}
        <div 
          ref={listRef}
          className="flex-1 overflow-y-auto max-h-[360px] p-2"
        >
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-[14px] text-[var(--co-gray-1)]">
              No se encontraron resultados para "{query}"
            </div>
          ) : (
            Object.entries(grouped).map(([category, groupItems]) => (
              <div key={category} className="mb-2">
                {/* Category header */}
                <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--co-gray-1)] px-3 py-1.5 select-none">
                  {category}
                </div>
                {/* Category items */}
                <div className="space-y-0.5">
                  {groupItems.map(({ item, originalIndex }) => {
                    const Icon = item.icon;
                    const isActive = originalIndex === selectedIndex;
                    return (
                      <button
                        key={item.id}
                        data-index={originalIndex}
                        onClick={item.action}
                        onMouseEnter={() => setSelectedIndex(originalIndex)}
                        className={`
                          w-full flex items-center justify-between px-3 py-2 rounded-[10px] text-left select-none transition-colors outline-none
                          ${isActive 
                            ? 'bg-[var(--co-accent)] text-white' 
                            : 'hover:bg-[var(--apple-surface-hover)]'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`
                            p-1.5 rounded-md shrink-0
                            ${isActive ? 'bg-white/20 text-white' : 'bg-[var(--co-surface-2)] text-[var(--co-gray-1)]'}
                          `}>
                            <Icon size={16} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13.5px] font-semibold truncate">
                              {item.title}
                            </p>
                            {item.subtitle && (
                              <p className={`
                                text-[11px] truncate mt-0.5
                                ${isActive ? 'text-white/80' : 'text-[var(--co-gray-1)]'}
                              `}>
                                {item.subtitle}
                              </p>
                            )}
                          </div>
                        </div>
                        <ChevronRight size={14} className={isActive ? 'text-white' : 'text-[var(--co-gray-2)]'} />
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer help */}
        <div className="px-4 py-2 bg-[var(--co-surface-2)] border-t border-[var(--co-separator)] flex items-center gap-4 text-[10px] text-[var(--co-gray-1)] select-none">
          <div className="flex items-center gap-1">
            <span className="px-1.5 py-0.5 bg-[var(--co-surface-3)] border border-[var(--co-separator)] rounded font-semibold">↑↓</span>
            <span>Navegar</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="px-1.5 py-0.5 bg-[var(--co-surface-3)] border border-[var(--co-separator)] rounded font-semibold">↵ Enter</span>
            <span>Seleccionar</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="px-1.5 py-0.5 bg-[var(--co-surface-3)] border border-[var(--co-separator)] rounded font-semibold">Esc</span>
            <span>Cerrar</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
