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


const BankInfo = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        accountNumber: "",
        ifscCode: "",
        bankName: "",
      });
      const authData = localStorage.getItem("auth-Data");
        if (!authData) return null; // Return null if no data is found
        const parsedData = JSON.parse(authData); // Convert JSON string back to object
    console.log(parsedData.user._id);
    const id = parsedData.user._id;
    const token = parsedData.token;
    console.log(token);
      const bankOptions = [
        "Select Bank",
        "HDFC Bank",
        "ICICI Bank",
        "State Bank of India",
        "Axis Bank",
        "Punjab National Bank",
        "Kotak Mahindra Bank",
      ];
    
      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`${url}/api/v2/auth/update-user/${id}`, {
                
                accountNumber: formData.accountNumber,
                ifscCode: formData.ifscCode,
                bankName: formData.bankName,
            },
            {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            }
        );
            // console.log(res.data);
      
            if (res.data.success) {
             setFormData({
                accountNumber: "",
                ifscCode: "",
                bankName: "",
                });
              toast.success(res.data.message);
              
      
            } else {
              // alert(res.data.message);
              toast.error(res.data.message);
            }
          } catch (error) {

          }
        console.log("Form Data:", formData);
        alert("Bank Details Submitted!");
      };
    
    
      
    
  return (
    <>
      <Merchant_Header />
      {loading ? (
        <Loader />
      ) : (
        <div className="container mt-7" style={{marginTop: "150px" }}>
      <div className="card shadow p-4">
        <h2 className="text-center mb-4">Enter Bank Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Account Number</label>
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter account number"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">IFSC Code</label>
            <input
              type="text"
              name="ifscCode"
              value={formData.ifscCode}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter IFSC Code"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Bank Name</label>
            <select
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              className="form-select"
              required
            >
              {bankOptions.map((bank, index) => (
                <option key={index} value={bank === "Select Bank" ? "" : bank}>
                  {bank}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Submit
          </button>
        </form>
      </div>
    </div>  

      )}
              <Footer />
    </>
  );
};

export default BankInfo;
