// useTheme.js - Hook para usar el tema en cualquier pantalla
import { useState, useEffect } from 'react';
import { themeStore } from './themeStore';
import { lightTheme, darkTheme } from '../theme/theme';

export const useTheme = () => {
  const [darkMode, setDarkMode] = useState(themeStore.getDarkMode());

  useEffect(() => {
    // Suscribirse a cambios del store
    const unsubscribe = themeStore.subscribe((value) => {
      setDarkMode(value);
    });
    // Limpieza al desmontar
    return unsubscribe;
  }, []);

  return {
    darkMode,
    t: darkMode ? darkTheme : lightTheme,
    toggleDark: () => themeStore.setDarkMode(!darkMode),
  };
};