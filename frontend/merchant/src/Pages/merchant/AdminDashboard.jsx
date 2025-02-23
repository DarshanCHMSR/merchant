import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../Components/Loading/Loader";
import "./admin.css";
import { useDispatch, useSelector } from "react-redux";
import { clearAuth } from "../../State/auth_action";
import toast, { Toaster } from "react-hot-toast";
import { MdDeliveryDining } from "react-icons/md";
import { MdEventAvailable } from "react-icons/md";
import { MdProductionQuantityLimits } from "react-icons/md";
import { FcSalesPerformance } from "react-icons/fc";
import Admin_Header from "./Components/Admin_Header";
import { url } from "../../Components/backend_link/data";
import axios from "axios";

const AdminDashboard = () => {
  const [Loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    fetchOrders();
    fetchUsers();
    totalProducts();
  }, []);

  const [orders, setOrders] = useState([]);

  const [orderData, setOrderData] = useState({
    totalAmt: 0,
    delivered: 0,
    pending: 0,
    cancelled: 0,
    totalOrders: orders.length,
    users: 0,
    productsCount: 0,
    outofstock: 0,
  });

  useEffect(() => {
    // Process orders to update orderData after orders are fetched
    const updateOrderData = () => {
      let delivered = 0;
      let pending = 0;
      let cancelled = 0;
      let totalAmt = 0;

      orders.forEach((order) => {
        if (order.status === "Delivered") {
          delivered += 1;
          order.products.forEach((product) => {
            totalAmt += product.price;
          });
        }
        if (order.status === "Cancelled") {
          cancelled += 1;
        }
        if (order.status === "Not Processed") {
          pending += 1;
        }
      });

      setOrderData((prevData) => ({
        ...prevData,
        delivered,
        pending,
        cancelled,
        totalAmt,
        totalOrders: orders.length,
      }));
    };

    if (orders.length > 0) {
      updateOrderData();
    }
  }, [orders]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${url}/api/v2/order/admin-orders`, {
        headers: {
          Authorization: auth.token,
        },
      });
      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${url}/api/v2/auth/get-users`, {
        headers: {
          Authorization: auth.token,
        },
      });

      if (res.data.success) {
        setOrderData((prevData) => ({
          ...prevData,
          users: res.data.count,
        }));
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const totalProducts = async () => {
    try {
      const res = await axios.get(`${url}/api/v2/products/get-products`, {
        headers: {
          Authorization: auth.token,
        },
      });

      setOrderData((prevData) => ({
        ...prevData,
        productsCount: res.data.total_products,
        outofstock: res.data.outofstock,
      }));
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <>
      {Loading ? (
        <Loader />
      ) : (
        <div>
          <Toaster />

          <Admin_Header />

          <main
            style={{
              marginTop: "58px",
            }}
          >
            <div className="container pt-4">
              <section>
                <div className="row">
                  <div className="col-xl-3 col-sm-6 col-12 mb-4">
                    <div className="card h-100">
                      <div className="card-body d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <MdEventAvailable
                            className="text-info"
                            style={{ fontSize: "3rem" }}
                          />
                        </div>
                        <div className="text-end">
                          <h3>0</h3>
                          <p className="mb-0">Event Bookings in the merchant</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-3 col-sm-6 col-12 mb-4">
                    <Link to="/dashboard/admin/review">
                      <div className="card">
                        <div className="card-body">
                          <div className="d-flex justify-content-between px-md-1">
                            <div className="align-self-center">
                              <i className="far fa-comment-alt text-warning fa-3x" />
                            </div>
                            <div className="text-end">
                              <p className="mb-0">User Reviews</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>

                  <div className="col-xl-3 col-sm-6 col-12 mb-4">
                    <div className="card">
                      <div className="card-body">
                        <div className="d-flex justify-content-between px-md-1">
                          <div className="align-self-center">
                            <i className="fas fa-map-marker-alt text-danger fa-3x" />
                          </div>
                          <div className="text-end">
                            <h3>{orderData.delivered}</h3>
                            <p className="mb-0">Total Orders Delivered</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-3 col-sm-6 col-12 mb-4">
                  <Link to = '/dashboard/admin/user-list'>
                    <div className="card h-100">
                      <div className="card-body d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                        <i className="far fa-user text-success fa-3x" />

                        </div>
                        <div className="text-end">
                        <h3 className="">{orderData.users}</h3>
                        <p className="mb-0">Total Users</p>
                        </div>
                      </div>
                    </div>
                    </Link>

                  </div>
                  </div>

                <div className="row">
                 


                  <div className="col-xl-3 col-sm-6 col-12 mb-4">
                    <div className="card h-100">
                      <div className="card-body d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                        <MdDeliveryDining className="far fa-user text-success fa-3x" />


                        </div>
                        <div className="text-end">
                        <h3 className="text-danger">0</h3>
                            <p className="mb-0">Delivery Partners</p>
                        </div>
                      </div>
                    </div>

                  </div>




                  <div className="col-xl-3 col-sm-6 col-12 mb-4">
                  <Link to="/dashboard/admin/outofstock-products">

                    <div className="card h-100">
                      <div className="card-body d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                        <img
                                src="https://imgs.search.brave.com/ZIQNk3H6GcjqE3xrfy7G9AL6-Ud1nFsW9TdlQ-U4ZwU/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA3LzI3LzUxLzA0/LzM2MF9GXzcyNzUx/MDQwN19ndHpOaXhZ/REhiMHJ6V2FPbkdF/cEVhRkZ3TUdHdFBL/ei5qcGc"
                                className="img-fluid "
                                alt=""
                                style={{
                                  width: "70px",
                                  height: "70px",
                                  objectFit: "contain",
                                  objectPosition: "center",
                                }}
                              />


                        </div>
                        <div className="text-end">
                        <h3 className="">{orderData.outofstock}</h3>
                        <p className="mb-0 text-danger">OUT OF STOCK</p>
                        </div>
                      </div>
                    </div>
                    </Link>

                  </div>

                </div>
              </section>
              <section>
                <div className="row">
                  <div className="col-xl-6 col-md-12 mb-4">
                    <div className="card">
                      <div className="card-body">
                        <Link to = {"/dashboard/admin/product-list"}>
                        <div className="d-flex justify-content-between p-md-1">
                          <div className="d-flex flex-row">
                            <div className="align-self-center">
                              {/* <i className="fas fa-pencil-alt text-info fa-3x me-4" /> */}
                              <MdProductionQuantityLimits className="fas fa-pencil-alt text-info fa-3x me-4" />
                            </div>
                            <div>
                              <h4>Total Products</h4>
                              <p className="mb-0"></p>
                            </div>
                          </div>
                          <div className="align-self-center">
                            <h2 className="h1 mb-0">
                              {orderData.productsCount}
                            </h2>
                          </div>
                        </div>
                        </Link>
                       
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-6 col-md-12 mb-4">
                    <Link to="/dashboard/admin/orders">
                      <div className="card">
                        <div className="card-body">
                          <div className="d-flex justify-content-between p-md-1">
                            <div className="d-flex flex-row">
                              <div className="align-self-center">
                                <i className="far fa-comment-alt text-warning fa-3x me-4" />
                              </div>
                              <div>
                                <h4>Orders</h4>
                                <p className="mb-0">Total Orders</p>
                              </div>
                            </div>
                            <div className="align-self-center">
                              <h2 className="h1 mb-0">
                                {orderData.totalOrders}
                              </h2>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xl-6 col-md-12 mb-4">
                    <div className="card">
                      <div className="card-body">
                        <div className="d-flex justify-content-between p-md-1">
                          <div className="d-flex flex-row">
                            <div className="align-self-center">
                              <h2 className="h1 mb-0 me-4">
                                Rs.{orderData.totalAmt}
                              </h2>
                            </div>
                            <div>
                              <h4>Total Sales</h4>
                              <p className="mb-0">Monthly Sales Amount</p>
                            </div>
                          </div>
                          <div className="align-self-center">
                            {/* <i className="far fa-heart text-danger fa-3x" /> */}
                            <FcSalesPerformance className="far fa-heart text-danger fa-3x" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;
