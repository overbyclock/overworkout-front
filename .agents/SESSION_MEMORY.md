# 🧠 Memoria de Sesión - OverWorkout

> **Uso:** Al empezar una sesión, di: _"Continúa con OverWorkout"_ o _"Léeme la memoria"_.
> El agente leerá este archivo automáticamente para ponerse al día en segundos.

---

## 📅 Última sesión completada (2026-06-02)

- **Focus**: Refactor completo del sistema de benchmarks — separación de entrenamientos sueltos, programas y WODs CrossFit
- **Estado**: ✅ Todo completado y commiteado
- **Problema identificado**: La entidad `Training` almacenaba 3 conceptos distintos mezclados (entrenamientos sueltos, sesiones de programa y benchmarks CrossFit), generando confusión arquitectónica.
- **Cambios Backend** (`overworkout-back`):
  - **Backup**: Script PHP generó backup SQL completo en `var/backups/backup_pre_benchmark_refactor_20260602_164435.sql`.
  - **Migración de datos**: 39 benchmarks reales (Fran, Grace, Helen, Murph, DT, etc.) migrados de `training` a `benchmark` sin pérdida de información.
  - **Limpieza BD**: Eliminados 39 registros benchmark de `training` y removidas 8 columnas (`is_benchmark`, `benchmark_type`, `rx_weight_male`, `rx_weight_female`, `elite_time`, `advanced_time`, `intermediate_time`, `beginner_time`).
  - **Entidad `Training`**: Depurada de campos de benchmark. Comandos de generación de programas actualizados.
  - **API Benchmarks nueva**: `BenchmarkController` con endpoints CRUD (`GET /benchmarks`, `POST`, `GET /{id}`, `PUT`, `DELETE`).
  - **Arquitectura**: DTOs (`BenchmarkCreateDto`, `BenchmarkUpdateDto`), `BenchmarkMapper`, `BenchmarkVoter` (solo admin escribe, todos leen), grupos de serialización `benchmark:read`.
  - **Tests**: 22 tests unitarios nuevos (DTOs, Mapper, Voter). Total backend: **595 tests pasando**.
  - **Migración**: `Version20260602164500` documenta el DROP de columnas.
- **Cambios Frontend** (`overworkout-front`):
  - **Nuevo servicio**: `benchmarkService.js` conectado a `/benchmarks`.
  - **`BenchmarksView.vue` refactorizada**: CRUD real contra API (antes era mock/local). UI adaptada a tiempos separados por género (♂/♀). Filtros por tipo funcionales.
  - **Constantes**: Añadidos endpoints `BENCHMARKS` a `API_ENDPOINTS`.
  - **Eliminado**: `getBenchmarks` de `trainingService.js`.
- **Commits**:
  - Backend: `feat(api): endpoint CRUD benchmarks + refactor separación entidad Training`
  - Frontend: `feat(admin): conectar BenchmarksView a API real + servicio benchmarks`

---

## 📅 Sesión anterior (2026-05-28)

- **Focus**: Construcción completa del editor de programas (5 fases end-to-end)
- **Estado**: ✅ Todo completado y commiteado
- **Cambios Frontend** (`overworkout-front`):
  - **Fase 1**: Conectar crear programa a API, navegación Semanas/Trainings desde detalle de nivel, fix filtrado de semanas, fix update de trainings sin borrar rounds.
  - **Fase 3**: Nuevo componente `TrainingBuilder.vue` — editor visual completo de trainings con rounds, ejercicios, sets, reps, descansos, validaciones y payload exacto para backend.
  - **Fase 4**: Preview en vivo con `SessionBlock`, botón "Duplicar training", botón "Duplicar nivel", test unitario de `TrainingBuilder`.
  - **Fase 5**: Auto-navegación al detalle del programa tras crearlo.
- **Cambios Backend** (`overworkout-back`):
  - **Fase 1**: `TrainingLevelApiController` incluye grupo `training:read:detail` para devolver trainings completos en GET nivel. `TrainingWeekInfo` expone `levelId` en serialización.
  - **Fase 2**: `TrainingMapper::updateRounds()` y `updateExercisesInRound()` reescritos para hacer **reemplazo completo** (elimina rounds/ejercicios que no estén en el DTO). 3 tests unitarios nuevos.
- **Commits**:
  - Frontend: `feat: TrainingBuilder completo + editor de programas end-to-end`
  - Backend: `feat: reemplazo completo de rounds/ejercicios en TrainingMapper + fixes de serialización`

---

## 📅 Sesión anterior (2026-05-27)

- **Focus**: Crear/editar programas COMPLETOS de forma manual desde el admin
- **Estado**: Fases 1-6 del plan CRUD programa completo ✅
- **Plan completado**:
  - Backend CRUD `TrainingProgram` + `TrainingLevel`
  - Backend CRUD `TrainingWeekInfo`
  - Backend extender `TrainingCreateDto`
  - Frontend conectar vistas de edición
  - Frontend constructor de trainings y fases/semanas

---

## 📅 Sesión anterior (2026-05-25)

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
| **Tests**           | 595 tests pasando (PHPUnit)                      |
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
- Benchmarks: CRUD `/benchmarks` (WODs CrossFit separados de trainings)
- Training Levels: CRUD `/training-levels`, `/training-levels/{id}`
- Training Week Infos: CRUD `/training-week-infos`, `/training-week-infos/{id}`
- Trainings: CRUD `/trainings` (ahora soporta `trainingLevelId`, `weekNumber`, `dayKey`, `sessionType`)
- Training Skills: CRUD `/training-skills`
- User Progress: `/user/progress`, `/user/progress/active`, `/user/progress/{levelId}/test`, `/user/progress/{levelId}/advance-week`, `/user/progress/init/{programId}`

### Arquitectura sólida

- DTOs + Mappers + Voters en toda la API.
- Serialización con Symfony Serializer y Groups.
- Voters: `UserVoter`, `TrainingVoter`, `ExerciseVoter`, `EquipmentVoter`, `TrainingSkillVoter`, `TrainingProgramVoter`, `TrainingLevelVoter`, `BenchmarkVoter`.
- **Arquitectura limpia**: 3 conceptos separados
  - `Training` = entrenamientos sueltos + sesiones de programa (`trainingLevel IS NULL` → suelto; `NOT NULL` → programa)
  - `Benchmark` = WODs CrossFit con tiempos estándar por género
  - `TrainingProgram` = programas estructurados con niveles, semanas y sesiones A/B/C/D

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

### Completados recientemente ✅

- **CRUD programa completo**: Fases 1-6 finalizadas (sesión 2026-05-28).
- **Refactor benchmarks**: Separación limpia de Training/Benchmark/Programa (sesión 2026-06-02).

### Pendientes activos (baja/media prioridad)

- **Siguiente Skill Program**: Muscle-up, Planche, Back Lever, etc. (el `Front Lever Mastery` ya fue creado en la sesión del 2026-05-25)
- **Tests funcionales backend**: Configurar SQLite en `phpunit.dist.xml` y añadir tests funcionales para endpoints de programa y benchmarks.
- **Auditoría de ejercicios**: Revisar si otros programas (Calistenia Master V1/V2/V3) tienen ejercicios con clasificación inconsistente respecto a la progresión donde se usan.
- **Refinamiento V3**: Ajustar sets/reps de algún nivel si el experto entrenador lo solicita.
- **Ajustar tiempos femeninos benchmarks**: Los 39 benchmarks migrados tienen tiempos duplicados (mismo valor en male/female). Revisar con estándares reales de CrossFit y actualizar.

---

## 🚧 Bloqueos / Deuda técnica conocida

- Tests funcionales requieren base de datos SQLite configurada en `phpunit.dist.xml` (actualmente intenta conectar a MySQL en entorno de test y falla).
- **Frontend**: `TrainingProgramDetailView.vue` ahora usa `computed` para tabs dinámicos (count de niveles). `WeekPanel.vue` reconoce `session_a/b/c/d`. `api-adapters.js` infiere goals y muscle groups para handstand sessions. `Training::isCircuit` ahora tiene grupo de serialización para que el frontend detecte circuitos correctamente.
- ~~Entidad `Training` mezclaba benchmarks, entrenamientos sueltos y sesiones de programa~~ ✅ **RESUELTO** (2026-06-02): Separados en 3 conceptos claros.

---

## 💡 Decisiones arquitectónicas recientes

- **Backend**: Se mantiene el enfoque de controladores Symfony personalizados (aunque API Platform está instalado, no se usa para los recursos actuales).
- **Skill Programs**: Cada skill es un `TrainingProgram` independiente con su propio Blueprint + Content + Command. Patrón replicable para las 14 skills identificadas.
- **Frontend**: El `BACKEND_REFACTOR_PLAN.md` (marzo 2026) ya está superado; el backend ya implementó DTOs, Voters, tests, PHP-CS-Fixer y PHPStan.
- **Separación de responsabilidades** (2026-06-02): `Training` (entrenamientos/sesiones), `Benchmark` (WODs CrossFit) y `TrainingProgram` (programas estructurados) son 3 conceptos independientes. Nunca más mezclar campos de benchmark en `Training`.

---

## 📝 Notas técnicas

- Backend espera base de datos MySQL/MariaDB (configurable en `.env.local`).
- En tests/CI se puede usar SQLite.
- CORS configurado para `localhost` y `127.0.0.1`.
- JWT secret gestionado por variable de entorno `JWT_SECRET_KEY`.
- Frontend usa `localStorage` para token JWT (considerar httpOnly cookies en producción).
- **Comando útil**: `php bin/console app:create-handstand-balance-mastery --delete-existing`

---

_Actualizado: 2026-06-02_

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
