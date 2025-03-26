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


const MerchantInfo = () => {
    const [loading, setLoading] = useState(false);
      const [productCounts, setProductCounts] = useState({}); // Store total products for each user
    
        const authData = localStorage.getItem("auth-Data");
        if (!authData) return null; // Return null if no data is found
        const parsedData = JSON.parse(authData); // Convert JSON string back to object
    const [totalProducts, setTotalProducts] = useState(0);
    
    console.log(parsedData.user);
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
    
  return (
    <>
      <Merchant_Header />
      {loading ? (
        <Loader />
      ) : (
        <div className="container mt-5">
          <div className="row mb-0">
            <div className="col-12" style={{marginTop: "50px" }}>
              <Backbutton path={"/dashboard/merchant"} />
            </div>
          </div>

        <h1 className="text-center mb-5 ">Hello {parsedData.user.name}</h1>
         
        <div className="container mt-5 d-flex justify-content-center">
      <div className="" style={{width:"400px" ,borderRadius: "15px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", overflow: "hidden", transition: "transform 0.3s",textAlign:"center" }}>
        <div className="merchant-info" style={{ padding: "20px" }}>
          <h4 className="mb-2">Name : {parsedData.user.name }</h4>
          <br></br>
          <p className="text-muted mb-1">Phone Number: {parsedData.user.phone }</p>
          <br></br>
          <p className="text-muted">Email: {parsedData.user.email }</p>
          <br></br>
          <p className="text-muted">Shopname: {parsedData.user.shop }</p>
          <br></br>
            <p className="text-muted">Address: {parsedData.user.address }</p>
            <br></br>
            <p>Total products : {totalProducts }</p>
            <br></br>
            <h2>Bank Details</h2>
            <p>Bank Name:  {parsedData.user.bankName }</p>
            <p>Bank Account Number:  {parsedData.user.accountNumber }</p>
            <p>IFSC Code:  {parsedData.user.ifscCode }</p>


        </div>
      </div>
    </div>
      
          <div className="row">
           

          </div>
        </div>
      )}
              <Footer />
    </>
  );
};

export default MerchantInfo;
