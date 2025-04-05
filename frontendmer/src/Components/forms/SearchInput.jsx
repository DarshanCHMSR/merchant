import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSearchResults,
  setKeyword,
} from "../../State/search_action";
import { useNavigate } from "react-router-dom";

import { InstantSearch, SearchBox, Hits } from "react-instantsearch-dom";
import algoliasearch from "algoliasearch/lite";

import "./searchInput.css";

// Component to display each search result
const Hit = ({ hit, onClick }) => {
  return (
    <div className="search-hit" onClick={onClick}>
      <div className="hit-content">
        <img src={hit.imgLink[0]} alt={hit.name} className="hit-image" />
        <h4>{hit.name}</h4>
      </div>
    </div>
  );
};

const SearchInput = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const keyword = useSelector((state) => state.search.keyword);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Algolia Search configuration
  const searchClient = algoliasearch(
    "L1UT1IX81B",
    import.meta.env.VITE_ALGOLIA_SEARCH_KEY
  );

  const handleInputChange = (e) => {
    dispatch(setKeyword(e.target.value)); // Update keyword in the store
  };

  useEffect(() => {
    setShowSuggestions(!!keyword); // Show suggestions when there's input
  }, [keyword]);

  // Handle search form submission (redirect to the results page)
  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    if (keyword.trim()) {
      dispatch(fetchSearchResults(keyword)); // Optionally dispatch search action
      navigate(`/search?keyword=${keyword}`); // Redirect to search results page
      setShowSuggestions(false); // Close suggestions
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (hit) => {
    // dispatch(fetchSearchResults(hit.name)); // Optionally dispatch search action
    console.log(hit._id.$oid);


    let id = hit._id.$oid
    navigate(`/product/${id}`); // Redirect to the product page
    setShowSuggestions(false); // Close suggestions
  };

  return (
    <div className="search-container">
      <InstantSearch
        searchClient={searchClient}
        indexName="Valuekarts.products"
      >
        <form onSubmit={handleSearchSubmit} className="search-form">
          <SearchBox
            translations={{ placeholder: "Search for products..." }}
            onChange={handleInputChange} // Update the search keyword when typing
            value={keyword}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault(); // Prevent default form submission
                handleSearchSubmit(e); // Call the search submit handler
              }
            }}
          />
        </form>

        {/* Show suggestions only if there's a keyword */}
        {showSuggestions && keyword && (
          <div className="suggestion-list">
            <Hits 
              hitComponent={({ hit }) => (
                <Hit 
                  hit={hit} 
                  onClick={() => handleSuggestionClick(hit)} // Handle suggestion click
                />
              )}
            />
          </div>
        )}
      </InstantSearch>
    </div>
  );
};

export default SearchInput;
