<template>
  <div>
    <!-- Boutons pour changer la vue -->
    <div class="view-buttons">
      <button @click="changeView('daily')" class="view-btn">Journalier</button>
      <button @click="changeView('weekly')" class="view-btn">Hebdomadaire</button>
    </div>

    <!-- Sélection du jour pour l'affichage journalier -->
    <div v-if="view === 'daily'" class="select-day-container">
      <label for="daySelect">Jour sélectionné :</label>
      <select id="daySelect" v-model="selectedDay" class="day-select">
        <option v-for="(day, index) in days" :key="index" :value="index">{{ day }}</option>
      </select>
    </div>

    <!-- Affichage des humeurs du matin et du soir -->
    <div v-if="view === 'daily'" class="mood-display">
      <div class="mood-container">
        <div v-if="morningData[selectedDay]" class="mood-item">
          <img :src="morningData[selectedDay]?.image" alt="Matin" class="mood-image round" />
          <div>
            <p><strong>Matin:</strong></p>
            <p>{{ morningData[selectedDay]?.title }}</p>
            <p>{{ morningData[selectedDay]?.subtitle }}</p>
          </div>
        </div>
        <div v-else class="error-message">Humeur du matin manquante</div>

        <div v-if="eveningData[selectedDay]" class="mood-item">
          <img :src="eveningData[selectedDay]?.image" alt="Soir" class="mood-image round" />
          <div>
            <p><strong>Soir:</strong></p>
            <p>{{ eveningData[selectedDay]?.title }}</p>
            <p>{{ eveningData[selectedDay]?.subtitle }}</p>
          </div>
        </div>
        <div v-else class="error-message">Humeur du soir manquante</div>
      </div>
    </div>

    <!-- Vue hebdomadaire -->
    <div v-if="view === 'weekly'" class="weekly-view">
      <div class="weekly-mood">
        <div v-for="(day, index) in weekDates" :key="index" class="weekly-day">
          <div class="day-content">
            <!-- Afficher le jour de la semaine et la date complète -->
            <h3>{{ days[index] }} ({{ formatDate(day) }})</h3>
            <div v-if="isPastOrToday(index)">
              <!-- Matin -->
              <div class="mood-item">
                <p><strong>Matin:</strong></p>
                <div v-if="morningData[index]" class="mood-item">
                  <img :src="morningData[index].image" alt="Matin" class="mood-image round" />
                  <p>{{ morningData[index].title }}</p>
                </div>
                <div v-else class="error-message">Humeur manquante</div>
              </div>

              <!-- Soir -->
              <div class="mood-item">
                <p><strong>Soir:</strong></p>
                <div v-if="eveningData[index]" class="mood-item">
                  <img :src="eveningData[index].image" alt="Soir" class="mood-image round" />
                  <p>{{ eveningData[index].title }}</p>
                </div>
                <div v-else class="error-message">Humeur manquante</div>
              </div>
            </div>
            <div v-else>
              <p><em>Jour à venir</em></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';

// État
const view = ref('daily');
const selectedDay = ref(new Date().getDay()); // Initialise avec le jour actuel
const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

const morningData = ref([]);
const eveningData = ref([]);
const missingMorningMood = ref(false);
const missingEveningMood = ref(false);

// Dates des jours de la semaine
const weekDates = ref([]);

// Récupérer les dates de la semaine
const calculateWeekDates = () => {
  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay())); // Dimanche de cette semaine
  const dates = Array(7)
    .fill(null)
    .map((_, index) => new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + index));
  weekDates.value = dates;
};

// Formater une date au format "jour mois année"
const formatDate = (date) => {
  const options = { day: '2-digit', month: 'long', year: 'numeric' };
  return new Intl.DateTimeFormat('fr-FR', options).format(date);
};

// Récupérer les données utilisateur à partir du token
const getUserDataFromToken = async () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    console.error('Aucun token trouvé. Veuillez vous reconnecter.');
    return null;
  }

  try {
    const response = await axios.get('https://suivi-humeurs-back.onrender.com/api/humeurs/:userId', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des données utilisateur :', error);
    return null;
  }
};

// Récupérer les informations des humeurs
const getMoodById = async (humeurId) => {
  try {
    const response = await axios.get(`https://suivi-humeurs-back.onrender.com/api/humeurs/${humeurId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des données d\'humeur :', error);
    return { title: 'Humeur inconnue', subtitle: '', image: '' };
  }
};

// Vérifier si un jour est dans le passé ou aujourd'hui
const isPastOrToday = (index) => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  return index <= dayOfWeek;
};

// Récupérer les données des humeurs
const fetchMoodData = async () => {
  const user = await getUserDataFromToken();
  if (!user) return;

  try {
    const response = await axios.get(`https://suivi-humeurs-back.onrender.com/api/humeurs_utilisateurs/${user._id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });

    console.log('Réponse API des humeurs utilisateur :', response.data);

    // Réinitialiser les données
    morningData.value = Array(7).fill(null);
    eveningData.value = Array(7).fill(null);

    for (const entry of response.data) {
      const dayIndex = new Date(entry.date).getDay();
      const moodData = await getMoodById(entry.humeurId);

      if (entry.timeOfDay === 'morning') {
        morningData.value[dayIndex] = moodData;
      } else if (entry.timeOfDay === 'evening') {
        eveningData.value[dayIndex] = moodData;
      }
    }

    // Gérer les humeurs manquantes pour le jour sélectionné
    missingMorningMood.value = !morningData.value[selectedDay.value];
    missingEveningMood.value = !eveningData.value[selectedDay.value];
  } catch (error) {
    console.error('Erreur lors de la récupération des données des humeurs :', error);
  }
};

// Initialisation au montage du composant
onMounted(() => {
  selectedDay.value = new Date().getDay(); // Définit automatiquement le jour actuel
  calculateWeekDates(); // Calculer les dates de la semaine
  fetchMoodData();
});

// Réagir au changement de jour sélectionné
watch(selectedDay, () => {
  missingMorningMood.value = !morningData.value[selectedDay.value];
  missingEveningMood.value = !eveningData.value[selectedDay.value];
});

// Changer la vue entre journalier et hebdomadaire
const changeView = (newView) => {
  view.value = newView;
};
</script>

<style scoped>
/* Styles des boutons */
.view-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.view-btn {
  padding: 12px 25px;
  font-size: 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-btn:hover {
  background-color: #45a049;
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.view-btn:active {
  transform: translateY(1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Sélection du jour */
.select-day-container {
  margin-top: 10px;
  text-align: center;
}

.day-select {
  padding: 8px;
  margin-left: 10px;
  font-size: 16px;
  border-radius: 5px;
}

/* Affichage des humeurs */
.mood-display {
  margin-top: 20px;
}

.mood-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.mood-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
}

.mood-image {
  width: 200px;
  height: 200px;
  margin-bottom: 10px;
}

.mood-image.round {
  border-radius: 50%;
}

/* Vue hebdomadaire */
.weekly-view {
  margin-top: 20px;
}

.weekly-mood {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 20px;
}

.weekly-day {
  text-align: center;
  padding: 10px;
  position: relative;
}

.day-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}

/* Message d'erreur */
.error-message {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}

/* Media Queries */
@media (max-width: 768px) {
  .weekly-mood {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 480px) {
  .weekly-mood {
    grid-template-columns: 1fr;
  }
}
</style>
