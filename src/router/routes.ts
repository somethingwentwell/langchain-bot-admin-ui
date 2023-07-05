import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/ChatPage.vue') }],
  },
  {
    path: '/config',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/ConfigPage.vue') }],
  },
  {
    path: '/history',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/HistoryPage.vue') }],
  },
  {
    path: '/log',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/LogPage.vue') }],
  },
  {
    path: '/token',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/TokenPage.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
