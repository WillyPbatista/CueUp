# Convencion de commits

## Formato

```txt
tipo(scope): descripcion
```

## Tipos

- `feat`: nueva funcionalidad.
- `fix`: correccion de errores.
- `docs`: documentacion.
- `style`: cambios de formato.
- `refactor`: mejora interna sin cambiar comportamiento.
- `test`: pruebas.
- `chore`: mantenimiento.

## Scopes recomendados

- `docs`
- `app`
- `ui`
- `router`
- `auth`
- `lobby`
- `rooms`
- `game`
- `phaser`
- `physics`
- `rules`
- `supabase`
- `multiplayer`
- `deploy`

## Ejemplos

```txt
docs(tasks): add guided project backlog
feat(router): add initial app routes
feat(lobby): create room list page
feat(supabase): add client configuration
feat(phaser): mount game scene in react
fix(multiplayer): handle disconnected player presence
refactor(game): extract shot state store
```

## Reglas practicas

- Un commit debe representar una tarea pequena.
- No mezclar documentacion, UI y logica grande en el mismo commit si pueden separarse.
- Antes de commitear, ejecutar `npm run quality`.
- Si una tarea enseña algo importante, actualizar `docs/learning-notes.md`.
