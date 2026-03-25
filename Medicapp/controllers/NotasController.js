// controllers/NotasController.js
import { getDB } from '../database/Database';

export const getNotas = async (pacienteId) => {
  try {
    const db = await getDB();
    const nota = await db.getFirstAsync(
      'SELECT * FROM notas_paciente WHERE paciente_id = ?', [pacienteId]
    );
    return { success: true, nota };
  } catch (error) {
    return { success: false, nota: null };
  }
};

export const guardarNotas = async (pacienteId, contenido) => {
  try {
    const db = await getDB();
    const existe = await db.getFirstAsync(
      'SELECT id FROM notas_paciente WHERE paciente_id = ?', [pacienteId]
    );
    const ahora = new Date().toISOString();
    if (existe) {
      await db.runAsync(
        'UPDATE notas_paciente SET contenido=?, updated_at=? WHERE paciente_id=?',
        [contenido, ahora, pacienteId]
      );
    } else {
      await db.runAsync(
        'INSERT INTO notas_paciente (paciente_id, contenido, updated_at) VALUES (?, ?, ?)',
        [pacienteId, contenido, ahora]
      );
    }
    return { success: true };
  } catch (error) {
    return { success: false, mensaje: error.message };
  }
};