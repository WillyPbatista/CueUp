# Roadmap de CueUp

## Objetivo general

Construir un juego online multiplayer de billar para 2 jugadores con React, TypeScript, Vite, Phaser y Supabase.

Cada modulo debe terminar con:

- Codigo o documentacion verificable.
- Una nota de aprendizaje.
- Un commit pequeno.
- Una tarea marcada como completada en `docs/tasks/`.

## 01. Foundation

- [x] Crear proyecto Vite.
- [x] Configurar TypeScript.
- [x] Definir estructura base.
- [x] Configurar ESLint.
- [x] Configurar Prettier.
- [x] Configurar Husky.
- [x] Configurar lint-staged.
- [x] Crear documentacion inicial.
- [ ] Crear carpeta `supabase/`.
- [ ] Crear carpeta `scripts/`.

## 02. React Fundamentals

- [ ] Entender componentes, JSX, props y estado.
- [ ] Crear componentes UI basicos.
- [ ] Practicar hooks fundamentales.
- [ ] Crear rutas con React Router.
- [ ] Crear paginas Home, Lobby, Game, Settings y NotFound.

## 03. UI System

- [x] Instalar Tailwind.
- [ ] Definir tokens visuales.
- [ ] Crear componentes compartidos.
- [ ] Crear layout principal.
- [ ] Preparar responsive.
- [ ] Crear tema oscuro como base.

## 04. Application Architecture

- [ ] Organizar providers globales.
- [ ] Definir convenciones de features.
- [ ] Separar pages, features, services y stores.
- [ ] Definir tipos compartidos.
- [ ] Documentar flujo de datos.

## 05. Supabase

- [ ] Crear proyecto Supabase.
- [ ] Configurar variables de entorno.
- [ ] Crear `supabaseClient`.
- [ ] Disenar tablas iniciales.
- [ ] Definir politicas RLS.
- [ ] Crear migraciones.
- [ ] Probar CRUD de salas.

## 06. Multiplayer

- [ ] Crear lobby realtime.
- [ ] Crear y unirse a salas.
- [ ] Sincronizar presencia.
- [ ] Sincronizar ready state.
- [ ] Manejar desconexion.
- [ ] Manejar reconexion.

## 07. Phaser

- [ ] Instalar Phaser.
- [ ] Montar escena dentro de React.
- [ ] Crear mesa.
- [ ] Renderizar bolas.
- [ ] Renderizar taco.
- [ ] Capturar input del jugador.

## 08. Pool Engine

- [ ] Modelar Ball, Cue, Rail y Pocket.
- [ ] Implementar vectores.
- [ ] Implementar velocidad y friccion.
- [ ] Implementar colisiones bola-bola.
- [ ] Implementar colisiones con bandas.
- [ ] Implementar troneras.

## 09. Game Rules

- [ ] Definir turnos.
- [ ] Detectar scratch.
- [ ] Definir grupos de bolas.
- [ ] Implementar regla de bola 8.
- [ ] Detectar ganador.
- [ ] Reiniciar partida.

## 10. Polish

- [ ] Sonidos.
- [ ] Animaciones.
- [ ] Estados de carga.
- [ ] Feedback de conexion.
- [ ] Ajustes de usuario.
- [ ] Responsive final.

## 11. Deployment

- [ ] Configurar variables de entorno.
- [ ] Crear build de produccion.
- [ ] Configurar Vercel.
- [ ] Conectar Supabase.
- [ ] Probar partida online.

## 12. Documentation

- [x] Crear documentacion base.
- [x] Crear guia de tareas.
- [ ] Documentar Supabase.
- [ ] Documentar networking.
- [ ] Documentar fisica.
- [ ] Documentar reglas.
- [ ] Documentar deploy.

## Por donde vamos exactamente

Estamos al final del Modulo 1 y entrando al Modulo 2.

La foundation tecnica principal ya existe. El siguiente paso recomendado es `02.01-react-components.md`: crear los primeros componentes reutilizables y luego pasar a rutas y paginas. Despues de eso conviene conectar Supabase antes de tocar Phaser, porque el lobby multiplayer sera la columna vertebral del juego.
