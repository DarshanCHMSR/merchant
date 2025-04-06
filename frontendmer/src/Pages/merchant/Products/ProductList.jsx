import axios from "axios";
import React, { useEffect, useState } from "react";
import Loader from "../../../Components/Loading/Loader";
import Merchant_Header from "../Components/Merchant_Header";
import { Link } from "react-router-dom";
import Backbutton from "../../../Components/Backbutton";
import { url } from "../../../Components/backend_link/data";
import SetStatus from "./SetStatus";
import { useSelector } from "react-redux";
import Footer from "../../Footer";
import ReactPaginate from 'react-paginate';
import Modal from "react-bootstrap/Modal"; // Import Bootstrap Modal


const ProductList = () => {
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (imgUrl) => {
    setSelectedImage(imgUrl);
  };

  const handleClose = () => {
    setSelectedImage(null);
  };

  const [filter, setFilter] = useState({
    name: "",
    minPrice: "",
    maxPrice: "",
    inStock: false,
    none: false,
    status: false,
    status2: false,
  });

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 9; // Number of products per page
  




  const auth = useSelector((state) => state.auth);
  const getAuthToken = () => {
    const authData = localStorage.getItem("auth-Data");

    if (!authData) return null; // Return null if no data is found

    const parsedData = JSON.parse(authData); // Convert JSON string back to object

    return parsedData.token; // Assuming the token is stored under "token"
};

 const handleDownload = async () => {
    try {
      const token = getAuthToken();  

      const res = await axios.get(`${url}/api/v2/products/fetchuserproducts`, { 
        headers: {
          Authorization: token,
          // "Content-Type": "application/json",
        },
        responseType: "blob", // Ensure we get binary data
      });
      // Create a URL for the file
      const url2 = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url2;
      link.setAttribute("download", "products.csv"); // File name
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url2);
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  }

// console.log(auth.token);  
  useEffect(() => {
    fetchProducts();   
  }, [currentPage]);

  const fetchProducts = async () => {
    setLoading(true);
    const token = getAuthToken();
    try {
      const params = {
        page: currentPage,
        limit: productsPerPage,
      };

      // Add cache-buster only for product filtering
       
      
      const res = await axios.get(`${url}/api/v2/products/fetch`, { params ,
          headers: {
            Authorization: token,
            // "Content-Type": "application/json",
          },
          
        }
      );
      setProducts(res.data.products);
      setTotalPages(Math.ceil(res.data.totalProducts / productsPerPage));
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilter((prev) => ({
      ...prev,  
      [name]: type === "checkbox" ? checked : value,
      inStock: name === "inStock",
      status: name === "status",
      status2: name === "status2",
      none: name === "none",
    }));
};

const filteredProducts = products.filter((item) => {
    const matchesName = item.name
      ? item.name.toLowerCase().includes(filter.name.toLowerCase())
      : false;

    const matchesMinPrice = filter.minPrice
      ? item.price >= filter.minPrice
      : true;
    
    const matchesMaxPrice = filter.maxPrice
      ? item.price <= filter.maxPrice
      : true;

    const matchesStock = filter.inStock ? item.stock > 0 : true;
    const matchesStatus = filter.status ? item.status === 1 : true; 
    const matchesStatus2 = filter.status2 ? item.status === 0 : true; 

    // Assuming `item.status` is either "active" or "inactive"
    return matchesName && matchesMinPrice && matchesMaxPrice && matchesStock && matchesStatus && matchesStatus2;
});

  return (
    <>
      <Merchant_Header />
      {loading ? (
        <Loader />
      ) : (
        <div className="container mt-5">
          <div className="row mb-0">
            <div className="col-12" style={{ marginTop: "50px" }}>
              {/* <Backbutton path={"/dashboard/merchant"} /> */}
            </div>
          </div>

          <h1 className="text-center mb-5">Product List</h1>
          <div className="row mb-4">
            <div className="col-12 col-md-4 mb-2">
              <Link to={"/dashboard/merchant/create-product"}>
                <button className="btn btn-primary w-100">Add a Product</button>
              </Link>
            </div>
            <div className="col-12 col-md-4 mb-2">
              <Link to={"/dashboard/merchant/bulk-upload"}>
                <button className="btn btn-primary w-100">Upload in Bulk</button>
              </Link>
            </div>
            <div className="col-12 col-md-4 mb-2">
              <button className="btn btn-primary w-100" onClick={handleDownload}>
                Download Excel
              </button>
            </div>
          </div>

          {/* Filter Component */}
          <div className="mb-4">
            <h5>Filter Products</h5>
            <div className="row">
              <div className="col-12 col-md-4 mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Product Name"
                  name="name"
                  value={filter.name}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="col-12 col-md-4 mb-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Min Price"
                  name="minPrice"
                  value={filter.minPrice}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="col-12 col-md-4 mb-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Max Price"
                  name="maxPrice"
                  value={filter.maxPrice}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
            <div className="form-check mt-3">
              <input
                type="checkbox"
                className="form-check-input"
                id="inStock"
                name="inStock"
                checked={filter.inStock}
                onChange={handleFilterChange}
              />
              <label className="form-check-label" htmlFor="inStock">
                In Stock Only
              </label>
            </div>
            <div className="form-check mt-3">
              <input
                type="checkbox"
                className="form-check-input"
                id="status"
                name="status"
                checked={filter.status}
                onChange={handleFilterChange}
              />
              <label className="form-check-label" htmlFor="status">
                Approved
              </label>
            </div>
            <div className="form-check mt-3">
              <input
                type="checkbox"
                className="form-check-input"
                id="status2"
                name="status2"
                checked={filter.status2}
                onChange={handleFilterChange}
              />
              <label className="form-check-label" htmlFor="status2">
                Waiting
              </label>
            </div>
            <div className="form-check mt-3">
              <input
                type="checkbox"
                className="form-check-input"
                id="none"
                name="none"
                checked={filter.none}
                onChange={handleFilterChange}
              />
              <label className="form-check-label" htmlFor="none">
                None
              </label>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <table className="table table-striped table-bordered">
                  <thead>
                    <tr>
                      <th>Product ID</th>
                      <th>Product Name</th>
                      <th>MRP</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Actions</th>
                      <th>Update</th>
                      <th>Image</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((item) => (
                      <tr key={item._id}>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>
                          ₹
                          {new Intl.NumberFormat("en-IN").format(
                            item?.originalPrice
                          )}
                        </td>
                        <td>
                          ₹{new Intl.NumberFormat("en-IN").format(item.price)}
                        </td>
                        <td>{item.stock}</td>
                        <td>
                          <div className="d-flex justify-content-start align-items-center">
                            <div key={item._id}>
                              <h3 className="text-lg font-bold text-center">
                                {product.name}
                              </h3>
                              <SetStatus productId={item._id} />
                            </div>
                          </div>
                        </td>
                        <td>
                          <Link
                            to={`/dashboard/merchant/update-product/${item._id}`}
                          >
                            <button className="btn btn-success">Update</button>
                          </Link>
                        </td>
                        <td>
                          <div className="my-card-img-container">
                            {item.imgLink && (
                              <img
                                src={item.imgLink[0]}
                                alt={item.name}
                                className="card-img-top rounded-2 p-1 w-100"
                                loading="lazy"
                                style={{
                                  width: "90%",
                                  height: "90%",
                                  objectFit: "contain",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  handleImageClick(item.imgLink[0])
                                }
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <Modal show={!!selectedImage} onHide={handleClose} centered>
                    <Modal.Body className="text-center">
                      {selectedImage && (
                        <img
                          src={selectedImage}
                          alt="Full-size preview"
                          style={{ width: "100%", height: "auto" }}
                        />
                      )}
                    </Modal.Body>
                  </Modal>
                </table>
              </div>
            </div>
            <nav
              aria-label="Page navigation example"
              className="d-flex justify-content-center mt-3"
            >
              <ReactPaginate
                previousLabel={"«"}
                nextLabel={"»"}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={totalPages}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={({ selected }) => handlePageChange(selected + 1)}
                containerClassName={"pagination"}
                activeClassName={"active"}
                disabledClassName={"disabled"}
                pageClassName={"page-item"}
                pageLinkClassName={"page-link"}
                previousClassName={"page-item"}
                previousLinkClassName={"page-link"}
                nextClassName={"page-item"}
                nextLinkClassName={"page-link"}
                forcePage={currentPage - 1}
              />
            </nav>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default ProductList;
