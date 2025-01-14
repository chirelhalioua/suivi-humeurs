const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const humeursRoutes = require('./routes/humeursRoutes');
const listEndpoints = require('express-list-endpoints');
const authRoutes = require('./routes/authRoutes');
const humeursUserRoute = require('./routes/humeursUser'); // 


// Charger les variables d'environnement
dotenv.config();

// Initialisation de l'application
const app = express();

// Middleware
app.use(cors());
// Utiliser express.json() uniquement pour les POST, PUT, PATCH
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connexion à MongoDB réussie');
}).catch((err) => {
  console.error('Erreur de connexion à MongoDB :', err);
});

// Définir les routes
app.use('/api/auth', authRoutes);
app.use('/api', humeursUserRoute);  // Cette ligne est correcte pour votre route /api
// Route pour obtenir une humeur par son ID
app.use('/api/humeurs', require('./routes/humeursRoutes'));
app.use('/api/humeurs', humeursRoutes);  // On utilise ici le préfixe '/api/humeurs' 


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

