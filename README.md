# CueUp

CueUp es un juego online multiplayer de billar para 2 jugadores, construido con React, TypeScript, Vite, Phaser y Supabase.

El objetivo no es solo terminar el juego. La idea es construirlo como un proyecto profesional y convertir cada tarea en una pequena leccion de React, arquitectura, multiplayer, realtime, fisica de juego y despliegue.

## Estado actual

El proyecto ya tiene una base inicial:

- Proyecto Vite con React y TypeScript.
- ESLint, Prettier, Husky y lint-staged configurados.
- Tailwind instalado y conectado a Vite.
- Estructura base en `src/`.
- Documentacion inicial en `docs/`.

La siguiente etapa es convertir la pantalla inicial en una aplicacion navegable con UI base, rutas, lobby y preparacion para Supabase.

## Stack tecnologico

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Phaser
- Supabase Auth
- Supabase Database
- Supabase Realtime
- React Query
- Zustand
- ESLint
- Prettier
- Husky
- lint-staged

## Instalacion

```bash
npm install
npm run dev
```

## Comandos

```bash
npm run lint
npm run format:check
npm run build
npm run quality
```

## Documentacion

- Vision y roadmap: [docs/roadmap.md](docs/roadmap.md)
- Arquitectura: [docs/architecture.md](docs/architecture.md)
- Base de datos: [docs/database.md](docs/database.md)
- Tareas guiadas: [docs/tasks/README.md](docs/tasks/README.md)
- Commits: [docs/commits.md](docs/commits.md)
- Notas de aprendizaje: [docs/learning-notes.md](docs/learning-notes.md)

## Flujo de trabajo

La rama `main` representa el estado estable. Las funcionalidades deben avanzar en ramas `feature/*` y cada tarea debe terminar con un commit pequeno y entendible.

Antes de subir cambios:

```bash
npm run quality
```

## Licencia

MIT
