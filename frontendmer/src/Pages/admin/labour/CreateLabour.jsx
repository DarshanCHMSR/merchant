import React, { useState } from 'react';
import Admin_Header from '../Components/Admin_Header';
import toast from 'react-hot-toast';
import axios from 'axios';
import { url } from '../../../Components/backend_link/data';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { UploadToS3 } from '../../../State/uploadToS3'; // Import the UploadToS3 function

const CreateLabour = () => {
  const [labor, setLabor] = useState({
    name: "",
    image: null, // Change to hold a single image file
  });

  const [loading, setLoading] = useState(false);

  const auth = useSelector((state) => state.auth);

  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = null;
      if (labor.image) {
        const uploadedImageUrl = await UploadToS3([labor.image], "Labour-Images"); // Upload the image
        imageUrl = uploadedImageUrl[0]; // Get the uploaded image URL
      }

      const res = await axios.post(
        `${url}/api/v2/labour/create-labour`,
        {
          name: labor.name,
          image: imageUrl, // Include the uploaded image URL
        },
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );

      if (res.data) {
        toast.success(res.data.message);
        setLabor({
          name: "",
          image: null, // Reset the image after successful submission
        });
        navigate('/dashboard/admin/labour-list');
        setLoading(false);
      }
    } catch (error) {
      toast.error("Failed to create labor.");
      setLoading(false);
    }
  };

  return (
    <>
      <Admin_Header />
      <div className="container mt-5 p-5">
        <h3 className="mb-4 text-center">Add Labor</h3>
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
              {loading ? "Loading..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateLabour;
