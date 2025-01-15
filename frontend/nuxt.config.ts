export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  plugins: [
    '~/plugins/axios.js',
  ],
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
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
        },
      ],
    },
  },
  components: true,
  compatibilityDate: '2025-01-06',
  axios: {
    baseURL: 'https://suivi-humeurs.onrender.com',
  },
});
