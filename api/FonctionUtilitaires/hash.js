//-----------//
// FIchier FonctionUtilitaires/hash.js  
//-----------//

import argon2 from "argon2";

export async function hashPassword(password) {
  try {
    console.log(" ")
    console.log(" ")
    console.log('🔐 Hachage du mot de passe...');
    const hashedPassword = await argon2.hash(password);
    console.log('🔑 Mot de passe haché:', hashedPassword )
    console.log(" ")
    console.log(" ")
    return hashedPassword;
  } catch (err) {
    console.error('🔐 Erreur lors du hachage du mot de passe:', err);
    throw err;
  }
}