<template>
  <q-page class="page-container">
    <div class="page-content">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Ejercicios</h1>
          <p class="page-subtitle">Gestiona los ejercicios disponibles para los entrenamientos</p>
        </div>
        <q-btn color="primary" icon="add" label="Nuevo Ejercicio" class="action-btn" no-caps @click="openCreateDialog" />
      </div>

      <!-- Stats -->
      <div class="stats-row">
        <div class="stat-mini">
          <div class="stat-mini-icon" style="background: rgba(255, 143, 56, 0.2)">
            <q-icon name="fitness_center" color="primary" size="20px" />
          </div>
          <div class="stat-mini-content">
            <div class="stat-mini-value">{{ exercises.length }}</div>
            <div class="stat-mini-label">Total Ejercicios</div>
          </div>
        </div>
        <div class="stat-mini">
          <div class="stat-mini-icon" style="background: rgba(56, 178, 172, 0.2)">
            <q-icon name="fitness_center" color="teal" size="20px" />
          </div>
          <div class="stat-mini-content">
            <div class="stat-mini-value">{{ muscleGroupsCount }}</div>
            <div class="stat-mini-label">Grupos Musculares</div>
          </div>
        </div>
        <div class="stat-mini">
          <div class="stat-mini-icon" style="background: rgba(255, 107, 107, 0.2)">
            <q-icon name="local_fire_department" color="red" size="20px" />
          </div>
          <div class="stat-mini-content">
            <div class="stat-mini-value">{{ expertCount }}</div>
            <div class="stat-mini-label">Expertos</div>
          </div>
        </div>
      </div>

      <!-- Modern Filters -->
      <div class="filters-container">
        <!-- Search Bar -->
        <div class="search-wrapper">
          <div class="search-box-modern">
            <q-icon name="search" class="search-icon" size="22px" />
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Buscar ejercicios..." 
              class="search-input"
            >
            <q-btn 
              v-if="searchQuery" 
              flat 
              round 
              dense 
              icon="close" 
              size="sm"
              class="clear-search"
              @click="searchQuery = ''"
            />
          </div>
        </div>

        <!-- Filter Groups -->
        <div class="filter-groups-modern">
          <!-- Muscle Filter -->
          <div class="filter-category">
            <span class="filter-category-label">
              <q-icon name="fitness_center" size="16px" />
              Grupo muscular
            </span>
            <div class="filter-pills">
              <button 
                v-for="muscle in muscleOptions" 
                :key="muscle.value"
                class="filter-pill"
                :class="{ 'active': muscleFilter === muscle.value, [muscle.color]: true }"
                @click="muscleFilter = muscle.value"
              >
                {{ muscle.label }}
              </button>
            </div>
          </div>

          <!-- Level Filter -->
          <div class="filter-category">
            <span class="filter-category-label">
              <q-icon name="signal_cellular_alt" size="16px" />
              Nivel
            </span>
            <div class="filter-pills">
              <button 
                v-for="level in levelOptions" 
                :key="level.value"
                class="filter-pill level"
                :class="{ 
                  'active': levelFilter === level.value,
                  'beginner': level.value === 'beginner',
                  'intermediate': level.value === 'intermediate',
                  'expert': level.value === 'expert'
                }"
                @click="levelFilter = level.value"
              >
                <q-icon v-if="level.value !== 'all'" name="local_fire_department" size="12px" />
                {{ level.label }}
              </button>
            </div>
          </div>
          
          <!-- Discipline Filter -->
          <div class="filter-category">
            <span class="filter-category-label">
              <q-icon name="sports" size="16px" />
              Disciplina
            </span>
            <div class="filter-pills">
              <button 
                v-for="discipline in disciplineOptions" 
                :key="discipline.value"
                class="filter-pill discipline"
                :class="{ 
                  'active': disciplineFilter === discipline.value,
                  [discipline.color]: true
                }"
                @click="disciplineFilter = discipline.value"
              >
                {{ discipline.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- Active Filters -->
        <div v-if="hasActiveFilters" class="active-filters">
          <span class="active-filters-label">Filtros activos:</span>
          <div class="active-filter-chips">
            <q-chip
              v-if="searchQuery"
              removable
              dense
              color="primary"
              text-color="dark"
              @remove="searchQuery = ''"
            >
              <q-icon name="search" size="14px" left />
              {{ searchQuery }}
            </q-chip>
            <q-chip
              v-if="muscleFilter !== 'all'"
              removable
              dense
              :color="getMuscleColor(muscleFilter)"
              text-color="white"
              @remove="muscleFilter = 'all'"
            >
              {{ getMuscleGroupLabel(muscleFilter) }}
            </q-chip>
            <q-chip
              v-if="levelFilter !== 'all'"
              removable
              dense
              :color="getLevelColor(levelFilter)"
              text-color="white"
              @remove="levelFilter = 'all'"
            >
              {{ getLevelLabel(levelFilter) }}
            </q-chip>
            <q-chip
              v-if="disciplineFilter !== 'all'"
              removable
              dense
              color="deep-orange"
              text-color="white"
              @remove="disciplineFilter = 'all'"
            >
              {{ getDisciplineLabel(disciplineFilter) }}
            </q-chip>
            <q-btn
              flat
              dense
              no-caps
              color="grey-6"
              label="Limpiar todo"
              size="sm"
              @click="clearAllFilters"
            />
          </div>
        </div>
      </div>

      <!-- Exercises Grid -->
      <div class="exercises-grid">
        <div v-if="loading" v-for="i in 8" :key="i" class="exercise-card skeleton">
          <q-skeleton type="text" class="bg-grey-8" width="80%" />
          <q-skeleton type="text" class="bg-grey-8" width="40%" />
          <div style="display: flex; gap: 8px;">
            <q-skeleton type="rect" class="bg-grey-8" width="80px" height="28px" />
            <q-skeleton type="rect" class="bg-grey-8" width="80px" height="28px" />
          </div>
          <q-skeleton type="text" class="bg-grey-8" width="50%" />
        </div>

        <div v-else-if="filteredExercises.length === 0" class="empty-state">
          <q-icon name="fitness_center" size="64px" color="grey-6" />
          <h3>No hay ejercicios</h3>
          <p>Crea tu primer ejercicio para empezar</p>
          <q-btn color="primary" icon="add" label="Crear Ejercicio" no-caps @click="openCreateDialog" />
        </div>

        <div v-for="exercise in paginatedExercises" :key="exercise.id" class="exercise-card">
          <!-- Header con nombre -->
          <div class="exercise-header" :class="exercise.level">
            <h3 class="exercise-name">{{ normalizeName(exercise.name) }}</h3>
            <p v-if="exercise.description" class="exercise-description">{{ exercise.description }}</p>
          </div>
          
          <!-- Acciones -->
          <div class="exercise-actions">
            <q-btn flat dense icon="play_circle" label="YouTube" color="grey-5" size="sm" no-caps @click="searchExercise(exercise, 'youtube')" />
            <q-btn flat dense icon="search" label="Google" color="grey-5" size="sm" no-caps @click="searchExercise(exercise, 'google')" />
            <q-btn flat dense icon="edit" label="Editar" color="primary" size="sm" no-caps @click="editExercise(exercise)" />
            <q-btn flat dense icon="delete" label="Eliminar" color="negative" size="sm" no-caps @click="confirmDelete(exercise)" />
          </div>
          
          <!-- Dificultad con fuegos -->
          <div class="exercise-difficulty">
            <div class="fire-row">
              <q-icon v-for="n in 3" :key="n" name="local_fire_department" 
                :color="n <= (exercise.difficultyRating || 1) ? getFireColor(exercise.level, true) : 'grey-7'" 
                size="20px" />
            </div>
            <span class="level-badge" :class="exercise.level">{{ getLevelLabel(exercise.level) }}</span>
          </div>
          
          <!-- Grupos musculares -->
          <div class="exercise-muscles">
            <div class="muscle-tag primary">
              <span>{{ getMuscleGroupLabel(exercise.primaryMuscleGroup) }}</span>
            </div>
            <div v-if="exercise.secondaryMuscleGroup" class="muscle-tag secondary">
              <span>{{ getMuscleGroupLabel(exercise.secondaryMuscleGroup) }}</span>
            </div>
          </div>
          
          <!-- Disciplinas -->
          <div v-if="exercise.disciplines?.length" class="exercise-disciplines">
            <div 
              v-for="discipline in exercise.disciplines" 
              :key="discipline"
              class="discipline-tag"
              :class="discipline"
            >
              {{ getDisciplineLabel(discipline) }}
            </div>
          </div>
          
          <!-- Equipamiento -->
          <div class="exercise-equipment">
            <q-icon :name="exercise.equipment ? 'sports_gymnastics' : 'block'" size="14px" color="grey-5" />
            <span>{{ exercise.equipment ? exercise.equipment.name : 'Sin equipamiento' }}</span>
          </div>
        </div>
        
        <!-- Pagination -->
        <div v-if="filteredExercises.length > 10" class="pagination-wrapper">
          <div class="pagination-row">
            <!-- Items per page (left) -->
            <div class="per-page-wrapper">
              <span class="per-page-label">Mostrar:</span>
              <div class="per-page-pills">
                <button
                  v-for="option in itemsPerPageOptions"
                  :key="option.value"
                  class="per-page-pill"
                  :class="{ 'active': itemsPerPage === option.value }"
                  @click="itemsPerPage = option.value"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>
            
            <!-- Page info (right) -->
            <span class="pagination-info">
              {{ filteredExercises.length }} ejercicios | Página {{ currentPage }} de {{ totalPages }}
            </span>
          </div>
          
          <!-- Pagination (bottom center) -->
          <q-pagination
            v-model="currentPage"
            :max="totalPages"
            :max-pages="6"
            boundary-numbers
            direction-links
            color="grey-6"
            active-color="primary"
          />
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
                  <q-select v-model="exerciseForm.secondaryMuscleGroup" :options="muscleGroupOptions" outlined dark dense 
                    emit-value map-options placeholder="Opcional" clearable />
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
                      <q-icon name="local_fire_department" :color="getFireColor(exerciseForm.level, n <= exerciseForm.difficultyRating)" size="24px" />
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
                  <q-input v-model="exerciseForm.media" outlined dark dense placeholder="https://youtube.com/watch?v=..." 
                    class="video-input" />
                  <q-btn v-if="exerciseForm.name" flat icon="search" color="primary" 
                    @click="searchExercise({ name: exerciseForm.name }, 'youtube')"
                    label="Buscar" no-caps />
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
                  <q-icon v-for="n in exerciseForm.difficultyRating" :key="n"
                    name="local_fire_department" :color="getFireColor(exerciseForm.level, true)" size="20px" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-card>
    </q-dialog>

    <!-- Delete Dialog -->
    <q-dialog v-model="deleteDialog" persistent>
      <q-card class="dialog-card delete-dialog">
        <q-card-section class="dialog-header">
          <div class="delete-icon">
            <q-icon name="warning" color="negative" size="32px" />
          </div>
          <h3 class="dialog-title">Eliminar Ejercicio</h3>
          <p class="dialog-subtitle">¿Estás seguro de que quieres eliminar <strong>{{ exerciseToDelete?.name }}</strong>?</p>
        </q-card-section>
        <q-card-section class="dialog-footer">
          <q-btn flat label="Cancelar" color="grey-6" v-close-popup />
          <q-btn label="Eliminar" color="negative" :loading="deleting" @click="deleteExercise" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { equipmentService, exerciseService } from '@/services'
import { computed, onMounted, ref, watch } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const exercises = ref([])
const searchQuery = ref('')
const muscleFilter = ref('all')
const levelFilter = ref('all')

const exerciseDialog = ref(false)
const deleteDialog = ref(false)
const isEditing = ref(false)
const exerciseToDelete = ref(null)

const exerciseForm = ref({
  name: '',
  primaryMuscleGroup: '',
  secondaryMuscleGroup: '',
  level: 'beginner',
  difficultyRating: 1, // 1-3 fuegos
  equipment: null,
  media: ''
})

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

const equipments = ref([])

// Paginación
const currentPage = ref(1)
const itemsPerPage = ref(10)

const itemsPerPageLabel = computed(() => {
  return `${itemsPerPage.value}`
})

// Disciplinas
const disciplineOptions = [
  { label: 'Todas', value: 'all', color: 'default' },
  { label: 'Calistenia', value: 'calisthenics', color: 'orange' },
  { label: 'CrossFit', value: 'crossfit', color: 'red' },
  { label: 'Fitness', value: 'fitness', color: 'blue' },
]

const disciplineFilter = ref('all')

const getDisciplineLabel = (discipline) => {
  const labels = {
    'calisthenics': 'Calistenia',
    'crossfit': 'CrossFit',
    'fitness': 'Fitness',
  }
  return labels[discipline] || discipline
}

const itemsPerPageOptions = [
  { label: '10', value: 10 },
  { label: '20', value: 20 },
  { label: '30', value: 30 },
  { label: '40', value: 40 },
  { label: '50', value: 50 }
]

// Opciones de filtros con colores
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

// Filtros activos
const hasActiveFilters = computed(() => {
  return searchQuery.value || muscleFilter.value !== 'all' || levelFilter.value !== 'all' || disciplineFilter.value !== 'all'
})

const getMuscleColor = (muscle) => {
  const colors = {
    'chest': 'orange',
    'back': 'blue',
    'legs': 'purple',
    'glutes': 'pink',
    'hamstrings': 'deep-purple',
    'calves': 'teal',
    'adductors': 'indigo',
    'shoulders': 'cyan',
    'biceps': 'green',
    'triceps': 'pink',
    'forearms': 'brown',
    'core': 'yellow',
    'hiit': 'red',
  }
  return colors[muscle] || 'grey'
}

const getLevelColor = (level) => {
  const colors = {
    'beginner': 'positive',
    'intermediate': 'warning',
    'expert': 'negative',
  }
  return colors[level] || 'grey'
}

const clearAllFilters = () => {
  searchQuery.value = ''
  muscleFilter.value = 'all'
  levelFilter.value = 'all'
  disciplineFilter.value = 'all'
}

const filteredExercises = computed(() => {
  let result = exercises.value

  // Filtro por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(ex =>
      ex.name?.toLowerCase().includes(query) ||
      ex.primaryMuscleGroup?.toLowerCase().includes(query)
    )
  }

  // Filtro por músculo
  if (muscleFilter.value !== 'all') {
    result = result.filter(ex => ex.primaryMuscleGroup === muscleFilter.value)
  }

  // Filtro por nivel
  if (levelFilter.value !== 'all') {
    result = result.filter(ex => ex.level === levelFilter.value)
  }

  // Filtro por disciplina
  if (disciplineFilter.value !== 'all') {
    result = result.filter(ex => 
      ex.disciplines?.includes(disciplineFilter.value)
    )
  }

  // Ordenar por dificultad (1 fuego primero, luego 2, luego 3)
  result = result.sort((a, b) => {
    const ratingA = a.difficultyRating || 1
    const ratingB = b.difficultyRating || 1
    return ratingA - ratingB
  })

  return result
})

// Ejercicios paginados
const paginatedExercises = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredExercises.value.slice(start, end)
})

// Total de páginas
const totalPages = computed(() => {
  return Math.ceil(filteredExercises.value.length / itemsPerPage.value)
})

const muscleGroupsCount = computed(() => {
  const groups = new Set(exercises.value.map(e => e.primaryMuscleGroup).filter(Boolean))
  return groups.size
})

const expertCount = computed(() => {
  return exercises.value.filter(e => e.level === 'expert').length
})

const fetchExercises = async () => {
  loading.value = true
  try {
    const response = await exerciseService.getAll()
    exercises.value = Array.isArray(response) ? response : (response.member || response['hydra:member'] || [])
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Error al cargar ejercicios',
      position: 'top'
    })
  } finally {
    loading.value = false
  }
}

const fetchEquipments = async () => {
  try {
    const response = await equipmentService.getAll()
    equipments.value = Array.isArray(response) ? response : (response.member || response['hydra:member'] || [])
  } catch (error) {
    console.error('Error al cargar equipamientos:', error)
  }
}

const equipmentOptions = computed(() => {
  return [{ id: null, name: 'Ninguno' }, ...equipments.value]
})

const getLevelLabel = (level) => {
  const labels = {
    'beginner': 'Principiante',
    'intermediate': 'Intermedio',
    'expert': 'Experto',
    'nolevel': 'Sin nivel'
  }
  return labels[level] || level
}

const normalizeName = (name) => {
  if (!name) return ''
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
}

const getFireColor = (level, isActive) => {
  if (!isActive) return 'grey-6'
  
  const colors = {
    'beginner': 'positive',      // Verde
    'intermediate': 'warning',   // Naranja/Amarillo
    'expert': 'negative'         // Rojo
  }
  return colors[level] || 'primary'
}

const renderFires = (level, rating) => {
  const fires = []
  for (let i = 0; i < 3; i++) {
    fires.push({
      active: i < rating,
      color: getFireColor(level, i < rating)
    })
  }
  return fires
}

const getMuscleGroupLabel = (group) => {
  const labels = {
    'chest': 'Pecho',
    'back': 'Espalda',
    'legs': 'Piernas',
    'glutes': 'Glúteos',
    'hamstrings': 'Isquiotibiales',
    'calves': 'Gemelos',
    'adductors': 'Aductores',
    'shoulders': 'Hombros',
    'biceps': 'Bíceps',
    'triceps': 'Tríceps',
    'forearms': 'Antebrazos',
    'core': 'Core',
    'hiit': 'HIIT/Cardio',
    'none': 'Ninguno'
  }
  return labels[group] || group
}

const truncateText = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

const openCreateDialog = () => {
  isEditing.value = false
  exerciseForm.value = {
    name: '',
    primaryMuscleGroup: '',
    secondaryMuscleGroup: '',
    level: 'beginner',
    difficultyRating: 1,
    equipment: null,
    media: ''
  }
  exerciseDialog.value = true
}

const editExercise = (exercise) => {
  isEditing.value = true
  exerciseForm.value = {
    id: exercise.id,
    name: exercise.name,
    primaryMuscleGroup: exercise.primaryMuscleGroup,
    secondaryMuscleGroup: exercise.secondaryMuscleGroup || '',
    level: exercise.level,
    equipment: exercise.equipment?.id || null,
    media: exercise.media || ''
  }
  exerciseDialog.value = true
}

const viewExercise = (exercise) => {
  // TODO: Open detail view or modal
  editExercise(exercise)
}

const searchExercise = (exercise, platform) => {
  const query = encodeURIComponent(`${exercise.name} exercise tutorial`)
  let url = ''
  
  if (platform === 'youtube') {
    url = `https://www.youtube.com/results?search_query=${query}`
  } else {
    url = `https://www.google.com/search?q=${query}&tbm=vid` // tbm=vid busca videos
  }
  
  window.open(url, '_blank')
}

const saveExercise = async () => {
  if (!exerciseForm.value.name) {
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
      await exerciseService.update(exerciseForm.value.id, exerciseForm.value)
      $q.notify({
        type: 'positive',
        message: 'Ejercicio actualizado',
        position: 'top'
      })
    } else {
      await exerciseService.create(exerciseForm.value)
      $q.notify({
        type: 'positive',
        message: 'Ejercicio creado',
        position: 'top'
      })
    }
    exerciseDialog.value = false
    fetchExercises()
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

const confirmDelete = (exercise) => {
  exerciseToDelete.value = exercise
  deleteDialog.value = true
}

const deleteExercise = async () => {
  deleting.value = true
  try {
    await exerciseService.delete(exerciseToDelete.value.id)
    $q.notify({
      type: 'positive',
      message: 'Ejercicio eliminado',
      position: 'top'
    })
    deleteDialog.value = false
    fetchExercises()
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

// Resetear página cuando cambian los filtros
watch([searchQuery, muscleFilter, levelFilter, disciplineFilter], () => {
  currentPage.value = 1
})

// Resetear página cuando cambia items por página
watch(itemsPerPage, () => {
  currentPage.value = 1
})

onMounted(() => {
  fetchExercises()
  fetchEquipments()
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

/* Filters */
/* Modern Filters Container */
.filters-container {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 28px;
  margin-bottom: 24px;
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

/* Modern Search Bar */
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

/* Filter Groups Modern */
.filter-groups-modern {
  display: flex;
  flex-direction: column;
  gap: 24px;
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

.filter-category-label .q-icon {
  opacity: 0.7;
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

.filter-pill.level {
  display: flex;
  align-items: center;
  gap: 6px;
}

.filter-pill.level .q-icon {
  opacity: 0.8;
}

/* Level specific colors */
.filter-pill.level.beginner.active {
  background: linear-gradient(135deg, #3fb950 0%, #2ea043 100%);
  box-shadow: 0 6px 20px rgba(63, 185, 80, 0.5);
}

.filter-pill.level.intermediate.active {
  background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
  box-shadow: 0 6px 20px rgba(255, 193, 7, 0.5);
}

.filter-pill.level.expert.active {
  background: linear-gradient(135deg, #f85149 0%, #da3633 100%);
  box-shadow: 0 6px 20px rgba(248, 81, 73, 0.5);
}

/* Muscle specific colors */
.filter-pill.orange.active { background: linear-gradient(135deg, #ff8f38 0%, #ff6b35 100%); }
.filter-pill.blue.active { background: linear-gradient(135deg, #58a6ff 0%, #1f6feb 100%); box-shadow: 0 6px 20px rgba(88, 166, 255, 0.5); }
.filter-pill.purple.active { background: linear-gradient(135deg, #a371f7 0%, #8957e5 100%); box-shadow: 0 6px 20px rgba(163, 113, 247, 0.5); }
.filter-pill.cyan.active { background: linear-gradient(135deg, #39c5cf 0%, #22a6b3 100%); box-shadow: 0 6px 20px rgba(57, 197, 207, 0.5); }
.filter-pill.green.active { background: linear-gradient(135deg, #3fb950 0%, #2ea043 100%); box-shadow: 0 6px 20px rgba(63, 185, 80, 0.5); }
.filter-pill.pink.active { background: linear-gradient(135deg, #f778ba 0%, #db61a2 100%); box-shadow: 0 6px 20px rgba(247, 120, 186, 0.5); }
.filter-pill.yellow.active { background: linear-gradient(135deg, #ffd700 0%, #ffc107 100%); box-shadow: 0 6px 20px rgba(255, 215, 0, 0.5); }

/* Discipline pills */
.filter-pill.discipline.red.active { background: linear-gradient(135deg, #f85149 0%, #da3633 100%); box-shadow: 0 6px 20px rgba(248, 81, 73, 0.5); }

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
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
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
}

.exercise-card:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 143, 56, 0.3);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
  background: rgba(255, 255, 255, 0.05);
}

/* Header - Nombre y acciones */
.exercise-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.exercise-name {
  font-size: 1.4rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  line-height: 1.2;
  flex: 1;
  letter-spacing: -0.3px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.exercise-description {
  font-size: 0.9rem;
  color: #8b949e;
  line-height: 1.5;
  margin: 8px 0 0 0;
}

.exercise-header {
  position: relative;
  padding-top: 12px;
}

.exercise-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 70%;
  height: 4px;
  border-radius: 2px;
  transition: all 0.3s ease;
}

/* Colores de la línea según nivel */
.exercise-header.beginner::before {
  background: #3fb950;
}

.exercise-header.intermediate::before {
  background: #ffc107;
}

.exercise-header.expert::before {
  background: #f85149;
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

.pagination-row .per-page-wrapper {
  flex-shrink: 0;
}

.pagination-row .pagination-info {
  flex-shrink: 0;
  text-align: right;
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
  min-width: 36px;
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
  text-align: center;
  flex: 1;
}

.exercise-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
  margin-top: -8px;
}

.exercise-card:hover .exercise-actions {
  opacity: 1;
}

.exercise-actions .q-btn {
  font-size: 0.75rem;
  font-weight: 500;
}

/* Dificultad - Fuegos y nivel */
.exercise-difficulty {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.fire-row {
  display: flex;
  gap: 2px;
}

.level-badge {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 4px 10px;
  border-radius: 20px;
}

.level-badge.beginner {
  background: rgba(63, 185, 80, 0.2);
  color: #3fb950;
}

.level-badge.intermediate {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
}

.level-badge.expert {
  background: rgba(248, 81, 73, 0.2);
  color: #f85149;
}

/* Grupos musculares */
.exercise-muscles {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.muscle-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.85rem;
}

.muscle-tag.primary {
  background: rgba(255, 143, 56, 0.15);
  color: #ff8f38;
  border: 1px solid rgba(255, 143, 56, 0.3);
}

.muscle-tag.secondary {
  background: rgba(139, 148, 158, 0.1);
  color: #8b949e;
  border: 1px solid rgba(139, 148, 158, 0.2);
}

/* Disciplinas */
.exercise-disciplines {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.discipline-tag {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.discipline-tag.calisthenics {
  background: rgba(255, 143, 56, 0.2);
  color: #ff8f38;
  border: 1px solid rgba(255, 143, 56, 0.3);
}

.discipline-tag.crossfit {
  background: rgba(248, 81, 73, 0.2);
  color: #f85149;
  border: 1px solid rgba(248, 81, 73, 0.3);
}

.discipline-tag.fitness {
  background: rgba(88, 166, 255, 0.2);
  color: #58a6ff;
  border: 1px solid rgba(88, 166, 255, 0.3);
}

/* Equipamiento */
.exercise-equipment {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #8b949e;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.exercise-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 8px 0;
}

.exercise-description {
  font-size: 0.9rem;
  color: #8b949e;
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.exercise-meta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.meta-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  font-size: 0.8rem;
  color: #c9d1d9;
}

/* Skeleton */
.exercise-card.skeleton {
  pointer-events: none;
  gap: 12px;
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

/* Exercise Dialog */
.exercise-dialog {
  display: flex;
  width: 100vw;
  height: 100vh;
  background: #0f1419;
  border-radius: 0;
}

.dialog-sidebar {
  width: 450px;
  background: #1a1f2e;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
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
  margin-bottom: 32px;
}

/* Fire Rating */
.fire-rating {
  display: flex;
  gap: 4px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.fire-rating .q-btn {
  opacity: 0.3;
  transition: all 0.2s ease;
}

.fire-rating .q-btn.fire-active {
  opacity: 1;
  transform: scale(1.1);
}

.fire-rating .q-btn:hover {
  opacity: 0.8;
}

.preview-fires {
  display: flex;
  gap: 4px;
  margin-top: 8px;
}

.video-input-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.video-input {
  flex: 1;
}

.video-help {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  font-size: 0.8rem;
  color: #8b949e;
}

.video-help span {
  line-height: 1.4;
}

.section-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: #8b949e;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 16px;
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

.sidebar-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.dialog-preview {
  flex: 1;
  background: linear-gradient(135deg, #0f1419 0%, #1a1f2e 100%);
  padding: 40px;
  display: flex;
  flex-direction: column;
}

.preview-header {
  margin-bottom: 32px;
}

.preview-header h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #8b949e;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0;
}

.preview-content {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
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
  height: 220px;
  overflow: hidden;
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
  background: linear-gradient(135deg, #1a1f2e 0%, #2d333b 100%);
}

.preview-info {
  padding: 24px;
}

.preview-info h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 12px 0;
}

.preview-info p {
  font-size: 0.95rem;
  color: #8b949e;
  margin: 0 0 20px 0;
  line-height: 1.6;
}

.preview-tags {
  display: flex;
  gap: 8px;
}

.preview-tag {
  padding: 6px 14px;
  background: rgba(255, 143, 56, 0.15);
  border-radius: 20px;
  font-size: 0.8rem;
  color: #ff8f38;
  font-weight: 500;
}

.preview-tag.beginner {
  background: rgba(63, 185, 80, 0.15);
  color: #3fb950;
}

.preview-tag.intermediate {
  background: rgba(255, 193, 7, 0.15);
  color: #ffc107;
}

.preview-tag.advanced {
  background: rgba(248, 81, 73, 0.15);
  color: #f85149;
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

  .filters-container {
    padding: 20px 16px;
  }

  .search-box-modern .search-input {
    padding: 16px 48px 16px 52px;
    font-size: 1rem;
  }

  .filter-pill {
    padding: 10px 18px;
    font-size: 0.9rem;
  }

  .filter-pills {
    gap: 8px;
  }

  .pagination-row {
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .per-page-wrapper {
    order: 1;
  }

  .pagination-info {
    order: 2;
    text-align: center;
  }

  .dialog-sidebar {
    width: 100%;
  }

  .dialog-preview {
    display: none;
  }
}
</style>
