const express = require('express');
const app = express();
app.use(express.json());

let datos = [];
let idCounter = 1;

// Obtener todos los usuarios
app.get('/Usuario', (req, res) => {
  res.json(datos);
});

// Obtener un usuario por ID
app.get('/Usuario/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const item = datos.find(item => item.id === id);

  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ mensaje: 'Usuario no encontrado' });
  }
});

// Crear un nuevo usuario
app.post('/Usuario', (req, res) => {
  const { nombre, apellido, mail, password } = req.body;

  if (!nombre || !apellido || !mail || !password) {
    return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
  }

  const nuevoUsuario = {
    id: idCounter++,
    nombre,
    apellido,
    mail,
    password,
  };

  datos.push(nuevoUsuario);
  res.status(201).json(nuevoUsuario);
});

// Actualizar un usuario existente por ID
app.put('/Usuario/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = datos.findIndex(item => item.id === id);

  if (index === -1) {
    return res.status(404).json({ mensaje: 'Usuario no encontrado' });
  }

  const { nombre, apellido, mail, password } = req.body;

  // Validar campos
  datos[index] = {
    id,
    nombre: nombre || datos[index].nombre,
    apellido: apellido || datos[index].apellido,
    mail: mail || datos[index].mail,
    password: password || datos[index].password,
  };

  res.json(datos[index]);
});

// Eliminar un usuario por ID
app.delete('/Usuario/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const lengthBefore = datos.length;
  datos = datos.filter(item => item.id !== id);

  if (datos.length === lengthBefore) {
    return res.status(404).json({ mensaje: 'Usuario no encontrado' });
  }

  res.status(204).send();
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
