import { useState } from 'react';
import s from './../css/connexion.module.css';
import { useDispatch } from "react-redux";
import { addUser } from '../redux/features/User';
import { toast } from 'react-hot-toast';

const Login = () => {
  
  const dispatch = useDispatch()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')


  async function loginUser(event) {
    event.preventDefault()
    const response = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      }),
    })

    const data = await response.json()

    if (data.user) {
      localStorage.setItem('token', data.user)
      dispatch(addUser({ email, username: data.username, token: data.user }))
      toast.success('Connexion réussie')
      window.location.href = '/yummy-game'
    } else {
      toast.error('Veuillez vérifier votre nom d\'utilisateur et votre mot de passe')
    }
    console.log(data)
  }

  return (
    <div className={s.main}>
      <form onSubmit={loginUser}>
        <h1 className={s.title}>Connexion</h1>
        
        <div className={s.inputContainer}>
          <input
            className={s.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            required
          />
        </div>
        <div className={s.inputContainer}>
          <input
            className={s.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Mot de passe"
            required
          />
        </div>
        <button className={s.submitButton} type="submit">Se connecter</button>
        <a className={s.registerLink} href="/register">Créer un compte</a>
      </form>
    </div>
  );
}

export default Login;