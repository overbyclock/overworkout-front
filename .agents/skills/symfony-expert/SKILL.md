---
name: symfony-expert
description: Experto en Symfony 6/7 con PHP 8+, API Platform, Doctrine ORM y arquitectura hexagonal/Clean Architecture. Usar cuando se necesite revisar código backend, implementar APIs REST, diseñar entidades, crear servicios, aplicar principios SOLID, o refactorizar código legacy. Especializado en JWT authentication, validación, DTOs, y buenas prácticas de API RESTful.
---

# Symfony + API Platform Expert

Guía para desarrollar backends robustos, escalables y mantenibles con Symfony.

## Arquitectura y Estructura

### Estructura de Carpetas Recomendada

```
src/
├── Controller/          # Solo para routing y HTTP
│   └── Api/
├── Service/            # Lógica de negocio
│   ├── Command/        # Operaciones de escritura (CQRS)
│   └── Query/          # Operaciones de lectura
├── Repository/         # Acceso a datos
├── Entity/             # Entidades Doctrine
├── DTO/                # Data Transfer Objects
├── ValueObject/        # Objetos de valor inmutables
├── Event/              # Eventos de dominio
├── Listener/           # Event listeners/subscribers
├── Security/           # Voters, authenticators
├── Validator/          # Validadores custom
├── Mapper/             # Mappers Entity <-> DTO
└── Exception/          # Excepciones de dominio
```

### Principios SOLID

| Principio | Aplicación en Symfony |
|-----------|----------------------|
| **S**ingle Responsibility | Un controller = un endpoint, un service = una responsabilidad |
| **O**pen/Closed | Extender con decorators, no modificar código existente |
| **L**iskov Substitution | Interfaces para repositories, type-hint contra interfaces |
| **I**nterface Segregation | Interfaces pequeñas y específicas |
| **D**ependency Inversion | Inyectar interfaces, no implementaciones |

## Controladores Limpios

### Principio: Controller como "Dispatcher"

```php
#[Route('/api/users', methods: ['POST'])]
class CreateUserController extends AbstractController
{
    public function __construct(
        private CreateUserHandler $handler,
        private DtoSerializer $serializer,
    ) {}

    public function __invoke(CreateUserRequest $request): JsonResponse
    {
        // 1. Input ya validado por Symfony (ver Validación)
        $command = $request->toCommand();
        
        // 2. Delegar a handler
        $user = $this->handler->handle($command);
        
        // 3. Retornar respuesta
        return $this->json(
            $this->serializer->toDto($user),
            Response::HTTP_CREATED
        );
    }
}
```

❌ **NO** poner lógica de negocio en controllers
❌ **NO** acceder al EntityManager directamente desde controllers
✅ **SÍ** usar DTOs para request/response
✅ **SÍ** inyectar servicios específicos, no el container

## DTOs y Validación

### Request DTO con Validación

```php
class CreateUserRequest
{
    #[Assert\NotBlank(message: 'El email es obligatorio')]
    #[Assert\Email(message: 'El email no es válido')]
    public string $email;

    #[Assert\NotBlank(message: 'La contraseña es obligatoria')]
    #[Assert\Length(min: 8, minMessage: 'Mínimo 8 caracteres')]
    #[Assert\Regex(
        pattern: '/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/',
        message: 'Debe contener mayúscula, minúscula y número'
    )]
    public string $password;

    #[Assert\Choice(choices: ['ADMIN', 'USER'], message: 'Rol inválido')]
    public string $role = 'USER';

    public function toCommand(): CreateUserCommand
    {
        return new CreateUserCommand(
            email: new Email($this->email),
            password: new PlainPassword($this->password),
            role: Role::from($this->role)
        );
    }
}
```

### Value Objects

```php
// Inmutable y siempre válido
final class Email
{
    public function __construct(
        private string $value
    ) {
        if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException('Email inválido');
        }
        $this->value = strtolower($value);
    }

    public function value(): string 
    {
        return $this->value;
    }

    public function equals(self $other): bool
    {
        return $this->value === $other->value;
    }
}
```

## Servicios y Lógica de Negocio

### Command Handler Pattern

```php
final class CreateUserHandler
{
    public function __construct(
        private UserRepositoryInterface $repository,
        private PasswordHasherInterface $passwordHasher,
        private EventDispatcherInterface $dispatcher,
    ) {}

    public function handle(CreateUserCommand $command): User
    {
        // 1. Validaciones de negocio
        if ($this->repository->existsByEmail($command->email)) {
            throw new UserAlreadyExistsException($command->email);
        }

        // 2. Crear entidad
        $user = new User(
            id: UserId::generate(),
            email: $command->email,
            hashedPassword: $this->passwordHasher->hash($command->password),
            role: $command->role,
        );

        // 3. Persistir
        $this->repository->save($user);

        // 4. Disparar eventos
        $this->dispatcher->dispatch(new UserCreatedEvent($user->id()));

        return $user;
    }
}
```

### CQRS - Separación Lectura/Escritura

```php
// Command (escritura)
final class UpdateExerciseHandler { /* ... */ }

// Query (lectura)
final class ListExercisesQueryHandler 
{
    public function __construct(
        private Connection $readDb, // Conexión de solo lectura opcional
    ) {}

    public function handle(ListExercisesQuery $query): PaginatedResult
    {
        // Usar Query Builder o SQL directo optimizado
        $qb = $this->readDb->createQueryBuilder();
        // ...
    }
}
```

## Entidades Doctrine

### Diseño de Entidades

```php
#[ORM\Entity]
#[ORM\Table(name: 'exercises')]
class Exercise
{
    #[ORM\Id]
    #[ORM\Column(type: 'uuid', unique: true)]
    private string $id;

    #[ORM\Column(length: 255)]
    private string $name;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $description = null;

    #[ORM\ManyToMany(targetEntity: Equipment::class)]
    #[ORM\JoinTable(name: 'exercise_equipment')]
    private Collection $equipment;

    // NO exponer setters públicos para todo
    // Usar métodos de dominio con significado
    
    public function rename(string $newName): void
    {
        if (empty($newName)) {
            throw new InvalidArgumentException('El nombre no puede estar vacío');
        }
        $this->name = $newName;
    }

    public function addEquipment(Equipment $equipment): void
    {
        if (!$this->equipment->contains($equipment)) {
            $this->equipment->add($equipment);
        }
    }
}
```

### Repositorios

```php
interface ExerciseRepositoryInterface
{
    public function save(Exercise $exercise): void;
    public function remove(Exercise $exercise): void;
    public function findById(ExerciseId $id): ?Exercise;
    public function findByName(string $name): array;
}

#[ORM\Entity(repositoryClass: ExerciseRepository::class)]
final class ExerciseRepository implements ExerciseRepositoryInterface
{
    public function __construct(
        private EntityManagerInterface $em
    ) {}

    public function save(Exercise $exercise): void
    {
        $this->em->persist($exercise);
        $this->em->flush();
    }

    // ...
}
```

## Seguridad

### JWT Authentication

```yaml
# config/packages/security.yaml
security:
    password_hashers:
        Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface: 'auto'
    
    providers:
        app_user_provider:
            entity:
                class: App\Entity\User
                property: email
    
    firewalls:
        login:
            pattern: ^/api/login
            stateless: true
            json_login:
                check_path: /api/login_check
                success_handler: lexik_jwt_authentication.handler.authentication_success
                failure_handler: lexik_jwt_authentication.handler.authentication_failure
        
        api:
            pattern: ^/api
            stateless: true
            jwt: ~
```

### Voters para Autorización

```php
class ExerciseVoter extends Voter
{
    public const EDIT = 'EXERCISE_EDIT';
    public const DELETE = 'EXERCISE_DELETE';

    protected function supports(string $attribute, mixed $subject): bool
    {
        return in_array($attribute, [self::EDIT, self::DELETE])
            && $subject instanceof Exercise;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();
        if (!$user instanceof User) {
            return false;
        }

        return match($attribute) {
            self::EDIT, self::DELETE => $user->isAdmin() || $subject->getCreatedBy() === $user,
            default => false,
        };
    }
}

// Uso en controller
$this->denyAccessUnlessGranted(ExerciseVoter::EDIT, $exercise);
```

## API RESTful

### Convenciones de Endpoints

| Método | Endpoint | Acción | Response Codes |
|--------|----------|--------|----------------|
| GET | `/api/resources` | Listar | 200 OK |
| GET | `/api/resources/{id}` | Obtener uno | 200 OK, 404 Not Found |
| POST | `/api/resources` | Crear | 201 Created, 400/422 Validation |
| PUT | `/api/resources/{id}` | Reemplazar | 200 OK, 404 Not Found |
| PATCH | `/api/resources/{id}` | Actualizar parcial | 200 OK, 404 Not Found |
| DELETE | `/api/resources/{id}` | Eliminar | 204 No Content, 404 Not Found |

### Respuestas de Error Estandarizadas

```php
{
    "type": "https://api.overworkout.com/errors/validation-failed",
    "title": "Validation Failed",
    "status": 422,
    "detail": "El campo 'email' es obligatorio",
    "errors": [
        {
            "field": "email",
            "message": "El email es obligatorio"
        },
        {
            "field": "password",
            "message": "Mínimo 8 caracteres"
        }
    ]
}
```

## Testing

### Estructura de Tests

```php
// Unit test
class CreateUserHandlerTest extends TestCase
{
    use ProphecyTrait;

    public function test_handle_creates_user(): void
    {
        $repository = $this->prophesize(UserRepositoryInterface::class);
        // ...
    }
}

// Integration test
class ExerciseControllerTest extends WebTestCase
{
    public function test_create_exercise_requires_authentication(): void
    {
        $client = static::createClient();
        $client->request('POST', '/api/exercises', [
            'json' => ['name' => 'Push-ups']
        ]);
        
        $this->assertResponseStatusCodeSame(401);
    }
}
```

## Performance

- **Lazy Loading**: Cuidado con N+1 queries, usar `fetch: 'EAGER'` o joins
- **Pagination**: Siempre paginar listados
- **Caching**: Redis para queries frecuentes
- **Indexing**: Añadir índices en campos de búsqueda frecuente
- **DTOs**: Evitar serializar entidades completas

## Checklist de Revisión

- [ ] ¿Controller solo hace routing?
- [ ] ¿Lógica de negocio está en services/handlers?
- [ ] ¿Uso de DTOs para input/output?
- [ ] ¿Validación en DTOs con atributos?
- [ ] ¿Value Objects para datos con reglas?
- [ ] ¿Interfaces para repositories?
- [ ] ¿Tests unitarios para handlers?
- [ ] ¿Respuestas HTTP correctas?
- [ ] ¿Manejo de errores consistente?
- [ ] ¿Sin lógica en entidades (solo comportamiento de dominio)?
