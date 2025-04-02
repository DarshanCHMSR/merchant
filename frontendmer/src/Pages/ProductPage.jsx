import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCartThunk, updateSelectedVariety } from "../State/cart_actions";
import { url } from "../Components/backend_link/data";
import axios from "axios";
import Loader from "../Components/Loading/Loader";
import toast from "react-hot-toast";
import { useSwipeable } from "react-swipeable";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProductPage = () => {
  const { id } = useParams();

  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [selectedVariety, setSelectedVariety] = useState({});
  const [categories, setCategories] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cart);
  const auth = useSelector((state) => state.auth);
  const [cartProduct, setcartProduct] = useState({});
  const [address, setaddress] = useState("");

  const [pincode, setPincode] = useState("");
  const [pinLoading, setPinLoading] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState(true);

  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    findProduct();
    findUsersName();
    fetchCategories();

    const foundProduct = cartItems.find((item) => item._id === id);
    setcartProduct(foundProduct);

    if (foundProduct) {
      setSelectedVariety(foundProduct.selectedVariety);
    }

    setLoading(false);
  }, [id, cartItems]);

  useEffect(() => {
    // Fetch product data and set initial selected image
    const fetchProductData = async () => {
      await findProduct();
      if (product.imgLink && product.imgLink.length > 0) {
        setSelectedImage(product.imgLink[0]); // Set the first image as default
      }
    };
    fetchProductData();
  }, [id, cartItems]);

  const findProduct = async () => {
    // console.log("the id = ",id)
    try {
      const res = await axios.get(
        `${url}/api/v2/products/get-single-product/${id}`
      );
      setProduct(res.data.pd);

      console.log("the product is ", res.data.pd.additionalDiscription);
      setSelectedImage(res.data.pd.imgLink[0]);

      // Set default selected variety based on product variety length
      if (res.data.pd.variety && res.data.pd.variety.length > 1) {
        setSelectedVariety(res.data.pd.variety[0]); // Select the first variety
      } else if (res.data.pd.variety && res.data.pd.variety.length === 1) {
        setSelectedVariety(res.data.pd.variety[0]); // Select the only variety
      } else {
        // If no varieties, set selectedVariety to product name and price
        setSelectedVariety({
          name: res.data.pd.name,
          price: res.data.pd.price,
        });
      }
    } catch (error) {
      toast.error("Error fetching product details");
    } finally {
      setLoading(false);
    }
  };

  const handleVarietySelect = (variety) => {
    if (product.variety.length > 1) {
      setSelectedVariety(variety);
      dispatch(
        updateSelectedVariety({
          _id: product._id.$oid || product._id,
          selectedVariety: variety,
        })
      );
    }
  };

  const handelAddToCart = (product) => {
    // Check if the product has varieties
    if (product?.variety?.length > 0) {
      // If varieties exist, check if a variety has been selected
      if (!selectedVariety?.name) {
        toast.error("Please select a variety before adding to the cart");
        return;
      }
      // If a variety is selected, proceed to add to cart
      setLoading(true);
      const pd = { ...product, selectedVariety };
      dispatch(addToCartThunk(pd));
      setLoading(false);
    } else {
      // If no varieties exist, set selectedVariety to product name and price
      const defaultVariety = {
        name: product?.name,
        price: product.price,
      };
      setSelectedVariety(defaultVariety);
      setLoading(true);
      const pd = { ...product, selectedVariety: defaultVariety };
      dispatch(addToCartThunk(pd));
      setLoading(false);
    }
  };

  const handelbuyNow = () => {
    if (product?.variety?.length > 0) {
      // If varieties exist, check if a variety has been selected
      if (!selectedVariety?.name) {
        toast.error("Please select a variety before adding to the cart");
        return;
      }
      // If a variety is selected, proceed to add to cart
      setLoading(true);
      const pd = { ...product, selectedVariety };
      dispatch(addToCartThunk(pd));
      setLoading(false);
    } else {
      // If no varieties exist, set selectedVariety to product name and price
      const defaultVariety = {
        name: product.name,
        price: product.price,
      };
      setSelectedVariety(defaultVariety);
      setLoading(true);
      const pd = { ...product, selectedVariety: defaultVariety };
      dispatch(addToCartThunk(pd));
      setLoading(false);

      navigate("/checkout");
      // console.log(selectedVariety?.price);
    }
  };

  // Function to toggle the description visibility
  const toggleDescription = () => {
    setIsDescriptionExpanded((prev) => !prev);
  };

  // Handle swipe gestures
  const handleSwipe = (direction) => {
    const currentIndex = product?.imgLink?.indexOf(selectedImage);
    let newIndex;

    if (direction === "LEFT") {
      newIndex =
        currentIndex === product?.imgLink?.length - 1 ? 0 : currentIndex + 1;
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
        // setuser(fetchedUsers);
      } else {
        // console.log("No ratings available for this product.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${url}/api/v2/category/get-categories`);
      setCategories(res.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // 8 this function checks by pincode delivery available or not
  const checkDelivery = async () => {
    setPinLoading(true);
    try {
      const res = await axios.get(
        `${url}/api/v2/pincodes/get-pincode/${pincode}`
      );

      if (res.data.status) {
        setPinLoading(false);
        setDeliveryStatus(true);
      }
    } catch (error) {
      setPinLoading(false);
      setDeliveryStatus(false);
    }
  };

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered) {
        setCurrentIndex((prevIndex) => {
          const newIndex = (prevIndex + 1) % product?.imgLink?.length;
          setSelectedImage(product.imgLink[newIndex]);
          return newIndex;
        });
      }
    }, 2000); // Change image every second
    return () => clearInterval(interval); // Clean up the interval on unmount
  }, [product?.imgLink, isHovered]);

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
                <div
                  className="image-container"
                  {...swipeHandlers}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  onTouchStart={() => setIsHovered(true)}
                  onTouchEnd={() => setIsHovered(false)}
                >
                  {selectedImage && (
                    <img
                      src={selectedImage}
                      className="img-fluid main-image"
                      loading="lazy"
                    />
                  )}
                </div>
                  
                {/* Point Indicators */}  
                <div className="carousel-indicators">
                  {product?.imgLink && product.imgLink.map((_, index) => (
                    <button
                      key={index}
                      className={`indicator ${index === currentIndex ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedImage(product.imgLink[index]);
                        setCurrentIndex(index);
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="col-md-6 mb-4">
              <div className="p-4">
                {/* Add Pincode Input for Delivery Check */}

                {/* Product Title */}
                <h6 className="mb-3" style={{ fontSize: "1rem" }}>
                  {product?.name}
                </h6>

                {/* Price and Discount */}
                <p className="lead" style={{ fontSize: "1.10rem" }}>
                  <span className="text-decoration-line-through me-1 text-danger">
                    {new Intl.NumberFormat("en-IN").format(
                      product?.originalPrice
                    )}
                  </span>
                  <span>
                    ₹
                    {new Intl.NumberFormat("en-IN").format(
                      selectedVariety.price || product?.price
                    )}
                  </span>
                </p>

                {/* Product Varieties */}
                {product?.variety && product.variety.length > 0 ? (
                  <div className="mb-4 mt-4" style={{ fontSize: "1.10rem" }}>
                    <div className="d-flex flex-wrap gap-2">
                      {product.variety.map((variety, index) => (
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
                ) : (
                  <div className="mb-4 mt-4" style={{ fontSize: "0.9em" }}>
                    <h6 className="fw-bold">Selected Product:</h6>
                    <p>{product.name}</p>
                    <p>
                      Price: ₹
                      {new Intl.NumberFormat("en-IN").format(
                        selectedVariety.price || product.price
                      )}
                    </p>
                  </div>
                )}

                {/* Product Description */}
                <p
                  className={`product-description ${
                    isDescriptionExpanded ? "expanded" : ""
                  }`}
                >
                  {product.description}
                </p>

                {/* Description Toggle */}
                <button
                  className="btn btn-link p-0"
                  onClick={toggleDescription}
                >
                  {isDescriptionExpanded ? "Show Less" : "Show More"}
                </button>

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
                    {cartItems?.some((p) => p._id === product._id) ? (
                      <button
                        type="button"
                        className="btn btn-secondary mb-2 w-50"
                        onClick={() => navigate("/cart")}
                      >
                        GOTO CART
                      </button>
                    ) : (
                      <>
                        <button
                          className="btn btn-outline-primary mb-2 w-50"
                          onClick={() => handelAddToCart(product)}
                        >
                          {loading ? "Adding..." : "Add to Cart"}
                        </button>
                        <button
                          className="btn btn-primary w-50"
                          onClick={() => handelbuyNow(product)}
                        >
                          Buy Now
                        </button>
                        <div className="mt-3 d-flex align-items-center">
                          <input
                            type="text"
                            placeholder="Enter your pincode"
                            className="form-control me-2"
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value)}
                            style={{
                              borderRadius: "0.5rem",
                              padding: "0.5rem",
                            }}
                          />
                          <button
                            className="btn btn-light text-primary border border-primary"
                            style={{
                              borderRadius: "0.5rem",
                              padding: "0.5rem 1rem",
                            }}
                            onClick={() => {
                              // Logic to check delivery availability
                              checkDelivery();
                            }}
                          >
                            {pinLoading ? "Checking..." : "Check"}
                          </button>
                        </div>
                        <div className="mt-3">
                          <p className="mb-1" style={{ fontSize: "1rem" }}>
                            Delivery Status:{" "}
                            <span
                              className={`${
                                deliveryStatus ? "text-success" : "text-danger"
                              }`}
                              style={{ fontWeight: "bold", fontSize: "1.1rem" }}
                            >
                              {deliveryStatus ? "Available" : "Not Available"}
                            </span>
                          </p>
                          {deliveryStatus === false && (
                            <div
                              className="text-danger"
                              style={{ fontSize: "0.9rem" }}
                            >
                              We're sorry, but delivery is not available in your
                              area. You can submit a request to{" "}
                              <Link to={"/contact-us"}>reach us</Link>
                              (extra charges may apply). Please ensure to
                              include the product name in your request.
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Additional Information Section */}
              <div className="mb-3">
                <label className="form-label border-0">
                  Additional Description
                </label>
                <ul className="list-group border-0">
                  {product?.additionalDiscription &&
                  product?.additionalDiscription.length > 0 ? (
                    <>
                      {product.additionalDiscription
                        .slice(
                          0,
                          showAll ? product.additionalDiscription.length : 3
                        )
                        .map((item, index) => (
                          <li key={index} className="list-group-item border-0">
                            <strong>{item.header}:</strong> {item.body}
                          </li>
                        ))}
                      {product.additionalDiscription.length > 3 && !showAll && (
                        <button
                          className="btn btn-link"
                          onClick={() => setShowAll(true)}
                        >
                          Show More
                        </button>
                      )}
                      {showAll && (
                        <button
                          className="btn btn-link"
                          onClick={() => setShowAll(false)}
                        >
                          Show Less
                        </button>
                      )}
                    </>
                  ) : (
                    <li className="list-group-item">
                      No additional descriptions available.
                    </li>
                  )}
                </ul>
              </div>

              {/* Return Policy */}
              <div className="my-4" style={{ fontSize: "1rem" }}>
                <h5 className="mb-3" style={{ fontSize: "1rem" }}>
                  Return and Replacement Policy
                </h5>
                <div className="p-1  rounded d-flex align-items-start">
                  <div>
                    {product.returnDays === 0 ? (
                      <p className="mb-0" style={{ fontSize: "1rem" }}>
                        No Return Available
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

              {/* New Service Center Replacement Info */}
              {product?.serviceDays ? (
                <>
                  <div
                    className="my-4 p-3 border rounded bg-light d-flex flex-column align-items-start"
                    style={{ fontSize: "1rem" }}
                  >
                    <h5
                      className="mb-3 text-primary"
                      style={{ fontSize: "1.2rem" }}
                    >
                      Service Center Replacement Policy
                    </h5>
                    <p className="mb-0">
                      <strong>
                        {product?.serviceDays} days Service center replacement
                        available.
                      </strong>
                    </p>
                    <p className="text-muted">
                      Please ensure the item is in its original condition for a
                      smooth replacement process.
                    </p>
                  </div>
                </>
              ) : (
                <p></p>
              )}

              <div style={{ fontSize: "1rem" }}>
                <div className="p-1 d-flex align-items-center">
                  <div>
                    {product.replacementDays > 0 ? (
                      <>
                        <p className="mb-0" style={{ fontSize: "1rem" }}>
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

              <div>
                {/* Product Ratings */}
                <h5 className="mb-3 mt-4" style={{ fontSize: "1rem" }}>
                  Ratings:
                </h5>
                <ul className="list-group" style={{ fontSize: "1rem" }}>
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
                    <li className="list-group-item border-0">
                      Be the first one to use the product.
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ProductPage;
