-- Script SQL para insertar las actividades turísticas
-- Ejecutar después de haber actualizado la base de datos con el script update_database.sql

-- Actividad 1: Matea experience
INSERT INTO actividadturistica (
    nombre, 
    descripcion, 
    duracion, 
    direccion, 
    contacto, 
    google_maps_link, 
    precio, 
    categoria_id, 
    user_id, 
    is_active, 
    max_capacity, 
    current_bookings, 
    created_at
) VALUES (
    'Matea experience',
    'Aprende a todo acerca del mate en la primera boutique de mate en Argentina',
    80,
    'Ayacucho 1538',
    '08003456283',
    'https://www.google.com/maps/place/Matea,+Aromas+y+Sabores+-+Mate+Bar+%26+Boutique/@-34.5914656,-58.3942945,19.88z/data=!4m6!3m5!1s0x95a2e701c3959a71:0xcf220e8dba0609f8!8m2!3d-34.591453!4d-58.3937117!16s%2Fg%2F11f7gdm3w6?entry=ttu&g_ep=EgoyMDI1MTAyMC4wIKXMDSoASAFQAw%3D%3D',
    150000.00,
    1,
    NULL,
    true,
    8,
    0,
    NOW()
);

-- Actividad 2: Tour por el Centro Histórico
INSERT INTO actividadturistica (
    nombre, 
    descripcion, 
    duracion, 
    direccion, 
    contacto, 
    google_maps_link, 
    precio, 
    categoria_id, 
    user_id, 
    is_active, 
    max_capacity, 
    current_bookings, 
    created_at
) VALUES (
    'Tour por el Centro Histórico',
    'Recorrido guiado por los principales monumentos del centro de Buenos Aires',
    180,
    'Plaza de Mayo, CABA',
    '+54 11 1234-5678',
    'https://maps.google.com/maps?q=Plaza+de+Mayo+Buenos+Aires',
    2500.00,
    2,
    NULL,
    true,
    15,
    0,
    NOW()
);

-- Verificar que las actividades se insertaron correctamente
SELECT 
    id,
    nombre,
    precio,
    duracion,
    max_capacity,
    created_at
FROM actividadturistica 
WHERE nombre IN ('Matea experience', 'Tour por el Centro Histórico')
ORDER BY created_at DESC;
