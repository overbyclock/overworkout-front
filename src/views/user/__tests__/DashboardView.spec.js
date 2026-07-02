import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { setActivePinia } from 'pinia'
import { useRouter } from 'vue-router'
import DashboardView from '../DashboardView.vue'
import { useUserProfileStore } from '@/stores/userProfile'
import { useFavoritesStore } from '@/stores/favorites'
import { useAuthStore } from '@/stores/auth'
import { useUserStatsStore } from '@/stores/userStats'

const mockPush = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush }),
}))

describe('DashboardView', () => {
  const mountView = (options = {}) => {
    const pinia = createTestingPinia({
      initialState: options.initialState,
    })
    setActivePinia(pinia)

    const userProfileStore = useUserProfileStore()
    const favoritesStore = useFavoritesStore()
    const authStore = useAuthStore()
    const userStatsStore = useUserStatsStore()

    if (options.userProfile) {
      Object.assign(userProfileStore, options.userProfile)
    }
    if (options.favorites) {
      Object.assign(favoritesStore, options.favorites)
    }
    if (options.auth) {
      Object.assign(authStore, options.auth)
    }
    if (options.userStats) {
      Object.assign(userStatsStore, options.userStats)
    }

    if (options.preMount) {
      options.preMount({ userProfileStore, favoritesStore, authStore, userStatsStore })
    }

    const wrapper = mount(DashboardView, {
      global: {
        plugins: [pinia],
        stubs: {
          'q-icon': {
            props: ['name'],
            template: '<span class="q-icon-stub" :data-name="name" />',
          },
          HorizontalCarousel: {
            props: ['title', 'items', 'itemKey', 'actionLabel', 'actionTo'],
            setup(props) {
              const router = useRouter()
              const handleAction = () => {
                if (props.actionTo) {
                  router.push(props.actionTo)
                }
              }
              return { handleAction }
            },
            template: `
              <div class="horizontal-carousel-stub" :data-title="title" :data-action-label="actionLabel" :data-action-to="JSON.stringify(actionTo)">
                <button
                  v-if="actionLabel && actionTo"
                  type="button"
                  class="horizontal-carousel-stub__action"
                  @click="handleAction"
                >
                  {{ actionLabel }}
                </button>
                <div
                  v-for="item in items"
                  :key="item[itemKey || 'id']"
                  class="carousel-item-stub"
                  :data-item-id="item[itemKey || 'id']"
                >
                  <slot name="item" :item="item" />
                </div>
              </div>
            `,
          },
          DailyStats: {
            props: ['streak', 'weekly', 'xp'],
            template: `
              <div class="daily-stats-stub" :data-streak="streak" :data-weekly="weekly" :data-xp="xp">
                DailyStats
              </div>
            `,
          },
          ContinueCard: {
            props: ['title', 'subtitle'],
            emits: ['continue'],
            template: `
              <button
                class="continue-card-stub"
                :data-title="title"
                :data-subtitle="subtitle"
                @click="$emit('continue')"
              >
                ContinueCard
              </button>
            `,
          },
          PosterCard: {
            props: [
              'item',
              'type',
              'level',
              'duration',
              'extra',
              'progress',
              'showFavorite',
              'isFavorite',
            ],
            emits: ['click', 'toggle-favorite'],
            template: `
              <article
                class="poster-card-stub"
                :data-item="JSON.stringify(item)"
                :data-type="type"
                :data-level="level"
                :data-duration="duration"
                :data-extra="extra"
                :data-progress="progress"
                :data-show-favorite="showFavorite"
                :data-is-favorite="isFavorite"
              >
                <button class="poster-card-stub__action" @click="$emit('click')">Abrir</button>
                <button class="poster-card-stub__favorite" @click="$emit('toggle-favorite')">Fav</button>
              </article>
            `,
          },
        },
      },
    })

    return { wrapper, userProfileStore, favoritesStore, authStore, userStatsStore }
  }

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 5, 25))
    mockPush.mockClear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renderiza el saludo y la fecha actual en español', () => {
    const { wrapper } = mountView({
      auth: { user: { nick: 'Alex' } },
      userProfile: { hasActiveProgram: false },
    })

    expect(wrapper.text()).toContain('Hola, Alex')
    expect(wrapper.text()).toContain('jueves 25 de junio')
  })

  it('renderiza DailyStats con racha, semana y XP', () => {
    const { wrapper } = mountView({
      userStats: {
        stats: {
          streakDays: 5,
          weeklyWorkouts: 2,
          xp: 1200,
          totalWorkouts: 10,
          athleteLevel: 3,
        },
      },
      userProfile: {
        hasActiveProgram: false,
      },
    })

    const stats = wrapper.find('.daily-stats-stub')
    expect(stats.exists()).toBe(true)
    expect(stats.attributes('data-streak')).toBe('5')
    expect(stats.attributes('data-weekly')).toBe('2')
    expect(stats.attributes('data-xp')).toBe('1200')
  })

  it('muestra el estado vacío cuando no hay programas activos', () => {
    const { wrapper } = mountView({
      userProfile: { hasActiveProgram: false },
    })

    expect(wrapper.find('.empty-state').exists()).toBe(true)
    expect(wrapper.text()).toContain('Aún no tienes un programa')
    expect(wrapper.text()).toContain('Explorar programas')
  })

  it('navega a user-explore al pulsar el CTA del estado vacío', async () => {
    const { wrapper } = mountView({
      userProfile: { hasActiveProgram: false },
    })

    await wrapper.find('.empty-state__cta').trigger('click')

    expect(mockPush).toHaveBeenCalledWith({ name: 'user-explore' })
  })

  it('navega a user-welcome al pulsar el cuestionario del estado vacío', async () => {
    const { wrapper } = mountView({
      userProfile: { hasActiveProgram: false },
    })

    const buttons = wrapper.findAll('.empty-state__cta')
    await buttons[1].trigger('click')

    expect(mockPush).toHaveBeenCalledWith({ name: 'user-welcome' })
  })

  it('no muestra ContinueCard ni carrusel de programas sin programas activos', () => {
    const { wrapper } = mountView({
      userProfile: { hasActiveProgram: false, activePrograms: [] },
    })

    expect(wrapper.find('.continue-card-stub').exists()).toBe(false)
    expect(wrapper.find('[data-title="Mis programas"]').exists()).toBe(false)
  })

  it('muestra ContinueCard con datos del programa actual cuando hay progreso activo', () => {
    const { wrapper } = mountView({
      userProfile: {
        hasActiveProgram: true,
        currentProgram: { id: 'p1', name: 'Calistenia Master', difficulty: 'intermediate' },
        currentLevel: { name: 'Nivel 3' },
        activePrograms: [],
      },
    })

    const continueCard = wrapper.find('.continue-card-stub')
    expect(continueCard.exists()).toBe(true)
    expect(continueCard.attributes('data-title')).toBe('Calistenia Master')
    expect(continueCard.attributes('data-subtitle')).toBe('Nivel 3')
  })

  it('selecciona el programa actual y navega a user-program al continuar', async () => {
    const { wrapper, userProfileStore } = mountView({
      userProfile: {
        hasActiveProgram: true,
        currentProgram: { id: 'p1', name: 'Calistenia Master', difficulty: 'intermediate' },
        currentLevel: null,
        activePrograms: [],
      },
    })

    await wrapper.find('.continue-card-stub').trigger('click')

    expect(userProfileStore.selectProgram).toHaveBeenCalledWith('p1')
    expect(mockPush).toHaveBeenCalledWith({ name: 'user-program' })
  })

  it('muestra el carrusel de programas activos con las tarjetas correctas', () => {
    const { wrapper } = mountView({
      userProfile: {
        hasActiveProgram: true,
        activePrograms: [
          {
            id: 'p1',
            name: 'Calistenia Master',
            description: 'Domina tu peso corporal',
            discipline: 'calisthenics',
            difficulty: 'intermediate',
            estimatedDurationWeeks: 8,
            totalLevels: 4,
            progress: { percentage: 35 },
          },
        ],
      },
    })

    const carousel = wrapper.find('[data-title="Mis programas"]')
    expect(carousel.exists()).toBe(true)

    const card = wrapper.find('.poster-card-stub[data-type="program"]')
    expect(card.exists()).toBe(true)
    expect(card.attributes('data-level')).toBe('Intermedio')
    expect(card.attributes('data-duration')).toBe('8 semanas')
    expect(card.attributes('data-extra')).toBe('4 niveles')
    expect(card.attributes('data-progress')).toBe('35')
  })

  it('selecciona un programa y navega a user-program al pulsar una tarjeta de programa', async () => {
    const { wrapper, userProfileStore } = mountView({
      userProfile: {
        hasActiveProgram: true,
        activePrograms: [{ id: 'p1', name: 'Calistenia Master', difficulty: 'beginner' }],
      },
    })

    await wrapper
      .find('.poster-card-stub[data-type="program"] .poster-card-stub__action')
      .trigger('click')

    expect(userProfileStore.selectProgram).toHaveBeenCalledWith('p1')
    expect(mockPush).toHaveBeenCalledWith({ name: 'user-program' })
  })

  it('muestra el carrusel de favoritos con programas y entrenamientos', () => {
    const { wrapper } = mountView({
      userProfile: { hasActiveProgram: false },
      favorites: {
        programFavorites: [
          {
            id: 'f1',
            trainingProgram: {
              id: 'p1',
              name: 'Fuerza básica',
              description: 'Programa inicial',
              discipline: 'fitness',
              difficulty: 'beginner',
              estimatedDurationWeeks: 4,
              totalLevels: 2,
            },
          },
        ],
        trainingFavorites: [
          {
            id: 'f2',
            training: {
              id: 't1',
              name: 'HIIT 20 min',
              description: 'Quema rápida',
              discipline: 'crossfit',
              sessionType: 'HIIT',
              estimatedDurationMin: 15,
              estimatedDurationMax: 25,
              rounds: 5,
            },
          },
        ],
      },
    })

    const carousel = wrapper.find('[data-title="Tus favoritos"]')
    expect(carousel.exists()).toBe(true)

    const programCard = wrapper.find('.poster-card-stub[data-type="program"]')
    expect(programCard.exists()).toBe(true)
    expect(programCard.attributes('data-level')).toBe('Principiante')
    expect(programCard.attributes('data-duration')).toBe('4 semanas')
    expect(programCard.attributes('data-extra')).toBe('2 niveles')
    expect(programCard.attributes('data-show-favorite')).toBeDefined()
    expect(programCard.attributes('data-is-favorite')).toBeDefined()

    const trainingCard = wrapper.find('.poster-card-stub[data-type="training"]')
    expect(trainingCard.exists()).toBe(true)
    expect(trainingCard.attributes('data-level')).toBe('HIIT')
    expect(trainingCard.attributes('data-duration')).toBe('15-25 min')
    expect(trainingCard.attributes('data-extra')).toBe('5 rounds')
  })

  it('muestra el enlace "Ver todos" en el carrusel de favoritos y navega correctamente', async () => {
    const { wrapper } = mountView({
      userProfile: { hasActiveProgram: false },
      favorites: {
        programFavorites: [
          {
            id: 'f1',
            trainingProgram: {
              id: 'p1',
              name: 'Fuerza básica',
              discipline: 'fitness',
              difficulty: 'beginner',
            },
          },
        ],
        trainingFavorites: [],
      },
    })

    const carousel = wrapper.find('[data-title="Tus favoritos"]')
    expect(carousel.attributes('data-action-label')).toBe('Ver todos')
    expect(carousel.attributes('data-action-to')).toBe(JSON.stringify({ name: 'user-explore' }))

    await carousel.find('.horizontal-carousel-stub__action').trigger('click')

    expect(mockPush).toHaveBeenCalledWith({ name: 'user-explore' })
  })

  it('navega a user-program al pulsar un favorito de programa', async () => {
    const { wrapper, userProfileStore } = mountView({
      userProfile: { hasActiveProgram: false },
      favorites: {
        programFavorites: [
          {
            id: 'f1',
            trainingProgram: {
              id: 'p1',
              name: 'Fuerza básica',
              discipline: 'fitness',
              difficulty: 'beginner',
            },
          },
        ],
        trainingFavorites: [],
      },
    })

    await wrapper
      .find('.poster-card-stub[data-type="program"] .poster-card-stub__action')
      .trigger('click')

    expect(userProfileStore.selectProgram).toHaveBeenCalledWith('p1')
    expect(mockPush).toHaveBeenCalledWith({ name: 'user-program' })
  })

  it('navega a user-explore al pulsar un favorito de entrenamiento', async () => {
    const { wrapper } = mountView({
      userProfile: { hasActiveProgram: false },
      favorites: {
        programFavorites: [],
        trainingFavorites: [
          {
            id: 'f2',
            training: {
              id: 't1',
              name: 'HIIT 20 min',
              discipline: 'crossfit',
              difficulty: 'intermediate',
            },
          },
        ],
      },
    })

    await wrapper
      .find('.poster-card-stub[data-type="training"] .poster-card-stub__action')
      .trigger('click')

    expect(mockPush).toHaveBeenCalledWith({ name: 'user-explore' })
  })

  it('elimina un favorito de programa al pulsar su botón de favorito', async () => {
    const { wrapper, favoritesStore } = mountView({
      userProfile: { hasActiveProgram: false },
      favorites: {
        programFavorites: [
          {
            id: 'f1',
            trainingProgram: {
              id: 'p1',
              name: 'Fuerza básica',
              discipline: 'fitness',
              difficulty: 'beginner',
            },
          },
        ],
        trainingFavorites: [],
      },
    })

    await wrapper
      .find('.poster-card-stub[data-type="program"] .poster-card-stub__favorite')
      .trigger('click')

    expect(favoritesStore.toggleProgramFavorite).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'p1', name: 'Fuerza básica' }),
    )
  })

  it('elimina un favorito de entrenamiento al pulsar su botón de favorito', async () => {
    const { wrapper, favoritesStore } = mountView({
      userProfile: { hasActiveProgram: false },
      favorites: {
        programFavorites: [],
        trainingFavorites: [
          {
            id: 'f2',
            training: {
              id: 't1',
              name: 'HIIT 20 min',
              discipline: 'crossfit',
              difficulty: 'intermediate',
            },
          },
        ],
      },
    })

    await wrapper
      .find('.poster-card-stub[data-type="training"] .poster-card-stub__favorite')
      .trigger('click')

    expect(favoritesStore.toggleTrainingFavorite).toHaveBeenCalledWith(
      expect.objectContaining({ id: 't1', name: 'HIIT 20 min' }),
    )
  })

  it('no muestra la sección Descubrir', () => {
    const { wrapper } = mountView({
      userProfile: { hasActiveProgram: false },
    })

    expect(wrapper.text()).not.toContain('Descubrir')
    expect(wrapper.find('[data-title="Descubrir"]').exists()).toBe(false)
  })

  it('muestra sección de programas y favoritos cuando hay datos', () => {
    const { wrapper } = mountView({
      userProfile: {
        hasActiveProgram: true,
        activePrograms: [
          {
            id: 'p1',
            name: 'Calistenia Master',
            difficulty: 'intermediate',
            estimatedDurationWeeks: 8,
            totalLevels: 4,
          },
        ],
      },
      favorites: {
        programFavorites: [
          {
            id: 'f1',
            trainingProgram: {
              id: 'p2',
              name: 'Fuerza básica',
              difficulty: 'beginner',
            },
          },
        ],
        trainingFavorites: [],
      },
    })

    expect(wrapper.find('[data-title="Mis programas"]').exists()).toBe(true)
    expect(wrapper.find('[data-title="Tus favoritos"]').exists()).toBe(true)
  })

  it('muestra estado vacío de programas y favoritos cuando no hay programa activo ni favoritos', () => {
    const { wrapper } = mountView({
      userProfile: { hasActiveProgram: false, activePrograms: [] },
      favorites: { programFavorites: [], trainingFavorites: [] },
    })

    expect(wrapper.text()).toContain('Tus programas y favoritos')
    expect(wrapper.text()).toContain('Aquí aparecerán los programas en los que estés inscrito')
    expect(wrapper.text()).toContain('Explorar contenido')
  })

  it('carga progreso, favoritos y estadísticas en paralelo al montar', async () => {
    const { wrapper, userProfileStore, favoritesStore, userStatsStore } = mountView({
      userProfile: { hasActiveProgram: false },
    })

    await wrapper.vm.$nextTick()

    expect(userProfileStore.fetchActiveProgress).toHaveBeenCalledTimes(1)
    expect(favoritesStore.loadFavorites).toHaveBeenCalledTimes(1)
    expect(userStatsStore.fetchDashboardStats).toHaveBeenCalledTimes(1)
  })

  it('renderiza el dashboard aunque falle la carga de datos', async () => {
    const { wrapper } = mountView({
      userProfile: { hasActiveProgram: false },
      preMount: ({ userProfileStore, favoritesStore, userStatsStore }) => {
        userProfileStore.fetchActiveProgress = vi.fn().mockRejectedValue(new Error('Network error'))
        favoritesStore.loadFavorites = vi.fn().mockRejectedValue(new Error('Network error'))
        userStatsStore.fetchDashboardStats = vi.fn().mockRejectedValue(new Error('Network error'))
      },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.find('.dashboard-view').exists()).toBe(true)
    expect(wrapper.find('.empty-state').exists()).toBe(true)
  })
})
