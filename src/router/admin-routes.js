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
      {
        path: 'training-programs',
        name: 'admin-training-programs',
        component: () => import('@/views/admin/TrainingProgramsView.vue'),
        meta: { title: 'Programas de Entrenamiento' },
      },
      {
        path: 'training-programs/:id',
        name: 'admin-training-program-detail',
        component: () => import('@/views/admin/TrainingProgramDetailView.vue'),
        meta: { title: 'Detalle Programa' },
      },
      {
        path: 'training-programs/:id/edit',
        name: 'admin-training-program-edit',
        component: () => import('@/views/admin/TrainingProgramEditView.vue'),
        meta: { title: 'Editar Programa' },
      },
      {
        path: 'training-programs/:programId/levels/create',
        name: 'admin-training-level-create',
        component: () => import('@/views/admin/TrainingLevelEditView.vue'),
        meta: { title: 'Crear Nivel' },
      },
      {
        path: 'training-levels/:id/edit',
        name: 'admin-training-level-edit',
        component: () => import('@/views/admin/TrainingLevelEditView.vue'),
        meta: { title: 'Editar Nivel' },
      },
      {
        path: 'training-skills',
        name: 'admin-training-skills',
        component: () => import('@/views/admin/TrainingSkillsView.vue'),
        meta: { title: 'Skills Técnicos' },
      },
      {
        path: 'achievements',
        name: 'admin-achievements',
        component: () => import('@/views/admin/AchievementsView.vue'),
        meta: { title: 'Logros e Insignias' },
      },
      {
        path: 'user-progress',
        name: 'admin-user-progress',
        component: () => import('@/views/admin/UserProgressView.vue'),
        meta: { title: 'Progreso de Usuarios' },
      },
    ],
  },
]
