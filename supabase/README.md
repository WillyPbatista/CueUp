# Supabase

Esta carpeta contiene el schema versionado de CueUp.

## Estructura

```txt
supabase/
  migrations/
    202607040001_initial_multiplayer_schema.sql
  seed.sql
```

## Como aplicar la migracion

Desde el dashboard de Supabase, abre el SQL editor y ejecuta el contenido de:

```txt
supabase/migrations/202607040001_initial_multiplayer_schema.sql
```

Mas adelante podemos instalar y usar Supabase CLI para aplicar migraciones con comandos.

## Que crea

- Enums para estado de sala, asiento, estado de partida y tipo de evento.
- Tablas `profiles`, `rooms`, `room_players`, `matches` y `game_events`.
- Indices para consultas frecuentes.
- Triggers para `updated_at`.
- RLS y politicas iniciales.

## Nota

La migracion asume que los jugadores tendran usuario de Supabase Auth. Por eso varias politicas usan `auth.uid()`.
