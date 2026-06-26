<!--
  HorizontalCarousel.vue
  Componente carrusel horizontal reutilizable para la vista móvil.
  Expone un slot "item" para renderizar cada elemento y permite navegación mediante
  botón de acción, flechas de desplazamiento e indicadores de página.
-->
<template>
  <section
    v-if="items.length > 0"
    class="horizontal-carousel"
    :class="{ 'horizontal-carousel--loop': loop }"
  >
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
        v-if="showNavigationArrows"
        type="button"
        class="horizontal-carousel__arrow horizontal-carousel__arrow--prev"
        aria-label="Anterior"
        @click="scrollTo(currentPage - 1)"
      >
        <q-icon name="chevron_left" size="24px" />
      </button>

      <div ref="trackRef" class="horizontal-carousel__track hide-scrollbar" @scroll="onScroll">
        <div v-for="item in items" :key="item[itemKey]" class="horizontal-carousel__slide">
          <!-- Slot con scope para personalizar el renderizado de cada item -->
          <slot name="item" :item="item" />
        </div>
      </div>

      <button
        v-if="showNavigationArrows"
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
        :aria-current="index === currentPage ? 'true' : null"
        @click="scrollTo(index)"
      />
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

// Configuración de props: título, acción, lista de items, clave única y visibilidad de flechas
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
  loop: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['page-change'])

// Instancia del router y referencias al track deslizable y a la página activa
const router = useRouter()
const trackRef = ref(null)
const currentPage = ref(0)
const canScroll = ref(false)
let resizeObserver = null

// Notifica a los consumidores cuando cambia la página activa
watch(currentPage, (newPage) => {
  emit('page-change', newPage)
})

/**
 * Determina si el track tiene desplazamiento disponible comparando su ancho
 * total con el ancho visible del viewport.
 */
const checkOverflow = () => {
  const track = trackRef.value
  if (!track) {
    return
  }

  canScroll.value = track.scrollWidth > track.clientWidth
}

/**
 * Muestra las flechas de navegación cuando:
 * - El carrusel está en modo loop y hay scroll disponible, o
 * - Se activa explícitamente showArrows.
 */
const showNavigationArrows = computed(() => {
  if (props.items.length <= 1) {
    return false
  }

  if (props.loop) {
    return canScroll.value
  }

  return props.showArrows
})

onMounted(() => {
  checkOverflow()

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(checkOverflow)
    resizeObserver.observe(trackRef.value)
  }

  window.addEventListener('resize', checkOverflow)
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }

  window.removeEventListener('resize', checkOverflow)
})

// Navega a la ruta indicada por el botón de acción (usa router.push en lugar de router-link)
const handleAction = () => {
  if (props.actionTo) {
    router.push(props.actionTo)
  }
}

// Actualiza la página activa en función del desplazamiento horizontal del track,
// calculando el slide cuyo centro esté más cercano al centro del viewport.
const onScroll = () => {
  const track = trackRef.value
  if (!track) {
    return
  }

  const slides = Array.from(track.children)
  if (slides.length === 0) {
    return
  }

  const viewportCenter = track.scrollLeft + track.clientWidth / 2
  let activeIndex = 0
  let minDistance = Infinity

  slides.forEach((slide, index) => {
    const slideCenter = slide.offsetLeft + slide.clientWidth / 2
    const distance = Math.abs(slideCenter - viewportCenter)
    if (distance < minDistance) {
      minDistance = distance
      activeIndex = index
    }
  })

  currentPage.value = activeIndex
}

// Desplaza el carrusel hasta el índice solicitado de forma suave.
// En modo loop, al avanzar más allá del último item vuelve al primero
// y al retroceder antes del primero salta al último.
const scrollTo = (index) => {
  const track = trackRef.value
  if (!track) {
    return
  }

  const slides = Array.from(track.children)
  if (slides.length === 0) {
    return
  }

  let target = index

  if (props.loop) {
    if (target < 0) {
      target = slides.length - 1
    } else if (target >= slides.length) {
      target = 0
    }
  } else {
    target = Math.max(0, Math.min(slides.length - 1, target))
  }

  const slide = slides[target]
  if (!slide) {
    return
  }

  track.scrollTo({ left: slide.offsetLeft, behavior: 'smooth' })
  currentPage.value = target
}
</script>

<style scoped>
.horizontal-carousel {
  width: 100%;
  --carousel-arrow-size: 40px;
  --carousel-dot-size: 8px;
  --carousel-dot-active-size: 20px;
  --carousel-arrow-breakpoint: 768px;
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

/* El ancho del slide se ajusta al contenido (tarjeta) para mantener el
   layout consistente con el ancho fijo de ContentCard. */
.horizontal-carousel__slide {
  flex: 0 0 auto;
  scroll-snap-align: start;
  width: auto;
}

.horizontal-carousel__arrow {
  display: none;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  width: var(--carousel-arrow-size);
  height: var(--carousel-arrow-size);
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
  width: var(--carousel-dot-size);
  height: var(--carousel-dot-size);
  border-radius: var(--radius-full);
  background-color: var(--border-default);
  border: none;
  padding: 0;
  cursor: pointer;
  transition: all 0.2s var(--ease-out);
}

.horizontal-carousel__dot--active {
  width: var(--carousel-dot-active-size);
  background-color: var(--color-primary);
}

.horizontal-carousel--loop .horizontal-carousel__arrow {
  display: flex;
}

/* Nota: las media queries no admiten custom properties; el valor debe coincidir
   con --carousel-arrow-breakpoint para mantener consistencia. */
@media (min-width: 768px) {
  .horizontal-carousel__arrow {
    display: flex;
  }
}
</style>
