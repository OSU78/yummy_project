import { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';

const useTokenExpiration = (token) => {
  const [hasExpired, setHasExpired] = useState(false);

  useEffect(() => {
    const verifyTokenExpiration = () => {
      if (token) {
        const { exp } = jwtDecode(token);
        const currentTimeInSeconds = Math.floor(Date.now() / 1000);

        if (exp < currentTimeInSeconds) {
          setHasExpired(true);
        } else {
          setHasExpired(false);
        }
      }
    };
    console.log("👀 Token expiration check started");
    verifyTokenExpiration();
   

    const checkInterval = setInterval(verifyTokenExpiration, 1000);

    return () => clearInterval(checkInterval);
  }, [token]);

  return { hasExpired };
};

export default useTokenExpiration;