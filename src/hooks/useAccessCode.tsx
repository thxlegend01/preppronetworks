import { useState, useEffect, useCallback } from "react";

const ACCESS_STORAGE_KEY = "preppro_access_data";
const ACCESS_DURATION_HOURS = 36;

interface AccessData {
  grantedAt: number;
  expiresAt: number;
}

export const useAccessCode = () => {
  const [hasValidAccess, setHasValidAccess] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);

  // Check if access is still valid
  const checkAccess = useCallback(() => {
    try {
      const stored = localStorage.getItem(ACCESS_STORAGE_KEY);
      if (!stored) {
        setHasValidAccess(false);
        setTimeRemaining(null);
        setExpiresAt(null);
        return false;
      }

      const data: AccessData = JSON.parse(stored);
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

  // Grant access for 36 hours
  const grantAccess = useCallback(() => {
    const now = Date.now();
    const expiresAt = now + (ACCESS_DURATION_HOURS * 60 * 60 * 1000);
    
    const data: AccessData = {
      grantedAt: now,
      expiresAt
    };

    localStorage.setItem(ACCESS_STORAGE_KEY, JSON.stringify(data));
    setHasValidAccess(true);
    setExpiresAt(expiresAt);
    
    // Also set session storage for backward compatibility
    sessionStorage.setItem("preppro_access", "granted");
  }, []);

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
    sessionStorage.removeItem("preppro_access");
    setHasValidAccess(false);
    setTimeRemaining(null);
    setExpiresAt(null);
  }, []);

  return {
    hasValidAccess,
    timeRemaining,
    expiresAt,
    grantAccess,
    revokeAccess,
    checkAccess
  };
};
