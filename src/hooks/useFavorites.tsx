import { useState, useEffect } from "react";
import { z } from "zod";
import { readValidated } from "@/lib/safeStorage";

const FAVORITES_KEY = "preppro_favorites";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    return readValidated<string[]>(FAVORITES_KEY, z.array(z.string().max(200)).max(500), []);
  });

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  const isFavorite = (id: string) => favorites.includes(id);

  return { favorites, toggleFavorite, isFavorite };
};
