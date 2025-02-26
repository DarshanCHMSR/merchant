import React, { useState } from "react";
import Admin_Header from "../Components/Admin_Header";
import axios from "axios";
import { url } from "../../../Components/backend_link/data";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { UploadToS3 } from '../../../State/uploadToS3';

const SectionLinks = () => {
  const [imageFiles, setImageFiles] = useState([]);

  const auth = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleImageFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
  };

  const handleRemoveField = (index) => {
    const newImageFiles = imageFiles.filter((_, i) => i !== index);
    setImageFiles(newImageFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const uploadedImageUrls = await UploadToS3(imageFiles, "Banner-Images");

      const res = await axios.post(`${url}/api/v2/section/section-one`, {
        image: JSON.stringify(uploadedImageUrls),
      }, {
        headers: {
          Authorization: auth.token
        }
      });

      if (res.data.success) {
        toast.success("Section Links Added Successfully");
        setLoading(false);
        navigate('/dashboard/admin/section-links');
      }

    } catch (error) {
      // console.log(error);
      toast.error(error.response?.data?.message || "Failed to add section links.");
      setLoading(false);
    }
  };

  return (
    <>
      <Admin_Header />



      <div className="container p-5 mt-5">

        <button className="btn btn-primary mb-3" onClick={() => navigate('/dashboard/admin/section-links')}>See the links </button>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="imageFiles">Upload Images:</label>
          <input
            type="file"
            id="imageFiles"
            className="form-control"
            multiple
            accept="image/*"
            onChange={handleImageFileChange}
            required
          />
        </div>
        {imageFiles.map((file, index) => (
          <div key={index} className="d-flex align-items-center mb-2">
            <span className="me-2">{file.name}</span>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => handleRemoveField(index)}
            >
              Remove
            </button>
          </div>
        ))}
        <div className="d-flex justify-content-center">
        <button type="submit" className="btn btn-primary mt-3 ">
          {
            loading ? "Loading..." : "Add Section Links"
          }
        </button>
        </div>
      </form>
      </div>
    </>
  );
};

export default SectionLinks;
