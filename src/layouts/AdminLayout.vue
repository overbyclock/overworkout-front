<template>
  <q-layout view="lHh LpR lFf">
    <AppHeader :user="authStore.user" :page-title="currentPageTitle" @toggle-menu="toggleLeftDrawer"
      @search-focus="focusSearch" @quick-action="showQuickActions" @profile="goToProfile" @settings="goToSettings"
      @logout="logout" />

    <AppSidebar v-model="leftDrawerOpen" :active-route="route.name" />

    <q-page-container class="page-container">
      <router-view />
    </q-page-container>

    <q-page-sticky position="bottom-right" :offset="[18, 18]" class="mobile-only">
      <q-btn fab icon="add" color="primary" class="fab-btn" @click="showQuickActions" />
    </q-page-sticky>
  </q-layout>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const leftDrawerOpen = ref(false)

const currentPageTitle = computed(() => {
  const titles = {
    'admin-dashboard': 'Dashboard', 'admin-users': 'Usuarios',
    'admin-exercises': 'Ejercicios', 'admin-trainings': 'Entrenamientos',
    'admin-equipments': 'Equipamiento', 'admin-training-programs': 'Programas',
    'admin-training-program-detail': 'Detalle del Programa'
  }
  return titles[route.name] || 'Panel'
})

const toggleLeftDrawer = () => { leftDrawerOpen.value = !leftDrawerOpen.value }
const focusSearch = () => { document.querySelector('.search-input')?.focus() }
const goToProfile = () => router.push({ name: 'admin-dashboard' })
const goToSettings = () => router.push({ name: 'admin-dashboard' })
const logout = () => { authStore.logout(); router.push({ name: 'login' }) }
const showQuickActions = () => { /* TODO */ }

const handleKeydown = (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    focusSearch()
  }
}

watch(() => route.path, () => {
  if (window.innerWidth < 1024) leftDrawerOpen.value = false
}, { immediate: true })

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<style>
.page-container {
  background: linear-gradient(135deg, #0f1419 0%, #1a1f2e 50%, #0f1419 100%);
  min-height: 100vh;
}

.fab-btn {
  box-shadow: 0 8px 24px rgba(255, 143, 56, 0.4);
}

@media (min-width: 1024px) {
  .mobile-only {
    display: none !important;
  }
}
</style>
