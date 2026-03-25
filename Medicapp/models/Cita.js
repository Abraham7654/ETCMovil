// models/Cita.js

export const CitaSchema = {
  tabla: 'citas',
  campos: {
    id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
    paciente_id: 'INTEGER NOT NULL',
    doctor: 'TEXT NOT NULL',
    fecha: 'TEXT NOT NULL',
    hora: 'TEXT NOT NULL',
    motivo: 'TEXT DEFAULT ""',
    notas: 'TEXT DEFAULT ""',
    estado: 'TEXT DEFAULT "Pendiente"',
    recordatorio: 'INTEGER DEFAULT 0',
    created_at: 'TEXT DEFAULT (datetime("now"))',
  },
};

export const crearCitaObj = (datos = {}) => ({
  id: datos.id || null,
  paciente_id: datos.paciente_id || null,
  doctor: datos.doctor || '',
  fecha: datos.fecha || '',
  hora: datos.hora || '',
  motivo: datos.motivo || '',
  notas: datos.notas || '',
  estado: datos.estado || 'Pendiente',
  recordatorio: datos.recordatorio ? 1 : 0,
  created_at: datos.created_at || new Date().toISOString(),
});

// Obtener fecha de hoy en formato YYYY-MM-DD
export const getFechaHoy = () => new Date().toISOString().split('T')[0];

// Obtener fecha de mañana
export const getFechaManana = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
};

// Obtener fecha límite para "esta semana"
export const getFechaFinSemana = () => {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().split('T')[0];
};