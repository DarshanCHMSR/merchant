// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { Link } from "react-router-dom";
// // import Loader from "../Components/Loading/Loader";

// import Loader from '../Components/Loading/Loader';
// import SingleProduct from "../Components/SingleProduct";
// import Backbutton from "../Components/Backbutton";

// const SearchPage = () => {
//   const results = useSelector((state) => state.search.results.results);
//   const status = useSelector((state) => state.search.status);
//   const error = useSelector((state) => state.search.error);

//   const cartItems = useSelector((state) => state.cart.cart);
//   const [loading, setLoading] = useState(false)

//   useEffect(() => {
//     setLoading(true)

//     setTimeout(() => {
//       setLoading(false)
//     }, 1000)

//   }, [])

//   if (loading) {
//     return <>
//         <Loader/>
//     </>;
//   }

//   if (status === "failed") {
//     return <div>Error: {error}</div>;
//   }

//   console.log(results)

//   return (
//     <div>
//       <div className="container my-5">
//       <Backbutton path = {'/'} />
//         <h2 className="text-center mb-4 mt-4">Search Results</h2>
//         {results.length === 0 ? (
//           <div>No results found.</div>
//         ) : (
//           <div className="row rec-products products">
//             {results?.map((product) => (
//               <>
//                 <SingleProduct item={product} key = {product._id} />
//               </>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SearchPage;

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { InstantSearch, SearchBox, Hits } from "react-instantsearch-dom";
import algoliasearch from "algoliasearch";

import Loader from "../Components/Loading/Loader";
import SingleProduct from "../Components/SingleProduct";
import Backbutton from "../Components/Backbutton";

// Algolia Client Initialization
const searchClient = algoliasearch(
  import.meta.env.VITE_ALGOLIA_APP_ID, // Replace with your Algolia Application ID
  import.meta.env.VITE_ALGOLIA_SEARCH_KEY // Replace with your Algolia Search-Only API Key
);

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get the keyword from the URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get("keyword");

  // console.log("The search keyword: ", keyword);

  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (!keyword) return; // Don't proceed if no keyword is provided.

    setLoading(true);
    setTimeout(() => {
      // Set your logic to fetch the search results from Algolia
      searchClient
        .initIndex("Valuekarts.products") // The index name in your Algolia setup (replace 'products' with your index name)
        .search(keyword)
        .then(({ hits }) => {
          setSearchResults(hits);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }, 1000); // Simulate loading time
  }, [keyword]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <div className="container my-5">
        <Backbutton path={"/"} />
        <h2 className="text-center mb-4 mt-4">Search Results</h2>
        {searchResults.length === 0 ? (
          <div>No results found.</div>
        ) : (
          <div className="row rec-products products">
            {searchResults?.map((product) => (
              <>
                <SingleProduct item={product} key={product._id} />
              </>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
