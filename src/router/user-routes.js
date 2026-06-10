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
        component: () => import('@/views/user/DashboardView.vue'),
        meta: {
          title: 'Inicio',
          requiresAuth: true,
          requiresRole: USER_ROLES.USER,
        },
      },
      {
        path: 'program',
        name: 'user-program',
        component: () => import('@/views/user/ProgramView.vue'),
        meta: {
          title: 'Mi Programa',
          requiresAuth: true,
          requiresRole: USER_ROLES.USER,
        },
      },
      {
        path: 'train',
        name: 'user-train',
        component: () => import('@/views/user/TrainView.vue'),
        meta: {
          title: 'Entrenar',
          requiresAuth: true,
          requiresRole: USER_ROLES.USER,
        },
      },
      {
        path: 'achievements',
        name: 'user-achievements',
        component: () => import('@/views/user/AchievementsView.vue'),
        meta: {
          title: 'Logros',
          requiresAuth: true,
          requiresRole: USER_ROLES.USER,
        },
      },
      {
        path: 'profile',
        name: 'user-profile',
        component: () => import('@/views/user/ProfileView.vue'),
        meta: {
          title: 'Perfil',
          requiresAuth: true,
          requiresRole: USER_ROLES.USER,
        },
      },
      {
        path: 'programs',
        name: 'user-programs-catalog',
        component: () => import('@/views/user/ProgramsCatalogView.vue'),
        meta: {
          title: 'Programas',
          requiresAuth: true,
          requiresRole: USER_ROLES.USER,
        },
      },
      // Onboarding flujo (sin navegación inferior)
      {
        path: 'welcome',
        name: 'user-welcome',
        component: () => import('@/views/user/onboarding/WelcomeView.vue'),
        meta: {
          title: 'Bienvenido',
          requiresAuth: true,
          requiresRole: USER_ROLES.USER,
          hideNavigation: true,
        },
      },
      {
        path: 'onboarding/goal',
        name: 'user-onboarding-goal',
        component: () => import('@/views/user/onboarding/OnboardingGoalView.vue'),
        meta: {
          title: 'Tu objetivo',
          requiresAuth: true,
          requiresRole: USER_ROLES.USER,
          hideNavigation: true,
        },
      },
      {
        path: 'onboarding/level',
        name: 'user-onboarding-level',
        component: () => import('@/views/user/onboarding/OnboardingLevelView.vue'),
        meta: {
          title: 'Tu nivel',
          requiresAuth: true,
          requiresRole: USER_ROLES.USER,
          hideNavigation: true,
        },
      },
      {
        path: 'onboarding/stats',
        name: 'user-onboarding-stats',
        component: () => import('@/views/user/onboarding/OnboardingStatsView.vue'),
        meta: {
          title: 'Tus datos',
          requiresAuth: true,
          requiresRole: USER_ROLES.USER,
          hideNavigation: true,
        },
      },
      {
        path: 'assessment',
        name: 'user-assessment',
        component: () => import('@/views/user/onboarding/AssessmentView.vue'),
        meta: {
          title: 'Evaluación',
          requiresAuth: true,
          requiresRole: USER_ROLES.USER,
          hideNavigation: true,
        },
      },
    ],
  },
]
