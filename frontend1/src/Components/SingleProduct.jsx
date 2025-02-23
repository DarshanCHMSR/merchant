import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addToCartThunk } from "../State/cart_actions";

const SingleProduct = ({ item }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cart);
  const [selectedVariety, setSelectedVariety] = useState(null);

  const [loading, setloading] = useState(false);

  const navigate = useNavigate();

  const addCart = (item) =>
    toast.success(`Item added to cart`, {
      duration: 1000,
    });

  const handleAddToCart = (item) => {
    if (item?.variety?.length) {
      const lastVariety = item.variety[item.variety.length - 1];
      setSelectedVariety(lastVariety);

      // Use lastVariety directly in singlePd instead of selectedVariety
      const singlePd = { ...item, selectedVariety: lastVariety };
      let check = dispatch(addToCartThunk(singlePd));

      if (check) {
        addCart(item);
      } // Log the value being set to the state
    }
  };

  const handelbuyNow = async (item) => {
    if (item?.variety?.length) {
      const lastVariety = item.variety[item.variety.length - 1];
      setSelectedVariety(lastVariety);

      // Use lastVariety directly in singlePd instead of selectedVariety
      const singlePd = { ...item, selectedVariety: lastVariety };
      setloading(true);
      let check = dispatch(addToCartThunk(singlePd));

    if (check) {
      navigate("/checkout");
      setloading(false);
    }

    setloading(false);
    }
  };

  return (
    <>
      <div
        className="col-lg-3 col-md-6 col-sm-12 mb-4 my-card-2"
        key={item._id}
      >
        <Toaster position="top-center" reverseOrder={false} />
        <div className="card my-2 shadow border-0 product-img card-action my-card">
          <Link to={`/product/${item._id}`} className="text-decoration-none">
            <div className="my-card-img-container">
              {item.imgLink && (
                <img
                  src={item.imgLink[0]}
                  alt={item.name}
                  className="card-img-top rounded-2 p-1 w-100"
                  style={{
                    width: "90%",
                    height: "90%",
                    objectFit: "contain",
                  }}
                />
              )}
            </div>
          </Link>
          <div className="card-body my-card-body">
            <h5 className="card-title fw-bold text-truncate mb-2 my-card-title">
              ₹{new Intl.NumberFormat("en-IN").format(item.price)}
            </h5>
            <p className="card-text text-truncate mb-3 my-card-text">
              {item.name}
            </p>
            <div className="d-flex gap-2 buttons">
              {item.stock <= 0 ? (
                <button
                  type="button"
                  className="btn btn-secondary text-danger btn-sm w-100 my-card-button p-2 custom-button"
                >
                  OUT OF STOCK
                </button>
              ) : cartItems.some((p) => p._id === item._id) ? (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm w-100 my-card-button p-2 custom-button"
                  onClick={() => {
                    navigate("/cart");
                  }}
                >
                  GO TO CART
                </button>
              ) : (
                <>
                  <button
                    className="btn btn-outline-primary btn-sm my-card-button p-2 custom-button box-shadow-0"
                    onClick={() => {
                      handleAddToCart(item);
                    }}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="btn btn-primary btn-sm my-card-button custom-button box-shadow-0"
                    onClick={() => handelbuyNow(item)}
                  >
                    {loading ? "Loading..." : "Buy Now"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleProduct;
