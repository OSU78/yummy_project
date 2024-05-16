//-----------//
// Fichier principal de mon API Yummy-yams : api/app.js
//-----------//

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initConnectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import pastryRoutes from "./routes/pastryRoutes.js";
import diceRoutes from "./routes/diceRoutes.js";
import winnerRoutes from "./routes/winnerRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

initConnectDB(); // Connexion à MongoDB

// Routes pour l'authentification, les pâtisseries, les dés et les gagnants
app.use(authRoutes);
app.use(pastryRoutes);
app.use(diceRoutes);
app.use(winnerRoutes);

app.listen(port, () => console.log(`💚 -> App démarrée sur http://localhost:${port}`));