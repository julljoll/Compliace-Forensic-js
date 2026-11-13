import React from 'react';
import * as MaterialIcons from './AppleIcon';
export type { IconProps, CMSIcon } from './AppleIcon';

export interface MaterialIconProps extends MaterialIcons.IconProps {
  name: keyof typeof MaterialIcons;
}

/**
 * Componente unificado para renderizar cualquier icono de Material Design por nombre.
 */
export function MaterialIcon({ name, ...props }: MaterialIconProps) {
  const IconComponent = MaterialIcons[name] as MaterialIcons.CMSIcon | undefined;
  if (!IconComponent) {
    console.warn(`MaterialIcon: Icono no encontrado "${name}"`);
    return <MaterialIcons.AlertCircle {...props} />;
  }
  return <IconComponent {...props} />;
}

export * from './AppleIcon';
