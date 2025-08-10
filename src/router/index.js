import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import adminRoutes from './admin-routes'
import userRoutes from './user-routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    // Importamos las rutas desde archivos separados
    ...adminRoutes,
    ...userRoutes,
  ],
})

export default router
