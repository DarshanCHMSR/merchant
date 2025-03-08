import axios from "axios";
import { useState } from "react";
import React from "react"; 


const RegisterForm = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const response = await axios.post("https://formspree.io/f/meoajvyw", formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        setStatus("Message Sent!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("Error sending message.");
      }
    } catch (error) {
      setStatus("Error sending message.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" required />
      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your Email" required />
      <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Your Message" required />
      <button type="submit">Send</button>
      
      <p>{status}</p>
    </form>
  );
};

export default RegisterForm;
