<template>
  <div class="mobile-view">
    <MobilePageHeader title="Tu perfil" subtitle="Personaliza tu experiencia" :centered="true" />

    <div class="mobile-container">
      <!-- Avatar y nombre -->
      <section class="mobile-section profile-header animate-fadeInUp">
        <div class="profile-avatar">
          {{ authStore.userInitials }}
        </div>
        <h2 class="mobile-h3">{{ authStore.userDisplayName }}</h2>
        <p class="mobile-body-sm">Atleta nivel {{ userProfileStore.userLevel }}</p>
      </section>

      <!-- Estadísticas rápidas -->
      <section class="mobile-section animate-fadeInUp" style="animation-delay: 0.1s">
        <div class="quick-stats">
          <div class="quick-stat">
            <span class="quick-stat__value">{{ userProfileStore.totalWorkouts }}</span>
            <span class="quick-stat__label">Entrenos</span>
          </div>
          <div class="quick-stat">
            <span class="quick-stat__value">{{ userProfileStore.userXp }}</span>
            <span class="quick-stat__label">XP Total</span>
          </div>
          <div class="quick-stat">
            <span class="quick-stat__value">{{ userProfileStore.streakDays }}</span>
            <span class="quick-stat__label">Racha</span>
          </div>
        </div>
      </section>

      <!-- Opciones del perfil -->
      <section class="mobile-section animate-fadeInUp" style="animation-delay: 0.2s">
        <h3 class="mobile-h4" style="margin-bottom: var(--space-4)">Ajustes</h3>

        <div class="settings-list">
          <button class="settings-item" @click="editProfile">
            <div class="settings-item__icon">
              <q-icon name="person" size="22px" />
            </div>
            <span class="settings-item__label">Editar perfil</span>
            <q-icon name="chevron_right" size="20px" color="muted" />
          </button>

          <button class="settings-item" @click="editPreferences">
            <div class="settings-item__icon">
              <q-icon name="tune" size="22px" />
            </div>
            <span class="settings-item__label">Preferencias</span>
            <q-icon name="chevron_right" size="20px" color="muted" />
          </button>

          <button class="settings-item" @click="editNotifications">
            <div class="settings-item__icon">
              <q-icon name="notifications" size="22px" />
            </div>
            <span class="settings-item__label">Notificaciones</span>
            <q-icon name="chevron_right" size="20px" color="muted" />
          </button>

          <button class="settings-item" @click="viewHistory">
            <div class="settings-item__icon">
              <q-icon name="history" size="22px" />
            </div>
            <span class="settings-item__label">Historial completo</span>
            <q-icon name="chevron_right" size="20px" color="muted" />
          </button>
        </div>
      </section>

      <!-- Cerrar sesión -->
      <section class="mobile-section animate-fadeInUp" style="animation-delay: 0.3s">
        <button class="btn-mobile btn-mobile--secondary" @click="logout">
          <q-icon name="logout" size="20px" />
          Cerrar sesión
        </button>
      </section>

      <!-- Info de la app -->
      <section class="mobile-section app-info animate-fadeInUp" style="animation-delay: 0.4s">
        <p>OverWorkout Athlete v0.1</p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import MobilePageHeader from '@/components/mobile/MobilePageHeader.vue'
import { useAuthStore } from '@/stores/auth'
import { useUserProfileStore } from '@/stores/userProfile'

const router = useRouter()
const authStore = useAuthStore()
const userProfileStore = useUserProfileStore()

const editProfile = () => {
  // TODO: Implementar edición de perfil
  alert('Edición de perfil próximamente')
}

const editPreferences = () => {
  // TODO: Implementar preferencias
  alert('Preferencias próximamente')
}

const editNotifications = () => {
  // TODO: Implementar notificaciones
  alert('Notificaciones próximamente')
}

const viewHistory = () => {
  // TODO: Implementar historial
  alert('Historial completo próximamente')
}

const logout = () => {
  authStore.logout()
  userProfileStore.reset()
  router.push({ name: 'login' })
}
</script>

<style scoped>
.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-3);
  padding-top: var(--space-4);
}

.profile-avatar {
  width: 96px;
  height: 96px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-3xl);
  font-weight: var(--font-bold);
  box-shadow: var(--shadow-glow-primary);
}

.quick-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
}

.quick-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-4);
  background-color: var(--surface-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
}

.quick-stat__value {
  font-size: var(--font-2xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
}

.quick-stat__label {
  font-size: var(--font-xs);
  color: var(--text-muted);
}

.settings-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.settings-item {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  width: 100%;
  padding: var(--space-4);
  background-color: var(--surface-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: var(--font-base);
  cursor: pointer;
  transition: all 0.2s var(--ease-out);
  text-align: left;
}

.settings-item:hover {
  background-color: var(--surface-tertiary);
}

.settings-item__icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background-color: var(--surface-tertiary);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.settings-item__label {
  flex: 1;
  font-weight: var(--font-medium);
}

.app-info {
  text-align: center;
  color: var(--text-muted);
  font-size: var(--font-xs);
  padding-top: var(--space-6);
}
</style>
