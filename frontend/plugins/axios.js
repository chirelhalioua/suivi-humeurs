import axios from 'axios'

export default defineNuxtPlugin(nuxtApp => {
  const api = axios.create({
    baseURL: 'https://suivi-humeurs.onrender.com/api', // Remplacez par votre URL d'API
  })

  // Ajoutez axios à l'instance de Nuxt
  nuxtApp.provide('axios', api)
})
