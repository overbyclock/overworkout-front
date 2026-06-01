<template>
  <q-page class="page-container">
    <div class="page-content">
      <div class="page-header">
        <div class="header-left">
          <q-btn flat round icon="arrow_back" @click="goBack" />
          <div>
            <h1 class="page-title">Editar Programa</h1>
            <p class="page-subtitle">{{ program?.name }}</p>
          </div>
        </div>
        <q-btn
          color="primary"
          icon="save"
          label="Guardar Cambios"
          :loading="saving"
          @click="saveProgram"
        />
      </div>

      <q-card class="form-card" flat bordered>
        <q-card-section>
          <div class="form-grid">
            <q-input
              v-model="form.name"
              label="Nombre del programa *"
              outlined
              dark
              class="col-span-2"
            />
            <q-input
              v-model="form.slug"
              label="Slug (URL) *"
              outlined
              dark
              hint="Usado en las URLs. Solo minúsculas, números y guiones."
            />
            <q-select
              v-model="form.discipline"
              :options="disciplineOptions"
              label="Disciplina *"
              outlined
              dark
              emit-value
              map-options
            />
            <q-select
              v-model="form.difficulty"
              :options="difficultyOptions"
              label="Dificultad *"
              outlined
              dark
              emit-value
              map-options
            />
            <q-input
              v-model="form.description"
              label="Descripción"
              type="textarea"
              outlined
              dark
              class="col-span-2"
              rows="4"
            />
            <q-input
              v-model.number="form.totalLevels"
              label="Número total de niveles *"
              type="number"
              outlined
              dark
            />
            <q-input
              v-model.number="form.estimatedDurationWeeks"
              label="Duración estimada (fases)"
              type="number"
              outlined
              dark
            />
            <q-input
              v-model="form.imageUrl"
              label="URL de imagen"
              outlined
              dark
              class="col-span-2"
            />
            <div class="col-span-2">
              <q-toggle
                v-model="form.isActive"
                label="Programa activo"
                color="primary"
                dark
                left-label
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { programService } from '@/services'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()

const loading = ref(false)
const saving = ref(false)
const program = ref(null)

const form = ref({
  name: '',
  slug: '',
  discipline: 'calisthenics',
  difficulty: 'beginner',
  description: '',
  totalLevels: 12,
  estimatedDurationWeeks: null,
  imageUrl: '',
  isActive: true,
})

const disciplineOptions = [
  { label: 'Calistenia', value: 'calisthenics' },
  { label: 'CrossFit', value: 'crossfit' },
  { label: 'Fitness', value: 'fitness' },
  { label: 'Calistenia + Fitness', value: 'calisthenicsfitness' },
]

const difficultyOptions = [
  { label: 'Principiante', value: 'beginner' },
  { label: 'Intermedio', value: 'intermediate' },
  { label: 'Experto', value: 'expert' },
  { label: 'Sin nivel', value: 'nolevel' },
]

const fetchProgram = async () => {
  loading.value = true
  try {
    const data = await programService.getById(route.params.id)
    program.value = data
    form.value = {
      name: data.name || '',
      slug: data.slug || '',
      discipline: data.discipline || 'calisthenics',
      difficulty: data.difficulty || 'beginner',
      description: data.description || '',
      totalLevels: data.totalLevels ?? 12,
      estimatedDurationWeeks: data.estimatedDurationWeeks ?? null,
      imageUrl: data.imageUrl || '',
      isActive: data.isActive ?? true,
    }
  } catch {
    $q.notify({ type: 'negative', message: 'Error al cargar el programa' })
  } finally {
    loading.value = false
  }
}

const saveProgram = async () => {
  saving.value = true
  try {
    await programService.update(route.params.id, { ...form.value })
    $q.notify({ type: 'positive', message: 'Programa guardado correctamente' })
    goBack()
  } catch (err) {
    const msg = err.response?.data?.error || err.response?.data?.message || 'Error al guardar'
    $q.notify({ type: 'negative', message: msg })
  } finally {
    saving.value = false
  }
}

const goBack = () => router.push('/admin/training-programs')

onMounted(fetchProgram)
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.form-card {
  background: #1c2128;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.col-span-2 {
  grid-column: span 2;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  .col-span-2 {
    grid-column: span 1;
  }
}
</style>
