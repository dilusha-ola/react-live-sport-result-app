import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@scorepulse_dark_mode';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load theme preference on mount
  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (stored !== null) {
        setIsDarkMode(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const saveThemePreference = async (value: boolean) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newValue = !prev;
      saveThemePreference(newValue);
      return newValue;
    });
  };

  const setDarkMode = (value: boolean) => {
    setIsDarkMode(value);
    saveThemePreference(value);
  };

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        setDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
