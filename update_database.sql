-- Script SQL para actualizar la base de datos
-- Eliminar campos de coordenadas y agregar campo google_maps_link

-- 1. Eliminar columnas de coordenadas de la tabla restaurante
ALTER TABLE restaurante DROP COLUMN IF EXISTS coordenadas_lat;
ALTER TABLE restaurante DROP COLUMN IF EXISTS coordenadas_lng;

-- 2. Agregar columna google_maps_link a la tabla restaurante
ALTER TABLE restaurante ADD COLUMN google_maps_link TEXT;

-- 3. Eliminar columnas de coordenadas de la tabla actividadturistica
ALTER TABLE actividadturistica DROP COLUMN IF EXISTS coordenadas_lat;
ALTER TABLE actividadturistica DROP COLUMN IF EXISTS coordenadas_lng;

-- 4. Agregar columna google_maps_link a la tabla actividadturistica
ALTER TABLE actividadturistica ADD COLUMN google_maps_link TEXT;

-- 5. Eliminar la columna seña de ambas tablas
ALTER TABLE restaurante DROP COLUMN IF EXISTS seña;
ALTER TABLE actividadturistica DROP COLUMN IF EXISTS seña;

-- 6. Verificar que las columnas se hayan creado correctamente
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'restaurante' 
AND column_name = 'google_maps_link';

SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'actividadturistica' 
AND column_name = 'google_maps_link';

-- 7. Verificar que las columnas de coordenadas y seña se hayan eliminado
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'restaurante' 
AND column_name IN ('coordenadas_lat', 'coordenadas_lng', 'seña');

SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'actividadturistica' 
AND column_name IN ('coordenadas_lat', 'coordenadas_lng', 'seña');
