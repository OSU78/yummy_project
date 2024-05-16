import React, { useState, useEffect } from 'react';
import s from './../css/winners.module.css';

function getRelativeTime(dateTime) {
  const now = Date.now();
  const givenTime = new Date(dateTime).getTime();
  const differenceInMinutes = Math.floor((now - givenTime) / 55000);

  if (differenceInMinutes < 60) {
    return `il y a ${differenceInMinutes} min`;
  } else if (differenceInMinutes < 120) {
    return `il y a ${Math.floor(differenceInMinutes / 60)} heure`;
  } else {
    const dateObj = new Date(givenTime);
    const options = { weekday: 'long', hour: '2-digit', minute: '2-digit' };
    return `${dateObj.toLocaleDateString('fr-FR', options)} à ${dateObj.getHours()}:${dateObj.getMinutes().toString().padStart(2, '0')}`;
  }
}

export const WinnersPage = () => {
  const [winnerList, updateWinnerList] = useState([]);

  useEffect(() => {
    // 🌐 Fetch les gagnants depuis l'API
    fetch("http://localhost:3001/winners")
      .then(res => res.json())
      .then((result) => {
        updateWinnerList(result);
      });
  }, []);

  return (
    <div className={s.main}>
      <h1 style={{ marginTop: '5px' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-award">
          <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/>
          <circle cx="12" cy="8" r="6"/>
        </svg> Liste des Gagnants
      </h1>
      {winnerList.length > 0 && (
        <div className={s.winners}>
          <div className={`${s.winner_card} ${s.winner_title}`}>
            <p>Gagnant</p>
            <p>Date et Heure</p>
            <p>Nombre de Pâtisseries</p>
          </div>
          {winnerList.map((item) => (
            <div key={item.id} className={`${s.winner_card} ${s.winner_card_only}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '15px' }}>
                <img
                  style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                  src={`https://api.dicebear.com/8.x/adventurer-neutral/svg?seed=${item.userName}`} alt={item.userName} />
                {item.userName}</div>
              <p>{getRelativeTime(item.date)}</p>
              <p style={{
                display: 'flex',
                alignItems: 'right',
                textAlign: 'right',
                justifyContent: 'flex-end',
                gap: '5px',
                fontSize: '1.8rem',
                fontWeight: 'bold',
                color : "#F73C8D",
              }}>{item.numberOfPastriesWon}
              <svg
                style={{ stroke: "#F73C8D" }}
                xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cake-slice">
                <circle cx="9" cy="7" r="2"/>
                <path d="M7.2 7.9 3 11v9c0 .6.4 1 1 1h16c.6 0 1-.4 1-1v-9c0-2-3-6-7-8l-3.6 2.6"/>
                <path d="M16 13H3"/>
                <path d="M16 17H3"/>
              </svg>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WinnersPage;