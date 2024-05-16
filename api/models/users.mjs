//-----------//
// Fichier models/users.mjs
//-----------//
import mongoose from "mongoose"

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        chanceRestant: { type: Number, required: true },
    },
    { collection: 'users' }
)

const User = mongoose.model('users', UserSchema)

export default User;