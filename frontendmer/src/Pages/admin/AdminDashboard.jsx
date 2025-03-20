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
  


  const fetchProductsByVendor = async () => {
    if (!vendorName || !vendorName.trim()) { // ✅ Ensures vendorName is defined before calling trim()
      alert("Please enter a vendor name.");
      return;
    }
  
    try {
      const response = await axios.get(
        `${url}/api/v2/products/get-products-by-vendor/${vendorName}`, 
        { responseType: "blob" } // Ensure binary response
      );
  
      if (!response.data) {
        alert("No products found for this vendor.");
        return;
      }
  
      // Convert response to CSV file and download
      const file = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = file;
      link.setAttribute("download", "vendor_products.csv");
      document.body.appendChild(link);
      link.click();
  
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(file);
    } catch (error) {
      console.error("Error fetching vendor products:", error);
      alert("Failed to fetch products. Please check the vendor name.");
    }
  };
  

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);


  const fetchVendorSuggestions = async (query) => {
    try {
      const response = await axios.get(`${url}/api/v2/products/vendors/search/${query}`);
      console.log("Vendor suggestions:", response.data);
      if (response.data && response.data.length > 0) {
        setSuggestions(response.data);
        setShowSuggestions(true);
        console.log("Suggestions:", suggestions);
        console.log("ShowSuggestions:", showSuggestions);
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
          <div className="container mt-5" style={{fontFamily:"sans-serif",marginTop:"50px",backgroundColor:"#f4f4f4",textAlign:"center",padding:"20px"}}>
      <h3>Search Products by VendorName</h3>
          <div style={{ position: "relative", margin: "50px auto", width: "fit-content" }}>
          <input
  type="text"
  value={vendorName}
  onChange={(e) => setVendorName(e.target.value)}
  placeholder="Enter vendor name..."
  autoComplete="off"
  onBlur={() => setShowSuggestions(false)} // Hides suggestions when clicking outside
  onFocus={() => vendorName && setShowSuggestions(true)} // Shows suggestions if input is not empty
/>

      {showSuggestions && suggestions.length > 0 && (
        <ul style={{ position: "absolute", top: "100%", left: 0, background: "#fff", border: "1px solid #ccc", listStyle: "none", padding: 0 }}>
          {suggestions.map((vendor, index) => (
            <li key={index} onClick={() => handleSelect(vendor)} style={{ padding: "5px", cursor: "pointer" }}>
              {vendor}
            </li>
          ))}
        </ul>
      )}
      <button onClick={fetchProductsByVendor}>Fetch Products</button>
    </div>
    </div>

    <div className="dash" style={{fontFamily:"sans-serif",marginTop:"50px",backgroundColor:"#f4f4f4",textAlign:"center",padding:"20px"}} >

          <h1 style={{textAlign:"center",marginBottom:"50px"}}>Admin Dashboard</h1>
          <div className="container" style={{maxWidth:"500px",margin:"auto",background:"white",marginTop:"50px",padding:"20px",borderRadius:"10px",boxShadow:"0 0 10px rgba(0,0,0,0.1)"}}>
          <h3>Download Excel file of all products by date</h3>

        <div className="download-buttons">
            <button className="btn" onClick={fetchProductsByDate} style={{flex:1,margin:"0,5px",padding:"10px",border:"none",borderRadius:"5px",backgroundColor:"#007BFF",color:"white",fontSize:"16px",cursor:"pointer",transition:"all 0.3s ease"}}>Download Excel file</button>
        </div>

        <div className="date-section" style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"20px",padding:"15px",border:"2px solid #007BFF",borderRadius:"5px",background:"#f9f9f9"}}>
            <label style={{fontWeight:"bold",margin:"0 5px"}}>From:</label>
            <input type="date" className="date-input" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{padding:"8px",border:"1px solid #ccc",borderRadius:"5px",fontSize:"14px"}}/>
            <label style={{fontWeight:"bold",margin:"0 5px"}}>To:</label>
            <input type="date" className="date-input" value={endDate} onChange={(e) => setEndDate(e.target.value)}/>
        </div>
        

    </div>
    </div>
    <div className="dash" style={{fontFamily:"sans-serif",marginTop:"50px",backgroundColor:"#f4f4f4",textAlign:"center",padding:"20px"}} >
          <div className="container" style={{maxWidth:"500px",margin:"auto",background:"white",padding:"20px",borderRadius:"10px",boxShadow:"0 0 10px rgba(0,0,0,0.1)"}}>

        <div className="date-section" style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",marginTop:"20px",padding:"30px",border:"2px solid #007BFF",borderRadius:"5px",background:"#f9f9f9"}}>
       <h4>Download Excel file of all products till now</h4>
        <div className="download-buttons">
            <button className="btn" onClick={handleDownload} style={{flex:1,margin:"0,5px",marginTop:"20px",padding:"10px",border:"none",borderRadius:"5px",backgroundColor:"#007BFF",color:"white",fontSize:"16px",cursor:"pointer",transition:"all 0.3s ease"}}>Download PDF</button>
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
            <button className="btn"  onClick={handleDownload2} style={{flex:1,margin:"0,5px",marginTop:"20px",padding:"10px",border:"none",borderRadius:"5px",backgroundColor:"#007BFF",color:"white",fontSize:"16px",cursor:"pointer",transition:"all 0.3s ease"}}>Download PDF</button>
        </div>
        </div>
        

    </div>
    </div>
    {/* <div className="container mt-5" style={{fontFamily:"sans-serif",marginTop:"50px",backgroundColor:"#f4f4f4",textAlign:"center",padding:"20px"}}>
      <h3>Search Products by VendorName</h3>
      <div className="d-flex mb-3">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Enter Vendor Name"
          value={vendorName}
          onChange={(e) => setVendorName(e.target.value)}
        />
        <button className="btn btn-primary" onClick={fetchProductsByVendor}>
          Download
        </button>
      </div>

    
    </div> */}
   
        </div>
        
      )}
    </>
  );
};

export default AdminDashboard;
