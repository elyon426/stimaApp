import { useTheme } from '../context/ThemeContext';

export function useThemeColor(key) {
  const { colors } = useTheme();

  if (Array.isArray(key)) {
    // Build the object every render — it's tiny and keeps the hook honest
    // (no stale references if `colors` swaps when the theme changes).
    const picked = {};
    for (const k of key) {
      picked[k] = colors[k];
    }
    return picked;
  }

  return colors[key];
}

/**
 * Returns the full active color palette.
 * Equivalent to `useTheme().colors`, kept as a named hook so imports
 * across the app stay consistent (`useThemeColor` / `useThemeColors`).
 */
export function useThemeColors() {
  return useTheme().colors;
}

/**
 * Returns the whole theme bag: colors, mode, isDark, toggleTheme, setThemePreference.
 * Same as `useTheme()`, re-exported here so screens can import from one place.
 */
export function useThemeControls() {
  return useTheme();
}

