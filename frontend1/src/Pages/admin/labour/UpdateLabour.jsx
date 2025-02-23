import React, { useState } from "react";
import Admin_Header from "../Components/Admin_Header";
import { url } from "../../../Components/backend_link/data";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const UpdateLabour = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const handleChange = (e) => {
    setLabor({
      ...labor,
      [e.target.name]: e.target.value,
    });
  };

  const auth = useSelector((state) => state.auth);

  const [labor, setLabor] = useState({
    name: "",
    imageLink: "",
  });

  const [loading, setLoading] = useState(false);

  const handelSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const res = await axios.put(
        `${url}/api/v2/labour/update-labour/${id}`,
        {
          name: labor.name,
          image: labor.imageLink,
        },
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );

      if (res?.data) {
        toast.success(res.data.message);
        navigate("/dashboard/admin/labour-list");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <>
      <Admin_Header />

      <div className="container mt-5 p-5">
        <h3 className="mb-4 text-center">Update Labor</h3>
        <form onSubmit={handelSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={labor.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="imageLink" className="form-label">
              Image Link
            </label>
            <input
              type="text"
              className="form-control"
              id="imageLink"
              name="imageLink"
              value={labor.imageLink}
              onChange={handleChange}
              required
            />
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-primary">
              {loading ? "Loading.." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateLabour;
