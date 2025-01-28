<template>
  <div class="choose-mood">
    <h1>Choisissez votre humeur</h1>

    <!-- Vérifie si l'utilisateur a déjà choisi une humeur -->
    <div v-if="hasChosenMood" class="mood-status">
      <p class="warning">{{ moodStatusMessage }}</p>
    </div>

    <!-- Section principale pour choisir une humeur -->
    <div v-if="!hasChosenMood">
      <div class="moods-container">
        <!-- Flèche gauche -->
        <button class="arrow-btn" @click="prevMood" :disabled="!canNavigate || hasChosenMood">
          ◀
        </button>

        <!-- Conteneur des cartes avec animation -->
        <div class="cards-wrapper">
          <transition-group name="card-slide" tag="div">
            <div
              v-for="(mood, index) in humeurs"
              v-if="index === currentIndex"
              :key="mood._id"
              class="mood-card"
            >
              <img v-if="mood.image" :src="mood.image" :alt="mood.title" />
              <h3>{{ mood.title }}</h3>
              <p>{{ mood.subtitle }}</p>
              <p><strong>Film : </strong>{{ mood.film || "Film non disponible" }}</p>
            </div>
          </transition-group>
        </div>

        <!-- Flèche droite -->
        <button class="arrow-btn" @click="nextMood" :disabled="!canNavigate || hasChosenMood">
          ▶
        </button>
      </div>

      <!-- Bouton pour choisir une humeur -->
      <div v-if="!hasChosenMood" class="mood-actions">
        <button
          @click="chooseMood"
          :disabled="!canChooseMood || hasChosenMood"
          class="choose-mood-btn"
        >
          Choisir cette humeur
        </button>
      </div>

      <!-- Zone pour ajouter une description après avoir choisi une humeur -->
      <div v-if="selectedMoodId" class="mood-details">
        <textarea
          v-model="description"
          placeholder="Décrivez comment vous vous sentez (optionnel)"
        ></textarea>
        <button @click="saveMood">
          Enregistrer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

// Données et états
const humeurs = ref([]);
const currentIndex = ref(0);
const selectedMoodId = ref(null);
const description = ref('');
const hasChosenMood = ref(false);
const moodStatusMessage = ref('');

// Charger les humeurs depuis l'API
const fetchHumeurs = async () => {
  try {
    const response = await axios.get('https://suivi-humeurs-back.onrender.com/api/humeurs'); // Remplacez par votre URL API
    humeurs.value = response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des humeurs :', error);
  }
};

// Vérifier si l'utilisateur a déjà choisi une humeur
const checkIfMoodAlreadyChosen = async () => {
  const storedMood = JSON.parse(localStorage.getItem('userMoodChoice'));
  const currentDate = new Date().toISOString().split('T')[0];

  if (storedMood?.date === currentDate) {
    hasChosenMood.value = true;
    moodStatusMessage.value = "Vous avez déjà choisi votre humeur pour aujourd'hui.";
  }
};

// Navigation entre les humeurs
const prevMood = () => currentIndex.value = (currentIndex.value - 1 + humeurs.value.length) % humeurs.value.length;
const nextMood = () => currentIndex.value = (currentIndex.value + 1) % humeurs.value.length;

// Sélectionner une humeur
const chooseMood = () => {
  if (!currentMood.value) return;
  selectedMoodId.value = currentMood.value._id;
  alert('Humeur sélectionnée.');
};

// Sauvegarder l'humeur
const saveMood = async () => {
  if (!selectedMoodId.value) {
    alert("Veuillez choisir une humeur avant d'enregistrer.");
    return;
  }

  const userMoodChoice = {
    humeurId: selectedMoodId.value,
    description: description.value || '',
    date: new Date().toISOString().split('T')[0],
  };

  try {
    const response = await axios.post('https://suivi-humeurs-back.onrender.com/api/humeurs_utilisateurs', userMoodChoice); // Remplacez par votre URL API

    if (response.status === 200) {
      localStorage.setItem('userMoodChoice', JSON.stringify(userMoodChoice));
      hasChosenMood.value = true;
      moodStatusMessage.value = "Humeur enregistrée avec succès.";
    }
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de l\'humeur :', error);
  }
};

// Initialisation
onMounted(() => {
  fetchHumeurs();
  checkIfMoodAlreadyChosen();
});
</script>

<style scoped>
.choose-mood {
  text-align: center;
  margin: 20px;
}

.moods-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}

.cards-wrapper {
  position: relative;
  width: 300px;
  height: 300px;
  overflow: hidden;
}

.mood-card {
  width: 300px;
  height: 300px;
  border: 2px solid #ddd;
  border-radius: 8px;
  text-align: center;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: white;
  transition: transform 0.5s ease-in-out, opacity 0.5s ease-in-out;
}

.mood-card img {
  max-width: 100px;
  max-height: 100px;
  margin-bottom: 10px;
}

.card-slide-enter-active,
.card-slide-leave-active {
  transition: transform 0.5s, opacity 0.5s;
}

.card-slide-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.card-slide-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

.arrow-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 50%;
  padding: 10px;
  cursor: pointer;
}

.arrow-btn:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

.warning {
  color: red;
  font-weight: bold;
}
</style>
