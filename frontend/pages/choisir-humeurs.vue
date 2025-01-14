<template>
  <div class="choose-mood">
    <h1>Choisissez votre humeur</h1>

    <div class="moods-container">
      <!-- Flèche gauche -->
      <button class="arrow-btn" @click="prevMood" :disabled="!canNavigate">
        ◀
      </button>

      <div class="mood-card">
        <img v-if="currentMood" :src="currentMood.image" :alt="currentMood.title" />
        <h3>{{ currentMood?.title || "Pas d'humeur disponible" }}</h3>
        <p>{{ currentMood?.subtitle || "" }}</p>
        <p><strong>Film : </strong>{{ currentMood?.film || "Film non disponible" }}</p>
      </div>

      <!-- Flèche droite -->
      <button class="arrow-btn" @click="nextMood" :disabled="!canNavigate">
        ▶
      </button>
    </div>

    <!-- Message de statut -->
    <div v-if="hasChosenMood" class="mood-actions">
      <p>{{ moodStatusMessage }}</p>
    </div>

    <!-- Zone pour ajouter une description -->
    <div v-if="selectedMoodId && !hasChosenMood" class="mood-details">
      <textarea
        v-model="description"
        placeholder="Décrivez comment vous vous sentez"
      ></textarea>
      <button @click="saveMood">
        Enregistrer
      </button>
    </div>

    <!-- Bouton pour choisir l'humeur -->
    <div v-if="!hasChosenMood && !selectedMoodId" class="mood-actions">
      <button @click="chooseMood" :disabled="!canChooseMood">
        Choisir cette humeur
      </button>
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
    const response = await axios.get('http://localhost:5000/api/humeurs');
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
const checkIfMoodAlreadyChosen = () => {
  const user = getUserFromLocalStorage();
  if (user) {
    const userId = user._id;
    const currentDate = new Date().toISOString().split('T')[0];
    const currentHour = new Date().getHours();
    const timeOfDay = currentHour < 12 ? 'morning' : 'evening';

    const storedMood = JSON.parse(localStorage.getItem('userMoodChoice'));

    if (storedMood && storedMood.userId === userId && storedMood.date === currentDate) {
      if (storedMood.timeOfDay === timeOfDay) {
        hasChosenMood.value = true;
        moodStatusMessage.value = timeOfDay === 'morning'
          ? "Vous avez déjà choisi votre humeur pour ce matin. Revenez ce soir pour choisir l'humeur du soir."
          : "Vous avez déjà choisi vos humeurs pour aujourd'hui, revenez demain.";
      } else {
        hasChosenMood.value = false;
        moodStatusMessage.value = '';
      }
    } else {
      hasChosenMood.value = false;
      moodStatusMessage.value = '';
    }
  }
};

// Humeur actuelle basée sur l'index
const currentMood = computed(() => humeurs.value[currentIndex.value]);

// Navigation entre les humeurs
const prevMood = () => {
  currentIndex.value = (currentIndex.value - 1 + humeurs.value.length) % humeurs.value.length;
};
const nextMood = () => {
  currentIndex.value = (currentIndex.value + 1) % humeurs.value.length;
};

// Vérifications
const canNavigate = computed(() => humeurs.value.length > 1);
const canChooseMood = computed(() => {
  const currentHour = new Date().getHours();
  return (currentHour >= 6 && currentHour < 12) || (currentHour >= 17 && currentHour < 24);
});

// Actions
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
  if (!user || !selectedMoodId.value || !description.value) {
    alert("Veuillez remplir tous les champs avant d'enregistrer.");
    return;
  }

  const userMoodChoice = {
    userId: user._id,
    date: new Date().toISOString().split('T')[0],
    timeOfDay: new Date().getHours() < 12 ? 'morning' : 'evening',
    humeurId: selectedMoodId.value,
    description: description.value,
  };

  try {
    const response = await axios.post('http://localhost:5000/api/humeurs_utilisateurs', userMoodChoice);
    if (response.status === 200) {
      alert('Humeur enregistrée avec succès !');
      localStorage.setItem('userMoodChoice', JSON.stringify(userMoodChoice));
      hasChosenMood.value = true;
      moodStatusMessage.value = "Merci d'avoir enregistré votre humeur.";
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
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.mood-card {
  border: 4px solid #ddd;
  border-radius: 16px;
  padding: 20px;
  width: 300px;
  height: 500px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s, border-color 0.3s;
  overflow: hidden; /* Eviter que l'image sorte de la carte */
}

.mood-card img {
  max-width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 20px;
}

/* Style des flèches */
.arrow-btn {
  background-color: #4CAF50; /* Couleur verte visible */
  color: white; /* Couleur du texte */
  border: none;
  border-radius: 50%;
  padding: 20px 25px; /* Taille agrandie */
  font-size: 24px; /* Augmente la taille des flèches */
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); /* Ombre visible */
  transition: background-color 0.3s, transform 0.2s;
}

/* Effet au survol */
.arrow-btn:hover {
  background-color: #45a049; /* Légèrement plus foncé */
  transform: scale(1.1); /* Agrandissement */
}

/* État désactivé */
.arrow-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.mood-actions {
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #45a049;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

textarea {
  width: 100%;
  height: 100px;
  margin-top: 10px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.mood-details {
  margin-top: 20px;
}
</style>