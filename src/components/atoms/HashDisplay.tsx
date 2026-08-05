import React, { useState } from 'react';
import { Copy, Check } from './AppleIcon';

export interface HashDisplayProps {
  hash: string;
}

export const HashDisplay: React.FC<HashDisplayProps> = ({ hash }) => {
  const [copied, setCopied] = useState(false);

  if (!hash) return null;

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
    <div className="d-inline-flex align-items-center gap-2 px-2 py-1 rounded bg-light border">
      <span className="font-monospace text-success fw-bold select-all" style={{ fontSize: '11px' }}>
        {hash}
      </span>
      <button
        type="button"
        onClick={handleCopy}
        className="btn btn-sm btn-link p-0 text-muted"
        title={copied ? '¡Copiado!' : 'Copiar Hash SHA-256'}
      >
        {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
      </button>
    </div>
  );
};

export default HashDisplay;
