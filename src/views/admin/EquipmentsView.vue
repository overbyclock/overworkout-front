<template>
  <q-page class="page-container">
    <div class="page-content">
      <!-- Header -->
      <PageHeader
        title="Equipamiento"
        subtitle="Gestiona el equipamiento para tus ejercicios"
        action-label="Nuevo Equipo"
        @action="openCreateDialog"
      />

      <!-- Stats -->
      <StatsCards :stats="stats" />

      <!-- Filters -->
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
          <FilterPills
            v-model="categoryFilter"
            label="Categoría"
            icon="category"
            :options="categoryFilterOptions"
          />
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
        <template v-if="loading">
          <div v-for="i in 8" :key="`skeleton-${i}`" class="equipment-card skeleton">
            <q-skeleton type="text" class="bg-grey-8" width="80%" />
            <q-skeleton type="text" class="bg-grey-8" width="100%" />
            <q-skeleton type="text" class="bg-grey-8" width="60%" />
          </div>
        </template>

        <div v-else-if="filteredEquipments.length === 0" class="empty-state">
          <q-icon name="sports_gymnastics" size="64px" color="grey-6" />
          <h3>No hay equipamiento</h3>
          <p>Añade equipos para usarlos en tus ejercicios</p>
          <q-btn color="primary" icon="add" label="Añadir Equipo" no-caps @click="openCreateDialog" />
        </div>

        <div
          v-for="equipment in paginatedEquipments"
          :key="equipment.id"
          class="equipment-card"
        >
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
    <FormDialog
      v-model="showFormDialog"
      :title="isEditing ? 'Editar Equipo' : 'Nuevo Equipo'"
      :confirm-label="isEditing ? 'Guardar Cambios' : 'Crear Equipo'"
      :loading="saving"
      @confirm="saveEquipment"
    >
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
    </FormDialog>

    <!-- Delete Dialog -->
    <FormDialog
      v-model="showDeleteDialog"
      title="Eliminar Equipo"
      :subtitle="`¿Estás seguro de que quieres eliminar <strong>${equipmentToDelete?.name}</strong>?`"
      is-delete
      confirm-label="Eliminar"
      confirm-color="negative"
      :loading="deleting"
      @confirm="deleteEquipment"
    />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useEquipmentsStore } from '@/stores/equipments'
import PageHeader from '@/components/common/PageHeader.vue'
import StatsCards from '@/components/common/StatsCards.vue'
import FilterPills from '@/components/common/FilterPills.vue'
import FormDialog from '@/components/common/FormDialog.vue'

const $q = useQuasar()
const equipmentsStore = useEquipmentsStore()

// State
const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const searchQuery = ref('')
const categoryFilter = ref('all')
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Dialogs
const showFormDialog = ref(false)
const showDeleteDialog = ref(false)
const isEditing = ref(false)
const equipmentToDelete = ref(null)

// Form
const equipmentForm = ref({
  name: '',
  description: '',
  category: '',
  weight: null
})

// Options
const itemsPerPageOptions = [
  { label: '10', value: 10 },
  { label: '20', value: 20 },
  { label: '30', value: 30 },
  { label: '40', value: 40 },
  { label: '50', value: 50 }
]

const categoryFilterOptions = [
  { label: 'Todas', value: 'all', color: 'default' },
  { label: 'Barras', value: 'barras', color: 'blue' },
  { label: 'Pesos Libres', value: 'pesos_libres', color: 'orange' },
  { label: 'Bancos y Soportes', value: 'bancos_soportes', color: 'brown' },
  { label: 'Accesorios', value: 'accesorios', color: 'yellow' },
  { label: 'Máquinas', value: 'maquinas', color: 'green' },
]

const categoryOptions = [
  { label: 'Barras', value: 'barras' },
  { label: 'Pesos Libres', value: 'pesos_libres' },
  { label: 'Bancos y Soportes', value: 'bancos_soportes' },
  { label: 'Accesorios', value: 'accesorios' },
  { label: 'Máquinas', value: 'maquinas' },
]

// Computed
const stats = computed(() => [
  { value: equipmentsStore.totalEquipments, label: 'Total Equipos', icon: 'sports_gymnastics', bgColor: 'rgba(255, 107, 107, 0.2)', iconColor: 'red' },
  { value: equipmentsStore.usedInExercisesCount, label: 'En Uso', icon: 'fitness_center', bgColor: 'rgba(255, 143, 56, 0.2)', iconColor: 'primary' },
])

const filteredEquipments = computed(() => {
  let result = equipmentsStore.equipments

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(eq =>
      eq.name?.toLowerCase().includes(query) ||
      eq.description?.toLowerCase().includes(query)
    )
  }

  if (categoryFilter.value !== 'all') {
    result = result.filter(eq => eq.category === categoryFilter.value)
  }

  return result
})

const paginatedEquipments = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredEquipments.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredEquipments.value.length / itemsPerPage.value))

// Methods
const fetchEquipments = async () => {
  loading.value = true
  try {
    await equipmentsStore.fetchWithExercises()
  } catch {
    $q.notify({ type: 'negative', message: 'Error al cargar datos', position: 'top' })
  } finally {
    loading.value = false
  }
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

const openCreateDialog = () => {
  isEditing.value = false
  equipmentForm.value = { name: '', description: '', category: '', weight: null }
  showFormDialog.value = true
}

const searchEquipment = (equipment, platform) => {
  const query = encodeURIComponent(`${equipment.name} ejercicio tutorial`)
  const url = platform === 'youtube'
    ? `https://www.youtube.com/results?search_query=${query}`
    : `https://www.google.com/search?q=${query}&tbm=vid`
  window.open(url, '_blank')
}

const editEquipment = (equipment) => {
  isEditing.value = true
  equipmentForm.value = { ...equipment }
  showFormDialog.value = true
}

const saveEquipment = async () => {
  if (!equipmentForm.value.name) {
    $q.notify({ type: 'warning', message: 'El nombre es obligatorio', position: 'top' })
    return
  }

  saving.value = true
  try {
    if (isEditing.value) {
      await equipmentsStore.updateEquipment(equipmentForm.value.id, equipmentForm.value)
      $q.notify({ type: 'positive', message: 'Equipo actualizado', position: 'top' })
    } else {
      await equipmentsStore.createEquipment(equipmentForm.value)
      $q.notify({ type: 'positive', message: 'Equipo creado', position: 'top' })
    }
    showFormDialog.value = false
  } catch {
    // Error manejado por el store
  } finally {
    saving.value = false
  }
}

const confirmDelete = (equipment) => {
  equipmentToDelete.value = equipment
  showDeleteDialog.value = true
}

const deleteEquipment = async () => {
  deleting.value = true
  try {
    await equipmentsStore.deleteEquipment(equipmentToDelete.value.id)
    $q.notify({ type: 'positive', message: 'Equipo eliminado', position: 'top' })
    showDeleteDialog.value = false
  } catch {
    // Error manejado por el store
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

/* Form Grid */
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

/* Responsive */
@media (max-width: 900px) {
  .filters-container {
    padding: 20px 16px;
  }

  .search-box-modern .search-input {
    padding: 16px 48px 16px 52px;
    font-size: 1rem;
  }

  .pagination-row {
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
