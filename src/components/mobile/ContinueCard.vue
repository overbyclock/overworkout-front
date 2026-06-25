<template>
  <button class="continue-card" data-testid="continue-card" type="button" @click="emit('continue')">
    <div class="continue-card__content">
      <span class="continue-card__label">Continúa donde lo dejaste</span>
      <h3 class="continue-card__title">{{ title }}</h3>
      <p v-if="subtitle" class="continue-card__subtitle">{{ subtitle }}</p>
    </div>

    <span class="continue-card__action">
      <q-icon class="continue-card__icon" name="play_arrow" />
      <span class="continue-card__action-label">Continuar</span>
    </span>
  </button>
</template>

<script setup>
/**
 * Componente de tarjeta para continuar un entrenamiento.
 *
 * @emits continue - Se emite cuando el usuario activa la tarjeta.
 */
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

const emit = defineEmits(['continue'])
</script>

<style scoped>
.continue-card {
  --continue-card-text: var(--surface-primary, #000);

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  width: 100%;
  padding: var(--space-5);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: var(--continue-card-text);
  border: none;
  border-radius: var(--radius-xl);
  cursor: pointer;
  text-align: left;
  font: inherit;
  transition:
    transform 0.2s var(--ease-out),
    box-shadow 0.2s var(--ease-out);
}

.continue-card:focus-visible {
  outline: 2px solid var(--continue-card-text);
  outline-offset: 2px;
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
  color: var(--continue-card-text);
}

.continue-card__subtitle {
  font-size: var(--font-sm);
  font-weight: var(--font-medium);
  line-height: var(--leading-normal);
  margin: 0;
  color: var(--continue-card-text);
  opacity: 0.85;
}

.continue-card__action {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
  min-height: 44px;
  padding: 0 var(--space-5);
  background-color: var(--continue-card-text);
  color: var(--color-primary);
  font-weight: var(--font-semibold);
  border-radius: var(--radius-full);
}

.continue-card__icon {
  color: var(--color-primary);
}

.continue-card__action-label {
  color: var(--color-primary);
}
</style>
