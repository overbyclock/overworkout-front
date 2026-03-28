# Estructura de Carpetas

```
src/
├── assets/              # Estilos globales, imágenes
│   └── global.css       # Variables CSS, overrides Quasar
├── components/          # Componentes reutilizables
│   ├── admin/          # Específicos admin
│   ├── common/         # Compartidos (AppDialog, LoadingSpinner)
│   ├── icons/          # Iconos custom
│   └── user/           # Específicos usuario
├── layouts/             # Layouts de página
│   ├── AdminLayout.vue # Sidebar + header
│   └── UserLayout.vue  # Layout simple
├── router/              # Configuración de rutas
│   ├── index.js        # Router principal
│   ├── admin-routes.js # Rutas admin
│   ├── user-routes.js  # Rutas usuario
│   └── guards.js       # Guards de autenticación
├── services/            # Llamadas a API
│   ├── api.js          # Config Axios + interceptors
│   ├── auth.js         # Servicio de auth
│   └── index.js        # Exportaciones
├── stores/              # Pinia stores
│   └── auth.js         # Store de autenticación
├── utils/               # Utilidades
│   └── constants.js    # Endpoints, keys, roles
├── views/               # Páginas (una por ruta)
│   ├── admin/          # Vistas admin
│   ├── user/           # Vistas usuario
│   └── LoginView.vue   # Login
├── App.vue              # Root component
└── main.js              # Entry point
```

## ¿Dónde poner...?

| Si necesitas crear... | Va en... | Ejemplo |
|----------------------|----------|---------|
| Nueva página | `views/admin/` o `views/user/` | `ExercisesView.vue` |
| Componente reutilizable | `components/common/` | `DataTable.vue` |
| Componente solo admin | `components/admin/` | `UserForm.vue` |
| Llamada API nueva | `services/` | `exerciseService.js` |
| Store nuevo | `stores/` | `exerciseStore.js` |
| Constante global | `utils/constants.js` | `ENDPOINTS.EXERCISES` |

## Convenciones de Archivos

| Tipo | Convención | Ubicación |
|------|------------|-----------|
| Vistas | `*View.vue` | `views/**/` |
| Layouts | `*Layout.vue` | `layouts/` |
| Componentes | PascalCase | `components/**/` |
| Servicios | camelCase | `services/` |
| Stores | camelCase | `stores/` |

## Imports con Alias `@/`

```javascript
// ✅ Correcto
import { api } from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import MyComponent from '@/components/common/MyComponent.vue'

// ❌ Evitar rutas relativas complejas
import { api } from '../../../services/api'
```
