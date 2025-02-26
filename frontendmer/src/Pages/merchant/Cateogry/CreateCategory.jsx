import React, { useState } from "react";
import Admin_Header from "../Components/Admin_Header";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Backbutton from "../../../Components/Backbutton";
import { url } from "../../../Components/backend_link/data";
import { UploadToS3 } from "../../../State/uploadToS3"; // Import the UploadToS3 function

const CreateCategory = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null); // Change to null for better handling
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  const handleImageUpload = async () => {
    if (image) {
      const imageUrl = await UploadToS3([image], "Category-Images"); // Upload the image
      return imageUrl[0]; // Return the first URL
    }
    return null; // No image uploaded
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setLoading(true);

    try {
      const uploadedImageUrl = await handleImageUpload(); // Upload image and get URL
      const res = await axios.post(
        `${url}/api/v2/category/create-category`,
        { name, image: uploadedImageUrl }, // Include the uploaded image URL
        {
          headers: {
            Authorization: auth?.token, // Include headers in the config object
          },
        }
      );

      toast.success(res.data.message);
      setLoading(false);
      navigate("/dashboard/admin/category-list");
    } catch (error) {
      toast.error("Failed to create category");
      setLoading(false);
    }
  };

  return (
    <>
      <Admin_Header />
      <div className="container" style={{ marginTop: "10vh" }}>
        <Backbutton path={"/dashboard/admin/category-list"} />
        <div className="row">
          <div className="col-lg-6 col-md-8 col-sm-10 mx-auto">
            <div className="card shadow-lg border-light rounded">
              <div className="card-body p-4">
                <h4 className="text-center mb-4">Create Category</h4>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Name
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter category name"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="image" className="form-label">
                      Category Image
                    </label>
                    <input
                      type="file"
                      className="form-control form-control-lg"
                      id="image"
                      accept="image/*" // Restrict to image files
                      onChange={(e) => setImage(e.target.files[0])} // Set the selected file
                    />
                  </div>

                  <div className="d-flex justify-content-center">
                    <button
                      className="btn btn-primary btn-lg px-4 py-2"
                      type="submit"
                      disabled={loading} // Disable button during loading
                    >
                      {loading ? "Adding..." : "Create Category"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateCategory;
