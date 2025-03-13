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

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    // fetchOrders();
    // fetchUsers();
    // totalProducts();
  }, []);

  // useEffect(() => {
  //   // Process orders to update orderData after orders are fetched
  //   const updateOrderData = () => {
  //     let delivered = 0;
  //     let pending = 0;
  //     let cancelled = 0;
  //     let totalAmt = 0;

  //     orders.forEach((order) => {
  //       if (order.status === "Delivered") {
  //         delivered += 1;
  //         order.products.forEach((product) => {
  //           totalAmt += product.price;
  //         });
  //       }
  //       if (order.status === "Cancelled") {
  //         cancelled += 1;
  //       }
  //       if (order.status === "Not Processed") {
  //         pending += 1;
  //       }
  //     });

  //     setOrderData((prevData) => ({
  //       ...prevData,
  //       delivered,
  //       pending,
  //       cancelled,
  //       totalAmt,
  //       totalOrders: orders.length,
  //     }));
  //   };

  //   if (orders.length > 0) {
  //     updateOrderData();
  //   }
  // }, [orders]);

  // const fetchOrders = async () => {
  //   try {
  //     const res = await axios.get(`${url}/api/v2/order/admin-orders`, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: auth.token,
          
  //       },
  //     });
  //     setOrders(res.data);
  //   } catch (error) {
  //     console.error("Error fetching orders:", error);
  //   }
  // };

  // const fetchUsers = async () => {
  //   try {
  //     const res = await axios.get(`${url}/api/v2/auth/get-users`, {
  //       headers: {
  //         Authorization: auth.token,
  //       },
  //     });

  //     if (res.data.success) {
  //       setOrderData((prevData) => ({
  //         ...prevData,
  //         users: res.data.count,
  //       }));
  //     }
  //   } catch (error) {
  //     console.error("Error fetching users:", error);
  //   }
  // };

  // const totalProducts = async () => {

  //   try {
  //     const res = await axios.get(`${url}/api/v2/products/get-products`, {
  //       headers: {
  //         Authorization: auth.token,
  //       },
  //     });

  //     setOrderData((prevData) => ({
  //       ...prevData,
  //       productsCount: res.data.total_products,
  //       outofstock: res.data.outofstock,
  //     }));
  //   } catch (error) {
  //     console.error("Error fetching products:", error);
  //   }
  // };
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
    
      // Convert to ISO format (YYYY-MM-DDTHH:MM:SS.sssZ)
      const formattedStartDate = new Date(startDate).toISOString();
      const formattedEndDate = new Date(endDate).toISOString();
    
      try {
        const response = await fetch(
          `http://localhost:5000/api/v2/products/by-date?startDate=${formattedStartDate}&endDate=${formattedEndDate}`
        );
    
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        try {
     
          const response = await axios.get(`${url}/api/v2/products/exportuser`, {
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
  // const res = axios.post(`${url}/api/v2/auth/login`, data);
  
  // localStorage.setItem("auth-Data", JSON.stringify(res.data));

  // console.log(user, token);
  // await handelOTP();
  // console.log(res.data);
  // console.log(auth-Data);





  return (
    <>
      {Loading ? (
        <Loader />
      ) : (
        <div>
          <Toaster />

          <Admin_Header />
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
          {/* <main
            style={{
              marginTop: "58px",
            }}
          >
             <div style={{display:"flex",justifyContent:"space-around",marginTop:"100px"}}>
              <br></br>
      <h2>Filter Products by Date</h2>
      <div style={{}}>
      <label>Start Date: </label>
      <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />

      <label>End Date: </label>
      <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

      <button onClick={fetchProductsByDate}>Fetch Products</button>

      </div>
    </div>
            <div className="container pt-4">
            <h2>Download Excel file of all the products</h2>
            <button 
      onClick={handleDownload}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      style={{color:"white",backgroundColor:"black",border:"1px solid black"}}
    >
      📥 Download Excel file 
    </button>
    <br></br>
    <br></br> <br></br>
    <h2>Download Excel file of products of last 5</h2>
    <button 
      onClick={handleDownload2}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      style={{color:"white",backgroundColor:"black",border:"1px solid black",marginLeft:"10px"}}
    >
      📥 Download Excel of last 5
    </button>
   
            </div>
            
          </main> */}
          
        </div>
        
      )}
    </>
  );
};

export default AdminDashboard;
