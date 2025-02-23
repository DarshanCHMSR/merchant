import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCartThunk, updateSelectedVariety } from "../State/cart_actions";
import { url } from "../Components/backend_link/data";
import axios from "axios";
import Loader from "../Components/Loading/Loader";
import toast from "react-hot-toast";
import { useSwipeable } from "react-swipeable";
import { FaMapLocation } from "react-icons/fa6";

const ProductPage = () => {
  const { id } = useParams(); 
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [selectedVariety, setSelectedVariety] = useState({});

  const [users, setuser] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);

  const auth = useSelector((state) => state.auth);
  const [cartProduct, setcartProduct] = useState({});

  const [address, setaddress] = useState("");

  useEffect(() => {
    setLoading(true);
    findProduct();
    findUsersName();

    let product = cart.find((product) => {
      if (product._id === id) {
        return product;
      } else {
        console.log("Product not found");
      }
    });

    // console.log("the cart product",product);

    setcartProduct(product);

    if(product) {
      setSelectedVariety(product.selectedVariety);
    }
    setLoading(false);
  }, [id, cart]);

  useEffect(() => {
    setLoading(true);

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });

    if (auth) {
      getExistingAddress();
    }

    setLoading(false);
  }, []);

  const findProduct = async () => {
    try {
      const res = await axios.get(
        `${url}/api/v2/products/get-single-product/${id}`
      );
      setProduct(res.data.pd);
      setSelectedImage(res.data.pd.imgLink[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  const handleVarietySelect = (variety) => {
    setSelectedVariety(variety);
    let selectedVariety = { ...variety };
    dispatch(updateSelectedVariety({ _id: product._id, selectedVariety }));
  };

  const handelAddToCart = (product) => {
    if (!selectedVariety?.name) {
      toast.error("Please select a variety before adding to the cart");
      return;
    }
    setLoading(true);
    const pd = { ...product, selectedVariety };
    let check = dispatch(addToCartThunk(pd));

    if (check) {
      navigate("/checkout");
      setLoading(false);
    }
    setLoading(false);
  };

  const handelbuyNow = () => {
    if (!selectedVariety?.name) {
      toast.error("Please select your variety before buying the cart");
      return;
    }
    const pd = { ...product, selectedVariety };
    setLoading(true);
    let check = dispatch(addToCartThunk(pd));

    if (check) {
      navigate("/checkout");
      setLoading(false);
    }

    setLoading(false);
  };

  // Handle swipe gestures
  const handleSwipe = (direction) => {
    const currentIndex = product.imgLink.indexOf(selectedImage);
    let newIndex;

    if (direction === "LEFT") {
      newIndex =
        currentIndex === product.imgLink.length - 1 ? 0 : currentIndex + 1;
    } else if (direction === "RIGHT") {
      newIndex =
        currentIndex === 0 ? product.imgLink.length - 1 : currentIndex - 1;
    }

    setSelectedImage(product.imgLink[newIndex]);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleSwipe("LEFT"),
    onSwipedRight: () => handleSwipe("RIGHT"),
  });

  const findUsersName = async () => {
    try {
      if (Array.isArray(product?.ratings)) {
        let allUsers = product.ratings.map((rating) => rating.user);

        // Fetch users for each rating
        const userPromises = allUsers.map(async (user) => {
          let res = await axios.get(
            `${url}/api/v2/auth/get-rated-user/${user}`
          );
          return res.data.user;
        });

        // Wait for all promises to resolve and set users state
        const fetchedUsers = await Promise.all(userPromises);
        setuser(fetchedUsers);
      } else {
        console.log("No ratings available for this product.");
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getExistingAddress = async () => {
    if (!auth.user) {
      return;
    }

    try {
      const res = await axios.get(
        `${url}/api/v2/auth/get-user/${auth.user._id}`,
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );
      setaddress(res.data.user.address);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <main className="pt-1">
        <div className="container mt-2">
          <div className="row">
            {/* Product Image Gallery */}
            <div className="col-md-6 mb-4">
              <div className="image-main-container">
                <div className="image-container" {...swipeHandlers}>
                  <img
                    src={selectedImage}
                    className="img-fluid main-image"
                    alt={product.title}
                  />
                </div>

                {/* Thumbnail Images */}
                <div className="d-flex flex-wrap mt-3 thumbnail-container">
                  {(product.imgLink || []).map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="img-thumbnail me-2 mb-2 thumbnail-image"
                      onClick={() => setSelectedImage(img)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="col-md-6 mb-4">
              <div className="p-4">
                {/* Product Tags */}
                <div className="mb-3">
                  <span className="badge bg-info me-1">New</span>
                  <span className="badge bg-danger me-1">Bestseller</span>
                </div>

                {/* Product Title */}
                <h6 className="mb-3">{product.name}</h6>

                {/* Price and Discount */}
                <p className="lead">
                  <span className="text-decoration-line-through me-1">
                    ₹
                    {new Intl.NumberFormat("en-IN").format(
                      product.originalPrice
                    )}
                  </span>
                  <span>
                    ₹{new Intl.NumberFormat("en-IN").format(product.price)}
                  </span>
                </p>

                {/* Product Description */}
                <h5>Details:</h5>

                <p
                  className={`product-description ${
                    isDescriptionExpanded ? "expanded" : ""
                  }`}
                >
                  {product.description}
                </p>
                <button
                  className="btn btn-link p-0"
                  onClick={toggleDescription}
                >
                  {isDescriptionExpanded ? "Show Less" : "Show More"}
                </button>

                {/* Product Varieties */}
                <div className="mb-4 mt-4">
                  <div className="d-flex flex-wrap gap-2">
                    {product?.variety?.length > 0 &&
                      product.variety.map((variety, index) => (
                        <button
                          key={index}
                          onClick={() => handleVarietySelect(variety)}
                          className={`btn variety-btn ${
                            selectedVariety?.name === variety.name
                              ? "bg-primary text-white"
                              : "btn-outline-secondary"
                          }`}
                          style={{ minWidth: "120px", padding: "10px" }}
                        >
                          <div className="fw-bold">{variety.name}</div>
                          <div>
                            ₹
                            {new Intl.NumberFormat("en-IN").format(
                              variety.price
                            )}
                          </div>
                        </button>
                      ))}
                  </div>
                </div>

                {auth?.user && (
                  <div className="mb-4">
                    <h6>
                      Deliver to :{" "}
                      <FaMapLocation className="me-2 text-danger" />
                    </h6>
                    <span className="mb-0 text-capitalize text-muted">
                      {address}
                    </span>
                  </div>
                )}

                {/* Add to Cart / Remove from Cart */}

                {product.stock <= 0 ? (
                  <button
                    type="button"
                    className="btn btn-secondary mb-2 w-100"
                    disabled
                  >
                    Out of Stock
                  </button>
                ) : (
                  <div className="d-flex flex-column w-100 justify-content-center">
                    {cart.some((p) => p._id === product._id) ? (
                      <button
                        type="button"
                        className="btn btn-secondary mb-2 w-50"
                        onClick={() => {
                          navigate("/cart");
                        }}
                      >
                        GOTO CART
                      </button>
                    ) : (
                      <>
                        <button
                          className="btn btn-outline-primary mb-2 w-50"
                          onClick={() => {
                            handelAddToCart(product);
                          }}
                        >
                          {loading ? "Adding..." : "Add to Cart"}
                        </button>
                        <button
                          className="btn btn-primary w-50"
                          onClick={() => {
                            handelbuyNow(product);
                          }}
                        >
                          Buy Now
                        </button>
                      </>
                    )}
                  </div>
                )}

                {/* Product Ratings */}
                <h5 className="mb-3 mt-4">Ratings:</h5>
                <ul className="list-group">
                  {product.ratings && product.ratings.length > 0 ? (
                    product.ratings.map((review, index) => (
                      <li key={index} className="list-group-item">
                        <div className="d-flex align-items-center mb-2">
                          <div className="me-2">
                            {/* Display review rating */}
                            {[...Array(5)].map((_, starIndex) => (
                              <svg
                                key={starIndex}
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                fill={
                                  starIndex < review.rating ? "gold" : "gray"
                                }
                                viewBox="0 0 24 24"
                                style={{ marginRight: "2px" }}
                              >
                                <path d="M12 .587l3.668 7.431 8.2 1.19-5.93 5.779 1.4 8.181-7.338-3.86-7.338 3.86 1.4-8.181-5.93-5.779 8.2-1.19z" />
                              </svg>
                            ))}
                          </div>
                          User
                        </div>
                        <p>{review.comment}</p>
                      </li>
                    ))
                  ) : (
                    <li className="list-group-item">
                      Be the first one to use the product.
                    </li>
                  )}
                </ul>
              </div>

              {/* Return Policy */}
              <div className="my-4">
                <h5 className="mb-3">Return and Replacement Policy</h5>
                <div className="p-4 border rounded bg-light d-flex align-items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    className="bi bi-arrow-repeat me-3 flex-shrink-0"
                    viewBox="0 0 16 16"
                    style={{ color: "#007bff" }}
                  >
                    <path d="M8 0a8 8 0 0 0-8 8h1a7 7 0 1 1 7 7V8h-2.5L8 11l-2.5-2.5H8v3a6.978 6.978 0 0 1-5.742-3H1A8 8 0 0 0 8 0z" />
                  </svg>
                  <div>
                    {product.returnDays === 0 ? (
                      <p className="mb-0">
                        <strong>No Return Available</strong>
                      </p>
                    ) : (
                      <>
                        <p className="mb-1">
                          <strong>Return Window:</strong> {product.returnDays}{" "}
                          days from the date of delivery
                        </p>
                        <p className="text-muted mb-0">
                          Please ensure the item is in its original condition
                          with tags and packaging for a smooth return process.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <div className="p-3 border rounded bg-light d-flex align-items-center">
                  <div>
                    {product.replacementDays > 0 ? (
                      <>
                        <p className="mb-0">
                          <strong>Replacement Window:</strong>{" "}
                          {product.replacementDays} days from the date of
                          delivery.
                        </p>
                        <p className="text-muted mb-0">
                          Please ensure the item is in its original condition
                          with tags and packaging for a smooth replacement
                          process.
                        </p>
                      </>
                    ) : (
                      "No Replacement"
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ProductPage;
