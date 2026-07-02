# Flujo Explorar → Programa → Nivel → Entrenar - Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Permitir al usuario descubrir programas en Explorar, ver su detalle, iniciar una sesión de entrenamiento, y que el sistema recuerde el progreso para mostrar "Continuar" o "Siguiente sesión" en el Inicio.

**Architecture:** Se añaden campos `startedAt`/`completedAt` a `UserTrainingLog` para trackear sesiones iniciadas y completadas. El backend expone endpoints para iniciar, completar y consultar la siguiente sesión. El frontend añade una vista de detalle de programa, activa el programa al pulsar "Empezar entrenamiento" y adapta el dashboard para mostrar la acción principal.

**Tech Stack:** Symfony 8 + Doctrine ORM (backend), Vue 3 + Pinia + Vite (frontend), PHPUnit / Vitest para tests.

---

## File structure

### Backend (`overworkout-back`)

- `src/Entity/UserTrainingLog.php` — añade `startedAt`/`completedAt` nullable.
- `src/Repository/UserTrainingLogRepository.php` — métodos para buscar logs iniciados y completados.
- `src/Service/UserStatsService.php` — ajusta creación de logs completados.
- `src/Service/TrainingSessionService.php` — lógica de negocio: iniciar, completar, calcular siguiente sesión.
- `src/Controller/TrainingSessionApiController.php` — endpoints REST.
- `migrations/Version20260702xxxxxx.php` — migración de columnas nuevas.
- `tests/Unit/Service/TrainingSessionServiceTest.php` — tests unitarios del servicio.
- `tests/Functional/Api/TrainingSessionApiTest.php` — tests funcionales de los endpoints.

### Frontend (`overworkout-front`)

- `src/views/user/ProgramDetailView.vue` — nueva vista de detalle de programa.
- `src/views/user/ExploreView.vue` — activa `loop` y navega a detalle.
- `src/views/user/TrainView.vue` — llama a start/complete.
- `src/views/user/DashboardView.vue` — muestra "Continuar" o "Siguiente sesión".
- `src/services/trainings.js` — métodos `start`, `complete`.
- `src/services/userProfile.js` — método `getNextTraining`.
- `src/router/user-routes.js` — ruta `/user/programs/:programId`.
- `src/utils/constants.js` — endpoints nuevos.
- `src/views/user/__tests__/ProgramDetailView.spec.js` — test unitario de la vista.
- `src/views/user/__tests__/DashboardView.spec.js` — actualizar tests.

---

## Task 1: Migración de `UserTrainingLog`

**Files:**

- Modify: `src/Entity/UserTrainingLog.php`
- Modify: `src/Service/UserStatsService.php`
- Create: `migrations/Version20260702xxxxxx.php`

- [ ] **Step 1: Generar migración vacía**

```bash
php bin/console doctrine:migrations:generate
```

Anota el nombre del archivo generado (por ejemplo `migrations/Version20260702190000.php`).

- [ ] **Step 2: Implementar la migración**

Abre el archivo generado y reemplaza su contenido por:

```php
<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

final class Version20260702190000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add started_at and completed_at to user_training_log';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE user_training_log ADD started_at DATETIMETZ_IMMUTABLE DEFAULT NULL');
        $this->addSql('ALTER TABLE user_training_log ALTER COLUMN completed_at DROP NOT NULL');
        $this->addSql('UPDATE user_training_log SET started_at = completed_at WHERE started_at IS NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE user_training_log DROP started_at');
        $this->addSql('ALTER TABLE user_training_log ALTER COLUMN completed_at SET NOT NULL');
    }
}
```

- [ ] **Step 3: Añadir propiedades a la entidad**

En `src/Entity/UserTrainingLog.php`, cambia la propiedad `completedAt` y añade `startedAt`:

```php
#[ORM\Column(type: Types::DATETIMETZ_IMMUTABLE, nullable: true)]
private ?\DateTimeImmutable $startedAt = null;

#[ORM\Column(type: Types::DATETIMETZ_IMMUTABLE, nullable: true)]
private ?\DateTimeImmutable $completedAt = null;
```

Y añade los getters/setters correspondientes:

```php
public function getStartedAt(): ?\DateTimeImmutable
{
    return $this->startedAt;
}

public function setStartedAt(\DateTimeImmutable $startedAt): static
{
    $this->startedAt = $startedAt;

    return $this;
}

public function getCompletedAt(): ?\DateTimeImmutable
{
    return $this->completedAt;
}

public function setCompletedAt(?\DateTimeImmutable $completedAt): static
{
    $this->completedAt = $completedAt;

    return $this;
}
```

- [ ] **Step 4: Actualizar constructor**

En `src/Entity/UserTrainingLog.php`, dentro de `__construct()`:

```php
public function __construct()
{
    $this->startedAt = new \DateTimeImmutable();
}
```

- [ ] **Step 5: Ajustar UserStatsService para logs completados**

En `src/Service/UserStatsService.php`, dentro de `recordTrainingCompletion`, añade justo antes de `$user->addUserTrainingLog($log)`:

```php
$log->setCompletedAt($context['completedAt'] ?? new \DateTimeImmutable());
```

- [ ] **Step 6: Ejecutar migración y validar schema**

```bash
php bin/console doctrine:migrations:migrate --no-interaction
php bin/console doctrine:schema:validate
```

- [ ] **Step 7: Commit**

```bash
git add src/Entity/UserTrainingLog.php src/Service/UserStatsService.php migrations/Version20260702xxxxxx.php
git commit -m "feat(training-log): add started_at and completed_at nullable columns"
```

---

## Task 2: Repositorio de logs de sesión

**Files:**

- Modify: `src/Repository/UserTrainingLogRepository.php`

- [ ] **Step 1: Añadir métodos al repositorio**

Añade al final de `src/Repository/UserTrainingLogRepository.php`:

```php
public function findStartedButNotCompletedByUser(User $user): ?UserTrainingLog
{
    return $this->createQueryBuilder('log')
        ->where('log.user = :user')
        ->andWhere('log.startedAt IS NOT NULL')
        ->andWhere('log.completedAt IS NULL')
        ->orderBy('log.startedAt', 'DESC')
        ->setParameter('user', $user)
        ->setMaxResults(1)
        ->getQuery()
        ->getOneOrNullResult();
}

/**
 * @return UserTrainingLog[]
 */
public function findCompletedByUserAndLevelAndWeek(User $user, TrainingLevel $level, int $weekNumber): array
{
    return $this->createQueryBuilder('log')
        ->innerJoin('log.training', 't')
        ->where('log.user = :user')
        ->andWhere('log.training = t')
        ->andWhere('t.trainingLevel = :level')
        ->andWhere('t.weekNumber = :weekNumber')
        ->andWhere('log.completedAt IS NOT NULL')
        ->setParameter('user', $user)
        ->setParameter('level', $level)
        ->setParameter('weekNumber', $weekNumber)
        ->getQuery()
        ->getResult();
}
```

- [ ] **Step 2: Commit**

```bash
git add src/Repository/UserTrainingLogRepository.php
git commit -m "feat(training-log): add started and completed queries"
```

---

## Task 3: Servicio de sesiones de entrenamiento

**Files:**

- Create: `src/Service/TrainingSessionService.php`
- Create: `tests/Unit/Service/TrainingSessionServiceTest.php`

- [ ] **Step 1: Crear el servicio**

Crea `src/Service/TrainingSessionService.php`:

```php
<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\Training;
use App\Entity\User;
use App\Entity\UserLevelProgress;
use App\Entity\UserTrainingLog;
use App\Repository\TrainingLevelRepository;
use App\Repository\UserLevelProgressRepository;
use App\Repository\UserTrainingLogRepository;
use Doctrine\ORM\EntityManagerInterface;

class TrainingSessionService
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly UserLevelProgressRepository $progressRepository,
        private readonly UserTrainingLogRepository $logRepository,
        private readonly TrainingLevelRepository $levelRepository,
        private readonly LevelProgressService $levelProgressService,
    ) {
    }

    public function startSession(User $user, Training $training): UserTrainingLog
    {
        $level = $training->getTrainingLevel();
        if (null === $level) {
            throw new \InvalidArgumentException('La sesión no pertenece a un nivel de programa.');
        }

        $program = $level->getProgram();
        if (null === $program) {
            throw new \InvalidArgumentException('El nivel no pertenece a un programa.');
        }

        $this->ensureProgramProgress($user, $program);

        $progress = $this->progressRepository->findByUserAndLevel($user, $level);
        if (null === $progress || UserLevelProgress::STATUS_LOCKED === $progress->getStatus()) {
            throw new \InvalidArgumentException('Este nivel aún está bloqueado.');
        }

        $existing = $this->logRepository->findStartedButNotCompletedByUser($user);
        if (null !== $existing && $existing->getTraining()?->getId() !== $training->getId()) {
            $existing->setCompletedAt(new \DateTimeImmutable());
        }

        $log = new UserTrainingLog();
        $log->setUser($user);
        $log->setTraining($training);
        $log->setSource(UserTrainingLog::SOURCE_PROGRAM);

        $this->entityManager->persist($log);
        $this->entityManager->flush();

        return $log;
    }

    public function completeSession(User $user, Training $training, ?int $durationSeconds = null, int $xpEarned = 50): UserTrainingLog
    {
        $log = $this->logRepository->createQueryBuilder('log')
            ->where('log.user = :user')
            ->andWhere('log.training = :training')
            ->andWhere('log.completedAt IS NULL')
            ->setParameter('user', $user)
            ->setParameter('training', $training)
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();

        if (null === $log) {
            throw new \InvalidArgumentException('No se encontró una sesión iniciada para este entrenamiento.');
        }

        $log->setCompletedAt(new \DateTimeImmutable());
        $log->setDurationSeconds($durationSeconds);
        $log->setXpEarned($xpEarned);

        $user->addXp($xpEarned);
        $user->incrementWorkouts();
        $user->setLastWorkoutAt(new \DateTimeImmutable());

        $this->advanceWeekIfPhaseCompleted($user, $training);

        $this->entityManager->flush();

        return $log;
    }

    public function getNextSessionForUser(User $user): ?array
    {
        $started = $this->logRepository->findStartedButNotCompletedByUser($user);
        if (null !== $started) {
            $training = $started->getTraining();

            return [
                'type' => 'continue',
                'logId' => $started->getId(),
                'startedAt' => $started->getStartedAt()?->format(\DateTimeInterface::ATOM),
                'training' => $training,
                'level' => $training?->getTrainingLevel(),
                'program' => $training?->getTrainingLevel()?->getProgram(),
            ];
        }

        $activeProgress = $this->progressRepository->findActiveByUser($user);
        if (null === $activeProgress) {
            return null;
        }

        $level = $activeProgress->getTrainingLevel();
        $program = $level->getProgram();
        $currentWeek = $activeProgress->getCurrentWeek();

        $trainings = $this->levelRepository->findTrainingsForWeek($level, $currentWeek);

        foreach ($trainings as $training) {
            $completed = $this->logRepository->findCompletedByUserAndLevelAndWeek($user, $level, $currentWeek);
            $completedIds = array_map(static fn (UserTrainingLog $log) => $log->getTraining()?->getId(), $completed);

            if (!\in_array($training->getId(), $completedIds, true)) {
                return [
                    'type' => 'next',
                    'training' => $training,
                    'level' => $level,
                    'program' => $program,
                ];
            }
        }

        return null;
    }

    private function ensureProgramProgress(User $user, $program): void
    {
        $existingActive = $this->progressRepository->findAllActiveByUser($user);
        $hasActiveForProgram = false;

        foreach ($existingActive as $progress) {
            if ($progress->getTrainingLevel()->getProgram()?->getId() === $program->getId()) {
                $hasActiveForProgram = true;
                break;
            }
        }

        if (!$hasActiveForProgram) {
            $this->levelProgressService->switchProgram($user, $program);
        }
    }

    private function advanceWeekIfPhaseCompleted(User $user, Training $training): void
    {
        $level = $training->getTrainingLevel();
        if (null === $level) {
            return;
        }

        $progress = $this->progressRepository->findByUserAndLevel($user, $level);
        if (null === $progress) {
            return;
        }

        $currentWeek = $progress->getCurrentWeek();
        $weekTrainings = $this->levelRepository->findTrainingsForWeek($level, $currentWeek);
        $completed = $this->logRepository->findCompletedByUserAndLevelAndWeek($user, $level, $currentWeek);

        if (\count($completed) >= \count($weekTrainings) && $currentWeek < 3) {
            $progress->setCurrentWeek($currentWeek + 1);
            $this->entityManager->flush();
        }
    }
}
```

- [ ] **Step 2: Añadir `findTrainingsForWeek` al repositorio de niveles**

En `src/Repository/TrainingLevelRepository.php` añade:

```php
/**
 * @return Training[]
 */
public function findTrainingsForWeek(TrainingLevel $level, int $weekNumber): array
{
    return $this->getEntityManager()->createQueryBuilder()
        ->select('t')
        ->from('App\\Entity\\Training', 't')
        ->where('t.trainingLevel = :level')
        ->andWhere('t.weekNumber = :weekNumber')
        ->setParameter('level', $level)
        ->setParameter('weekNumber', $weekNumber)
        ->orderBy('t.id', 'ASC')
        ->getQuery()
        ->getResult();
}
```

- [ ] **Step 3: Commit**

```bash
git add src/Service/TrainingSessionService.php src/Repository/TrainingLevelRepository.php
git commit -m "feat(session): add training session service"
```

---

## Task 4: Controller y endpoints de sesiones

**Files:**

- Create: `src/Controller/TrainingSessionApiController.php`
- Modify: `config/routes.yaml` o atributos en el controller
- Create: `tests/Functional/Api/TrainingSessionApiTest.php`

- [ ] **Step 1: Crear controller**

Crea `src/Controller/TrainingSessionApiController.php`:

```php
<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Training;
use App\Entity\User;
use App\Service\TrainingSessionService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class TrainingSessionApiController extends AbstractController
{
    public function __construct(
        private readonly TrainingSessionService $sessionService,
        private readonly NormalizerInterface $normalizer,
        private readonly EntityManagerInterface $entityManager,
    ) {
    }

    #[Route('/user/trainings/{trainingId}/start', name: 'start_training_session', methods: ['POST'])]
    public function startSession(int $trainingId, Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        $training = $this->getTraining($trainingId);
        if (null === $training) {
            return $this->json(['error' => 'Entrenamiento no encontrado'], 404);
        }

        try {
            $log = $this->sessionService->startSession($user, $training);
        } catch (\InvalidArgumentException $e) {
            return $this->json(['error' => $e->getMessage()], 400);
        }

        return $this->json(
            $this->normalizer->normalize($log, null, ['groups' => ['user_training_log:read']])
        );
    }

    #[Route('/user/trainings/{trainingId}/complete', name: 'complete_training_session', methods: ['POST'])]
    public function completeSession(int $trainingId, Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        $training = $this->getTraining($trainingId);
        if (null === $training) {
            return $this->json(['error' => 'Entrenamiento no encontrado'], 404);
        }

        $data = json_decode($request->getContent(), true);
        $durationSeconds = isset($data['durationSeconds']) ? (int) $data['durationSeconds'] : null;
        $xpEarned = isset($data['xpEarned']) ? (int) $data['xpEarned'] : 50;

        try {
            $log = $this->sessionService->completeSession($user, $training, $durationSeconds, $xpEarned);
        } catch (\InvalidArgumentException $e) {
            return $this->json(['error' => $e->getMessage()], 400);
        }

        return $this->json(
            $this->normalizer->normalize($log, null, ['groups' => ['user_training_log:read']])
        );
    }

    #[Route('/user/trainings/next', name: 'get_next_training_session', methods: ['GET'])]
    public function getNextSession(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        $next = $this->sessionService->getNextSessionForUser($user);

        if (null === $next) {
            return $this->json(['error' => 'No hay sesión pendiente'], 404);
        }

        return $this->json([
            'type' => $next['type'],
            'logId' => $next['logId'] ?? null,
            'startedAt' => $next['startedAt'] ?? null,
            'training' => $this->normalizer->normalize($next['training'], null, ['groups' => [Training::GROUP_READ]]),
            'level' => $this->normalizer->normalize($next['level'], null, ['groups' => ['training_level:read']]),
            'program' => $this->normalizer->normalize($next['program'], null, ['groups' => ['program:read']]),
        ]);
    }

    private function getTraining(int $id): ?Training
    {
        return $this->entityManager->getRepository(Training::class)->find($id);
    }
}
```

- [ ] **Step 2: Añadir grupos de serialización necesarios**

Asegúrate de que `Training` tenga `GROUP_READ` con `trainingLevel` expuesto como string o como entidad según convenga. Si es necesario, añade un método o campo `trainingLevel` en `Training::GROUP_READ`.

- [ ] **Step 3: Tests funcionales**

Crea `tests/Functional/Api/TrainingSessionApiTest.php`. Ejemplo de test mínimo:

```php
<?php

declare(strict_types=1);

namespace App\Tests\Functional\Api;

use App\Entity\Training;
use App\Entity\TrainingProgram;
use App\Entity\User;
use App\Enum\Discipline;
use App\Enum\TargetWorkout;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final class TrainingSessionApiTest extends WebTestCase
{
    private ?EntityManagerInterface $entityManager = null;
    private ?UserPasswordHasherInterface $passwordHasher = null;
    private ?string $authToken = null;
    private ?User $testUser = null;
    private ?object $client = null;

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->entityManager = static::getContainer()->get(EntityManagerInterface::class);
        $this->passwordHasher = static::getContainer()->get(UserPasswordHasherInterface::class);
        $this->createTestUserAndLogin();
    }

    private function createTestUserAndLogin(): void
    {
        $this->testUser = new User();
        $this->testUser->setNick('sessiontest');
        $this->testUser->setEmail('session@test.com');
        $this->testUser->setPassword($this->passwordHasher->hashPassword($this->testUser, 'Test123!'));
        $this->testUser->setRoles(['ROLE_USER']);

        $this->entityManager->persist($this->testUser);
        $this->entityManager->flush();

        $this->client->request(
            'POST',
            '/login',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode(['email' => 'session@test.com', 'password' => 'Test123!'])
        );

        $data = json_decode($this->client->getResponse()->getContent(), true);
        $this->authToken = $data['token'] ?? null;
    }

    private function createProgramWithTraining(): array
    {
        $program = new TrainingProgram();
        $program->setName('Programa Test');
        $program->setSlug('programa-test');
        $program->setDiscipline('calisthenics');
        $program->setDifficulty('beginner');
        $this->entityManager->persist($program);

        $level = new \App\Entity\TrainingLevel();
        $level->setProgram($program);
        $level->setLevelNumber(1);
        $level->setName('Nivel 1');
        $this->entityManager->persist($level);

        $training = new Training();
        $training->setName('Sesión 1');
        $training->setDiscipline(Discipline::CALISTHENICS);
        $training->setTarget(TargetWorkout::STRENGTH);
        $training->setTrainingLevel($level);
        $training->setWeekNumber(0);
        $this->entityManager->persist($training);

        $this->entityManager->flush();

        return [$program, $level, $training];
    }

    public function testStartSessionCreatesProgressAndLog(): void
    {
        [, , $training] = $this->createProgramWithTraining();

        $this->client->request(
            'POST',
            '/user/trainings/'.$training->getId().'/start',
            [],
            [],
            ['HTTP_AUTHORIZATION' => 'Bearer '.$this->authToken]
        );

        $response = $this->client->getResponse();
        $this->assertSame(200, $response->getStatusCode());

        $data = json_decode($response->getContent(), true);
        $this->assertArrayHasKey('startedAt', $data);
        $this->assertNull($data['completedAt'] ?? null);
    }
}
```

Añade tests para `complete` y `GET /user/trainings/next` siguiendo el mismo patrón.

- [ ] **Step 4: Ejecutar tests backend**

```bash
php bin/phpunit tests/Unit/Service/TrainingSessionServiceTest.php tests/Functional/Api/TrainingSessionApiTest.php --no-coverage
```

- [ ] **Step 5: Commit**

```bash
git add src/Controller/TrainingSessionApiController.php tests/Functional/Api/TrainingSessionApiTest.php
git commit -m "feat(api): add training session endpoints"
```

---

## Task 5: Frontend - Endpoints y servicios

**Files:**

- Modify: `src/utils/constants.js`
- Modify: `src/services/trainings.js`
- Modify: `src/services/userProfile.js`

- [ ] **Step 1: Añadir endpoints en constantes**

En `src/utils/constants.js`, dentro de `TRAININGS`, añade:

```javascript
START: '/user/trainings/{trainingId}/start',
COMPLETE: '/user/trainings/{trainingId}/complete',
NEXT: '/user/trainings/next',
```

- [ ] **Step 2: Extender trainingService**

En `src/services/trainings.js`, añade dentro del objeto:

```javascript
async start(id) {
  const response = await apiClient.post(API_ENDPOINTS.TRAININGS.START.replace('{trainingId}', id))
  return response.data
},

async complete(id, data = {}) {
  const response = await apiClient.post(API_ENDPOINTS.TRAININGS.COMPLETE.replace('{trainingId}', id), data)
  return response.data
},
```

- [ ] **Step 3: Extender userProfileService**

En `src/services/userProfile.js`, añade:

```javascript
async getNextTraining() {
  const response = await apiClient.get(API_ENDPOINTS.TRAININGS.NEXT)
  return response.data
},
```

- [ ] **Step 4: Commit**

```bash
git add src/utils/constants.js src/services/trainings.js src/services/userProfile.js
git commit -m "feat(api): wire training session endpoints in frontend"
```

---

## Task 6: Frontend - Vista de detalle de programa

**Files:**

- Create: `src/views/user/ProgramDetailView.vue`
- Modify: `src/router/user-routes.js`

- [ ] **Step 1: Crear la vista**

Crea `src/views/user/ProgramDetailView.vue` que:

- Reciba `programId` de la ruta.
- Obtenga el programa desde `programsStore` o `programsService`.
- Obtenga niveles/fases/sesiones con `levelProgressService.getProgramLevels(programId)`.
- Renderice cabecera con poster, nombre, metadatos y lista de niveles.
- Al pulsar una sesión, llame a `trainingService.start(session.id)` y navegue a `/user/train/{sessionId}`.

Ejemplo de estructura del template:

```vue
<template>
  <div class="mobile-view">
    <MobilePageHeader title="Programa" show-back />
    <div class="mobile-container">
      <section class="program-hero">
        <h1>{{ program.name }}</h1>
        <p>{{ program.description }}</p>
        <p>{{ levelsLabel }}</p>
      </section>
      <section>
        <h2>Niveles</h2>
        <div v-for="level in levels" :key="level.id" class="level-card">
          <h3>{{ level.name }}</h3>
          <div v-for="phase in level.phases" :key="phase.weekNumber">
            <h4>{{ phase.name }}</h4>
            <button
              v-for="session in phase.sessions"
              :key="session.id"
              @click="startSession(session)"
            >
              {{ session.name }}
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
```

- [ ] **Step 2: Añadir ruta**

En `src/router/user-routes.js`, dentro de `children` de `/user`, añade:

```javascript
{
  path: 'programs/:programId',
  name: 'user-program-detail',
  component: () => import('@/views/user/ProgramDetailView.vue'),
  meta: {
    title: 'Programa',
    requiresAuth: true,
    requiresRole: USER_ROLES.USER,
  },
},
```

- [ ] **Step 3: Test unitario mínimo**

Crea `src/views/user/__tests__/ProgramDetailView.spec.js` que verifique que se renderiza el nombre del programa y los niveles.

- [ ] **Step 4: Commit**

```bash
git add src/views/user/ProgramDetailView.vue src/router/user-routes.js src/views/user/__tests__/ProgramDetailView.spec.js
git commit -m "feat(programs): add public program detail view"
```

---

## Task 7: Frontend - Explorar con carrusel infinito y navegación a detalle

**Files:**

- Modify: `src/views/user/ExploreView.vue`

- [ ] **Step 1: Activar loop en carruseles de programas**

En `src/views/user/ExploreView.vue`, añade `loop` a los dos `HorizontalCarousel` de programas:

```vue
<HorizontalCarousel ... :loop="true">
```

- [ ] **Step 2: Cambiar navegación a detalle**

Reemplaza `handleProgramClick` por:

```javascript
const handleProgramClick = (program) => {
  router.push({ name: 'user-program-detail', params: { programId: program.id } })
}
```

- [ ] **Step 3: Actualizar tests de ExploreView**

En `src/views/user/__tests__/ExploreView.spec.js`, ajusta el test que verifica navegación para que espere `user-program-detail` en lugar de `user-program` o `user-home`.

- [ ] **Step 4: Commit**

```bash
git add src/views/user/ExploreView.vue src/views/user/__tests__/ExploreView.spec.js
git commit -m "feat(explore): infinite carousel and navigate to program detail"
```

---

## Task 8: Frontend - TrainView integra start/complete

**Files:**

- Modify: `src/views/user/TrainView.vue`

- [ ] **Step 1: Llamar a start al montar**

En `src/views/user/TrainView.vue`, modifica `onMounted`:

```javascript
onMounted(async () => {
  await fetchTraining()
  if (training.value?.id) {
    try {
      await trainingService.start(training.value.id)
    } catch (err) {
      console.error('Error iniciando sesión:', err)
    }
  }
})
```

- [ ] **Step 2: Llamar a complete al finalizar**

Modifica `finishTraining`:

```javascript
const finishTraining = async () => {
  clearInterval(mainTimer)
  mainTimer = null
  clearInterval(exerciseTimerInterval)
  exerciseTimerInterval = null

  if (training.value?.id) {
    try {
      await trainingService.complete(training.value.id, {
        durationSeconds: elapsedTime.value,
      })
    } catch (err) {
      console.error('Error completando sesión:', err)
    }
  }

  router.push({ name: 'user-home' })
}
```

- [ ] **Step 3: Commit**

```bash
git add src/views/user/TrainView.vue
git commit -m "feat(train): integrate start and complete session endpoints"
```

---

## Task 9: Frontend - Dashboard con continue/next

**Files:**

- Modify: `src/views/user/DashboardView.vue`
- Modify: `src/views/user/__tests__/DashboardView.spec.js`

- [ ] **Step 1: Añadir estado para siguiente sesión**

En `src/views/user/DashboardView.vue`, añade:

```javascript
const nextSession = ref(null)
const loadingNextSession = ref(false)
```

- [ ] **Step 2: Cargar siguiente sesión al montar**

Añade dentro de `onMounted`:

```javascript
const loadNextSession = async () => {
  loadingNextSession.value = true
  try {
    nextSession.value =
      (await userProfileStore.fetchNextSession?.()) ?? (await userProfileService.getNextTraining())
  } catch {
    nextSession.value = null
  } finally {
    loadingNextSession.value = false
  }
}

onMounted(async () => {
  await Promise.all([
    userProfileStore.fetchActiveProgress(),
    favoritesStore.loadFavorites(),
    userStatsStore.fetchDashboardStats(),
    loadNextSession(),
  ])
})
```

- [ ] **Step 3: Mostrar card de acción principal**

Reemplaza el bloque `template v-if="userProfileStore.hasActiveProgram"` por lógica que use `nextSession`:

```vue
<template v-if="nextSession">
  <section class="dashboard-view__section">
    <ContinueCard
      :title="nextSession.training.name"
      :subtitle="continueSubtitle"
      @continue="openNextSession"
    />
  </section>
</template>

<template v-else-if="!hasProgramsOrFavorites">
  <!-- empty state actual -->
</template>
```

Define `continueSubtitle` e `openNextSession`:

```javascript
const continueSubtitle = computed(() => {
  if (!nextSession.value) return ''
  return nextSession.value.type === 'continue'
    ? `${nextSession.value.program?.name} · Continúa donde lo dejaste`
    : `${nextSession.value.program?.name} · Siguiente sesión`
})

const openNextSession = () => {
  if (nextSession.value?.training?.id) {
    router.push({ name: 'user-train', params: { sessionId: nextSession.value.training.id } })
  }
}
```

- [ ] **Step 4: Actualizar tests**

Ajusta `src/views/user/__tests__/DashboardView.spec.js` para mockear `userProfileService.getNextTraining` y verificar que la card se renderiza cuando hay `nextSession`.

- [ ] **Step 5: Commit**

```bash
git add src/views/user/DashboardView.vue src/views/user/__tests__/DashboardView.spec.js
git commit -m "feat(dashboard): show continue or next session card"
```

---

## Task 10: Integración y validación final

- [ ] **Step 1: Backend tests**

```bash
cd C:/Projects/overworkout-back
php bin/phpunit --no-coverage
vendor/bin/phpstan analyse --configuration=phpstan.neon.dist --no-progress --memory-limit=1G
```

- [ ] **Step 2: Frontend tests, lint y build**

```bash
cd C:/Projects/overworkout-front
npm run test
npm run lint
npm run build
```

- [ ] **Step 3: Commit final si hay cambios**

```bash
git diff --stat
# si hay cambios:
git add -A && git commit -m "chore: final adjustments for explore-to-training flow"
```

---

## Self-review checklist

- [ ] Todos los requisitos del spec (`docs/explore-program-flow-design.md`) están cubiertos por una tarea.
- [ ] No hay placeholders (`TBD`, `TODO`, `implement later`) en el plan.
- [ ] Las rutas backend (`/user/trainings/{id}/start`, `/user/trainings/{id}/complete`, `/user/trainings/next`) coinciden en frontend y backend.
- [ ] El nombre de la ruta frontend `user-program-detail` se usa tanto en `router/user-routes.js` como en `ExploreView.vue`.
- [ ] `UserTrainingLog` queda con `startedAt` no nulo y `completedAt` nulo para sesiones en curso.

## Execution handoff

Plan saved to `docs/explore-program-flow-plan.md`.

Two execution options:

1. **Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** - Execute tasks in this session using `executing-plans`, batch execution with checkpoints.

Which approach do you want?
