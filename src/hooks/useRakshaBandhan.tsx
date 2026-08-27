import { useEffect, useState } from "react";
import { getISTDate } from "./useIndependenceDay";

export const RAKSHA_BANDHAN = "2026-08-28";

/**
 * True only on 28 August 2026 (IST) — 12:00 AM to 11:59 PM.
 * Re-checks every minute so the theme turns itself off at midnight.
 */
export const useRakshaBandhan = () => {
  const [active, setActive] = useState(() => getISTDate() === RAKSHA_BANDHAN);

  useEffect(() => {
    const id = setInterval(() => {
      setActive(getISTDate() === RAKSHA_BANDHAN);
    }, 60000);
    return () => clearInterval(id);
  }, []);

  return active;
};

export default useRakshaBandhan;
