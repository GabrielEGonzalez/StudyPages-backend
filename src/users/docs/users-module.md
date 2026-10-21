# UsersModule

## Endpoints
- `GET /users/:id` → datos públicos del usuario (sin `passwordHash`).
- `PATCH /users/:id` → actualiza `name` y/o `email`.

## Reglas
- `id` debe ser UUID válido (400 si no).
- Usuario debe existir (404 si no).
- `email` no puede duplicarse (409 si ya existe en otra cuenta).
- Campos no permitidos → 400 (gracias a `forbidNonWhitelisted`).
- `passwordHash` nunca se devuelve.

## Pendiente
- Autenticación (`AuthModule`).
- Autorización por propietario (cada usuario solo su perfil).