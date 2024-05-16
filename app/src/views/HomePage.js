import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import s from "./../css/home.module.css";

const HomePage = () => {
  const navigate = useNavigate();

  function register() {
    navigate("/register");
  }

  function play() {
    navigate("/yummy-game");
  }

  function GoWinnersPage() {
    navigate("/yummy_game_winners");
  }

  const [pictures, setPictures] = useState([]);
  const [isTheGameOver, setIsTheGameOver] = useState();
  const [isUserConnected, setIsUserConnected] = useState();

  useEffect(() => {
    fetch("http://localhost:3001/pastries-img")
      .then((res) => res.json())
      .then((result) => {
        setPictures(result);
      });

    fetch("http://localhost:3001/pastries-left")
      .then((res) => res.json())
      .then((pastriesLeft) => {
        if (pastriesLeft > 0) {
          setIsTheGameOver(false);
        } else {
          setIsTheGameOver(true);
        }
      });

    if (localStorage.hasOwnProperty("token")) {
      setIsUserConnected(true);
    } else {
      setIsUserConnected(false);
    }
  }, []);

  return (
    <div>
      {isTheGameOver ? (
        <div className={s.game_over}>
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            width: "100%",
           
            padding: "20px",
            borderRadius: "10px",
           
            textAlign: "center"
          
          }}>
          <svg 
          style={{
            opacity: "0.2",
          }}
          xmlns="http://www.w3.org/2000/svg" width="114" height="114" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-dices"><rect width="12" height="12" x="2" y="10" rx="2" ry="2"/><path d="m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6"/><path d="M6 18h.01"/><path d="M10 14h.01"/><path d="M15 6h.01"/><path d="M18 9h.01"/></svg>
          <h1> Tous les gâteaux ont été gagnés ! 🧚‍♂️</h1>
          <button onClick={GoWinnersPage}>Voir les gagnants</button>
          </div>
          
        </div>
      ) : (
        <div className={s.container}>
            <div
            style={{
                position: "absolute",
               
                opacity: "1",
                height: "90vh",
                width: "100%",
                zIndex: 122,
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
                overflow: "hidden",
                
                
            }}
            >
          <h1>Yummy Yams</h1>
          <p>Joue et tente de gagner des pâtisseries !</p>
          {isUserConnected ? (
            <div className={s.buttons}>
              <button onClick={play}>Jouer</button>
            </div>
          ) : (
            <div className={s.connexion}>
              <p>Pour jouer, connecte-toi 🚀</p>
              <div className={s.buttons}>
                <button onClick={register}>Créer un compte</button>
              </div>
            </div>
          )}
          </div>
          <div
          style={{
            position: "absolute",
            transform: "scale(2)",
            opacity: "0.2",
            height: "90vh",
            width: "100%",
            zIndex: 1,
            pointerEvents: "none",
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            
          }}>
          {pictures.length > 0 && (
            <div className={s.img_caroussel}>
              
              {pictures.map((item, index) => (
                <img
                  key={index}
                  src={`/images/pastries/${item}`}
                  alt={item}
                />
              ))}
            </div>
          )}
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;