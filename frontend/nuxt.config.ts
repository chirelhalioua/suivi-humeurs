import { defineNuxtConfig } from 'nuxt3';

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  app: {
    head: {
      title: 'Les Humeurs à la Funès',
      meta: [
        { name: 'description', content: 'Exprimez vos humeurs avec des GIFs et des citations de Louis de Funès' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],
      style: [
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css', // Ajouter cette ligne pour charger Font Awesome
        },
      ],
    },
  },
  components: true, // Auto-import des composants
  compatibilityDate: '2025-01-06',

  // Ajouter la configuration de axios ici
  axios: {
    baseURL: 'https://suivi-humeurs.onrender.com/api',  // Base URL de votre API
  },
});
