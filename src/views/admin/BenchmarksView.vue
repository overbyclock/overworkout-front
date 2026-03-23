<template>
  <q-page class="page-container">
    <div class="page-content">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Benchmarks CrossFit</h1>
          <p class="page-subtitle">WODs con estándares de tiempo para medir progreso</p>
        </div>
        <q-btn color="primary" icon="add" label="Nuevo Benchmark" class="action-btn" no-caps @click="openCreateDialog" />
      </div>

      <!-- Stats -->
      <div class="stats-row">
        <div class="stat-mini">
          <div class="stat-mini-icon" style="background: rgba(255, 107, 107, 0.2)">
            <q-icon name="timer" color="red" size="20px" />
          </div>
          <div class="stat-mini-content">
            <div class="stat-mini-value">{{ benchmarks.length }}</div>
            <div class="stat-mini-label">Total Benchmarks</div>
          </div>
        </div>
        <div class="stat-mini">
          <div class="stat-mini-icon" style="background: rgba(255, 143, 56, 0.2)">
            <q-icon name="female" color="primary" size="20px" />
          </div>
          <div class="stat-mini-content">
            <div class="stat-mini-value">{{ girlCount }}</div>
            <div class="stat-mini-label">The Girls</div>
          </div>
        </div>
        <div class="stat-mini">
          <div class="stat-mini-icon" style="background: rgba(147, 112, 219, 0.2)">
            <q-icon name="military_tech" color="accent" size="20px" />
          </div>
          <div class="stat-mini-content">
            <div class="stat-mini-value">{{ heroCount }}</div>
            <div class="stat-mini-label">Hero WODs</div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters-container">
        <div class="search-wrapper">
          <div class="search-box-modern">
            <q-icon name="search" class="search-icon" size="22px" />
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Buscar benchmarks..." 
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
          <div class="filter-category">
            <span class="filter-category-label">
              <q-icon name="category" size="16px" />
              Tipo
            </span>
            <div class="filter-pills">
              <button 
                v-for="type in typeOptions" 
                :key="type.value"
                class="filter-pill"
                :class="{ 'active': typeFilter === type.value, [type.color]: true }"
                @click="typeFilter = type.value"
              >
                {{ type.label }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Benchmarks Grid -->
      <div class="benchmarks-grid">
        <div v-if="loading" v-for="i in 6" :key="i" class="benchmark-card skeleton">
          <q-skeleton type="text" class="bg-grey-8" width="60%" />
          <q-skeleton type="text" class="bg-grey-8" width="80%" />
          <q-skeleton type="text" class="bg-grey-8" width="40%" />
        </div>

        <div v-else-if="filteredBenchmarks.length === 0" class="empty-state">
          <q-icon name="timer" size="64px" color="grey-6" />
          <h3>No hay benchmarks</h3>
          <p>Crea tu primer WOD benchmark</p>
          <q-btn color="primary" icon="add" label="Crear Benchmark" no-caps @click="openCreateDialog" />
        </div>

        <div v-for="benchmark in filteredBenchmarks" :key="benchmark.id" class="benchmark-card">
          <div class="benchmark-header">
            <q-chip 
              size="sm" 
              :color="getTypeColor(benchmark.benchmarkType)" 
              text-color="white"
              class="type-chip"
            >
              {{ formatType(benchmark.benchmarkType) }}
            </q-chip>
            <div class="benchmark-difficulty">
              <q-icon name="fitness_center" size="14px" color="orange" />
              <span>{{ benchmark.target }}</span>
            </div>
          </div>
          
          <h3 class="benchmark-name">{{ benchmark.name }}</h3>
          <p class="benchmark-description">{{ benchmark.target }} - {{ benchmark.rxWeightMale }}</p>
          
          <div class="time-standards">
            <div class="standard-row">
              <span class="rank elite">Élite</span>
              <span class="time">{{ benchmark.eliteTime }}</span>
            </div>
            <div class="standard-row">
              <span class="rank advanced">Avanzado</span>
              <span class="time">{{ benchmark.advancedTime }}</span>
            </div>
            <div class="standard-row">
              <span class="rank intermediate">Intermedio</span>
              <span class="time">{{ benchmark.intermediateTime }}</span>
            </div>
            <div class="standard-row">
              <span class="rank beginner">Principiante</span>
              <span class="time">{{ benchmark.beginnerTime }}</span>
            </div>
          </div>
          
          <div class="rx-weights">
            <div class="rx-item">
              <q-icon name="male" size="16px" />
              <span>{{ benchmark.rxWeightMale }}</span>
            </div>
            <div class="rx-item">
              <q-icon name="female" size="16px" />
              <span>{{ benchmark.rxWeightFemale }}</span>
            </div>
          </div>
          
          <div class="benchmark-actions">
            <q-btn flat dense icon="play_circle" label="Ver WOD" color="grey-5" size="sm" no-caps @click="viewWOD(benchmark)" />
            <q-btn flat dense icon="edit" color="primary" size="sm" no-caps @click="editBenchmark(benchmark)">
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <q-btn flat dense icon="delete" color="negative" size="sm" no-caps @click="confirmDelete(benchmark)">
              <q-tooltip>Eliminar</q-tooltip>
            </q-btn>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Dialog -->
    <q-dialog v-model="benchmarkDialog" persistent>
      <q-card class="benchmark-dialog">
        <q-card-section class="dialog-header">
          <h3>{{ isEditing ? 'Editar Benchmark' : 'Nuevo Benchmark' }}</h3>
          <q-btn flat round icon="close" v-close-popup />
        </q-card-section>

        <q-card-section class="dialog-content">
          <q-input v-model="benchmarkForm.name" label="Nombre del WOD *" outlined dense dark class="q-mb-md" />
          
          <q-select 
            v-model="benchmarkForm.benchmarkType" 
            :options="typeSelectOptions" 
            label="Tipo *" 
            outlined 
            dense 
            dark 
            class="q-mb-md"
            emit-value
            map-options
          />
          
          <q-input 
            v-model="benchmarkForm.target" 
            label="Descripción del WOD *" 
            outlined 
            dense 
            dark 
            class="q-mb-md"
            hint="Ej: 21-15-9 reps for time"
          />
          
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-6">
              <q-input 
                v-model="benchmarkForm.rxWeightMale" 
                label="RX Hombre" 
                outlined 
                dense 
                dark
                hint="Ej: Thrusters 43kg"
              />
            </div>
            <div class="col-6">
              <q-input 
                v-model="benchmarkForm.rxWeightFemale" 
                label="RX Mujer" 
                outlined 
                dense 
                dark
                hint="Ej: Thrusters 29kg"
              />
            </div>
          </div>

          <div class="time-standards-input q-mb-md">
            <label class="section-label">Estándares de Tiempo</label>
            <div class="row q-col-gutter-sm">
              <div class="col-3">
                <q-input v-model="benchmarkForm.eliteTime" label="Élite" outlined dense dark />
              </div>
              <div class="col-3">
                <q-input v-model="benchmarkForm.advancedTime" label="Avanzado" outlined dense dark />
              </div>
              <div class="col-3">
                <q-input v-model="benchmarkForm.intermediateTime" label="Intermedio" outlined dense dark />
              </div>
              <div class="col-3">
                <q-input v-model="benchmarkForm.beginnerTime" label="Principiante" outlined dense dark />
              </div>
            </div>
          </div>
          
          <q-toggle 
            v-model="benchmarkForm.isBenchmark" 
            label="Activar como Benchmark (genera logros)" 
            color="orange" 
            dark 
            left-label 
          />
        </q-card-section>

        <q-card-section class="dialog-footer">
          <q-btn flat label="Cancelar" color="grey-6" v-close-popup />
          <q-btn color="primary" :label="isEditing ? 'Guardar' : 'Crear'" :loading="saving" @click="saveBenchmark" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { trainingService } from '@/services/trainings'

const $q = useQuasar()

const loading = ref(false)
const benchmarks = ref([])
const searchQuery = ref('')
const typeFilter = ref('all')
const benchmarkDialog = ref(false)
const saving = ref(false)
const isEditing = ref(false)

const benchmarkForm = ref({
  id: null,
  name: '',
  benchmarkType: 'girl',
  target: '',
  rxWeightMale: '',
  rxWeightFemale: '',
  eliteTime: '',
  advancedTime: '',
  intermediateTime: '',
  beginnerTime: '',
  isBenchmark: true
})

const typeOptions = [
  { label: 'Todos', value: 'all' },
  { label: 'The Girls', value: 'girl', color: 'pink' },
  { label: 'Hero WODs', value: 'hero', color: 'purple' },
]

const typeSelectOptions = [
  { label: 'The Girl', value: 'girl' },
  { label: 'Hero WOD', value: 'hero' },
  { label: 'Benchmark', value: 'benchmark' },
]

const formatType = (type) => {
  const labels = { girl: 'The Girl', hero: 'Hero WOD', benchmark: 'Benchmark' }
  return labels[type] || type
}

const getTypeColor = (type) => {
  const colors = { girl: 'pink', hero: 'purple', benchmark: 'orange' }
  return colors[type] || 'grey'
}

const filteredBenchmarks = computed(() => {
  let result = benchmarks.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(b => b.name?.toLowerCase().includes(query))
  }

  if (typeFilter.value !== 'all') {
    result = result.filter(b => b.benchmarkType === typeFilter.value)
  }

  return result.sort((a, b) => a.name.localeCompare(b.name))
})

const girlCount = computed(() => benchmarks.value.filter(b => b.benchmarkType === 'girl').length)
const heroCount = computed(() => benchmarks.value.filter(b => b.benchmarkType === 'hero').length)

const fetchBenchmarks = async () => {
  loading.value = true
  try {
    const response = await trainingService.getBenchmarks()
    // API Platform format
    const data = Array.isArray(response) ? response : (response.member || response['hydra:member'] || [])
    benchmarks.value = data.map(b => ({
      id: b.id,
      name: b.name,
      benchmarkType: b.benchmarkType || b.benchmark_type,
      target: b.target,
      rxWeightMale: b.rxWeightMale || b.rx_weight_male,
      rxWeightFemale: b.rxWeightFemale || b.rx_weight_female,
      eliteTime: b.eliteTime || b.elite_time,
      advancedTime: b.advancedTime || b.advanced_time,
      intermediateTime: b.intermediateTime || b.intermediate_time,
      beginnerTime: b.beginnerTime || b.beginner_time,
      isBenchmark: b.isBenchmark || b.is_benchmark
    }))
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Error al cargar benchmarks' })
  } finally {
    loading.value = false
  }
}

const openCreateDialog = () => {
  isEditing.value = false
  benchmarkForm.value = {
    id: null,
    name: '',
    benchmarkType: 'girl',
    target: '',
    rxWeightMale: '',
    rxWeightFemale: '',
    eliteTime: '',
    advancedTime: '',
    intermediateTime: '',
    beginnerTime: '',
    isBenchmark: true
  }
  benchmarkDialog.value = true
}

const editBenchmark = (benchmark) => {
  isEditing.value = true
  benchmarkForm.value = { ...benchmark }
  benchmarkDialog.value = true
}

const saveBenchmark = async () => {
  saving.value = true
  try {
    await new Promise(r => setTimeout(r, 800))
    if (isEditing.value) {
      const index = benchmarks.value.findIndex(b => b.id === benchmarkForm.value.id)
      if (index !== -1) benchmarks.value[index] = { ...benchmarkForm.value }
      $q.notify({ type: 'positive', message: 'Benchmark actualizado' })
    } else {
      benchmarks.value.push({ ...benchmarkForm.value, id: Date.now() })
      $q.notify({ type: 'positive', message: 'Benchmark creado' })
    }
    benchmarkDialog.value = false
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Error al guardar' })
  } finally {
    saving.value = false
  }
}

const viewWOD = (benchmark) => {
  // Navegar al detalle del WOD
  console.log('Ver WOD:', benchmark.name)
}

const confirmDelete = (benchmark) => {
  $q.dialog({
    title: 'Confirmar',
    message: `¿Eliminar benchmark "${benchmark.name}"?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    benchmarks.value = benchmarks.value.filter(b => b.id !== benchmark.id)
    $q.notify({ type: 'positive', message: 'Benchmark eliminado' })
  })
}

onMounted(fetchBenchmarks)
</script>

<style scoped>
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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

.filters-container {
  background: linear-gradient(135deg, #1c2128 0%, #161b22 100%);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.search-wrapper {
  margin-bottom: 16px;
}

.search-box-modern {
  position: relative;
  display: flex;
  align-items: center;
  background: #0d1117;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 4px;
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

.filter-groups-modern {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.filter-category {
  display: flex;
  align-items: center;
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

.filter-pill.active.pink { background: #ff6b9d; border-color: #ff6b9d; color: #0d1117; }
.filter-pill.active.purple { background: #a371f7; border-color: #a371f7; color: #fff; }

.benchmarks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 20px;
}

.benchmark-card {
  background: linear-gradient(135deg, #1c2128 0%, #161b22 100%);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s;
}

.benchmark-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 143, 56, 0.3);
}

.benchmark-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.type-chip {
  font-weight: 600;
  text-transform: capitalize;
}

.benchmark-difficulty {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 143, 56, 0.1);
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  color: #ff8f38;
}

.benchmark-name {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 8px;
}

.benchmark-description {
  font-size: 14px;
  color: #8b949e;
  margin: 0 0 16px;
}

.time-standards {
  background: #0d1117;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 16px;
}

.standard-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.standard-row:last-child {
  border-bottom: none;
}

.rank {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
}

.rank.elite { background: #ffd700; color: #0d1117; }
.rank.advanced { background: #c0c0c0; color: #0d1117; }
.rank.intermediate { background: #cd7f32; color: #fff; }
.rank.beginner { background: #4a9eff; color: #fff; }

.time {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
}

.rx-weights {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.rx-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #8b949e;
}

.benchmark-actions {
  display: flex;
  gap: 8px;
}

.benchmark-dialog {
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

.section-label {
  display: block;
  font-size: 13px;
  color: #8b949e;
  margin-bottom: 12px;
  text-transform: uppercase;
}

.dialog-footer {
  padding: 16px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 80px 20px;
  color: #8b949e;
}

@media (max-width: 768px) {
  .benchmarks-grid {
    grid-template-columns: 1fr;
  }
  
  .benchmark-dialog {
    min-width: auto;
    width: 90vw;
  }
}
</style>
