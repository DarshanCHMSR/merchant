import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSearchResults, setKeyword, fetchAutocompleteSuggestions } from "../../State/search_action";
import { useNavigate } from "react-router-dom";
import './searchInput.css'

const SearchInput = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const keyword = useSelector((state) => state.search.keyword);
  const suggestions = useSelector((state) => state.search.suggestions); // Assuming you have a reducer for suggestions
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (keyword) {
      dispatch(fetchAutocompleteSuggestions(keyword));  
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [keyword, dispatch]);

  const handleInput = (e) => {
    e.preventDefault();
    dispatch(fetchSearchResults(keyword));
    setShowSuggestions(false); // Hide suggestions after search
    navigate('/search');
  };

  const handleSuggestionClick = (suggestion) => {
    dispatch(setKeyword(suggestion));
    dispatch(fetchSearchResults(suggestion));
    setShowSuggestions(false);
    navigate('/search');
  };

  return (
    <>
      <div className="col-lg-5 col-md-12 col-12 position-relative">
        <div className="input-group float-center border rounded-pill" style={{ border: "none" }}>
          <form onSubmit={handleInput} className="form-outline">
            <input
              type="search"
              id="floatingInput"
              className="form-control w-100 shadow-0 rounded-pill"
              aria-label="Search"
              value={keyword}
              onChange={(e) => dispatch(setKeyword(e.target.value))}
              placeholder="Search for products..."
            />
          </form>
          <button type="submit" className="btn btn-primary shadow-0 rounded-pill">
            <i className="fas fa-search"></i>
          </button>
        </div>
        {showSuggestions && suggestions.length > 0 && (
          <ul className="list-group position-absolute suggestion-list ">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="list-group-item suggestion-item p-2 shadow-0 w-100 rounded-pill"
                onClick={() => handleSuggestionClick(suggestion)}
                title={suggestion} // Show full name on hover

              >
                {suggestion.length > 30 ? suggestion.slice(0, 27) + '...' : suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default SearchInput;
