<template>
  <div class="training-builder">
    <!-- Header -->
    <div class="builder-header">
      <div class="header-title">
        <q-btn
          flat
          round
          icon="arrow_back"
          color="grey-5"
          class="q-mr-sm"
          @click="$emit('cancel')"
        />
        <div>
          <h2>{{ isEditing ? 'Editar Entrenamiento' : 'Nuevo Entrenamiento' }}</h2>
          <p class="text-grey-5">{{ form.name || 'Sin nombre' }}</p>
        </div>
      </div>
      <div class="header-actions">
        <q-btn
          flat
          icon="visibility"
          label="Vista previa"
          color="grey-5"
          @click="previewOpen = true"
        />
        <q-btn
          color="primary"
          icon="save"
          label="Guardar"
          :loading="saving"
          @click="saveTraining"
        />
      </div>
    </div>

    <div class="builder-grid">
      <!-- Panel izquierdo: datos básicos -->
      <q-card class="builder-card" flat bordered>
        <q-card-section>
          <h3 class="section-title">Datos del Entrenamiento</h3>
          <div class="form-fields">
            <q-input v-model="form.name" label="Nombre" outlined dark dense />
            <q-select
              v-model="form.discipline"
              :options="disciplineOptions"
              label="Disciplina"
              outlined
              dark
              dense
              emit-value
              map-options
            />
            <q-select
              v-model="form.target"
              :options="targetOptions"
              label="Objetivo"
              outlined
              dark
              dense
              emit-value
              map-options
            />
            <q-input
              v-model.number="form.weekNumber"
              label="Fase"
              type="number"
              outlined
              dark
              dense
            />
            <q-input
              v-model="form.dayKey"
              label="Clave del ciclo"
              outlined
              dark
              dense
              hint="Ej: session_a"
            />
            <q-input
              v-model="form.sessionType"
              label="Tipo de sesión"
              outlined
              dark
              dense
              hint="Ej: strength, circuit, skill"
            />
          </div>
        </q-card-section>
      </q-card>

      <!-- Panel derecho: resumen -->
      <q-card class="builder-card" flat bordered>
        <q-card-section>
          <h3 class="section-title">Resumen</h3>
          <div class="stats-list">
            <div class="stat-item">
              <span class="stat-label">Rounds</span>
              <span class="stat-value">{{ form.rounds.length }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Ejercicios totales</span>
              <span class="stat-value">{{ totalExercises }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Duración est.</span>
              <span class="stat-value">{{ estimatedDuration }}</span>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Rounds -->
    <div class="rounds-section">
      <div class="section-header-row">
        <h3 class="section-title">Rounds y Ejercicios</h3>
        <q-btn color="primary" icon="add" label="Añadir Round" size="sm" @click="addRound" />
      </div>

      <div v-if="form.rounds.length === 0" class="empty-state">
        <q-icon name="fitness_center" size="48px" color="grey-7" />
        <p>No hay rounds definidos</p>
        <q-btn flat color="primary" label="Añadir primer round" @click="addRound" />
      </div>

      <div v-for="(round, roundIndex) in form.rounds" :key="roundIndex" class="round-card">
        <div class="round-header">
          <div class="round-title">
            <q-icon name="repeat" size="20px" color="primary" />
            <span>Round {{ roundIndex + 1 }}</span>
            <q-badge color="dark" class="round-badge"
              >{{ round.exercises.length }} ejercicios</q-badge
            >
          </div>
          <q-btn
            flat
            round
            dense
            icon="delete"
            color="negative"
            size="sm"
            @click="removeRound(roundIndex)"
          >
            <q-tooltip>Eliminar round</q-tooltip>
          </q-btn>
        </div>

        <div class="round-config">
          <q-input
            v-model.number="round.round"
            label="Número de round"
            type="number"
            outlined
            dark
            dense
            style="max-width: 140px"
          />
          <q-input
            v-model.number="round.restBetweenRounds"
            label="Descanso entre rounds (s)"
            type="number"
            outlined
            dark
            dense
            style="max-width: 180px"
          />
          <q-input
            v-model.number="round.restAfterBlock"
            label="Descanso después del bloque (s)"
            type="number"
            outlined
            dark
            dense
            style="max-width: 220px"
          />
        </div>

        <!-- Ejercicios del round -->
        <div class="exercises-section">
          <div v-if="round.exercises.length === 0" class="empty-state-small">
            <p class="text-grey-6">Sin ejercicios</p>
          </div>

          <div
            v-for="(ex, exIndex) in round.exercises"
            :key="exIndex"
            class="exercise-row"
            :class="{ 'has-error': exerciseHasError(roundIndex, exIndex) }"
          >
            <div class="exercise-number">{{ exIndex + 1 }}</div>

            <div class="exercise-fields">
              <q-select
                v-model="ex.exerciseId"
                :options="exerciseOptions"
                use-input
                input-debounce="200"
                @filter="filterExercises"
                label="Ejercicio *"
                outlined
                dark
                dense
                style="min-width: 220px; flex: 2"
                emit-value
                map-options
                :loading="exercisesStore.loading"
              />

              <q-input
                v-model.number="ex.reps"
                label="Reps"
                type="number"
                outlined
                dark
                dense
                style="max-width: 90px"
              />

              <q-input
                v-model.number="ex.maxTimeForReps"
                label="Tiempo (s)"
                type="number"
                outlined
                dark
                dense
                style="max-width: 100px"
                hint="Reps o Tiempo"
              />

              <q-input
                v-model.number="ex.sets"
                label="Series"
                type="number"
                outlined
                dark
                dense
                style="max-width: 80px"
              />

              <q-input
                v-model.number="ex.restBetweenSets"
                label="Descanso series (s)"
                type="number"
                outlined
                dark
                dense
                style="max-width: 130px"
              />

              <q-input
                v-model.number="ex.restBetweenExercises"
                label="Descanso ejercicios (s)"
                type="number"
                outlined
                dark
                dense
                style="max-width: 150px"
              />

              <q-input
                v-model.number="ex.weight"
                label="Peso %"
                type="number"
                outlined
                dark
                dense
                style="max-width: 90px"
              />

              <q-input
                v-model="ex.notes"
                label="Notas"
                outlined
                dark
                dense
                style="max-width: 160px"
              />
            </div>

            <q-btn
              flat
              round
              dense
              icon="delete"
              color="negative"
              size="sm"
              @click="removeExercise(roundIndex, exIndex)"
            >
              <q-tooltip>Eliminar ejercicio</q-tooltip>
            </q-btn>
          </div>

          <q-btn
            flat
            color="primary"
            icon="add"
            label="Añadir ejercicio"
            size="sm"
            class="q-mt-sm"
            @click="addExercise(roundIndex)"
          />
        </div>
      </div>
    </div>

    <!-- Preview Dialog -->
    <q-dialog v-model="previewOpen" maximized>
      <q-card class="preview-card">
        <q-card-section class="preview-header">
          <div class="header-left">
            <q-btn flat round icon="close" color="grey-6" v-close-popup />
            <div class="text-h6">Vista previa: {{ form.name || 'Sin nombre' }}</div>
          </div>
        </q-card-section>
        <q-card-section class="preview-body">
          <div v-if="previewBlocks.length === 0" class="empty-state">
            <p>No hay rounds para previsualizar</p>
          </div>
          <div v-for="(block, idx) in previewBlocks" :key="idx" class="preview-block">
            <h4 class="preview-block-title">{{ block.name }}</h4>
            <SessionBlock :block="block" />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useExercisesStore } from '@/stores/exercises'
import { calculateWorkoutTime } from '@/utils/api-adapters'
import SessionBlock from './SessionBlock.vue'

const props = defineProps({
  initialData: { type: Object, default: null },
  levelId: { type: Number, required: true },
})

const emit = defineEmits(['save', 'cancel'])

const exercisesStore = useExercisesStore()
const saving = ref(false)
const previewOpen = ref(false)

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

const isEditing = computed(() => !!props.initialData?.id)

const defaultRound = () => ({
  round: 1,
  restBetweenRounds: 60,
  restAfterBlock: null,
  exercises: [defaultExercise()],
})

const defaultExercise = () => ({
  exerciseId: null,
  reps: null,
  maxTimeForReps: null,
  sets: 1,
  restBetweenSets: 30,
  restBetweenExercises: 15,
  weight: null,
  notes: '',
})

const transformApiTrainingToForm = (data) => {
  if (!data) {
    return {
      name: '',
      discipline: 'calisthenics',
      target: 'strength',
      weekNumber: 1,
      dayKey: '',
      sessionType: '',
      rounds: [defaultRound()],
    }
  }

  const apiRounds = data.trainingRounds || []
  const rounds = apiRounds.map((r) => ({
    id: r.id ?? null,
    round: r.setsForRound ?? r.round ?? 1,
    restBetweenRounds: r.restBetweenRounds ?? 60,
    restAfterBlock: r.restAfterBlock ?? null,
    exercises: (r.trainingExerciseConfigurations || []).map((cfg) => ({
      id: cfg.id ?? null,
      exerciseId: cfg.exercise?.id ?? null,
      reps: cfg.reps ?? null,
      maxTimeForReps: cfg.maxTimeForReps ?? null,
      sets: cfg.setsForExercise ?? 1,
      restBetweenSets: cfg.restBetweenSets ?? 30,
      restBetweenExercises: cfg.restBetweenExercises ?? 15,
      weight: cfg.weight ?? null,
      notes: cfg.notes ?? '',
    })),
  }))

  return {
    name: data.name || '',
    discipline: data.discipline?.value || data.discipline || 'calisthenics',
    target: data.target?.value || data.target || 'strength',
    weekNumber: data.weekNumber ?? 1,
    dayKey: data.dayKey || '',
    sessionType: data.sessionType || '',
    rounds: rounds.length > 0 ? rounds : [defaultRound()],
  }
}

const form = ref(transformApiTrainingToForm(props.initialData))

const totalExercises = computed(() =>
  form.value.rounds.reduce((sum, r) => sum + r.exercises.length, 0),
)

const getExerciseName = (id) => {
  const ex = exercisesStore.exercises.find((e) => e.id === id)
  return ex?.name || `Ejercicio #${id}`
}

const estimatedDuration = computed(() => {
  const blocks = form.value.rounds.map((r) => ({
    isCircuit: false,
    circuitConfig: {
      rounds: r.round,
      restBetweenRounds: `${r.restBetweenRounds}s`,
      restBetweenExercises: `${r.exercises[0]?.restBetweenExercises || 15}s`,
    },
    exercises: r.exercises.map((ex) => ({
      reps: ex.reps ? String(ex.reps) : ex.maxTimeForReps ? `${ex.maxTimeForReps}s` : '1',
      sets: ex.sets || 1,
      restBetweenSets: `${ex.restBetweenSets || 30}s`,
    })),
  }))
  const time = calculateWorkoutTime({ blocks })
  return time.min > 0 ? `${time.min}-${time.max} min` : '—'
})

const previewBlocks = computed(() =>
  form.value.rounds.map((r, idx) => ({
    name: `Ronda ${idx + 1}`,
    isCircuit: r.round > 1,
    circuitConfig: {
      rounds: r.round,
      restBetweenRounds: `${r.restBetweenRounds}s`,
      restBetweenExercises: `${r.exercises[0]?.restBetweenExercises || 15}s`,
    },
    exercises: r.exercises.map((ex) => ({
      id: ex.exerciseId,
      name: getExerciseName(ex.exerciseId),
      reps: ex.reps ? String(ex.reps) : ex.maxTimeForReps ? `${ex.maxTimeForReps}s` : '',
      sets: ex.sets || 1,
      restBetweenSets: `${ex.restBetweenSets || 30}s`,
      notes: ex.notes || '',
    })),
    restAfterBlock: r.restAfterBlock ? `${r.restAfterBlock}s` : null,
  })),
)

const exerciseOptions = ref([])

const filterExercises = (val, update) => {
  update(() => {
    const needle = val.toLowerCase()
    exerciseOptions.value = exercisesStore.exercises
      .filter((e) => e.name.toLowerCase().includes(needle))
      .map((e) => ({ label: e.name, value: e.id }))
  })
}

const addRound = () => {
  form.value.rounds.push(defaultRound())
}

const removeRound = (index) => {
  form.value.rounds.splice(index, 1)
}

const addExercise = (roundIndex) => {
  form.value.rounds[roundIndex].exercises.push(defaultExercise())
}

const removeExercise = (roundIndex, exIndex) => {
  form.value.rounds[roundIndex].exercises.splice(exIndex, 1)
}

const exerciseHasError = (roundIndex, exIndex) => {
  const ex = form.value.rounds[roundIndex].exercises[exIndex]
  if (!ex.exerciseId) return true
  if (ex.reps == null && ex.maxTimeForReps == null) return true
  if (ex.reps != null && ex.maxTimeForReps != null) return true
  return false
}

const validateForm = () => {
  if (!form.value.name.trim()) return 'El nombre es obligatorio'
  if (form.value.rounds.length === 0) return 'Debe haber al menos un round'
  for (let ri = 0; ri < form.value.rounds.length; ri++) {
    const round = form.value.rounds[ri]
    if (round.exercises.length === 0) return `Round ${ri + 1}: debe tener al menos un ejercicio`
    for (let ei = 0; ei < round.exercises.length; ei++) {
      const ex = round.exercises[ei]
      if (!ex.exerciseId) return `Round ${ri + 1}, Ej. ${ei + 1}: selecciona un ejercicio`
      if (ex.reps == null && ex.maxTimeForReps == null) {
        return `Round ${ri + 1}, Ej. ${ei + 1}: indica reps o tiempo`
      }
      if (ex.reps != null && ex.maxTimeForReps != null) {
        return `Round ${ri + 1}, Ej. ${ei + 1}: solo reps O tiempo, no ambos`
      }
    }
  }
  return null
}

const buildPayload = () => {
  return {
    name: form.value.name,
    discipline: form.value.discipline,
    target: form.value.target,
    trainingLevelId: props.levelId,
    weekNumber: form.value.weekNumber || null,
    dayKey: form.value.dayKey || null,
    sessionType: form.value.sessionType || null,
    rounds: form.value.rounds.map((r) => ({
      id: r.id || null,
      round: r.round,
      restBetweenRounds: r.restBetweenRounds ?? 60,
      exercises: r.exercises.map((ex) => ({
        id: ex.id || null,
        exerciseId: ex.exerciseId,
        reps: ex.reps ?? null,
        maxTimeForReps: ex.maxTimeForReps ?? null,
        sets: ex.sets ?? 1,
        restBetweenSets: ex.restBetweenSets ?? 30,
        restBetweenExercises: ex.restBetweenExercises ?? 15,
        weight: ex.weight ?? null,
      })),
    })),
  }
}

const saveTraining = async () => {
  const errorMsg = validateForm()
  if (errorMsg) {
    emit('save', { error: errorMsg })
    return
  }
  saving.value = true
  try {
    const payload = buildPayload()
    emit('save', { payload, isEditing: isEditing.value })
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  if (exercisesStore.exercises.length === 0) {
    await exercisesStore.fetchExercises()
  }
  exerciseOptions.value = exercisesStore.exercises.map((e) => ({ label: e.name, value: e.id }))
})
</script>

<style scoped>
.training-builder {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.builder-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  display: flex;
  align-items: center;
}

.builder-header h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #fff;
}

.builder-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.builder-card {
  background: #1c2128;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 16px;
}

.form-fields {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.stats-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
}

.stat-label {
  color: #8b949e;
  font-size: 14px;
}

.stat-value {
  color: #fff;
  font-weight: 600;
  font-size: 16px;
}

.rounds-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.round-card {
  background: #1c2128;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 20px;
}

.round-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.round-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
}

.round-badge {
  font-size: 11px;
  padding: 2px 8px;
}

.round-config {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.exercises-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.exercise-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  transition: border-color 0.2s;
}

.exercise-row.has-error {
  border-color: #f56565;
}

.exercise-number {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff8f38, #ff6b6b);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.exercise-fields {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  flex: 1;
  align-items: center;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #8b949e;
}

.empty-state-small {
  text-align: center;
  padding: 16px;
  color: #8b949e;
}

@media (max-width: 1024px) {
  .builder-grid {
    grid-template-columns: 1fr;
  }

  .exercise-fields {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .form-fields {
    grid-template-columns: 1fr;
  }

  .round-config {
    flex-direction: column;
  }

  .exercise-fields {
    grid-template-columns: 1fr;
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.preview-card {
  background: #0f1419;
  border: 1px solid rgba(255, 255, 255, 0.08);
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden auto;
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 16px 24px;
}

.preview-body {
  flex: 1;
  padding: 24px;
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
}

.preview-block {
  margin-bottom: 32px;
}

.preview-block-title {
  font-size: 18px;
  font-weight: 700;
  color: #ff8f38;
  margin: 0 0 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
</style>
