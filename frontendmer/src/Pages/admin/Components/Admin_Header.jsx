import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TfiMenu } from "react-icons/tfi";
import { useDispatch } from "react-redux";
import { clearAuth } from "../../../State/auth_action";
import toast, { Toaster } from "react-hot-toast";
import AdminSearchFrom from "./AdminSearchFrom";

const Admin_Header = () => {
  const [Loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handelLogout = () => {
    setLoading(true);
    setTimeout(() => {
      dispatch(clearAuth());
      localStorage.removeItem("auth-Data");
      setLoading(false);
      toast.success("Logout Successfully");
      navigate("/login");
    }, 1000);
  };

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <header>
        <nav
          id="main-navbar"
          className="navbar navbar-expand-lg navbar-light bg-white fixed-top mx-auto"
        >
          <div className="container-fluid">
            <Link to={"/dashboard/admin"} className="navbar-brand text-primary">
              Valuekarts <small className="text-muted ms-2"> Logistics</small>
            </Link>

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon">
                <TfiMenu />
              </span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link
                    to={"/dashboard/admin/product-list"}
                    className="nav-link text-black"
                  >
                    Products
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to={"/dashboard/admin/category-list"}
                    className="nav-link text-black"
                  >
                    Categories
                  </Link>
                </li>
                
                
                 <li className="nav-item">
                  <Link
                    to={"/create-merchant"}
                    className="nav-link text-black"
                  >
                    Create Merchant
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    to={"/dashboard/admin/merchant-list"}
                    className="nav-link text-black"
                  >
                    Merchant List
                  </Link>
                </li> 
              </ul>

              <div className="d-flex align-items-center ms-3">
                <AdminSearchFrom />

                <div className="dropdown ms-3">
                  <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="fas fa-user" />
                  </button>
                  <ul className="dropdown-menu cursor-pointer">
                    <li
                      onClick={handelLogout}
                      className="dropdown-item cursor-pointer"
                    >
                      Logout
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Admin_Header;
