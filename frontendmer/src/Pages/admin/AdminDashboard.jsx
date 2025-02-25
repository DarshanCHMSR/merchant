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
    fetchUsers();
    totalProducts();
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

  const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const uploadFile = async () => {
        if (!file) {
            setMessage("Please select a file first!");
            return;
        }

        setUploading(true);
        setMessage("");

        try {
            // Get signed URL from backend
            const { data } = await axios.get("http://localhost:5000/s3-presigned-url", {
                params: { filename: file.name, mimetype: file.type },
            });

            // Upload file to S3 using signed URL
            await axios.put(data.url, file, {
                headers: {
                    "Content-Type": file.type,
                },
            });

            setMessage("File uploaded successfully!");
        } catch (error) {
            setMessage("Upload failed: " + error.message);
        } finally {
            setUploading(false);
        }
    };
  

  return (
    <>
      {Loading ? (
        <Loader />
      ) : (
        <div>
          <Toaster />

          <Admin_Header />

          <main
            style={{
              marginTop: "58px",
            }}
          >
             <div>
      <h2>Filter Products by Date</h2>
      
      <label>Start Date: </label>
      <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />

      <label>End Date: </label>
      <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

      <button onClick={fetchProductsByDate}>Fetch Products</button>

    
    </div>
            <div className="container pt-4">
            <button 
      onClick={handleDownload}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      style={{color:"white",backgroundColor:"black",border:"1px solid black"}}
    >
      📥 Download Excel
    </button>
    <button 
      onClick={handleDownload2}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      style={{color:"white",backgroundColor:"black",border:"1px solid black",marginLeft:"10px"}}
    >
      📥 Download Excel of last 5
    </button>
    <div>
            <h2>Upload File to S3</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={uploadFile} disabled={uploading}>
                {uploading ? "Uploading..." : "Upload"}
            </button>
            {message && <p>{message}</p>}
        </div>
            </div>
          </main>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;
