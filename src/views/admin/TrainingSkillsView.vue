<template>
  <q-page class="page-container">
    <div class="page-content">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Skills Técnicos</h1>
          <p class="page-subtitle">Gestiona habilidades desbloqueables por nivel</p>
        </div>
        <q-btn color="primary" icon="add" label="Nuevo Skill" class="action-btn" no-caps @click="openCreateDialog" />
      </div>

      <!-- Stats -->
      <div class="stats-row">
        <div class="stat-mini">
          <div class="stat-mini-icon" style="background: rgba(255, 143, 56, 0.2)">
            <q-icon name="emoji_events" color="primary" size="20px" />
          </div>
          <div class="stat-mini-content">
            <div class="stat-mini-value">{{ skills.length }}</div>
            <div class="stat-mini-label">Total Skills</div>
          </div>
        </div>
        <div class="stat-mini">
          <div class="stat-mini-icon" style="background: rgba(147, 112, 219, 0.2)">
            <q-icon name="category" color="accent" size="20px" />
          </div>
          <div class="stat-mini-content">
            <div class="stat-mini-value">{{ familiesCount }}</div>
            <div class="stat-mini-label">Familias</div>
          </div>
        </div>
        <div class="stat-mini">
          <div class="stat-mini-icon" style="background: rgba(56, 178, 172, 0.2)">
            <q-icon name="lock_open" color="teal" size="20px" />
          </div>
          <div class="stat-mini-content">
            <div class="stat-mini-value">{{ avgUnlockLevel }}</div>
            <div class="stat-mini-label">Nivel medio</div>
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
              placeholder="Buscar skills..." 
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
              Familia
            </span>
            <div class="filter-pills">
              <button 
                v-for="family in familyOptions" 
                :key="family.value"
                class="filter-pill"
                :class="{ 'active': familyFilter === family.value, [family.color]: true }"
                @click="familyFilter = family.value"
              >
                {{ family.label }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Skills Grid -->
      <div class="skills-grid">
        <template v-if="loading">
          <div v-for="i in 6" :key="i" class="skill-card skeleton">
            <q-skeleton type="text" class="bg-grey-8" width="60%" />
            <q-skeleton type="text" class="bg-grey-8" width="80%" />
            <q-skeleton type="text" class="bg-grey-8" width="40%" />
          </div>
        </template>

        <div v-else-if="filteredSkills.length === 0" class="empty-state">
          <q-icon name="emoji_events" size="64px" color="grey-6" />
          <h3>No hay skills</h3>
          <p>Crea tu primer skill técnico</p>
          <q-btn color="primary" icon="add" label="Crear Skill" no-caps @click="openCreateDialog" />
        </div>

        <div v-for="skill in filteredSkills" :key="skill.id" class="skill-card">
          <div class="skill-header">
            <q-chip size="sm" :color="getFamilyColor(skill.skillFamily || skill.family)" text-color="white" class="family-chip">
              {{ formatFamily(skill.skillFamily || skill.family) }}
            </q-chip>
            <div class="difficulty-badge">
              <q-icon name="star" size="14px" color="orange" />
              <span>{{ skill.difficultyScore || skill.difficulty || 50 }}</span>
            </div>
          </div>
          
          <h3 class="skill-name">{{ skill.name }}</h3>
          <p class="skill-description">{{ skill.description }}</p>
          
          <div class="skill-meta">
            <div class="meta-item">
              <q-icon name="lock_open" size="16px" color="teal" />
              <span>Nivel {{ skill.levelRequired || skill.unlockAtLevel || 1 }}</span>
            </div>
            <div v-if="skill.prerequisites?.length" class="meta-item">
              <q-icon name="link" size="16px" color="orange" />
              <span>{{ skill.prerequisites.length }} requisitos</span>
            </div>
          </div>
          
          <div class="skill-actions">
            <q-btn flat dense icon="play_circle" label="YouTube" color="grey-5" size="sm" no-caps @click="searchSkill(skill, 'youtube')" />
            <q-btn flat dense icon="search" label="Google" color="grey-5" size="sm" no-caps @click="searchSkill(skill, 'google')" />
            <q-btn flat dense icon="edit" color="primary" size="sm" no-caps @click="editSkill(skill)">
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <q-btn flat dense icon="delete" color="negative" size="sm" no-caps @click="confirmDelete(skill)">
              <q-tooltip>Eliminar</q-tooltip>
            </q-btn>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Dialog -->
    <q-dialog v-model="skillDialog" persistent>
      <q-card class="skill-dialog">
        <q-card-section class="dialog-header">
          <h3>{{ isEditing ? 'Editar Skill' : 'Nuevo Skill' }}</h3>
          <q-btn flat round icon="close" v-close-popup />
        </q-card-section>

        <q-card-section class="dialog-content">
          <q-input v-model="skillForm.name" label="Nombre del skill *" outlined dense dark class="q-mb-md" />
          
          <q-select 
            v-model="skillForm.skillFamily" 
            :options="familySelectOptions" 
            label="Familia *" 
            outlined 
            dense 
            dark 
            class="q-mb-md"
            emit-value
            map-options
          />
          
          <q-input 
            v-model="skillForm.description" 
            label="Descripción" 
            type="textarea" 
            outlined 
            dense 
            dark 
            class="q-mb-md" 
            rows="3"
          />
          
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-6">
              <q-input 
                v-model.number="skillForm.levelRequired" 
                label="Nivel requerido *" 
                type="number" 
                outlined 
                dense 
                dark 
              />
            </div>
            <div class="col-6">
              <q-input 
                v-model.number="skillForm.difficultyScore" 
                label="Dificultad (0-100)" 
                type="number" 
                outlined 
                dense 
                dark 
              />
            </div>
          </div>
          
          <q-input 
            v-model="skillForm.videoTutorialUrl" 
            label="URL Video Tutorial" 
            outlined 
            dense 
            dark 
            class="q-mb-md"
            placeholder="https://youtube.com/watch?v=..."
          />
          
          <q-toggle 
            v-model="skillForm.isSecret" 
            label="Skill secreto" 
            color="orange" 
            dark 
            left-label 
            class="q-mb-md"
          />
        </q-card-section>

        <q-card-section class="dialog-footer">
          <q-btn flat label="Cancelar" color="grey-6" v-close-popup />
          <q-btn color="primary" :label="isEditing ? 'Guardar' : 'Crear'" :loading="saving" @click="saveSkill" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Delete Confirmation -->
    <q-dialog v-model="deleteDialog" persistent>
      <q-card class="delete-dialog">
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="negative" text-color="white" />
          <span class="q-ml-sm">¿Eliminar "{{ skillToDelete?.name }}"? Esta acción no se puede deshacer.</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="grey-6" v-close-popup />
          <q-btn flat label="Eliminar" color="negative" @click="deleteSkill" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const loading = ref(false)
const skills = ref([])
const searchQuery = ref('')
const familyFilter = ref('all')
const skillDialog = ref(false)
const deleteDialog = ref(false)
const saving = ref(false)
const isEditing = ref(false)
const skillToDelete = ref(null)

const skillForm = ref({
  id: null,
  name: '',
  skillFamily: 'handstand',
  description: '',
  levelRequired: 1,
  difficultyScore: 50,
  videoTutorialUrl: '',
  isSecret: false,
  prerequisites: []
})

const familyOptions = [
  { label: 'Todos', value: 'all' },
  { label: 'Core', value: 'core', color: 'red' },
  { label: 'Handstand', value: 'handstand', color: 'blue' },
  { label: 'Pull', value: 'pull', color: 'green' },
  { label: 'Push', value: 'push', color: 'orange' },
  { label: 'Muscle-up', value: 'muscle_up', color: 'deep-orange' },
  { label: 'Planche', value: 'planche', color: 'purple' },
  { label: 'Lever', value: 'lever', color: 'cyan' },
  { label: 'Front Lever', value: 'front_lever', color: 'teal' },
  { label: 'Legs', value: 'legs', color: 'brown' },
  { label: 'Dip', value: 'dip', color: 'pink' },
  { label: 'Rings', value: 'rings', color: 'indigo' },
  { label: 'Human Flag', value: 'human_flag', color: 'lime' },
]

const familySelectOptions = [
  { label: 'Core', value: 'core' },
  { label: 'Handstand', value: 'handstand' },
  { label: 'Pull', value: 'pull' },
  { label: 'Push', value: 'push' },
  { label: 'Muscle-up', value: 'muscle_up' },
  { label: 'Planche', value: 'planche' },
  { label: 'Lever', value: 'lever' },
  { label: 'Front Lever', value: 'front_lever' },
  { label: 'Legs', value: 'legs' },
  { label: 'Dip', value: 'dip' },
  { label: 'Rings', value: 'rings' },
  { label: 'Human Flag', value: 'human_flag' },
]

const formatFamily = (family) => {
  const labels = {
    core: 'Core',
    handstand: 'Handstand',
    pull: 'Pull',
    push: 'Push',
    muscle_up: 'Muscle-up',
    planche: 'Planche',
    lever: 'Lever',
    front_lever: 'Front Lever',
    legs: 'Legs',
    dip: 'Dip',
    rings: 'Rings',
    human_flag: 'Human Flag'
  }
  return labels[family] || family
}

const getFamilyColor = (family) => {
  const colors = { 
    core: 'red',
    handstand: 'blue', 
    pull: 'green',
    push: 'orange',
    muscle_up: 'deep-orange', 
    planche: 'purple', 
    lever: 'cyan',
    front_lever: 'teal', 
    legs: 'brown',
    dip: 'pink',
    rings: 'indigo',
    human_flag: 'lime'
  }
  return colors[family] || 'grey'
}

const filteredSkills = computed(() => {
  let result = skills.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(s => 
      s.name?.toLowerCase().includes(query) || 
      s.description?.toLowerCase().includes(query)
    )
  }

  if (familyFilter.value !== 'all') {
    result = result.filter(s => 
      (s.skillFamily || s.family) === familyFilter.value
    )
  }

  return result.sort((a, b) => (a.levelRequired || a.unlockAtLevel || 1) - (b.levelRequired || b.unlockAtLevel || 1))
})

const familiesCount = computed(() => new Set(skills.value.map(s => s.skillFamily || s.family)).size)
const avgUnlockLevel = computed(() => {
  if (skills.value.length === 0) return 0
  const sum = skills.value.reduce((acc, s) => acc + (s.levelRequired || s.unlockAtLevel || 1), 0)
  return Math.round(sum / skills.value.length)
})

const fetchSkills = async () => {
  loading.value = true
  try {
    // Simulación - aquí iría la llamada API
    await new Promise(r => setTimeout(r, 500))
    skills.value = [
      // PRINCIPIANTE (1-4)
      { id: 1, name: 'L-Sit', skillFamily: 'core', description: 'Sentado en manos con piernas en L. Base de compresión de cadera fundamental.', levelRequired: 2, difficultyScore: 25 },
      { id: 2, name: 'Hollow Body Hold', skillFamily: 'core', description: 'Posición de banana invertida. Control lumbar esencial para calistenia.', levelRequired: 1, difficultyScore: 15 },
      { id: 3, name: 'Pike Push-up', skillFamily: 'handstand', description: 'Flexiones en posición de pica. Preparación para el pino.', levelRequired: 3, difficultyScore: 35 },
      { id: 4, name: 'Australian Pull-up', skillFamily: 'pull', description: 'Remo australiano en barra baja. Base técnica para dominadas.', levelRequired: 2, difficultyScore: 20 },
      { id: 5, name: 'Handstand Prep', skillFamily: 'handstand', description: 'Preparación para el pino contra pared.', levelRequired: 3, difficultyScore: 30 },
      { id: 6, name: 'Tuck Front Lever', skillFamily: 'front_lever', description: 'Palanca frontal con rodillas al pecho. Primer paso hacia el lever.', levelRequired: 4, difficultyScore: 40 },
      
      // INTERMEDIO (5-7)
      { id: 7, name: 'Handstand Wall', skillFamily: 'handstand', description: 'Pino libre contra la pared. Equilibrio básico invertido.', levelRequired: 5, difficultyScore: 45 },
      { id: 8, name: 'L-Sit to Handstand', skillFamily: 'handstand', description: 'Transición de L-sit a pino. Requiere fuerza de empuje y compresión.', levelRequired: 7, difficultyScore: 70 },
      { id: 9, name: 'Back Lever', skillFamily: 'lever', description: 'Palanca dorsal horizontal. Contracción de espalda extensa.', levelRequired: 6, difficultyScore: 55 },
      { id: 10, name: 'Archer Pull-up', skillFamily: 'pull', description: 'Dominada asimétrica. Preparación para dominada a una mano.', levelRequired: 6, difficultyScore: 50 },
      { id: 11, name: 'Pistol Squat', skillFamily: 'legs', description: 'Sentadilla completa a una pierna. Movilidad y fuerza.', levelRequired: 5, difficultyScore: 45 },
      { id: 12, name: 'V-Sit', skillFamily: 'core', description: 'L-sit con apertura de piernas en V. Compresión avanzada.', levelRequired: 7, difficultyScore: 65 },
      { id: 13, name: 'Typewriter Pull-up', skillFamily: 'pull', description: 'Dominada con movimiento lateral. Control y resistencia.', levelRequired: 6, difficultyScore: 55 },
      { id: 14, name: 'Muscle-up Journey', skillFamily: 'muscle_up', description: 'Transición explosiva de dominada a fondo en barra.', levelRequired: 5, difficultyScore: 55 },
      { id: 15, name: 'Tuck Planche', skillFamily: 'planche', description: 'Plancha con rodillas al pecho. Base de proyección.', levelRequired: 7, difficultyScore: 65 },
      { id: 16, name: 'Front Lever', skillFamily: 'front_lever', description: 'Palanca frontal extendida completa. Pure pulling strength.', levelRequired: 7, difficultyScore: 75 },
      
      // AVANZADO (8-10)
      { id: 17, name: 'Freestanding Handstand', skillFamily: 'handstand', description: 'Pino libre sin apoyo. Equilibrio y alineación perfectos.', levelRequired: 8, difficultyScore: 80 },
      { id: 18, name: 'One Arm Pull-up', skillFamily: 'pull', description: 'Dominada a una mano. Máxima fuerza de tracción.', levelRequired: 10, difficultyScore: 95 },
      { id: 19, name: 'One Arm Push-up', skillFamily: 'push', description: 'Flexión a una mano. Empuje unilateral extremo.', levelRequired: 9, difficultyScore: 85 },
      { id: 20, name: 'Dragon Flag', skillFamily: 'core', description: 'Bruce Lee special. Bandera dragón, core de hierro.', levelRequired: 8, difficultyScore: 85 },
      { id: 21, name: 'Hefesto', skillFamily: 'rings', description: 'Dominada invertida en anillas. El pull más difícil.', levelRequired: 10, difficultyScore: 100 },
      { id: 22, name: 'Korean Dip', skillFamily: 'dip', description: 'Fondos coreanos en barra recta. Extensión completa del hombro.', levelRequired: 8, difficultyScore: 70 },
      { id: 23, name: '90 Degree Push-up', skillFamily: 'handstand', description: 'Flexión parada de manos a 90°. Control de HSPU.', levelRequired: 9, difficultyScore: 90 },
      { id: 24, name: 'Manna', skillFamily: 'core', description: 'L-sit extremo con piernas elevadas. Compresión élite.', levelRequired: 10, difficultyScore: 95 },
      { id: 25, name: 'Inverted Cross', skillFamily: 'rings', description: 'Cruz invertida en anillas. Fuerza de empuje invertida.', levelRequired: 10, difficultyScore: 90 },
      { id: 26, name: 'Straddle Planche', skillFamily: 'planche', description: 'Plancha con piernas abiertas. Progresión a full.', levelRequired: 9, difficultyScore: 85 },
      { id: 27, name: 'Full Planche', skillFamily: 'planche', description: 'Plancha completa extendida. Proyección máxima.', levelRequired: 10, difficultyScore: 95 },
      { id: 28, name: 'Muscle-up Rings', skillFamily: 'rings', description: 'Muscle-up en anillas. Control y estabilidad extra.', levelRequired: 8, difficultyScore: 75 },
      { id: 29, name: 'Human Flag', skillFamily: 'human_flag', description: 'Bandera humana lateral. Fuerza de agarre y core.', levelRequired: 9, difficultyScore: 80 },
      
      // ÉLITE (11-12)
      { id: 30, name: 'Iron Cross', skillFamily: 'rings', description: 'Cruz de hierro en anillas. La habilidad más difícil.', levelRequired: 12, difficultyScore: 100 },
      { id: 31, name: 'Victorian Cross', skillFamily: 'rings', description: 'Cruz victoriana. Cuerpo horizontal hacia atrás.', levelRequired: 12, difficultyScore: 100 },
      { id: 32, name: 'Planche Push-up', skillFamily: 'planche', description: 'Flexión en posición de plancha. Empuje extremo.', levelRequired: 11, difficultyScore: 98 },
      { id: 33, name: 'One Arm Handstand', skillFamily: 'handstand', description: 'Pino a una mano libre. Equilibrio supremo.', levelRequired: 12, difficultyScore: 100 },
      { id: 34, name: 'Maltese', skillFamily: 'rings', description: 'Posición maltesa en anillas. Proyección máxima boca abajo.', levelRequired: 11, difficultyScore: 95 },
    ]
  } catch {
    $q.notify({ type: 'negative', message: 'Error al cargar skills' })
  } finally {
    loading.value = false
  }
}

const searchSkill = (skill, platform) => {
  const query = encodeURIComponent(skill.name)
  const url = platform === 'youtube' 
    ? `https://www.youtube.com/results?search_query=${query}`
    : `https://www.google.com/search?q=${query}+tutorial`
  window.open(url, '_blank')
}

const openCreateDialog = () => {
  isEditing.value = false
  skillForm.value = {
    id: null,
    name: '',
    skillFamily: 'handstand',
    description: '',
    levelRequired: 1,
    difficultyScore: 50,
    videoTutorialUrl: '',
    isSecret: false,
    prerequisites: []
  }
  skillDialog.value = true
}

const editSkill = (skill) => {
  isEditing.value = true
  skillForm.value = { 
    ...skill,
    skillFamily: skill.skillFamily || skill.family,
    levelRequired: skill.levelRequired || skill.unlockAtLevel || 1,
    difficultyScore: skill.difficultyScore || skill.difficulty || 50
  }
  skillDialog.value = true
}

const saveSkill = async () => {
  saving.value = true
  try {
    await new Promise(r => setTimeout(r, 800))
    if (isEditing.value) {
      const index = skills.value.findIndex(s => s.id === skillForm.value.id)
      if (index !== -1) skills.value[index] = { ...skillForm.value }
      $q.notify({ type: 'positive', message: 'Skill actualizado' })
    } else {
      const newSkill = { ...skillForm.value, id: Date.now() }
      skills.value.push(newSkill)
      $q.notify({ type: 'positive', message: 'Skill creado' })
    }
    skillDialog.value = false
  } catch {
    $q.notify({ type: 'negative', message: 'Error al guardar' })
  } finally {
    saving.value = false
  }
}

const confirmDelete = (skill) => {
  skillToDelete.value = skill
  deleteDialog.value = true
}

const deleteSkill = async () => {
  try {
    await new Promise(r => setTimeout(r, 500))
    skills.value = skills.value.filter(s => s.id !== skillToDelete.value.id)
    $q.notify({ type: 'positive', message: 'Skill eliminado' })
    deleteDialog.value = false
  } catch {
    $q.notify({ type: 'negative', message: 'Error al eliminar' })
  }
}

onMounted(fetchSkills)
</script>

<style scoped>
/* Stats */
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

/* Filters */
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

.filter-pill.active.red { background: #f85149; border-color: #f85149; color: #fff; }
.filter-pill.active.blue { background: #58a6ff; border-color: #58a6ff; color: #fff; }
.filter-pill.active.green { background: #3fb950; border-color: #3fb950; color: #fff; }
.filter-pill.active.orange { background: #ff8f38; border-color: #ff8f38; color: #0d1117; }
.filter-pill.active.deep-orange { background: #ff6b35; border-color: #ff6b35; color: #fff; }
.filter-pill.active.purple { background: #a371f7; border-color: #a371f7; color: #fff; }
.filter-pill.active.cyan { background: #39c5cf; border-color: #39c5cf; color: #0d1117; }
.filter-pill.active.teal { background: #38b2ac; border-color: #38b2ac; color: #fff; }
.filter-pill.active.brown { background: #8b4513; border-color: #8b4513; color: #fff; }
.filter-pill.active.pink { background: #ff6b9d; border-color: #ff6b9d; color: #0d1117; }
.filter-pill.active.indigo { background: #6366f1; border-color: #6366f1; color: #fff; }
.filter-pill.active.lime { background: #84cc16; border-color: #84cc16; color: #0d1117; }

/* Skills Grid */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.skill-card {
  background: linear-gradient(135deg, #1c2128 0%, #161b22 100%);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s;
}

.skill-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 143, 56, 0.3);
}

.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.family-chip {
  font-weight: 600;
  text-transform: capitalize;
}

.difficulty-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 143, 56, 0.1);
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  color: #ff8f38;
}

.skill-name {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 8px;
}

.skill-description {
  font-size: 14px;
  color: #8b949e;
  margin: 0 0 16px;
  line-height: 1.5;
}

.skill-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #8b949e;
  font-size: 13px;
}

.skill-actions {
  display: flex;
  gap: 8px;
}

/* Dialogs */
.skill-dialog, .delete-dialog {
  background: linear-gradient(135deg, #1c2128 0%, #161b22 100%);
  min-width: 500px;
  border-radius: 20px;
}

.delete-dialog {
  min-width: 400px;
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

/* Empty State */
.empty-state {
  grid-column: 1 / -1;
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

@media (max-width: 768px) {
  .skills-grid {
    grid-template-columns: 1fr;
  }
  
  .skill-dialog {
    min-width: auto;
    width: 90vw;
  }
  
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
