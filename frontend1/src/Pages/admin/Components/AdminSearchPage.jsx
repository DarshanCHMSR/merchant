import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { url } from "../../../Components/backend_link/data";
import Admin_Header from "./Admin_Header";
import { Modal } from "react-bootstrap";

const AdminSearchPage = () => {
  const auth = useSelector((state) => state.auth);
  const [item, setItem] = React.useState([]);

  const [showDetails, setShowDetails] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { searchValue } = useParams();

  const [showMore, setShowMore] = useState(false);

  // Function to toggle the description
  const handleShowMore = () => {
    setShowMore(!showMore);
  };
  
  const handleShowDetails = (request) => {
    setSelectedOrder(request);
    setShowDetails(true);
  };

  const handleCloseDetails = () => setShowDetails(false);

  const fetchProduct = async () => {
    try {
      const res = await axios.post(
        `${url}/api/v2/products/search-admin-product`,
        { id: searchValue },
        { headers: { Authorization: auth.token } }
      );

      setItem(res.data);
    } catch (error) {
      toast.error("Please try again later");
    }
  };

  React.useEffect(() => {
    fetchProduct();
  }, [searchValue]);

  return (
    <>
      <Admin_Header />
      <div className="container mt-5 p-5">
        {item?.length > 0 ? (
          <>
            <h1 className="mb-4">Search Results for ID: {item[0].id}</h1>
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {item.map((pd) => (
                    <tr key={pd.id}>
                      <td>{pd.id}</td>
                      <td>{pd.name}</td>
                      <td>{pd.price}</td>
                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleShowDetails(pd)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {selectedOrder && (
        <Modal show={showDetails} onHide={handleCloseDetails}>
          <Modal.Header closeButton>
            <Modal.Title>Product Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              <strong>Product Custom Id:</strong> {selectedOrder?.id}
            </p>
            <p>
              <strong>Product Name:</strong> {selectedOrder?.name}
            </p>
            <p className="">
              <strong>Description:</strong>
              {showMore
                ? ` ${selectedOrder?.description}`
                : ` ${selectedOrder?.description.substring(0, 100)}${selectedOrder?.description.length > 100 ? '...' : ''}`}
              <button
                className="btn btn-link p-0"
                onClick={handleShowMore}
                style={{ marginLeft: '10px' }}
              >
                {showMore ? 'Show Less' : 'Show More'}
              </button>
            </p>

            <p>
              <strong>Price:</strong> {selectedOrder?.price}
            </p>

            <p>
              <strong>Shipping:</strong> {selectedOrder?.shipping}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-primary" onClick={handleCloseDetails}>
              Close
            </button>
          </Modal.Footer>
        </Modal>
      )}
            </div>

          </>
        ) : (
          <div className="text-center">
            <p className="fs-4">No results found</p>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminSearchPage;
