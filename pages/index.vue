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

      <!-- Liste stylisée avec icônes -->
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
      <div class="mood-preview-grid">
        <div v-for="mood in moods" :key="mood._id" class="mood-preview-card">
          <img :src="mood.image" :alt="mood.title" />
          <h3>{{ mood.title }}</h3>
          <p>{{ mood.subtitle }}</p>
          <p><strong>Film : </strong>{{ mood.film }}</p>
        </div>
      </div>
    </div>

      <!-- Section Démonstration -->
      <div class="demonstration">
      <h2>Démonstration</h2>
      <div class="video-demo">
        
        </div>
      </div>
    </div>
      
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const moods = ref([]); // Stockage des 4 humeurs pour l'aperçu

// Récupérer les 4 humeurs depuis l'API
const fetchMoods = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/humeurs");
    moods.value = response.data.slice(0, 4); // On prend les 4 premiers éléments
  } catch (error) {
    console.error("Erreur lors de la récupération des humeurs :", error);
    errorMessage.value = 'Une erreur est survenue lors du chargement des humeurs.';
  }
};

// Charger les humeurs au montage
onMounted(fetchMoods);

const goToRegister = () => {
  // Redirige l'utilisateur vers la page d'inscription
  window.location.href = '/register';
};

const scrollToConcept = () => {
  // Défile vers la section "concept-section" lorsque l'on clique sur la flèche
  document.getElementById("concept-section").scrollIntoView({ behavior: "smooth" });
};
</script>

<style scoped>
.home-page {
  text-align: center;
}

.hero-section {
  position: relative;
  background-image: url('/background.jpg');
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

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

/* Animation du texte h1 */
.hero-section h1 {
  position: relative;
  z-index: 2;
  font-size: 3rem;
  margin-bottom: 20px;
  opacity: 0;
  animation: slideUp 1s ease-out forwards;
}

/* Définition de l'animation */
@keyframes slideUp {
  0% {
    transform: translateY(50px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.hero-section button {
  position: relative;
  z-index: 2;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  margin-top: 20px;
}

.hero-section button:hover {
  background-color: #45a049;
}

/* Flèche vers le bas */
.scroll-down {
  position: absolute;
  bottom: 30px;
  background-color: #4CAF50;
  border-radius: 50%;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.scroll-down:hover {
  background-color: #45a049;
}

.scroll-down i {
  font-size: 2rem;
  color: white;
}

.concept-section {
  margin: 50px 0;
  text-align: center;
}

.concept-section h2 {
  font-size: 2rem;
  margin-bottom: 20px;
}

.concept-section p {
  font-size: 1.2rem;
  margin-bottom: 30px;
}

/* Section Liste avec icônes et effet hover */
.concept-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  padding: 0;
}

.concept-item {
  background-color: #f1f1f1;
  padding: 20px;
  border-radius: 8px;
  width: 250px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, background-color 0.3s ease;
  text-align: left;
}

.concept-item i {
  font-size: 2rem;
  color: #4CAF50;
  margin-right: 10px;
}

.concept-item:hover {
  background-color: #4CAF50;
  color: white;
  transform: translateY(-10px);
}

.concept-item p {
  font-size: 1.1rem;
  margin: 0;
}

/* Sur petit écran, les éléments s'affichent verticalement et sont moins larges */
@media (max-width: 768px) {
  .concept-list {
    flex-direction: column;
    align-items: center;
  }

  .concept-item {
    width: 80%; /* Réduit la largeur des éléments sur mobile */
    margin-bottom: 15px;
  }
}

/* Section Aperçu des Humeurs */
.mood-preview-section {
  margin-top: 50px;
  text-align: center;
}

.mood-preview-section h2 {
  font-size: 2rem;
  margin-bottom: 20px;
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

/* Section Démonstration */
.demonstration {
  margin: 2rem auto; /* Espace autour de la section */
  padding: 1.5rem;
  max-width: 1200px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.demonstration h2 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #333;
}

/* Conteneur de vidéo */
.video-demo {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
}

.video-demo iframe {
  width: 100%;
  max-width: 800px; /* Taille maximale de la vidéo */
  height: 450px; /* Hauteur de la vidéo */
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .video-demo iframe {
    height: 250px; /* Ajuster la hauteur de la vidéo pour les petits écrans */
  }
}

@media (max-width: 480px) {
  .demonstration {
    padding: 1rem;
  }

  .demonstration h2 {
    font-size: 1.5rem;
  }

  .video-demo iframe {
    max-width: 100%;
  }
}

</style>
