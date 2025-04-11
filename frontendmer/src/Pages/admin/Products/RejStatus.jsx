import React, { useState, useEffect } from "react";
import axios from "axios";
import { url } from "../../../Components/backend_link/data";

export default function RejStatus({ productId }) {
  const [status, setStatu] = useState(0);
  const [rejReason, setRejReason] = useState("");    
  // Default to null before fetching

  // Fetch product status when component loads or when productId changes
  useEffect(() => {
    axios.get(`${url}/api/v2/products/get-single-product/${productId},`,{headers: {
      "Content-Type": "application/json",
      Authorization: auth.token,
    },})
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
    axios.put(`${url}/api/v2/products/set-product-status/${productId}`, { status: 2 })
      .then(() => {
        // console.log(`Status updated for product ${productId}`);
        setStatu(2); // Update UI after successful API call
      })
      .catch((error) => {
        console.error(`Error updating status for ${productId}:`, error);
      });
  };
  const OnClick = () => {
    axios.put(`${url}/api/v2/products/set-product-rej-status/${productId}`, { rejReason: rejReason,status: 4 })
      .then(() => {
        setStatu(4); // Update UI after successful API call
      })
      .catch((error) => {
        console.error(`Error updating status for ${productId}:`, error);
      });
     
  }; 

  return (
    <div className="p-4 text-center border rounded-lg shadow-md w-64">
      {/* Show different status messages */}
      <div className="mb-4"  style={{display: status === 2 ? "block" : "none"}}>
       
      <div className="form-floating mb-3">
                            <input
                              type="text"
                              className="form-control"
                              id="rejReason"
                              aria-rowspan={2}
                              value={rejReason}
                              placeholder="Enter the reason for rejection"
                              onChange={(e) => setRejReason(e.target.value)}
                              disabled={status === 4}
                              required
                            />
                            <label htmlFor="rejReason">Reason</label>
                            <button
                            className="btn btn-primary"
                            onClick={OnClick}
                            disabled={status === 4}
                            >Submit</button>
                          </div>
       
        
      </div>

      {/* Update Button (Disabled if status is already approved) */}
      <button
        className="px-4 py-2 btn btn-success"
        onClick={updateStatus}
        disabled={status === 2}
      >
        {status === 2 ? "Rejected" : "Reject Product"}
      </button>
    </div>
  );
}
