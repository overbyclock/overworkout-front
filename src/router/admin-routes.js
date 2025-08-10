export default [
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    children: [
      {
        path: '',
        name: 'admin-dashboard',
        component: () => import('@/views/admin/DashboardView.vue'),
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
