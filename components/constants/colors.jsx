// constants/colors.jsx
//
// Single source of truth for every color used across the app.
// ThemeContext imports these palettes rather than defining colors itself,
// so there's exactly one place to tweak brand colors, greys, etc.

export const lightColors = {
  mode: 'light',

  // surfaces
  background: '#ffffff',
  surface: '#f9f9f9',
  card: 'rgba(26, 78, 143, 0.06)',

  // text — standardized on the two most-used shades found across the app
  text: '#111827',          // primary text (was split between #111827 / #1a1a1a)
  textSecondary: '#6B7280', // secondary text (labels, captions)
  textMuted: '#9CA3AF',     // muted/placeholder-adjacent text (was the most common grey)
  textOnDark: '#ffffff',    // text sitting on gradient / colored backgrounds

  inputText: '#111827',
  placeholder: '#9CA3AF',

  border: 'rgba(26, 78, 143, 0.12)',

  // brand accent (blue)
  primary: '#2563eb',
  primaryDark: '#1a4e8f',
  gradient: ['#1a4e8f', '#2563eb', '#3b82f6', '#60a5fa'],

  // status colors
  danger: '#dc2626',
  success: '#16a34a',
  warning: '#f59e0b',

  statusBarStyle: 'dark',
};

export const darkColors = {
  mode: 'dark',

  // surfaces
  background: '#121212',
  surface: '#1a1a1a',
  card: 'rgba(59, 130, 246, 0.14)',

  // text
  text: '#f2f2f2',
  textSecondary: '#B0B5BB',
  textMuted: '#7A7F87',
  textOnDark: '#ffffff',

  inputText: '#f2f2f2',
  placeholder: '#7A7F87',

  border: 'rgba(96, 165, 250, 0.2)',

  // brand accent (blue) — slightly lighter/brighter so it pops on dark backgrounds
  primary: '#60a5fa',
  primaryDark: '#93c5fd',
  gradient: ['#1a4e8f', '#2563eb', '#3b82f6', '#60a5fa'],

  // status colors
  danger: '#f87171',
  success: '#4ade80',
  warning: '#fbbf24',

  statusBarStyle: 'light',
};
