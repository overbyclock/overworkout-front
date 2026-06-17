import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { extractErrorMessage } from '@/utils/api-helpers'
import { userProfileService } from '@/services/userProfile'

/**
 * Store para gestionar el perfil de usuario, onboarding y progresos activos.
 */
export const useUserProfileStore = defineStore('userProfile', () => {
  // === STATE ===
  const profile = ref(null)
  const progress = ref([])
  const activeProgress = ref(null)
  const activePrograms = ref([])
  const selectedProgramId = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const onboardingCompleted = ref(false)
  const assessmentCompleted = ref(false)

  // === GETTERS ===
  const hasActiveProgram = computed(() => activePrograms.value.length > 0)

  const selectedProgram = computed(() => {
    if (!selectedProgramId.value) {
      return activePrograms.value[0] || null
    }

    return (
      activePrograms.value.find((p) => p.id === selectedProgramId.value) ||
      activePrograms.value[0] ||
      null
    )
  })

  const currentProgram = computed(() => selectedProgram.value)

  const currentLevel = computed(() => {
    if (!selectedProgram.value || !activeProgress.value) return null

    return activeProgress.value.trainingLevel?.trainingProgram?.id === selectedProgram.value.id
      ? activeProgress.value.trainingLevel
      : null
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

  const selectProgram = (programId) => {
    selectedProgramId.value = programId
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

  const fetchActivePrograms = async () => {
    try {
      const response = await userProfileService.getActivePrograms()
      activePrograms.value = Array.isArray(response) ? response : response['hydra:member'] || []

      // Asegurar que el programa seleccionado sigue siendo válido
      if (
        selectedProgramId.value &&
        !activePrograms.value.some((p) => p.id === selectedProgramId.value)
      ) {
        selectedProgramId.value = activePrograms.value[0]?.id || null
      }

      return activePrograms.value
    } catch {
      activePrograms.value = []
      selectedProgramId.value = null
      return []
    }
  }

  const fetchActiveProgress = async () => {
    loading.value = true
    error.value = null

    try {
      const [progressResponse, programsResponse] = await Promise.all([
        userProfileService.getActiveProgress(),
        fetchActivePrograms(),
      ])

      activeProgress.value = progressResponse

      // Si no hay programa seleccionado, seleccionar el del progreso activo o el primero
      if (!selectedProgramId.value && programsResponse.length > 0) {
        const programFromProgress = progressResponse?.trainingLevel?.trainingProgram
        selectedProgramId.value = programFromProgress?.id || programsResponse[0]?.id
      }

      return progressResponse
    } catch (err) {
      // Si no hay progreso activo, es un estado válido, no un error crítico
      if (err.response?.status === 404) {
        activeProgress.value = null
        await fetchActivePrograms()
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
      await fetchActiveProgress()
      selectProgram(programId)
      return response
    } catch (err) {
      error.value = extractErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const switchProgram = async (programId) => {
    loading.value = true
    error.value = null

    try {
      const response = await userProfileService.switchProgram(programId)
      await fetchActiveProgress()
      selectProgram(programId)
      return response
    } catch (err) {
      error.value = extractErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const abandonActiveProgram = async (programId) => {
    loading.value = true
    error.value = null

    try {
      const response = await userProfileService.abandonActiveProgram(programId)
      await fetchActiveProgress()
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
    activePrograms.value = []
    selectedProgramId.value = null
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
    activePrograms,
    selectedProgramId,
    loading,
    error,
    onboardingCompleted,
    assessmentCompleted,

    // Getters
    hasActiveProgram,
    selectedProgram,
    currentProgram,
    currentLevel,
    currentWeek,
    streakDays,
    totalWorkouts,
    userXp,
    userLevel,

    // Actions
    setProfile,
    selectProgram,
    completeSetup,
    submitAssessment,
    fetchProgress,
    fetchActiveProgress,
    fetchActivePrograms,
    initProgram,
    switchProgram,
    abandonActiveProgram,
    submitTest,
    advanceWeek,
    clearError,
    reset,
  }
})
