<template>
  <component
    :is="tag"
    class="mobile-card"
    :class="[`mobile-card--${variant}`, { 'mobile-card--clickable': clickable }]"
    @click="handleClick"
  >
    <div v-if="$slots.icon || icon" class="mobile-card__icon">
      <slot name="icon">
        <q-icon :name="icon" size="28px" />
      </slot>
    </div>

    <div class="mobile-card__content">
      <h3 v-if="title" class="mobile-card__title">{{ title }}</h3>
      <p v-if="text" class="mobile-card__text">{{ text }}</p>
      <slot />
    </div>

    <div v-if="$slots.action || showArrow" class="mobile-card__action">
      <slot name="action">
        <q-icon name="chevron_right" size="24px" color="text-muted" />
      </slot>
    </div>
  </component>
</template>

<script setup>
const props = defineProps({
  tag: {
    type: String,
    default: 'div',
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'elevated', 'primary', 'outlined'].includes(value),
  },
  title: {
    type: String,
    default: '',
  },
  text: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
  clickable: {
    type: Boolean,
    default: false,
  },
  showArrow: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['click'])

const handleClick = () => {
  if (props.clickable) {
    emit('click')
  }
}
</script>

<style scoped>
.mobile-card {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
  background-color: var(--surface-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  transition: all 0.2s var(--ease-out);
}

.mobile-card--elevated {
  background: linear-gradient(145deg, var(--surface-secondary) 0%, var(--surface-tertiary) 100%);
  box-shadow: var(--shadow-md);
}

.mobile-card--primary {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: #000;
  border: none;
}

.mobile-card--primary .mobile-card__title,
.mobile-card--primary .mobile-card__text {
  color: #000;
}

.mobile-card--outlined {
  background-color: transparent;
  border: 2px solid var(--border-default);
}

.mobile-card--clickable {
  cursor: pointer;
}

.mobile-card--clickable:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--border-default);
}

.mobile-card--clickable:active {
  transform: translateY(0);
}

.mobile-card__icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background-color: rgba(255, 143, 56, 0.12);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.mobile-card--primary .mobile-card__icon {
  background-color: rgba(0, 0, 0, 0.12);
  color: #000;
}

.mobile-card__content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.mobile-card__title {
  font-size: var(--font-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
  line-height: var(--leading-tight);
}

.mobile-card__text {
  font-size: var(--font-sm);
  color: var(--text-secondary);
  margin: 0;
  line-height: var(--leading-normal);
}

.mobile-card__action {
  display: flex;
  align-items: center;
  color: var(--text-muted);
  flex-shrink: 0;
  margin-left: auto;
}
</style>
