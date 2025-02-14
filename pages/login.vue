<template>
  <div class="auth-container">
    <h1>Connexion</h1>
    <form @submit.prevent="loginUser">
      <div>
        <label for="email">Email</label>
        <input v-model="email" type="email" id="email" required />
      </div>
      <div>
        <label for="password">Mot de passe</label>
        <input v-model="password" type="password" id="password" required />
      </div>
      <button type="submit">Se connecter</button>
    </form>

    <!-- Message de confirmation ou d'erreur -->
    <div v-if="message" :class="messageClass">{{ message }}</div>

    <!-- Lien vers la page d'inscription si l'utilisateur n'a pas encore de compte -->
    <div class="link-container">
      <p>
        Vous n'avez pas encore de compte ? 
        <router-link to="/register">Veuillez vous inscrire ici</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

// Définition des variables réactives
const email = ref('');
const password = ref('');
const message = ref('');
const messageClass = ref('');
const router = useRouter();

// Fonction de connexion de l'utilisateur
const loginUser = async () => {
  // Validation de l'email et du mot de passe
  if (!email.value || !password.value) {
    message.value = 'Tous les champs doivent être remplis';
    messageClass.value = 'error';
    return;
  }

  try {
    const response = await axios.post('https://suivi-humeurs-back.onrender.com/api/auth/login', {
      email: email.value,
      password: password.value,
    });

    const { token } = response.data;

    if (!token) {
      throw new Error("Aucun token reçu");
    }

    localStorage.setItem('authToken', token); // Sauvegarder le token

    message.value = 'Connexion réussie';
    messageClass.value = 'success';

    router.push('/profil'); // Rediriger vers la page de profil
  } catch (error) {
    console.error(error);

    // Vérification des erreurs possibles
    if (error.response?.data?.message) {
      message.value = error.response.data.message;
    } else {
      message.value = 'Erreur de connexion, veuillez réessayer';
    }

    messageClass.value = 'error';
  }
};
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
}

form div {
  margin-bottom: 1rem;
}

input {
  width: 93%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.success {
  color: green;
  text-align: center;
}

.error {
  color: red;
  text-align: center;
}

.link-container {
  text-align: center;
  margin-top: 20px;
}

.link-container p {
  font-size: 1rem;
}

.router-link {
  color: #4CAF50;
  text-decoration: none;
}

.router-link:hover {
  text-decoration: underline;
}
</style>
