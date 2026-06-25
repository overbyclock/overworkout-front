import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DailyStats from '../DailyStats.vue'

/**
 * Tests para el componente DailyStats
 */
describe('DailyStats', () => {
  const mountWithIconStub = (props = {}) =>
    mount(DailyStats, {
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

  it('muestra los tres valores recibidos', () => {
    const wrapper = mountWithIconStub({ streak: 5, weekly: 3, xp: 1200 })

    expect(wrapper.text()).toContain('5')
    expect(wrapper.text()).toContain('3')
    expect(wrapper.text()).toContain('1200')
  })

  it('renderiza las tres etiquetas', () => {
    const wrapper = mountWithIconStub({ streak: 5, weekly: 3, xp: 1200 })

    expect(wrapper.text()).toContain('Racha')
    expect(wrapper.text()).toContain('Esta semana')
    expect(wrapper.text()).toContain('XP')
  })

  it('renderiza los tres iconos con sus nombres', () => {
    const wrapper = mountWithIconStub({ streak: 5, weekly: 3, xp: 1200 })
    const icons = wrapper.findAll('[data-name]')

    expect(icons).toHaveLength(3)
    expect(icons[0].attributes('data-name')).toBe('local_fire_department')
    expect(icons[1].attributes('data-name')).toBe('fitness_center')
    expect(icons[2].attributes('data-name')).toBe('stars')
  })

  it('usa los valores por defecto 0 cuando no se reciben props', () => {
    const wrapper = mountWithIconStub()

    expect(wrapper.text()).toContain('0')
    expect(wrapper.text()).toContain('Racha')
    expect(wrapper.text()).toContain('Esta semana')
    expect(wrapper.text()).toContain('XP')
  })
})
