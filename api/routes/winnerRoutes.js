//-----------//
// Fichier routes/winnerRoutes.js
//-----------//

import express from "express";
import { getWinners } from "../controllers/winnerController.js";

const router = express.Router();

router.get("/winners", getWinners);

export default router;