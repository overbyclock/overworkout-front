<template>
  <q-page class="page-container">
    <div class="page-content">
      <!-- Header -->
      <PageHeader
        title="Programas de Entrenamiento"
        subtitle="Gestiona los programas disponibles para los usuarios"
        action-label="Nuevo Programa"
        @action="openCreateDialog"
      />

      <!-- Stats -->
      <StatsCards :stats="stats" />

      <!-- Filters -->
      <div class="filters-container">
        <div class="search-wrapper">
          <div class="search-box-modern">
            <q-icon name="search" class="search-icon" size="22px" />
            <input v-model="searchQuery" type="text" placeholder="Buscar programas..." class="search-input">
            <q-btn v-if="searchQuery" flat round dense icon="close" size="sm" class="clear-search"
              @click="searchQuery = ''" />
          </div>
        </div>

        <div class="filter-groups-modern">
          <FilterPills v-model="statusFilter" label="Estado" icon="toggle_on" :options="statusOptions" />
          <FilterPills v-model="disciplineFilter" label="Disciplina" icon="sports" :options="disciplineFilterOptions" />
        </div>

        <div v-if="hasActiveFilters" class="active-filters">
          <span class="active-filters-label">Filtros activos:</span>
          <div class="active-filter-chips">
            <q-chip v-if="searchQuery" removable dense color="primary" text-color="dark" @remove="searchQuery = ''">
              <q-icon name="search" size="14px" left /> {{ searchQuery }}
            </q-chip>
            <q-chip v-if="statusFilter !== 'all'" removable dense :color="getStatusColor(statusFilter)"
              text-color="white" @remove="statusFilter = 'all'">
              {{ getStatusLabel(statusFilter) }}
            </q-chip>
            <q-chip v-if="disciplineFilter !== 'all'" removable dense color="teal" text-color="white"
              @remove="disciplineFilter = 'all'">
              {{ getDisciplineLabel(disciplineFilter) }}
            </q-chip>
            <q-btn flat dense no-caps color="grey-6" label="Limpiar todo" size="sm" @click="clearFilters" />
          </div>
        </div>
      </div>

      <!-- View Toggle -->
      <div class="view-toggle-bar">
        <q-btn flat dense :color="viewMode === 'grid' ? 'primary' : 'grey-6'" icon="grid_view" label="Cuadrícula"
          no-caps @click="viewMode = 'grid'" />
        <q-btn flat dense :color="viewMode === 'list' ? 'primary' : 'grey-6'" icon="view_list" label="Lista" no-caps
          @click="viewMode = 'list'" />
      </div>

      <!-- Programs Grid -->
      <div v-if="viewMode === 'grid'" class="programs-grid">
        <template v-if="loading">
          <div v-for="i in 4" :key="`skeleton-${i}`" class="program-card skeleton">
            <q-skeleton type="rect" class="bg-grey-8" height="100px" />
            <q-skeleton type="text" class="bg-grey-8" width="80%" />
            <q-skeleton type="text" class="bg-grey-8" width="60%" />
          </div>
        </template>

        <div v-else-if="filteredPrograms.length === 0" class="empty-state">
          <q-icon name="school" size="64px" color="grey-6" />
          <h3>No hay programas</h3>
          <p>Crea tu primer programa de entrenamiento</p>
          <q-btn color="primary" icon="add" label="Crear Programa" no-caps @click="openCreateDialog" />
        </div>

        <ProgramCard v-for="program in filteredPrograms" :key="program.id" :program="program"
          @view="viewProgram(program)" @edit="editProgram(program)" @duplicate="duplicateProgram(program)"
          @toggle-status="toggleProgramStatus(program)" />
      </div>

      <!-- Programs List -->
      <div v-else class="programs-list">
        <template v-if="loading">
          <div v-for="i in 4" :key="`skeleton-${i}`" class="program-list-item skeleton">
            <q-skeleton type="text" class="bg-grey-8" width="100%" />
          </div>
        </template>

        <div v-else-if="filteredPrograms.length === 0" class="empty-state">
          <q-icon name="school" size="64px" color="grey-6" />
          <h3>No hay programas</h3>
          <p>Crea tu primer programa de entrenamiento</p>
          <q-btn color="primary" icon="add" label="Crear Programa" no-caps @click="openCreateDialog" />
        </div>

        <div v-for="program in filteredPrograms" :key="program.id" class="program-list-item"
          :class="{ 'inactive': !program.isActive }">
          <div class="list-gradient" :style="{ background: getProgramGradient(program) }"></div>
          <div class="list-content">
            <div class="list-main">
              <span class="list-icon">{{ getDisciplineIcon(program.discipline) }}</span>
              <div class="list-info">
                <h4>{{ program.name }}</h4>
                <p>{{ truncateText(program.description, 80) }}</p>
              </div>
            </div>
            <div class="list-meta">
              <span><q-icon name="stairs" size="14px" /> {{ program.totalLevels }} niveles</span>
              <span><q-icon name="people" size="14px" /> {{ program.usersCount || 0 }}</span>
              <q-chip dense :color="program.isActive ? 'positive' : 'grey'" text-color="white" size="sm">
                {{ program.isActive ? 'Activo' : 'Inactivo' }}
              </q-chip>
            </div>
            <div class="list-actions">
              <q-btn flat round icon="visibility" color="primary" size="sm" @click="viewProgram(program)">
                <q-tooltip>Ver</q-tooltip>
              </q-btn>
              <q-btn flat round icon="edit" color="primary" size="sm" @click="editProgram(program)">
                <q-tooltip>Editar</q-tooltip>
              </q-btn>
              <q-btn flat round icon="content_copy" color="grey-6" size="sm" @click="duplicateProgram(program)">
                <q-tooltip>Duplicar</q-tooltip>
              </q-btn>
              <q-toggle :model-value="program.isActive" color="positive" dense
                @update:model-value="toggleProgramStatus(program)" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Dialog -->
    <FormDialog v-model="showCreateDialog" title="Nuevo Programa" confirm-label="Crear Programa" :loading="saving"
      @confirm="saveProgram">
      <div class="form-grid">
        <div class="form-group full-width">
          <label>Nombre *</label>
          <q-input v-model="newProgram.name" outlined dark dense placeholder="Ej: Calistenia Master"
            :rules="[val => !!val || 'El nombre es obligatorio']" />
        </div>
        <div class="form-group full-width">
          <label>Slug (identificador URL)</label>
          <q-input v-model="newProgram.slug" outlined dark dense placeholder="calistenia-master"
            hint="Se usará en la URL del programa" />
        </div>
        <div class="form-group">
          <label>Disciplina</label>
          <q-select v-model="newProgram.discipline" :options="disciplineSelectOptions" outlined dark dense emit-value
            map-options />
        </div>
        <div class="form-group">
          <label>Niveles totales</label>
          <q-input v-model.number="newProgram.totalLevels" type="number" outlined dark dense min="1" />
        </div>
        <div class="form-group full-width">
          <label>Descripción</label>
          <q-input v-model="newProgram.description" type="textarea" outlined dark dense rows="3"
            placeholder="Describe el objetivo del programa..." />
        </div>
      </div>
    </FormDialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import PageHeader from '@/components/common/PageHeader.vue'
import StatsCards from '@/components/common/StatsCards.vue'
import FilterPills from '@/components/common/FilterPills.vue'
import FormDialog from '@/components/common/FormDialog.vue'
import { ProgramCard } from '@/components/admin'

const $q = useQuasar()
const router = useRouter()

// State
const loading = ref(false)
const saving = ref(false)
const searchQuery = ref('')
const statusFilter = ref('all')
const disciplineFilter = ref('all')
const viewMode = ref('grid')
const showCreateDialog = ref(false)

const programs = ref([])

const newProgram = ref({
  name: '',
  slug: '',
  discipline: 'calisthenics',
  description: '',
  totalLevels: 12,
  estimatedDurationWeeks: 144
})

// Options
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

const disciplineFilterOptions = [
  { label: 'Todos', value: 'all', color: 'default' },
  { label: 'Calistenia 🤸', value: 'calisthenics', color: 'orange' },
  { label: 'CrossFit 🏋️', value: 'crossfit', color: 'teal' },
  { label: 'Fitness 💪', value: 'fitness', color: 'purple' },
  { label: 'Powerlifting 🏆', value: 'powerlifting', color: 'blue' },
]

// Computed
const stats = computed(() => [
  { value: programs.value.length, label: 'Total Programas', icon: 'school' },
  { value: activePrograms.value, label: 'Activos', icon: 'check_circle', iconColor: 'positive' },
  { value: totalUsers.value, label: 'Usuarios totales', icon: 'people', iconColor: 'accent' },
  { value: totalLevels.value, label: 'Niveles totales', icon: 'stairs', iconColor: 'teal' },
])

const hasActiveFilters = computed(() =>
  searchQuery.value || statusFilter.value !== 'all' || disciplineFilter.value !== 'all'
)

const filteredPrograms = computed(() => {
  let result = programs.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    )
  }

  if (statusFilter.value === 'active') {
    result = result.filter(p => p.isActive)
  } else if (statusFilter.value === 'inactive') {
    result = result.filter(p => !p.isActive)
  }

  if (disciplineFilter.value !== 'all') {
    result = result.filter(p => p.discipline === disciplineFilter.value)
  }

  return result
})

const activePrograms = computed(() => programs.value.filter(p => p.isActive).length)
const totalUsers = computed(() => programs.value.reduce((sum, p) => sum + (p.usersCount || 0), 0))
const totalLevels = computed(() => programs.value.reduce((sum, p) => sum + (p.totalLevels || 0), 0))

// Methods
const getProgramGradient = (program) => {
  const colors = {
    'calisthenics': 'linear-gradient(135deg, #ff8f38 0%, #ff6b6b 100%)',
    'crossfit': 'linear-gradient(135deg, #38b2ac 0%, #4299e1 100%)',
    'fitness': 'linear-gradient(135deg, #9f7aea 0%, #ed64a6 100%)',
    'powerlifting': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  }
  return colors[program.discipline] || colors.fitness
}

const getDisciplineIcon = (discipline) => ({
  'calisthenics': '🤸', 'crossfit': '🏋️', 'fitness': '💪', 'powerlifting': '🏆'
}[discipline] || '🎯')

const getDisciplineLabel = (discipline) => {
  const option = disciplineOptions.find(d => d.value === discipline)
  return option ? option.label : discipline
}

const getStatusColor = (status) => ({
  'active': 'positive', 'inactive': 'grey', 'all': 'grey'
}[status] || 'grey')

const getStatusLabel = (status) => ({
  'active': 'Activo', 'inactive': 'Inactivo', 'all': 'Todos'
}[status] || status)

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = 'all'
  disciplineFilter.value = 'all'
}

const truncateText = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

const fetchPrograms = async () => {
  loading.value = true
  try {
    // TODO: Reemplazar con llamada API real
    programs.value = [
      {
        id: 1, name: 'Calistenia Master', slug: 'calistenia-master',
        description: 'Programa completo de calistenia desde cero hasta nivel experto.',
        discipline: 'calisthenics', totalLevels: 12, estimatedDurationWeeks: 144,
        isActive: true, usersCount: 156,
      },
      {
        id: 2, name: 'CrossFit Fundamentals', slug: 'crossfit-fundamentals',
        description: 'Introducción al CrossFit con movimientos olímpicos y WODs progresivos.',
        discipline: 'crossfit', totalLevels: 8, estimatedDurationWeeks: 96,
        isActive: true, usersCount: 89,
      },
      {
        id: 3, name: 'Powerlifting 101', slug: 'powerlifting-101',
        description: 'Domina los tres levantamientos: squat, bench press y deadlift.',
        discipline: 'powerlifting', totalLevels: 6, estimatedDurationWeeks: 72,
        isActive: false, usersCount: 0,
      },
      {
        id: 4, name: 'Fitness General', slug: 'fitness-general',
        description: 'Entrenamiento funcional para mejorar la condición física general.',
        discipline: 'fitness', totalLevels: 10, estimatedDurationWeeks: 120,
        isActive: true, usersCount: 234,
      },
    ]
  } catch {
    $q.notify({ type: 'negative', message: 'Error al cargar programas' })
  } finally {
    loading.value = false
  }
}

const viewProgram = (program) => router.push(`/admin/training-programs/${program.id}`)
const editProgram = (program) => router.push(`/admin/training-programs/${program.id}/edit`)

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
  newProgram.value = { name: '', slug: '', discipline: 'calisthenics', description: '', totalLevels: 12, estimatedDurationWeeks: 144 }
  showCreateDialog.value = true
}

const saveProgram = async () => {
  if (!newProgram.value.name) {
    $q.notify({ type: 'warning', message: 'El nombre es obligatorio' })
    return
  }

  saving.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    $q.notify({ type: 'positive', message: 'Programa creado correctamente' })
    showCreateDialog.value = false
    fetchPrograms()
  } catch {
    $q.notify({ type: 'negative', message: 'Error al crear programa' })
  } finally {
    saving.value = false
  }
}

onMounted(fetchPrograms)
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
  transition: all 0.3s ease;
}

.search-box-modern .search-input:focus {
  border-color: #ff8f38;
  box-shadow: 0 4px 30px rgba(255, 143, 56, 0.25);
}

.search-box-modern .clear-search {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #8b949e;
}

.filter-groups-modern {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.active-filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  padding-top: 20px;
  margin-top: 4px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

/* View Toggle */
.view-toggle-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

/* Grid */
.programs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.program-card.skeleton {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 20px;
}

/* List View */
.programs-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.program-list-item {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.program-list-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.program-list-item.inactive {
  opacity: 0.7;
}

.list-gradient {
  width: 6px;
  align-self: stretch;
}

.list-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  gap: 16px;
}

.list-main {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.list-icon {
  font-size: 28px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}

.list-info h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 4px 0;
}

.list-info p {
  font-size: 0.9rem;
  color: #8b949e;
  margin: 0;
}

.list-meta {
  display: flex;
  align-items: center;
  gap: 20px;
  color: #c9d1d9;
  font-size: 0.9rem;
}

.list-meta span {
  display: flex;
  align-items: center;
  gap: 6px;
}

.list-actions {
  display: flex;
  align-items: center;
  gap: 8px;
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

/* Form */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #c9d1d9;
}

@media (max-width: 900px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .list-content {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
