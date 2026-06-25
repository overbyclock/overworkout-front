import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { setActivePinia } from 'pinia'
import ProgramsView from '../ProgramsView.vue'
import { useUserProfileStore } from '@/stores/userProfile'

const mockPush = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush }),
}))

describe('ProgramsView', () => {
  const mountView = (options = {}) => {
    const pinia = createTestingPinia({
      initialState: options.initialState,
    })
    setActivePinia(pinia)

    const userProfileStore = useUserProfileStore()

    if (options.userProfile) {
      Object.assign(userProfileStore, options.userProfile)
    }

    const wrapper = mount(ProgramsView, {
      global: {
        plugins: [pinia],
        stubs: {
          MobilePageHeader: {
            props: ['title', 'centered'],
            template:
              '<header class="mobile-page-header-stub" :data-title="title">{{ title }}</header>',
          },
          'q-icon': {
            props: ['name'],
            template: '<span class="q-icon-stub" :data-name="name" />',
          },
          'q-linear-progress': {
            props: ['value'],
            template: '<div class="q-linear-progress-stub" :data-value="value" />',
          },
          'q-spinner': {
            template: '<div class="q-spinner-stub" />',
          },
        },
      },
    })

    return { wrapper, userProfileStore }
  }

  beforeEach(() => {
    mockPush.mockClear()
  })

  it('muestra el encabezado centrado con "Mis programas"', () => {
    const { wrapper } = mountView({
      userProfile: { loading: false, activePrograms: [] },
    })

    const header = wrapper.find('.mobile-page-header-stub')

    expect(header.exists()).toBe(true)
    expect(header.attributes('data-title')).toBe('Mis programas')
  })

  it('muestra el estado de carga mientras el store está cargando', () => {
    const { wrapper } = mountView({
      userProfile: { loading: true, activePrograms: [] },
    })

    expect(wrapper.find('[data-testid="programs-loading"]').exists()).toBe(true)
  })

  it('muestra los programas activos con sus datos', () => {
    const { wrapper } = mountView({
      userProfile: {
        loading: false,
        activePrograms: [
          {
            id: 'p1',
            name: 'Calistenia Master',
            discipline: 'calisthenics',
            difficulty: 'intermediate',
            totalLevels: 12,
            progress: { percentage: 35 },
          },
          {
            id: 'p2',
            name: 'HIIT Intenso',
            discipline: 'crossfit',
            difficulty: 'expert',
            totalLevels: 8,
            progress: { percentage: 60 },
          },
        ],
      },
    })

    const cards = wrapper.findAll('[data-testid="program-card"]')

    expect(cards).toHaveLength(2)
    expect(cards[0].text()).toContain('Calistenia Master')
    expect(cards[0].text()).toContain('Intermedio')
    expect(cards[0].text()).toContain('12 niveles')
    expect(cards[0].text()).toContain('35%')
    expect(cards[0].find('.q-icon-stub[data-name="self_improvement"]').exists()).toBe(true)

    expect(cards[1].text()).toContain('HIIT Intenso')
    expect(cards[1].text()).toContain('Experto')
    expect(cards[1].text()).toContain('8 niveles')
    expect(cards[1].find('.q-icon-stub[data-name="fitness_center"]').exists()).toBe(true)

    const progressBars = wrapper.findAll('[data-testid="program-progress"]')
    expect(progressBars[0].attributes('data-value')).toBe('0.35')
    expect(progressBars[1].attributes('data-value')).toBe('0.6')
  })

  it('selecciona el programa y navega a user-program al pulsar una tarjeta', async () => {
    const { wrapper, userProfileStore } = mountView({
      userProfile: {
        loading: false,
        activePrograms: [
          {
            id: 'p1',
            name: 'Calistenia Master',
            discipline: 'calisthenics',
            difficulty: 'beginner',
            totalLevels: 10,
            progress: { percentage: 20 },
          },
        ],
      },
    })

    await wrapper.find('[data-testid="program-card"]').trigger('click')

    expect(userProfileStore.selectProgram).toHaveBeenCalledWith('p1')
    expect(mockPush).toHaveBeenCalledWith({ name: 'user-program' })
  })

  it('navega a user-explore al pulsar el CTA inferior', async () => {
    const { wrapper } = mountView({
      userProfile: {
        loading: false,
        activePrograms: [
          {
            id: 'p1',
            name: 'Calistenia Master',
            discipline: 'calisthenics',
            difficulty: 'beginner',
            totalLevels: 10,
            progress: { percentage: 20 },
          },
        ],
      },
    })

    await wrapper.find('[data-testid="explore-cta"]').trigger('click')

    expect(mockPush).toHaveBeenCalledWith({ name: 'user-explore' })
  })

  it('muestra el estado vacío cuando no hay programas activos', () => {
    const { wrapper } = mountView({
      userProfile: { loading: false, activePrograms: [] },
    })

    expect(wrapper.find('[data-testid="empty-state"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Aún no tienes programas activos')
  })

  it('navega a user-explore al pulsar el CTA del estado vacío', async () => {
    const { wrapper } = mountView({
      userProfile: { loading: false, activePrograms: [] },
    })

    await wrapper.find('[data-testid="empty-state"] .empty-state__cta').trigger('click')

    expect(mockPush).toHaveBeenCalledWith({ name: 'user-explore' })
  })

  it('carga los programas activos al montar', () => {
    const { userProfileStore } = mountView({
      userProfile: { loading: false, activePrograms: [] },
    })

    expect(userProfileStore.fetchActiveProgress).toHaveBeenCalledTimes(1)
  })
})
