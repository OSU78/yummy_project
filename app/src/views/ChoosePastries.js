import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../redux/features/User';
import { motion } from 'framer-motion';
import s from './../css/choosePastries.module.css';
import { toast } from 'react-hot-toast';
function ChoosePastries() {
  const userInfo = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    //verifier si userinfos est null ou vide et rediriger vers la page d'accueil
    if (userInfo === null) {
        navigate('/');
    }
    }, [userInfo]);

  const [warningMessage, setWarningMessage] = useState('');
  const [pastries, setPastries] = useState([]);
  const [patisseriesChoisies, setPatisseriesChoisies] = useState([]);

  useEffect(() => {
    dispatch(updateUser({ field: 'numberOfPastriesChooseable', value: userInfo?.nombreDePatisseriesGagnees }));

    fetch("http://localhost:3001/pastries-left-to-win")
      .then(res => res.json())
      .then((stock) => {
        if (stock.length < userInfo?.nombreDePatisseriesGagnees) {
          dispatch(updateUser({ field: 'nombreDePatisseriesGagnees', value: stock.length }));
        }
        setPastries(stock);
      });
  }, []);

  function addSelectedPastry(item) {
    let numberOfPastriesChooseable = userInfo.numberOfPastriesChooseable;

    if (numberOfPastriesChooseable > 0) {
      const updatedPastries = pastries.map(p => {
        return p.image === item.image ? { ...p, stock: p.stock - 1 } : p;
      }).filter(p => p.stock > 0);

      setPastries(updatedPastries);
      setPatisseriesChoisies([...patisseriesChoisies, item]);

      numberOfPastriesChooseable--;
      dispatch(updateUser({ field: 'numberOfPastriesChooseable', value: numberOfPastriesChooseable }));
    } else {
      setWarningMessage("Tu ne peux pas choisir plus que " + userInfo?.nombreDePatisseriesGagnees);
    }
  }

  function confirmSelection(patisseriesChoisies) {
    setWarningMessage("");
    if (patisseriesChoisies.length < userInfo?.nombreDePatisseriesGagnees) {
      setWarningMessage("tu peux encore en choisir " + (userInfo?.nombreDePatisseriesGagnees - patisseriesChoisies.length));
    } else {
      fetch("http://localhost:3001/choose-pastries", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem('token'),
        },
        body: JSON.stringify({
          patisseriesChoisies: patisseriesChoisies,
          dateDeGain: userInfo.dateDeGain,
          numberOfPastriesWon: patisseriesChoisies.length,
        }),
      });
      dispatch(updateUser({ field: 'numberOfPastriesChooseable', value: 0 }));
      toast.success('Choix enregistré !');
      setTimeout(() => {
        navigate('/yummy_game_winners');
      }, 1000);
      
    }
  }

  return (
    <div className={s.main}>
        <div>
      <p>Bravo !! Tu peux choisir {userInfo?.nombreDePatisseriesGagnees} pâtisseries.</p>
      {pastries.length > 0 && (
        <div className={s.pastries_container}>
          {pastries.map((item) => (
            <motion.div
              key={item.image}
              className={s.pastry_item}
              onClick={() => addSelectedPastry(item)}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
                   <span style={{
                position: 'absolute',
                top: 0,
                right: 0,
                padding: '5px',
                paddingLeft: '10px',
                paddingRight: '10px',
                backgroundColor: 'rgb(230, 41, 104)',
                color: 'white',
                fontSize: '1.2em',
                borderRadius: '0 0 0 15px',
                
            }} >{item.stock}</span>
              <img src={`/images/pastries/${item.image}`} alt={item.image} />
            </motion.div>
          ))}
        </div>
      )}
      </div>


      <div>
      <p className={s.warning_message}>{warningMessage}</p>
      <p
      style={{
        opacity: `${patisseriesChoisies.length > 0 ? 1 : 0.1}`
      }}
      >Pâtisseries choisies </p>

      {patisseriesChoisies.length === 0 && (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '87%',
            opacity: 0.1,
        }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="114" height="114" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-rainbow"><path d="M22 17a10 10 0 0 0-20 0"/><path d="M6 17a6 6 0 0 1 12 0"/><path d="M10 17a2 2 0 0 1 4 0"/></svg>
        </div>
      )}
      <div className={s.pastries_choosed}>
        {patisseriesChoisies.map((item, index) => (
          <motion.div
            key={index}
            className={s.pastry_item}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
         
            <img src={`/images/pastries/${item.image}`} alt={item.image} />
          </motion.div>
        ))}
      </div>
      {patisseriesChoisies.length > 0 && (
        <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
      <button 
      style={{
        fontSize: '1.5em',
      }}
      onClick={() => confirmSelection(patisseriesChoisies)}>
        Prendre
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cake-slice"><circle cx="9" cy="7" r="2"/><path d="M7.2 7.9 3 11v9c0 .6.4 1 1 1h16c.6 0 1-.4 1-1v-9c0-2-3-6-7-8l-3.6 2.6"/><path d="M16 13H3"/><path d="M16 17H3"/></svg>
         </button>

    </motion.div>
         )}
      </div>


    </div>

  );
}

export default ChoosePastries;