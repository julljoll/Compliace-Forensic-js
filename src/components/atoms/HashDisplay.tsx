import React, { useState } from 'react';
import { Copy, Check } from './AppleIcon';

export interface HashDisplayProps {
  hash: string;
  className?: string;
}

export const HashDisplay: React.FC<HashDisplayProps> = ({ hash, className = '' }) => {
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  if (!hash) return null;

  const truncated = hash; // Rule 2: Show hashes complete (64 hex characters)

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar hash:', err);
    }
  };

  return (
    <div 
      className={`relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[var(--co-surface-2)] border border-[var(--co-separator)] text-[var(--co-gray-1)] ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span className="font-mono text-[12px] tracking-tight select-all break-all">{truncated}</span>
      <button
        onClick={handleCopy}
        className="p-0.5 rounded hover:bg-[var(--apple-surface-hover)] text-[var(--co-gray-2)] hover:text-[var(--apple-text)] transition-colors active:scale-90"
        title={copied ? "¡Copiado!" : "Copiar hash completo"}
        aria-label="Copiar hash completo"
      >
        {copied ? (
          <Check size={12} className="text-[var(--co-green)]" />
        ) : (
          <Copy size={12} />
        )}
      </button>

      {/* Premium Hover Tooltip for Full Hash */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-[999] px-3 py-1.5 rounded-[8px] bg-white text-[var(--apple-text)] border border-[var(--co-separator)] text-[11px] font-mono shadow-[var(--co-shadow-3)] pointer-events-none select-all break-all w-[320px] max-w-[90vw] text-center">
          <p className="font-semibold text-[var(--co-gray-1)] text-[9px] uppercase tracking-wider mb-0.5 select-none">SHA-256 Completo</p>
          {hash}
        </div>
      )}
    </div>
  );
};

export default HashDisplay;
