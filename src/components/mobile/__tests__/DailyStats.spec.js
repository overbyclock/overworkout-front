import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DailyStats from '../DailyStats.vue'

/**
 * Tests para el componente DailyStats
 */
describe('DailyStats', () => {
  it('muestra los tres valores recibidos', () => {
    const wrapper = mount(DailyStats, {
      props: { streak: 5, weekly: 3, xp: 1200 },
      global: {
        stubs: {
          'q-icon': {
            props: ['name'],
            template: '<span class="q-icon-stub" />',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('5')
    expect(wrapper.text()).toContain('3')
    expect(wrapper.text()).toContain('1200')
  })
})
