import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Admin_Header from "../Components/Admin_Header";
import axios from "axios";
import { url } from "../../../Components/backend_link/data";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Backbutton from "../../../Components/Backbutton";

const UpdateProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState([]);
  const [name, setName] = useState("");
  const [categoryValue, setCategoryValue] = useState("");
  const [photo, setPhoto] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [id, setId] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [deliveryCharge, setdeliveryCharge] = useState("");
  const [returDays, setReturDays] = useState("");
  const [replacementDays, setReplacementDays] = useState('')
  const [shipping, setShipping] = useState("");
  const [imageLinks, setImageLinks] = useState([""]);
  const [variety, setVariety] = useState([{ name: "", price: "" }]);

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
    if (index === 0 && imageLinks.length === 1) return; // Prevent removal if it's the only field
    const updatedLinks = imageLinks.filter((_, i) => i !== index);
    setImageLinks(updatedLinks);
  };

  const [product, setProduct] = useState({});

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
      productData.append("pid", id);
      productData.append("originalPrice", originalPrice);
      productData.append("deliveryCharge", deliveryCharge);

      if (photo) productData.append("photo", photo);
      productData.append("imgLink", JSON.stringify(imageLinks));
      productData.append("variety", JSON.stringify(variety));

      productData.append("returnDays", returDays);
      productData.append("replacementDays", replacementDays);

      console.log(variety);

      const res = await axios.put(
        `${url}/api/v2/products/update-product/${params.id}`,
        productData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: auth.token,
          },
        }
      );

      if (res.data.success) {
        setTimeout(() => {
          navigate("/dashboard/admin/product-list");
          toast.success(res.data.message);
          setLoading(false);
        }, 1000);
      } else {
        toast.error(res.data.message);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update product");
      setLoading(false);
    }
  };

  const getCategories = async () => {
    try {
      const res = await axios.get(`${url}/api/v2/category/get-categories`);
      setCategory(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const findProduct = async () => {
    try {
      const res = await axios.get(
        `${url}/api/v2/products/get-single-product/${params.id}`,
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );
      setProduct(res.data.pd);
      setVariety(
        Array.isArray(res.data.pd.variety)
          ? res.data.pd.variety
          : [{ name: "", price: "" }]
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    findProduct();
  }, [params.id]);

  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setCategoryValue(product.category?._id || "");
      setDescription(product.description || "");
      setPrice(product.price || "");
      setStock(product.stock || "");
      setShipping(product.shipping || "");
      setImageLinks(product.imgLink || [""]);
      setVariety(product.variety || [""]);
      setId(product.id || "");
      setOriginalPrice(product.originalPrice || "");
      setdeliveryCharge(product.deliveryCharge || "");
      setReturDays(product.returnDays || "");
      setReplacementDays(product.replacementDays || "");

      setPhoto(product.photo || null);

      setVariety(
        Array.isArray(product.variety)
          ? product.variety
          : [{ name: "", price: "" }]
      );
    }
  }, [product]);

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
  return (
    <>
      <Admin_Header />

      <div className="w-75 mx-auto mb-5 mt-5">
        <Backbutton path="/dashboard/admin/product-list" />
        <h1 className="text-center mb-4">Update Product</h1>
        <span>
          <Link to="/dashboard/admin/products">
            <button className="btn btn-primary mb-3">See All</button>
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
          </div>

          <div className="mb-3">
            <label className="form-label">Product Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Product Category</label>
            <select
              className="form-select"
              value={categoryValue}
              onChange={(e) => setCategoryValue(e.target.value)}
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label">Product Price</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Original Price</label>
            <input
              type="number"
              className="form-control"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Delivery Charge</label>
            <input
              type="number"
              className="form-control"
              value={deliveryCharge}
              onChange={(e) => setdeliveryCharge(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Return Days</label>
            <input
              type="number"
              className="form-control"
              value={returDays}
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
            <label className="form-label">Product Stock</label>
            <input
              type="number"
              className="form-control"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Shipping Details</label>
            <input
              type="text"
              className="form-control"
              value={shipping}
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

          <div>
            <h3>Images</h3>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  {imageLinks.map((img, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: "10px",
                        width: "100%",
                      }}
                    >
                      <img
                        src={img}
                        alt={`Image ${index + 1}`}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          objectPosition: "center",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div
            className=""
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              marginTop: "20px",
            }}
          >
            <button className="btn btn-primary w-[30%]" type="submit">
              {loading ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateProduct;
