const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à la base de données
const db = mysql.createConnection({
  host: "localhost",
  user: "root",         // à adapter selon ton installation MySQL
  password: "",         // mot de passe MySQL (souvent vide en local)
  database: "app",
});

db.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à la base de données :", err);
  } else {
    console.log("✅ Connecté à la base de données MySQL.");
  }
});

// Test simple
app.get("/api/message", (req, res) => {
  res.json({ message: "Bonjour depuis le backend Node.js !" });
});

// ➕ Exemple de route pour récupérer un utilisateur
app.get("/api/user/:id", (req, res) => {
  const userId = req.params.id;
  db.query("SELECT * FROM users WHERE id = ?", [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Erreur SQL" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }
    res.json(results[0]);
  });
});

// 🔁 Exemple de route pour mettre à jour un utilisateur
app.put("/api/user/:id", (req, res) => {
  const userId = req.params.id;
  const { name, email, country, phoneNumber, language, profilePic } = req.body;

  const sql = `
    UPDATE users SET name = ?, email = ?, country = ?, phoneNumber = ?, language = ?, profilePic = ?
    WHERE id = ?
  `;
  const values = [name, email, country, phoneNumber, language, profilePic, userId];

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Erreur lors de la mise à jour" });
    }
    res.json({ message: "Profil mis à jour avec succès" });
  });
});

// Lancement du serveur
app.listen(port, () => {
  console.log(`🚀 Serveur backend écoute sur http://localhost:${port}`);
});
