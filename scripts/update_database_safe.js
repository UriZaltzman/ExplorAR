import { sequelize } from '../models/index.js';

async function updateDatabaseSafe() {
  try {
    console.log('🚀 Iniciando actualización segura de la base de datos...');

    // Verificar y eliminar columnas de coordenadas de restaurante
    console.log('📝 Verificando columnas de coordenadas en restaurante...');
    try {
      await sequelize.query('ALTER TABLE restaurante DROP COLUMN IF EXISTS coordenadas_lat;');
      await sequelize.query('ALTER TABLE restaurante DROP COLUMN IF EXISTS coordenadas_lng;');
      console.log('✅ Columnas de coordenadas eliminadas de restaurante');
    } catch (error) {
      console.log('ℹ️ Columnas de coordenadas ya eliminadas o no existen en restaurante');
    }

    // Verificar y agregar google_maps_link a restaurante
    console.log('📝 Verificando google_maps_link en restaurante...');
    try {
      await sequelize.query('ALTER TABLE restaurante ADD COLUMN google_maps_link TEXT;');
      console.log('✅ google_maps_link agregado a restaurante');
    } catch (error) {
      console.log('ℹ️ google_maps_link ya existe en restaurante');
    }

    // Verificar y eliminar columnas de coordenadas de actividadturistica
    console.log('📝 Verificando columnas de coordenadas en actividadturistica...');
    try {
      await sequelize.query('ALTER TABLE actividadturistica DROP COLUMN IF EXISTS coordenadas_lat;');
      await sequelize.query('ALTER TABLE actividadturistica DROP COLUMN IF EXISTS coordenadas_lng;');
      console.log('✅ Columnas de coordenadas eliminadas de actividadturistica');
    } catch (error) {
      console.log('ℹ️ Columnas de coordenadas ya eliminadas o no existen en actividadturistica');
    }

    // Verificar y agregar google_maps_link a actividadturistica
    console.log('📝 Verificando google_maps_link en actividadturistica...');
    try {
      await sequelize.query('ALTER TABLE actividadturistica ADD COLUMN google_maps_link TEXT;');
      console.log('✅ google_maps_link agregado a actividadturistica');
    } catch (error) {
      console.log('ℹ️ google_maps_link ya existe en actividadturistica');
    }

    // Eliminar columna seña de restaurante
    console.log('📝 Eliminando columna seña de restaurante...');
    try {
      await sequelize.query('ALTER TABLE restaurante DROP COLUMN IF EXISTS seña;');
      console.log('✅ Columna seña eliminada de restaurante');
    } catch (error) {
      console.log('ℹ️ Columna seña ya eliminada o no existe en restaurante');
    }

    // Eliminar columna seña de actividadturistica
    console.log('📝 Eliminando columna seña de actividadturistica...');
    try {
      await sequelize.query('ALTER TABLE actividadturistica DROP COLUMN IF EXISTS seña;');
      console.log('✅ Columna seña eliminada de actividadturistica');
    } catch (error) {
      console.log('ℹ️ Columna seña ya eliminada o no existe en actividadturistica');
    }

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
updateDatabaseSafe();
