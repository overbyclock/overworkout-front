import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStatsStore } from '../userStats'
import { userStatsService } from '@/services/userStats'

vi.mock('@/services/userStats', () => ({
  userStatsService: {
    getDashboardStats: vi.fn(),
    completeTraining: vi.fn(),
  },
}))

describe('UserStats Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('inicializa con el estado por defecto', () => {
    const store = useUserStatsStore()

    expect(store.stats).toEqual({
      streakDays: 0,
      weeklyWorkouts: 0,
      xp: 0,
      totalWorkouts: 0,
      athleteLevel: 1,
    })
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('fetchDashboardStats carga y almacena las estadísticas', async () => {
    const store = useUserStatsStore()
    const mockStats = {
      streakDays: 3,
      weeklyWorkouts: 2,
      xp: 150,
      totalWorkouts: 5,
      athleteLevel: 2,
    }

    userStatsService.getDashboardStats.mockResolvedValue(mockStats)

    const result = await store.fetchDashboardStats()

    expect(userStatsService.getDashboardStats).toHaveBeenCalledTimes(1)
    expect(store.stats).toEqual(mockStats)
    expect(store.streakDays).toBe(3)
    expect(store.weeklyWorkouts).toBe(2)
    expect(store.xp).toBe(150)
    expect(result).toEqual(mockStats)
  })

  it('fetchDashboardStats maneja errores correctamente', async () => {
    const store = useUserStatsStore()
    userStatsService.getDashboardStats.mockRejectedValue(new Error('Network error'))

    await expect(store.fetchDashboardStats()).rejects.toThrow('Network error')

    expect(store.error).toBe('Network error')
    expect(store.loading).toBe(false)
  })

  it('completeTraining registra el entrenamiento y actualiza stats', async () => {
    const store = useUserStatsStore()
    const mockResponse = {
      message: 'Entrenamiento completado',
      stats: {
        streakDays: 4,
        weeklyWorkouts: 3,
        xp: 200,
        totalWorkouts: 6,
        athleteLevel: 2,
      },
    }

    userStatsService.completeTraining.mockResolvedValue(mockResponse)

    const result = await store.completeTraining(42, { durationSeconds: 1800 })

    expect(userStatsService.completeTraining).toHaveBeenCalledWith(42, { durationSeconds: 1800 })
    expect(store.stats).toEqual(mockResponse.stats)
    expect(result).toEqual(mockResponse)
  })

  it('completeTraining maneja errores correctamente', async () => {
    const store = useUserStatsStore()
    userStatsService.completeTraining.mockRejectedValue(new Error('Server error'))

    await expect(store.completeTraining(42)).rejects.toThrow('Server error')

    expect(store.error).toBe('Server error')
    expect(store.loading).toBe(false)
  })

  it('updateStats actualiza parcialmente las estadísticas', () => {
    const store = useUserStatsStore()

    store.updateStats({ xp: 999, streakDays: 10 })

    expect(store.xp).toBe(999)
    expect(store.streakDays).toBe(10)
    expect(store.weeklyWorkouts).toBe(0)
  })

  it('reset restaura el estado inicial', () => {
    const store = useUserStatsStore()
    store.stats = { streakDays: 5, weeklyWorkouts: 2, xp: 100, totalWorkouts: 3, athleteLevel: 2 }
    store.loading = true
    store.error = 'Some error'

    store.reset()

    expect(store.stats).toEqual({
      streakDays: 0,
      weeklyWorkouts: 0,
      xp: 0,
      totalWorkouts: 0,
      athleteLevel: 1,
    })
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })
})
