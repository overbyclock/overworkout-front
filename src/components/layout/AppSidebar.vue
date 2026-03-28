<template>
  <q-drawer :model-value="modelValue" show-if-above :width="280" :breakpoint="1023" class="modern-sidebar"
    @update:model-value="$emit('update:modelValue', $event)">
    <!-- Logo Section -->
    <div class="sidebar-brand">
      <div class="brand-logo">
        <div class="logo-image-wrapper">
          <img :src="logoImage" alt="OverWorkout Logo" class="logo-image" />
        </div>
        <div class="logo-text">
          <span class="logo-title">OverWorkout</span>
          <span class="logo-subtitle">Admin Panel</span>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <q-scroll-area class="sidebar-scroll">
      <NavSection title="Principal" :items="mainNavItems" :active-route="activeRoute" />
      <NavSection title="Gestión" :items="contentNavItems" :active-route="activeRoute" />
      <NavSection title="Entrenamientos" :items="trainingNavItems" :active-route="activeRoute" />
    </q-scroll-area>

    <!-- Sidebar Footer -->
    <div class="sidebar-footer">
      <div class="footer-card">
        <div class="footer-info">
          <q-icon name="info" size="18px" color="primary" />
          <div class="footer-text">
            <div class="footer-title">¿Necesitas ayuda?</div>
            <div class="footer-subtitle">Contacta con soporte</div>
          </div>
        </div>
        <q-btn flat dense icon="arrow_forward" color="primary" size="sm" />
      </div>
      <div class="footer-meta">
        <span class="version">v1.0.0</span>
        <span class="divider">•</span>
        <span class="status">
          <q-icon name="circle" size="8px" color="positive" />
          Online
        </span>
      </div>
    </div>
  </q-drawer>
</template>

<script setup>
import logoImage from '@/../public/logo.png'
import NavSection from './NavSection.vue'

defineProps({
  modelValue: { type: Boolean, default: false },
  activeRoute: { type: String, default: '' }
})

defineEmits(['update:modelValue'])

const mainNavItems = [
  { label: 'Dashboard', icon: 'dashboard_outlined', route: 'admin-dashboard' },
  { label: 'Usuarios', icon: 'people_outline', route: 'admin-users', badge: '12' },
]

const contentNavItems = [
  { label: 'Ejercicios', icon: 'fitness_center', route: 'admin-exercises' },
  { label: 'Equipamiento', icon: 'sports_gymnastics', route: 'admin-equipments' },
  { label: 'Programas', icon: 'school', route: 'admin-training-programs' },
]

const trainingNavItems = [
  { label: 'Skills', icon: 'emoji_events', route: 'admin-training-skills' },
  { label: 'Benchmarks', icon: 'timer', route: 'admin-benchmarks' },
  { label: 'Logros', icon: 'military_tech', route: 'admin-achievements' },
  { label: 'Progreso Usuarios', icon: 'trending_up', route: 'admin-user-progress' },
]
</script>

<style scoped>
.modern-sidebar {
  background: linear-gradient(180deg, #161b22 0%, #0d1117 100%);
  border-right: 1px solid rgba(255, 255, 255, 0.06);
}

.sidebar-brand {
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 14px;
}

.logo-image-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.logo-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 4px;
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.logo-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.3px;
}

.logo-subtitle {
  font-size: 0.75rem;
  color: #8b949e;
  font-weight: 500;
}

.sidebar-scroll {
  height: calc(100% - 260px);
}

.sidebar-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  background: linear-gradient(180deg, transparent 0%, #0d1117 20%);
}

.footer-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  margin-bottom: 16px;
}

.footer-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.footer-text {
  display: flex;
  flex-direction: column;
}

.footer-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #ffffff;
}

.footer-subtitle {
  font-size: 0.75rem;
  color: #8b949e;
}

.footer-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.75rem;
  color: #6e7681;
}

.divider {
  color: #484f58;
}

.status {
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>
