# TechStore API

API REST para una tienda tecnológica construida con TypeScript, Express y PostgreSQL.

## 📦 Estructura del proyecto

- `src/`
  - `app.ts` - configuración de Express y rutas principales.
  - `server.ts` - arranque del servidor y conexión a PostgreSQL.
  - `config/db.ts` - configuración de conexión a la base de datos.
  - `controllers/` - controladores de rutas.
  - `services/` - lógica de negocio.
  - `repositories/` - acceso a datos y consultas.
  - `routes/v1/` - rutas de la API versionadas.
  - `external/` - integraciones externas (por ejemplo FakeStore).
  - `middlewares/` - middlewares de autenticación y roles.
- `tests/` - pruebas unitarias con Vitest.

## 🚀 Requisitos

- Node.js 18+ compatible
- PostgreSQL

## ⚙️ Instalación

```bash
npm install
```

## 🧪 Scripts disponibles

- `npm run dev` - inicia el servidor en modo desarrollo con `ts-node-dev`.
- `npm run build` - compila TypeScript a JavaScript en `dist/`.
- `npm start` - ejecuta la versión compilada desde `dist/app.js`.
- `npm test` - corre las pruebas con Vitest.
- `npm run coverage` - genera reporte de cobertura.

## 🌐 Ejecución

```bash
npm run dev
```

Luego abre `http://localhost:3000`.

## 🧭 Rutas principales

La API monta sus rutas bajo `/v1`:

- `/v1/products` - gestión de productos.
- `/v1/categories` - gestión de categorías.
- `/v1/auth` - autenticación.
- `/v1/orders` - gestión de órdenes.
- `/v1/cart` - carrito de compras.

## 🧩 Notas de configuración

- El servidor escucha en el puerto `3000`.
- La conexión a PostgreSQL se define en `src/config/db.ts`.
- Actualmente el proyecto usa credenciales concretas dentro de `src/config/db.ts`; se recomienda moverlas a variables de entorno para entornos de desarrollo y producción.

## 🛠️ Dependencias clave

- `express`
- `typesript`
- `pg`
- `jsonwebtoken`
- `bcryptjs`
- `awilix` / `awilix-express`
- `dotenv`
- `vitest`

## 📌 Recomendaciones

- Añadir un `README.md` con variables de entorno reales si se transforma el proyecto en un despliegue compartido.
- Revisar `src/config/db.ts` para no dejar credenciales hardcodeadas en el repositorio.
