import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Admin_Header from "../Components/Admin_Header";
import axios from "axios";
import { url } from "../../../Components/backend_link/data";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Backbutton from "../../../Components/Backbutton";
import { UploadToS3 } from "../../../State/uploadToS3"; // Import the UploadToS3 function

const UpdateProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState([]);

  // * Product Attributes
  const [name, setName] = useState("");
  const [categoryValue, setCategoryValue] = useState("");
  const [photo, setPhoto] = useState(null); // Change to null for better handling
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [id, setId] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [deliveryCharge, setdeliveryCharge] = useState("");
  const [returDays, setReturDays] = useState("");
  const [replacementDays, setReplacementDays] = useState("");
  const [shipping, setShipping] = useState("");
  const [imageLinks, setImageLinks] = useState([""]);
  const [variety, setVariety] = useState([{ name: "", price: "" }]);

  var productImages = [];

  const auth = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  const [product, setProduct] = useState({});

  const handleImageUpload = async () => {
    const productImgURL = await UploadToS3(productImages, "Products-Images");
    return productImgURL;
  };

  const handleProductImagesUpload = (e) => {
    const files = Array.from(e.target.files);
    productImages = [...productImages, ...files];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryValue) {
      alert("Please select a category before submitting.");
      return;
    }
    setLoading(true);
    try {
      const productData = new FormData();

      productData.append("name", name);
      productData.append("category", categoryValue);
      productData.append("price", price);
      productData.append("description", description);
      productData.append("keywords", keywords); // Append keywords
      productData.append("stock", stock);
      productData.append("shipping", shipping);
      productData.append("pid", id);
      productData.append("originalPrice", originalPrice);
      productData.append("deliveryCharge", deliveryCharge);

      const uploadedImageUrl = await handleImageUpload();

      if (uploadedImageUrl && uploadedImageUrl.length > 0) {
        productData.append("imgLink", JSON.stringify(uploadedImageUrl));
      } else {
        const existingImageLinks = product.imgLink || [];
        productData.append("imgLink", JSON.stringify(existingImageLinks));
      }

      productData.append("variety", JSON.stringify(variety));
      productData.append("returnDays", returDays);
      productData.append("replacementDays", replacementDays);

      console.log("FormData before sending:", Object.fromEntries(productData.entries()));

      const res = await axios.put(
        `${url}/api/v2/products/update-product-admin/${params.id}`,
        productData,
        {
          headers: {
            "Content-Type": "application/json",
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
      toast.error("Failed to update product");
      setLoading(false);
    }
  };

  const getCategories = async () => {
    try {
      const res = await axios.get(`${url}/api/v2/category/get-categories`);
      setCategory(res.data.data);
    } catch (error) {
      toast.error("Failed to update product");
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
      setKeywords(product.keywords || "");
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

      <div className="container mt-5">
        <div className="row">
          <div className="col-12">
            <Backbutton path="/dashboard/admin/product-list" />
          </div>
        </div>

        <h1 className="text-center mb-4">Update Product</h1>
        <div className="row">
          <div className="col-12 col-md-6 mb-3">
            <Link to="/dashboard/admin/product-list">
              <button className="btn btn-primary w-100">See All Products</button>
            </Link>
          </div>
        </div>

        <form className="border p-3 p-md-4 rounded shadow mx-auto" style={{ maxWidth: "800px" }} onSubmit={handleSubmit}>
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
              required
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
            <label className="form-label">Product Description</label>
            <textarea
              className="form-control"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label">Product Keywords</label>
            <textarea
              className="form-control"
              rows="2"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            ></textarea>
          </div>

          <div className="row">
            <div className="col-12 col-md-6 mb-3">
              <label className="form-label">MRP Price</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-6 mb-3">
              <label className="form-label">Discount Price</label>
              <input
                type="number"
                className="form-control"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-12 col-md-6 mb-3">
              <label className="form-label">Delivery Charge</label>
              <input
                type="number"
                className="form-control"
                value={deliveryCharge}
                onChange={(e) => setdeliveryCharge(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-6 mb-3">
              <label className="form-label">Return Days</label>
              <input
                type="number"
                className="form-control"
                value={returDays}
                onChange={(e) => setReturDays(e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-12 col-md-6 mb-3">
              <label className="form-label">Replacement Days</label>
              <input
                type="number"
                className="form-control"
                value={replacementDays}
                onChange={(e) => setReplacementDays(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-6 mb-3">
              <label className="form-label">Product Stock</label>
              <input
                type="number"
                className="form-control"
                value={stock || ""}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Shipping Details</label>
            <input
              type="text"
              className="form-control"
              value={shipping || ""}
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

          <div className="mb-3">
            <label htmlFor="UploadImage" className="form-label">
              If you want to change the image of the product
            </label>
            <input
              type="file"
              multiple
              id="UploadImage"
              className="form-control"
              onChange={handleProductImagesUpload}
            />
          </div>

          <div className="text-center mt-4">
            <button className="btn btn-primary w-100" type="submit">
              {loading ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateProduct;
