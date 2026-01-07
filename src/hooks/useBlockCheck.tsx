import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Ban, AlertTriangle } from "lucide-react";

interface BlockCheckContextType {
  isBlocked: boolean;
  checkBlockStatus: () => Promise<void>;
}

const BlockCheckContext = createContext<BlockCheckContextType | undefined>(undefined);

export const BlockCheckProvider = ({ children }: { children: ReactNode }) => {
  const { user, signOut } = useAuth();
  const [isBlocked, setIsBlocked] = useState(false);
  const [showBlockedScreen, setShowBlockedScreen] = useState(false);

  const checkBlockStatus = async () => {
    if (!user) {
      setIsBlocked(false);
      setShowBlockedScreen(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("blocked_users")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setIsBlocked(true);
        setShowBlockedScreen(true);
      } else {
        setIsBlocked(false);
        setShowBlockedScreen(false);
      }
    } catch (err) {
      console.error("Error checking block status:", err);
    }
  };

  useEffect(() => {
    if (user) {
      checkBlockStatus();
    } else {
      setIsBlocked(false);
      setShowBlockedScreen(false);
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    setShowBlockedScreen(false);
    setIsBlocked(false);
  };

  if (showBlockedScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="absolute inset-0 radial-glow opacity-30" />
        <div className="absolute inset-0 grid-pattern opacity-20" />
        
        <div className="glass-card rounded-2xl p-8 max-w-md w-full relative z-10 text-center">
          <div className="w-24 h-24 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-6">
            <Ban className="w-12 h-12 text-destructive" />
          </div>
          
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Access Restricted
          </h1>
          
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
              <p className="text-sm text-left text-foreground">
                Your account has been restricted from accessing PrepPro Network. 
                If you believe this is a mistake, please contact support.
              </p>
            </div>
          </div>
          
          <p className="text-muted-foreground text-sm mb-6">
            You can sign out and use a different account.
          </p>
          
          <button
            onClick={handleSignOut}
            className="w-full py-3 px-4 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <BlockCheckContext.Provider value={{ isBlocked, checkBlockStatus }}>
      {children}
    </BlockCheckContext.Provider>
  );
};

export const useBlockCheck = () => {
  const context = useContext(BlockCheckContext);
  if (context === undefined) {
    throw new Error("useBlockCheck must be used within a BlockCheckProvider");
  }
  return context;
};
