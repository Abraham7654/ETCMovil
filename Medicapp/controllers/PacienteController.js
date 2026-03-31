import { getDB } from '../database/Database';

export const getPacientes = async () => {
  try {
    const db = await getDB();
    const pacientes = await db.getAllAsync(
      'SELECT * FROM pacientes ORDER BY nombre ASC'
    );
    return { success: true, pacientes };
  } catch (error) {
    return { success: false, mensaje: error.message };
  }
};

export const getPaciente = async (id) => {
  try {
    const db = await getDB();
    const paciente = await db.getFirstAsync(
      'SELECT * FROM pacientes WHERE id = ?', [id]
    );
    return { success: true, paciente };
  } catch (error) {
    return { success: false, mensaje: error.message };
  }
};

export const buscarPacientes = async (texto) => {
  try {
    const db = await getDB();
    const pacientes = await db.getAllAsync(
      'SELECT * FROM pacientes WHERE nombre LIKE ? ORDER BY nombre ASC',
      [`%${texto}%`]
    );
    return { success: true, pacientes };
  } catch (error) {
    return { success: false, mensaje: error.message };
  }
};

export const crearPaciente = async (datos) => {
  try {
    const db = await getDB();
    const result = await db.runAsync(
      `INSERT INTO pacientes
       (nombre, edad, genero, telefono, contacto_emergencia, tipo_sangre, alergias, notas_medicas, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        datos.nombre.trim(),
        parseInt(datos.edad) || 0,
        datos.genero || '',
        datos.telefono || '',
        datos.contacto_emergencia || '',
        datos.tipo_sangre || '',
        datos.alergias || '',
        datos.notas_medicas || '',
        datos.estado || 'Activo',
      ]
    );
    return { success: true, id: result.lastInsertRowId };
  } catch (error) {
    return { success: false, mensaje: error.message };
  }
};

export const actualizarPaciente = async (id, datos) => {
  try {
    const db = await getDB();
    await db.runAsync(
      `UPDATE pacientes SET nombre=?, edad=?, genero=?, telefono=?,
       contacto_emergencia=?, tipo_sangre=?, alergias=?, notas_medicas=?, estado=?
       WHERE id=?`,
      [
        datos.nombre,
        parseInt(datos.edad) || 0,
        datos.genero,
        datos.telefono,
        datos.contacto_emergencia,
        datos.tipo_sangre,
        datos.alergias,
        datos.notas_medicas,
        datos.estado,
        id,
      ]
    );
    return { success: true };
  } catch (error) {
    return { success: false, mensaje: error.message };
  }
};

export const eliminarPaciente = async (id) => {
  try {
    const db = await getDB();
    await db.runAsync('DELETE FROM pacientes WHERE id = ?', [id]);
    return { success: true };
  } catch (error) {
    return { success: false, mensaje: error.message };
  }
};

export const getTotalPacientes = async () => {
  try {
    const db = await getDB();
    const result = await db.getFirstAsync('SELECT COUNT(*) as total FROM pacientes');
    return { success: true, total: result.total };
  } catch (error) {
    return { success: false, total: 0 };
  }
};