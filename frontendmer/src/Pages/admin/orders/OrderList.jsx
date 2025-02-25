import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Admin_Header from "../Components/Admin_Header";
import { Link } from "react-router-dom";
import { url } from "../../../Components/backend_link/data";
import toast from "react-hot-toast";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState(""); // State for filter status
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${url}/api/v2/order/admin-orders`, {
        headers: {
          Authorization: auth.token,
        },
      });
      setOrders(res.data);
      setFilteredOrders(res.data); // Initialize filtered orders
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      const res = await axios.put(
        `${url}/api/v2/order/update-order-status/${id}`,
        { status },
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );

      if (res.data) {
        toast.success("Order status updated successfully");
      }
      fetchOrders(); // Refresh the order list after updating the status
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const statusColors = {
    Not_Processed: "secondary",
    Processing: "warning",
    Shipped: "info",
    Out_for_delivery: "info",
    Delivered: "success",
    Replacement: "danger",
    Out_for_exchange: "info",
    Cancelled: "danger",
    Return: "danger",
    Out_For_Pickup: "info",
    Returned: "success",
  };

  // Filter orders based on status
  const handleFilterChange = (e) => {
    const selectedStatus = e.target.value;
    setFilterStatus(selectedStatus);

    // Filter logic
    const filtered = selectedStatus
      ? orders.filter((order) => order.status === selectedStatus)
      : orders; // If no status is selected, show all orders

    setFilteredOrders(filtered);
  };

  return (
    <div>
      <Admin_Header />
      <div className="container mt-5 p-3">
        <div className="d-flex justify-content-end">
          <button className="btn btn-success m-2">Track the shipment</button>
        </div>
        <h1 className="text-center">Orders</h1>

        {/* Filter Section */}
        <div className="mb-4">
          <h5>Filter Orders by Status</h5>
          <select
            className="form-select"
            value={filterStatus}
            onChange={handleFilterChange}
          >
            <option value="">All Statuses</option>
            {Object.keys(statusColors).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Tracking ID</th>
                <th>Status</th>
                <th>Total Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.customerName}</td>
                  <td>
                    <select
                      value={order.status}
                      className={`form-select text-${statusColors[order.status]}`} // Display current status
                      onChange={(e) =>
                        updateOrderStatus(order._id, e.target.value)
                      } // Pass the selected status to update function
                    >
                      {Object.keys(statusColors).map((status) => (
                        <option
                          key={status}
                          value={status}
                          className={`text-${statusColors[status]}`}
                        >
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>{order.total}</td>
                  <td className="d-flex flex-column flex-md-row">
                    <button
                      className="btn btn-primary me-md-2 mb-2 mb-md-0"
                      onClick={() => updateOrderStatus(order._id, order.status)} // Allow update when clicking the button
                    >
                      Update Status
                    </button>
                    <Link
                      to={`/dashboard/admin/orders/order-detail/${order._id}`}
                    >
                      <button className="btn btn-secondary">View</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
