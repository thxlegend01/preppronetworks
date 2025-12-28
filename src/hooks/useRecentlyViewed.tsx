import { useState, useEffect } from "react";

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
    const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
    return stored ? JSON.parse(stored) : [];
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
