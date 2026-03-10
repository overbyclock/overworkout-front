import { createRouter, createWebHistory } from 'vue-router'
import adminRoutes from './admin-routes'
import userRoutes from './user-routes'

import { authGuard, guestOnlyGuard, roleRedirectGuard } from './guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      beforeEnter: roleRedirectGuard,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      beforeEnter: guestOnlyGuard,
    },
    // Importamos las rutas desde archivos separados
    ...adminRoutes,
    ...userRoutes,
  ],
})

router.beforeEach(authGuard)
export default router
