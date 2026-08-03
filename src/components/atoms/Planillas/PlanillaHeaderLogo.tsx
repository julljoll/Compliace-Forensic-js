import React from 'react';

interface PlanillaHeaderLogoProps {
  alt?: string;
}

export function PlanillaHeaderLogo({ alt = 'SHA256.US — Lab. Informática Forense' }: PlanillaHeaderLogoProps) {
  return (
    <div className="header-logo-brand">
      <img src="/logo.png" alt={alt} title={alt} className="logo-img" />
      <div className="logo-brand-text-col">
        <span className="logo-text">SHA256.US</span>
        <span className="logo-subtext">Lab. Informática Forense</span>
      </div>
    </div>
  );
}
