export default [
  {
    path: '/',
    component: () => import('@/layouts/UserLayout.vue'),
    children: [
      {
        path: '',
        name: 'user-home',
        component: () => import('@/views/user/HomeView.vue'),
      },
    ],
  },
]
