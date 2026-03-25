// models/Usuario.js
// Define la estructura del modelo Usuario

export const UsuarioSchema = {
  tabla: 'usuarios',
  campos: {
    id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
    nombre: 'TEXT NOT NULL',
    email: 'TEXT UNIQUE NOT NULL',
    password: 'TEXT NOT NULL',
    especialidad: 'TEXT DEFAULT ""',
    colegio: 'TEXT DEFAULT ""',
    centro_trabajo: 'TEXT DEFAULT ""',
    telefono: 'TEXT DEFAULT ""',
    created_at: 'TEXT DEFAULT (datetime("now"))',
  },
};

export const crearUsuarioObj = (datos = {}) => ({
  id: datos.id || null,
  nombre: datos.nombre || '',
  email: datos.email || '',
  password: datos.password || '',
  especialidad: datos.especialidad || '',
  colegio: datos.colegio || '',
  centro_trabajo: datos.centro_trabajo || '',
  telefono: datos.telefono || '',
  created_at: datos.created_at || new Date().toISOString(),
});