<template>
  <article
    class="content-card"
    :class="`content-card--${variant}`"
    data-testid="content-card"
    @click="emit('click')"
  >
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
  --content-card-text: var(--text-primary);

  display: flex;
  flex-direction: column;
  width: 160px;
  height: 180px;
  padding: var(--space-4);
  background-color: var(--surface-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  color: var(--content-card-text);
  cursor: pointer;
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

.content-card:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Variantes de color */
.content-card--primary {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  --content-card-text: #000;
  border: none;
}

.content-card--accent {
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-light) 100%);
  --content-card-text: #000;
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
  color: rgba(0, 0, 0, 0.7);
}

.content-card__favorite {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  border-radius: var(--radius-full);
  transition: background-color 0.2s var(--ease-out);
}

.content-card__favorite:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.content-card--primary .content-card__favorite:hover,
.content-card--accent .content-card__favorite:hover {
  background-color: rgba(0, 0, 0, 0.12);
}

/* Metadatos */
.content-card__meta {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;
  margin-bottom: var(--space-2);
  min-height: 20px;
}

.content-card__badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  background-color: rgba(255, 143, 56, 0.2);
  color: var(--color-primary);
  font-size: var(--font-xs);
  font-weight: var(--font-semibold);
  border-radius: var(--radius-full);
}

.content-card--primary .content-card__badge,
.content-card--accent .content-card__badge {
  background-color: rgba(0, 0, 0, 0.15);
  color: #000;
}

.content-card__level {
  font-size: var(--font-xs);
  color: var(--text-muted);
}

.content-card--primary .content-card__level,
.content-card--accent .content-card__level {
  color: rgba(0, 0, 0, 0.7);
}

/* Cuerpo principal */
.content-card__body {
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
  color: rgba(0, 0, 0, 0.75);
}

/* Pie de tarjeta */
.content-card__footer {
  margin-top: auto;
  padding-top: var(--space-2);
  font-size: var(--font-xs);
  color: var(--text-muted);
  flex-shrink: 0;
}

.content-card--primary .content-card__footer,
.content-card--accent .content-card__footer {
  color: rgba(0, 0, 0, 0.7);
}
</style>
