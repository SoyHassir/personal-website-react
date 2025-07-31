// Verificar si service workers son compatibles
const isSupported = 'serviceWorker' in navigator;

// Configuración del service worker
const SW_URL = '/service-worker.js';

export const registerServiceWorker = async () => {
  if (!isSupported) {
    console.log('Service Workers no son compatibles en este navegador');
    return false;
  }

  try {
    console.log('Registrando Service Worker...');
    
    const registration = await navigator.serviceWorker.register(SW_URL, {
      scope: '/'
    });

    console.log('Service Worker registrado exitosamente:', registration.scope);

    // Manejar actualizaciones del service worker
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            // Hay una nueva versión disponible
            console.log('Nueva versión del Service Worker disponible');
            showUpdateNotification(registration);
          } else {
            // Service Worker instalado por primera vez
            console.log('Service Worker instalado por primera vez');
            showInstallNotification();
          }
        }
      });
    });

    return registration;
  } catch (error) {
    console.error('Error al registrar Service Worker:', error);
    return false;
  }
};

export const unregisterServiceWorker = async () => {
  if (!isSupported) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      const unregistered = await registration.unregister();
      console.log('Service Worker desregistrado:', unregistered);
      return unregistered;
    }
    return false;
  } catch (error) {
    console.error('Error al desregistrar Service Worker:', error);
    return false;
  }
};

// Mostrar notificación de instalación
const showInstallNotification = () => {
  // Opcional: mostrar notificación o toast de que la app está lista para uso offline
  console.log('✅ App lista para usar offline');
};

// Mostrar notificación de actualización
const showUpdateNotification = (registration) => {
  // Opcional: mostrar notificación para actualizar
  console.log('🔄 Nueva versión disponible');
  
  // Auto-actualizar después de un delay (opcional)
  setTimeout(() => {
    if (registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  }, 3000);
};

// Verificar si hay service worker activo
export const isServiceWorkerActive = () => {
  return isSupported && navigator.serviceWorker.controller;
};

// Obtener información del service worker
export const getServiceWorkerInfo = async () => {
  if (!isSupported) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    return {
      supported: true,
      registered: !!registration,
      active: !!registration?.active,
      scope: registration?.scope || null
    };
  } catch (error) {
    console.error('Error obteniendo info del Service Worker:', error);
    return null;
  }
}; 