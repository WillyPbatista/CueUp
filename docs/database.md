# Base de datos

## Objetivo

Supabase guardara usuarios, salas, jugadores, partidas, eventos de juego y resultados. Tambien se usara Realtime para sincronizar lobby, presencia y eventos multiplayer.

## Modelo inicial propuesto

### profiles

Perfil publico de cada usuario.

- `id`: uuid, referencia a `auth.users`.
- `username`: nombre visible.
- `avatar_url`: opcional.
- `created_at`: fecha de creacion.

### rooms

Sala previa a una partida.

- `id`: uuid.
- `code`: codigo corto para invitar.
- `status`: `waiting`, `ready`, `playing`, `finished`, `cancelled`.
- `host_id`: usuario creador.
- `created_at`: fecha de creacion.
- `updated_at`: fecha de actualizacion.

### room_players

Jugadores conectados a una sala.

- `id`: uuid.
- `room_id`: referencia a `rooms`.
- `user_id`: referencia a `profiles`.
- `seat`: `player_1` o `player_2`.
- `ready`: boolean.
- `connected`: boolean.
- `joined_at`: fecha de union.

### matches

Partida activa o finalizada.

- `id`: uuid.
- `room_id`: referencia a `rooms`.
- `player_1_id`: referencia a `profiles`.
- `player_2_id`: referencia a `profiles`.
- `status`: `playing`, `finished`, `abandoned`.
- `winner_id`: usuario ganador, opcional.
- `started_at`: fecha de inicio.
- `finished_at`: fecha de fin, opcional.

### game_events

Eventos sincronizados y persistidos.

- `id`: uuid.
- `match_id`: referencia a `matches`.
- `player_id`: jugador que produjo el evento.
- `type`: `shot`, `turn_change`, `scratch`, `ball_pocketed`, `game_over`.
- `payload`: jsonb con datos del evento.
- `created_at`: fecha del evento.

### match_snapshots

Snapshots opcionales para reconstruir partidas o reconectar jugadores.

- `id`: uuid.
- `match_id`: referencia a `matches`.
- `state`: jsonb con estado completo del juego.
- `created_at`: fecha del snapshot.

## Realtime

Canales previstos:

- `rooms`: crear, listar y actualizar salas disponibles.
- `room:{roomId}`: presencia, ready state y cambios previos a partida.
- `match:{matchId}`: eventos de juego, turnos y snapshots.

## RLS pendiente

Politicas a definir:

- Un usuario puede leer su propio perfil y perfiles publicos necesarios.
- Solo el host puede cancelar una sala.
- Solo jugadores de una sala pueden leerla.
- Solo jugadores de una partida pueden insertar eventos.
- Nadie puede modificar eventos historicos.

## Pendiente

- Crear proyecto Supabase.
- Crear migraciones.
- Definir enums.
- Definir indices.
- Probar RLS con usuarios reales.
- Documentar variables de entorno.
