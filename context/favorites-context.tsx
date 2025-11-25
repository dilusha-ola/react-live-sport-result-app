import { Event } from '@/types/sports';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface FavoritesContextType {
  favorites: Event[];
  favoriteIds: Set<string>;
  addFavorite: (match: Event) => Promise<void>;
  removeFavorite: (matchId: string) => Promise<void>;
  toggleFavorite: (match: Event) => Promise<void>;
  isFavorite: (matchId: string) => boolean;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const FAVORITES_STORAGE_KEY = '@scorepulse_favorites';

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Event[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Load favorites from AsyncStorage on mount
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        const parsed: Event[] = JSON.parse(stored);
        setFavorites(parsed);
        setFavoriteIds(new Set(parsed.map(m => m.idEvent)));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveFavorites = async (newFavorites: Event[]) => {
    try {
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const addFavorite = async (match: Event) => {
    if (!favoriteIds.has(match.idEvent)) {
      const newFavorites = [...favorites, match];
      setFavorites(newFavorites);
      setFavoriteIds(new Set([...favoriteIds, match.idEvent]));
      await saveFavorites(newFavorites);
    }
  };

  const removeFavorite = async (matchId: string) => {
    const newFavorites = favorites.filter(m => m.idEvent !== matchId);
    setFavorites(newFavorites);
    const newIds = new Set(favoriteIds);
    newIds.delete(matchId);
    setFavoriteIds(newIds);
    await saveFavorites(newFavorites);
  };

  const toggleFavorite = async (match: Event) => {
    if (favoriteIds.has(match.idEvent)) {
      await removeFavorite(match.idEvent);
    } else {
      await addFavorite(match);
    }
  };

  const isFavorite = (matchId: string) => {
    return favoriteIds.has(matchId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoriteIds,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
        loading,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
