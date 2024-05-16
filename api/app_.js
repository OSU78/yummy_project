import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import dotenv from "dotenv";

import Pastry from "./models/pastries.mjs";
import User from "./models/users.mjs";
import Winner from "./models/winners.mjs";

dotenv.config();

// Configuration de l'application
const app = express();
const port = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'dqjdkljiodajoaelkjalkdlqkjdqlqd';

// Middlewares
app.use(cors());
app.use(express.json());

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/yams_db', {})
  .then(() => {
    console.log('🥭 Connexion à MongoDB réussie');
  })
  .catch((error) => {
    console.error('❌ Erreur de connexion à MongoDB :', error);
  });

// Fonction pour hasher les mots de passe
async function hashPassword(password) {
  try {
    const hashedPassword = await argon2.hash(password);
    return hashedPassword;
  } catch (err) {
    console.error('🔐 Erreur lors du hachage du mot de passe:', err);
    throw err;
  }
}

// Route de création d'utilisateur (inscription)
app.post('/registration', async (req, res) => {
  console.log('📨 Données reçues pour inscription:', req.body);

  try {
    const { name, email, password } = req.body;

    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      chanceRestant: 3,
    });

    console.log('✅ Utilisateur créé:', newUser);

    res.json({ status: 'ok' });
  } catch (error) {
    console.error('❌ Erreur lors de l\'inscription:', error);
    res.json({ status: 'error', error: error.message });
  }
});

// Route de connexion d'utilisateur (login)
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      console.log('🚫 Utilisateur non trouvé pour l\'email:', email);
      return res.json({ status: 'error', user: false, message: 'user does not exist' });
    }

    console.log('🔍 Utilisateur trouvé:', user);

    const passwordMatch = await argon2.verify(user.password, password);
    console.log('🔑 Vérification du mot de passe:', passwordMatch);

    if (passwordMatch) {
      const token = jwt.sign(
        {
          name: user.name,
          email: user.email,
        },
        JWT_SECRET
      );

      console.log('🔐 Token généré:', token);
      return res.json({ status: 'ok', user: token, username: user.name });
    } else {
      console.log('❌ Les mots de passe ne correspondent pas pour l\'email:', email);
      return res.json({ status: 'error', user: false, message: 'passwords are not matching' });
    }
  } catch (error) {
    console.error('❌ Erreur lors de la connexion:', error);
    return res.json({ status: 'error', error: error.message });
  }
});






// PASTRIES
app.get("/pastries", async (req, res) => {
  try {
      const allPastries = await Pastry.find();
      console.log("📋 Réception de la liste des pâtisseries");
      res.json(allPastries);
  } catch (err) {
      console.error("⚠️ Erreur :", err);
      res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des pâtisseries" });
  }
});

app.get("/pastries-left", async (req, res) => {
  try {
      const pastriesList = await Pastry.find();
      let totalStock = 0;
      pastriesList.forEach(pastry => {
          totalStock += pastry.stock;
      });
      console.log("🛒 Pâtisseries restantes :", totalStock);
      res.json(totalStock.toString());
  } catch (err) {
      console.error("⚠️ Erreur :", err);
      res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des pâtisseries" });
  }
});

app.get("/pastries-img", async (req, res) => {
  try {
      const pastriesList = await Pastry.find();
      const images = pastriesList.map(pastry => pastry.image);
      console.log("🖼️ Liste des images des pâtisseries");
      res.json(images);
  } catch (err) {
      console.error("⚠️ Erreur :", err);
      res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des pâtisseries" });
  }
});

// DICE GAME LOGIC

function getRandomNumber() {
  console.log("🎲 Générer un nombre aléatoire");
  return Math.floor(Math.random() * 6) + 1;
}

function hasTwoPairs(dices) {
  const counts = {};
  for (const dice of dices) {
      counts[dice] = (counts[dice] || 0) + 1;
  }
  let pairCount = 0;
  for (const value of Object.values(counts)) {
      if (value === 2) pairCount++;
  }
  console.log("👀 Deux paires ?", pairCount === 2);
  return pairCount === 2;
}

function hasFourOfAKind(dices) {
  const fourCount = dices.filter(dice => dice === dices[0]).length;
  console.log("👀 Quatre identiques ?", fourCount === 4);
  return fourCount === 4;
}

function hasFiveOfAKind(dices) {
  const allEqual = dices.every(dice => dice === dices[0]);
  console.log("👀 Cinq identiques ?", allEqual);
  return allEqual;
}

function calculatePastriesWon(dices) {
  if (hasFiveOfAKind(dices)) return 3;
  if (hasFourOfAKind(dices)) return 2;
  if (hasTwoPairs(dices)) return 1;
  return 0;
}

app.get("/chances-left/:email", async (req, res) => {
  try {
      const user = await User.findOne({ email: req.params.email });
      console.log("🔍 Utilisateur trouvé :", user);
      const chanceRestant = user ? user.chanceRestant : 0;
      console.log("🎯 Chances restantes :", chanceRestant);
      res.json(chanceRestant.toString());
  } catch (err) {
      console.error("⚠️ Erreur :", err);
      res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des chances restantes" });
  }
});

app.post("/rolling-dices", async (req, res) => {
  let dices = [
      4, 4, 4, 4, getRandomNumber()
  ];
  console.log("🎲 Lancer de dés :", dices);

  const token = req.headers["x-access-token"];
  try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const email = decoded.email;
      const user = await User.findOne({ email: email });

      if (user) {
          let wonPastries = calculatePastriesWon(dices);
          if (user.chanceRestant <= 0) {
              dices = [0, 0, 0, 0, 0];
              return res.json({ status: "error", error: "No more chances. The dices have been rolled 3 times", chanceRestant: user.chanceRestant, dices: dices, numberOfPastriesWon: wonPastries });
          }

          user.chanceRestant -= 1;
          await user.save();
          console.log("🎉 Nombre de pâtisseries gagnées :", wonPastries);
          return res.json({ dices: dices, chanceRestant: user.chanceRestant, numberOfPastriesWon: wonPastries });
      } else {
          throw new Error("User not found");
      }
  } catch (error) {
      console.error("⚠️ Erreur :", error);
      return res.status(500).json({ status: "error", error: "Invalid token or user not found" });
  }
});

app.get("/pastries-left-to-win", async (req, res) => {
  try {
      const availablePastries = await Pastry.find({ stock: { $gt: 0 } });
      console.log("🏆 Pâtisseries restantes à gagner :");
      res.json(availablePastries);
  } catch (err) {
      console.error("⚠️ Erreur :", err);
      res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des pâtisseries" });
  }
});

app.post("/choose-pastries", async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const email = decoded.email;
      const user = await User.findOne({ email: email });

      if (user) {
          const winnerData = await Winner.create({
              userName: user.name,
              date: req.body.winningDate,
              numberOfPastriesWon: req.body.numberOfPastriesWon,
              pastries: req.body.pastriesChoosed
          });

          const chosenPastries = req.body.pastriesChoosed;
          console.log("🍰 Pâtisseries choisies :", chosenPastries);
          await Promise.all(chosenPastries.map(async (pastry) => {
              await Pastry.findOneAndUpdate(
                  { name: pastry.name, stock: { $gt: 0 } },
                  { $inc: { quantityWon: 1, stock: -1 } }
              );
          }));
          res.json({ status: "ok" });
      } else {
          throw new Error("User not found");
      }
  } catch (err) {
      console.error("⚠️ Erreur :", err);
      return res.status(500).json({ status: "error", error: "Invalid token or user not found" });
  }
});

// WINNERS
app.get("/winners", async (req, res) => {
  try {
      const winnersList = await Winner.find();
      console.log("🏆 Liste des gagnants");
      res.json(winnersList);
  } catch (err) {
      console.error("⚠️ Erreur :", err);
      res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des winners" });
  }
});

app.listen(port, () => console.log(`🚀 App démarrée sur http://localhost:${port}`));