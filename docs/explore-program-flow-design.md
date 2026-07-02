# Especificación: Flujo Explorar → Programa → Nivel → Entrenar

> Fecha: 2026-07-02
> Estado: Aprobado por el usuario
> Alcance: frontend (`overworkout-front`) y backend (`overworkout-back`)

## 1. Resumen

Esta especificación define la experiencia de usuario para descubrir programas en la vista **Explorar**, entrar en su detalle, navegar por niveles y sesiones, iniciar un entrenamiento, y que el sistema recuerde el progreso para mostrarlo en el **Inicio**.

### Comportamiento esperado

- **Explorar**: carruseles infinitos por disciplina con tarjetas de programa.
- **Click en programa**: navega a una vista de detalle del programa.
- **Detalle**: muestra información, niveles, fases y sesiones. No asocia el programa al usuario solo por entrar.
- **Empezar entrenamiento**: al pulsar el botón en una sesión se activa el programa/nivel si no lo estaba y se crea un registro de sesión iniciada.
- **Inicio**:
  - Si hay una sesión iniciada sin completar → card **“Continuar sesión”**.
  - Si no hay sesión a medias pero hay programa activo → card **“Siguiente sesión”**.
  - Si no hay nada → estado vacío actual.

## 2. Navegación

```text
/user/explore
    └── click en tarjeta de programa
        └── /user/programs/:programId
            └── click en nivel
                └── /user/programs/:programId/levels/:levelId
                    └── click en sesión
                        └── /user/train/:sessionId
```

### Rutas existentes que se reutilizan

- `/user/explore` — vista de catálogo.
- `/user/train/:sessionId` — vista de entrenamiento activo.

### Rutas nuevas / a modificar

- `/user/programs/:programId` — **detalle de programa** para usuarios.
  - Actualmente `/user/program` es "Mi Programa" y depende del programa activo del usuario.
  - Se creará una nueva ruta `/user/programs/:programId` para ver cualquier programa público.
- `/user/programs/:programId/levels/:levelId` — ya existe `/user/programs/:programId/levels/:levelId` en backend; en frontend la ruta actual `user-level` podría reutilizarse si se le pasa `programId` y `levelId` reales.

## 3. Vista Explorar

### Comportamiento del carrusel

- `HorizontalCarousel` se usará con `loop` activado para todos los carruseles de programas.
- Cada slide contiene un `PosterCard`.
- El carrusel mostrará todos los programas agrupados por disciplina (comportamiento actual), pero con desplazamiento cíclico.

### Click en tarjeta de programa

- Se navega a `/user/programs/:programId`.
- **No** se activa el programa ni se cambia el progreso en este punto.

## 4. Vista Detalle de Programa

### Contenido

- Cabecera tipo poster con gradiente de disciplina e imagen si existe.
- Nombre, descripción, dificultad, disciplina.
- Metadatos: niveles, fases y sesiones.
- CTA principal:
  - **"Iniciar programa"** si el usuario no lo tiene activo.
  - **"Continuar"** si el programa ya está activo.
- Lista de niveles con sus fases y sesiones.
  - Niveles bloqueados se muestran deshabilitados hasta que se active el programa.
  - Una vez activo, se respetan las reglas de desbloqueo por nivel.

### Asociación del programa

- El programa solo se asocia cuando el usuario pulsa **"Empezar entrenamiento"** en una sesión.
- Esto evita crear progresos fantasma por solo curiosear el detalle.

## 5. Iniciar y completar una sesión

### Flujo al pulsar "Empezar entrenamiento"

1. Frontend llama a `POST /user/trainings/:trainingId/start`.
2. Backend:
   - Identifica el programa y nivel de la sesión (`training`).
   - Si el usuario no tiene un `UserLevelProgress` activo para ese programa, crea uno para el nivel 1 en estado `in_progress`.
   - Si el nivel al que pertenece la sesión está `locked` en el progreso del usuario, devuelve 403.
   - Crea un `UserTrainingLog` con:
     - `user`, `training`, `source = SOURCE_PROGRAM`.
     - `startedAt = ahora`.
     - `completedAt = null`.
   - Devuelve el `UserTrainingLog` creado.
3. Frontend redirige a `/user/train/:sessionId`.

### Flujo al terminar una sesión

1. En `TrainView`, al pulsar el último ejercicio (o un botón explícito de finalizar), se llama a `POST /user/trainings/:trainingId/complete`.
2. Backend:
   - Busca el `UserTrainingLog` iniciado para ese usuario y sesión.
   - Rellena `completedAt`, `durationSeconds` y `xpEarned`.
   - Comprueba si la fase (`currentWeek`) tiene todas sus sesiones completadas. Las sesiones de una fase se identifican por `training.weekNumber = currentWeek` y se ordenan por `id` para establecer secuencia.
   - Si es así, avanza `currentWeek` del `UserLevelProgress` (máximo 3).
3. Frontend vuelve a `/user/home`.

### Cancelar / abandonar a mitad

- Si el usuario cierra `TrainView` sin completar, el `UserTrainingLog` queda con `startedAt` y `completedAt = null`.
- En el dashboard aparecerá como **"Continuar sesión"**.

## 6. Dashboard: "Continuar" vs "Siguiente sesión"

### Lógica de prioridad

1. **Sesión iniciada sin completar**
   - Consultar `GET /user/trainings/next`.
   - Si devuelve una sesión con `startedAt` pero sin `completedAt`, mostrar card **"Continuar donde lo dejaste"**.
2. **Siguiente sesión del programa activo**
   - Si no hay sesión a medias pero existe programa activo, calcular la siguiente sesión pendiente.
   - Se considera la primera sesión del nivel actual (`UserLevelProgress.trainingLevel`) cuya fase (`weekNumber`) coincida con `currentWeek` y no tenga un `UserTrainingLog` completado. El orden dentro de la fase es por `id` ascendente.
   - Mostrar card **"Siguiente sesión"** con nombre de la sesión y programa.
3. **Sin programa activo**
   - Mostrar estado vacío actual.

### Card de acción

- Reutilizar `ContinueCard`.
- Título y subtítulo según el caso:
  - Continuar: `Continúa tu entrenamiento` / nombre de la sesión.
  - Siguiente: `Próxima sesión` / nombre de la sesión + programa.
- Al pulsar, navegar a `/user/train/:sessionId`.

## 7. Endpoints backend

### `POST /user/trainings/:trainingId/start`

Inicia una sesión y, si es necesario, activa el programa/nivel.

**Respuesta:** `UserTrainingLog` serializado con grupo `user_training_log:read`.

### `POST /user/trainings/:trainingId/complete`

Completa una sesión y avanza la fase si corresponde.

**Body opcional:**

```json
{
  "durationSeconds": 1800,
  "xpEarned": 100
}
```

**Respuesta:** `UserTrainingLog` actualizado.

### `GET /user/trainings/next`

Devuelve la sesión que el usuario debe hacer a continuación.

**Respuesta:**

```json
{
  "type": "continue|next",
  "training": { ... },
  "program": { ... },
  "level": { ... },
  "startedAt": "...",
  "logId": 123
}
```

- `type = continue` si hay una sesión iniciada sin completar.
- `type = next` si es la siguiente sesión pendiente del programa activo.
- Si no hay programa activo ni sesión iniciada, devuelve 404.

## 8. Modelo de datos

### Cambios en `UserTrainingLog`

Añadir dos campos nullable:

```php
#[ORM\Column(type: Types::DATETIMETZ_IMMUTABLE, nullable: true)]
private ?\DateTimeImmutable $startedAt = null;

#[ORM\Column(type: Types::DATETIMETZ_IMMUTABLE, nullable: true)]
private ?\DateTimeImmutable $completedAt = null;
```

El constructor se actualizará para inicializar `startedAt` a `new \DateTimeImmutable()` y dejar `completedAt` a `null`. Los lugares del código que actualmente crean un `UserTrainingLog` como completado deberán llamar explícitamente a `setCompletedAt(new \DateTimeImmutable())`.

> **Nota de migración:** los registros existentes que tengan `startedAt` a `null` se considerarán sesiones completadas previamente (se rellenará `startedAt` con `completedAt` en la migración si es necesario).

### Estados lógicos

| startedAt | completedAt | Significado             |
| --------- | ----------- | ----------------------- |
| null      | null        | Registro antiguo/legacy |
| not null  | null        | Iniciado, sin completar |
| not null  | not null    | Completado              |

## 9. Componentes frontend

### Modificaciones

- `ExploreView.vue`
  - Activar `loop` en `HorizontalCarousel`.
  - Navegar a detalle de programa en click.
- `TrainView.vue`
  - Llamar a `startTraining()` al montar o al pulsar "Empezar" según corresponda.
  - Llamar a `completeTraining()` al finalizar.
- `DashboardView.vue`
  - Obtener siguiente acción desde `userProfileStore` o un nuevo servicio.
  - Renderizar `ContinueCard` con datos de "Continuar" o "Siguiente sesión".

### Nuevos

- `ProgramDetailView.vue`
  - Vista de detalle de programa para usuarios.
  - Usa `levelProgressService.getProgramLevels(programId)` o similar.
  - Renderiza niveles, fases y sesiones de solo lectura hasta que se active.

### Servicios

- `trainingService.start(trainingId)`
- `trainingService.complete(trainingId, data)`
- `userProfileService.getNextTraining()`

## 10. Criterios de aceptación

- [ ] En Explorar los carruseles de programas son infinitos.
- [ ] Click en programa lleva a detalle sin activarlo.
- [ ] En detalle se ven niveles, fases y sesiones.
- [ ] Pulsar "Empezar entrenamiento" activa el programa si no lo estaba y crea un log.
- [ ] Si se cierra TrainView sin terminar, en Inicio aparece "Continuar sesión".
- [ ] Si se termina la sesión, en Inicio aparece "Siguiente sesión" del mismo programa.
- [ ] Si no hay programa activo, se muestra el estado vacío único.
- [ ] Tests unitarios y funcionales actualizados.

## 11. Notas técnicas

- El cálculo de "siguiente sesión" se hará en backend para mantener la lógica centralizada.
- Se respetará la jerarquía niveles > fases > sesiones.
- La activación del programa se hará desde la sesión, no desde el detalle, para no forzar al usuario a iniciar algo que solo estaba consultando.
