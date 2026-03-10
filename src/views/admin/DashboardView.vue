<template>
  <q-page class="dashboard-page">
    <div class="dashboard-container">
      <!-- Header Section -->
      <div class="dashboard-header">
        <div>
          <h1 class="dashboard-title">Panel de Control</h1>
          <p class="dashboard-subtitle">Bienvenido de vuelta, {{ userName }}</p>
        </div>
        <div class="dashboard-actions">
          <q-btn color="primary" icon="add" label="Nuevo Entrenamiento" class="action-btn" no-caps
            @click="$router.push({ name: 'admin-trainings' })" />
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div v-for="stat in stats" :key="stat.id" class="stat-card-wrapper">
          <div class="stat-card" :class="stat.gradient">
            <div class="stat-icon-wrapper" :style="{ background: stat.iconBg }">
              <q-icon :name="stat.icon" :style="{ color: stat.iconColor }" size="24px" />
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ formatNumber(stat.value) }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
            <div class="stat-trend" :class="stat.trend > 0 ? 'trend-up' : 'trend-down'">
              <q-icon :name="stat.trend > 0 ? 'trending_up' : 'trending_down'" size="14px" />
              <span>{{ Math.abs(stat.trend) }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="content-grid">
        <!-- Recent Trainings -->
        <div class="content-card trainings-card">
          <div class="card-header">
            <div class="card-title-wrapper">
              <q-icon name="schedule" class="card-icon" size="20px" />
              <h3 class="card-title">Entrenamientos Recientes</h3>
            </div>
            <q-btn flat dense color="primary" label="Ver todos" no-caps @click="$router.push({ name: 'admin-trainings' })" />
          </div>
          <div class="card-body">
            <div v-if="loading" class="loading-state">
              <q-spinner color="primary" size="40px" />
            </div>
            <div v-else-if="recentTrainings.length === 0" class="empty-state">
              <q-icon name="fitness_center" size="48px" color="grey-6" />
              <p>No hay entrenamientos aún</p>
              <q-btn color="primary" label="Crear primero" no-caps size="sm"
                @click="$router.push({ name: 'admin-trainings' })" />
            </div>
            <div v-else class="trainings-list">
              <div v-for="training in recentTrainings" :key="training.id" class="training-item">
                <div class="training-icon">
                  <q-icon name="sports_gymnastics" color="primary" size="24px" />
                </div>
                <div class="training-info">
                  <div class="training-name">{{ training.name }}</div>
                  <div class="training-meta">
                    <span class="meta-badge" :class="training.isPublic ? 'public' : 'private'">
                      {{ training.isPublic ? 'Público' : 'Privado' }}
                    </span>
                    <span class="meta-dot"></span>
                    <span>{{ formatDate(training.createdAt) }}</span>
                  </div>
                </div>
                <div class="training-stats">
                  <div class="stat-badge">
                    <q-icon name="fitness_center" size="14px" />
                    {{ training.exercises?.length || 0 }} ejercicios
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Exercises -->
        <div class="content-card exercises-card">
          <div class="card-header">
            <div class="card-title-wrapper">
              <q-icon name="fitness_center" class="card-icon" size="20px" />
              <h3 class="card-title">Ejercicios Recientes</h3>
            </div>
            <q-btn flat dense color="primary" label="Ver todos" no-caps @click="$router.push({ name: 'admin-exercises' })" />
          </div>
          <div class="card-body">
            <div v-if="loading" class="loading-state">
              <q-spinner color="primary" size="40px" />
            </div>
            <div v-else-if="recentExercises.length === 0" class="empty-state">
              <q-icon name="exercise" size="48px" color="grey-6" />
              <p>No hay ejercicios aún</p>
              <q-btn color="primary" label="Crear primero" no-caps size="sm"
                @click="$router.push({ name: 'admin-exercises' })" />
            </div>
            <div v-else class="exercises-grid">
              <div v-for="exercise in recentExercises" :key="exercise.id" class="exercise-item">
                <div class="exercise-image">
                  <img v-if="exercise.imageUrl" :src="exercise.imageUrl" :alt="exercise.name">
                  <div v-else class="exercise-placeholder">
                    <q-icon name="fitness_center" color="grey-6" size="24px" />
                  </div>
                </div>
                <div class="exercise-info">
                  <div class="exercise-name">{{ exercise.name }}</div>
                  <div class="exercise-category">{{ exercise.category || 'Sin categoría' }}</div>
                </div>
                <div class="exercise-difficulty">
                  <q-rating :model-value="getDifficultyLevel(exercise.difficulty)" :max="3" color="orange" size="16px"
                    readonly icon="local_fire_department" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats Row -->
      <div class="quick-stats-row">
        <div class="content-card full-width">
          <div class="card-header">
            <div class="card-title-wrapper">
              <q-icon name="people" class="card-icon" size="20px" />
              <h3 class="card-title">Usuarios Activos</h3>
            </div>
            <q-btn flat dense color="primary" label="Gestionar" no-caps @click="$router.push({ name: 'admin-users' })" />
          </div>
          <div class="card-body">
            <div v-if="loading" class="loading-state">
              <q-spinner color="primary" size="40px" />
            </div>
            <div v-else class="users-preview">
              <div class="users-avatars">
                <q-avatar v-for="user in usersPreview" :key="user.id" size="40px" class="user-avatar">
                  <img v-if="user.avatar" :src="user.avatar" :alt="user.nick">
                  <span v-else class="avatar-initials">{{ getInitials(user.nick) }}</span>
                </q-avatar>
                <div v-if="totalUsers > 5" class="more-users">+{{ totalUsers - 5 }}</div>
              </div>
              <div class="users-info">
                <div class="users-count">{{ totalUsers }} usuarios registrados</div>
                <div class="users-trend">
                  <q-icon name="trending_up" color="positive" size="16px" />
                  <span class="text-positive">12%</span>
                  <span class="text-grey-6">este mes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { exerciseService, trainingService, userService } from '@/services'
import { useAuthStore } from '@/stores/auth'
import { onMounted, ref } from 'vue'

const authStore = useAuthStore()
const userName = ref(authStore.user?.nick || 'Administrador')

const loading = ref(true)
const stats = ref([
  { id: 1, label: 'Total Usuarios', value: 0, icon: 'people', iconBg: 'rgba(255, 143, 56, 0.2)', iconColor: '#ff8f38', trend: 12, gradient: 'gradient-orange' },
  { id: 2, label: 'Ejercicios', value: 0, icon: 'fitness_center', iconBg: 'rgba(56, 178, 172, 0.2)', iconColor: '#38b2ac', trend: 8, gradient: 'gradient-teal' },
  { id: 3, label: 'Entrenamientos', value: 0, icon: 'schedule', iconBg: 'rgba(147, 112, 219, 0.2)', iconColor: '#9370db', trend: -3, gradient: 'gradient-purple' },
  { id: 4, label: 'Equipamiento', value: 0, icon: 'sports_gymnastics', iconBg: 'rgba(255, 107, 107, 0.2)', iconColor: '#ff6b6b', trend: 5, gradient: 'gradient-red' },
])

const recentTrainings = ref([])
const recentExercises = ref([])
const usersPreview = ref([])
const totalUsers = ref(0)

const fetchDashboardData = async () => {
  loading.value = true
  try {
    // Fetch all data in parallel
    const [trainingsRes, exercisesRes, usersRes] = await Promise.all([
      trainingService.getAll(),
      exerciseService.getAll(),
      userService.getAll(),
    ])

    // Update stats
    stats.value[1].value = exercisesRes.member?.length || exercisesRes['hydra:member']?.length || 0
    stats.value[2].value = trainingsRes.member?.length || trainingsRes['hydra:member']?.length || 0
    stats.value[3].value = 12 // Equipment count - need to fetch separately

    const users = usersRes.member || usersRes['hydra:member'] || []
    stats.value[0].value = users.length
    totalUsers.value = users.length

    // Recent trainings (last 5)
    const allTrainings = trainingsRes.member || trainingsRes['hydra:member'] || []
    recentTrainings.value = allTrainings.slice(0, 5)

    // Recent exercises (last 6)
    const allExercises = exercisesRes.member || exercisesRes['hydra:member'] || []
    recentExercises.value = allExercises.slice(0, 6)

    // Users preview (first 5)
    usersPreview.value = users.slice(0, 5)

  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  } finally {
    loading.value = false
  }
}

const formatNumber = (num) => {
  return new Intl.NumberFormat('es-ES').format(num)
}

const formatDate = (dateString) => {
  if (!dateString) return 'Fecha desconocida'
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const getDifficultyLevel = (difficulty) => {
  const levels = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 }
  return levels[difficulty] || 1
}

const getInitials = (name) => {
  if (!name) return 'U'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

onMounted(() => {
  fetchDashboardData()
})
</script>

<style scoped>
.dashboard-page {
  background: linear-gradient(135deg, #0f1419 0%, #1a1f2e 50%, #0f1419 100%);
  min-height: 100vh;
}

.dashboard-container {
  padding: 24px 32px;
  max-width: 1400px;
  margin: 0 auto;
}

/* Header */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
}

.dashboard-title {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 8px 0;
  letter-spacing: -0.02em;
}

.dashboard-subtitle {
  font-size: 1rem;
  color: #8b949e;
  margin: 0;
}

.dashboard-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  background: linear-gradient(135deg, #ff8f38 0%, #e67e2e 100%);
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  box-shadow: 0 4px 20px rgba(255, 143, 56, 0.3);
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(255, 143, 56, 0.4);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card-wrapper {
  position: relative;
}

.stat-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 24px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  opacity: 0.8;
}

.gradient-orange::before { background: linear-gradient(90deg, #ff8f38, #ff6b35); }
.gradient-teal::before { background: linear-gradient(90deg, #38b2ac, #319795); }
.gradient-purple::before { background: linear-gradient(90deg, #9370db, #7c3aed); }
.gradient-red::before { background: linear-gradient(90deg, #ff6b6b, #ee5a5a); }

.stat-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 255, 255, 0.15);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.stat-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.stat-content {
  margin-bottom: 12px;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.875rem;
  color: #8b949e;
  font-weight: 500;
}

.stat-trend {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
}

.trend-up {
  color: #3fb950;
  background: rgba(63, 185, 80, 0.15);
}

.trend-down {
  color: #f85149;
  background: rgba(248, 81, 73, 0.15);
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 24px;
  margin-bottom: 24px;
}

.content-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.card-title-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-icon {
  color: #ff8f38;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}

.card-body {
  padding: 20px 24px;
}

/* Trainings List */
.trainings-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.training-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  transition: all 0.3s ease;
}

.training-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 143, 56, 0.3);
  transform: translateX(4px);
}

.training-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 143, 56, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.training-info {
  flex: 1;
}

.training-name {
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 6px;
}

.training-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  color: #8b949e;
}

.meta-badge {
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.meta-badge.public {
  background: rgba(63, 185, 80, 0.2);
  color: #3fb950;
}

.meta-badge.private {
  background: rgba(139, 148, 158, 0.2);
  color: #8b949e;
}

.meta-dot {
  width: 4px;
  height: 4px;
  background: #8b949e;
  border-radius: 50%;
}

.stat-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(255, 143, 56, 0.1);
  border-radius: 20px;
  font-size: 0.85rem;
  color: #ff8f38;
  font-weight: 500;
}

/* Exercises Grid */
.exercises-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.exercise-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  transition: all 0.3s ease;
}

.exercise-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(56, 178, 172, 0.3);
}

.exercise-image {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
}

.exercise-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.exercise-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.03);
}

.exercise-info {
  flex: 1;
}

.exercise-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 4px;
}

.exercise-category {
  font-size: 0.8rem;
  color: #8b949e;
}

.exercise-difficulty {
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
}

/* Quick Stats Row */
.quick-stats-row {
  margin-top: 24px;
}

.users-preview {
  display: flex;
  align-items: center;
  gap: 24px;
}

.users-avatars {
  display: flex;
  align-items: center;
}

.user-avatar {
  border: 3px solid #1a1f2e;
  margin-left: -10px;
  transition: transform 0.3s ease;
}

.user-avatar:first-child {
  margin-left: 0;
}

.user-avatar:hover {
  transform: translateY(-4px);
  z-index: 10;
}

.avatar-initials {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ff8f38 0%, #e67e2e 100%);
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
}

.more-users {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 3px solid #1a1f2e;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
  color: #ffffff;
  margin-left: -10px;
}

.users-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.users-count {
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffffff;
}

.users-trend {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.empty-state p {
  color: #8b949e;
  margin: 16px 0;
}

.loading-state {
  display: flex;
  justify-content: center;
  padding: 40px;
}

/* Responsive */
@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 900px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-header {
    flex-direction: column;
    gap: 16px;
  }
}

@media (max-width: 600px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-container {
    padding: 16px;
  }
}
</style>
