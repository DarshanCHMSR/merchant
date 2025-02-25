import { Button, Form, Modal } from 'react-bootstrap';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { url } from './backend_link/data';

const PopUp = ({ show, handleClose,date , product }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [mail, setMail] = useState('');
  const [loading, setLoading] = useState(false);

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const res = await axios.post(`${url}/api/v2/mail/book-mail`, {
        name,
        email: mail,
        address,
        phone,
        date,
        product:product
      });

      if (res.data.success) {
        toast.success('Booked successfully');
        setLoading(false);
        handleClose();
        setName('');
        setPhone('');
        setAddress('');
        setMail('');
      } else {
        toast.error(res.data.message);
        setLoading(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');
      setLoading(false);
      handleClose();
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Please fill the form</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formPhone">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={mail}
              onChange={(e) => setMail(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formAddress">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Form.Group>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Loading...' : 'Submit'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default PopUp;
