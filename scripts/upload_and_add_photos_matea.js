import { ActividadTuristica, FotoActividad, sequelize } from '../models/index.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

/**
 * Script para subir fotos desde archivos locales y agregarlas a la actividad "Matea experience"
 * 
 * Uso:
 * 1. Coloca las imágenes en la carpeta: scripts/images/matea/
 * 2. Asegúrate de que los archivos se llamen: foto1.jpg, foto2.jpg, foto3.jpg (o .png)
 * 3. Ejecuta: node scripts/upload_and_add_photos_matea.js
 */

// Función para convertir imagen a base64
function imageToBase64(filePath) {
  try {
    const imageBuffer = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase().replace('.', '');
    const mimeTypes = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp'
    };
    const mimetype = mimeTypes[ext] || 'image/jpeg';
    const base64 = imageBuffer.toString('base64');
    return `data:${mimetype};base64,${base64}`;
  } catch (error) {
    console.error(`Error leyendo archivo ${filePath}:`, error.message);
    return null;
  }
}

async function uploadAndAddPhotosToMatea() {
  try {
    console.log('🚀 Iniciando proceso de subida de fotos a la actividad Matea...');

    // Ruta de la carpeta de imágenes
    const imagesDir = path.join(__dirname, 'images', 'matea');

    // Verificar si la carpeta existe
    if (!fs.existsSync(imagesDir)) {
      console.log(`📁 Creando carpeta: ${imagesDir}`);
      fs.mkdirSync(imagesDir, { recursive: true });
      console.log('⚠️  La carpeta está vacía. Por favor, agrega las imágenes:');
      console.log(`   - ${imagesDir}/foto1.jpg`);
      console.log(`   - ${imagesDir}/foto2.jpg`);
      console.log(`   - ${imagesDir}/foto3.jpg`);
      return;
    }

    // Leer archivos de imagen de la carpeta
    const files = fs.readdirSync(imagesDir)
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .sort();

    if (files.length === 0) {
      console.log('⚠️  No se encontraron imágenes en la carpeta:');
      console.log(`   ${imagesDir}`);
      console.log('\n💡 Por favor, agrega las imágenes en formato: jpg, jpeg, png, gif o webp');
      return;
    }

    console.log(`📷 Se encontraron ${files.length} imágenes:`);
    files.forEach((file, index) => {
      console.log(`   ${index + 1}. ${file}`);
    });

    // Convertir imágenes a base64
    const fotosUrls = [];
    for (const file of files) {
      const filePath = path.join(imagesDir, file);
      console.log(`\n📤 Procesando: ${file}...`);
      const dataUrl = imageToBase64(filePath);
      if (dataUrl) {
        fotosUrls.push(dataUrl);
        console.log(`   ✅ Convertida exitosamente (${Math.round(dataUrl.length / 1024)} KB)`);
      } else {
        console.log(`   ❌ Error al procesar ${file}`);
      }
    }

    if (fotosUrls.length === 0) {
      console.error('❌ No se pudieron procesar las imágenes');
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

    console.log(`\n✅ Actividad encontrada: ${actividad.nombre} (ID: ${actividad.id})`);

    // Eliminar fotos existentes (opcional)
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

    console.log(`\n✅ Se agregaron ${fotosUrls.length} fotos a la actividad "${actividad.nombre}"`);
    console.log('\n📋 Resumen:');
    files.forEach((file, index) => {
      console.log(`   ${index + 1}. ${file} ✅`);
    });

    // Verificar que se insertaron correctamente
    const fotosInsertadas = await FotoActividad.findAll({
      where: { actividadturistica_id: actividad.id },
      order: [['orden', 'ASC']]
    });

    console.log(`\n✅ Total de fotos en la actividad: ${fotosInsertadas.length}`);
    console.log('🎉 ¡Proceso completado exitosamente!');

  } catch (error) {
    console.error('❌ Error al procesar las fotos:', error.message);
    console.error('Detalles del error:', error);
  } finally {
    await sequelize.close();
    console.log('🔌 Conexión a la base de datos cerrada');
  }
}

// Ejecutar el script
uploadAndAddPhotosToMatea();

