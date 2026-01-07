import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import UsernamePrompt from "@/components/UsernamePrompt";

interface UsernameCheckContextType {
  hasUsername: boolean;
  username: string | null;
  checkUsername: () => Promise<void>;
}

const UsernameCheckContext = createContext<UsernameCheckContextType | undefined>(undefined);

export const UsernameCheckProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [hasUsername, setHasUsername] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const checkUsername = async () => {
    if (!user || isChecking) return;
    
    setIsChecking(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;

      if (data?.username) {
        setHasUsername(true);
        setUsername(data.username);
        setShowPrompt(false);
      } else {
        setHasUsername(false);
        setUsername(null);
        setShowPrompt(true);
      }
    } catch (err) {
      console.error("Error checking username:", err);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    if (user) {
      checkUsername();
    } else {
      setHasUsername(true);
      setUsername(null);
      setShowPrompt(false);
    }
  }, [user]);

  const handleComplete = () => {
    setShowPrompt(false);
    setHasUsername(true);
    checkUsername();
  };

  return (
    <UsernameCheckContext.Provider value={{ hasUsername, username, checkUsername }}>
      {children}
      {user && showPrompt && (
        <UsernamePrompt 
          userId={user.id} 
          isOpen={showPrompt} 
          onComplete={handleComplete}
        />
      )}
    </UsernameCheckContext.Provider>
  );
};

export const useUsernameCheck = () => {
  const context = useContext(UsernameCheckContext);
  if (context === undefined) {
    throw new Error("useUsernameCheck must be used within a UsernameCheckProvider");
  }
  return context;
};
