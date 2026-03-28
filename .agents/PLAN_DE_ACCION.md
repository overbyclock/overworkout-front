# Plan de Acción - OverWorkout Refactorización

> 📅 Creado: 28/03/2026 - 00:17  
> 🎯 Objetivo: Hacer el proyecto "IA-Friendly" y mejorar arquitectura
> 📊 Estado actual: 45/100 (requiere trabajo)

---

## ✅ Completado Hoy (27/03)

### 1. Skills Creadas (en `.agents/skills/`)
| Skill | Uso |
|-------|-----|
| `@vue-quasar-expert` | Para refactorizar código Vue/Quasar con buenas prácticas |
| `@web-design-expert` | Para diseño UI/UX y tema visual |
| `@symfony-expert` | Para backend cuando se empiece |
| `@fitness-expert` | Para lógica de dominio fitness |
| `@ai-project-auditor` | Para evaluar calidad del código |

### 2. Documentación Creada (en `.agents/docs/`)
- `README.md` - Índice de navegación
- `architecture/overview.md` - Arquitectura general
- `architecture/auth-flow.md` - Flujo de autenticación
- `frontend/quickstart.md` - Cómo empezar a codear
- `frontend/structure.md` - Estructura de carpetas
- `frontend/patterns.md` - Patrones de código
- `frontend/components.md` - Componentes disponibles
- `database/entities.md` - Entidades del sistema
- `conventions.md` - Convenciones de código

### 3. Auditoría Realizada
**Puntuación: 45/100** ⚠️

**Problemas críticos encontrados:**
- `ExercisesView.vue` → 1,952 líneas 🔴
- `TrainingProgramDetailView.vue` → 1,854 líneas 🔴
- `TrainingsView.vue` → 1,375 líneas 🔴
- `EquipmentsView.vue` → 1,218 líneas 🔴
- `UsersView.vue` → 1,167 líneas 🔴
- Código duplicado en todas las vistas admin
- Sin componentes reutilizables (carpetas vacías)
- Sin composables
- Solo 1 store (auth), faltan stores de entidades

---

## 🎯 Plan de Acción - Próximos Pasos

### FASE 1: Quick Win (2-3 horas) ← EMPEZAR AQUÍ
**Objetivo:** Subir de 45 a 65 puntos creando componentes base

#### Tarea 1.1: Crear componentes comunes
Crear en `src/components/common/`:
1. `PageHeader.vue` - Título + botón "Nuevo"
2. `StatsCards.vue` - 3 tarjetas de estadísticas
3. `SearchFilters.vue` - Barra de búsqueda + filtros
4. `DataTable.vue` - Tabla con paginación
5. `FormDialog.vue` - Modal reutilizable para crear/editar

#### Tarea 1.2: Crear composables
Crear en `src/composables/`:
1. `useCrud.js` - fetch, create, update, delete
2. `usePagination.js` - página, límite, total
3. `useSearch.js` - query con debounce
4. `useForm.js` - validación y submit de formularios

#### Tarea 1.3: Crear stores
Crear en `src/stores/`:
1. `exercises.js` - Store de ejercicios
2. `users.js` - Store de usuarios
3. `trainings.js` - Store de entrenamientos
4. `equipments.js` - Store de equipamiento

#### Tarea 1.4: Refactorizar UsersView.vue
- Aplicar componentes creados
- Mover lógica a store + composables
- **Meta:** De 1,167 a ~400 líneas

### FASE 2: Refactorización Completa (1-2 días)
**Objetivo:** Subir a 85/100 puntos

#### Tarea 2.1: Replicar patrón en otras vistas
Aplicar el mismo patrón de UsersView a:
- `EquipmentsView.vue`
- `ExercisesView.vue`
- `TrainingsView.vue`

#### Tarea 2.2: Crear componentes específicos
Crear componentes admin en `src/components/admin/`:
- `ExerciseForm.vue`
- `UserForm.vue`
- `TrainingForm.vue`
- etc.

#### Tarea 2.3: Dividir AdminLayout.vue
Separar en:
- `AppHeader.vue`
- `AppSidebar.vue`
- `AppBreadcrumb.vue`

### FASE 3: Backend Symfony (Futuro)
Cuando se quiera empezar backend, usar `@symfony-expert`

---

## 🚀 Cómo Empezar Mañana

### Si eres TÚ (Humano):
1. Abrir este archivo: `.agents/PLAN_DE_ACCION.md`
2. Decirle a Kimi: "Continuamos con el Plan de Acción"
3. Decidir: Empezar Fase 1, u otra cosa

### Si soy YO (Kimi con contexto nuevo):
1. Leer este archivo primero
2. Revisar skills en `.agents/skills/`
3. Revisar documentación en `.agents/docs/`
4. Preguntar al usuario qué quiere hacer hoy

---

## 💬 Comandos Útiles para el Usuario

### Para refactorizar código:
```
@vue-quasar-expert crea un componente PageHeader reutilizable
```

### Para evaluar progreso:
```
@ai-project-auditor evalúa el proyecto después de estos cambios
```

### Para ver documentación:
```
Muestrame la guía de arquitectura del proyecto
```

---

## 📋 Checklist de Progreso

### FASE 1
- [x] Componente PageHeader.vue creado
- [x] Componente StatsCards.vue creado
- [x] Componente SearchFilters.vue creado
- [x] Componente DataTable.vue creado
- [x] Componente FormDialog.vue creado
- [x] Composable useCrud.js creado
- [x] Composable usePagination.js creado
- [x] Composable useSearch.js creado
- [x] Composable useForm.js creado
- [x] Store users.js creado
- [x] Store exercises.js creado
- [x] Store trainings.js creado
- [x] Store equipments.js creado
- [x] UsersView.vue refactorizado (~480 líneas, reducción de 60%)

### FASE 2 - COMPLETADA
- [x] EquipmentsView.vue refactorizado (1,218 → 843 líneas, -31%)
- [x] ExercisesView.vue refactorizado (1,952 → 1,328 líneas, -32%)
- [x] TrainingsView.vue refactorizado (1,375 → 1,155 líneas, -16%)
- [x] TrainingProgramsView.vue refactorizado (1,050 → 637 líneas, -39%)

### FASE 3 - COMPLETADA (Optimizaciones de Arquitectura)
- [x] CSS común extraído a `src/assets/common-styles.css`
- [x] Composable `useFilters` creado para unificar lógica de filtros
- [x] Componentes Card creados:
  - [x] `ProgramCard.vue` - Tarjeta de programa con gradiente
  - [x] `ExerciseCard.vue` - Tarjeta de ejercicio con dificultad/músculos
  - [x] `TrainingCard.vue` - Tarjeta de entrenamiento

### PENDIENTE (Fase opcional futura)
- [ ] TrainingProgramDetailView.vue refactorizado (1,641 líneas) - Vista compleja con niveles/semanas
- [ ] AdminLayout.vue dividido en AppHeader/AppSidebar
- [ ] Agregar testing con Vitest
- [ ] Configurar pre-commit hooks (Husky)

---

## 🎯 Meta Final

**Puntuación objetivo: 85/100**

| Métrica | Actual | Objetivo |
|---------|--------|----------|
| Archivos >300 líneas | 10 | 0 |
| Componentes reutilizables | 1 | 15+ |
| Composables | 0 | 5+ |
| Stores | 1 | 5+ |

---

## 📁 Ubicaciones Importantes

```
Project Root/
├── .agents/
│   ├── PLAN_DE_ACCION.md      ← ESTE ARCHIVO
│   ├── docs/                   ← Documentación
│   │   ├── README.md
│   │   ├── architecture/
│   │   ├── frontend/
│   │   └── database/
│   └── skills/                 ← Skills especializadas
│       ├── ai-project-auditor/
│       ├── vue-quasar-expert/
│       ├── web-design-expert/
│       ├── symfony-expert/
│       └── fitness-expert/
├── src/
│   ├── components/             ← (Vacío - llenar)
│   ├── composables/            ← (No existe - crear)
│   ├── stores/                 ← (Solo auth.js)
│   └── views/admin/            ← (Archivos grandes)
└── AGENTS.md                   ← Guía general del proyecto
```

---

*Buenas noches! Mañana más y mejor 🌙*
