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
              <q-input v-model.number="form.levelNumber" label="Número de nivel *" type="number" outlined dark />
              <q-input v-model="form.name" label="Nombre del nivel *" outlined dark hint="Ej: Novato Absoluto" />
              <q-input v-model="form.title" label="Título *" outlined dark hint="Ej: Los Fundamentos" />
              <q-input v-model="form.objective" label="Objetivo principal" type="textarea" outlined dark rows="3" />
              
              <!-- Selector de Color -->
              <div class="color-picker-wrapper">
                <label class="color-label">Color del nivel</label>
                <div class="color-preview-row">
                  <div class="color-preview" :style="{ background: form.color }">
                    <q-icon name="palette" size="20px" color="white" />
                  </div>
                  <q-input v-model="form.color" outlined dark dense style="flex: 1" placeholder="#ff8f38" />
                </div>
                <q-color
                  v-model="form.color"
                  dark
                  default-view="palette"
                  :palette="[
                    '#ff8f38', '#ff6b6b', '#ff6b9d', '#c44569',
                    '#38b2ac', '#4299e1', '#667eea', '#764ba2',
                    '#a371f7', '#9f7aea', '#ed64a6', '#f687b3',
                    '#3fb950', '#48bb78', '#68d391', '#9ae6b4',
                    '#ecc94b', '#f6e05e', '#fbd38d', '#faf089',
                    '#f56565', '#fc8181', '#feb2b2', '#fed7d7',
                    '#4a5568', '#718096', '#a0aec0', '#cbd5e0'
                  ]"
                  class="color-picker"
                />
              </div>
              
              <q-input v-model="form.icon" label="Icono/Emoji" outlined dark hint="Ej: 🎯" />
              <q-toggle v-model="form.isLockedByDefault" label="Bloqueado por defecto" color="primary" dark left-label />
            </div>
          </q-card-section>
        </q-card>

        <q-card class="form-card" flat bordered>
          <q-card-section>
            <div class="section-header">
              <h3 class="section-title">Requisitos para completar</h3>
              <q-btn flat dense icon="add" color="primary" label="Añadir" @click="addRequirement" />
            </div>
            
            <div v-if="form.requirements.length === 0" class="empty-requirements">
              <q-icon name="checklist" size="48px" color="grey-7" />
              <p>No hay requisitos definidos</p>
              <q-btn flat color="primary" label="Añadir primer requisito" @click="addRequirement" />
            </div>
            
            <div v-else class="requirements-list">
              <div v-for="(req, index) in form.requirements" :key="index" class="requirement-item">
                <q-input v-model="req.description" label="Descripción del requisito" outlined dense dark class="flex-1" />
                <q-select v-model="req.type" :options="requirementTypes" label="Tipo" outlined dense dark style="width: 140px" />
                <q-input v-model.number="req.minValue" label="Valor mínimo" type="number" outlined dense dark style="width: 100px" />
                <q-btn flat round icon="delete" color="negative" size="sm" @click="removeRequirement(index)" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()

const loading = ref(false)
const saving = ref(false)
const programName = ref('Calistenia Master')

const isEditing = computed(() => !!route.params.id)

const form = ref({
  levelNumber: 1,
  name: '',
  title: '',
  objective: '',
  color: '#ff8f38',
  icon: '🎯',
  isLockedByDefault: true,
  requirements: []
})

const requirementTypes = [
  { label: 'Repeticiones', value: 'reps' },
  { label: 'Tiempo', value: 'time' },
  { label: 'Peso', value: 'weight' },
  { label: 'Skill', value: 'skill' },
  { label: 'Progreso', value: 'progress' },
]

const addRequirement = () => {
  form.value.requirements.push({
    description: '',
    type: 'reps',
    minValue: null
  })
}

const removeRequirement = (index) => {
  form.value.requirements.splice(index, 1)
}

const fetchLevel = async () => {
  if (!isEditing.value) return
  loading.value = true
  try {
    await new Promise(r => setTimeout(r, 500))
    form.value = {
      levelNumber: 1,
      name: 'Novato Absoluto',
      title: 'Los Fundamentos',
      objective: 'Aprender los movimientos básicos y construir una base sólida.',
      color: '#ff8f38',
      icon: '🌱',
      isLockedByDefault: false,
      requirements: [
        { description: 'Completar 10 flexiones', type: 'reps', minValue: 10 },
        { description: 'Aguantar 30s plank', type: 'time', minValue: 30 },
      ]
    }
  } finally {
    loading.value = false
  }
}

const saveLevel = async () => {
  saving.value = true
  try {
    await new Promise(r => setTimeout(r, 800))
    $q.notify({ type: 'positive', message: isEditing.value ? 'Nivel actualizado' : 'Nivel creado' })
    goBack()
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Error al guardar' })
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

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.empty-requirements {
  text-align: center;
  padding: 40px;
  color: #8b949e;
}

.requirements-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.requirement-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #0d1117;
  border-radius: 12px;
}

.flex-1 {
  flex: 1;
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
