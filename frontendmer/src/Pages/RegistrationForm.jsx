import axios from "axios";
import { useState } from "react";
import React from "react"; 
import { Link, useNavigate } from "react-router-dom";
import Backbutton from "../Components/Backbutton";
import Loader from "../Components/Loading/Loader";
import LocationChecker from "./LocationChecker";
import Merchant_Header from "../Pages/merchant/Components/Merchant_Header";  


const RegistrationForm = () => {
  const [formData, setFormData] = useState({ name: "", email: "",  phone: "", shop: "" ,password:"",gst:"" });
  const [status, setStatus] = useState("");

  const [loading, setloading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const response = await axios.post("https://formspree.io/f/mkgjwlgw", formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        setStatus("Message Sent!");
        setFormData({ name: "", email: "", phone: "" , shop: "",password:"",gst:""});
      } else {
        setStatus("Error sending message.");
      }
    } catch (error) {
      setStatus("Error sending message.");
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
                      <form onSubmit={handleSubmit} >   
       <div className="mb-3">
         <label htmlFor="name" className="form-label">
           Name
         </label>
         <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" required className="form-control" />

       </div>
       <div className="mb-3">
         <label htmlFor="email" className="form-label">
           Email
         </label>
         <input
           type="email"
           className="form-control"
           name="email"
           value={formData.email}
           onChange={handleChange} 
           placeholder="Your Email"
           required
         />
       </div>

       <div className="mb-3">
         <label htmlFor="password" className="form-label">
           Password
         </label>
         <input
           type="password"
           className="form-control"
           name="password"
           value={formData.password}
           onChange={handleChange} 
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
           value={formData.phone}
           onChange={handleChange} 
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
           value={formData.shop}
           onChange={handleChange}
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
           value={formData.gst}
           onChange={handleChange} 
           placeholder="Your Gst Number"
           required
         />
       </div> 
       <button type="submit" >
       Submit
       </button>
       <p>{status}</p>
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
