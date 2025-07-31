# ExplorAR - Backend API

Plataforma para actividades turísticas y restaurantes en Argentina.

## Configuración Inicial

### 1. Variables de Entorno (.env)

```env
DB_HOST=ep-quiet-mode-a4xh9dp4-pooler.us-east-1.aws.neon.tech
DB_PORT=5432
DB_USER=neondb_owner
DB_PASSWORD=npg_6BkrCtYiycQ3
DB_NAME=neondb
MAILERSEND_KEY=tu_api_key_de_mailersend
JWT_SECRET=tu_jwt_secret_key
```

### 2. Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Ejecutar en producción
npm start
```

El servidor estará disponible en: `http://localhost:3000`

## Estado Actual

### Funcionando
- Conexión a base de datos Neon
- Autenticación JWT
- Registro de usuarios con validaciones
- Login con verificación de email
- Verificación de email con códigos
- Recuperación de contraseña
- Gestión de perfiles de usuario
- CRUD de actividades turísticas (admin)
- Búsqueda y filtros de actividades
- Sistema de favoritos
- Categorías de actividades
- Fotos de actividades

### En Desarrollo
- Login con Google
- Sistema de reseñas y calificaciones
- Gestión de restaurantes
- Sistema de reservas
- Integración con Google Calendar
- Integración con MercadoPago

## Autenticación

### Registro de Usuario
```http
POST /api/auth/register
Content-Type: application/json

    {
      "nombre": "Juan",
      "apellido": "Pérez",
  "email": "juan@gmail.com",
  "password": "password123",
      "dni": "12345678"
    }
    ```

### Login
```http
POST /api/auth/login
Content-Type: application/json

    {
  "email": "juan@gmail.com",
  "password": "password123"
    }
    ```

### Verificar Email
```http
POST /api/auth/verify-email
Content-Type: application/json

{
  "userId": 1,
  "codigo": "123456"
}
```

### Reenviar Código de Verificación
```http
POST /api/auth/resend-verification
Content-Type: application/json

    {
  "email": "juan@gmail.com"
}
```

### Olvidé mi Contraseña
```http
POST /api/auth/forgot-password
Content-Type: application/json

    {
  "email": "juan@gmail.com"
    }
    ```

### Resetear Contraseña
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "email": "juan@gmail.com",
  "codigo": "123456",
  "newPassword": "nuevaPassword123"
}
```

### Obtener Perfil
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### Actualizar Perfil
```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

    {
  "nombre": "Juan Carlos",
  "apellido": "Pérez González"
    }
    ```

### Login con Google
```http
POST /api/auth/google-login
Content-Type: application/json

{
  "idToken": "google_id_token_from_frontend"
}
```

**Nota:** Requiere configuración de Google OAuth en el frontend y las siguientes variables de entorno:
- `GOOGLE_CLIENT_ID`: Tu Google Client ID
- `GOOGLE_CLIENT_SECRET`: Tu Google Client Secret

## Actividades Turísticas

### Obtener Todas las Actividades (con filtros)
```http
GET /api/activities?search=aventura&categoria=1&precio_min=100&precio_max=500&duracion_min=60&duracion_max=180&page=1&limit=10&sort_by=precio&sort_order=ASC
```

**Parámetros de consulta:**
- `search`: Búsqueda por nombre
- `categoria`: ID de categoría
- `precio_min` / `precio_max`: Rango de precios
- `duracion_min` / `duracion_max`: Rango de duración (minutos)
- `page`: Número de página
- `limit`: Elementos por página
- `sort_by`: Campo para ordenar
- `sort_order`: ASC o DESC

### Obtener Actividad por ID
```http
GET /api/activities/1
Authorization: Bearer <token> (opcional)
```

### Obtener Categorías
```http
GET /api/activities/categories?tipo=actividad
```

### Crear Actividad (Solo Admin)
```http
POST /api/activities
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "nombre": "Matea Experience",
  "descripcion": "Experiencia única de mate en Buenos Aires",
  "duracion": 120,
  "direccion": "Av. Corrientes 1234",
  "contacto": "+54 11 1234-5678",
  "coordenadas_lat": -34.6037,
  "coordenadas_lng": -58.3816,
  "precio": 2500.00,
  "seña": 500.00,
  "categoria_id": 1,
  "max_capacity": 10,
  "fotos": [
    "https://ejemplo.com/foto1.jpg",
    "https://ejemplo.com/foto2.jpg"
  ]
}
```

### Actualizar Actividad (Solo Admin)
```http
PUT /api/activities/1
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "nombre": "Matea Experience Premium",
  "precio": 3000.00
}
```

### Eliminar Actividad (Solo Admin)
```http
DELETE /api/activities/1
Authorization: Bearer <admin_token>
```

## Favoritos

### Agregar Actividad a Favoritos
```http
POST /api/favorites/activities
Authorization: Bearer <token>
Content-Type: application/json

{
  "actividadturistica_id": 1
}
```

### Remover Actividad de Favoritos
```http
DELETE /api/favorites/activities/1
Authorization: Bearer <token>
```

### Agregar Restaurante a Favoritos
```http
POST /api/favorites/restaurants
Authorization: Bearer <token>
Content-Type: application/json

{
  "restaurante_id": 1
}
```

### Remover Restaurante de Favoritos
```http
DELETE /api/favorites/restaurants/1
Authorization: Bearer <token>
```

### Obtener Favoritos del Usuario
```http
GET /api/favorites
Authorization: Bearer <token>
```

### Verificar si Actividad está en Favoritos
```http
GET /api/favorites/check/activity/1
Authorization: Bearer <token>
```

### Verificar si Restaurante está en Favoritos
```http
GET /api/favorites/check/restaurant/1
Authorization: Bearer <token>
```

## Reseñas

### Crear Reseña para Actividad
```http
POST /api/reviews/activities
Authorization: Bearer <token>
Content-Type: application/json

{
  "actividadturistica_id": 1,
  "rating": 4.5,
  "comment": "Excelente experiencia, muy recomendable"
}
```

### Crear Reseña para Restaurante
```http
POST /api/reviews/restaurants
Authorization: Bearer <token>
Content-Type: application/json

{
  "restaurante_id": 1,
  "rating": 5.0,
  "comment": "Comida deliciosa y servicio excelente"
}
```

### Obtener Reseñas de Actividad
```http
GET /api/reviews/activities/1?page=1&limit=10
```

### Obtener Reseñas de Restaurante
```http
GET /api/reviews/restaurants/1?page=1&limit=10
```

### Actualizar Reseña
```http
PUT /api/reviews/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5.0,
  "comment": "Actualizado: Mejor experiencia de lo esperado"
}
```

### Eliminar Reseña
```http
DELETE /api/reviews/1
Authorization: Bearer <token>
```

### Obtener Reseñas del Usuario
```http
GET /api/reviews/user?page=1&limit=10
Authorization: Bearer <token>
```

## Endpoints de Prueba

### Probar Conexión a Base de Datos
```http
GET /api/test/db-test
```

### Probar Creación de Usuario
```http
POST /api/test/create-user
Content-Type: application/json

{
  "nombre": "Test",
  "apellido": "User",
  "email": "test@test.com",
  "password": "test123",
  "dni": "87654321"
}
```

## Solución de Problemas

### 1. Error de Conexión a Base de Datos
```bash
# Verificar variables de entorno
node test-db.js
```

### 2. Error de Autenticación
- Verificar que el token JWT sea válido
- Verificar que el usuario esté verificado por email

### 3. Error de Permisos
- Verificar que el usuario tenga el rol correcto (admin/user)
- Verificar que el token no haya expirado

## Estructura del Proyecto

```
ExplorAR/
├── controllers/
│   ├── auth.controller.js      # Autenticación y usuarios
│   ├── activity.controller.js  # Gestión de actividades
│   ├── favorite.controller.js  # Sistema de favoritos
│   └── test.controller.js     # Endpoints de prueba
├── models/
│   ├── index.js               # Configuración de Sequelize
│   ├── user.model.js          # Modelo de usuario
│   ├── categoria.model.js     # Modelo de categorías
│   ├── actividadturistica.model.js
│   ├── restaurante.model.js
│   ├── resena.model.js
│   ├── favoritoactividad.model.js
│   ├── favoritorestaurante.model.js
│   ├── fotoactividad.model.js
│   ├── fotorestaurante.model.js
│   └── verificacionemail.model.js
├── routes/
│   ├── auth.routes.js         # Rutas de autenticación
│   ├── activity.routes.js     # Rutas de actividades
│   ├── favorite.routes.js     # Rutas de favoritos
│   └── test.routes.js        # Rutas de prueba
├── middlewares/
│   └── auth.middleware.js     # Middleware de autenticación
├── utils/
│   └── sendVerificationCode.js # Envío de emails
├── Index.js                   # Servidor principal
├── Routes.js                  # Rutas principales
└── package.json
```

## Validaciones y Reglas de Negocio

### Favoritos
- Solo usuarios autenticados pueden usar favoritos
- Un usuario no puede agregar el mismo elemento dos veces
- Se verifica que la actividad/restaurante existe antes de agregar
- Solo el usuario puede eliminar sus propios favoritos
- Paginación automática en listas de favoritos

### Reseñas
- Solo usuarios autenticados pueden crear reseñas
- Un usuario solo puede hacer una reseña por actividad/restaurante
- Rating debe estar entre 0.5 y 5.0
- Solo el autor puede editar/eliminar sus reseñas
- Reseñas públicas se pueden ver sin autenticación
- Estadísticas automáticas (promedio, distribución de ratings)
- Paginación automática en listas de reseñas

## Estructura de Datos

### Tabla FavoritoActividad
```sql
- id (PK)
- user_id (FK -> usuarios)
- actividadturistica_id (FK -> ActividadesTuristicas)
- created_at
```

### Tabla FavoritoRestaurante
```sql
- id (PK)
- user_id (FK -> usuarios)
- restaurante_id (FK -> Restaurantes)
- created_at
```

### Tabla Resena
```sql
- id (PK)
- user_id (FK -> usuarios)
- actividadturistica_id (FK -> ActividadesTuristicas, nullable)
- restaurante_id (FK -> Restaurantes, nullable)
- rating (DECIMAL(2,1), 0.5-5.0)
- comment (TEXT, nullable)
- created_at
- updated_at
```

## Códigos de Error

### Favoritos
- `400` - "ID de actividad es obligatorio"
- `404` - "Actividad no encontrada"
- `400` - "La actividad ya está en tus favoritos"
- `404` - "Actividad no encontrada en favoritos"

### Reseñas
- `400` - "ID de actividad y calificación son obligatorios"
- `400` - "La calificación debe estar entre 0.5 y 5"
- `404` - "Actividad no encontrada"
- `400` - "Ya has hecho una reseña para esta actividad"
- `404` - "Reseña no encontrada o no tienes permisos para editarla"

## Próximos Sprints

### Sprint 4: Mapa Interactivo
- Integración con Google Maps
- Geolocalización de actividades
- Búsqueda por proximidad
### Sprint 5: Sistema de Notificaciones
- Notificaciones en tiempo real
- Reportes de reseñas inapropiadas
- Filtros avanzados en favoritos
- Exportar favoritos
- Compartir reseñas en redes sociales
- Historial de actividades realizadas

### Sprint 6: Retoques Generales
- Optimizaciones de rendimiento
- Mejoras de seguridad
- Documentación completa