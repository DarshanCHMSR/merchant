import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Admin_Header from "../Components/Admin_Header";
import axios from "axios";
import { url } from "../../../Components/backend_link/data";
import Backbutton from "../../../Components/Backbutton";
import toast from "react-hot-toast";

toast
const UpdateVechicle = () => {
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image: [""],
  });

  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);

  const [vechicle, setvechicle] = useState({});

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name === "image") {
      const updatedLinks = [...formData.image];
      updatedLinks[index] = value;
      setFormData({ ...formData, image: updatedLinks });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleAddLink = () => {
    setFormData({
      ...formData,
      image: [...formData.image, ""],
    });
  };

  const handleRemoveLink = (index) => {
    const updatedLinks = formData.image.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      image: updatedLinks,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put(
        `${url}/api/v2/vehicle/update-vechicle/${id}`,
        {
          name: formData.name,
          price: formData.price,
          description: formData.description,
          image: JSON.stringify(formData.image),
        },
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );
      if (res.data.success) {
        setLoading(false);
        toast.success(res.data.message);
        navigate("/dashboard/admin/vehicle-list");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const fetchVechicle = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${url}/api/v2/vehicle/get-single-vehicle/${id}`
      );
      setvechicle(response.data.vechicle);

      // Ensure vechicle.image is defined before parsing
      let imageLinks = [];

      if (Array.isArray(response.data.vechicle.image)) {
        // If image is already an array, use it as is
        imageLinks = response.data.vechicle.image;
      } else if (typeof response.data.vechicle.image === "string") {
        // If image is a string, wrap it in an array
        imageLinks = [response.data.vechicle.image];
      }

      setFormData({
        name: response.data.vechicle.name || "",
        price: response.data.vechicle.price || "",
        description: response.data.vechicle.description || "",
        image: imageLinks,
      });

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVechicle();
  }, [id]);

  return (
    <div>
      <Admin_Header />
      <div className="container p-5 mt-3">
        <Backbutton path="/dashboard/admin/vehicle-list" />
        <h3 className="text-center">Create Vehicle</h3>
        <form onSubmit={handleSubmit} className="mt-5">
          <div className="mt-5 mb-3">
            <label htmlFor="name" className="form-label">
              Vehicle Name
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
            <label htmlFor="price" className="form-label">
              Price
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
            <label className="form-label">Image Links</label>
            {formData.image.map((link, index) => (
              <div key={index} className="d-flex align-items-center mb-2">
                <input
                  type="text"
                  className="form-control"
                  name="image"
                  value={link}
                  onChange={(e) => handleChange(e, index)}
                  placeholder={`Image Link ${index + 1}`}
                  required
                />
                {formData.image.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-danger ms-2"
                    onClick={() => handleRemoveLink(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleAddLink}
            >
              Add Another Image Link
            </button>
          </div>

          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-primary">
              {loading ? "Loading..." : "Update Vehicle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateVechicle;
