import { getDB } from '../database/Database';

// LOGIN
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
    return { success: false, mensaje: 'Error al iniciar sesión' };
  }
};

// OBTENER PERFIL POR ID
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

// ACTUALIZAR PERFIL
export const actualizarPerfil = async (id, datos) => {
  try {
    const db = await getDB();
    await db.runAsync(
      `UPDATE usuarios SET nombre=?, especialidad=?, colegio=?, centro_trabajo=?, telefono=?
       WHERE id=?`,
      [datos.nombre, datos.especialidad, datos.colegio, datos.centro_trabajo, datos.telefono, id]
    );
    // Devolver usuario actualizado
    const usuario = await db.getFirstAsync('SELECT * FROM usuarios WHERE id = ?', [id]);
    return { success: true, usuario };
  } catch (error) {
    return { success: false, mensaje: error.message };
  }
};

// CAMBIAR CONTRASEÑA (desde perfil/ajustes - requiere contraseña actual)
export const cambiarPassword = async (id, passwordActual, passwordNueva) => {
  try {
    if (!passwordNueva || passwordNueva.length < 6) {
      return { success: false, mensaje: 'La nueva contraseña debe tener al menos 6 caracteres' };
    }
    const db = await getDB();
    const user = await db.getFirstAsync(
      'SELECT id FROM usuarios WHERE id = ? AND password = ?', [id, passwordActual]
    );
    if (!user) return { success: false, mensaje: 'La contraseña actual es incorrecta' };
    await db.runAsync('UPDATE usuarios SET password=? WHERE id=?', [passwordNueva, id]);
    return { success: true };
  } catch (error) {
    return { success: false, mensaje: error.message };
  }
};

// RECUPERAR CONTRASEÑA (desde login - solo con email)
export const recuperarPassword = async (email, passwordNueva) => {
  try {
    if (!email.trim()) return { success: false, mensaje: 'Ingresa tu correo' };
    if (!passwordNueva || passwordNueva.length < 6) {
      return { success: false, mensaje: 'La nueva contraseña debe tener al menos 6 caracteres' };
    }
    const db = await getDB();
    const user = await db.getFirstAsync(
      'SELECT id FROM usuarios WHERE email = ?', [email.trim().toLowerCase()]
    );
    if (!user) return { success: false, mensaje: 'No existe una cuenta con ese correo' };
    await db.runAsync('UPDATE usuarios SET password=? WHERE email=?',
      [passwordNueva, email.trim().toLowerCase()]
    );
    return { success: true };
  } catch (error) {
    return { success: false, mensaje: error.message };
  }
};

// VALIDAR EMAIL
export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};