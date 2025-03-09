import { useState } from "react";
import { auth } from "./firebaseConfig";
import { sendSignInLinkToEmail, signInWithEmailLink } from "firebase/auth";
import React from "react";
const actionCodeSettings = {
  url: window.location.href, // Redirect URL after login
  handleCodeInApp: true,
};

const FormOtp = () => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");

  // Send OTP to Email
  const sendOTP = async () => {
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", email);
      setOtpSent(true);
      setMessage("✅ OTP link sent to your email. Check your inbox!");
    } catch (error) {
      setMessage("⚠️ Error: " + error.message);
    }
  };

  // Verify OTP and Sign In
  const verifyOTP = async () => {
    try {
      const email = window.localStorage.getItem("emailForSignIn");
      if (!email) throw new Error("No email found. Try again.");

      await signInWithEmailLink(auth, email, window.location.href);
      setMessage("✅ Login successful! 🎉");
    } catch (error) {
      setMessage("⚠️ Error: " + error.message);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-2">Login with Email OTP</h2>

      {!otpSent ? (
        <>
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
        </>
      ) : (
        <button onClick={verifyOTP} className="bg-green-500 text-white px-4 py-2 rounded">
          Verify OTP
        </button>
      )}

      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
};

export default FormOtp;
