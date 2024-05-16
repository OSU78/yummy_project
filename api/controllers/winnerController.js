//-----------//
//Fichier controllers/winnerController.js
//-----------//
import Winner from "../models/winners.mjs";

export async function getWinners(req, res) {
  try {
    const winnersList = await Winner.find();
    console.log("🏆 Liste des gagnants");
    res.json(winnersList);
  } catch (err) {
    console.error("⚠️ Erreur :", err);
    res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des winners" });
  }
}