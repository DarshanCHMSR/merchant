import axios from "axios";
import React, { useEffect, useState } from "react";
import Loader from "../../../Components/Loading/Loader";
import Admin_Header from "../Components/Admin_Header";
import Backbutton from "../../../Components/Backbutton";
import { url } from "../../../Components/backend_link/data";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";


const MerchantList = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState({ name: "",shop:"" });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const usersPerPage = 20;
  const [productCounts, setProductCounts] = useState({}); // Store total products for each user

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: usersPerPage,
      };
      const res = await axios.get(`${url}/api/v2/auth/get-k-users`, { params });
      setUsers(res.data.users);
      setTotalPages(Math.ceil(res.data.totalUsers / usersPerPage));

      // Fetch total products for each user after getting users
      res.data.users.forEach((user) => fetchTotalProducts(user._id));
      
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
    const { name, value } = e.target;
    setFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filteredUsers = users.filter((item) => {

    const matchesName = item.name
    ? item.name.toLowerCase().includes(filter.name.toLowerCase())
    : false;
    const matchesName2 = item.shop
    ? item.shop.toLowerCase().includes(filter.shop.toLowerCase())
    : false;
    return matchesName || matchesName2;
  });  

  const auth = useSelector((state) => state.auth);
  const getAuthToken = () => {
    const authData = localStorage.getItem("auth-Data");
    if (!authData) return null;
    const parsedData = JSON.parse(authData);
    return parsedData.token;
  };
  const token = getAuthToken();

  // Function to fetch total products for a specific user
  const fetchTotalProducts = async (userId) => {
    try {
      const res = await axios.get(`${url}/api/v2/products/fetchtotal/${userId}`);
      setProductCounts((prev) => ({
        ...prev,
        [userId]: res.data.totalProducts, // Store count per user ID
      }));
    } catch (error) {
      console.error("Error fetching total products:", error);
    }
  };

  // Function to delete all products for a specific user
  const deleteUserProducts = async (userId) => {
    try {
      const confirmDelete = window.confirm(`Are you sure you want to delete all products for this user?`);
      if (!confirmDelete) return;
  
      const response = await axios.delete(`${url}/api/v2/products/delete-user-products/${userId}`);
  
      if (response.data.success) {
        alert(response.data.message);
        // Optionally, refresh the product list after deletion
        fetchUsers();
      } else {
        alert("Failed to delete products");
      }
    } catch (error) {
      console.error("Error deleting user products:", error);
      alert("An error occurred while deleting products");
    }
  };
  

  return (
    <> 
      <Admin_Header />
      {loading ? (
        <Loader />
      ) : (
        <div className="container mt-5">
          <div className="row mb-0">
            <div className="col-12">
              <Backbutton path={"/dashboard/admin"} />
            </div>
          </div>
          <div className="mb-4 row mt-5" style={{ justifyContent: "space-between" }}> 
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Vendor Name"
                name="name"
                value={filter.name}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Shop Name"
                name="shop"
                value={filter.shop}
                onChange={handleFilterChange}
              />
            </div>
            
          </div>


          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <table className="table table-striped table-bordered">
                  <thead>
                    <tr>
                      <th>Merchant ID</th>
                      <th>Merchant Name</th>
                      <th>Merchant Email</th>
                      <th>Merchant Phone</th>
                      <th>Merchant Address</th>
                      <th>Merchant Shop Name</th>
                      <th>Delete Merchant</th>
                      <th>Merchant Products Number</th>
                      <th>Delete All Products</th>
                      <th>Merchant Products view</th>
                      <th>Waiting</th>
                      <th>Approved</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((item) => (
                      <tr key={item._id}>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.email}</td>
                        <td>{item.phone}</td>
                        <td>{item.address}</td>
                        <td>{item.shop}</td>
                        <td>
                          <button
                            className="btn btn-danger"
                            onClick={async () => {
                              const confirm = window.confirm(
                                `Are you sure you want to delete ${item.name} and there products?`
                              );
                              if (confirm) {
                                try {
                                  deleteUserProducts(item._id)
                                  await axios.delete(
                                    `${url}/api/v2/auth/delete-user/${item._id}`,
                                    {
                                      headers: {
                                        Authorization: token,
                                      },
                                    }
                                  );
                                  fetchUsers();
                                } catch (error) {
                                  console.error(error);
                                }
                              }
                            }}
                          >
                            Delete
                          </button>
                        </td>
                        <td>
                          {productCounts[item._id] !== undefined
                            ? productCounts[item._id]
                            : "Loading..."}
                        </td>
                        <td>
                          <button
                            className="btn btn-danger"
                            onClick={() => deleteUserProducts(item._id)}
                          >
                            Delete All Products
                          </button>
                        </td>
                        <td>
                                        <Link
                                          to={`/dashboard/admin/product-list/${item._id}`}
                          >
                                          <button className="btn btn-success">
                                            View Products
                                          </button>
                                         </Link>
                                                        
                        </td>
                        <td>
                        </td>
                        <td></td>
                      </tr>
                    ))}
                  </tbody>
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
    </>
  );
};

export default MerchantList;
