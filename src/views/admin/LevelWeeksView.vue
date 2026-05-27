<template>
  <q-page class="page-container">
    <div class="page-content">
      <div class="page-header">
        <div class="header-left">
          <q-btn flat round icon="arrow_back" @click="goBack" />
          <div>
            <h1 class="page-title">Semanas del Nivel</h1>
            <p class="page-subtitle">{{ levelName }}</p>
          </div>
        </div>
        <q-btn color="primary" icon="add" label="Nueva Semana" @click="openCreateDialog" />
      </div>

      <q-card class="form-card" flat bordered>
        <q-card-section>
          <div v-if="loading" class="text-center q-pa-lg">
            <q-spinner color="primary" size="40px" />
          </div>

          <div v-else-if="weekInfos.length === 0" class="empty-state">
            <q-icon name="calendar_today" size="48px" color="grey-7" />
            <p>No hay semanas definidas para este nivel</p>
            <q-btn flat color="primary" label="Añadir primera semana" @click="openCreateDialog" />
          </div>

          <q-list v-else separator dark>
            <q-item v-for="week in sortedWeekInfos" :key="week.id" class="week-item">
              <q-item-section>
                <q-item-label class="text-weight-bold"
                  >Semana {{ week.weekNumber }}: {{ week.name }}</q-item-label
                >
                <q-item-label caption>
                  <span v-if="week.focus" class="q-mr-md">Foco: {{ week.focus }}</span>
                  <span v-if="week.intensity">Intensidad: {{ week.intensity }}</span>
                </q-item-label>
                <q-item-label v-if="week.note" caption class="text-grey-5">{{
                  week.note
                }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  flat
                  round
                  icon="edit"
                  color="primary"
                  size="sm"
                  @click="openEditDialog(week)"
                >
                  <q-tooltip>Editar</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  icon="delete"
                  color="negative"
                  size="sm"
                  @click="confirmDelete(week)"
                >
                  <q-tooltip>Eliminar</q-tooltip>
                </q-btn>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>

      <!-- Create/Edit Dialog -->
      <q-dialog v-model="dialogOpen" persistent>
        <q-card class="dialog-card" style="min-width: 400px">
          <q-card-section>
            <div class="text-h6">{{ isEditing ? 'Editar Semana' : 'Nueva Semana' }}</div>
          </q-card-section>
          <q-card-section class="q-gutter-md">
            <q-input v-model="form.name" label="Nombre *" outlined dark />
            <q-input
              v-model.number="form.weekNumber"
              label="Número de semana *"
              type="number"
              outlined
              dark
            />
            <q-input v-model="form.focus" label="Foco" outlined dark />
            <q-input v-model="form.intensity" label="Intensidad" outlined dark />
            <q-input v-model="form.note" label="Nota" type="textarea" outlined dark rows="3" />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancelar" color="grey-5" v-close-popup />
            <q-btn color="primary" label="Guardar" :loading="saving" @click="saveWeekInfo" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Delete Dialog -->
      <q-dialog v-model="deleteDialogOpen" persistent>
        <q-card class="dialog-card">
          <q-card-section>
            <div class="text-h6">Eliminar Semana</div>
            <p>
              ¿Estás seguro de que quieres eliminar <strong>{{ weekToDelete?.name }}</strong
              >?
            </p>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancelar" color="grey-5" v-close-popup />
            <q-btn color="negative" label="Eliminar" :loading="deleting" @click="deleteWeekInfo" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { weekInfoService, levelService } from '@/services'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()

const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const weekInfos = ref([])
const levelName = ref('')

const dialogOpen = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const deleteDialogOpen = ref(false)
const weekToDelete = ref(null)

const form = ref({
  name: '',
  weekNumber: 1,
  focus: '',
  note: '',
  intensity: '',
})

const sortedWeekInfos = computed(() => {
  return [...weekInfos.value].sort((a, b) => a.weekNumber - b.weekNumber)
})

const fetchData = async () => {
  loading.value = true
  try {
    const levelId = Number(route.params.levelId)
    const [levelData, allWeeksData] = await Promise.all([
      levelService.getById(levelId).catch(() => null),
      weekInfoService.getAll(),
    ])
    if (levelData) {
      levelName.value = levelData.name || `Nivel ${levelData.levelNumber}`
    }
    const allWeeks = Array.isArray(allWeeksData) ? allWeeksData : allWeeksData.member || []
    weekInfos.value = allWeeks.filter(
      (w) => w.trainingLevel?.id === levelId || w.levelId === levelId,
    )
  } catch {
    $q.notify({ type: 'negative', message: 'Error al cargar datos' })
  } finally {
    loading.value = false
  }
}

const openCreateDialog = () => {
  isEditing.value = false
  editingId.value = null
  form.value = {
    name: '',
    weekNumber: sortedWeekInfos.value.length + 1,
    focus: '',
    note: '',
    intensity: '',
  }
  dialogOpen.value = true
}

const openEditDialog = (week) => {
  isEditing.value = true
  editingId.value = week.id
  form.value = {
    name: week.name || '',
    weekNumber: week.weekNumber ?? 1,
    focus: week.focus || '',
    note: week.note || '',
    intensity: week.intensity || '',
  }
  dialogOpen.value = true
}

const saveWeekInfo = async () => {
  saving.value = true
  try {
    const payload = {
      ...form.value,
      levelId: Number(route.params.levelId),
    }
    if (isEditing.value) {
      await weekInfoService.update(editingId.value, payload)
      $q.notify({ type: 'positive', message: 'Semana actualizada' })
    } else {
      await weekInfoService.create(payload)
      $q.notify({ type: 'positive', message: 'Semana creada' })
    }
    dialogOpen.value = false
    await fetchData()
  } catch (err) {
    const msg = err.response?.data?.error || err.response?.data?.message || 'Error al guardar'
    $q.notify({ type: 'negative', message: msg })
  } finally {
    saving.value = false
  }
}

const confirmDelete = (week) => {
  weekToDelete.value = week
  deleteDialogOpen.value = true
}

const deleteWeekInfo = async () => {
  if (!weekToDelete.value) return
  deleting.value = true
  try {
    await weekInfoService.delete(weekToDelete.value.id)
    $q.notify({ type: 'positive', message: 'Semana eliminada' })
    deleteDialogOpen.value = false
    await fetchData()
  } catch {
    $q.notify({ type: 'negative', message: 'Error al eliminar' })
  } finally {
    deleting.value = false
  }
}

const goBack = () => router.back()

onMounted(fetchData)
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.form-card {
  background: #1c2128;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #8b949e;
}

.week-item {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  margin-bottom: 8px;
}

.dialog-card {
  background: #1c2128;
  border: 1px solid rgba(255, 255, 255, 0.08);
}
</style>
