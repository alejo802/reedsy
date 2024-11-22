import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/books/:id',
    name: 'BookDetails',
    // Lazy loading for better performance
    component: () => import('@/views/BookDetails.vue'),
    props: true, // Enables passing route params as props to the component
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    // Optional: You can create a NotFound view or use a default error message
    component: () => import('@/views/NotFound.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;