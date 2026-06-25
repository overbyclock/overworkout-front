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
          'q-btn': {
            props: ['label', 'icon'],
            template:
              '<button class="q-btn-stub" type="button"><q-icon v-if="icon" :name="icon" /><span v-if="label" class="q-btn__label">{{ label }}</span></button>',
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
    const button = wrapper.find('button')
    const icon = wrapper.find('[data-name="play_arrow"]')

    expect(button.exists()).toBe(true)
    expect(wrapper.text()).toContain('Continuar')
    expect(icon.exists()).toBe(true)
  })

  it('emite click al pulsar el botón Continuar', async () => {
    const wrapper = mountWithQuasarStubs({
      title: 'Calistenia Master',
      subtitle: 'Nivel 3',
    })

    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('emite click al pulsar la tarjeta completa', async () => {
    const wrapper = mountWithQuasarStubs({ title: 'Calistenia Master' })

    await wrapper.find('[data-testid="continue-card"]').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('el botón no propaga el click a la tarjeta', async () => {
    const wrapper = mountWithQuasarStubs({ title: 'Calistenia Master' })

    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })
})
