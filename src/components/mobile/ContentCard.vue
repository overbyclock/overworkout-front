<template>
  <article class="content-card" :class="`content-card--${variant}`" data-testid="content-card">
    <!-- Botón de acción principal que cubre toda la tarjeta -->
    <button
      type="button"
      class="content-card__action"
      data-testid="content-card-action"
      :aria-label="`Abrir ${title}`"
      @click="emit('click')"
    />

    <!-- Fila superior: icono y favorito -->
    <div class="content-card__top">
      <q-icon class="content-card__icon" :name="icon" size="24px" />
      <button
        v-if="showFavorite"
        type="button"
        class="content-card__favorite"
        data-testid="favorite-button"
        :aria-label="isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'"
        @click.stop="emit('toggle-favorite')"
      >
        <q-icon :name="isFavorite ? 'favorite' : 'favorite_border'" size="20px" />
      </button>
    </div>

    <!-- Fila de metadatos: badge y/o nivel -->
    <div v-if="badge || level" class="content-card__meta" data-testid="content-card-meta">
      <span v-if="badge" class="content-card__badge">{{ badge }}</span>
      <span v-if="level" class="content-card__level">{{ level }}</span>
    </div>

    <!-- Contenido principal: título y descripción -->
    <div class="content-card__body">
      <h3 class="content-card__title">{{ title }}</h3>
      <p v-if="description" class="content-card__description">{{ description }}</p>
    </div>

    <!-- Pie de tarjeta opcional -->
    <div v-if="footer" class="content-card__footer" data-testid="content-card-footer">
      <span>{{ footer }}</span>
    </div>
  </article>
</template>

<script setup>
/**
 * Tarjeta reutilizable para carruseles de contenido (programas, entrenamientos,
 * favoritos y descubrimiento).
 *
 * @emits click - Se emite cuando el usuario pulsa la tarjeta.
 * @emits toggle-favorite - Se emite cuando el usuario pulsa el botón de favorito.
 */
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: 'fitness_center',
  },
  level: {
    type: String,
    default: '',
  },
  badge: {
    type: String,
    default: '',
  },
  footer: {
    type: String,
    default: '',
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'accent'].includes(value),
  },
  showFavorite: {
    type: Boolean,
    default: false,
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['click', 'toggle-favorite'])
</script>

<style scoped>
.content-card {
  --content-card-width: 160px;
  --content-card-height: 180px;
  --content-card-text: var(--text-primary);

  position: relative;
  display: flex;
  flex-direction: column;
  width: var(--content-card-width);
  height: var(--content-card-height);
  padding: var(--space-4);
  background-color: var(--surface-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  color: var(--content-card-text);
  transition:
    transform 0.2s var(--ease-out),
    box-shadow 0.2s var(--ease-out);
}

.content-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.content-card:active {
  transform: translateY(0);
}

/* Botón de acción principal */
.content-card__action {
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  background: transparent;
  border: none;
  border-radius: var(--radius-xl);
  cursor: pointer;
}

.content-card__action:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Variantes de color */
.content-card--primary {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  --content-card-text: var(--surface-primary, #000);
  border: none;
}

.content-card--accent {
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-light) 100%);
  --content-card-text: var(--surface-primary, #000);
  border: none;
}

.content-card--primary:hover {
  box-shadow: var(--shadow-glow-primary);
}

.content-card--accent:hover {
  box-shadow: var(--shadow-glow-accent);
}

/* Fila superior */
.content-card__top {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  margin-bottom: var(--space-2);
}

.content-card__icon {
  color: var(--color-primary);
}

.content-card--primary .content-card__icon,
.content-card--accent .content-card__icon {
  color: color-mix(in srgb, var(--content-card-text) 70%, transparent);
}

.content-card__favorite {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--space-8);
  height: var(--space-8);
  padding: 0;
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  border-radius: var(--radius-full);
  transition: background-color 0.2s var(--ease-out);
}

.content-card__favorite:hover {
  background-color: color-mix(in srgb, var(--text-primary) 15%, transparent);
}

.content-card__favorite:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.content-card--primary .content-card__favorite:hover,
.content-card--accent .content-card__favorite:hover {
  background-color: color-mix(in srgb, var(--content-card-text) 12%, transparent);
}

/* Metadatos */
.content-card__meta {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;
  margin-bottom: var(--space-2);
  min-height: var(--space-5);
}

.content-card__badge {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--space-2);
  background-color: color-mix(in srgb, var(--color-primary) 20%, transparent);
  color: var(--color-primary);
  font-size: var(--font-xs);
  font-weight: var(--font-semibold);
  border-radius: var(--radius-full);
}

.content-card--primary .content-card__badge,
.content-card--accent .content-card__badge {
  background-color: color-mix(in srgb, var(--content-card-text) 15%, transparent);
  color: var(--content-card-text);
}

.content-card__level {
  font-size: var(--font-xs);
  color: var(--text-muted);
}

.content-card--primary .content-card__level,
.content-card--accent .content-card__level {
  color: color-mix(in srgb, var(--content-card-text) 70%, transparent);
}

/* Cuerpo principal */
.content-card__body {
  position: relative;
  z-index: 1;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  overflow: hidden;
}

.content-card__title {
  font-size: var(--font-base);
  font-weight: var(--font-semibold);
  line-height: var(--leading-tight);
  color: var(--content-card-text);
  margin: 0;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.content-card__description {
  font-size: var(--font-sm);
  line-height: var(--leading-normal);
  color: var(--text-secondary);
  margin: 0;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.content-card--primary .content-card__description,
.content-card--accent .content-card__description {
  color: color-mix(in srgb, var(--content-card-text) 75%, transparent);
}

/* Pie de tarjeta */
.content-card__footer {
  position: relative;
  z-index: 1;
  margin-top: auto;
  padding-top: var(--space-2);
  font-size: var(--font-xs);
  color: var(--text-muted);
  flex-shrink: 0;
}

.content-card--primary .content-card__footer,
.content-card--accent .content-card__footer {
  color: color-mix(in srgb, var(--content-card-text) 70%, transparent);
}
</style>
