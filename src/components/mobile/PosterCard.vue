<template>
  <article class="poster-card" :style="cardStyle" data-testid="poster-card">
    <button
      type="button"
      class="poster-card__action"
      data-testid="poster-card-action"
      :aria-label="`Abrir ${item.name || 'elemento'}`"
      @click="emit('click')"
    />

    <div class="poster-card__overlay" />

    <div class="poster-card__content">
      <div class="poster-card__top">
        <span class="poster-card__badge" :class="`poster-card__badge--${type}`">
          {{ typeLabel }}
        </span>

        <button
          v-if="showFavorite"
          type="button"
          class="poster-card__favorite"
          data-testid="favorite-button"
          :aria-label="isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'"
          @click.stop="emit('toggle-favorite')"
        >
          <q-icon :name="isFavorite ? 'favorite' : 'favorite_border'" size="20px" />
        </button>
      </div>

      <q-icon class="poster-card__icon" :name="disciplineIcon" size="80px" />

      <div class="poster-card__bottom">
        <h3 class="poster-card__title">{{ item.name }}</h3>
        <p v-if="metaLine" class="poster-card__meta">{{ metaLine }}</p>
        <div
          v-if="progress !== undefined && progress !== null"
          class="poster-card__progress"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-valuenow="clampedProgress"
        >
          <div class="poster-card__progress-bar">
            <div class="poster-card__progress-fill" :style="{ width: `${clampedProgress}%` }" />
          </div>
          <span class="poster-card__progress-text">{{ clampedProgress }}%</span>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { getDisciplineGradient, getDisciplineIcon } from '@/constants/disciplines'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  type: {
    type: String,
    required: true,
    validator: (value) => ['program', 'training'].includes(value),
  },
  level: {
    type: String,
    default: '',
  },
  levels: {
    type: String,
    default: '',
  },
  duration: {
    type: String,
    default: '',
  },
  extra: {
    type: String,
    default: '',
  },
  progress: {
    type: Number,
    default: null,
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

const typeLabel = computed(() => (props.type === 'program' ? 'Programa' : 'Entreno'))

const disciplineIcon = computed(() => getDisciplineIcon(props.item.discipline))

const cardStyle = computed(() => {
  const gradient = getDisciplineGradient(props.item.discipline)

  if (props.item.imageUrl) {
    return {
      backgroundImage: `url(${props.item.imageUrl}), ${gradient}`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  }

  return {
    backgroundImage: gradient,
  }
})

const clampedProgress = computed(() => Math.min(100, Math.max(0, props.progress ?? 0)))

const metaLine = computed(() => {
  const parts = [props.level, props.levels, props.duration, props.extra].filter(Boolean)
  return parts.join(' · ')
})
</script>

<style scoped>
.poster-card {
  --poster-card-width: 240px;

  position: relative;
  display: flex;
  width: 100%;
  max-width: var(--poster-card-width);
  aspect-ratio: 240 / 280;
  border-radius: var(--radius-xl);
  overflow: hidden;
  color: #fff;
  transition:
    transform 0.2s var(--ease-out),
    box-shadow 0.2s var(--ease-out);
}

.poster-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.poster-card:active {
  transform: translateY(0);
}

.poster-card__action {
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  background: transparent;
  border: none;
  cursor: pointer;
}

.poster-card__action:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.poster-card__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.6) 100%);
  z-index: 0;
}

.poster-card__content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  padding: var(--space-4);
}

.poster-card__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.poster-card__badge {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
  font-size: var(--font-xs);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.poster-card__badge--program {
  background-color: var(--color-primary);
  color: var(--surface-primary, #000);
}

.poster-card__badge--training {
  background-color: var(--color-accent);
  color: var(--surface-primary, #000);
}

.poster-card__favorite {
  position: relative;
  z-index: 3;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--space-8);
  height: var(--space-8);
  padding: 0;
  background: rgba(0, 0, 0, 0.3);
  border: none;
  border-radius: var(--radius-full);
  color: #fff;
  cursor: pointer;
  transition: background-color 0.2s var(--ease-out);
}

.poster-card__favorite:hover {
  background: rgba(0, 0, 0, 0.5);
}

.poster-card__icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.15;
  color: #fff;
  pointer-events: none;
}

.poster-card__bottom {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.poster-card__title {
  font-size: var(--font-lg);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  margin: 0;
  color: #fff;
}

.poster-card__meta {
  font-size: var(--font-sm);
  line-height: var(--leading-normal);
  margin: 0;
  color: rgba(255, 255, 255, 0.85);
}

.poster-card__progress {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.poster-card__progress-bar {
  flex: 1;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.poster-card__progress-fill {
  height: 100%;
  background-color: var(--color-primary);
  border-radius: var(--radius-full);
  transition: width 0.3s var(--ease-out);
}

.poster-card__progress-text {
  font-size: var(--font-xs);
  font-weight: var(--font-semibold);
  color: #fff;
}
</style>
