<template>
  <q-layout view="lHh LpR lFf">
    <!-- Barra superior (header) -->
    <q-header elevated class="admin-sidebar">
      <q-toolbar>
        <q-btn flat dense round color="white" icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-input v-model="searchText" placeholder="Buscar..." dense borderless class="search-input q-mr-md"
          style="width: 100%;">
          <template v-slot:prepend>
            <q-icon name="search" color="grey-6" />
          </template>
        </q-input>

        <q-btn flat round color="white" class="q-mr-sm">
          <q-avatar size="24px">
            <img src="https://flagcdn.com/w20/es.png" alt="Español">
          </q-avatar>
          <q-menu class="dark-menu">
            <q-list class="dark-menu" style="min-width: 100px;">
              <q-item clickable @click="changeLanguage('es')">
                <q-item-section avatar>
                  <q-avatar size="20px">
                    <img src="https://flagcdn.com/w20/es.png" alt="Español">
                  </q-avatar>
                </q-item-section>
                <q-item-section>Español</q-item-section>
              </q-item>
              <q-item clickable @click="changeLanguage('en')">
                <q-item-section avatar>
                  <q-avatar size="20px">
                    <img src="https://flagcdn.com/w20/us.png" alt="English">
                  </q-avatar>
                </q-item-section>
                <q-item-section>English</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>

        <!---Notificaciones-->

        <q-btn flat round color="white" icon="notifications" class="q-mr-sm">
          <q-badge color="red" floating>3</q-badge>
          <q-menu class="dark-menu">
            <q-list class="dark-menu" style="min-width: 250px;">
              <q-item>
                <q-item-section>
                  <q-item-label>Nueva notificación 1</q-item-label>
                  <q-item-label caption>hace 5 minutos</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item>
                <q-item-section>
                  <q-item-label>Nueva notificacion 2</q-item-label>
                  <q-item-label caption>hace 1 hora</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>

        <!--Avatar-->

        <q-btn flat round class="q-mr-sm">
          <q-avatar size="32px" color="primary" text-color="white">
            <img v-if="userAvatar" :src="userAvatar" :alt="userName" @error="handleImageError">
            <template v-else>{{ userInitials }}</template>
          </q-avatar>
          <q-menu class="dark-menu">
            <q-list class="dark-menu" style="min-width: 150px;">
              <q-item clickable>
                <q-item-section>Mi perfil</q-item-section>
              </q-item>
              <q-item clickable @click="logout">
                <q-item-section>Cerrar sesión</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- Menú lateral (sidebar) -->
    <q-drawer v-model="leftDrawerOpen" show-if-above :width="260" :breakpoint="1023" class="admin-sidebar">
      <q-scroll-area class="fit">
        <q-list padding>
          <q-img src="/logo.png" alt="OverWorkout Logo" width="200px" fit="contain" class="q-ma-md" />


          <q-list>
            <q-item clickable v-ripple :to="{ name: 'admin-dashboard' }" exact-active-class="active-item">
              <q-item-section avatar>
                <q-icon name="dashboard" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Dashboard</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple :to="{ name: 'admin-users' }" exact-active-class="active-item">
              <q-item-section avatar>
                <q-icon name="people" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Usuarios</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple :to="{ name: 'admin-exercises' }" exact-active-class="active-item">
              <q-item-section avatar>
                <q-icon name="fitness_center" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Ejercicios</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple :to="{ name: 'admin-trainings' }" exact-active-class="active-item">
              <q-item-section avatar>
                <q-icon name="schedule" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Entrenamientos</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple :to="{ name: 'admin-equipments' }" exact-active-class="active-item">
              <q-item-section avatar>
                <q-icon name="sports_gymnastics" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Equipamiento</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <!-- Contenedor principal para las vistas -->
    <q-page-container class="main-content-bg">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue';

const leftDrawerOpen = ref(false);
const searchText = ref('');

// Datos del usuario (simulados - en producción vendrían del store/API)
const userName = ref('Admin Usuario');
const userAvatar = ref(null); // null para simular que no hay imagen

// Computed para obtener las iniciales del usuario
const userInitials = computed(() => {
  if (!userName.value) return 'AU';
  
  const names = userName.value.split(' ');
  if (names.length >= 2) {
    return (names[0][0] + names[1][0]).toUpperCase();
  }
  return names[0].substring(0, 2).toUpperCase();
});

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const changeLanguage = (lang) => {
  console.log('Cambiar idioma a: ', lang);
}

const handleImageError = () => {
  // Si la imagen falla al cargar, la ocultamos
  userAvatar.value = null;
}

const logout = () => {
  console.log('Cerrando sesión');
}
</script>

<style scoped>
/* Estilos específicos del componente AdminLayout */

.search-input {
  border-radius: 2rem;
  border: 0.1rem solid white;
  background-color: var(--color-secondary);
  transition: all 0.3s ease;
  padding: 0 10px;
}

.search-input:deep(.q-field__control) {
  background-color: transparent;
  border-radius: 25px;
}

.search-input:deep(.q-field__native) {
  color: white;
}

.search-input:deep(.q-field__native::placeholder) {
  color: white;
  opacity: 0.7;
}

.search-input:deep(.q-field__prepend .q-icon) {
  color: white;
  transition: color 0.3s ease;
}

.search-input:deep(.q-field__control:before),
.search-input:deep(.q-field__control:after) {
  border: none;
}

.search-input.q-field--focused {
  border-color: var(--color-primary);
}

.search-input.q-field--focused:deep(.q-field__prepend .q-icon) {
  color: var(--color-primary) !important;
}

.dark-menu {
  background-color: var(--color-secondary);
  border: 1px solid #2c3236;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.dark-menu .q-item {
  color: white;
  transition: background-color 0.2s ease;
}

.dark-menu .q-item:hover {
  background-color: var(--color-primary);
}

.dark-menu .q-item-label {
  color: white;
}

.dark-menu .q-item__label--caption {
  color: #a7acb1;
}

.dark-menu .q-separator {
  background-color: #2c3236;
}
</style>
