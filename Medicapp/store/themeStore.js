// themeStore.js - Store global simple sin context ni librerías externas
let darkMode = false;
const listeners = new Set();

export const themeStore = {
  getDarkMode: () => darkMode,

  setDarkMode: (value) => {
    darkMode = value;
    listeners.forEach(fn => fn(value));
  },

  subscribe: (fn) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};