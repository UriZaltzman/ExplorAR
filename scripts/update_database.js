import { sequelize } from '../models/index.js';

async function updateDatabase() {
  try {
    console.log('🚀 Iniciando actualización de la base de datos...');

    // 1. Eliminar columnas de coordenadas de la tabla restaurante
    console.log('📝 Eliminando columnas de coordenadas de restaurante...');
    await sequelize.query('ALTER TABLE restaurante DROP COLUMN IF EXISTS coordenadas_lat;');
    await sequelize.query('ALTER TABLE restaurante DROP COLUMN IF EXISTS coordenadas_lng;');

    // 2. Agregar columna google_maps_link a la tabla restaurante
    console.log('📝 Agregando google_maps_link a restaurante...');
    await sequelize.query('ALTER TABLE restaurante ADD COLUMN google_maps_link TEXT;');

    // 3. Eliminar columnas de coordenadas de la tabla actividadturistica
    console.log('📝 Eliminando columnas de coordenadas de actividadturistica...');
    await sequelize.query('ALTER TABLE actividadturistica DROP COLUMN IF EXISTS coordenadas_lat;');
    await sequelize.query('ALTER TABLE actividadturistica DROP COLUMN IF EXISTS coordenadas_lng;');

    // 4. Agregar columna google_maps_link a la tabla actividadturistica
    console.log('📝 Agregando google_maps_link a actividadturistica...');
    await sequelize.query('ALTER TABLE actividadturistica ADD COLUMN google_maps_link TEXT;');

    // 5. Eliminar la columna seña de ambas tablas
    console.log('📝 Eliminando columna seña de restaurante...');
    await sequelize.query('ALTER TABLE restaurante DROP COLUMN IF EXISTS seña;');
    
    console.log('📝 Eliminando columna seña de actividadturistica...');
    await sequelize.query('ALTER TABLE actividadturistica DROP COLUMN IF EXISTS seña;');

    console.log('✅ ¡Base de datos actualizada exitosamente!');
    console.log('🎉 Ahora puedes ejecutar el script de creación de actividades');

  } catch (error) {
    console.error('❌ Error al actualizar la base de datos:', error.message);
    console.error('Detalles del error:', error);
  } finally {
    // Cerrar la conexión a la base de datos
    await sequelize.close();
    console.log('🔌 Conexión a la base de datos cerrada');
  }
}

// Ejecutar el script
updateDatabase();
