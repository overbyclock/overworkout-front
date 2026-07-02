import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { setActivePinia } from 'pinia'
import ExploreView from '../ExploreView.vue'
import { useProgramsStore } from '@/stores/programs'
import { useTrainingsStore } from '@/stores/trainings'
import { useFavoritesStore } from '@/stores/favorites'
import { useUserProfileStore } from '@/stores/userProfile'
import { useAuthStore } from '@/stores/auth'
import { EXPLORE_ROUTES, EXPLORE_TABS } from '@/constants/explore'

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
    const trainingsStore = useTrainingsStore()
    const favoritesStore = useFavoritesStore()
    const userProfileStore = useUserProfileStore()
    const authStore = useAuthStore()

    if (options.programs) {
      programsStore.$patch(options.programs)
    }
    if (options.trainings) {
      trainingsStore.$patch(options.trainings)
    }
    if (options.favorites) {
      favoritesStore.$patch(options.favorites)
    }
    if (options.userProfile) {
      userProfileStore.$patch(options.userProfile)
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
            methods: {
              setValue(value) {
                this.$emit('update:modelValue', value)
              },
            },
          },
          'q-tab': {
            props: ['name', 'label'],
            template:
              '<div class="q-tab-stub" :data-name="name" :data-label="label" @click="$parent.setValue(name)"><slot /></div>',
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
            props: ['item', 'type', 'level', 'duration', 'extra', 'isFavorite', 'showFavorite'],
            emits: ['click', 'toggle-favorite'],
            template: `
              <article
                class="poster-card-stub"
                :data-title="item.name"
                :data-type="type"
                :data-level="level"
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

    return { wrapper, programsStore, trainingsStore, favoritesStore, userProfileStore, authStore }
  }

  const mountViewAsync = async (options = {}) => {
    const result = mountView(options)
    await result.wrapper.vm.$nextTick()
    return result
  }

  const clickTab = async (wrapper, tabName) => {
    await wrapper.find(`.q-tab-stub[data-name="${tabName}"]`).trigger('click')
    await wrapper.vm.$nextTick()
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

  it('renderiza las pestañas Programas y Entrenamientos', () => {
    const { wrapper } = mountView()

    const tabs = wrapper.findAll('.q-tab-stub')
    const labels = tabs.map((tab) => tab.attributes('data-label'))
    const names = tabs.map((tab) => tab.attributes('data-name'))

    expect(labels).toContain('Programas')
    expect(labels).toContain('Entrenamientos')
    expect(names).toContain(EXPLORE_TABS.PROGRAMS)
    expect(names).toContain(EXPLORE_TABS.TRAININGS)
  })

  it('cambia a la pestaña Entrenamientos al pulsar su q-tab', async () => {
    const { wrapper } = mountView()

    await clickTab(wrapper, EXPLORE_TABS.TRAININGS)

    expect(wrapper.vm.activeTab).toBe(EXPLORE_TABS.TRAININGS)
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

  it('muestra el carrusel "Recomendado para ti" en la pestaña Programas', () => {
    const { wrapper } = mountView({
      programs: {
        programs: [
          {
            id: 'p1',
            name: 'Calistenia Master',
            discipline: 'calisthenics',
            difficulty: 'intermediate',
          },
        ],
      },
    })

    const carousel = wrapper.find('[data-title="Recomendado para ti"]')

    expect(carousel.exists()).toBe(true)
    expect(carousel.text()).toContain('Calistenia Master')
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

  it('navega a user-program al pulsar un programa activo', async () => {
    const { wrapper, userProfileStore } = mountView({
      programs: {
        programs: [
          {
            id: 'p1',
            name: 'Calistenia Master',
            discipline: 'calisthenics',
            difficulty: 'intermediate',
          },
        ],
      },
      userProfile: {
        activePrograms: [{ id: 'p1', name: 'Calistenia Master' }],
      },
    })

    await wrapper
      .find('.poster-card-stub[data-title="Calistenia Master"] .poster-card-stub__action')
      .trigger('click')

    expect(userProfileStore.selectProgram).toHaveBeenCalledWith('p1')
    expect(mockPush).toHaveBeenCalledWith({ name: EXPLORE_ROUTES.PROGRAMS })
  })

  it('cambia de programa y navega a user-home al pulsar un programa no activo', async () => {
    const { wrapper, userProfileStore } = mountView({
      programs: {
        programs: [
          {
            id: 'p2',
            name: 'CrossFit Pro',
            discipline: 'crossfit',
            difficulty: 'expert',
          },
        ],
      },
      userProfile: {
        activePrograms: [{ id: 'p1', name: 'Calistenia Master' }],
      },
    })

    await wrapper
      .find('.poster-card-stub[data-title="CrossFit Pro"] .poster-card-stub__action')
      .trigger('click')

    expect(userProfileStore.switchProgram).toHaveBeenCalledWith('p2')
    expect(mockPush).toHaveBeenCalledWith({ name: EXPLORE_ROUTES.HOME })
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

  it('muestra los entrenamientos agrupados por disciplina', async () => {
    const { wrapper } = mountView({
      trainings: {
        trainings: [
          {
            id: 't1',
            name: 'HIIT 20',
            discipline: 'crossfit',
            difficulty: 'intermediate',
          },
        ],
      },
    })

    await flushPromises()
    await clickTab(wrapper, EXPLORE_TABS.TRAININGS)

    expect(wrapper.find('[data-title="CrossFit"]').exists()).toBe(true)
    expect(wrapper.find('.poster-card-stub[data-title="HIIT 20"]').exists()).toBe(true)
  })

  it('muestra una notificación al pulsar un entrenamiento', async () => {
    const { wrapper } = mountView({
      trainings: {
        trainings: [
          {
            id: 't1',
            name: 'HIIT 20',
            discipline: 'crossfit',
            difficulty: 'intermediate',
          },
        ],
      },
    })

    await flushPromises()
    await clickTab(wrapper, EXPLORE_TABS.TRAININGS)

    await wrapper
      .find('.poster-card-stub[data-title="HIIT 20"] .poster-card-stub__action')
      .trigger('click')

    expect(mockNotify).toHaveBeenCalled()
  })

  it('llama a toggleTrainingFavorite al pulsar el favorito de un entrenamiento', async () => {
    const { wrapper, favoritesStore } = mountView({
      trainings: {
        trainings: [
          {
            id: 't1',
            name: 'HIIT 20',
            discipline: 'crossfit',
            difficulty: 'intermediate',
          },
        ],
      },
    })

    await flushPromises()
    await clickTab(wrapper, EXPLORE_TABS.TRAININGS)

    await wrapper
      .find('.poster-card-stub[data-title="HIIT 20"] .poster-card-stub__favorite')
      .trigger('click')

    expect(favoritesStore.toggleTrainingFavorite).toHaveBeenCalledWith(
      expect.objectContaining({ id: 't1' }),
    )
  })

  it('muestra el estado de carga mientras se cargan los datos', async () => {
    const { wrapper } = await mountViewAsync({ loading: true })

    expect(wrapper.find('.q-spinner-stub').exists()).toBe(true)
  })

  it('muestra el estado de error cuando falla la carga de programas', () => {
    const { wrapper } = mountView({
      programs: { error: 'Error al cargar programas' },
    })

    expect(wrapper.text()).toContain('Error al cargar programas')
    expect(wrapper.find('[data-testid="error-retry-button"]').exists()).toBe(true)
  })

  it('muestra el estado de error cuando falla la carga de entrenamientos', () => {
    const { wrapper } = mountView({
      trainings: { error: 'Error al cargar entrenamientos' },
    })

    expect(wrapper.text()).toContain('Error al cargar entrenamientos')
    expect(wrapper.find('[data-testid="error-retry-button"]').exists()).toBe(true)
  })

  it('recarga los datos al pulsar el botón de reintentar', async () => {
    const { wrapper, programsStore } = mountView({
      programs: { error: 'Error al cargar programas' },
    })

    await wrapper.find('[data-testid="error-retry-button"]').trigger('click')

    expect(programsStore.fetchPrograms).toHaveBeenCalledTimes(2)
  })

  it('carga programas, entrenamientos, favoritos y progreso al montar', () => {
    const { programsStore, trainingsStore, favoritesStore, userProfileStore } = mountView()

    expect(programsStore.fetchPrograms).toHaveBeenCalledTimes(1)
    expect(trainingsStore.fetchPublicTrainings).toHaveBeenCalledTimes(1)
    expect(favoritesStore.loadFavorites).toHaveBeenCalledTimes(1)
    expect(userProfileStore.fetchActiveProgress).toHaveBeenCalledTimes(1)
  })
})
