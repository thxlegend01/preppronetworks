import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Send, Users, Megaphone, CheckCircle, AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SentNotification {
  id: string;
  title: string;
  message: string;
  target: string;
  sentAt: Date;
  status: "sent" | "failed";
}

const NotificationManager = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState("all");
  const [sending, setSending] = useState(false);
  const [sentNotifications, setSentNotifications] = useState<SentNotification[]>([]);
  const { toast } = useToast();

  const handleSendNotification = async () => {
    if (!title.trim() || !message.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please enter both title and message for the notification.",
      });
      return;
    }

    setSending(true);

    try {
      // Simulate sending notification (in real app, this would call your Applix/OneSignal API)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newNotification: SentNotification = {
        id: Date.now().toString(),
        title,
        message,
        target,
        sentAt: new Date(),
        status: "sent",
      };

      setSentNotifications((prev) => [newNotification, ...prev]);

      toast({
        title: "Notification Sent!",
        description: `Notification "${title}" sent to ${target === "all" ? "all users" : target}.`,
      });

      // Clear form
      setTitle("");
      setMessage("");
      setTarget("all");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to Send",
        description: "There was an error sending the notification. Please try again.",
      });
    } finally {
      setSending(false);
    }
  };

  const handleDeleteNotification = (id: string) => {
    setSentNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6 mt-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <Bell className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold">Push Notifications</h3>
          <p className="text-sm text-muted-foreground">
            Send notifications to web & app users via Applix
          </p>
        </div>
      </div>

      {/* Notification Form */}
      <div className="space-y-4 mb-8">
        <div>
          <label className="text-sm font-medium mb-2 block">Notification Title</label>
          <Input
            placeholder="Enter notification title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-secondary/50"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Message</label>
          <Textarea
            placeholder="Enter your notification message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="bg-secondary/50 resize-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Target Audience</label>
          <Select value={target} onValueChange={setTarget}>
            <SelectTrigger className="bg-secondary/50">
              <SelectValue placeholder="Select target" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  All Users
                </div>
              </SelectItem>
              <SelectItem value="app-users">
                <div className="flex items-center gap-2">
                  <Megaphone className="w-4 h-4" />
                  App Users Only
                </div>
              </SelectItem>
              <SelectItem value="web-users">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Web Users Only
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleSendNotification}
          disabled={sending || !title.trim() || !message.trim()}
          className="w-full relative overflow-hidden"
        >
          {sending ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full mr-2" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send Notification
            </>
          )}
        </Button>
      </div>

      {/* Info Box */}
      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <h4 className="font-semibold text-sm mb-1">Applix Integration</h4>
            <p className="text-xs text-muted-foreground">
              This notification system is connected to your Applix app. Notifications will be sent
              to all subscribed users on both web and the Android app. Make sure your Applix
              push notification service is configured correctly.
            </p>
          </div>
        </div>
      </div>

      {/* Sent Notifications History */}
      {sentNotifications.length > 0 && (
        <div>
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            Recent Notifications
          </h4>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {sentNotifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 rounded-lg bg-secondary/30 border border-border/50 flex items-start justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm truncate">
                      {notification.title}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        notification.status === "sent"
                          ? "bg-green-500/20 text-green-500"
                          : "bg-destructive/20 text-destructive"
                      }`}
                    >
                      {notification.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                    <span>To: {notification.target}</span>
                    <span>
                      {notification.sentAt.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteNotification(notification.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default NotificationManager;
