# Learning Notes

Este archivo es la bitacora del proyecto. Cada tarea debe dejar una nota corta con lo aprendido, dudas y decisiones.

## Estado actual

### Que ya aprendi

- Como funciona Vite como entorno de desarrollo.
- Como inicia una aplicacion React desde `main.tsx`.
- Que `App.tsx` es el primer componente visible.
- Como organizar una base de carpetas profesional.
- Diferencia entre ESLint, Prettier, Husky y lint-staged.
- Como Tailwind se conecta al proyecto.

### Dudas abiertas

- Como funciona React Router en una SPA.
- Cuando usar hooks propios.
- Como se comunica React con Supabase.
- Como se integra Phaser dentro de un componente React.
- Que partes del multiplayer deben guardarse en base de datos y cuales solo viajar por realtime.

### Conceptos importantes

- JSX
- Componentes
- Props
- Estado
- Hooks
- Renderizado
- Feature-first architecture
- Supabase Realtime
- Game loop
- Colisiones

## Plantilla para nuevas notas

```md
## YYYY-MM-DD - Nombre de la tarea

### Aprendi

- ...

### Me costo

- ...

### Decisiones

- ...

### Siguiente duda

- ...
```

## 2026-07-04 - 02.03 Routing

### Aprendi

- Una pagina representa una pantalla completa conectada a una ruta.
- Un componente compartido representa una pieza reusable de UI, como Button, Card, Badge o Input.
- El layout base permite compartir navegacion y estructura entre rutas.

### Decisiones

- `App.tsx` ahora solo monta `RouterProvider`.
- Las rutas viven en `src/router/AppRouter.tsx`.
- Las pantallas iniciales viven en `src/pages/`.

### Siguiente duda

- Como proteger rutas cuando agreguemos Supabase Auth.

## 2026-07-04 - 02.02 React Hooks

### Aprendi

- `useState` guarda datos que afectan lo que React pinta. Cuando llamas su setter, React vuelve a renderizar el componente con el nuevo valor.
- `useEffect` sirve para efectos secundarios: timers, subscriptions, listeners del navegador, llamadas a APIs o sincronizacion externa. Puede devolver una funcion de limpieza.
- `useMemo` guarda el resultado de un calculo derivado y lo recalcula solo cuando cambian sus dependencias. No reemplaza al estado.
- `useCallback` guarda una funcion entre renders. Es util cuando esa funcion se pasa a componentes hijos o se usa como dependencia de otro hook.
- `useRef` guarda una referencia mutable que no causa renders. Sirve para acceder a elementos del DOM o recordar valores internos entre renders.
- Un hook propio es una funcion que empieza con `use` y encapsula logica reutilizable. Puede usar otros hooks por dentro.

### Cuando un valor debe estar en estado

- Debe estar en `useState` si cambia con interacciones del usuario, timers, respuestas de API o eventos, y ese cambio debe verse en pantalla.
- Puede ser una constante si no cambia durante la vida del componente.
- Puede ser un valor derivado si se calcula desde otro estado. En ese caso puede ser una variable normal o `useMemo` si el calculo es costoso o quieres hacerlo explicito.
- Puede ir en `useRef` si necesitas recordarlo entre renders, pero cambiarlo no debe repintar la UI.

### Ejemplos en CueUp

- `useState`: score local, nombre del jugador, estado de formulario.
- `useEffect`: timer de turno, subscription de Supabase Realtime, listener de teclado.
- `useMemo`: calcular rank, power, lista filtrada de salas.
- `useCallback`: handlers como `createRoom`, `joinRoom`, `shoot`.
- `useRef`: enfocar inputs, guardar instancia de Phaser, recordar ultimo timestamp.
- Hook propio: `useToggle`, `useRoomPresence`, `useShotPower`.

### Decisiones

- `src/pages/Playground.tsx` queda como laboratorio temporal de hooks.
- La ruta temporal `/playground` permite probar los ejemplos desde la app.
- Las notas quedan duplicadas aqui porque el playground se borrara despues.

### Siguiente duda

- Como separar hooks de practica de hooks reales dentro de `src/hooks/` o `src/features/`.

## 2026-07-04 - 05.01 Supabase Setup

### Aprendi

- `VITE_SUPABASE_URL` debe ser solo la URL del proyecto, por ejemplo `https://project.supabase.co`.
- No se debe agregar `/rest/v1` a la URL porque `@supabase/supabase-js` construye esa ruta internamente.
- `VITE_SUPABASE_ANON_KEY` puede vivir en el frontend porque esta pensada para usarse con politicas RLS.
- La `service_role key` nunca debe ir en React ni en `.env.local` del cliente, porque salta RLS y da permisos altos.
- `DATA: []` con `ERROR: null` significa que la conexion funciono, pero no hay filas visibles para esa consulta.

### Decisiones

- El cliente oficial vive en `src/lib/supabase/client.ts`.
- `.env.local` queda ignorado por git.
- La prueba temporal usa `auth.getSession()` y una lectura limitada de `rooms`.

### Siguiente duda

- Como definir RLS para que usuarios anonimos o autenticados puedan ver/crear salas de forma segura.

## 2026-07-04 - 05.02 Database Design

### Aprendi

- Una tabla guarda una entidad principal del dominio, por ejemplo `rooms` para salas y `matches` para partidas.
- Una relacion conecta tablas con foreign keys. Ejemplo: `room_players.room_id` apunta a `rooms.id`.
- Un enum limita una columna a valores conocidos, como `waiting`, `playing` o `finished`.
- Una migracion es un archivo SQL versionado que permite recrear el schema y entender como cambio la base de datos.
- RLS significa Row Level Security. Aunque una tabla exista, las politicas deciden que filas puede leer o modificar cada usuario.
- `jsonb` sirve para eventos flexibles como tiros, bolas metidas o snapshots parciales sin cambiar el schema por cada detalle del juego.

### Por que no toda la fisica vive en columnas

- La fisica cambia muchas veces por segundo y seria muy costoso escribir cada posicion de cada bola como columnas normales.
- Muchas propiedades del juego son temporales y solo importan durante la simulacion local.
- Para multiplayer conviene guardar eventos importantes, como `shot`, `scratch` o `ball_pocketed`, y reconstruir estado desde esos eventos.
- Si necesitamos reconexion, podemos guardar snapshots en JSONB mas adelante sin volver rigido el modelo.

### Decisiones

- `profiles` se conecta con `auth.users`.
- `rooms` representa el lobby previo a la partida.
- `room_players` separa los jugadores conectados de la sala para soportar ready state y reconnect.
- `matches` representa la partida formal.
- `game_events` guarda eventos importantes de gameplay como historial sincronizable.
- La primera version de RLS permite leer lobby y eventos, pero exige usuario autenticado para crear salas, unirse y escribir eventos.

### Siguiente duda

- Como aplicar esta migracion con Supabase CLI en vez de pegar SQL manualmente en el dashboard.

## 2026-07-04 - Auth minima para lobby

### Aprendi

- Para crear salas con RLS necesitamos un `auth.uid()`, incluso si todavia no queremos email/password.
- Supabase puede usar sesiones anonimas para identificar un jugador sin pedir registro completo.
- El `profile` es la parte publica del jugador: username, avatar y datos que la app puede mostrar.
- La sesion anonima vive en Supabase Auth; el nombre del jugador vive en `profiles`.
- `HomePage` es mejor lugar que `SettingsPage` para pedir el username inicial, porque es el primer bloqueo antes de entrar al lobby.

### Decisiones

- Se creo `src/features/auth/` para separar la logica de auth de las paginas.
- `authService.ts` habla con Supabase.
- `usePlayerProfile.ts` adapta esa logica a React.
- `HomePage` permite guardar/cambiar jugador y navegar al lobby.
- Se quito `Settings` del router porque todavia no aporta una configuracion real.

### Importante

- En Supabase Dashboard debe estar habilitada la opcion de anonymous sign-ins.
- Si anonymous auth no esta habilitado, la UI mostrara un error indicando que debe activarse.

### Siguiente duda

- Como proteger `LobbyPage` para que redirija a Home si no existe `profile`.

## 2026-07-18 - 06.01 Realtime Lobby

### Aprendi

- Leer de base de datos es traer un snapshot actual: por ejemplo `listWaitingRooms()` o `getRoomPlayers(roomId)`.
- Suscribirse a cambios realtime es escuchar eventos futuros: cuando otra pestana crea una sala o un jugador entra, Supabase avisa y la UI refresca.
- `rooms` representa la sala visible en el lobby.
- `room_players` representa quien esta dentro de una sala, que asiento ocupa y si esta listo.
- Para entrar a una sala se inserta una fila en `room_players`.
- Para salir de una sala se elimina la fila de ese jugador en `room_players`.
- Para marcar ready se actualiza `room_players.ready` del jugador actual.

### Decisiones

- `LobbyPage` usa `useLobby` y no habla directamente con Supabase.
- `RoomPage` carga jugadores con `getRoomPlayers(roomId)` y se suscribe a cambios de `room_players`.
- El boton `Back to Lobby` llama `backToLobby(roomId, userId)` antes de navegar.
- El boton `Ready` alterna entre ready y not ready con `setCurrentPlayerReady`.
- La sala se limita a 2 jugadores usando lectura previa de asientos y constraints de base de datos.

### Siguiente duda

- Que debe ocurrir cuando ambos jugadores estan ready: crear `matches`, cambiar `rooms.status` a `playing` y navegar a `/game/:matchId`.

## 2026-07-19 - Ready status realtime en RoomPage

### Aprendi

- `getRoomPlayerReadyStatus(roomId)` lee un snapshot del estado actual de ready en una sala.
- `subscribeToRoomPlayers(roomId, onChange)` escucha cambios futuros en `room_players` filtrados por esa sala.
- Para que otra pestana vea el cambio de ready, el flujo es: update en BBDD, evento realtime, reload de jugadores, render nuevo.
- La columna `connected` se puede actualizar al montar/desmontar `RoomPage` para mostrar si el jugador esta online dentro de esa sala.
- El canal de una sala debe incluir el `roomId` en el nombre y en el filtro para no reaccionar a cambios de otras salas.
- Para recibir Postgres Changes, la tabla debe estar en la publicacion `supabase_realtime`; si no, la app puede leer/escribir pero no recibe eventos en vivo.
- `replica identity full` ayuda a que los eventos realtime incluyan suficiente informacion, especialmente para deletes o filtros sobre cambios.
- Presence sirve para saber que clientes estan conectados ahora mismo; es mejor que depender de un cleanup de React cuando alguien cierra la pestana.

### Decisiones

- El service mantiene la lectura (`getRoomPlayerReadyStatus`) separada de la suscripcion (`subscribeToRoomPlayers`).
- `useLobby` expone `roomReadyStatus` para que la UI no tenga que calcular todo a mano.
- `RoomPage` marca al jugador como conectado cuando entra a la pagina y como desconectado al salir.
- Se dejo un alias temporal `getRoomplayerReadySatus` apuntando al nombre correcto para no romper referencias mientras se corrige el typo.
- Se agrego una migracion para publicar `rooms` y `room_players` en Supabase Realtime.
- `RoomPage` muestra el estado del canal realtime para diagnosticar si la suscripcion esta activa.
- `RoomPage` usa un canal Presence por sala para pintar `Online/Offline` en vivo.

### Siguiente duda

- Decidir si `connected` debe quedarse como estado persistido o si basta con Presence y una columna `last_seen_at`.
