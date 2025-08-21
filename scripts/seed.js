import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { sequelize, User, Categoria, ActividadTuristica, FotoActividad } from '../models/index.js';

dotenv.config();

const ensureAdmin = async () => {
  const adminEmail = 'admin@gmail.com';
  let admin = await User.findOne({ where: { email: adminEmail } });
  if (!admin) {
    const hashed = await bcrypt.hash('AdminPass123', 10);
    admin = await User.create({
      nombre: 'Admin',
      apellido: 'User',
      email: adminEmail,
      password: hashed,
      dni: '99999999',
      role: 'admin',
      is_email_verified: true,
    });
  }
  return admin;
};

const ensureCategory = async () => {
  let categoria = await Categoria.findOne({ where: { nombre: 'Aventura', tipo: 'actividad' } });
  if (!categoria) {
    categoria = await Categoria.create({ nombre: 'Aventura', tipo: 'actividad' });
  }
  return categoria;
};

const ensureActivity = async (admin, categoria) => {
  let actividad = await ActividadTuristica.findOne({ where: { nombre: 'Matea Experience' } });
  if (!actividad) {
    actividad = await ActividadTuristica.create({
      nombre: 'Matea Experience',
      descripcion: 'Experiencia única de mate en Buenos Aires',
      duracion: 120,
      direccion: 'Av. Corrientes 1234',
      contacto: '+54 11 1234-5678',
      coordenadas_lat: -34.6037,
      coordenadas_lng: -58.3816,
      precio: 2500.0,
      seña: 500.0,
      categoria_id: categoria.id,
      user_id: admin.id,
      max_capacity: 10,
    });
    await FotoActividad.create({ actividadturistica_id: actividad.id, url: 'https://picsum.photos/seed/matea/800/600', orden: 0 });
  }
  return actividad;
};

const run = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });

    const admin = await ensureAdmin();
    const categoria = await ensureCategory();
    const actividad = await ensureActivity(admin, categoria);

    console.log('Seed completed:', {
      admin: { id: admin.id, email: admin.email },
      categoria: { id: categoria.id, nombre: categoria.nombre },
      actividad: { id: actividad.id, nombre: actividad.nombre },
    });
  } catch (err) {
    console.error('Seed failed:', err);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
};

run();


