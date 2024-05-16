import React from "react"
import { Routes, Route, BrowserRouter } from "react-router-dom"
import HomePage from "./views/HomePage"
import Login from "./views/Login"
import Register from "./views/Register"
import YumsGames from "./views/YumsGames/YumsGames"
import ChoosePastries from "./views/ChoosePastries"
import WinnersPage from "./views/WinnersPage"
import Header from "./views/Header"
import toast, { Toaster } from 'react-hot-toast';

import styles from './App.module.css';

const App = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            height: '100vh',
            width: '100vw',
          
        
         
        
        }}>
             
             <div className={styles.apple_style}>
                <span></span>
                <span></span>
                <span></span>
             </div>
            <Toaster
            style={{
                position: 'fixed',
                top: '120px',
                right: '20px',
                zIndex: 122,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                padding: '10px',
                borderRadius: '10px',
                backgroundColor: '#fff',
                color: '#000',
                boxShadow: '0 0 10px rgba(0,0,0,0.2)',
                backdropFilter: 'blur(5px)',
            }}
            />
            
            
            <Header />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/yummy-game" element={<YumsGames />} />
                    <Route path="/choose-pastries" element={<ChoosePastries />} />
                    <Route path="/yummy_game_winners" element={<WinnersPage />} />
                </Routes>   
            </BrowserRouter>
            
        </div>
    )
}

export default App