<template>
  <q-layout view="lHh LpR lFf">
    <!-- Header Moderno -->
    <q-header class="admin-header">
      <div class="header-container">
        <!-- Left: Menu toggle + Breadcrumb -->
        <div class="header-left">
          <q-btn flat round dense icon="menu" class="menu-toggle" @click="toggleLeftDrawer" />
          <div class="breadcrumb">
            <span class="breadcrumb-app">OverWorkout</span>
            <q-icon name="chevron_right" size="16px" class="breadcrumb-separator" />
            <span class="breadcrumb-current">{{ currentPageTitle }}</span>
          </div>
        </div>

        <!-- Center: Search -->
        <div class="header-center">
          <div class="search-wrapper">
            <q-icon name="search" class="search-icon" size="20px" />
            <input type="text" placeholder="Buscar ejercicios, usuarios, entrenamientos..." class="search-input">
            <div class="search-shortcut">
              <kbd>Ctrl</kbd>
              <kbd>K</kbd>
            </div>
          </div>
        </div>

        <!-- Right: Actions -->
        <div class="header-right">
          <!-- Quick Actions -->
          <div class="quick-actions">
            <q-btn flat round dense icon="add_circle" class="action-btn" @click="showQuickActions">
              <q-tooltip>Nuevo</q-tooltip>
            </q-btn>
            <q-btn flat round dense icon="notifications" class="action-btn">
              <q-badge color="error" floating rounded>3</q-badge>
              <q-tooltip>Notificaciones</q-tooltip>
            </q-btn>
          </div>

          <!-- User Menu -->
          <div class="user-menu-wrapper">
            <q-btn flat class="user-menu-btn" no-caps>
              <q-avatar size="36px" class="user-avatar">
                <img v-if="authStore.user?.avatar" :src="authStore.user.avatar" :alt="userName" @error="handleImageError">
                <span v-else class="avatar-initials" :style="avatarStyle">{{ userInitials }}</span>
              </q-avatar>
              <div class="user-info">
                <div class="user-name">{{ userName }}</div>
                <div class="user-role">{{ userRole }}</div>
              </div>
              <q-icon name="expand_more" size="18px" class="dropdown-icon" />

              <q-menu class="modern-menu" anchor="bottom right" self="top right">
                <div class="user-dropdown">
                  <div class="user-dropdown-header">
                    <q-avatar size="56px" class="user-avatar-large">
                      <img v-if="authStore.user?.avatar" :src="authStore.user.avatar" @error="handleImageError">
                      <span v-else class="avatar-initials-large" :style="avatarStyle">{{ userInitials }}</span>
                    </q-avatar>
                    <div class="user-dropdown-info">
                      <div class="user-dropdown-name">{{ userName }}</div>
                      <div class="user-dropdown-email">{{ authStore.user?.email || 'admin@overworkout.com' }}</div>
                    </div>
                  </div>
                  <q-separator class="menu-separator" />
                  <div class="menu-section">
                    <div class="menu-section-title">Cuenta</div>
                    <q-list dense class="menu-list">
                      <q-item clickable v-ripple class="menu-item" @click="goToProfile">
                        <q-item-section avatar>
                          <q-icon name="person_outline" class="menu-item-icon" />
                        </q-item-section>
                        <q-item-section>Mi perfil</q-item-section>
                      </q-item>
                      <q-item clickable v-ripple class="menu-item" @click="goToSettings">
                        <q-item-section avatar>
                          <q-icon name="settings" class="menu-item-icon" />
                        </q-item-section>
                        <q-item-section>Configuración</q-item-section>
                      </q-item>
                    </q-list>
                  </div>
                  <q-separator class="menu-separator" />
                  <div class="menu-footer">
                    <q-item clickable v-ripple class="menu-item logout-item" @click="logout">
                      <q-item-section avatar>
                        <q-icon name="logout" class="menu-item-icon" />
                      </q-item-section>
                      <q-item-section>Cerrar sesión</q-item-section>
                    </q-item>
                  </div>
                </div>
              </q-menu>
            </q-btn>
          </div>
        </div>
      </div>
    </q-header>

    <!-- Sidebar Moderno -->
    <q-drawer v-model="leftDrawerOpen" show-if-above :width="280" :breakpoint="1023" class="modern-sidebar">
      <!-- Logo Section -->
      <div class="sidebar-brand">
        <div class="brand-logo">
          <div class="logo-image-wrapper">
            <img src="/logo.png" alt="OverWorkout Logo" class="logo-image" />
          </div>
          <div class="logo-text">
            <span class="logo-title">OverWorkout</span>
            <span class="logo-subtitle">Admin Panel</span>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <q-scroll-area class="sidebar-scroll">
        <div class="nav-section">
          <div class="nav-section-header">
            <span class="nav-section-title">Principal</span>
          </div>
          <nav class="nav-menu">
            <router-link v-for="item in mainNavItems" :key="item.name" :to="{ name: item.route }"
              class="nav-link" :class="{ active: isActiveRoute(item.route) }">
              <div class="nav-link-icon">
                <q-icon :name="item.icon" size="22px" />
              </div>
              <span class="nav-link-label">{{ item.label }}</span>
              <q-badge v-if="item.badge" :label="item.badge" color="primary" rounded class="nav-badge" />
              <div v-if="isActiveRoute(item.route)" class="active-indicator"></div>
            </router-link>
          </nav>
        </div>

        <div class="nav-section">
          <div class="nav-section-header">
            <span class="nav-section-title">Gestión</span>
          </div>
          <nav class="nav-menu">
            <router-link v-for="item in contentNavItems" :key="item.name" :to="{ name: item.route }"
              class="nav-link" :class="{ active: isActiveRoute(item.route) }">
              <div class="nav-link-icon">
                <q-icon :name="item.icon" size="22px" />
              </div>
              <span class="nav-link-label">{{ item.label }}</span>
              <div v-if="isActiveRoute(item.route)" class="active-indicator"></div>
            </router-link>
          </nav>
        </div>
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

    <!-- Page Container -->
    <q-page-container class="page-container">
      <router-view />
    </q-page-container>

    <!-- Quick Action FAB (Mobile) -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]" class="mobile-only">
      <q-btn fab icon="add" color="primary" class="fab-btn" @click="showQuickActions" />
    </q-page-sticky>
  </q-layout>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const leftDrawerOpen = ref(false)

// Navigation items
const mainNavItems = [
  { label: 'Dashboard', icon: 'dashboard_outlined', route: 'admin-dashboard' },
  { label: 'Usuarios', icon: 'people_outline', route: 'admin-users', badge: '12' },
]

const contentNavItems = [
  { label: 'Ejercicios', icon: 'fitness_center', route: 'admin-exercises' },
  { label: 'Entrenamientos', icon: 'schedule', route: 'admin-trainings' },
  { label: 'Equipamiento', icon: 'sports_gymnastics', route: 'admin-equipments' },
]

// Computed
const userName = computed(() => authStore.user?.nick || 'Administrador')

const userInitials = computed(() => {
  const name = authStore.user?.nick || 'A'
  const names = name.trim().split(/\s+/)
  
  if (names.length >= 2) {
    return (names[0][0] + names[1][0]).toUpperCase()
  } else {
    return names[0].substring(0, 2).toUpperCase()
  }
})

const userRole = computed(() => authStore.isAdmin ? 'Admin' : 'Usuario')

// Genera un color único basado en el nombre del usuario
const getAvatarColor = (str) => {
  if (!str) return { bg: 'linear-gradient(135deg, #ff8f38 0%, #e67e2e 100%)', color: '#fff' }
  
  const colors = [
    { bg: 'linear-gradient(135deg, #ff8f38 0%, #e67e2e 100%)', color: '#fff' },
    { bg: 'linear-gradient(135deg, #38b2ac 0%, #319795 100%)', color: '#fff' },
    { bg: 'linear-gradient(135deg, #9370db 0%, #7c3aed 100%)', color: '#fff' },
    { bg: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%)', color: '#fff' },
    { bg: 'linear-gradient(135deg, #3fb950 0%, #2ea043 100%)', color: '#fff' },
    { bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#fff' },
    { bg: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)', color: '#fff' },
    { bg: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', color: '#fff' },
    { bg: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', color: '#fff' },
    { bg: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)', color: '#fff' },
    { bg: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', color: '#fff' },
    { bg: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: '#fff' },
  ]
  
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  
  const index = Math.abs(hash) % colors.length
  return colors[index]
}

const avatarStyle = computed(() => {
  const color = getAvatarColor(authStore.user?.nick + authStore.user?.id)
  return {
    background: color.bg,
    color: color.color
  }
})

const currentPageTitle = computed(() => {
  const titles = {
    'admin-dashboard': 'Dashboard',
    'admin-users': 'Usuarios',
    'admin-exercises': 'Ejercicios',
    'admin-trainings': 'Entrenamientos',
    'admin-equipments': 'Equipamiento'
  }
  return titles[route.name] || 'Panel'
})

// Methods
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const isActiveRoute = (routeName) => {
  return route.name === routeName
}

const handleImageError = () => {
  // Avatar initials will show
}

const goToProfile = () => {
  router.push({ name: 'admin-dashboard' })
}

const goToSettings = () => {
  router.push({ name: 'admin-dashboard' })
}

const logout = () => {
  authStore.logout()
  router.push({ name: 'login' })
}

const showQuickActions = () => {
  // TODO: Implement quick action menu
  console.log('Quick actions')
}

// Keyboard shortcut for search
const handleKeydown = (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    document.querySelector('.search-input')?.focus()
  }
}

// Lifecycle
watch(() => route.path, () => {
  // Close drawer on mobile when navigating
  if (window.innerWidth < 1024) {
    leftDrawerOpen.value = false
  }
}, { immediate: true })

// Add keyboard listener
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', handleKeydown)
}
</script>

<style scoped>
/* ===== HEADER MODERNO ===== */
.admin-header {
  background: rgba(15, 20, 25, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  height: 72px;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 24px;
  max-width: 1920px;
  margin: 0 auto;
}

/* Header Left */
.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
  min-width: 280px;
}

.menu-toggle {
  color: #8b949e;
  width: 40px;
  height: 40px;
  transition: all 0.2s ease;
}

.menu-toggle:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.05);
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
}

.breadcrumb-app {
  font-size: 0.9rem;
  font-weight: 600;
  color: #8b949e;
}

.breadcrumb-separator {
  color: #484f58;
}

.breadcrumb-current {
  font-size: 0.95rem;
  font-weight: 600;
  color: #ffffff;
}

/* Header Center - Search */
.header-center {
  flex: 1;
  max-width: 600px;
  display: flex;
  justify-content: center;
}

.search-wrapper {
  position: relative;
  width: 100%;
  max-width: 500px;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #8b949e;
  pointer-events: none;
}

.search-input {
  width: 100%;
  height: 44px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 0 80px 0 48px;
  color: #ffffff;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.2s ease;
}

.search-input::placeholder {
  color: #6e7681;
}

.search-input:hover {
  border-color: rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.07);
}

.search-input:focus {
  border-color: rgba(255, 143, 56, 0.4);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 3px rgba(255, 143, 56, 0.1);
}

.search-shortcut {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 4px;
}

.search-shortcut kbd {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 2px 8px;
  font-size: 0.75rem;
  color: #8b949e;
  font-family: inherit;
}

/* Header Right */
.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 280px;
  justify-content: flex-end;
}

.quick-actions {
  display: flex;
  gap: 4px;
  padding-right: 12px;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
}

.action-btn {
  color: #8b949e;
  width: 40px;
  height: 40px;
  transition: all 0.2s ease;
}

.action-btn:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.05);
}

/* User Menu */
.user-menu-wrapper {
  margin-left: 8px;
}

.user-menu-btn {
  padding: 6px 12px 6px 8px;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.user-menu-btn:hover {
  background: rgba(255, 255, 255, 0.05);
}

.user-avatar {
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.avatar-initials {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
  border-radius: 50%;
}

.user-info {
  text-align: left;
  margin: 0 10px;
}

.user-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #ffffff;
  line-height: 1.2;
}

.user-role {
  font-size: 0.75rem;
  color: #8b949e;
  line-height: 1.2;
}

.dropdown-icon {
  color: #8b949e;
  transition: transform 0.2s ease;
}

.user-menu-btn:hover .dropdown-icon {
  transform: rotate(180deg);
}

/* Modern Menu Dropdown - Forzar tema oscuro */
.modern-menu.q-menu {
  background: linear-gradient(145deg, #1c2128 0%, #161b22 100%) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 16px !important;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6) !important;
  padding: 0 !important;
  overflow: hidden;
  min-width: 280px;
}

.modern-menu.q-menu .q-list {
  background: transparent !important;
  color: #c9d1d9 !important;
}

.modern-menu.q-menu .q-item {
  color: #c9d1d9 !important;
  background: transparent !important;
}

.modern-menu.q-menu .q-item:hover,
.modern-menu.q-menu .q-item.q-hoverable:hover {
  background: rgba(255, 255, 255, 0.08) !important;
  color: #ffffff !important;
}

.modern-menu.q-menu .q-item__section {
  color: inherit !important;
}

.user-dropdown {
  background: transparent !important;
  color: #c9d1d9 !important;
}

.user-dropdown-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.03) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.user-avatar-large {
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-initials-large {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.25rem;
  letter-spacing: 1px;
  border-radius: 50%;
}

.user-dropdown-info {
  flex: 1;
}

.user-dropdown-name {
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 2px;
}

.user-dropdown-email {
  font-size: 0.85rem;
  color: #8b949e;
}

.menu-separator {
  background: rgba(255, 255, 255, 0.06);
  margin: 0;
}

.menu-section {
  padding: 12px;
}

.menu-section-title {
  font-size: 0.7rem;
  font-weight: 600;
  color: #8b949e;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 8px 12px;
}

.menu-list {
  padding: 0;
}

.menu-item {
  border-radius: 10px;
  min-height: 44px;
  color: #c9d1d9;
  transition: all 0.2s ease;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
}

.menu-item-icon {
  color: #8b949e;
  font-size: 20px;
}

.menu-item:hover .menu-item-icon {
  color: #ffffff;
}

.menu-footer {
  padding: 8px 12px;
}

.logout-item {
  color: #f85149 !important;
}

.logout-item:hover {
  background: rgba(248, 81, 73, 0.15) !important;
  color: #ff6b6b !important;
}

.logout-item .menu-item-icon {
  color: #f85149 !important;
}

.logout-item:hover .menu-item-icon {
  color: #ff6b6b !important;
}

/* ===== SIDEBAR MODERNO ===== */
.modern-sidebar {
  background: linear-gradient(180deg, #161b22 0%, #0d1117 100%);
  border-right: 1px solid rgba(255, 255, 255, 0.06);
}

/* Brand */
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

/* Scroll Area */
.sidebar-scroll {
  height: calc(100% - 260px);
}

/* Navigation */
.nav-section {
  padding: 8px 0;
}

.nav-section-header {
  padding: 20px 24px 12px;
}

.nav-section-title {
  font-size: 0.7rem;
  font-weight: 700;
  color: #8b949e;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.nav-menu {
  padding: 0 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  border-radius: 12px;
  text-decoration: none;
  color: #8b949e;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.04);
  color: #c9d1d9;
}

.nav-link.active {
  background: rgba(255, 143, 56, 0.12);
  color: #ff8f38;
}

.nav-link-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  transition: all 0.2s ease;
}

.nav-link.active .nav-link-icon {
  transform: scale(1.1);
}

.nav-link-label {
  font-size: 0.95rem;
  font-weight: 500;
  flex: 1;
}

.nav-badge {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 2px 10px;
}

.active-indicator {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 20px;
  background: linear-gradient(180deg, #ff8f38 0%, #e67e2e 100%);
  border-radius: 0 3px 3px 0;
}

/* Sidebar Footer */
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

.footer-meta .divider {
  color: #484f58;
}

.footer-meta .status {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #3fb950;
}

/* Page Container */
.page-container {
  background: linear-gradient(135deg, #0f1419 0%, #1a1f2e 50%, #0f1419 100%);
}

/* Mobile FAB */
.fab-btn {
  box-shadow: 0 8px 32px rgba(255, 143, 56, 0.4);
}

/* Utilities */
.mobile-only {
  display: none;
}

/* Responsive */
@media (max-width: 1023px) {
  .header-left {
    min-width: auto;
  }

  .breadcrumb {
    display: none;
  }

  .header-center {
    display: none;
  }

  .user-info {
    display: none;
  }

  .mobile-only {
    display: block;
  }
}

@media (max-width: 599px) {
  .header-container {
    padding: 0 16px;
  }

  .quick-actions {
    display: none;
  }

  .sidebar-brand {
    padding: 20px 16px;
  }

  .nav-section-header {
    padding: 16px 16px 8px;
  }

  .nav-menu {
    padding: 0 8px;
  }
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.15);
}
</style>
