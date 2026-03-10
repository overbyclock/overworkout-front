<template>
  <q-page class="page-container">
    <div class="page-content">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Entrenamientos</h1>
          <p class="page-subtitle">Crea y gestiona rutinas de entrenamiento</p>
        </div>
        <q-btn color="primary" icon="add" label="Nuevo Entrenamiento" class="action-btn" no-caps
          @click="openCreateDialog" />
      </div>

      <!-- Stats -->
      <div class="stats-row">
        <div class="stat-mini">
          <div class="stat-mini-icon" style="background: rgba(147, 112, 219, 0.2)">
            <q-icon name="schedule" color="accent" size="20px" />
          </div>
          <div class="stat-mini-content">
            <div class="stat-mini-value">{{ trainings.length }}</div>
            <div class="stat-mini-label">Total Entrenamientos</div>
          </div>
        </div>
        <div class="stat-mini">
          <div class="stat-mini-icon" style="background: rgba(63, 185, 80, 0.2)">
            <q-icon name="public" color="positive" size="20px" />
          </div>
          <div class="stat-mini-content">
            <div class="stat-mini-value">{{ publicTrainings }}</div>
            <div class="stat-mini-label">Públicos</div>
          </div>
        </div>
        <div class="stat-mini">
          <div class="stat-mini-icon" style="background: rgba(255, 143, 56, 0.2)">
            <q-icon name="fitness_center" color="primary" size="20px" />
          </div>
          <div class="stat-mini-content">
            <div class="stat-mini-value">{{ totalExercises }}</div>
            <div class="stat-mini-label">Ejercicios Asignados</div>
          </div>
        </div>
      </div>

      <!-- Trainings List -->
      <div class="trainings-container">
        <div class="filters-bar">
          <div class="search-box">
            <q-icon name="search" class="search-icon" size="20px" />
            <input v-model="searchQuery" type="text" placeholder="Buscar entrenamientos..." class="search-input">
          </div>
          <div class="view-toggle">
            <q-btn flat dense icon="view_list" :color="viewMode === 'list' ? 'primary' : 'grey-6'" @click="viewMode = 'list'" />
            <q-btn flat dense icon="grid_view" :color="viewMode === 'grid' ? 'primary' : 'grey-6'" @click="viewMode = 'grid'" />
          </div>
        </div>

        <!-- List View -->
        <div v-if="viewMode === 'list'" class="trainings-list">
          <div v-if="loading" v-for="i in 5" :key="i" class="training-row skeleton">
            <q-skeleton type="text" class="bg-grey-8" width="100%" />
          </div>

          <div v-else-if="filteredTrainings.length === 0" class="empty-state">
            <q-icon name="schedule" size="64px" color="grey-6" />
            <h3>No hay entrenamientos</h3>
            <p>Crea tu primera rutina de entrenamiento</p>
            <q-btn color="primary" icon="add" label="Crear Entrenamiento" no-caps @click="openCreateDialog" />
          </div>

          <div v-else v-for="training in filteredTrainings" :key="training.id" class="training-row">
            <div class="training-color" :style="{ background: training.color || '#ff8f38' }"></div>
            <div class="training-content">
              <div class="training-main">
                <div class="training-icon-wrapper" :style="{ background: training.color + '20' || 'rgba(255,143,56,0.1)' }">
                  <q-icon name="sports_gymnastics" :style="{ color: training.color || '#ff8f38' }" size="24px" />
                </div>
                <div class="training-info">
                  <h3 class="training-name">{{ training.name }}</h3>
                  <p class="training-description">{{ truncateText(training.description, 80) }}</p>
                </div>
              </div>
              <div class="training-stats">
                <div class="stat-item">
                  <q-icon name="fitness_center" size="16px" />
                  <span>{{ training.exercises?.length || 0 }} ejercicios</span>
                </div>
                <div class="stat-item">
                  <q-icon name="timer" size="16px" />
                  <span>{{ calculateDuration(training) }} min</span>
                </div>
                <div class="stat-item">
                  <q-icon name="local_fire_department" size="16px" />
                  <span>{{ training.difficulty || 'Intermedio' }}</span>
                </div>
              </div>
            </div>
            <div class="training-actions">
              <span class="visibility-badge" :class="training.isPublic ? 'public' : 'private'">
                <q-icon :name="training.isPublic ? 'public' : 'lock'" size="14px" />
                {{ training.isPublic ? 'Público' : 'Privado' }}
              </span>
              <q-btn flat round icon="edit" color="primary" size="sm" @click="editTraining(training)">
                <q-tooltip>Editar</q-tooltip>
              </q-btn>
              <q-btn flat round icon="delete" color="negative" size="sm" @click="confirmDelete(training)">
                <q-tooltip>Eliminar</q-tooltip>
              </q-btn>
            </div>
          </div>
        </div>

        <!-- Grid View -->
        <div v-else class="trainings-grid">
          <div v-if="loading" v-for="i in 6" :key="i" class="training-card skeleton">
            <q-skeleton type="rect" class="skeleton-image bg-grey-8" />
          </div>

          <div v-else-if="filteredTrainings.length === 0" class="empty-state grid-empty">
            <q-icon name="schedule" size="64px" color="grey-6" />
            <h3>No hay entrenamientos</h3>
            <p>Crea tu primera rutina de entrenamiento</p>
            <q-btn color="primary" icon="add" label="Crear Entrenamiento" no-caps @click="openCreateDialog" />
          </div>

          <div v-for="training in filteredTrainings" :key="training.id" class="training-card">
            <div class="card-color-bar" :style="{ background: training.color || '#ff8f38' }"></div>
            <div class="card-content">
              <div class="card-header-row">
                <div class="card-icon" :style="{ background: training.color + '20' || 'rgba(255,143,56,0.1)' }">
                  <q-icon name="sports_gymnastics" :style="{ color: training.color || '#ff8f38' }" size="24px" />
                </div>
                <span class="card-visibility" :class="training.isPublic ? 'public' : 'private'">
                  {{ training.isPublic ? 'Público' : 'Privado' }}
                </span>
              </div>
              <h3 class="card-title">{{ training.name }}</h3>
              <p class="card-description">{{ truncateText(training.description, 60) }}</p>
              <div class="card-stats">
                <span><q-icon name="fitness_center" size="14px" /> {{ training.exercises?.length || 0 }}</span>
                <span><q-icon name="timer" size="14px" /> {{ calculateDuration(training) }}m</span>
              </div>
              <div class="card-actions">
                <q-btn flat dense label="Editar" color="primary" no-caps @click="editTraining(training)" />
                <q-btn flat dense icon="delete" color="negative" @click="confirmDelete(training)" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Dialog -->
    <q-dialog v-model="trainingDialog" persistent maximized>
      <q-card class="training-dialog">
        <div class="dialog-content">
          <div class="dialog-header">
            <div class="header-left">
              <q-btn flat round icon="close" color="grey-6" v-close-popup />
              <h3>{{ isEditing ? 'Editar Entrenamiento' : 'Nuevo Entrenamiento' }}</h3>
            </div>
            <q-btn color="primary" :label="isEditing ? 'Guardar Cambios' : 'Crear Entrenamiento'" :loading="saving"
              icon="save" no-caps @click="saveTraining" />
          </div>

          <div class="dialog-body">
            <!-- Left: Form -->
            <div class="form-panel">
              <div class="form-section">
                <label class="section-title">Información General</label>
                <div class="form-group">
                  <label>Nombre *</label>
                  <q-input v-model="trainingForm.name" outlined dark dense placeholder="Ej: Rutina de Fuerza Superior"
                    :rules="[val => !!val || 'El nombre es obligatorio']" />
                </div>
                <div class="form-group">
                  <label>Descripción</label>
                  <q-input v-model="trainingForm.description" outlined dark dense type="textarea" rows="3"
                    placeholder="Describe el objetivo de este entrenamiento..." />
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label>Dificultad</label>
                    <q-select v-model="trainingForm.difficulty" :options="difficultyOptions" outlined dark dense
                      emit-value map-options />
                  </div>
                  <div class="form-group">
                    <label>Color</label>
                    <div class="color-picker">
                      <div v-for="color in colorOptions" :key="color"
                        class="color-option"
                        :class="{ active: trainingForm.color === color }"
                        :style="{ background: color }"
                        @click="trainingForm.color = color"
                      />
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <q-checkbox v-model="trainingForm.isPublic" label="Hacer público este entrenamiento" dark />
                </div>
              </div>

              <div class="form-section">
                <label class="section-title">Ejercicios</label>
                <q-btn outline color="primary" icon="add" label="Añadir Ejercicio" no-caps class="add-exercise-btn"
                  @click="showExerciseSelector = true" />

                <div class="selected-exercises">
                  <div v-if="!trainingForm.exercises?.length" class="no-exercises">
                    <q-icon name="fitness_center" size="32px" color="grey-6" />
                    <p>No hay ejercicios seleccionados</p>
                    <span>Añade ejercicios a esta rutina</span>
                  </div>
                  <div v-else v-for="(ex, index) in trainingForm.exercises" :key="index" class="exercise-item">
                    <div class="exercise-number">{{ index + 1 }}</div>
                    <div class="exercise-details">
                      <div class="exercise-name">{{ ex.name }}</div>
                      <div class="exercise-config">
                        <q-input v-model.number="ex.sets" type="number" outlined dark dense label="Series" style="width: 80px" />
                        <q-input v-model="ex.reps" outlined dark dense label="Reps" style="width: 100px" />
                        <q-input v-model.number="ex.rest" type="number" outlined dark dense label="Descanso (s)" style="width: 100px" />
                      </div>
                    </div>
                    <q-btn flat round icon="delete" color="negative" size="sm" @click="removeExercise(index)" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Right: Preview -->
            <div class="preview-panel">
              <div class="preview-header">
                <h4>Vista Previa</h4>
              </div>
              <div class="preview-content">
                <div class="training-preview-card">
                  <div class="preview-color-bar" :style="{ background: trainingForm.color || '#ff8f38' }"></div>
                  <div class="preview-body">
                    <h3>{{ trainingForm.name || 'Nombre del Entrenamiento' }}</h3>
                    <p>{{ trainingForm.description || 'Descripción del entrenamiento...' }}</p>
                    <div class="preview-meta">
                      <span><q-icon name="fitness_center" /> {{ trainingForm.exercises?.length || 0 }} ejercicios</span>
                      <span><q-icon name="timer" /> {{ calculatePreviewDuration }} min</span>
                    </div>
                    <div class="preview-exercises" v-if="trainingForm.exercises?.length">
                      <div v-for="(ex, idx) in trainingForm.exercises" :key="idx" class="preview-exercise-item">
                        <span class="ex-index">{{ idx + 1 }}</span>
                        <span class="ex-name">{{ ex.name }}</span>
                        <span class="ex-sets">{{ ex.sets }}x{{ ex.reps }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-card>
    </q-dialog>

    <!-- Exercise Selector Dialog -->
    <q-dialog v-model="showExerciseSelector" position="right">
      <q-card class="selector-dialog">
        <q-card-section class="selector-header">
          <h4>Seleccionar Ejercicio</h4>
          <q-btn flat round icon="close" color="grey-6" v-close-popup />
        </q-card-section>
        <q-card-section class="selector-search">
          <q-input v-model="exerciseSearch" outlined dark dense placeholder="Buscar ejercicio..." class="search-field">
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </q-card-section>
        <q-card-section class="selector-list">
          <div v-for="exercise in filteredAvailableExercises" :key="exercise.id" class="selector-item"
            @click="addExercise(exercise)">
            <div class="selector-item-icon">
              <q-icon name="fitness_center" color="primary" />
            </div>
            <div class="selector-item-info">
              <div class="selector-item-name">{{ exercise.name }}</div>
              <div class="selector-item-category">{{ exercise.category || 'General' }}</div>
            </div>
            <q-icon name="add_circle" color="positive" />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Delete Dialog -->
    <q-dialog v-model="deleteDialog" persistent>
      <q-card class="dialog-card delete-dialog">
        <q-card-section class="dialog-header">
          <div class="delete-icon">
            <q-icon name="warning" color="negative" size="32px" />
          </div>
          <h3 class="dialog-title">Eliminar Entrenamiento</h3>
          <p class="dialog-subtitle">¿Estás seguro de que quieres eliminar <strong>{{ trainingToDelete?.name }}</strong>?</p>
        </q-card-section>
        <q-card-section class="dialog-footer">
          <q-btn flat label="Cancelar" color="grey-6" v-close-popup />
          <q-btn label="Eliminar" color="negative" :loading="deleting" @click="deleteTraining" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { exerciseService, trainingService } from '@/services'
import { computed, onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const trainings = ref([])
const exercises = ref([])
const searchQuery = ref('')
const viewMode = ref('list')
const showExerciseSelector = ref(false)
const exerciseSearch = ref('')

const trainingDialog = ref(false)
const deleteDialog = ref(false)
const isEditing = ref(false)
const trainingToDelete = ref(null)

const trainingForm = ref({
  name: '',
  description: '',
  difficulty: 'intermediate',
  color: '#ff8f38',
  isPublic: false,
  exercises: []
})

const difficultyOptions = [
  { label: 'Principiante', value: 'beginner' },
  { label: 'Intermedio', value: 'intermediate' },
  { label: 'Avanzado', value: 'advanced' },
]

const colorOptions = ['#ff8f38', '#38b2ac', '#9370db', '#ff6b6b', '#3fb950', '#f59e0b', '#ec4899']

const filteredTrainings = computed(() => {
  if (!searchQuery.value) return trainings.value
  const query = searchQuery.value.toLowerCase()
  return trainings.value.filter(t =>
    t.name?.toLowerCase().includes(query) ||
    t.description?.toLowerCase().includes(query)
  )
})

const filteredAvailableExercises = computed(() => {
  const selectedIds = trainingForm.value.exercises?.map(e => e.id) || []
  let available = exercises.value.filter(e => !selectedIds.includes(e.id))

  if (exerciseSearch.value) {
    const query = exerciseSearch.value.toLowerCase()
    available = available.filter(e => e.name?.toLowerCase().includes(query))
  }

  return available
})

const publicTrainings = computed(() =>
  trainings.value.filter(t => t.isPublic).length
)

const totalExercises = computed(() =>
  trainings.value.reduce((sum, t) => sum + (t.exercises?.length || 0), 0)
)

const calculatePreviewDuration = computed(() => {
  if (!trainingForm.value.exercises?.length) return 0
  // Estimación: 45s por serie + descanso
  const totalSeconds = trainingForm.value.exercises.reduce((sum, ex) => {
    return sum + ((ex.sets || 3) * 45) + ((ex.rest || 60) * (ex.sets || 3))
  }, 0)
  return Math.round(totalSeconds / 60)
})

const fetchData = async () => {
  loading.value = true
  try {
    const [trainingsRes, exercisesRes] = await Promise.all([
      trainingService.getAll(),
      exerciseService.getAll()
    ])
    trainings.value = Array.isArray(trainingsRes) ? trainingsRes : (trainingsRes.member || trainingsRes['hydra:member'] || [])
    exercises.value = Array.isArray(exercisesRes) ? exercisesRes : (exercisesRes.member || exercisesRes['hydra:member'] || [])
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Error al cargar datos',
      position: 'top'
    })
  } finally {
    loading.value = false
  }
}

const calculateDuration = (training) => {
  if (!training.exercises?.length) return 0
  const totalSeconds = training.exercises.reduce((sum, ex) => {
    return sum + ((ex.sets || 3) * 45) + ((ex.rest || 60) * (ex.sets || 3))
  }, 0)
  return Math.round(totalSeconds / 60)
}

const truncateText = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

const openCreateDialog = () => {
  isEditing.value = false
  trainingForm.value = {
    name: '',
    description: '',
    difficulty: 'intermediate',
    color: '#ff8f38',
    isPublic: false,
    exercises: []
  }
  trainingDialog.value = true
}

const editTraining = (training) => {
  isEditing.value = true
  trainingForm.value = {
    ...training,
    exercises: training.exercises?.map(e => ({ ...e })) || []
  }
  trainingDialog.value = true
}

const addExercise = (exercise) => {
  trainingForm.value.exercises.push({
    id: exercise.id,
    name: exercise.name,
    sets: 3,
    reps: '10-12',
    rest: 60
  })
  showExerciseSelector.value = false
}

const removeExercise = (index) => {
  trainingForm.value.exercises.splice(index, 1)
}

const saveTraining = async () => {
  if (!trainingForm.value.name) {
    $q.notify({
      type: 'warning',
      message: 'El nombre es obligatorio',
      position: 'top'
    })
    return
  }

  saving.value = true
  try {
    if (isEditing.value) {
      await trainingService.update(trainingForm.value.id, trainingForm.value)
      $q.notify({
        type: 'positive',
        message: 'Entrenamiento actualizado',
        position: 'top'
      })
    } else {
      await trainingService.create(trainingForm.value)
      $q.notify({
        type: 'positive',
        message: 'Entrenamiento creado',
        position: 'top'
      })
    }
    trainingDialog.value = false
    fetchData()
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: isEditing.value ? 'Error al actualizar' : 'Error al crear',
      position: 'top'
    })
  } finally {
    saving.value = false
  }
}

const confirmDelete = (training) => {
  trainingToDelete.value = training
  deleteDialog.value = true
}

const deleteTraining = async () => {
  deleting.value = true
  try {
    await trainingService.delete(trainingToDelete.value.id)
    $q.notify({
      type: 'positive',
      message: 'Entrenamiento eliminado',
      position: 'top'
    })
    deleteDialog.value = false
    fetchData()
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Error al eliminar',
      position: 'top'
    })
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.page-container {
  background: linear-gradient(135deg, #0f1419 0%, #1a1f2e 50%, #0f1419 100%);
  min-height: 100vh;
}

.page-content {
  padding: 24px 32px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 0.95rem;
  color: #8b949e;
  margin: 0;
}

.action-btn {
  background: linear-gradient(135deg, #ff8f38 0%, #e67e2e 100%);
  border-radius: 12px;
  font-weight: 600;
}

/* Stats */
.stats-row {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.stat-mini {
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 20px 24px;
  flex: 1;
}

.stat-mini-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-mini-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
}

.stat-mini-label {
  font-size: 0.85rem;
  color: #8b949e;
}

/* Container */
.trainings-container {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 24px;
}

.filters-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.search-box {
  position: relative;
  width: 320px;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #8b949e;
  pointer-events: none;
}

.search-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px 16px 12px 48px;
  color: #ffffff;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.3s ease;
}

.search-input::placeholder {
  color: #8b949e;
}

.search-input:focus {
  border-color: rgba(255, 143, 56, 0.5);
  background: rgba(255, 255, 255, 0.08);
}

.view-toggle {
  display: flex;
  gap: 8px;
}

/* List View */
.trainings-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.training-row {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.training-row:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(147, 112, 219, 0.3);
}

.training-row.skeleton {
  padding: 24px;
}

.training-color {
  width: 4px;
  align-self: stretch;
}

.training-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  gap: 24px;
}

.training-main {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.training-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.training-info {
  flex: 1;
}

.training-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 4px 0;
}

.training-description {
  font-size: 0.9rem;
  color: #8b949e;
  margin: 0;
}

.training-stats {
  display: flex;
  gap: 24px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #c9d1d9;
  font-size: 0.9rem;
}

.training-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.visibility-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  margin-right: 8px;
}

.visibility-badge.public {
  background: rgba(63, 185, 80, 0.15);
  color: #3fb950;
}

.visibility-badge.private {
  background: rgba(139, 148, 158, 0.15);
  color: #8b949e;
}

/* Grid View */
.trainings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.training-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.training-card:hover {
  transform: translateY(-4px);
  border-color: rgba(147, 112, 219, 0.3);
}

.training-card.skeleton {
  min-height: 250px;
}

.card-color-bar {
  height: 4px;
}

.card-content {
  padding: 20px;
}

.card-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-visibility {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.card-visibility.public {
  background: rgba(63, 185, 80, 0.15);
  color: #3fb950;
}

.card-visibility.private {
  background: rgba(139, 148, 158, 0.15);
  color: #8b949e;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 8px 0;
}

.card-description {
  font-size: 0.9rem;
  color: #8b949e;
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.card-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.card-stats span {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #c9d1d9;
  font-size: 0.9rem;
}

.card-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

/* Empty State */
.empty-state {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-state h3 {
  color: #ffffff;
  margin: 16px 0 8px;
  font-size: 1.5rem;
}

.empty-state p {
  color: #8b949e;
  margin: 0 0 24px;
}

.grid-empty {
  min-height: 400px;
}

/* Dialog */
.training-dialog {
  width: 100vw;
  height: 100vh;
  background: #0f1419;
  border-radius: 0;
  display: flex;
  flex-direction: column;
}

.dialog-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 32px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-left h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}

.dialog-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.form-panel {
  width: 500px;
  background: #1a1f2e;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  padding: 32px;
  overflow-y: auto;
}

.form-section {
  margin-bottom: 32px;
}

.section-title {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: #8b949e;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  color: #c9d1d9;
  margin-bottom: 8px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.color-picker {
  display: flex;
  gap: 12px;
}

.color-option {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  border: 3px solid transparent;
  transition: all 0.2s ease;
}

.color-option.active {
  border-color: #ffffff;
  transform: scale(1.1);
}

.add-exercise-btn {
  width: 100%;
  border-style: dashed;
  margin-bottom: 20px;
}

.selected-exercises {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.no-exercises {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  background: rgba(255, 255, 255, 0.02);
  border: 2px dashed rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #8b949e;
}

.no-exercises p {
  margin: 8px 0 4px;
  font-weight: 500;
}

.no-exercises span {
  font-size: 0.85rem;
}

.exercise-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}

.exercise-number {
  width: 32px;
  height: 32px;
  background: rgba(255, 143, 56, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #ff8f38;
  font-size: 0.9rem;
}

.exercise-details {
  flex: 1;
}

.exercise-name {
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 8px;
}

.exercise-config {
  display: flex;
  gap: 12px;
}

.preview-panel {
  flex: 1;
  background: linear-gradient(135deg, #0f1419 0%, #1a1f2e 100%);
  padding: 32px;
  overflow-y: auto;
}

.preview-header h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #8b949e;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 24px 0;
}

.training-preview-card {
  max-width: 400px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  overflow: hidden;
  margin: 0 auto;
}

.preview-color-bar {
  height: 6px;
}

.preview-body {
  padding: 24px;
}

.preview-body h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 8px 0;
}

.preview-body p {
  color: #8b949e;
  font-size: 0.95rem;
  margin: 0 0 16px 0;
}

.preview-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.preview-meta span {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #c9d1d9;
  font-size: 0.9rem;
}

.preview-exercises {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.preview-exercise-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
}

.ex-index {
  width: 24px;
  height: 24px;
  background: rgba(255, 143, 56, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: #ff8f38;
}

.ex-name {
  flex: 1;
  color: #ffffff;
  font-size: 0.9rem;
}

.ex-sets {
  color: #8b949e;
  font-size: 0.85rem;
}

/* Exercise Selector */
.selector-dialog {
  width: 400px;
  height: 100vh;
  background: #1a1f2e;
  border-radius: 0;
  display: flex;
  flex-direction: column;
}

.selector-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.selector-header h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}

.selector-search {
  padding: 16px 24px;
}

.search-field :deep(.q-field__control) {
  background: rgba(255, 255, 255, 0.05);
}

.selector-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 24px 24px;
}

.selector-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.selector-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 143, 56, 0.3);
}

.selector-item-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 143, 56, 0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.selector-item-info {
  flex: 1;
}

.selector-item-name {
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 2px;
}

.selector-item-category {
  font-size: 0.85rem;
  color: #8b949e;
}

/* Delete Dialog */
.dialog-card {
  background: #1a1f2e;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  min-width: 400px;
}

.delete-dialog {
  text-align: center;
}

.dialog-header {
  padding: 32px;
}

.delete-icon {
  width: 64px;
  height: 64px;
  background: rgba(248, 81, 73, 0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.dialog-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 8px 0;
}

.dialog-subtitle {
  color: #8b949e;
  margin: 0;
}

.dialog-subtitle strong {
  color: #ffffff;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

/* Responsive */
@media (max-width: 900px) {
  .stats-row {
    flex-direction: column;
  }

  .training-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .training-stats {
    width: 100%;
  }

  .form-panel {
    width: 100%;
  }

  .preview-panel {
    display: none;
  }

  .selector-dialog {
    width: 100vw;
  }
}
</style>
