<template>
  <div class="register-container">
    <h1>Inscription</h1>
    <form @submit.prevent="registerUser">
      <div>
        <label for="nom">Nom et Prénom</label>
        <input v-model="nom" type="text" id="nom" required />
      </div>
      <div>
        <label for="email">Email</label>
        <input v-model="email" type="email" id="email" required />
      </div>
      <div>
        <label for="password">Mot de passe</label>
        <input v-model="password" type="password" id="password" required />
      </div>
      <div>
        <label for="confirm-password">Confirmer le mot de passe</label>
        <input
          v-model="confirmPassword"
          type="password"
          id="confirm-password"
          required
        />
      </div>
      <button type="submit">S'inscrire</button>
    </form>

    <!-- Message d'erreur ou de succès -->
    <div v-if="message" :class="messageClass">{{ message }}</div>

    <!-- Lien vers la page de connexion si l'utilisateur a déjà un compte -->
    <div class="link-container">
      <p>
        Vous avez déjà un compte ?
        <router-link to="/login">Se connecter ici</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

// Définir les données du formulaire
const nom = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const message = ref("");
const messageClass = ref("");

// Fonction pour gérer l'inscription
const registerUser = async () => {
  try {
    const response = await axios.post('https://suivi-humeurs-back.onrender.com/api/auth/register', {
      name: nom.value,
      email: email.value,
      password: password.value,
    });
    message.value = "Inscription réussie!";
    messageClass.value = "success";
  } catch (error) {
    if (error.response) {
      message.value = error.response.data.error || "Erreur du serveur";
    } else if (error.request) {
      message.value = "La requête n'a pas reçu de réponse";
    } else {
      message.value = `Erreur de configuration: ${error.message}`;
    }
    messageClass.value = "error";
  }
};
</script>

<style scoped>
.register-container {
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
