# ExplorAR API

API RESTful para gestión de actividades, usuarios y autenticación.

## Endpoints principales

### Autenticación (`/api/auth`)

- **POST** `/api/auth/register`
  - Registra un nuevo usuario.
  - **Body (JSON):**
    ```json
    {
      "nombre": "Juan",
      "apellido": "Pérez",
      "email": "juan@mail.com",
      "password": "123456",
      "dni": "12345678"
    }
    ```

- **POST** `/api/auth/login`
  - Login de usuario.
  - **Body (JSON):**
    ```json
    {
      "email": "juan@mail.com",
      "password": "123456"
    }
    ```

- **POST** `/api/auth/google-login`
  - Login con Google (mock).
  - **Body (JSON):**
    ```json
    {
      "email": "juan@mail.com",
      "nombre": "Juan",
      "apellido": "Pérez"
    }
    ```

- **POST** `/api/auth/forgot-password`
  - Solicita token de recuperación de contraseña.
  - **Body (JSON):**
    ```json
    {
      "email": "juan@mail.com"
    }
    ```

- **POST** `/api/auth/reset-password`
  - Cambia la contraseña usando el token recibido.
  - **Body (JSON):**
    ```json
    {
      "token": "TOKEN_RECIBIDO",
      "newPassword": "nuevaClave123"
    }
    ```

---

### Actividades (`/api/activities`)

- **GET** `/api/activities`
  - Lista todas las actividades.
  - **Query params opcionales:**
    - `name` (string): filtra por nombre
    - `category` (id): filtra por categoría
  - **Ejemplo:** `/api/activities?name=baile&category=2`

- **GET** `/api/activities/:id`
  - Obtiene la información completa de una actividad por su ID.
  - **Ejemplo:** `/api/activities/1`

---

## Notas
- Todas las rutas devuelven y aceptan datos en formato JSON.
- Si una ruta requiere autenticación, debes enviar el header:
  ```
  Authorization: Bearer <token>
  ```
- Puedes probar estos endpoints usando Postman, Insomnia o cualquier cliente HTTP.

---

¿Dudas o sugerencias? Abre un issue en el repositorio.