import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addToCartThunk, removeFromCart } from "../State/cart_actions";
import toast, { Toaster } from "react-hot-toast";

const Grid_Product = ({ item }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cart);    
  const [selectedVariety, setSelectedVariety] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const addCart = (item) =>
    toast.success(`Added to cart`, {
      duration: 1000,
    });

  const removeCart = (item) =>
    toast.error(`Removed from cart`, {
      duration: 1000,
    });

  const handleAddToCart = async (item) => {
    if (item?.variety?.length > 0) {
      // If varieties exist, check if a variety has been selected
      if (!selectedVariety?.name) {
        toast.error("Please select a variety before adding to the cart");
        return;
      }
      // If a variety is selected, proceed to add to cart
      setLoading(true);
      const pd = { ...item, selectedVariety };
      try {
        await dispatch(addToCartThunk(pd)); // Await the dispatch
        addCart(item);
      } catch (error) {
        toast.error("Failed to add item to cart");
      } finally {
        setLoading(false); // Reset loading state
      }
    } else {
      // If no varieties exist, set selectedVariety to product name and price
      const defaultVariety = {
        name: item.name,
        price: item.price,
      };
      setSelectedVariety(defaultVariety);
      setLoading(true);
      const pd = { ...item, selectedVariety: defaultVariety };
      try {
        await dispatch(addToCartThunk(pd)); // Await the dispatch
        addCart(item);
      } catch (error) {
        toast.error("Failed to add item to cart");
      } finally {
        setLoading(false); // Reset loading state
      }
    }
  };

  const handelbuyNow = async (item) => {
    setLoading(true); // Set loading state to true
    if (item?.variety?.length) {
      const lastVariety = item.variety[item.variety.length - 1];
      setSelectedVariety(lastVariety);

      // Use lastVariety directly in singlePd instead of selectedVariety
      const singlePd = { ...item, selectedVariety: lastVariety };
      try {
        await dispatch(addToCartThunk(singlePd)); // Await the dispatch
        navigate("/checkout");
      } catch (error) {
        toast.error("Failed to proceed to checkout");
      } finally {
        setLoading(false); // Reset loading state
      }
    } else {
      // Handle case where there are no varieties
      const defaultVariety = {
        name: item.name,
        price: item.price,
      };
      const singlePd = { ...item, selectedVariety: defaultVariety };
      try {
        await dispatch(addToCartThunk(singlePd)); // Await the dispatch
        navigate("/checkout");
      } catch (error) {
        toast.error("Failed to proceed to checkout");
      } finally {
        setLoading(false); // Reset loading state
      }
    }
  };

  return (
    <>
      <div className="col-lg-4 col-md-6 col-sm-6 d-flex my-card-2">
        <div className="card w-100 my-2 shadow-2-strong">
          <div className="my-card-img-container">
            {item.imgLink && (
              <Link to={`/product/${item._id}`}>
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
              </Link>
            )}
          </div>
          <div className="card-body d-flex flex-column">
            <div className="d-flex flex-row">
              <h5 className="mb-1 me-1">
                ₹{new Intl.NumberFormat("en-IN").format(item.price)}
              </h5>
              <span className="text-danger">
                <s>
                  ₹{new Intl.NumberFormat("en-IN").format(item.originalPrice)}
                </s>
              </span>
            </div>
            <p className="card-text text-truncate">{item.name}</p>
            <div className="">
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
                      dispatch(removeFromCart(item));
                      removeCart(item);
                    }}
                  >
                    GO TO CART
                  </button>
                ) : (
                  <>
                    <button
                      className="btn btn-outline-primary btn-sm my-card-button p-2 custom-button"
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
      </div>
    </>
  );
};

export default Grid_Product;
