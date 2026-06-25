import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import WelcomeView from '../WelcomeView.vue'
import { STORAGE_KEYS } from '@/utils/constants'

const mockPush = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush }),
}))

describe('WelcomeView', () => {
  let setItemSpy

  const mountView = () =>
    mount(WelcomeView, {
      global: {
        stubs: {
          'q-icon': {
            props: ['name'],
            template: '<span class="q-icon-stub" :data-name="name" />',
          },
        },
      },
    })

  beforeEach(() => {
    mockPush.mockClear()
    setItemSpy = vi.spyOn(localStorage, 'setItem').mockImplementation(() => {})
  })

  afterEach(() => {
    setItemSpy.mockRestore()
  })

  it('renderiza los botones de acción', () => {
    const wrapper = mountView()

    expect(wrapper.text()).toContain('Empezar ahora')
    expect(wrapper.text()).toContain('Explorar contenido')
  })

  it('navega al onboarding al pulsar "Empezar ahora"', async () => {
    const wrapper = mountView()

    await wrapper.find('button.btn-mobile--primary').trigger('click')

    expect(mockPush).toHaveBeenCalledWith({ name: 'user-onboarding-goal' })
  })

  it('navega al catálogo y marca onboarding como skipped al pulsar "Explorar contenido"', async () => {
    const wrapper = mountView()

    await wrapper.find('button.btn-mobile--ghost').trigger('click')

    expect(setItemSpy).toHaveBeenCalledWith(STORAGE_KEYS.ONBOARDING_SKIPPED, 'true')
    expect(localStorage.setItem).toHaveBeenCalledTimes(1)
    expect(mockPush).toHaveBeenCalledWith({ name: 'user-explore' })
  })
})
