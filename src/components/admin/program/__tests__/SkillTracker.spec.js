import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SkillTracker from '../SkillTracker.vue'

describe('SkillTracker', () => {
  it('se renderiza correctamente', () => {
    const wrapper = mount(SkillTracker, {
      props: {
        levels: [
          { levelNumber: 1, skillFocus: null },
          { levelNumber: 2, skillFocus: 'Wall Handstand' },
          { levelNumber: 3, skillFocus: 'L-Sit Tuck' },
        ],
        currentLevel: 2
      }
    })

    expect(wrapper.find('.skill-tracker').exists()).toBe(true)
    expect(wrapper.find('.skill-tracker__title').text()).toContain('Roadmap de Skills')
  })

  it('muestra solo los niveles con skillFocus', () => {
    const wrapper = mount(SkillTracker, {
      props: {
        levels: [
          { levelNumber: 1, skillFocus: null },
          { levelNumber: 2, skillFocus: 'Wall Handstand' },
          { levelNumber: 3, skillFocus: 'L-Sit Tuck' },
          { levelNumber: 4, skillFocus: null },
        ],
        currentLevel: 2
      }
    })

    const nodes = wrapper.findAll('.skill-node')
    expect(nodes.length).toBe(2)
    expect(nodes[0].find('.skill-node__name').text()).toBe('Wall Handstand')
    expect(nodes[1].find('.skill-node__name').text()).toBe('L-Sit Tuck')
  })

  it('resalta el nivel actual', () => {
    const wrapper = mount(SkillTracker, {
      props: {
        levels: [
          { levelNumber: 1, skillFocus: 'Fundamentos' },
          { levelNumber: 2, skillFocus: 'Wall Handstand' },
          { levelNumber: 3, skillFocus: 'L-Sit Tuck' },
        ],
        currentLevel: 2
      }
    })

    const nodes = wrapper.findAll('.skill-node')
    expect(nodes[0].classes()).toContain('skill-node--completed')
    expect(nodes[1].classes()).toContain('skill-node--current')
    expect(nodes[2].classes()).toContain('skill-node--future')
  })

  it('muestra el skill actual', () => {
    const wrapper = mount(SkillTracker, {
      props: {
        levels: [
          { levelNumber: 1, skillFocus: 'Fundamentos' },
          { levelNumber: 2, skillFocus: 'Wall Handstand' },
        ],
        currentLevel: 2
      }
    })

    expect(wrapper.find('.skill-current').exists()).toBe(true)
    expect(wrapper.find('.skill-current__name').text()).toBe('Wall Handstand')
  })

  it('no se renderiza si no hay skills', () => {
    const wrapper = mount(SkillTracker, {
      props: {
        levels: [
          { levelNumber: 1, skillFocus: null },
          { levelNumber: 2, skillFocus: null },
        ],
        currentLevel: 1
      }
    })

    expect(wrapper.find('.skill-tracker').exists()).toBe(false)
  })
})
