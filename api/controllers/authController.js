//-----------//
// Fichier controllers/authController.js
//-----------//
import jwt from "jsonwebtoken";
import User from "../models/users.mjs";
import { hashPassword } from "../FonctionUtilitaires/hash.js";
import argon2 from "argon2";

const JWT_SECRET = process.env.JWT_SECRET || "dqjdkljiodajoaelkjalkdlqkjdqlqd";

export async function register(req, res) {
  console.log("📨 Données reçues pour inscription:", req.body);
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      chanceRestant: 3,
    });

    console.log("✅ Utilisateur créé:", newUser);
    res.json({ status: "ok" });
  } catch (error) {
    console.error("❌ Erreur lors de l'inscription:", error);
    res.json({ status: "error", error: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      console.log("🚫 Utilisateur non trouvé pour l'email:", email);
      return res.json({
        status: "error",
        user: false,
        message: "user does not exist",
      });
    }

    console.log("🔍 Utilisateur trouvé:", user);

    const passwordMatch = await argon2.verify(user.password, password);
    console.log("🔑 Vérification du mot de passe:", passwordMatch);

    if (passwordMatch) {
      const token = jwt.sign(
        {
          name: user.name,
          email: user.email,
        },
        JWT_SECRET
      );

      console.log("🔐 Token généré:", token);
      return res.json({ status: "ok", user: token, username: user.name });
    } else {
      console.log(
        "❌ Les mots de passe ne correspondent pas pour l'email:",
        email
      );
      return res.json({
        status: "error",
        user: false,
        message: "passwords are not matching",
      });
    }
  } catch (error) {
    console.error("❌ Erreur lors de la connexion:", error);
    return res.json({ status: "error", error: error.message });
  }
}
