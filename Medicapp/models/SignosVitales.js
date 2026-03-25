// models/SignosVitales.js

export const SignosVitalesSchema = {
  tabla: 'signos_vitales',
  campos: {
    id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
    paciente_id: 'INTEGER NOT NULL',
    fecha: 'TEXT NOT NULL',
    peso: 'REAL DEFAULT 0',
    presion: 'TEXT DEFAULT ""',
    frecuencia_cardiaca: 'INTEGER DEFAULT 0',
    temperatura: 'REAL DEFAULT 0',
    notas: 'TEXT DEFAULT ""',
    created_at: 'TEXT DEFAULT (datetime("now"))',
  },
};

export const crearSignosObj = (datos = {}) => ({
  id: datos.id || null,
  paciente_id: datos.paciente_id || null,
  fecha: datos.fecha || new Date().toISOString(),
  peso: parseFloat(datos.peso) || 0,
  presion: datos.presion || '',
  frecuencia_cardiaca: parseInt(datos.frecuencia_cardiaca) || 0,
  temperatura: parseFloat(datos.temperatura) || 0,
  notas: datos.notas || '',
});