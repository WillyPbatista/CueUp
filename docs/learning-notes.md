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
