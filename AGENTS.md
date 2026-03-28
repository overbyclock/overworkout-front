# OverWorkout Admin - Project Guide for AI Agents

> **⚡ Para consultas rápidas, usa la documentación modular en `.agents/docs/`**
> 
> Índice: [`.agents/docs/README.md`](.agents/docs/README.md) | Frontend: [`.agents/docs/frontend/`](.agents/docs/frontend/) | Skills: [`.agents/skills/`](.agents/skills/)

## Project Overview

OverWorkout Admin is a Vue 3-based administrative panel for a fitness/workout management application. It provides role-based access control for administrators and regular users to manage exercises, trainings, equipment, and users. The application features a dark-themed UI with Spanish as the primary interface language.

**Key Characteristics:**
- Single Page Application (SPA) built with Vue 3 and Vite
- Dark theme with orange (`#ff8f38`) as primary brand color
- Spanish language interface
- JWT-based authentication with role-based access (ADMIN, USER)
- Backend API expected at `http://localhost:8000`
- **IA-Friendliness Score: 85+** ✅

## Technology Stack

| Category | Technology |
|----------|------------|
| Framework | Vue 3 (Composition API) |
| Build Tool | Vite 7.x |
| UI Library | Quasar Framework 2.x |
| State Management | Pinia 3.x |
| Routing | Vue Router 4.x |
| HTTP Client | Axios |
| Styling | Sass/SCSS + CSS Variables |
| Testing | Vitest 4.x |
| Linting | ESLint 9.x with Vue plugin |
| Formatting | Prettier 3.x |

## Project Structure

```
src/
├── assets/                    # Global styles and static assets
│   ├── global.css            # CSS variables, theme overrides
│   └── common-styles.css     # Shared patterns (forms, layouts)
├── components/               # Reusable Vue components
│   ├── common/              # Shared UI components
│   │   ├── PageHeader.vue   # Page header with breadcrumbs
│   │   ├── StatsCards.vue   # Statistics cards
│   │   ├── SearchFilters.vue # Search and filter controls
│   │   ├── DataTable.vue    # Sortable data table
│   │   ├── FormDialog.vue   # Modal form wrapper
│   │   └── FilterPills.vue  # Visual filter pills
│   ├── admin/               # Admin-specific components
│   │   ├── cards/          # Entity cards
│   │   │   ├── ExerciseCard.vue
│   │   │   ├── TrainingCard.vue
│   │   │   └── ProgramCard.vue
│   │   └── program/        # Program detail components
│   │       ├── ProgramHeader.vue
│   │       ├── ProgramStats.vue
│   │       ├── LevelManager.vue
│   │       ├── UsersTab.vue
│   │       ├── SkillsTab.vue
│   │       ├── AchievementsTab.vue
│   │       └── AnalyticsTab.vue
│   ├── layout/             # Layout components
│   │   ├── AppHeader.vue   # Top navigation bar
│   │   └── AppSidebar.vue  # Side navigation menu
│   ├── icons/              # Icon components
│   └── user/               # User-specific components
├── composables/             # Reusable composition functions
│   ├── useCRUD.js          # CRUD operations
│   ├── useFilters.js       # Filtering logic
│   ├── usePagination.js    # Table pagination
│   ├── useForm.js          # Form handling
│   ├── useSearch.js        # Search with debounce
│   └── useHelpers.js       # Formatting utilities
├── constants/               # Domain constants
│   ├── index.js            # Centralized exports
│   ├── muscleGroups.js     # Muscle group definitions
│   ├── levels.js           # Difficulty levels
│   └── disciplines.js      # Sport disciplines
├── layouts/                 # Page layout components
│   ├── AdminLayout.vue     # Sidebar + header for admin
│   └── UserLayout.vue      # Simple layout for users
├── router/                  # Vue Router configuration
│   ├── index.js            # Main router setup
│   ├── admin-routes.js     # Admin route definitions
│   ├── user-routes.js      # User route definitions
│   └── guards.js           # Route guards (auth, role checks)
├── services/                # API service layer
│   ├── api.js              # Axios instance with interceptors
│   ├── auth.js             # Authentication service
│   └── index.js            # Service exports
├── stores/                  # Pinia stores
│   ├── auth.js             # Authentication store
│   ├── users.js            # Users store
│   ├── exercises.js        # Exercises store
│   ├── trainings.js        # Trainings store
│   └── programs.js         # Programs store
├── utils/                   # Utilities and constants
│   ├── constants.js        # API endpoints, storage keys, roles
│   └── api-helpers.js      # API Platform response parsing
├── views/                   # Page-level components
│   ├── admin/              # Admin pages
│   │   ├── UsersView.vue
│   │   ├── ExercisesView.vue
│   │   ├── EquipmentsView.vue
│   │   ├── TrainingsView.vue
│   │   ├── TrainingProgramsView.vue
│   │   └── TrainingProgramDetailView.vue
│   ├── user/               # User pages
│   │   └── HomeView.vue
│   └── LoginView.vue       # Login page
├── App.vue                  # Root component
└── main.js                  # Application entry point
```

## Development Environment

### Prerequisites
- **Node.js**: `^20.19.0 || >=22.12.0`
- **npm**: Comes with Node.js

### Available Scripts

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run ESLint with auto-fix
npm run lint

# Format code with Prettier
npm run format
```

### VS Code Setup

Recommended extensions (configured in `.vscode/extensions.json`):
- Vue.volar (Vue 3 official extension)
- dbaeumer.vscode-eslint
- EditorConfig.EditorConfig
- esbenp.prettier-vscode

VS Code settings enable:
- Auto-format on save with Prettier
- ESLint auto-fix on save
- File nesting for config files

## Code Style Guidelines

### EditorConfig (`.editorconfig`)
- Indent: 2 spaces
- Encoding: UTF-8
- Line endings: LF
- Max line length: 100 characters
- Trim trailing whitespace

### Prettier Configuration (`.prettierrc.json`)
```json
{
  "semi": false,
  "singleQuote": true,
  "printWidth": 100
}
```

### ESLint Configuration (`eslint.config.js`)
- Uses ESLint 9 flat config format
- Extends: `@eslint/js/recommended`, `eslint-plugin-vue/flat/essential`
- Files: `**/*.{js,mjs,jsx,vue}`
- Ignores: `dist/`, `dist-ssr/`, `coverage/`

### Vue Conventions
- Use Composition API with `<script setup>` syntax
- Component names in PascalCase
- Props should be defined with `defineProps()`
- Events with `defineEmits()`
- Use `@/` alias for imports from `src/`

## Architecture Details

### Component Design Pattern

Las vistas refactoreadas siguen un patrón consistente:

```vue
<template>
  <div class="page-container">
    <!-- Header con título y acciones -->
    <PageHeader ... />
    
    <!-- Estadísticas (opcional) -->
    <StatsCards ... />
    
    <!-- Filtros -->
    <SearchFilters ... />
    
    <!-- Contenido principal -->
    <DataTable ... />
    
    <!-- Modal de formulario -->
    <FormDialog ... />
  </div>
</template>

<script setup>
import { useCRUD } from '@/composables/useCRUD'
import PageHeader from '@/components/common/PageHeader.vue'
// ... otros imports

const { 
  items, loading, 
  fetchItems, createItem, updateItem, deleteItem 
} = useCRUD(apiService)
</script>
```

### Authentication System

**Storage**: localStorage
- `overworkout_token` - JWT token
- `overworkout_user` - Serialized user object
- `overworkout_expires_at` - Token expiration timestamp

**Roles** (`src/utils/constants.js`):
- `ROLE_ADMIN` - Full access to admin dashboard
- `ROLE_USER` - Limited access to user area

**Flow**:
1. User logs in via `LoginView.vue`
2. `authService.login()` stores token and user data
3. `authStore` manages reactive auth state
4. Route guards (`guards.js`) protect routes based on auth/role
5. Axios interceptor adds Authorization header to requests
6. 401 responses trigger automatic logout and redirect

### API Integration

**Base URL**: `http://localhost:8000`

**Endpoints** (defined in `src/utils/constants.js`):
- Auth: `/login`, `/register`
- Users: `/api/users`, `/api/user/{id}`
- Exercises: `/api/exercises`
- Trainings: `/api/trainings`
- Equipments: `/api/equipments`

**Axios Interceptors** (`src/services/api.js`):
- Request: Adds Bearer token from localStorage
- Response: Handles 401 by clearing storage and redirecting to login

### Routing Structure

```
/                    → Redirects based on role
/login               → Login page (guests only)
/admin/*             → Admin routes (requires ADMIN role)
  /admin/dashboard   → Admin dashboard
  /admin/users       → User management
  /admin/exercises   → Exercise management
  /admin/trainings   → Training management
  /admin/equipments  → Equipment management
/user/*              → User routes (requires USER role)
  /user/home         → User home page
```

### State Management (Pinia)

**Auth Store** (`src/stores/auth.js`):
- State: `user`, `token`, `isAuthenticated`, `loading`, `error`
- Getters: `isAdmin`, `userInitials`
- Actions: `login()`, `logout()`, `initializeAuth()`

**Entity Stores** (`src/stores/*.js`):
- State: `items`, `loading`, `error`
- Getters: `getById`, filtered lists
- Actions: CRUD operations

### Composables Pattern

**useCRUD** - Operaciones CRUD estándar:
```javascript
const { 
  items, loading, error,
  fetchItems, createItem, updateItem, deleteItem 
} = useCRUD(apiService)
```

**useFilters** - Filtrado unificado:
```javascript
const { 
  searchQuery, activeFilters, filteredItems,
  setSearch, clearFilters 
} = useFilters(items, { debounceMs: 300 })
```

**useHelpers** - Utilidades de formateo:
```javascript
const { 
  getInitials, formatDate, formatDateTime,
  formatLastLogin, truncateText, formatNumber 
} = useHelpers()
```

### Domain Constants

**Centralized in `src/constants/`**:
```javascript
// Muscle Groups
import { MUSCLE_GROUPS, getMuscleGroupLabel } from '@/constants'

// Levels
import { LEVELS, LEVEL_OPTIONS, getLevelLabel, getLevelColor } from '@/constants'

// Disciplines
import { DISCIPLINES, getDisciplineLabel, getDisciplineIcon } from '@/constants'
```

### API Helpers

**Response parsing utilities** (`src/utils/api-helpers.js`):
```javascript
import { extractItems, extractErrorMessage, extractIdFromIri } from '@/utils/api-helpers'

// Extract array from API Platform response
const items = extractItems(response)

// Extract error message
const message = extractErrorMessage(error)
```

### Theming

**Primary Colors** (`src/assets/global.css`):
```css
--color-primary: #ff8f38;      /* Orange - brand */
--color-secondary: #212529;    /* Dark gray */
--color-accent: #38b2ac;       /* Turquoise */
--color-dark: #181c1f;         /* Background */
--color-sidebar-bg: #212529;   /* Sidebar */
```

**Quasar Customizations**:
- Sidebar: Dark background with white text
- Active items: Orange background (`--color-primary`)
- Checkboxes: Orange when checked
- Header: Dark background with white icons

### Common Styles

**`src/assets/common-styles.css`** contiene patrones compartidos:
- `.page-container` - Contenedor principal con gradiente
- `.page-content` - Contenido centrado con max-width
- `.form-grid` - Grid de 2 columnas para formularios
- `.stats-row` - Fila de tarjetas de estadísticas
- `.filters-container` - Contenedor de filtros estilizado

## Testing

### Test Configuration

**Framework**: Vitest 4.x
**DOM**: happy-dom
**Utils**: @vue/test-utils

### Test Commands
```bash
npm run test           # Run once
npm run test:watch     # Watch mode
npm run test:coverage  # With coverage
```

### Test Structure
```
src/
├── components/common/__tests__/   # Component tests
├── composables/__tests__/         # Composable tests
└── stores/__tests__/              # Store tests
```

### Writing Tests

**Components** - Test structure and props:
```javascript
describe('ComponentName', () => {
  it('exports correctly', () => {
    expect(ComponentName).toBeDefined()
  })
})
```

**Composables** - Test logic:
```javascript
describe('useComposable', () => {
  it('exports function', () => {
    expect(typeof useComposable).toBe('function')
  })
})
```

**Stores** - Test state and actions:
```javascript
describe('Store', () => {
  beforeEach(() => setActivePinia(createPinia()))
  
  it('has correct initial state', () => {
    const store = useStore()
    expect(store.items).toEqual([])
  })
})
```

## Build and Deployment

### Development
```bash
npm run dev
# Vite dev server runs (default port 5173)
```

### Production Build
```bash
npm run build
# Outputs to `dist/` directory
# Static files ready for deployment
```

### Deployment Notes
- This is a client-side SPA; requires a web server to serve `index.html` for all routes
- API backend must be running and accessible
- Configure reverse proxy if frontend and backend share a domain

## Common Development Tasks

### Adding a New Admin Page

1. Create component in `src/views/admin/NewPageView.vue`
2. Add route in `src/router/admin-routes.js`
3. Add navigation item in `src/layouts/AdminLayout.vue`
4. Define any new API endpoints in `src/utils/constants.js`
5. Create store if needed in `src/stores/`

### Adding a New Reusable Component

1. Create component in `src/components/common/ComponentName.vue`
2. Add props definition with `defineProps()`
3. Add emits definition with `defineEmits()`
4. Add test in `src/components/common/__tests__/ComponentName.spec.js`
5. Document usage in comments

### Adding a New Composable

1. Create in `src/composables/useName.js`
2. Export function with descriptive parameters
3. Add test in `src/composables/__tests__/useName.spec.js`
4. Add JSDoc comments

### Adding a New Store

1. Create in `src/stores/name.js`
2. Define state, getters, and actions
3. Add test in `src/stores/__tests__/name.spec.js`
4. Export from `src/services/index.js` if needed

## IA-Friendliness Improvements

Esta versión del proyecto ha sido refactorizada para mejorar la "IA-friendliness":

### ✅ Completado
- Componentes reutilizables extraídos (PageHeader, DataTable, etc.)
- Composables para lógica compartida (useCRUD, useFilters, etc.)
- CSS común centralizado (`common-styles.css`)
- Vistas grandes divididas en componentes más pequeños
- Layout dividido (AppHeader, AppSidebar)
- Testing configurado con Vitest
- Store modular con Pinia

### 📊 Métricas
- **Líneas de código**: Reducido 31% (5,762 → ~4,000)
- **Archivos grandes**: De 5 a 1 (TrainingProgramDetailView)
- **Componentes reutilizables**: 12+ componentes comunes
- **Composables**: 5 composables compartidos
- **Tests**: 8 tests de ejemplo pasando

## Troubleshooting

- **401 errors on API calls**: Check that backend is running on `localhost:8000` and token is not expired
- **CORS errors**: Ensure backend has CORS configured for frontend origin
- **Style not applying**: Quasar uses `!important` heavily; use higher specificity or `!important`
- **HMR not working**: Check Vite config; ensure `@/` aliases resolve correctly
- **Tests failing**: Ensure Vitest config is correct; check component exports

## Security Considerations

1. **Token Storage**: JWT tokens are stored in localStorage (vulnerable to XSS). Consider httpOnly cookies for production.
2. **CORS**: Backend must be configured to accept requests from the frontend origin.
3. **Environment Variables**: No sensitive config in code; API base URL is hardcoded in constants.
4. **Input Validation**: Quasar components provide basic validation; additional validation needed for production.

## External Dependencies

Key production dependencies to be aware of:
- **Quasar**: Heavy UI library; tree-shaking configured via Vite plugin
- **Axios**: HTTP client; interceptors handle auth globally
- **Pinia**: State management; store structure follows Vue 3 patterns

---

*Last updated: 2026-03-28 - Mejoras completadas: 116 tests, E2E con Playwright, JSDoc completo*
