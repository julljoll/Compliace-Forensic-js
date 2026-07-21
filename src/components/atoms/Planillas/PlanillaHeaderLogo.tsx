import React from 'react';

interface PlanillaHeaderLogoProps {
  alt?: string;
}

export function PlanillaHeaderLogo({ alt = 'SHA256.US Logo' }: PlanillaHeaderLogoProps) {
  return (
    <div className="header-logo-brand">
      <img src="/logo.png" alt={alt} className="logo-img" />
      <span className="logo-text">SHA256.US</span>
    </div>
  );
}
