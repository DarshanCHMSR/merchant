import React, { useState, useEffect } from "react";
import axios from "axios";
import { url } from "../../../Components/backend_link/data";
import { useSelector } from "react-redux";

export default function SetStatus({ productId }) {
  const [status, setStatu] = useState(0); 
    const auth = useSelector((state) => state.auth);
  
  // Default to null before fetching

  // Fetch product status when component loads or when productId changes
  useEffect(() => {
    axios.get(`${url}/api/v2/products/get-single-product/${productId}`)
      .then((res) => {
        if(res.data.pd.status === undefined){
            setStatu(0);
            }
            else{
                setStatu(res.data.pd.status);
            } 
      })
      .catch((error) => {
        console.error(`Error fetching product ${productId}:`, error);
      });
  }); // Re-run effect when productId changes

  
  // Function to update the status in the backend
  const updateStatus = () => {
    axios.put(`${url}/api/v2/products/set-product-status/${productId}`, { status: 1 },{headers: {
      "Content-Type": "application/json",
      Authorization: auth.token,
    },})
      .then(() => {
        // console.log(`Status updated for product ${productId}`);
        setStatu(1); // Update UI after successful API call
      })
      .catch((error) => {
        console.error(`Error updating status for ${productId}:`, error);
      });
  };

  return (
    <div className="p-4 text-center border rounded-lg shadow-md w-64">
      {/* Show different status messages */}
      <div className="mb-4">
        { status ===0||status ===1? (
          status === 0 ? (
            <p className="btn btn-warning">Pending</p>
          ) : (
            <p className="btn btn-success">Approved</p>
          )
        ) : (
          <p className="btn btn-primary">Rejected </p>
        )}
        
      </div>
      

      {/* Update Button (Disabled if status is already approved) */}
      <button
        className="px-4 py-2 btn btn-success"
        onClick={updateStatus}
        disabled={status === 1||status === 2}
      > 
        {status === 1 ? "Approved" : "Update Status"}
      </button>
    </div>
  );
}
