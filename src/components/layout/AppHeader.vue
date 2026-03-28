<template>
  <q-header class="admin-header">
    <div class="header-container">
      <!-- Left: Menu toggle + Breadcrumb -->
      <div class="header-left">
        <q-btn flat round dense icon="menu" class="menu-toggle" @click="$emit('toggle-menu')" />
        <div class="breadcrumb">
          <span class="breadcrumb-app">OverWorkout</span>
          <q-icon name="chevron_right" size="16px" class="breadcrumb-separator" />
          <span class="breadcrumb-current">{{ pageTitle }}</span>
        </div>
      </div>

      <!-- Center: Search -->
      <div class="header-center">
        <div class="search-wrapper">
          <q-icon name="search" class="search-icon" size="20px" />
          <input type="text" placeholder="Buscar ejercicios, usuarios, entrenamientos..." class="search-input"
            @focus="$emit('search-focus')">
          <div class="search-shortcut">
            <kbd>Ctrl</kbd>
            <kbd>K</kbd>
          </div>
        </div>
      </div>

      <!-- Right: Actions -->
      <div class="header-right">
        <div class="quick-actions">
          <q-btn flat round dense icon="add_circle" class="action-btn" @click="$emit('quick-action')">
            <q-tooltip>Nuevo</q-tooltip>
          </q-btn>
          <q-btn flat round dense icon="notifications" class="action-btn">
            <q-badge color="error" floating rounded>3</q-badge>
            <q-tooltip>Notificaciones</q-tooltip>
          </q-btn>
        </div>

        <UserMenu :user="user" @profile="$emit('profile')" @settings="$emit('settings')" @logout="$emit('logout')" />
      </div>
    </div>
  </q-header>
</template>

<script setup>
import UserMenu from './UserMenu.vue'

defineProps({
  user: { type: Object, default: null },
  pageTitle: { type: String, default: 'Panel' }
})

defineEmits(['toggle-menu', 'search-focus', 'quick-action', 'profile', 'settings', 'logout'])
</script>

<style scoped>
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

@media (max-width: 1024px) {
  .header-center {
    display: none;
  }
  
  .header-left,
  .header-right {
    min-width: auto;
  }
}

@media (max-width: 600px) {
  .breadcrumb {
    display: none;
  }
  
  .header-container {
    padding: 0 16px;
  }
}
</style>
