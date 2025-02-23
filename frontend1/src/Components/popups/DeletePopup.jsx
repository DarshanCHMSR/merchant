import axios from "axios";
import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { url } from "../backend_link/data";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const DeletePopup = ({ show, handleClose, id }) => {
  const auth = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");

  const sendCancellationRequest = async (data) => {
    try {
      const res = await axios.post(
        `${url}/api/v2/mail/cancel-order-mail`,
        data
      );

      console.log("The response of mail function is ",res);

      if(res){

        return true
      }

    } catch (err) {
      console.error("Error:", err);
      toast.error(
        "Something went wrong while confirming your order. Please try again later."
      );
      return false;
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const res = await axios.put(
        `${url}/api/v2/order/cancel-order/${id}`,
        { reason },
        {
          headers: { Authorization: auth.token },
        }
      );
  
      if (res.data && auth?.user) {
        const data = {
          name: auth.user.name,
          email: auth.user.email,
          phone: auth.user.phone || "",
          reason: reason,
        };
        const sendmail = sendCancellationRequest(data);
  
        if (sendmail) {
          toast.success("Your order has been cancelled successfully");
          handleClose();
          setReason(""); 
          window.location.reload(); 
          setLoading(false);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Error canceling the order. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  console.log(loading)

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Cancel Order</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formReason">
            <Form.Label>Reason for Cancellation</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide a reason for cancelling your order"
              required
            />
          </Form.Group>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Loading..." : "Submit"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default DeletePopup;
