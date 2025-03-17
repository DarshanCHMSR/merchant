
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Loading from '../../assets/Loading_01.json'
import Lottie from 'lottie-react'


export const Auth_Spinner = (path = 'login') => {

    const navigate = useNavigate();
    const location = useLocation();

    const [count, setCount] = useState(2)

    useEffect(() => {
        const intervel = setInterval(() => {
            setCount((prevValue) => --prevValue)
          }, 1000);
    
          count === 0 && navigate(`/login`,{
            state:location.pathname
          })
          return () => clearInterval(intervel);
    }, [count,navigate,location,path])
    
  return (
    <div>
             
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Lottie
          animationData={Loading}
          style={{
            height: "20vw",
            width: "20vh",
          }}
        />
        <h1>Redirecting in {count}...</h1>
      </div>
    </div>
  )
}
