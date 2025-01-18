<template>
  <div class="register-container">
    <h1>Inscription</h1>
    <form @submit.prevent="registerUser">
      <div class="form-group">
        <label for="nom">Nom et Prénom</label>
        <input v-model="nom" type="text" id="nom" required />
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input v-model="email" type="email" id="email" required />
      </div>
      <div class="form-group">
        <label for="password">Mot de passe</label>
        <input v-model="password" type="password" id="password" required />
      </div>
      <div class="form-group">
        <label for="confirm-password">Confirmer le mot de passe</label>
        <input v-model="confirmPassword" type="password" id="confirm-password" required />
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
import { ref } from 'vue';
import { useNuxtApp } from '#app';

const { $axios } = useNuxtApp();
const nom = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const message = ref('');
const messageClass = ref('');

const registerUser = async () => {
  if (password.value !== confirmPassword.value) {
    message.value = "Les mots de passe ne correspondent pas!";
    messageClass.value = 'error';
    return;
  }

  try {
    const response = await axios.post('https://suivi-humeurs.onrender.com/api/auth/register', {
      name: nom.value,
      email: email.value,
      password: password.value,
    });

    message.value = "Inscription réussie!";
    messageClass.value = 'success';
    console.log(response.data);
  } catch (error) {
    if (error.response) {
      message.value = `Erreur: ${error.response.status} - ${error.response.data.message || 'Erreur du serveur'}`;
    } else if (error.request) {
      message.value = 'La requête n\'a pas reçu de réponse';
    } else {
      message.value = `Erreur de configuration: ${error.message}`;
    }
    messageClass.value = 'error';
  }
};
</script>

<style scoped>
/* Styles de base */
.register-container {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  font-size: 1.8rem;
}

form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
}

input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

button {
  width: 100%;
  padding: 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
}

button:hover {
  background-color: #45a049;
}

.success {
  color: green;
  text-align: center;
  margin-top: 1rem;
}

.error {
  color: red;
  text-align: center;
  margin-top: 1rem;
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

/* Styles responsive */
@media (max-width: 768px) {
  .register-container {
    padding: 1.5rem;
  }

  h1 {
    font-size: 1.5rem;
  }

  input,
  button {
    font-size: 0.9rem;
    padding: 0.7rem;
  }
}

@media (max-width: 480px) {
  .register-container {
    padding: 1rem;
  }

  h1 {
    font-size: 1.2rem;
  }

  input,
  button {
    font-size: 0.8rem;
    padding: 0.6rem;
  }

  .link-container p {
    font-size: 0.9rem;
  }
}
</style>
