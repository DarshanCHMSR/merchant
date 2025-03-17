import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import sendOtp from "./authControllers/sendOtp";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "../../State/auth_action";
import Loader from "../../Components/Loading/Loader";
import Backbutton from "../../Components/Backbutton";
import CountDown from "../../Components/timer/CountDown";
import verifyOtp from "./authControllers/verifyOtp";
import { url } from "../../Components/backend_link/data";
import resendOtp from "./authControllers/resendOtp";

const LoginOtp = () => {
  const [mail, setMail] = useState("");

  // * this state is used for the email password
  const [emailPassword, setEmailPassword] = useState("");

  // * this one used for phone login users
  const [password, setpassword] = useState("");

  const [phone, setPhone] = useState("");
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const [loading, setloading] = useState(false);

  const [input, setinput] = useState("");
  const [Number, setNumber] = useState(false);
  const [checkMail, setCheckMail] = useState(false);

  const navigate = useNavigate();

  // ! This is state are for manging of the otp.
  const [otp, setOtp] = useState(null);
  const [sentOtp, setSendOtp] = useState(false);
  const [verifyotp, setVerifyotp] = useState(false);
  const [resendOTP, setResendOTP] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;

  // * this method used for sending otp to the use

    // ? this state is used to handel the resend OTP time recount.
    const [resendCount, setResendCount] = useState(0);
    const [email, setEmail] = useState(""); 
const [newPassword, setNewPassword] = useState("");
  // * this function is for handling the form login container input
  const handelsubmit = async (e) => {
    setloading(true);
    e.preventDefault();
    // Placeholder password for phone login
    setEmail(input)
const data={email,newPassword}
console.log(data)
    try {
      const res = await axios.post(`${url}/api/v2/auth/reset-password`, data);
     
      if (res.data.success) {
       navigate("/login");
        toast.success(res.data.message);
        setloading(false);
      } else {
        toast.error("Before Login please changing the password ");
        setloading(false);
      }
    } catch (error) {
      toast.error("Somewhing went wrong please try again later");
      setloading(false);
    }
  };

  
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Backbutton path="/" />

          <div className="container-fluid form-container mb-10 mt-10 p-4" >
            <div className="container login-container">
              <div className="row">
                <div className="col-lg-5 col-md-6 content-part">
                  <h2 className="text-primary">
                    Welcome Back – Ready to Shop?
                  </h2>
                  <img
                    src="https://valuekarts-img-data.s3.ap-south-1.amazonaws.com/login.webp"
                    alt="Login"
                    className="signup-img img-fluid"
                  />
                </div>
                <div className="col-lg-7 col-md-6 form-part login-form">
                  <div className="row">
                    <p className="signinlink">
                      Don't have an account? <Link to="/registration-form">Contact us</Link>
                    </p>

                    <div className="col-lg-8 col-md-10 col-12 login formcol mx-auto">
                      <h3 className="text-primary">Forgot Password</h3>

                      <form onSubmit={handelsubmit}>
                        <div className="form-floating mb-3">
                          <input
                            type="text"
                            value={input}
                            disabled={sentOtp || resendOTP}
                            className="form-control"
                            onChange={(e) => {
                              setinput(e.target.value);
                              if (emailRegex.test(e.target.value)) {
                                setMail(e.target.value);
                                setCheckMail(true);
                                setPhone("");
                              } else if (
                                phoneRegex.test(e.target.value) &&
                                e.target.value != ""
                              ) {
                                setPhone(e.target.value);
                                setNumber(true);
                                setMail("");
                              }
                              if (e.target.value == "") {
                                setCheckMail(false);
                                setNumber(false);
                              }
                            }}
                            id="floatingInput"
                            placeholder="Enter Email Address"
                          />
                          <label htmlFor="floatingInput">Enter your Email</label>
                        </div>

                        {/* If the user is entering the phone number */}
                      

                        {checkMail && (
                          <div>
                          <div className="form-floating mb-3">
                            <input
                              type="password"
                              className="form-control"
                              id="floatingPassword"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="Password"
                            />
                            <label htmlFor="floatingPassword">Password</label>
                          </div>
                          </div>
                        )}

                        <div className="form-floating">
                          {checkMail && (
                            <button
                              className="btn btn-primary mt-3 w-100"
                              type="submit"
                            >
                              Login
                            </button>
                          )}
                        </div>
                      </form>
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

export default LoginOtp;
