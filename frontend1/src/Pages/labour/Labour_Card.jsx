import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addEvent, addLabour, removeEvent } from "../../State/cart_actions";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PopUp from "../../Components/PopUp";

const Labour_Card = ({ item }) => {
  const dispatch = useDispatch();
  const labour = useSelector((state) => state.cart.labour);
  const [startDate, setStartDate] = useState(new Date());

  const [selectedDate, setselectedDate] = useState(new Date());

  const auth = useSelector((state) => state.auth);

  // * for showing pop up model
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => {
    setShowModal(true);
  };

  const navigate = useNavigate();

  const handleClose = () => setShowModal(false);

  const handelAdd = () => {
    toast.success("Your Service is added to cart");
  };

  return (
    <>
      <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4" key={item?._id}>
        <Toaster position="top-center" reverseOrder={false} />
        <div className="custom-card d-flex flex-column h-100">
          <Link className="custom-card-image-container">
            <img
              src={item?.image[0]}
              className="custom-card-image"
              alt={item?.name}
            />
          </Link>
          <div className="custom-card-body d-flex flex-column justify-content-between">
            <div>
              <p className="custom-card-text">{item?.name}</p>
            </div>
            <div className="d-flex flex-column flex-md-row align-items-center p-2">
              <label className="me-2 fw-bold mb-2 mb-md-0">Select Date:</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => {
                  setStartDate(date);
                  setselectedDate(date);
                }}
                className="form-control datepicker-responsive w-100 custom-datepicker"
                dateFormat="dd/MM/yyyy"
                placeholderText="Select a date"
                popperPlacement="bottom-start"
                minDate={new Date()}
              />
            </div>
            <div className="buttons d-flex flex-column flex-md-row align-items-stretch mt-3">
              {labour.some((p) => p._id === item._id) ? (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    navigate("/cart");
                  }}
                >
                  GO TO CART
                </button>
              ) : (
                <>
                  <button
                    className="btn custom-add-button mx-1"
                    onClick={() => {
                      dispatch(addLabour(item));
                      handelAdd();
                    }}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="btn custom-book-button"
                    onClick={() => {
                      handleShow();
                    }}
                  >
                    Book Now
                  </button>
                </>
              )}

              {showModal && (
                <PopUp
                  show={showModal}
                  date={selectedDate}
                  handleClose={handleClose}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Labour_Card;
