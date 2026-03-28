<template>
  <q-page class="page-container">
    <div class="page-content">
      <!-- Header -->
      <PageHeader
        title="Ejercicios"
        subtitle="Gestiona los ejercicios disponibles para los entrenamientos"
        action-label="Nuevo Ejercicio"
        @action="openCreateDialog"
      />

      <!-- Stats -->
      <StatsCards :stats="stats" />

      <!-- Filters -->
      <div class="filters-container">
        <div class="search-wrapper">
          <div class="search-box-modern">
            <q-icon name="search" class="search-icon" size="22px" />
            <input v-model="searchQuery" type="text" placeholder="Buscar ejercicios..." class="search-input">
            <q-btn v-if="searchQuery" flat round dense icon="close" size="sm" class="clear-search"
              @click="searchQuery = ''" />
          </div>
        </div>

        <div class="filter-groups-modern">
          <FilterPills v-model="muscleFilter" label="Grupo muscular" icon="fitness_center" :options="muscleOptions" />
          
          <!-- Level Filter -->
          <div class="filter-category">
            <span class="filter-category-label">
              <q-icon name="signal_cellular_alt" size="16px" />
              Nivel
            </span>
            <div class="filter-pills">
              <button v-for="level in levelOptions" :key="level.value" class="filter-pill level"
                :class="{ 'active': levelFilter === level.value, [level.value]: levelFilter === level.value }"
                @click="levelFilter = level.value">
                <q-icon v-if="level.value !== 'all'" name="local_fire_department" size="12px" />
                {{ level.label }}
              </button>
            </div>
          </div>

          <FilterPills v-model="disciplineFilter" label="Disciplina" icon="sports" :options="disciplineOptions" />
        </div>

        <!-- Sort Options -->
        <div class="sort-section">
          <span class="sort-label">
            <q-icon name="sort" size="16px" />
            Ordenar por:
          </span>
          <div class="sort-pills">
            <button v-for="option in sortOptions" :key="option.value" class="sort-pill"
              :class="{ 'active': sortBy === option.value }" @click="sortBy = option.value">
              {{ option.label }}
            </button>
          </div>
        </div>

        <!-- Active Filters -->
        <div v-if="hasActiveFilters" class="active-filters">
          <span class="active-filters-label">Filtros activos:</span>
          <div class="active-filter-chips">
            <q-chip v-if="searchQuery" removable dense color="primary" text-color="dark" @remove="searchQuery = ''">
              <q-icon name="search" size="14px" left /> {{ searchQuery }}
            </q-chip>
            <q-chip v-if="muscleFilter !== 'all'" removable dense :color="getMuscleColor(muscleFilter)"
              text-color="white" @remove="muscleFilter = 'all'">
              {{ getMuscleGroupLabel(muscleFilter) }}
            </q-chip>
            <q-chip v-if="levelFilter !== 'all'" removable dense :color="getLevelColor(levelFilter)"
              text-color="white" @remove="levelFilter = 'all'">
              {{ getLevelLabel(levelFilter) }}
            </q-chip>
            <q-chip v-if="disciplineFilter !== 'all'" removable dense color="deep-orange" text-color="white"
              @remove="disciplineFilter = 'all'">
              {{ getDisciplineLabel(disciplineFilter) }}
            </q-chip>
            <q-chip v-if="sortBy !== 'difficulty_asc'" removable dense color="blue" text-color="white"
              @remove="sortBy = 'difficulty_asc'">
              <q-icon name="sort" size="14px" left /> {{ getSortLabel(sortBy) }}
            </q-chip>
            <q-btn flat dense no-caps color="grey-6" label="Limpiar todo" size="sm" @click="clearAllFilters" />
          </div>
        </div>
      </div>

      <!-- Exercises Grid -->
      <div class="exercises-grid">
        <template v-if="loading">
          <div v-for="i in 8" :key="`skeleton-${i}`" class="exercise-card skeleton">
            <q-skeleton type="text" class="bg-grey-8" width="80%" />
            <q-skeleton type="text" class="bg-grey-8" width="40%" />
            <div style="display: flex; gap: 8px;">
              <q-skeleton type="rect" class="bg-grey-8" width="80px" height="28px" />
              <q-skeleton type="rect" class="bg-grey-8" width="80px" height="28px" />
            </div>
            <q-skeleton type="text" class="bg-grey-8" width="50%" />
          </div>
        </template>

        <div v-else-if="filteredExercises.length === 0" class="empty-state">
          <q-icon name="fitness_center" size="64px" color="grey-6" />
          <h3>No hay ejercicios</h3>
          <p>Crea tu primer ejercicio para empezar</p>
          <q-btn color="primary" icon="add" label="Crear Ejercicio" no-caps @click="openCreateDialog" />
        </div>

        <div v-for="exercise in paginatedExercises" :key="exercise.id" class="exercise-card">
          <div class="exercise-header" :class="exercise.level">
            <h3 class="exercise-name">{{ normalizeName(exercise.name) }}</h3>
            <p v-if="exercise.description" class="exercise-description">{{ exercise.description }}</p>
          </div>

          <div class="exercise-actions">
            <q-btn flat dense icon="play_circle" label="YouTube" color="grey-5" size="sm" no-caps
              @click="searchExercise(exercise, 'youtube')" />
            <q-btn flat dense icon="search" label="Google" color="grey-5" size="sm" no-caps
              @click="searchExercise(exercise, 'google')" />
            <q-btn flat dense icon="edit" label="Editar" color="primary" size="sm" no-caps
              @click="editExercise(exercise)" />
            <q-btn flat dense icon="delete" label="Eliminar" color="negative" size="sm" no-caps
              @click="confirmDelete(exercise)" />
          </div>

          <div class="exercise-difficulty">
            <div class="fire-row">
              <q-icon v-for="n in 3" :key="n" name="local_fire_department"
                :color="n <= (exercise.difficultyRating || 1) ? getFireColor(exercise.level, true) : 'grey-7'"
                size="20px" />
            </div>
            <span class="level-badge" :class="exercise.level">{{ getLevelLabel(exercise.level) }}</span>
          </div>

          <div class="exercise-muscles">
            <div class="muscle-tag primary">
              <span>{{ getMuscleGroupLabel(exercise.primaryMuscleGroup) }}</span>
            </div>
            <div v-if="exercise.secondaryMuscleGroup" class="muscle-tag secondary">
              <span>{{ getMuscleGroupLabel(exercise.secondaryMuscleGroup) }}</span>
            </div>
          </div>

          <div v-if="exercise.disciplines?.length" class="exercise-disciplines">
            <div v-for="discipline in exercise.disciplines" :key="discipline" class="discipline-tag"
              :class="discipline">
              {{ getDisciplineLabel(discipline) }}
            </div>
          </div>

          <div class="exercise-equipment">
            <q-icon :name="exercise.equipment ? 'sports_gymnastics' : 'block'" size="14px" color="grey-5" />
            <span>{{ exercise.equipment ? exercise.equipment.name : 'Sin equipamiento' }}</span>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="filteredExercises.length > 10" class="pagination-wrapper">
          <div class="pagination-row">
            <div class="per-page-wrapper">
              <span class="per-page-label">Mostrar:</span>
              <div class="per-page-pills">
                <button v-for="option in itemsPerPageOptions" :key="option.value" class="per-page-pill"
                  :class="{ 'active': itemsPerPage === option.value }" @click="itemsPerPage = option.value">
                  {{ option.label }}
                </button>
              </div>
            </div>
            <span class="pagination-info">
              {{ filteredExercises.length }} ejercicios | Página {{ currentPage }} de {{ totalPages }}
            </span>
          </div>
          <q-pagination v-model="currentPage" :max="totalPages" :max-pages="6" boundary-numbers direction-links
            color="grey-6" active-color="primary" />
        </div>
      </div>
    </div>

    <!-- Create/Edit Dialog -->
    <q-dialog v-model="exerciseDialog" persistent maximized>
      <q-card class="exercise-dialog">
        <div class="dialog-sidebar">
          <div class="sidebar-header">
            <q-btn flat round icon="close" color="grey-6" v-close-popup />
            <h3>{{ isEditing ? 'Editar Ejercicio' : 'Nuevo Ejercicio' }}</h3>
          </div>

          <div class="sidebar-form">
            <div class="form-section">
              <label class="section-label">Información Básica</label>
              <div class="form-group">
                <label>Nombre *</label>
                <q-input v-model="exerciseForm.name" outlined dark dense placeholder="Ej: Push Ups, Dips, Pull Ups"
                  :rules="[val => !!val || 'El nombre es obligatorio']" />
              </div>
            </div>

            <div class="form-section">
              <label class="section-label">Grupos Musculares</label>
              <div class="form-row">
                <div class="form-group">
                  <label>Músculo Principal *</label>
                  <q-select v-model="exerciseForm.primaryMuscleGroup" :options="muscleGroupOptions" outlined dark dense
                    emit-value map-options placeholder="Selecciona"
                    :rules="[val => !!val || 'El grupo muscular es obligatorio']" />
                </div>
                <div class="form-group">
                  <label>Músculo Secundario</label>
                  <q-select v-model="exerciseForm.secondaryMuscleGroup" :options="muscleGroupOptions" outlined dark
                    dense emit-value map-options placeholder="Opcional" clearable />
                </div>
              </div>
            </div>

            <div class="form-section">
              <label class="section-label">Nivel y Dificultad</label>
              <div class="form-row">
                <div class="form-group">
                  <label>Nivel *</label>
                  <q-select v-model="exerciseForm.level" :options="levelOptions" outlined dark dense emit-value
                    map-options placeholder="Selecciona" />
                </div>
                <div class="form-group">
                  <label>Intensidad</label>
                  <div class="fire-rating">
                    <q-btn v-for="n in 3" :key="n" flat dense
                      :class="{ 'fire-active': n <= exerciseForm.difficultyRating }"
                      @click="exerciseForm.difficultyRating = n">
                      <q-icon name="local_fire_department"
                        :color="getFireColor(exerciseForm.level, n <= exerciseForm.difficultyRating)" size="24px" />
                    </q-btn>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-section">
              <label class="section-label">Equipamiento</label>
              <div class="form-group">
                <q-select v-model="exerciseForm.equipment" :options="equipmentOptions" outlined dark dense emit-value
                  map-options placeholder="Ninguno" clearable option-value="id" option-label="name" />
              </div>
            </div>

            <div class="form-section">
              <label class="section-label">Video Tutorial</label>
              <div class="form-group">
                <label>Enlace a video (YouTube)</label>
                <div class="video-input-row">
                  <q-input v-model="exerciseForm.media" outlined dark dense
                    placeholder="https://youtube.com/watch?v=..." class="video-input" />
                  <q-btn v-if="exerciseForm.name" flat icon="search" color="primary"
                    @click="searchExercise({ name: exerciseForm.name }, 'youtube')" label="Buscar" no-caps />
                </div>
                <div class="video-help">
                  <q-icon name="info" size="16px" color="grey-6" />
                  <span>Deja vacío y usa el botón "Buscar" para encontrar videos, o pega un enlace de YouTube</span>
                </div>
              </div>
            </div>
          </div>

          <div class="sidebar-footer">
            <q-btn flat label="Cancelar" color="grey-6" v-close-popup />
            <q-btn color="primary" :label="isEditing ? 'Guardar Cambios' : 'Crear Ejercicio'" :loading="saving"
              @click="saveExercise" />
          </div>
        </div>

        <!-- Preview -->
        <div class="dialog-preview">
          <div class="preview-header">
            <h4>Vista Previa</h4>
          </div>
          <div class="preview-content">
            <div class="preview-card">
              <div class="preview-image">
                <img v-if="exerciseForm.media" :src="exerciseForm.media" :alt="exerciseForm.name">
                <div v-else class="preview-placeholder">
                  <q-icon name="fitness_center" color="grey-6" size="48px" />
                </div>
              </div>
              <div class="preview-info">
                <h3>{{ exerciseForm.name || 'Nombre del Ejercicio' }}</h3>
                <div class="preview-muscles" v-if="exerciseForm.primaryMuscleGroup">
                  <q-icon name="fitness_center" size="16px" color="primary" />
                  {{ getMuscleGroupLabel(exerciseForm.primaryMuscleGroup) }}
                  <span v-if="exerciseForm.secondaryMuscleGroup">
                    + {{ getMuscleGroupLabel(exerciseForm.secondaryMuscleGroup) }}
                  </span>
                </div>
                <div class="preview-fires" v-if="exerciseForm.level">
                  <q-icon v-for="n in exerciseForm.difficultyRating" :key="n" name="local_fire_department"
                    :color="getFireColor(exerciseForm.level, true)" size="20px" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-card>
    </q-dialog>

    <!-- Delete Dialog -->
    <FormDialog v-model="deleteDialog" title="Eliminar Ejercicio"
      :subtitle="`¿Estás seguro de que quieres eliminar <strong>${exerciseToDelete?.name}</strong>?`" is-delete
      confirm-label="Eliminar" confirm-color="negative" :loading="deleting" @confirm="deleteExercise" />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useExercisesStore } from '@/stores/exercises'
import { useEquipmentsStore } from '@/stores/equipments'
import { useHelpers } from '@/composables/useHelpers'
import { 
  getMuscleGroupLabel,
  getLevelLabel,
  getDisciplineLabel,
  getLevelColor,
} from '@/constants'
import PageHeader from '@/components/common/PageHeader.vue'
import StatsCards from '@/components/common/StatsCards.vue'
import FilterPills from '@/components/common/FilterPills.vue'
import FormDialog from '@/components/common/FormDialog.vue'

const $q = useQuasar()
const exercisesStore = useExercisesStore()
const equipmentsStore = useEquipmentsStore()

// State
const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const searchQuery = ref('')
const muscleFilter = ref('all')
const levelFilter = ref('all')
const disciplineFilter = ref('all')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const sortBy = ref('difficulty_asc')

// Dialogs
const exerciseDialog = ref(false)
const deleteDialog = ref(false)
const isEditing = ref(false)
const exerciseToDelete = ref(null)

// Form
const exerciseForm = ref({
  name: '',
  primaryMuscleGroup: '',
  secondaryMuscleGroup: '',
  level: 'beginner',
  difficultyRating: 1,
  equipment: null,
  media: ''
})

// Options
const itemsPerPageOptions = [
  { label: '10', value: 10 },
  { label: '20', value: 20 },
  { label: '30', value: 30 },
  { label: '40', value: 40 },
  { label: '50', value: 50 }
]

const muscleGroupOptions = [
  { label: 'Pecho', value: 'chest' },
  { label: 'Espalda', value: 'back' },
  { label: 'Piernas', value: 'legs' },
  { label: 'Glúteos', value: 'glutes' },
  { label: 'Isquiotibiales', value: 'hamstrings' },
  { label: 'Gemelos', value: 'calves' },
  { label: 'Aductores', value: 'adductors' },
  { label: 'Hombros', value: 'shoulders' },
  { label: 'Bíceps', value: 'biceps' },
  { label: 'Tríceps', value: 'triceps' },
  { label: 'Antebrazos', value: 'forearms' },
  { label: 'Core', value: 'core' },
  { label: 'HIIT/Cardio', value: 'hiit' },
  { label: 'Ninguno', value: 'none' },
]

const levelOptions = [
  { label: 'Todos', value: 'all' },
  { label: 'Principiante', value: 'beginner' },
  { label: 'Intermedio', value: 'intermediate' },
  { label: 'Experto', value: 'expert' },
]

const sortOptions = [
  { label: 'Dificultad ↑', value: 'difficulty_asc' },
  { label: 'Dificultad ↓', value: 'difficulty_desc' },
  { label: 'Nombre A-Z', value: 'name_asc' },
  { label: 'Nombre Z-A', value: 'name_desc' },
  { label: 'Músculo', value: 'muscle' },
  { label: 'Nivel', value: 'level' },
]

const disciplineOptions = [
  { label: 'Todas', value: 'all', color: 'default' },
  { label: 'Calistenia', value: 'calisthenics', color: 'orange' },
  { label: 'CrossFit', value: 'crossfit', color: 'red' },
  { label: 'Fitness', value: 'fitness', color: 'blue' },
]

const muscleOptions = [
  { label: 'Todos', value: 'all', color: 'default' },
  { label: 'Pecho', value: 'chest', color: 'orange' },
  { label: 'Espalda', value: 'back', color: 'blue' },
  { label: 'Piernas', value: 'legs', color: 'purple' },
  { label: 'Glúteos', value: 'glutes', color: 'pink' },
  { label: 'Isquiotibiales', value: 'hamstrings', color: 'deep-purple' },
  { label: 'Gemelos', value: 'calves', color: 'teal' },
  { label: 'Aductores', value: 'adductors', color: 'indigo' },
  { label: 'Hombros', value: 'shoulders', color: 'cyan' },
  { label: 'Bíceps', value: 'biceps', color: 'green' },
  { label: 'Tríceps', value: 'triceps', color: 'pink' },
  { label: 'Antebrazos', value: 'forearms', color: 'brown' },
  { label: 'Core', value: 'core', color: 'yellow' },
  { label: 'HIIT/Cardio', value: 'hiit', color: 'red' },
]

// Computed
const stats = computed(() => [
  { value: exercisesStore.totalExercises, label: 'Total Ejercicios', icon: 'fitness_center' },
  { value: muscleGroupsCount.value, label: 'Grupos Musculares', icon: 'fitness_center', iconColor: 'teal' },
  { value: expertCount.value, label: 'Expertos', icon: 'local_fire_department', iconColor: 'red' },
])

const muscleGroupsCount = computed(() => {
  const groups = new Set(exercisesStore.exercises.map(e => e.primaryMuscleGroup).filter(Boolean))
  return groups.size
})

const expertCount = computed(() => exercisesStore.exercises.filter(e => e.level === 'expert').length)

const hasActiveFilters = computed(() =>
  searchQuery.value || muscleFilter.value !== 'all' || levelFilter.value !== 'all' ||
  disciplineFilter.value !== 'all' || sortBy.value !== 'difficulty_asc'
)

const filteredExercises = computed(() => {
  let result = [...exercisesStore.exercises]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(ex => ex.name?.toLowerCase().includes(query))
  }

  if (muscleFilter.value !== 'all') {
    result = result.filter(ex => ex.primaryMuscleGroup === muscleFilter.value)
  }

  if (levelFilter.value !== 'all') {
    result = result.filter(ex => ex.level === levelFilter.value)
  }

  if (disciplineFilter.value !== 'all') {
    result = result.filter(ex => ex.disciplines?.includes(disciplineFilter.value))
  }

  result.sort((a, b) => {
    switch (sortBy.value) {
      case 'difficulty_asc': return (a.difficultyRating || 1) - (b.difficultyRating || 1)
      case 'difficulty_desc': return (b.difficultyRating || 1) - (a.difficultyRating || 1)
      case 'name_asc': return (a.name || '').localeCompare(b.name || '')
      case 'name_desc': return (b.name || '').localeCompare(a.name || '')
      case 'muscle': return (a.primaryMuscleGroup || '').localeCompare(b.primaryMuscleGroup || '')
      case 'level': {
        const order = { 'beginner': 1, 'intermediate': 2, 'expert': 3 }
        return (order[a.level] || 99) - (order[b.level] || 99)
      }
      default: return 0
    }
  })

  return result
})

const paginatedExercises = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredExercises.value.slice(start, start + itemsPerPage.value)
})

const totalPages = computed(() => Math.ceil(filteredExercises.value.length / itemsPerPage.value))

const equipmentOptions = computed(() => [{ id: null, name: 'Ninguno' }, ...equipmentsStore.equipments])

// Methods
const fetchData = async () => {
  loading.value = true
  try {
    await Promise.all([exercisesStore.fetchExercises(), equipmentsStore.fetchEquipments()])
  } catch {
    $q.notify({ type: 'negative', message: 'Error al cargar datos', position: 'top' })
  } finally {
    loading.value = false
  }
}

const getSortLabel = (value) => sortOptions.find(o => o.value === value)?.label || value

const getMuscleColor = (muscle) => ({
  'chest': 'orange', 'back': 'blue', 'legs': 'purple', 'glutes': 'pink',
  'hamstrings': 'deep-purple', 'calves': 'teal', 'adductors': 'indigo',
  'shoulders': 'cyan', 'biceps': 'green', 'triceps': 'pink',
  'forearms': 'brown', 'core': 'yellow', 'hiit': 'red',
}[muscle] || 'grey')

const clearAllFilters = () => {
  searchQuery.value = ''
  muscleFilter.value = 'all'
  levelFilter.value = 'all'
  disciplineFilter.value = 'all'
  sortBy.value = 'difficulty_asc'
}

const { normalizeName } = useHelpers()

const getFireColor = (level, isActive) => getLevelColor(level, isActive)

const openCreateDialog = () => {
  isEditing.value = false
  exerciseForm.value = { name: '', primaryMuscleGroup: '', secondaryMuscleGroup: '', level: 'beginner', difficultyRating: 1, equipment: null, media: '' }
  exerciseDialog.value = true
}

const editExercise = (exercise) => {
  isEditing.value = true
  exerciseForm.value = {
    id: exercise.id, name: exercise.name, primaryMuscleGroup: exercise.primaryMuscleGroup,
    secondaryMuscleGroup: exercise.secondaryMuscleGroup || '', level: exercise.level,
    difficultyRating: exercise.difficultyRating || 1, equipment: exercise.equipment?.id || null, media: exercise.media || ''
  }
  exerciseDialog.value = true
}

const searchExercise = (exercise, platform) => {
  const query = encodeURIComponent(`${exercise.name} exercise tutorial`)
  const url = platform === 'youtube'
    ? `https://www.youtube.com/results?search_query=${query}`
    : `https://www.google.com/search?q=${query}&tbm=vid`
  window.open(url, '_blank')
}

const saveExercise = async () => {
  if (!exerciseForm.value.name) {
    $q.notify({ type: 'warning', message: 'El nombre es obligatorio', position: 'top' })
    return
  }

  saving.value = true
  try {
    if (isEditing.value) {
      await exercisesStore.updateExercise(exerciseForm.value.id, exerciseForm.value)
    } else {
      await exercisesStore.createExercise(exerciseForm.value)
    }
    exerciseDialog.value = false
  } catch {
    // Error manejado por el store
  } finally {
    saving.value = false
  }
}

const confirmDelete = (exercise) => {
  exerciseToDelete.value = exercise
  deleteDialog.value = true
}

const deleteExercise = async () => {
  deleting.value = true
  try {
    await exercisesStore.deleteExercise(exerciseToDelete.value.id)
    deleteDialog.value = false
  } catch {
    // Error manejado por el store
  } finally {
    deleting.value = false
  }
}

// Watchers
watch([searchQuery, muscleFilter, levelFilter, disciplineFilter], () => currentPage.value = 1)
watch(itemsPerPage, () => currentPage.value = 1)

onMounted(fetchData)
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

/* Filters */
.filters-container {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 28px;
  margin-bottom: 24px;
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.search-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.search-box-modern {
  position: relative;
  width: 100%;
  max-width: 600px;
}

.search-box-modern .search-icon {
  position: absolute;
  left: 24px;
  top: 50%;
  transform: translateY(-50%);
  color: #ff8f38;
  z-index: 2;
  transition: all 0.3s ease;
}

.search-box-modern:focus-within .search-icon {
  color: #ff6b35;
  transform: translateY(-50%) scale(1.1);
}

.search-box-modern .search-input {
  width: 100%;
  padding: 18px 52px 18px 60px;
  background: rgba(0, 0, 0, 0.4);
  border: 2px solid rgba(255, 143, 56, 0.15);
  border-radius: 50px;
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 500;
  outline: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.search-box-modern .search-input:focus {
  border-color: #ff8f38;
  box-shadow: 0 4px 30px rgba(255, 143, 56, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.5);
}

.search-box-modern .search-input::placeholder {
  color: #6e7681;
  font-weight: 400;
}

.search-box-modern .clear-search {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #8b949e;
  transition: all 0.2s ease;
}

.search-box-modern .clear-search:hover {
  color: #ff8f38;
  transform: translateY(-50%) rotate(90deg);
}

.filter-groups-modern {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.filter-category {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.filter-category-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  color: #8b949e;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.filter-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.filter-pill {
  padding: 12px 24px;
  border-radius: 50px;
  font-size: 0.95rem;
  font-weight: 500;
  color: #c9d1d9;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
}

.filter-pill:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.filter-pill.active {
  background: linear-gradient(135deg, #ff8f38 0%, #ff6b35 100%);
  color: #000000;
  border-color: transparent;
  font-weight: 600;
  box-shadow: 0 6px 20px rgba(255, 143, 56, 0.5);
}

.filter-pill.beginner.active { background: linear-gradient(135deg, #3fb950 0%, #2ea043 100%); box-shadow: 0 6px 20px rgba(63, 185, 80, 0.5); }
.filter-pill.intermediate.active { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); box-shadow: 0 6px 20px rgba(245, 158, 11, 0.5); }
.filter-pill.expert.active { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%); box-shadow: 0 6px 20px rgba(255, 107, 107, 0.5); }

/* Sort Section */
.sort-section {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-top: 20px;
  margin-top: 4px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  flex-wrap: wrap;
}

.sort-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  color: #8b949e;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.sort-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.sort-pill {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #8b949e;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  cursor: pointer;
  transition: all 0.2s ease;
}

.sort-pill:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
}

.sort-pill.active {
  background: rgba(88, 166, 255, 0.2);
  color: #58a6ff;
  border-color: rgba(88, 166, 255, 0.3);
}

/* Active Filters */
.active-filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  padding-top: 20px;
  margin-top: 4px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.active-filters-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6e7681;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.active-filter-chips {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

/* Exercises Grid */
.exercises-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.exercise-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 280px;
}

.exercise-card:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 143, 56, 0.3);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
  background: rgba(255, 255, 255, 0.05);
}

.exercise-card.skeleton {
  gap: 12px;
}

/* Exercise Header */
.exercise-header {
  position: relative;
  padding-top: 12px;
}

.exercise-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 4px;
  border-radius: 2px;
  background: linear-gradient(90deg, #3fb950, #2ea043);
  transition: all 0.3s ease;
}

.exercise-header.beginner::before { background: linear-gradient(90deg, #3fb950, #2ea043); }
.exercise-header.intermediate::before { background: linear-gradient(90deg, #f59e0b, #d97706); }
.exercise-header.expert::before { background: linear-gradient(90deg, #ff6b6b, #ee5a5a); }

.exercise-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  line-height: 1.3;
}

.exercise-description {
  font-size: 0.9rem;
  color: #8b949e;
  margin: 8px 0 0 0;
  line-height: 1.5;
}

/* Exercise Actions */
.exercise-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.exercise-card:hover .exercise-actions {
  opacity: 1;
}

.exercise-actions .q-btn {
  font-size: 0.75rem;
  font-weight: 500;
}

/* Exercise Difficulty */
.exercise-difficulty {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.fire-row {
  display: flex;
  gap: 4px;
}

.level-badge {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
}

.level-badge.beginner { background: rgba(63, 185, 80, 0.2); color: #3fb950; }
.level-badge.intermediate { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }
.level-badge.expert { background: rgba(255, 107, 107, 0.2); color: #ff6b6b; }

/* Exercise Muscles */
.exercise-muscles {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.muscle-tag {
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
}

.muscle-tag.primary {
  background: rgba(88, 166, 255, 0.15);
  color: #58a6ff;
  border: 1px solid rgba(88, 166, 255, 0.3);
}

.muscle-tag.secondary {
  background: rgba(139, 148, 158, 0.1);
  color: #8b949e;
  border: 1px solid rgba(139, 148, 158, 0.2);
}

/* Exercise Disciplines */
.exercise-disciplines {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.discipline-tag {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.discipline-tag.calisthenics { background: rgba(255, 143, 56, 0.15); color: #ff8f38; }
.discipline-tag.crossfit { background: rgba(255, 107, 107, 0.15); color: #ff6b6b; }
.discipline-tag.fitness { background: rgba(88, 166, 255, 0.15); color: #58a6ff; }

/* Exercise Equipment */
.exercise-equipment {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 0.85rem;
  color: #8b949e;
  margin-top: auto;
}

/* Empty State */
.empty-state {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.empty-state h3 {
  color: #ffffff;
  margin: 24px 0 8px;
  font-size: 1.5rem;
}

.empty-state p {
  color: #8b949e;
  margin: 0 0 24px;
}

/* Pagination */
.pagination-wrapper {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 32px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  margin-top: 16px;
}

.pagination-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 20px;
}

.per-page-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.per-page-label {
  font-size: 0.8rem;
  color: #8b949e;
  font-weight: 500;
}

.per-page-pills {
  display: flex;
  gap: 6px;
}

.per-page-pill {
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #8b949e;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
  transition: all 0.2s ease;
}

.per-page-pill:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.per-page-pill.active {
  background: #ff8f38;
  color: #000000;
  border-color: transparent;
  font-weight: 600;
}

.pagination-info {
  font-size: 0.85rem;
  color: #8b949e;
}

/* Exercise Dialog */
.exercise-dialog {
  display: flex;
  background: #0f1419;
  border-radius: 0;
  overflow: hidden;
  width: 100vw;
  height: 100vh;
}

.dialog-sidebar {
  width: 480px;
  background: #1a1f2e;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}

.sidebar-form {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.form-section {
  margin-bottom: 28px;
}

.section-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #8b949e;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #c9d1d9;
}

.fire-rating {
  display: flex;
  gap: 8px;
}

.fire-rating .q-btn {
  padding: 4px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.fire-rating .q-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.fire-rating .fire-active {
  animation: firePulse 0.3s ease;
}

@keyframes firePulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.video-input-row {
  display: flex;
  gap: 8px;
}

.video-input {
  flex: 1;
}

.video-help {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 8px;
  font-size: 0.8rem;
  color: #8b949e;
}

.sidebar-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* Preview */
.dialog-preview {
  flex: 1;
  background: linear-gradient(135deg, #0f1419 0%, #1a1f2e 50%, #0f1419 100%);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.preview-header {
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.preview-header h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #8b949e;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.preview-content {
  flex: 1;
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-card {
  width: 100%;
  max-width: 400px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  overflow: hidden;
}

.preview-image {
  aspect-ratio: 16 / 9;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.03);
}

.preview-info {
  padding: 24px;
}

.preview-info h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 16px 0;
}

.preview-muscles {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #c9d1d9;
  margin-bottom: 16px;
}

.preview-fires {
  display: flex;
  gap: 4px;
}

@media (max-width: 1024px) {
  .exercise-dialog {
    flex-direction: column;
  }

  .dialog-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    max-height: 60vh;
  }

  .dialog-preview {
    display: none;
  }
}

@media (max-width: 900px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .filters-container {
    padding: 20px 16px;
  }
}
</style>
