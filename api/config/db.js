//db.js
// db connection file
import mongoose from 'mongoose';

export function initConnectDB() {
  mongoose.connect('mongodb://localhost:27017/yams_db', {})
    .then(() => {
        console.log(" ")
        console.log('✅ Connexion à MongoDB réussie');
        console.log(" ")
    })
    .catch((error) => {
        console.error('❌ Erreur de connexion à MongoDB 😧 :', error);
    });
}


// faire une fonction qui se connect à la db et supprime tout les données

export async function clearDB() {
    try {
        await mongoose.connection.dropDatabase();
        console.log(" ")
        console.log('✅ Base de données vidée');
        console.log(" ")
    } catch (error) {
        console.error('❌ Erreur lors de la suppression de la base de données 😧 :', error);
    }
    }

clearDB(); // appel de la fonction pour vider la base de données    