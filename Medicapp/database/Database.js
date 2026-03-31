import * as SQLite from 'expo-sqlite';

let db = null;

export const getDB = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('medicapp.db');
    await db.execAsync('PRAGMA journal_mode = WAL;');
    await db.execAsync('PRAGMA foreign_keys = ON;');
  }
  return db;
};

export const initDB = async () => {
  const database = await getDB();

  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      especialidad TEXT DEFAULT '',
      colegio TEXT DEFAULT '',
      centro_trabajo TEXT DEFAULT '',
      telefono TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS pacientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      edad INTEGER DEFAULT 0,
      genero TEXT DEFAULT '',
      telefono TEXT DEFAULT '',
      contacto_emergencia TEXT DEFAULT '',
      tipo_sangre TEXT DEFAULT '',
      alergias TEXT DEFAULT '',
      notas_medicas TEXT DEFAULT '',
      estado TEXT DEFAULT 'Activo',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS citas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      paciente_id INTEGER NOT NULL,
      doctor TEXT NOT NULL,
      fecha TEXT NOT NULL,
      hora TEXT NOT NULL,
      motivo TEXT DEFAULT '',
      notas TEXT DEFAULT '',
      estado TEXT DEFAULT 'Pendiente',
      recordatorio INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS signos_vitales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      paciente_id INTEGER NOT NULL,
      fecha TEXT NOT NULL,
      peso REAL DEFAULT 0,
      presion TEXT DEFAULT '',
      frecuencia_cardiaca INTEGER DEFAULT 0,
      temperatura REAL DEFAULT 0,
      notas TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS notas_paciente (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      paciente_id INTEGER NOT NULL UNIQUE,
      contenido TEXT DEFAULT '',
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE
    );
  `);

  
  const existeUser = await database.getFirstAsync(
    'SELECT id FROM usuarios WHERE email = ?', ['demo@clinica.com']
  );
  if (!existeUser) {
    await database.runAsync(
      `INSERT INTO usuarios (nombre, email, password, especialidad, colegio, centro_trabajo, telefono)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ['Dr. Carlos Méndez', 'demo@clinica.com', '123456',
       'Medicina General', 'CM-28-45678', 'Clínica San Rafael', '+52 612 345 678']
    );
  }

  
  const existePaciente = await database.getFirstAsync('SELECT id FROM pacientes LIMIT 1');
  if (!existePaciente) {
    const pacientesDemo = [
      ['María González', 45, 'Femenino', '+52 555 001 001', '+52 555 001 002', 'O+', 'Penicilina', 'Hipertensión controlada', 'Activo'],
      ['Juan López', 62, 'Masculino', '+52 555 002 001', '+52 555 002 002', 'A+', 'Ninguna', 'Diabetes tipo 2', 'Pendiente'],
      ['Ana Rodríguez', 28, 'Femenino', '+52 555 003 001', '+52 555 003 002', 'B+', 'Aspirina', '', 'Activo'],
      ['Carlos Martínez', 35, 'Masculino', '+52 555 004 001', '+52 555 004 002', 'AB-', 'Ninguna', '', 'Activo'],
      ['Laura Silva', 52, 'Femenino', '+52 555 005 001', '+52 555 005 002', 'O-', 'Ibuprofeno', 'Artritis', 'Urgente'],
    ];
    for (const p of pacientesDemo) {
      await database.runAsync(
        `INSERT INTO pacientes (nombre, edad, genero, telefono, contacto_emergencia,
         tipo_sangre, alergias, notas_medicas, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, p
      );
    }

    
    const hoy = new Date().toISOString().split('T')[0];
    const citasDemo = [
      [1, 'Dr. Martínez', hoy, '09:00', 'Consulta General', '', 'Confirmada', 1],
      [2, 'Dr. López', hoy, '10:30', 'Cardiología', '', 'Pendiente', 0],
      [3, 'Dr. García', hoy, '11:15', 'Pediatría', '', 'Confirmada', 1],
      [4, 'Dr. Ruiz', hoy, '14:00', 'Dermatología', '', 'Confirmada', 0],
      [5, 'Dr. Herrera', hoy, '15:30', 'Urgencia', '', 'Pendiente', 1],
    ];
    for (const c of citasDemo) {
      await database.runAsync(
        `INSERT INTO citas (paciente_id, doctor, fecha, hora, motivo, notas, estado, recordatorio)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, c
      );
    }

    await database.runAsync(
      `INSERT INTO signos_vitales (paciente_id, fecha, peso, presion, frecuencia_cardiaca, temperatura, notas)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [1, new Date().toISOString(), 68.5, '120/80', 72, 36.5, 'Paciente estable']
    );
  }

  console.log('✅ Base de datos Medicapp inicializada correctamente');
};