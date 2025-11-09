import { ActividadTuristica, FotoActividad, sequelize } from '../models/index.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Script para agregar fotos a la actividad "Matea experience"
 * 
 * Uso:
 * 1. Sube las imágenes usando el endpoint POST /api/upload/multiple
 * 2. Copia las URLs devueltas
 * 3. Modifica el array 'fotosUrls' en este script con las URLs
 * 4. Ejecuta: node scripts/add_photos_to_matea.js
 */

async function addPhotosToMatea() {
  try {
    console.log('🚀 Iniciando agregado de fotos a la actividad Matea...');

    // URLs de las fotos (reemplazar con las URLs reales después de subirlas)
    const fotosUrls = [
      // Ejemplo: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...'
      // O URLs externas: 'https://ejemplo.com/imagen1.jpg'
      // Agrega aquí las 3 URLs de las fotos
    ];

    if (fotosUrls.length === 0) {
      console.log('⚠️  Por favor, agrega las URLs de las fotos en el array fotosUrls');
      console.log('📝 Puedes obtener las URLs subiendo las imágenes a:');
      console.log('   POST /api/upload/multiple (requiere token)');
      console.log('   O proporciona URLs externas directamente');
      return;
    }

    // Buscar la actividad "Matea experience"
    const { Op } = await import('sequelize');
    const actividad = await ActividadTuristica.findOne({
      where: {
        nombre: {
          [Op.iLike]: '%matea%'
        }
      }
    });

    if (!actividad) {
      console.error('❌ No se encontró la actividad "Matea experience"');
      console.log('💡 Asegúrate de que la actividad existe en la base de datos');
      return;
    }

    console.log(`✅ Actividad encontrada: ${actividad.nombre} (ID: ${actividad.id})`);

    // Eliminar fotos existentes (opcional - comentar si quieres mantener las existentes)
    const fotosExistentes = await FotoActividad.count({
      where: { actividadturistica_id: actividad.id }
    });

    if (fotosExistentes > 0) {
      console.log(`📷 Se encontraron ${fotosExistentes} fotos existentes`);
      console.log('🔄 Eliminando fotos existentes...');
      await FotoActividad.destroy({
        where: { actividadturistica_id: actividad.id }
      });
    }

    // Crear las nuevas fotos
    const fotosData = fotosUrls.map((url, index) => ({
      actividadturistica_id: actividad.id,
      url: url,
      orden: index
    }));

    await FotoActividad.bulkCreate(fotosData);

    console.log(`✅ Se agregaron ${fotosUrls.length} fotos a la actividad "${actividad.nombre}"`);
    console.log('\n📋 Fotos agregadas:');
    fotosUrls.forEach((url, index) => {
      const preview = url.substring(0, 50) + '...';
      console.log(`   ${index + 1}. ${preview}`);
    });

    // Verificar que se insertaron correctamente
    const fotosInsertadas = await FotoActividad.findAll({
      where: { actividadturistica_id: actividad.id },
      order: [['orden', 'ASC']]
    });

    console.log(`\n✅ Total de fotos en la actividad: ${fotosInsertadas.length}`);

  } catch (error) {
    console.error('❌ Error al agregar fotos:', error.message);
    console.error('Detalles del error:', error);
  } finally {
    await sequelize.close();
    console.log('🔌 Conexión a la base de datos cerrada');
  }
}

// Ejecutar el script
addPhotosToMatea();

