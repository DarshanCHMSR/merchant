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
  const [vendorName, setVendorName] = useState("");

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const navigate = useNavigate();

  useEffect(() => {
    if (vendorName.trim().length > 0) {
      const debounceTimeout = setTimeout(() => {
        fetchVendorSuggestions(vendorName);
      }, 300);
  
      return () => clearTimeout(debounceTimeout);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [vendorName]);
  
  


  const handleDownload = async () => {
    try {
     
      const response = await axios.get(`${url}/api/v2/products/exportuser`, {
        responseType: "blob", // Ensure we get binary data
      });

      // Create a URL for the file
      const url2 = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url2;
      link.setAttribute("download", "products.csv"); // File name
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url2);
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  }

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [products, setProducts] = useState([]);
  
    const fetchProductsByDate = async () => {
      if (!startDate || !endDate) {
        alert("Please select both start and end dates.");
        return;
      }
    
      try {
        const response = await axios.get(
          `${url}/api/v2/products/by-date?startDate=${startDate}&endDate=${endDate}`,
          { responseType: "blob" } // Correct usage in Axios
        );
    
        const url2 = window.URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = url2;
        link.setAttribute("download", "products.csv");
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url2);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    
    
  
  const handleDownload2 = async () => {
    try {
     
      const response = await axios.get(`${url}/api/v2/products/exportuserbylast5`, {
        responseType: "blob", // Ensure we get binary data
      });

      // Create a URL for the file
      const url3 = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url3;
      link.setAttribute("download", "products.csv"); // File name
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url3);
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  }
  

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);


  const fetchVendorSuggestions = async (query) => {
    try {
      const response = await axios.get(`${url}/api/v2/products/vendors/search/${query}`);
      if (response.data && response.data.length > 0) {
        setSuggestions(response.data);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error("Error fetching vendor suggestions:", error);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };
  

  const handleSelect = (name) => {
    setVendorName(name);
    setShowSuggestions(false);
  };


  return (
    <>
      {Loading ? (
        <Loader />
      ) : (
        <div>
          <Toaster />

          <Admin_Header />
         

    <div className="dash" style={{ fontFamily: "sans-serif", marginTop: "50px", backgroundColor: "#f4f4f4", textAlign: "center", padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "50px" }}>Admin Dashboard</h1>
      <div className="container bg-white p-4 rounded shadow-sm" style={{ maxWidth: "500px", margin: "auto" }}>
        <h3 className="mb-4">Download Excel file of all products by date</h3>

        <div className="download-buttons mb-3">
          <button
            className="btn btn-primary "
            onClick={fetchProductsByDate}
            style={{ padding: "10px", fontSize: "16px" }}
          >
            Download Excel file
          </button>
        </div>

        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-6">
            <label className="form-label fw-bold">From:</label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label fw-bold">To:</label>
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>

    <div className="dash" style={{fontFamily:"sans-serif",marginTop:"50px",backgroundColor:"#f4f4f4",textAlign:"center",padding:"20px"}} >
          <div className="container" style={{maxWidth:"500px",margin:"auto",background:"white",padding:"20px",borderRadius:"10px",boxShadow:"0 0 10px rgba(0,0,0,0.1)"}}>

        <div className="date-section" style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",marginTop:"20px",padding:"30px",border:"2px solid #007BFF",borderRadius:"5px",background:"#f9f9f9"}}>
       <h4>Download Excel file of all products till now</h4>
        <div className="download-buttons">
            <button className="btn" onClick={handleDownload} style={{flex:1,margin:"0,5px",marginTop:"20px",padding:"10px",border:"none",borderRadius:"5px",backgroundColor:"#007BFF",color:"white",fontSize:"16px",cursor:"pointer",transition:"all 0.3s ease"}}>Download Excel</button>
        </div>
        </div>
        

    </div>
    </div>
    <div className="dash" style={{fontFamily:"sans-serif",marginTop:"50px",backgroundColor:"#f4f4f4",textAlign:"center",padding:"20px"}} >
          {/* <h1 style={{textAlign:"center",marginBottom:"50px"}}>Admin Dashboard</h1> */}
          <div className="container" style={{maxWidth:"500px",margin:"auto",background:"white",padding:"20px",borderRadius:"10px",boxShadow:"0 0 10px rgba(0,0,0,0.1)"}}>

        <div className="date-section" style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",marginTop:"20px",padding:"30px",border:"2px solid #007BFF",borderRadius:"5px",background:"#f9f9f9"}}>
       <h4>Download Excel file of recent 5 entries</h4>
        <div className="download-buttons">
            <button className="btn"  onClick={handleDownload2} style={{flex:1,margin:"0,5px",marginTop:"20px",padding:"10px",border:"none",borderRadius:"5px",backgroundColor:"#007BFF",color:"white",fontSize:"16px",cursor:"pointer",transition:"all 0.3s ease"}}>Download Excel</button>
        </div>
        </div>
        

    </div>
    </div>
        </div>
        
      )}
    </>
  );
};

export default AdminDashboard;
