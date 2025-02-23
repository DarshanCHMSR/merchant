import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Admin_Header from "../Components/Admin_Header";
import axios from "axios";
import { url } from "../../../Components/backend_link/data";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const CreateProduct = () => {
  const navigate = useNavigate();

  const [category, setCategory] = useState([]);
  const [customid, setCustomid] = useState([]);


  const [isidgenerated, setIsidgenerated] = useState(false);

  const [name, setName] = useState("");
  const [categoryValue, setCategory2] = useState("");
  const [photo, setPhoto] = useState(null);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState();
  const [shipping, setShipping] = useState("");
  const [imageLinks, setImageLinks] = useState([""]);
  const [variety, setVariety] = useState([{ name: "", price: "" }]);
  const [id, setId] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [deliveryCharge, setdeliveryCharge] = useState("");
  const [returDays, setReturDays] = useState("");
  const [replacementDays, setReplacementDays] = useState("");

  const auth = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);

  const handleImageLinkChange = (index, value) => {
    const updatedLinks = [...imageLinks];
    updatedLinks[index] = value;
    setImageLinks(updatedLinks);
  };

  const addImageLinkField = () => {
    setImageLinks([...imageLinks, ""]);
  };

  const removeImageLinkField = (index) => {
    const updatedLinks = imageLinks.filter((_, i) => i !== index);
    setImageLinks(updatedLinks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const productData = new FormData();

      productData.append("name", name);
      productData.append("category", categoryValue);
      productData.append("price", price);
      productData.append("description", description);
      productData.append("stock", stock);
      productData.append("shipping", shipping);
      productData.append("photo", photo);
      productData.append("id", id);
      productData.append("originalPrice", originalPrice);
      productData.append("deliveryCharge", deliveryCharge);
      productData.append("imgLink", JSON.stringify(imageLinks));
      productData.append("variety", JSON.stringify(variety));
      productData.append("returnDays", returDays);
      productData.append("replacementDays", replacementDays);

      console.log(variety);
      const res = await axios.post(
        `${url}/api/v2/products/create-product`,
        productData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: auth.token,
          },
        }
      );

      if (res.data.success) {
        navigate("/dashboard/admin/product-list");
        toast.success(res.data.message);
        setLoading(false);
      } else {
        toast.error(res.data.message);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const getCategories = async () => {
    try {
      const res = await axios.get(`${url}/api/v2/category/get-categories`);

      setCategory(res.data.data);
      //   console.log(res.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategories();
    getcustomIDs();
  }, []);

  const handleVarietyChange = (index, field, value) => {
    const newVariety = [...variety];
    newVariety[index][field] = value;
    setVariety(newVariety);
  };

  const addVarietyField = () => {
    setVariety([...variety, { name: "", price: "" }]);
  };

  const removeVarietyField = (index) => {
    const newVariety = variety.filter((_, i) => i !== index);
    setVariety(newVariety);
  };

  const getcustomIDs = async () => {
    try {
      const res = await axios.get(`${url}/api/v2/products/get-customid`, {
        headers: {
          Authorization: auth.token,
        },
      });

      console.log(res.data.data);
      setCustomid(res.data.data);
    } catch (error) {
      toast.error("something went while fetching id");
    }
  };

  const generateId = () => {

    setLoading(true);
    if (customid.length === 0) {

      setIsidgenerated(true);
      setId("VK-001");
      setLoading(false);
    }

    const validIds = customid.filter((id) => id != null);

    if (validIds.length === 0) {
      setId("VK-001");
      setIsidgenerated(true);
      setLoading(false);
      return;
    } // Handle case where all IDs were invalid

    // Sort valid IDs to get the last one
    const lastId = validIds.sort()[validIds.length-1];

    
    // Safely split and extract the number part, then increment it
    const lastNumber = parseInt(lastId.split("-")[1]);
    const newNumber = (lastNumber + 1).toString().padStart(3, "0");

    setId(`VK-${newNumber}`);

    setIsidgenerated(true);
    setLoading(false);

  }; 


  return (
    <>
      <Admin_Header />

      <div className="w-75 mx-auto mt-5 p-1">
        <h1 className="text-center mb-4 mt-5">Create Product</h1>
        <span>
          <Link to="/dashboard/admin/product-list">
            <button className="btn btn-primary mb-3 ">See All</button>
          </Link>
        </span>
        <form className="border p-4 rounded shadow" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Product Custom ID</label>
            <input
              type="text"
              className="form-control"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />

            <button className={`btn btn-primary mt-3 text-white ${isidgenerated ? "disabled" : ""}`} onClick={generateId}>{loading ? "Loading..." : "Generate ID"}</button>
          </div>

          <div className="mb-3">
            <label className="form-label">Product Name</label>
            <input
              type="text"
              className="form-control"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Product Category</label>
            <select
              className="form-select"
              onChange={(e) => setCategory2(e.target.value)}
            >
              <option>Select Category</option>
              {category.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Upload Image</label>
            <input
              type="file"
              name="photo"
              accept="image/*"
              className="form-control"
              onChange={(e) => setPhoto(e.target.files[0])}
            />
          </div>

          <div className="mb-3">
            {photo && (
              <div>
                <img
                  src={URL.createObjectURL(photo)}
                  alt="product image"
                  className="img-fluid mb-3"
                  style={{ height: "200px", width: "200px" }}
                />
              </div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Product Description</label>
            <textarea
              className="form-control"
              rows="3"
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label">Product Price</label>
            <input
              type="number"
              className="form-control"
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Original Price</label>
            <input
              type="number"
              className="form-control"
              onChange={(e) => setOriginalPrice(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Delivery Charge</label>
            <input
              type="number"
              className="form-control"
              onChange={(e) => setdeliveryCharge(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Return days</label>
            <input
              type="number"
              className="form-control"
              onChange={(e) => setReturDays(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Replacement Days</label>
            <input
              type="number"
              className="form-control"
              value={replacementDays}
              onChange={(e) => setReplacementDays(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Product Quantity</label>
            <input
              type="number"
              className="form-control"
              onChange={(e) => setStock(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Shipping Details</label>
            <input
              type="text"
              className="form-control"
              onChange={(e) => setShipping(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Varieties</label>
            {variety.map((item, index) => (
              <div key={index} className="mb-3 d-flex align-items-center">
                <input
                  type="text"
                  className="form-control me-2"
                  value={item.name}
                  onChange={(e) =>
                    handleVarietyChange(index, "name", e.target.value)
                  }
                  placeholder={`Variety Name ${index + 1}`}
                />
                <input
                  type="number"
                  className="form-control me-2"
                  value={item.price}
                  onChange={(e) =>
                    handleVarietyChange(index, "price", e.target.value)
                  }
                  placeholder={`Variety Price ${index + 1}`}
                />
                {index > 0 && (
                  <button
                    type="button"
                    className="btn btn-danger ms-2"
                    onClick={() => removeVarietyField(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={addVarietyField}
            >
              Add Another Variety
            </button>
          </div>

          <div className="mb-3">
            <label className="form-label">Additional Image Links</label>
            {imageLinks.map((link, index) => (
              <div key={index} className="mb-3 d-flex align-items-center">
                <input
                  type="text"
                  className="form-control"
                  value={link}
                  onChange={(e) => handleImageLinkChange(index, e.target.value)}
                  placeholder={`Image Link ${index + 1}`}
                />
                {index > 0 && (
                  <button
                    type="button"
                    className="btn btn-danger ms-2"
                    onClick={() => removeImageLinkField(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={addImageLinkField}
            >
              Add Another Image Link
            </button>
          </div>

          <div
            className=""
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <button className="btn btn-primary w-[30%]" type="submit">
              {loading ? "Adding..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateProduct;
