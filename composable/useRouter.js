// import { createRouter, createWebHistory } from 'vue-router';
// import confirmation from '@/confirm.vue';

// const routes = [
//   {
//     path: '/confirm',
//     name: 'confirm',
//     component: confirm
//   }
//   // Add more routes as needed
// ];

// const router = createRouter({
//   history: createWebHistory(),
//   routes
// });

// export default router;
import { createRouter, createWebHistory } from 'vue-router';
import { getAuth } from 'firebase/auth';

import Index from '~/pages/index.vue';
import WriteStory from '~/pages/writeStory.vue';
import Login from '~/components/elements/login.vue';


const routes = [
  { path: '/', component: Index },
  { 
    path: '/writeStory', 
    component: WriteStory, 
    meta: { requiresAuth: true } 
  },
  { path: '/login', component: Login },
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (to.matched.some(record => record.meta.requiresAuth) && !currentUser) {
    next('/writeStory');
  } else {
    next();
  }
});

export default router;