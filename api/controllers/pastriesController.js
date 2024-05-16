//-----------//
// fichier controller/pastriesController.js
//-----------//
import Pastry from "../models/pastries.mjs";

export async function getAllPastries(req, res) {
  try {
    const allPastries = await Pastry.find();
    console.log("📋 Réception de la liste des pâtisseries");
    res.json(allPastries);
  } catch (err) {
    console.error("⚠️ Erreur :", err);
    res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des pâtisseries" });
  }
}

export async function getPastriesStock(req, res) {
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
}

export async function getPastryImages(req, res) {
  try {
    const pastriesList = await Pastry.find();
    const images = pastriesList.map(pastry => pastry.image);
    console.log("🖼️ Liste des images des pâtisseries");
    res.json(images);
  } catch (err) {
    console.error("⚠️ Erreur :", err);
    res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des pâtisseries" });
  }
}