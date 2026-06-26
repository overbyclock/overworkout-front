import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { userStatsService } from '@/services/userStats'
import { extractErrorMessage } from '@/utils/api-helpers'

const defaultStats = () => ({
  streakDays: 0,
  weeklyWorkouts: 0,
  xp: 0,
  totalWorkouts: 0,
  athleteLevel: 1,
})

export const useUserStatsStore = defineStore('userStats', () => {
  // State
  const stats = ref(defaultStats())
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const streakDays = computed(() => stats.value.streakDays ?? 0)
  const weeklyWorkouts = computed(() => stats.value.weeklyWorkouts ?? 0)
  const xp = computed(() => stats.value.xp ?? 0)
  const totalWorkouts = computed(() => stats.value.totalWorkouts ?? 0)
  const athleteLevel = computed(() => stats.value.athleteLevel ?? 1)
  const hasError = computed(() => !!error.value)

  // Actions
  const fetchDashboardStats = async () => {
    loading.value = true
    error.value = null

    try {
      const data = await userStatsService.getDashboardStats()
      stats.value = { ...defaultStats(), ...data }
      return stats.value
    } catch (err) {
      error.value = extractErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const completeTraining = async (trainingId, payload = {}) => {
    loading.value = true
    error.value = null

    try {
      const response = await userStatsService.completeTraining(trainingId, payload)

      if (response.stats) {
        stats.value = { ...defaultStats(), ...response.stats }
      }

      return response
    } catch (err) {
      error.value = extractErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateStats = (newStats) => {
    stats.value = { ...stats.value, ...newStats }
  }

  const clearError = () => {
    error.value = null
  }

  const reset = () => {
    stats.value = defaultStats()
    loading.value = false
    error.value = null
  }

  return {
    // State
    stats,
    loading,
    error,

    // Getters
    streakDays,
    weeklyWorkouts,
    xp,
    totalWorkouts,
    athleteLevel,
    hasError,

    // Actions
    fetchDashboardStats,
    completeTraining,
    updateStats,
    clearError,
    reset,
  }
})
