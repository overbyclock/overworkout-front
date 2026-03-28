---
name: vue-quasar-expert
description: Experto en Vue 3 Composition API y Quasar Framework 2.x. Usar cuando se necesite revisar código Vue/Quasar, aplicar buenas prácticas, refactorizar componentes, optimizar rendimiento, o implementar nuevas funcionalidades en el frontend. Especializado en Composition API con <script setup>, Pinia, Vue Router 4, y patrones modernos de Vue 3.
---

# Vue 3 + Quasar Expert

Guía para escribir código Vue 3 moderno, limpio y eficiente con Quasar Framework.

## Principios Fundamentales

### Vue 3 Composition API

- Usar siempre `<script setup>` - sintaxis más limpia y mejor inferencia de tipos
- Priorizar `ref()` sobre `reactive()` para reactividad primitiva
- Usar `computed()` para valores derivados
- Agrupar lógica relacionada usando Composables

### Estructura de Componentes

```vue
<script setup>
// 1. Imports
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

// 2. Props y Emits
const props = defineProps({
  userId: { type: String, required: true },
  editable: { type: Boolean, default: false }
})

const emit = defineEmits(['update', 'delete'])

// 3. Stores y Servicios
const authStore = useAuthStore()

// 4. Estado Reactivo
const loading = ref(false)
const data = ref(null)

// 5. Computed
const canEdit = computed(() => props.editable && authStore.isAdmin)

// 6. Métodos
async function fetchData() {
  loading.value = true
  try {
    data.value = await api.getUser(props.userId)
  } finally {
    loading.value = false
  }
}

// 7. Lifecycle Hooks
onMounted(fetchData)
</script>

<template>
  <!-- Template limpio, usa componentes Quasar -->
</template>
```

## Quasar Framework - Mejores Prácticas

### Componentes Preferidos

| Uso | Componente | Props Clave |
|-----|------------|-------------|
| Botones | `q-btn` | `color`, `icon`, `unelevated`, `outline` |
| Formularios | `q-input`, `q-select` | `outlined`, `dense`, `rules` |
| Tablas | `q-table` | `rows`, `columns`, `loading`, `pagination` |
| Layout | `q-layout`, `q-page` | `view`, `container` |
| Diálogos | `q-dialog` | `persistent`, `maximized` |
| Notificaciones | `$q.notify()` | `type`, `message`, `position` |

### Directivas Quasar Útiles

```vue
<!-- Loading automático -->
<q-btn loading="loading" label="Guardar" />

<!-- Intersection Observer -->
<div v-intersection="onIntersection" />

<!-- Ripple effect -->
<q-btn v-ripple label="Click" />

<!-- Touch pan/swipe -->
<div v-touch-pan="handlePan" />
```

## Patrones de Código Limpio

### Composables Reutilizables

```javascript
// useAsync.js - Manejo estándar de estados async
export function useAsync(fn) {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(false)
  
  async function execute(...args) {
    loading.value = true
    error.value = null
    try {
      data.value = await fn(...args)
      return data.value
    } catch (e) {
      error.value = e
      throw e
    } finally {
      loading.value = false
    }
  }
  
  return { data, error, loading, execute }
}

// Uso:
const { data: users, loading, execute: loadUsers } = useAsync(api.getUsers)
onMounted(loadUsers)
```

### Validación de Formularios

```vue
<script setup>
const rules = {
  required: v => !!v || 'Campo requerido',
  email: v => /.+@.+/.test(v) || 'Email inválido',
  minLength: min => v => v?.length >= min || `Mínimo ${min} caracteres`
}
</script>

<template>
  <q-input 
    v-model="email"
    :rules="[rules.required, rules.email]"
    outlined
  />
</template>
```

## Anti-patrones a Evitar

❌ **NO usar Options API** - Migrar todo a Composition API
❌ **NO mutar props** - Emitir eventos para cambios
❌ **NO usar `var`** - Usar `const`/`let`
❌ **NO dejar console.log en producción**
❌ **NO importar todo Quasar** - Usar imports específicos
❌ **NO usar `any` en TypeScript** - Tipar correctamente

## Optimización de Rendimiento

- Usar `shallowRef()` para objetos grandes que no necesitan reactividad profunda
- Implementar `v-once` para contenido estático
- Usar `defineAsyncComponent()` para code-splitting
- Lazy loading de rutas con `() => import('./Component.vue')`
- Virtual scroll para listas largas con `q-virtual-scroll`

## Estilos con Quasar

```vue
<style scoped>
/* Usar clases utilitarias de Quasar siempre que sea posible */
/* q-pa-md, q-mb-sm, text-primary, bg-dark, etc. */

/* Variables del proyecto */
.my-component {
  color: var(--color-primary);
}
</style>
```

## Revisión de Código - Checklist

- [ ] ¿Usa `<script setup>`?
- [ ] ¿Props están bien tipadas y documentadas?
- [ ] ¿Emits están declarados?
- [ ] ¿Lógica está en composables reutilizables?
- [ ] ¿No hay mutación de props?
- [ ] ¿Loading/error states manejados?
- [ ] ¿Usa componentes Quasar nativos?
- [ ] ¿Sin código duplicado?
- [ ] ¿Nombres de variables descriptivos?
