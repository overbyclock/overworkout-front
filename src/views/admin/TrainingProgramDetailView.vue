<template>
  <q-page class="page-container">
    <div v-if="loading" class="loading-state">
      <q-spinner size="60px" color="primary" />
      <p>Cargando programa...</p>
    </div>

    <template v-else-if="program">
      <ProgramHeader
        :program="program"
        :gradient="programGradient"
        :icon="programIcon"
        @back="goBack"
        @edit="editProgram"
        @duplicate="duplicateProgram"
        @toggle-active="toggleActive"
        @delete="deleteProgram"
      />

      <!-- Selector de versión para Calistenia Master -->
      <div v-if="hasVersionSelector" class="version-selector-bar">
        <q-btn-toggle
          v-model="currentVersion"
          :options="versionOptions"
          color="dark"
          text-color="grey-5"
          toggle-color="primary"
          toggle-text-color="dark"
          rounded
          unelevated
          dense
          spread
          @update:model-value="switchVersion"
        />
      </div>

      <div class="page-content">
        <ProgramStats :stats="statsList" />

        <!-- Skill Tracker Roadmap (solo para programas con skills definidos) -->
        <SkillTracker
          v-if="program?.levels?.some((l) => l.skillFocus)"
          :levels="program.levels"
          :current-level="currentUserLevel"
        />

        <div class="tabs-container">
          <div class="tabs-header">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              class="tab-btn"
              :class="{ active: activeTab === tab.id }"
              @click="activeTab = tab.id"
            >
              <q-icon :name="tab.icon" size="20px" />
              <span>{{ tab.label }}</span>
              <q-badge v-if="tab.count" color="primary" floating>{{ tab.count }}</q-badge>
            </button>
          </div>

          <LevelsTab
            v-if="activeTab === 'levels'"
            :levels="program.levels"
            @add="addLevel"
            @edit="editLevel"
            @duplicate="duplicateLevel"
            @manage-weeks="manageLevelWeeks"
            @manage-trainings="manageLevelTrainings"
          >
            <template #level-detail="{ level }">
              <LevelDetail :level="level" :level-data="getLevelData(level.levelNumber)" />
            </template>
          </LevelsTab>

          <UsersTab
            v-else-if="activeTab === 'users'"
            :users="programUsers"
            @add="addUser"
            @view="viewUser"
            @edit="editUser"
          />

          <SkillsTab
            v-else-if="activeTab === 'skills'"
            :families="skillFamilies"
            @add="addSkill"
            @view="viewSkill"
          />

          <AnalyticsTab
            v-else-if="activeTab === 'analytics'"
            :stats="stats"
            :progress-chart="progressChart"
            :pie-data="pieData"
            :skill-stats="skillStats"
          />
        </div>
      </div>
    </template>

    <div v-else class="not-found">
      <q-icon name="error_outline" size="80px" color="grey-6" />
      <h2>Programa no encontrado</h2>
      <q-btn color="primary" label="Volver a Programas" @click="goBack" />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import {
  ProgramHeader,
  ProgramStats,
  LevelsTab,
  UsersTab,
  SkillsTab,
  AnalyticsTab,
  SkillTracker,
} from '@/components/admin'
import LevelDetail from '@/components/admin/program/LevelDetail.vue'
import { programService, levelService, programStatsService } from '@/services'
import { adaptApiLevelToLegacy } from '@/utils/api-adapters'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()

const loading = ref(true)
const program = ref(null)
const activeTab = ref('levels')

// Nivel actual del usuario (mock - en producción vendría del store de usuario)
const currentUserLevel = computed(() => {
  // Por defecto mostramos el nivel 1 como actual
  // En una implementación real, esto vendría del progreso del usuario
  return 1
})

// Selector de versión para Calistenia Master
const isCalisteniaMaster = computed(() => {
  const slug = program.value?.slug || ''
  return slug === 'calisthenia-master' || slug === 'calisthenia-master-v2'
})

const currentVersion = computed(() => {
  const slug = program.value?.slug || ''
  return slug === 'calisthenia-master-v2' ? 'v2' : 'v1'
})

const hasVersionSelector = computed(() => isCalisteniaMaster.value)

const versionOptions = [
  { label: 'Versión 1.0', value: 'v1' },
  { label: 'Versión 2.0', value: 'v2' },
]

const switchVersion = (version) => {
  const targetSlug = version === 'v2' ? 'calisthenia-master-v2' : 'calisthenia-master'
  if (targetSlug !== program.value?.slug) {
    router.push(`/admin/training-programs/${targetSlug}`)
    // Recargar la página para obtener el nuevo programa
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }
}

const getLevelData = (levelNumber) => {
  const apiLevel = program.value?.levels?.find((l) => l.levelNumber === levelNumber)
  if (!apiLevel) return null
  return adaptApiLevelToLegacy(apiLevel)
}

const totalSkills = computed(() => {
  if (!program.value?.levels) return 0
  return program.value.levels.reduce((sum, level) => sum + (level.skills?.length || 0), 0)
})

const tabs = computed(() => [
  { id: 'levels', label: 'Niveles', icon: 'stairs', count: program.value?.levels?.length || 0 },
  { id: 'users', label: 'Usuarios', icon: 'people', count: programStats.value.totalUsers },
  { id: 'skills', label: 'Skills', icon: 'emoji_events', count: totalSkills.value },
  { id: 'analytics', label: 'Analíticas', icon: 'analytics' },
])

const programStats = ref({
  totalUsers: 0,
  avgProgress: 0,
  completions: 0,
  avgTime: 0,
  paused: 0,
  dropped: 0,
})

const statsList = computed(() => [
  { value: programStats.value.totalUsers, label: 'Usuarios activos', icon: 'people' },
  { value: programStats.value.avgProgress + '%', label: 'Progreso medio', icon: 'trending_up' },
  { value: programStats.value.completions, label: 'Completados', icon: 'emoji_events' },
  { value: programStats.value.avgTime + 'm', label: 'Tiempo medio/día', icon: 'schedule' },
])

const programGradient = computed(() => {
  const slug = program.value?.slug || ''
  if (slug.includes('handstand')) {
    return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  }
  return (
    {
      calisthenics: 'linear-gradient(135deg, #ff8f38 0%, #ff6b6b 100%)',
      crossfit: 'linear-gradient(135deg, #38b2ac 0%, #4299e1 100%)',
    }[program.value?.discipline] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  )
})

const programIcon = computed(() => {
  const slug = program.value?.slug || ''
  if (slug.includes('handstand')) {
    return '🤸'
  }
  return (
    {
      calisthenics: '🤸',
      crossfit: '🏋️',
      fitness: '💪',
    }[program.value?.discipline] || '🎯'
  )
})

const programUsers = ref([
  {
    id: 1,
    name: 'Juan Pérez',
    initials: 'JP',
    currentLevel: 5,
    progress: 65,
    status: 'active',
    joinedAt: '2025-01-15',
  },
  {
    id: 2,
    name: 'María García',
    initials: 'MG',
    currentLevel: 8,
    progress: 82,
    status: 'active',
    joinedAt: '2024-11-20',
  },
  {
    id: 3,
    name: 'Carlos López',
    initials: 'CL',
    currentLevel: 3,
    progress: 30,
    status: 'paused',
    joinedAt: '2025-02-01',
  },
])

const skillFamilies = computed(() => {
  if (!program.value?.levels) return []

  // Extraer todos los skills de todos los niveles
  const allSkills = program.value.levels.flatMap((level) => level.skills || [])

  // Agrupar por familia
  const familiesMap = {}
  allSkills.forEach((skill) => {
    const familyKey = skill.family || 'general'
    if (!familiesMap[familyKey]) {
      const label = familyKey.charAt(0).toUpperCase() + familyKey.slice(1)
      familiesMap[familyKey] = {
        name: familyKey,
        label: `${label} Family`,
        skills: [],
      }
    }
    familiesMap[familyKey].skills.push({
      id: skill.id,
      name: skill.name,
      levelRequired: skill.unlockAtLevel ?? 1,
      icon: skill.icon || getFamilyEmoji(familyKey),
    })
  })

  return Object.values(familiesMap)
})

const familyEmojis = {
  handstand: '🤸',
  muscleup: '💪',
  frontlever: '🏋️',
  backlever: '🔄',
  planche: '🛹',
  humanflag: '🚩',
  'l-sit': '🪑',
}

const getFamilyEmoji = (family) => familyEmojis[family] || '🎯'

const progressChart = [
  { month: 'Ene', value: 30 },
  { month: 'Feb', value: 45 },
  { month: 'Mar', value: 40 },
  { month: 'Abr', value: 55 },
  { month: 'May', value: 60 },
  { month: 'Jun', value: 75 },
]

const pieData = [
  { level: '1-3', percent: 35, color: '#ff8f38' },
  { level: '4-6', percent: 28, color: '#38b2ac' },
  { level: '7-9', percent: 22, color: '#9f7aea' },
  { level: '10-12', percent: 15, color: '#ed64a6' },
]

const skillStats = [
  { name: 'Handstand Wall', value: 85, count: 132 },
  { name: 'Muscle-up', value: 45, count: 70 },
  { name: 'Front Lever', value: 25, count: 39 },
]

const fetchProgram = async () => {
  loading.value = true
  try {
    let data = null
    const param = route.params.id
    const isNumeric = /^\d+$/.test(param)

    if (isNumeric) {
      // Numeric: try by ID, fallback to slug
      try {
        data = await programService.getById(param)
      } catch (err) {
        if (err.response?.status === 404) {
          data = await programService.getBySlug('calisthenia-master')
        } else {
          throw err
        }
      }
    } else {
      // Slug: go directly to slug endpoint
      data = await programService.getBySlug(param)
    }
    // Enriquecer niveles con campos que espera la UI
    if (data.levels) {
      data.levels = data.levels.map((level) => {
        const legacyData = adaptApiLevelToLegacy(level)
        const hasStaticData = legacyData?.weeks && Object.keys(legacyData.weeks).length > 0
        return {
          ...level,
          hasDetailedTraining: (level.trainings && level.trainings.length > 0) || hasStaticData,
          requirements:
            level.requirements && level.requirements.length > 0
              ? level.requirements
              : level.requirementsSummary
                ? [{ id: 1, name: level.requirementsSummary }]
                : [],
        }
      })
    }
    program.value = data

    // Cargar estadísticas reales del programa
    if (data?.id) {
      try {
        const stats = await programStatsService.getStats(data.id)
        programStats.value = stats
      } catch (err) {
        console.error('Error cargando estadísticas:', err)
        // Mantener valores por defecto (0) si falla
      }
    }
  } catch (err) {
    console.error('Error cargando programa:', err)
    $q.notify({ type: 'negative', message: 'Error al cargar el programa' })
  } finally {
    loading.value = false
  }
}

const goBack = () => router.push('/admin/training-programs')
const editProgram = () => router.push(`/admin/training-programs/${program.value.id}/edit`)
const addLevel = () => router.push(`/admin/training-programs/${program.value.id}/levels/create`)
const editLevel = (level) => router.push(`/admin/training-levels/${level.id}/edit`)
const manageLevelWeeks = (level) => router.push(`/admin/training-levels/${level.id}/phases`)
const manageLevelTrainings = (level) => router.push(`/admin/training-levels/${level.id}/trainings`)

const duplicateLevel = async (level) => {
  try {
    const fullLevel = await levelService.getById(level.id)
    const maxLevelNumber = program.value.levels.reduce((max, l) => Math.max(max, l.levelNumber), 0)
    const payload = {
      programId: program.value.id,
      levelNumber: maxLevelNumber + 1,
      name: `${fullLevel.name || 'Nivel'} (copia)`,
      title: fullLevel.title || '',
      description: fullLevel.description || '',
      objective: fullLevel.objective || '',
      estimatedDurationWeeks: fullLevel.estimatedDurationWeeks ?? 12,
      difficultyRating: fullLevel.difficultyRating ?? null,
      color: fullLevel.color || '#ff8f38',
      icon: fullLevel.icon || '',
      requirementsSummary: fullLevel.requirementsSummary || '',
      tips: fullLevel.tips || [],
      testRequirements: fullLevel.testRequirements || null,
      skillFocus: fullLevel.skillFocus || '',
      programVersion: fullLevel.programVersion || 'v1',
      isLockedByDefault: fullLevel.isLockedByDefault ?? true,
    }
    await levelService.create(payload)
    $q.notify({ type: 'positive', message: 'Nivel duplicado correctamente' })
    await fetchProgram()
  } catch {
    $q.notify({ type: 'negative', message: 'Error al duplicar el nivel' })
  }
}
const viewUser = (user) => router.push(`/admin/user-progress/${user.id}`)
const editUser = (user) => router.push(`/admin/users/${user.id}/edit`)
const addUser = () => {}
const viewSkill = (skill) => router.push(`/admin/training-skills/${skill.id}`)
const addSkill = () => router.push('/admin/training-skills/create')
const duplicateProgram = () => $q.notify({ message: 'Programa duplicado' })
const toggleActive = () => {
  program.value.isActive = !program.value.isActive
  $q.notify({ message: program.value.isActive ? 'Programa activado' : 'Programa desactivado' })
}
const deleteProgram = () => {
  $q.notify({ message: 'Programa eliminado' })
  goBack()
}

onMounted(fetchProgram)
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

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 16px;
  color: #8b949e;
}

.version-selector-bar {
  max-width: 400px;
  margin: 0 auto 24px;
  padding: 8px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.tabs-container {
  background: linear-gradient(135deg, #1c2128 0%, #161b22 100%);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.tabs-header {
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: 12px 20px 0;
  gap: 8px;
}

.tab-btn {
  background: none;
  border: none;
  color: #8b949e;
  padding: 16px 24px 20px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  transition: all 0.3s;
}

.tab-btn:hover {
  color: #fff;
}

.tab-btn.active {
  color: #ff8f38;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 20%;
  right: 20%;
  height: 3px;
  background: #ff8f38;
  border-radius: 3px 3px 0 0;
}

.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 16px;
}

.not-found h2 {
  color: #fff;
  margin: 0;
}

@media (max-width: 768px) {
  .page-content {
    padding: 16px 20px;
  }

  .tabs-header {
    overflow-x: auto;
    flex-wrap: nowrap;
  }

  .tab-btn {
    padding: 12px 16px 16px;
    font-size: 14px;
    white-space: nowrap;
  }
}
</style>
