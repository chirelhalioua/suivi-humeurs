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
import { useRouter } from 'vue-router'; // Importation de useRouter

// Définition des variables réactives
const email = ref('');
const password = ref('');
const message = ref('');
const messageClass = ref('');
const router = useRouter(); // Utilisation de useRouter pour accéder au routeur

// Fonction de connexion de l'utilisateur
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Utilisateur non trouvé' });
    }

    // Afficher le mot de passe stocké dans la base pour vérifier que tout est ok
    console.log("Mot de passe haché stocké : ", user.password);

    // Comparer les mots de passe
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log("Mot de passe incorrect");
      return res.status(400).json({ message: 'Mot de passe incorrect' });
    }

    // Créer un token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur du serveur' });
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
