import axios from "axios";
import React, { useEffect, useState } from "react";
import Loader from "../../../Components/Loading/Loader";
import Merchant_Header from "../Components/Merchant_Header";
import { Link, useNavigate } from "react-router-dom";
import Backbutton from "../../../Components/Backbutton";
import { url } from "../../../Components/backend_link/data";
import Footer from "../../Footer";

const BankInfo = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [accountNumber, setAccountNumber] = useState("");
    const [ifscCode, setIfscCode] = useState("");
    const [bankName, setBankName] = useState("");
    const [userName, setUserName] = useState("");
    const [coAccountNumber, setCoAccountNumber] = useState("");

    const authData = localStorage.getItem("auth-Data");
    if (!authData) return null; // Return null if no data is found
    const parsedData = JSON.parse(authData); // Convert JSON string back to object
    const id = parsedData.user._id;
    const token = parsedData.token;

    const bankOptions2 = [
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
        setBankName({ bankName: selectedOption ? selectedOption.value : "" });
    };
    const [senting, setSenting] = useState(false);
    const olduserName = parsedData.user.userName || "";
    const oldaccountNumber = parsedData.user.accountNumber || "";
    const oldifscCode = parsedData.user.ifscCode || "";
    const oldbankName = parsedData.user.bankName || "";
console.log("the name",olduserName,oldaccountNumber,oldifscCode,oldbankName)
console.log("the usernew name",userName,accountNumber,ifscCode,bankName,coAccountNumber)
const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("The form submitted");
  setSenting(true);

  // Validation
  if (accountNumber.trim() !== coAccountNumber.trim()) {
    alert("Account Number does not match");
    setSenting(false);
    return;
  }

  const ifscRegex = /^[A-Z]{4}[0-9]{7}$/;
  if (!ifscRegex.test(ifscCode)) {
    alert("Invalid IFSC Code");
    setSenting(false);
    return;
  }

  try {
    // Create a plain object for the data
    const userData = {
      userName,
      accountNumber,
      ifscCode,
      bankName,
      coAccountNumber,
    };

    // Send the data to the backend using axios
    const res = await axios.put(`${url}/api/v2/auth/update-user/${id}`, userData, {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });
    const access_keys= import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
    const formDatas = new FormData(e.target);
    formDatas.append("access_key", access_keys);

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formDatas,
    });
    const data = await response.json();
    console.log("Response from Web3Forms:", data);

    if (res.data.success) {
      alert("Bank Details Submitted!");
      navigate("/");
      setAccountNumber("");
      setIfscCode("");
      setBankName("");
      setUserName("");
      setCoAccountNumber("");
      localStorage.setItem("auth-Data", JSON.stringify(res.data));
    } else {
      toast.error(res.data.message);
    }
  } catch (error) {
    console.error("Error updating user:", error);
    alert("Failed to submit bank details. Please try again.");
  } finally {
    setSenting(false);
  }
};

    return (
        <>
            <Merchant_Header />
            {loading ? (
                <Loader />
            ) : (
                <div className="container mt-7" style={{ marginTop: "150px" }}>
                    <div className="card shadow p-4">
                        <h2 className="text-center mb-4">Enter Bank Details</h2>
                        <form onSubmit={handleSubmit}>
                        <div className="mb-3">
    <label className="form-label">Bank Name</label>
    <input
      type="text"
      name="oldbankName"
      value={oldbankName} 
      style={{display: "none"}}
    
    />
    <select
      name="bankName"
      value={bankName}
      onChange={(e) => setBankName(e.target.value)}
      className="form-control"
      required
    >
      <option value="">Select Bank</option>
      {bankOptions2.map((bank, index) => (
        <option key={index} value={bank.value}>
          {bank.label}
        </option>
      ))}
    </select>
  </div>
  <div className="mb-3">
    <label className="form-label">User Name as in account</label>
    <input
      type="text"
      name="olduserName"
      value={olduserName}
      style={{display: "none"}}
    />
    <input
      type="text"
      name="userName"
      value={userName}
      onChange={(e) => setUserName(e.target.value)}
      className="form-control"
      placeholder="Enter user name"
      required
    />
  </div>
  <div className="mb-3">
    <label className="form-label">Account Number</label>
    <input
      type="number"
      name="oldaccountNumber"
      value={oldaccountNumber}
      style={{display: "none"}}

    />
    <input
      type="number"
      name="accountNumber"
      value={accountNumber}
      onChange={(e) => setAccountNumber(e.target.value)}
      className="form-control"
      placeholder="Enter account number"
      required
    />
  </div>
  <div className="mb-3">
    <label className="form-label">Confirm Account Number</label>
    <input
      type="number"
      name="coAccountNumber"
      value={coAccountNumber}
      onChange={(e) => setCoAccountNumber(e.target.value)}
      className="form-control"
      placeholder="Re-enter account number"
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

    />
    <input
      type="text"
      name="ifscCode"
      value={ifscCode}
      onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
      className="form-control"
      placeholder="Enter IFSC Code"
      required
    />
  </div>
 
  <button type="submit" className="btn btn-primary w-100" disabled={senting}>
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
