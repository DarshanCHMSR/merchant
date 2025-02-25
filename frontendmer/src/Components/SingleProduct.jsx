import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addToCartThunk } from "../State/cart_actions";

const SingleProduct = ({ item }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cart);
  const [selectedVariety, setSelectedVariety] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // * we are explictily taking out the _id of the product becuase algolia has redeclared in the name of objectID 
  const id = item._id.$oid || item._id;

  const addCart = (item) =>
    toast.success(`Item added to cart`, {
      duration: 1000,
    });

  const handleAddToCart = async (item) => {
    // Check if the product has varieties
    if (item?.variety?.length > 0) {
      // If varieties exist, check if a variety has been selected
      if (!selectedVariety?.name) {
        toast.error("Please select a variety before adding to the cart");
        return;
      }
      // If a variety is selected, proceed to add to cart
      setLoading(true);
      const pd = { ...item, selectedVariety };
      await dispatch(addToCartThunk(pd)); // Await the dispatch
      setLoading(false);
      addCart(item);
    } else {
      // If no varieties exist, set selectedVariety to product name and price
      const defaultVariety = {
        name: item.name,
        price: item.price,
      };
      setSelectedVariety(defaultVariety);
      setLoading(true);
      const pd = { ...item, selectedVariety: defaultVariety };
      await dispatch(addToCartThunk(pd)); // Await the dispatch
      setLoading(false);
      addCart(item);
    }
  };

  const handelbuyNow = async (item) => {
    setLoading(true); // Set loading state to true
    if (item?.variety?.length) {
      const lastVariety = item.variety[item.variety.length - 1];
      setSelectedVariety(lastVariety);

      // Use lastVariety directly in singlePd instead of selectedVariety
      const singlePd = { ...item, selectedVariety: lastVariety };
      await dispatch(addToCartThunk(singlePd)); // Await the dispatch
      setLoading(false); // Reset loading state
      navigate("/checkout");
    } else {
      // Handle case where there are no varieties
      const defaultVariety = {
        name: item.name,
        price: item.price,
      };
      const singlePd = { ...item, selectedVariety: defaultVariety };
      await dispatch(addToCartThunk(singlePd)); // Await the dispatch
      setLoading(false); // Reset loading state
      navigate("/checkout");
    }
  };

  return (
    <div className="col-lg-3 col-md-6 col-sm-12 mb-4 my-card-2" key={item._id}>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="card my-2 shadow border-0 product-img card-action my-card">
        <Link to={`/product/${id}`} className="text-decoration-none">
          <div className="my-card-img-container">
            {item.imgLink && (
              <img
                src={item.imgLink[0]}
                alt={item.name}
                className="card-img-top rounded-2 p-1 w-100"
                loading="lazy"
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
          <h5 className="card-title fw-bold mb-2 my-card-title" style={{fontSize:"1rem"}}>
          <span className="card-title fw-bold text-truncate mb-2 m-1 my-card-title text-danger text-decoration-line-through" style={{fontSize:"0.9rem"}}>
            ₹{new Intl.NumberFormat("en-IN").format(item?.originalPrice)}

          </span>

            ₹{new Intl.NumberFormat("en-IN").format(item.price)}
          </h5>
          {/* <span className="card-title fw-bold text-truncate mb-2 my-card-title text-danger text-decoration-line-through">
            ₹{new Intl.NumberFormat("en-IN").format(item?.originalPrice)}
          </span> */}
          <p className="card-text mb-3 my-card-text" style={{ 
            display: '-webkit-box', 
            WebkitBoxOrient: 'vertical', 
            overflow: 'hidden', 
            WebkitLineClamp: 2,
            fontSize: '0.85rem'
          }}>
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
  );
};

export default SingleProduct;
