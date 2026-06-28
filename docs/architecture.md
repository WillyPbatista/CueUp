# Arquitectura de CueUp

## Filosofia

El proyecto sigue una arquitectura basada en funcionalidades (Feature-Based Architecture), favoreciendo la separacion de responsabilidades y la escalabilidad.

---

## Estructura

```txt
src/
├── app/
├── assets/
├── components/
├── features/
├── hooks/
├── layouts/
├── lib/
├── pages/
├── router/
├── services/
├── stores/
├── styles/
├── types/
└── utils/
```

---

## Flujo de datos

```txt
UI
↓
Feature
↓
Hook
↓
Service
↓
Supabase
↓
Estado
↓
Render
```

---

## Pendiente de documentar

- Gestion de estado.
- Autenticacion.
- Arquitectura de Supabase.
- Rutas protegidas.
- Estrategia de componentes.
