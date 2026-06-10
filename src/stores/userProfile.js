import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { extractErrorMessage } from '@/utils/api-helpers'
import { userProfileService } from '@/services/userProfile'

/**
 * Store para gestionar el perfil de usuario, onboarding y progreso activo.
 */
export const useUserProfileStore = defineStore('userProfile', () => {
  // === STATE ===
  const profile = ref(null)
  const progress = ref([])
  const activeProgress = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const onboardingCompleted = ref(false)
  const assessmentCompleted = ref(false)

  // === GETTERS ===
  const hasActiveProgram = computed(() => {
    return activeProgress.value !== null && activeProgress.value.status !== 'completed'
  })

  const currentLevel = computed(() => {
    return activeProgress.value?.trainingLevel || null
  })

  const currentProgram = computed(() => {
    return activeProgress.value?.trainingLevel?.trainingProgram || null
  })

  const currentWeek = computed(() => {
    return activeProgress.value?.currentWeek || 0
  })

  const streakDays = computed(() => {
    // TODO: Calcular basado en historial real
    return profile.value?.streakDays || 0
  })

  const totalWorkouts = computed(() => {
    return profile.value?.totalWorkouts || 0
  })

  const userXp = computed(() => {
    return profile.value?.xp || 0
  })

  const userLevel = computed(() => {
    return profile.value?.athleteLevel || 1
  })

  // === ACTIONS ===
  const setProfile = (data) => {
    profile.value = data
  }

  const completeSetup = async (data) => {
    loading.value = true
    error.value = null

    try {
      const response = await userProfileService.completeSetup(data)
      profile.value = response.profile || response
      onboardingCompleted.value = true
      return response
    } catch (err) {
      error.value = extractErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const submitAssessment = async (data) => {
    loading.value = true
    error.value = null

    try {
      const response = await userProfileService.submitAssessment(data)
      assessmentCompleted.value = true
      if (response.recommendedProgram) {
        profile.value = { ...profile.value, recommendedProgram: response.recommendedProgram }
      }
      return response
    } catch (err) {
      error.value = extractErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchProgress = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await userProfileService.getProgress()
      progress.value = Array.isArray(response) ? response : response['hydra:member'] || []
      return progress.value
    } catch (err) {
      error.value = extractErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchActiveProgress = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await userProfileService.getActiveProgress()
      activeProgress.value = response
      return response
    } catch (err) {
      // Si no hay progreso activo, es un estado válido, no un error crítico
      if (err.response?.status === 404) {
        activeProgress.value = null
      } else {
        error.value = extractErrorMessage(err)
      }
      return null
    } finally {
      loading.value = false
    }
  }

  const initProgram = async (programId) => {
    loading.value = true
    error.value = null

    try {
      const response = await userProfileService.initProgress(programId)
      activeProgress.value = response
      return response
    } catch (err) {
      error.value = extractErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const submitTest = async (levelId, results) => {
    loading.value = true
    error.value = null

    try {
      const response = await userProfileService.submitTestResults(levelId, results)
      // Actualizar progreso activo si el test afectó al nivel actual
      await fetchActiveProgress()
      return response
    } catch (err) {
      error.value = extractErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const advanceWeek = async (levelId) => {
    loading.value = true
    error.value = null

    try {
      const response = await userProfileService.advanceWeek(levelId)
      await fetchActiveProgress()
      return response
    } catch (err) {
      error.value = extractErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  const reset = () => {
    profile.value = null
    progress.value = []
    activeProgress.value = null
    loading.value = false
    error.value = null
    onboardingCompleted.value = false
    assessmentCompleted.value = false
  }

  return {
    // State
    profile,
    progress,
    activeProgress,
    loading,
    error,
    onboardingCompleted,
    assessmentCompleted,

    // Getters
    hasActiveProgram,
    currentLevel,
    currentProgram,
    currentWeek,
    streakDays,
    totalWorkouts,
    userXp,
    userLevel,

    // Actions
    setProfile,
    completeSetup,
    submitAssessment,
    fetchProgress,
    fetchActiveProgress,
    initProgram,
    submitTest,
    advanceWeek,
    clearError,
    reset,
  }
})
