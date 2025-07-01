   const express = require('express');
     const cors = require('cors');
     const app = express();
     const port = 3000;

     app.use(cors());
     app.use(express.json()); 

     // -------- RUTAS USUARIO --------
app.get('/Usuario', (req, res) => {
  db.all('SELECT * FROM Usuario', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/Usuario/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM Usuario WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json(row);
  });
});

app.post('/Usuario', (req, res) => {
  const { nombre, apellido, mail, password } = req.body;
  if (!nombre || !apellido || !mail || !password) {
    return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
  }
  db.run(
    'INSERT INTO Usuario (nombre, apellido, mail, password) VALUES (?, ?, ?, ?)',
    [nombre, apellido, mail, password],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, nombre, apellido, mail });
    }
  );
});

app.put('/Usuario/:id', (req, res) => {
  const id = req.params.id;
  const { nombre, apellido, mail, password } = req.body;
  if (!nombre || !apellido || !mail || !password) {
    return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
  }
  db.run(
    'UPDATE Usuario SET nombre = ?, apellido = ?, mail = ?, password = ? WHERE id = ?',
    [nombre, apellido, mail, password, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      res.json({ id, nombre, apellido, mail });
    }
  );
});

app.delete('/Usuario/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM Usuario WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.status(204).send();
  });
});

// -------- RUTAS actividadTuristica --------
app.get('/actividadTuristica', (req, res) => {
  db.all('SELECT * FROM actividadTuristica', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/actividadTuristica', (req, res) => {
  const { rating, categoria, direccion, nombre, descripcion } = req.body;
  if (!nombre) return res.status(400).json({ mensaje: 'Falta el nombre' });
  db.run(
    'INSERT INTO actividadTuristica (rating, categoria, direccion, nombre, descripcion) VALUES (?, ?, ?, ?, ?)',
    [rating, categoria, direccion, nombre, descripcion],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, rating, categoria, direccion, nombre, descripcion });
    }
  );
});

// -------- RUTAS Favoritos --------
app.get('/Favoritos', (req, res) => {
  db.all('SELECT * FROM Favoritos', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/Favoritos', (req, res) => {
  const { userId, actividadTuristicaId } = req.body;
  if (!userId || !actividadTuristicaId) {
    return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
  }
  db.run(
    'INSERT INTO Favoritos (userId, actividadTuristicaId) VALUES (?, ?)',
    [userId, actividadTuristicaId],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, userId, actividadTuristicaId });
    }
  );
});

// -------- RUTAS mapa --------
app.get('/mapa', (req, res) => {
  db.all('SELECT * FROM mapa', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/mapa', (req, res) => {
  const { coordenadas, userId } = req.body;
  if (!coordenadas || !userId) {
    return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
  }
  db.run(
    'INSERT INTO mapa (coordenadas, userId) VALUES (?, ?)',
    [coordenadas, userId],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, coordenadas, userId });
    }
  );
});

// -------- RUTAS itinerario --------
app.get('/itinerario', (req, res) => {
  db.all('SELECT * FROM itinerario', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/itinerario', (req, res) => {
  const { userId, actividadTuristicaId } = req.body;
  if (!userId || !actividadTuristicaId) {
    return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
  }
  db.run(
    'INSERT INTO itinerario (userId, actividadTuristicaId) VALUES (?, ?)',
    [userId, actividadTuristicaId],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, userId, actividadTuristicaId });
    }
  );
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});