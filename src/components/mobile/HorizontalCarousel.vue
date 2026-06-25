<template>
  <section class="horizontal-carousel">
    <header class="horizontal-carousel__header">
      <h2 v-if="title" class="horizontal-carousel__title">{{ title }}</h2>
      <button
        v-if="actionLabel && actionTo"
        type="button"
        class="horizontal-carousel__action"
        @click="handleAction"
      >
        {{ actionLabel }}
      </button>
    </header>

    <div class="horizontal-carousel__viewport">
      <button
        v-if="showArrows"
        type="button"
        class="horizontal-carousel__arrow horizontal-carousel__arrow--prev"
        aria-label="Anterior"
        @click="scrollTo(currentPage - 1)"
      >
        <q-icon name="chevron_left" size="24px" />
      </button>

      <div ref="trackRef" class="horizontal-carousel__track hide-scrollbar" @scroll="onScroll">
        <div v-for="item in items" :key="item[itemKey]" class="horizontal-carousel__slide">
          <slot name="item" :item="item" />
        </div>
      </div>

      <button
        v-if="showArrows"
        type="button"
        class="horizontal-carousel__arrow horizontal-carousel__arrow--next"
        aria-label="Siguiente"
        @click="scrollTo(currentPage + 1)"
      >
        <q-icon name="chevron_right" size="24px" />
      </button>
    </div>

    <div v-if="items.length > 1" class="horizontal-carousel__dots">
      <button
        v-for="(_, index) in items"
        :key="index"
        type="button"
        class="horizontal-carousel__dot"
        :class="{ 'horizontal-carousel__dot--active': index === currentPage }"
        :aria-label="`Ir a la página ${index + 1}`"
        @click="scrollTo(index)"
      />
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  actionLabel: {
    type: String,
    default: '',
  },
  actionTo: {
    type: [String, Object],
    default: null,
  },
  items: {
    type: Array,
    required: true,
  },
  itemKey: {
    type: String,
    default: 'id',
  },
  showArrows: {
    type: Boolean,
    default: false,
  },
})

const router = useRouter()
const trackRef = ref(null)
const currentPage = ref(0)

const handleAction = () => {
  if (props.actionTo) {
    router.push(props.actionTo)
  }
}

const onScroll = () => {
  const track = trackRef.value
  if (!track) {
    return
  }

  const itemWidth = track.firstElementChild?.clientWidth || track.clientWidth || 1
  currentPage.value = Math.min(
    props.items.length - 1,
    Math.max(0, Math.round(track.scrollLeft / itemWidth)),
  )
}

const scrollTo = (index) => {
  const track = trackRef.value
  if (!track) {
    return
  }

  const target = Math.max(0, Math.min(props.items.length - 1, index))
  const itemWidth = track.firstElementChild?.clientWidth || track.clientWidth || 1
  track.scrollTo({ left: itemWidth * target, behavior: 'smooth' })
  currentPage.value = target
}
</script>

<style scoped>
.horizontal-carousel {
  width: 100%;
}

.horizontal-carousel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
  padding: 0 var(--space-5);
}

.horizontal-carousel__title {
  font-size: var(--font-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
  line-height: var(--leading-tight);
}

.horizontal-carousel__action {
  background: transparent;
  border: none;
  color: var(--color-primary);
  font-size: var(--font-sm);
  font-weight: var(--font-medium);
  cursor: pointer;
  padding: var(--space-1) 0;
  transition: color 0.2s var(--ease-out);
}

.horizontal-carousel__action:hover {
  color: var(--color-primary-light);
}

.horizontal-carousel__viewport {
  position: relative;
  display: flex;
  align-items: center;
}

.horizontal-carousel__track {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  gap: var(--space-4);
  padding: 0 var(--space-5);
  width: 100%;
}

.horizontal-carousel__slide {
  flex: 0 0 auto;
  scroll-snap-align: start;
  width: calc(100% - var(--space-10));
}

.horizontal-carousel__arrow {
  display: none;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  background-color: var(--surface-secondary);
  border: 1px solid var(--border-subtle);
  color: var(--text-primary);
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s var(--ease-out);
}

.horizontal-carousel__arrow:hover {
  background-color: var(--surface-tertiary);
  border-color: var(--border-default);
}

.horizontal-carousel__arrow--prev {
  left: var(--space-2);
}

.horizontal-carousel__arrow--next {
  right: var(--space-2);
}

.horizontal-carousel__dots {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-4);
}

.horizontal-carousel__dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  background-color: var(--border-default);
  border: none;
  padding: 0;
  cursor: pointer;
  transition: all 0.2s var(--ease-out);
}

.horizontal-carousel__dot--active {
  width: 20px;
  background-color: var(--color-primary);
}

@media (min-width: 768px) {
  .horizontal-carousel__arrow {
    display: flex;
  }
}
</style>
