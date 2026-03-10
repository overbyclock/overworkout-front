# OverWorkout Admin - Project Guide for AI Agents

## Project Overview

OverWorkout Admin is a Vue 3-based administrative panel for a fitness/workout management application. It provides role-based access control for administrators and regular users to manage exercises, trainings, equipment, and users. The application features a dark-themed UI with Spanish as the primary interface language.

**Key Characteristics:**
- Single Page Application (SPA) built with Vue 3 and Vite
- Dark theme with orange (`#ff8f38`) as primary brand color
- Spanish language interface
- JWT-based authentication with role-based access (ADMIN, USER)
- Backend API expected at `http://localhost:8000`

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
| Linting | ESLint 9.x with Vue plugin |
| Formatting | Prettier 3.x |

## Project Structure

```
src/
├── assets/           # Global styles and static assets
│   └── global.css    # CSS variables, theme overrides, utilities
├── components/       # Reusable Vue components
│   ├── admin/        # Admin-specific components
│   ├── common/       # Shared components
│   ├── icons/        # Icon components
│   └── user/         # User-specific components
├── layouts/          # Layout components
│   ├── AdminLayout.vue   # Sidebar + header layout for admin
│   └── UserLayout.vue    # Simple layout for regular users
├── router/           # Vue Router configuration
│   ├── index.js      # Main router setup
│   ├── admin-routes.js   # Admin route definitions
│   ├── user-routes.js    # User route definitions
│   └── guards.js     # Route guards (auth, role checks)
├── services/         # API service layer
│   ├── api.js        # Axios instance with interceptors
│   ├── auth.js       # Authentication service
│   └── index.js      # Service exports
├── stores/           # Pinia stores
│   └── auth.js       # Authentication store
├── utils/            # Utilities and constants
│   └── constants.js  # API endpoints, storage keys, roles
├── views/            # Page-level components
│   ├── admin/        # Admin pages (Dashboard, Users, Exercises, etc.)
│   ├── user/         # User pages (Home)
│   └── LoginView.vue # Login page
├── App.vue           # Root component
└── main.js           # Application entry point
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

### Theming

**Primary Colors** (`src/assets/global.css`):
- `--color-primary`: `#ff8f38` (Orange - brand color)
- `--color-secondary`: `#212529` (Dark gray)
- `--color-accent`: `#38b2ac` (Turquoise)
- `--color-dark`: `#181c1f` (Background)
- `--color-sidebar-bg`: `#212529` (Sidebar background)

**Quasar Customizations**:
- Sidebar: Dark background with white text
- Active items: Orange background (`--color-primary`)
- Checkboxes: Orange when checked
- Header: Dark background with white icons

## Testing

**Note**: This project does not currently have automated testing configured. Tests should be added using a framework like Vitest or Cypress if needed.

## Security Considerations

1. **Token Storage**: JWT tokens are stored in localStorage (vulnerable to XSS). Consider httpOnly cookies for production.
2. **CORS**: Backend must be configured to accept requests from the frontend origin.
3. **Environment Variables**: No sensitive config in code; API base URL is hardcoded in constants.
4. **Input Validation**: Quasar components provide basic validation; additional validation needed for production.

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
# Static files ready for deployment to any web server
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

### Adding a New API Service
1. Add endpoint constants to `src/utils/constants.js`
2. Create service method in appropriate service file (`src/services/`)
3. Use `apiClient` from `./api` for HTTP requests
4. Export from `src/services/index.js` if needed

### Modifying Theme Colors
1. Update CSS variables in `src/assets/global.css` `:root`
2. Update Quasar-specific overrides in the same file
3. Check both light and dark contexts

## Troubleshooting

- **401 errors on API calls**: Check that backend is running on `localhost:8000` and token is not expired
- **CORS errors**: Ensure backend has CORS configured for frontend origin
- **Style not applying**: Quasar uses `!important` heavily; use higher specificity or `!important`
- **HMR not working**: Check Vite config; ensure `@/` aliases resolve correctly

## External Dependencies

Key production dependencies to be aware of:
- **Quasar**: Heavy UI library; tree-shaking configured via Vite plugin
- **Axios**: HTTP client; interceptors handle auth globally
- **Pinia**: State management; store structure follows Vue 3 patterns

---

*Last updated: 2026-02-27*
