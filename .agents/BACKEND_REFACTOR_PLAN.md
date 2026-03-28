# 🚀 Plan de Refactorización Backend - OverWorkout API

> **Score Actual**: Técnico 52/100 | IA-Friendly 58/100 | **Objetivo**: 80+/80+

---

## 📊 Análisis Comparativo

| Aspecto | Análisis Técnico | Análisis IA | Prioridad |
|---------|------------------|-------------|-----------|
| **Tests** | 2/15 🔴 Crítico | Sin cobertura | P0 |
| **Estructura** | Sin DTOs/Clean Arch | Scripts en raíz caóticos | P0 |
| **Documentación** | Básica | No existe README | P0 |
| **API Platform** | Inconsistente | No se aprovecha | P1 |
| **Seguridad** | JWT hardcodeado | - | P1 |
| **Código** | Fat controllers | Typos, inconsistencias | P1 |

---

## 🎯 FASE 1: Fundamentos (P0 - Bloqueantes)

### Semana 1: Testing Mínimo + Documentación

#### 1.1 Crear README.md
```markdown
# OverWorkout Backend

## Requisitos
- PHP 8.2+
- Symfony CLI
- MySQL 8.0
- Composer 2.x

## Instalación
1. git clone...
2. composer install
3. cp .env.example .env.local
4. php bin/console doctrine:database:create
5. php bin/console doctrine:migrations:migrate
6. symfony server:start

## Estructura
src/
├── Controller/     # API Controllers
├── Entity/         # Doctrine Entities  
├── Repository/     # Data access
├── Service/        # Business logic
└── Security/       # JWT Auth

## Scripts Útiles
- `php bin/console app:create-user`
- `php bin/console app:load-fixtures`

## API Endpoints
Ver documentación completa en /api/docs (API Platform)
```

#### 1.2 Organizar Scripts de Datos
```
# Crear estructura
mkdir -p scripts/{migrations,seeders,checks,data-fixes}

# Mover scripts existentes
mv add_*.php scripts/seeders/
mv fix_*.php scripts/data-fixes/
mv check_*.php scripts/checks/
mv *migration*.php scripts/migrations/
```

#### 1.3 Tests Mínimos Críticos
```bash
# Instalar dependencias
composer require --dev phpunit/phpunit symfony/test-pack doctrine/doctrine-fixtures-bundle

# Tests a implementar:
1. AuthenticationTest - Login/Register funciona
2. AuthorizationTest - Usuario A no ve datos de Usuario B
3. TrainingCrudTest - CRUD básico de trainings
4. EquipmentCrudTest - CRUD básico de equipment
```

**Objetivo**: Tener tests que fallen si se rompe autenticación o autorización.

---

## 🎯 FASE 2: Seguridad + Calidad (P1 - Importantes)

### Semana 2: Seguridad y Estabilidad

#### 2.1 Mover JWT_SECRET a Secrets
```bash
# 1. Generar nueva clave segura
openssl rand -base64 32

# 2. Guardar en secrets de Symfony
php bin/console secrets:set JWT_SECRET_KEY

# 3. Actualizar .env (quitar hardcodeado)
# Antes: JWT_SECRET_KEY="hardcodeado..."
# Después: JWT_SECRET_KEY=%env(JWT_SECRET_KEY)%

# 4. Limpiar .env del repo
# Añadir a .gitignore si no está
```

#### 2.2 Configurar PHP-CS-Fixer
```bash
composer require --dev friendsofphp/php-cs-fixer

# Crear .php-cs-fixer.dist.php
# Configurar PSR-12 + Symfony rules
# Ejecutar: vendor/bin/php-cs-fixer fix
```

#### 2.3 Configurar PHPStan (Análisis Estático)
```bash
composer require --dev phpstan/phpstan phpstan/extension-installer phpstan/phpstan-symfony

# Nivel 5 inicial (objetivo: llegar a 8)
# Crear phpstan.neon.dist
```

#### 2.4 Corregir Typos Críticos
```php
// TrainingApiController.php línea 327
// ANTES: 'cratedAt' => ...
// DESPUÉS: 'createdAt' => ...
```

---

## 🎯 FASE 3: Arquitectura + DTOs (P1 - Importantes)

### Semanas 3-4: Mejorar Estructura

#### 3.1 Crear DTOs para Input/Output
```php
// src/DTO/CreateTrainingRequest.php
namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

class CreateTrainingRequest
{
    #[Assert\NotBlank]
    #[Assert\Length(min: 3, max: 100)]
    public string $name;
    
    #[Assert\Choice(callback: [Discipline::class, 'values'])]
    public string $discipline;
    
    #[Assert\Valid]
    public array $exercises = [];
}
```

#### 3.2 Implementar Voters para Autorización
```php
// src/Security/Voter/TrainingVoter.php
namespace App\Security\Voter;

use App\Entity\Training;
use App\Entity\User;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class TrainingVoter extends Voter
{
    const VIEW = 'view';
    const EDIT = 'edit';
    const DELETE = 'delete';
    
    protected function supports(string $attribute, mixed $subject): bool
    {
        return in_array($attribute, [self::VIEW, self::EDIT, self::DELETE])
            && $subject instanceof Training;
    }
    
    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();
        if (!$user instanceof User) return false;
        
        /** @var Training $training */
        $training = $subject;
        
        return match($attribute) {
            self::VIEW => $training->getUser() === $user || $user->isAdmin(),
            self::EDIT, self::DELETE => $training->getUser() === $user,
            default => false,
        };
    }
}
```

#### 3.3 Refactorizar Serialización
```php
// Usar Symfony Serializer en lugar de arrays manuales
use Symfony\Component\Serializer\SerializerInterface;

// En lugar de:
$data = [
    'id' => $entity->getId(),
    'name' => $entity->getName(),
    // ...
];

// Usar:
$json = $serializer->serialize($entity, 'json', ['groups' => 'training:read']);
```

---

## 🎯 FASE 4: API Platform + Optimización (P2 - Mejoras)

### Semanas 5-6: Modernizar API

#### 4.1 Migrar CRUDs Simples a API Platform
```php
// src/Entity/Equipment.php

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Delete;
use Symfony\Component\Serializer\Attribute\Groups;

#[ApiResource(
    operations: [
        new GetCollection(normalizationContext: ['groups' => 'equipment:list']),
        new Get(normalizationContext: ['groups' => 'equipment:read']),
        new Post(denormalizationContext: ['groups' => 'equipment:write']),
        new Patch(denormalizationContext: ['groups' => 'equipment:write']),
        new Delete(),
    ],
    paginationEnabled: true,
    paginationItemsPerPage: 20,
)]
class Equipment
{
    #[Groups(['equipment:list', 'equipment:read'])]
    private ?int $id = null;
    
    #[Groups(['equipment:list', 'equipment:read', 'equipment:write'])]
    private ?string $name = null;
    
    // ...
}
```

#### 4.2 Agregar Paginación
```php
// En controladores manuales que devuelven listas
use App\Repository\TrainingRepository;

public function list(Request $request, TrainingRepository $repo): JsonResponse
{
    $page = $request->query->getInt('page', 1);
    $limit = $request->query->getInt('limit', 20);
    
    $paginator = $repo->findPaginated($page, $limit);
    
    return $this->json([
        'items' => $paginator->getItems(),
        'total' => $paginator->getTotalItemCount(),
        'page' => $page,
        'pages' => ceil($paginator->getTotalItemCount() / $limit),
    ]);
}
```

#### 4.3 Implementar Refresh Tokens
```bash
composer require gesdinet/jwt-refresh-token-bundle

# Configurar para tokens de 7 días en lugar de 24h
```

---

## 🎯 FASE 5: CI/CD + DevOps (P2 - Mejoras)

### Semana 7: Automatización

#### 5.1 Configurar GitHub Actions
```yaml
# .github/workflows/backend-ci.yml
name: Backend CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: root
          MYSQL_DATABASE: test_db
    steps:
      - uses: actions/checkout@v4
      
      - uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'
          
      - run: composer install
      
      - run: vendor/bin/php-cs-fixer fix --dry-run --diff
      
      - run: vendor/bin/phpstan analyse --level=5
      
      - run: php bin/console doctrine:migrations:migrate --env=test --no-interaction
      
      - run: vendor/bin/phpunit
```

#### 5.2 Dockerizar (Opcional pero recomendado)
```dockerfile
# Dockerfile
FROM php:8.2-fpm-alpine

RUN docker-php-ext-install pdo pdo_mysql

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY composer.* ./
RUN composer install --no-dev --optimize-autoloader

COPY . .

EXPOSE 9000
CMD ["php-fpm"]
```

---

## 📋 Checklist de Progreso

### FASE 1: Fundamentos
- [ ] README.md creado y completo
- [ ] Scripts organizados en carpetas
- [ ] Tests de autenticación pasando
- [ ] Tests de autorización pasando
- [ ] Tests de CRUD básicos pasando

### FASE 2: Seguridad
- [ ] JWT_SECRET en secrets de Symfony
- [ ] PHP-CS-Fixer configurado y ejecutado
- [ ] PHPStan nivel 5 sin errores
- [ ] Typo 'cratedAt' corregido
- [ ] .env limpio (sin secrets hardcodeados)

### FASE 3: Arquitectura
- [ ] DTOs creados para requests principales
- [ ] Voters implementados para Training, Exercise, User
- [ ] Serialización con groups implementada
- [ ] Validación movida a Form Requests

### FASE 4: API Platform
- [ ] Equipment expuesto con ApiResource
- [ ] Paginación en todos los listados
- [ ] Filtros configurados (search, order)
- [ ] Refresh tokens implementados

### FASE 5: CI/CD
- [ ] GitHub Actions configurado
- [ ] Tests ejecutándose en cada push
- [ ] PHP-CS-Fixer en CI
- [ ] PHPStan en CI
- [ ] Docker configurado (opcional)

---

## 📈 Métricas Objetivo

| Métrica | Inicial | Fase 1 | Fase 2 | Fase 3 | Final |
|---------|---------|--------|--------|--------|-------|
| **Tests** | 0 | 5 | 10 | 20 | 30+ |
| **Score Técnico** | 52 | 60 | 70 | 78 | 85+ |
| **Score IA** | 58 | 65 | 72 | 80 | 85+ |
| **Code Coverage** | 0% | 20% | 40% | 60% | 70%+ |
| **PHPStan Nivel** | - | - | 5 | 6 | 8 |

---

## 🎓 Recursos de Aprendizaje

### Symfony
- [Symfony Best Practices](https://symfony.com/doc/current/best_practices.html)
- [API Platform Documentation](https://api-platform.com/docs/)

### Testing
- [PHPUnit Symfony](https://symfony.com/doc/current/testing.html)
- [Testing Database](https://symfony.com/doc/current/testing/database.html)

### Seguridad
- [Symfony Security](https://symfony.com/doc/current/security.html)
- [JWT Authentication](https://github.com/lexik/LexikJWTAuthenticationBundle)

---

## 🚀 Próximos Pasos

1. **Empezar FASE 1** - Crear README y organizar scripts
2. **Configurar tests** mínimos críticos
3. **Revisar progreso** después de cada fase

**¿Por dónde quieres empezar?** 
- A) Crear el README y organizar scripts
- B) Configurar PHPUnit y tests básicos
- C) Ambos en paralelo

---

*Plan creado el 2026-03-28*  
*Scores actuales: Técnico 52/100 | IA-Friendly 58/100*  
*Objetivo: 85+/85+*
