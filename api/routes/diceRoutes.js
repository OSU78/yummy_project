//-----------//
// Fichier routes/diceRoutes.js
//-----------//

import express from "express";
import { obtenirChancesRestantes, lancerDes, obtenirPatisseriesRestantAGagner, choisirPatisseries } from "../controllers/diceController.js";

const router = express.Router();

router.get("/chances-left/:email", obtenirChancesRestantes);
router.post("/rolling-dices", lancerDes);
router.get("/pastries-left-to-win", obtenirPatisseriesRestantAGagner);
router.post("/choose-pastries", choisirPatisseries);

export default router;