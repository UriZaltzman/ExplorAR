import { ActividadTuristica, FotoActividad, sequelize } from '../models/index.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Script para agregar fotos a la actividad "Matea experience" usando URLs
 * 
 * Uso:
 * 1. Modifica el array 'fotosUrls' abajo con las URLs de las fotos
 * 2. Ejecuta: node scripts/add_matea_photos_from_urls.js
 * 
 * Las URLs pueden ser:
 * - URLs externas: 'https://ejemplo.com/imagen.jpg'
 * - Data URLs base64: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...'
 */

async function addPhotosToMateaFromUrls() {
  try {
    console.log('🚀 Iniciando agregado de fotos a la actividad Matea...\n');

    // ⬇️ AQUÍ AGREGA LAS URLs DE LAS 3 FOTOS ⬇️
    const fotosUrls = [
      // Ejemplo con URL externa:
      // 'https://ejemplo.com/matea1.jpg',
      
      // Ejemplo con data URL (base64):
      // 'data:image/jpeg;base64,/9j/4AAQSkZJRg...',
      
      // Agrega las 3 URLs aquí:
      'URL_FOTO_1',
      'URL_FOTO_2',
      'URL_FOTO_3'
    ];

    // Validar que se hayan agregado URLs
    if (fotosUrls.some(url => url.startsWith('URL_FOTO'))) {
      console.log('⚠️  Por favor, reemplaza las URLs de ejemplo con las URLs reales de las fotos');
      console.log('\n📝 Opciones para obtener las URLs:');
      console.log('   1. Subir las imágenes usando el endpoint: POST /api/upload/multiple');
      console.log('   2. Usar URLs externas de servicios como Imgur, Cloudinary, etc.');
      console.log('   3. Convertir las imágenes a base64 y usar data URLs');
      console.log('\n💡 Ejemplo de uso del endpoint de subida:');
      console.log('   curl -X POST https://tu-api.com/api/upload/multiple \\');
      console.log('     -H "Authorization: Bearer TU_TOKEN" \\');
      console.log('     -F "images=@foto1.jpg" \\');
      console.log('     -F "images=@foto2.jpg" \\');
      console.log('     -F "images=@foto3.jpg"');
      return;
    }

    console.log(`📷 URLs a agregar: ${fotosUrls.length}`);
    fotosUrls.forEach((url, index) => {
      const preview = url.length > 60 ? url.substring(0, 60) + '...' : url;
      console.log(`   ${index + 1}. ${preview}`);
    });

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
      console.error('\n❌ No se encontró la actividad "Matea experience"');
      console.log('💡 Asegúrate de que la actividad existe en la base de datos');
      console.log('   Puedes verificarlo ejecutando: SELECT * FROM actividadturistica WHERE nombre ILIKE \'%matea%\';');
      return;
    }

    console.log(`\n✅ Actividad encontrada: ${actividad.nombre} (ID: ${actividad.id})`);

    // Contar fotos existentes
    const fotosExistentes = await FotoActividad.count({
      where: { actividadturistica_id: actividad.id }
    });

    if (fotosExistentes > 0) {
      console.log(`📷 Se encontraron ${fotosExistentes} fotos existentes`);
      console.log('🔄 Eliminando fotos existentes para reemplazarlas...');
      await FotoActividad.destroy({
        where: { actividadturistica_id: actividad.id }
      });
      console.log('✅ Fotos existentes eliminadas');
    }

    // Crear las nuevas fotos
    console.log('\n📤 Agregando nuevas fotos...');
    const fotosData = fotosUrls.map((url, index) => ({
      actividadturistica_id: actividad.id,
      url: url.trim(),
      orden: index
    }));

    await FotoActividad.bulkCreate(fotosData);

    console.log(`\n✅ Se agregaron ${fotosUrls.length} fotos a la actividad "${actividad.nombre}"`);

    // Verificar que se insertaron correctamente
    const fotosInsertadas = await FotoActividad.findAll({
      where: { actividadturistica_id: actividad.id },
      order: [['orden', 'ASC']],
      attributes: ['id', 'url', 'orden']
    });

    console.log(`\n✅ Total de fotos en la actividad: ${fotosInsertadas.length}`);
    console.log('\n📋 Fotos agregadas exitosamente:');
    fotosInsertadas.forEach((foto, index) => {
      const urlPreview = foto.url.length > 80 ? foto.url.substring(0, 80) + '...' : foto.url;
      console.log(`   ${index + 1}. Orden ${foto.orden}: ${urlPreview}`);
    });

    console.log('\n🎉 ¡Proceso completado exitosamente!');

  } catch (error) {
    console.error('\n❌ Error al agregar fotos:', error.message);
    console.error('Detalles del error:', error);
  } finally {
    await sequelize.close();
    console.log('\n🔌 Conexión a la base de datos cerrada');
  }
}

// Ejecutar el script
addPhotosToMateaFromUrls();

