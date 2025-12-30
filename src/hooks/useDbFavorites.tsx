import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface Favorite {
  id: string;
  item_id: string;
  item_type: string;
  created_at: string;
}

export const useDbFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("user_favorites")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching favorites:", error);
    } else {
      setFavorites(data || []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const toggleFavorite = async (itemId: string, itemType: "batch" | "test" | "material") => {
    if (!user) return;

    const existing = favorites.find(f => f.item_id === itemId && f.item_type === itemType);

    if (existing) {
      // Remove favorite
      const { error } = await supabase
        .from("user_favorites")
        .delete()
        .eq("id", existing.id);

      if (error) {
        console.error("Error removing favorite:", error);
        return;
      }
      setFavorites(prev => prev.filter(f => f.id !== existing.id));
    } else {
      // Add favorite
      const { data, error } = await supabase
        .from("user_favorites")
        .insert({
          user_id: user.id,
          item_id: itemId,
          item_type: itemType,
        })
        .select()
        .single();

      if (error) {
        console.error("Error adding favorite:", error);
        return;
      }
      setFavorites(prev => [data, ...prev]);
    }
  };

  const isFavorite = (itemId: string, itemType?: string) => {
    if (itemType) {
      return favorites.some(f => f.item_id === itemId && f.item_type === itemType);
    }
    return favorites.some(f => f.item_id === itemId);
  };

  const getFavoritesByType = (type: string) => {
    return favorites.filter(f => f.item_type === type);
  };

  return {
    favorites,
    loading,
    toggleFavorite,
    isFavorite,
    getFavoritesByType,
    refetch: fetchFavorites,
  };
};