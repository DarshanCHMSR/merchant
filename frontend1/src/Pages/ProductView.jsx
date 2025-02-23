import React, { useEffect, useState } from "react";
import Grid_Product from "../Components/Grid_Product";
import Loader from "../Components/Loading/Loader";
import toast from "react-hot-toast";
import { url } from "../Components/backend_link/data";
import axios from "axios";

const ProductView = ({ dep }) => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 9; // Number of products per page

  useEffect(() => {
    fetchProducts();
    fetchCategory();
  }, [currentPage, selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${url}/api/v2/products/get-k-products`, {
        params: {
          page: currentPage,
          limit: productsPerPage,
          category: selectedCategory || undefined,
        },
      });

      setProducts(res.data.products);
      setTotalPages(Math.ceil(res.data.totalProducts / productsPerPage));
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Please try again later");
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchCatebasedProducts();

  // }, [selectedCategory])

  const fetchCatebasedProducts = async () => {
    try {
      const res = await axios.get(
        `${url}/api/v2/products/get-product-by-category/${selectedCategory._id}`
      );
      setProducts(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCategory = async () => {
    try {
      const res = await axios.get(`${url}/api/v2/category/get-categories`);
      setCategory(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCategorySelect = (categoryName) => {
    console.log(categoryName);
    setSelectedCategory(categoryName);
    setCurrentPage(1); // Reset to the first page when a new category is selected
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div>
            <section className="" style={{ marginTop: "5vh" }}>
              <div className="container">
                <div className="row">
                  {/* Sidebar */}
                  <div className="col-lg-3">
                    {/* Show filter button */}
                    <button
                      className="btn btn-outline-secondary mb-3 w-100 d-lg-none"
                      type="button"
                      data-toggle="collapse"
                      data-target="#collapseExample"
                      aria-expanded="false"
                      aria-controls="collapseExample"
                    >
                      <span>Show filter</span>
                    </button>

                    {/* Collapsible wrapper */}
                    <div
                      className="collapse card d-lg-block mb-5"
                      id="collapseExample"
                    >
                      <div
                        className="accordion"
                        id="accordionPanelsStayOpenExample"
                      >
                        <div className="accordion-item">
                          <h2 className="accordion-header" id="headingOne">
                            <button
                              className="accordion-button text-dark bg-light"
                              type="button"
                              data-mdb-toggle="collapse"
                              data-mdb-target="#panelsStayOpen-collapseOne"
                              aria-expanded="true"
                              aria-controls="panelsStayOpen-collapseOne"
                            >
                              Categories
                            </button>
                          </h2>
                          <div
                            id="panelsStayOpen-collapseOne"
                            className="accordion-collapse collapse show"
                            aria-labelledby="headingOne"
                          >
                            <div className="accordion-body p-0">
                              <ul className="list-group list-group-flush">
                                {category
                                  .filter(
                                    (cat) =>
                                      cat.name !== "Book Ride" &&
                                      cat.name !== "Schedule Event" &&
                                      cat.name !== "Urban Services"
                                  )
                                  .map((cat) => (
                                    <li
                                      key={cat._id}
                                      className={`list-group-item ${
                                        selectedCategory === cat.name
                                          ? "active"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        handleCategorySelect(cat._id)
                                      }
                                    >
                                      {cat.name}
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-9">
                   

                    <div className="row">
                      {products.map((item) => (
                        <Grid_Product key={item._id} item={item} />
                      ))}
                    </div>

                    <hr />

                    {/* Pagination */}
                    <nav
                      aria-label="Page navigation example"
                      className="d-flex justify-content-center mt-3"
                    >
                      <ul className="pagination">
                        <li
                          className={`page-item ${
                            currentPage === 1 ? "disabled" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            &laquo;
                          </button>
                        </li>
                        {[...Array(totalPages)].map((_, index) => (
                          <li
                            key={index}
                            className={`page-item ${
                              currentPage === index + 1 ? "active" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(index + 1)}
                            >
                              {index + 1}
                            </button>
                          </li>
                        ))}
                        <li
                          className={`page-item ${
                            currentPage === totalPages ? "disabled" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                          >
                            &raquo;
                          </button>
                        </li>
                      </ul>
                    </nav>
                    {/* Pagination */}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </>
      )}
    </>
  );
};

export default ProductView;
