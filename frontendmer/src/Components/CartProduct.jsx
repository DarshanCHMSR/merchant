import React, { useEffect, useState } from "react";
import { Button, Col, ListGroup } from "react-bootstrap";
import { AiFillDelete } from "react-icons/ai";
import {
  decreaseQty,
  increaseQty,
  removeEvent,
  removeFromCartThunk,
  removeLabour,
  updateSelectedVariety,
} from "../State/cart_actions";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const CartProduct = ({ prod }) => {
  const dispatch = useDispatch();

  const [checkEvent, setCheckEvent] = useState(false);
  const [imgEvent, setimgEvent] = useState("");

  const [islabour, setIslabour] = useState(false);

  const labour = useSelector((state) => state.cart?.labour);

  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  useEffect(() => {
    if (prod?.image) {
      setimgEvent(prod?.image[0]);
      setCheckEvent(true);
    } else if (prod?.imgLink) {
      setimgEvent(prod?.imgLink[0]);
    }

    if (prod.price) {
      setIslabour(false);
    } else {
      setIslabour(true);
    }
  }, [prod]);

  const handleVarietyChange = (varietyId) => {
    const selectedVariety = prod.variety.find((v) => v._id === varietyId);
    if (selectedVariety) {
      dispatch(updateSelectedVariety({ _id: prod._id, selectedVariety }));
    }
  };

  return (
    <div>
    <div className="row gy-3 mb-4">
      <div className="col-lg-5">
        <div className="d-flex">
          <img
            src={imgEvent}
            className="border rounded me-3"
            style={{ width: "96px", height: "96px" }}
            // loading="lazy"
            alt="Product"
          />
  
          <div className="flex-grow-1">
            <Link
              to={`/product/${prod?._id}`}
              className="nav-link text-dark font-weight-bold"
            >
              <h5 style={{ fontSize: "16px" }}>{prod?.name}</h5>
            </Link>
            <p
              className={`product-description ${isDescriptionExpanded ? "expanded" : ""}`}
              style={{ fontSize: "12px" }}
            >
              {prod?.description}
            </p>
            <button
              className="btn btn-link p-0"
              onClick={toggleDescription}
            >
              {isDescriptionExpanded ? "Show Less" : "Show More"}
            </button>
  
            {/* Variety Options */}
            {!checkEvent && !islabour && (
              <div className="mt-2">
                <label htmlFor="varietySelect" className="text-muted">Choose Variety:</label>
                <select
                  id="varietySelect"
                  className="form-select"
                  onChange={(e) => handleVarietyChange(e.target.value)}
                >
                  {prod?.variety?.map((variety) => (
                    <option key={variety._id} value={variety._id}>
                      {variety.name} - ₹{new Intl.NumberFormat("en-IN").format(variety.price)}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
  
          <div className="ms-3">
            {!checkEvent ? (
              <small className="text-muted font-weight-bolder">
                {prod?.selectedVariety?.name || ""}
              </small>
            ) : (
              <small className="text-muted font-weight-bolder"></small>
            )}
          </div>
        </div>
      </div>
  
      <div className="col-lg-2 col-sm-6">
        <div className="text-end">
          <small className="text-muted text-nowrap">
            {!checkEvent ? (
              <>
                ₹{prod?.selectedVariety?.price ? new Intl.NumberFormat("en-IN").format(prod.selectedVariety.price) : ""} / per item
              </>
            ) : (
              <>{prod?.price ? "₹" + prod.price : ""}</>
            )}
          </small>
        </div>

      </div>
  
      
      {!checkEvent && (
        <span className="col-lg-2 col-sm-6 d-flex align-items-center">
          <button
            className="btn btn-light font-weight-bolder fs-7 me-2"
            onClick={() => dispatch(decreaseQty(prod))}
          >
            -
          </button>
  
          <span className="fs-6 mx-2">{prod?.qty || 0}</span>
  
          <button
            className="btn btn-light font-weight-bolder fs-7 ms-2"
            onClick={() => dispatch(increaseQty(prod))}
          >
            +
          </button>
        </span>
      )}
  
      <div className="col-lg-2">
        <Button
          type="button"
          variant="light"
          onClick={() => {
            if (!checkEvent) {
              dispatch(removeFromCartThunk(prod));
            }
            if (islabour) {
              dispatch(removeLabour(prod));
            } else {
              dispatch(removeEvent(prod));
            }
          }}
        >
          <AiFillDelete fontSize="20px" />
        </Button>
      </div>
    </div>
  </div>
  
  );
};

export default CartProduct;
