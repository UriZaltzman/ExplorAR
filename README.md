# ExplorAR API

API RESTful para gestión de actividades, usuarios y autenticación.

Base URL: `http://localhost:3000/api`

## Rutas en español

### Autenticación (`/autenticacion`)

- POST `/autenticacion/registro`
  - Registra un nuevo usuario.
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
  - Inicia sesión con email y password.
  - Body (JSON):
    ```json
    { "email": "juan@gmail.com", "password": "password123" }
    ```

- POST `/autenticacion/google-login`
  - Login con Google (requiere `GOOGLE_CLIENT_ID`).
  - Body (JSON): `{ "idToken": "token_de_google" }`

- POST `/autenticacion/verificar-email`
  - Verifica email con código.
  - Body (JSON): `{ "userId": 1, "codigo": "123456" }`

- POST `/autenticacion/reenviar-codigo`
  - Reenvía código de verificación.
  - Body (JSON): `{ "email": "juan@gmail.com" }`

- POST `/autenticacion/verificar-email-dev`
  - Marca email como verificado (solo desarrollo).
  - Body (JSON): `{ "email": "juan@gmail.com" }`

- POST `/autenticacion/recuperar-password`
  - Envía código para resetear contraseña.
  - Body (JSON): `{ "email": "juan@gmail.com" }`

- POST `/autenticacion/resetear-password`
  - Resetea contraseña usando código.
  - Body (JSON): `{ "email": "juan@gmail.com", "codigo": "123456", "newPassword": "Nueva123" }`


### Usuarios (`/usuarios`)

- GET `/usuarios`
  - Lista usuarios (paginado opcional: `?page=1&limit=20`).

- GET `/usuarios/:id`
  - Obtiene un usuario por ID (sin token). Ej: `/usuarios/1`

- POST `/usuarios/crear-admin`
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

- POST `/usuarios` (protegido, admin)
- PUT `/usuarios/:id` (protegido, admin)
- DELETE `/usuarios/:id` (protegido, admin)


### Actividades (`/actividades`)

- GET `/actividades`
  - Lista todas las actividades. Filtros opcionales: `?name=baile&category=2`.

- GET `/actividades/:id`
  - Obtiene una actividad por ID. Ej: `/actividades/1`


## Código de verificación de email
- Lógica para enviar códigos: `utils/sendVerificationCode.js`
- Endpoints relacionados: `/autenticacion/verificar-email`, `/autenticacion/reenviar-codigo`, `/autenticacion/verificar-email-dev`


## Variables de entorno (.env)
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=explorar
PORT=3000
JWT_SECRET=un_secreto_seguro
MAILERSEND_KEY=tu_api_key_de_mailersend
GOOGLE_CLIENT_ID=tu_google_client_id
```

## Ejecutar
```
npm install
npm run dev
```

Servidor: `http://localhost:3000`

## Notas
- Todas las rutas devuelven y aceptan JSON.
- Rutas protegidas requieren header: `Authorization: Bearer <token>`.