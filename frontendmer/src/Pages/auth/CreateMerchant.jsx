import axios from "axios";
import React, { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../../Components/Loading/Loader";
import Backbutton from "../../Components/Backbutton";
import CountDown from "../../Components/timer/CountDown";
import sendOtp from "./authControllers/sendOtp";
import verifyOtp from "./authControllers/verifyOtp";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "../../State/auth_action";
import { url } from "../../Components/backend_link/data";
import resendOtp from "./authControllers/resendOtp";
import Admin_Header from "../admin/Components/Admin_Header";


const CreateMerchant = () => {
  const [mail, setMail] = useState("");
  const [Name, setName] = useState("");
//   const [phone, setPhone] = useState("");

  // * this state used for setting the password for phone signup users
  const [password, setpassword] = useState("");

  // * this state is used for setting the password for email signup users
  const [emailPassword, setEmailPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [gst, setGst] = useState("");
  const [shop, setShop] = useState("");


  const [confirmPassword, setConfirmPassword] = useState("");

  // ! when user get resitered in that time only we will store the data in local storage
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
const [Latitude, setLatitude] = useState("");
const [Longitude, setLongitude] = useState("");
  const [input, setinput] = useState("");
  const [Number, setNumber] = useState(false);
  const [checkMail, setCheckMail] = useState(false);
  const [address, setAddress] = useState("");
  const navigate = useNavigate();
  const [loading, setloading] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    const [isidgenerated, setIsidgenerated] = useState(false);
  
  const [min, setmin] = useState(1);
  // ? this state is used to handel the resend OTP time recount.
  const handelsubmit = async (e) => {
    e.preventDefault();

    if (Number) {
      // here we have to send otp to the user
    } else {
      if (emailPassword !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
    }

    setloading(true);

    try {
      const res = await axios.post(`${url}/api/v2/auth/register`, {
        id,
        name: Name,
        email: mail,
        emailPassword,
        confirmPassword,
        phone,
        gst,
        shop,
        Latitude,
        Longitude,
        address,
      });
      // console.log(res.data);

      if (res.data.success) {
        navigate("/create-merchant");
        setName("");
        setMail("");
        setPhone("");
        setpassword("");
        setEmailPassword("");
        setinput("");
        setOtp("");
        setEmail("");
        setConfirmPassword(""); 
        setGst("");
        setLatitude("");
        setLongitude("");
        setShop("");
        setOtp("");
        setAddress("");
        setId("");
        toast.success(res.data.message);
        dispatch(
          setAuth({   
            user: res.data.user,
            token: res.data.token,
          })
        );
        localStorage.setItem("auth-Data", JSON.stringify(res.data));

        setloading(false);
      } else {
        // alert(res.data.message);
        toast.error(res.data.message);
        setloading(false);
      }
    } catch (error) {

      toast.error(error.response.data.message);
      setloading(false);
    }
  };


  const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false); // ✅ New state to track OTP verification
  const [customid, setCustomid] = useState([]);
    const [id, setId] = useState("");
    
    const sendOTP = async () => {
      try {
        const response = await fetch(`${url}/api/v2/otp/send-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
  
        const data = await response.text();
        alert(data);
        // console.log(data);
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
          setIsOtpVerified(true);
          setCheckMail(true); // ✅ Enable email/password fields after OTP verification
           // ✅ Enable form submission after OTP verification
        } else {
          alert("Invalid OTP, please try again.");
          setIsOtpVerified(false);
        }
      } catch (error) {
        console.error("Error verifying OTP:", error);
        setIsOtpVerified(false);
      }
    };
    const [result, setResult] = useState("");
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
              setLatitude(position.coords.latitude);
              setLongitude(position.coords.longitude);
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
 useEffect(() => {
    getcustomIDs();
  }, []);
      const getcustomIDs = async () => {
        try {
          const res = await axios.get(`${url}/api/v2/auth/get-custom-user-id`, {
            headers: {
              Authorization: auth.token,
            },
          });
    
          setCustomid(res.data.data);
        } catch (error) {
          toast.error("something went while fetching id");
        }
      };
    
      const generateId = () => {
        setloading(true);
        if (customid.length === 0) {
          setIsidgenerated(true);
          setId("VK-001");
          setloading(false);
          return;
        }
    
        const validIds = customid.filter((id) => id != null);
        
        // console.log("the validids",validIds);
    
        if (validIds.length === 0) {
          setId("VK-001");
          setIsidgenerated(true);
          setloading(false);
          return;
        }
    
        // Sort valid IDs in descending order to get the last one
        const lastId = validIds[validIds.length-1];
    
        // console.log("The lastID is ", lastId);
    
        if (!lastId) {
          setId("VK-001");
          setIsidgenerated(true);
          setloading(false);
          return;
        }
    
        // Safely split and extract the number part, then increment it
        const lastNumber = parseInt(lastId.split("-")[1]);
        const newNumber = (lastNumber + 1).toString().padStart(3, "0");
    
        setId(`VK-${newNumber}`);
        setIsidgenerated(true);
        setloading(false);
      };
    

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
                  <Admin_Header />
                  <div style={{marginTop:"50px"}}></div>
          <Backbutton path={"/dashboard/admin/product-list"} />
          <div className="container-fluid form-container mb-10 mt-10 p-4 form-container">
            <Toaster position="top-center" reverseOrder={false} />
            <div className="container login-container ">
              <div className="row ">
                <div className="col-md-5 content-part">
                  {/* <!-- <h4 class="logo">Smart Account</h4> --> */}
                  <h2 className="text-primary">Create Merchant account</h2>
                  <p>
                    Accounts of the Merchants are created here. Please fill in
                    the details to create an account.
                  </p>

                 
                </div>

                <div className="">
                  <div className="row">
                    <div className="col-lg-8 col-md-11  formcol mx-auto">
                      <h3 className="text-primary">Create account</h3>

                      <form onSubmit={handelsubmit}>
                        <div className="form-floating mb-3">
                          <input
                            type="text"
                            className="form-control"
                            id="floatingInput"
                            value={Name}
                            onChange={(e) => {
                              setName(e.target.value);
                            }}
                            placeholder="Enter Your Name: "
                          />
                          <label htmlFor="floatingInput">Full Name</label>
                        </div>
                        <div className="form-floating mb-3">
                        <input
              type="text"
              className="form-control"
              id="floatingInput"
              placeholder="Enter Your ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
                                      <label htmlFor="floatingInput">Custom Id</label>

            <button type="button"  className={`btn btn-primary mt-3 text-white ${isidgenerated ? "disabled" : ""}`} onClick={generateId}>{loading ? "Loading..." : "Generate ID"}</button>
          </div>
          <div className="form-floating mb-3">
  <input
    type="text"
    className="form-control"
    id="floatingInput"
    value={email}
    disabled={isOtpVerified} 
    onChange={(e) => {
      const inputValue = e.target.value;
      setEmail(inputValue); // Update email state
      if (emailRegex.test(inputValue)) {
        setMail(inputValue);
        setinput(inputValue);
      }
    }}
    placeholder="Email"
  />
  <label htmlFor="floatingInput">Email</label>

  <button
    type="button"
    onClick={sendOTP}
    className="form-control mb-3"
    style={{ margin: "7px", marginLeft: "0" }}
  >
    Send OTP
  </button>

  {showOtpInput && (
    <>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="form-control"
      />
      <button
        type="button"
        onClick={verifyOTP}
        className="form-control"
        style={{ margin: "7px", marginLeft: "0" }}
      >
        Verify OTP
      </button>
    </>
  )}
</div>



                        {/* If the user is entering the email address */}
                        {checkMail && (
                          <>
                            <div className="form-floating mb-3">
                              <input
                                type="password"
                                className="form-control"
                                id="floatingInput"
                                value={emailPassword}
                                onChange={(e) => {
                                  setEmailPassword(e.target.value);
                                }}
                                placeholder="Enter password"
                              />
                              <label htmlFor="floatingInput">Password</label>
                            </div>
                            <div className="form-floating mb-3">
                              <input
                                type="password"
                                className="form-control"
                                id="floatingPassword"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => {
                                  setConfirmPassword(e.target.value);
                                }}
                              />
                              <label htmlFor="floatingPassword">
                                Confirm Password
                              </label>
                            </div>
                            <div className="form-floating mb-3">
                              <input
                                type="number"
                                className="form-control"
                                id="floatingInput"
                                value={phone}
                                onChange={(e) => {
                                  setPhone(e.target.value);
                                }}
                                placeholder="Enter phone Number"
                              />
                              <label htmlFor="floatingInput mb-3">Phone number</label>
                            </div>
                            <div className="form-floating mb-3">
                              <input
                                type="text"
                                className="form-control"
                                id="floatingInput"
                                required
                                value={gst}
                                onChange={(e) => {
                                  setGst(e.target.value);
                                }}
                                placeholder="Enter Gst Number"
                              />
                              <label htmlFor="floatingInput">Gst number</label>
                            </div>
                            <div className="form-floating mb-3">
                              <input
                                type="text"
                                className="form-control"
                                id="floatingInput"
                                value={shop}
                                onChange={(e) => {
                                  setShop(e.target.value);
                                }}
                                placeholder="Enter Shop Name"
                              />
                              <label htmlFor="floatingInput">Shop Name</label>
                            </div>
                            <div className="form-floating mb-3">
                              <input
                                type="text"
                                className="form-control"
                                id="floatingInput"
                                value={address}
                                onChange={(e) => {
                                  setAddress(e.target.value);
                                }}
                                placeholder="Enter Shop Address "
                              />
                              <label htmlFor="floatingInput">Shop Address</label>
                            </div>
                             <label>
        <input 
          type="checkbox" 
          onChange={handleCheckboxChange} 
        />
        Are you in the shop?
      </label>
      {location.latitude && location.longitude && (
        <div>
           <p>{result2}</p>
        </div>
      )}
      {location.error && <p>Error: {location.error}</p>}
      
                          </>
                        )}

                        {checkMail && (
                          <div className="form-floating mt-4 w-100">
                            <button
                              className="btn btn-primary w-100"
                              type="submit"
                            >
                              Create Account
                            </button>
                          </div>
                        )}
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

export default CreateMerchant;
