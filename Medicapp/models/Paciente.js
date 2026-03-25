// models/Paciente.js

export const PacienteSchema = {
  tabla: 'pacientes',
  campos: {
    id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
    nombre: 'TEXT NOT NULL',
    edad: 'INTEGER DEFAULT 0',
    genero: 'TEXT DEFAULT ""',
    telefono: 'TEXT DEFAULT ""',
    contacto_emergencia: 'TEXT DEFAULT ""',
    tipo_sangre: 'TEXT DEFAULT ""',
    alergias: 'TEXT DEFAULT ""',
    notas_medicas: 'TEXT DEFAULT ""',
    estado: 'TEXT DEFAULT "Activo"',
    created_at: 'TEXT DEFAULT (datetime("now"))',
  },
};

export const crearPacienteObj = (datos = {}) => ({
  id: datos.id || null,
  nombre: datos.nombre || '',
  edad: datos.edad || 0,
  genero: datos.genero || '',
  telefono: datos.telefono || '',
  contacto_emergencia: datos.contacto_emergencia || '',
  tipo_sangre: datos.tipo_sangre || '',
  alergias: datos.alergias || '',
  notas_medicas: datos.notas_medicas || '',
  estado: datos.estado || 'Activo',
  created_at: datos.created_at || new Date().toISOString(),
});

// Helper para obtener las iniciales del nombre
export const getInitials = (nombre = '') => {
  return nombre
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};