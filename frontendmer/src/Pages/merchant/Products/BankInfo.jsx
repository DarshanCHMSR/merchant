import axios from "axios";
import React, { useEffect, useState } from "react";
import Loader from "../../../Components/Loading/Loader";
import Merchant_Header from "../Components/Merchant_Header";
import { Link,useNavigate } from "react-router-dom";
import Backbutton from "../../../Components/Backbutton";
import { url } from "../../../Components/backend_link/data";
import SetStatus from "./SetStatus";
import { useSelector } from "react-redux";
import Footer from "../../Footer";
import ReactPaginate from 'react-paginate';


const BankInfo = () => {
    const [loading, setLoading] = useState(false);
      const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        accountNumber: "",
        ifscCode: "",
        bankName: "",
        userName: "",
        coAccountNumber: "",
      });
      const authData = localStorage.getItem("auth-Data");
        if (!authData) return null; // Return null if no data is found
        const parsedData = JSON.parse(authData); // Convert JSON string back to object
    const id = parsedData.user._id;
    const token = parsedData.token;
      const bankOptions = [
        "Select Bank",
        //"Public Sector Banks",
        "State Bank of India",
        "Punjab National Bank",
        "Bank of Baroda",
        "Canara Bank",
        "Union Bank of India",
        "Bank of India",
        "Indian Bank",
        "Central Bank of India",
        "UCO Bank",
        "Bank of Maharashtra",
        "Indian Overseas Bank",
        "Punjab & Sind Bank",
        //"Private Sector Banks",
        "HDFC Bank",
        "ICICI Bank",
        "Axis Bank",
        "Kotak Mahindra Bank",
        "IndusInd Bank",
        "Yes Bank",
        "Federal Bank",
        "South Indian Bank",
        "IDFC FIRST Bank",
        "RBL Bank",
        "Bandhan Bank",
        "Tamilnad Mercantile Bank",
        "Karnataka Bank",
        "DCB Bank",
        "City Union Bank",
        "Karur Vysya Bank",
        "Nainital Bank",
        

      ];
    
      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    const olduserName = parsedData.user.userName;
    const oldaccountNumber = parsedData.user.accountNumber;
    const oldifscCode = parsedData.user.ifscCode;
    const oldbankName = parsedData.user.bankName;
      const handleSubmit = async (e) => {
        e.preventDefault();
        if(formData.accountNumber !== formData.coAccountNumber){
            alert("Account Number does not match");
            return;
        }
        try {
            const res = await axios.put(`${url}/api/v2/auth/update-user/${id}`, {
                
                accountNumber: formData.accountNumber,
                ifscCode: formData.ifscCode,
                bankName: formData.bankName,
                userName: formData.userName,
                coAccountNumber: formData.coAccountNumber,
            },
            {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            }
        );
        const access_keys= import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
      const formDatas = new FormData(e.target);
      formDatas.append("access_key", access_keys);
  
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formDatas,
      });
      const data = await response.json();

            if (res.data.success) {
              navigate("/");
             setFormData({
                accountNumber: "",
                ifscCode: "",
                bankName: "",
                userName: "",
                coAccountNumber: "",
                });
              toast.success(res.data.message);
              localStorage.setItem("auth-Data", JSON.stringify(res.data));

      
            } else {
              // alert(res.data.message);
              toast.error(res.data.message);
            }
          } catch (error) {

          }
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
            <label className="form-label">User Name as in account</label>
            <input
              type="text"
              name="olduserName"
              value={olduserName}
             style={{display: "none"}}
              className="form-control"
              placeholder="Enter user name"
              required
            />
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter user name"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Account Number</label>
            <input
              type="text"
              name="oldaccountNumber"
              value={oldaccountNumber}
              style={{display: "none"}}
              className="form-control"
              placeholder="Enter account number"
              required
            />
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
            <label className="form-label">Confirm Account Number</label>
            <input
              type="text"
              name="coAccountNumber"
              value={formData.coAccountNumber}
              onChange={handleChange}
              className="form-control"
              placeholder="Renter Account Number"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">IFSC Code</label>
            <input
              type="text"
              name="oldifscCode"
              value={oldifscCode}
              style={{display: "none"}} 
              className="form-control"
              placeholder="Enter IFSC Code"
              required
            />
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
            <input
              type="text"
              name="oldbankName"
              value={oldbankName}
              style={{display: "none"}}
              className="form-control"
              placeholder="Enter Bank Name"
              required
            />
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
