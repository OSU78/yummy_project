//-----------//
// Fichier routes/pastryRoutes.js
//-----------//

import express from "express";
import { getAllPastries, getPastriesStock, getPastryImages } from "../controllers/pastriesController.js";

const router = express.Router();

router.get("/pastries", getAllPastries);
router.get("/pastries-left", getPastriesStock);
router.get("/pastries-img", getPastryImages);

export default router;