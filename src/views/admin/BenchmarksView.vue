<template>
  <q-page class="page-container">
    <div class="page-content">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Benchmarks CrossFit</h1>
          <p class="page-subtitle">WODs con estándares de tiempo para medir progreso</p>
        </div>
        <q-btn
          color="primary"
          icon="add"
          label="Nuevo Benchmark"
          class="action-btn"
          no-caps
          @click="openCreateDialog"
        />
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
            />
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
                :class="{ active: typeFilter === type.value, [type.color]: true }"
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
        <template v-if="loading">
          <div v-for="i in 6" :key="i" class="benchmark-card skeleton">
            <q-skeleton type="text" class="bg-grey-8" width="60%" />
            <q-skeleton type="text" class="bg-grey-8" width="80%" />
            <q-skeleton type="text" class="bg-grey-8" width="40%" />
          </div>
        </template>

        <div v-else-if="filteredBenchmarks.length === 0" class="empty-state">
          <q-icon name="timer" size="64px" color="grey-6" />
          <h3>No hay benchmarks</h3>
          <p>Crea tu primer WOD benchmark</p>
          <q-btn
            color="primary"
            icon="add"
            label="Crear Benchmark"
            no-caps
            @click="openCreateDialog"
          />
        </div>

        <div v-for="benchmark in filteredBenchmarks" :key="benchmark.id" class="benchmark-card">
          <div class="benchmark-header">
            <q-chip
              size="sm"
              :color="getTypeColor(benchmark.type)"
              text-color="white"
              class="type-chip"
            >
              {{ formatType(benchmark.type) }}
            </q-chip>
            <div class="benchmark-meta">
              <q-icon name="fitness_center" size="14px" color="orange" />
              <span>{{ benchmark.exercises?.length || 0 }} ejercicios</span>
            </div>
          </div>

          <h3 class="benchmark-name">{{ benchmark.name }}</h3>
          <p class="benchmark-description">
            {{ benchmark.description || 'Sin descripción' }}
          </p>

          <!-- Ejercicios del WOD -->
          <div v-if="benchmark.exercises?.length" class="exercise-list">
            <div v-for="ex in benchmark.exercises" :key="ex.position" class="exercise-item">
              <span class="exercise-position">{{ ex.position }}.</span>
              <span class="exercise-name">{{ ex.exercise?.name }}</span>
              <span v-if="ex.reps" class="exercise-detail">{{ ex.reps }} reps</span>
              <span v-if="ex.distanceMeters" class="exercise-detail"
                >{{ ex.distanceMeters }} m</span
              >
              <span v-if="ex.durationSeconds" class="exercise-detail"
                >{{ ex.durationSeconds }} s</span
              >
              <span v-if="ex.calories" class="exercise-detail">{{ ex.calories }} cal</span>
              <span v-if="ex.rxWeightMale || ex.rxWeightFemale" class="exercise-rx">
                @ {{ ex.rxWeightMale || '—' }} / {{ ex.rxWeightFemale || '—' }}
              </span>
            </div>
          </div>

          <!-- Tiempos -->
          <div class="time-standards">
            <div class="standard-row header-row">
              <span class="rank-label">Rango</span>
              <span class="time-male">♂</span>
              <span class="time-female">♀</span>
            </div>
            <div class="standard-row">
              <span class="rank elite">Élite</span>
              <span class="time">{{ benchmark.eliteTimeMale || '-' }}</span>
              <span class="time">{{ benchmark.eliteTimeFemale || '-' }}</span>
            </div>
            <div class="standard-row">
              <span class="rank advanced">Avanzado</span>
              <span class="time">{{ benchmark.advancedTimeMale || '-' }}</span>
              <span class="time">{{ benchmark.advancedTimeFemale || '-' }}</span>
            </div>
            <div class="standard-row">
              <span class="rank intermediate">Intermedio</span>
              <span class="time">{{ benchmark.intermediateTimeMale || '-' }}</span>
              <span class="time">{{ benchmark.intermediateTimeFemale || '-' }}</span>
            </div>
            <div class="standard-row">
              <span class="rank beginner">Principiante</span>
              <span class="time">{{ benchmark.beginnerTimeMale || '-' }}</span>
              <span class="time">{{ benchmark.beginnerTimeFemale || '-' }}</span>
            </div>
          </div>

          <div class="benchmark-actions">
            <q-btn
              flat
              dense
              icon="visibility"
              color="grey-5"
              size="sm"
              no-caps
              @click="openPreview(benchmark)"
            >
              <q-tooltip>Previsualizar</q-tooltip>
            </q-btn>
            <q-btn
              flat
              dense
              icon="edit"
              color="primary"
              size="sm"
              no-caps
              @click="editBenchmark(benchmark)"
            >
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <q-btn
              flat
              dense
              icon="delete"
              color="negative"
              size="sm"
              no-caps
              @click="confirmDelete(benchmark)"
            >
              <q-tooltip>Eliminar</q-tooltip>
            </q-btn>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview Dialog -->
    <q-dialog v-model="previewDialog">
      <q-card class="benchmark-dialog" style="max-width: 600px; width: 90vw">
        <q-card-section class="dialog-header">
          <div>
            <h3>{{ previewBenchmark?.name }}</h3>
            <q-chip size="sm" :color="getTypeColor(previewBenchmark?.type)" text-color="white">
              {{ formatType(previewBenchmark?.type) }}
            </q-chip>
          </div>
          <q-btn flat round icon="close" v-close-popup />
        </q-card-section>

        <q-card-section class="dialog-content">
          <pre class="description-text">{{ previewBenchmark?.description }}</pre>

          <div v-if="previewBenchmark?.exercises?.length" class="preview-exercises">
            <h4>Estructura</h4>
            <div
              v-for="ex in previewBenchmark.exercises"
              :key="ex.position"
              class="preview-exercise-item"
            >
              <span class="pos">{{ ex.position }}.</span>
              <span class="name">{{ ex.exercise?.name }}</span>
              <span class="detail">
                <template v-if="ex.reps">{{ ex.reps }} reps</template>
                <template v-if="ex.distanceMeters">{{ ex.distanceMeters }} m</template>
                <template v-if="ex.durationSeconds">{{ ex.durationSeconds }} s</template>
                <template v-if="ex.calories">{{ ex.calories }} cal</template>
                <template v-if="ex.rxWeightMale || ex.rxWeightFemale">
                  @ {{ ex.rxWeightMale || '—' }} / {{ ex.rxWeightFemale || '—' }}
                </template>
              </span>
            </div>
          </div>

          <div v-if="previewBenchmark?.scalingOptions" class="preview-scaling">
            <h4>Escalado</h4>
            <pre class="scaling-text">{{ previewBenchmark.scalingOptions }}</pre>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Create/Edit Dialog -->
    <q-dialog v-model="benchmarkDialog" persistent maximized>
      <q-card class="benchmark-dialog fullscreen-dialog">
        <q-card-section class="dialog-header">
          <h3>{{ isEditing ? 'Editar Benchmark' : 'Nuevo Benchmark' }}</h3>
          <q-btn flat round icon="close" v-close-popup />
        </q-card-section>

        <q-card-section class="dialog-content">
          <q-tabs
            v-model="activeTab"
            dense
            class="text-grey-5"
            active-color="primary"
            indicator-color="primary"
          >
            <q-tab name="general" icon="info" label="General" />
            <q-tab name="structure" icon="fitness_center" label="Estructura" />
            <q-tab name="times" icon="timer" label="Tiempos" />
            <q-tab name="scaling" icon="trending_down" label="Escalado" />
          </q-tabs>

          <q-separator dark class="q-my-md" />

          <q-tab-panels v-model="activeTab" animated class="bg-transparent">
            <!-- TAB: GENERAL -->
            <q-tab-panel name="general">
              <q-input
                v-model="benchmarkForm.name"
                label="Nombre del WOD *"
                outlined
                dense
                dark
                class="q-mb-md"
                :rules="[(val) => !!val || 'El nombre es obligatorio']"
              />

              <q-select
                v-model="benchmarkForm.type"
                :options="typeSelectOptions"
                label="Tipo *"
                outlined
                dense
                dark
                class="q-mb-md"
                emit-value
                map-options
                :rules="[(val) => !!val || 'El tipo es obligatorio']"
              />

              <q-input
                v-model="benchmarkForm.description"
                label="Descripción del WOD"
                outlined
                dense
                dark
                class="q-mb-md"
                type="textarea"
                rows="6"
                hint="Describe el WOD paso a paso. Se respetan los saltos de línea."
              />

              <q-input
                v-model="benchmarkForm.videoUrl"
                label="URL del vídeo tutorial"
                outlined
                dense
                dark
                hint="Ej: https://youtube.com/watch?v=..."
              />
            </q-tab-panel>

            <!-- TAB: ESTRUCTURA -->
            <q-tab-panel name="structure">
              <div class="section-header">
                <span class="section-label">Ejercicios del WOD</span>
                <q-btn
                  color="primary"
                  icon="add"
                  label="Añadir ejercicio"
                  size="sm"
                  no-caps
                  dense
                  @click="addExercise"
                />
              </div>

              <div v-if="benchmarkForm.exercises.length === 0" class="empty-exercises">
                <q-icon name="fitness_center" size="48px" color="grey-7" />
                <p>No hay ejercicios añadidos</p>
              </div>

              <div
                v-for="(ex, index) in benchmarkForm.exercises"
                :key="index"
                class="exercise-form-row"
              >
                <div class="exercise-form-header">
                  <span class="exercise-number">#{{ ex.position }}</span>
                  <q-space />
                  <q-btn
                    flat
                    dense
                    round
                    icon="arrow_upward"
                    size="sm"
                    color="grey-5"
                    :disable="index === 0"
                    @click="moveExercise(index, -1)"
                  >
                    <q-tooltip>Subir</q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    dense
                    round
                    icon="arrow_downward"
                    size="sm"
                    color="grey-5"
                    :disable="index === benchmarkForm.exercises.length - 1"
                    @click="moveExercise(index, 1)"
                  >
                    <q-tooltip>Bajar</q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    dense
                    round
                    icon="delete"
                    size="sm"
                    color="negative"
                    @click="removeExercise(index)"
                  >
                    <q-tooltip>Eliminar</q-tooltip>
                  </q-btn>
                </div>

                <div class="row q-col-gutter-sm">
                  <div class="col-12 col-md-4">
                    <q-select
                      v-model="ex.exerciseId"
                      :options="availableExercises"
                      option-value="id"
                      option-label="name"
                      label="Ejercicio *"
                      outlined
                      dense
                      dark
                      emit-value
                      map-options
                      :rules="[(val) => !!val || 'Selecciona un ejercicio']"
                    />
                  </div>
                  <div class="col-6 col-md-2">
                    <q-input
                      v-model.number="ex.reps"
                      label="Reps"
                      outlined
                      dense
                      dark
                      type="number"
                    />
                  </div>
                  <div class="col-6 col-md-2">
                    <q-input
                      v-model.number="ex.distanceMeters"
                      label="Distancia (m)"
                      outlined
                      dense
                      dark
                      type="number"
                    />
                  </div>
                  <div class="col-6 col-md-2">
                    <q-input v-model="ex.rxWeightMale" label="Peso RX ♂" outlined dense dark />
                  </div>
                  <div class="col-6 col-md-2">
                    <q-input v-model="ex.rxWeightFemale" label="Peso RX ♀" outlined dense dark />
                  </div>
                </div>
              </div>
            </q-tab-panel>

            <!-- TAB: TIEMPOS -->
            <q-tab-panel name="times">
              <label class="section-label">Estándares de Tiempo</label>

              <div class="times-grid">
                <div class="time-level-row">
                  <span class="rank elite">Élite</span>
                  <q-input
                    v-model="benchmarkForm.eliteTimeMale"
                    label="Hombre ♂"
                    outlined
                    dense
                    dark
                  />
                  <q-input
                    v-model="benchmarkForm.eliteTimeFemale"
                    label="Mujer ♀"
                    outlined
                    dense
                    dark
                  />
                </div>
                <div class="time-level-row">
                  <span class="rank advanced">Avanzado</span>
                  <q-input
                    v-model="benchmarkForm.advancedTimeMale"
                    label="Hombre ♂"
                    outlined
                    dense
                    dark
                  />
                  <q-input
                    v-model="benchmarkForm.advancedTimeFemale"
                    label="Mujer ♀"
                    outlined
                    dense
                    dark
                  />
                </div>
                <div class="time-level-row">
                  <span class="rank intermediate">Intermedio</span>
                  <q-input
                    v-model="benchmarkForm.intermediateTimeMale"
                    label="Hombre ♂"
                    outlined
                    dense
                    dark
                  />
                  <q-input
                    v-model="benchmarkForm.intermediateTimeFemale"
                    label="Mujer ♀"
                    outlined
                    dense
                    dark
                  />
                </div>
                <div class="time-level-row">
                  <span class="rank beginner">Principiante</span>
                  <q-input
                    v-model="benchmarkForm.beginnerTimeMale"
                    label="Hombre ♂"
                    outlined
                    dense
                    dark
                  />
                  <q-input
                    v-model="benchmarkForm.beginnerTimeFemale"
                    label="Mujer ♀"
                    outlined
                    dense
                    dark
                  />
                </div>
              </div>
            </q-tab-panel>

            <!-- TAB: ESCALADO -->
            <q-tab-panel name="scaling">
              <q-input
                v-model="benchmarkForm.scalingOptions"
                label="Opciones de escalado"
                outlined
                dense
                dark
                type="textarea"
                rows="8"
                hint="Describe las opciones de escalado para cada nivel (RX, Intermediate, Beginner)"
              />
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>

        <q-card-section class="dialog-footer">
          <q-btn flat label="Cancelar" color="grey-6" v-close-popup />
          <q-btn
            color="primary"
            :label="isEditing ? 'Guardar cambios' : 'Crear benchmark'"
            :loading="saving"
            @click="saveBenchmark"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { benchmarkService } from '@/services/benchmarks'
import { exerciseService } from '@/services/exercises'

const $q = useQuasar()

const loading = ref(false)
const benchmarks = ref([])
const searchQuery = ref('')
const typeFilter = ref('all')
const benchmarkDialog = ref(false)
const previewDialog = ref(false)
const saving = ref(false)
const isEditing = ref(false)
const activeTab = ref('general')
const availableExercises = ref([])
const previewBenchmark = ref(null)

const benchmarkForm = ref({
  id: null,
  name: '',
  type: 'girl',
  description: '',
  rxWeightMale: '',
  rxWeightFemale: '',
  eliteTimeMale: '',
  eliteTimeFemale: '',
  advancedTimeMale: '',
  advancedTimeFemale: '',
  intermediateTimeMale: '',
  intermediateTimeFemale: '',
  beginnerTimeMale: '',
  beginnerTimeFemale: '',
  videoUrl: '',
  scalingOptions: '',
  exercises: [],
})

const typeOptions = [
  { label: 'Todos', value: 'all' },
  { label: 'The Girls', value: 'girl', color: 'pink' },
  { label: 'Hero WODs', value: 'hero', color: 'purple' },
  { label: 'Benchmarks', value: 'benchmark', color: 'orange' },
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
    result = result.filter((b) => b.name?.toLowerCase().includes(query))
  }

  if (typeFilter.value !== 'all') {
    result = result.filter((b) => b.type === typeFilter.value)
  }

  return result.sort((a, b) => a.name.localeCompare(b.name))
})

const girlCount = computed(() => benchmarks.value.filter((b) => b.type === 'girl').length)
const heroCount = computed(() => benchmarks.value.filter((b) => b.type === 'hero').length)

const fetchBenchmarks = async () => {
  loading.value = true
  try {
    const data = await benchmarkService.getAll()
    benchmarks.value = Array.isArray(data) ? data : data.member || data['hydra:member'] || []
  } catch (err) {
    $q.notify({ type: 'negative', message: 'Error al cargar benchmarks' })
    console.error(err)
  } finally {
    loading.value = false
  }
}

const fetchExercises = async () => {
  try {
    const data = await exerciseService.getAll()
    availableExercises.value = Array.isArray(data)
      ? data
      : data.member || data['hydra:member'] || []
  } catch (err) {
    console.error('Error cargando ejercicios:', err)
  }
}

const openCreateDialog = () => {
  isEditing.value = false
  activeTab.value = 'general'
  benchmarkForm.value = {
    id: null,
    name: '',
    type: 'girl',
    description: '',
    rxWeightMale: '',
    rxWeightFemale: '',
    eliteTimeMale: '',
    eliteTimeFemale: '',
    advancedTimeMale: '',
    advancedTimeFemale: '',
    intermediateTimeMale: '',
    intermediateTimeFemale: '',
    beginnerTimeMale: '',
    beginnerTimeFemale: '',
    videoUrl: '',
    scalingOptions: '',
    exercises: [],
  }
  benchmarkDialog.value = true
}

const editBenchmark = (benchmark) => {
  isEditing.value = true
  activeTab.value = 'general'
  benchmarkForm.value = {
    ...benchmark,
    exercises: benchmark.exercises
      ? benchmark.exercises.map((ex) => ({
          exerciseId: ex.exercise?.id || ex.exerciseId,
          position: ex.position,
          reps: ex.reps,
          distanceMeters: ex.distanceMeters,
          durationSeconds: ex.durationSeconds,
          calories: ex.calories,
          rxWeightMale: ex.rxWeightMale || '',
          rxWeightFemale: ex.rxWeightFemale || '',
          restSeconds: ex.restSeconds,
        }))
      : [],
  }
  benchmarkDialog.value = true
}

const addExercise = () => {
  benchmarkForm.value.exercises.push({
    exerciseId: null,
    position: benchmarkForm.value.exercises.length + 1,
    reps: null,
    distanceMeters: null,
    durationSeconds: null,
    calories: null,
    rxWeightMale: '',
    rxWeightFemale: '',
    restSeconds: null,
  })
}

const removeExercise = (index) => {
  benchmarkForm.value.exercises.splice(index, 1)
  reindexExercises()
}

const moveExercise = (index, direction) => {
  const exercises = benchmarkForm.value.exercises
  const newIndex = index + direction
  if (newIndex < 0 || newIndex >= exercises.length) return
  const temp = exercises[index]
  exercises[index] = exercises[newIndex]
  exercises[newIndex] = temp
  reindexExercises()
}

const reindexExercises = () => {
  benchmarkForm.value.exercises.forEach((ex, idx) => {
    ex.position = idx + 1
  })
}

const saveBenchmark = async () => {
  if (!benchmarkForm.value.name || !benchmarkForm.value.type) {
    $q.notify({ type: 'warning', message: 'Nombre y tipo son obligatorios' })
    activeTab.value = 'general'
    return
  }

  const payload = {
    name: benchmarkForm.value.name,
    type: benchmarkForm.value.type,
    description: benchmarkForm.value.description,
    rxWeightMale: benchmarkForm.value.rxWeightMale || null,
    rxWeightFemale: benchmarkForm.value.rxWeightFemale || null,
    eliteTimeMale: benchmarkForm.value.eliteTimeMale || null,
    eliteTimeFemale: benchmarkForm.value.eliteTimeFemale || null,
    advancedTimeMale: benchmarkForm.value.advancedTimeMale || null,
    advancedTimeFemale: benchmarkForm.value.advancedTimeFemale || null,
    intermediateTimeMale: benchmarkForm.value.intermediateTimeMale || null,
    intermediateTimeFemale: benchmarkForm.value.intermediateTimeFemale || null,
    beginnerTimeMale: benchmarkForm.value.beginnerTimeMale || null,
    beginnerTimeFemale: benchmarkForm.value.beginnerTimeFemale || null,
    videoUrl: benchmarkForm.value.videoUrl || null,
    scalingOptions: benchmarkForm.value.scalingOptions || null,
    exercises: benchmarkForm.value.exercises.map((ex) => ({
      exerciseId: ex.exerciseId,
      position: ex.position,
      reps: ex.reps,
      distanceMeters: ex.distanceMeters,
      durationSeconds: ex.durationSeconds,
      calories: ex.calories,
      rxWeightMale: ex.rxWeightMale || null,
      rxWeightFemale: ex.rxWeightFemale || null,
      restSeconds: ex.restSeconds,
    })),
  }

  saving.value = true
  try {
    if (isEditing.value) {
      await benchmarkService.update(benchmarkForm.value.id, payload)
      $q.notify({ type: 'positive', message: 'Benchmark actualizado' })
    } else {
      await benchmarkService.create(payload)
      $q.notify({ type: 'positive', message: 'Benchmark creado' })
    }
    benchmarkDialog.value = false
    await fetchBenchmarks()
  } catch (err) {
    const msg = err.response?.data?.message || err.message || 'Error al guardar'
    $q.notify({ type: 'negative', message: msg })
  } finally {
    saving.value = false
  }
}

const confirmDelete = (benchmark) => {
  $q.dialog({
    title: 'Confirmar',
    message: `¿Eliminar benchmark "${benchmark.name}"?`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await benchmarkService.delete(benchmark.id)
      $q.notify({ type: 'positive', message: 'Benchmark eliminado' })
      await fetchBenchmarks()
    } catch (err) {
      console.error(err)
      $q.notify({ type: 'negative', message: 'Error al eliminar benchmark' })
    }
  })
}

const openPreview = (benchmark) => {
  previewBenchmark.value = benchmark
  previewDialog.value = true
}

onMounted(() => {
  fetchBenchmarks()
  fetchExercises()
})
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

.filter-pill.active.pink {
  background: #ff6b9d;
  border-color: #ff6b9d;
  color: #0d1117;
}
.filter-pill.active.purple {
  background: #a371f7;
  border-color: #a371f7;
  color: #fff;
}
.filter-pill.active.orange {
  background: #ff8f38;
  border-color: #ff8f38;
  color: #0d1117;
}

.benchmarks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
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

.benchmark-meta {
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
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.exercise-list {
  background: #0d1117;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 16px;
}

.exercise-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  font-size: 13px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.exercise-item:last-child {
  border-bottom: none;
}

.exercise-position {
  color: #8b949e;
  min-width: 20px;
}

.exercise-name {
  color: #fff;
  font-weight: 600;
  flex: 1;
}

.exercise-detail {
  color: #ff8f38;
  font-weight: 600;
}

.exercise-rx {
  color: #8b949e;
  font-size: 12px;
}

.time-standards {
  background: #0d1117;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 16px;
}

.standard-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.standard-row:last-child {
  border-bottom: none;
}

.header-row {
  font-size: 11px;
  color: #8b949e;
  text-transform: uppercase;
  font-weight: 600;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 4px;
}

.rank {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  justify-self: start;
}

.rank.elite {
  background: #ffd700;
  color: #0d1117;
}
.rank.advanced {
  background: #c0c0c0;
  color: #0d1117;
}
.rank.intermediate {
  background: #cd7f32;
  color: #fff;
}
.rank.beginner {
  background: #4a9eff;
  color: #fff;
}

.time {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  text-align: center;
}

.benchmark-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.benchmark-dialog {
  background: linear-gradient(135deg, #1c2128 0%, #161b22 100%);
  border-radius: 20px;
}

.fullscreen-dialog {
  min-width: 800px;
  max-width: 900px;
  width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
}

.dialog-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #fff;
}

.dialog-content {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.section-label {
  display: block;
  font-size: 13px;
  color: #8b949e;
  margin-bottom: 12px;
  text-transform: uppercase;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.dialog-footer {
  padding: 16px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  flex-shrink: 0;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 80px 20px;
  color: #8b949e;
}

/* Exercise form */
.exercise-form-row {
  background: #0d1117;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.exercise-form-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.exercise-number {
  font-size: 14px;
  font-weight: 700;
  color: #ff8f38;
}

.empty-exercises {
  text-align: center;
  padding: 40px;
  color: #8b949e;
}

/* Times grid */
.times-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.time-level-row {
  display: grid;
  grid-template-columns: 120px 1fr 1fr;
  gap: 12px;
  align-items: center;
}

/* Preview */
.description-text {
  white-space: pre-wrap;
  color: #c9d1d9;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.6;
  background: transparent;
  border: none;
  padding: 0;
  margin: 0 0 20px;
}

.preview-exercises h4,
.preview-scaling h4 {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 12px;
}

.preview-exercise-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  font-size: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.preview-exercise-item .pos {
  color: #8b949e;
  min-width: 24px;
}

.preview-exercise-item .name {
  color: #fff;
  font-weight: 600;
  flex: 1;
}

.preview-exercise-item .detail {
  color: #ff8f38;
}

.scaling-text {
  white-space: pre-wrap;
  color: #8b949e;
  font-family: inherit;
  font-size: 13px;
  line-height: 1.6;
  background: #0d1117;
  padding: 12px;
  border-radius: 8px;
  margin: 0;
}

@media (max-width: 768px) {
  .benchmarks-grid {
    grid-template-columns: 1fr;
  }

  .fullscreen-dialog {
    min-width: auto;
    width: 95vw;
  }

  .time-level-row {
    grid-template-columns: 80px 1fr 1fr;
  }
}
</style>
