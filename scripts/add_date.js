import dotenv from 'dotenv';
import { sequelize, ActividadTuristica, FechasDisponiblesActividad } from '../models/index.js';

dotenv.config();

const run = async () => {
  try {
    await sequelize.authenticate();
    const actividad = await ActividadTuristica.findByPk(1);
    if (!actividad) {
      throw new Error('Actividad id 1 no existe');
    }
    const date = new Date();
    date.setDate(date.getDate() + 7);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const fecha = `${yyyy}-${mm}-${dd}`;

    const created = await FechasDisponiblesActividad.create({
      actividadturistica_id: actividad.id,
      fecha,
      hora_inicio: '10:00:00',
      hora_fin: '12:00:00',
      capacidad_disponible: 8,
    });
    console.log('Fecha creada:', created.id, fecha);
  } catch (err) {
    console.error('Add date failed:', err.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
};

run();


