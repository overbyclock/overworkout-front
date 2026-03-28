# Patrones de Código

## 1. Fetch con Loading/Error

```vue
<script setup>
const loading = ref(false)
const error = ref(null)
const data = ref(null)

async function fetchData() {
  loading.value = true
  error.value = null
  try {
    data.value = await api.get('/endpoint')
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div v-if="loading">Cargando...</div>
  <div v-else-if="error" class="text-negative">{{ error }}</div>
  <div v-else>{{ data }}</div>
</template>
```

## 2. Formulario con Validación

```vue
<script setup>
import { ref } from 'vue'

const form = ref({ name: '', email: '' })
const rules = {
  name: [v => !!v || 'Nombre requerido'],
  email: [
    v => !!v || 'Email requerido',
    v => /.+@.+/.test(v) || 'Email inválido'
  ]
}

const formRef = ref(null)

async function submit() {
  const valid = await formRef.value.validate()
  if (!valid) return
  
  await api.post('/users', form.value)
}
</script>

<template>
  <q-form ref="formRef" @submit="submit">
    <q-input v-model="form.name" :rules="rules.name" outlined label="Nombre" />
    <q-input v-model="form.email" :rules="rules.email" outlined label="Email" />
    <q-btn type="submit" color="primary" label="Guardar" />
  </q-form>
</template>
```

## 3. Composable para Datos

```javascript
// composables/useFetch.js
export function useFetch(fetchFn) {
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function execute(...args) {
    loading.value = true
    error.value = null
    try {
      data.value = await fetchFn(...args)
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, execute }
}

// Uso:
const { data: users, loading, execute: loadUsers } = useFetch(api.getUsers)
onMounted(loadUsers)
```

## 4. Diálogo Reutilizable

```vue
<!-- components/common/ConfirmDialog.vue -->
<script setup>
const props = defineProps({
  modelValue: Boolean,
  title: { type: String, default: 'Confirmar' },
  message: String
})
const emit = defineEmits(['update:modelValue', 'confirm'])
</script>

<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <q-card>
      <q-card-section class="text-h6">{{ title }}</q-card-section>
      <q-card-section>{{ message }}</q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancelar" v-close-popup />
        <q-btn color="negative" label="Confirmar" @click="$emit('confirm')" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
```

## 5. Tabla con Paginación

```vue
<script setup>
const columns = [
  { name: 'name', label: 'Nombre', field: 'name', sortable: true },
  { name: 'email', label: 'Email', field: 'email' },
  { name: 'actions', label: 'Acciones', align: 'center' }
]

const rows = ref([])
const pagination = ref({ page: 1, rowsPerPage: 10, rowsNumber: 0 })

async function onRequest(props) {
  const { page, rowsPerPage } = props.pagination
  const response = await api.get('/users', { 
    params: { page, limit: rowsPerPage } 
  })
  rows.value = response.data
  pagination.value.rowsNumber = response.total
}
</script>

<template>
  <q-table
    :columns="columns"
    :rows="rows"
    :pagination="pagination"
    @request="onRequest"
    row-key="id"
  />
</template>
```

## Anti-patrones

❌ No mutar props
❌ No usar `var`
❌ No dejar `console.log` en producción
❌ No usar Options API (usar Composition con `<script setup>`)
❌ No importar todo Quasar (tree-shaking automático)
