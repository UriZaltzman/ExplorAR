# ExplorAR API

API RESTful para gestión de actividades, usuarios y autenticación.

Base URL: `https://explor-ar-urizaltzmans-projects.vercel.app/api`

## Rutas en español

### Autenticación (`/autenticacion`)

- POST `/autenticacion/registro`
  - Registra un nuevo usuario. Ahora el usuario queda verificado automáticamente (no se requiere código de verificación).
  - Body (JSON):
    ```json
    {
      "nombre": "Juan",
      "apellido": "Pérez",
      "email": "juan@gmail.com",
      "password": "password123",
      "dni": "12345678"
    }
    ```

- POST `/autenticacion/login`
  - Inicia sesión con email y password. No exige verificación previa de email.
  - Body (JSON):
    ```json
    { "email": "juan@gmail.com", "password": "password123" }
    ```

- POST `/autenticacion/google-login`
  - Login con Google (requiere `GOOGLE_CLIENT_ID`).
  - Body (JSON): `{ "idToken": "token_de_google" }`

- POST `/autenticacion/verificar-email` (deshabilitado)
  - Endpoint temporalmente deshabilitado. No es necesario verificar email.

- POST `/autenticacion/reenviar-codigo` (deshabilitado)
  - Endpoint temporalmente deshabilitado. No se envían códigos.

- POST `/autenticacion/verificar-email-dev` (deshabilitado)
  - Endpoint temporalmente deshabilitado.

- POST `/autenticacion/recuperar-password` (envío de email deshabilitado temporalmente)
  - El envío de correo está deshabilitado mientras no se use MailerSend.
  - Body (JSON): `{ "email": "juan@gmail.com" }`

- POST `/autenticacion/resetear-password`
  - Resetea contraseña usando código (si el flujo de recuperación está activo).
  - Body (JSON): `{ "email": "juan@gmail.com", "codigo": "123456", "newPassword": "Nueva123" }`


### Usuarios (`/usuarios`)

  - Lista usuarios (paginado opcional: `?page=1&limit=20`).

  - Obtiene un usuario por ID (sin token). Ej: `/usuarios/1`

  - Crea un usuario con rol administrador. Body igual a registro, con los mismos campos.
  - Body (JSON):
    ```json
    {
      "nombre": "Admin",
      "apellido": "Root",
      "email": "admin@gmail.com",
      "password": "Admin123",
      "dni": "11223344"
    }
    ```


### Favoritos (`/favoritos`)

- POST `/favoritos/activities` (agrega actividad a favoritos, requiere token)
- DELETE `/favoritos/activities/:actividadturistica_id` (elimina actividad de favoritos, requiere token)
- POST `/favoritos/restaurants` (agrega restaurante a favoritos, requiere token)
- DELETE `/favoritos/restaurants/:restaurante_id` (elimina restaurante de favoritos, requiere token)
- GET `/favoritos` (obtiene todos los favoritos del usuario, requiere token)
- GET `/favoritos/check/activity/:actividadturistica_id` (verifica si una actividad está en favoritos, requiere token)
- GET `/favoritos/check/restaurant/:restaurante_id` (verifica si un restaurante está en favoritos, requiere token)


### Actividades (`/actividades`)

- GET `/actividades` - Lista todas las actividades. Filtros opcionales: `?name=baile&category=2`.
- GET `/actividades/:id` - Obtiene una actividad por ID. Ej: `/actividades/1`
- POST `/actividades` (crear actividad, solo admin, requiere token)
  - Body (JSON):
    ```json
    {
      "nombre": "Tour por la ciudad",
      "descripcion": "Recorrido guiado por los principales puntos de interés",
      "duracion": 120,
      "direccion": "Calle Principal 123",
      "contacto": "+5491123456789",
      "google_maps_link": "https://maps.google.com/...",
      "precio": 5000.00,
      "categoria_id": 1,
      "max_capacity": 20,
      "fotos": [
        "https://ejemplo.com/foto1.jpg",
        "https://ejemplo.com/foto2.jpg"
      ]
    }
    ```
  - Campos requeridos: `nombre`, `duracion`, `direccion`, `contacto`, `precio`
  - Campos opcionales: `descripcion`, `google_maps_link`, `categoria_id`, `max_capacity`, `fotos` (array de URLs o data URLs base64)
- PUT `/actividades/:id` (actualizar actividad, solo admin y creador, requiere token)
- DELETE `/actividades/:id` (eliminar actividad, solo admin y creador, requiere token)

### Subida de Imágenes (`/upload`)

- POST `/upload/single` (subir una imagen, requiere token)
  - Content-Type: `multipart/form-data`
  - Body: campo `image` con el archivo de imagen
  - Respuesta: `{ "url": "data:image/jpeg;base64,...", "originalName": "...", "size": 12345 }`
  - Formatos soportados: jpeg, jpg, png, gif, webp
  - Tamaño máximo: 5MB

- POST `/upload/multiple` (subir múltiples imágenes, requiere token)
  - Content-Type: `multipart/form-data`
  - Body: campo `images` con múltiples archivos de imagen (máximo 10)
  - Respuesta: `{ "images": [...], "count": 3 }`
  - Formatos soportados: jpeg, jpg, png, gif, webp
  - Tamaño máximo por imagen: 5MB

## Guía: Cómo subir fotos a la base de datos

Se han implementado 3 opciones diferentes para subir y gestionar fotos:

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
    }
  ],
  "count": 3
}
```

### Paso 2: Copiar las URLs
Copia las URLs del campo `url` de cada imagen en la respuesta.

### Paso 3: Agregar las fotos a la actividad
```bash
POST /api/actividades
Authorization: Bearer TU_TOKEN
Content-Type: application/json

{
  "nombre": "Tour por la ciudad",
  "descripcion": "Recorrido guiado",
  "duracion": 120,
  "direccion": "Calle Principal 123",
  "contacto": "+5491123456789",
  "precio": 5000.00,
  "fotos": [
    "data:image/jpeg;base64,/9j/4AAQSkZJRg...",  // URL de la foto 1
    "data:image/jpeg;base64,/9j/4AAQSkZJRg...",  // URL de la foto 2
    "data:image/jpeg;base64,/9j/4AAQSkZJRg..."   // URL de la foto 3
  ]
}
```

## Opción 2: Usar archivos locales 📁

### Paso 1: Guardar las imágenes
Guarda las imágenes que deseas subir en la carpeta:
```
scripts/images/matea/
```

### Paso 2: Ejecutar el script
El script leerá automáticamente todas las imágenes de la carpeta:
```bash
node scripts/upload_and_add_photos_matea.js
```

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

**Subir múltiples imágenes:**
```bash
POST /api/upload/multiple
Authorization: Bearer TU_TOKEN
Content-Type: multipart/form-data

# En Postman:
# - Tipo: POST
# - Body → form-data
# - Key: images (tipo File)
# - Value: selecciona múltiples archivos (máximo 10)
```

**Respuesta del endpoint de upload:**
```json
{
  "message": "Imágenes subidas exitosamente",
  "images": [
    {
      "url": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
      "originalName": "foto1.jpg",
      "size": 123456,
      "mimetype": "image/jpeg"
    },
    {
      "url": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
      "originalName": "foto2.jpg",
      "size": 234567,
      "mimetype": "image/jpeg"
    }
  ],
  "count": 2
}
```

#### Paso 2: Usar las URLs en la actividad o restaurante

Copia las URLs del campo `url` de cada imagen y úsalas al crear o actualizar:

**Crear actividad con las URLs obtenidas:**
```bash
POST /api/actividades
Authorization: Bearer TU_TOKEN
Content-Type: application/json

{
  "nombre": "Tour por la ciudad",
  "descripcion": "Recorrido guiado",
  "duracion": 120,
  "direccion": "Calle Principal 123",
  "contacto": "+5491123456789",
  "precio": 5000.00,
  "fotos": [
    "data:image/jpeg;base64,/9j/4AAQSkZJRg...",  // URL de la foto 1
    "data:image/jpeg;base64,/9j/4AAQSkZJRg..."   // URL de la foto 2
  ]
}
```

**Actualizar actividad existente:**
```bash
PUT /api/actividades/1
Authorization: Bearer TU_TOKEN
Content-Type: application/json

{
  "fotos": [
    "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
    "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
  ]
}
```

### Opción 3: Usar scripts para agregar fotos a actividades existentes

Si ya tienes una actividad creada y quieres agregarle fotos, puedes usar los scripts disponibles:

**1. Usar script con URLs:**
- Edita `scripts/add_matea_photos_from_urls.js`
- Agrega las URLs de las fotos en el array `fotosUrls`
- Ejecuta: `node scripts/add_matea_photos_from_urls.js`

**2. Usar script con archivos locales:**
- Coloca las imágenes en `scripts/images/matea/`
- Ejecuta: `node scripts/upload_and_add_photos_matea.js`

### Formato de URLs soportadas

Las fotos pueden ser:
- **URLs externas:** `https://ejemplo.com/imagen.jpg`
- **Data URLs base64:** `data:image/jpeg;base64,/9j/4AAQSkZJRg...`

### Ejemplo completo con cURL

```bash
# 1. Obtener token de autenticación
TOKEN=$(curl -X POST https://explor-ar-urizaltzmans-projects.vercel.app/api/autenticacion/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}' \
  | jq -r '.token')

# 2. Subir múltiples imágenes
curl -X POST https://explor-ar-urizaltzmans-projects.vercel.app/api/upload/multiple \
  -H "Authorization: Bearer $TOKEN" \
  -F "images=@foto1.jpg" \
  -F "images=@foto2.jpg" \
  -F "images=@foto3.jpg"

# 3. Crear actividad con las URLs obtenidas
curl -X POST https://explor-ar-urizaltzmans-projects.vercel.app/api/actividades \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Tour por la ciudad",
    "descripcion": "Recorrido guiado",
    "duracion": 120,
    "direccion": "Calle Principal 123",
    "contacto": "+5491123456789",
    "precio": 5000.00,
    "fotos": [
      "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
      "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
    ]
  }'
```

## Notas importantes ⚠️

1. **Formato de imágenes:** Se aceptan jpeg, jpg, png, gif, webp
2. **Tamaño máximo:** 5MB por imagen
3. **URLs soportadas:**
   - URLs externas: `https://ejemplo.com/imagen.jpg`
   - Data URLs base64: `data:image/jpeg;base64,/9j/4AAQSkZJRg...`
4. **Autenticación:** Todos los endpoints de subida requieren token válido
5. **Permisos:** Solo usuarios con rol `admin` pueden crear/editar actividades
6. **Límite:** Máximo 10 imágenes por request en `/upload/multiple`
7. **Orden:** Las fotos se guardan en el orden en que se proporcionan (el primer elemento será `orden: 0`)

## Solución de problemas 🔧

### Error: "No se encontró la actividad"
- Verifica que la actividad existe en la base de datos
- Ejecuta: `SELECT * FROM actividadturistica WHERE nombre ILIKE '%nombre_actividad%';`

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

### Verificar que las fotos se agregaron correctamente

```bash
# Obtener actividad con sus fotos
GET /api/actividades/1

# La respuesta incluirá el array de fotos:
{
  "id": 1,
  "nombre": "Tour por la ciudad",
  "fotos": [
    {
      "id": 1,
      "url": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
      "orden": 0
    },
    {
      "id": 2,
      "url": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
      "orden": 1
    }
  ]
}
```

### Uso en el frontend

Las URLs de las fotos se pueden usar directamente en elementos `<img>`:

```jsx
// React ejemplo
{activity.fotos.map((foto) => (
  <img 
    key={foto.id} 
    src={foto.url} 
    alt={`${activity.nombre} - Foto ${foto.orden + 1}`}
  />
))}
```

### Restaurantes (`/restaurantes`)

- GET `/restaurantes` (lista restaurantes, filtros: `?search=nombre&categoria=2&precio_min=1000&precio_max=5000&page=1&limit=10`)
- GET `/restaurantes/categories` (lista categorías de restaurantes)
- GET `/restaurantes/:id` (obtiene restaurante por ID)
- POST `/restaurantes` (crear restaurante, solo admin, requiere token)
  - Body (JSON):
    ```json
    {
      "nombre": "Restaurante El Buen Sabor",
      "descripcion": "Comida tradicional con ingredientes frescos",
      "direccion": "Av. Corrientes 1234",
      "contacto": "+5491123456789",
      "google_maps_link": "https://maps.google.com/...",
      "precio": 3500.00,
      "categoria_id": 2,
      "max_capacity": 50,
      "fotos": [
        "https://ejemplo.com/foto1.jpg",
        "https://ejemplo.com/foto2.jpg"
      ]
    }
    ```
  - Campos requeridos: `nombre`, `direccion`, `contacto`, `precio`
  - Campos opcionales: `descripcion`, `google_maps_link`, `categoria_id`, `max_capacity`, `fotos` (array de URLs)
- PUT `/restaurantes/:id` (actualizar restaurante, solo admin y creador, requiere token)
- DELETE `/restaurantes/:id` (eliminar restaurante, solo admin y creador, requiere token)

### Reseñas (`/resenas`)

- GET `/resenas/activities/:actividadturistica_id` (ver reseñas de actividad)
- GET `/resenas/restaurants/:restaurante_id` (ver reseñas de restaurante)
- POST `/resenas/activities` (crear reseña de actividad, requiere token)
- POST `/resenas/restaurants` (crear reseña de restaurante, requiere token)
- PUT `/resenas/:review_id` (actualizar reseña, requiere token)
- DELETE `/resenas/:review_id` (eliminar reseña, requiere token)
- GET `/resenas/user` (ver reseñas propias, requiere token)

## Código de verificación de email
- Estado: deshabilitado temporalmente. Registro y login no requieren verificación.
- Lógica de envío: `utils/sendVerificationCode.js` (stub, no envía correos).
- Endpoints relacionados (deshabilitados): `/autenticacion/verificar-email`, `/autenticacion/reenviar-codigo`, `/autenticacion/verificar-email-dev`


## Variables de entorno (.env)
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=explorar
PORT=3000
JWT_SECRET=un_secreto_seguro
// MAILERSEND_KEY=tu_api_key_de_mailersend (no requerido mientras el envío de mails esté deshabilitado)
GOOGLE_CLIENT_ID=tu_google_client_id
```

## Ejecutar

### Desarrollo Local
```
npm install
npm run dev
```

### Producción (Vercel)
La API está desplegada en Vercel y disponible en:
- **URL Base:** `https://explor-ar-urizaltzmans-projects.vercel.app`
- **API Endpoint:** `https://explor-ar-urizaltzmans-projects.vercel.app/api`
- **Health Check:** `https://explor-ar-urizaltzmans-projects.vercel.app/health`

### Despliegue
El proyecto se despliega automáticamente en Vercel cuando se hace push a la rama main del repositorio.

## Rutas para probar en Postman

Base URL: `https://explor-ar-urizaltzmans-projects.vercel.app/api`

### Autenticación
- POST `/autenticacion/registro`
- POST `/autenticacion/login`
- POST `/autenticacion/google-login`
- POST `/autenticacion/verificar-email`
- POST `/autenticacion/reenviar-codigo`
- POST `/autenticacion/verificar-email-dev`
- POST `/autenticacion/recuperar-password`
- POST `/autenticacion/resetear-password`

### Usuarios
- GET `/usuarios`
- GET `/usuarios/:id`
- POST `/usuarios/crear-admin`
- POST `/usuarios` (requiere token admin)
- PUT `/usuarios/:id` (requiere token admin)
- DELETE `/usuarios/:id` (requiere token admin)

### Actividades
- GET `/actividades`
- GET `/actividades/:id`
- POST `/actividades` (crear actividad, requiere token admin)
- PUT `/actividades/:id` (actualizar actividad, requiere token admin)
- DELETE `/actividades/:id` (eliminar actividad, requiere token admin)

### Subida de Imágenes
- POST `/upload/single` (subir una imagen, requiere token)
- POST `/upload/multiple` (subir múltiples imágenes, requiere token)

### Restaurantes
- GET `/restaurantes`
- GET `/restaurantes/categories`
- GET `/restaurantes/:id`
- POST `/restaurantes` (requiere token admin)
- PUT `/restaurantes/:id` (requiere token admin)
- DELETE `/restaurantes/:id` (requiere token admin)

### Favoritos (requiere token)
- POST `/favoritos/activities`
- DELETE `/favoritos/activities/:actividadturistica_id`
- POST `/favoritos/restaurants`
- DELETE `/favoritos/restaurants/:restaurante_id`
- GET `/favoritos`
- GET `/favoritos/check/activity/:actividadturistica_id`
- GET `/favoritos/check/restaurant/:restaurante_id`

### Reseñas (requiere token para crear/editar/eliminar)
- GET `/resenas/activities/:actividadturistica_id`
- GET `/resenas/restaurants/:restaurante_id`
- POST `/resenas/activities`
- POST `/resenas/restaurants`
- PUT `/resenas/:review_id`
- DELETE `/resenas/:review_id`
- GET `/resenas/user`

## Notas
- Todas las rutas devuelven y aceptan JSON.
- Rutas protegidas requieren header: `Authorization: Bearer <token>`.