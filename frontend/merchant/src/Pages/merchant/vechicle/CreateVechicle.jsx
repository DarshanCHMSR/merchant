import React, { useState } from "react";
import Admin_Header from "../Components/Admin_Header";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Backbutton from "../../../Components/Backbutton";
import toast from "react-hot-toast";
import axios from "axios";
import { url } from "../../../Components/backend_link/data";

const CreateVehicle = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image: [""],
    minKm: "",
    bata: "",
    kmPrice: "",
  });

  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);

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
      const res = await axios.post(
        `${url}/api/v2/vehicle/create-vehicle`,
        {
          name: formData.name,
          price: formData.price,
          description: formData.description,
          image: JSON.stringify(formData.image),
          minKm: formData.minKm,
          bata: formData.bata,
          kmPrice: formData.kmPrice,
        },
        {
          headers: {
            Authorization: auth?.token,
          },
        }
      );

      if (res.data.success) {
        setTimeout(() => {
          setLoading(false);
          toast.success(res.data.message);
          navigate("/dashboard/admin/vehicle-list");
        }, 1000);
      }
    } catch (error) {
      toast.error(res.data.message);
      setLoading(false);
    }
  };

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

          {/* minKm Field */}
          <div className="mb-3">
            <label htmlFor="minKm" className="form-label">
              Minimum Kilometers
            </label>
            <input
              type="number"
              className="form-control"
              id="minKm"
              name="minKm"
              value={formData.minKm}
              onChange={handleChange}
              required
            />
          </div>

          {/* bata Field */}
          <div className="mb-3">
            <label htmlFor="bata" className="form-label">
              Bata (Driver Allowance)
            </label>
            <input
              type="number"
              className="form-control"
              id="bata"
              name="bata"
              value={formData.bata}
              onChange={handleChange}
              required
            />
          </div>

          {/* kmPrice Field */}
          <div className="mb-3">
            <label htmlFor="kmPrice" className="form-label">
              Price Per Kilometer
            </label>
            <input
              type="number"
              className="form-control"
              id="kmPrice"
              name="kmPrice"
              value={formData.kmPrice}
              onChange={handleChange}
              required
            />
          </div>

          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-primary">
              {loading ? "Loading..." : "Create Vehicle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateVehicle;
