import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Admin_Header from "../Components/Admin_Header";
import { useParams } from "react-router-dom";
import Loader from "../../../Components/Loading/Loader";
import { url } from "../../../Components/backend_link/data";
import { useReactToPrint } from "react-to-print";
import sendOtp from "../../auth/authControllers/sendOtp";
import resendOtp from "../../auth/authControllers/resendOtp";
import verifyOtp from "../../auth/authControllers/verifyOtp";
import CountDown from "../../../Components/timer/CountDown";
import toast from "react-hot-toast";
import Backbutton from "../../../Components/Backbutton";

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const auth = useSelector((state) => state.auth);
  const [user, setUser] = useState({});
  const [gstin, setGstin] = useState("29AOOPH9172E2ZH");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(null);
  const [sentOtp, setSendOtp] = useState(false);
  const [verifyotp, setVerifyotp] = useState(false);
  const [resendOTP, setResendOTP] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const contentToPrint = useRef(null);

  const handlePrint = useReactToPrint({
    documentTitle: "Invoice",
    content: () => contentToPrint.current,
  });

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  useEffect(() => {
    if (order && order.buyer) {
      fetchUser();
    }
  }, [order]);

  useEffect(() => {
    if (order) {
      fetchProductsDetails();
    }
  }, [order]);

  const fetchOrderDetails = async () => {
    try {
      const res = await axios.get(
        `${url}/api/v2/order/get-order-detail/${id}`,
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );
      setOrder(res.data);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await axios.get(
        `${url}/api/v2/auth/get-user/${order.buyer._id}`,
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );
      setUser(res.data.user);
    } catch (error) {
     toast.error("Error fetching user details:", error);
    }
  };

  const fetchProductsDetails = async () => {
    try {
      const productIds = order.products.map(product => product._id);
      const res = await Promise.all(
        productIds.map(id =>
          axios.get(`${url}/api/v2/products/get-single-product/${id}`, {
            headers: {
              Authorization: auth?.token,
            },
          })
        )
      );
      setProducts(res.map(product => product.data.pd));
    } catch (error) {
      // console.error("Error fetching product details:", error);
     toast.error("Error fetching user details:", error);

    }
  };

  if (!order) {
    return <Loader />;
  }

  const handelVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await verifyOtp(user?.phone, otp, orderId);
      if (res.isOTPVerified) {
        setVerifyotp(true);
        handelsubmit(e);
      } else {
        toast.error("OTP Verification Failed");
      }
    } catch (error) {
      // console.log(error);
     toast.error("Error fetching user details:", error);

    }
  };

  const handelResend = async (e) => {
    e.preventDefault();
    try {
      const res = await resendOtp(orderId);
      setResendOTP(true);
    } catch (error) {
      // console.log(error);
     toast.error("Error fetching user details:", error);

    }
  };

  return (
    <div>
      <Admin_Header />
      <div className="container mt-5 pt-3">
        <Backbutton path="/dashboard/admin/orders" />
        <div ref={contentToPrint}>
          <div className="card shadow p-4">
            <h1 className="text-center mb-4 mt-3">Order Details</h1>
            <div className="card-body">
              <h4 className="text-center text-uppercase text-primary mb-4">
                Valuekarts
              </h4>

              <div className="row mb-3">
                <div className="col-md-6">
                  <p>
                    <strong>Order Date:</strong>{" "}
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <p>
                    <strong>Total Amount:</strong> ₹{order.total}
                  </p>
                  <p>
                    <strong>Buyer Name:</strong> {user.name}
                  </p>
                </div>
                <div className="col-md-6">
                  <p>
                    <strong>Last Updated:</strong>{" "}
                    {new Date(order.updatedAt).toLocaleString()}
                  </p>
                  <p>
                    <strong>Shipping Address:</strong> {order.address}
                  </p>
                  <p>
                    <strong>Buyer Phone:</strong> {user.phone}
                  </p>
                </div>
              </div>

              <h4 className="mb-3">Products:</h4>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Product ID</th>
                    <th>Product Name</th>
                    <th>Custom ID</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={index}>
                      <td>{product?._id}</td>
                      <td>{product?.name}</td>
                      <td>{product?.id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h4 className="mb-3">Variety:</h4>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Product Index</th>
                    <th>Variant Name</th>
                    <th>Variant Price</th>
                  </tr>
                </thead>
                <tbody>
                  {order.variety.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>₹{item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h4 className="mb-3">Quantity Details</h4>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Index</th>
                    <th>Product ID</th>
                    <th>Ordered Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(order.qty) && order.qty.length > 0 ? (
                    order.qty.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.ids || "N/A"}</td>
                        <td>{item.quantity || 0}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center">
                        No quantity details available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mb-3">
              <label className="form-label mt-3" style={{ fontWeight: "bold" }}>
                GSTIN Number
              </label>
              <input
                type="text"
                className="form-control"
                value={gstin}
                disabled
                onChange={(e) => setGstin(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="text-center mt-4">
          <button
            onClick={handlePrint}
            disabled={loading}
            className="btn btn-primary btn-lg"
          >
            {loading ? "Generating..." : "Print"}
          </button>
        </div>
        <div className="text-center mt-3">
          <a
            className="btn btn-secondary"
            href={`https://www.google.com/maps?q=${user?.location?.latitude},${user?.location?.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Go to Maps
          </a>
        </div>

        {/* OTP Section */}
        <div className="mt-5 d-flex flex-column align-items-center justify-content-center">
          <div>
            <h6 className="text-center text-danger">
              Note: Before giving the order please verify the user
            </h6>
          </div>
          <button
            className={`btn btn-primary w-fit mb-3 ${
              sentOtp || resendOTP ? "disabled" : ""
            }`}
            onClick={async (e) => {
              e.preventDefault();
              setSendOtp(true);
              try {
                const res = await sendOtp(user?.phone);
                setOrderId(res);
                console.log("OTP sent successfully");
              } catch (error) {
                console.log(error);
              }
            }}
          >
            Send OTP
          </button>

          {sentOtp && (
            <>
              <div className="form-floating mb-3 w-50">
                <input
                  type="number"
                  className="form-control"
                  id="otpInput"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                />
                <label htmlFor="otpInput">Enter OTP</label>
                <p className="mt-2 text-success">
                  OTP sent to +91 {user?.phone}
                </p>
                <div className="d-flex justify-content-between align-items-center">
                  <p
                    className="text-primary cursor-pointer"
                    onClick={handelResend}
                  >
                    Resend OTP
                  </p>
                  <p>
                    <CountDown initialMinutes={1} initialSeconds={0} />
                  </p>
                </div>
                <button
                  className={`btn btn-${verifyotp ? "success" : "danger"} mt-2`}
                  onClick={handelVerify}
                >
                  {verifyotp ? "Verified" : "Verify OTP"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
