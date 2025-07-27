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

## Próximos Sprints

### Sprint 4: Mapa Interactivo
- Integración con Google Maps
- Geolocalización de actividades
- Búsqueda por proximidad

### Sprint 5: Historial de Viajes
- Sistema de reservas
- Historial de actividades realizadas
- Calificaciones y reseñas

### Sprint 6: Retoques Generales
- Optimizaciones de rendimiento
- Mejoras de seguridad
- Documentación completa

## Soporte

Para reportar problemas o solicitar nuevas funcionalidades, contacta al equipo de desarrollo.