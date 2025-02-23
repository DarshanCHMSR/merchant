import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
// import Loader from "../Components/Loading/Loader";

import Loader from '../Components/Loading/Loader';
import SingleProduct from "../Components/SingleProduct";
import Backbutton from "../Components/Backbutton";


const SearchPage = () => {
  const results = useSelector((state) => state.search.results);
  const status = useSelector((state) => state.search.status);
  const error = useSelector((state) => state.search.error);

  const cartItems = useSelector((state) => state.cart.cart);
  const [loading, setLoading] = useState(false)

  
  useEffect(() => {
    setLoading(true)
    
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  
  }, [])
  

  if (loading) {
    return <>
        <Loader/>
    </>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }


  console.log(results)

  return (
    <div>
      <div className="container my-5">
      <Backbutton path = {'/'} />
        <h2 className="text-center mb-4 mt-4">Search Results</h2>
        {results.length === 0 ? (
          <div>No results found.</div>
        ) : (
          <div className="row rec-products products">
            {results.map((product) => (
              <>
                <SingleProduct item={product} key = {product._id} />
              </>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
