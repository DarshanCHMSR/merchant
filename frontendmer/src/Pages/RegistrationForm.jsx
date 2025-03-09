import axios from "axios";
import { useState } from "react";
import React from "react"; 
import { Link, useNavigate } from "react-router-dom";
import Backbutton from "../Components/Backbutton";
import Loader from "../Components/Loading/Loader";
import LocationChecker from "./LocationChecker";
import Merchant_Header from "../Pages/merchant/Components/Merchant_Header";  


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
         />
       </div>

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
       <button type="submit" >
       Submit
       </button>
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
          </>
      )}

    </> 
  );
};

export default RegistrationForm;
