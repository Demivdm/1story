import { createRouter, createWebHistory } from 'vue-router';
import confirmation from '@/confirm.vue';

const routes = [
  {
    path: '/confirm',
    name: 'confirm',
    component: confirm
  }
  // Add more routes as needed
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
