import React, { useState, useEffect } from "react";
import axios from "axios";
import { url } from "../../../Components/backend_link/data";

export default function SetStatus({ productId }) {
  const [status, setStatu] = useState(0); 
  const [rejReason, setRejReason] = useState("");
  // Default to null before fetching

  // Fetch product status when component loads or when productId changes
  useEffect(() => {
    axios.get(`${url}/api/v2/products/get-single-product/${productId}`)
      .then((res) => {
        // console.log(res.data.pd.status
        //   );
        if(res.data.pd.status === undefined){
            setStatu(0);
            setRejReason("");
            }
            else{
                setStatu(res.data.pd.status);
                setRejReason(res.data.pd.rejReason);
            }
      })
      .catch((error) => {
        console.error(`Error fetching product ${productId}:`, error);
      });
  }); // Re-run effect when productId changes


  return (
    <div className="p-4 text-center border rounded-lg shadow-md w-64">
      {/* Show different status messages */}
      <div>
        {status === 0 ? (
          <p className="btn btn-danger">Waiting...</p>
        ) : status === 1 ? (
          <p className="btn btn-primary">Approved ✅</p>
        ) : (
          <div>
          <p className="btn btn-danger">Rejected ❌</p>
          <p>{rejReason}</p>  
          </div>        
        )}
      </div>
    </div>
  );
}
