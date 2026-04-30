<template>
  <div class="test-evaluator">
    <div class="test-evaluator__header">
      <q-icon name="fitness_center" size="20px" class="q-mr-sm" />
      <span class="test-evaluator__title">Evaluaci�n de Tests</span>
      <q-badge
        v-if="cyclesCompleted > 0"
        color="orange"
        class="q-ml-sm"
        outline
      >
        Ciclo {{ cyclesCompleted + 1 }}
      </q-badge>
    </div>

    <div v-if="!showingResults" class="test-evaluator__form">
      <p class="test-evaluator__hint">
        Introduce tus resultados. Necesitas superar al menos 3 de 4 tests para pasar de nivel.
      </p>

      <div
        v-for="(test, index) in localTests"
        :key="test.name"
        class="test-row"
        :class="{ 'test-row--passed': test.value >= test.minimum }"
      >
        <div class="test-row__info">
          <span class="test-row__name">{{ test.name }}</span>
          <span class="test-row__minimum">Min: {{ test.minimum }} {{ test.unit }}</span>
        </div>
        <q-input
          v-model.number="localTests[index].value"
          type="number"
          dense
          outlined
          dark
          class="test-row__input"
          :class="{ 'test-row__input--passed': test.value >= test.minimum }"
          placeholder="0"
          min="0"
        />
        <span class="test-row__unit">{{ test.unit }}</span>
      </div>

      <q-input
        v-model="notes"
        type="textarea"
        dense
        outlined
        dark
        class="test-evaluator__notes q-mt-sm"
        placeholder="Notas adicionales (opcional)"
        rows="2"
      />

      <q-btn
        color="primary"
        class="test-evaluator__submit q-mt-md full-width"
        :loading="submitting"
        :disable="!canSubmit"
        @click="submitResults"
      >
        <q-icon name="send" class="q-mr-sm" />
        Evaluar Tests
      </q-btn>
    </div>

    <div v-else class="test-evaluator__results">
      <div
        class="test-result-banner"
        :class="result.passed ? 'test-result-banner--pass' : 'test-result-banner--fail'"
      >
        <q-icon
          :name="result.passed ? 'check_circle' : 'replay'"
          size="32px"
        />
        <span class="test-result-banner__text">{{ result.message }}</span>
      </div>

      <div class="test-result-details">
        <div
          v-for="item in result.details"
          :key="item.name"
          class="test-result-item"
          :class="{ 'test-result-item--passed': item.passed }"
        >
          <div class="test-result-item__name">{{ item.name }}</div>
          <div class="test-result-item__score">
            <span :class="item.passed ? 'text-positive' : 'text-negative'">
              {{ item.value }}
            </span>
            <span class="text-grey">/ {{ item.minimum }} {{ item.unit }}</span>
          </div>
          <q-icon
            :name="item.passed ? 'check' : 'close'"
            :color="item.passed ? 'positive' : 'negative'"
            size="18px"
          />
        </div>
      </div>

      <q-btn
        v-if="!result.passed"
        color="warning"
        class="test-evaluator__retry q-mt-md full-width"
        @click="resetForm"
      >
        <q-icon name="replay" class="q-mr-sm" />
        Intentar de nuevo
      </q-btn>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { levelProgressService } from '@/services/levelProgress'

const props = defineProps({
  levelId: { type: Number, required: true },
  tests: {
    type: Array,
    required: true,
    // [{ name, minimum, unit }]
  },
  cyclesCompleted: { type: Number, default: 0 },
})

const emit = defineEmits(['passed', 'repeat'])

const localTests = ref(
  props.tests.map((t) => ({
    name: t.name,
    value: 0,
    minimum: t.minimum,
    unit: t.unit || 'reps',
  }))
)

const notes = ref('')
const submitting = ref(false)
const showingResults = ref(false)
const result = ref({ passed: false, message: '', details: [] })

const canSubmit = computed(() => {
  return localTests.value.every((t) => t.value !== '' && t.value > 0)
})

async function submitResults() {
  submitting.value = true

  const results = localTests.value.map((t) => ({
    name: t.name,
    value: Number(t.value),
  }))

  const requirements = props.tests.map((t) => ({
    name: t.name,
    minimum: t.minimum,
  }))

  try {
    const data = await levelProgressService.submitTest(
      props.levelId,
      results,
      requirements,
      notes.value
    )

    result.value = {
      passed: data.passed,
      message: data.message,
      details: data.testResult.results,
    }

    showingResults.value = true

    if (data.passed) {
      emit('passed', data)
    } else {
      emit('repeat', data)
    }
  } catch (err) {
    console.error('Error submitting tests:', err)
  } finally {
    submitting.value = false
  }
}

function resetForm() {
  showingResults.value = false
  localTests.value = props.tests.map((t) => ({
    name: t.name,
    value: 0,
    minimum: t.minimum,
    unit: t.unit || 'reps',
  }))
  notes.value = ''
}
</script>

<style scoped>
.test-evaluator {
  background: var(--color-card-bg, #212529);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.test-evaluator__header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  color: #fff;
}

.test-evaluator__title {
  font-weight: 600;
  font-size: 1rem;
}

.test-evaluator__hint {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
  margin-bottom: 12px;
}

.test-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.test-row--passed {
  background: rgba(56, 178, 172, 0.08);
  border-radius: 6px;
  padding: 8px 10px;
}

.test-row__info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.test-row__name {
  color: #fff;
  font-size: 0.9rem;
  font-weight: 500;
}

.test-row__minimum {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.75rem;
}

.test-row__input {
  width: 80px;
}

.test-row__input--passed :deep(.q-field__control) {
  border-color: #38b2ac;
}

.test-row__unit {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.8rem;
  min-width: 40px;
}

.test-result-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 10px;
  margin-bottom: 16px;
}

.test-result-banner--pass {
  background: rgba(56, 178, 172, 0.15);
  color: #38b2ac;
}

.test-result-banner--fail {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

.test-result-banner__text {
  font-weight: 600;
  font-size: 1rem;
}

.test-result-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.test-result-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
}

.test-result-item--passed {
  background: rgba(56, 178, 172, 0.08);
}

.test-result-item__name {
  color: #fff;
  font-size: 0.9rem;
}

.test-result-item__score {
  font-weight: 600;
  font-size: 0.9rem;
}

.text-positive {
  color: #38b2ac;
}

.text-negative {
  color: #ef4444;
}

.text-grey {
  color: rgba(255, 255, 255, 0.4);
}
</style>
