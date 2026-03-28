# Convenciones de Código

## Vue/JavaScript

### Nomenclatura

| Elemento | Convención | Ejemplo |
|----------|------------|---------|
| Componentes | PascalCase | `UserCard.vue` |
| Composables | camelCase con `use` | `useAuth.js` |
| Stores | camelCase + `Store` | `authStore` |
| Props | camelCase | `userId` |
| Eventos | camelCase | `@updateUser` |
| Variables | camelCase | `isLoading` |
| Constantes | UPPER_SNAKE | `API_BASE_URL` |

### Orden en `<script setup>`

```vue
<script setup>
// 1. Imports de librerías
import { ref, computed } from 'vue'

// 2. Imports del proyecto
import { useAuthStore } from '@/stores/auth'

// 3. Props
const props = defineProps({...})

// 4. Emits
const emit = defineEmits([...])

// 5. Inyección de dependencias (stores, composables)
const authStore = useAuthStore()

// 6. Estado reactivo
const count = ref(0)

// 7. Computed
const double = computed(() => count.value * 2)

// 8. Watchers
watch(count, (newVal) => {...})

// 9. Métodos
function increment() { count.value++ }

// 10. Lifecycle hooks
onMounted(() => {...})
</script>
```

### Reglas de Estilo

- **Siempre** usar `<script setup>` (no Options API)
- **Siempre** tipar props cuando sea posible
- **Nunca** mutar props directamente
- **Siempre** usar `const` por defecto, `let` solo si reasignas
- **Siempre** usar `===` en lugar de `==`

## API/Endpoints

### Convenciones REST

| Acción | Método | URL | Response |
|--------|--------|-----|----------|
| Listar | GET | `/api/resources` | 200 + array |
| Obtener | GET | `/api/resources/{id}` | 200 + objeto / 404 |
| Crear | POST | `/api/resources` | 201 + objeto / 400 |
| Actualizar | PUT | `/api/resources/{id}` | 200 + objeto / 404 |
| Eliminar | DELETE | `/api/resources/{id}` | 204 / 404 |

### Nombres de Endpoints

- Usar **plural** y **inglés**: `/api/exercises`, `/api/users`
- **No usar** verbos en la URL: ❌ `/api/getUsers` ✅ `/api/users`
- Recursos anidados: `/api/trainings/{id}/exercises`

## Commits (opcional)

```
type(scope): descripción corta

Cuerpo opcional más largo si es necesario

Footer opcional
```

Tipos:
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `refactor:` Refactorización
- `style:` Cambios de formato (espacios, etc)
- `docs:` Documentación
- `test:` Tests
