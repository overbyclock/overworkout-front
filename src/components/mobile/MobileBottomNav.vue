<template>
  <nav class="mobile-bottom-nav" aria-label="Navegación principal">
    <router-link
      v-for="item in navItems"
      :key="item.name"
      :to="item.to"
      class="mobile-bottom-nav__item"
      :class="{ 'mobile-bottom-nav__item--active': isActive(item.to.name) }"
      :aria-current="isActive(item.to.name) ? 'page' : undefined"
    >
      <div class="mobile-bottom-nav__icon-wrapper">
        <q-icon :name="item.icon" size="24px" />
      </div>
      <span class="mobile-bottom-nav__label">{{ item.label }}</span>
    </router-link>

    <!-- Botón central flotante de entrenamiento -->
    <router-link
      :to="{ name: 'user-train' }"
      class="mobile-bottom-nav__fab"
      :class="{ 'mobile-bottom-nav__fab--active': isActive('user-train') }"
      aria-label="Empezar entrenamiento"
    >
      <q-icon name="play_arrow" size="32px" />
    </router-link>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { name: 'home', to: { name: 'user-home' }, icon: 'home', label: 'Inicio' },
  { name: 'program', to: { name: 'user-program' }, icon: 'fitness_center', label: 'Programa' },
  {
    name: 'achievements',
    to: { name: 'user-achievements' },
    icon: 'emoji_events',
    label: 'Logros',
  },
  { name: 'profile', to: { name: 'user-profile' }, icon: 'person', label: 'Perfil' },
]

const isActive = (routeName) => {
  return route.name === routeName
}
</script>

<style scoped>
.mobile-bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: calc(var(--bottom-nav-height) + var(--safe-bottom));
  padding-bottom: var(--safe-bottom);
  background-color: var(--surface-secondary);
  border-top: 1px solid var(--border-subtle);
  display: flex;
  align-items: flex-start;
  justify-content: space-around;
  padding-top: 8px;
  z-index: 1000;
}

.mobile-bottom-nav__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 2px;
  min-width: 64px;
  min-height: 48px;
  padding: 4px 8px;
  color: var(--text-muted);
  text-decoration: none;
  transition: all 0.2s var(--ease-out);
  border-radius: var(--radius-md);
}

.mobile-bottom-nav__item:hover {
  color: var(--text-secondary);
  background-color: rgba(255, 255, 255, 0.04);
}

.mobile-bottom-nav__item--active {
  color: var(--color-primary);
}

.mobile-bottom-nav__item--active .mobile-bottom-nav__icon-wrapper {
  background-color: rgba(255, 143, 56, 0.12);
}

.mobile-bottom-nav__icon-wrapper {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s var(--ease-out);
}

.mobile-bottom-nav__label {
  font-size: var(--font-xs);
  font-weight: var(--font-medium);
}

.mobile-bottom-nav__fab {
  position: absolute;
  top: -24px;
  left: 50%;
  transform: translateX(-50%);
  width: 64px;
  height: 64px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-lg), var(--shadow-glow-primary);
  text-decoration: none;
  transition: all 0.2s var(--ease-spring);
}

.mobile-bottom-nav__fab:hover {
  transform: translateX(-50%) translateY(-2px) scale(1.05);
}

.mobile-bottom-nav__fab:active {
  transform: translateX(-50%) scale(0.95);
}

.mobile-bottom-nav__fab--active {
  animation: pulse-glow 2s infinite;
}
</style>
