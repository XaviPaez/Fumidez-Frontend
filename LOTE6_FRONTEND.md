# Lote 6 - Frontend técnico

## Cambios
- Axios quedó encapsulado en una única instancia `api` (`src/config/api.js`).
- JWT se agrega en un único interceptor y un 401 limpia la sesión y lleva al login.
- Se añadió `VITE_API_TIMEOUT_MS` (15 s por defecto).
- Se corrigió el menú móvil para que las opciones se apilen al abrir el menú hamburguesa.
- Se limpió la ruta `/inicio` que tenía `meta` duplicado y se agregó fallback para rutas inexistentes.
- La pantalla de cambio de contraseña dinámica ya no muestra el Header por error.
- Logout elimina token, tipo e id de usuario.
- Se eliminaron dependencias no utilizadas: FullCalendar, Quasar, Bootstrap-Vue, Moment, Dayjs, vue-cal, v-calendar, vue2-calendar, vue3-calendar, vue-toasted, router y otras auxiliares no referenciadas.
- Se retiró `server.js`/Express porque el frontend se desplegará como archivos estáticos (S3 + CloudFront).

## Validaciones realizadas
- `node --check` sobre todos los archivos `.js`: OK.
- extracción y validación de todos los bloques `<script>` de `.vue`: OK.
- `package-lock.json` regenerado en modo offline y consistente con `package.json`: OK.
- no quedan llamadas `axios.*` fuera del cliente central: OK.
- no quedan imports de las dependencias retiradas: OK.

## Build pendiente
El entorno de análisis no contiene el tarball de `xlsx` en caché, por lo que `npm ci --offline` no puede reconstruir `node_modules`. En un equipo con acceso a npm ejecutar:

```bash
npm ci
npm run build
```
