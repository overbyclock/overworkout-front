<template>
  <div class="progress-ring" :style="{ width: size + 'px', height: size + 'px' }">
    <svg class="progress-ring__svg" :width="size" :height="size" viewBox="0 0 100 100">
      <!-- Círculo de fondo -->
      <circle
        class="progress-ring__track"
        cx="50"
        cy="50"
        r="42"
        fill="none"
        :stroke="trackColor"
        :stroke-width="strokeWidth"
      />
      <!-- Círculo de progreso -->
      <circle
        class="progress-ring__fill"
        cx="50"
        cy="50"
        r="42"
        fill="none"
        :stroke="fillColor"
        :stroke-width="strokeWidth"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="offset"
        stroke-linecap="round"
        :style="{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }"
      />
    </svg>
    <div class="progress-ring__content">
      <slot>
        <span class="progress-ring__value" :style="{ fontSize: fontSize }">{{ displayValue }}</span>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 100,
  },
  size: {
    type: Number,
    default: 120,
  },
  strokeWidth: {
    type: Number,
    default: 8,
  },
  fillColor: {
    type: String,
    default: '#ff8f38',
  },
  trackColor: {
    type: String,
    default: 'rgba(255, 255, 255, 0.08)',
  },
  showPercentage: {
    type: Boolean,
    default: true,
  },
})

const radius = 42
const circumference = 2 * Math.PI * radius

const percentage = computed(() => {
  if (props.max === 0) return 0
  return Math.min(100, Math.max(0, (props.value / props.max) * 100))
})

const offset = computed(() => circumference - (percentage.value / 100) * circumference)

const displayValue = computed(() => {
  return props.showPercentage ? Math.round(percentage.value) + '%' : props.value
})

const fontSize = computed(() => {
  return Math.max(14, props.size * 0.22) + 'px'
})
</script>

<style scoped>
.progress-ring {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.progress-ring__svg {
  transform: rotate(-90deg);
}

.progress-ring__fill {
  transition: stroke-dashoffset 0.8s var(--ease-out);
}

.progress-ring__content {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-ring__value {
  font-weight: var(--font-bold);
  color: var(--text-primary);
}
</style>
