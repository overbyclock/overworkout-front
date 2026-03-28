<template>
  <div class="user-menu-wrapper">
    <q-btn flat class="user-menu-btn" no-caps>
      <q-avatar size="36px" class="user-avatar">
        <img v-if="user?.avatar" :src="user.avatar" :alt="userName" @error="handleError">
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
              <img v-if="user?.avatar" :src="user.avatar" @error="handleError">
              <span v-else class="avatar-initials-large" :style="avatarStyle">{{ userInitials }}</span>
            </q-avatar>
            <div class="user-dropdown-info">
              <div class="user-dropdown-name">{{ userName }}</div>
              <div class="user-dropdown-email">{{ user?.email || 'admin@overworkout.com' }}</div>
            </div>
          </div>
          <q-separator class="menu-separator" />
          <div class="menu-section">
            <div class="menu-section-title">Cuenta</div>
            <q-list dense class="menu-list">
              <q-item clickable v-ripple class="menu-item" @click="$emit('profile')">
                <q-item-section avatar><q-icon name="person_outline" class="menu-item-icon" /></q-item-section>
                <q-item-section>Mi perfil</q-item-section>
              </q-item>
              <q-item clickable v-ripple class="menu-item" @click="$emit('settings')">
                <q-item-section avatar><q-icon name="settings" class="menu-item-icon" /></q-item-section>
                <q-item-section>Configuración</q-item-section>
              </q-item>
            </q-list>
          </div>
          <q-separator class="menu-separator" />
          <div class="menu-footer">
            <q-item clickable v-ripple class="menu-item logout-item" @click="$emit('logout')">
              <q-item-section avatar><q-icon name="logout" class="menu-item-icon" /></q-item-section>
              <q-item-section>Cerrar sesión</q-item-section>
            </q-item>
          </div>
        </div>
      </q-menu>
    </q-btn>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  user: { type: Object, default: null }
})

defineEmits(['profile', 'settings', 'logout'])

const userName = computed(() => props.user?.nick || 'Administrador')

const userInitials = computed(() => {
  const name = props.user?.nick || 'A'
  const names = name.trim().split(/\s+/)
  if (names.length >= 2) return (names[0][0] + names[1][0]).toUpperCase()
  return names[0].substring(0, 2).toUpperCase()
})

const userRole = computed(() => props.user?.roles?.includes('ROLE_ADMIN') ? 'Admin' : 'Usuario')

const getAvatarColor = (str) => {
  if (!str) return { bg: 'linear-gradient(135deg, #ff8f38 0%, #e67e2e 100%)', color: '#fff' }
  const colors = [
    { bg: 'linear-gradient(135deg, #ff8f38 0%, #e67e2e 100%)', color: '#fff' },
    { bg: 'linear-gradient(135deg, #38b2ac 0%, #319795 100%)', color: '#fff' },
    { bg: 'linear-gradient(135deg, #9370db 0%, #7c3aed 100%)', color: '#fff' },
    { bg: 'linear-gradient(135deg, #3fb950 0%, #2ea043 100%)', color: '#fff' },
  ]
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash = hash & hash
  }
  return colors[Math.abs(hash) % colors.length]
}

const avatarStyle = computed(() => {
  const color = getAvatarColor(props.user?.nick + props.user?.id)
  return { background: color.bg, color: color.color }
})

const handleError = () => { }
</script>

<style scoped>
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

:deep(.modern-menu.q-menu) {
  background: linear-gradient(145deg, #1c2128 0%, #161b22 100%) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 16px !important;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6) !important;
  padding: 0 !important;
  overflow: hidden;
  min-width: 280px;
}

:deep(.modern-menu.q-menu .q-list) {
  background: transparent !important;
  color: #c9d1d9 !important;
}

:deep(.modern-menu.q-menu .q-item) {
  color: #c9d1d9 !important;
  background: transparent !important;
}

:deep(.modern-menu.q-menu .q-item:hover),
:deep(.modern-menu.q-menu .q-item.q-hoverable:hover) {
  background: rgba(255, 255, 255, 0.08) !important;
  color: #ffffff !important;
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
</style>
