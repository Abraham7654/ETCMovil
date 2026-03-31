import { getDB } from '../database/Database';

export const getSignosVitales = async (pacienteId) => {
  try {
    const db = await getDB();
    const signos = await db.getAllAsync(
      'SELECT * FROM signos_vitales WHERE paciente_id = ? ORDER BY fecha DESC',
      [pacienteId]
    );
    return { success: true, signos };
  } catch (error) {
    return { success: false, mensaje: error.message, signos: [] };
  }
};

export const getUltimosSignos = async (pacienteId) => {
  try {
    const db = await getDB();
    const signos = await db.getFirstAsync(
      'SELECT * FROM signos_vitales WHERE paciente_id = ? ORDER BY fecha DESC LIMIT 1',
      [pacienteId]
    );
    return { success: true, signos };
  } catch (error) {
    return { success: false, signos: null };
  }
};

export const guardarSignosVitales = async (datos) => {
  try {
    const db = await getDB();
    const result = await db.runAsync(
      `INSERT INTO signos_vitales 
       (paciente_id, fecha, peso, presion, frecuencia_cardiaca, temperatura, notas) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        datos.paciente_id,
        datos.fecha || new Date().toISOString(),
        parseFloat(datos.peso) || 0,
        datos.presion || '',
        parseInt(datos.frecuencia_cardiaca) || 0,
        parseFloat(datos.temperatura) || 0,
        datos.notas || '',
      ]
    );
    return { success: true, id: result.lastInsertRowId };
  } catch (error) {
    return { success: false, mensaje: error.message };
  }
};

export const eliminarSignos = async (id) => {
  try {
    const db = await getDB();
    await db.runAsync('DELETE FROM signos_vitales WHERE id = ?', [id]);
    return { success: true };
  } catch (error) {
    return { success: false, mensaje: error.message };
  }
};