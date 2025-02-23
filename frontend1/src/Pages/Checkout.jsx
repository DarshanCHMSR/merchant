import React, { useEffect, useState } from "react";
import CheckoutProduct from "../Components/CheckoutProduct";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { clearBuy } from "../State/cart_actions";
import Loader from "../Components/Loading/Loader";
import { FaLocationCrosshairs } from "react-icons/fa6";
import toast from "react-hot-toast";
import { url } from "../Components/backend_link/data";
import { MdDelete } from "react-icons/md";
import sendOtp from "./auth/authControllers/sendOtp";
import CountDown from "../Components/timer/CountDown";
import verifyOtp from "./auth/authControllers/verifyOtp";
import { setAuth } from "../State/auth_action";
import resendOtp from "./auth/authControllers/resendOtp";


const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.cart);
  const buyItem = useSelector((state) => state.cart.buy);
  const auth = useSelector((state) => state.auth);

  // * These state will store the buy item everytime when the page renders and when the buy button is clicked
  const [buyItems, setBuyItems] = useState(
    buyItem.length > 0 ? buyItem : cartItems
  );

  // * These state is used to manage the total price.
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // * this are the states that are used to get the current location of the user.
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);

  // * this state is used to get the address of the user.
  const [address, setAddress] = useState("");

  // * this state is used to get the new address of the user.
  const [newAddress, setNewAddress] = useState("");

  //* this state is for manageing the Phone.

  const [Name, setName] = useState('');

  const [email, setEmail] = useState('');

  const [phone, setPhone] = useState("");

  // * These state is used to manage the mailing list.
  const [mailItems, setmailItems] = useState([]);


  const [mail, setMail] = useState("");

  const [isSubmit, setIsSubmit] = useState(false);

  const [otp, setOtp] = useState(null);
  const [sentOtp, setSendOtp] = useState(false);
  const [verifyotp, setVerifyotp] = useState(false);
  const [resendOTP, setResendOTP] = useState(false);
  const [orderId, setOrderId] = useState(null);


  const [password, setpassword] = useState('');

  useEffect(() => {
    setTotal(
      cartItems.reduce(
        (acc, curr) => acc + Number(curr.selectedVariety.price) * curr.qty,
        0
      )
    );
  }, [cartItems]);

  const [deliveryCharge, setdeliveryCharge] = useState(0);

  useEffect(() => {
    // Calculate the total price and delivery charges
    const totalPrice = buyItems.reduce(
      (acc, curr) => acc + Number(curr.selectedVariety.price) * curr.qty,
      0
    );

    // Calculate the total delivery charge
    var deliveryCharges = buyItems.reduce((acc, curr) => {
      if (Number(curr.price) < 500) {
        if (totalPrice < 500) {
          return acc + Number(curr.deliveryCharge) * curr.qty;
        }
      } else {
        return acc;
      }
      return acc;
    }, 0);

    // Set the total to include both price and delivery charges
    setTotal(totalPrice + deliveryCharges);

    setdeliveryCharge(deliveryCharges);
  }, [buyItems]);

  // * when this page renders why this page is rendered and which product details i have to send to the seller.
  useEffect(() => {
    if (buyItem.length > 0) {
      setmailItems(buyItems);
    } else {
      setmailItems(cartItems);
    }

    if (auth?.user) {
      getExistingAddress();
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, []);

  // * this login is for handeling when the is logged on
  const [useExistingAddress, setUseExistingAddress] = useState(false);

  // * This function handles orders of non-logged in users verification.

  const registerUser = async (e) => {
    e.preventDefault();
    console.log(mail, phone, password);

    // const data = {
    //   name: e.target.user_name.value,
    //   email: e.target.user_email.value,
    //   address: e.target.address.value,
    //   cordinates: location,
    //   phone: e.target.user_phone.value,
    //   products: buyItems,
    // };

    setLoading(true);

    try {
      const res = await axios.post(`${url}/api/v2/auth/register`, {
        name: Name,
        email: email,
        password,
        phone: phone,
      });

      if (res.data.success) {
        navigate("/checkout");
        dispatch(
          setAuth({
            user: res.data.user,
            token: res.data.token,
          })
        );
        localStorage.setItem("auth-Data", JSON.stringify(res.data));

        setLoading(false);
      } else {
        // alert(res.data.message);
        // * if the user is already exists.
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      loginuser(e);
      setLoading(false);
    }
  };


  const loginuser = async (e) => {
    setLoading(true);
    e.preventDefault();


    try {
      const res = await axios.post(`${url}/api/v2/auth/login`, {
        phone,
        password,
      });

      dispatch(
        setAuth({
          user: res.data.user,
          token: res.data.token,
        })
      );

      // * Saving the user data in local storage if the application refreshed then the user will be logged in automatically
      localStorage.setItem("auth-Data", JSON.stringify(res.data));

      if (res.data.success) {
        navigate("/checkout");
      } else {
        setLoading(false);
      }
    } catch (error) {
      toast.error("Somewhing went wrong please try again later");
      setLoading(false);
    }
  };
  
  const handelVerify = async (e) => {
    e.preventDefault();
    // setLoading(true);
    try {
      const res = await verifyOtp(phone, otp, orderId);

      // Assuming the response data is the `isOTPVerified` object
      if (res.isOTPVerified) {
        setVerifyotp(true);
        registerUser(e);
      } else {
        toast.error("OTP Verification Failed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handelResend = async (e) => {
    e.preventDefault();
    try {
      const res = await resendOtp(orderId);
      setResendOTP(true);
    } catch (error) {
      console.log(error);
    }
  };

  // * non-logged users verification done

  const handleCheckboxChange = (e) => {
    setUseExistingAddress(e.target.checked);
    if (e.target.checked) {
      // Assuming getExistingAddress() fetches the existing address
      const existingAddress = address;
      setNewAddress(existingAddress);
    } else {
      setNewAddress("");
    }
  };

  const getExistingAddress = async () => {
    if (!auth.user) {
      console.log("User is not authenticated");
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:8080/api/v2/auth/get-user/${auth.user._id}`,
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );
      setAddress(res.data.user.address);
    } catch (error) {
      console.log(error);
    }
  };

  const updateProfile = async (data) => {
    if (!auth.user) {
      console.log("User is not authenticated");
      return;
    }

    try {
      const res = await axios.put(
        `${url}/api/v2/auth/update-user/${auth.user._id}`,
        {
          address: data.address,
          phone: data.phone,
          email: data.email,
        },
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );

      return res.data.success;
    } catch (error) {
      console.log(error);
      return error.response.data.success;
    }
  };

  const sendMail = async (data) => {
    try {
      const res = await axios.post(`${url}/api/v2/mail/send-mail`, data);
      console.log("SUCCESS!", res.data);

      if (res.data.success) {
        orderConfirmed();
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error(
        "Something went wrong while confirming your order please try again later"
      );
    }
  };

  // * it's an animation screen that confirms the order
  const orderConfirmed = () => {
    navigate("/orderConfirmed");
  };

  // * This function handles orders of non-logged in users.
  const handelSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const data = {
      name: e.target.user_name.value,
      email: e.target.user_email.value,
      address: e.target.address.value,
      cordinates: location,
      phone: e.target.user_phone.value,
      products: buyItems,
    };

    let check = await sendMail(data);

    if (check) {
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  // * this function handles order for logged in users
  const handleOrderSubmit = async (e) => {
    e.preventDefault();

    // * this data is passed because we need to update the user profile.
    let data = {
      address: address,
      cordinates: location,
      phone: phone,
      email: mail,
    };

    let checkuserdata = await updateProfile(data);

    if (!checkuserdata) {
      return toast.error("Your entered mail/phone is already registered !!!! ");
    }

    setLoading(true);

    const orderData = {
      products: buyItems.map((productId) => productId._id), // Assuming `productId` is the ID of each product
      buyer: auth.user._id, // Assuming `auth.user` contains the logged-in user's details
      address: address || getExistingAddress(),
      variety: JSON.stringify(buyItems.map((item) => item.selectedVariety)),
      total: buyItems.reduce(
        (acc, curr) => acc + curr.selectedVariety.price * curr.qty,
        0
      ),
      returnDays: buyItems.reduce(
        (max, curr) => (curr.returnDays > max ? curr.returnDays : max),
        0
      ),
      replacementDays: buyItems.reduce(
        (max, curr) =>
          curr.replacementDays > max ? curr.replacementDays : max,
        0
      ),
      status: "Not Processed",
    };

    try {
      const res = await axios.post(
        `${url}/api/v2/order/create-order`,
        orderData
      );

      console.log(res.data);
      if (res.data) {
        dispatch(clearBuy());
        await sendMail({
          name: auth.user.name,
          email: auth.user.email || mail,
          address: address || newAddress,
          cordinates: location,
          phone: phone,
          products: buyItems,
        });
        setLoading(false);
        orderConfirmed();
      }
    } catch (err) {
      toast.error("Order submission failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleFocus = () => {
    // setValue("");
  };


  // * This function is used to get the address of the user by decoding the cordinates.
  const reverseCode = (latitude, longitude) => {
    axios
      .post(`${url}/api/v2/location/reverse-geocode`, {
        latitude, // Updated to match the expected parameter names
        longitude,
      })
      .then((response) => {
        setAddress(response.data.address);
        setError(null);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  // * This function is used to get the current location of the user.
  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setError(null);
          reverseCode(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          setError(err.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  const handelDeleteBuyItem = (id) => {
    setBuyItems(buyItems.filter((item) => item._id !== id));
  };

  return loading ? (
    <Loader />
  ) : (
    <div>
      <main className="mt-5 pt-4">
        <div className="container">
          <div className="row">
            <div className="col-md-8 mb-4">
              <div className="card p-4">
                {auth?.user ? (
                  <>
                    <div className="container">
                      <div className="row justify-content-center">
                        <div className="col-md-8">
                          <div className="address-form">
                            <h1 className="text-center mb-4">
                              Check your address
                            </h1>

                            <div className="form-group mb-4">
                              <h4>Your Current Address</h4>
                              <p className="border p-2">{address}</p>
                              <div className="form-check mb-4">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="autoSizingCheck"
                                  onChange={handleCheckboxChange}
                                  checked={useExistingAddress}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="autoSizingCheck"
                                >
                                  Use existing address
                                </label>
                              </div>
                            </div>

                            {!useExistingAddress && (
                              <div className="address-fields">
                                <div className="form-group mb-4">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter new Address"
                                    aria-label="Your Address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                  />
                                </div>
                                <p
                                  className="text-primary cursor-pointer"
                                  onClick={fetchLocation}
                                  style={{
                                    fontSize: "14px",
                                  }}
                                >
                                  Current location{" "}
                                  <FaLocationCrosshairs className="cursor-pointer" />
                                </p>
                              </div>
                            )}

                            {useExistingAddress && (
                              <div className="existing-address">
                                <p>Your existing address: {address}</p>
                              </div>
                            )}

                            {(auth?.user.phone.startsWith("12345") ||
                              auth?.user.phone === "") && (
                              <div className="form-group mb-4">
                                <label className="form-label">
                                  Phone Number{" "}
                                  <small className="text-danger"> *</small>
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Enter Phone Number"
                                  aria-label="Phone Number"
                                  value={phone}
                                  onChange={(e) => setPhone(e.target.value)}
                                  required
                                />
                              </div>
                            )}

                            {auth?.user.email === null && (
                              <div className="form-group mb-4">
                                <label className="form-label">
                                  Email{" "}
                                  <small className="text-danger"> *</small>
                                </label>
                                <input
                                  type="email"
                                  className="form-control"
                                  placeholder="Enter your Email"
                                  aria-label="mail"
                                  value={mail}
                                  onChange={(e) => setMail(e.target.value)}
                                  required
                                />
                              </div>
                            )}

                            <h4 className="mt-4">Payment</h4>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexCheckDefault"
                              >
                                Cash On Delivery
                              </label>
                            </div>

                            <hr />

                            <div className="text-center">
                              <button
                                className="btn btn-primary"
                                type="submit"
                                onClick={handleOrderSubmit}
                              >
                                Place Order
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {!isSubmit && (
                      <>
                        <span>
                          <h4>Not Registered?</h4>
                          <Link to={"/signup"}>Signup/Login</Link>
                        </span>
                        <h2 className="my-2 text-center">Checkout form</h2>
                        <form>
                          <div className="row mb-3">
                            <p>
                              <small className="text-danger">*</small> Name
                            </p>
                            <div className="form-outline">
                              <input
                                type="text"
                                name="user_name"
                                className="form-control"
                                placeholder="Your Name"
                                aria-label="Your Name"
                                value={Name}
                                onFocus={handleFocus}
                                onChange={(e) => setName(e.target.value)}
                                style={{ border: "1px solid #ccc" }}

                                required
                              />
                            </div>
                          </div>
                          <p className="mb-0">
                            <small className="text-danger">*</small> Phone
                            Number{" "}
                          </p>
                          <div className="form-outline mb-4">
                            <input
                              type="text"
                              className="form-control"
                              name="user_phone"
                              value={phone}
                              placeholder="+91 1234567890"
                              style={{ border: "1px solid #ccc" }}
                              onChange={(e) => setPhone(e.target.value)}
                              required
                            />
                          </div>
                          <p className="mb-0">
                            <small className="text-danger">*</small> Email{" "}
                          </p>
                          <div className="form-outline mb-4">
                            <input
                              type="email"
                              className="form-control"
                              name="user_email"
                              value = {mail}
                              onChange={(e) => setMail(e.target.value)}
                              placeholder="youremail@example.com"
                              aria-label="youremail@example.com"
                              style={{ border: "1px solid #ccc" }}
                              required
                            />
                          </div>
                          <p className="mb-0">
                            <small className="text-danger">*</small> Address
                          </p>
                          <div className="form-outline mb-4">
                            <input
                              type="text"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              className="form-control"
                              name="address"
                              placeholder="1234 Main St"
                              aria-label="1234 Main St"
                              style={{ border: "1px solid #ccc" }}
                              required
                            />
                          </div>

                          <p
                            className="text-primary cursor-pointer fs-8"
                            onClick={fetchLocation}
                            style={{
                              fontSize: "14px",
                            }}
                          >
                            Current location <FaLocationCrosshairs />
                          </p>
                          <div className="row">
                            <div className="col-lg-4 col-md-12 mb-4">
                              <p className="mb-0">Country</p>
                              <div className="form-outline mb-4">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="India"
                                  defaultValue={"India"}
                                  aria-label="India"
                                  style={{ border: "1px solid #ccc" }}
                                />
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-12 mb-4">
                              <p className="mb-0">State</p>
                              <div className="form-outline mb-4">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Karnataka"
                                  aria-label="Karnataka"
                                  defaultValue={"Karnataka"}
                                  style={{ border: "1px solid #ccc" }}
                                />
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-12 mb-4">
                              <p className="mb-0">Zip</p>
                              <div className="form-outline">
                                <input
                                  type="text"
                                  className="form-control"
                                  style={{ border: "1px solid #ccc" }}
                                  // value = {"560091"}
                                  defaultValue={"560091"}
                                />
                              </div>
                            </div>
                          </div>
                          <hr />
                          <h4>Payment</h4>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="flexCheckDefault"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="flexCheckDefault"
                            >
                              Cash On Delivery
                            </label>
                          </div>
                          <hr />
                          <button
                            className="btn btn-primary"
                            type="submit"
                            onClick={() => setIsSubmit(true)}
                          >
                            Place Order
                          </button>
                        </form>
                      </>
                    )}

                    {isSubmit && (
                      <>
                        <button
                          className={`btn btn-primary w-50 mb-3 align-self-center ${
                            sentOtp || resendOTP ? "disabled" : ""
                          }`}
                          onClick={async (e) => {
                            e.preventDefault();
                            setSendOtp(true);
                            try {
                              const res = await sendOtp(phone);
                              // console.log(res);
                              setOrderId(res);
                            } catch (error) {
                              console.log(error);
                            }
                          }}
                        >
                          Send OTP
                        </button>

                        {sentOtp && (
                          <>
                            <div className="form-floating mb-3">
                              <input
                                type="Number"
                                className="form-control"
                                id="floatingInput"
                                value={otp}
                                onChange={(e) => {
                                  setOtp(e.target.value);
                                  setpassword("123456");
                                }}
                                placeholder="Enter OTP"
                              />
                              <label htmlFor="floatingInput">Enter OTP</label>
                              <p className="m-0 fs-6 text-success">
                                OTP sent successfully +91 {phone}
                              </p>
                              <div className="d-flex align-items-center justify-content-between">
                                <p
                                  className="m-0 text-primary cursor-pointer"
                                  onClick={handelResend}
                                >
                                  Resend OTP
                                </p>
                                <p>
                                  {" "}
                                  <CountDown
                                    initialMinutes={1}
                                    initialSeconds={0}
                                  />
                                </p>
                              </div>
                              <button
                                className={`btn btn-${
                                  verifyotp ? "success" : "danger"
                                }`}
                                onClick={handelVerify}
                                defaultValue={"Verify OTP"}
                              >
                                {verifyotp ? "Verified" : "Verify OTP"}
                              </button>
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <h4 className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-muted">Your cart</span>
                <span className="badge rounded-pill badge-primary">
                  {cartItems.length}
                </span>
              </h4>
              {buyItems.length > 0
                ? buyItems.map((item) => (
                    <>
                      <div
                        className="d-flex justify-content-between align-items-center"
                        key={item._id}
                      >
                        <CheckoutProduct prod={item} />
                        <div className="delete-icon-container">
                          <MdDelete
                            className="cursor-pointer text-danger delete-icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handelDeleteBuyItem(item._id);
                            }}
                          />
                        </div>
                      </div>
                    </>
                  ))
                : cartItems.map((item) => (
                    <>
                      <CheckoutProduct prod={item} key={item._id} />
                    </>
                  ))}
              <li className="list-group-item d-flex flex-column justify-content-center">
                <span>Total (Rs)</span>
                <small>Delivery Charges : {deliveryCharge}</small>
                <strong>Rs: {total}</strong>
              </li>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
