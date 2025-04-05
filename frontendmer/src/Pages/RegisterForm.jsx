import axios from "axios";
import { useState } from "react";
import React from "react"; 
import Backbutton from "../Components/Backbutton";
import Merchant_Header from "../Pages/merchant/Components/Merchant_Header";  


const RegisterForm = () => {  
  const authData = localStorage.getItem("auth-Data");
    const parsedData = JSON.parse(authData);
     const name=parsedData.user.name; 
const email=parsedData.user.email; 
  // const [formData, setFormData] = useState({ name: name, email: email,  subject: "", message: "" ,});
  // const [status, setStatus] = useState("");

  // const handleChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setStatus("Sending...");

  //   try {
  //     const response = await axios.post("https://formspree.io/f/mblgrvol", formData, {
  //       headers: { "Content-Type": "application/json" },
  //     });

  //     if (response.status === 200) {
  //       setStatus("Message Sent!");
  //       setFormData({ subject: "" , message: ""});
  //     } else {
  //       setStatus("Error sending message.");
  //     }
  //   } catch (error) {
  //     setStatus("Error sending message.");
  //   }
  // };
  const [result, setResult] = useState("");


  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");

    const formData = new FormData(event.target);
    const access_keys= import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
    formData.append("access_key",access_keys);


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
          <Merchant_Header />

      <form onSubmit={onSubmit} style={{ width: "50%", margin: "auto", marginTop: "100px" }}>
         <div className="row mb-0">
            <div className="col-12">
              <Backbutton path={"/dashboard/merchant"} />
            </div>
          </div>
          
          
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input type="text" name="name" value={name}  placeholder="Your Name" required className="form-control" />

            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={email}
                placeholder="Your Email"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="subject" className="form-label">
                Subject
              </label>
              <input
                type="text"
                className="form-control"
                name="subject"
                
                placeholder="Subject"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="message" className="form-label">
                Message
              </label>
              <textarea
                className="form-control"
                name="message"
                rows="4"
                placeholder="Your Message"
                required
              ></textarea>
            </div>
            <button type="submit" >
            Send
            </button>
            <p>{result}</p>
          </form>


    </> 
  );
};

export default RegisterForm;
