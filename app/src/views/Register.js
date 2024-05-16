import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import s from './../css/connexion.module.css';
import { toast } from 'react-hot-toast';



const Register = () => {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  async function registerUser(event) {
    event.preventDefault()
    //verifier si les champs sont vides sinon afficher un message d'erreur avec react hot toast
    if (name === '' || email === '' || password === '') {
      toast.error('Veuillez remplir tous les champs')
      return
    }
    const response = await fetch('http://localhost:3001/registration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        password
      }),
    })

    const data = await response.json()
    if (data.status === 'ok') {
      navigate('/login')
    } else {
      toast('Email déjà enregistré')
    }
    console.log(data)
  }

  return (
    <div className={s.main}>
      <form>
        <h1 className={s.title}>Registrer</h1>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Name"
        />
        
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
        />
       
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
        />
        
        <button className={s.submitButton} onClick={registerUser}>Créer un compte</button>
        Tu as déjà un compte ? <a href="/login">Clic ici 💆</a>
      </form>
    </div>
  );
}

export default Register;
