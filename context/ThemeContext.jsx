import * as SecureStore from 'expo-secure-store';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { darkColors, lightColors } from '../constants/colors';

const THEME_STORAGE_KEY = 'stima:theme-preference'; // 'light' | 'dark' | 'system'

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme(); // 'light' | 'dark' | null

  // 'preference' is what the user picked: 'light', 'dark', or 'system'
  const [preference, setPreference] = useState('system');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved preference once on startup
  useEffect(() => {
    (async () => {
      try {
        const saved = await SecureStore.getItemAsync(THEME_STORAGE_KEY);
        if (saved === 'light' || saved === 'dark' || saved === 'system') {
          setPreference(saved);
        }
      } catch (e) {
        // If storage fails, just fall back to system default silently
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  // Resolve the actual active mode from preference + system setting
  const activeMode = preference === 'system' ? (systemScheme ?? 'light') : preference;

  const colors = activeMode === 'dark' ? darkColors : lightColors;

  const setThemePreference = async (next) => {
    setPreference(next);
    try {
      await SecureStore.setItemAsync(THEME_STORAGE_KEY, next);
    } catch (e) {
      // Non-fatal — preference just won't persist this session
    }
  };

  const toggleTheme = () => {
    // Toggles between light and dark explicitly (leaves "system" mode)
    setThemePreference(activeMode === 'dark' ? 'light' : 'dark');
  };

  const value = useMemo(
    () => ({
      colors,
      mode: activeMode,
      preference,
      isDark: activeMode === 'dark',
      isLoaded,
      toggleTheme,
      setThemePreference,
    }),
    [colors, activeMode, preference, isLoaded]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
