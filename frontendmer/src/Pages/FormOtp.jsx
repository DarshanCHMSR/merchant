import { useState } from "react";
import { supabase } from "./supabase";
import React from "react"; 

const FormOtp = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const sendOTP = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      setMessage("⚠️ Error: " + error.message);
    } else {
      setMessage("✅ OTP sent! Check your email.");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-2">Login with Email OTP</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <button onClick={sendOTP} className="bg-blue-500 text-white px-4 py-2 rounded">
        Send OTP
      </button>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
};

export default FormOtp;
