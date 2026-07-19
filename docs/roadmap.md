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

- [x] Crear lobby realtime.
- [x] Crear y unirse a salas.
- [x] Sincronizar presencia.
- [x] Sincronizar ready state.
- [ ] Manejar desconexion.
- [ ] Manejar reconexion.
- [ ] Crear partida desde sala ready.

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

Estamos cerrando `06.01`: lobby realtime con salas, ready state y presencia entre dos navegadores.

La siguiente tarea recomendada es `06.02-start-match-from-room.md`: convertir una sala con 2 jugadores ready en una fila `matches`, cambiar `rooms.status` a `playing` y navegar ambos clientes a `/game/:matchId`. Despues de eso conviene entrar a `07.01-phaser-introduction.md`, porque Phaser ya tendra una partida real desde la cual montarse.
