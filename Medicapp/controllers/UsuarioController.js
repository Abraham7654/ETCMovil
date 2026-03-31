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
    const usuario = await db.getFirstAsync('SELECT * FROM usuarios WHERE id = ?', [id]);
    return { success: true, usuario };
  } catch (error) {
    return { success: false, mensaje: error.message };
  }
};

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

export const generarClaveTemporal = async (email) => {
  try {
    const db = await getDB();
    const cleanEmail = email.trim().toLowerCase();
    const user = await db.getFirstAsync('SELECT id FROM usuarios WHERE email = ?', [cleanEmail]);
    
    if (!user) return { success: false, mensaje: 'El correo no está registrado' };

    const claveTemporal = Math.floor(100000 + Math.random() * 900000).toString();
    
    await db.runAsync('UPDATE usuarios SET password=? WHERE email=?', [claveTemporal, cleanEmail]);
    
    return { success: true, claveTemporal }; 
  } catch (error) {
    return { success: false, mensaje: error.message };
  }
};

export const completarRecuperacion = async (email, claveTemporal, passwordNueva) => {
  try {
    const db = await getDB();
    const cleanEmail = email.trim().toLowerCase();

    const user = await db.getFirstAsync(
      'SELECT id FROM usuarios WHERE email = ? AND password = ?', 
      [cleanEmail, claveTemporal]
    );

    if (!user) return { success: false, mensaje: 'La clave temporal es incorrecta' };

    await db.runAsync('UPDATE usuarios SET password=? WHERE email=?', [passwordNueva, cleanEmail]);
    return { success: true };
  } catch (error) {
    return { success: false, mensaje: error.message };
  }
};

export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};