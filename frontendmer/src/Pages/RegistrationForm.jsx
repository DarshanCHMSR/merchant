import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { supabase } from "./supabase";
import FormOtp from "./FormOtp";
import React from "react"; 
import { Link, useNavigate } from "react-router-dom";
import Backbutton from "../Components/Backbutton";
import Loader from "../Components/Loading/Loader";
import LocationChecker from "./LocationChecker";
import Merchant_Header from "../Pages/merchant/Components/Merchant_Header";  
import { set } from "mongoose";


const RegistrationForm = () => {
  const [result, setResult] = React.useState("");
  const [loading, setloading] = useState(false);
  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);

    formData.append("access_key", "121a629f-fb7c-4ce1-9181-d48c8de588c3");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      setResult("Form Submitted Successfully");
      event.target.reset();
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
  };
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) setUser(data.user);
    };

    fetchUser();
  }, []);
  const [result2, setResult2] = React.useState("");
const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    error: null,
  });

  const handleCheckboxChange = (event) => {
    if (event.target.checked) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              error: null,
            });
            setResult2("Location is enabled");
          },
          (error) => {
            setLocation({
              latitude: null,
              longitude: null,
              error: error.message,
            });
          }
        );
      } else {
        setLocation({
          latitude: null,
          longitude: null,
          error: 'Geolocation is not supported by your browser.',
        });
      }
    } else {
      // Reset location if checkbox is unchecked
      setLocation({
        latitude: null,
        longitude: null,
        error: null,
      });
    }};
    
    const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);

  const sendOTP = async () => {
    try {
      const response = await fetch("http://localhost:5000/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.text();
      alert(data);
      setShowOtpInput(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  const verifyOTP = async () => {
    try {
      const response = await fetch("http://localhost:5000/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };


  return (
    <>
 {loading ? (
        <Loader />
      ) : (
        <>
          <Backbutton path="/login" />
     
   <div className="container-fluid form-container mb-10 mt-10 p-4">
            <div className="container login-container">
              <div className="row">
                <div style={{display:"flex",textAlign:"center",justifyContent:"center"}} >
                  <h2 className="text-primary">
                    Are you ready to register - Let's get started!
                  </h2>
                  {/* <img
                    src="https://valuekarts-img-data.s3.ap-south-1.amazonaws.com/login.webp"
                    alt="Login"
                    className="signup-img img-fluid"
                  /> */}
                </div>
                <div className="col-lg-7 col-md-6 form-part login-form" >
                  <div className="row">
                   

                    <div className="col-lg-8 col-md-10 col-12 login formcol mx-auto">
                      <h3 className="text-primary">Register Now</h3>
                      <form onSubmit={onSubmit} >   
       <div className="mb-3">
         <label htmlFor="name" className="form-label">
           Name
         </label>
         <input type="text" name="name" placeholder="Your Name" required className="form-control" />

       </div>
       <div className="mb-3">
         <label htmlFor="email" className="form-label">
           Email
         </label>
         <input
           type="email"
           className="form-control"
           name="email"
           placeholder="Your Email"
           required
           value={email}
           onChange={(e) => setEmail(e.target.value)}
         />      <button onClick={sendOTP}className="form-control">Send OTP</button>
         {showOtpInput && (
           <>
             <input
               type="text"
               placeholder="Enter OTP"
               value={otp}
               onChange={(e) => setOtp(e.target.value)}
                       className="form-control"
             />
             <button onClick={verifyOTP}    className="form-control">Verify OTP</button>
           </>
         )}
       </div>

       {/* <div className="p-6">
      {user ? (
        <h2>Welcome, {user.email}! 🎉</h2>
      ) : (
        <FormOtp />
      )}
    </div> */}


       <div className="mb-3">
         <label htmlFor="key" className="form-label">
           Password
         </label>
         <input
           type="text"
           className="form-control"
           name="key"
           placeholder="Your Password"
           required
         />
       </div> 

       <div className="mb-3">
         <label htmlFor="phone number" className="form-label">
           Phone Number
         </label>
         <input
           type="phone"
           className="form-control"
           name="phone"
           placeholder="Phone Number"
         />
       </div>
       <div className="mb-3">
         <label htmlFor="shop" className="form-label">
           Shop Name
         </label>
         <input
         type="text"
           className="form-control"
           name="shop"
           placeholder="Your shop name"
           required
         ></input>
       </div>
       <div className="mb-3">
         <label htmlFor="gst" className="form-label">
           Gst number
         </label>
         <input
           type="text"
           className="form-control"
           name="gst"
           placeholder="Your Gst Number"
           required
         />
       </div> 
       <div>
      <label>
        <input 
          type="checkbox" 
          onChange={handleCheckboxChange} 
        />
        Are you in the shop?
      </label>
      {location.latitude && location.longitude && (
        <div>
          <input
           type="text"
           className="form-control"
           name="latitude"
           placeholder="latitude"
           required
           value={location.latitude}
           style={{display:"none"}}
         />
                   <input
           type="text"
           className="form-control"
           name="longitude"
           placeholder="longitude"
           required
           value={location.longitude}
           style={{display:"none"}}

         />
           <p>{result2}</p>
        </div>
      )}
      {location.error && <p>Error: {location.error}</p>}
    </div>
       <button type="submit" className={`btn btn-primary w-100 mb-3`}>
       Submit
       </button >
       <p>{result}</p>
       
     </form>
     <p className="signinlink">
                    Already have an account?  <Link to={"/login"}>Sign In</Link>
                    </p>   
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        


          <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>OTP Verification</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%" }}
      />
      <button onClick={sendOTP} style={{ padding: "10px", width: "100%" }}>Send OTP</button>
      {showOtpInput && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%" }}
          />
          <button onClick={verifyOTP} style={{ padding: "10px", width: "100%" }}>Verify OTP</button>
        </>
      )}
    </div>
          </>
      )}

    </> 
  );
};

export default RegistrationForm;
