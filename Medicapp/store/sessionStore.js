import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_KEY = 'medicapp_session';

export const sessionStore = {
  // Guardar sesión al hacer login
  guardar: async (usuario) => {
    try {
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(usuario));
    } catch (e) {
      console.error('Error guardando sesión:', e);
    }
  },

  // Recuperar sesión al abrir app
  obtener: async () => {
    try {
      const data = await AsyncStorage.getItem(SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  // Eliminar sesión al cerrar
  eliminar: async () => {
    try {
      await AsyncStorage.removeItem(SESSION_KEY);
    } catch (e) {
      console.error('Error eliminando sesión:', e);
    }
  },
};