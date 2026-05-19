# 🧠 Memoria de Sesión - OverWorkout

> **Uso:** Al empezar una sesión, di: _"Continúa con OverWorkout"_ o _"Léeme la memoria"_.
> El agente leerá este archivo automáticamente para ponerse al día en segundos.

---

## 📅 Última sesión

- **Fecha**: 2026-05-19
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
| **Tests**           | 494 tests pasando (PHPUnit)                      |
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
- Training Programs: `GET /training-programs`, `/training-programs/{id}`, `/training-programs/by-slug/{slug}`, `/training-programs/{id}/levels`
- Training Skills: CRUD `/training-skills`
- User Progress: `/user/progress`, `/user/progress/active`, `/user/progress/{levelId}/test`, `/user/progress/{levelId}/advance-week`, `/user/progress/init/{programId}`

### Arquitectura sólida

- DTOs + Mappers + Voters en toda la API.
- Serialización con Symfony Serializer y Groups.
- Voters: `UserVoter`, `TrainingVoter`, `ExerciseVoter`, `EquipmentVoter`, `TrainingSkillVoter`.

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

## 🎯 Próximos Pasos (definir al finalizar la siguiente sesión)

1. **Frontend**: ✅ Adaptación completada. `TrainingProgramDetailView.vue`, `WeekPanel.vue` y `api-adapters.js` actualizados para soportar Handstand Balance Mastery.
2. **Siguiente Skill Program**: Muscle-up, Planche, Front Lever, Back Lever, etc. (elegir uno).
3. **Tests funcionales**: Añadir tests funcionales para el nuevo endpoint de programa (requiere configurar entorno de test con SQLite).
4. **Refinamiento V3**: Si el experto entrenador quiere ajustar sets/reps de algún nivel.

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

_Actualizado: 2026-05-19_
