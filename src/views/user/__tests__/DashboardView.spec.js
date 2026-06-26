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
          ContentCard: {
            props: [
              'title',
              'description',
              'icon',
              'level',
              'badge',
              'footer',
              'variant',
              'showFavorite',
              'isFavorite',
            ],
            emits: ['click', 'toggle-favorite'],
            template: `
              <article
                class="content-card-stub"
                :data-title="title"
                :data-description="description"
                :data-icon="icon"
                :data-level="level"
                :data-badge="badge"
                :data-footer="footer"
                :data-variant="variant"
                :data-show-favorite="showFavorite"
                :data-is-favorite="isFavorite"
              >
                <button class="content-card-stub__action" @click="$emit('click')">Abrir</button>
                <button class="content-card-stub__favorite" @click="$emit('toggle-favorite')">Fav</button>
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

  it('selecciona el programa actual y navega a user-programs al continuar', async () => {
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
    expect(mockPush).toHaveBeenCalledWith({ name: 'user-programs' })
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
            progress: { percentage: 35 },
          },
        ],
      },
    })

    const carousel = wrapper.find('[data-title="Mis programas"]')
    expect(carousel.exists()).toBe(true)

    const card = wrapper.find('.content-card-stub[data-title="Calistenia Master"]')
    expect(card.exists()).toBe(true)
    expect(card.attributes('data-icon')).toBe('self_improvement')
    expect(card.attributes('data-level')).toBe('Intermedio')
    expect(card.attributes('data-footer')).toBe('35% completado')
  })

  it('muestra el enlace "Ver todos" en el carrusel de programas y navega correctamente', async () => {
    const { wrapper } = mountView({
      userProfile: {
        hasActiveProgram: true,
        activePrograms: [{ id: 'p1', name: 'Calistenia Master', difficulty: 'beginner' }],
      },
    })

    const carousel = wrapper.find('[data-title="Mis programas"]')
    expect(carousel.attributes('data-action-label')).toBe('Ver todos')
    expect(carousel.attributes('data-action-to')).toBe(JSON.stringify({ name: 'user-programs' }))

    await carousel.find('.horizontal-carousel-stub__action').trigger('click')

    expect(mockPush).toHaveBeenCalledWith({ name: 'user-programs' })
  })

  it('selecciona un programa y navega a user-programs al pulsar una tarjeta de programa', async () => {
    const { wrapper, userProfileStore } = mountView({
      userProfile: {
        hasActiveProgram: true,
        activePrograms: [{ id: 'p1', name: 'Calistenia Master', difficulty: 'beginner' }],
      },
    })

    await wrapper
      .find('.content-card-stub[data-title="Calistenia Master"] .content-card-stub__action')
      .trigger('click')

    expect(userProfileStore.selectProgram).toHaveBeenCalledWith('p1')
    expect(mockPush).toHaveBeenCalledWith({ name: 'user-programs' })
  })

  it('muestra el carrusel de favoritos con insignias de tipo', () => {
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
              difficulty: 'intermediate',
            },
          },
        ],
      },
    })

    const carousel = wrapper.find('[data-title="Tus favoritos"]')
    expect(carousel.exists()).toBe(true)

    const programCard = wrapper.find('.content-card-stub[data-title="Fuerza básica"]')
    expect(programCard.exists()).toBe(true)
    expect(programCard.attributes('data-badge')).toBe('Programa')
    expect(programCard.attributes('data-show-favorite')).toBe('')

    const trainingCard = wrapper.find('.content-card-stub[data-title="HIIT 20 min"]')
    expect(trainingCard.exists()).toBe(true)
    expect(trainingCard.attributes('data-badge')).toBe('Entreno')
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

  it('navega a user-programs al pulsar un favorito de programa', async () => {
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
      .find('.content-card-stub[data-title="Fuerza básica"] .content-card-stub__action')
      .trigger('click')

    expect(userProfileStore.selectProgram).toHaveBeenCalledWith('p1')
    expect(mockPush).toHaveBeenCalledWith({ name: 'user-programs' })
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
      .find('.content-card-stub[data-title="HIIT 20 min"] .content-card-stub__action')
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
      .find('.content-card-stub[data-title="Fuerza básica"] .content-card-stub__favorite')
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
      .find('.content-card-stub[data-title="HIIT 20 min"] .content-card-stub__favorite')
      .trigger('click')

    expect(favoritesStore.toggleTrainingFavorite).toHaveBeenCalledWith(
      expect.objectContaining({ id: 't1', name: 'HIIT 20 min' }),
    )
  })

  it('siempre muestra el carrusel de descubrir con las disciplinas', () => {
    const { wrapper } = mountView({
      userProfile: { hasActiveProgram: false },
    })

    const carousel = wrapper.find('[data-title="Descubrir"]')
    expect(carousel.exists()).toBe(true)
    expect(wrapper.find('[data-title="Calistenia"]').exists()).toBe(true)
    expect(wrapper.find('[data-title="HIIT"]').exists()).toBe(true)
    expect(wrapper.find('[data-title="Fuerza"]').exists()).toBe(true)
    expect(wrapper.find('[data-title="Skills"]').exists()).toBe(true)
  })

  it('navega a user-explore al pulsar una tarjeta de descubrir', async () => {
    const { wrapper } = mountView({
      userProfile: { hasActiveProgram: false },
    })

    await wrapper.find('[data-title="Calistenia"] .content-card-stub__action').trigger('click')

    expect(mockPush).toHaveBeenCalledWith({ name: 'user-explore' })
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
