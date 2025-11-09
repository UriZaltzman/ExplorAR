# Instrucciones para agregar fotos a la actividad "Matea experience"

He implementado un sistema completo para subir y gestionar fotos. Aquí tienes **3 opciones** para agregar las 3 fotos a la actividad "Matea experience":

## Opción 1: Usar el endpoint de subida (Recomendado) ⭐

### Paso 1: Subir las imágenes
Usa el endpoint de subida para convertir tus imágenes a URLs:

**Endpoint:** `POST /api/upload/multiple`

**En Postman o cURL:**
```bash
curl -X POST https://explor-ar-urizaltzmans-projects.vercel.app/api/upload/multiple \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -F "images=@foto1.jpg" \
  -F "images=@foto2.jpg" \
  -F "images=@foto3.jpg"
```

**Respuesta:**
```json
{
  "message": "Imágenes subidas exitosamente",
  "images": [
    {
      "url": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
      "originalName": "foto1.jpg",
      "size": 12345,
      "mimetype": "image/jpeg"
    },
    ...
  ],
  "count": 3
}
```

### Paso 2: Copiar las URLs
Copia las URLs del campo `url` de cada imagen en la respuesta.

### Paso 3: Agregar las fotos a la actividad
Edita el archivo `scripts/add_matea_photos_from_urls.js` y reemplaza las URLs de ejemplo con las URLs que obtuviste:

```javascript
const fotosUrls = [
  'data:image/jpeg;base64,/9j/4AAQSkZJRg...',  // URL de la foto 1
  'data:image/jpeg;base64,/9j/4AAQSkZJRg...',  // URL de la foto 2
  'data:image/jpeg;base64,/9j/4AAQSkZJRg...'   // URL de la foto 3
];
```

### Paso 4: Ejecutar el script
```bash
node scripts/add_matea_photos_from_urls.js
```

---

## Opción 2: Usar archivos locales 📁

### Paso 1: Guardar las imágenes
Guarda las 3 imágenes que compartiste en la carpeta:
```
scripts/images/matea/
```

### Paso 2: Ejecutar el script
El script leerá automáticamente todas las imágenes de la carpeta:
```bash
node scripts/upload_and_add_photos_matea.js
```

---

## Opción 3: Usar URLs externas 🌐

Si ya tienes las imágenes subidas en un servicio como Imgur, Cloudinary, etc.:

### Paso 1: Editar el script
Edita `scripts/add_matea_photos_from_urls.js` y agrega las URLs externas:

```javascript
const fotosUrls = [
  'https://i.imgur.com/abc123.jpg',
  'https://i.imgur.com/def456.jpg',
  'https://i.imgur.com/ghi789.jpg'
];
```

### Paso 2: Ejecutar el script
```bash
node scripts/add_matea_photos_from_urls.js
```

---

## Verificación ✅

Después de ejecutar cualquiera de los scripts, verifica que las fotos se agregaron correctamente:

1. Consulta la actividad: `GET /api/actividades/{id}` (donde {id} es el ID de la actividad Matea)
2. Verifica que el campo `fotos` contenga las 3 imágenes
3. Revisa el orden de las fotos (deben estar ordenadas por el campo `orden`)

---

## Endpoints disponibles 📡

### Subir una imagen
- **POST** `/api/upload/single`
- Body: `multipart/form-data` con campo `image`
- Requiere: Token de autenticación

### Subir múltiples imágenes
- **POST** `/api/upload/multiple`
- Body: `multipart/form-data` con campo `images` (múltiples archivos)
- Requiere: Token de autenticación
- Máximo: 10 imágenes, 5MB por imagen

### Crear actividad con fotos
- **POST** `/api/actividades`
- Body: JSON con campo `fotos` (array de URLs)
- Requiere: Token de autenticación (rol admin)

---

## Notas importantes ⚠️

1. **Formato de imágenes:** Se aceptan jpeg, jpg, png, gif, webp
2. **Tamaño máximo:** 5MB por imagen
3. **URLs soportadas:**
   - URLs externas: `https://ejemplo.com/imagen.jpg`
   - Data URLs base64: `data:image/jpeg;base64,/9j/4AAQSkZJRg...`
4. **Autenticación:** Todos los endpoints de subida requieren token válido
5. **Permisos:** Solo usuarios con rol `admin` pueden crear/editar actividades

---

## Solución de problemas 🔧

### Error: "No se encontró la actividad Matea experience"
- Verifica que la actividad existe en la base de datos
- Ejecuta: `SELECT * FROM actividadturistica WHERE nombre ILIKE '%matea%';`

### Error: "Token inválido"
- Asegúrate de estar autenticado
- Obtén un token válido: `POST /api/autenticacion/login`
- Incluye el token en el header: `Authorization: Bearer TU_TOKEN`

### Error: "Solo se permiten archivos de imagen"
- Verifica que los archivos sean imágenes válidas
- Asegúrate de que la extensión sea: jpg, jpeg, png, gif, webp

### Error: "Tamaño de archivo excede el límite"
- Reduce el tamaño de las imágenes (máximo 5MB por imagen)
- Usa herramientas de compresión de imágenes si es necesario

