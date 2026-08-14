import { useEffect, useState } from "react";

/** Returns the current calendar date in India (IST) as YYYY-MM-DD. */
export const getISTDate = (d: Date = new Date()) => {
  const ist = new Date(d.getTime() + (330 + d.getTimezoneOffset()) * 60000);
  const y = ist.getFullYear();
  const m = String(ist.getMonth() + 1).padStart(2, "0");
  const day = String(ist.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const INDEPENDENCE_DAY = "2026-08-15";

/**
 * True only on 15 August 2026 (IST). Re-checks every minute so the theme
 * switches itself off automatically at midnight IST on 16 August.
 */
export const useIndependenceDay = () => {
  const [active, setActive] = useState(() => getISTDate() === INDEPENDENCE_DAY);

  useEffect(() => {
    const id = setInterval(() => {
      setActive(getISTDate() === INDEPENDENCE_DAY);
    }, 60000);
    return () => clearInterval(id);
  }, []);

  return active;
};

export default useIndependenceDay;