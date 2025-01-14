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

// Initialisation de l'application
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connexion à MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connecté');
  } catch (error) {
    console.error('Erreur de connexion à MongoDB', error);
    process.exit(1);
  }
};

connectDB();  // Appel de la fonction pour connecter la base de données

// Définir les routes
app.use('/api/auth', authRoutes);
app.use('/api', humeursUserRoute); 
app.use('/api/humeurs', humeursRoutes);

// Afficher toutes les routes disponibles
console.log('Routes disponibles :');
console.log(listEndpoints(app));

// Démarrer le serveur
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});

// Middleware global pour gérer les erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erreur interne du serveur.' });
});

// Route d'accueil par défaut
app.get('/', (req, res) => {
  res.send('Bienvenue sur le backend des humeurs à la Funès!');
});

