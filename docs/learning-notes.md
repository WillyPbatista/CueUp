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
