import { useState, useEffect, useCallback } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { readValidated } from "@/lib/safeStorage";

const ACCESS_STORAGE_KEY = "preppro_access_data";
const ACCESS_DURATION_HOURS = 36;

interface AccessData {
  grantedAt: number;
  expiresAt: number;
}

const AccessDataSchema = z.object({
  grantedAt: z.number().finite(),
  expiresAt: z.number().finite(),
});

export const useAccessCode = () => {
  const [hasValidAccess, setHasValidAccess] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);

  // Check if access is still valid
  const checkAccess = useCallback(() => {
    try {
      const data = readValidated<AccessData | null>(ACCESS_STORAGE_KEY, AccessDataSchema, null);
      if (!data) {
        setHasValidAccess(false);
        setTimeRemaining(null);
        setExpiresAt(null);
        return false;
      }

      const now = Date.now();

      if (now < data.expiresAt) {
        setHasValidAccess(true);
        setExpiresAt(data.expiresAt);
        return true;
      } else {
        // Access expired, clear it
        localStorage.removeItem(ACCESS_STORAGE_KEY);
        setHasValidAccess(false);
        setTimeRemaining(null);
        setExpiresAt(null);
        return false;
      }
    } catch {
      setHasValidAccess(false);
      return false;
    }
  }, []);

  const persistAccess = useCallback((expiry: number) => {
    const data: AccessData = { grantedAt: Date.now(), expiresAt: expiry };
    localStorage.setItem(ACCESS_STORAGE_KEY, JSON.stringify(data));
    setHasValidAccess(true);
    setExpiresAt(expiry);
  }, []);

  /** Verifies the code on the server. Codes are never stored in the client bundle. */
  const verifyCode = useCallback(
    async (code: string): Promise<boolean> => {
      const trimmed = (code || "").trim();
      if (!trimmed || trimmed.length > 100) return false;
      try {
        const { data, error } = await supabase.functions.invoke("verify-access-code", {
          body: { code: trimmed },
        });
        if (error || !data?.valid) return false;
        const expiry =
          typeof data.expiresAt === "number"
            ? data.expiresAt
            : Date.now() + ACCESS_DURATION_HOURS * 60 * 60 * 1000;
        persistAccess(expiry);
        return true;
      } catch {
        return false;
      }
    },
    [persistAccess],
  );

  // Format time remaining
  const formatTimeRemaining = useCallback((expiresAt: number) => {
    const now = Date.now();
    const diff = expiresAt - now;
    
    if (diff <= 0) return null;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }, []);

  // Update time remaining every minute
  useEffect(() => {
    checkAccess();

    const interval = setInterval(() => {
      const isValid = checkAccess();
      if (isValid && expiresAt) {
        setTimeRemaining(formatTimeRemaining(expiresAt));
      }
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [checkAccess, expiresAt, formatTimeRemaining]);

  // Initial time remaining calculation
  useEffect(() => {
    if (expiresAt) {
      setTimeRemaining(formatTimeRemaining(expiresAt));
    }
  }, [expiresAt, formatTimeRemaining]);

  // Revoke access (for admin purposes)
  const revokeAccess = useCallback(() => {
    localStorage.removeItem(ACCESS_STORAGE_KEY);
    setHasValidAccess(false);
    setTimeRemaining(null);
    setExpiresAt(null);
  }, []);

  return {
    hasValidAccess,
    timeRemaining,
    expiresAt,
    verifyCode,
    revokeAccess,
    checkAccess
  };
};
