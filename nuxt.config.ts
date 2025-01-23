export default defineNuxtConfig({
  devtools: { enabled: true }, // Activer les outils de dev

  modules: [
    '@pinia/nuxt', // Module Pinia
  ],

  runtimeConfig: {
    public: {
      apiBase: 'https://suivi-humeurs-back.onrender.com', // API
    },
  },

  app: {
    head: {
      title: 'Les Humeurs à la Funès',
      meta: [
        { name: 'description', content: 'Exprimez vos humeurs avec des GIFs et des citations de Louis de Funès' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css' },
      ],
    },
  },

  components: true, // Auto-import des composants

  compatibilityDate: '2025-01-22',
});
