//-----------//
// Fichier controllers/diceController.js
//-----------//
import jwt from "jsonwebtoken";
import User from "../models/users.mjs";
import Pastry from "../models/pastries.mjs";
import Winner from "../models/winners.mjs";


const JWT_SECRET = process.env.JWT_SECRET || 'dqjdkljiodajoaelkjalkdlqkjdqlqd';



function obtenirNombreAleatoire() {
  console.log("🎲 Générer un nombre aléatoire");
  return Math.floor(Math.random() * 6) + 1;
}

function aDeuxPaires(des) {
  const counts = {};
  for (const de of des) {
      counts[de] = (counts[de] || 0) + 1;
  }
  let pairCount = 0;
  for (const value of Object.values(counts)) {
      if (value === 2) pairCount++;
  }
  console.log("👀 Deux paires ?", pairCount === 2);
  return pairCount === 2;
}

function aQuatreIdentiques(des) {
  const fourCount = des.filter(de => de === des[0]).length;
  console.log("👀 Quatre identiques ?", fourCount === 4);
  return fourCount === 4;
}

function aCinqIdentiques(des) {
  const allEqual = des.every(de => de === des[0]);
  console.log("👀 Cinq identiques ?", allEqual);
  return allEqual;
}

function calculerPatisseriesGagnees(des) {
  if (aCinqIdentiques(des)) return 3;
  if (aQuatreIdentiques(des)) return 2;
  if (aDeuxPaires(des)) return 1;
  return 0;
}

export async function obtenirChancesRestantes(req, res) {
  try {
    const user = await User.findOne({ email: req.params.email });
    console.log("🔍 Utilisateur trouvé :", user);
    const chancesRestantes = user ? user.chanceRestant : 0;
    console.log("🎯 Chances restantes :", chancesRestantes);
    res.json(chancesRestantes.toString());
  } catch (err) {
    console.log(" ")
    console.error("⚠️ Erreur :", err);
    res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des chances restantes" });
  }
}

export async function lancerDes(req, res) {
  let des = [4, 4, 4, 4, obtenirNombreAleatoire()];
  console.log("🎲 Lancer de dés :", des);

  const token = req.headers["x-access-token"];
  try {
    const decode = jwt.verify(token, JWT_SECRET);
    const email = decode.email;
    const user = await User.findOne({ email: email });

    if (user) {
      let patisseriesGagnees = calculerPatisseriesGagnees(des);
      if (user.chanceRestant <= 0) {
        des = [0, 0, 0, 0, 0];
        return res.json({ status: "error", error: "Plus de chances. Les dés ont déjà été lancés 3 fois", chanceRestant: user.chanceRestant, des: des, nombreDePatisseriesGagnees: patisseriesGagnees });
      }

      user.chanceRestant -= 1;
      await user.save();
      console.log("🎉 Nombre de pâtisseries gagnées :", patisseriesGagnees);
      return res.json({ des: des, chanceRestant: user.chanceRestant, nombreDePatisseriesGagnees: patisseriesGagnees });
    } else {
      throw new Error("Utilisateur non trouvé");
    }
  } catch (erreur) {
    console.error("⚠️ Erreur :", erreur);
    return res.status(500).json({ status: "error", error: "Token invalide ou utilisateur non trouvé" });
  }
}

export async function obtenirPatisseriesRestantAGagner(req, res) {
  try {
    const patisseriesDisponibles = await Pastry.find({ stock: { $gt: 0 } });
    console.log("🏆 Pâtisseries restantes à gagner :");
    res.json(patisseriesDisponibles);
  } catch (err) {
    console.error("⚠️ Erreur :", err);
    res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des pâtisseries" });
  }
}

export async function choisirPatisseries(req, res) {
  const token = req.headers["x-access-token"];
  try {
    const decode = jwt.verify(token, JWT_SECRET);
    const email = decode.email;
    const user = await User.findOne({ email: email });

    if (user) {
      const donneesGagnant = await Winner.create({
        userName: user.name,
        date: req.body.dateDeGain,
        numberOfPastriesWon: req.body.numberOfPastriesWon,
        patisseries: req.body.patisseriesChoisies
      });

      const patisseriesChoisies = req.body.patisseriesChoisies;
      console.log("🍰 Pâtisseries choisies :", patisseriesChoisies);
      await Promise.all(patisseriesChoisies.map(async (patisserie) => {
        await Pastry.findOneAndUpdate(
          { name: patisserie.name, stock: { $gt: 0 } },
          { $inc: { quantityWon: 1, stock: -1 } }
        );
      }));
      res.json({ status: "ok" });
    } else {
      throw new Error("Utilisateur non trouvé");
    }
  } catch (err) {
    console.error("⚠️ Erreur :", err);
    return res.status(500).json({ status: "error", error: "Token invalide ou utilisateur non trouvé" });
  }
}