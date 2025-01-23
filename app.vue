<template>
  <div class="app-container">
    <!-- Entête de l'application -->
    <header>
      <nav>
        <div class="menu-toggle" @click="toggleMenu">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </div>
        <div :class="{'menu-open': menuOpen}" class="menu">
          <a href="/">Accueil</a>
          <a v-if="!isAuthenticated" href="/login">Connexion</a>
          <a v-if="!isAuthenticated" href="/register">Inscription</a>
          <a v-if="isAuthenticated" href="/profil">Votre profil</a> <!-- Lien ajouté -->
          <a v-if="isAuthenticated" href="/choisir-humeurs">Choix des Humeurs</a> <!-- Lien ajouté -->
          <a v-if="isAuthenticated" href="/suivi-humeurs">Suivi des Humeurs</a> <!-- Lien ajouté -->
          <a v-if="isAuthenticated" @click.prevent="logout" href="#">Déconnexion</a>

          <a href="/contact">Contact</a>
        </div>
      </nav>
    </header>

    <!-- Le contenu principal de l'application -->
    <main class="main-content">
      <NuxtPage /> <!-- C'est ici que les pages (comme `index.vue`) vont être rendues -->
    </main>

    <!-- Pied de page -->
    <footer>
      <p>© 2025 Les Humeurs à la Funès</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';

const isAuthenticated = ref(false);
const menuOpen = ref(false); // Variable pour contrôler l'état du menu
const router = useRouter();

// Vérification de l'authentification à chaque chargement de la page
onMounted(() => {
  const token = localStorage.getItem('authToken');
  isAuthenticated.value = token ? true : false;
});

// Watcher pour écouter les changements d'authentification
watch(isAuthenticated, (newVal) => {
  if (newVal) {
    // L'utilisateur est connecté, vous pouvez prendre des actions supplémentaires si nécessaire
  }
});

// Fonction de déconnexion
const logout = () => {
  localStorage.removeItem('authToken'); // Supprimer le token
  isAuthenticated.value = false; // Mettre à jour l'état
  router.push('/login'); // Rediriger vers la page de connexion
};

// Fonction pour ouvrir/fermer le menu
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};
</script>

<style scoped>
/* Utilisation de Flexbox pour toute la structure */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Prend toute la hauteur de la fenêtre */
}

header {
  background-color: #333;
  color: white;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

nav a {
  color: white;
  margin: 0 10px;
  cursor: pointer;
}

nav a:hover {
  text-decoration: underline;
}

/* Le contenu principal prendra l'espace restant */
.main-content {
  flex-grow: 1;
}

footer {
  background-color: #333;
  color: white;
  padding: 10px;
  text-align: center;
}

/* Styles pour le menu hamburger */
.menu-toggle {
  display: none;
  flex-direction: column;
  cursor: pointer;
}

.menu-toggle .bar {
  width: 25px;
  height: 4px;
  background-color: white;
  margin: 5px 0;
}

/* Cacher le menu sur mobile et afficher le hamburger */
@media (max-width: 768px) {
  .menu {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    background-color: #333;
    text-align: center;
    padding: 10px 0;
    z-index: 1000; /* Assurez-vous que le menu est au-dessus du contenu */
  }

  .menu-open {
    display: flex;
  }

  .menu-toggle {
    display: flex;
  }
}
</style>
