import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { url } from "../../Components/backend_link/data";
import DatePicker from "react-datepicker";
import PopUp from "../../Components/PopUp";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${url}/api/v2/event/get-event/${id}`);
        setEvent(res.data.event);
      } catch (error) {
        toast.error("Failed to fetch event details. Please try again later.");
      }
    };

    fetchEvent();
  }, [id]);

  return (
    <div className="event-details-container container mt-5">
      {event ? (
        <div className="row">
          <div className="col-md-6 text-center">
            {event.image.map((image, index) => (
              <img
                key={index} // Add a unique key for each element in the map
                src={image}
                alt={event.name}
                className="img-fluid event-image mb-3"
              />
            ))}
          </div>
          <div className="col-md-6">
            <h2 className="event-title">{event.name}</h2>
            {/* Uncomment and use these lines if necessary */}
            {/* <p className="event-date"><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p> */}
            {/* <p className="event-location"><strong>Location:</strong> {event.location}</p> */}
            <div className="d-flex flex-column flex-md-row align-items-center p-2">
              <label className="me-2 fw-bold mb-2 mb-md-0">Select Date:</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => {
                  setStartDate(date);
                  setSelectedDate(date);
                }}
                className="form-control datepicker-responsive w-100 custom-datepicker"
                dateFormat="dd/MM/yyyy"
                placeholderText="Select a date"
                popperPlacement="bottom-start"
                minDate={new Date()}
              />
            </div>
            <p className="event-description">{event.description}</p>
            <p className="event-description">
              ₹{new Intl.NumberFormat("en-IN").format(event.price)}
            </p>
            <button className="btn btn-primary mt-3" onClick={handleShow}>
              Book Now
            </button>
          </div>

          {showModal && (
            <PopUp
              show={showModal}
              date={selectedDate}
              handleClose={handleClose}
            />
          )}
        </div>
      ) : (
        <div className="text-center mt-5">
          <p>Loading event details...</p>
        </div>
      )}
    </div>
  );
};

export default EventDetails;
