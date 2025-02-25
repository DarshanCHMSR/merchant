import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "/src/assets/css/style.css";
import { useDispatch, useSelector } from "react-redux";
import { clearAuth } from "../State/auth_action";
import { setCart } from "../State/cart_actions";
import toast, { Toaster } from "react-hot-toast";
import { RiDashboardFill } from "react-icons/ri";
import SearchInput from "./forms/SearchInput";

const Header = () => {
  const cartItems = useSelector((state) => state.cart.cart);
  const labour = useSelector((state) => state.cart.labour);
  const events = useSelector((state) => state.cart.events);

  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handelLogout = () => {
    dispatch(clearAuth());
    localStorage.removeItem("auth-Data");
    toast.success("Logout Successfully");
  };

  useEffect(() => {
    if (auth?.user) {
      if (auth?.user?.cart?.length > 0) {
        dispatch(setCart(auth?.user?.cart));
      } else {
        let localcart = localStorage.getItem("product-cart");
        if (localcart) {
          dispatch(setCart(JSON.parse(localcart)));
        }
      }
    }
  }, [auth?.user]);

  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const navigate = useNavigate();

  const handleLinkClick = (route) => {
    setShowOffcanvas(false);
    navigate(route);
  };

  return (
    <>
      <div className="main-header custom-header">
        <Toaster position="top-center" reverseOrder={false} />
        <div className="container">
          <div className="row align-items-center py-2">
            {/* Logo Section */}
            <div className="col-lg-2 col-md-3 col-6 text-center text-md-start mb-2 mb-md-0">
              <Link to={"/"}>
                <img
                  src="https://valuekarts-img-data.s3.ap-south-1.amazonaws.com/LOGO.webp"
                  alt="Logo"
                  id="logoimg"
                  className="img-fluid"
                />
              </Link>
            </div>

            {/* Search Input Section */}
            <div className="col-lg-5 col-md-6 d-none d-md-block">
              <SearchInput />
            </div>

            {/* User Actions Section */}
            <div className="col-lg-5 col-md-3 col-6 text-end d-flex justify-content-end align-items-center">
              {!auth.user ? (
                <Link
                  to={"/signup"}
                  className="btn me-2 d-flex shadow-0 align-items-center"
                >
                  <i className="fas fa-user-alt me-1"></i>
                  <span className="d-none d-md-inline">Sign In</span>
                </Link>
              ) : (
                <>
                  <Link
                    to={"/login"}
                    className="btn  shadow-0 text-danger me-2 d-flex align-items-center"
                    onClick={handelLogout}
                  >
                    <i className="fas fa-sign-out-alt me-1"></i>
                    <span className="d-none d-md-inline">Logout</span>
                  </Link>

                  <Link
                    to={`/dashboard/${
                      auth?.user?.role === 1 ? "admin" : "user"
                    }`}
                    className="btn shadow-0 text-black me-2 d-flex align-items-center"
                  >
                    <RiDashboardFill className="me-1" />
                    <span className="d-none d-md-inline">Dashboard</span>
                  </Link>
                </>
              )}

              <Link
                to={"/cart"}
                className="btn shadow-0 text-primary d-flex align-items-center"
              >
                <i className="fas fa-shopping-cart me-1"></i>
                <span className="d-none d-md-inline">
                  My Cart({cartItems.length + events.length + labour.length})
                </span>
              </Link>
            </div>

            {/* Search Input Section (for mobile) */}
            <div className="col-12 d-md-none mt-2">
              <SearchInput />
            </div>
          </div>
        </div>

        {/* Tool Bar */}

        {/* <Header_Menu /> */}
        <nav className="navbar navbar-expand-lg navbar-light bg-primary header-menu">
          <div className="container justify-content-start justify-content-md-between">
            <div className="d-lg-none">
              <button
                className="btn btn-outline-light"
                type="button"
                onClick={() => setShowOffcanvas(true)}
              >
                <i className="fas fa-bars text-light"></i>
              </button>

              {showOffcanvas && (
                <div
                  className="offcanvas offcanvas-start show"
                  data-bs-backdrop="static"
                  tabIndex="-1"
                  id="staticBackdrop"
                  aria-labelledby="staticBackdropLabel"
                >
                  <div className="offcanvas-header d-flex justify-content-between w-100">
                    <h5 className="offcanvas-title" id="staticBackdropLabel">
                      Menu
                    </h5>
                    <button
                      type="button"
                      className="btn-close align-self-end"
                      onClick={() => setShowOffcanvas(false)}
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="offcanvas-body">
                    <ul
                      className="nav flex-column w-100"
                      style={{ listStyleType: "none", padding: 0 }}
                    >
                      <li className="nav-item">
                        <button
                          className="btn btn-primary bg-light text-dark w-100 mb-2"
                          onClick={() => handleLinkClick("/")}
                        >
                          Home
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          className="btn btn-primary bg-light text-dark w-100 mb-2"
                          onClick={() => handleLinkClick("/about-us")}
                        >
                          About Us
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          className="btn btn-primary bg-light text-dark w-100 mb-2"
                          onClick={() => handleLinkClick("/productView")}
                        >
                          Products
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          className="btn btn-primary bg-light text-dark w-100 mb-2"
                          onClick={() => handleLinkClick("/order-tracking")}
                        >
                          Order and Tracking
                        </button>
                      </li>
                      <li className="nav-item">
                        <div className="dropdown w-100">
                          <button
                            className="btn btn-primary bg-light text-dark w-100 dropdown-toggle"
                            type="button"
                            id="dropdownMenuButton"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            Others
                          </button>
                          <ul
                            className="dropdown-menu w-100"
                            aria-labelledby="dropdownMenuButton"
                          >
                            <li>
                              <a
                                className="dropdown-item bg-light text-dark"
                                href="#"
                              >
                                Services
                              </a>
                            </li>
                            <li>
                              <button
                                className="dropdown-item bg-light text-dark"
                                onClick={() => handleLinkClick("/contact-us")}
                              >
                                Contact Us
                              </button>
                            </li>
                          </ul>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div
              className="collapse navbar-collapse d-lg-block"
              id="navbarLeftAlignExample"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <div
                  className="btn-group tool-bar-hover"
                  role="group"
                  aria-label="Button group with nested dropdown "
                >
                  <Link
                    to={`/`}
                    type="button"
                    className="btn btn-primary nav-item bg-light text-dark"
                    style={{ fontSize: "12px" }}
                  >
                    Home
                  </Link>
                  <Link
                    to={"/about-us"}
                    type=" button"
                    className="btn btn-primary nav-item bg-light text-dark tool-bar-hover"
                    style={{ fontSize: "12px" }}
                  >
                    About us
                  </Link>
                  <Link
                    to={"/productView"}
                    type=" button"
                    className="btn btn-primary nav-item bg-light text-dark tool-bar-hover"
                    style={{ fontSize: "12px" }}
                  >
                    Products
                  </Link>

                  <Link
                    to={"/order-tracking"}
                    type=" button"
                    className="btn btn-primary nav-item bg-light text-dark tool-bar-hover"
                    style={{ fontSize: "12px" }}
                  >
                    Order and Tracking
                  </Link>

                  <div className="btn-group" role="group">
                    <button
                      type="button"
                      className="btn btn-primary dropdown-toggle bg-light text-dark"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      style={{ fontSize: "12px" }}
                    >
                      Others
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <a
                          className="dropdown-item bg-light text-dark"
                          href="#"
                          style={{ fontSize: "12px" }}
                        >
                          Services
                        </a>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item bg-light text-dark"
                          to={"/contact-us"}
                          style={{ fontSize: "12px" }}
                        >
                          Contact Us
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </ul>
            </div>
          </div>
        </nav>
      </div>

      {/* <!-- Jumbotron --> */}

      {/* Tool Bar */}
    </>
  );
};
export default Header;
