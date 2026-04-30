import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import TestEvaluator from '../TestEvaluator.vue'

vi.mock('@/services/levelProgress', () => ({
  levelProgressService: {
    submitTest: vi.fn(),
  },
}))

import { levelProgressService } from '@/services/levelProgress'

const quasarStubs = {
  'q-icon': { template: '<span class="q-icon"><slot /></span>' },
  'q-badge': { template: '<span class="q-badge"><slot /></span>' },
  'q-input': {
    props: ['modelValue'],
    template: `
      <div class="q-input-stub">
        <input
          :value="modelValue"
          @input="$emit('update:modelValue', Number($event.target.value))"
        />
      </div>
    `,
  },
  'q-btn': {
    props: ['disable', 'loading'],
    template: `
      <button
        class="q-btn"
        :disabled="disable === true || disable === '' || loading"
        @click="$emit('click')"
      >
        <slot />
      </button>
    `,
  },
}

describe('TestEvaluator', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const defaultProps = {
    levelId: 1,
    tests: [
      { name: 'Pull-ups', minimum: 10, unit: 'reps' },
      { name: 'Push-ups', minimum: 20, unit: 'reps' },
      { name: 'Squats', minimum: 25, unit: 'reps' },
      { name: 'Plank', minimum: 45, unit: 'sec' },
    ],
    cyclesCompleted: 0,
  }

  it('se renderiza correctamente', () => {
    const wrapper = mount(TestEvaluator, {
      props: defaultProps,
      global: { stubs: quasarStubs },
    })

    expect(wrapper.find('.test-evaluator').exists()).toBe(true)
    expect(wrapper.find('.test-evaluator__title').text()).toContain('Evaluaci�n de Tests')
  })

  it('muestra los tests con sus m�nimos', () => {
    const wrapper = mount(TestEvaluator, {
      props: defaultProps,
      global: { stubs: quasarStubs },
    })

    const rows = wrapper.findAll('.test-row')
    expect(rows.length).toBe(4)
    expect(rows[0].find('.test-row__name').text()).toBe('Pull-ups')
    expect(rows[0].find('.test-row__minimum').text()).toContain('Min: 10 reps')
  })

  it('muestra badge de ciclo cuando cyclesCompleted > 0', () => {
    const wrapper = mount(TestEvaluator, {
      props: { ...defaultProps, cyclesCompleted: 2 },
      global: { stubs: quasarStubs },
    })

    expect(wrapper.find('.q-badge').exists()).toBe(true)
    expect(wrapper.find('.q-badge').text()).toContain('Ciclo 3')
  })

  it('deshabilita el bot�n si faltan valores', () => {
    const wrapper = mount(TestEvaluator, {
      props: defaultProps,
      global: { stubs: quasarStubs },
    })

    const btn = wrapper.find('.test-evaluator__submit')
    expect(btn.element.disabled).toBe(true)
  })

  it('muestra resultados cuando pasa el test', async () => {
    levelProgressService.submitTest.mockResolvedValue({
      passed: true,
      message: 'Test passed! Level completed.',
      testResult: {
        results: [
          { name: 'Pull-ups', value: 12, minimum: 10, passed: true, unit: 'reps' },
          { name: 'Push-ups', value: 25, minimum: 20, passed: true, unit: 'reps' },
          { name: 'Squats', value: 30, minimum: 25, passed: true, unit: 'reps' },
          { name: 'Plank', value: 60, minimum: 45, passed: true, unit: 'sec' },
        ],
      },
    })

    const wrapper = mount(TestEvaluator, {
      props: defaultProps,
      global: { stubs: quasarStubs },
    })

    // Rellenar inputs directamente via vm para evitar problemas con stubs
    wrapper.vm.localTests[0].value = 12
    wrapper.vm.localTests[1].value = 25
    wrapper.vm.localTests[2].value = 30
    wrapper.vm.localTests[3].value = 60
    await nextTick()

    await wrapper.find('.test-evaluator__submit').trigger('click')
    await nextTick()

    expect(levelProgressService.submitTest).toHaveBeenCalledWith(
      1,
      [
        { name: 'Pull-ups', value: 12 },
        { name: 'Push-ups', value: 25 },
        { name: 'Squats', value: 30 },
        { name: 'Plank', value: 60 },
      ],
      [
        { name: 'Pull-ups', minimum: 10 },
        { name: 'Push-ups', minimum: 20 },
        { name: 'Squats', minimum: 25 },
        { name: 'Plank', minimum: 45 },
      ],
      ''
    )

    expect(wrapper.find('.test-result-banner--pass').exists()).toBe(true)
    expect(wrapper.emitted('passed')).toBeTruthy()
  })

  it('muestra resultados cuando falla el test', async () => {
    levelProgressService.submitTest.mockResolvedValue({
      passed: false,
      message: 'Test failed. Repeat cycle required.',
      testResult: {
        results: [
          { name: 'Pull-ups', value: 5, minimum: 10, passed: false, unit: 'reps' },
          { name: 'Push-ups', value: 15, minimum: 20, passed: false, unit: 'reps' },
          { name: 'Squats', value: 30, minimum: 25, passed: true, unit: 'reps' },
          { name: 'Plank', value: 60, minimum: 45, passed: true, unit: 'sec' },
        ],
      },
    })

    const wrapper = mount(TestEvaluator, {
      props: defaultProps,
      global: { stubs: quasarStubs },
    })

    wrapper.vm.localTests[0].value = 5
    wrapper.vm.localTests[1].value = 15
    wrapper.vm.localTests[2].value = 30
    wrapper.vm.localTests[3].value = 60
    await nextTick()

    await wrapper.find('.test-evaluator__submit').trigger('click')
    await nextTick()

    expect(wrapper.find('.test-result-banner--fail').exists()).toBe(true)
    expect(wrapper.find('.test-evaluator__retry').exists()).toBe(true)
    expect(wrapper.emitted('repeat')).toBeTruthy()
  })

  it('permite reiniciar el formulario tras fallar', async () => {
    levelProgressService.submitTest.mockResolvedValue({
      passed: false,
      message: 'Test failed. Repeat cycle required.',
      testResult: {
        results: [
          { name: 'Pull-ups', value: 5, minimum: 10, passed: false, unit: 'reps' },
        ],
      },
    })

    const wrapper = mount(TestEvaluator, {
      props: {
        levelId: 1,
        tests: [{ name: 'Pull-ups', minimum: 10, unit: 'reps' }],
        cyclesCompleted: 0,
      },
      global: { stubs: quasarStubs },
    })

    wrapper.vm.localTests[0].value = 5
    await wrapper.find('.test-evaluator__submit').trigger('click')
    await nextTick()

    // Volver al formulario
    wrapper.vm.resetForm()
    await nextTick()

    expect(wrapper.find('.test-evaluator__form').exists()).toBe(true)
    expect(wrapper.find('.test-result-banner').exists()).toBe(false)
  })
})
