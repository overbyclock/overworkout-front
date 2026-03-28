<template>
  <q-page class="page-container">
    <div v-if="loading" class="loading-state">
      <q-spinner size="60px" color="primary" />
      <p>Cargando programa...</p>
    </div>

    <template v-else-if="program">
      <ProgramHeader :program="program" :gradient="programGradient" :icon="programIcon" @back="goBack"
        @edit="editProgram" @duplicate="duplicateProgram" @toggle-active="toggleActive" @delete="deleteProgram" />

      <div class="page-content">
        <ProgramStats :stats="statsList" />

        <div class="tabs-container">
          <div class="tabs-header">
            <button v-for="tab in tabs" :key="tab.id" class="tab-btn" :class="{ active: activeTab === tab.id }"
              @click="activeTab = tab.id">
              <q-icon :name="tab.icon" size="20px" />
              <span>{{ tab.label }}</span>
              <q-badge v-if="tab.count" color="primary" floating>{{ tab.count }}</q-badge>
            </button>
          </div>

          <LevelsTab v-if="activeTab === 'levels'" :levels="program.levels" @add="addLevel" @edit="editLevel">
            <template #level-detail="{ level }">
              <LevelDetail :level="level" :level-data="getLevelData(level.levelNumber)" />
            </template>
          </LevelsTab>

          <UsersTab v-else-if="activeTab === 'users'" :users="programUsers" @add="addUser" @view="viewUser"
            @edit="editUser" />

          <SkillsTab v-else-if="activeTab === 'skills'" :families="skillFamilies" @add="addSkill"
            @view="viewSkill" />

          <AchievementsTab v-else-if="activeTab === 'achievements'" :achievements="achievements" @add="addAchievement" />

          <AnalyticsTab v-else-if="activeTab === 'analytics'" :stats="stats" :progress-chart="progressChart"
            :pie-data="pieData" :skill-stats="skillStats" />
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
  ProgramHeader, ProgramStats, LevelsTab, UsersTab,
  SkillsTab, AchievementsTab, AnalyticsTab
} from '@/components/admin'
import LevelDetail from '@/components/admin/program/LevelDetail.vue'
import nivel1Fundamentos from '@/data/calistenia-master-program'
import nivel2Intermedio from '@/data/calistenia-master-level2'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()

const loading = ref(true)
const program = ref(null)
const activeTab = ref('levels')

const calisteniaLevels = { 1: ref(nivel1Fundamentos), 2: ref(nivel2Intermedio) }

const getLevelData = (levelNumber) => calisteniaLevels[levelNumber]?.value || null

const tabs = [
  { id: 'levels', label: 'Niveles', icon: 'stairs', count: 12 },
  { id: 'users', label: 'Usuarios', icon: 'people', count: 156 },
  { id: 'skills', label: 'Skills', icon: 'emoji_events', count: 18 },
  { id: 'achievements', label: 'Logros', icon: 'military_tech', count: 29 },
  { id: 'analytics', label: 'Analíticas', icon: 'analytics' },
]

const stats = ref({
  totalUsers: 156, avgProgress: 42, completions: 23, avgTime: 45, paused: 12, dropped: 8
})

const statsList = computed(() => [
  { value: stats.value.totalUsers, label: 'Usuarios activos', icon: 'people' },
  { value: stats.value.avgProgress + '%', label: 'Progreso medio', icon: 'trending_up' },
  { value: stats.value.completions, label: 'Completados', icon: 'emoji_events' },
  { value: stats.value.avgTime + 'm', label: 'Tiempo medio/día', icon: 'schedule' },
])

const programGradient = computed(() => ({
  'calisthenics': 'linear-gradient(135deg, #ff8f38 0%, #ff6b6b 100%)',
  'crossfit': 'linear-gradient(135deg, #38b2ac 0%, #4299e1 100%)',
}[program.value?.discipline] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'))

const programIcon = computed(() => ({
  'calisthenics': '🤸', 'crossfit': '🏋️', 'fitness': '💪'
}[program.value?.discipline] || '🎯'))

const programUsers = ref([
  { id: 1, name: 'Juan Pérez', initials: 'JP', currentLevel: 5, progress: 65, status: 'active', joinedAt: '2025-01-15' },
  { id: 2, name: 'María García', initials: 'MG', currentLevel: 8, progress: 82, status: 'active', joinedAt: '2024-11-20' },
  { id: 3, name: 'Carlos López', initials: 'CL', currentLevel: 3, progress: 30, status: 'paused', joinedAt: '2025-02-01' },
])

const skillFamilies = ref([
  {
    name: 'handstand', label: 'Handstand Family',
    skills: [
      { id: 1, name: 'Handstand Wall', levelRequired: 1, icon: '🤸' },
      { id: 2, name: 'Free Handstand', levelRequired: 5, icon: '🤸' },
      { id: 3, name: 'Handstand Push-up', levelRequired: 8, icon: '💪' },
    ]
  },
  {
    name: 'muscleup', label: 'Muscle-up Family',
    skills: [
      { id: 4, name: 'Muscle-up Progression', levelRequired: 3, icon: '💪' },
      { id: 5, name: 'Full Muscle-up', levelRequired: 6, icon: '🏆' },
      { id: 6, name: 'Muscle-up L-sit', levelRequired: 9, icon: '⭐' },
    ]
  },
])

const achievements = ref([
  { id: 1, name: 'Primeros Pasos', description: 'Completa el nivel 1', category: 'progress', icon: '🎯', xpReward: 100 },
  { id: 2, name: 'Handstand Master', description: 'Desbloquea el handstand libre', category: 'skill', icon: '🤸', xpReward: 500 },
  { id: 3, name: 'Constancia', description: 'Entrena 7 días seguidos', category: 'consistency', icon: '🔥', xpReward: 200 },
])

const progressChart = [
  { month: 'Ene', value: 30 }, { month: 'Feb', value: 45 }, { month: 'Mar', value: 40 },
  { month: 'Abr', value: 55 }, { month: 'May', value: 60 }, { month: 'Jun', value: 75 },
]

const pieData = [
  { level: '1-3', percent: 35, color: '#ff8f38' }, { level: '4-6', percent: 28, color: '#38b2ac' },
  { level: '7-9', percent: 22, color: '#9f7aea' }, { level: '10-12', percent: 15, color: '#ed64a6' },
]

const skillStats = [
  { name: 'Handstand Wall', value: 85, count: 132 }, { name: 'Muscle-up', value: 45, count: 70 },
  { name: 'Front Lever', value: 25, count: 39 },
]

const fetchProgram = async () => {
  loading.value = true
  try {
    await new Promise(r => setTimeout(r, 800))
    program.value = {
      id: route.params.id,
      name: 'Calistenia Master',
      slug: 'calistenia-master',
      description: 'Programa completo de calistenia desde cero hasta nivel experto.',
      discipline: 'calisthenics',
      totalLevels: 12,
      estimatedDurationWeeks: 144,
      isActive: true,
      levels: Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        levelNumber: i + 1,
        name: ['Fundamentos', 'Intermedio', 'Aprendiz', 'Intermedio-Avanzado', 'Avanzado', 'Experto', 'Elite', 'Master', 'Grand Master', 'Legendario', 'Divino', 'Titán'][i],
        description: i === 0 ? 'Base: Push-ups asistidos, Australian Pull-ups...' : `Nivel ${i + 1}`,
        isLockedByDefault: i > 0,
        requirements: [{ id: 1 }, { id: 2 }],
        hasDetailedTraining: i < 2
      }))
    }
  } catch {
    $q.notify({ type: 'negative', message: 'Error al cargar el programa' })
  } finally {
    loading.value = false
  }
}

const goBack = () => router.push('/admin/training-programs')
const editProgram = () => router.push(`/admin/training-programs/${program.value.id}/edit`)
const addLevel = () => router.push(`/admin/training-programs/${program.value.id}/levels/create`)
const editLevel = (level) => router.push(`/admin/training-levels/${level.id}/edit`)
const viewUser = (user) => router.push(`/admin/user-progress/${user.id}`)
const editUser = (user) => router.push(`/admin/users/${user.id}/edit`)
const addUser = () => { }
const viewSkill = (skill) => router.push(`/admin/training-skills/${skill.id}`)
const addSkill = () => router.push('/admin/training-skills/create')
const addAchievement = () => router.push('/admin/achievements/create')
const duplicateProgram = () => $q.notify({ message: 'Programa duplicado' })
const toggleActive = () => {
  program.value.isActive = !program.value.isActive
  $q.notify({ message: program.value.isActive ? 'Programa activado' : 'Programa desactivado' })
}
const deleteProgram = () => { $q.notify({ message: 'Programa eliminado' }); goBack() }

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
