<template>
  <q-page class="page-container">
    <div class="page-content">
      <div class="page-header">
        <div>
          <h1 class="page-title">Progreso de Usuarios</h1>
          <p class="page-subtitle">Seguimiento de usuarios en los programas</p>
        </div>
      </div>

      <div class="stats-row">
        <div class="stat-mini">
          <div class="stat-mini-icon" style="background: rgba(56, 178, 172, 0.2)">
            <q-icon name="people" color="teal" size="20px" />
          </div>
          <div class="stat-mini-content">
            <div class="stat-mini-value">156</div>
            <div class="stat-mini-label">Usuarios activos</div>
          </div>
        </div>
        <div class="stat-mini">
          <div class="stat-mini-icon" style="background: rgba(255, 143, 56, 0.2)">
            <q-icon name="trending_up" color="primary" size="20px" />
          </div>
          <div class="stat-mini-content">
            <div class="stat-mini-value">42</div>
            <div class="stat-mini-label">En progreso</div>
          </div>
        </div>
        <div class="stat-mini">
          <div class="stat-mini-icon" style="background: rgba(168, 85, 247, 0.2)">
            <q-icon name="emoji_events" color="purple" size="20px" />
          </div>
          <div class="stat-mini-content">
            <div class="stat-mini-value">12</div>
            <div class="stat-mini-label">Nivel 10+</div>
          </div>
        </div>
      </div>

      <q-table
        :rows="users"
        :columns="columns"
        row-key="id"
        class="modern-table"
        flat
        bordered
      >
        <template v-slot:body-cell-level="{ row }">
          <q-td>
            <div class="level-cell">
              <span class="level-badge" :style="{ backgroundColor: row.levelColor }">{{ row.level }}</span>
              <span class="level-name">{{ row.levelName }}</span>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-progress="{ row }">
          <q-td>
            <q-linear-progress :value="row.progress / 100" color="primary" class="q-mt-sm" />
            <span class="progress-text">{{ row.progress }}%</span>
          </q-td>
        </template>
        <template v-slot:body-cell-status="{ row }">
          <q-td>
            <q-chip :color="getStatusColor(row.status)" size="sm">{{ row.status }}</q-chip>
          </q-td>
        </template>
        <template v-slot:body-cell-actions="{ row }">
          <q-td>
            <q-btn flat dense icon="visibility" color="primary" @click="viewUser(row)" />
            <q-btn flat dense icon="edit" color="grey-5" @click="editUser(row)" />
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const columns = [
  { name: 'user', label: 'Usuario', field: 'userName', align: 'left', sortable: true },
  { name: 'program', label: 'Programa', field: 'program', align: 'left' },
  { name: 'level', label: 'Nivel Actual', field: 'level', align: 'left' },
  { name: 'progress', label: 'Progreso', field: 'progress', align: 'center' },
  { name: 'xp', label: 'XP Total', field: 'xp', sortable: true },
  { name: 'streak', label: 'Racha', field: 'streak' },
  { name: 'status', label: 'Estado', field: 'status' },
  { name: 'lastActive', label: 'Última actividad', field: 'lastActive' },
  { name: 'actions', label: 'Acciones', field: 'actions', align: 'center' },
]

const users = ref([
  { id: 1, userName: 'Juan Pérez', program: 'Calistenia Master', level: 5, levelName: 'Intermedio I', levelColor: '#facc15', progress: 75, xp: 2450, streak: 12, status: 'active', lastActive: 'Hace 2h' },
  { id: 2, userName: 'María García', program: 'Calistenia Master', level: 8, levelName: 'Avanzado I', levelColor: '#f97316', progress: 45, xp: 5200, streak: 45, status: 'active', lastActive: 'Hace 1d' },
  { id: 3, userName: 'Carlos López', program: 'Calistenia Master', level: 3, levelName: 'Principiante II', levelColor: '#4ade80', progress: 90, xp: 890, streak: 5, status: 'active', lastActive: 'Hace 3h' },
  { id: 4, userName: 'Ana Martínez', program: 'Calistenia Master', level: 11, levelName: 'Experto', levelColor: '#dc2626', progress: 20, xp: 8900, streak: 78, status: 'active', lastActive: 'Hoy' },
  { id: 5, userName: 'Pedro Ruiz', program: 'Calistenia Master', level: 1, levelName: 'Novato', levelColor: '#10b981', progress: 30, xp: 150, streak: 0, status: 'paused', lastActive: 'Hace 5d' },
])

const getStatusColor = (status) => {
  const colors = { active: 'positive', paused: 'warning', abandoned: 'negative', completed: 'purple' }
  return colors[status] || 'grey'
}

const viewUser = (user) => console.log('Ver usuario:', user)
const editUser = (user) => console.log('Editar usuario:', user)
</script>

<style scoped>
.level-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.level-badge {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #000;
  font-size: 14px;
}

.level-name {
  font-size: 14px;
  color: #fff;
}

.progress-text {
  font-size: 12px;
  color: #8b949e;
  margin-left: 8px;
}
</style>
