import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ContinueCard from '../ContinueCard.vue'

/**
 * Tests para el componente ContinueCard
 */
describe('ContinueCard', () => {
  const mountWithQuasarStubs = (props = {}) =>
    mount(ContinueCard, {
      props,
      global: {
        stubs: {
          'q-icon': {
            props: ['name'],
            template: '<span class="q-icon-stub" :data-name="name" />',
          },
        },
      },
    })

  it('renderiza la etiqueta, el título y el subtítulo', () => {
    const wrapper = mountWithQuasarStubs({
      title: 'Calistenia Master',
      subtitle: 'Nivel 3 · Sesión 4',
    })

    expect(wrapper.text()).toContain('Continúa donde lo dejaste')
    expect(wrapper.text()).toContain('Calistenia Master')
    expect(wrapper.text()).toContain('Nivel 3 · Sesión 4')
  })

  it('renderiza el título aunque no haya subtítulo', () => {
    const wrapper = mountWithQuasarStubs({ title: 'HIIT Express' })

    expect(wrapper.text()).toContain('Continúa donde lo dejaste')
    expect(wrapper.text()).toContain('HIIT Express')
    expect(wrapper.text()).not.toContain('Nivel')
  })

  it('muestra el botón Continuar con icono de play', () => {
    const wrapper = mountWithQuasarStubs({ title: 'Calistenia Master' })
    const button = wrapper.find('[data-testid="continue-card"]')
    const icon = wrapper.find('[data-name="play_arrow"]')

    expect(button.element.tagName.toLowerCase()).toBe('button')
    expect(button.attributes('role')).toBeUndefined()
    expect(button.attributes('tabindex')).toBeUndefined()
    expect(wrapper.text()).toContain('Continuar')
    expect(icon.exists()).toBe(true)
  })

  it('emite continue al pulsar la tarjeta', async () => {
    const wrapper = mountWithQuasarStubs({
      title: 'Calistenia Master',
      subtitle: 'Nivel 3',
    })

    await wrapper.find('[data-testid="continue-card"]').trigger('click')
    expect(wrapper.emitted('continue')).toHaveLength(1)
  })

  it('emite continue una sola vez al pulsar la acción', async () => {
    const wrapper = mountWithQuasarStubs({ title: 'Calistenia Master' })

    await wrapper.find('.continue-card__action').trigger('click')
    expect(wrapper.emitted('continue')).toHaveLength(1)
  })
})
