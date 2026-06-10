<template>
  <div class="user-layout">
    <main class="user-layout__main">
      <router-view />
    </main>
    <MobileBottomNav v-if="!hideNavigation" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MobileBottomNav from '@/components/mobile/MobileBottomNav.vue'

const route = useRoute()

const hideNavigation = computed(() => {
  return route.meta?.hideNavigation === true
})
</script>

<style scoped>
.user-layout {
  min-height: 100vh;
  min-height: 100dvh;
  background-color: var(--surface-primary);
}

.user-layout__main {
  padding-top: var(--safe-top);
}
</style>
