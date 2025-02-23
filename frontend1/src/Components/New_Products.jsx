import React from "react";
import SingleProduct from "./SingleProduct";

export const New_Products = ({products}) => {
  return (
    <>
    <section>
<div className="container my-5 ">
      <header className="mb-4">
        <h3>New Products</h3>
      </header>

      <div className="row rec-products products">
      {products.map((item) => {
            return (
              <SingleProduct item = {item} key ={item._id} />
            );
          })}

      </div>
    </div>
</section>
    </>
  );
}


// export default New_Products;