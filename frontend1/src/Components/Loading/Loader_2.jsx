import React, { useEffect } from 'react'
import Lottie from "lottie-react";
import Loading from "../../assets/Loader_2.json";


const Loader_2 = () => {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <Lottie animationData={Loading} loop={true} 
       style={{
        height: "20vw",
        width: "20vh",
      }}
      />
    </div>
  )
}

export default Loader_2