<template>
  <div
    class="continue-card"
    role="button"
    tabindex="0"
    data-testid="continue-card"
    @click="emit('click')"
    @keydown.enter="emit('click')"
  >
    <div class="continue-card__content">
      <span class="continue-card__label">Continúa donde lo dejaste</span>
      <h3 class="continue-card__title">{{ title }}</h3>
      <p v-if="subtitle" class="continue-card__subtitle">{{ subtitle }}</p>
    </div>

    <q-btn
      class="continue-card__button"
      color="black"
      text-color="black"
      icon="play_arrow"
      label="Continuar"
      rounded
      unelevated
      @click.stop="emit('click')"
    />
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['click'])
</script>

<style scoped>
.continue-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  width: 100%;
  padding: var(--space-5);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: #000;
  border-radius: var(--radius-xl);
  cursor: pointer;
  transition:
    transform 0.2s var(--ease-out),
    box-shadow 0.2s var(--ease-out);
}

.continue-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow-primary);
}

.continue-card:active {
  transform: translateY(0);
}

.continue-card__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  min-width: 0;
  flex: 1;
}

.continue-card__label {
  font-size: var(--font-xs);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.85;
}

.continue-card__title {
  font-size: var(--font-xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  margin: 0;
  color: #000;
}

.continue-card__subtitle {
  font-size: var(--font-sm);
  font-weight: var(--font-medium);
  line-height: var(--leading-normal);
  margin: 0;
  color: #000;
  opacity: 0.85;
}

.continue-card__button {
  flex-shrink: 0;
  min-height: 44px;
  padding: 0 var(--space-5);
  background-color: #000;
  color: var(--color-primary);
  font-weight: var(--font-semibold);
  border-radius: var(--radius-full);
}

.continue-card__button :deep(.q-icon) {
  color: var(--color-primary);
}

.continue-card__button :deep(.q-btn__content) {
  gap: var(--space-1);
}
</style>
