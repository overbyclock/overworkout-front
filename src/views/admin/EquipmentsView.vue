<template>
  <q-page class="page-container">
    <div class="page-content">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Equipamiento</h1>
          <p class="page-subtitle">Gestiona el equipamiento para tus ejercicios</p>
        </div>
        <q-btn color="primary" icon="add" label="Nuevo Equipo" class="action-btn" no-caps @click="openCreateDialog" />
      </div>

      <!-- Stats -->
      <div class="stats-row">
        <div class="stat-mini">
          <div class="stat-mini-icon" style="background: rgba(255, 107, 107, 0.2)">
            <q-icon name="sports_gymnastics" color="red" size="20px" />
          </div>
          <div class="stat-mini-content">
            <div class="stat-mini-value">{{ equipments.length }}</div>
            <div class="stat-mini-label">Total Equipos</div>
          </div>
        </div>
        <div class="stat-mini">
          <div class="stat-mini-icon" style="background: rgba(255, 143, 56, 0.2)">
            <q-icon name="fitness_center" color="primary" size="20px" />
          </div>
          <div class="stat-mini-content">
            <div class="stat-mini-value">{{ usedInExercisesCount }}</div>
            <div class="stat-mini-label">En Uso</div>
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
              placeholder="Buscar equipamiento..." 
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
          <!-- Category Filter -->
          <div class="filter-category">
            <span class="filter-category-label">
              <q-icon name="category" size="16px" />
              Categoría
            </span>
            <div class="filter-pills">
              <button 
                v-for="category in categoryFilterOptions" 
                :key="category.value"
                class="filter-pill"
                :class="{ 'active': categoryFilter === category.value, [category.color]: true }"
                @click="categoryFilter = category.value"
              >
                {{ category.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- Active Filters -->
        <div v-if="searchQuery || categoryFilter !== 'all'" class="active-filters">
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
              v-if="categoryFilter !== 'all'"
              removable
              dense
              color="teal"
              text-color="white"
              @remove="categoryFilter = 'all'"
            >
              {{ getCategoryLabel(categoryFilter) }}
            </q-chip>
            <q-btn
              flat
              dense
              no-caps
              color="grey-6"
              label="Limpiar todo"
              size="sm"
              @click="clearFilters"
            />
          </div>
        </div>
      </div>

      <!-- Equipments Grid -->
      <div class="equipments-grid">
        <div v-if="loading" v-for="i in 8" :key="i" class="equipment-card skeleton">
          <q-skeleton type="text" class="bg-grey-8" width="80%" />
          <q-skeleton type="text" class="bg-grey-8" width="100%" />
          <q-skeleton type="text" class="bg-grey-8" width="60%" />
        </div>

        <div v-else-if="filteredEquipments.length === 0" class="empty-state">
          <q-icon name="sports_gymnastics" size="64px" color="grey-6" />
          <h3>No hay equipamiento</h3>
          <p>Añade equipos para usarlos en tus ejercicios</p>
          <q-btn color="primary" icon="add" label="Añadir Equipo" no-caps @click="openCreateDialog" />
        </div>

        <div v-for="equipment in paginatedEquipments" :key="equipment.id" class="equipment-card">
          <!-- Header -->
          <div class="equipment-header" :class="equipment.category">
            <h3 class="equipment-name">{{ equipment.name }}</h3>
            <p v-if="equipment.description" class="equipment-description">{{ equipment.description }}</p>
          </div>
          
          <!-- Actions -->
          <div class="equipment-actions">
            <q-btn flat dense icon="play_circle" label="YouTube" color="grey-5" size="sm" no-caps @click="searchEquipment(equipment, 'youtube')" />
            <q-btn flat dense icon="search" label="Google" color="grey-5" size="sm" no-caps @click="searchEquipment(equipment, 'google')" />
            <q-btn flat dense icon="edit" label="Editar" color="primary" size="sm" no-caps @click="editEquipment(equipment)" />
            <q-btn flat dense icon="delete" label="Eliminar" color="negative" size="sm" no-caps @click="confirmDelete(equipment)" />
          </div>
          
          <!-- Category & Weight -->
          <div class="equipment-meta">
            <div v-if="equipment.category && equipment.category !== 'general'" class="category-tag" :class="equipment.category">
              <q-icon :name="getCategoryIcon(equipment.category)" size="14px" />
              <span>{{ getCategoryLabel(equipment.category) }}</span>
            </div>
            <div v-if="equipment.weight" class="weight-tag">
              <q-icon name="fitness_center" size="14px" />
              <span>{{ equipment.weight }} kg</span>
            </div>
          </div>
        </div>
        
        <!-- Pagination -->
        <div v-if="totalPages > 1" class="pagination-wrapper">
          <div class="pagination-row">
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
            <span class="pagination-info">
              {{ filteredEquipments.length }} equipos | Página {{ currentPage }} de {{ totalPages }}
            </span>
          </div>
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
    <q-dialog v-model="equipmentDialog" persistent>
      <q-card class="dialog-card">
        <q-card-section class="dialog-header">
          <h3 class="dialog-title">{{ isEditing ? 'Editar Equipo' : 'Nuevo Equipo' }}</h3>
          <q-btn flat round icon="close" color="grey-6" v-close-popup />
        </q-card-section>

        <q-card-section class="dialog-body">
          <div class="form-grid">
            <div class="form-group">
              <label>Nombre *</label>
              <q-input v-model="equipmentForm.name" outlined dark dense placeholder="Ej: Mancuernas"
                :rules="[val => !!val || 'El nombre es obligatorio']" />
            </div>
            <div class="form-group">
              <label>Categoría</label>
              <q-select v-model="equipmentForm.category" :options="categoryOptions" outlined dark dense emit-value
                map-options option-value="value" option-label="label" placeholder="Selecciona categoría" />
            </div>
            <div class="form-group full-width">
              <label>Descripción</label>
              <q-input v-model="equipmentForm.description" outlined dark dense type="textarea" rows="3"
                placeholder="Describe el equipamiento..." />
            </div>
            <div class="form-group">
              <label>Peso (kg) - Opcional</label>
              <q-input v-model.number="equipmentForm.weight" outlined dark dense type="number" min="0" step="0.5"
                placeholder="0.0" />
            </div>
          </div>
        </q-card-section>

        <q-card-section class="dialog-footer">
          <q-btn flat label="Cancelar" color="grey-6" v-close-popup />
          <q-btn color="primary" :label="isEditing ? 'Guardar Cambios' : 'Crear Equipo'" :loading="saving"
            @click="saveEquipment" />
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
          <h3 class="dialog-title">Eliminar Equipo</h3>
          <p class="dialog-subtitle">¿Estás seguro de que quieres eliminar <strong>{{ equipmentToDelete?.name }}</strong>?</p>
        </q-card-section>
        <q-card-section class="dialog-footer">
          <q-btn flat label="Cancelar" color="grey-6" v-close-popup />
          <q-btn label="Eliminar" color="negative" :loading="deleting" @click="deleteEquipment" />
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
const equipments = ref([])
const exercises = ref([])
const searchQuery = ref('')

// Paginación
const currentPage = ref(1)
const itemsPerPage = ref(10)

const itemsPerPageOptions = [
  { label: '10', value: 10 },
  { label: '20', value: 20 },
  { label: '30', value: 30 },
  { label: '40', value: 40 },
  { label: '50', value: 50 }
]

// Filtros
const categoryFilter = ref('all')

const categoryFilterOptions = [
  { label: 'Todas', value: 'all', color: 'default' },
  { label: 'Barras', value: 'barras', color: 'blue' },
  { label: 'Pesos Libres', value: 'pesos_libres', color: 'orange' },
  { label: 'Bancos y Soportes', value: 'bancos_soportes', color: 'brown' },
  { label: 'Accesorios', value: 'accesorios', color: 'yellow' },
  { label: 'Máquinas', value: 'maquinas', color: 'green' },
]

const equipmentDialog = ref(false)
const deleteDialog = ref(false)
const isEditing = ref(false)
const equipmentToDelete = ref(null)

const equipmentForm = ref({
  name: '',
  description: '',
  category: '',
  weight: null
})

const categoryOptions = [
  { label: 'Barras', value: 'barras' },
  { label: 'Pesos Libres', value: 'pesos_libres' },
  { label: 'Bancos y Soportes', value: 'bancos_soportes' },
  { label: 'Accesorios', value: 'accesorios' },
  { label: 'Máquinas', value: 'maquinas' },
]

const categoryColors = {
  'weights': { bg: 'rgba(255, 143, 56, 0.2)', color: '#ff8f38' },
  'cardio': { bg: 'rgba(255, 107, 107, 0.2)', color: '#ff6b6b' },
  'calisthenics': { bg: 'rgba(56, 178, 172, 0.2)', color: '#38b2ac' },
  'yoga': { bg: 'rgba(147, 112, 219, 0.2)', color: '#9370db' },
  'accessories': { bg: 'rgba(255, 193, 7, 0.2)', color: '#ffc107' },
  'machines': { bg: 'rgba(63, 185, 80, 0.2)', color: '#3fb950' },
  'general': { bg: 'rgba(139, 148, 158, 0.2)', color: '#8b949e' },
}

const filteredEquipments = computed(() => {
  let result = equipments.value

  // Filtro por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(eq =>
      eq.name?.toLowerCase().includes(query) ||
      eq.description?.toLowerCase().includes(query)
    )
  }

  // Filtro por categoría
  if (categoryFilter.value !== 'all') {
    result = result.filter(eq => eq.category === categoryFilter.value)
  }

  return result
})

// Equipos paginados
const paginatedEquipments = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredEquipments.value.slice(start, end)
})

// Total de páginas
const totalPages = computed(() => {
  return Math.ceil(filteredEquipments.value.length / itemsPerPage.value)
})

const usedInExercisesCount = computed(() => {
  // Obtener IDs únicos de equipos que están en uso
  const usedEquipmentIds = new Set()
  exercises.value.forEach(ex => {
    if (ex.equipment?.id) {
      usedEquipmentIds.add(ex.equipment.id)
    }
  })
  return usedEquipmentIds.size
})

const fetchEquipments = async () => {
  loading.value = true
  try {
    const [equipResponse, exerciseResponse] = await Promise.all([
      equipmentService.getAll(),
      exerciseService.getAll()
    ])
    equipments.value = Array.isArray(equipResponse) ? equipResponse : (equipResponse.member || equipResponse['hydra:member'] || [])
    exercises.value = Array.isArray(exerciseResponse) ? exerciseResponse : (exerciseResponse.member || exerciseResponse['hydra:member'] || [])
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

const getIconBg = (category) => {
  return categoryColors[category]?.bg || categoryColors.general.bg
}

const getIconColor = (category) => {
  return categoryColors[category]?.color || categoryColors.general.color
}

const getCategoryBg = (category) => {
  const color = categoryColors[category]?.bg || categoryColors.general.bg
  return color.replace('0.2', '0.15')
}

const getCategoryLabel = (category) => {
  const labels = {
    'barras': 'Barras',
    'pesos_libres': 'Pesos Libres',
    'bancos_soportes': 'Bancos y Soportes',
    'accesorios': 'Accesorios',
    'maquinas': 'Máquinas',
  }
  return labels[category] || category
}

const getCategoryIcon = (category) => {
  const icons = {
    'barras': 'horizontal_rule',
    'pesos_libres': 'fitness_center',
    'bancos_soportes': 'single_bed',
    'accesorios': 'construction',
    'maquinas': 'settings',
  }
  return icons[category] || 'sports_gymnastics'
}

const clearFilters = () => {
  searchQuery.value = ''
  categoryFilter.value = 'all'
  currentPage.value = 1
}

const truncateText = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

const openCreateDialog = () => {
  isEditing.value = false
  equipmentForm.value = {
    name: '',
    description: '',
    category: '',
    weight: null
  }
  equipmentDialog.value = true
}

const searchEquipment = (equipment, platform) => {
  const query = encodeURIComponent(`${equipment.name} ejercicio tutorial`)
  let url = ''
  
  if (platform === 'youtube') {
    url = `https://www.youtube.com/results?search_query=${query}`
  } else {
    url = `https://www.google.com/search?q=${query}&tbm=vid`
  }
  
  window.open(url, '_blank')
}

const editEquipment = (equipment) => {
  isEditing.value = true
  equipmentForm.value = { ...equipment }
  equipmentDialog.value = true
}

const saveEquipment = async () => {
  if (!equipmentForm.value.name) {
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
      await equipmentService.update(equipmentForm.value.id, equipmentForm.value)
      $q.notify({
        type: 'positive',
        message: 'Equipo actualizado',
        position: 'top'
      })
    } else {
      await equipmentService.create(equipmentForm.value)
      $q.notify({
        type: 'positive',
        message: 'Equipo creado',
        position: 'top'
      })
    }
    equipmentDialog.value = false
    fetchEquipments()
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

const confirmDelete = (equipment) => {
  equipmentToDelete.value = equipment
  deleteDialog.value = true
}

const deleteEquipment = async () => {
  deleting.value = true
  try {
    await equipmentService.delete(equipmentToDelete.value.id)
    $q.notify({
      type: 'positive',
      message: 'Equipo eliminado',
      position: 'top'
    })
    deleteDialog.value = false
    fetchEquipments()
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
watch([searchQuery, categoryFilter], () => {
  currentPage.value = 1
})

onMounted(() => {
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

/* Modern Filters */
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

/* Category colors */
.filter-pill.blue.active { background: linear-gradient(135deg, #58a6ff 0%, #1f6feb 100%); box-shadow: 0 6px 20px rgba(88, 166, 255, 0.5); }
.filter-pill.orange.active { background: linear-gradient(135deg, #ff8f38 0%, #ff6b35 100%); box-shadow: 0 6px 20px rgba(255, 143, 56, 0.5); }
.filter-pill.brown.active { background: linear-gradient(135deg, #a1886f 0%, #8d6e63 100%); box-shadow: 0 6px 20px rgba(161, 136, 111, 0.5); }
.filter-pill.yellow.active { background: linear-gradient(135deg, #ffd700 0%, #ffc107 100%); box-shadow: 0 6px 20px rgba(255, 215, 0, 0.5); }
.filter-pill.green.active { background: linear-gradient(135deg, #3fb950 0%, #2ea043 100%); box-shadow: 0 6px 20px rgba(63, 185, 80, 0.5); }

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

/* Equipments Grid */
.equipments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.equipment-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 220px;
}

.equipment-card:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 143, 56, 0.3);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
  background: rgba(255, 255, 255, 0.05);
}

.equipment-card.skeleton {
  gap: 12px;
}

/* Equipment Header */
.equipment-header {
  position: relative;
  padding-top: 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.equipment-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 70%;
  height: 4px;
  border-radius: 2px;
  background: linear-gradient(90deg, #8b949e, #6e7681);
  transition: all 0.3s ease;
}

/* Colores por categoría */
.equipment-header.barras::before {
  background: linear-gradient(90deg, #58a6ff, #1f6feb);
}

.equipment-header.pesos_libres::before {
  background: linear-gradient(90deg, #ff8f38, #ff6b35);
}

.equipment-header.bancos_soportes::before {
  background: linear-gradient(90deg, #a1886f, #8d6e63);
}

.equipment-header.accesorios::before {
  background: linear-gradient(90deg, #ffd700, #ffc107);
}

.equipment-header.maquinas::before {
  background: linear-gradient(90deg, #3fb950, #2ea043);
}

.equipment-name {
  font-size: 1.4rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  line-height: 1.2;
  letter-spacing: -0.3px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.equipment-description {
  font-size: 0.9rem;
  color: #8b949e;
  line-height: 1.5;
  margin: 8px 0 0 0;
}

/* Equipment Actions */
.equipment-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.equipment-card:hover .equipment-actions {
  opacity: 1;
}

.equipment-actions .q-btn {
  font-size: 0.75rem;
  font-weight: 500;
}

/* Equipment Meta */
.equipment-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  margin-top: auto;
}

.category-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
}

.category-tag.barras {
  background: rgba(88, 166, 255, 0.15);
  color: #58a6ff;
  border: 1px solid rgba(88, 166, 255, 0.3);
}

.category-tag.pesos_libres {
  background: rgba(255, 143, 56, 0.15);
  color: #ff8f38;
  border: 1px solid rgba(255, 143, 56, 0.3);
}

.category-tag.bancos_soportes {
  background: rgba(161, 136, 111, 0.15);
  color: #a1886f;
  border: 1px solid rgba(161, 136, 111, 0.3);
}

.category-tag.accesorios {
  background: rgba(255, 193, 7, 0.15);
  color: #ffc107;
  border: 1px solid rgba(255, 193, 7, 0.3);
}

.category-tag.maquinas {
  background: rgba(63, 185, 80, 0.15);
  color: #3fb950;
  border: 1px solid rgba(63, 185, 80, 0.3);
}

.weight-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  background: rgba(139, 148, 158, 0.1);
  color: #8b949e;
  border: 1px solid rgba(139, 148, 158, 0.2);
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
}

/* Dialog */
.dialog-card {
  background: #1a1f2e;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  min-width: 500px;
  max-width: 90vw;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.dialog-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}

.dialog-body {
  padding: 24px;
}

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

.selected-icon {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

/* Delete Dialog */
.delete-dialog {
  text-align: center;
}

.delete-dialog .dialog-header {
  flex-direction: column;
  gap: 16px;
  text-align: center;
}

.delete-icon {
  width: 64px;
  height: 64px;
  background: rgba(248, 81, 73, 0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-subtitle {
  color: #8b949e;
  margin: 0;
}

.dialog-subtitle strong {
  color: #ffffff;
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

  .form-grid {
    grid-template-columns: 1fr;
  }

  .dialog-card {
    min-width: auto;
    width: 90vw;
  }
}
</style>
