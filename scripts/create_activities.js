import { ActividadTuristica, sequelize } from '../models/index.js';

async function createActivities() {
  try {
    console.log('🚀 Iniciando creación de actividades turísticas...');

    // Actividad 1: Matea experience
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
      user_id: null, // Puedes cambiar esto por un user_id específico si tienes usuarios
      is_active: true
    });

    console.log('✅ Actividad 1 creada:', actividad1.nombre);

    // Actividad 2: Tour por el Centro Histórico
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
      user_id: null, // Puedes cambiar esto por un user_id específico si tienes usuarios
      is_active: true
    });

    console.log('✅ Actividad 2 creada:', actividad2.nombre);

    console.log('🎉 ¡Todas las actividades han sido creadas exitosamente!');
    
    // Mostrar resumen
    console.log('\n📋 Resumen de actividades creadas:');
    console.log(`1. ${actividad1.nombre} - Precio: $${actividad1.precio} - Duración: ${actividad1.duracion} min`);
    console.log(`2. ${actividad2.nombre} - Precio: $${actividad2.precio} - Duración: ${actividad2.duracion} min`);

  } catch (error) {
    console.error('❌ Error al crear las actividades:', error.message);
    console.error('Detalles del error:', error);
  } finally {
    // Cerrar la conexión a la base de datos
    await sequelize.close();
    console.log('🔌 Conexión a la base de datos cerrada');
  }
}

// Ejecutar el script
createActivities();
