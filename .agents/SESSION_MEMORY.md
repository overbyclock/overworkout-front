# 🧠 Memoria de Sesión - OverWorkout

> **Uso:** Al empezar una sesión, di: _"Continúa con OverWorkout"_ o _"Léeme la memoria"_.
> El agente leerá este archivo automáticamente para ponerse al día en segundos.

---

## 📅 Sesión en curso (PENDIENTE DE CONTINUAR)

- **Fecha**: 2026-05-27
- **Focus**: Crear/editar programas COMPLETOS de forma manual desde el admin (fases, descansos, ejercicios, rondas, nombres, consejos)
- **Estado**: Fases 1-6 completadas.
- **Análisis realizado**:
  - **Backend**: `TrainingProgram` solo tiene GET. `TrainingLevel`, `TrainingWeekInfo` no tienen controllers. `Training` tiene CRUD pero solo para entrenamientos sueltos (falta `trainingLevelId`, `weekNumber`, `dayKey`, `sessionType` en DTOs).
  - **Frontend**: `TrainingProgramEditView.vue` y `TrainingLevelEditView.vue` están hardcodeados/mock (no conectan a API). No existen vistas para gestionar fases/semanas ni trainings con rounds/ejercicios dentro de un nivel.
- **Plan acordado** (ver detalle en "🎯 Próximos Pasos" → sección "Plan de implementación CRUD programa completo"):
  - Fase 1: Backend CRUD `TrainingProgram` + `TrainingLevel` ✅ COMPLETADA
  - Fase 2: Backend CRUD `TrainingWeekInfo` (fases/semanas) ✅ COMPLETADA
  - Fase 3: Backend extender `TrainingCreateDto` para asociar a nivel/semana/día ✅ COMPLETADA
  - Fase 4: Frontend conectar `TrainingProgramEditView` y `TrainingLevelEditView` ✅ COMPLETADA
  - Fase 5: Frontend nueva vista constructor de trainings (rounds + ejercicios) ✅ COMPLETADA
  - Fase 6: Frontend nueva vista constructor de fases/semanas ✅ COMPLETADA
- **Decisiones**: UI con pantallas separadas.

---

## 📅 Última sesión completada

- **Fecha**: 2026-05-25
- **Focus**: Arreglo de clasificación por grupo muscular en ejercicios + recalificación de ejercicios Handstand
- **Resumen**:
  1. Fix: `primaryMuscleGroup` y `secondaryMuscleGroup` añadidos al grupo de serialización `GROUP_READ` en `Exercises.php`. El endpoint `GET /exercises` ya devuelve estos campos correctamente.
  2. Frontend: Búsqueda ahora incluye descripción; filtro por grupo muscular busca en primario y secundario.
  3. Revisión con experto entrenador: Se recalificaron 3 ejercicios de handstand de `intermediate` a `beginner` en BBDD (`Chest to Wall Handstand`, `Frog Stand`, `Hollow Body Hold`).
  4. Datos verificados: 728 ejercicios totales, todos con grupo muscular asignado.
  5. **NUEVO PROGRAMA**: `Front Lever Mastery` creado completamente (6 niveles, 96 trainings, ~300 configs).
     - Niveles: Fundamentos de Tracción → Tuck FL → Advanced Tuck → Straddle FL → Full FL → Dominio
     - 4 ejercicios nuevos creados con clasificación correcta: `Inverted Hang Hold` (beginner), `One Leg Front Lever Hold` (intermediate), `Front Lever Negative` (intermediate), `Ice Cream Maker` (intermediate diff 3).
     - Archivos: `FrontLeverBlueprint.php`, `FrontLeverContent.php`, `CreateFrontLeverMasteryCommand.php`.
     - **Ajustes post-revisión experto**:
       - Back Lever Hold movido de Nivel 3 a Nivel 4 (protección articular)
       - Ice Cream Maker añadido en N3-N5 (conexión vertical→horizontal)
       - Front Lever Negative añadido en N5-N6 (fuerza excéntrica)
       - Test N2: Tuck FL Hold target 25s → **30s**
       - Test N4: Straddle FL Row mínimo 5 → **3 reps**
       - Volumen aumentado en Sesiones D de N5-N6 (2 bloques)

---

## 📅 Sesión anterior (2026-05-19)

- **Focus**: Implementación del programa **Handstand Balance Mastery V3** (Skill program de calistenia)
- **Resumen**: Se diseñó, revisó con experto entrenador y programó completamente el primer programa de skill especializado. 6 niveles, 96 trainings, 296 configs de ejercicios.

---

## 🏗️ Estado Actual - Backend (`overworkout-back`)

| Aspecto             | Estado                                           |
| ------------------- | ------------------------------------------------ |
| **Branch**          | `main`                                           |
| **PHP**             | 8.4+                                             |
| **Framework**       | Symfony 8.0                                      |
| **ORM**             | Doctrine 3.6+                                    |
| **Auth**            | JWT custom (firebase/php-jwt)                    |
| **Tests**           | 570 tests pasando (PHPUnit)                      |
| **Code style**      | PHP-CS-Fixer activo (PSR12 + Symfony)            |
| **Static analysis** | PHPStan nivel 5, sin errores                     |
| **CI/CD**           | GitHub Actions (code-style, phpstan, unit-tests) |
| **Migrations**      | 19 migraciones                                   |

### Programa Handstand Balance Mastery — IMPLEMENTADO ✅

- **Slug**: `handstand-balance-mastery`
- **Niveles**: 6 (Confianza Invertida → Alineación → Despegue → Primeros Segundos Libres → Consistencia → Forma y Estilo)
- **Estructura**: 4 fases × 4 sesiones = 16 trainings/nivel = **96 trainings totales**
- **Ejercicios nuevos creados**: 6
  - `Handstand Bail Out`
  - `Kick-up to Handstand`
  - `Wall Scissors`
  - `Handstand Shoulder Taps`
  - `Handstand Tuck Hold`
  - `Handstand Straddle Hold`
- **Archivos creados**:
  - `src/Command/CreateHandstandBalanceMasteryCommand.php`
  - `src/Command/Blueprint/HandstandBalanceBlueprint.php`
  - `src/Command/Blueprint/HandstandBalanceContent.php`
- **Tests de paso por nivel**:
  - L1: 60s Wall HS (pecho) + 10 Pike PU
  - L2: 45s Wall HS (espalda) + 5 Bail Outs
  - L3: 30s Wall HS (puntas) + 10 Wall Scissors + 10 Pike PU
  - L4: 3 Kick-ups a pared (hold 3s) + 3s Freestanding
  - L5: 10s Freestanding + 3 entradas consecutivas + 8 HSPU pared
  - L6: 30s Freestanding + 5s Tuck + 5s Straddle + 10 HSPU pared

### Endpoints principales implementados

- Auth: `POST /login`, `/register`
- Users: `GET|PATCH|DELETE /users/{id}`, `GET /users`
- Exercises: CRUD `/exercises`
- Trainings: CRUD `/trainings`, `/trainings/public`, `/trainings/user/{userId}`
- Equipments: CRUD `/equipments`
- Training Programs: CRUD `/training-programs`, `/training-programs/{id}`, `/training-programs/by-slug/{slug}`, `/training-programs/{id}/levels`
- Training Levels: CRUD `/training-levels`, `/training-levels/{id}`
- Training Week Infos: CRUD `/training-week-infos`, `/training-week-infos/{id}`
- Trainings: CRUD `/trainings` (ahora soporta `trainingLevelId`, `weekNumber`, `dayKey`, `sessionType`)
- Training Skills: CRUD `/training-skills`
- User Progress: `/user/progress`, `/user/progress/active`, `/user/progress/{levelId}/test`, `/user/progress/{levelId}/advance-week`, `/user/progress/init/{programId}`

### Arquitectura sólida

- DTOs + Mappers + Voters en toda la API.
- Serialización con Symfony Serializer y Groups.
- Voters: `UserVoter`, `TrainingVoter`, `ExerciseVoter`, `EquipmentVoter`, `TrainingSkillVoter`, `TrainingProgramVoter`, `TrainingLevelVoter`.

### Sistema Calistenia (muy desarrollado)

- Entidades: `TrainingProgram`, `TrainingLevel`, `TrainingSkill`, `UserLevelProgress`, `TestResult`, `Benchmark`, `Achievement`, `TrainingWeekInfo`, `LevelRequirement`.
- Comandos de consola para generar contenido master (V1, V2, V3) + **Handstand Balance Mastery**.
- Progresión por niveles con tests de evaluación y ciclos de repetición (mastery-based, NO calendar-based).

---

## 🎨 Estado Actual - Frontend (`overworkout-front`)

| Aspecto       | Estado                                       |
| ------------- | -------------------------------------------- |
| **Branch**    | `main`                                       |
| **Framework** | Vue 3.5+ (Composition API, `<script setup>`) |
| **Build**     | Vite 7                                       |
| **UI**        | Quasar 2.18+                                 |
| **State**     | Pinia 3                                      |
| **Router**    | Vue Router 5                                 |
| **Tests**     | 116 unitarios (Vitest) + 7 E2E (Playwright)  |
| **Linting**   | ESLint 9 + Prettier 3                        |
| **Hooks**     | Husky + lint-staged                          |

### Rutas Admin implementadas

- `/admin/dashboard`
- `/admin/users`
- `/admin/exercises`
- `/admin/trainings`
- `/admin/equipments`
- `/admin/training-programs` (listado)
- `/admin/training-programs/:id` (detalle)
- `/admin/training-programs/:id/edit` (edición)
- `/admin/training-programs/:programId/levels/create`
- `/admin/training-levels/:id/edit`
- `/admin/training-skills`
- `/admin/achievements`
- `/admin/user-progress`
- `/admin/benchmarks`

### Patrones establecidos

- Composables: `useCRUD`, `useFilters`, `usePagination`, `useForm`, `useSearch`, `useHelpers`.
- Componentes comunes: `PageHeader`, `DataTable`, `StatsCards`, `SearchFilters`, `FormDialog`, `FilterPills`.
- Stores: `auth`, `users`, `exercises`, `trainings`, `equipments`, `programs`.
- API base: `http://localhost:8000`.

---

## 🎯 Próximos Pasos

### Plan de implementación CRUD programa completo (NUEVO - prioridad alta)

1. **Fase 1 — Backend base**: CRUD de `TrainingProgram` (POST/PUT/DELETE) + CRUD de `TrainingLevel` (nuevo controller)
2. **Fase 2 — Backend fases**: CRUD de `TrainingWeekInfo` (controller + DTOs + mapper)
3. **Fase 3 — Backend trainings en niveles**: Extender `TrainingCreateDto`/`TrainingUpdateDto` con `trainingLevelId`, `weekNumber`, `dayKey`, `sessionType`
4. **Fase 4 — Frontend programas/niveles**: Conectar `TrainingProgramEditView.vue` y `TrainingLevelEditView.vue` a API real
5. **Fase 5 — Frontend constructor de trainings**: Nueva vista dentro del nivel para crear/editar trainings con rounds, ejercicios, sets, reps, descansos
6. **Fase 6 — Frontend constructor de fases**: Nueva vista para gestionar semanas/fases (`TrainingWeekInfo`)

### Pendientes anteriores (baja prioridad)

- **Siguiente Skill Program**: Muscle-up, Planche, Front Lever, Back Lever, etc. (el `Front Lever Mastery` ya fue creado en la sesión del 2026-05-25)
- **Tests funcionales**: Configurar SQLite en `phpunit.dist.xml` y añadir tests funcionales para endpoints de programa.
- **Auditoría de ejercicios**: Revisar si otros programas (Calistenia Master V1/V2/V3) tienen ejercicios con clasificación inconsistente respecto a la progresión donde se usan.
- **Refinamiento V3**: Ajustar sets/reps de algún nivel si el experto entrenador lo solicita.

---

## 🚧 Bloqueos / Deuda técnica conocida

- Tests funcionales requieren base de datos SQLite configurada en `phpunit.dist.xml` (actualmente intenta conectar a MySQL en entorno de test y falla).
- **Frontend**: `TrainingProgramDetailView.vue` ahora usa `computed` para tabs dinámicos (count de niveles). `WeekPanel.vue` reconoce `session_a/b/c/d`. `api-adapters.js` infiere goals y muscle groups para handstand sessions. `Training::isCircuit` ahora tiene grupo de serialización para que el frontend detecte circuitos correctamente.

---

## 💡 Decisiones arquitectónicas recientes

- **Backend**: Se mantiene el enfoque de controladores Symfony personalizados (aunque API Platform está instalado, no se usa para los recursos actuales).
- **Skill Programs**: Cada skill es un `TrainingProgram` independiente con su propio Blueprint + Content + Command. Patrón replicable para las 14 skills identificadas.
- **Frontend**: El `BACKEND_REFACTOR_PLAN.md` (marzo 2026) ya está superado; el backend ya implementó DTOs, Voters, tests, PHP-CS-Fixer y PHPStan.

---

## 📝 Notas técnicas

- Backend espera base de datos MySQL/MariaDB (configurable en `.env.local`).
- En tests/CI se puede usar SQLite.
- CORS configurado para `localhost` y `127.0.0.1`.
- JWT secret gestionado por variable de entorno `JWT_SECRET_KEY`.
- Frontend usa `localStorage` para token JWT (considerar httpOnly cookies en producción).
- **Comando útil**: `php bin/console app:create-handstand-balance-mastery --delete-existing`

---

_Actualizado: 2026-05-27_

---

## 📅 Resumen de cambios (2026-05-27)

### Backend

- **TrainingProgram CRUD completo**: DTOs, Mapper, Voter, Controller extendido (POST/PATCH/DELETE).
- **TrainingLevel CRUD completo**: Nuevo controller, DTOs, Mapper, Voter.
- **TrainingWeekInfo CRUD completo**: Nuevo controller, DTOs, Mapper, Voter.
- **Training DTOs extendidos**: `TrainingCreateDto` y `TrainingUpdateDto` ahora aceptan `trainingLevelId`, `weekNumber`, `dayKey`, `sessionType`. Mapper actualizado para buscar el nivel y asignar campos.
- **Tests**: 76 tests unitarios nuevos (DTOs, Mappers, Voters). Total: 570 tests pasando.
- **Calidad**: PHPStan nivel 5 sin errores, PHP-CS-Fixer aplicado.

### Frontend

- **Programas**: `TrainingProgramEditView.vue` conectado a API real (`programService`).
- **Niveles**: `TrainingLevelEditView.vue` conectado a API real (`levelService`).
- **Nuevo servicio `levelService`** y store `useLevelsStore`.
- **Nuevo servicio `weekInfoService`**.
- **Nueva vista `LevelWeeksView.vue`**: gestión de semanas/fases de un nivel (`/admin/training-levels/:levelId/weeks`).
- **Nueva vista `LevelTrainingsView.vue`**: gestión de trainings dentro de un nivel (`/admin/training-levels/:levelId/trainings`).
- **Router actualizado** con nuevas rutas.
