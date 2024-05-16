import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { updateUser, deleteUser } from '../../../redux/features/User';
import { decodeToken, isExpired } from "react-jwt";
import Dice from "./Dice";
import s from '../../../css/yummyGame.module.css';
import gsap from "gsap";

const DiceGame = () => {
    const userInfo = useSelector((state) => state.user.value);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    let token = '';

    if (userInfo != null) {
        token = userInfo.token;
    } else {
        token = null;
        window.location.href = '/';
    }
    const [canPlay, setCanPlay] = useState(true);
    const [playerName, updatePlayerName] = useState('');
    const [diceValues, updateDiceValues] = useState([0, 0, 0, 0, 0]);
    const [statusMessage, updateStatusMessage] = useState('');
    const [isPlayButtonVisible, setPlayButtonVisibility] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            let isTokenExpired = isExpired(token);
            let user = await decodeToken(token);
            if (!user) {
                dispatch(deleteUser());
            } else {
                updatePlayerName(user.name);
                fetchRemainingTries(user.email);
            }
        };
        fetchData();
    }, []);

    async function fetchRemainingTries(email) {
        try {
            const response = await fetch(`http://localhost:3001/chances-left/${email}`, {
                headers: {
                    'x-access-token': token,
                }
            });
            if (response.ok) {
                const data = await response.json();
                dispatch(updateUser({ field: 'chancesRestantes', value: data }));
                if(data <= 0){
                    setCanPlay(false);
                }
                updateStatusMessage(data <= 0 ? 'Tu as déjà lancé les dés 3 fois.' : `👋 Hey ${userInfo.username}. Il te reste ${data} chances pour tenter de remporter des pâtisseries.`);
            } else {
                console.error("Erreur lors de la récupération des chances restantes :", response.statusText);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des chances restantes :", error);
        }
    }

    async function rollDices(event) {
        event.preventDefault();
        const response = await fetch('http://localhost:3001/rolling-dices', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            }
        });

        if (response.ok) {
            const data = await response.json();
            if (data.chancesRestantes === 0) {
                setCanPlay(false);
                console.error("Les dés ne peuvent pas être lancés plus de 3 fois :", data);
            }
            if (data.nombreDePatisseriesGagnees !== 0) {
                setCanPlay(true);
                dispatch(updateUser({ field: 'nombreDePatisseriesGagnees', value: data.nombreDePatisseriesGagnees }));
                dispatch(updateUser({ field: 'dateDeGain', value: new Date() }));
                updateStatusMessage(`GG ✨ Tu as gagné. Tu peux maintenant choisir ${data.nombreDePatisseriesGagnees} pâtisseries`);
                setPlayButtonVisibility(false);
                gsap.to(".yourComponent", { duration: 5, opacity: 0, onComplete: () => {
                    navigate('/choose-pastries');
                }});
            } else {
                setCanPlay(false);
                updateStatusMessage(data.chancesRestantes === 0 ? 'Tu as déjà joué 3 fois ☺️. Ne sois pas trop gourmand ' + userInfo.username : `👋 Hey ${userInfo.username}. Il te reste ${data.chancesRestantes} chance pour tenter de remporter le maximum de pâtisseries.`);
            }
            updateDiceValues(data.des);
        } else {
            const errorResponse = await response.json();
            console.error(errorResponse);
        }
    }

    const renderDiceGroups = (diceValues) => {
        const groups = [
            [0, 1],
            [2],
            [3, 4]
        ];

        return groups.map((group, index) => (
            <div key={index} className={s.dice_group}>
                {group.map(diceIndex => <Dice key={`dice-${diceIndex}`} value={diceValues[diceIndex]} />)}
            </div>
        ));
    }

    return (
        <div className={s.main}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-start', minHeight: '300px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '20px', justifyContent: 'flex-start', alignContent: 'flex-start', textAlign: 'left', width: '40%', marginLeft: '20px' }}>
                    <h1 style={{ margin: "0px", fontSize: "clamp(1.9rem, 5vw, 2.9rem)", display: "flex", alignItems: "center", gap: "10px", justifyContent: "flex-start", alignContent: "center" }}>
                        Gagne des Sucreries !
                        <svg style={{ stroke: "#F73C8D" }} xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-cake-slice">
                            <circle cx="9" cy="7" r="2" />
                            <path d="M7.2 7.9 3 11v9c0 .6.4 1 1 1h16c.6 0 1-.4 1-1v-9c0-2-3-6-7-8l-3.6 2.6" />
                            <path d="M16 13H3" />
                            <path d="M16 17H3" />
                        </svg>
                    </h1>
                    <p>
                        {playerName && statusMessage && <p className={s.msgText}>{statusMessage}</p>}
                    </p>
                    <div className={`${s.actions}`}>
                
                        {isPlayButtonVisible   ? ( <button className={` ${s.play_button} ${canPlay==false ? s.disableButton : "" }`} onClick={(e)=>{
                            if(canPlay==true){
                                rollDices(e)
                            }
                                                        
                            }}>{canPlay ? 'JE TENTE MA CHANCE' : 'JE TENTE MA CHANCE'}
                            </button>) : ("")}
                    </div>
                </div>

                <div style={{ transform: 'scale(1.8) translateX(-55px) translateY(25px)' }}>
                    <div className={s.dice_column}>
                        {renderDiceGroups(diceValues)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DiceGame;