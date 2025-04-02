import React, { useEffect, useState } from "react";
import Admin_Header from "./Components/Admin_Header";
import { Table, Button, Modal } from "react-bootstrap";
import { url } from "../../Components/backend_link/data";
import axios from "axios";
import { useSelector } from "react-redux";

const Review = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);


  const auth = useSelector((state) => state.auth);

  const handleShowDetails = (request) => {
    setSelectedOrder(request);
    setShowDetails(true);
  };

  const handleCloseDetails = () => setShowDetails(false);

  const [orders, setOrders] = useState([]);
  const [user,setUser] = useState({})


  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${url}/api/v2/order/admin-orders`, {
        headers: {
          Authorization: auth.token,
        },
      });

      const filteredOrders = res.data.filter(order =>
        order.status === "Cancelled" ||
        order.status === "Return" ||
        order.status === "Returned" ||
        order.status === "Replacement"
    );
    setOrders(filteredOrders);
      
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  
  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
      <Admin_Header />

      <div className="container my-4">
        <h2>Order Cancellations and Product Returns</h2>
        <Table responsive bordered hover className="mt-3">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Product Names</th>
              <th>Reason</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.products.map((product) => product.id)}</td>
                <td>
                  {order.products.map((product) => product.name).join(", ")}
                </td>
                <td>{order.reason}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>{order.status}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => handleShowDetails(order)}
                  >
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {selectedOrder && (
          <Modal show={showDetails} onHide={handleCloseDetails}>
            <Modal.Header closeButton>
              <Modal.Title>Order Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                <strong>Order ID:</strong> {selectedOrder._id}
              </p>

              <p>
                <strong>User ID:</strong> {selectedOrder.buyer._id}
              </p>

              <p>
                <strong>Product Custom ID:</strong> {
                  selectedOrder.products.map((product) => product.id).join(", ")
                }
              </p>
              <p>
                <strong>Product Names:</strong>{" "}
                {selectedOrder.products
                  .map((product) => product.name)
                  .join(", ")}
              </p>
              <p>
                <strong>Reason:</strong> {selectedOrder.reason}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedOrder.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Status:</strong> {selectedOrder.status}
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseDetails}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    </>
  );
};

export default Review;
