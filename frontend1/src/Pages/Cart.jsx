import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CartProduct from "../Components/CartProduct";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Components/Loading/Loader";

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.cart);

  const events = useSelector((state) => state.cart.events);

  const labour = useSelector((state) => state.cart.labour);

  const [total, setTotal] = useState(0);

  const [loading, setloading] = useState(false);

  useEffect(() => {
    setTotal(
      cartItems.reduce((acc, curr) => acc + Number(curr.selectedVariety.price) * curr.qty, 0)
    );

  }, [cartItems]);

  useEffect(() => {
    setloading(true);
    setTimeout(() => {
      setloading(false);
    }, 1000);

    window.scrollTo(0, 0);
  }, []);



  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {/* <!-- cart + summary --> */}
      <section className="bg-light my-5">
        <div className="container">
          <div className="row">
            {/* <!-- cart --> */}
            <div className="col-lg-9">
              <div className="card border shadow-0">
                <div className="m-4 cart-products">
                  <h4 className="card-title mb-4">Your cart</h4>

                
                  {/* <!-- Whenever User adds the product that will show up here  --> */}

                  {cartItems.map((prod) => (
                    // passing element to CartProduct compnent
                    <CartProduct prod={prod} key={prod._id} />
                  ))}
                </div>

                <div className="border-top pt-4 mx-4 mb-4">
                  <p>
                    <i className="fas fa-truck text-muted fa-lg"></i> Free
                    Delivery within 1-2 weeks
                  </p>
                  <p className="text-muted">We deliver all over India</p>
                </div>
              </div>
            </div>

            {/* <!-- summary --> */}
            <div className="col-lg-3">
              <div className="card mb-3 border shadow-0">
                <div className="card-body">
                  <h5 className="card-title">Summary</h5>
                </div>
              </div>
              <div className="card shadow-0 border">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <p className="mb-2">Total price:</p>
                    <p className="mb-2">Rs.{total}</p>
                  </div>

                  {/* <div className="d-flex justify-content-between">
                    <p className="mb-2">Discount:</p>
                    <p className="mb-2 text-success">60.00</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p className="mb-2">TAX:</p>
                    <p className="mb-2">$14.00</p>
                  </div> */}

                  <hr />
                  <div className="d-flex justify-content-between">
                    <p className="mb-2">Total price:</p>
                    <p className="mb-2 fw-bold">Rs.{total}</p>
                  </div>

                  <div className="mt-3">
                    <Link
                      to={"/checkout"}
                      href="#"
                      className="btn btn-success w-100 shadow-0 mb-2"
                    >
                      {" "}
                      Make Purchase{" "}
                    </Link>
                    <Link
                      to={"/"}
                      href="#"
                      className="btn btn-light w-100 border mt-2"
                    >
                      {" "}
                      Back to shop{" "}
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-9">
              <div className="card border shadow-0">
                <div className="m-4 cart-products">
                  <h4 className="card-title mb-4">Your Events</h4>
                  <p>
                    Review your selected events below 
                  </p>

                  {/* <!-- Whenever User adds the product that will show up here  --> */}

                  {events.map((prod) => (
                    // passing element to CartProduct compnent
                    <CartProduct prod={prod} key={prod._id} />
                  ))}
                </div>
              </div>
            </div>



            <div className="col-lg-9">
              <div className="card border shadow-0">
                <div className="m-4 cart-products">
                  <h4 className="card-title mb-4">Urban Service</h4>
                  <p>
                    Review your selected urban services below
                  </p>

                  {/* <!-- Whenever User adds the product that will show up here  --> */}

                  {labour.map((prod) => (
                    // passing element to CartProduct compnent
                    <CartProduct prod={prod} key={prod._id} />
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default Cart;
