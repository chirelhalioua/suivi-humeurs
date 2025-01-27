<template>
  <div class="home-page">
    <div class="hero-section">
      <h1>Suis tes humeurs avec Louis de Funès</h1>
      <button @click="goToRegister">S'inscrire</button>
    </div>

    <!-- Section Concept -->
    <div class="concept-section" id="concept-section">
      <h2>Le Concept</h2>
      <p>Exprimez vos humeurs avec Louis de Funès.</p>

      <div class="concept-list">
        <div class="concept-item">
          <p>Exprimez facilement votre humeur à travers des images de Louis de Funès.</p>
        </div>
        <div class="concept-item">
          <p>Suivez votre humeur de façon journalière et hebdomadaire.</p>
        </div>
        <div class="concept-item">
          <p>Améliorez votre humeur grâce à des vidéos et des citations de Louis de Funès.</p>
        </div>
        <div class="concept-item">
          <p>Partagez votre humeur à votre entourage.</p>
        </div>
      </div>
    </div>

    <!-- Section Aperçu des Humeurs -->
    <div class="mood-preview-section">
      <h2>Aperçu des Humeurs</h2>
      <!-- Affichage des humeurs -->
      <div v-if="moods.length > 0" class="mood-preview-grid">
        <div v-for="mood in moods" :key="mood._id" class="mood-preview-card">
          <img :src="mood.image" :alt="mood.title" />
          <h3>{{ mood.title }}</h3>
          <p>{{ mood.subtitle }}</p>
          <p><strong>Film : </strong>{{ mood.film }}</p>
        </div>
      </div>

      <!-- Affichage des erreurs -->
      <div v-else-if="errorMessage" class="error">
        <p>{{ errorMessage }}</p>
      </div>

      <!-- Affichage du chargement -->
      <div v-else>
        <p>Chargement des humeurs en cours...</p>
      </div>
    </div>

    <!-- Section Démonstration -->
    <div class="demonstration">
      <h2>Démonstration</h2>
      <div class="video-demo"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

// Variables pour stocker les données et gérer les erreurs
const moods = ref([]); // Stockage des humeurs
const errorMessage = ref(""); // Gestion des erreurs

// Fonction pour récupérer les humeurs
const fetchMoods = async () => {
  try {
    console.log("Appel à l'API en cours...");
    const response = await axios.get("https://suivi-humeurs-back.onrender.com/api/humeurs");
    moods.value = response.data.slice(0, 4); // On récupère seulement les 4 premiers éléments
    console.log("Humeurs récupérées :", moods.value);
  } catch (error) {
    console.error("Erreur lors de la récupération des humeurs :", {
      message: error.message,
      config: error.config,
      stack: error.stack,
    });
    errorMessage.value = "Impossible de charger les humeurs. Veuillez réessayer plus tard.";
  }
};

// Redirection vers la page d'inscription
const goToRegister = () => {
  window.location.href = "/register";
};

// Charger les humeurs au montage
onMounted(fetchMoods);
</script>

<style scoped>
/* Styles pour la page d'accueil */
.home-page {
  text-align: center;
}

.hero-section {
  position: relative;
  background-image: url("/background.jpg");
  background-size: cover;
  background-position: center center;
  height: 100vh;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

/* Styles pour la section Aperçu des Humeurs */
.mood-preview-section {
  margin-top: 50px;
  text-align: center;
}

.mood-preview-grid {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.mood-preview-card {
  width: 350px;
  border: 1px solid #ddd;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.mood-preview-card:hover {
  transform: translateY(-10px);
}

.mood-preview-card img {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

.mood-preview-card h3 {
  font-size: 1.2rem;
  margin: 10px 0;
}

.mood-preview-card p {
  font-size: 1.2rem;
  color: #666;
  margin: 0 10px 10px 10px;
}

/* Styles pour les erreurs */
.error {
  color: red;
  font-size: 1.2rem;
  margin: 20px 0;
}
</style>
