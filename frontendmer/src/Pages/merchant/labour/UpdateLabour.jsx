import React, { useEffect, useState } from "react";
import Admin_Header from "../Components/Admin_Header";
import { url } from "../../../Components/backend_link/data";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { UploadToS3 } from '../../../State/uploadToS3'; // Import the UploadToS3 function

const UpdateLabour = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const [labor, setLabor] = useState({
    name: "",
    image: null, // Change to hold a single image file
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLabor({
      ...labor,
      [name]: value,
    });
  };

  const handleImageUpload = (e) => {
    setLabor({
      ...labor,
      image: e.target.files[0], // Set the selected file
    });
  };

  const fetchLabour = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/v2/labour/get-labour/${id}`);
      setLabor({
        name: response.data.labour.name || "",
        image: null, // Reset image to null
      });
    } catch (error) {
      toast.error("Failed to fetch labor.");
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = null;
      if (labor.image) {
        const uploadedImageUrl = await UploadToS3([labor.image], "Labour-Images"); // Upload the image
        imageUrl = uploadedImageUrl[0]; // Get the uploaded image URL
      }

      const res = await axios.put(
        `${url}/api/v2/labour/update-labour/${id}`,
        {
          name: labor.name,
          image: imageUrl || labor.imageLink, // Include the uploaded image URL or existing image link
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
      toast.error("Failed to update labor.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabour();
  }, [id]);

  return (
    <>
      <Admin_Header />
      <div className="container mt-5 p-5">
        <h3 className="mb-4 text-center">Update Labor</h3>
        <form onSubmit={handleSubmit}>
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
            <label htmlFor="image" className="form-label">
              Upload Image
            </label>
            <input
              type="file"
              className="form-control"
              id="image"
              accept="image/*" // Restrict to image files
              onChange={handleImageUpload} // Handle image upload
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
