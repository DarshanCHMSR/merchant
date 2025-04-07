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
import Select from "react-select";
import ReactPaginate from 'react-paginate';


const BankInfo = () => {
    const [loading, setLoading] = useState(false);
      const navigate = useNavigate();
      const [senting,setSenting] = useState(false)
    
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
    
    const bankOptions2 = [
      { label: "Select Bank", value: "Select Bank" },
      { label: "Allahabad Bank", value: "Allahabad Bank" },
      { label: "Andhra Bank", value: "Andhra Bank" },
      { label: "Axis Bank", value: "Axis Bank" },
      { label: "Bandan Bank", value: "Bandan Bank" },
      { label: "Bank of Bahrain and Kuwait", value: "Bank of Bahrain and Kuwait" },
      { label: "Bank of Baroda", value: "Bank of Baroda" },
      { label: "Bank of India", value: "Bank of India" },
      { label: "Bank of Maharashtra", value: "Bank of Maharashtra" },
      { label: "Bassein Catholic Co-operative Bank", value: "Bassein Catholic Co-operative Bank" },
      { label: "Bhartiya Mahila Bank", value: "Bhartiya Mahila Bank" },
      { label: "BNP Paribas", value: "BNP Paribas" },
      { label: "Canara Bank", value: "Canara Bank" },
      { label: "Catholic Syrian Bank", value: "Catholic Syrian Bank" },
      { label: "Central Bank of India", value: "Central Bank of India" },
      { label: "City Union Bank", value: "City Union Bank" },
      { label: "Corporation Bank", value: "Corporation Bank" },
      { label: "Cosmos Bank", value: "Cosmos Bank" },
      { label: "DCB BANK Personal", value: "DCB BANK Personal" },
      { label: "Dena Bank", value: "Dena Bank" },
      { label: "Deustche Bank", value: "Deustche Bank" },
      { label: "Development Credit Bank", value: "Development Credit Bank" },
      { label: "Dhanlaxmi Bank", value: "Dhanlaxmi Bank" },
      { label: "Federal Bank", value: "Federal Bank" },
      { label: "HDFC Bank", value: "HDFC Bank" },
      { label: "ICICI Bank", value: "ICICI Bank" },
      { label: "IDBI Bank", value: "IDBI Bank" },
      { label: "Indian Bank", value: "Indian Bank" },
      { label: "Indian Overseas NetBanking", value: "Indian Overseas NetBanking" },
      { label: "Indusind Bank", value: "Indusind Bank" },
      { label: "ING Vysya Bank", value: "ING Vysya Bank" },
      { label: "J and K Bank", value: "J and K Bank" },
      { label: "Janta Sahakari Bank", value: "Janta Sahakari Bank" },
      { label: "Karnataka Bank", value: "Karnataka Bank" },
      { label: "Karur Vysya Bank", value: "Karur Vysya Bank" },
      { label: "Kotak Mahindra Bank", value: "Kotak Mahindra Bank" },
      { label: "Lakshmi Vilas Bank", value: "Lakshmi Vilas Bank" },
      { label: "Mehsana Urban Co-op Bank", value: "Mehsana Urban Co-op Bank" },
      { label: "NKGSB Co-operative Bank", value: "NKGSB Co-operative Bank" },
      { label: "Oriental Bank Of Commerce", value: "Oriental Bank Of Commerce" },
      { label: "Punjab & Sind Bank", value: "Punjab & Sind Bank" },
      { label: "Punjab and Maharashtra Cooperative Bank", value: "Punjab and Maharashtra Cooperative Bank" },
      { label: "Punjab National Bank", value: "Punjab National Bank" },
      { label: "Ratnakar Bank Limited", value: "Ratnakar Bank Limited" },
      { label: "RBL Bank", value: "RBL Bank" },
      { label: "Saraswat Cooperative Bank", value: "Saraswat Cooperative Bank" },
      { label: "Shamrao Vithal Cooperative Bank", value: "Shamrao Vithal Cooperative Bank" },
      { label: "South Indian Bank", value: "South Indian Bank" },
      { label: "Standard Chartered Bank", value: "Standard Chartered Bank" },
      { label: "State Bank Of Bikaner and Jaipur", value: "State Bank Of Bikaner and Jaipur" },
      { label: "State Bank of Hyderabad", value: "State Bank of Hyderabad" },
      { label: "State Bank of India", value: "State Bank of India" },
      { label: "State Bank of Mysore", value: "State Bank of Mysore" },
      { label: "State Bank of Patiala", value: "State Bank of Patiala" },
      { label: "State Bank of Travancore", value: "State Bank of Travancore" },
      { label: "SVC Bank", value: "SVC Bank" },
      { label: "Syndicate Bank", value: "Syndicate Bank" },
      { label: "Tamilnad Mercantile Bank", value: "Tamilnad Mercantile Bank" },
      { label: "Tamilnadu Cooperative Bank", value: "Tamilnadu Cooperative Bank" },
      { label: "The Kalyan Janata Sahakari Bank", value: "The Kalyan Janata Sahakari Bank" },
      { label: "The Royal Bank of Scotland", value: "The Royal Bank of Scotland" },
      { label: "TJSB Bank (Erstwhile Thane Janata Sahakari Bank)", value: "TJSB Bank (Erstwhile Thane Janata Sahakari Bank)" },
      { label: "UCO Bank", value: "UCO Bank" },
      { label: "Union Bank of India", value: "Union Bank of India" },
      { label: "United Bank Of India", value: "United Bank Of India" },
      { label: "Vijaya Bank", value: "Vijaya Bank" },
      { label: "Yes Bank", value: "Yes Bank" }
  ];
  


      
      const handleBankChange = (selectedOption) => {
        setFormData({ ...formData, bankName: selectedOption ? selectedOption.value : "" });
      };
    
    
      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value.toUpperCase() });
    };
    setSenting("true");
    const olduserName = parsedData.user.userName || "";
    const oldaccountNumber = parsedData.user.accountNumber || "";
    const oldifscCode = parsedData.user.ifscCode || "";
    const oldbankName = parsedData.user.bankName  || "";
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
              alert("Bank Details Submitted!");
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
            console.error("Error updating user:", error);}
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
            <label className="form-label">Select Your bank name</label>
            <input
              type="text"
              name="oldbankName"
              value={oldbankName}
              style={{display: "none"}}
              className="form-control"
              placeholder="Enter Bank Name"
              required
            />
        <Select
  options={bankOptions2}
  name="bankName"
  value={bankOptions2.find((option) => option.value === formData.bankName)}
  onChange={handleBankChange}
  placeholder="Search and select your bank"
  isSearchable
  // className="form-control"
/>
          </div>
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
              type="number"
              minLength={10}
              name="oldaccountNumber"
              value={oldaccountNumber}
              style={{display: "none"}}
              className="form-control"
              placeholder="Enter account number"
              required
            />
            <input
              type="number"
              minLength={10}
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

          <button type="submit" className="btn btn-primary w-100">
          {senting ? "Submitting..." : "Submit"}

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
