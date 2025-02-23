import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { url } from "../backend_link/data";
import axios from "axios";
import toast from "react-hot-toast";

const ReturnPopup = ({ show, handleClose, id }) => {
  const auth = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  const [reason, setReason] = useState("");


  const sendmail = async (data) => {
    try {
      const res = await axios.post(
        `${url}/api/v2/mail/return-order-mail`,
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

    // Handle form submission logic here
    try {
      const res = await axios.put(
        `${url}/api/v2/order/return-order/${id}`,
        {
          reason,
        },
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );

      console.log(res);

      if (res.data) {
        setReason("");

        const data = {
          name: auth?.user?.name,
          email: auth?.user?.email,
          phone: auth?.user?.phone || "",
          reason: reason,
        };

        const send = sendmail(data);

        if (send) {
          toast.success("Your order has been returned successfully");
          handleClose();
          setReason("");
          window.location.reload();
          setLoading(false);
        }
      }
    } catch (error) {
      handleClose();
      setLoading(false);
    }
    // Clear the reason input
  };

  return (
    <div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Return Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formReason">
              <Form.Label>Reason for Return</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please provide a reason for cancelling your order"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {loading ? "Loading..." : "Submit"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ReturnPopup;
