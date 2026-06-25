<template>
  <div class="daily-stats">
    <div class="daily-stats__card">
      <q-icon name="local_fire_department" class="daily-stats__icon" aria-hidden="true" />
      <span class="daily-stats__value">{{ streak }}</span>
      <span class="daily-stats__label">Racha</span>
    </div>

    <div class="daily-stats__card">
      <q-icon name="fitness_center" class="daily-stats__icon" aria-hidden="true" />
      <span class="daily-stats__value">{{ weekly }}</span>
      <span class="daily-stats__label">Esta semana</span>
    </div>

    <div class="daily-stats__card">
      <q-icon name="stars" class="daily-stats__icon" aria-hidden="true" />
      <span class="daily-stats__value">{{ xp }}</span>
      <span class="daily-stats__label">XP</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  streak: {
    type: Number,
    default: 0,
  },
  weekly: {
    type: Number,
    default: 0,
  },
  xp: {
    type: Number,
    default: 0,
  },
})
</script>

<style scoped>
.daily-stats {
  display: flex;
  gap: var(--space-3);
  width: 100%;
}

.daily-stats__card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  background-color: var(--surface-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  text-align: center;
}

.daily-stats__icon {
  color: var(--text-muted);
  font-size: var(--font-2xl);
}

.daily-stats__value {
  font-size: var(--font-xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  line-height: var(--leading-tight);
}

.daily-stats__label {
  font-size: var(--font-xs);
  font-weight: var(--font-medium);
  color: var(--text-muted);
  line-height: var(--leading-normal);
}
</style>
