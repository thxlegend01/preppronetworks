import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface AdminNotification {
  id: string;
  title: string;
  message: string;
  target: "all" | "web" | "app";
  sentAt: string;
  read: boolean;
}

export const useWebNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Check current permission
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }

    // Load stored notifications
    const stored = localStorage.getItem("admin_notifications");
    if (stored) {
      setNotifications(JSON.parse(stored));
    }

    // Listen for new notifications
    const handleNewNotification = (event: CustomEvent) => {
      const { title, message } = event.detail;
      
      // Show toast notification
      toast({
        title,
        description: message,
      });
    };

    window.addEventListener("admin-notification", handleNewNotification as EventListener);

    return () => {
      window.removeEventListener("admin-notification", handleNewNotification as EventListener);
    };
  }, [toast]);

  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) {
      toast({
        variant: "destructive",
        title: "Not Supported",
        description: "This browser doesn't support notifications.",
      });
      return false;
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    
    if (result === "granted") {
      toast({
        title: "Notifications Enabled!",
        description: "You'll now receive important updates.",
      });
      
      // Welcome notification
      new Notification("Welcome to PrepPro Hub!", {
        body: "You'll now receive important study updates and announcements.",
        icon: "/favicon.ico",
      });
      return true;
    }
    
    return false;
  }, [toast]);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => 
        n.id === id ? { ...n, read: true } : n
      );
      localStorage.setItem("admin_notifications", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      localStorage.setItem("admin_notifications", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    localStorage.removeItem("admin_notifications");
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    permission,
    notifications,
    unreadCount,
    requestPermission,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  };
};
