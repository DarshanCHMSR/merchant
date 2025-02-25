import React from "react";

const CheckoutProduct = ({prod}) => {
  return (
    <>
      <ul className="list-group mb-3">
        <li className="list-group-item d-flex justify-content-between">
          <img src={prod?.imgLink[0]} alt="" loading="lazy" style={{
            width: "100px",
            height: "100px",
            objectFit: "contain",
            margin: "auto",
            borderRadius: "10px",
            padding: "10px",
          }}/>
          <div>
            <h6 className="my-0">{prod.name}</h6>
            <p>Selected Product: {prod.selectedVariety.name}</p>
          </div>
        </li>
      </ul>
    </>
  );
};

export default CheckoutProduct;
