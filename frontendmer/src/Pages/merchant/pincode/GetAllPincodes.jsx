import React, { useEffect, useState } from "react";
import Admin_Header from "../Components/Admin_Header";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { url } from "../../../Components/backend_link/data";
import axios from "axios";
import { useSelector } from "react-redux";

const GetAllPincodes = () => {
  const [pincodes, setPincodes] = useState([]); // State to hold pincodes
  const [loading, setLoading] = useState(true); // State to manage loading state
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchPincodes = async () => {
      try {
        const res = await axios.get(`${url}/api/v2/pincodes/get-all-pincodes`);
        console.log(res.data.allPincodes);
        setPincodes(res.data.allPincodes); // Set the fetched pincodes to state
      } catch (error) {
        console.log(error);
        toast.error("Error fetching the pincodes");
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchPincodes(); // Call the fetch function
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this pincode?")) {
      try {
        console.log(id)
        await axios.delete(`${url}/api/v2/pincodes/delete-pincode/${id}`, {
          headers: {
            Authorization: auth?.token,
          },
        });
        setPincodes(pincodes.filter((pincode) => pincode._id !== id)); // Update state to remove deleted pincode
        toast.success("Pincode deleted successfully!");
      } catch (error) {
        console.log(error);
        toast.error("Error deleting the pincode");
      }
    }
  };

  return (
    <>
      <Admin_Header />
  
      <div className="container">
        <h1 className="page-title">All Pincodes</h1>
        {loading ? (
          <p className="loading">Loading...</p>
        ) : (
          <>
          <Link to={"/dashboard/admin/add-pincodes"} className="btn btn-primary mt-3">
          Add New Pincode
        </Link>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Pincode</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(pincodes) && pincodes.length > 0 ? (
                  pincodes.map((pincode, index) => (
                    <tr key={pincode._id}>
                      <td>{index + 1}</td>
                      <td>{pincode.pincode}</td>
                      <td>
                        <Link
                          to={`/dashboard/admin/edit-pincode/${pincode._id}`}
                          className="btn btn-warning btn-sm me-2"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(pincode._id)}
                          className="btn btn-danger btn-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">
                      No pincodes available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          </>
        )}
      
      </div>
    </>
  );
};

export default GetAllPincodes;
