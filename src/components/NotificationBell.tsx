import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWebNotifications } from "@/hooks/useWebNotifications";
import { formatDistanceToNow } from "date-fns";

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    permission, 
    notifications, 
    unreadCount, 
    requestPermission,
    markAsRead,
    markAllAsRead,
    clearNotifications 
  } = useWebNotifications();

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center text-xs text-white font-bold"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-12 w-80 z-50 rounded-xl shadow-2xl border border-border overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(var(--background), 0.98) 0%, rgba(var(--secondary), 0.98) 100%)',
                backdropFilter: 'blur(20px)',
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="font-bold">Notifications</h3>
                <div className="flex items-center gap-1">
                  {notifications.length > 0 && (
                    <>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={markAllAsRead}
                        className="h-8 text-xs"
                      >
                        <Check className="w-3 h-3 mr-1" />
                        Read all
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={clearNotifications}
                        className="h-8 text-xs text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </>
                  )}
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Permission Banner */}
              {permission !== "granted" && (
                <div className="p-3 bg-violet-500/10 border-b border-violet-500/20">
                  <p className="text-sm text-muted-foreground mb-2">
                    Enable notifications to receive important updates
                  </p>
                  <Button 
                    size="sm" 
                    onClick={requestPermission}
                    className="w-full bg-violet-600 hover:bg-violet-700"
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Enable Notifications
                  </Button>
                </div>
              )}

              {/* Notifications List */}
              <ScrollArea className="h-72">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <Bell className="w-12 h-12 text-muted-foreground/30 mb-3" />
                    <p className="text-muted-foreground text-sm">No notifications yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => markAsRead(notification.id)}
                        className={`p-4 cursor-pointer hover:bg-secondary/50 transition-colors ${
                          !notification.read ? 'bg-violet-500/5' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {!notification.read && (
                            <span className="w-2 h-2 rounded-full bg-violet-500 mt-2 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{notification.title}</p>
                            <p className="text-muted-foreground text-xs mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground/60 mt-2">
                              {formatDistanceToNow(new Date(notification.sentAt), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
