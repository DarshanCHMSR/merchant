import axios from "axios";
import React, { useEffect, useState } from "react";
import Loader from "../../../Components/Loading/Loader";
import Merchant_Header from "../Components/Merchant_Header";
import { Link } from "react-router-dom";
import Backbutton from "../../../Components/Backbutton";
import { url } from "../../../Components/backend_link/data";
import SetStatus from "./SetStatus";
import { useSelector } from "react-redux";
import Footer from "../../Footer";
import ReactPaginate from 'react-paginate';
import { set } from "mongoose";


const MerchantInfo = () => {
    const [loading, setLoading] = useState(false);
      const [productCounts, setProductCounts] = useState({}); // Store total products for each user
    
        const authData = localStorage.getItem("auth-Data");
        if (!authData) return null; // Return null if no data is found
        const parsedData = JSON.parse(authData); // Convert JSON string back to object
    const [totalProducts, setTotalProducts] = useState(0);
    const [userData, setUserData] = useState({});    
    
    useEffect(() => {
        const fetchTotalProducts = async () => {
          try {
            const res = await axios.get(`${url}/api/v2/products/fetchtotal/${parsedData.user._id}`);
            setTotalProducts(res.data.totalProducts);
          } catch (error) {
            console.error("Error fetching total products:", error);
          }
        };

        fetchTotalProducts();
      }, []);
      const fetchUserData = async () => {
        try {
          const res = await axios.get(`${url}/api/v2/auth/get-users/${parsedData.user._id}`);
          setUserData(res.data.user);
        } catch (error) {
          console.error("Error ", error);
        }
      };

      fetchUserData();
  return (
    <>  
      <Merchant_Header />
      {loading ? (
        <Loader />
      ) : (
        <div className="container mt-5">
        <div className="row mb-0">
          <div className="col-12" style={{ marginTop: "50px" }}>
            <Backbutton path={"/dashboard/merchant"} />
          </div>
        </div>
      
        <h1 className="text-center mb-5 display-4">Hello {parsedData.user.name}</h1>
        
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-sm" style={{ borderRadius: "15px" }}>
              <div className="card-body p-4">
                <div className="merchant-info text-center">
                  <h4 className="mb-4 text-primary">Merchant Profile</h4>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <p className="mb-2"><strong>Name:</strong></p>
                      <p className="text-muted">{parsedData.user.name}</p>
                    </div>
                    <div className="col-md-6">
                      <p className="mb-2"><strong>Phone Number:</strong></p>
                      <p className="text-muted">{parsedData.user.phone}</p>
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <p className="mb-2"><strong>Email:</strong></p>
                      <p className="text-muted">{parsedData.user.email}</p>
                    </div>
                    <div className="col-md-6">
                      <p className="mb-2"><strong>Shop Name:</strong></p>
                      <p className="text-muted">{parsedData.user.shop}</p>
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-12">
                      <p className="mb-2"><strong>Address:</strong></p>
                      <p className="text-muted">{parsedData.user.address}</p>
                    </div>
                  </div>
                  
                  <div className="row mb-4">
                    <div className="col-12">
                      <p className="mb-2"><strong>Total Products:</strong></p>
                      <p className="text-muted h5">{totalProducts}</p>
                    </div>
                  </div>
                  
                  <hr className="my-4" />
                  
                  <h5 className="mb-4 text-primary">Bank Details</h5>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <p className="mb-2"><strong>Account Holder:</strong></p>
                      <p className="text-muted">{userData.userName}</p>
                    </div>
                    <div className="col-md-6 mb-3">
                      <p className="mb-2"><strong>Account Number:</strong></p>
                      <p className="text-muted">{userData.accountNumber}</p>
                    </div>
                    <div className="col-md-6 mb-3">
                      <p className="mb-2"><strong>IFSC Code:</strong></p>
                      <p className="text-muted">{userData.ifscCode}</p>
                    </div>
                    <div className="col-md-6 mb-3">
                      <p className="mb-2"><strong>Bank Name:</strong></p>
                      <p className="text-muted">{userData.bankName}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}
              <Footer />
    </>
  );
};

export default MerchantInfo;
