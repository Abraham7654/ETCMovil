// controllers/UsuarioController.js
import { getDB } from '../database/Database';

export const login = async (email, password) => {
  try {
    const db = await getDB();
    const user = await db.getFirstAsync(
      'SELECT * FROM usuarios WHERE email = ? AND password = ?',
      [email.trim().toLowerCase(), password]
    );
    if (user) return { success: true, usuario: user };
    return { success: false, mensaje: 'Correo o contraseña incorrectos' };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, mensaje: 'Error al iniciar sesión' };
  }
};

export const getPerfil = async (id) => {
  try {
    const db = await getDB();
    const usuario = await db.getFirstAsync(
      'SELECT * FROM usuarios WHERE id = ?', [id]
    );
    return { success: true, usuario };
  } catch (error) {
    return { success: false, mensaje: error.message };
  }
};

export const actualizarPerfil = async (id, datos) => {
  try {
    const db = await getDB();
    await db.runAsync(
      `UPDATE usuarios SET nombre=?, especialidad=?, colegio=?, centro_trabajo=?, telefono=?
       WHERE id=?`,
      [datos.nombre, datos.especialidad, datos.colegio, datos.centro_trabajo, datos.telefono, id]
    );
    return { success: true };
  } catch (error) {
    return { success: false, mensaje: error.message };
  }
};

export const cambiarPassword = async (id, passwordActual, passwordNueva) => {
  try {
    const db = await getDB();
    const user = await db.getFirstAsync(
      'SELECT id FROM usuarios WHERE id = ? AND password = ?', [id, passwordActual]
    );
    if (!user) return { success: false, mensaje: 'Contraseña actual incorrecta' };
    await db.runAsync('UPDATE usuarios SET password=? WHERE id=?', [passwordNueva, id]);
    return { success: true };
  } catch (error) {
    return { success: false, mensaje: error.message };
  }
};