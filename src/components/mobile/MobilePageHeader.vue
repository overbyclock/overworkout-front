<template>
  <header class="mobile-page-header">
    <div class="mobile-page-header__content">
      <button
        v-if="showBack"
        class="mobile-page-header__back mobile-touch"
        @click="goBack"
        aria-label="Volver atrás"
      >
        <q-icon name="arrow_back" size="24px" />
      </button>

      <div
        class="mobile-page-header__text"
        :class="{ 'mobile-page-header__text--centered': centered }"
      >
        <p v-if="subtitle" class="mobile-page-header__subtitle">{{ subtitle }}</p>
        <h1 class="mobile-page-header__title">{{ title }}</h1>
      </div>

      <div class="mobile-page-header__actions">
        <slot name="actions" />
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
  showBack: {
    type: Boolean,
    default: false,
  },
  centered: {
    type: Boolean,
    default: false,
  },
  backTo: {
    type: [String, Object],
    default: null,
  },
})

const router = useRouter()

const goBack = () => {
  if (props.backTo) {
    router.push(props.backTo)
  } else {
    router.back()
  }
}
</script>

<style scoped>
.mobile-page-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: var(--surface-primary);
  padding-top: var(--safe-top);
  border-bottom: 1px solid var(--border-subtle);
}

.mobile-page-header__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: var(--header-height);
  padding: var(--space-3) var(--space-5);
  gap: var(--space-3);
}

.mobile-page-header__back {
  background: transparent;
  border: none;
  color: var(--text-primary);
  padding: 0;
  cursor: pointer;
  border-radius: var(--radius-full);
  transition: background-color 0.2s var(--ease-out);
}

.mobile-page-header__back:hover {
  background-color: rgba(255, 255, 255, 0.08);
}

.mobile-page-header__text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.mobile-page-header__text--centered {
  text-align: center;
}

.mobile-page-header__title {
  font-size: var(--font-xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0;
  line-height: var(--leading-tight);
}

.mobile-page-header__subtitle {
  font-size: var(--font-xs);
  font-weight: var(--font-medium);
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.mobile-page-header__actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-width: 40px;
}
</style>
