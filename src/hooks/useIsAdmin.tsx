import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

/** Server-verified admin check. Admin identities are never shipped to the client. */
export const useIsAdmin = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!user) {
        if (!cancelled) {
          setIsAdmin(false);
          setChecking(false);
        }
        return;
      }
      setChecking(true);
      const { data, error } = await supabase.rpc("is_announcement_admin", { _user_id: user.id });
      if (!cancelled) {
        setIsAdmin(!error && data === true);
        setChecking(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [user]);

  return { isAdmin, checking };
};