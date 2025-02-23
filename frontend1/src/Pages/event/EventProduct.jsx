import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addEvent, removeEvent } from "../../State/cart_actions";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PopUp from "../../Components/PopUp";


const EventProduct = ({ item }) => {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.cart.events);
  const [startDate, setStartDate] = useState(new Date());

  const [selectedDate, setselectedDate] = useState(new Date());

  const auth = useSelector((state) => state.auth);

  const navigate = useNavigate();

  // * for showing pop up model
  const [showModal, setShowModal] = useState(false);

  // * this state is for asking phone number

  const handleShow = () => {
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  // * this model is for asking phone number

  const handelAdd = () => {
    toast.success("Your Event is added to cart");
  };

  const handelRemove = () => {
    toast.error("Your Event is removed from cart");
  };

  return (
    <>
      <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4" key={item.id}>
        <Toaster position="top-center" reverseOrder={false} />
        <div className="custom-card d-flex flex-column h-100">
          <Link
            to={`/event-details/${item._id}`}
            className="custom-card-image-container"
          >
            <img
              src={item.image[0]}
              className="custom-card-image"
              alt={item.name}
            />
          </Link>
          <div className="custom-card-body d-flex flex-column justify-content-between">
            <div>
              <h5 className="custom-card-title">Rs.{item.price}</h5>
              <p className="custom-card-text">{item.name}</p>
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
              {events.some((p) => p._id === item._id) ? (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() =>{
                    navigate('/cart')
                  }}
                >
                  See the Cart
                </button>
              ) : (
                <>
                  <button
                    className="btn custom-add-button mx-1"
                    onClick={() => {
                      dispatch(addEvent(item));
                      handelAdd();
                    }}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="btn custom-book-button mx-2"
                    onClick={handleShow}
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

export default EventProduct;
