import React, { useEffect, useState } from "react";
import { json, Link, useNavigate } from "react-router-dom";
import Admin_Header from "../Components/Admin_Header";
import axios from "axios";
import { url } from "../../../Components/backend_link/data";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { UploadToS3 } from "../../../State/uploadToS3";

const CreateProduct = () => {
  const navigate = useNavigate();

  const [category, setCategory] = useState([]);


  // * Id handelers
  const [customid, setCustomid] = useState([]);
  const [id, setId] = useState("");



  const [isidgenerated, setIsidgenerated] = useState(false);

  // * product attributes
  const [name, setName] = useState("");
  const [categoryValue, setCategory2] = useState("");
  const [photo, setPhoto] = useState(null);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState();
  const [shipping, setShipping] = useState("");
  const [imageLinks, setImageLinks] = useState([""]);
  const [variety, setVariety] = useState([{ name: "", price: "" }]);

  const [originalPrice, setOriginalPrice] = useState("");
  const [deliveryCharge, setdeliveryCharge] = useState("");
  const [returDays, setReturDays] = useState("");
  const [replacementDays, setReplacementDays] = useState("");
  const [seriviceDays, setSeriviceDays] = useState("");

  // * this state is additional information
  // const [additionalInfo, setAdditionalInfo] = useState({header:"",body:"" });

  var productImages = [];

  const auth = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);

  const [hasVarieties, setHasVarieties] = useState(true); // State to track if varieties are needed

  const [additionalInfo, setadditionalInfo] = useState([{ header: "", body: "" }]); // New state for additional varieties

  const handleProductImagesUpload = (e) => {
    const files = Array.from(e.target.files);
    productImages = [...productImages, ...files];
    // console.log(productImages);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {

      // * upload product images to s3 
      let productImgURL = [];
      if(productImages.length > 0){
        productImgURL = await UploadToS3(
          productImages,
          "Products-Images"
        )
      }
      // console.log(productImgURL);

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
      productData.append("imgLink", JSON.stringify(productImgURL));
      productData.append("seriviceDays", seriviceDays);

      // Check if variety is needed and append accordingly
      if (hasVarieties && variety.length > 0) {
        productData.append("variety", JSON.stringify(variety));
      } else {
        productData.append("variety", JSON.stringify([])); // Send empty array if no varieties
      }

      // Append additional information to productData
      productData.append("additionalDiscription", JSON.stringify(additionalInfo));

      productData.append("returnDays", returDays);
      productData.append("replacementDays", replacementDays);
      // console.log(auth.token);
      

      // console.log(variety);
      const res = await axios.post(
        `${url}/api/v2/products/create-product`,
        productData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: auth.token,
          },
        }
      );

      // if (res.data.success) {
        navigate("/dashboard/admin/product-list");
      //   toast.success(res.data.message);
      //   setLoading(false);
      // } else {
      //   toast.error(res.data.message);
      //   setLoading(false);
      // }
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
      // console.log(error);
     toast.error("Error fetching user details:", error);

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
      return;
    }

    const validIds = customid.filter((id) => id != null);
    
    // console.log("the validids",validIds);

    if (validIds.length === 0) {
      setId("VK-001");
      setIsidgenerated(true);
      setLoading(false);
      return;
    }

    // Sort valid IDs in descending order to get the last one
    const lastId = validIds[validIds.length-1];

    // console.log("The lastID is ", lastId);

    if (!lastId) {
      setId("VK-001");
      setIsidgenerated(true);
      setLoading(false);
      return;
    }

    // Safely split and extract the number part, then increment it
    const lastNumber = parseInt(lastId.split("-")[1]);
    const newNumber = (lastNumber + 1).toString().padStart(3, "0");

    setId(`VK-${newNumber}`);
    setIsidgenerated(true);
    setLoading(false);
  };

  const handleAdditionalVarietyChange = (index, field, value) => {
    const newVarieties = [...additionalInfo];
    newVarieties[index][field] = value;
    setadditionalInfo(newVarieties);
  };

  const addAdditionalVarietyField = () => {
    setadditionalInfo([...additionalInfo, { header: "", body: "" }]);
  };

  const removeAdditionalVarietyField = (index) => {
    const newVarieties = additionalInfo.filter((_, i) => i !== index);
    setadditionalInfo(newVarieties);
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
            <label className="form-label">Product Description</label>
            <textarea
              className="form-control"
              rows="3"
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label">MRP Price</label>
            <input
              type="number"
              className="form-control"
              onChange={(e) => setOriginalPrice(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Discount Price</label>
            <input
              type="number"
              className="form-control"
              onChange={(e) => setPrice(e.target.value)}
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
            <label className="form-label">Store Service replacement Days</label>
            <input
              type="number"
              className="form-control"
              onChange={(e) => setSeriviceDays(e.target.value)}
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
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                checked={!hasVarieties}
                onChange={() => setHasVarieties(!hasVarieties)}
              />
              <label className="form-check-label">
                This product does not have any varieties
              </label>
            </div>

            {hasVarieties && variety.map((item, index) => (
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
            {hasVarieties && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={addVarietyField}
              >
                Add Another Variety
              </button>
            )}
          </div>


          <div className="mb-3">
            <label className="form-label">Additional Information</label>
            {additionalInfo.map((item, index) => (
                <div key={index} className="mb-3 d-flex align-items-center">
                    <input
                        type="text"
                        className="form-control me-2"
                        value={item.header}
                        onChange={(e) =>
                            handleAdditionalVarietyChange(index, "header", e.target.value)
                        }
                        placeholder={`Header ${index + 1}`}
                    />
                    <input
                        type="text"
                        className="form-control me-2"
                        value={item.content}
                        onChange={(e) =>
                            handleAdditionalVarietyChange(index, "body", e.target.value)
                        }
                        placeholder={`Content for the header ${index + 1}`}
                    />
                    {index > 0 && (
                        <button
                            type="button"
                            className="btn btn-danger ms-2"
                            onClick={() => removeAdditionalVarietyField(index)}
                        >
                            Remove
                        </button>
                    )}
                </div>
            ))}
            <button
                type="button"
                className="btn btn-secondary"
                onClick={addAdditionalVarietyField}
            >
                Add Another Additional Info
            </button>
          </div>
         {/* We are adding product by the direct upload technique and we will upload the images to the s3 */}
            <div>
              <label className="form-label">Upload the product Images</label>
              <input
                type="file"
                multiple
                className="form-control"
                accept="image/*" // Restrict to image files
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
}

export default CreateProduct;
