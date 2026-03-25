import { useState, useEffect } from "react";
import { themeStore } from "./themeStore";
import { lightTheme, darkTheme } from "../theme/theme";

export const useTheme = () => {
  const [darkMode, setDarkMode] = useState(themeStore.getDarkMode());

  useEffect(() => {
    const unsub = themeStore.subscribe(setDarkMode);
    return unsub;
  }, []);

  return {
    darkMode,
    t: darkMode ? darkTheme : lightTheme,
    toggleDark: () => themeStore.setDarkMode(!darkMode),
  };
};