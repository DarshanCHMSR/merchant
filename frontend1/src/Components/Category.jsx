import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { url } from "./backend_link/data";
import axios from "axios";
import Loader_2 from "./Loading/Loader_2";

const Category = () => {
  const [Category, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${url}/api/v2/category/get-categories`);
      setCategory(res.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader_2 />;
  }

  const getLink = (categoryName,id) => {

    if (categoryName === "Book Ride") {
      return "/book-ride";
    } else if (categoryName === "Schedule Event") {
      return "/event";
    } 
    else if(categoryName === "Urban Services")
      {
        return "/urban-services";
      }
      else {
      return `/category-products/${id}`;
    }
  };

  return (
    <section className="mt-5">
      <div className="container">
        <nav className="row gx-2 gy-2">
          {Category.map((category, index) => (
            <div className="col-6 col-lg-2 mb-3" key={index}>
              <Link
                to={`${getLink(category.name,category._id)}`}
                className="text-center d-flex flex-column justify-content-center align-items-center"
                style={{ textDecoration: "none" }}
                onClick={() => setSelectedCategory(category.name)}
              >
                <div className="category-icon-container mb-1">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="img-fluid"
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                  />
                </div>
                <div
                  className="text-dark mt-1 card-text"
                  style={{ fontSize: "0.8rem" }}
                >
                  {category.name}
                </div>
              </Link>
            </div>
          ))}
        </nav>
      </div>
    </section>
  );
};

export default Category;
