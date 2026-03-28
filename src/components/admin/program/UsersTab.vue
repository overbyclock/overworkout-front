<template>
  <div class="tab-content">
    <div class="section-header">
      <h2>Usuarios en el Programa</h2>
      <div class="header-actions-inline">
        <q-input v-model="searchQuery" placeholder="Buscar usuario..." dense outlined dark class="search-input">
          <template v-slot:prepend><q-icon name="search" /></template>
        </q-input>
        <q-btn color="primary" icon="person_add" label="Añadir Usuario" @click="$emit('add')" />
      </div>
    </div>

    <q-table :rows="filteredUsers" :columns="columns" row-key="id" flat dark :pagination="{ rowsPerPage: 10 }"
      class="users-table">
      <template v-slot:body-cell-avatar="{ row }">
        <q-td>
          <q-avatar size="40px" color="primary" text-color="white">{{ row.initials }}</q-avatar>
        </q-td>
      </template>
      <template v-slot:body-cell-progress="{ row }">
        <q-td>
          <div class="progress-cell">
            <q-linear-progress :value="row.progress / 100" size="8px" rounded color="primary" track-color="grey-8"
              class="progress-bar" />
            <span class="progress-text">{{ row.progress }}%</span>
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-level="{ row }">
        <q-td>
          <q-badge :color="getLevelColor(row.currentLevel)" class="level-badge">Nivel {{ row.currentLevel }}</q-badge>
        </q-td>
      </template>
      <template v-slot:body-cell-status="{ row }">
        <q-td>
          <q-badge :color="row.status === 'active' ? 'positive' : 'grey'">
            {{ row.status === 'active' ? 'Activo' : 'Pausado' }}
          </q-badge>
        </q-td>
      </template>
      <template v-slot:body-cell-actions="{ row }">
        <q-td class="text-right">
          <q-btn flat round icon="visibility" size="sm" @click="$emit('view', row)" />
          <q-btn flat round icon="edit" size="sm" @click="$emit('edit', row)" />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  users: { type: Array, required: true }
})

defineEmits(['add', 'view', 'edit'])

const searchQuery = ref('')

const filteredUsers = computed(() => {
  if (!searchQuery.value) return props.users
  const query = searchQuery.value.toLowerCase()
  return props.users.filter(u => u.name.toLowerCase().includes(query))
})

const columns = [
  { name: 'avatar', label: '', field: 'avatar', align: 'center' },
  { name: 'name', label: 'Usuario', field: 'name', align: 'left', sortable: true },
  { name: 'level', label: 'Nivel Actual', field: 'currentLevel', align: 'center', sortable: true },
  { name: 'progress', label: 'Progreso', field: 'progress', align: 'center', sortable: true },
  { name: 'status', label: 'Estado', field: 'status', align: 'center' },
  { name: 'joined', label: 'Ingreso', field: 'joinedAt', align: 'center', sortable: true },
  { name: 'actions', label: '', field: 'actions', align: 'right' },
]

const getLevelColor = (level) => {
  if (level <= 3) return 'positive'
  if (level <= 6) return 'primary'
  if (level <= 9) return 'warning'
  return 'accent'
}
</script>

<style scoped>
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  margin: 0;
}

.header-actions-inline {
  display: flex;
  gap: 12px;
}

.search-input {
  width: 280px;
}

.progress-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  width: 100px;
}

.progress-text {
  font-size: 12px;
  color: #8b949e;
  min-width: 40px;
}
</style>
