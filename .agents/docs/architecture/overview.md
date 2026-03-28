# Arquitectura General

## Diagrama de Flujo

```
┌─────────────┐     HTTP/REST      ┌──────────────┐     SQL       ┌──────────┐
│   Vue 3     │ ═══════════════════│   Symfony    │ ══════════════│   DB     │
│  (Pinia)    │    JWT Token       │   (API)      │   Doctrine    │ Postgre  │
└─────────────┘                    └──────────────┘               └──────────┘
      │                                    │
      │ LocalStorage                       │
      ▼                                    ▼
┌─────────────┐                    ┌──────────────┐
│   Token     │                    │   Entities   │
│   User      │                    │   Repos      │
│   Expires   │                    │   Services   │
└─────────────┘                    └──────────────┘
```

## Capas del Frontend

```
View (Vue) → Store (Pinia) → Service → Axios → API
                ↓
           localStorage (persistencia)
```

| Capa | Responsabilidad | Ejemplo |
|------|-----------------|---------|
| **View** | UI, eventos, mostrar datos | `UsersView.vue` |
| **Store** | Estado global, acciones | `authStore.login()` |
| **Service** | Llamadas API, lógica HTTP | `userService.getAll()` |
| **API** | Config Axios, interceptores | `apiClient` |

## Autenticación

Ver detalles en: [auth-flow.md](auth-flow.md)

Resumen:
1. Login → POST `/login` → devuelve JWT
2. Token guardado en `localStorage` (`overworkout_token`)
3. Axios interceptor añade `Authorization: Bearer <token>`
4. 401 → logout automático + redirect a `/login`

## Manejo de Errores

| Tipo | Frontend | Backend |
|------|----------|---------|
| 401 Unauthorized | Logout + redirect | Token inválido/expirado |
| 403 Forbidden | Mostrar mensaje | Sin permisos (rol) |
| 422 Validation | Mostrar errores campo | Datos inválidos |
| 500+ | Mensaje genérico "Error servidor" | Error interno |

## Convenciones de Nombres

| Elemento | Convención | Ejemplo |
|----------|------------|---------|
| Componentes | PascalCase | `UserCard.vue` |
| Composables | camelCase con `use` | `useAuth.js` |
| Stores | camelCase con `Store` | `authStore` |
| Vistas | PascalCase + `View` | `UsersView.vue` |
| Servicios | camelCase | `userService` |
