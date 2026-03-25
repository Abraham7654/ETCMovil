// controllers/CitaController.js
import { getDB } from '../database/Database';
import { getFechaHoy, getFechaManana, getFechaFinSemana } from '../models/Cita';

export const getCitas = async (filtro = 'hoy') => {
  try {
    const db = await getDB();
    const hoy = getFechaHoy();
    const manana = getFechaManana();
    const finSemana = getFechaFinSemana();

    let whereClause = '';
    if (filtro === 'Hoy') whereClause = `WHERE c.fecha = '${hoy}'`;
    else if (filtro === 'Mañana') whereClause = `WHERE c.fecha = '${manana}'`;
    else if (filtro === 'Esta Semana') whereClause = `WHERE c.fecha BETWEEN '${hoy}' AND '${finSemana}'`;

    const citas = await db.getAllAsync(`
      SELECT c.*, p.nombre as paciente_nombre, p.telefono as paciente_telefono
      FROM citas c
      INNER JOIN pacientes p ON c.paciente_id = p.id
      ${whereClause}
      ORDER BY c.fecha ASC, c.hora ASC
    `);
    return { success: true, citas };
  } catch (error) {
    return { success: false, mensaje: error.message, citas: [] };
  }
};

export const getCitasPaciente = async (pacienteId) => {
  try {
    const db = await getDB();
    const citas = await db.getAllAsync(
      `SELECT c.*, p.nombre as paciente_nombre
       FROM citas c INNER JOIN pacientes p ON c.paciente_id = p.id
       WHERE c.paciente_id = ? ORDER BY c.fecha DESC, c.hora DESC`,
      [pacienteId]
    );
    return { success: true, citas };
  } catch (error) {
    return { success: false, mensaje: error.message, citas: [] };
  }
};

export const getCita = async (id) => {
  try {
    const db = await getDB();
    const cita = await db.getFirstAsync(
      `SELECT c.*, p.nombre as paciente_nombre
       FROM citas c INNER JOIN pacientes p ON c.paciente_id = p.id
       WHERE c.id = ?`, [id]
    );
    return { success: true, cita };
  } catch (error) {
    return { success: false, mensaje: error.message };
  }
};

export const crearCita = async (datos) => {
  try {
    const db = await getDB();
    const result = await db.runAsync(
      `INSERT INTO citas (paciente_id, doctor, fecha, hora, motivo, notas, estado, recordatorio)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        datos.paciente_id,
        datos.doctor.trim(),
        datos.fecha,
        datos.hora,
        datos.motivo || '',
        datos.notas || '',
        datos.estado || 'Pendiente',
        datos.recordatorio ? 1 : 0,
      ]
    );
    return { success: true, id: result.lastInsertRowId };
  } catch (error) {
    return { success: false, mensaje: error.message };
  }
};

export const actualizarEstadoCita = async (id, estado) => {
  try {
    const db = await getDB();
    await db.runAsync('UPDATE citas SET estado=? WHERE id=?', [estado, id]);
    return { success: true };
  } catch (error) {
    return { success: false, mensaje: error.message };
  }
};

export const cancelarCita = async (id) => {
  return actualizarEstadoCita(id, 'Cancelada');
};

export const confirmarCita = async (id) => {
  return actualizarEstadoCita(id, 'Confirmada');
};

export const eliminarCita = async (id) => {
  try {
    const db = await getDB();
    await db.runAsync('DELETE FROM citas WHERE id = ?', [id]);
    return { success: true };
  } catch (error) {
    return { success: false, mensaje: error.message };
  }
};

export const getResumenCitas = async () => {
  try {
    const db = await getDB();
    const hoy = getFechaHoy();
    const total = await db.getFirstAsync(
      "SELECT COUNT(*) as c FROM citas WHERE fecha = ?", [hoy]
    );
    const confirmadas = await db.getFirstAsync(
      "SELECT COUNT(*) as c FROM citas WHERE fecha = ? AND estado = 'Confirmada'", [hoy]
    );
    const pendientes = await db.getFirstAsync(
      "SELECT COUNT(*) as c FROM citas WHERE fecha = ? AND estado = 'Pendiente'", [hoy]
    );
    return {
      success: true,
      total: total?.c || 0,
      confirmadas: confirmadas?.c || 0,
      pendientes: pendientes?.c || 0,
    };
  } catch (error) {
    return { success: false, total: 0, confirmadas: 0, pendientes: 0 };
  }
};