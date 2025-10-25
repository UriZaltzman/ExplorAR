import { ActividadTuristica, Restaurante, sequelize } from '../models/index.js';

async function insertProductionData() {
  try {
    console.log('🚀 Iniciando inserción de datos en base de datos de producción...');

    // Verificar conexión a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente');

    // Sincronizar modelos
    await sequelize.sync({ force: false });
    console.log('✅ Modelos sincronizados correctamente');

    // Verificar si las actividades ya existen
    const existingActivities = await ActividadTuristica.findAll({
      where: {
        nombre: ['Matea experience', 'Tour por el Centro Histórico']
      }
    });

    if (existingActivities.length > 0) {
      console.log('ℹ️ Las actividades ya existen en la base de datos');
      console.log('Actividades encontradas:', existingActivities.map(a => a.nombre));
    } else {
      // Crear actividades
      console.log('📝 Creando actividades...');
      
      const actividad1 = await ActividadTuristica.create({
        nombre: "Matea experience",
        descripcion: "Aprende a todo acerca del mate en la primera boutique de mate en Argentina",
        duracion: 80,
        direccion: "Ayacucho 1538",
        contacto: "08003456283",
        google_maps_link: "https://www.google.com/maps/place/Matea,+Aromas+y+Sabores+-+Mate+Bar+%26+Boutique/@-34.5914656,-58.3942945,19.88z/data=!4m6!3m5!1s0x95a2e701c3959a71:0xcf220e8dba0609f8!8m2!3d-34.591453!4d-58.3937117!16s%2Fg%2F11f7gdm3w6?entry=ttu&g_ep=EgoyMDI1MTAyMC4wIKXMDSoASAFQAw%3D%3D",
        precio: 150000.00,
        categoria_id: 1,
        max_capacity: 8,
        user_id: null,
        is_active: true
      });

      const actividad2 = await ActividadTuristica.create({
        nombre: "Tour por el Centro Histórico",
        descripcion: "Recorrido guiado por los principales monumentos del centro de Buenos Aires",
        duracion: 180,
        direccion: "Plaza de Mayo, CABA",
        contacto: "+54 11 1234-5678",
        google_maps_link: "https://maps.google.com/maps?q=Plaza+de+Mayo+Buenos+Aires",
        precio: 2500.00,
        categoria_id: 2,
        max_capacity: 15,
        user_id: null,
        is_active: true
      });

      console.log('✅ Actividades creadas exitosamente');
    }

    // Verificar si los restaurantes ya existen
    const existingRestaurants = await Restaurante.findAll({
      where: {
        nombre: ['La Parrilla del Centro', 'Café Tortoni']
      }
    });

    if (existingRestaurants.length > 0) {
      console.log('ℹ️ Los restaurantes ya existen en la base de datos');
      console.log('Restaurantes encontrados:', existingRestaurants.map(r => r.nombre));
    } else {
      // Crear restaurantes
      console.log('📝 Creando restaurantes...');
      
      const restaurante1 = await Restaurante.create({
        nombre: "La Parrilla del Centro",
        descripcion: "Restaurante especializado en carnes argentinas con ambiente tradicional",
        direccion: "Av. 9 de Julio 1234, CABA",
        contacto: "+54 11 5555-1234",
        google_maps_link: "https://maps.google.com/maps?q=Av+9+de+Julio+1234+Buenos+Aires",
        precio: 3500.00,
        categoria_id: 3,
        max_capacity: 50,
        user_id: null,
        is_active: true
      });

      const restaurante2 = await Restaurante.create({
        nombre: "Café Tortoni",
        descripcion: "Histórico café porteño con ambiente tradicional y espectáculos de tango",
        direccion: "Av. de Mayo 825, CABA",
        contacto: "+54 11 4342-4328",
        google_maps_link: "https://maps.google.com/maps?q=Cafe+Tortoni+Buenos+Aires",
        precio: 1200.00,
        categoria_id: 4,
        max_capacity: 30,
        user_id: null,
        is_active: true
      });

      console.log('✅ Restaurantes creados exitosamente');
    }

    // Mostrar resumen final
    const totalActivities = await ActividadTuristica.count();
    const totalRestaurants = await Restaurante.count();

    console.log('\n🎉 ¡Datos insertados exitosamente en la base de datos de producción!');
    console.log(`📊 Resumen:`);
    console.log(`   - Actividades totales: ${totalActivities}`);
    console.log(`   - Restaurantes totales: ${totalRestaurants}`);
    console.log(`   - API disponible en: https://explor-ar-urizaltzmans-projects.vercel.app/api`);

  } catch (error) {
    console.error('❌ Error al insertar datos en producción:', error.message);
    console.error('Detalles del error:', error);
  } finally {
    // Cerrar la conexión a la base de datos
    await sequelize.close();
    console.log('🔌 Conexión a la base de datos cerrada');
  }
}

// Ejecutar el script
insertProductionData();
