<template>
  <q-page class="page-container">
    <div class="page-content">
      <div class="page-header">
        <div class="header-left">
          <q-btn flat round icon="arrow_back" @click="goBack" />
          <div>
            <h1 class="page-title">Entrenamientos del Nivel</h1>
            <p class="page-subtitle">{{ levelName }}</p>
          </div>
        </div>
        <q-btn color="primary" icon="add" label="Nuevo Entrenamiento" @click="openCreateDialog" />
      </div>

      <q-card class="form-card" flat bordered>
        <q-card-section>
          <div v-if="loading" class="text-center q-pa-lg">
            <q-spinner color="primary" size="40px" />
          </div>

          <div v-else-if="trainings.length === 0" class="empty-state">
            <q-icon name="fitness_center" size="48px" color="grey-7" />
            <p>No hay entrenamientos para este nivel</p>
            <q-btn
              flat
              color="primary"
              label="Añadir primer entrenamiento"
              @click="openCreateDialog"
            />
          </div>

          <q-list v-else separator dark>
            <q-item v-for="training in trainings" :key="training.id" class="training-item">
              <q-item-section>
                <q-item-label class="text-weight-bold">{{
                  training.name || 'Sin nombre'
                }}</q-item-label>
                <q-item-label caption>
                  <q-badge color="primary" class="q-mr-xs">{{ training.discipline }}</q-badge>
                  <q-badge color="secondary" class="q-mr-xs">{{ training.target }}</q-badge>
                  <span v-if="training.weekNumber" class="q-mr-md"
                    >Semana {{ training.weekNumber }}</span
                  >
                  <span v-if="training.dayKey" class="q-mr-md">Día {{ training.dayKey }}</span>
                  <span v-if="training.sessionType">{{ training.sessionType }}</span>
                </q-item-label>
                <q-item-label
                  v-if="training.estimatedDurationMin && training.estimatedDurationMax"
                  caption
                >
                  Duración: {{ Math.ceil(training.estimatedDurationMin / 60) }}-{{
                    Math.ceil(training.estimatedDurationMax / 60)
                  }}
                  min
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  flat
                  round
                  icon="edit"
                  color="primary"
                  size="sm"
                  @click="openEditDialog(training)"
                >
                  <q-tooltip>Editar</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  icon="delete"
                  color="negative"
                  size="sm"
                  @click="confirmDelete(training)"
                >
                  <q-tooltip>Eliminar</q-tooltip>
                </q-btn>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>

      <!-- Create/Edit Dialog -->
      <q-dialog v-model="dialogOpen" persistent maximized>
        <q-card class="dialog-card">
          <q-card-section class="dialog-header">
            <div class="header-left">
              <q-btn flat round icon="close" color="grey-6" v-close-popup />
              <div class="text-h6">
                {{ isEditing ? 'Editar Entrenamiento' : 'Nuevo Entrenamiento' }}
              </div>
            </div>
            <q-btn
              color="primary"
              icon="save"
              label="Guardar"
              :loading="saving"
              @click="saveTraining"
            />
          </q-card-section>

          <q-card-section class="dialog-body">
            <div class="form-grid">
              <q-input v-model="form.name" label="Nombre" outlined dark />
              <q-select
                v-model="form.discipline"
                :options="disciplineOptions"
                label="Disciplina *"
                outlined
                dark
                emit-value
                map-options
              />
              <q-select
                v-model="form.target"
                :options="targetOptions"
                label="Objetivo *"
                outlined
                dark
                emit-value
                map-options
              />
              <q-input
                v-model.number="form.weekNumber"
                label="Semana"
                type="number"
                outlined
                dark
              />
              <q-input
                v-model="form.dayKey"
                label="Clave del día"
                outlined
                dark
                hint="Ej: day_a, day_b"
              />
              <q-input
                v-model="form.sessionType"
                label="Tipo de sesión"
                outlined
                dark
                hint="Ej: session_a"
              />
            </div>

            <div class="q-mt-lg">
              <h3 class="section-title">Rounds y Ejercicios</h3>
              <p class="text-grey-5">
                La edición detallada de rounds está disponible desde la vista general de
                entrenamientos.
              </p>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>

      <!-- Delete Dialog -->
      <q-dialog v-model="deleteDialogOpen" persistent>
        <q-card class="dialog-card">
          <q-card-section>
            <div class="text-h6">Eliminar Entrenamiento</div>
            <p>
              ¿Estás seguro de que quieres eliminar <strong>{{ trainingToDelete?.name }}</strong
              >?
            </p>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancelar" color="grey-5" v-close-popup />
            <q-btn color="negative" label="Eliminar" :loading="deleting" @click="deleteTraining" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { levelService, trainingService } from '@/services'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()

const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const trainings = ref([])
const levelName = ref('')

const dialogOpen = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const deleteDialogOpen = ref(false)
const trainingToDelete = ref(null)

const form = ref({
  name: '',
  discipline: 'calisthenics',
  target: 'strength',
  weekNumber: null,
  dayKey: '',
  sessionType: '',
})

const disciplineOptions = [
  { label: 'Calistenia', value: 'calisthenics' },
  { label: 'CrossFit', value: 'crossfit' },
  { label: 'Fitness', value: 'fitness' },
  { label: 'Calistenia + Fitness', value: 'calisthenicsfitness' },
]

const targetOptions = [
  { label: 'Fuerza', value: 'strength' },
  { label: 'Quema de grasa', value: 'fatburning' },
  { label: 'Construcción de reps', value: 'repbuilding' },
  { label: 'Calentamiento', value: 'warmup' },
]

const fetchData = async () => {
  loading.value = true
  try {
    const levelId = Number(route.params.levelId)
    const levelData = await levelService.getById(levelId)
    levelName.value = levelData.name || `Nivel ${levelData.levelNumber}`
    trainings.value = levelData.trainings || []
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
    discipline: 'calisthenics',
    target: 'strength',
    weekNumber: null,
    dayKey: '',
    sessionType: '',
  }
  dialogOpen.value = true
}

const openEditDialog = (training) => {
  isEditing.value = true
  editingId.value = training.id
  form.value = {
    name: training.name || '',
    discipline: training.discipline?.value || training.discipline || 'calisthenics',
    target: training.target?.value || training.target || 'strength',
    weekNumber: training.weekNumber ?? null,
    dayKey: training.dayKey || '',
    sessionType: training.sessionType || '',
  }
  dialogOpen.value = true
}

const saveTraining = async () => {
  saving.value = true
  try {
    const payload = {
      ...form.value,
      trainingLevelId: Number(route.params.levelId),
      rounds: [],
    }
    if (isEditing.value) {
      await trainingService.update(editingId.value, payload)
      $q.notify({ type: 'positive', message: 'Entrenamiento actualizado' })
    } else {
      await trainingService.create(payload)
      $q.notify({ type: 'positive', message: 'Entrenamiento creado' })
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

const confirmDelete = (training) => {
  trainingToDelete.value = training
  deleteDialogOpen.value = true
}

const deleteTraining = async () => {
  if (!trainingToDelete.value) return
  deleting.value = true
  try {
    await trainingService.delete(trainingToDelete.value.id)
    $q.notify({ type: 'positive', message: 'Entrenamiento eliminado' })
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

.training-item {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  margin-bottom: 8px;
}

.dialog-card {
  background: #0f1419;
  border: 1px solid rgba(255, 255, 255, 0.08);
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.dialog-body {
  flex: 1;
  overflow-y: auto;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 12px;
}

@media (max-width: 1024px) {
  .form-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
