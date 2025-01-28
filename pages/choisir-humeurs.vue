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

        <div class="mood-card">
          <img v-if="currentMood" :src="currentMood.image" :alt="currentMood.title" />
          <h3>{{ currentMood?.title || "Pas d'humeur disponible" }}</h3>
          <p>{{ currentMood?.subtitle || "" }}</p>
          <p><strong>Film : </strong>{{ currentMood?.film || "Film non disponible" }}</p>
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

// Définir l'URL de base de votre API
const API_URL = 'https://suivi-humeurs-back.onrender.com'; // Remplacez par votre URL réelle

// Charger les humeurs depuis l'API
const fetchHumeurs = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/humeurs`);
    humeurs.value = response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des humeurs :', error);
  }
};

// Récupérer l'utilisateur connecté depuis localStorage
const getUserFromLocalStorage = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Erreur lors de l'accès aux données utilisateur dans le localStorage :", error);
    return null;
  }
};

// Vérifier si l'utilisateur a déjà choisi une humeur
const checkIfMoodAlreadyChosen = async () => {
  const user = getUserFromLocalStorage();

  if (user) {
    const userId = user._id;
    const currentDate = new Date().toISOString().split('T')[0];
    const storedMood = JSON.parse(localStorage.getItem('userMoodChoice'));

    if (storedMood && storedMood.userId === userId && storedMood.date === currentDate) {
      hasChosenMood.value = true;
      moodStatusMessage.value = "Vous avez déjà choisi votre humeur pour aujourd'hui.";
    } else {
      hasChosenMood.value = false;
      moodStatusMessage.value = '';
    }
  }
};

const currentMood = computed(() => humeurs.value[currentIndex.value]);

const prevMood = () => {
  currentIndex.value = (currentIndex.value - 1 + humeurs.value.length) % humeurs.value.length;
};
const nextMood = () => {
  currentIndex.value = (currentIndex.value + 1) % humeurs.value.length;
};

const canNavigate = computed(() => humeurs.value.length > 1);
const canChooseMood = computed(() => {
  const currentHour = new Date().getHours();
  return (currentHour >= 6 && currentHour < 12) || (currentHour >= 17 && currentHour < 24);
});

const chooseMood = () => {
  if (!currentMood.value) {
    alert('Aucune humeur sélectionnée.');
    return;
  }

  selectedMoodId.value = currentMood.value._id;
  alert('Humeur sélectionnée. Vous pouvez maintenant ajouter une description et enregistrer.');
};

const saveMood = async () => {
  const user = getUserFromLocalStorage();
  if (!user || !selectedMoodId.value) {
    alert("Veuillez choisir une humeur avant d'enregistrer.");
    return;
  }

  const userMoodChoice = {
    userId: user._id,
    date: new Date().toISOString().split('T')[0],
    timeOfDay: new Date().getHours() < 12 ? 'morning' : 'evening',
    humeurId: selectedMoodId.value,
    description: description.value || "Aucune description fournie",
  };

  try {
    const response = await axios.post(`${API_URL}/api/humeurs_utilisateurs`, userMoodChoice);

    if (response.status === 200) {
      localStorage.setItem('userMoodChoice', JSON.stringify(userMoodChoice));
      hasChosenMood.value = true;
      moodStatusMessage.value = "Merci d'avoir enregistré votre humeur.";
      selectedMoodId.value = null;
      description.value = '';
      checkIfMoodAlreadyChosen();
    }
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de l\'humeur :', error);
  }
};

onMounted(() => {
  fetchHumeurs();
  checkIfMoodAlreadyChosen();
});
</script>

<style scoped>
.choose-mood {
  text-align: center;
  margin: 20px;
  font-family: 'Arial', sans-serif;
}

h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
  animation: fadeIn 0.6s ease-in-out;
}

.moods-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.mood-card {
  background-color: #fff;
  border: 2px solid #eee;
  border-radius: 16px;
  padding: 20px;
  width: 280px;
  height: 450px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, border-color 0.3s;
  display: flex
