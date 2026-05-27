<template>
  <q-page class="page-container">
    <div class="page-content">
      <div class="page-header">
        <div class="header-left">
          <q-btn flat round icon="arrow_back" @click="goBack" />
          <div>
            <h1 class="page-title">{{ isEditing ? 'Editar Nivel' : 'Crear Nivel' }}</h1>
            <p class="page-subtitle">{{ programName }} - Nivel {{ form.levelNumber }}</p>
          </div>
        </div>
        <q-btn color="primary" icon="save" label="Guardar" :loading="saving" @click="saveLevel" />
      </div>

      <div class="two-columns">
        <q-card class="form-card" flat bordered>
          <q-card-section>
            <h3 class="section-title">Información del Nivel</h3>
            <div class="form-fields">
              <q-input
                v-model.number="form.levelNumber"
                label="Número de nivel *"
                type="number"
                outlined
                dark
              />
              <q-input
                v-model="form.name"
                label="Nombre del nivel *"
                outlined
                dark
                hint="Ej: Novato Absoluto"
              />
              <q-input
                v-model="form.title"
                label="Título"
                outlined
                dark
                hint="Ej: Los Fundamentos"
              />
              <q-input
                v-model="form.objective"
                label="Objetivo principal"
                type="textarea"
                outlined
                dark
                rows="3"
              />
              <q-input
                v-model="form.description"
                label="Descripción"
                type="textarea"
                outlined
                dark
                rows="3"
              />
              <q-input
                v-model.number="form.estimatedDurationWeeks"
                label="Duración estimada (semanas)"
                type="number"
                outlined
                dark
              />
              <q-input
                v-model.number="form.difficultyRating"
                label="Dificultad (1-10)"
                type="number"
                outlined
                dark
              />

              <div class="color-picker-wrapper">
                <label class="color-label">Color del nivel</label>
                <div class="color-preview-row">
                  <div class="color-preview" :style="{ background: form.color }">
                    <q-icon name="palette" size="20px" color="white" />
                  </div>
                  <q-input
                    v-model="form.color"
                    outlined
                    dark
                    dense
                    style="flex: 1"
                    placeholder="#ff8f38"
                  />
                </div>
                <q-color
                  v-model="form.color"
                  dark
                  default-view="palette"
                  :palette="[
                    '#ff8f38',
                    '#ff6b6b',
                    '#ff6b9d',
                    '#c44569',
                    '#38b2ac',
                    '#4299e1',
                    '#667eea',
                    '#764ba2',
                    '#a371f7',
                    '#9f7aea',
                    '#ed64a6',
                    '#f687b3',
                    '#3fb950',
                    '#48bb78',
                    '#68d391',
                    '#9ae6b4',
                    '#ecc94b',
                    '#f6e05e',
                    '#fbd38d',
                    '#faf089',
                    '#f56565',
                    '#fc8181',
                    '#feb2b2',
                    '#fed7d7',
                    '#4a5568',
                    '#718096',
                    '#a0aec0',
                    '#cbd5e0',
                  ]"
                  class="color-picker"
                />
              </div>

              <q-input v-model="form.icon" label="Icono" outlined dark hint="Ej: fitness_center" />
              <q-input v-model="form.skillFocus" label="Skill focus" outlined dark />
              <q-input v-model="form.programVersion" label="Versión del programa" outlined dark />
              <q-toggle
                v-model="form.isLockedByDefault"
                label="Bloqueado por defecto"
                color="primary"
                dark
                left-label
              />
            </div>
          </q-card-section>
        </q-card>

        <q-card class="form-card" flat bordered>
          <q-card-section>
            <h3 class="section-title">Requisitos y Consejos</h3>
            <div class="form-fields">
              <q-input
                v-model="form.requirementsSummary"
                label="Resumen de requisitos"
                type="textarea"
                outlined
                dark
                rows="3"
              />
              <q-input
                v-model="tipsString"
                label="Consejos (uno por línea)"
                type="textarea"
                outlined
                dark
                rows="4"
              />
              <q-input
                v-model="testRequirementsString"
                label="Requisitos de test (JSON)"
                type="textarea"
                outlined
                dark
                rows="4"
                hint='Formato: {"pushups": 10}'
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { levelService, programService } from '@/services'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()

const loading = ref(false)
const saving = ref(false)
const programName = ref('')

const isEditing = computed(() => !!route.params.id)
const programId = computed(() => (route.params.programId ? Number(route.params.programId) : null))

const form = ref({
  programId: programId.value,
  levelNumber: 1,
  name: '',
  title: '',
  objective: '',
  description: '',
  estimatedDurationWeeks: 12,
  difficultyRating: null,
  color: '#ff8f38',
  icon: '',
  skillFocus: '',
  programVersion: 'v1',
  isLockedByDefault: true,
  requirementsSummary: '',
  tips: [],
  testRequirements: null,
})

const tipsString = ref('')
const testRequirementsString = ref('')

watch(tipsString, (val) => {
  form.value.tips = val.split('\n').filter((line) => line.trim() !== '')
})

watch(testRequirementsString, (val) => {
  try {
    form.value.testRequirements = val.trim() ? JSON.parse(val) : null
  } catch {
    // Mantener null si el JSON es inválido; se validará al guardar
    form.value.testRequirements = null
  }
})

const fetchProgramName = async () => {
  const pid = programId.value || form.value.programId
  if (!pid) return
  try {
    const data = await programService.getById(pid)
    programName.value = data.name || 'Programa'
  } catch {
    programName.value = 'Programa'
  }
}

const fetchLevel = async () => {
  if (!isEditing.value) {
    await fetchProgramName()
    return
  }
  loading.value = true
  try {
    const data = await levelService.getById(route.params.id)
    form.value = {
      programId: data.program?.id ?? programId.value,
      levelNumber: data.levelNumber ?? 1,
      name: data.name || '',
      title: data.title || '',
      objective: data.objective || '',
      description: data.description || '',
      estimatedDurationWeeks: data.estimatedDurationWeeks ?? 12,
      difficultyRating: data.difficultyRating ?? null,
      color: data.color || '#ff8f38',
      icon: data.icon || '',
      skillFocus: data.skillFocus || '',
      programVersion: data.programVersion || 'v1',
      isLockedByDefault: data.isLockedByDefault ?? true,
      requirementsSummary: data.requirementsSummary || '',
      tips: data.tips || [],
      testRequirements: data.testRequirements || null,
    }
    tipsString.value = (data.tips || []).join('\n')
    testRequirementsString.value = data.testRequirements
      ? JSON.stringify(data.testRequirements, null, 2)
      : ''
    await fetchProgramName()
  } catch {
    $q.notify({ type: 'negative', message: 'Error al cargar el nivel' })
  } finally {
    loading.value = false
  }
}

const saveLevel = async () => {
  saving.value = true
  try {
    const payload = { ...form.value }
    if (isEditing.value) {
      await levelService.update(route.params.id, payload)
      $q.notify({ type: 'positive', message: 'Nivel actualizado correctamente' })
    } else {
      await levelService.create(payload)
      $q.notify({ type: 'positive', message: 'Nivel creado correctamente' })
    }
    goBack()
  } catch (err) {
    const msg = err.response?.data?.error || err.response?.data?.message || 'Error al guardar'
    $q.notify({ type: 'negative', message: msg })
  } finally {
    saving.value = false
  }
}

const goBack = () => router.back()

onMounted(fetchLevel)
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

.two-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.form-card {
  background: #1c2128;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 20px;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.color-picker-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.color-label {
  font-size: 14px;
  color: #8b949e;
}

.color-preview-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.color-preview {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.color-picker {
  border-radius: 12px;
  overflow: hidden;
}

.color-picker .q-color-picker {
  background: #0d1117;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

@media (max-width: 1024px) {
  .two-columns {
    grid-template-columns: 1fr;
  }
}
</style>
