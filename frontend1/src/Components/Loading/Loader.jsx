import React, { useEffect } from 'react'
import Lottie from "lottie-react";
import Loading from "../../assets/Loader.json";

const Loader = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])
  
  return (
    <div>
          <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Lottie
          animationData={Loading}
          style={{
            height: "20vw",
            width: "20vh",
          }}
        />

      <h5>Please wait...</h5>
      </div>
    </div>
  )
}

export default Loader