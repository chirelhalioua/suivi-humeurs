import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../views/LoginPage.vue';
import ProfilePage from '../views/ProfilePage.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/profil',
    name: 'Profile',
    component: ProfilePage
  },
  { path: '/suivi-humeurs', component: SuiviHumeurs }
  // Ajouter d'autres routes ici
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
