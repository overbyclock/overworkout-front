<template>
  <q-page class="page-container">
    <div class="page-content">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Programas de Entrenamiento</h1>
          <p class="page-subtitle">Gestiona los programas disponibles para los usuarios</p>
        </div>
        <q-btn color="primary" icon="add" label="Nuevo Programa" class="action-btn" no-caps @click="openCreateDialog" />
      </div>

      <!-- Stats Row -->
      <div class="stats-row">
        <div class="stat-mini">
          <div class="stat-mini-icon" style="background: rgba(255, 143, 56, 0.2)">
            <q-icon name="school" color="primary" size="20px" />
          </div>
          <div class="stat-mini-content">
            <div class="stat-mini-value">{{ programs.length }}</div>
            <div class="stat-mini-label">Total Programas</div>
          </div>
        </div>
        <div class="stat-mini">
          <div class="stat-mini-icon" style="background: rgba(63, 185, 80, 0.2)">
            <q-icon name="check_circle" color="positive" size="20px" />
          </div>
          <div class="stat-mini-content">
            <div class="stat-mini-value">{{ activePrograms }}</div>
            <div class="stat-mini-label">Activos</div>
          </div>
        </div>
        <div class="stat-mini">
          <div class="stat-mini-icon" style="background: rgba(147, 112, 219, 0.2)">
            <q-icon name="people" color="accent" size="20px" />
          </div>
          <div class="stat-mini-content">
            <div class="stat-mini-value">{{ totalUsers }}</div>
            <div class="stat-mini-label">Usuarios totales</div>
          </div>
        </div>
        <div class="stat-mini">
          <div class="stat-mini-icon" style="background: rgba(56, 178, 172, 0.2)">
            <q-icon name="stairs" color="teal" size="20px" />
          </div>
          <div class="stat-mini-content">
            <div class="stat-mini-value">{{ totalLevels }}</div>
            <div class="stat-mini-label">Niveles totales</div>
          </div>
        </div>
      </div>

      <!-- Modern Filters -->
      <div class="filters-container">
        <div class="search-wrapper">
          <div class="search-box-modern">
            <q-icon name="search" class="search-icon" size="22px" />
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Buscar programas..." 
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

        <div class="filter-groups-modern">
          <!-- Status Filter -->
          <div class="filter-category">
            <span class="filter-category-label">
              <q-icon name="toggle_on" size="16px" />
              Estado
            </span>
            <div class="filter-pills">
              <button 
                v-for="status in statusOptions" 
                :key="status.value"
                class="filter-pill"
                :class="{ 'active': statusFilter === status.value, [status.color]: true }"
                @click="statusFilter = status.value"
              >
                {{ status.label }}
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
                v-for="disc in disciplineOptions" 
                :key="disc.value"
                class="filter-pill"
                :class="{ 'active': disciplineFilter === disc.value }"
                @click="disciplineFilter = disc.value"
              >
                {{ disc.emoji }} {{ disc.label }}
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
              v-if="statusFilter !== 'all'"
              removable
              dense
              :color="getStatusColor(statusFilter)"
              text-color="white"
              @remove="statusFilter = 'all'"
            >
              {{ getStatusLabel(statusFilter) }}
            </q-chip>
            <q-chip
              v-if="disciplineFilter !== 'all'"
              removable
              dense
              color="teal"
              text-color="white"
              @remove="disciplineFilter = 'all'"
            >
              {{ getDisciplineLabel(disciplineFilter) }}
            </q-chip>
            <q-btn flat dense size="sm" color="grey-6" label="Limpiar todo" @click="clearFilters" />
          </div>
        </div>
      </div>

      <!-- Results Count -->
      <div class="results-bar">
        <span class="results-count">{{ filteredPrograms.length }} programa{{ filteredPrograms.length !== 1 ? 's' : '' }} encontrado{{ filteredPrograms.length !== 1 ? 's' : '' }}</span>
        <div class="view-toggle">
          <q-btn flat round dense :color="viewMode === 'grid' ? 'primary' : 'grey-6'" icon="grid_view" @click="viewMode = 'grid'">
            <q-tooltip>Grid</q-tooltip>
          </q-btn>
          <q-btn flat round dense :color="viewMode === 'list' ? 'primary' : 'grey-6'" icon="view_list" @click="viewMode = 'list'">
            <q-tooltip>Lista</q-tooltip>
          </q-btn>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" :class="viewMode === 'grid' ? 'programs-grid' : 'programs-list'">
        <div v-for="i in 4" :key="i" class="program-card skeleton">
          <q-skeleton type="rect" :height="viewMode === 'grid' ? '180px' : '100px'" class="bg-grey-8" />
          <q-skeleton type="text" class="bg-grey-8 q-mt-md" width="60%" />
          <q-skeleton type="text" class="bg-grey-8" width="40%" />
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredPrograms.length === 0" class="empty-state">
        <q-icon name="school" size="80px" color="grey-6" />
        <h3>{{ hasActiveFilters ? 'No se encontraron programas' : 'No hay programas' }}</h3>
        <p>{{ hasActiveFilters ? 'Prueba con otros filtros de búsqueda' : 'Crea tu primer programa de entrenamiento' }}</p>
        <q-btn v-if="hasActiveFilters" flat color="primary" label="Limpiar filtros" @click="clearFilters" />
        <q-btn v-else color="primary" icon="add" label="Crear Programa" no-caps @click="openCreateDialog" />
      </div>

      <!-- Programs Grid View -->
      <div v-else-if="viewMode === 'grid'" class="programs-grid">
        <div 
          v-for="program in filteredPrograms" 
          :key="program.id" 
          class="program-card"
          :class="{ 'inactive': !program.isActive }"
          @click="viewProgram(program)"
        >
          <!-- Card Header with Image/Gradient -->
          <div class="card-header" :style="{ background: getProgramGradient(program) }">
            <div class="program-status">
              <q-badge :color="program.isActive ? 'positive' : 'grey'" class="status-badge">
                {{ program.isActive ? 'Activo' : 'Inactivo' }}
              </q-badge>
            </div>
            <div class="program-icon">{{ getDisciplineIcon(program.discipline) }}</div>
          </div>

          <!-- Card Content -->
          <div class="card-content">
            <div class="program-header-row">
              <h3 class="program-name">{{ program.name }}</h3>
              <q-btn flat round dense icon="more_vert" color="grey-5" @click.stop>
                <q-menu dark>
                  <q-list style="min-width: 180px; background: #212529;">
                    <q-item clickable v-close-popup @click="viewProgram(program)">
                      <q-item-section avatar><q-icon name="visibility" /></q-item-section>
                      <q-item-section>Ver detalle</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="editProgram(program)">
                      <q-item-section avatar><q-icon name="edit" /></q-item-section>
                      <q-item-section>Editar</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="duplicateProgram(program)">
                      <q-item-section avatar><q-icon name="content_copy" /></q-item-section>
                      <q-item-section>Duplicar</q-item-section>
                    </q-item>
                    <q-separator dark />
                    <q-item clickable v-close-popup @click="toggleProgramStatus(program)" :class="program.isActive ? 'text-warning' : 'text-positive'">
                      <q-item-section avatar><q-icon :name="program.isActive ? 'pause' : 'play_arrow'" /></q-item-section>
                      <q-item-section>{{ program.isActive ? 'Desactivar' : 'Activar' }}</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
            <p class="program-description">{{ program.description }}</p>
            
            <div class="program-meta">
              <div class="meta-item">
                <q-icon name="stairs" size="18px" />
                <span>{{ program.totalLevels }} niveles</span>
              </div>
              <div class="meta-item">
                <q-icon name="schedule" size="18px" />
                <span>{{ program.estimatedDurationWeeks }} sem</span>
              </div>
              <div class="meta-item">
                <q-icon name="people" size="18px" />
                <span>{{ program.usersCount }}</span>
              </div>
            </div>
          </div>

          <!-- Card Footer -->
          <div class="card-footer">
            <div class="discipline-tag">
              {{ getDisciplineLabel(program.discipline) }}
            </div>
            <q-btn flat dense color="primary" icon="arrow_forward" label="Ver" no-caps @click.stop="viewProgram(program)" />
          </div>
        </div>
      </div>

      <!-- Programs List View -->
      <div v-else class="programs-list">
        <div 
          v-for="program in filteredPrograms" 
          :key="program.id" 
          class="program-list-item"
          :class="{ 'inactive': !program.isActive }"
          @click="viewProgram(program)"
        >
          <div class="list-icon" :style="{ background: getProgramGradient(program) }">
            {{ getDisciplineIcon(program.discipline) }}
          </div>
          <div class="list-content">
            <div class="list-main">
              <h3 class="list-name">{{ program.name }}</h3>
              <p class="list-description">{{ program.description }}</p>
              <div class="list-tags">
                <q-badge :color="program.isActive ? 'positive' : 'grey'">{{ program.isActive ? 'Activo' : 'Inactivo' }}</q-badge>
                <span class="tag">{{ program.totalLevels }} niveles</span>
                <span class="tag">{{ program.estimatedDurationWeeks }} semanas</span>
                <span class="tag">{{ program.usersCount }} usuarios</span>
              </div>
            </div>
            <div class="list-actions">
              <q-btn flat round icon="visibility" color="primary" @click.stop="viewProgram(program)">
                <q-tooltip>Ver detalle</q-tooltip>
              </q-btn>
              <q-btn flat round icon="edit" color="grey-5" @click.stop="editProgram(program)">
                <q-tooltip>Editar</q-tooltip>
              </q-btn>
              <q-btn flat round icon="more_vert" color="grey-5" @click.stop>
                <q-menu dark>
                  <q-list style="min-width: 180px; background: #212529;">
                    <q-item clickable v-close-popup @click="duplicateProgram(program)">
                      <q-item-section avatar><q-icon name="content_copy" /></q-item-section>
                      <q-item-section>Duplicar</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="toggleProgramStatus(program)" :class="program.isActive ? 'text-warning' : 'text-positive'">
                      <q-item-section avatar><q-icon :name="program.isActive ? 'pause' : 'play_arrow'" /></q-item-section>
                      <q-item-section>{{ program.isActive ? 'Desactivar' : 'Activar' }}</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Dialog -->
    <q-dialog v-model="showCreateDialog" persistent>
      <q-card class="create-dialog">
        <q-card-section class="dialog-header">
          <h3>Crear Nuevo Programa</h3>
          <q-btn flat round icon="close" v-close-popup />
        </q-card-section>

        <q-card-section class="dialog-content">
          <q-input v-model="newProgram.name" label="Nombre del programa *" outlined dense dark class="q-mb-md" />
          <q-input v-model="newProgram.slug" label="Slug (URL) *" outlined dense dark class="q-mb-md" hint="ej: calistenia-master" />
          <q-select v-model="newProgram.discipline" :options="disciplineSelectOptions" label="Disciplina *" outlined dense dark class="q-mb-md" emit-value map-options />
          <q-input v-model="newProgram.description" label="Descripción" type="textarea" outlined dense dark class="q-mb-md" />
          <q-input v-model.number="newProgram.totalLevels" label="Número de niveles" type="number" outlined dense dark class="q-mb-md" />
          <q-input v-model.number="newProgram.estimatedDurationWeeks" label="Duración estimada (semanas)" type="number" outlined dense dark />
        </q-card-section>

        <q-card-section class="dialog-footer">
          <q-btn flat label="Cancelar" color="grey-6" v-close-popup />
          <q-btn color="primary" label="Crear Programa" :loading="saving" @click="saveProgram" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()

const loading = ref(false)
const programs = ref([])
const showCreateDialog = ref(false)
const saving = ref(false)
const searchQuery = ref('')
const statusFilter = ref('all')
const disciplineFilter = ref('all')
const viewMode = ref('grid')

const statusOptions = [
  { label: 'Todos', value: 'all', color: 'grey' },
  { label: 'Activos', value: 'active', color: 'positive' },
  { label: 'Inactivos', value: 'inactive', color: 'grey' },
]

const disciplineOptions = [
  { label: 'Todos', value: 'all' },
  { label: 'Calistenia', value: 'calisthenics', emoji: '🤸' },
  { label: 'CrossFit', value: 'crossfit', emoji: '🏋️' },
  { label: 'Fitness', value: 'fitness', emoji: '💪' },
  { label: 'Powerlifting', value: 'powerlifting', emoji: '🏆' },
]

const disciplineSelectOptions = [
  { label: 'Calistenia', value: 'calisthenics' },
  { label: 'CrossFit', value: 'crossfit' },
  { label: 'Fitness', value: 'fitness' },
  { label: 'Powerlifting', value: 'powerlifting' },
]

const newProgram = ref({
  name: '',
  slug: '',
  discipline: 'calisthenics',
  description: '',
  totalLevels: 12,
  estimatedDurationWeeks: 144
})

const hasActiveFilters = computed(() => {
  return searchQuery.value || statusFilter.value !== 'all' || disciplineFilter.value !== 'all'
})

const filteredPrograms = computed(() => {
  let result = programs.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.description.toLowerCase().includes(query) ||
      getDisciplineLabel(p.discipline).toLowerCase().includes(query)
    )
  }

  // Status filter
  if (statusFilter.value === 'active') {
    result = result.filter(p => p.isActive)
  } else if (statusFilter.value === 'inactive') {
    result = result.filter(p => !p.isActive)
  }

  // Discipline filter
  if (disciplineFilter.value !== 'all') {
    result = result.filter(p => p.discipline === disciplineFilter.value)
  }

  return result
})

const activePrograms = computed(() => programs.value.filter(p => p.isActive).length)
const totalUsers = computed(() => programs.value.reduce((sum, p) => sum + (p.usersCount || 0), 0))
const totalLevels = computed(() => programs.value.reduce((sum, p) => sum + (p.totalLevels || 0), 0))

const getProgramGradient = (program) => {
  const colors = {
    'calisthenics': 'linear-gradient(135deg, #ff8f38 0%, #ff6b6b 100%)',
    'crossfit': 'linear-gradient(135deg, #38b2ac 0%, #4299e1 100%)',
    'fitness': 'linear-gradient(135deg, #9f7aea 0%, #ed64a6 100%)',
    'powerlifting': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  }
  return colors[program.discipline] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
}

const getDisciplineIcon = (discipline) => {
  const icons = {
    'calisthenics': '🤸',
    'crossfit': '🏋️',
    'fitness': '💪',
    'powerlifting': '🏆',
  }
  return icons[discipline] || '🎯'
}

const getDisciplineLabel = (discipline) => {
  const option = disciplineOptions.find(d => d.value === discipline)
  return option ? option.label : discipline
}

const getStatusColor = (status) => {
  const option = statusOptions.find(s => s.value === status)
  return option ? option.color : 'grey'
}

const getStatusLabel = (status) => {
  const option = statusOptions.find(s => s.value === status)
  return option ? option.label : status
}

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = 'all'
  disciplineFilter.value = 'all'
}

const fetchPrograms = async () => {
  loading.value = true
  try {
    // Aquí iría la llamada API real
    // Simulamos datos con múltiples programas
    programs.value = [
      {
        id: 1,
        name: 'Calistenia Master',
        slug: 'calisthenia-master',
        description: 'Programa completo de calistenia desde cero hasta nivel experto. 12 niveles progresivos con evaluaciones y desbloqueo de skills.',
        discipline: 'calisthenics',
        totalLevels: 12,
        estimatedDurationWeeks: 144,
        isActive: true,
        usersCount: 156,
      },
      {
        id: 2,
        name: 'CrossFit Fundamentals',
        slug: 'crossfit-fundamentals',
        description: 'Introducción al CrossFit con movimientos olímpicos y WODs progresivos. Ideal para principiantes.',
        discipline: 'crossfit',
        totalLevels: 8,
        estimatedDurationWeeks: 96,
        isActive: true,
        usersCount: 89,
      },
      {
        id: 3,
        name: 'Powerlifting 101',
        slug: 'powerlifting-101',
        description: 'Domina los tres levantamientos: squat, bench press y deadlift. Progresión fuerza máxima.',
        discipline: 'powerlifting',
        totalLevels: 6,
        estimatedDurationWeeks: 72,
        isActive: false,
        usersCount: 0,
      },
      {
        id: 4,
        name: 'Fitness General',
        slug: 'fitness-general',
        description: 'Entrenamiento funcional para mejorar la condición física general y perder peso.',
        discipline: 'fitness',
        totalLevels: 10,
        estimatedDurationWeeks: 120,
        isActive: true,
        usersCount: 234,
      },
    ]
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Error al cargar programas' })
  } finally {
    loading.value = false
  }
}

const viewProgram = (program) => {
  router.push(`/admin/training-programs/${program.id}`)
}

const editProgram = (program) => {
  router.push(`/admin/training-programs/${program.id}/edit`)
}

const duplicateProgram = (program) => {
  $q.notify({ type: 'positive', message: `Programa "${program.name}" duplicado` })
}

const toggleProgramStatus = (program) => {
  program.isActive = !program.isActive
  $q.notify({ 
    type: program.isActive ? 'positive' : 'warning', 
    message: `Programa "${program.name}" ${program.isActive ? 'activado' : 'desactivado'}` 
  })
}

const openCreateDialog = () => {
  showCreateDialog.value = true
}

const saveProgram = async () => {
  saving.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    $q.notify({ type: 'positive', message: 'Programa creado correctamente' })
    showCreateDialog.value = false
    fetchPrograms()
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Error al crear programa' })
  } finally {
    saving.value = false
  }
}

onMounted(fetchPrograms)
</script>

<style scoped>
/* Stats */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-mini {
  background: linear-gradient(135deg, #1c2128 0%, #161b22 100%);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
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
  font-size: 24px;
  font-weight: 800;
  color: #fff;
  line-height: 1;
}

.stat-mini-label {
  font-size: 13px;
  color: #8b949e;
  margin-top: 4px;
}

/* Filters - Same as EquipmentsView */
.filters-container {
  background: linear-gradient(135deg, #1c2128 0%, #161b22 100%);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.search-wrapper {
  margin-bottom: 20px;
}

.search-box-modern {
  position: relative;
  display: flex;
  align-items: center;
  background: #0d1117;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 4px;
  transition: all 0.3s;
}

.search-box-modern:focus-within {
  border-color: #ff8f38;
}

.search-icon {
  color: #8b949e;
  margin-left: 16px;
  margin-right: 12px;
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 15px;
  padding: 12px 8px;
  outline: none;
}

.search-input::placeholder {
  color: #6e7681;
}

.clear-search {
  color: #8b949e;
  margin-right: 8px;
}

.filter-groups-modern {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.filter-category {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.filter-category-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #8b949e;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  min-width: 100px;
  padding-top: 8px;
}

.filter-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  flex: 1;
}

.filter-pill {
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: #0d1117;
  color: #8b949e;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-pill:hover {
  border-color: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.filter-pill.active {
  background: #ff8f38;
  color: #0d1117;
  border-color: #ff8f38;
  font-weight: 600;
}

.filter-pill.active.positive {
  background: #3fb950;
  border-color: #3fb950;
  color: #fff;
}

.filter-pill.active.grey {
  background: #6e7681;
  border-color: #6e7681;
  color: #fff;
}

.active-filters {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.active-filters-label {
  font-size: 13px;
  color: #8b949e;
}

.active-filter-chips {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

/* Results Bar */
.results-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.results-count {
  font-size: 14px;
  color: #8b949e;
}

.view-toggle {
  display: flex;
  gap: 4px;
}

/* Programs Grid */
.programs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 20px;
}

.program-card {
  background: linear-gradient(135deg, #1c2128 0%, #161b22 100%);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
}

.program-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  border-color: rgba(255, 143, 56, 0.3);
}

.program-card.inactive {
  opacity: 0.7;
}

.card-header {
  height: 120px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.program-status {
  position: absolute;
  top: 12px;
  right: 12px;
}

.status-badge {
  font-weight: 600;
  padding: 4px 10px;
  font-size: 11px;
}

.program-icon {
  font-size: 56px;
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
}

.card-content {
  padding: 20px;
}

.program-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 8px;
}

.program-name {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin: 0;
  flex: 1;
}

.program-description {
  font-size: 14px;
  color: #8b949e;
  line-height: 1.5;
  margin: 0 0 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.program-meta {
  display: flex;
  gap: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #8b949e;
  font-size: 13px;
}

.meta-item q-icon {
  color: #ff8f38;
}

.card-footer {
  padding: 16px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.discipline-tag {
  background: rgba(255, 143, 56, 0.1);
  color: #ff8f38;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

/* Programs List View */
.programs-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.program-list-item {
  display: flex;
  align-items: center;
  gap: 20px;
  background: linear-gradient(135deg, #1c2128 0%, #161b22 100%);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
  transition: all 0.3s;
}

.program-list-item:hover {
  border-color: rgba(255, 143, 56, 0.3);
}

.program-list-item.inactive {
  opacity: 0.7;
}

.list-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  flex-shrink: 0;
}

.list-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.list-main {
  flex: 1;
}

.list-name {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 6px;
}

.list-description {
  font-size: 14px;
  color: #8b949e;
  margin: 0 0 12px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.list-tags {
  display: flex;
  gap: 12px;
  align-items: center;
}

.list-tags .tag {
  font-size: 13px;
  color: #8b949e;
}

.list-actions {
  display: flex;
  gap: 4px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #8b949e;
  background: linear-gradient(135deg, #1c2128 0%, #161b22 100%);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.empty-state h3 {
  color: #fff;
  margin: 20px 0 8px;
  font-size: 24px;
}

.empty-state p {
  margin: 0 0 24px;
}

/* Dialog Styles */
.create-dialog {
  background: linear-gradient(135deg, #1c2128 0%, #161b22 100%);
  min-width: 500px;
  border-radius: 20px;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.dialog-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #fff;
}

.dialog-content {
  padding: 24px;
}

.dialog-footer {
  padding: 16px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* Skeleton */
.program-card.skeleton {
  padding: 0;
}

@media (max-width: 1024px) {
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .programs-grid {
    grid-template-columns: 1fr;
  }
  
  .list-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .list-actions {
    width: 100%;
    justify-content: flex-end;
  }
  
  .filter-category {
    flex-direction: column;
    gap: 12px;
  }
  
  .create-dialog {
    min-width: auto;
    width: 90vw;
  }
}
</style>
