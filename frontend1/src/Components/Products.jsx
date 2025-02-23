import React, { useContext, useEffect, useState } from "react";
// I am importing these because i have to call here because i have merged all three sections
import { New_Products } from "./New_Products";
import Feature from "../Components/Feature";
import SingleProduct from "./SingleProduct";
import axios from "axios";
import { url } from "./backend_link/data";
import Loader_2 from "./Loading/Loader_2";

const Products = ({ recItems }) => {
  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${url}/api/v2/products/section-one`);

      setItems(res.data);
      setLoading(false);

    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader_2 />;
  }

  return (
    <>
      {/* ! So there two parts of products are in home page so we are passing another list to new-products section
    after backend implemention we are going to fetch from backend */}

      <New_Products products={items} />

      <Feature />

      <section>
        <div className="container my-5">
          <header className="mb-4">
            <h3>Recommended</h3>
          </header>

          <div className="row rec-products">
            {recItems.map((item) => {
              return <SingleProduct item={item} key={item._id} />;
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default Products;
