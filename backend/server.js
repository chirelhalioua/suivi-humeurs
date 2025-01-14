const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const humeursRoutes = require('./routes/humeursRoutes');
const listEndpoints = require('express-list-endpoints');
const authRoutes = require('./routes/authRoutes');
const humeursUserRoute = require('./routes/humeursUser');

// Charger les variables d'environnement
dotenv.config();
console.log(process.env.MONGODB_URI);  // Cela devrait afficher l'URL de MongoDB si elle est définie correctement


// Initialisation de l'application
const app = express();

// Middleware
app.use(cors({
  origin: 'https://v0-les-humeurs-a-la-funes-r6iajjhqxy3.vercel.app/', //
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Liste des méthodes autorisées
}));app.use(express.json()); // Parse les requêtes JSON
app.use(express.urlencoded({ extended: true })); // Parse les données URL-encoded

// Connexion à MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { // Utilisation de la variable d'environnement pour la chaîne de connexion
      useNewUrlParser: true,
    });
    console.log('MongoDB connecté');
  } catch (error) {
    console.error('Erreur de connexion à MongoDB', error);
    process.exit(1); // Arrêter le serveur si la connexion échoue
  }
};

connectDB();  // Appel de la fonction pour connecter la base de données

// Définir les routes
app.use('/api/auth', authRoutes); // Route pour l'authentification
app.use('/api', humeursUserRoute); // Route pour les humeurs de l'utilisateur
app.use('/api/humeurs', humeursRoutes); // Route pour les humeurs en général

// Afficher toutes les routes disponibles (uniquement en développement)
if (process.env.NODE_ENV !== 'production') {
  console.log('Routes disponibles :');
  console.log(listEndpoints(app));
}

// Route d'accueil par défaut
app.get('/', (req, res) => {
  res.send('Bienvenue sur le backend des humeurs à la Funès!');
});

// Middleware global pour gérer les erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erreur interne du serveur.' });
});

// Démarrer le serveur
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
