# Arquitectura de CueUp

## Vision

CueUp sera un juego online multiplayer de billar para 2 jugadores. La aplicacion combina una interfaz React para navegacion, lobby y estado de usuario, una escena Phaser para el gameplay, y Supabase para autenticacion, persistencia y sincronizacion realtime.

## Principios

- Feature-first: el codigo se agrupa por funcionalidad antes que por tipo tecnico.
- Separacion clara: React controla la app, Phaser controla el juego, Supabase controla datos y realtime.
- Estado explicito: cada dato debe tener un dueno claro.
- Tareas pequenas: cada avance debe poder aprenderse, probarse y commitearse de forma aislada.
- Documentacion viva: los docs cambian junto con el producto.

## Estructura objetivo

```txt
cueUp/
  docs/
    tasks/
  public/
  scripts/
  supabase/
    migrations/
    seed.sql
  src/
    app/
    assets/
    components/
    features/
      auth/
      lobby/
      rooms/
      game/
      multiplayer/
    game/
      phaser/
      physics/
      rules/
    hooks/
    layouts/
    lib/
      supabase/
    pages/
    router/
    services/
    stores/
    styles/
    types/
    utils/
```

## Estructura actual

```txt
src/
  assets/
  components/
  features/
  hooks/
  layouts/
  lib/
  pages/
  router/
  services/
  stores/
  styles/
  types/
  utils/
  App.tsx
  main.tsx
```

La base de carpetas ya existe, pero todavia falta llenarla con funcionalidades reales.

## Capas

### App

Responsable de providers globales, router, layout raiz y configuracion de la aplicacion.

### Pages

Pantallas completas:

- Home
- Lobby
- Room
- Game
- Settings
- NotFound

### Features

Funcionalidades de producto:

- `auth`: login, logout, usuario actual.
- `lobby`: listado de salas y creacion de partidas.
- `rooms`: estado previo a partida, jugadores conectados y ready state.
- `game`: pantalla que monta Phaser y muestra HUD.
- `multiplayer`: sincronizacion de eventos, turnos y conexion.

### Game

Dominio especifico de billar:

- `phaser`: escena, assets, input y render.
- `physics`: bolas, colisiones, friccion, bandas y troneras.
- `rules`: turnos, faltas, bola 8, ganador y reinicio.

### Services

Acceso a APIs externas y persistencia. Supabase debe vivir aqui o en `lib/supabase` como cliente compartido.

### Stores

Estado cliente que no pertenece directamente a Supabase, por ejemplo UI, preferencias locales, estado temporal del tiro o pantalla actual.

## Flujo de datos

```txt
User input
  -> React UI
  -> Feature hook/store
  -> Service
  -> Supabase
  -> Realtime event
  -> Store/Game scene
  -> Render React + Phaser
```

## Multiplayer

El primer enfoque sera servidor ligero con Supabase:

- La sala vive en base de datos.
- Los jugadores se unen por room code.
- Realtime sincroniza presencia, ready state, turnos y eventos.
- El cliente renderiza el juego.
- Los eventos importantes se guardan para reconstruir o auditar la partida.

Mas adelante se decidira si la fisica completa queda sincronizada por eventos deterministas o por snapshots de estado.

## Estado actual exacto

Ya esta hecho:

- Proyecto React + TypeScript + Vite.
- Dependencias principales instaladas.
- Tailwind configurado.
- ESLint, Prettier, Husky y lint-staged presentes.
- Carpetas base de arquitectura creadas.
- Pantalla inicial minima en `src/App.tsx`.
- Documentacion inicial.

Falta:

- Router real.
- Componentes UI base.
- Paginas principales.
- Supabase client y variables de entorno.
- Modelo de datos.
- Integracion Phaser.
- Lobby multiplayer.
- Motor de billar.
- Reglas de juego.
- Tests.
- Deploy.
