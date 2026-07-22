import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
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
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        px: '10px',
        py: '4px',
        borderRadius: '6px',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        border: '1px solid rgba(254, 207, 6, 0.25)',
      }}
    >
      <Typography
        sx={{
          fontFamily: 'monospace',
          fontSize: '11px',
          color: '#00FF41',
          userSelect: 'all',
          wordBreak: 'break-all',
        }}
      >
        {hash}
      </Typography>

      <Tooltip title={copied ? '¡Copiado!' : 'Copiar SHA-256'}>
        <IconButton
          onClick={handleCopy}
          size="small"
          sx={{ color: '#AEAEB2', p: '2px', '&:hover': { color: '#FECF06' } }}
        >
          {copied ? <Check size={12} style={{ color: '#00FF41' }} /> : <Copy size={12} />}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default HashDisplay;
