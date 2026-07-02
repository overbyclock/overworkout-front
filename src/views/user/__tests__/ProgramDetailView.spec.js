import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { setActivePinia } from 'pinia'
import ProgramDetailView from '../ProgramDetailView.vue'

const mockPush = vi.fn()
const mockNotify = vi.fn()

vi.mock('vue-router', () => ({
  useRoute: () => ({ params: { programId: '1' } }),
  useRouter: () => ({ push: mockPush }),
}))

vi.mock('quasar', () => ({
  useQuasar: () => ({ notify: mockNotify }),
}))

vi.mock('@/services/programs', () => ({
  programService: {
    getById: vi.fn().mockResolvedValue({
      id: 1,
      name: 'Calistenia Master',
      description: 'Domina tu peso corporal',
      discipline: 'calisthenics',
    }),
  },
}))

vi.mock('@/services/levelProgress', () => ({
  levelProgressService: {
    getProgramLevels: vi.fn().mockResolvedValue([
      {
        id: 10,
        levelNumber: 1,
        name: 'Nivel 1',
        objective: 'Fundamentos',
        trainings: [
          {
            id: 100,
            name: 'Sesión A',
            weekNumber: 0,
            sessionType: 'Fuerza',
            estimatedDurationMin: 1800,
            estimatedDurationMax: 2400,
          },
        ],
      },
    ]),
  },
}))

vi.mock('@/services/trainings', () => ({
  trainingService: {
    start: vi.fn().mockResolvedValue({}),
  },
}))

vi.mock('@/constants/disciplines', () => ({
  getDisciplineGradient: vi.fn().mockReturnValue('linear-gradient(135deg, #ff8f38, #38b2ac)'),
  getDisciplineIcon: vi.fn().mockReturnValue('fitness_center'),
  DISCIPLINE_LABELS: {},
}))

describe('ProgramDetailView', () => {
  beforeEach(() => {
    mockPush.mockClear()
    mockNotify.mockClear()
  })

  const mountView = async () => {
    const pinia = createTestingPinia()
    setActivePinia(pinia)

    const wrapper = mount(ProgramDetailView, {
      global: {
        plugins: [pinia],
        stubs: {
          MobilePageHeader: {
            props: ['title', 'showBack', 'backTo'],
            template: '<div class="mobile-page-header-stub">{{ title }}</div>',
          },
          MobileCard: {
            template: '<div class="mobile-card-stub"><slot /></div>',
          },
          'q-spinner': {
            template: '<div class="q-spinner-stub" />',
          },
          'q-icon': {
            props: ['name'],
            template: '<span class="q-icon-stub" :data-name="name" />',
          },
        },
      },
    })

    await flushPromises()
    return wrapper
  }

  it('se renderiza el nombre del programa', async () => {
    const wrapper = await mountView()

    expect(wrapper.text()).toContain('Calistenia Master')
  })
})
