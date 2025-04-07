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
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [id, setId] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [deliveryCharge, setdeliveryCharge] = useState("");
  const [returDays, setReturDays] = useState("");
  const [replacementDays, setReplacementDays] = useState("");
  const [shipping, setShipping] = useState("");
  const [imageLinks, setImageLinks] = useState([""]);
  const [variety, setVariety] = useState([{ name: "", price: "",mrp:"" }]);
  const [vendername,setVendername] = useState("");
  const status = "0";
  const updated=1;
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
    setLoading(true);
    try {
      const productData = new FormData();
      productData.append("price", price);
      productData.append("stock", stock);
      productData.append("originalPrice", originalPrice);
      productData.append("status", status);
      productData.append("updated", updated);
      productData.append("variety", JSON.stringify(variety));

      const res = await axios.put(
        `${url}/api/v2/products/update-product/${params.id}`,
        productData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: auth.token,
          },
        }
      );
  const access_keys= import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
      const formData = new FormData(e.target);
      formData.append("access_key", access_keys);
  
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
     
          navigate("/dashboard/merchant/product-list");
     
    } catch (error) {
      toast.error("Failed to update product");
      console.log(error);
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
      console.log(res.data.pd);
      setProduct(res.data.pd);
      setVariety(
        Array.isArray(res.data.pd.variety)
          ? res.data.pd.variety
          : [{ name: "", price: "",mrp:"" }]
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    findProduct();
  }, [params.id]);
const oldprice = product.price;
const oldoriginalPrice = product.originalPrice;
const oldstock = product.stock;
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
      setVendername(product.vendername || "");

      setPhoto(product.photo || null);

      setVariety(
        Array.isArray(product.variety)
          ? product.variety
          : [{ name: "", price: "",mrp:"" }]
      );
    }
  }, [product]);

  const handleVarietyChange = (index, field, value) => {
    const newVariety = [...variety];
    newVariety[index][field] = value;
    setVariety(newVariety);
  };

  const addVarietyField = () => {
    setVariety([...variety, { name: "", price: "",mrp:"" }]);
  };

  const removeVarietyField = (index) => {
    const newVariety = variety.filter((_, i) => i !== index);
    setVariety(newVariety);
  };
  const sd = "sd";
  
  return (
    <>
      <Admin_Header />

      <div className="w-75 mx-auto mb-5 mt-5">
        <Backbutton path="/dashboard/merchant/product-list" />
        <h1 className="text-center mb-4">Update Product</h1>
        <span>
          <Link to="/dashboard/merchant/product-list">
            <button className="btn btn-primary mb-3">See All</button>
          </Link>
        </span>
        <form className="border p-4 rounded shadow" onSubmit={handleSubmit} >
          <div className="mb-3" >
            <label className="form-label">Product Custom ID</label>
            <input
              type="text"
              className="form-control"
              value={id}
              onChange={(e) => setId(e.target.value)}
              disabled
              name="product id"

            />
            <input
              type="text"
              className="form-control"
              value={id}
              onChange={(e) => setId(e.target.value)}
              name="product id"
              style={{display:"none"}}
            />
             <input
              type="text"
              className="form-control"
              value={vendername}
              onChange={(e) => setVendername(e.target.value)}
              name="VenderName"
              style={{display:"none"}}

            />
          </div>

          <div className="mb-3">
            <label className="form-label">Product Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Product Category</label>
            <select
              className="form-select"
              value={categoryValue}
              onChange={(e) => setCategoryValue(e.target.value)}               disabled

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
              onChange={(e) => setDescription(e.target.value)}               disabled

            ></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label">MRP Price</label>
            <input type="hidden" name="subject" value="New Update of the product is here " />
            <input
              type="number"
              step="0.01"
              className="form-control"
              value={oldprice}
              style={{display:"none"}}
              name="old price"
            />
            <input
              type="number"
              step="0.01"
              className="form-control"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              name="new price"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Discount Price</label>
            <input
              type="number"
              className="form-control"
              value={oldoriginalPrice}
              style={{display:"none"}}
              name="old originalPrice"
            />
            <input
              type="number"
              className="form-control"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)} 
              name="new originalPrice"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Delivery Charge</label>
            <input
              type="number"
              className="form-control"
              value={deliveryCharge}
              onChange={(e) => setdeliveryCharge(e.target.value)} disabled
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Return Days</label>
            <input
              type="number"
              className="form-control"
              value={returDays}
              onChange={(e) => setReturDays(e.target.value)}disabled
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Replacement Days</label>
            <input
              type="number"
              className="form-control"
              value={replacementDays}
              onChange={(e) => setReplacementDays(e.target.value)} disabled
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Product Stock</label>
            <input
              type="number"
              className="form-control"
              value={oldstock}
              style={{display:"none"}}
              name="old stock"
            
            />
            <input
              type="number"
              className="form-control"
              value={stock || ""}
              onChange={(e) => setStock(e.target.value)}
              name="new stock"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Shipping Details</label>
            <input
              type="text"
              className="form-control"
              value={shipping || ""}
              onChange={(e) => setShipping(e.target.value)}disabled
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
                  style={{display:"none"}}
                  name="old variety name"
                  onChange={(e) =>
                    handleVarietyChange(index, "name", e.target.value)
                  }
                  placeholder={`Variety Name ${index + 1}`}
                />
                <input
                  type="text"
                  className="form-control me-2"
                  value={item.name}
                  name="new variety name"
                  onChange={(e) =>
                    handleVarietyChange(index, "name", e.target.value)
                  }
                  placeholder={`Variety Name ${index + 1}`}
                />
                 <input
                  type="text"
                  className="form-control me-2"
                  value={item.mrp}
                  style={{display:"none"}}
                  name="old variety mrp"
                  onChange={(e) =>
                    handleVarietyChange(index, "mrp", e.target.value)
                  }
                  placeholder={`Variety MRP ${index + 1}`}
                />
                <input
                  type="text"
                  className="form-control me-2"
                  value={item.mrp}
                  name="new variety mrp"
                  onChange={(e) =>
                    handleVarietyChange(index, "mrp", e.target.value)
                  }
                  placeholder={`Variety Mrp ${index + 1}`}
                />
                <input
                  type="number"
                  className="form-control me-2"
                  value={item.price}
                  style={{display:"none"}}
                  name="old variety price"
                  onChange={(e) =>
                    handleVarietyChange(index, "price", e.target.value)
                  }
                  placeholder={`Variety Price ${index + 1}`}
                />
                <input
                  type="number"
                  className="form-control me-2"
                  value={item.price}
                  name="new variety price"
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
              {/* <div
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
              </div> */}
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
              className="form-control"disabled
              onChange={handleProductImagesUpload}
            />
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
