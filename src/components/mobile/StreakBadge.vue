<template>
  <div class="streak-badge" :class="[`streak-badge--${size}`]">
    <q-icon name="local_fire_department" class="streak-badge__icon" />
    <span class="streak-badge__count">{{ count }}</span>
    <span v-if="showLabel" class="streak-badge__label">racha</span>
  </div>
</template>

<script setup>
defineProps({
  count: {
    type: Number,
    default: 0,
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value),
  },
  showLabel: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped>
.streak-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  background: linear-gradient(135deg, rgba(255, 143, 56, 0.15) 0%, rgba(239, 68, 68, 0.1) 100%);
  border: 1px solid rgba(255, 143, 56, 0.3);
  border-radius: var(--radius-full);
  color: var(--color-primary);
  font-weight: var(--font-bold);
}

.streak-badge--sm {
  padding: 2px 8px;
  font-size: var(--font-xs);
}

.streak-badge--sm .streak-badge__icon {
  font-size: 14px;
}

.streak-badge--md {
  padding: 4px 12px;
  font-size: var(--font-sm);
}

.streak-badge--md .streak-badge__icon {
  font-size: 18px;
}

.streak-badge--lg {
  padding: 8px 16px;
  font-size: var(--font-xl);
}

.streak-badge--lg .streak-badge__icon {
  font-size: 28px;
}

.streak-badge__icon {
  animation: pulse-fire 2s ease-in-out infinite;
}

.streak-badge__label {
  font-size: 0.8em;
  font-weight: var(--font-medium);
  color: var(--text-secondary);
}

@keyframes pulse-fire {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.15);
    opacity: 0.85;
  }
}
</style>
