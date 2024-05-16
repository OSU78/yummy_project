import React, { useEffect } from "react";
import s from './../css/header.module.css';
import { useDispatch, useSelector } from "react-redux";
import { deleteUser } from "./../redux/features/User"


const Header = () => {
    const userInfo = useSelector((state) => state.user.value)
    useEffect(() => {
        console.log("User Info : ", userInfo)
    }, [userInfo])
    const dispatch = useDispatch();
   
   

    function deconnexion() {
        localStorage.removeItem('token')
        const email = localStorage.getItem('email')
        dispatch(deleteUser({ email: email }))
        window.location.href = '/'
    }
    function GoWinnersPage() {
        window.location.href = '/yummy_game_winners'
        
    }

    return(
        <div className={s.headerNavBar}>
                <div 
                className={s.headerLogo}
              >
                    <img onClick={()=>{ window.location.href = '/'}} src="/images/logo_yum.png" alt="croissant" style={{
                        
                        width : "180px",
                        height : "47px"
                    }} />
                    <a 
                    className={s.gitlink}
                    target = "_blank"
                    href="https://github.com/OSU78"
                   >


                    <span style={{
                        fontSize : "15px",
                        marginLeft : "5px",
                        
                        color : "#644653",
                        opacity : "0.5"
                    }}> x @OSU</span>
                    <svg style={{
                        marginTop : "0px",
                        marginLeft : "5px",
                        stroke : "#644653",
                        transform : "translateY(2px)"
                    }} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                    </a>
                   

                 </div>

               
               <div
               style={{
                     display : "flex",
                     justifyContent : "center",
                     alignItems : "center",
                    gap : "20px",
                

               }}
               >

               <a className="link_color" onClick={GoWinnersPage}
                   >Voir les gagnants 
                   <svg 
                   style={{
                    stroke : " rgb(248 54 120)",
                   }}
                   xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-crown"><path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/></svg>
                   </a>


                   {userInfo != null && (
                    <div
                    style={{
                        display : "flex",
                        alignItems : "center",
                        gap : "5px",
                        cursor : "pointer",
                        color : "#644653",
                        fontWeight : "bold",
                        border : "1px solid #6446534A",
                        padding : "2px",
                        position : "fixed",
                        
                        bottom : "44px",
                        paddingLeft : "18px",
                        paddingRight : "4px",
                        paddingTop : "4px",
                        paddingBottom : "4px",
                        borderRadius : "50px",
                        backgroundColor : "#fff",
                    
                    }}
                    >
                        <p style={{
                            textTransform : "capitalize",
                        
                        }}>
                         {userInfo?.username}
                         </p>

                         <p style={{
                            position : "absolute",
                            top : "-34px",
                            right : "10px",
                            backdropFilter : "blur(5px)",
                            display : "flex",
                            justifyContent : "center",
                            alignItems : "center",
                            minWidth : "70px",
                           
                            minHeight : "20px",
                            fontSize : "18px",
                            fontWeight : "bold",
                            color : "rgb(109 92 100)",
                            marginLeft : "15px",
                            backgroundColor : "rgb(248 54 120 / 21%)",
                            outline : "1px solid #F73C8D",
                            padding : "2px",
                            borderRadius : "50px",
                            gap : "5px",
                         }}>
                            <svg style={{
                                marginLeft : "5px",
                                stroke : "#F73C8D",
                            }} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-dice-4"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M16 8h.01"/><path d="M8 8h.01"/><path d="M8 16h.01"/><path d="M16 16h.01"/></svg>
                            {userInfo?.chancesRestantes} 
                            <span
                            style={{
                                fontSize : "12px",
                                fontWeight : "normal",
                                marginLeft : "0px",
                                marginRight : "5px",
                            
                            }}
                            >{
                                userInfo?.chancesRestantes > 1 ? "chances" : "chance"
                            }</span>
                         </p>
                   
                     <img 
                     style={{
                       width: '45px',
                       height: '45px',
                       borderRadius: '50%',
                       marginTop : "0px"
                     }}
                     src={`https://api.dicebear.com/8.x/adventurer-neutral/svg?seed=${userInfo?.username}`} alt={userInfo?.username} />
                     </div>
                    )}
                   {userInfo == null && (
                    <button
                    onClick={() => window.location.href = '/login'}
                    >Se connecter

                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-user"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/></svg>
                    </button>
                )}


            {userInfo != null && (
                <button className={s.deconnexion} onClick={deconnexion}>Deconnexion
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                </button>
            )}


               </div>


               
            



        </div>
    );
}

export default Header;