import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { setActivePinia } from 'pinia'
import ExploreView from '../ExploreView.vue'
import { useProgramsStore } from '@/stores/programs'
import { useBenchmarksStore } from '@/stores/benchmarks'
import { useFavoritesStore } from '@/stores/favorites'
import { useAuthStore } from '@/stores/auth'
import { EXPLORE_ROUTES } from '@/constants/explore'

const mockPush = vi.fn()
const mockNotify = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush }),
}))

vi.mock('quasar', () => ({
  useQuasar: () => ({ notify: mockNotify }),
}))

describe('ExploreView', () => {
  const mountView = (options = {}) => {
    const pinia = createTestingPinia({
      initialState: options.initialState,
    })
    setActivePinia(pinia)

    const programsStore = useProgramsStore()
    const benchmarksStore = useBenchmarksStore()
    const favoritesStore = useFavoritesStore()
    const authStore = useAuthStore()

    if (options.programs) {
      programsStore.$patch(options.programs)
    }
    if (options.benchmarks) {
      benchmarksStore.$patch(options.benchmarks)
    }
    if (options.favorites) {
      favoritesStore.$patch(options.favorites)
    }
    if (options.auth) {
      authStore.$patch(options.auth)
    }

    const wrapper = mount(ExploreView, {
      global: {
        plugins: [pinia],
        stubs: {
          'q-tabs': {
            props: ['modelValue'],
            emits: ['update:modelValue'],
            template: '<div class="q-tabs-stub"><slot /></div>',
          },
          'q-tab': {
            props: ['name', 'label'],
            template:
              '<div class="q-tab-stub" :data-name="name" :data-label="label"><slot /></div>',
          },
          'q-spinner': {
            template: '<div class="q-spinner-stub" />',
          },
          'q-icon': {
            props: ['name'],
            template: '<span class="q-icon-stub" :data-name="name" />',
          },
          HorizontalCarousel: {
            props: ['title', 'items', 'itemKey'],
            template: `
              <div class="horizontal-carousel-stub" :data-title="title">
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
          PosterCard: {
            props: [
              'item',
              'type',
              'level',
              'levels',
              'duration',
              'extra',
              'isFavorite',
              'showFavorite',
            ],
            emits: ['click', 'toggle-favorite'],
            template: `
              <article
                class="poster-card-stub"
                :data-title="item.name"
                :data-type="type"
                :data-level="level"
                :data-levels="levels"
                :data-duration="duration"
                :data-extra="extra"
                :data-is-favorite="isFavorite"
              >
                <h3 class="poster-card-stub__title">{{ item.name }}</h3>
                <button class="poster-card-stub__action" @click="$emit('click')">Abrir</button>
                <button class="poster-card-stub__favorite" @click="$emit('toggle-favorite')">Fav</button>
              </article>
            `,
          },
        },
      },
    })

    if (options.loading !== undefined) {
      wrapper.vm.loading = options.loading
    }

    return { wrapper, programsStore, benchmarksStore, favoritesStore, authStore }
  }

  const mountViewAsync = async (options = {}) => {
    const result = mountView(options)
    await result.wrapper.vm.$nextTick()
    return result
  }

  beforeEach(() => {
    mockPush.mockClear()
    mockNotify.mockClear()
  })

  it('renderiza el encabezado con título y subtítulo', () => {
    const { wrapper } = mountView()

    expect(wrapper.text()).toContain('Explorar')
    expect(wrapper.text()).toContain('Programas y entrenamientos')
  })

  it('muestra el banner de onboarding si falta el objetivo de entrenamiento', () => {
    const { wrapper } = mountView({
      auth: { user: { trainingGoal: null, estimatedLevel: 'beginner' } },
    })

    expect(wrapper.find('[data-testid="onboarding-banner"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('¿No sabes por dónde empezar?')
    expect(wrapper.text()).toContain('Haz un cuestionario rápido')
  })

  it('muestra el banner de onboarding si falta el nivel estimado', () => {
    const { wrapper } = mountView({
      auth: { user: { trainingGoal: 'strength', estimatedLevel: null } },
    })

    expect(wrapper.find('[data-testid="onboarding-banner"]').exists()).toBe(true)
  })

  it('no muestra el banner de onboarding cuando el perfil está completo', () => {
    const { wrapper } = mountView({
      auth: { user: { trainingGoal: 'strength', estimatedLevel: 'beginner' } },
    })

    expect(wrapper.find('[data-testid="onboarding-banner"]').exists()).toBe(false)
  })

  it('navega a user-welcome al pulsar el CTA del banner', async () => {
    const { wrapper } = mountView({
      auth: { user: { trainingGoal: null, estimatedLevel: null } },
    })

    await wrapper.find('[data-testid="onboarding-banner"] button').trigger('click')

    expect(mockPush).toHaveBeenCalledWith({ name: EXPLORE_ROUTES.WELCOME })
  })

  it('muestra la sección de Programas', () => {
    const { wrapper } = mountView()

    const titles = wrapper.findAll('.explore-section__title')
    const sectionTitles = titles.map((title) => title.text())

    expect(sectionTitles).toContain('Programas')
  })

  it('agrupa los programas por disciplina en carruseles', () => {
    const { wrapper } = mountView({
      programs: {
        programs: [
          {
            id: 'p1',
            name: 'Calistenia Master',
            discipline: 'calisthenics',
            difficulty: 'intermediate',
            levelCount: 3,
            totalPhases: 2,
            totalSessions: 5,
          },
          {
            id: 'p2',
            name: 'CrossFit Pro',
            discipline: 'crossfit',
            difficulty: 'expert',
          },
        ],
      },
    })

    expect(wrapper.find('[data-title="Calistenia"]').exists()).toBe(true)
    expect(wrapper.find('[data-title="CrossFit"]').exists()).toBe(true)
  })

  it('navega a user-program-detail al pulsar un programa', async () => {
    const { wrapper } = mountView({
      programs: {
        programs: [
          {
            id: 'p1',
            name: 'Calistenia Master',
            discipline: 'calisthenics',
            difficulty: 'intermediate',
            levelCount: 3,
            totalPhases: 2,
            totalSessions: 5,
          },
        ],
      },
    })

    await wrapper
      .find('.poster-card-stub[data-title="Calistenia Master"] .poster-card-stub__action')
      .trigger('click')

    expect(mockPush).toHaveBeenCalledWith({
      name: 'user-program-detail',
      params: { programId: 'p1' },
    })
  })

  it('llama a toggleProgramFavorite al pulsar el favorito de un programa', async () => {
    const { wrapper, favoritesStore } = mountView({
      programs: {
        programs: [
          {
            id: 'p1',
            name: 'Calistenia Master',
            discipline: 'calisthenics',
            difficulty: 'intermediate',
            levelCount: 3,
            totalPhases: 2,
            totalSessions: 5,
          },
        ],
      },
    })

    await wrapper
      .find('.poster-card-stub[data-title="Calistenia Master"] .poster-card-stub__favorite')
      .trigger('click')

    expect(favoritesStore.toggleProgramFavorite).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'p1' }),
    )
  })

  it('muestra la sección de Benchmarks', () => {
    const { wrapper } = mountView()

    const titles = wrapper.findAll('.explore-section__title')
    const sectionTitles = titles.map((title) => title.text())

    expect(sectionTitles).toContain('Benchmarks')
  })

  it('agrupa los benchmarks por tipo en carruseles', () => {
    const { wrapper } = mountView({
      benchmarks: {
        benchmarks: [
          {
            id: 'b1',
            name: 'Fran',
            type: 'girl',
            format: 'for_time',
            rounds: 1,
          },
          {
            id: 'b2',
            name: 'Murph',
            type: 'hero',
            format: 'for_time',
          },
        ],
      },
    })

    expect(wrapper.find('[data-title="Hero WODs"]').exists()).toBe(true)
    expect(wrapper.find('[data-title="Girl WODs"]').exists()).toBe(true)
  })

  it('muestra una notificación al pulsar un benchmark', async () => {
    const { wrapper } = mountView({
      benchmarks: {
        benchmarks: [
          {
            id: 'b1',
            name: 'Fran',
            type: 'girl',
            format: 'for_time',
            rounds: 1,
          },
        ],
      },
    })

    await wrapper
      .find('.poster-card-stub[data-title="Fran"] .poster-card-stub__action')
      .trigger('click')

    expect(mockNotify).toHaveBeenCalled()
  })

  it('muestra el estado de carga mientras se cargan los datos', async () => {
    const { wrapper } = await mountViewAsync({ loading: true })

    expect(wrapper.find('[data-testid="explore-loading"]').exists()).toBe(true)
  })

  it('muestra el estado de error cuando falla la carga de programas', () => {
    const { wrapper } = mountView({
      programs: { error: 'Error al cargar programas' },
    })

    expect(wrapper.text()).toContain('Error al cargar programas')
    expect(wrapper.find('[data-testid="error-retry-button"]').exists()).toBe(true)
  })

  it('muestra el estado de error cuando falla la carga de benchmarks', () => {
    const { wrapper } = mountView({
      benchmarks: { error: 'Error al cargar benchmarks' },
    })

    expect(wrapper.text()).toContain('Error al cargar benchmarks')
    expect(wrapper.find('[data-testid="error-retry-button"]').exists()).toBe(true)
  })

  it('recarga los datos al pulsar el botón de reintentar', async () => {
    const { wrapper, programsStore, benchmarksStore, favoritesStore } = mountView({
      programs: { error: 'Error al cargar programas' },
    })

    await wrapper.find('[data-testid="error-retry-button"]').trigger('click')

    expect(programsStore.fetchPrograms).toHaveBeenCalledTimes(2)
    expect(benchmarksStore.fetchBenchmarks).toHaveBeenCalledTimes(2)
    expect(favoritesStore.loadFavorites).toHaveBeenCalledTimes(2)
  })

  it('carga programas, benchmarks y favoritos al montar', () => {
    const { programsStore, benchmarksStore, favoritesStore } = mountView()

    expect(programsStore.fetchPrograms).toHaveBeenCalledTimes(1)
    expect(benchmarksStore.fetchBenchmarks).toHaveBeenCalledTimes(1)
    expect(favoritesStore.loadFavorites).toHaveBeenCalledTimes(1)
  })
})
