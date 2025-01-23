<template>
  <div>
    <!-- Bloc Contact -->
    <div class="contact-container">
      <h1>Contactez-nous</h1>
      <p>
        Contactez-nous à l'adresse suivante : 
        <a href="mailto:chirelhalioua@gmail.com">chirelhalioua@gmail.com</a>
      </p>
    </div>

    <!-- Bloc Questions Fréquentes -->
    <div class="faq-container">
      <h2>Questions Fréquentes</h2>
      <div 
        v-for="(item, index) in faqItems" 
        :key="index" 
        class="faq-item"
      >
        <button @click="toggleAccordion(index)" class="faq-question">
          {{ item.question }}
        </button>
        <div v-if="item.isOpen" class="faq-answer">
          <p>{{ item.answer }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const faqItems = ref([
  {
    question: "Comment m'inscrire ?",
    answer: "Pour vous inscrire, cliquez sur le bouton 'S'inscrire' sur la page d'accueil ou dans le menu Inscription et suivez les étapes indiquées.",
    isOpen: false
  },
  {
    question: "Comment me connecter ?",
    answer: "Pour vous connecter, cliquez sur le lien Connexion dans le menu et utilisez votre adresse e-mail et votre mot de passe.",
    isOpen: false
  },
  {
    question: "Puis-je supprimer mon profil ?",
    answer: "Oui, vous pouvez supprimer votre profil dans les paramètres de votre compte en sélectionnant l'option 'Supprimer mon compte'.",
    isOpen: false
  },
  {
    question: "Comment choisir une humeur ?",
    answer: "Vous pouvez choisir une humeur en cliquant sur le lien Choix des Humeurs dans le menu ou depuis votre profil.",
    isOpen: false
  },
  {
    question: "De quelle heure à quelle heure puis-je choisir mon humeur ?",
    answer: "Le matin de 6h à 12h et le soir de 17h à minuit.",
    isOpen: false
  },
  {
    question: "Combien de fois puis-je choisir mon humeur ?",
    answer: "Vous pouvez choisir votre humeur 2 fois par jour, le matin et le soir, selon les horaires indiquées ci-dessus.",
    isOpen: false
  },
  {
    question: "Comment suivre mes humeurs ?",
    answer: "Vous pouvez suivre vos humeurs dans votre historique accessible depuis le lien dans le menu : Suivi des Humeurs ou depuis votre profil.",
    isOpen: false
  }
]);

const toggleAccordion = (index) => {
  faqItems.value[index].isOpen = !faqItems.value[index].isOpen;
};
</script>

<style scoped>
/* Bloc Contact */
.contact-container {
  max-width: 100%;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
}

p {
  text-align: center;
}

a {
  color: #007BFF;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

/* Bloc Questions Fréquentes */
.faq-container {
  max-width: 100%;
  margin: 2rem auto;
  padding: 1rem;
  background-color: #f4f4f4;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
}

.faq-item {
  margin: 1rem 0;
}

.faq-question {
  width: 100%;
  padding: 1rem;
  text-align: left;
  background-color: #45A049;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.faq-question:hover {
  background-color: #45a049e0;
}

.faq-answer {
  padding: 1rem;
  background-color: #f1f1f1;
  border-radius: 4px;
  margin-top: 0.5rem;
}
</style>
