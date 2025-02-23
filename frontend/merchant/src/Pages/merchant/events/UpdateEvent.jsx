import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Admin_Header from "../Components/Admin_Header";
import { useSelector } from "react-redux";
import axios from "axios";
import { url } from "../../../Components/backend_link/data";
import toast from "react-hot-toast";
import { UploadToS3 } from '../../../State/uploadToS3'; // Import the UploadToS3 function

const UpdateEvent = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    originalPrice: '',
    description: "",
  });

  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [Event, setEvent] = useState({});
  const [productImages, setProductImages] = useState([]); // State to hold the product images

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleProductImagesUpload = (e) => {
    const files = Array.from(e.target.files);
    setProductImages([...productImages, ...files]); // Update the productImages state
  };

  const fetchEvent = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/v2/event/get-event/${id}`);
      setEvent(response.data.event);
      setProductImages(response.data.event.image || []); // Set the initial images from the event
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');  
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let productImgURL = [];
      if (productImages.length > 0) {
        productImgURL = await UploadToS3(productImages, "Event-Images"); // Upload images to S3
      } else {
        // If no new images are uploaded, use the existing images
        productImgURL = Event?.image || [];
      }

      // Combine existing images with newly uploaded images
      const finalImageURLs = productImgURL.length > 0 ? productImgURL : Event?.image || [];

      const res = await axios.put(
        `${url}/api/v2/event/update-event/${id}`,
        {
          name: formData.name,
          price: formData.price,
          description: formData.description,
          originalPrice: formData.originalPrice,
          image: JSON.stringify(finalImageURLs), // Send the combined image URLs
        },
        { headers: { Authorization: auth.token } }
      );

      if (res.data.success) {
        setTimeout(() => {
          setLoading(false);
          toast.success(res.data.message);
          navigate("/dashboard/admin/event-list");
        }, 1000);
      }
    } catch (error) {

      toast.error(error.response?.data?.message || 'An error occurred');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  useEffect(() => {
    if (Event) {
      setFormData({
        name: Event.name || "",
        price: Event.price || "",
        description: Event.description || "",
        originalPrice: Event?.originalPrice || "",
      });
    }
  }, [Event]);

  return (
    <>
      <Admin_Header />
      <div className="container mb-5 p-5">
        <form onSubmit={handleSubmit} className="mt-5">
          <div className="mt-5 mb-3">
            <label htmlFor="name" className="form-label">
              Event Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="originalPrice" className="form-label">
              MRP
            </label>
            <input
              type="number"
              className="form-control"
              id="originalPrice"
              name="originalPrice"
              value={formData.originalPrice}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="price" className="form-label">
              Discount Price
            </label>
            <input
              type="number"
              className="form-control"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">If you want, you can upload new images</label>
            <input
              type="file"
              className="form-control"
              multiple
              onChange={handleProductImagesUpload} // Handle file input changes
            />
          </div>

          {/* Displaying the current event images */}
          <div className="mb-3">
            <label className="form-label">Current Event Images</label>
            <div className="d-flex flex-wrap">
              {Event?.image?.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Event Image ${index + 1}`}
                  className="img-thumbnail me-2 mb-2"
                  style={{ width: "100px", height: "100px" }}
                />
              ))}
            </div>
          </div>

          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-primary">
              {loading ? "Loading..." : "Update Event"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateEvent;
