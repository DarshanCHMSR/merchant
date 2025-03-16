import axios from "axios";
import React, { useEffect, useState } from "react";
import Loader from "../../../Components/Loading/Loader";
import Admin_Header from "../Components/Admin_Header";
import Backbutton from "../../../Components/Backbutton";
import { url } from "../../../Components/backend_link/data";
import ReactPaginate from 'react-paginate';


const MerchantList = () => {
  const [loading, setLoading] = useState(false);
const [users, setUsers] = useState([]);
const [filter, setFilter] = useState({
  name: "",
});
 const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const usersPerPage = 20; // Number of products per page
  

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: usersPerPage,
      };
      
      // Add cache-buster only for product filtering
      
      
      const res = await axios.get(`${url}/api/v2/auth/get-k-users`, { params });
      setUsers(res.data.users);
      setTotalPages(Math.ceil(res.data.totalUsers / usersPerPage));
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
  }));
};

const filteredUsers = users.filter((item) => {
  const matchesName = item.name
  ? item.name.toLowerCase().includes(filter.name.toLowerCase())
  : false;

  return matchesName
});

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
          <div className="mb-4 row mt-5">
          <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Vender Name"
                  name="name"
                  value={filter.name}
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
                      
                      <th>Merchant Name</th>
                      <th>Merchant email</th>
                        <th>Merchant Phone</th>
                        {/* <th>Merchant Address</th> */}
                     <th>Merchant address</th>
                     <th>Merchant Shop Name</th>


                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((item) => (
                      <tr key={item._id}>
                        <td>{item.name}</td>
                        <td>{item.email}</td>
                        <td>{item.phone}</td>
                        <td>{item.address}</td>
                        <td>{item.shop}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <nav aria-label="Page navigation example" className="d-flex justify-content-center mt-3">
                      <ReactPaginate
                        previousLabel={"«"}
                        nextLabel={"»"}
                        breakLabel={"..."}
                        breakClassName={"break-me"}
                        pageCount={totalPages}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={3}
                        onPageChange={({ selected }) => handlePageChange(selected + 1)} // Adjust for zero-based index
                        containerClassName={"pagination"}
                        activeClassName={"active"}
                        disabledClassName={"disabled"}
                        pageClassName={"page-item"} // Add custom class for page items
                        pageLinkClassName={"page-link"} // Add custom class for page links
                        previousClassName={"page-item"} // Add custom class for previous button
                        previousLinkClassName={"page-link"} // Add custom class for previous link
                        nextClassName={"page-item"} // Add custom class for next button
                        nextLinkClassName={"page-link"} // Add custom class for next link
                        forcePage={currentPage - 1} // This ensures the correct page is highlighted
                      />
                    </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default MerchantList;
