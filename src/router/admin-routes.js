import { USER_ROLES } from '@/utils/constants'

export default [
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: {
      requiresAuth: true,
      requiresRole: USER_ROLES.ADMIN,
    },
    children: [
      {
        path: '',
        redirect: { name: 'admin-dashboard' },
      },
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import('@/views/admin/DashboardView.vue'),
        meta: {
          title: 'Dashboard Admin',
          requiresAuth: true,
          requiresRole: USER_ROLES.ADMIN,
        },
      },
      {
        path: 'users',
        name: 'admin-users',
        component: () => import('@/views/admin/UsersView.vue'),
      },
      {
        path: 'exercises',
        name: 'admin-exercises',
        component: () => import('@/views/admin/ExercisesView.vue'),
      },
      {
        path: 'trainings',
        name: 'admin-trainings',
        component: () => import('@/views/admin/TrainingsView.vue'),
      },
      {
        path: 'equipments',
        name: 'admin-equipments',
        component: () => import('@/views/admin/EquipmentsView.vue'),
      },
    ],
  },
]
