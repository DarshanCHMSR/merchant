import axios from "axios";
import React, { useState } from "react";
import Admin_Header from "../Components/Admin_Header";
import Backbutton from "../../../Components/Backbutton";
import toast from "react-hot-toast";
import { url } from "../../../Components/backend_link/data";
import { useSelector } from "react-redux";

const CreatePincode = () => {
  const [pincodes, setPincodes] = useState("");
  const [loading, setLoading] = useState(false); // Set initial loading to false
  const auth = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setPincodes(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auth?.token) {
      toast.error("User is not authenticated!");
      return;
    }

    setLoading(true);
    const pincodeArray = pincodes
      .split("\n")
      .map((pincode) => pincode.trim())
      .filter((pincode) => pincode);

    try {
      const res = await axios.post(
        `${url}/api/v2/pincodes/create-pincode`,
        { pincodes: pincodeArray }, // Pass the pincodes array here
        {
          headers: {
            Authorization: auth.token, // Correctly format the Authorization header
          },
        }
      );
      setPincodes("");
      setLoading(false);
      toast.success("Pincodes added successfully!");
    } catch (error) {
      setLoading(false);
      toast.error("Error saving pincodes");
      console.log(error);
    }
  };

  return (
    <>
      <Admin_Header />

      <div className="mt-5">
        <Backbutton path="/dashboard/admin/pincodes-list" />
      </div>

      <div className="bg-light text-center py-5 mt-3">
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <textarea
                    className="form-control"
                    style={{ height: "fit-content" }}
                    value={pincodes}
                    onChange={handleChange}
                    placeholder="Enter pincodes, each on a new line"
                    rows="5"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-20 align-self-center"
                  disabled={loading} // Disable button while loading
                >
                  {loading ? "Saving..." : "Add Pincodes"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePincode;
