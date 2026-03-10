import { USER_ROLES } from '@/utils/constants'

export default [
  {
    path: '/user',
    component: () => import('@/layouts/UserLayout.vue'),
    meta: {
      requiresAuth: true,
      requiresRole: USER_ROLES.USER,
    },
    children: [
      {
        path: '',
        redirect: { name: 'user-home' },
      },
      {
        path: 'home',
        name: 'user-home',
        component: () => import('@/views/user/HomeView.vue'),
        meta: {
          title: 'Home',
          requiresAuth: true,
          requiresRole: USER_ROLES.USER,
        },
      },
    ],
  },
]
