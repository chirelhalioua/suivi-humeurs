<template>
  <div class="profile-container" v-if="user">
    <h1>Bienvenue sur ton profil</h1> <!-- Phrase de bienvenue -->
    
    <div class="profile-info">
      <p><strong>Nom et Prénom :</strong> {{ user.name }}</p>
      <p><strong>Email :</strong> {{ user.email }}</p>
    </div>
    
    <!-- Liens sous forme de boutons verts -->
    <div class="buttons-container">
      <button class="green-btn" @click="goToHumeursChoice">Choix des Humeurs</button>
      <button class="green-btn" @click="goToMoodTracking">Suivi des Humeurs</button>
    </div>
    
    <!-- Bouton de suppression de profil en rouge -->
    <button class="red-btn" @click="confirmDelete">Supprimer son profil</button> 
    
    <!-- Bouton de déconnexion en orange -->
    <button class="orange-btn" @click="logout">Se déconnecter</button> 
  </div>

  <!-- Fenêtre de confirmation de suppression -->
  <div v-if="showConfirmDelete" class="confirm-delete">
    <p>Êtes-vous sûr de supprimer votre profil ? Toutes vos données seront effacées.</p>
    <button @click="deleteProfile">Supprimer</button>
    <button @click="cancelDelete">Annuler</button>
  </div>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const user = ref(null);
const router = useRouter();
const showConfirmDelete = ref(false); // Variable pour afficher la confirmation de suppression

// Fonction pour récupérer les informations de l'utilisateur connecté
const fetchUserProfile = async () => {
  const token = localStorage.getItem('authToken');

  if (!token) {
    // Si aucun token, rediriger vers la page de connexion
    console.log('Aucun token trouvé, redirection vers /login');
    router.push('/login');
    return;
  }

  try {
    // Envoi de la requête à l'API pour récupérer le profil
    const response = await axios.get('https://suivi-humeurs-back.onrender.com/api/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Vérifier la réponse
    if (response.status === 200 && response.data && response.data.user) {
      user.value = response.data.user;
      console.log('Profil utilisateur récupéré', user.value);
    } else {
      console.error('Réponse de l\'API inattendue', response);
      router.push('/login'); // Rediriger si le profil n'est pas trouvé
    }

  } catch (error) {
    console.error('Erreur lors de la récupération des données utilisateur', error);
    // Rediriger en cas d'erreur
    router.push('/login');
  }
};

// Fonction de déconnexion
const logout = () => {
  localStorage.removeItem('authToken');
  router.push('/login');
};

// Rediriger vers la page Choix des Humeurs
const goToHumeursChoice = () => {
  router.push('/choisir-humeurs');
};

// Rediriger vers la page Suivi des Humeurs
const goToMoodTracking = () => {
  router.push('/suivi-humeurs');
};

// Afficher la confirmation de suppression
const confirmDelete = () => {
  showConfirmDelete.value = true;
};

// Annuler la suppression
const cancelDelete = () => {
  showConfirmDelete.value = false;
};

// Supprimer le profil
const deleteProfile = async () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    router.push('/login');
    return;
  }

  try {
    // Envoi de la requête à l'API pour supprimer le profil
    const response = await axios.delete('https://suivi-humeurs-back.onrender.com/api/auth/profile', {
  headers: {
    Authorization: `Bearer ${token}`, // Token JWT pour identification
  },
});


    if (response.status === 200) {
      // Redirection après suppression
      localStorage.removeItem('authToken');
      router.push('/login');
      alert("Votre profil a été supprimé avec succès.");
    } else {
      console.error('Erreur lors de la suppression du profil', response.status, response.data);
      alert("Une erreur est survenue lors de la suppression du profil.");
    }
  } catch (error) {
    console.error('Erreur lors de la suppression du profil', error.response ? error.response.data : error);
    alert("Une erreur est survenue lors de la suppression du profil.");
  }
};


// Charger le profil de l'utilisateur au montage du composant
onMounted(() => {
  fetchUserProfile();
});
</script>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
}

.profile-info {
  margin-bottom: 1rem;
}

.profile-info p {
  font-size: 1.1rem;
}

button {
  width: 100%;
  padding: 1rem;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  opacity: 0.9;
}

.buttons-container {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
}

.buttons-container .green-btn {
  width: 48%;
  background-color: #4CAF50; /* Couleur verte pour les boutons */
  color: white;
}

.buttons-container .green-btn:hover {
  background-color: #45a049; /* Légèrement plus foncé au survol */
}

/* Bouton de suppression en rouge */
.red-btn {
  background-color: #EF1515;
}

.red-btn:hover {
  background-color: #d31313;
}

/* Bouton de déconnexion en orange */
.orange-btn {
  background-color: #FF9800; /* Orange pour la déconnexion */
  margin-top: 20px;
}

.orange-btn:hover {
  background-color: #FB8C00; /* Légèrement plus foncé au survol */
}

/* Fenêtre de confirmation de suppression */
.confirm-delete {
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  text-align: center;
  border-radius: 8px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}

.confirm-delete button {
  width: 45%;
  margin: 10px 2%;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
}

.confirm-delete button:hover {
  opacity: 0.9;
}

.confirm-delete button:first-child {
  background-color: #f44336;
  color: white;
}

.confirm-delete button:last-child {
  background-color: #4CAF50;
  color: white;
}

.loading {
  text-align: center;
  font-size: 1.2rem;
}
</style>
