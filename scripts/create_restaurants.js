import { Restaurante, sequelize } from '../models/index.js';

async function createRestaurants() {
  try {
    console.log('🚀 Iniciando creación de restaurantes...');

    // Restaurante 1: La Parrilla del Centro
    const restaurante1 = await Restaurante.create({
      nombre: "La Parrilla del Centro",
      descripcion: "Restaurante especializado en carnes argentinas con ambiente tradicional",
      direccion: "Av. 9 de Julio 1234, CABA",
      contacto: "+54 11 5555-1234",
      google_maps_link: "https://maps.google.com/maps?q=Av+9+de+Julio+1234+Buenos+Aires",
      precio: 3500.00,
      categoria_id: 3,
      max_capacity: 50,
      user_id: null, // Puedes cambiar esto por un user_id específico si tienes usuarios
      is_active: true
    });

    console.log('✅ Restaurante 1 creado:', restaurante1.nombre);

    // Restaurante 2: Café Tortoni
    const restaurante2 = await Restaurante.create({
      nombre: "Café Tortoni",
      descripcion: "Histórico café porteño con ambiente tradicional y espectáculos de tango",
      direccion: "Av. de Mayo 825, CABA",
      contacto: "+54 11 4342-4328",
      google_maps_link: "https://maps.google.com/maps?q=Cafe+Tortoni+Buenos+Aires",
      precio: 1200.00,
      categoria_id: 4,
      max_capacity: 30,
      user_id: null, // Puedes cambiar esto por un user_id específico si tienes usuarios
      is_active: true
    });

    console.log('✅ Restaurante 2 creado:', restaurante2.nombre);

    console.log('🎉 ¡Todos los restaurantes han sido creados exitosamente!');
    
    // Mostrar resumen
    console.log('\n📋 Resumen de restaurantes creados:');
    console.log(`1. ${restaurante1.nombre} - Precio: $${restaurante1.precio} - Capacidad: ${restaurante1.max_capacity} personas`);
    console.log(`2. ${restaurante2.nombre} - Precio: $${restaurante2.precio} - Capacidad: ${restaurante2.max_capacity} personas`);

  } catch (error) {
    console.error('❌ Error al crear los restaurantes:', error.message);
    console.error('Detalles del error:', error);
  } finally {
    // Cerrar la conexión a la base de datos
    await sequelize.close();
    console.log('🔌 Conexión a la base de datos cerrada');
  }
}

// Ejecutar el script
createRestaurants();
