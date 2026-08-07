import { useState, useEffect } from "react";
import { z } from "zod";
import { readValidated } from "@/lib/safeStorage";

const RECENTLY_VIEWED_KEY = "preppro_recently_viewed";
const MAX_ITEMS = 5;

export interface RecentItem {
  id: string;
  title: string;
  type: "app" | "material";
  timestamp: number;
}

export const useRecentlyViewed = () => {
  const [recentlyViewed, setRecentlyViewed] = useState<RecentItem[]>(() => {
    const schema = z.array(z.object({
      id: z.string().max(200),
      title: z.string().max(300),
      type: z.enum(["app", "material"]),
      timestamp: z.number(),
    })).max(MAX_ITEMS);
    return readValidated<RecentItem[]>(RECENTLY_VIEWED_KEY, schema, []);
  });

  useEffect(() => {
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const addToRecentlyViewed = (id: string, title: string, type: "app" | "material") => {
    setRecentlyViewed(prev => {
      // Remove if already exists
      const filtered = prev.filter(item => item.id !== id);
      // Add to beginning
      const newItem: RecentItem = { id, title, type, timestamp: Date.now() };
      const updated = [newItem, ...filtered].slice(0, MAX_ITEMS);
      return updated;
    });
  };

  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
  };

  return { recentlyViewed, addToRecentlyViewed, clearRecentlyViewed };
};
