# ExplorAR API

API RESTful para gestión de actividades, usuarios y autenticación.

Base URL: `http://localhost:3000/api`

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

  - Lista todas las actividades. Filtros opcionales: `?name=baile&category=2`.

  - Obtiene una actividad por ID. Ej: `/actividades/1`

### Restaurantes (`/restaurantes`)

- GET `/restaurantes` (lista restaurantes, filtros: `?search=nombre&categoria=2&precio_min=1000&precio_max=5000&page=1&limit=10`)
- GET `/restaurantes/categories` (lista categorías de restaurantes)
- GET `/restaurantes/:id` (obtiene restaurante por ID)
- POST `/restaurantes` (crear restaurante, solo admin)
- PUT `/restaurantes/:id` (actualizar restaurante, solo admin y creador)
- DELETE `/restaurantes/:id` (eliminar restaurante, solo admin y creador)

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
```
npm install
npm run dev
```

Servidor: `http://localhost:3000`

## Rutas para probar en Postman

Base URL: `http://localhost:3000/api`

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