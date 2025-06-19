const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
app.use(express.json());

// Conexión y creación de tablas
const db = new sqlite3.Database('./app.db', (err) => {
  if (err) console.error('DB connection error:', err.message);
  else console.log('Conectado a SQLite');
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS Usuario (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      apellido TEXT NOT NULL,
      mail TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS actividadTuristica (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rating REAL,
      categoria TEXT,
      direccion TEXT,
      nombre TEXT NOT NULL,
      descripcion TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Favoritos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      actividadTuristicaId INTEGER NOT NULL,
      FOREIGN KEY(userId) REFERENCES Usuario(id) ON DELETE CASCADE,
      FOREIGN KEY(actividadTuristicaId) REFERENCES actividadTuristica(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS mapa (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      coordenadas TEXT NOT NULL,
      userId INTEGER NOT NULL,
      FOREIGN KEY(userId) REFERENCES Usuario(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS itinerario (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      actividadTuristicaId INTEGER NOT NULL,
      FOREIGN KEY(userId) REFERENCES Usuario(id) ON DELETE CASCADE,
      FOREIGN KEY(actividadTuristicaId) REFERENCES actividadTuristica(id) ON DELETE CASCADE
    )
  `);
});