import axios from "axios";
import { useState } from "react";
import React from "react"; 
import Backbutton from "../Components/Backbutton";
import Merchant_Header from "../Pages/merchant/Components/Merchant_Header";  


const RegisterForm = () => {
//   const authData = localStorage.getItem("auth-Data");
//     const parsedData = JSON.parse(authData);
//      const name=parsedData.user.name; 
// const email=parsedData.user.email; 
//   const [formData, setFormData] = useState({ name: name, email: email,  subject: "", message: "" ,});
//   const [status, setStatus] = useState("");

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setStatus("Sending...");

//     try {
//       const response = await axios.post("https://formspree.io/f/mblgrvol", formData, {
//         headers: { "Content-Type": "application/json" },
//       });

//       if (response.status === 200) {
//         setStatus("Message Sent!");
//         setFormData({ name: "", email: "", subject: "" , message: ""});
//       } else {
//         setStatus("Error sending message.");
//       }
//     } catch (error) {
//       setStatus("Error sending message.");
//     }
//   };

    
  return (
    <>
          <Merchant_Header />

     <h1>hello </h1>


    </> 
  );
};

export default RegisterForm;
