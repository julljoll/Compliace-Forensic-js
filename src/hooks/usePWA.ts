import { useEffect, useState } from 'react';

interface PWAStatus {
  isPWA: boolean;
  isOnline: boolean;
  updateAvailable: boolean;
}

export function usePWA() {
  const [status, setStatus] = useState<PWAStatus>({
    isPWA: false,
    isOnline: navigator.onLine,
    updateAvailable: false,
  });

  useEffect(() => {
    // Detectar si es PWA instalada
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInstalled = (window.navigator as any).standalone === true;
    
    setStatus(prev => ({
      ...prev,
      isPWA: isStandalone || isInstalled,
    }));

    // Escuchar cambios de conexión
    const handleOnline = () => setStatus(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setStatus(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Detectar actualización del service worker → recargar para evitar chunk obsoleto
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setStatus(prev => ({ ...prev, updateAvailable: true }));
        window.location.reload();
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const installPWA = async () => {
    // El evento beforeinstallprompt se dispara automáticamente
    // cuando la app cumple los criterios de instalabilidad
    console.log('Para instalar: usar el botón de instalación del navegador');
  };

  const updateServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      await registration.update();
      window.location.reload();
    }
  };

  return {
    ...status,
    installPWA,
    updateServiceWorker,
  };
}
