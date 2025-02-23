import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { url } from "../Components/backend_link/data";
import Loader from "../Components/Loading/Loader";
import DeletePopup from "../Components/popups/DeletePopup";
import ReturnPopup from "../Components/popups/ReturnPopup";
import moment from "moment";
import ReplacementPopup from "../Components/popups/ReplacementPopup";

const OrderTracking = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [replacementModal, setReplacementModal] = useState(false);

  const auth = useSelector((state) => state.auth);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${url}/api/v2/order/get-orders`, {
        headers: {
          Authorization: auth.token,
        },
      });
      setOrders(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("An error occurred while fetching orders");
      setLoading(false);
    }
  };

  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const [orderRatings, setOrderRatings] = useState({});

  const [currentOrderId, setCurrentOrderId] = useState(null); // State to hold ratings for each order

  const handleRating = (orderId, ratingValue) => {
    setOrderRatings((prevRatings) => ({
      ...prevRatings,
      [orderId]: ratingValue,
    }));
  };

  useEffect(() => {
    if (auth?.token) {
      fetchOrders();
    }
  }, [auth?.token]);

  const getStatusClass = (status) => {
    const statusClasses = {
      Processing: "text-warning",
      Shipped: "text-info",
      Delivered: "text-success",
      Cancelled: "text-danger",
      Default: "text-secondary",
    };
    return statusClasses[status] || statusClasses.Default;
  };

  const getProgressPercentage = (status) => {
    const progressPercentages = {
      Processing: "25%",
      Shipped: "50%",
      Delivered: "100%",
      Cancelled: "0%",
    };
    return progressPercentages[status] || "0%";
  };

  const handleShowModal = (type) => {
    if (type === "delete") {
      setShowDeleteModal(true);
    } else if (type === "return") {
      setShowReturnModal(true);
    } else if (type === "replacement") {
      setReplacementModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setShowReturnModal(false);
    setReplacementModal(false);
  };

  const handleRatingSubmit = async (orderId, productIds) => {
    try {
      const productRatings = productIds.reduce((acc, productId) => {
        acc[productId] = orderRatings[orderId] || 0;
        return acc;
      }, {});

      // Make the API request to submit ratings
      const response = await axios.post(
        `${url}/api/v2/order/rate/${orderId}`,
        {
          userId: auth?.user._id, // Replace with actual user ID from authentication state
          productRatings,
        },

        {
          headers: {
            Authorization: auth?.token,
          },
        }
      );

      if (response.status === 200) {
        console.log("Ratings submitted successfully!");
        // Optionally, you can update UI or notify the user
        setRatingSubmitted(true);
      } else {
        console.error("Failed to submit ratings:", response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <Loader />;
  }


  return (
    <div className="container mt-5 mb-5">
      {orders.length > 0 ? (
        <>
          <h2 className="mb-4 text-center">Order Tracking</h2>
          {orders.map((order) => {
            // Calculate if return period has expired
            const currentDate = moment();
            const returnExpiryDate = moment(order.returnExpiryDate);
            const replacementExpiryDate = moment(order.replacementExpiryDate);

            const isReturnExpired = currentDate.isAfter(returnExpiryDate);
            const isReplacementExpired = currentDate.isAfter(
              replacementExpiryDate
            );

            return (
              <div key={order._id} className="card mb-5 shadow-sm">
                <div className="card-body border border-secondary p-4">
                  <h5 className="card-title">Order ID: {order._id}</h5>
                  <p
                    className={`card-text ${getStatusClass(order.status)} mb-0`}
                  >
                    Status: {order.status} <i className="bi bi-truck ms-2"></i>
                  </p>
                  <p className="card-text">
                    {order.status !== "Cancelled" &&
                      order.status !== "Delivered" && (
                        <span>Estimated Delivery: 4 to 5 days</span>
                      )}
                    {order.status === "Delivered" && (
                      <span>
                        Delivered on{" "}
                        {new Date(order.deliveryDate).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </span>
                    )}
                  </p>

                  <div className="progress mb-3" style={{ height: "20px" }}>
                    <div
                      className={`progress-bar ${getStatusClass(order.status)}`}
                      role="progressbar"
                      style={{ width: getProgressPercentage(order.status) }}
                      aria-valuenow={parseInt(
                        getProgressPercentage(order.status)
                      )}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {getProgressPercentage(order.status)}
                    </div>
                  </div>

                  <h5 className="mt-4">Products:</h5>
                  <ul className="list-group">
                    {order.products.map((item) => (
                      <li key={item._id} className="list-group-item">
                        <img
                          src={item.imgLink[0]}
                          alt={item.name}
                          style={{ width: "100px", height: "100px" }}
                        />
                        <div className="row align-items-center">
                          <div className="col-6">
                            <span>{item.name}</span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {order.status === "Cancelled" ? (
                    <h3 className="text-center mt-4">Order cancelled</h3>
                  ) : (
                    <>
                      {order.status === "Delivered" && (
                        <div className="text-center mt-4">
                          <h5>Rate Your Experience</h5>

                          {ratingSubmitted ? (
                            <p className="mt-3">Thank you for your feedback!</p>
                          ) : (
                            <>
                              <div
                                style={{
                                  display: "inline-flex",
                                  cursor: "pointer",
                                  marginTop: "10px",
                                }}
                              >
                                {[...Array(5)].map((_, index) => (
                                  <svg
                                    key={index}
                                    onClick={() => {
                                      handleRating(order._id, index + 1);
                                    }}
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="30"
                                    height="30"
                                    fill={
                                      index < (orderRatings[order._id] || 0)
                                        ? "gold"
                                        : "gray"
                                    }
                                    viewBox="0 0 24 24"
                                    style={{ marginRight: "5px" }}
                                  >
                                    <path d="M12 .587l3.668 7.431 8.2 1.19-5.93 5.779 1.4 8.181-7.338-3.86-7.338 3.86 1.4-8.181-5.93-5.779 8.2-1.19z" />
                                  </svg>
                                ))}
                                <div>
                                  <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                      const productIds = order.products.map(
                                        (product) => product._id
                                      );
                                      handleRatingSubmit(order._id, productIds);
                                    }}
                                  >
                                    Submit
                                  </button>
                                </div>
                              </div>
                            </>
                          )}

                          <div className="mt-3">
                            {/* Conditionally render the return button */}
                            {!isReturnExpired && (
                              <>
                                <span className="text-black d-block mb-3">
                                  Last date to return{" "}
                                  {new Date(
                                    order.returnExpiryDate
                                  ).toLocaleDateString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </span>
                                <button
                                  className="btn btn-danger mt-3"
                                  onClick={() => {
                                    handleShowModal("return")
                                    setCurrentOrderId(order._id)
                                    }}>
                                  Return
                                </button>
                              </>
                            )}

                            {!isReplacementExpired && (
                              <>
                                <span className="text-black d-block mb-3">
                                  Last date for replacement{" "}
                                  {new Date(
                                    order.replacementExpiryDate
                                  ).toLocaleDateString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </span>
                                <button
                                  className="btn btn-primary mt-2"
                                  onClick={() =>{
                                     handleShowModal("replacement")
                                     setCurrentOrderId(order._id)
                                    }}
                                >
                                  Request Replacement
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      )}

                      {order.status === "Replacement" && (
                        <div className="text-center mt-4">
                          <h5>Replacement Requested</h5>
                        </div>
                      )}
                      
                      {order.status !== "Return" &&
                        order.status !== "Returned" &&
                        order.status !== "Cancelled" &&
                        order.status !== "Delivered" &&
                        order.status !== "Replacement" && (
                          <div className="mt-3">
                            <button
                              className="btn btn-danger"
                              onClick={() => {
                                handleShowModal("delete")
                                setCurrentOrderId(order._id)
                              }}
                            >
                              Cancel Order
                            </button>
                          </div>
                        )}
                    </>
                  )}
                </div>

                {showDeleteModal && (
                  <DeletePopup
                    show={showDeleteModal}
                    handleClose={handleCloseModal}
                    id={currentOrderId}
                  />
                )}

                {showReturnModal && (
                  <ReturnPopup
                    show={showReturnModal}
                    handleClose={handleCloseModal}
                    id={currentOrderId}
                  />
                )}

                {replacementModal && (
                  <ReplacementPopup
                    show={replacementModal}
                    handleClose={handleCloseModal}
                    id={currentOrderId}
                  />
                )}
              </div>
            );
          })}
        </>
      ) : (
        <h4 className="text-center">No orders found</h4>
      )}
    </div>
  );
};

export default OrderTracking;
