# OverWorkout Admin

Panel de administración para gestión de entrenamientos fitness. Construido con Vue 3, Quasar Framework y Vite.

## Características

- 🔐 Autenticación JWT con roles (ADMIN, USER)
- 📊 Dashboard con estadísticas
- 👥 Gestión de usuarios
- 🏋️ Gestión de ejercicios y equipamiento
- 📚 Programas de entrenamiento con niveles
- 🎨 Tema oscuro con diseño moderno
- 📱 Responsive design

## Tech Stack

| Tecnología | Versión |
|------------|---------|
| Vue | 3.5+ |
| Vite | 7.0+ |
| Quasar | 2.18+ |
| Pinia | 3.0+ |
| Vue Router | 4.5+ |
| Vitest | 4.1+ |

## Estructura del Proyecto

```
src/
├── components/          # Componentes Vue
│   ├── common/         # Componentes reutilizables (PageHeader, DataTable, etc.)
│   ├── admin/          # Componentes específicos de admin
│   │   ├── cards/     # Cards de ejercicios, entrenamientos, programas
│   │   └── program/   # Componentes de detalle de programa
│   └── layout/        # AppHeader, AppSidebar
├── composables/        # Lógica reutilizable (useCRUD, useFilters, etc.)
├── stores/            # Pinia stores
├── services/          # API services
├── views/             # Páginas
│   ├── admin/        # Vistas de administración
│   └── user/         # Vistas de usuario
├── router/            # Configuración de rutas
└── assets/            # Estilos globales y assets
```

## Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build producción
npm run build

# Testing
npm run test           # Ejecutar tests una vez
npm run test:watch     # Ejecutar tests en modo watch
npm run test:coverage  # Tests con cobertura

# Linting y formateo
npm run lint           # ESLint con auto-fix
npm run format         # Prettier
```

## Configuración del Entorno

### Requisitos
- Node.js: `^20.19.0 || >=22.12.0`
- npm: Incluido con Node.js

### Variables de Entorno
El proyecto espera el backend en `http://localhost:8000`. Configurable en `src/utils/constants.js`.

## Testing

El proyecto incluye Vitest para testing unitario y Playwright para E2E:

```bash
# Unit tests
npm run test              # 116 tests
npm run test:watch        # Modo watch
npm run test:coverage     # Cobertura

# E2E tests (Playwright)
npm run test:e2e          # Tests E2E
npm run test:e2e:ui       # Modo UI interactivo
```

### Cobertura de Tests

- **Unitarios**: 116 tests (useCRUD, useHelpers, constants, api-helpers)
- **E2E**: 7 tests (auth, navigation, smoke)

## CI/CD

El proyecto incluye GitHub Actions configurado:

```bash
# Workflows activos:
# - ci.yml: Lint + Tests + Build en cada push/PR
# - deploy.yml: Deploy automático a GitHub Pages
```

Para activar el deploy:
1. Ve a Settings → Pages → Source: GitHub Actions
2. Edita `vite.config.js` y descomenta: `base: '/overworkout-front/'`
3. Haz push a `main`

### Estructura de Tests
```
src/
├── components/common/__tests__/    # Tests de componentes
├── composables/__tests__/          # Tests de composables
└── stores/__tests__/               # Tests de stores
```

## Arquitectura

### Componentes Reutilizables
- `PageHeader` - Header de página con breadcrumbs y acciones
- `StatsCards` - Tarjetas de estadísticas
- `SearchFilters` - Búsqueda y filtros
- `DataTable` - Tabla de datos con ordenamiento
- `FormDialog` - Diálogo de formularios
- `FilterPills` - Filtros visuales tipo pills

### Composables
- `useCRUD` - Operaciones CRUD estándar
- `useFilters` - Filtrado de listas con debounce
- `usePagination` - Paginación de tablas
- `useForm` - Manejo de formularios
- `useSearch` - Búsqueda con debounce

### Stores (Pinia)
- `auth` - Autenticación y sesión
- `users` - Gestión de usuarios
- `exercises` - Gestión de ejercicios
- `trainings` - Gestión de entrenamientos
- `programs` - Gestión de programas

## Estilos

### CSS Común
Los estilos compartidos están en `src/assets/common-styles.css`:
- Layouts de página (`.page-container`, `.page-content`)
- Grids de formularios (`.form-grid`)
- Contenedores de filtros (`.filters-container`)
- Cards de estadísticas (`.stat-mini`)

### Variables CSS
```css
--color-primary: #ff8f38;      /* Naranja - brand */
--color-secondary: #212529;    /* Gris oscuro */
--color-accent: #38b2ac;       /* Turquesa */
--color-dark: #181c1f;         /* Fondo */
```

## Convenciones de Código

- **Vue**: Composition API con `<script setup>`
- **Nombres**: PascalCase para componentes, camelCase para funciones
- **Imports**: Usar `@/` alias para rutas desde `src/`
- **Estilos**: Scoped cuando sea posible, comunes en `common-styles.css`

## Contribuir

1. Crear rama feature: `git checkout -b feature/nombre`
2. Hacer cambios siguiendo las convenciones
3. Ejecutar tests: `npm run test`
4. Ejecutar lint: `npm run lint`
5. Commit y push

## Licencia

Proyecto privado - OverWorkout Team
