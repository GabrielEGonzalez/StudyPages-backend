# StudyPages — Backend

API REST de **StudyPages**, un cuaderno digital de estudio donde cada estudiante organiza sus apuntes en **asignaturas** y **páginas** escritas en Markdown.

Este repositorio contiene únicamente el backend (NestJS). El frontend (Vue.js) vive en su propia carpeta/repositorio.

## Stack

| Área | Tecnología |
| --- | --- |
| Entorno de ejecución | Node.js |
| Lenguaje | TypeScript |
| Framework | NestJS |
| Base de datos | PostgreSQL |
| ORM | Prisma |
| Comunicación | API REST (HTTP/JSON) |
| Gestor de paquetes | pnpm |

## Alcance del MVP

- Registro e inicio de sesión
- Dashboard personal
- CRUD de asignaturas
- CRUD de páginas (contenido en Markdown)
- Persistencia en PostgreSQL
- Aislamiento de datos: cada usuario accede solo a su información

**Posteriores al MVP:** etiquetas, favoritos, búsqueda en contenido, imágenes/adjuntos, papelera con restauración, historial de versiones.

## Arquitectura

```
Vue.js  ──HTTP/JSON──▶  NestJS  ──Prisma──▶  PostgreSQL
```

El frontend nunca accede directamente a la base de datos: toda operación protegida pasa por esta API.

### Módulos

| Módulo | Responsabilidad |
| --- | --- |
| `AuthModule` | Registro, inicio y cierre de sesión |
| `UsersModule` | Perfil y datos de la cuenta |
| `SubjectsModule` | Gestión de asignaturas |
| `PagesModule` | Gestión de páginas |
| `SearchModule` | Búsqueda de asignaturas y páginas |
| `PrismaModule` | Acceso a la base de datos |
| `HealthModule` | Estado del servicio |

### Responsabilidades

- **Controllers:** reciben la solicitud HTTP y devuelven la respuesta.
- **Services:** reglas de negocio y verificación de propiedad de los recursos.
- **Guards:** autenticación y permisos.
- **DTOs:** validación de los datos de entrada.
- **Prisma:** acceso a PostgreSQL.

### Estructura

```
backend/
├── src/
│   ├── auth/        autenticación
│   ├── users/       usuarios
│   ├── subjects/    asignaturas
│   ├── pages/       páginas de estudio
│   ├── search/      búsqueda
│   ├── prisma/      acceso a PostgreSQL
│   └── health/      estado del servicio
├── prisma/          esquema y migraciones
└── test/            pruebas
```

## Modelo de datos

```
USER (1) ──owns──▶ (N) SUBJECT (1) ──contains──▶ (N) PAGE
```

| Entidad | Campos principales |
| --- | --- |
| `User` | id (UUID), name, email (único), passwordHash, createdAt, updatedAt |
| `Subject` | id (UUID), userId (FK), name, description, color, icon, position, createdAt, updatedAt, deletedAt |
| `Page` | id (UUID), subjectId (FK), title, content (Markdown), position, isFavorite, createdAt, updatedAt, deletedAt |

La eliminación es **lógica** (`deletedAt`) para habilitar una papelera más adelante.

## Reglas de seguridad

- Contraseñas almacenadas con hash seguro (nunca en texto plano).
- Operaciones privadas requieren autenticación.
- Cada operación verifica en el backend que el recurso pertenece al usuario.
- El Markdown se sanitiza antes de renderizarse como HTML (prevención de XSS).
- Credenciales y secretos en variables de entorno, nunca en el código.

## Requisitos previos

- Node.js (versión LTS)
- pnpm
- PostgreSQL

## Instalación

```bash
# 1. Instalar dependencias
$ pnpm install

# 2. Configurar variables de entorno
$ cp .env.example .env
# Edita .env con tus credenciales (ver sección siguiente)

# 3. Aplicar migraciones de Prisma
$ pnpm prisma migrate dev
```

## Variables de entorno

```env
# Conexión a PostgreSQL
DATABASE_URL="postgresql://USUARIO:CONTRASEÑA@localhost:5432/studypages"
```

> Se añadirán aquí las variables de autenticación cuando se defina el mecanismo (sesiones o JWT).

## Ejecutar el proyecto

```bash
# desarrollo
$ pnpm run start

# modo watch
$ pnpm run start:dev

# producción
$ pnpm run start:prod
```

## Pruebas

```bash
# unitarias
$ pnpm run test

# e2e
$ pnpm run test:e2e

# cobertura
$ pnpm run test:cov
```

## Decisiones pendientes

- Autenticación: sesiones con cookies o JWT.
- Estrategia de guardado: manual, automático o mixto.
- Almacenamiento de imágenes y adjuntos.
- Qué ocurre con las páginas al eliminar una asignatura (se recomienda eliminación recuperable).
- Cuándo se crean versiones del historial y cuánto se conservan.
- Mecanismo de búsqueda en contenido sobre PostgreSQL.
