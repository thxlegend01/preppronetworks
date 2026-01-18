import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface ServiceWorkerState {
  isSupported: boolean;
  isRegistered: boolean;
  isOffline: boolean;
  registration: ServiceWorkerRegistration | null;
}

export const useServiceWorker = () => {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: false,
    isRegistered: false,
    isOffline: typeof navigator !== 'undefined' ? !navigator.onLine : false,
    registration: null,
  });
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const isSupported = 'serviceWorker' in navigator;
    setState(prev => ({ ...prev, isSupported }));

    if (!isSupported) {
      console.log('[SW] Service workers not supported');
      return;
    }

    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
        console.log('[SW] Service worker registered:', registration.scope);
        setState(prev => ({ ...prev, isRegistered: true, registration }));

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                toast({ title: "Update Available", description: "Refresh to get the latest version." });
              }
            });
          }
        });
      } catch (error) {
        console.error('[SW] Registration failed:', error);
      }
    };

    registerSW();

    const handleOnline = () => {
      setState(prev => ({ ...prev, isOffline: false }));
      toast({ title: "You're back online! 🌐" });
    };

    const handleOffline = () => {
      setState(prev => ({ ...prev, isOffline: true }));
      toast({ variant: "destructive", title: "You're offline 📴" });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  const subscribeToPush = useCallback(async () => {
    if (!state.registration) return null;

    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        toast({ variant: "destructive", title: "Permission Denied" });
        return null;
      }

      toast({ title: "Notifications Enabled! 🔔" });
      return true;
    } catch (error) {
      console.error('[SW] Push subscription failed:', error);
      return null;
    }
  }, [state.registration, toast]);

  const showNotification = useCallback(async (title: string, options?: NotificationOptions) => {
    if (!state.registration) return;
    try {
      await state.registration.showNotification(title, { icon: '/favicon.ico', ...options });
    } catch (error) {
      console.error('[SW] Show notification failed:', error);
    }
  }, [state.registration]);

  return { ...state, subscribeToPush, showNotification };
};
