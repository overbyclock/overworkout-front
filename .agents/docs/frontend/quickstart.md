# Frontend - Guía Rápida

## Estructura Mínima de un Componente

```vue
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useAuthStore } from '@/stores/auth'

// Props
const props = defineProps({
  id: { type: String, required: true }
})

// Emits
const emit = defineEmits(['success', 'error'])

// Stores & Composables
const $q = useQuasar()
const authStore = useAuthStore()

// State
const loading = ref(false)
const data = ref(null)

// Computed
const canEdit = computed(() => authStore.isAdmin)

// Methods
async function loadData() {
  loading.value = true
  try {
    data.value = await api.get(`/items/${props.id}`)
  } catch (e) {
    $q.notify({ type: 'negative', message: 'Error' })
    emit('error', e)
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(loadData)
</script>

<template>
  <q-card>
    <q-card-section>
      <h6 class="q-my-none">{{ data?.name }}</h6>
    </q-card-section>
    
    <q-card-actions align="right">
      <q-btn 
        v-if="canEdit" 
        color="primary" 
        label="Editar"
        @click="$emit('success')" 
      />
    </q-card-actions>
  </q-card>
</template>
```

## Crear una Nueva Vista

1. **Crear archivo:** `src/views/admin/MiVistaView.vue`
2. **Añadir ruta:** En `src/router/admin-routes.js`
3. **Añadir menú:** En `src/layouts/AdminLayout.vue`

```javascript
// admin-routes.js
{
  path: 'mi-ruta',
  name: 'MiVista',
  component: () => import('@/views/admin/MiVistaView.vue'),
  meta: { title: 'Mi Título', icon: 'sym_o_icon' }
}
```

## Llamar a la API

```javascript
import { api } from '@/services/api'

// GET
const users = await api.get('/api/users')

// POST
const newUser = await api.post('/api/users', { name: 'Juan' })

// PUT
await api.put(`/api/users/${id}`, { name: 'Pedro' })

// DELETE
await api.delete(`/api/users/${id}`)
```

## Mostrar Notificaciones

```javascript
import { useQuasar } from 'quasar'
const $q = useQuasar()

// Éxito
$q.notify({ type: 'positive', message: 'Guardado' })

// Error
$q.notify({ type: 'negative', message: 'Error al guardar' })

// Info
$q.notify({ type: 'info', message: 'Cargando...', timeout: 1000 })
```

## Usar el Store

```javascript
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Leer
console.log(authStore.user)
console.log(authStore.isAdmin)

// Acciones
await authStore.login(credentials)
authStore.logout()
```
