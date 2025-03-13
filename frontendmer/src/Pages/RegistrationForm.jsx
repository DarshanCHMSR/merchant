import axios from "axios";
import { useState, useEffect } from "react";
import React from "react";
import { Link } from "react-router-dom";
import Backbutton from "../Components/Backbutton";
import Loader from "../Components/Loading/Loader";
import { url } from "../Components/backend_link/data";


const RegistrationForm = () => {
  const [result, setResult] = useState("");
  const [loading, setloading] = useState(false);const [result2, setResult2] = React.useState("");
  const [location, setLocation] = useState({
      latitude: null,
      longitude: null,
      error: null,
    });const handleCheckboxChange = (event) => {
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
  const [isOtpVerified, setIsOtpVerified] = useState(false); // ✅ New state to track OTP verification

  const sendOTP = async () => {
    try {
      const response = await fetch(`${url}/api/v2/otp/send-otp`, {
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
      const response = await fetch(`${url}/api/v2/otp/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      if (data.message === "OTP verified successfully") {
        alert("OTP Verified Successfully");
        setIsOtpVerified(true); // ✅ Enable form submission after OTP verification
      } else {
        alert("Invalid OTP, please try again.");
        setIsOtpVerified(false);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setIsOtpVerified(false);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!isOtpVerified) {
      alert("Please verify OTP before submitting the form.");
      return;
    }
    setResult("Sending....");

    const formData = new FormData(event.target);
    // formData.append("access_key", process.env.WEB3FORMS_ACCESS_KEY);
    formData.append("access_key","5cfb18e9-5cf8-4eac-9db3-1cfcef0c6e67" );


    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (data.success) {
      setResult("Form Submitted Successfully");
      event.target.reset();
    } else {
      // setResult(data.message);
      setResult("Form Submission Failed");

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
                <div style={{ display: "flex", textAlign: "center", justifyContent: "center" }}>
                  <h2 className="text-primary">Are you ready to register? Let's get started!</h2>
                </div>
                <div className="col-lg-7 col-md-6 form-part login-form">
                  <div className="row">
                    <div className="col-lg-8 col-md-10 col-12 login formcol mx-auto">
                      <h3 className="text-primary">Register Now</h3>
                      <form onSubmit={onSubmit}>
                        <div className="mb-3">
                          <label htmlFor="name" className="form-label">Name</label>
                          <input type="text" name="name" placeholder="Your Name" required className="form-control" />
                        </div>

                        <div className="mb-3">
                          <label htmlFor="email" className="form-label">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            placeholder="Your Email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                          <button type="button" onClick={sendOTP} className="form-control mb-3" style={{margin:"7px",marginLeft:"0"}}>Send OTP</button>
                          {showOtpInput && (
                            <>
                              <input
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="form-control"
                              />
                              <button type="button" onClick={verifyOTP} className="form-control" style={{margin:"7px",marginLeft:"0"}}>Verify OTP</button>
                            </>
                          )}
                        </div>
                        <div className="mb-3">
                          <label htmlFor="phone" className="form-label">Phone Number</label>
                          <input type="phone" className="form-control" name="phone" placeholder="Phone Number" />
                        </div>

                        <div className="mb-3">
                          <label htmlFor="shop" className="form-label">Shop Name</label>
                          <input type="text" className="form-control" name="shop" placeholder="Your Shop Name" required />
                        </div>

                        <div className="mb-3">
                          <label htmlFor="gst" className="form-label">GST Number</label>
                          <input type="text" className="form-control" name="gst" placeholder="Your GST Number" required />
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
                              <button type="submit" className="btn btn-primary w-100 mb-3" disabled={!isOtpVerified}>
                          Submit
                        </button>
                        <p>{result}</p>
                      </form>
                      <p className="signinlink">
                        Already have an account? <Link to={"/login"}>Sign In</Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default RegistrationForm;
