import React, { useEffect } from "react";
import Lottie from "lottie-react";
import Order from "../assets/Order.json";
import { Link } from "react-router-dom";
import { addToOrder, clearBuy } from "../State/cart_actions";
import { useDispatch, useSelector } from "react-redux";


const OrderConfirmed = () => {
  const dispatch = useDispatch();

  const buyPd = useSelector((state) => state.cart.buy);
  

  useEffect(() => {

    // dispatch(addToOrder(buyPd)) 
    dispatch(clearBuy())

    window.scrollTo(0, 0);


  }, [])
  
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Lottie
          animationData={Order}
          style={{
            height: "30vw",
            width: "40vh",
          }}
        />
        <h1>Order Placed</h1>
      </div>

      <div style={
        {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",   
        }
      }>
        <Link to={"/"} href="#" className="btn btn-primary w-20 h-20 border mb-4">
          {" "}
          Back to shop{" "}
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmed;
