import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminSearchFrom = () => {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();


  const handelSubmit = async (e) => {
    e.preventDefault();

   navigate(`/dashboard/admin/search-products/${searchValue}`);
  };

  return (
    <>
      <form
        className="d-none d-md-flex input-group w-auto my-autor border rounded-pill overflow-hidden"
        onSubmit={handelSubmit}
      >
        <input
          autoComplete="off"
          type="search"
          className="form-control border-0"
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          style={{ minWidth: 225 }}
        />
        <span className="input-group-text border-0">
          <i className="fas fa-search" />
        </span>
      </form>
    </>
  );
};

export default AdminSearchFrom;
